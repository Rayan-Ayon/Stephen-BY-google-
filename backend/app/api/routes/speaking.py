import os
import json
import asyncio
import logging
import tempfile
import time
import wave
from fastapi import APIRouter, HTTPException, Depends, File, Form, UploadFile, WebSocket, WebSocketDisconnect, Query
from google import genai
from google.genai import errors as genai_errors, types
from app.schemas.speaking import SpeakingEvaluationResponse
from app.services.llm_service import get_client
from app.services.supabase_service import get_supabase
from app.core.auth import get_current_user, decode_supabase_jwt, AuthUser
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL, GEMINI_LIVE_MODEL

logger = logging.getLogger(__name__)
router = APIRouter()

# ---------------------------------------------------------------------------
# System instructions
# ---------------------------------------------------------------------------

SPEAKING_EVAL_SYSTEM_INSTRUCTION = """You are an expert IELTS examiner with 20 years of experience grading speaking tests. You evaluate spoken responses strictly against official IELTS band descriptors for Speaking.

You will receive a full transcript of a candidate's IELTS Speaking session. Read the transcript carefully and evaluate:

1. Fluency & Coherence — smooth delivery, logical sequencing, topic development
2. Lexical Resource — vocabulary range, advanced words, accuracy
3. Grammatical Range & Accuracy — sentence complexity, error frequency
4. Pronunciation — (infer from transcript: hesitation patterns, self-corrections, sentence rhythm)

CRITICAL RULES:
- ALL band scores MUST be rounded to the nearest 0.5 (e.g., 4.0, 4.5, 5.0, ..., 8.5, 9.0).
- Provide the full transcript as-is from what was provided.
- Give specific proof items with the question asked, what the user answered, a rating, and feedback.
- For strengths and improvements, give 3 specific, actionable points based on the actual responses.
- If the transcript is empty or unintelligible, return low scores with explanation.

You MUST return valid JSON matching the exact schema provided. No markdown, no code fences."""

SPEAKING_LIVE_INSTRUCTION = """You are Mohana, an encouraging and authentic IELTS Speaking examiner. You are conducting a live IELTS Speaking test with a candidate.

ROLE:
- You conduct an IELTS Speaking test with the candidate
- You speak naturally, warmly, and professionally
- You adapt your questions based on the candidate's responses

CONVERSATION FLOW:
- You ask questions appropriate to the IELTS Speaking part being tested
- Part 1: Ask 4-5 general questions about familiar topics (hometown, work, daily routine, hobbies, weather)
- Part 2: Present a cue card topic, give the candidate 1 minute to prepare, then ask them to speak for up to 2 minutes
- Part 3: Ask 3-4 abstract discussion questions related to the Part 2 topic
- Listen to each answer, then naturally move to the next question
- Use natural transitions: "Thank you", "I see", "That's interesting", then the next question

RULES:
- Keep each question concise (1-2 sentences max)
- Never evaluate the candidate during the conversation — just ask questions naturally
- If the candidate gives a very short answer (under 10 words), ask a gentle follow-up
- Respond with warmth and encouragement before moving to the next question
- If the candidate seems to have finished speaking, acknowledge and move on
- Do NOT give band scores or feedback during the conversation
- Do NOT say "band score" or "evaluation" during the session

SPEECH STYLE:
- Speak clearly and at a moderate pace
- Use natural conversational English
- Be warm and encouraging, like a real IELTS examiner
- Use occasional fillers like "Right", "Okay", "Now" to transition between questions"""


# ---------------------------------------------------------------------------
# WebSocket endpoint — Gemini Live API session
# ---------------------------------------------------------------------------

FALLBACK_LIVE_MODELS = [
    GEMINI_LIVE_MODEL,                                  # Primary Live Model
    "gemini-3.0-flash",                                 # Safe Fallback
]

IDLE_TIMEOUT_SECONDS = 180   # 3 minutes
HEARTBEAT_INTERVAL_SECONDS = 30


@router.websocket("/ielts/ws/speaking-session")
async def speaking_session_ws(
    websocket: WebSocket,
    token: str = Query(...),
    part: int = Query(1),
    topic: str = Query(""),
):
    """
    WebSocket gateway for real-time IELTS Speaking sessions via Gemini Live API.
    """
    # ── Authenticate ──────────────────────────────────────────────────────
    try:
        if token and token not in ("test", "anonymous", "dev"):
            payload = decode_supabase_jwt(token)
            user_id = payload.get("sub") or "dev_user"
            email = payload.get("email") or "dev@stephen.ai"
        else:
            user_id = "dev_user"
            email = "dev@stephen.ai"
        user = AuthUser(user_id=user_id, email=email)
    except Exception as e:
        logger.warning(f"WebSocket auth bypass for dev mode: {e}")
        user = AuthUser(user_id="dev_user", email="dev@stephen.ai")

    await websocket.accept()
    logger.info(f"WS speaking session opened: user={user.user_id}, part={part}, topic={topic}")

    if not GEMINI_API_KEY:
        await websocket.send_json({"type": "error", "error": "GEMINI_API_KEY not configured"})
        await websocket.close(code=1011, reason="Server config error")
        return

    # ── Gemini Live session ───────────────────────────────────────────────
    client = genai.Client(api_key=GEMINI_API_KEY)

    # Transcript accumulator
    transcript_parts: list[dict] = []

    # Last client activity timestamp (for idle timeout)
    last_activity = time.time()

    config = types.LiveConnectConfig(
        response_modalities=[types.Modality.AUDIO],
        system_instruction=types.Content(parts=[types.Part(text=SPEAKING_LIVE_INSTRUCTION)]),
        input_audio_transcription=types.AudioTranscriptionConfig(),
        output_audio_transcription=types.AudioTranscriptionConfig(),
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Puck")
            )
        ),
    )

    # Initialize debug WAV recorder for audio verification
    debug_wav = wave.open("debug_gemini_audio.wav", "wb")
    debug_wav.setnchannels(1)
    debug_wav.setsampwidth(2)
    debug_wav.setframerate(16000)

    # ── Model fallback loop ───────────────────────────────────────────
    session_opened = False
    active_model = None
    last_connect_error = None

    for model_name in FALLBACK_LIVE_MODELS:
        try:
            async with client.aio.live.connect(model=model_name, config=config) as session:
                active_model = model_name
                session_opened = True
                logger.info(f"Gemini Live session opened: model={active_model}")

                # ── Send initial greeting ─────────────────────────────
                part_label = {1: "Part 1", 2: "Part 2", 3: "Part 3"}.get(part, "Part 1")
                greeting = (
                    f"Hello! Welcome to your IELTS Speaking {part_label} test. "
                    f"Let's begin. {topic}" if topic else
                    f"Hello! Welcome to your IELTS Speaking {part_label} test. "
                    f"Let's begin with some questions."
                )
                await session.send_realtime_input(text=greeting)

                # ── Browser → Gemini ──────────────────────────────────
                async def forward_browser_to_gemini():
                    nonlocal last_activity
                    try:
                        while True:
                            msg = await websocket.receive()
                            last_activity = time.time()

                            # Clean exit when browser closes or sends disconnect
                            msg_type = msg.get("type", "")
                            if msg_type == "websocket.disconnect":
                                logger.info("Browser disconnected (websocket.disconnect received)")
                                break

                            if msg.get("bytes"):
                                audio_bytes = msg["bytes"]
                                try:
                                    debug_wav.writeframes(audio_bytes)
                                except Exception as wav_err:
                                    logger.warning(f"Error writing to debug_wav: {wav_err}")

                                # Check for dead silence on the backend
                                is_silent = all(b == 0 for b in audio_bytes)
                                logger.info(f"Backend received {len(audio_bytes)} bytes. Is completely silent? {is_silent}")

                                try:
                                    await session.send_realtime_input(
                                        audio=types.Blob(
                                            data=audio_bytes,
                                            mime_type="audio/pcm;rate=16000",
                                        )
                                    )
                                except Exception as sdk_err:
                                    logger.error(f"GEMINI SDK ERROR ON AUDIO SEND: {sdk_err}")
                            elif msg.get("text"):
                                try:
                                    data = json.loads(msg["text"])
                                    if isinstance(data, dict):
                                        if data.get("type") == "text":
                                            await session.send_realtime_input(text=data["text"])
                                        elif data.get("type") == "start":
                                            pass  # greeting already sent above
                                        elif data.get("type") == "pong":
                                            pass  # heartbeat acknowledged
                                except json.JSONDecodeError:
                                    pass
                    except (WebSocketDisconnect, RuntimeError, asyncio.CancelledError):
                        logger.info("Browser→Gemini stream task closed cleanly")
                    except Exception as e:
                        logger.error(f"Browser→Gemini error: {e}")

                # ── Gemini → Browser ──────────────────────────────────
                async def forward_gemini_to_browser():
                    try:
                        async for response in session.receive():
                            sc = response.server_content
                            if not sc:
                                continue

                            # Forward audio chunks to browser
                            if sc.model_turn:
                                for part_item in sc.model_turn.parts:
                                    if part_item.inline_data:
                                        audio_bytes = part_item.inline_data.data
                                        await websocket.send_bytes(audio_bytes)

                            # Input transcription (user speech → text)
                            if sc.input_transcription and sc.input_transcription.text:
                                text = sc.input_transcription.text.strip()
                                if text:
                                    transcript_parts.append({"role": "user", "text": text})
                                    await websocket.send_json({
                                        "type": "user_transcript",
                                        "text": text,
                                    })

                            # Output transcription (Gemini speech → text)
                            if sc.output_transcription and sc.output_transcription.text:
                                text = sc.output_transcription.text.strip()
                                if text:
                                    transcript_parts.append({"role": "gemini", "text": text})
                                    await websocket.send_json({
                                        "type": "gemini_transcript",
                                        "text": text,
                                    })

                            # Turn complete
                            if sc.turn_complete:
                                await websocket.send_json({"type": "turn_complete"})

                            # Barge-in / interruption
                            if sc.interrupted:
                                await websocket.send_json({"type": "interrupted"})

                    except (WebSocketDisconnect, RuntimeError, asyncio.CancelledError):
                        logger.info("Gemini→Browser stream task closed cleanly")
                    except Exception as e:
                        logger.error(f"Gemini→Browser error: {e}")

                # ── Heartbeat: ping every 30s ─────────────────────────
                async def heartbeat():
                    try:
                        while True:
                            await asyncio.sleep(HEARTBEAT_INTERVAL_SECONDS)
                            try:
                                await websocket.send_json({"type": "ping"})
                            except Exception:
                                logger.info("Heartbeat failed — client socket dead")
                                break
                    except asyncio.CancelledError:
                        pass

                # ── Idle watchdog: close after 3 min of no input ───────
                async def idle_watchdog():
                    try:
                        while True:
                            await asyncio.sleep(30)
                            idle_time = time.time() - last_activity
                            if idle_time > IDLE_TIMEOUT_SECONDS:
                                logger.info(f"Session idle for {idle_time:.0f}s — closing")
                                full_transcript = "\n".join(
                                    f"{'Examiner' if p['role'] == 'gemini' else 'Candidate'}: {p['text']}"
                                    for p in transcript_parts
                                )
                                try:
                                    await websocket.send_json({
                                        "type": "session_ended",
                                        "transcript": full_transcript,
                                        "turns": transcript_parts,
                                        "reason": "idle_timeout",
                                    })
                                    await websocket.close(code=1000, reason="Idle timeout")
                                except Exception:
                                    pass
                                break
                    except asyncio.CancelledError:
                        pass

                # ── Run all tasks concurrently ────────────────────────
                send_task = asyncio.create_task(forward_browser_to_gemini())
                recv_task = asyncio.create_task(forward_gemini_to_browser())
                heartbeat_task = asyncio.create_task(heartbeat())
                idle_task = asyncio.create_task(idle_watchdog())

                try:
                    await asyncio.gather(send_task, recv_task)
                except WebSocketDisconnect:
                    logger.info("WS speaking session disconnected by client")
                finally:
                    send_task.cancel()
                    recv_task.cancel()
                    heartbeat_task.cancel()
                    idle_task.cancel()

                    try:
                        debug_wav.close()
                        logger.info("Saved debug audio file to debug_gemini_audio.wav")
                    except Exception:
                        pass

                    # Send final transcript back to client
                    full_transcript = "\n".join(
                        f"{'Examiner' if p['role'] == 'gemini' else 'Candidate'}: {p['text']}"
                        for p in transcript_parts
                    )
                    try:
                        await websocket.send_json({
                            "type": "session_ended",
                            "transcript": full_transcript,
                            "turns": transcript_parts,
                        })
                    except Exception:
                        pass

                break  # normal exit — no need to try fallback models

        except (WebSocketDisconnect, asyncio.CancelledError):
            # Client disconnected during connect — no fallback needed
            break
        except Exception as e:
            last_connect_error = e
            logger.warning(f"Gemini Live model {model_name} failed: {e}")
            continue

    if not session_opened:
        error_msg = f"All Gemini Live models unavailable: {last_connect_error}"
        logger.error(error_msg)
        try:
            await websocket.send_json({"type": "error", "error": error_msg})
            await websocket.close(code=1011, reason="Model fallback exhausted")
        except Exception:
            pass

    logger.info("WS speaking session closed")


# ---------------------------------------------------------------------------
# POST endpoint — post-call evaluation (file OR transcript)
# ---------------------------------------------------------------------------

@router.post("/ielts/evaluate-speaking")
async def evaluate_speaking(
    question_prompt: str = Form(""),
    submission_id: str | None = Form(None),
    transcript: str | None = Form(None),
    part: int | None = Form(None),
    topic: str | None = Form(None),
    file: UploadFile | None = File(None),
    user: AuthUser = Depends(get_current_user),
) -> SpeakingEvaluationResponse:
    """
    Evaluate an IELTS Speaking session with exponential backoff for 503 errors.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    tmp_path = None
    try:
        client = get_client()
        
        eval_models = [GEMINI_MODEL, "gemini-3.5-flash", "gemini-3.1-flash-lite"]
        response = None
        last_error = None

        if transcript:
            prompt = f"""Evaluate this IELTS Speaking session based on the following transcript.

Part: {'Part ' + str(part) if part else 'Not specified'}
Topic: {topic or 'General'}

TRANSCRIPT:
{transcript}

Provide a detailed evaluation following the official IELTS Speaking band descriptors. Return your evaluation as JSON matching the exact schema."""

            for model_name in eval_models:
                try:
                    logger.info(f"Attempting transcript evaluation with model {model_name}")
                    response = await client.aio.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=SPEAKING_EVAL_SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            response_schema=SpeakingEvaluationResponse,
                        ),
                    )
                    if response and response.text:
                        logger.info(f"Evaluation succeeded with model {model_name}")
                        break
                except Exception as e:
                    last_error = e
                    logger.warning(f"Model {model_name} evaluation failed: {e}")

        elif file:
            suffix = ".webm"
            if file.filename and "." in file.filename:
                suffix = "." + file.filename.rsplit(".", 1)[-1]
            elif file.content_type and "/" in file.content_type:
                ext = file.content_type.split("/")[-1]
                if ext != "octet-stream":
                    suffix = f".{ext}"

            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                content = await file.read()
                tmp.write(content)
                tmp_path = tmp.name

            logger.info(f"Uploaded audio: {file.content_type}, {len(content)} bytes")

            uploaded_file = client.files.upload(file=tmp_path)
            logger.info(f"Gemini file uploaded: {uploaded_file.name}")

            prompt = f"""Evaluate this IELTS Speaking response.

Question asked to the candidate:
{question_prompt}

Listen to the audio recording and provide a detailed evaluation following the official IELTS Speaking band descriptors. Return your evaluation as JSON matching the exact schema."""

            for attempt in range(max_retries):
                try:
                    logger.info(f"Attempting audio evaluation with model {eval_model} (Attempt {attempt + 1}/{max_retries})")
                    response = await client.aio.models.generate_content(
                        model=eval_model,
                        contents=[
                            types.Part.from_uri(file_uri=uploaded_file.uri, mime_type=uploaded_file.mime_type),
                            prompt,
                        ],
                        config=types.GenerateContentConfig(
                            system_instruction=SPEAKING_EVAL_SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            response_schema=SpeakingEvaluationResponse,
                        ),
                    )
                    if response and response.text:
                        logger.info(f"Audio evaluation succeeded on attempt {attempt + 1}")
                        break
                except Exception as e:
                    last_error = e
                    logger.warning(f"Attempt {attempt + 1} failed: {e}")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(2 ** attempt)

        else:
            raise HTTPException(status_code=400, detail="Either 'file' or 'transcript' must be provided")

        if not response or not response.text:
            logger.error(f"Evaluation failed after {max_retries} retries. Last error: {last_error}")
            raise HTTPException(
                status_code=503,
                detail="Evaluation service unavailable due to high AI server demand. Please try again later."
            )

        raw_text = response.text
        logger.info(f"Gemini speaking response: {raw_text[:300]}...")

        try:
            data = json.loads(raw_text) if isinstance(raw_text, str) else raw_text
        except json.JSONDecodeError:
            data = json.loads(raw_text)

        result = SpeakingEvaluationResponse(**data)

        # Round all band scores to 0.5
        result.overallBand = _round_to_half(result.overallBand)
        result.fluency.score = _round_to_half(result.fluency.score)
        result.lexical.score = _round_to_half(result.lexical.score)
        result.grammar.score = _round_to_half(result.grammar.score)
        result.pronunciation.score = _round_to_half(result.pronunciation.score)

        # Persist to Supabase
        if submission_id:
            try:
                db = get_supabase()
                db.table("speaking_submissions").insert({
                    "submission_id": submission_id,
                    "user_id": user.user_id,
                    "user_email": user.email,
                    "question_prompt": question_prompt or (transcript[:500] if transcript else ""),
                    "overall_band": result.overallBand,
                    "fluency_score": result.fluency.score,
                    "lexical_score": result.lexical.score,
                    "grammar_score": result.grammar.score,
                    "pronunciation_score": result.pronunciation.score,
                    "transcript": result.transcript,
                    "raw_json_feedback": data,
                }).execute()

                db.table("user_submissions").update({
                    "overall_band": result.overallBand,
                }).eq("id", submission_id).execute()

                logger.info(f"Persisted speaking evaluation for submission {submission_id}")
            except Exception as e:
                logger.warning(f"Failed to persist speaking evaluation: {e}")

        return result

    except HTTPException:
        raise
    except genai_errors.APIError as e:
        message = getattr(e, "message", None) or str(e)
        logger.error(f"Gemini API error (speaking): {message}", exc_info=True)
        raise HTTPException(status_code=503, detail=f"Evaluation service unavailable: {message}")
    except Exception as e:
        logger.error(f"Speaking evaluation failed: {type(e).__name__}: {e}", exc_info=True)
        raise HTTPException(status_code=503, detail="Evaluation service unavailable. Please try again.")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass


def _round_to_half(value: float) -> float:
    return round(value * 2) / 2
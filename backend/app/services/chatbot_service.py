import json
import logging
import time
import uuid
from datetime import datetime
from typing import List, Optional, Tuple
from sqlalchemy import select, delete, desc
from sqlalchemy.ext.asyncio import AsyncSession
from google import genai
from google.genai import types

from app.core.config import GEMINI_MODEL
from app.db.models import IELTSAdvisorConversation
from app.schemas.chatbot import ChatMessage
from app.services.llm_service import get_client
from app.services.ai_client import get_ai_response

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are the Official IELTS & Study Abroad AI Advisor. Your primary purpose is to help users with:
1. IELTS Exam Preparation (Reading, Listening, Writing, Speaking strategies, band descriptors, study plans, test formats).
2. University Admissions & Study Abroad Guidance (requirements, application steps, visa processes, scholarships, country-specific guidelines).
3. English Proficiency & Score Improvement.

STRICT GUARDRAILS & BOUNDARIES:
- If a user asks a query related to IELTS, English proficiency, university admissions, study abroad, visas, scholarships, or academic guidance, provide a helpful, structured, and encouraging response.
- If a user asks an OFF-TOPIC query (e.g., coding, general trivia, recipes, sports, casual jokes, non-academic topics), you MUST decline gracefully with the following standard response or a slight variation:
"I am specifically designed to assist you with IELTS preparation, study abroad guidance, and university admissions. Please ask me any questions related to these topics!"
"""

STANDARD_REFUSAL = (
    "I am specifically designed to assist you with IELTS preparation, "
    "study abroad guidance, and university admissions. Please ask me any questions related to these topics!"
)


def _build_gemini_contents(
    history: Optional[List[ChatMessage]],
    current_message: str
) -> List[types.Content]:
    """Convert conversation history and current prompt into google-genai Content structures."""
    contents: List[types.Content] = []
    
    if history:
        # Take the most recent 12 messages for relevant context
        for msg in history[-12:]:
            role = "model" if msg.role in ("model", "assistant") else "user"
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=msg.content)]
                )
            )

    contents.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=current_message)]
        )
    )
    return contents


def _build_openrouter_messages(
    history: Optional[List[ChatMessage]],
    current_message: str,
    system_prompt: str = SYSTEM_PROMPT,
) -> List[dict]:
    """Build messages array for OpenRouter fallback."""
    messages = [{"role": "system", "content": system_prompt}]
    if history:
        for msg in history[-12:]:
            role = "assistant" if msg.role in ("model", "assistant") else "user"
            messages.append({"role": role, "content": msg.content})
    messages.append({"role": "user", "content": current_message})
    return messages


def format_speaking_transcripts_for_prompt(speaking_list: List[dict]) -> str:
    if not speaking_list:
        return "No recent speaking sessions recorded."
    lines = []
    for s in speaking_list[:3]:
        sid = s.get("id") or s.get("submission_id", "unknown")
        band = s.get("overall_band", "N/A")
        transcript = s.get("transcript", "")
        feedback = s.get("raw_json_feedback") or {}
        details = []
        if isinstance(feedback, dict) and "questions" in feedback:
            for q in feedback.get("questions", [])[:3]:
                q_prompt = q.get("prompt", "")
                q_tx = q.get("transcriptText", "")
                slips = [t.get("text") for t in q.get("diagnosticTokens", []) if t.get("type") in ("grammar", "filler")]
                details.append(f"  * Q: {q_prompt}\n    Candidate verbatim: \"{q_tx[:200]}\"\n    Slips/Fillers: {', '.join(slips[:5]) if slips else 'None'}")
        elif transcript:
            details.append(f"  * Candidate verbatim: \"{transcript[:300]}\"")
        lines.append(f"- Speaking Session [Attempt ID: {sid}] (Band: {band}):\n" + "\n".join(details))
    return "\n".join(lines)


def format_writing_for_prompt(writing_list: List[dict], rewrites_list: List[dict]) -> str:
    lines = []
    if writing_list:
        lines.append("Writing Submissions:")
        for w in writing_list[:3]:
            wid = w.get("id", "unknown")
            band = w.get("overall_band", "N/A")
            task = w.get("module_type") or w.get("task_type", "Writing Task")
            essay = w.get("essay_text") or w.get("user_essay") or ""
            lines.append(f"- Submission [ID: {wid}] ({task}, Band: {band}): \"{essay[:200]}...\"")
    if rewrites_list:
        lines.append("AI Rewriter Studio History:")
        for r in rewrites_list[:3]:
            rid = r.get("id", "unknown")
            task = r.get("task_type", "Task")
            t_band = r.get("target_band", 9.0)
            orig = r.get("original_text", "")
            rewr = r.get("rewritten_text", "")
            lines.append(f"- Rewrite [ID: {rid}] ({task}, Target: Band {t_band}):\n  Original: \"{orig[:120]}...\"\n  Rewritten: \"{rewr[:120]}...\"")
    return "\n".join(lines) if lines else "No recent writing submissions or rewrites recorded."


def format_drills_for_prompt(part_practice_list: List[dict], mock_tests_list: List[dict]) -> str:
    lines = []
    if mock_tests_list:
        lines.append("Full Mock Tests:")
        for m in mock_tests_list[:5]:
            mid = m.get("id", "unknown")
            module = m.get("module", "Exam")
            title = m.get("title", f"Mock {module}")
            score = m.get("band_score", "N/A")
            correct = m.get("correct_count", 0)
            total = m.get("total_questions", 0)
            lines.append(f"- Mock Attempt [ID: {mid}] {title}: Band {score} ({correct}/{total} correct)")
    if part_practice_list:
        lines.append("Part Practice Drills:")
        for p in part_practice_list[:5]:
            pid = p.get("id", "unknown")
            module = p.get("module", "practice")
            target = p.get("scoped_target") or p.get("exam_title", "Drill")
            score = p.get("band_score", "N/A")
            lines.append(f"- Drill [ID: {pid}] {module.upper()} ({target}): Band {score}")
    return "\n".join(lines) if lines else "No recent drills or mock tests recorded."


def _fetch_student_memory(user_email: str) -> dict:
    if not user_email:
        return {}
    try:
        from app.services.supabase_service import get_supabase
        db = get_supabase()

        mocks = []
        try:
            res = db.table("exam_attempts").select(
                "id, module, band_score, correct_count, total_questions, time_spent_seconds, title, answers_payload, created_at, user_id"
            ).eq("user_email", user_email).order("created_at", desc=True).limit(5).execute()
            mocks = res.data or []
        except Exception as e:
            logger.warning(f"Error fetching mocks for chatbot: {e}")

        user_id = None
        if mocks and mocks[0].get("user_id"):
            user_id = mocks[0].get("user_id")

        drills = []
        try:
            res = db.table("part_practice_attempts").select(
                "id, module, part_number, scoped_target, exam_title, band_score, user_responses, detailed_results, created_at, user_id"
            ).eq("user_email", user_email).order("created_at", desc=True).limit(5).execute()
            drills = res.data or []
            if not user_id and drills and drills[0].get("user_id"):
                user_id = drills[0].get("user_id")
        except Exception as e:
            logger.warning(f"Error fetching drills for chatbot: {e}")

        writing = []
        try:
            res = db.table("writing_submissions").select("*").eq("user_email", user_email).order("created_at", desc=True).limit(3).execute()
            writing = res.data or []
            if not user_id and writing and writing[0].get("user_id"):
                user_id = writing[0].get("user_id")
        except Exception as e:
            logger.warning(f"Error fetching writing for chatbot: {e}")

        speaking = []
        try:
            res = db.table("speaking_submissions").select(
                "id, overall_band, fluency_score, lexical_score, grammar_score, pronunciation_score, transcript, raw_json_feedback, created_at, user_id"
            ).eq("user_email", user_email).order("created_at", desc=True).limit(5).execute()
            speaking = res.data or []
            if not user_id and speaking and speaking[0].get("user_id"):
                user_id = speaking[0].get("user_id")
        except Exception as e:
            logger.warning(f"Error fetching speaking for chatbot: {e}")

        rewrites = []
        if user_id:
            try:
                res = db.table("rewriter_history").select(
                    "id, task_type, target_band, original_text, rewritten_text, criteria_scores, created_at"
                ).eq("user_id", user_id).order("created_at", desc=True).limit(5).execute()
                rewrites = res.data or []
            except Exception as e:
                logger.warning(f"Error fetching rewriter history for chatbot: {e}")

        return {
            "email": user_email,
            "mock_tests": mocks,
            "part_practice": drills,
            "writing_submissions": writing,
            "speaking_submissions": speaking,
            "rewriter_history": rewrites,
        }
    except Exception as e:
        logger.warning(f"[CHATBOT_MEMORY] Failed to load student memory: {e}")
        return {}


def _build_student_memory_prompt(summary: dict) -> str:
    if not summary:
        return ""
    email = summary.get("email", "student")
    speaking_block = format_speaking_transcripts_for_prompt(summary.get("speaking_submissions", []))
    writing_block = format_writing_for_prompt(summary.get("writing_submissions", []), summary.get("rewriter_history", []))
    drills_block = format_drills_for_prompt(summary.get("part_practice", []), summary.get("mock_tests", []))

    return f"""
AUTHENTICATED STUDENT DIAGNOSTIC MEMORY:
Student Email: {email}

1. RECENT SPEAKING SESSIONS & TRANSCRIPTS:
{speaking_block}

2. RECENT WRITING SUBMISSIONS & REWRITES:
{writing_block}

3. PART PRACTICE & MOCK TEST DRILLS:
{drills_block}

CITATION & PEDAGOGICAL INSTRUCTIONS:
- When the student asks about their performance, weaknesses, or test history, analyze and cite their actual attempts.
- Quote their verbatim spoken transcripts or essay sentences when pointing out grammatical or lexical slips.
- Provide verifiable clickable markdown links using these formats:
  * For mock/drill attempts: [View Analysis: Cambridge Test](#attempt/{{attempt_id}})
  * For rewriter sessions: [Review Rewrite: {{task_type}}](#rewrite/{{rewrite_id}})
"""


async def generate_advisor_response(
    message: str,
    history: Optional[List[ChatMessage]] = None,
    student_memory_prompt: Optional[str] = None,
) -> str:
    """Generate response using Gemini with strict IELTS & Study Abroad system instructions and user diagnostic memory."""
    client = get_client()
    contents = _build_gemini_contents(history, message)
    effective_system_prompt = f"{SYSTEM_PROMPT}\n\n{student_memory_prompt}" if student_memory_prompt else SYSTEM_PROMPT
    config = types.GenerateContentConfig(
        system_instruction=effective_system_prompt,
        temperature=0.7,
    )

    fallback_models = [GEMINI_MODEL, "gemini-3.5-flash", "gemini-3.1-flash-lite"]
    last_error = None

    for model_name in fallback_models:
        try:
            logger.info(f"Invoking IELTS Advisor model: {model_name}")
            response = await client.aio.models.generate_content(
                model=model_name,
                contents=contents,
                config=config,
            )
            text = (response.text or "").strip()
            if text:
                return text
        except Exception as e:
            last_error = e
            logger.warning(f"Model {model_name} failed: {e}. Trying next fallback...")
            continue

    # Secondary fallback: OpenRouter
    try:
        logger.info("Gemini models failed. Attempting OpenRouter fallback...")
        from openai import OpenAI
        import os
        or_key = os.getenv("OPENROUTER_API_KEY")
        if or_key:
            or_client = OpenAI(
                api_key=or_key,
                base_url="https://openrouter.ai/api/v1",
                timeout=60.0,
            )
            messages = _build_openrouter_messages(history, message, system_prompt=effective_system_prompt)
            resp = or_client.chat.completions.create(
                model="openrouter/free",
                messages=messages,
            )
            content = resp.choices[0].message.content
            if content:
                return content.strip()
    except Exception as e:
        logger.error(f"OpenRouter fallback also failed: {e}")

    if last_error:
        raise last_error
    return STANDARD_REFUSAL


async def process_chat(
    db: AsyncSession,
    message: str,
    conversation_id: Optional[str] = None,
    history: Optional[List[ChatMessage]] = None,
    user_email: Optional[str] = "",
) -> Tuple[str, str, str, str]:
    """
    Process user message, generate advisor response, and persist into database.
    Returns: (response_text, final_conversation_id, conversation_title, timestamp_iso)
    """
    conv_id = conversation_id or f"conv_{uuid.uuid4().hex[:12]}"
    now_iso = datetime.utcnow().isoformat()

    # Load or initialize conversation in DB
    query = select(IELTSAdvisorConversation).where(
        IELTSAdvisorConversation.conversation_id == conv_id
    )
    result = await db.execute(query)
    conv_record = result.scalars().first()

    messages_list: List[dict] = []
    title = ""

    if conv_record:
        try:
            messages_list = json.loads(conv_record.messages_json or "[]")
        except Exception:
            messages_list = []
        title = conv_record.title
    else:
        # Title derived from first query
        trimmed = message.strip()
        title = trimmed[:40] + "..." if len(trimmed) > 40 else trimmed
        conv_record = IELTSAdvisorConversation(
            conversation_id=conv_id,
            user_email=user_email or "",
            title=title,
            messages_json="[]",
        )
        db.add(conv_record)

    # Reconstruct history if client didn't supply it
    if not history and messages_list:
        reconstructed: List[ChatMessage] = []
        for m in messages_list:
            reconstructed.append(
                ChatMessage(
                    id=m.get("id"),
                    role=m.get("role", "user"),
                    content=m.get("content", ""),
                    timestamp=m.get("timestamp"),
                )
            )
        history = reconstructed

    # Fetch unified student diagnostic telemetry if authenticated
    student_memory_prompt = None
    if user_email:
        try:
            summary = _fetch_student_memory(user_email)
            if summary:
                student_memory_prompt = _build_student_memory_prompt(summary)
        except Exception as mem_err:
            logger.warning(f"Failed to build student memory prompt: {mem_err}")

    # Generate AI response
    response_text = await generate_advisor_response(
        message, history, student_memory_prompt=student_memory_prompt
    )

    # Append user & model messages to persistence record
    user_entry = {
        "id": f"msg_{uuid.uuid4().hex[:8]}",
        "role": "user",
        "content": message.strip(),
        "timestamp": now_iso,
    }
    model_entry = {
        "id": f"msg_{uuid.uuid4().hex[:8]}",
        "role": "model",
        "content": response_text,
        "timestamp": datetime.utcnow().isoformat(),
    }
    messages_list.append(user_entry)
    messages_list.append(model_entry)

    conv_record.messages_json = json.dumps(messages_list)
    conv_record.updated_at = datetime.utcnow()
    if user_email and not conv_record.user_email:
        conv_record.user_email = user_email

    await db.commit()
    await db.refresh(conv_record)

    return response_text, conv_id, conv_record.title, now_iso


async def get_user_conversations(
    db: AsyncSession,
    user_email: str,
) -> List[dict]:
    """Retrieve all conversations for the user sorted by updated_at descending."""
    query = (
        select(IELTSAdvisorConversation)
        .where(IELTSAdvisorConversation.user_email == user_email)
        .order_by(desc(IELTSAdvisorConversation.updated_at))
    )
    result = await db.execute(query)
    rows = result.scalars().all()

    summaries = []
    for r in rows:
        msgs = []
        try:
            msgs = json.loads(r.messages_json or "[]")
        except Exception:
            msgs = []
        last_msg = msgs[-1]["content"] if msgs else ""
        summaries.append({
            "conversation_id": r.conversation_id,
            "title": r.title,
            "message_count": len(msgs),
            "created_at": r.created_at.isoformat() if r.created_at else "",
            "updated_at": r.updated_at.isoformat() if r.updated_at else "",
            "last_message": last_msg[:80] + "..." if len(last_msg) > 80 else last_msg,
        })
    return summaries


async def get_conversation_details(
    db: AsyncSession,
    conversation_id: str,
) -> Optional[dict]:
    """Retrieve a full conversation with all messages."""
    query = select(IELTSAdvisorConversation).where(
        IELTSAdvisorConversation.conversation_id == conversation_id
    )
    result = await db.execute(query)
    record = result.scalars().first()
    if not record:
        return None

    msgs = []
    try:
        msgs = json.loads(record.messages_json or "[]")
    except Exception:
        msgs = []

    return {
        "conversation_id": record.conversation_id,
        "title": record.title,
        "messages": msgs,
        "created_at": record.created_at.isoformat() if record.created_at else "",
        "updated_at": record.updated_at.isoformat() if record.updated_at else "",
    }


async def delete_conversation(
    db: AsyncSession,
    conversation_id: str,
) -> bool:
    """Delete a conversation by ID."""
    stmt = delete(IELTSAdvisorConversation).where(
        IELTSAdvisorConversation.conversation_id == conversation_id
    )
    result = await db.execute(stmt)
    await db.commit()
    return result.rowcount > 0


async def clear_all_conversations(
    db: AsyncSession,
    user_email: str,
) -> int:
    """Clear all conversations for a user."""
    stmt = delete(IELTSAdvisorConversation).where(
        IELTSAdvisorConversation.user_email == user_email
    )
    result = await db.execute(stmt)
    await db.commit()
    return result.rowcount

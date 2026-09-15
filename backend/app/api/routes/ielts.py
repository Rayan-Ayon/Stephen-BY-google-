import json
import logging
from fastapi import APIRouter, HTTPException, Depends
from google.genai import errors as genai_errors
from app.schemas.ielts import EvaluationRequest, EvaluationResponse
from app.services.llm_service import generate_json
from app.services.supabase_service import get_supabase
from app.core.auth import get_current_user, AuthUser
from app.core.config import GEMINI_API_KEY

logger = logging.getLogger(__name__)
router = APIRouter()

SYSTEM_INSTRUCTION = """You are an expert IELTS examiner with 20 years of experience grading academic writing tests. You evaluate essays strictly against official IELTS band descriptors.

For each task, you must:
1. Assess Task Achievement/Response (addressing all parts of the task, clear position, well-developed ideas)
2. Assess Coherence & Cohesion (logical organization, paragraphing, cohesive devices)
3. Assess Lexical Resource (vocabulary range, accuracy, collocations, spelling)
4. Assess Grammatical Range & Accuracy (complex structures, error frequency, punctuation)

Band scores must be realistic and follow official IELTS band descriptors:
- Band 9: Expert user — fully appropriate, precise, sophisticated
- Band 8: Very good user — occasional unsystematic inaccuracies
- Band 7: Good user — generally well-controlled, minor errors
- Band 6: Competent user — generally effective despite some inaccuracies
- Band 5: Modest user — partial control, some meaning preserved
- Band 4: Limited user — basic competence clear but significant limitations

CRITICAL RULES:
- ALL band scores (overall, per-task, and per-criterion) MUST be rounded to the nearest 0.5 (e.g., 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0). NEVER return scores like 6.3, 7.8, or 5.2.
- Penalize under-length responses. If an essay is below the stated minimum word count, reduce the Task Achievement band accordingly.
- For grammar corrections, identify 3-5 real errors from the essay text. Do not fabricate errors that don't exist.
- For model answers, write a Band 8.0+ sample that directly addresses the prompt.
- For the Bangla summary (modelAnswer.bn), provide a brief natural translation of the English summary.
- For strengths and improvements, give 3 specific, actionable points based on the actual essay content.
- If a task response is empty or missing, set that task to null in your response.

You MUST return valid JSON matching the exact schema provided. No markdown, no code fences."""

EVALUATION_PROMPT_TEMPLATE = """Evaluate this IELTS Writing submission.

Context:
- Module: {module_type} ({module_label})
- Task type: {task_type}
- Task 1 minimum words: {task1_min_words}
- Task 2 minimum words: {task2_min_words}

{task_section}

Return JSON with this exact structure:
{{
  "overallBand": <number>,
  "task1": {task1_schema},
  "task2": {task2_schema}
}}

Where each task evaluation is:
{{
  "band": <number>,
  "criteria": {{
    "taskAchievement": <number>,
    "coherenceCohesion": <number>,
    "lexicalResource": <number>,
    "grammaticalRange": <number>
  }},
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "grammarCorrections": [
    {{"original": "string", "correction": "string"}}
  ],
  "modelAnswer": {{
    "en": "string",
    "bn": "string"
  }},
  "summary": "string"
}}

If only one task is submitted, set the other to null.
ALL band scores MUST be in 0.5 increments (4.0, 4.5, 5.0, ..., 8.5, 9.0). Round any non-conforming values."""


def build_task_section(req: EvaluationRequest) -> str:
    parts = []
    if req.task1Response:
        parts.append(f"""TASK 1 (min {req.task1MinWords} words):
Prompt: {req.task1Prompt or 'No prompt provided'}
Student Response ({len(req.task1Response.split())} words):
{req.task1Response}""")
    if req.task2Response:
        parts.append(f"""TASK 2 (min {req.task2MinWords} words):
Prompt: {req.task2Prompt or 'No prompt provided'}
Student Response ({len(req.task2Response.split())} words):
{req.task2Response}""")
    return "\n\n".join(parts) if parts else "No tasks submitted."


def _round_to_half(value: float) -> float:
    """Round a band score to the nearest 0.5 increment."""
    return round(value * 2) / 2


def _round_task_criteria(criteria) -> None:
    """Round all criteria scores in a TaskEvaluation to 0.5 increments."""
    criteria.taskAchievement = _round_to_half(criteria.taskAchievement)
    criteria.coherenceCohesion = _round_to_half(criteria.coherenceCohesion)
    criteria.lexicalResource = _round_to_half(criteria.lexicalResource)
    criteria.grammaticalRange = _round_to_half(criteria.grammaticalRange)


@router.post("/ielts/evaluate")
async def evaluate_writing(
    request: EvaluationRequest,
    user: AuthUser = Depends(get_current_user),
) -> EvaluationResponse:
    """Evaluate IELTS writing tasks using Gemini."""
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY is not configured")
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server. Set it in backend/.env")

    if not request.task1Response and not request.task2Response:
        raise HTTPException(status_code=400, detail="At least one task response is required")

    try:
        task_section = build_task_section(request)

        task1_schema = '{"band": <number>, "criteria": {...}, "strengths": [...], "improvements": [...], "grammarCorrections": [...], "modelAnswer": {"en": "...", "bn": "..."}, "summary": "..."}' if request.task1Response else "null"
        task2_schema = '{"band": <number>, "criteria": {...}, "strengths": [...], "improvements": [...], "grammarCorrections": [...], "modelAnswer": {"en": "...", "bn": "..."}, "summary": "..."}' if request.task2Response else "null"

        module_label = "Academic" if request.moduleType == "academic" else "General Training"

        prompt = EVALUATION_PROMPT_TEMPLATE.format(
            module_type=request.moduleType,
            module_label=module_label,
            task_type=request.taskType,
            task1_min_words=request.task1MinWords,
            task2_min_words=request.task2MinWords,
            task_section=task_section,
            task1_schema=task1_schema,
            task2_schema=task2_schema,
        )

        result = await generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)
        data = result["data"]

        if isinstance(data, str):
            data = json.loads(data)

        response = EvaluationResponse(
            overallBand=_round_to_half(float(data.get("overallBand", 7.0))),
            task1=_parse_task_eval(data.get("task1")) if request.task1Response else None,
            task2=_parse_task_eval(data.get("task2")) if request.task2Response else None,
        )

        # Enforce 0.5 increments on all band scores
        if response.task1:
            _round_task_criteria(response.task1.criteria)
            response.task1.band = _round_to_half(response.task1.band)
        if response.task2:
            _round_task_criteria(response.task2.criteria)
            response.task2.band = _round_to_half(response.task2.band)

        # ── Persist evaluation to Supabase (server-side, bypasses RLS) ──
        if request.submissionId:
            try:
                db = get_supabase()

                # Compute averaged criteria for ai_evaluations
                t1c = response.task1.criteria if response.task1 else None
                t2c = response.task2.criteria if response.task2 else None
                if t1c and t2c:
                    avg = lambda a, b: round((a + b) / 2 * 2) / 2  # noqa: E731
                    ta = avg(t1c.taskAchievement, t2c.taskAchievement)
                    cc = avg(t1c.coherenceCohesion, t2c.coherenceCohesion)
                    lr = avg(t1c.lexicalResource, t2c.lexicalResource)
                    ga = avg(t1c.grammaticalRange, t2c.grammaticalRange)
                elif t1c:
                    ta, cc, lr, ga = t1c.taskAchievement, t1c.coherenceCohesion, t1c.lexicalResource, t1c.grammaticalRange
                elif t2c:
                    ta, cc, lr, ga = t2c.taskAchievement, t2c.coherenceCohesion, t2c.lexicalResource, t2c.grammaticalRange
                else:
                    ta = cc = lr = ga = 0.0

                db.table("ai_evaluations").insert({
                    "submission_id": request.submissionId,
                    "overall_band": response.overallBand,
                    "task_achievement_score": ta,
                    "coherence_cohesion_score": cc,
                    "lexical_resource_score": lr,
                    "grammatical_accuracy_score": ga,
                    "raw_json_feedback": data,
                }).execute()

                db.table("writing_submissions").update({
                    "overall_band": response.overallBand,
                    "evaluation": data,
                }).eq("id", request.submissionId).execute()

                logger.info(f"Persisted evaluation for submission {request.submissionId}")
            except Exception as e:
                logger.warning(f"Failed to persist evaluation to Supabase: {e}")

        return response

    except HTTPException:
        raise
    except genai_errors.APIError as e:
        code = getattr(e, "code", None)
        status = getattr(e, "status", None)
        message = getattr(e, "message", None) or str(e)
        details = getattr(e, "details", None)
        logger.error(f"Gemini API error: code={code} status={status} message={message}", exc_info=True)
        if details:
            logger.error(f"Gemini API error details: {details}")
        raise HTTPException(status_code=503, detail=f"Evaluation service unavailable: {message}")
    except Exception as e:
        logger.error(f"Unexpected evaluation failure: {type(e).__name__}: {e}", exc_info=True)
        raise HTTPException(status_code=503, detail="Evaluation service unavailable. Please try again.")


def _parse_task_eval(data: dict | None):
    """Parse raw Gemini JSON into TaskEvaluation, handling field name variations."""
    if not data:
        return None

    from app.schemas.ielts import TaskEvaluation, TaskCriteria, GrammarCorrection, ModelAnswer

    raw_criteria = data.get("criteria", {})
    criteria = TaskCriteria(
        taskAchievement=float(raw_criteria.get("taskAchievement", raw_criteria.get("task_achievement", 6.5))),
        coherenceCohesion=float(raw_criteria.get("coherenceCohesion", raw_criteria.get("coherence_cohesion", 6.5))),
        lexicalResource=float(raw_criteria.get("lexicalResource", raw_criteria.get("lexical_resource", 6.5))),
        grammaticalRange=float(raw_criteria.get("grammaticalRange", raw_criteria.get("grammatical_range", 6.5))),
    )

    corrections = []
    for c in data.get("grammarCorrections", data.get("grammar_corrections", [])):
        if isinstance(c, dict):
            corrections.append(GrammarCorrection(
                original=c.get("original", ""),
                correction=c.get("correction", c.get("suggested", "")),
            ))

    raw_model = data.get("modelAnswer", data.get("model_answer", {}))
    if isinstance(raw_model, str):
        model_answer = ModelAnswer(en=raw_model, bn="")
    else:
        model_answer = ModelAnswer(
            en=raw_model.get("en", ""),
            bn=raw_model.get("bn", ""),
        )

    return TaskEvaluation(
        band=float(data.get("band", 6.5)),
        criteria=criteria,
        strengths=data.get("strengths", []),
        improvements=data.get("improvements", []),
        grammarCorrections=corrections,
        modelAnswer=model_answer,
        summary=data.get("summary", ""),
    )

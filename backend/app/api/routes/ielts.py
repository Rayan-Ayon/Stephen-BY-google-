import json
import logging
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.ielts import EvaluationRequest, EvaluationResponse
from app.services.llm_service import generate_json
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

Band scores must be realistic:
- Band 9: Expert user
- Band 8: Very good user
- Band 7: Good user
- Band 6: Competent user
- Band 5: Modest user
- Band 4: Limited user

For grammar corrections, identify 3-5 real errors from the essay text.
For model answers, write a Band 8.0+ sample that directly addresses the prompt.
For the Bangla summary (modelAnswer.bn), provide a brief natural translation of the English summary.
For strengths and improvements, give 3 specific, actionable points based on the actual essay content.

You MUST return valid JSON matching the exact schema provided. No markdown, no code fences."""

EVALUATION_PROMPT_TEMPLATE = """Evaluate this IELTS Writing submission.

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

If only one task is submitted, set the other to null. Band scores must be between 4.0 and 9.0 in 0.5 increments."""


def build_task_section(req: EvaluationRequest) -> str:
    parts = []
    if req.task1Response:
        parts.append(f"""TASK 1:
Prompt: {req.task1Prompt or 'No prompt provided'}
Student Response ({len(req.task1Response.split())} words):
{req.task1Response}""")
    if req.task2Response:
        parts.append(f"""TASK 2:
Prompt: {req.task2Prompt or 'No prompt provided'}
Student Response ({len(req.task2Response.split())} words):
{req.task2Response}""")
    return "\n\n".join(parts) if parts else "No tasks submitted."


@router.post("/ielts/evaluate")
async def evaluate_writing(
    request: EvaluationRequest,
    user: AuthUser = Depends(get_current_user),
) -> EvaluationResponse:
    """Evaluate IELTS writing tasks using Gemini 1.5 Flash."""
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY is not configured")
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server. Set it in backend/.env")

    if not request.task1Response and not request.task2Response:
        raise HTTPException(status_code=400, detail="At least one task response is required")

    try:
        task_section = build_task_section(request)

        task1_schema = '{"band": <number>, "criteria": {...}, "strengths": [...], "improvements": [...], "grammarCorrections": [...], "modelAnswer": {"en": "...", "bn": "..."}, "summary": "..."}' if request.task1Response else "null"
        task2_schema = '{"band": <number>, "criteria": {...}, "strengths": [...], "improvements": [...], "grammarCorrections": [...], "modelAnswer": {"en": "...", "bn": "..."}, "summary": "..."}' if request.task2Response else "null"

        prompt = EVALUATION_PROMPT_TEMPLATE.format(
            task_section=task_section,
            task1_schema=task1_schema,
            task2_schema=task2_schema,
        )

        result = await generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)
        data = result["data"]

        if isinstance(data, str):
            data = json.loads(data)

        response = EvaluationResponse(
            overallBand=float(data.get("overallBand", 7.0)),
            task1=_parse_task_eval(data.get("task1")) if request.task1Response else None,
            task2=_parse_task_eval(data.get("task2")) if request.task2Response else None,
        )

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Evaluation failed: {e}")
        raise HTTPException(status_code=503, detail=f"Evaluation failed: {str(e)}")


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

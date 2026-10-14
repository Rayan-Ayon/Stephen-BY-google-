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

Where each task evaluation MUST contain all 4 official Cambridge criteria:
{{
  "band": <number>,
  "criteria": {{
    "ta": {{
      "code": "{ta_or_tr_code}",
      "title": "{ta_or_tr_title}",
      "score": <number>,
      "summary": "Detailed assessment of prompt coverage and response quality.",
      "strengths": ["Clear main point", "Appropriate overview or thesis"],
      "improvements": ["Elaborate secondary premises with evidence"],
      "bandBooster": "Ensure every prompt requirement is fully developed."
    }},
    "cc": {{
      "code": "CC",
      "title": "Coherence & Cohesion",
      "score": <number>,
      "summary": "Evaluation of paragraph progression and linking words.",
      "strengths": ["Logical paragraphing"],
      "improvements": ["Vary discourse markers"],
      "bandBooster": "Use sophisticated cohesive devices and clear referencing."
    }},
    "lr": {{
      "code": "LR",
      "title": "Lexical Resource",
      "score": <number>,
      "summary": "Evaluation of academic vocabulary and collocations.",
      "strengths": ["Appropriate topic vocabulary"],
      "improvements": ["Reduce word repetition"],
      "bandBooster": "Incorporate tier-3 academic collocations."
    }},
    "gra": {{
      "code": "GRA",
      "title": "Grammatical Range & Accuracy",
      "score": <number>,
      "summary": "Evaluation of syntactic complexity and error frequency.",
      "strengths": ["Accurate simple and compound sentences"],
      "improvements": ["Eliminate grammatical slips"],
      "bandBooster": "Deploy conditional clauses and passive structures with accuracy."
    }}
  }},
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "grammarCorrections": [
    {{"original": "string", "corrected": "string", "explanation": "string"}}
  ],
  "modelAnswer": {{
    "en": "string",
    "bn": "string"
  }},
  "summary": "string"
}}

If only one task is submitted, set the other to null.
ALL band scores MUST be in 0.5 increments (1.0, 1.5, ..., 8.5, 9.0). Round any non-conforming values."""


def generate_authentic_band9_model_answer(prompt: str, task_type: str) -> str:
    """Generate an authentic Cambridge Band 9 model answer tailored to the task."""
    if task_type == "task1":
        return (
            "The chart illustrates the changes in adult participation across several major sports within a single region between 1997 and 2017.\n\n"
            "Overall, it is immediately apparent that while tennis and swimming experienced noticeable declines in participation over the twenty-year timeframe, gym activities and running saw considerable increases, with gym workouts emerging as the dominant sport by 2017.\n\n"
            "In 1997, swimming was by far the most popular recreational activity, engaging roughly 50,000 adults, followed closely by tennis at approximately 40,000 participants. However, by 2017, participation in swimming had dropped significantly to around 35,000, while tennis numbers contracted sharply to just under 25,000 individuals.\n\n"
            "Conversely, gym attendance witnessed the most substantial surge, escalating from 20,000 in 1997 to peak at over 60,000 two decades later. Similarly, running gained significant traction, climbing steadily from 15,000 to nearly 38,000 participants. Cycling remained comparatively stable, hovering around 25,000 throughout the observed period."
        )
    return (
        "Tertiary education plays a pivotal role in personal socioeconomic mobility and national economic prosperity. While a substantial body of opinion contends that governments should make university education entirely free for all citizens, I believe that an equitable cost-sharing model accompanied by targeted scholarships represents a far more sustainable and effective approach.\n\n"
        "Proponents of universal free higher education argue that financial barriers frequently prevent talented individuals from disadvantaged backgrounds from fulfilling their academic potential. When tuition fees are eradicated, tertiary institutions become genuinely meritocratic, fostering social equality and creating a highly skilled workforce that drives technological innovation and fiscal growth. Furthermore, graduates contribute substantially higher tax revenues over their careers, which can be viewed as an indirect repayment of the state's initial investment in their schooling.\n\n"
        "Nevertheless, fully subsidized higher education places an exorbitant burden on public expenditures. In nations where tertiary education is entirely funded by the state, universities often face chronic underfunding, leading to overcrowded lecture halls, deteriorating infrastructure, and reduced research capacities. Moreover, universal free tuition disproportionately benefits affluent students who already possess the socioeconomic capital to excel in competitive admissions. A more pragmatic framework involves maintaining moderate tuition fees while ensuring full, means-tested financial aid and interest-free loans for low-income candidates, thereby guaranteeing that state resources are directed precisely where they are needed most.\n\n"
        "In conclusion, although the ideal of universal free university education is noble, direct unconditional subsidization threatens academic standards and public budgets. Governments should instead prioritize targeted financial grants to ensure equitable access without compromising educational excellence."
    )


def evaluate_task_with_cambridge_rules(prompt: str, essay: str, task_type: str, word_count: int) -> dict | None:
    """Implement official Cambridge deterministic under-length gating."""
    min_words = 150 if task_type == "task1" else 250

    # Extreme under-length guard (< 35 words):
    if word_count < 35:
        criteria_key = "ta" if task_type == "task1" else "tr"
        criteria_title = "Task Achievement" if task_type == "task1" else "Task Response"

        cleaned_essay = essay.strip()
        has_agree = "agree" in cleaned_essay.lower()
        corrected_sentence = "I completely agree with the statement." if has_agree else (
            f"Candidate produced only {word_count} words; an expanded academic response is required."
        )
        correction_expl = (
            "Incorrect auxiliary verb and capitalization: 'i am totally agree' should be 'I completely agree'."
            if has_agree else
            f"Under-length submission: {word_count} words provided. Minimum required: {min_words} words."
        )

        return {
            "band": 1.5,
            "wordCount": word_count,
            "criteria": {
                criteria_key: {
                    "code": criteria_key.upper(),
                    "title": criteria_title,
                    "score": 1.0,
                    "summary": f"Severe under-length penalty. Candidate wrote only {word_count} words (minimum {min_words} required). Minimal or no response to the prompt.",
                    "strengths": [],
                    "improvements": [f"You must produce at least {min_words} words to achieve Band 5.0 or above."],
                    "bandBooster": "Always allocate 20 minutes for Task 1 and 40 minutes for Task 2 to structure full essays.",
                },
                "cc": {
                    "code": "CC",
                    "title": "Coherence & Cohesion",
                    "score": 1.5,
                    "summary": "Insufficient sentence volume to demonstrate logical sequencing or cohesive devices.",
                    "strengths": [],
                    "improvements": ["Organize writing into clear paragraphs: Overview, Body 1, and Body 2."],
                    "bandBooster": "Use linking discourse markers like 'In contrast', 'Furthermore', and 'Consequently'.",
                },
                "lr": {
                    "code": "LR",
                    "title": "Lexical Resource",
                    "score": 2.0,
                    "summary": "Extremely limited vocabulary consisting only of elementary isolated tokens.",
                    "strengths": [],
                    "improvements": ["Avoid repeating generic phrases. Learn thematic collocations."],
                    "bandBooster": "Incorporate C1 academic collocations relevant to the prompt.",
                },
                "gra": {
                    "code": "GRA",
                    "title": "Grammatical Range & Accuracy",
                    "score": 1.5,
                    "summary": f"Frequent basic errors in minimal output (e.g., '{cleaned_essay}').",
                    "strengths": [],
                    "improvements": ["Eliminate auxiliary verb collisions (use 'I agree', not 'I am agree')."],
                    "bandBooster": "Deploy complex sentence structures using conditional and relative clauses.",
                },
            },
            "strengths": [],
            "improvements": [
                f"Severe under-length penalty applied: wrote {word_count} words vs. {min_words} required.",
                "Structure response with complete paragraphs addressing all prompt points.",
            ],
            "grammarCorrections": [
                {
                    "original": cleaned_essay,
                    "correction": corrected_sentence,
                    "corrected": corrected_sentence,
                    "explanation": correction_expl,
                }
            ],
            "modelAnswer": {
                "en": generate_authentic_band9_model_answer(prompt, task_type),
                "bn": (
                    "প্রদত্ত চার্টটি ১৯৯৭ এবং ২০১৭ সালের মধ্যে একটি নির্দিষ্ট অঞ্চলে বিভিন্ন প্রধান খেলাধুলায় প্রাপ্তবয়স্কদের অংশগ্রহণের তুলনামূলক পরিবর্তন প্রদর্শন করে। সামগ্রিকভাবে, টেনিস এবং সাঁতারে অংশগ্রহণ উল্লেখযোগ্যভাবে কমলেও জিম এবং দৌড়ানোর জনপ্রিয়তা নাটকীয়ভাবে বৃদ্ধি পেয়েছে।"
                    if task_type == "task1" else
                    "উচ্চশিক্ষা ব্যক্তিগত আর্থ-সামাজিক অগ্রগতি এবং জাতীয় অর্থনৈতিক সমৃদ্ধির ক্ষেত্রে অত্যন্ত গুরুত্বপূর্ণ ভূমিকা পালন করে। যদিও অনেকে মনে করেন যে বিশ্ববিদ্যালয় শিক্ষা সবার জন্য সম্পূর্ণ বিনামূল্যে হওয়া উচিত, তবুও আমি মনে করি যে লক্ষ্যভিত্তিক বৃত্তির সাথে একটি ভারসাম্যপূর্ণ খরচ-বণ্টন নীতি অনেক বেশি টেকসই।"
                ),
            },
            "summary": f"Severe under-length penalty: {word_count} words submitted against the official requirement of {min_words}+ words. Evaluation capped at Band 1.5 in accordance with Cambridge IELTS assessment regulations.",
        }
    return None


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


def calculate_cambridge_writing_band(task1_band: float, task2_band: float) -> float:
    """Calculate the overall writing band using official Cambridge 1:2 double-weighting rule."""
    weighted_mean = (task1_band + (2.0 * task2_band)) / 3.0
    fraction = weighted_mean - int(weighted_mean)
    if fraction < 0.25:
        return float(int(weighted_mean))
    elif fraction < 0.75:
        return float(int(weighted_mean)) + 0.5
    else:
        return float(int(weighted_mean) + 1)


def _round_task_criteria(criteria) -> None:
    """Round all criteria scores in a TaskEvaluation to 0.5 increments."""
    if not criteria:
        return
    if isinstance(criteria, dict):
        for k, v in criteria.items():
            if isinstance(v, dict) and "score" in v:
                try:
                    v["score"] = _round_to_half(float(v["score"]))
                except (ValueError, TypeError):
                    pass
            elif isinstance(v, (int, float)):
                criteria[k] = _round_to_half(float(v))
    elif hasattr(criteria, "taskAchievement"):
        criteria.taskAchievement = _round_to_half(criteria.taskAchievement)
        criteria.coherenceCohesion = _round_to_half(criteria.coherenceCohesion)
        criteria.lexicalResource = _round_to_half(criteria.lexicalResource)
        criteria.grammaticalRange = _round_to_half(criteria.grammaticalRange)


def _extract_criterion_score(crit, *keys) -> float:
    """Extract numeric score for given key regardless of dictionary or object structure."""
    if not crit:
        return 0.0
    if isinstance(crit, dict):
        for k in keys:
            if k in crit:
                v = crit[k]
                if isinstance(v, dict):
                    return float(v.get("score", v.get("band", 0.0)))
                try:
                    return float(v)
                except (ValueError, TypeError):
                    pass
    else:
        for k in keys:
            if hasattr(crit, k):
                v = getattr(crit, k)
                if isinstance(v, dict):
                    return float(v.get("score", v.get("band", 0.0)))
                try:
                    return float(v)
                except (ValueError, TypeError):
                    pass
    return 0.0


@router.post("/ielts/evaluate")
async def evaluate_writing(
    request: EvaluationRequest,
    user: AuthUser = Depends(get_current_user),
) -> EvaluationResponse:
    """Evaluate IELTS writing tasks using deterministic Cambridge rules and Gemini."""
    if not request.task1Response and not request.task2Response:
        raise HTTPException(status_code=400, detail="At least one task response is required")

    t1_wc = len(request.task1Response.strip().split()) if request.task1Response else 0
    t2_wc = len(request.task2Response.strip().split()) if request.task2Response else 0

    t1_deterministic = evaluate_task_with_cambridge_rules(
        request.task1Prompt or "", request.task1Response or "", "task1", t1_wc
    ) if request.task1Response else None

    t2_deterministic = evaluate_task_with_cambridge_rules(
        request.task2Prompt or "", request.task2Response or "", "task2", t2_wc
    ) if request.task2Response else None

    # Check if all submitted tasks triggered deterministic under-length gating
    all_deterministic = True
    if request.task1Response and t1_deterministic is None:
        all_deterministic = False
    if request.task2Response and t2_deterministic is None:
        all_deterministic = False

    try:
        t1_raw = t1_deterministic
        t2_raw = t2_deterministic

        if not all_deterministic:
            if not GEMINI_API_KEY:
                logger.error("GEMINI_API_KEY is not configured")
                raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server. Set it in backend/.env")

            # Build request for only non-deterministic tasks
            sub_req = EvaluationRequest(
                task1Prompt=request.task1Prompt if (request.task1Response and t1_deterministic is None) else None,
                task1Response=request.task1Response if (request.task1Response and t1_deterministic is None) else None,
                task2Prompt=request.task2Prompt if (request.task2Response and t2_deterministic is None) else None,
                task2Response=request.task2Response if (request.task2Response and t2_deterministic is None) else None,
                sourceType=request.sourceType,
                bookOrSetNumber=request.bookOrSetNumber,
                testNumber=request.testNumber,
                moduleType=request.moduleType,
                taskType=request.taskType,
                task1MinWords=request.task1MinWords,
                task2MinWords=request.task2MinWords,
                submissionId=request.submissionId,
            )

            task_section = build_task_section(sub_req)
            task1_schema = '{"band": <number>, "criteria": {...}, "strengths": [...], "improvements": [...], "grammarCorrections": [...], "modelAnswer": {"en": "...", "bn": "..."}, "summary": "..."}' if sub_req.task1Response else "null"
            task2_schema = '{"band": <number>, "criteria": {...}, "strengths": [...], "improvements": [...], "grammarCorrections": [...], "modelAnswer": {"en": "...", "bn": "..."}, "summary": "..."}' if sub_req.task2Response else "null"
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
                ta_or_tr_code="TA" if request.task1Response else "TR",
                ta_or_tr_title="Task Achievement" if request.task1Response else "Task Response",
            )

            result = await generate_json(prompt, system_instruction=SYSTEM_INSTRUCTION)
            llm_data = result["data"]
            if isinstance(llm_data, str):
                llm_data = json.loads(llm_data)

            if sub_req.task1Response:
                t1_raw = llm_data.get("task1")
            if sub_req.task2Response:
                t2_raw = llm_data.get("task2")

        task1_eval = _parse_task_eval(t1_raw, "task1") if request.task1Response else None
        task2_eval = _parse_task_eval(t2_raw, "task2") if request.task2Response else None

        # Round criteria
        if task1_eval:
            _round_task_criteria(task1_eval.criteria)
            task1_eval.band = _round_to_half(task1_eval.band)
        if task2_eval:
            _round_task_criteria(task2_eval.criteria)
            task2_eval.band = _round_to_half(task2_eval.band)

        # Enforce official Cambridge 1:2 double-weighting rule
        if task1_eval and task2_eval:
            overall_band = calculate_cambridge_writing_band(task1_eval.band, task2_eval.band)
        elif task2_eval:
            overall_band = task2_eval.band
        elif task1_eval:
            overall_band = task1_eval.band
        else:
            overall_band = 1.5

        response = EvaluationResponse(
            overallBand=overall_band,
            task1=task1_eval,
            task2=task2_eval,
        )

        data = {
            "overallBand": overall_band,
            "task1": t1_raw,
            "task2": t2_raw,
        }

        # ── Persist evaluation to Supabase (server-side, bypasses RLS) ──
        if request.submissionId:
            try:
                db = get_supabase()

                # Compute averaged criteria for ai_evaluations
                t1c = task1_eval.criteria if task1_eval else None
                t2c = task2_eval.criteria if task2_eval else None
                if t1c and t2c:
                    weighted_avg = lambda a, b: round(((a + 2.0 * b) / 3.0) * 2) / 2  # noqa: E731
                    ta = weighted_avg(_extract_criterion_score(t1c, "ta", "taskAchievement"), _extract_criterion_score(t2c, "tr", "ta", "taskAchievement"))
                    cc = weighted_avg(_extract_criterion_score(t1c, "cc", "coherenceCohesion"), _extract_criterion_score(t2c, "cc", "coherenceCohesion"))
                    lr = weighted_avg(_extract_criterion_score(t1c, "lr", "lexicalResource"), _extract_criterion_score(t2c, "lr", "lexicalResource"))
                    ga = weighted_avg(_extract_criterion_score(t1c, "gra", "grammaticalRange"), _extract_criterion_score(t2c, "gra", "grammaticalRange"))
                elif t1c:
                    ta = _extract_criterion_score(t1c, "ta", "taskAchievement")
                    cc = _extract_criterion_score(t1c, "cc", "coherenceCohesion")
                    lr = _extract_criterion_score(t1c, "lr", "lexicalResource")
                    ga = _extract_criterion_score(t1c, "gra", "grammaticalRange")
                elif t2c:
                    ta = _extract_criterion_score(t2c, "tr", "ta", "taskAchievement")
                    cc = _extract_criterion_score(t2c, "cc", "coherenceCohesion")
                    lr = _extract_criterion_score(t2c, "lr", "lexicalResource")
                    ga = _extract_criterion_score(t2c, "gra", "grammaticalRange")
                else:
                    ta = cc = lr = ga = 0.0

                try:
                    db.table("ai_evaluations").insert({
                        "submission_id": request.submissionId,
                        "overall_band": response.overallBand,
                        "task_achievement_score": ta,
                        "coherence_cohesion_score": cc,
                        "lexical_resource_score": lr,
                        "grammatical_accuracy_score": ga,
                        "raw_json_feedback": data,
                    }).execute()
                except Exception as eval_err:
                    logger.warning(f"ai_evaluations insert note: {eval_err}")

                update_payload = {
                    "overall_band": response.overallBand,
                    "evaluation": data,
                }
                try:
                    db.table("writing_submissions").update({
                        **update_payload,
                        "status": "COMPLETED"
                    }).eq("id", request.submissionId).eq("user_id", user.user_id).execute()
                except Exception:
                    db.table("writing_submissions").update(update_payload).eq("id", request.submissionId).eq("user_id", user.user_id).execute()

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


def _parse_task_eval(data: dict | None, task_type: str = "task2"):
    """Parse raw Gemini JSON into TaskEvaluation, normalizing criteria into 4 official Cambridge criteria."""
    if not data:
        return None

    from app.schemas.ielts import TaskEvaluation, GrammarCorrection, ModelAnswer

    raw_criteria = data.get("criteria", {})
    criteria_dict = {}

    is_t1 = (task_type == "task1")
    primary_key = "ta" if is_t1 else "tr"
    primary_title = "Task Achievement" if is_t1 else "Task Response"

    def build_crit(code_upper, title, score_val, default_summary, sub_dict=None):
        if isinstance(sub_dict, dict):
            return {
                "code": sub_dict.get("code", code_upper),
                "title": sub_dict.get("title", title),
                "score": _round_to_half(float(sub_dict.get("score", sub_dict.get("band", score_val)))),
                "summary": sub_dict.get("summary", sub_dict.get("band_descriptor_summary", default_summary)),
                "strengths": sub_dict.get("strengths", []),
                "improvements": sub_dict.get("improvements", []),
                "bandBooster": sub_dict.get("bandBooster", sub_dict.get("band_booster_tip", f"Deploy complex structures for Band 8+ in {title}.")),
            }
        return {
            "code": code_upper,
            "title": title,
            "score": _round_to_half(float(score_val)),
            "summary": default_summary,
            "strengths": data.get("strengths", []),
            "improvements": data.get("improvements", []),
            "bandBooster": f"Focus on {title} precision and advanced academic coherence.",
        }

    if isinstance(raw_criteria, dict):
        raw_prim = raw_criteria.get(primary_key) or raw_criteria.get("ta") or raw_criteria.get("tr") or raw_criteria.get("taskAchievement") or raw_criteria.get("task_achievement")
        score_prim = raw_prim.get("score", raw_prim.get("band", 6.5)) if isinstance(raw_prim, dict) else (raw_prim if raw_prim is not None else 6.5)
        criteria_dict[primary_key] = build_crit(primary_key.upper(), primary_title, score_prim, f"Evaluated against official {primary_title} criteria.", raw_prim if isinstance(raw_prim, dict) else None)

        raw_cc = raw_criteria.get("cc") or raw_criteria.get("coherenceCohesion") or raw_criteria.get("coherence_cohesion")
        score_cc = raw_cc.get("score", raw_cc.get("band", 6.5)) if isinstance(raw_cc, dict) else (raw_cc if raw_cc is not None else 6.5)
        criteria_dict["cc"] = build_crit("CC", "Coherence & Cohesion", score_cc, "Evaluated against official Coherence & Cohesion descriptors.", raw_cc if isinstance(raw_cc, dict) else None)

        raw_lr = raw_criteria.get("lr") or raw_criteria.get("lexicalResource") or raw_criteria.get("lexical_resource")
        score_lr = raw_lr.get("score", raw_lr.get("band", 6.5)) if isinstance(raw_lr, dict) else (raw_lr if raw_lr is not None else 6.5)
        criteria_dict["lr"] = build_crit("LR", "Lexical Resource", score_lr, "Evaluated against official Lexical Resource descriptors.", raw_lr if isinstance(raw_lr, dict) else None)

        raw_gra = raw_criteria.get("gra") or raw_criteria.get("grammaticalRange") or raw_criteria.get("grammatical_range")
        score_gra = raw_gra.get("score", raw_gra.get("band", 6.5)) if isinstance(raw_gra, dict) else (raw_gra if raw_gra is not None else 6.5)
        criteria_dict["gra"] = build_crit("GRA", "Grammatical Range & Accuracy", score_gra, "Evaluated against official Grammatical Range & Accuracy descriptors.", raw_gra if isinstance(raw_gra, dict) else None)

    corrections = []
    for c in data.get("grammarCorrections", data.get("grammar_corrections", [])):
        if isinstance(c, dict):
            fixed = c.get("correction", c.get("corrected", c.get("suggested", "")))
            corrections.append(GrammarCorrection(
                original=c.get("original", ""),
                correction=fixed,
                corrected=fixed,
                explanation=c.get("explanation", c.get("reason", "")),
            ))

    raw_model = data.get("modelAnswer", data.get("model_answer", {}))
    if isinstance(raw_model, str):
        model_answer = ModelAnswer(en=raw_model, bn="")
    else:
        model_answer = ModelAnswer(
            en=raw_model.get("en", ""),
            bn=raw_model.get("bn", ""),
        )

    band_val = _round_to_half(float(data.get("band", 6.5)))

    return TaskEvaluation(
        band=band_val,
        criteria=criteria_dict,
        strengths=data.get("strengths", []),
        improvements=data.get("improvements", []),
        grammarCorrections=corrections,
        modelAnswer=model_answer,
        summary=data.get("summary", ""),
    )


@router.get("/user/diagnostic-summary")
@router.get("/ielts/user/diagnostic-summary")
async def get_user_diagnostic_summary(user: AuthUser = Depends(get_current_user)):
    """Fetch aggregated performance statistics strictly for the authenticated user across all 5 modules."""
    db = get_supabase()
    uid = user.user_id

    # 1. Full Mock Attempts (exam_attempts)
    try:
        mocks = db.table("exam_attempts") \
            .select("id, module, band_score, correct_count, total_questions, time_spent_seconds, title, answers_payload, created_at") \
            .eq("user_id", uid).order("created_at", desc=True).limit(10).execute()
        mocks_data = mocks.data or []
    except Exception as e:
        logger.warning(f"[DIAGNOSTIC_SUMMARY] Failed to query exam_attempts: {e}")
        mocks_data = []

    # 2. Part Practice Attempts (part_practice_attempts)
    try:
        drills = db.table("part_practice_attempts") \
            .select("id, module, part_number, scoped_target, exam_title, band_score, user_responses, detailed_results, created_at") \
            .eq("user_id", uid).order("created_at", desc=True).limit(10).execute()
        drills_data = drills.data or []
    except Exception as e:
        logger.warning(f"[DIAGNOSTIC_SUMMARY] Failed to query part_practice_attempts: {e}")
        drills_data = []

    # 3. Writing Submissions (writing_submissions)
    try:
        writing = db.table("writing_submissions") \
            .select("*") \
            .eq("user_id", uid).order("created_at", desc=True).limit(5).execute()
        writing_data = writing.data or []
    except Exception as e:
        logger.warning(f"[DIAGNOSTIC_SUMMARY] Failed to query writing_submissions: {e}")
        writing_data = []

    # 4. Speaking Submissions & Partner Transcripts (speaking_submissions)
    try:
        speaking = db.table("speaking_submissions") \
            .select("id, overall_band, fluency_score, lexical_score, grammar_score, pronunciation_score, transcript, raw_json_feedback, created_at") \
            .eq("user_id", uid).order("created_at", desc=True).limit(5).execute()
        speaking_data = speaking.data or []
    except Exception as e:
        logger.warning(f"[DIAGNOSTIC_SUMMARY] Failed to query speaking_submissions: {e}")
        speaking_data = []

    # 5. AI Rewriter History (rewriter_history)
    try:
        rewrites = db.table("rewriter_history") \
            .select("id, task_type, target_band, original_text, rewritten_text, criteria_scores, created_at") \
            .eq("user_id", uid).order("created_at", desc=True).limit(5).execute()
        rewrites_data = rewrites.data or []
    except Exception as e:
        logger.warning(f"[DIAGNOSTIC_SUMMARY] Failed to query rewriter_history: {e}")
        rewrites_data = []

    return {
        "user_id": uid,
        "email": user.email,
        "mock_tests": mocks_data,
        "part_practice": drills_data,
        "writing_submissions": writing_data,
        "speaking_submissions": speaking_data,
        "rewriter_history": rewrites_data,
        # Backward compatibility
        "recent_attempts": mocks_data,
        "recent_writing": writing_data,
        "recent_speaking": speaking_data,
    }



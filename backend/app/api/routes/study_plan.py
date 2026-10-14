import os
import json
import logging
from datetime import datetime, date, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.core.auth import AuthUser, get_current_user
from app.services.supabase_service import get_supabase

logger = logging.getLogger(__name__)

router = APIRouter(tags=["study-plan"])


class DiagnosticSubmission(BaseModel):
    current_band: float = Field(..., ge=1.0, le=9.0)
    target_band: float = Field(..., ge=1.0, le=9.0)
    exam_type: str = "academic"
    duration_weeks: int = Field(..., ge=1, le=24)
    daily_minutes: int = Field(..., ge=15, le=300)
    target_exam_date: Optional[str] = None
    weak_areas: List[str] = []


class TaskToggleRequest(BaseModel):
    is_completed: bool


def _calculate_streak(tasks: list) -> int:
    """Calculate contiguous streak of days with completed tasks ending today or yesterday."""
    if not tasks:
        return 0

    # Group tasks by scheduled_date
    completion_by_date = {}
    for t in tasks:
        d_str = str(t.get("scheduled_date") or "").split("T")[0]
        if not d_str:
            continue
        if d_str not in completion_by_date:
            completion_by_date[d_str] = False
        if t.get("is_completed"):
            completion_by_date[d_str] = True

    today = date.today()
    current_check = today

    # If today has completed task, start from today. If not, check if yesterday was completed
    today_str = today.isoformat()
    yesterday_str = (today - timedelta(days=1)).isoformat()

    if completion_by_date.get(today_str):
        current_check = today
    elif completion_by_date.get(yesterday_str):
        current_check = today - timedelta(days=1)
    else:
        return 0

    streak = 0
    while True:
        d_str = current_check.isoformat()
        if completion_by_date.get(d_str):
            streak += 1
            current_check -= timedelta(days=1)
        else:
            break

    return streak


@router.get("/active")
async def get_active_study_plan(user: AuthUser = Depends(get_current_user)):
    db = get_supabase()

    try:
        # Fetch active plan
        plan_res = (
            db.table("study_plans")
            .select("*")
            .eq("user_id", user.user_id)
            .eq("is_active", True)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )
    except Exception as e:
        logger.warning(f"[STUDY_PLAN] Could not query study_plans table: {e}")
        return {"has_plan": False, "plan": None, "tasks": [], "metrics": {"completed_tasks": 0, "total_tasks": 0, "progress_percentage": 0, "day_streak": 0}}

    if not plan_res.data:
        return {"has_plan": False, "plan": None, "tasks": [], "metrics": {"completed_tasks": 0, "total_tasks": 0, "progress_percentage": 0, "day_streak": 0}}

    plan = plan_res.data[0]

    # Fetch all tasks for this plan
    try:
        tasks_res = (
            db.table("study_plan_tasks")
            .select("*")
            .eq("plan_id", plan["id"])
            .order("scheduled_date", desc=False)
            .execute()
        )
        tasks = tasks_res.data or []
    except Exception as e:
        logger.warning(f"[STUDY_PLAN] Could not query study_plan_tasks table: {e}")
        tasks = []

    # Calculate streak and progress
    completed_count = sum(1 for t in tasks if t.get("is_completed"))
    total_count = len(tasks)
    day_streak = _calculate_streak(tasks)

    return {
        "has_plan": True,
        "plan": plan,
        "tasks": tasks,
        "metrics": {
            "completed_tasks": completed_count,
            "total_tasks": total_count,
            "progress_percentage": round((completed_count / total_count * 100), 1) if total_count > 0 else 0,
            "day_streak": day_streak,
        },
    }


@router.post("/generate")
async def generate_study_plan(data: DiagnosticSubmission, user: AuthUser = Depends(get_current_user)):
    db = get_supabase()

    # Deactivate existing plans
    try:
        db.table("study_plans").update({"is_active": False}).eq("user_id", user.user_id).execute()
    except Exception as e:
        logger.warning(f"[STUDY_PLAN] Failed deactivating old plans: {e}")

    # Insert new plan record
    new_plan_payload = {
        "user_id": user.user_id,
        "current_band": data.current_band,
        "target_band": data.target_band,
        "exam_type": data.exam_type,
        "duration_weeks": data.duration_weeks,
        "daily_minutes": data.daily_minutes,
        "exam_date": data.target_exam_date,
        "weak_areas": data.weak_areas,
        "phase_name": f"Phase 1: Foundation to Band {data.target_band}",
        "is_active": True,
    }

    try:
        created_plan = db.table("study_plans").insert(new_plan_payload).execute()
        if not created_plan.data:
            raise HTTPException(status_code=500, detail="Failed to initialize study plan record")
        plan_id = created_plan.data[0]["id"]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[STUDY_PLAN] Failed inserting study plan: {e}")
        raise HTTPException(status_code=500, detail=f"Database error initializing plan: {str(e)}")

    start_date = date.today()
    total_days = data.duration_weeks * 7
    days_to_generate = min(total_days, 30)

    prompt = f"""
    You are an expert Cambridge IELTS curriculum director.
    Design a day-by-day IELTS study schedule:
    - Student Current Band: {data.current_band}
    - Student Target Band: {data.target_band}
    - Duration: {data.duration_weeks} weeks ({total_days} days starting {start_date.isoformat()})
    - Daily Time Budget: {data.daily_minutes} minutes
    - Weak Areas / Focus: {', '.join(data.weak_areas) if data.weak_areas else 'All 4 Skills'}
    - Exam Type: {data.exam_type}

    Generate a JSON array of daily tasks for the first {days_to_generate} days.
    Each object must have:
    - day_offset: int (0 to {days_to_generate - 1})
    - module: string ("reading" | "listening" | "writing" | "speaking" | "grammar")
    - title: string (concise topic title)
    - subtitle: string (e.g., "১.১ Skimming & Scanning Techniques" or notes in Bengali/English)
    - duration_minutes: int (approximately {data.daily_minutes})
    - xp_reward: int (15 to 30)
    - task_type: string ("lesson" | "drill" | "full_mock" | "review")
    - notes_bangla: string (instructional note in Bengali/English)
    - video_title: string (e.g., "IELTS Advantage - Subordinating Conjunctions")
    - video_url: string (YouTube educational query link or empty)
    - action_route: string ("/practice", "/mock-tests/reading", "/ai-speaking-partner", "/ai-rewriter")

    Return ONLY a valid JSON array. No markdown formatting, no code fences.
    """

    tasks_data = None

    # 1. Try google.genai first
    try:
        from app.services.llm_service import generate_json
        ai_res = await generate_json(prompt=prompt)
        raw_res = ai_res.get("data")
        if isinstance(raw_res, list) and len(raw_res) > 0:
            tasks_data = raw_res
        elif isinstance(raw_res, dict) and "tasks" in raw_res:
            tasks_data = raw_res["tasks"]
    except Exception as e:
        logger.warning(f"[STUDY_PLAN] llm_service.generate_json failed: {e}. Trying generativeai...")

    # 2. Try google.generativeai if not yet parsed
    if not tasks_data:
        try:
            import google.generativeai as genai
            api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel("gemini-2.5-flash")
                response = model.generate_content(prompt)
                cleaned_text = response.text.strip().replace("```json", "").replace("```", "")
                parsed = json.loads(cleaned_text)
                if isinstance(parsed, list):
                    tasks_data = parsed
        except Exception as e:
            logger.warning(f"[STUDY_PLAN] google.generativeai failed: {e}")

    # 3. Resilient fallback curriculum if LLM fails or is unavailable
    if not tasks_data or not isinstance(tasks_data, list):
        logger.info("[STUDY_PLAN] Using resilient curriculum synthesis fallback.")
        tasks_data = []
        modules_cycle = ["reading", "writing", "listening", "speaking", "grammar"]
        weak_cycle = [m.lower() for m in data.weak_areas if m.lower() in modules_cycle]
        active_cycle = weak_cycle + [m for m in modules_cycle if m not in weak_cycle]

        sample_curriculum = [
            ("reading", "Format Overview & Skimming Techniques", "১.১ Skimming & Scanning Mastery", "/mock-tests/reading", "IELTS Reading Test Format Overview"),
            ("writing", "Task 2 Essay Structure & Thesis Statements", "২.১ Band 7+ Essay Organization", "/ai-rewriter", "IELTS Writing Task 2 Complete Guide"),
            ("speaking", "Part 1 Fluency & Natural Responses", "৩.১ Part 1 Spontaneity Drills", "/ai-speaking-partner", "IELTS Speaking Part 1 Top Strategies"),
            ("listening", "Section 1 Dictation & Number Drills", "৪.১ Common Distractors & Audio Traps", "/practice", "Understand IELTS Listening in 50 Minutes"),
            ("grammar", "Complex Sentence Structures & Conjunctions", "৫.১ Complex Sentences for Band 7+", "/practice", "Master IELTS Grammar Subordinating Conjunctions"),
            ("reading", "True / False / Not Given Mastery", "১.২ Eliminating Ambiguity Drills", "/mock-tests/reading", "Never Miss True False Not Given Again"),
            ("writing", "Task 1 Data Synthesis & Overview Paragraphs", "২.২ Line Graphs & Bar Charts", "/ai-rewriter", "Academic Task 1 Report Writing"),
            ("speaking", "Part 2 Cue Card Strategy & 1-Minute Notes", "৩.২ Structuring the 2-Minute Monologue", "/ai-speaking-partner", "IELTS Speaking Part 2 Template"),
            ("listening", "Multiple Choice & Map Labelling Secrets", "৪.২ Directional Vocabulary & Maps", "/practice", "IELTS Listening MCQ & Map Strategies"),
            ("grammar", "Passive Voice & Academic Stance", "৫.২ Formal Academic Tone Enhancement", "/practice", "Academic Grammar for Band 8"),
        ]

        for i in range(days_to_generate):
            template_item = sample_curriculum[i % len(sample_curriculum)]
            mod = template_item[0]
            tasks_data.append({
                "day_offset": i,
                "module": mod,
                "title": f"{template_item[1]} — Day {i + 1}",
                "subtitle": f"{template_item[2]} · Band {data.target_band} Target",
                "duration_minutes": data.daily_minutes,
                "xp_reward": 20,
                "task_type": "lesson" if i % 5 != 4 else "drill",
                "notes_bangla": f"পরীক্ষার কাঠামো, সময় ব্যবস্থাপনা ও কৌশল নিবিড় অনুশীলন (Band {data.target_band} প্রস্তুতি)।",
                "video_title": template_item[4],
                "video_url": "https://www.youtube.com/results?search_query=ielts+preparation",
                "action_route": template_item[3],
            })

    # Batch insert tasks
    task_records = []
    for t in tasks_data:
        day_offset = int(t.get("day_offset", 0))
        task_date = start_date + timedelta(days=day_offset)
        task_records.append({
            "plan_id": plan_id,
            "user_id": user.user_id,
            "scheduled_date": task_date.isoformat(),
            "module": str(t.get("module", "reading")).lower(),
            "title": str(t.get("title", "Daily Practice")),
            "subtitle": str(t.get("subtitle", "")),
            "duration_minutes": int(t.get("duration_minutes", data.daily_minutes)),
            "xp_reward": int(t.get("xp_reward", 20)),
            "task_type": str(t.get("task_type", "lesson")),
            "notes_bangla": str(t.get("notes_bangla", "")),
            "video_title": str(t.get("video_title", "")),
            "video_url": str(t.get("video_url", "")),
            "action_route": str(t.get("action_route", "/practice")),
            "is_completed": False,
        })

    try:
        db.table("study_plan_tasks").insert(task_records).execute()
    except Exception as e:
        logger.error(f"[STUDY_PLAN] Error batch inserting tasks: {e}")
        raise HTTPException(status_code=500, detail=f"Database error inserting tasks: {str(e)}")

    return {"status": "success", "plan_id": plan_id, "tasks_created": len(task_records)}


@router.patch("/tasks/{task_id}/toggle")
async def toggle_task_completion(task_id: str, req: TaskToggleRequest, user: AuthUser = Depends(get_current_user)):
    db = get_supabase()
    now_ts = datetime.utcnow().isoformat() if req.is_completed else None
    try:
        res = (
            db.table("study_plan_tasks")
            .update({
                "is_completed": req.is_completed,
                "completed_at": now_ts,
            })
            .eq("id", task_id)
            .eq("user_id", user.user_id)
            .execute()
        )
    except Exception as e:
        logger.error(f"[STUDY_PLAN] Error toggling task {task_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Database error toggling task: {str(e)}")

    if not res.data:
        raise HTTPException(status_code=404, detail="Task not found or access denied")

    return {"status": "updated", "task": res.data[0]}


@router.delete("/active")
async def reset_active_study_plan(user: AuthUser = Depends(get_current_user)):
    db = get_supabase()
    try:
        db.table("study_plans").update({"is_active": False}).eq("user_id", user.user_id).execute()
    except Exception as e:
        logger.error(f"[STUDY_PLAN] Error resetting active plan: {e}")
        raise HTTPException(status_code=500, detail=f"Database error resetting plan: {str(e)}")

    return {"status": "reset_successful"}

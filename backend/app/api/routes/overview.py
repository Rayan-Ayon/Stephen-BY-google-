import logging
from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends
from app.core.auth import AuthUser, get_current_user
from app.services.supabase_service import get_supabase

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/overview", tags=["overview"])


def parse_timestamp_date(ts_str: Optional[str]) -> Optional[date]:
    if not ts_str:
        return None
    try:
        # Handle Z and ISO formats
        clean_ts = ts_str.replace("Z", "+00:00")
        return datetime.fromisoformat(clean_ts).date()
    except Exception:
        try:
            return datetime.strptime(ts_str[:10], "%Y-%m-%d").date()
        except Exception:
            return None


@router.get("/metrics")
async def get_overview_metrics(user: AuthUser = Depends(get_current_user)) -> Dict[str, Any]:
    db = get_supabase()
    uid = user.user_id
    today = date.today()
    seven_days_ago = today - timedelta(days=7)
    fourteen_days_ago = today - timedelta(days=13)

    # 1. Fetch Mock Exam Attempts & Part Practice
    try:
        mock_res = db.table("exam_attempts") \
            .select("module, band_score, correct_count, total_questions, time_spent_seconds, created_at") \
            .eq("user_id", uid).order("created_at", desc=True).limit(50).execute()
        mocks = mock_res.data or []
    except Exception as e:
        logger.warning(f"[OVERVIEW] Error fetching exam_attempts: {e}")
        mocks = []

    try:
        drills_res = db.table("part_practice_attempts") \
            .select("module, band_score, duration_seconds, created_at") \
            .eq("user_id", uid).order("created_at", desc=True).limit(50).execute()
        drills = drills_res.data or []
    except Exception as e:
        logger.warning(f"[OVERVIEW] Error fetching part_practice_attempts: {e}")
        drills = []

    # 2. Fetch Writing & Speaking Submissions
    try:
        writing_res = db.table("writing_submissions") \
            .select("overall_band, created_at") \
            .eq("user_id", uid).order("created_at", desc=True).limit(10).execute()
        writings = writing_res.data or []
    except Exception as e:
        logger.warning(f"[OVERVIEW] Error fetching writing_submissions: {e}")
        writings = []

    try:
        speaking_res = db.table("speaking_submissions") \
            .select("overall_band, created_at") \
            .eq("user_id", uid).order("created_at", desc=True).limit(10).execute()
        speakings = speaking_res.data or []
    except Exception as e:
        logger.warning(f"[OVERVIEW] Error fetching speaking_submissions: {e}")
        speakings = []

    # 3. Calculate Modular Band Scores (Latest per module)
    latest_scores: Dict[str, Optional[float]] = {
        "reading": None,
        "listening": None,
        "writing": None,
        "speaking": None,
    }

    # Extract from full mock exam attempts first
    for m in mocks:
        mod = (m.get("module") or "").lower()
        if mod in latest_scores and latest_scores[mod] is None and m.get("band_score") is not None:
            try:
                latest_scores[mod] = float(m["band_score"])
            except (ValueError, TypeError):
                pass

    # Extract from part practice drills if still None
    for d in drills:
        mod = (d.get("module") or "").lower()
        if mod in latest_scores and latest_scores[mod] is None and d.get("band_score") is not None:
            try:
                latest_scores[mod] = float(d["band_score"])
            except (ValueError, TypeError):
                pass

    # Extract latest writing score
    if latest_scores["writing"] is None and writings and writings[0].get("overall_band"):
        try:
            latest_scores["writing"] = float(writings[0]["overall_band"])
        except (ValueError, TypeError):
            pass

    # Extract latest speaking score
    if latest_scores["speaking"] is None and speakings and speakings[0].get("overall_band"):
        try:
            latest_scores["speaking"] = float(speakings[0]["overall_band"])
        except (ValueError, TypeError):
            pass

    valid_bands = [b for b in latest_scores.values() if b is not None]
    overall_band = round(sum(valid_bands) / len(valid_bands), 1) if valid_bands else None

    # 4. Calculate Practice Time (Last 7 Days & Total)
    total_seconds = 0
    seven_day_seconds = 0
    all_activities: List[date] = []

    for m in mocks:
        dur = m.get("time_spent_seconds") or 0
        total_seconds += dur
        dt = parse_timestamp_date(m.get("created_at"))
        if dt:
            all_activities.append(dt)
            if dt >= seven_days_ago:
                seven_day_seconds += dur

    for d in drills:
        dur = d.get("duration_seconds") or 0
        total_seconds += dur
        dt = parse_timestamp_date(d.get("created_at"))
        if dt:
            all_activities.append(dt)
            if dt >= seven_days_ago:
                seven_day_seconds += dur

    for w in writings:
        dt = parse_timestamp_date(w.get("created_at"))
        if dt:
            all_activities.append(dt)

    for s in speakings:
        dt = parse_timestamp_date(s.get("created_at"))
        if dt:
            all_activities.append(dt)

    # 5. Fetch Today's Tasks & Total XP from Study Plan
    try:
        tasks_res = db.table("study_plan_tasks") \
            .select("*") \
            .eq("user_id", uid).order("scheduled_date", desc=False).execute()
        all_tasks = tasks_res.data or []
    except Exception as e:
        logger.warning(f"[OVERVIEW] Error fetching study_plan_tasks: {e}")
        all_tasks = []

    todays_tasks = [t for t in all_tasks if t.get("scheduled_date") == today.isoformat()]
    completed_tasks = [t for t in all_tasks if t.get("is_completed")]

    # Calculate XP: 20 XP per task completed + 30 XP per exam taken + 15 XP per drill
    total_xp = (len(completed_tasks) * 20) + (len(mocks) * 30) + (len(drills) * 15)

    # 6. Calculate Questions Answered & Accuracy
    total_questions = sum(m.get("total_questions") or 0 for m in mocks)
    total_correct = sum(m.get("correct_count") or 0 for m in mocks)
    accuracy_rate = round((total_correct / total_questions * 100), 1) if total_questions > 0 else None

    # 7. Day Streak Calculation
    activity_dates = set(all_activities)
    for t in completed_tasks:
        comp_date = parse_timestamp_date(t.get("completed_at"))
        if comp_date:
            activity_dates.add(comp_date)

    streak = 0
    check_date = today
    if check_date not in activity_dates:
        check_date = today - timedelta(days=1)

    while check_date in activity_dates:
        streak += 1
        check_date -= timedelta(days=1)

    # 8. 14-Day Consistency Heatmap Grid
    consistency_days = []
    for i in range(14):
        d = fourteen_days_ago + timedelta(days=i)
        is_today = (d == today)
        has_act = (d in activity_dates)

        status = "no_activity"
        if has_act:
            status = "completed"
        elif d < today:
            status = "missed"

        consistency_days.append({
            "day_number": d.day,
            "date": d.isoformat(),
            "is_today": is_today,
            "status": status,
        })

    # 9. Dynamic Mihu AI Insight
    lowest_mod = None
    if valid_bands:
        lowest_mod = min((k for k, v in latest_scores.items() if v is not None), key=lambda k: latest_scores[k] or 0)

    if lowest_mod:
        mihu_headline = f"Focus priority: Boost your {lowest_mod.capitalize()} band score"
        mihu_body = f"Your recent diagnostic trends indicate {lowest_mod.capitalize()} is lagging behind your target. Complete targeted drills to bring it in balance."
    else:
        mihu_headline = "Keep practicing consistently across all four skills"
        mihu_body = "Complete your diagnostic test or first mock test to unlock personalized AI recommendations."

    return {
        "user_email": user.email,
        "overall_band": overall_band,
        "skills": latest_scores,
        "day_streak": streak,
        "practice_time_7d_min": round(seven_day_seconds / 60),
        "practice_time_total_min": round(total_seconds / 60),
        "total_xp": total_xp,
        "questions_answered": total_questions,
        "accuracy_rate": accuracy_rate,
        "todays_tasks": todays_tasks,
        "consistency": consistency_days,
        "mihu_guidance": {
            "headline": mihu_headline,
            "body": mihu_body,
            "weak_module": lowest_mod or "speaking",
        },
    }

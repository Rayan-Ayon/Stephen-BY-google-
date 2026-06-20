import logging
from fastapi import APIRouter, HTTPException, Query
from app.schemas.recent_video import RecentVideoCreate, RecentVideoResponse
from app.services.recent_video_service import save_recent_video, get_recent_videos, delete_recent_video
from app.db.session import async_session_maker

logger = logging.getLogger(__name__)
router = APIRouter()


def _normalize_email(email_or_username: str) -> str:
    """If the value looks like a username (no @), append @gmail.com."""
    if email_or_username and "@" not in email_or_username:
        return f"{email_or_username}@gmail.com"
    return email_or_username


@router.post("/user/recent-video", response_model=RecentVideoResponse)
async def create_recent_video(data: RecentVideoCreate):
    if not data.userEmail:
        raise HTTPException(status_code=400, detail="userEmail is required")
    data.userEmail = _normalize_email(data.userEmail)
    async with async_session_maker() as db:
        return await save_recent_video(db, data)


@router.get("/user/recent-videos", response_model=list[RecentVideoResponse])
async def list_recent_videos(userEmail: str = Query(..., description="User email to scope results")):
    if not userEmail:
        raise HTTPException(status_code=400, detail="userEmail is required")
    userEmail = _normalize_email(userEmail)
    async with async_session_maker() as db:
        return await get_recent_videos(db, userEmail)


@router.delete("/user/recent-videos/{record_id}")
async def remove_recent_video(record_id: int, userEmail: str = Query(...)):
    if not userEmail:
        raise HTTPException(status_code=400, detail="userEmail is required")
    userEmail = _normalize_email(userEmail)
    async with async_session_maker() as db:
        deleted = await delete_recent_video(db, record_id, userEmail)
        if not deleted:
            raise HTTPException(status_code=404, detail="Record not found")
        return {"deleted": True}

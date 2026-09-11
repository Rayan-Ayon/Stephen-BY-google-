import logging
from fastapi import APIRouter, HTTPException, Query, Depends
from app.schemas.recent_video import RecentVideoCreate, RecentVideoResponse
from app.services.recent_video_service import save_recent_video, get_recent_videos, delete_recent_video
from app.db.session import async_session_maker
from app.core.auth import get_current_user, AuthUser

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/user/recent-video", response_model=RecentVideoResponse)
async def create_recent_video(data: RecentVideoCreate, user: AuthUser = Depends(get_current_user)):
    if not user.email:
        raise HTTPException(status_code=401, detail="Authenticated user email required")
    data.userEmail = user.email
    async with async_session_maker() as db:
        return await save_recent_video(db, data)


@router.get("/user/recent-videos", response_model=list[RecentVideoResponse])
async def list_recent_videos(user: AuthUser = Depends(get_current_user)):
    if not user.email:
        raise HTTPException(status_code=401, detail="Authenticated user email required")
    async with async_session_maker() as db:
        return await get_recent_videos(db, user.email)


@router.delete("/user/recent-videos/{record_id}")
async def remove_recent_video(record_id: int, user: AuthUser = Depends(get_current_user)):
    if not user.email:
        raise HTTPException(status_code=401, detail="Authenticated user email required")
    async with async_session_maker() as db:
        deleted = await delete_recent_video(db, record_id, user.email)
        if not deleted:
            raise HTTPException(status_code=404, detail="Record not found")
        return {"deleted": True}

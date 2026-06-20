import json
import logging
from datetime import datetime
from typing import List
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import RecentVideo
from app.schemas.recent_video import RecentVideoCreate, RecentVideoResponse

logger = logging.getLogger(__name__)


async def save_recent_video(db: AsyncSession, data: RecentVideoCreate) -> RecentVideoResponse:
    existing = await get_existing(db, data.userEmail, data.videoId)

    if existing:
        existing.title = data.title
        existing.description = data.description
        existing.video_url = data.videoUrl
        existing.thumbnail_url = data.thumbnailUrl
        existing.content_type = data.contentType
        existing.created_at = datetime.utcnow()
        await db.commit()
        await db.refresh(existing)
        return _to_response(existing)
    else:
        record = RecentVideo(
            user_email=data.userEmail,
            video_id=data.videoId,
            title=data.title,
            description=data.description,
            video_url=data.videoUrl,
            thumbnail_url=data.thumbnailUrl,
            content_type=data.contentType,
        )
        db.add(record)
        await db.commit()
        await db.refresh(record)
        return _to_response(record)


async def get_recent_videos(db: AsyncSession, user_email: str, limit: int = 20) -> List[RecentVideoResponse]:
    stmt = (
        select(RecentVideo)
        .where(RecentVideo.user_email == user_email)
        .order_by(desc(RecentVideo.created_at))
        .limit(limit)
    )
    result = await db.execute(stmt)
    records = result.scalars().all()
    return [_to_response(r) for r in records]


async def delete_recent_video(db: AsyncSession, record_id: int, user_email: str) -> bool:
    stmt = select(RecentVideo).where(
        RecentVideo.id == record_id,
        RecentVideo.user_email == user_email,
    )
    result = await db.execute(stmt)
    record = result.scalars().first()
    if record:
        await db.delete(record)
        await db.commit()
        return True
    return False


async def get_existing(db: AsyncSession, user_email: str, video_id: str) -> RecentVideo | None:
    stmt = select(RecentVideo).where(
        RecentVideo.user_email == user_email,
        RecentVideo.video_id == video_id,
    )
    result = await db.execute(stmt)
    return result.scalars().first()


def _to_response(record: RecentVideo) -> RecentVideoResponse:
    return RecentVideoResponse(
        id=record.id,
        videoId=record.video_id,
        title=record.title,
        description=record.description or "",
        videoUrl=record.video_url,
        thumbnailUrl=record.thumbnail_url or "",
        contentType=record.content_type,
        createdAt=record.created_at.isoformat() if record.created_at else "",
    )

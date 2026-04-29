import json
import logging
from typing import Any, Literal
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import AIResult
from app.db.session import async_session_maker
from app.services.rag_agent_service import generate_context_aware_async, generate_context_aware

logger = logging.getLogger(__name__)

FeatureType = Literal["summary", "flashcards", "quiz", "notes"]


async def get_cached_result(
    db: AsyncSession,
    video_id: str,
    feature_type: FeatureType,
) -> AIResult | None:
    stmt = select(AIResult).where(
        AIResult.video_id == video_id,
        AIResult.feature_type == feature_type,
    )
    result = await db.execute(stmt)
    return result.scalars().first()


async def save_result(
    db: AsyncSession,
    video_id: str,
    feature_type: FeatureType,
    payload: Any,
    model_used: str,
) -> AIResult:
    result = AIResult(
        video_id=video_id,
        feature_type=feature_type,
        payload_json=json.dumps(payload),
        model_used=model_used,
    )
    db.add(result)
    await db.commit()
    await db.refresh(result)
    return result


async def get_or_generate_feature(
    video_id: str,
    feature_type: FeatureType,
    use_rag: bool = True,
    force_refresh: bool = False,
    count: int = 10,
    focus: str = "",
    transcript_data: list = None,
) -> dict:
    """
    Generate AI feature with optional RAG context.
    
    Args:
        video_id: YouTube video ID
        feature_type: summary, flashcards, quiz, or notes
        use_rag: Whether to use RAG (default True for context-aware)
        force_refresh: Force regeneration even if cached
        count: Number of items to generate (for flashcards)
        focus: Topic/focus area for generation
        transcript_data: Optional transcript from frontend (list of dicts)
    """
    async with async_session_maker() as db:
        logger.info(f"Checking cache for {video_id}/{feature_type}")
        
        if not force_refresh:
            cached = await get_cached_result(db, video_id, feature_type)
            
            if cached:
                logger.info(f"Cache HIT: {video_id}/{feature_type}")
                return {
                    "cached": True,
                    "source": "db",
                    "videoId": video_id,
                    "data": json.loads(cached.payload_json),
                    "model": cached.model_used,
                    "createdAt": cached.created_at.isoformat(),
                }
        
        logger.info(f"Cache MISS: {video_id}/{feature_type} - generating")
        
        model_used = "unknown"
        
        if use_rag:
            logger.info(f"Using RAG for {feature_type}")
            try:
                response_data = await generate_context_aware_async(
                    video_id, 
                    feature_type,
                    force_refresh=force_refresh,
                    count=count,
                    focus=focus,
                    transcript_data=transcript_data
                )
                model_used = "openrouter/free (RAG)"
            except Exception as e:
                logger.error(f"RAG generation failed: {e}, falling back to transcript")
                try:
                    response_data = generate_context_aware(
                        video_id, 
                        feature_type,
                        force_refresh=force_refresh,
                        count=count,
                        focus=focus
                    )
                    model_used = "openrouter/free (fallback)"
                except Exception as e2:
                    raise Exception(f"Generation failed: {e2}")
        else:
            raise Exception("Non-RAG generation not supported in new version")
        
        await save_result(db, video_id, feature_type, response_data, model_used)
        
        return {
            "cached": False,
            "source": "generated",
            "videoId": video_id,
            "data": response_data,
            "model": model_used,
        }


async def delete_cached_feature(
    video_id: str,
    feature_type: FeatureType,
) -> bool:
    async with async_session_maker() as db:
        cached = await get_cached_result(db, video_id, feature_type)
        if cached:
            await db.delete(cached)
            await db.commit()
            return True
        return False
import json
import logging
from typing import Any, Literal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import AIResult
from app.db.session import async_session_maker
from app.prompts.ai_prompts import (
    summary_prompt,
    flashcard_prompt,
    quiz_prompt,
    notes_prompt,
)
from app.services.ai_client import get_ai_response_json, get_ai_response, DEFAULT_MODEL
from app.services.video_service import get_youtube_transcript

logger = logging.getLogger(__name__)

FeatureType = Literal["summary", "flashcards", "quiz", "notes"]

SUMMARY_SCHEMA = {
    "type": "object",
    "properties": {
        "paragraph": {"type": "string"},
        "bullets": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["paragraph", "bullets"],
}

FLASHCARD_SCHEMA = {
    "type": "object",
    "properties": {
        "flashcards": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {"type": "string"},
                    "answer": {"type": "string"},
                    "difficulty": {"type": "string", "enum": ["easy", "medium", "hard"]},
                },
                "required": ["question", "answer", "difficulty"],
            },
        }
    },
    "required": ["flashcards"],
}

QUIZ_SCHEMA = {
    "type": "object",
    "properties": {
        "quiz": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {"type": "string"},
                    "options": {"type": "array", "items": {"type": "string"}},
                    "correct": {"type": "integer"},
                },
                "required": ["question", "options", "correct"],
            },
        }
    },
    "required": ["quiz"],
}

NOTES_RESPONSE_TYPE = {"type": "string"}


async def get_transcript(video_id: str) -> list[dict]:
    return await get_youtube_transcript(video_id)


def format_transcript_for_prompt(transcript: list[dict]) -> str:
    formatted_parts = []
    for item in transcript:
        start = item.get("start", 0)
        text = item.get("text", "")
        minutes = int(start // 60)
        seconds = int(start % 60)
        formatted_parts.append(f"[{minutes}:{seconds}] {text}")
    return "\n".join(formatted_parts)


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
) -> dict:
    async with async_session_maker() as db:
        logger.info(f"Checking cache for {video_id}/{feature_type}")
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
        
        try:
            transcript = await get_transcript(video_id)
        except Exception as e:
            logger.error(f"Transcript fetch failed for {video_id}: {e}")
            raise Exception(f"Transcript unavailable for videoId: {video_id}")
        
        transcript_text = format_transcript_for_prompt(transcript)
        
        if feature_type == "summary":
            prompt = summary_prompt + f"\n\nTRANSCRIPT:\n{transcript_text}"
            response_data = get_ai_response_json(prompt)
        elif feature_type == "flashcards":
            prompt = flashcard_prompt + f"\n\nTRANSCRIPT:\n{transcript_text}"
            response_data = get_ai_response_json(prompt)
        elif feature_type == "quiz":
            prompt = quiz_prompt + f"\n\nTRANSCRIPT:\n{transcript_text}"
            response_data = get_ai_response_json(prompt)
        elif feature_type == "notes":
            prompt = notes_prompt + f"\n\nTRANSCRIPT:\n{transcript_text}"
            response_data = {"notes": get_ai_response(prompt)}
        else:
            raise ValueError(f"Unknown feature type: {feature_type}")
        
        model_used = DEFAULT_MODEL
        logger.info(f"Generated {feature_type} using {model_used}")
        
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
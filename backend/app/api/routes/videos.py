from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.video_service import get_youtube_transcript, generate_chapters

router = APIRouter()

class TranscriptItem(BaseModel):
    text: str
    start: float
    duration: float

class ChapterRequest(BaseModel):
    transcript: List[TranscriptItem]

@router.get("/transcript")
async def get_transcript(videoId: str):
    if not videoId:
        raise HTTPException(status_code=400, detail="videoId is required")
    try:
        transcript = await get_youtube_transcript(videoId)
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chapters")
async def create_chapters(request: ChapterRequest):
    try:
        chapters = await generate_chapters([t.dict() for t in request.transcript])
        return {"chapters": chapters}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

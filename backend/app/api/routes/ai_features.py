from fastapi import APIRouter, HTTPException
from app.schemas.ai_features import FeatureResponse, VideoIdRequest
from app.services.ai_feature_service import get_or_generate_feature

router = APIRouter()


@router.post("/video/summary")
async def create_summary(request: VideoIdRequest) -> FeatureResponse:
    if not request.videoId:
        raise HTTPException(status_code=400, detail="videoId is required")
    try:
        return await get_or_generate_feature(request.videoId, "summary")
    except Exception as e:
        error_msg = str(e)
        if "Transcript unavailable" in error_msg:
            raise HTTPException(status_code=400, detail=error_msg)
        raise HTTPException(status_code=503, detail=error_msg)


@router.post("/video/flashcards")
async def create_flashcards(request: VideoIdRequest) -> FeatureResponse:
    if not request.videoId:
        raise HTTPException(status_code=400, detail="videoId is required")
    try:
        return await get_or_generate_feature(request.videoId, "flashcards")
    except Exception as e:
        error_msg = str(e)
        if "Transcript unavailable" in error_msg:
            raise HTTPException(status_code=400, detail=error_msg)
        raise HTTPException(status_code=503, detail=error_msg)


@router.post("/video/quiz")
async def create_quiz(request: VideoIdRequest) -> FeatureResponse:
    if not request.videoId:
        raise HTTPException(status_code=400, detail="videoId is required")
    try:
        return await get_or_generate_feature(request.videoId, "quiz")
    except Exception as e:
        error_msg = str(e)
        if "Transcript unavailable" in error_msg:
            raise HTTPException(status_code=400, detail=error_msg)
        raise HTTPException(status_code=503, detail=error_msg)


@router.post("/video/notes")
async def create_notes(request: VideoIdRequest) -> FeatureResponse:
    if not request.videoId:
        raise HTTPException(status_code=400, detail="videoId is required")
    try:
        return await get_or_generate_feature(request.videoId, "notes")
    except Exception as e:
        error_msg = str(e)
        if "Transcript unavailable" in error_msg:
            raise HTTPException(status_code=400, detail=error_msg)
        raise HTTPException(status_code=503, detail=error_msg)
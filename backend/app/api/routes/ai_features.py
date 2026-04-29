from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.ai_features import FeatureResponse, VideoIdRequest
from app.services.ai_feature_service import get_or_generate_feature

router = APIRouter()


@router.post("/video/summary")
async def create_summary(request: VideoIdRequest) -> FeatureResponse:
    if not request.videoId:
        raise HTTPException(status_code=400, detail="videoId is required")
    try:
        return await get_or_generate_feature(
            request.videoId, 
            "summary",
            force_refresh=request.forceRefresh
        )
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
        return await get_or_generate_feature(
            request.videoId, 
            "flashcards",
            force_refresh=request.forceRefresh
        )
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
        return await get_or_generate_feature(
            request.videoId, 
            "quiz",
            force_refresh=request.forceRefresh
        )
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
        return await get_or_generate_feature(
            request.videoId, 
            "notes",
            force_refresh=request.forceRefresh
        )
    except Exception as e:
        error_msg = str(e)
        if "Transcript unavailable" in error_msg:
            raise HTTPException(status_code=400, detail=error_msg)
        raise HTTPException(status_code=503, detail=error_msg)


@router.post("/video/rag-query")
async def rag_query(request: VideoIdRequest):
    """
    Direct RAG query endpoint for testing and custom queries.
    Returns relevant chunks from the vector database.
    """
    if not request.videoId:
        raise HTTPException(status_code=400, detail="videoId is required")
    
    try:
        from app.services.db_service import retrieve_relevant_chunks
        
        chunks = retrieve_relevant_chunks(
            query=request.videoId,
            collection_name="transcripts",
            video_id=request.videoId,
            top_k=10
        )
        
        return {
            "videoId": request.videoId,
            "chunks": chunks,
            "count": len(chunks)
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@router.post("/video/index-transcript")
async def index_transcript(request: VideoIdRequest):
    """
    Force indexing of a video transcript into ChromaDB.
    """
    if not request.videoId:
        raise HTTPException(status_code=400, detail="videoId is required")
    
    try:
        from app.services.rag_agent_service import ContextAgent
        
        success = await ContextAgent.ensure_chunks_indexed_async(request.videoId)
        
        return {
            "videoId": request.videoId,
            "indexed": success
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.chatbot import (
    ChatRequest,
    ChatResponse,
    ConversationSummary,
    ConversationDetail,
)
from app.services.chatbot_service import (
    process_chat,
    get_user_conversations,
    get_conversation_details,
    delete_conversation,
    clear_all_conversations,
    STANDARD_REFUSAL,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Handle a user message with the Official IELTS & Study Abroad AI Advisor.
    Enforces strict topic guardrails and tracks conversation history.
    """
    if not req.message or not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty",
        )

    try:
        response_text, conv_id, title, timestamp = await process_chat(
            db=db,
            message=req.message,
            conversation_id=req.conversation_id,
            history=req.history,
            user_email=req.user_email or "",
        )

        is_off_topic = STANDARD_REFUSAL in response_text

        return ChatResponse(
            response=response_text,
            conversation_id=conv_id,
            title=title,
            timestamp=timestamp,
            is_off_topic=is_off_topic,
        )
    except Exception as e:
        logger.error(f"Chatbot endpoint error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate AI advisor response: {str(e)}",
        )


@router.get("/conversations", response_model=List[ConversationSummary])
async def list_conversations(
    user_email: str = Query("", description="User email to filter conversations"),
    db: AsyncSession = Depends(get_db),
):
    """List all saved conversations for a user."""
    try:
        return await get_user_conversations(db=db, user_email=user_email)
    except Exception as e:
        logger.error(f"Error listing conversations: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversations",
        )


@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve full messages history for a conversation."""
    detail = await get_conversation_details(db=db, conversation_id=conversation_id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    return detail


@router.delete("/conversations/{conversation_id}")
async def delete_conversation_endpoint(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a specific conversation."""
    success = await delete_conversation(db=db, conversation_id=conversation_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    return {"status": "success", "message": "Conversation deleted"}


@router.post("/conversations/clear")
async def clear_conversations_endpoint(
    user_email: str = Query(..., description="User email"),
    db: AsyncSession = Depends(get_db),
):
    """Delete all conversations for a user."""
    count = await clear_all_conversations(db=db, user_email=user_email)
    return {"status": "success", "deleted_count": count}

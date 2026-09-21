from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ChatMessage(BaseModel):
    id: Optional[str] = None
    role: str  # 'user' | 'model' | 'assistant'
    content: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    history: Optional[List[ChatMessage]] = None
    user_email: Optional[str] = ""


class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    title: str
    timestamp: str
    is_off_topic: bool = False


class ConversationSummary(BaseModel):
    conversation_id: str
    title: str
    message_count: int
    created_at: str
    updated_at: str
    last_message: Optional[str] = None


class ConversationDetail(BaseModel):
    conversation_id: str
    title: str
    messages: List[ChatMessage]
    created_at: str
    updated_at: str

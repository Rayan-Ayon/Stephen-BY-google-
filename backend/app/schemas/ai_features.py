from typing import Any, Literal, Optional
from pydantic import BaseModel


class VideoIdRequest(BaseModel):
    videoId: str
    forceRefresh: bool = False


class FlashcardItem(BaseModel):
    question: str
    answer: str
    difficulty: Literal["easy", "medium", "hard"]
    source_chunk_id: Optional[str] = None


class QuizItem(BaseModel):
    question: str
    options: list[str]
    correct: int
    source: Optional[str] = None
    source_chunk_id: Optional[str] = None


class SummaryBullet(BaseModel):
    text: str
    timestamp: Optional[str] = None


class SummaryData(BaseModel):
    paragraph: str
    bullets: list[SummaryBullet]
    sources: Optional[list[dict]] = None


class FlashcardsData(BaseModel):
    flashcards: list[FlashcardItem]


class QuizData(BaseModel):
    quiz: list[QuizItem]


class NotesData(BaseModel):
    notes: str


class FeatureResponse(BaseModel):
    cached: bool
    source: Literal["db", "generated"]
    videoId: str
    data: Any
    model: str | None = None
    createdAt: str | None = None
    context_used: int | None = None


class StreamingChunk(BaseModel):
    type: Literal["content", "done", "error"]
    content: str = ""


class ErrorResponse(BaseModel):
    error: str
    retryable: bool | None = None
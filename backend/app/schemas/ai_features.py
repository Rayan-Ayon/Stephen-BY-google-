from typing import Any, Literal
from pydantic import BaseModel


class VideoIdRequest(BaseModel):
    videoId: str


class FlashcardItem(BaseModel):
    question: str
    answer: str
    difficulty: Literal["easy", "medium", "hard"]


class QuizItem(BaseModel):
    question: str
    options: list[str]
    correct: int


class SummaryData(BaseModel):
    paragraph: str
    bullets: list[str]


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


class ErrorResponse(BaseModel):
    error: str
    retryable: bool | None = None
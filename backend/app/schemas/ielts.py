from pydantic import BaseModel
from typing import Any


class TaskCriteria(BaseModel):
    taskAchievement: float
    coherenceCohesion: float
    lexicalResource: float
    grammaticalRange: float


class GrammarCorrection(BaseModel):
    original: str
    correction: str


class ModelAnswer(BaseModel):
    en: str
    bn: str


class TaskEvaluation(BaseModel):
    band: float
    criteria: TaskCriteria
    strengths: list[str]
    improvements: list[str]
    grammarCorrections: list[GrammarCorrection]
    modelAnswer: ModelAnswer
    summary: str


class EvaluationRequest(BaseModel):
    task1Prompt: str | None = None
    task1Response: str | None = None
    task2Prompt: str | None = None
    task2Response: str | None = None
    sourceType: str = "cambridge"
    bookOrSetNumber: int = 18
    testNumber: int = 1
    moduleType: str = "academic"
    taskType: str = "full_mock"
    task1MinWords: int = 150
    task2MinWords: int = 250
    submissionId: str | None = None


class EvaluationResponse(BaseModel):
    overallBand: float
    task1: TaskEvaluation | None = None
    task2: TaskEvaluation | None = None


# ── IELTS Writing Studio & Diagnostic Schemas ──

class CriterionDetail(BaseModel):
    score: float
    feedback: str
    fixes: list[str] = []


class CriteriaScores(BaseModel):
    tr: CriterionDetail
    cc: CriterionDetail
    lr: CriterionDetail
    gra: CriterionDetail


class DiffChunk(BaseModel):
    type: str  # 'unchanged' | 'removed' | 'added'
    text: str
    explanation: str | None = None


class WritingDiagnosticRequest(BaseModel):
    essay_text: str
    task_type: str = "task2"  # 'academic_task1' | 'gt_task1' | 'task2'
    target_band: str = "9.0"  # '7.0' | '8.0' | '9.0'
    prompt_text: str | None = None


class WritingDiagnosticResponse(BaseModel):
    overall_band: float
    criteria_scores: CriteriaScores
    diff_chunks: list[DiffChunk]
    band_9_full_text: str
    high_yield_collocations: list[str]
    lexical_index: float = 0.0
    complexity_ratio: float = 0.0


class ModelAnswerSection(BaseModel):
    section_key: str  # 'overview' | 'trend_1' | 'trend_2' | 'intro_thesis' | 'body_1' | 'body_2' | 'conclusion'
    title: str
    text: str
    highlight_type: str  # 'overview' | 'thesis' | 'body' | 'conclusion'
    examiner_notes: str


class SyntacticAnnotation(BaseModel):
    feature: str  # 'Cleft Sentence' | 'Inversion' | 'Participial Phrase' | 'Discourse Marker' | 'Passive Voice'
    example: str
    explanation: str


class GenerateModelAnswerRequest(BaseModel):
    task_type: str = "task2"  # 'academic_task1' | 'gt_task1' | 'task2'
    prompt_text: str = ""
    image_base64: str | None = None
    target_band: str = "9.0"


class GenerateModelAnswerResponse(BaseModel):
    task_type: str
    prompt_summary: str
    extracted_data_trends: list[str] = []
    sections: list[ModelAnswerSection]
    why_scores_band_9: list[SyntacticAnnotation]
    key_collocations: list[str]
    full_text: str
    word_count: int


class OCRTranscribeRequest(BaseModel):
    image_base64: str
    task_type: str = "task2"


class OCRTranscribeResponse(BaseModel):
    transcribed_text: str
    detected_word_count: int
    detected_task: str | None = None

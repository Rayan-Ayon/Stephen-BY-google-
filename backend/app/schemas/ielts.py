from pydantic import BaseModel


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

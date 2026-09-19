from pydantic import BaseModel


class ProofItem(BaseModel):
    question: str
    user_answer: str
    rating: str | int
    feedback: str


class CriteriaBreakdown(BaseModel):
    score: float
    relevance: list[ProofItem]
    logical_sequencing: list[ProofItem]
    topic_development: list[ProofItem]


class LexicalBreakdown(BaseModel):
    score: float
    diversity_and_advanced_words: list[str]
    accuracy: list[str]


class GrammarBreakdown(BaseModel):
    score: float
    sentence_complexity: list[str]
    errors: list[str]


class PronunciationBreakdown(BaseModel):
    score: float
    individual_sounds: list[str]
    word_stress: list[str]
    rhythm_intonation: list[str]


class SpeakingEvaluationResponse(BaseModel):
    overallBand: float
    fluency: CriteriaBreakdown
    lexical: LexicalBreakdown
    grammar: GrammarBreakdown
    pronunciation: PronunciationBreakdown
    transcript: str
    what_you_did_well: list[str]
    areas_to_improve: list[str]

from typing import Any, Literal
from pydantic import BaseModel


class DiagnosticTokenItem(BaseModel):
    text: str
    type: Literal["filler", "grammar", "collocation", "neutral"] = "neutral"
    explanation: str | None = None
    suggestedFix: str | None = None


class QuestionEvaluationItem(BaseModel):
    part: int
    questionIndex: int
    prompt: str
    shortLabel: str = ""
    status: Literal["answered", "omitted"] = "answered"
    candidateAudioUrl: str | None = None
    durationSeconds: float = 0.0
    transcriptText: str = ""
    wordCount: int = 0
    wpm: float = 130.0
    fcScore: float = 6.5
    lrScore: float = 6.5
    graScore: float = 6.5
    prScore: float = 6.5
    phonemeCollisionsCount: int = 0
    pronunciationAccuracy: float = 88.0
    cadenceRating: str = "Natural Cadence"
    fillersCount: int = 0
    grammarSlipsCount: int = 0
    collocationsCount: int = 0
    diagnosticTokens: list[DiagnosticTokenItem] = []
    strengths: list[str] = []
    areasForGrowth: list[str] = []
    modelAnswerText: str = ""
    modelUpgrades: list[str] = []
    examinerCritique: dict[str, str] = {}


class ComprehensiveSpeakingEvaluationResponse(BaseModel):
    overallBand: float
    targetBand: float = 7.5
    targetGap: float = -1.0
    fcScore: float = 6.5
    lrScore: float = 6.5
    graScore: float = 6.5
    prScore: float = 6.5
    wpm: float = 130.0
    pronunciationAccuracy: float = 88.0
    phonemeCollisionsCount: int = 0
    cadenceRating: str = "Natural Cadence"
    questions: list[QuestionEvaluationItem] = []
    summaryFeedback: str = ""
    strengths: list[str] = []
    improvements: list[str] = []


class ProofItem(BaseModel):
    question: str = ""
    user_answer: str = ""
    rating: str | int | float = ""
    feedback: str = ""


class CriteriaBreakdown(BaseModel):
    score: float
    relevance: list[ProofItem] = []
    logical_sequencing: list[ProofItem] = []
    topic_development: list[ProofItem] = []


class LexicalBreakdown(BaseModel):
    score: float
    diversity_and_advanced_words: list[str] = []
    accuracy: list[str] = []


class GrammarBreakdown(BaseModel):
    score: float
    sentence_complexity: list[str] = []
    errors: list[str] = []


class PronunciationBreakdown(BaseModel):
    score: float
    individual_sounds: list[str] = []
    word_stress: list[str] = []
    rhythm_intonation: list[str] = []


class SubCriterionProof(BaseModel):
    score: float
    status: str = "Good"  # 'Good', 'Needs Work', 'Optimal'
    proof_text: str = ""  # Direct quote or explanation
    evidence_quote: str = ""  # Verbatim sentence spoken by candidate
    correction_or_tip: str = ""  # Specific Band 8.5+ alternative or actionable fix


class FluencySubcriteria(BaseModel):
    relevance: SubCriterionProof
    logical_sequencing: SubCriterionProof
    topic_development: SubCriterionProof


class LexicalSubcriteria(BaseModel):
    lexical_diversity: SubCriterionProof
    advanced_vocabulary: SubCriterionProof
    multi_word_expression_use: SubCriterionProof
    advanced_expression_level: SubCriterionProof
    lexical_accuracy: SubCriterionProof


class GrammarSubcriteria(BaseModel):
    sentence_complexity: SubCriterionProof
    error_free_sentences: SubCriterionProof
    tense_accuracy: SubCriterionProof


class PronunciationSubcriteria(BaseModel):
    individual_sounds: SubCriterionProof
    word_stress: SubCriterionProof
    sentence_stress_rhythm: SubCriterionProof
    intonation: SubCriterionProof


class CompleteSpeakingEvaluation(BaseModel):
    overall_band: float
    fc_score: float
    lr_score: float
    gra_score: float
    pr_score: float
    fluency_subcriteria: FluencySubcriteria
    lexical_subcriteria: LexicalSubcriteria
    grammar_subcriteria: GrammarSubcriteria
    pronunciation_subcriteria: PronunciationSubcriteria
    feedback: str = ""
    strengths: list[str] = []
    improvements: list[str] = []
    transcript: str = ""


class CorrectionItem(BaseModel):
    said: str = ""
    try_text: str = ""


class SpeakingEvaluationResponse(BaseModel):
    overallBand: float
    fc_score: float | None = None
    lr_score: float | None = None
    gra_score: float | None = None
    pr_score: float | None = None
    fcScore: float | None = None
    lrScore: float | None = None
    graScore: float | None = None
    prScore: float | None = None
    targetBand: float | None = 7.5
    targetGap: float | None = None
    wpm: float | None = None
    pronunciationAccuracy: float | None = None
    phonemeCollisionsCount: int | None = 0
    cadenceRating: str | None = "Natural Cadence"
    fluency: CriteriaBreakdown | None = None
    lexical: LexicalBreakdown | None = None
    grammar: GrammarBreakdown | None = None
    pronunciation: PronunciationBreakdown | None = None
    fluency_subcriteria: FluencySubcriteria | None = None
    lexical_subcriteria: LexicalSubcriteria | None = None
    grammar_subcriteria: GrammarSubcriteria | None = None
    pronunciation_subcriteria: PronunciationSubcriteria | None = None
    questions: list[QuestionEvaluationItem] | None = None
    transcript: str = ""
    what_you_did_well: list[str] = []
    areas_to_improve: list[str] = []
    feedback: str = ""
    strengths: list[str] = []
    improvements: list[str] = []
    corrections: list[dict[str, Any]] = []


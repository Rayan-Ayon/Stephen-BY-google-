export interface SubCriterionProof {
  score: number;
  status: 'Good' | 'Needs Work' | 'Optimal' | string;
  proofText: string;
  evidenceQuote: string;
  correctionOrTip: string;
}

export interface FluencySubcriteria {
  relevance: SubCriterionProof;
  logical_sequencing: SubCriterionProof;
  topic_development: SubCriterionProof;
}

export interface LexicalSubcriteria {
  lexical_diversity: SubCriterionProof;
  advanced_vocabulary: SubCriterionProof;
  multi_word_expression_use: SubCriterionProof;
  advanced_expression_level: SubCriterionProof;
  lexical_accuracy: SubCriterionProof;
}

export interface GrammarSubcriteria {
  sentence_complexity: SubCriterionProof;
  error_free_sentences: SubCriterionProof;
  tense_accuracy: SubCriterionProof;
}

export interface PronunciationSubcriteria {
  individual_sounds: SubCriterionProof;
  word_stress: SubCriterionProof;
  sentence_stress_rhythm: SubCriterionProof;
  intonation: SubCriterionProof;
}

export interface CompleteSpeakingEvaluation {
  overall_band: number;
  fc_score: number;
  lr_score: number;
  gra_score: number;
  pr_score: number;
  fluency_subcriteria: FluencySubcriteria;
  lexical_subcriteria: LexicalSubcriteria;
  grammar_subcriteria: GrammarSubcriteria;
  pronunciation_subcriteria: PronunciationSubcriteria;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  transcript?: string;
}

export type PersonaKey = 'mohona' | 'strict_examiner' | 'priya' | 'alex' | 'sophia' | 'noah';

export interface PersonaDefinition {
  key: PersonaKey;
  name: string;
  voice: string;
  system_instruction: string;
}

export interface QuestionExplanation {
  whyCorrect: string;
  passageEvidence: {
    section: string; // e.g., "Section B" or "Paragraph A"
    quote: string;   // Exact passage text quote
    supportingText: string; // e.g., "This exact wording supports..."
  };
  whyOthersWrong?: Array<{
    option: string;
    reason: string;
  }>;
  completionGuidance?: {
    wordLimit: string; // e.g., "ONE WORD ONLY"
    grammarNote: string;
  };
  commonTraps?: Array<{
    trapWord: string;
    explanation: string;
  }>;
  strategyTip?: string;
}

export interface ResultQuestionItem {
  id: string;
  questionNumber: number; // 1 to 40
  questionText: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  groupType: 'MATCHING_INFORMATION' | 'SUMMARY_COMPLETION' | 'SENTENCE_COMPLETION' | 'MULTIPLE_CHOICE' | 'YES_NO_NOT_GIVEN' | 'MATCHING_HEADINGS';
  explanation: QuestionExplanation;
}

export interface PassageReviewData {
  id: string;
  passageNumber: number; // 1, 2, or 3
  title: string; // e.g., "Let's Go Bats"
  difficulty: 'easy' | 'medium' | 'hard';
  passageText: Array<{
    sectionLabel: string; // "A", "B", "C", etc.
    content: string;
  }>;
  questions: ResultQuestionItem[];
}

export interface ExamResultsPayload {
  sessionId: string;
  testTitle: string; // "Cambridge IELTS 7 — Test 1"
  submittedAt: string;
  timeSpentSeconds: number;
  totalQuestions: number; // 40
  correctCount: number;
  bandScore: number; // 0.0 - 9.0
  bandLabel: string; // "Non User", "Competent User", etc.
  
  questionTypeBreakdown: Array<{
    typeLabel: string; // "Matching", "Gap Fill", "Short Answer", "Multiple Choice"
    correct: number;
    total: number;
    status: 'Needs Work' | 'Moderate' | 'Mastered';
  }>;
  
  passageBreakdown: Array<{
    passageNumber: number;
    title: string;
    correct: number;
    total: number;
    status: 'Needs Focus' | 'Good' | 'Excellent';
  }>;

  passages: PassageReviewData[];
}

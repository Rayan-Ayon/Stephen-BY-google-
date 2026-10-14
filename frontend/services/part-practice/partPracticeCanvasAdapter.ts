import { PartPracticeAttempt } from './partPracticeHistoryService';
import { WritingEvaluationCanvasProps } from '@/components/enterprise/writing/WritingEvaluationCanvas';
import { IELTSAnalysisViewProps } from '@/components/enterprise/ielts/IELTSAnalysisView';
import { ListeningAnalysisModalProps } from '@/components/enterprise/ielts/ListeningAnalysisModal';
import { SpeakingEvaluationCanvasProps } from '@/components/enterprise/speaking/SpeakingEvaluationCanvas';

/**
 * Maps single-part Writing attempts (Task 1 or Task 2) to WritingEvaluationCanvasProps
 */
export function adaptWritingPartPractice(
  attempt: PartPracticeAttempt,
  onClose: () => void,
  isModal: boolean = true
): WritingEvaluationCanvasProps {
  const partNum = (attempt as any).part ?? attempt.part_number ?? 1;
  const partTitle = (attempt as any).part_title || attempt.scoped_target || '';
  const isTask1 = partNum === 1 || partTitle.toLowerCase().includes('task 1');

  const taskEvaluation = (attempt.detailed_results as any)?.evaluation || {
    band: attempt.band_score,
    taskResponse: (attempt.detailed_results as any)?.taskResponse ?? (attempt.detailed_results as any)?.four_pillars?.ta ?? attempt.band_score,
    coherenceCohesion: (attempt.detailed_results as any)?.coherenceCohesion ?? (attempt.detailed_results as any)?.four_pillars?.cc ?? attempt.band_score,
    lexicalResource: (attempt.detailed_results as any)?.lexicalResource ?? (attempt.detailed_results as any)?.four_pillars?.lr ?? attempt.band_score,
    grammaticalRange: (attempt.detailed_results as any)?.grammaticalRange ?? (attempt.detailed_results as any)?.four_pillars?.gra ?? attempt.band_score,
    examinerFeedback: (attempt.detailed_results as any)?.feedback || (attempt.detailed_results as any)?.summary || 'Single-part practice evaluation completed.',
    corrections: (attempt.detailed_results as any)?.corrections || [],
  };

  const essayText = attempt.user_responses?.essay || attempt.user_responses?.text || attempt.detailed_results?.candidate_essay || '';
  const calculatedWordCount = attempt.user_responses?.wordCount || (essayText.trim() ? essayText.trim().split(/\s+/).length : 0);
  const timeSpent = attempt.time_spent_seconds ?? (attempt as any).duration_seconds ?? 0;
  const promptText = (attempt as any).question_text || (attempt.detailed_results as any)?.passage_title || (isTask1 ? 'Writing Task 1 Prompt' : 'Writing Task 2 Prompt');

  const tasksData = {
    task1: isTask1 ? {
      promptText,
      userResponse: essayText,
      wordCount: calculatedWordCount,
      timeSpent,
      evaluation: taskEvaluation,
    } : null,
    task2: !isTask1 ? {
      promptText,
      userResponse: essayText,
      wordCount: calculatedWordCount,
      timeSpent,
      evaluation: taskEvaluation,
    } : null,
  };

  return {
    isModal,
    attemptId: attempt.id,
    attempt: {
      id: attempt.id,
      overall_band: attempt.band_score,
      created_at: attempt.created_at,
      tasks_data: tasksData,
    },
    evaluationProp: taskEvaluation,
    onClose,
  };
}

/**
 * Maps single-passage Reading attempts (Passage 1, 2, or 3) to IELTSAnalysisViewProps
 */
export function adaptReadingPartPractice(
  attempt: PartPracticeAttempt,
  onClose: () => void,
  isModal: boolean = true
): IELTSAnalysisViewProps {
  const partTitle = (attempt as any).part_title || attempt.scoped_target || 'Single Passage Practice';
  return {
    isModal,
    attemptId: attempt.id,
    bookNumber: attempt.book_number || 17,
    testNumber: attempt.test_number || 1,
    skillModule: 'reading',
    title: `READING — ${partTitle}`,
    bandScoreProp: attempt.band_score,
    scoreProp: attempt.raw_score,
    timeSpent: attempt.time_spent_seconds ?? (attempt as any).duration_seconds ?? 0,
    answersPayload: attempt.user_responses?.answers || attempt.user_responses || {},
    onClose,
  };
}

/**
 * Maps single-part Listening attempts (Part 1, 2, 3, or 4) to ListeningAnalysisModalProps
 */
export function adaptListeningPartPractice(
  attempt: PartPracticeAttempt,
  onClose: () => void,
  isModal: boolean = true
): ListeningAnalysisModalProps {
  const partTitle = (attempt as any).part_title || attempt.scoped_target || 'Section Drill';
  return {
    isModal,
    attemptId: attempt.id,
    bookNumber: attempt.book_number || 18,
    testNumber: attempt.test_number || 1,
    testTitle: `Listening Practice — ${partTitle}`,
    bandScore: attempt.band_score,
    score: attempt.raw_score,
    totalQuestions: attempt.total_questions || 10,
    userAnswers: attempt.user_responses?.answers || attempt.user_responses || {},
    audioUrl: attempt.detailed_results?.audio_url || undefined,
    onClose,
    onExit: onClose,
  };
}

/**
 * Maps single-part Speaking attempts (Part 1, 2, or 3) to SpeakingEvaluationCanvasProps
 */
export function adaptSpeakingPartPractice(
  attempt: PartPracticeAttempt,
  onClose: () => void,
  isModal: boolean = true
): SpeakingEvaluationCanvasProps {
  const partNumber = (attempt as any).part ?? attempt.part_number ?? 1;
  const partTitle = (attempt as any).part_title || attempt.scoped_target || `Part ${partNumber}`;

  const evaluation = (attempt.detailed_results as any)?.evaluation || {
    overallBand: attempt.band_score,
    fluencyCoherence: (attempt.detailed_results as any)?.fluency ?? (attempt.detailed_results as any)?.four_pillars?.fc ?? attempt.band_score,
    lexicalResource: (attempt.detailed_results as any)?.lexical ?? (attempt.detailed_results as any)?.four_pillars?.lr ?? attempt.band_score,
    grammaticalRange: (attempt.detailed_results as any)?.grammar ?? (attempt.detailed_results as any)?.four_pillars?.gra ?? attempt.band_score,
    pronunciation: (attempt.detailed_results as any)?.pronunciation ?? (attempt.detailed_results as any)?.four_pillars?.pr ?? attempt.band_score,
    feedback: (attempt.detailed_results as any)?.feedback || 'Part practice speaking evaluation completed.',
  };

  const storedPartsData: Record<string, any> = {
    part1: { questions: [], isOmitted: partNumber !== 1 },
    part2: { isOmitted: partNumber !== 2 },
    part3: { questions: [], isOmitted: partNumber !== 3 },
  };

  const transcript = attempt.user_responses?.transcript || (attempt.detailed_results as any)?.candidate_transcript || '';
  const prompt = (attempt as any).question_text || attempt.scoped_target || `Speaking Part ${partNumber}`;

  if (partNumber === 1) {
    storedPartsData.part1.questions = (attempt.detailed_results as any)?.questions || [
      { id: 'p1_q1', text: prompt, transcript, isOmitted: false }
    ];
  } else if (partNumber === 2) {
    storedPartsData.part2 = {
      cueCard: prompt,
      transcript,
      isOmitted: false,
    };
  } else if (partNumber === 3) {
    storedPartsData.part3.questions = (attempt.detailed_results as any)?.questions || [
      { id: 'p3_q1', text: prompt, transcript, isOmitted: false }
    ];
  }

  return {
    isOpen: true,
    isModal,
    isReviewMode: true,
    attemptId: attempt.id,
    bookNumber: attempt.book_number || 17,
    testNumber: attempt.test_number || 1,
    examTitle: `Speaking Practice — ${partTitle}`,
    evaluation,
    storedPartsData,
    onClose,
    onExit: onClose,
  };
}

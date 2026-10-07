import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Filter
} from 'lucide-react';
import StudentDisputeButtonAndModal from './StudentDisputeButtonAndModal';
import { useReadingExamData, ReadingPassageItem, ReadingQuestionItem } from '@/hooks/useExamData';

export interface ReadingAnalysisModalProps {
  bookNumber?: number;
  testNumber?: number;
  attemptId?: string | number;
  userAnswers?: Record<string | number, string>;
  testTitle?: string;
  bandScore?: number;
  onClose: () => void;
  onRetake?: () => void;
}

export const ReadingAnalysisModal: React.FC<ReadingAnalysisModalProps> = ({
  bookNumber = 7,
  testNumber = 1,
  attemptId,
  userAnswers = {},
  testTitle,
  bandScore: initialBand,
  onClose,
  onRetake,
}) => {
  const displayTitle = testTitle || `Cambridge ${bookNumber} Academic Reading — Test ${testNumber}`;

  // Custom hook fetching dynamic data from Supabase
  const {
    loading,
    error,
    passages,
    questions,
    candidateAnswers,
    correctCount,
    bandScore,
    refetch,
  } = useReadingExamData({
    bookNumber,
    testNumber,
    attemptId,
    initialAnswers: userAnswers,
    testTitle: displayTitle,
  });

  const [activePassageIndex, setActivePassageIndex] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'incorrect' | 'correct' | 'unanswered'>('all');
  const [scoreViewMode, setScoreViewMode] = useState<'ai' | 'teacher'>('ai');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const activePassage: ReadingPassageItem | undefined = passages[activePassageIndex] || passages[0];

  // Filter questions for Right Panel
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (activeFilter === 'incorrect') return q.candidate_answer && !q.is_correct;
      if (activeFilter === 'correct') return q.is_correct;
      if (activeFilter === 'unanswered') return !q.candidate_answer;
      return true;
    });
  }, [questions, activeFilter]);

  const rawAiBand = bandScore || initialBand || 6.5;
  const teacherBand = Math.min(9.0, rawAiBand + 0.5);
  const displayedBand = scoreViewMode === 'teacher' ? teacherBand : rawAiBand;

  const toggleExplanation = (qNum: number) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [qNum]: !prev[qNum],
    }));
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-text"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[96vw] xl:max-w-7xl h-[94vh] flex flex-col rounded-2xl bg-[#0D0F12] border border-[#222732] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── TOP HEADER BAR ── */}
        <header className="flex-shrink-0 flex items-center justify-between gap-4 px-6 py-4 bg-[#15181E] border-b border-[#222732] flex-wrap z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0D0F12] border border-[#222732] flex items-center justify-center text-rose-500 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 bg-neutral-800/60 px-2 py-0.5 rounded border border-neutral-700/50">
                  Reading Analysis Dashboard
                </span>
                <span className="text-xs text-neutral-500">•</span>
                <span className="text-xs text-neutral-400 font-medium">Cambridge Book {bookNumber}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate mt-0.5">
                {displayTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Score & Band Metrics */}
            <div className="hidden sm:flex items-center gap-3 bg-[#0D0F12] border border-[#222732] px-3.5 py-1.5 rounded-xl">
              <div className="text-right">
                <p className="text-[10px] uppercase font-semibold text-neutral-500">Correct</p>
                <p className="text-xs font-mono font-bold text-neutral-200">
                  {correctCount} <span className="text-neutral-500">/ 40</span>
                </p>
              </div>
              <div className="h-6 w-px bg-neutral-800" />
              <div className="text-right">
                <p className="text-[10px] uppercase font-semibold text-neutral-500">Band</p>
                <p className="text-xs font-mono font-bold text-rose-400">
                  {displayedBand.toFixed(1)}
                </p>
              </div>
            </div>

            {/* Persistent Challenge / Send to Teacher Review CTA */}
            <StudentDisputeButtonAndModal
              testTitle={displayTitle}
              module="reading"
              originalBand={rawAiBand}
              rawAnswers={candidateAnswers}
              bookNumber={bookNumber}
              testNumber={testNumber}
              scoreViewMode={scoreViewMode}
              onScoreViewModeChange={setScoreViewMode}
            />

            {/* Retake Button (Optional) */}
            {onRetake && (
              <button
                onClick={onRetake}
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-[#0D0F12] border border-[#222732] text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake
              </button>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#0D0F12] border border-[#222732] text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors flex items-center justify-center cursor-pointer"
              title="Close Analysis (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── SUBHEADER: PASSAGE SWITCHER & QUESTION FILTER ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-2.5 bg-[#0D0F12] border-b border-[#222732] gap-4 flex-wrap">
          {/* Left: Passage Switcher Tabs (Passage 1, 2, 3) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 mr-1 hidden sm:inline">Passage:</span>
            {passages.map((p, idx) => {
              const isActive = idx === activePassageIndex;
              return (
                <button
                  key={p.passage_number}
                  onClick={() => setActivePassageIndex(idx)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-500/15 border-rose-500/60 text-rose-300 shadow-sm'
                      : 'bg-[#15181E] border-[#222732] text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  Passage {p.passage_number}
                </button>
              );
            })}
          </div>

          {/* Right: Question Filter Tabs (All, Incorrect, Correct, Unanswered) */}
          <div className="flex items-center gap-1.5 bg-[#15181E] p-1 rounded-lg border border-[#222732]">
            {(
              [
                { id: 'all', label: 'All 40' },
                { id: 'incorrect', label: 'Missed' },
                { id: 'correct', label: 'Correct' },
                { id: 'unanswered', label: 'Omitted' },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  activeFilter === filter.id
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN 50/50 SPLIT ANALYSIS CANVAS ── */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-[#0D0F12]">
          {/* ════════════ LEFT SPLIT PANEL: PASSAGE CANVAS (50% WIDTH) ════════════ */}
          <div className="w-full md:w-1/2 h-full flex flex-col border-b md:border-b-0 md:border-r border-[#222732] bg-[#0D0F12] overflow-hidden">
            {/* Passage Header */}
            <div className="px-6 py-4 bg-[#15181E]/60 border-b border-[#222732] flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                  Reading Passage {activePassage?.passage_number || 1}
                </p>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  {activePassage?.title || 'Passage Content'}
                </h3>
              </div>
              <span className="text-[11px] font-medium text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700/60">
                Official Passage Text
              </span>
            </div>

            {/* Passage Body Canvas (Scrollable) */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar text-neutral-300 leading-relaxed text-sm md:text-[14.5px]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-8 h-8 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                  <p className="text-xs text-neutral-400">Loading authentic passage data from Supabase...</p>
                </div>
              ) : activePassage?.passage_text ? (
                <div
                  className="prose prose-invert max-w-none space-y-4 passage-body-container"
                  dangerouslySetInnerHTML={{ __html: activePassage.passage_text }}
                />
              ) : (
                <div className="p-6 text-center text-neutral-500 text-xs">
                  No passage text available for this part.
                </div>
              )}
            </div>
          </div>

          {/* ════════════ RIGHT SPLIT PANEL: QUESTIONS & USER RESPONSES (50% WIDTH) ════════════ */}
          <div className="w-full md:w-1/2 h-full flex flex-col bg-[#0D0F12] overflow-hidden">
            {/* Feed Header */}
            <div className="px-6 py-4 bg-[#15181E]/60 border-b border-[#222732] flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  Candidate Response Feed
                </p>
                <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                  Questions & Evaluation
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700/60">
                {filteredQuestions.length} Items Listed
              </span>
            </div>

            {/* Questions Feed Canvas (Scrollable) */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-8 h-8 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                  <p className="text-xs text-neutral-400">Loading questions & responses from Supabase...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="p-8 text-center bg-[#15181E] border border-[#222732] rounded-2xl">
                  <p className="text-sm font-semibold text-neutral-300">No questions match filter "{activeFilter}"</p>
                  <p className="text-xs text-neutral-500 mt-1">Switch to "All 40" to inspect all candidate responses.</p>
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  const hasAnswer = Boolean(q.candidate_answer && q.candidate_answer.trim() !== '');
                  const isCorrect = Boolean(q.is_correct);
                  const isExpanded = Boolean(expandedExplanations[q.question_number]);

                  return (
                    <div
                      key={q.question_number}
                      className={`rounded-xl border p-5 transition-all bg-[#15181E] ${
                        !hasAnswer
                          ? 'border-[#222732]'
                          : isCorrect
                          ? 'border-emerald-500/30'
                          : 'border-rose-500/30'
                      }`}
                    >
                      {/* Question Card Header */}
                      <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#0D0F12] border border-[#222732] text-white">
                            QUESTION {q.question_number}
                          </span>
                          <span className="text-[11px] text-neutral-500 font-medium">
                            • Passage {q.passage_number}
                          </span>
                          {q.question_type && (
                            <span className="text-[10px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded font-mono">
                              {q.question_type}
                            </span>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : hasAnswer ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                              <XCircle className="w-3.5 h-3.5" /> Missed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded border border-neutral-700/60">
                              Omitted
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Instruction / Prompt */}
                      {q.instruction && (
                        <p className="text-[11px] text-neutral-500 font-serif italic mb-1.5">
                          {q.instruction}
                        </p>
                      )}
                      <p className="text-sm font-medium text-neutral-200 leading-snug mb-3">
                        {q.prompt_text}
                      </p>

                      {/* Candidate Response Box */}
                      <div className="rounded-lg bg-[#0D0F12] border border-[#222732] p-3 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-0.5">
                              Candidate Submitted Answer:
                            </span>
                            {hasAnswer ? (
                              <span className={`text-sm font-medium ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                                {q.candidate_answer}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic text-sm">
                                &#123;No answer provided&#125;
                              </span>
                            )}
                          </div>

                          {/* Correct Answer comparison if missed or omitted */}
                          {!isCorrect && q.correct_answer && (
                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-0.5">
                                Official Key:
                              </span>
                              <span className="text-xs font-mono font-bold text-neutral-200 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                                {q.correct_answer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Explanation Dropdown / Accordion */}
                      {q.explanation && (
                        <div className="mt-3 pt-2.5 border-t border-[#222732]">
                          <button
                            onClick={() => toggleExplanation(q.question_number)}
                            className="flex items-center justify-between w-full text-left text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              {isExpanded ? 'Hide Explanation & Evidence' : 'Show Explanation & Evidence'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 text-xs text-neutral-300 bg-[#0D0F12] p-3 rounded-lg border border-[#222732] leading-relaxed animate-in fade-in duration-150">
                              <p>{typeof q.explanation === 'string' ? q.explanation : (q.explanation as any)?.why_correct || (q.explanation as any)?.rationale || (q.explanation as any)?.explanation || q.explanation_text || ''}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReadingAnalysisModal;

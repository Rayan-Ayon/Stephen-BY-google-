import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  HelpCircle,
  Flag,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { ExamResultsPayload, PassageReviewData, ResultQuestionItem } from './readingResultsTypes';
import StudentDisputeButtonAndModal from '../StudentDisputeButtonAndModal';
import { useReadingExamData } from '@/hooks/useExamData';

interface ReadingExamResultsViewProps {
  results: ExamResultsPayload;
  onBack?: () => void;
  onRetake?: () => void;
}

// Obsidian Dark Enterprise UI Token Mappings
const styles = {
  kpiCard: "bg-[#15181E] rounded-2xl p-6 border border-[#222732] shadow-sm flex flex-col justify-between",
  kpiScoreText: "text-4xl font-extrabold text-rose-500",
  needsWorkBadge: "bg-rose-950/60 text-rose-400 border border-rose-800/50 font-semibold text-xs px-2.5 py-1 rounded-full",
  needsFocusBadge: "text-rose-400 font-bold text-xs flex items-center gap-1",
  explanationCard: "bg-[#0D0F12] border border-[#222732] rounded-xl p-4 shadow-sm space-y-3 mt-3",
  statusNoticeBox: "bg-[#15181E] border border-[#222732] rounded-xl p-3 text-slate-300 text-xs",
  evidenceBox: "bg-[#0D0F12] border-l-4 border-indigo-500 p-3.5 rounded-r-xl space-y-1.5 my-2 border-t border-b border-r border-[#222732]",
  evidenceQuote: "text-slate-200 font-serif italic text-xs leading-relaxed",
  strategyBox: "bg-purple-950/30 border border-purple-800/40 p-3 rounded-xl text-purple-200 text-xs leading-relaxed flex items-start gap-2.5",
  trapsBox: "bg-[#15181E] border border-[#222732] p-3 rounded-xl space-y-1.5 text-xs text-slate-300",
  highlightActive: "transition-all duration-500 bg-indigo-950/80 border border-indigo-500/80 rounded-xl p-3.5 ring-2 ring-indigo-500/50 shadow-xl text-white"
};

// Built-in vocabulary dictionary
const VOCAB_LOOKUP: Record<string, { pos: string; def: string }> = {
  bats: { pos: 'noun', def: 'Nocturnal flying mammals with forelimbs adapted as wings.' },
  navigation: { pos: 'noun', def: 'The act of accurately planning and directing a route.' },
  echolocation: { pos: 'noun', def: 'The location of objects by reflected sound, used by bats and marine mammals.' },
  nocturnal: { pos: 'adjective', def: 'Done, occurring, or active at night.' },
  radar: { pos: 'noun', def: 'A system for detecting objects by sending radio waves.' },
  sonar: { pos: 'noun', def: 'A system for detecting underwater objects by sound pulses.' },
  aqueducts: { pos: 'noun', def: 'Artificial channels built to convey water across valleys.' },
  irrigation: { pos: 'noun', def: 'The artificial supply of water to land or crops.' },
  sanitation: { pos: 'noun', def: 'Conditions relating to public health, especially the provision of clean water and sewage disposal.' },
  suggestopedia: { pos: 'noun', def: 'A pedagogical approach based on modern understanding of how the brain learns.' },
  placebo: { pos: 'noun', def: 'A substance or procedure with no intrinsic therapeutic effect, acting through psychological suggestion.' },
  peripherally: { pos: 'adverb', def: 'In a secondary or non-central manner.' }
};

export default function ReadingExamResultsView({ results, onBack, onRetake }: ReadingExamResultsViewProps) {
  // Navigation & View state
  const [selectedPassageIndex, setSelectedPassageIndex] = useState<number>(0);
  const [isPassageHidden, setIsPassageHidden] = useState<boolean>(false);
  const [vocabLookupEnabled, setVocabLookupEnabled] = useState<boolean>(false);
  const [selectedWordDef, setSelectedWordDef] = useState<{ word: string; pos: string; def: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'incorrect' | 'correct' | 'unanswered'>('all');

  // Accordion state for question explanations & distractors
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string | number, boolean>>({});
  const [expandedDistractors, setExpandedDistractors] = useState<Record<string | number, boolean>>({});

  // Scroll-sync refs
  const passageContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeHighlightSection, setActiveHighlightSection] = useState<string | null>(null);

  const extractedAnswers = useMemo(() => {
    const map: Record<number, string> = {};
    if (results?.passages) {
      results.passages.forEach((p) => {
        p.questions?.forEach((q) => {
          map[q.questionNumber] = q.userAnswer || '';
        });
      });
    }
    return map;
  }, [results?.passages]);

  // Dynamic Supabase Cambridge Data Ingestion
  const bookNum = (results as any).bookNumber || parseInt(results.testTitle?.match(/Cambridge\s*(\d+)/i)?.[1] || '7', 10);
  const testNum = (results as any).testNumber || parseInt(results.testTitle?.match(/Test\s*(\d+)/i)?.[1] || '1', 10);

  const {
    loading: supabaseLoading,
    passages: supabasePassages,
    questions: supabaseQuestions,
  } = useReadingExamData({
    bookNumber: bookNum,
    testNumber: testNum,
    attemptId: (results as any).attemptId || results.sessionId,
    initialAnswers: extractedAnswers,
    testTitle: results.testTitle,
  });

  // Effective passages: combine candidate payload and dynamic Supabase data
  const displayPassages = useMemo(() => {
    if (results?.passages && results.passages.length > 0) {
      return results.passages.map((rp, idx) => {
        const matchingSp = supabasePassages[idx];
        return {
          id: rp.id || String(rp.passageNumber),
          passageNumber: rp.passageNumber,
          title: matchingSp?.title || rp.title,
          difficulty: rp.difficulty || matchingSp?.difficulty || 'medium',
          passageText: (rp.passageText && rp.passageText.length > 0) ? rp.passageText : (matchingSp?.sections || []),
          rawHtml: matchingSp?.passage_text || '',
          questions: rp.questions || [],
        };
      });
    }
    return supabasePassages.map((sp) => ({
      id: String(sp.passage_number),
      passageNumber: sp.passage_number,
      title: sp.title,
      difficulty: sp.difficulty || 'medium',
      passageText: sp.sections || [],
      rawHtml: sp.passage_text,
      questions: [],
    }));
  }, [results?.passages, supabasePassages]);

  const activePassage = displayPassages[selectedPassageIndex] || displayPassages[0] || {
    id: '1',
    passageNumber: 1,
    title: 'Reading Passage 1',
    difficulty: 'medium',
    passageText: [],
    rawHtml: '',
    questions: [],
  };

  // Question cards for right panel: merge candidate results with Supabase explanations
  const activeQuestions = useMemo(() => {
    const fromPassage = activePassage.questions || [];
    if (fromPassage.length > 0) {
      return fromPassage.map((q) => {
        const matchingSq = supabaseQuestions.find((sq) => sq.question_number === q.questionNumber);
        return {
          id: String(q.id || q.questionNumber),
          questionNumber: q.questionNumber,
          passageNumber: activePassage.passageNumber,
          questionText: q.questionText || matchingSq?.prompt_text || `Question ${q.questionNumber}`,
          instruction: matchingSq?.instruction || '',
          groupType: q.groupType || matchingSq?.question_type || 'Reading Question',
          userAnswer: q.userAnswer || matchingSq?.candidate_answer || null,
          correctAnswer: q.correctAnswer || matchingSq?.correct_answer || '',
          isCorrect: q.isCorrect !== undefined ? q.isCorrect : !!matchingSq?.is_correct,
          whyCorrect: q.explanation?.whyCorrect || matchingSq?.explanation || 'Verified Cambridge key.',
          evidenceSection: q.explanation?.passageEvidence?.section || matchingSq?.evidence_section || `Paragraph A`,
          evidenceQuote: q.explanation?.passageEvidence?.quote || matchingSq?.evidence_quote || '',
          supportingText: q.explanation?.passageEvidence?.supportingText || '',
          whyOthersWrong: q.explanation?.whyOthersWrong || matchingSq?.why_others_wrong || [],
          commonTraps: q.explanation?.commonTraps || matchingSq?.common_traps || [],
          strategyTip: q.explanation?.strategyTip || matchingSq?.strategy_tip || '',
          completionGuidance: q.explanation?.completionGuidance || matchingSq?.completion_guidance,
        };
      });
    }

    // Fallback directly to Supabase questions for this passage
    const forThisPassage = supabaseQuestions.filter((sq) => sq.passage_number === activePassage.passageNumber);
    return forThisPassage.map((sq) => ({
      id: String(sq.question_number),
      questionNumber: sq.question_number,
      passageNumber: sq.passage_number,
      questionText: sq.prompt_text,
      instruction: sq.instruction,
      groupType: sq.question_type,
      userAnswer: sq.candidate_answer || null,
      correctAnswer: sq.correct_answer || '',
      isCorrect: !!sq.is_correct,
      whyCorrect: sq.explanation || 'Verified Cambridge key.',
      evidenceSection: sq.evidence_section || 'Paragraph A',
      evidenceQuote: sq.evidence_quote || '',
      supportingText: '',
      whyOthersWrong: sq.why_others_wrong || [],
      commonTraps: sq.common_traps || [],
      strategyTip: sq.strategy_tip || '',
      completionGuidance: sq.completion_guidance,
    }));
  }, [activePassage, supabaseQuestions]);

  // Filter questions based on filter pills
  const filteredQuestions = useMemo(() => {
    return activeQuestions.filter((q) => {
      const hasAns = q.userAnswer && q.userAnswer.trim() !== '';
      if (activeFilter === 'incorrect') return hasAns && !q.isCorrect;
      if (activeFilter === 'correct') return q.isCorrect;
      if (activeFilter === 'unanswered') return !hasAns;
      return true;
    });
  }, [activeQuestions, activeFilter]);

  // Initialize all explanations expanded by default for immediate clarity
  useEffect(() => {
    if (activeQuestions.length > 0) {
      const initialMap: Record<string | number, boolean> = {};
      activeQuestions.forEach((q) => {
        initialMap[q.id] = true;
      });
      setExpandedExplanations((prev) => ({ ...initialMap, ...prev }));
    }
  }, [activeQuestions]);

  // Review this action: smooth-scroll Left Panel to exact section & apply glow
  const handleReviewThis = (sectionKey: string, passageNumber?: number) => {
    if (passageNumber && passageNumber !== activePassage.passageNumber) {
      const targetIndex = displayPassages.findIndex((p) => p.passageNumber === passageNumber);
      if (targetIndex !== -1) {
        setSelectedPassageIndex(targetIndex);
      }
    }

    if (isPassageHidden) {
      setIsPassageHidden(false);
    }

    const cleanLetter = (sectionKey || '').replace(/[^A-Za-z]/g, '').slice(-1) || 'A';
    const normalizedKey = `Section ${cleanLetter}`;
    const altKey = `Paragraph ${cleanLetter}`;

    setTimeout(() => {
      const targetNode = sectionRefs.current[normalizedKey] || sectionRefs.current[altKey] || sectionRefs.current[sectionKey];
      if (targetNode && passageContainerRef.current) {
        targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setActiveHighlightSection(normalizedKey);
        toast.info(`Highlighted Paragraph ${cleanLetter} in the passage`);
        setTimeout(() => setActiveHighlightSection(null), 3500);
      }
    }, 100);
  };

  const handleWordClick = (word: string) => {
    if (!vocabLookupEnabled) return;
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return;

    if (VOCAB_LOOKUP[clean]) {
      setSelectedWordDef({ word: clean, ...VOCAB_LOOKUP[clean] });
    } else {
      setSelectedWordDef({
        word: clean,
        pos: 'academic vocabulary',
        def: `Contextual reading term in passage: "${clean}". Key IELTS Academic keyword.`
      });
    }
  };

  const toggleExplanation = (qId: string | number) => {
    setExpandedExplanations((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleDistractor = (qId: string | number) => {
    setExpandedDistractors((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  const accuracyPct = Math.round((results.correctCount / (results.totalQuestions || 40)) * 100);

  return (
    <div className="min-h-screen bg-[#0D0F12] text-slate-100 font-sans pb-12">
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="sticky top-0 z-30 bg-[#15181E] border-b border-[#222732] px-6 py-3.5 flex items-center justify-between shadow-sm">
        {/* Left: Breadcrumbs & Back */}
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg border border-[#222732] bg-[#0D0F12] hover:bg-[#1E232E] text-slate-300 transition-colors flex items-center justify-center cursor-pointer"
              title="Return to Reading Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span>Overview</span>
              <span>&gt;</span>
              <span className="text-slate-300">Reading</span>
              <span>&gt;</span>
              <span className="text-rose-400 font-semibold">Results Analysis</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5">
              {results.testTitle}
            </h1>
          </div>
        </div>

        {/* Right: Brand & Actions */}
        <div className="flex items-center gap-3">
          <StudentDisputeButtonAndModal
            testTitle={results.testTitle}
            module="reading"
            originalBand={results.bandScore}
            rawAnswers={extractedAnswers}
          />
          {onRetake && (
            <button
              onClick={onRetake}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#222732] bg-[#0D0F12] hover:bg-[#1E232E] text-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Test
            </button>
          )}
          <button
            onClick={() => toast.info('Quick Guide: Review each question using the independent dual-pane split view. Click "Review this →" to jump directly to passage evidence.')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-[#1E232E] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Quick guide
          </button>
          <div className="bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wider shadow-sm select-none">
            IELTS Dynasty
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ════ SECTION 1: TOP ANALYTICS KPI ROW ════ */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Band Score */}
          <div className={styles.kpiCard}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Band Score</span>
              <span className="bg-rose-950/60 text-rose-400 border border-rose-800/50 text-[11px] font-bold px-2 py-0.5 rounded-md">
                Official Scale
              </span>
            </div>
            <div className="my-1">
              <div className={styles.kpiScoreText}>
                {results.bandScore.toFixed(1)}
              </div>
              <div className="text-base font-bold text-white mt-1">
                {results.bandLabel}
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-[#222732]">
              {results.correctCount} of {results.totalQuestions} questions correct
            </p>
          </div>

          {/* Card 2: Accuracy */}
          <div className={styles.kpiCard}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accuracy Rate</span>
              <div className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="my-1">
              <div className="text-4xl font-extrabold text-white">
                {accuracyPct}%
              </div>
              <div className="text-base font-medium text-slate-300 mt-1">
                Overall Accuracy
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-[#222732]">
              {results.correctCount}/{results.totalQuestions} correct responses
            </p>
          </div>

          {/* Card 3: Time Spent */}
          <div className={styles.kpiCard}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Duration</span>
              <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/50 text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="my-1">
              <div className="text-4xl font-extrabold text-white">
                {formatDuration(results.timeSpentSeconds)}
              </div>
              <div className="text-base font-medium text-slate-300 mt-1">
                Time Elapsed
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-[#222732]">
              Exam time limit: 60 minutes
            </p>
          </div>
        </section>

        {/* ════ SECTION 2: PERFORMANCE BREAKDOWN ════ */}
        <section className="bg-[#15181E] rounded-2xl p-5 sm:p-6 border border-[#222732] shadow-sm space-y-5">
          <div className="border-b border-[#222732] pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Performance Breakdown</h2>
              <p className="text-xs text-slate-400 mt-0.5">Granular performance by question typology and individual passage sections</p>
            </div>
            {supabaseLoading && (
              <span className="text-xs text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Syncing Supabase Cambridge data...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: Question Type Breakdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Performance by Question Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.questionTypeBreakdown.map((item) => (
                  <div key={item.typeLabel} className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3.5 flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-200">{item.typeLabel}</span>
                      <span className={item.status === 'Mastered' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 font-semibold text-[10px] px-2 py-0.5 rounded-full' : styles.needsWorkBadge}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-white">{item.correct}/{item.total}</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {Math.round((item.correct / (item.total || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Passage Breakdown Progress Bars */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Breakdown by Passage</h3>
              <div className="space-y-3">
                {results.passageBreakdown.map((item) => {
                  const pct = Math.round((item.correct / (item.total || 1)) * 100);
                  return (
                    <div key={item.passageNumber} className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-white">
                          Passage {item.passageNumber}: <span className="font-normal text-indigo-300 ml-1">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.correct}/{item.total}</span>
                          <span className={item.status === 'Needs Focus' ? styles.needsFocusBadge : 'text-emerald-400 font-bold text-xs flex items-center gap-1'}>
                            {item.status === 'Needs Focus' ? '❌ Needs Focus' : '✓ Good'}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-[#1E232E] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            item.status === 'Needs Focus' ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ════ SECTION 3: UNIFIED DUAL-PANE SCROLLING ENGINE & STICKY HEADER ════ */}
        <div className="w-full flex flex-col h-[calc(100vh-140px)] overflow-hidden">
          {/* STICKY TOP CONTROL BAR */}
          <div className="shrink-0 bg-[#15181E] border border-[#222732] rounded-2xl p-4 mb-4 flex items-center justify-between z-10 flex-wrap gap-3 shadow-md">
            {/* Left: REVIEW PASSAGE Tabs with dynamic indigo titles */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 select-none">
                REVIEW PASSAGE:
              </span>
              {displayPassages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPassageIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center ${
                    selectedPassageIndex === idx
                      ? 'bg-[#1E232E] border-indigo-500/80 text-white shadow-sm ring-1 ring-indigo-500/50'
                      : 'bg-[#0D0F12] border-[#222732] text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-slate-300">Passage {p.passageNumber}:</span>
                  <span className="text-indigo-300 font-semibold ml-1.5 truncate max-w-[180px] sm:max-w-none">
                    {p.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Right: Filter Pills & Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Filter Pills from Deep Analysis */}
              <div className="flex items-center gap-1 bg-[#0D0F12] p-1 rounded-xl border border-[#222732]">
                {(
                  [
                    { id: 'all', label: `All ${activeQuestions.length}` },
                    { id: 'incorrect', label: 'Missed' },
                    { id: 'correct', label: 'Correct' },
                    { id: 'unanswered', label: 'Omitted' },
                  ] as const
                ).map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeFilter === filter.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons: Vocab Lookup & Hide Passage */}
              <button
                onClick={() => setVocabLookupEnabled((prev) => !prev)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  vocabLookupEnabled
                    ? 'bg-amber-950/50 border-amber-500/60 text-amber-300 font-bold'
                    : 'bg-[#0D0F12] border-[#222732] text-slate-300 hover:text-white'
                }`}
                title="Click any word in passage for definition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {vocabLookupEnabled ? 'Vocab Lookup: ON' : 'Click words for vocabulary'}
              </button>

              <button
                onClick={() => setIsPassageHidden((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#222732] bg-[#0D0F12] hover:bg-[#1E232E] text-slate-300 transition-colors cursor-pointer"
              >
                {isPassageHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {isPassageHidden ? 'Show passage' : 'Hide passage'}
              </button>
            </div>
          </div>

          {/* Vocabulary Definition Notification Bar */}
          {selectedWordDef && (
            <div className="mb-4 bg-amber-950/40 border border-amber-800/60 text-amber-200 p-3.5 rounded-xl flex items-start justify-between gap-4 shadow-sm animate-in fade-in">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm capitalize text-amber-300">{selectedWordDef.word}</span>
                  <span className="text-[10px] uppercase font-bold bg-amber-900/60 text-amber-300 border border-amber-700/60 px-1.5 py-0.5 rounded">
                    {selectedWordDef.pos}
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 mt-1 leading-relaxed">{selectedWordDef.def}</p>
              </div>
              <button
                onClick={() => setSelectedWordDef(null)}
                className="text-xs text-amber-400 hover:text-amber-200 font-bold px-2 py-1 rounded cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
          )}

          {/* INDEPENDENT DUAL-PANE GRID */}
          <div className="grid grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
            {/* LEFT PANEL: READING PASSAGE (Col-6) */}
            <div
              ref={passageContainerRef}
              className={`${
                isPassageHidden ? 'hidden' : 'col-span-12 lg:col-span-6'
              } h-full overflow-y-auto custom-scrollbar bg-[#15181E] border border-[#222732] rounded-2xl p-6 space-y-6`}
            >
              {/* Passage Header */}
              <div className="flex items-center justify-between border-b border-[#222732] pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{activePassage.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0D0F12] border border-[#222732] text-indigo-400 px-2 py-0.5 rounded">
                      Passage {activePassage.passageNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded">
                      {activePassage.difficulty}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-[#0D0F12] border border-[#222732] px-2.5 py-1 rounded-md">
                  Cambridge Verified
                </span>
              </div>

              {/* Passage Body: Render Paragraphs with Anchors & Highlighting */}
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-serif">
                {activePassage.passageText && activePassage.passageText.length > 0 ? (
                  activePassage.passageText.map((block) => {
                    const sectionKey = `Section ${block.sectionLabel}`;
                    const altKey = `Paragraph ${block.sectionLabel}`;
                    const isHighlighted = activeHighlightSection === sectionKey || activeHighlightSection === altKey;

                    return (
                      <div
                        key={block.sectionLabel}
                        ref={(el) => {
                          sectionRefs.current[sectionKey] = el;
                          sectionRefs.current[altKey] = el;
                        }}
                        className={`transition-all duration-500 rounded-xl p-3.5 border ${
                          isHighlighted
                            ? styles.highlightActive
                            : 'border-transparent hover:bg-[#0D0F12]/60 text-slate-300'
                        }`}
                      >
                        <span className="inline-block font-sans font-extrabold text-xs text-indigo-400 bg-indigo-950/80 border border-indigo-800/80 px-2 py-0.5 rounded mr-2.5 shadow-xs">
                          Paragraph {block.sectionLabel}
                        </span>
                        <span
                          className={vocabLookupEnabled ? 'cursor-pointer selection:bg-amber-400/30' : ''}
                          onClick={(e) => {
                            if (!vocabLookupEnabled) return;
                            const selection = window.getSelection()?.toString().trim();
                            if (selection && selection.length > 2) {
                              handleWordClick(selection);
                            }
                          }}
                        >
                          {block.content}
                        </span>
                      </div>
                    );
                  })
                ) : activePassage.rawHtml ? (
                  <div
                    className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: activePassage.rawHtml }}
                  />
                ) : (
                  <p className="text-xs text-slate-500 text-center py-10">Passage text loading from Supabase...</p>
                )}
              </div>
            </div>

            {/* RIGHT PANEL: EXPLANATIONS & EVIDENCE (Col-6 or Col-12) */}
            <div
              className={`${
                isPassageHidden ? 'col-span-12' : 'col-span-12 lg:col-span-6'
              } h-full overflow-y-auto custom-scrollbar space-y-4 pr-1`}
            >
              {filteredQuestions.length === 0 ? (
                <div className="p-8 text-center bg-[#15181E] border border-[#222732] rounded-2xl">
                  <p className="text-sm font-semibold text-slate-300">No questions match filter "{activeFilter}"</p>
                  <p className="text-xs text-slate-500 mt-1">Switch to "All" to inspect all candidate responses for this passage.</p>
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  const isExpanded = !!expandedExplanations[q.id];
                  const isDistractorExpanded = !!expandedDistractors[q.id];
                  const wasAnswered = q.userAnswer !== null && q.userAnswer !== '';

                  return (
                    <div
                      key={q.id}
                      className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 space-y-3.5 transition-all hover:border-slate-700 shadow-sm"
                    >
                      {/* Question Header & Stem */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#0D0F12] border border-[#222732] text-white">
                              QUESTION {q.questionNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {q.groupType?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          {q.instruction && (
                            <p className="text-[11px] text-slate-400 italic pt-0.5">
                              {q.instruction}
                            </p>
                          )}
                          <p className="font-medium text-sm text-slate-100 leading-snug pt-1">
                            {q.questionText}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleExplanation(q.id)}
                          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#0D0F12] transition-colors cursor-pointer shrink-0"
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Status Badges Row: User Answer & Official Key */}
                      <div className="flex items-center flex-wrap gap-2 pt-1">
                        {wasAnswered ? (
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                              q.isCorrect
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            Your answer: {q.userAnswer}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            Q{q.questionNumber} · Not answered
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-700/60">
                          Correct: {q.correctAnswer}
                        </span>
                      </div>

                      {/* EXPANDABLE EXPLANATION DRAWER */}
                      {isExpanded && (
                        <div className={styles.explanationCard}>
                          {/* Header Bar with Alert + "Review this →" Button */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                                Question {q.questionNumber} Explanation &amp; Rationale
                              </span>
                            </div>
                            <button
                              onClick={() => handleReviewThis(q.evidenceSection, q.passageNumber)}
                              className="text-xs bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                              title="Scroll Left Panel to exact paragraph"
                            >
                              Review this →
                            </button>
                          </div>

                          {/* Status Notice Box */}
                          <div className={styles.statusNoticeBox}>
                            {!wasAnswered ? (
                              <span className="text-amber-300 font-medium">⚠️ This question was left unanswered</span>
                            ) : !q.isCorrect ? (
                              <span className="text-rose-300 font-medium">⚠️ Your answer "{q.userAnswer}" was incorrect</span>
                            ) : (
                              <span className="text-emerald-400 font-medium">✓ Your answer is correct!</span>
                            )}
                          </div>

                          {/* Rationale / Why Correct */}
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white block">Why this is correct:</span>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {q.whyCorrect}
                            </p>
                          </div>

                          {/* PASSAGE EVIDENCE BLOCK */}
                          {q.evidenceQuote && (
                            <div className={styles.evidenceBox}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                                  PASSAGE EVIDENCE
                                </span>
                                <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-2 py-0.5 rounded">
                                  {q.evidenceSection}
                                </span>
                              </div>
                              <p className={styles.evidenceQuote}>
                                "{q.evidenceQuote}"
                              </p>
                              {q.supportingText && (
                                <p className="text-[11px] text-slate-400 font-medium">
                                  {q.supportingText}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Distractors Breakdown */}
                          {q.whyOthersWrong && q.whyOthersWrong.length > 0 && (
                            <div className="border border-[#222732] rounded-xl overflow-hidden bg-[#15181E]">
                              <button
                                onClick={() => toggleDistractor(q.id)}
                                className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                              >
                                <span>Why the other options are incorrect ({q.whyOthersWrong.length})</span>
                                {isDistractorExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                              {isDistractorExpanded && (
                                <div className="p-3 pt-0 space-y-2 border-t border-[#222732]">
                                  {q.whyOthersWrong.map((item, idx) => (
                                    <div key={idx} className="text-xs bg-[#0D0F12] p-2.5 rounded-lg border border-[#222732] space-y-0.5">
                                      <span className="font-bold text-rose-400">{item.option}: </span>
                                      <span className="text-slate-300">{item.reason}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Completion Guidance (for Gap Fill) */}
                          {q.completionGuidance && (
                            <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3 text-xs space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-indigo-300">Word Limit Rule:</span>
                                <span className="font-bold text-[10px] bg-indigo-900/60 text-indigo-200 border border-indigo-700/60 px-2 py-0.5 rounded">
                                  {q.completionGuidance.wordLimit}
                                </span>
                              </div>
                              <p className="text-indigo-200/80 text-[11px]">
                                {q.completionGuidance.grammarNote}
                              </p>
                            </div>
                          )}

                          {/* Common Traps */}
                          {q.commonTraps && q.commonTraps.length > 0 && (
                            <div className={styles.trapsBox}>
                              <span className="font-bold text-white block text-xs">Common Traps</span>
                              {q.commonTraps.map((trap, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-semibold text-rose-400">{trap.trapWord}: </span>
                                  <span className="text-slate-300">{trap.explanation}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Strategy Tip */}
                          {q.strategyTip && (
                            <div className={styles.strategyBox}>
                              <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block mb-0.5 text-white">Strategy Tip:</span>
                                <span>{q.strategyTip}</span>
                              </div>
                            </div>
                          )}

                          {/* Footer Report Button */}
                          <div className="pt-2 border-t border-[#222732] flex justify-end">
                            <button
                              onClick={() => toast.success(`Feedback reported for Question ${q.questionNumber}. Thank you!`)}
                              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Flag className="w-3 h-3" />
                              Report Question {q.questionNumber}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

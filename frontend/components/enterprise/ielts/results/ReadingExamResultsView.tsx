import React, { useRef, useState, useEffect } from 'react';
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
  Share2,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { ExamResultsPayload, PassageReviewData, ResultQuestionItem } from './readingResultsTypes';

interface ReadingExamResultsViewProps {
  results: ExamResultsPayload;
  onBack?: () => void;
  onRetake?: () => void;
}

// UI Token Mappings from specification
const styles = {
  kpiCard: "bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between",
  kpiScoreText: "text-4xl font-extrabold text-red-600",
  needsWorkBadge: "bg-red-50 text-red-600 font-semibold text-xs px-2.5 py-1 rounded-full",
  needsFocusBadge: "text-red-500 font-bold text-xs flex items-center gap-1",
  explanationCard: "bg-white border border-amber-200/70 rounded-2xl p-5 shadow-sm space-y-4 mt-3",
  statusNoticeBox: "bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 text-amber-900 text-xs",
  evidenceBox: "bg-red-50/30 border-l-4 border-red-400 p-4 rounded-r-xl space-y-1.5 my-2",
  evidenceQuote: "text-gray-900 font-serif italic text-sm leading-relaxed",
  strategyBox: "bg-purple-50/50 border border-purple-100 p-3.5 rounded-xl text-purple-900 text-xs leading-relaxed flex items-start gap-2.5",
  trapsBox: "bg-gray-50 border border-gray-200/80 p-3.5 rounded-xl space-y-2 text-xs text-gray-700",
  highlightActive: "transition-all duration-500 bg-yellow-200/70 rounded-lg p-2 -m-2 ring-2 ring-yellow-400 shadow-md"
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
  hydropower: { pos: 'noun', def: 'Hydroelectric power derived from moving water.' },
  aquifers: { pos: 'noun', def: 'Underground permeable rock layers containing water.' },
  suggestopedia: { pos: 'noun', def: 'A learning method utilizing peripheral suggestion and music.' },
  placebo: { pos: 'noun', def: 'A substance or technique functioning through belief rather than inherent physical efficacy.' },
  peripherally: { pos: 'adverb', def: 'In a secondary or non-central manner.' }
};

export default function ReadingExamResultsView({ results, onBack, onRetake }: ReadingExamResultsViewProps) {
  // Navigation & View state
  const [selectedPassageIndex, setSelectedPassageIndex] = useState<number>(0);
  const [isPassageHidden, setIsPassageHidden] = useState<boolean>(false);
  const [vocabLookupEnabled, setVocabLookupEnabled] = useState<boolean>(false);
  const [selectedWordDef, setSelectedWordDef] = useState<{ word: string; pos: string; def: string } | null>(null);

  // Accordion state for question explanations & distractors
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [expandedDistractors, setExpandedDistractors] = useState<Record<string, boolean>>({});

  // Scroll-sync refs
  const passageContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeHighlightSection, setActiveHighlightSection] = useState<string | null>(null);

  const activePassage = results.passages[selectedPassageIndex] || results.passages[0];

  // Initialize all explanations expanded by default for immediate clarity
  useEffect(() => {
    if (activePassage) {
      const initialMap: Record<string, boolean> = {};
      activePassage.questions.forEach((q) => {
        initialMap[q.id] = true;
      });
      setExpandedExplanations((prev) => ({ ...initialMap, ...prev }));
    }
  }, [activePassage]);

  // Formatter for elapsed time: e.g. "0m 04s" or "45m 12s"
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  const accuracyPct = Math.round((results.correctCount / (results.totalQuestions || 40)) * 100);

  // Review this action: smooth-scroll Left Panel to exact section & apply glow
  const handleReviewThis = (sectionKey: string, passageNumber?: number) => {
    // If the referenced section is in a different passage, switch passage first
    if (passageNumber && passageNumber !== activePassage.passageNumber) {
      const targetIndex = results.passages.findIndex((p) => p.passageNumber === passageNumber);
      if (targetIndex !== -1) {
        setSelectedPassageIndex(targetIndex);
      }
    }

    // Ensure the passage panel is visible
    if (isPassageHidden) {
      setIsPassageHidden(false);
    }

    // Normalized section key lookup
    const normalizedKey = sectionKey.startsWith('Section ') || sectionKey.startsWith('Paragraph ')
      ? sectionKey
      : `Section ${sectionKey}`;

    setTimeout(() => {
      const targetNode = sectionRefs.current[normalizedKey] || sectionRefs.current[sectionKey];
      if (targetNode && passageContainerRef.current) {
        targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setActiveHighlightSection(normalizedKey);
        toast.info(`Highlighted ${normalizedKey} in the reading passage`);
        setTimeout(() => setActiveHighlightSection(null), 3500);
      } else {
        // Fallback: search for first section matching letter
        const letter = sectionKey.replace(/[^A-Za-z]/g, '');
        const fallbackNode = sectionRefs.current[`Section ${letter}`] || sectionRefs.current[`Paragraph ${letter}`];
        if (fallbackNode) {
          fallbackNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setActiveHighlightSection(`Section ${letter}`);
          setTimeout(() => setActiveHighlightSection(null), 3500);
        }
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

  const toggleExplanation = (qId: string) => {
    setExpandedExplanations((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleDistractor = (qId: string) => {
    setExpandedDistractors((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-20">
      {/* ── TOP NAVIGATION BAR ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
        {/* Left: Breadcrumbs & Back */}
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors flex items-center justify-center cursor-pointer"
              title="Return to Reading Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span>Overview</span>
              <span>&gt;</span>
              <span className="text-gray-700">Reading</span>
              <span>&gt;</span>
              <span className="text-blue-600 font-semibold">Results</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
              {results.testTitle} — Results
            </h1>
          </div>
        </div>

        {/* Right: Brand & Actions */}
        <div className="flex items-center gap-3">
          {onRetake && (
            <button
              onClick={onRetake}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Test
            </button>
          )}
          <button
            onClick={() => toast.info('Quick Guide: Review each question using the split explanation panel. Click "Review this" to jump directly to passage evidence.')}
            className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Quick guide
          </button>
          <div className="bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wider shadow-2xs select-none">
            IELTSly
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* ════ SECTION 1: TOP ANALYTICS KPI ROW ════ */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Band Score */}
          <div className={styles.kpiCard}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Band Score</span>
              <span className="bg-red-50 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
                Official Scale
              </span>
            </div>
            <div className="my-2">
              <div className={styles.kpiScoreText}>
                {results.bandScore.toFixed(1)}
              </div>
              <div className="text-base font-bold text-gray-800 mt-1">
                {results.bandLabel}
              </div>
            </div>
            <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              {results.correctCount} of {results.totalQuestions} questions correct
            </p>
          </div>

          {/* Card 2: Accuracy */}
          <div className={styles.kpiCard}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Accuracy Rate</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-4xl font-extrabold text-gray-900">
                {accuracyPct}%
              </div>
              <div className="text-base font-medium text-gray-600 mt-1">
                Overall Accuracy
              </div>
            </div>
            <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              {results.correctCount}/{results.totalQuestions} correct responses
            </p>
          </div>

          {/* Card 3: Time Spent */}
          <div className={styles.kpiCard}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Duration</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-4xl font-extrabold text-gray-900">
                {formatDuration(results.timeSpentSeconds)}
              </div>
              <div className="text-base font-medium text-gray-600 mt-1">
                Time Elapsed
              </div>
            </div>
            <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
              Exam time limit: 60 minutes
            </p>
          </div>
        </section>

        {/* ════ SECTION 2: PERFORMANCE BREAKDOWN SECTION ════ */}
        <section className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900">Performance Breakdown</h2>
            <p className="text-xs text-gray-500 mt-0.5">Granular performance by question typology and individual passage sections</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Col: 2x2 Question Type Breakdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Performance by Question Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {results.questionTypeBreakdown.map((item) => (
                  <div key={item.typeLabel} className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-800">{item.typeLabel}</span>
                      <span className={item.status === 'Mastered' ? 'bg-green-50 text-green-700 font-semibold text-xs px-2.5 py-1 rounded-full' : styles.needsWorkBadge}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-gray-900">{item.correct}/{item.total}</span>
                      <span className="text-xs text-gray-500 font-medium">
                        {Math.round((item.correct / (item.total || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Passage Breakdown Progress Bars */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Breakdown by Passage</h3>
              <div className="space-y-4">
                {results.passageBreakdown.map((item) => {
                  const pct = Math.round((item.correct / (item.total || 1)) * 100);
                  return (
                    <div key={item.passageNumber} className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-gray-900">
                          Passage {item.passageNumber}: <span className="font-normal text-gray-600">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{item.correct}/{item.total}</span>
                          <span className={item.status === 'Needs Focus' ? styles.needsFocusBadge : 'text-green-600 font-bold text-xs flex items-center gap-1'}>
                            {item.status === 'Needs Focus' ? '❌ Needs Focus' : '✓ Good'}
                          </span>
                        </div>
                      </div>
                      {/* Visual progress track */}
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            item.status === 'Needs Focus' ? 'bg-red-500' : 'bg-green-500'
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

          {/* Full-width Score Summary Ratio Bar */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
              <span className="text-green-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                {results.correctCount} correct
              </span>
              <span className="text-red-600 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-red-500" />
                {results.totalQuestions - results.correctCount} incorrect / unanswered
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-red-100 overflow-hidden flex">
              <div
                className="bg-green-500 h-full transition-all duration-700"
                style={{ width: `${(results.correctCount / (results.totalQuestions || 40)) * 100}%` }}
              />
              <div
                className="bg-red-400 h-full transition-all duration-700"
                style={{ width: `${((results.totalQuestions - results.correctCount) / (results.totalQuestions || 40)) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* ════ SECTION 3: SPLIT-SCREEN QUESTION & PASSAGE REVIEW ENGINE ════ */}
        <section className="space-y-4">
          {/* Passage Selector Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-2">Review Passage:</span>
              {results.passages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPassageIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedPassageIndex === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Passage {p.passageNumber}: {p.title}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVocabLookupEnabled((prev) => !prev)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  vocabLookupEnabled
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
                title="Click any word in passage for definition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {vocabLookupEnabled ? 'Vocab Lookup: ON' : 'Click words for vocabulary'}
              </button>
              <button
                onClick={() => setIsPassageHidden((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
              >
                {isPassageHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {isPassageHidden ? 'Show passage' : 'Hide passage'}
              </button>
            </div>
          </div>

          {/* Interactive Vocabulary Definition Modal / Floating Pill */}
          {selectedWordDef && (
            <div className="bg-amber-50 border border-amber-200 text-amber-950 p-4 rounded-xl flex items-start justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm capitalize text-amber-900">{selectedWordDef.word}</span>
                  <span className="text-[10px] uppercase font-bold bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-800">
                    {selectedWordDef.pos}
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">{selectedWordDef.def}</p>
              </div>
              <button
                onClick={() => setSelectedWordDef(null)}
                className="text-xs text-amber-700 hover:text-amber-950 font-bold px-2 py-1 rounded cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
          )}

          {/* 50% / 50% Split Grid */}
          <div className={`grid grid-cols-1 ${isPassageHidden ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-6 items-start`}>
            {/* ── LEFT PANEL: PASSAGE VIEWER (50%) ── */}
            {!isPassageHidden && (
              <div
                ref={passageContainerRef}
                className="sticky top-20 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar space-y-6"
              >
                {/* Passage Header Controls */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{activePassage.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Passage {activePassage.passageNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded">
                        {activePassage.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Passage Text Blocks with Scroll-Sync Refs */}
                <div className="space-y-6 text-sm text-gray-800 leading-relaxed font-serif">
                  {activePassage.passageText.map((block) => {
                    const sectionKey = `Section ${block.sectionLabel}`;
                    const isHighlighted = activeHighlightSection === sectionKey || activeHighlightSection === `Paragraph ${block.sectionLabel}`;
                    return (
                      <div
                        key={block.sectionLabel}
                        ref={(el) => {
                          sectionRefs.current[sectionKey] = el;
                          sectionRefs.current[`Paragraph ${block.sectionLabel}`] = el;
                        }}
                        className={`transition-all duration-500 rounded-xl p-3 ${
                          isHighlighted ? styles.highlightActive : 'hover:bg-gray-50/50'
                        }`}
                      >
                        <span className="inline-block font-sans font-extrabold text-sm text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded mr-2.5">
                          {block.sectionLabel}
                        </span>
                        <span
                          className={vocabLookupEnabled ? 'cursor-pointer selection:bg-amber-200' : ''}
                          onClick={(e) => {
                            if (!vocabLookupEnabled) return;
                            const target = e.target as HTMLElement;
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
                  })}
                </div>
              </div>
            )}

            {/* ── RIGHT PANEL: EXPLANATION ENGINE (50%) ── */}
            <div className="space-y-6">
              {/* Question Group Header */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Questions {activePassage.questions[0]?.questionNumber}–{activePassage.questions[activePassage.questions.length - 1]?.questionNumber}
                  </h3>
                  <span className="text-xs font-bold text-gray-700">
                    {activePassage.questions.filter((q) => q.isCorrect).length}/{activePassage.questions.length} Correct
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Review each question's detailed rationale, passage evidence quotation, distractor trap analysis, and exam strategy.
                </p>
              </div>

              {/* Question Cards List */}
              <div className="space-y-5">
                {activePassage.questions.map((q) => {
                  const isExpanded = !!expandedExplanations[q.id];
                  const isDistractorExpanded = !!expandedDistractors[q.id];
                  const wasAnswered = q.userAnswer !== null && q.userAnswer !== '';

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3 transition-all hover:border-gray-200"
                    >
                      {/* Question Header & Stem */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                            Question {q.questionNumber} · {q.groupType.replace(/_/g, ' ')}
                          </div>
                          <p className="font-semibold text-sm text-gray-900 leading-snug">
                            {q.questionText}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleExplanation(q.id)}
                          className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Status Badges Row: User Answer & Correct Answer */}
                      <div className="flex items-center flex-wrap gap-2 pt-1">
                        {wasAnswered ? (
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                              q.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {q.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            Your answer: {q.userAnswer}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                            Q{q.questionNumber} · Not answered
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          Correct: {q.correctAnswer}
                        </span>
                      </div>

                      {/* ── EXPANDABLE EXPLANATION CARD ── */}
                      {isExpanded && (
                        <div className={styles.explanationCard}>
                          {/* Header Bar with Alert + "Review this" Button */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span className="font-bold text-sm text-gray-900">
                                Question {q.questionNumber} explanation
                              </span>
                            </div>
                            <button
                              onClick={() => handleReviewThis(q.explanation.passageEvidence.section, activePassage.passageNumber)}
                              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="Scroll Left Panel to exact section"
                            >
                              Review this →
                            </button>
                          </div>

                          {/* Status Warning Notice Box */}
                          <div className={styles.statusNoticeBox}>
                            {!wasAnswered ? (
                              <span>⚠️ This question was unanswered</span>
                            ) : !q.isCorrect ? (
                              <span>⚠️ Your answer "{q.userAnswer}" was incorrect</span>
                            ) : (
                              <span className="text-green-800">✓ Your answer is correct!</span>
                            )}
                          </div>

                          {/* Why this is correct */}
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-gray-900 block">Why this is correct:</span>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {q.explanation.whyCorrect}
                            </p>
                          </div>

                          {/* PASSAGE EVIDENCE CARD */}
                          <div className={styles.evidenceBox}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold tracking-wider text-red-600 uppercase">
                                Passage Evidence
                              </span>
                              <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                {q.explanation.passageEvidence.section}
                              </span>
                            </div>
                            <p className={styles.evidenceQuote}>
                              "{q.explanation.passageEvidence.quote}"
                            </p>
                            <p className="text-[11px] text-gray-600 font-medium">
                              {q.explanation.passageEvidence.supportingText}
                            </p>
                          </div>

                          {/* Collapsible: Why the other options are wrong */}
                          {q.explanation.whyOthersWrong && q.explanation.whyOthersWrong.length > 0 && (
                            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                              <button
                                onClick={() => toggleDistractor(q.id)}
                                className="w-full px-3.5 py-2 text-xs font-bold text-gray-800 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <span>Why the other options are wrong ({q.explanation.whyOthersWrong.length})</span>
                                {isDistractorExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                              {isDistractorExpanded && (
                                <div className="p-3.5 border-t border-gray-200 space-y-2 text-xs text-gray-700 bg-white">
                                  {q.explanation.whyOthersWrong.map((dist, dIdx) => (
                                    <div key={dIdx} className="space-y-0.5">
                                      <span className="font-bold text-red-600">{dist.option}: </span>
                                      <span>{dist.reason}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Completion Guidance (for Gap Fill / Summary) */}
                          {q.explanation.completionGuidance && (
                            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-xs space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-blue-900">Word Limit Rule:</span>
                                <span className="font-bold text-[10px] bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded">
                                  {q.explanation.completionGuidance.wordLimit}
                                </span>
                              </div>
                              <p className="text-blue-800 text-[11px]">
                                {q.explanation.completionGuidance.grammarNote}
                              </p>
                            </div>
                          )}

                          {/* Common Traps Box */}
                          {q.explanation.commonTraps && q.explanation.commonTraps.length > 0 && (
                            <div className={styles.trapsBox}>
                              <span className="font-bold text-gray-800 block text-xs">Common traps</span>
                              {q.explanation.commonTraps.map((trap, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-semibold text-red-600">{trap.trapWord}: </span>
                                  <span>{trap.explanation}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Strategy Tip Box */}
                          {q.explanation.strategyTip && (
                            <div className={styles.strategyBox}>
                              <Lightbulb className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block mb-0.5">Strategy:</span>
                                <span>{q.explanation.strategyTip}</span>
                              </div>
                            </div>
                          )}

                          {/* Footer Report Button */}
                          <div className="pt-2 border-t border-gray-100 flex justify-end">
                            <button
                              onClick={() => toast.success(`Feedback reported for Question ${q.questionNumber}. Thank you!`)}
                              className="text-[11px] text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Flag className="w-3 h-3" />
                              Report Question {q.questionNumber}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

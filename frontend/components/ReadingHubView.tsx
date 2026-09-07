import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import IELTSReadingExam from './enterprise/ielts/IELTSReadingExam';
import ModuleHistorySection from './enterprise/history/ModuleHistorySection';

// ── Data Constants ──────────────────────────────────────────────────────────

interface TestSeries {
  id: string;
  label: string;
  setLabel: string;
  testCount: number;
  badge?: string;
  group: 'mock' | 'cambridge';
}

const MOCK_SERIES: TestSeries[] = [
  { id: 'mock-1', label: 'IELTSly Mock Series 1', setLabel: 'SET 1', testCount: 4, group: 'mock' },
  { id: 'mock-2', label: 'IELTSly Mock Series 2', setLabel: 'SET 2', testCount: 4, group: 'mock' },
  { id: 'mock-3', label: 'IELTSly Mock Series 3', setLabel: 'SET 3', testCount: 4, group: 'mock' },
  { id: 'mock-4', label: 'IELTSly Mock Series 4', setLabel: 'SET 4', testCount: 4, badge: 'LATEST', group: 'mock' },
];

const CAMBRIDGE_SERIES: TestSeries[] = Array.from({ length: 15 }, (_, i) => ({
  id: `cambridge-${i + 7}`,
  label: `Cambridge IELTS ${i + 7}`,
  setLabel: `BOOK ${i + 7}`,
  testCount: 4,
  group: 'cambridge' as const,
}));

const DIFFICULTY_MAP: Record<number, { label: string; className: string }> = {
  0: { label: 'Easy', className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  1: { label: 'Medium', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  2: { label: 'Medium', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  3: { label: 'Medium', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
};

// ── Icon Components ─────────────────────────────────────────────────────────

const BookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const BarChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

// ── Accordion Card Component ────────────────────────────────────────────────

interface AccordionCardProps {
  series: TestSeries;
  isExpanded: boolean;
  onToggle: () => void;
  onSubTestClick: (seriesId: string, testIndex: number) => void;
}

const AccordionCard: React.FC<AccordionCardProps> = ({ series, isExpanded, onToggle, onSubTestClick }) => {
  return (
    <div
      className={`bg-[#141519] border rounded-2xl p-4 md:p-5 transition-all cursor-pointer shadow-sm ${
        isExpanded
          ? 'border-blue-500/30 shadow-lg shadow-blue-500/5'
          : 'border-zinc-800/80 hover:border-zinc-700'
      }`}
      onClick={onToggle}
    >
      {/* Collapsed Row */}
      <div className="flex items-center justify-between">
        {/* Left: Badge + Title */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-950/40 border border-blue-500/30 text-blue-400 font-bold text-xs w-12 h-12 rounded-2xl flex flex-col items-center justify-center leading-tight">
            <span>{series.setLabel.split(' ')[0]}</span>
            <span>{series.setLabel.split(' ')[1]}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{series.label}</h3>
              {series.badge && (
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {series.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
              ~ 0/{series.testCount} done
              <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </p>
          </div>
        </div>

        {/* Right: Test Count + Chevron */}
        <div className="flex items-center gap-3">
          <span className="bg-blue-950/30 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-xl">
            {series.testCount} Tests
          </span>
          <div className={`p-1.5 rounded-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDownIcon className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Expanded: 2x2 Sub-Test Grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-4 border-t border-zinc-800/60">
          {Array.from({ length: series.testCount }, (_, i) => {
            const diff = DIFFICULTY_MAP[i] || DIFFICULTY_MAP[1];
            const testNum = String(i + 1).padStart(2, '0');
            return (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); onSubTestClick(series.id, i); }}
                className="bg-[#0F1013] border border-zinc-800/60 hover:border-blue-500/40 rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-zinc-800/80 text-zinc-300 text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                    {testNum}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {testNum} Reading Test
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${diff.className}`}>
                        {diff.label}
                      </span>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        60 min
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-zinc-600 group-hover:text-blue-400 transition-colors text-lg font-light">
                  →
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────

interface ReadingHubViewProps {
  userEmail?: string;
}

export default function ReadingHubView({ userEmail }: ReadingHubViewProps) {
  const [viewMode, setViewMode] = useState<'hub' | 'history'>('hub');
  const [activeTab, setActiveTab] = useState<'academic' | 'general'>('academic');
  const [expandedSeriesId, setExpandedSeriesId] = useState<string | null>(null);
  const [showExam, setShowExam] = useState<boolean>(false);
  const customGradingRef = useRef<HTMLDivElement>(null);

  const handleSubTestClick = (seriesId: string, testIndex: number) => {
    sessionStorage.setItem('reading_exam_series', seriesId);
    sessionStorage.setItem('reading_exam_index', String(testIndex));
    setShowExam(true);
  };

  const handleToggleAccordion = (id: string) => {
    setExpandedSeriesId((prev) => (prev === id ? null : id));
  };

  const scrollToCustomGrading = () => {
    customGradingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Exam Mode ────────────────────────────────────────────────────────────
  if (showExam) {
    return (
      <div className="h-[calc(100vh-32px)] bg-[#F2F2F2] flex flex-col overflow-hidden">
        <div className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setShowExam(false)}
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Reading Hub
          </button>
          <div className="h-4 w-px bg-zinc-200" />
          <span className="text-sm text-zinc-400">
            {sessionStorage.getItem('reading_exam_series') || 'Reading Exam'}
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <IELTSReadingExam
            candidateEmail={userEmail}
            onActiveChange={() => {}}
            exitPulse={false}
          />
        </div>
      </div>
    );
  }

  // ── History Mode ─────────────────────────────────────────────────────────
  if (viewMode === 'history') {
    return (
      <div className="h-[calc(100vh-32px)] bg-[#0B0C0E] flex flex-col overflow-hidden">
        <div className="px-6 py-4 flex items-center gap-4 flex-shrink-0 border-b border-zinc-800/80">
          <button
            onClick={() => setViewMode('hub')}
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Reading Hub
          </button>
          <div className="h-4 w-px bg-zinc-800" />
          <h2 className="text-lg font-bold text-white">Reading History & Performance Analytics</h2>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <ModuleHistorySection moduleType="reading" />
        </div>
      </div>
    );
  }

  // ── Hub Mode (Main View) ─────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-32px)] bg-[#0B0C0E] text-zinc-100 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* ── Top Header Row ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          {/* Segmented Tab Selector */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-1 rounded-full flex gap-1">
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'academic'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'general'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              General Training
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToCustomGrading}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer transition-all"
            >
              <SparklesIcon className="w-4 h-4 text-amber-400" />
              Custom AI
            </button>
            <button
              onClick={() => setViewMode('history')}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer transition-all"
            >
              <BarChartIcon className="w-4 h-4 text-blue-400" />
              History Matrix
            </button>
          </div>
        </div>

        {/* ── General Training Empty State ───────────────────────────────── */}
        {activeTab === 'general' && (
          <div className="bg-[#141519] border border-zinc-800/80 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-zinc-800/50 p-4 rounded-2xl mb-4">
              <ClockIcon className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">General Training Tests Coming Soon</h3>
            <p className="text-sm text-zinc-400 max-w-md">
              Academic IELTS tests are currently available. General Training reading passages and question sets are under active development.
            </p>
          </div>
        )}

        {/* ── Academic Content ───────────────────────────────────────────── */}
        {activeTab === 'academic' && (
          <>
            {/* ── Hero Banner ───────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-[#171A21] via-[#13151B] to-[#121622] border border-zinc-800/80 rounded-3xl p-6 md:p-8 flex justify-between items-center relative overflow-hidden shadow-xl">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-xl">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                  Cambridge IELTS Academic
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-2">
                  Reading Practice
                </h1>
                <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
                  Sharpen comprehension with authentic Cambridge passages. 3 texts, 40 questions, timed to real exam conditions.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full">
                    19 Cambridge Books
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full">
                    60 min per test
                  </span>
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1 rounded-full">
                    Auto scored
                  </span>
                </div>
              </div>

              {/* Right Icon */}
              <div className="hidden md:flex bg-blue-600/20 border border-blue-500/30 p-5 rounded-2xl shadow-lg shadow-blue-500/10 relative z-10 flex-shrink-0 ml-8">
                <BookIcon className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* ── IELTSLY MOCK TESTS ────────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                  IELTSLY Mock Tests
                </h2>
                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {MOCK_SERIES.length}
                </span>
              </div>
              <div className="space-y-3">
                {MOCK_SERIES.map((series) => (
                  <AccordionCard
                    key={series.id}
                    series={series}
                    isExpanded={expandedSeriesId === series.id}
                    onToggle={() => handleToggleAccordion(series.id)}
                    onSubTestClick={handleSubTestClick}
                  />
                ))}
              </div>
            </section>

            {/* ── CAMBRIDGE TESTS ───────────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                  Cambridge Tests
                </h2>
                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {CAMBRIDGE_SERIES.length}
                </span>
              </div>
              <div className="space-y-3">
                {CAMBRIDGE_SERIES.map((series) => (
                  <AccordionCard
                    key={series.id}
                    series={series}
                    isExpanded={expandedSeriesId === series.id}
                    onToggle={() => handleToggleAccordion(series.id)}
                    onSubTestClick={handleSubTestClick}
                  />
                ))}
              </div>
            </section>

            {/* ── Custom Question Grading ───────────────────────────────── */}
            <section ref={customGradingRef} id="custom-grading-section" className="mt-8">
              <div className="bg-[#141416] border border-amber-900/30 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <SparklesIcon className="w-6 h-6 text-amber-400" />
                      Custom Question Grading
                    </h2>
                    <p className="text-sm text-zinc-400 mt-2 max-w-lg leading-relaxed">
                      Bring your own IELTS writing/reading prompt, upload the chart or diagram when needed, and get the same AI grading as the mock.
                    </p>
                  </div>
                  <button
                    onClick={() => toast.info('Custom AI Reading Grading is in private beta.')}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-red-500/20 whitespace-nowrap flex-shrink-0"
                  >
                    Start Custom Grading
                  </button>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0F1013] border border-zinc-800/60 rounded-xl p-4">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      Academic Task 1 with image-aware grading for charts, maps, and diagrams.
                    </p>
                  </div>
                  <div className="bg-[#0F1013] border border-zinc-800/60 rounded-xl p-4">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      General Task 1 letter prompts with the same task-response scoring flow.
                    </p>
                  </div>
                  <div className="bg-[#0F1013] border border-zinc-800/60 rounded-xl p-4">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      Task 2 essay prompts with async grading and the usual writing results page.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

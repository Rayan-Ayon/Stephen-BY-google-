import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import IELTSWritingExam from './enterprise/ielts/IELTSWritingExam';
import WritingHistoryMatrix from './enterprise/writing/WritingHistoryMatrix';

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

type WritingMode = 'full_mock' | 'task_2' | 'task_1_academic' | 'task_1_general';

const WRITING_MODES: { key: WritingMode; label: string; timeMinutes: number; sectionLabel: string }[] = [
  { key: 'full_mock', label: 'Full Mock Test', timeMinutes: 60, sectionLabel: 'Writing — Full Mock' },
  { key: 'task_2', label: 'Task 2', timeMinutes: 40, sectionLabel: 'Task 2 Checker' },
  { key: 'task_1_academic', label: 'Task 1 Academic', timeMinutes: 20, sectionLabel: 'Task 1 Academic Checker' },
  { key: 'task_1_general', label: 'Task 1 General', timeMinutes: 20, sectionLabel: 'Task 1 General Checker' },
];

const DIFFICULTY_MAP: Record<number, { label: string; className: string }> = {
  0: { label: 'Easy', className: 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-400' },
  1: { label: 'Medium', className: 'bg-amber-950/40 border border-amber-500/30 text-amber-400' },
  2: { label: 'Medium', className: 'bg-amber-950/40 border border-amber-500/30 text-amber-400' },
  3: { label: 'Hard', className: 'bg-rose-950/40 border border-rose-500/30 text-rose-400' },
};

// ── Icon Components ─────────────────────────────────────────────────────────

const PenIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
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

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
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
          ? 'border-amber-500/30 shadow-lg shadow-amber-500/5'
          : 'border-zinc-800/80 hover:border-zinc-700'
      }`}
      onClick={onToggle}
    >
      {/* Collapsed Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-amber-950/40 border border-amber-600/30 text-amber-500 font-bold text-xs w-12 h-12 rounded-2xl flex flex-col items-center justify-center leading-tight">
            <span>{series.setLabel.split(' ')[0]}</span>
            <span>{series.setLabel.split(' ')[1]}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{series.label}</h3>
              {series.badge && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {series.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              ~ 0/{series.testCount} done
              <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-zinc-800/80 text-amber-500 text-xs px-3 py-1 rounded-full font-semibold">
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
                className="bg-[#18191E] border border-zinc-800 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between transition-all cursor-pointer group min-h-[100px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-zinc-800/80 text-zinc-300 text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center">
                      {testNum}
                    </span>
                    <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                      {testNum} Writing Test
                    </p>
                  </div>
                  <span className="text-zinc-600 group-hover:text-amber-400 transition-colors text-lg font-light">
                    →
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${diff.className}`}>
                    {diff.label}
                  </span>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    60 min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────────────────────

interface WritingHubViewProps {
  userEmail?: string;
}

export default function WritingHubView({ userEmail }: WritingHubViewProps) {
  const [viewMode, setViewMode] = useState<'hub' | 'history'>('hub');
  const [activeTab, setActiveTab] = useState<'academic' | 'general'>('academic');
  const [writingMode, setWritingMode] = useState<WritingMode>('full_mock');
  const [expandedSeriesId, setExpandedSeriesId] = useState<string | null>(null);
  const [showExam, setShowExam] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const customGradingRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleModeChange = (mode: WritingMode) => {
    setWritingMode(mode);
    if (mode === 'task_1_academic' && activeTab !== 'academic') {
      setActiveTab('academic');
    } else if (mode === 'task_1_general' && activeTab !== 'general') {
      setActiveTab('general');
    }
    setDropdownOpen(false);
  };

  const handleSubTestClick = (seriesId: string, testIndex: number) => {
    sessionStorage.setItem('writing_exam_series', seriesId);
    sessionStorage.setItem('writing_exam_index', String(testIndex));
    sessionStorage.setItem('writing_exam_mode', writingMode);
    setShowExam(true);
  };

  const handleToggleAccordion = (id: string) => {
    setExpandedSeriesId((prev) => (prev === id ? null : id));
  };

  const scrollToCustomGrading = () => {
    customGradingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const modeConfig = WRITING_MODES.find((m) => m.key === writingMode) || WRITING_MODES[0];

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
            Back to Writing Hub
          </button>
          <div className="h-4 w-px bg-zinc-200" />
          <span className="text-sm text-zinc-400">
            {sessionStorage.getItem('writing_exam_series') || 'Writing Exam'} — {modeConfig.sectionLabel}
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <IELTSWritingExam
            candidateEmail={userEmail}
            simulation={{
              sectionLabel: modeConfig.sectionLabel,
              timeLimitSeconds: modeConfig.timeMinutes * 60,
              onComplete: () => setShowExam(false),
            }}
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
            Back to Writing Hub
          </button>
          <div className="h-4 w-px bg-zinc-800" />
          <h2 className="text-lg font-bold text-white">Writing History</h2>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <WritingHistoryMatrix />
        </div>
      </div>
    );
  }

  // ── Hub Mode (Main View) ─────────────────────────────────────────────────
  return (
    <div className="h-[calc(100vh-32px)] bg-[#0B0C0E] text-zinc-100 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* ── Top Header Row ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Segmented Tab Selector */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-1 rounded-full flex items-center">
            <button
              onClick={() => setActiveTab('academic')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'academic'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Academic
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'general'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              General Training
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Custom AI Button */}
            <button
              onClick={scrollToCustomGrading}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-full px-4 py-2 text-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <SparklesIcon className="w-4 h-4 text-amber-400" />
              Custom AI
            </button>

            {/* History Matrix Button */}
            <button
              onClick={() => setViewMode('history')}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-full px-4 py-2 text-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <BarChartIcon className="w-4 h-4 text-amber-400" />
              Writing History
            </button>

            {/* Writing Mode Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-full px-4 py-2 text-sm flex items-center gap-2 cursor-pointer font-medium transition-all"
              >
                {modeConfig.label}
                <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#141519] border border-zinc-800/80 rounded-xl shadow-2xl shadow-black/50 py-1.5 z-50">
                  {WRITING_MODES.map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => handleModeChange(mode.key)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                        writingMode === mode.key
                          ? 'bg-amber-500/10 text-amber-400 font-medium'
                          : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                      }`}
                    >
                      <span>{mode.label}</span>
                      <span className="text-[11px] text-zinc-500">{mode.timeMinutes}m</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Hero Banner ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#1C1613] via-[#171412] to-[#121316] border border-amber-900/30 rounded-3xl p-6 md:p-8 flex items-center justify-between relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <span className="text-amber-500 text-xs font-semibold tracking-wider uppercase">
              {activeTab === 'academic' ? 'Cambridge IELTS Academic' : 'Cambridge IELTS General Training'}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2 mb-2">
              Writing
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl mb-6">
              Master Task 1 & Task 2 with AI-powered band score feedback. Instant grading, detailed criteria breakdown.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full px-3 py-1 text-xs font-medium">
                19 Cambridge Books
              </span>
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full px-3 py-1 text-xs font-medium">
                60 min per test
              </span>
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full px-3 py-1 text-xs font-medium">
                AI band score graded
              </span>
            </div>
          </div>

          {/* Right Icon */}
          <div className="hidden md:flex bg-amber-950/40 border border-amber-600/30 w-28 h-28 md:w-32 md:h-32 rounded-3xl items-center justify-center shadow-lg shadow-amber-950/50 relative z-10 flex-shrink-0 ml-8">
            <PenIcon className="w-12 h-12 text-amber-500" />
          </div>
        </div>

        {/* ── IELTSLY MOCK TESTS (Academic Only) ────────────────────────── */}
        {activeTab === 'academic' && (
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
        )}

        {/* ── CAMBRIDGE TESTS ───────────────────────────────────────────── */}
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

        {/* ── Custom Question Grading ───────────────────────────────────── */}
        <section ref={customGradingRef} id="custom-grading-section" className="mt-12">
          <div className="bg-[#141416] border border-amber-900/30 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <SparklesIcon className="w-6 h-6 text-amber-400" />
                  Custom Question Grading
                </h2>
                <p className="text-sm text-zinc-400 mt-2 max-w-lg leading-relaxed">
                  Bring your own IELTS writing prompt, upload the chart or diagram when needed, and get the same AI grading as the writing mock.
                </p>
              </div>
              <button
                onClick={() => toast.info('Custom AI Writing Grading is in private beta.')}
                className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-bold rounded-xl px-6 py-3 transition-all shadow-lg shadow-red-500/20 whitespace-nowrap flex-shrink-0"
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
      </div>
    </div>
  );
}

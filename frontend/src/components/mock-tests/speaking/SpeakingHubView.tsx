import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import SpeakingExamWorkspace from './SpeakingExamWorkspace';
import ModuleHistorySection from '@/components/enterprise/history/ModuleHistorySection';
import ExamLauncherFlow from '@/components/onboarding/ExamLauncherFlow';

// ── Data Constants ──────────────────────────────────────────────────────────

interface TestSeries {
    id: string;
    label: string;
    setLabel: string;
    testCount: number;
    badge?: string;
    group: 'mock' | 'cambridge';
    bookNumber: number;
}

// Academic: Mock Tests 1 through 4
const ACADEMIC_MOCK_SERIES: TestSeries[] = [
    { id: 'mock-1', label: 'IELTS Dynasty Mock Series 1', setLabel: 'SET 1', testCount: 4, group: 'mock', bookNumber: 1 },
    { id: 'mock-2', label: 'IELTS Dynasty Mock Series 2', setLabel: 'SET 2', testCount: 4, group: 'mock', bookNumber: 2 },
    { id: 'mock-3', label: 'IELTS Dynasty Mock Series 3', setLabel: 'SET 3', testCount: 4, group: 'mock', bookNumber: 3 },
    { id: 'mock-4', label: 'IELTS Dynasty Mock Series 4', setLabel: 'SET 4', testCount: 4, badge: 'LATEST', group: 'mock', bookNumber: 4 },
];

// Academic: Cambridge Books 7 through 21 (15 books)
const ACADEMIC_CAMBRIDGE_SERIES: TestSeries[] = Array.from({ length: 15 }, (_, i) => ({
    id: `cambridge-${i + 7}`,
    label: `Cambridge IELTS ${i + 7}`,
    setLabel: `BOOK ${i + 7}`,
    testCount: 4,
    group: 'cambridge' as const,
    bookNumber: i + 7,
}));

// General Training: Cambridge Books 7 through 20 (14 books)
const GT_CAMBRIDGE_SERIES: TestSeries[] = Array.from({ length: 14 }, (_, i) => ({
    id: `gt-cambridge-${i + 7}`,
    label: `Cambridge IELTS ${i + 7} (GT)`,
    setLabel: `BOOK ${i + 7}`,
    testCount: 4,
    group: 'cambridge' as const,
    bookNumber: i + 7,
}));

const DIFFICULTY_MAP: Record<number, { label: string; className: string }> = {
    0: { label: 'Easy', className: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[11px] px-2.5 py-0.5 rounded-md font-semibold' },
    1: { label: 'Medium', className: 'bg-amber-950/60 text-amber-400 border border-amber-800/40 text-[11px] px-2.5 py-0.5 rounded-md font-semibold' },
    2: { label: 'Medium', className: 'bg-amber-950/60 text-amber-400 border border-amber-800/40 text-[11px] px-2.5 py-0.5 rounded-md font-semibold' },
    3: { label: 'Hard', className: 'bg-rose-950/60 text-rose-400 border border-rose-800/40 text-[11px] px-2.5 py-0.5 rounded-md font-semibold' },
};

// ── Icons ───────────────────────────────────────────────────────────────────

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

const MicrophoneIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
);

// ── Accordion Card Component ────────────────────────────────────────────────

interface AccordionCardProps {
    series: TestSeries;
    isExpanded: boolean;
    onToggle: () => void;
    onSubTestClick: (series: TestSeries, testIndex: number) => void;
}

const AccordionCard: React.FC<AccordionCardProps> = ({ series, isExpanded, onToggle, onSubTestClick }) => {
    return (
        <div
            className={`bg-[#141519] border rounded-2xl p-4 md:p-5 transition-all cursor-pointer shadow-sm ${
                isExpanded
                    ? 'border-purple-500/30 shadow-lg shadow-purple-500/5'
                    : 'border-zinc-800/80 hover:border-zinc-700'
            }`}
            onClick={onToggle}
        >
            {/* Collapsed Row */}
            <div className="flex items-center justify-between">
                {/* Left: Badge + Title */}
                <div className="flex items-center gap-4">
                    <div className="bg-purple-950/40 border border-purple-500/30 text-purple-400 font-bold text-xs w-12 h-12 rounded-2xl flex flex-col items-center justify-center leading-tight">
                        <span>{series.setLabel.split(' ')[0]}</span>
                        <span>{series.setLabel.split(' ')[1]}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{series.label}</h3>
                            {series.badge && (
                                <span className="bg-purple-900/80 text-purple-300 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ml-2">
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
                    <span className="bg-purple-950/30 border border-purple-500/30 text-purple-400 text-xs font-semibold px-3 py-1.5 rounded-xl">
                        {series.testCount} Tests
                    </span>
                    <div className={`p-1.5 rounded-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDownIcon className="w-4 h-4 text-zinc-500" />
                    </div>
                </div>
            </div>

            {/* Expanded: 2x2 Sub-Test Grid */}
            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#0F1012] border-t border-zinc-800/80 rounded-b-xl mt-4">
                    {Array.from({ length: series.testCount }, (_, i) => {
                        const diff = DIFFICULTY_MAP[i] || DIFFICULTY_MAP[1];
                        const testNum = String(i + 1).padStart(2, '0');
                        return (
                            <div
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSubTestClick(series, i);
                                }}
                                className="bg-[#141519] border border-zinc-800 hover:border-purple-500/50 rounded-xl p-4 flex items-center justify-between transition-all duration-200 cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-300 font-bold flex items-center justify-center shrink-0">
                                        {testNum}
                                    </span>
                                    <div>
                                        <p className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                                            Speaking Test
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={diff.className}>
                                                {diff.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-zinc-400 group-hover:text-purple-400 font-medium flex items-center gap-1 transition-colors">
                                    <ClockIcon className="w-3 h-3" />
                                    ~15 min
                                    <span className="text-zinc-600 group-hover:text-purple-400 ml-1">→</span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ── Main SpeakingHubView Component ──────────────────────────────────────────

export interface SpeakingHubViewProps {
    userEmail?: string;
    onExamStateChange?: (active: boolean) => void;
}

export const SpeakingHubView: React.FC<SpeakingHubViewProps> = ({ userEmail, onExamStateChange }) => {
    const [viewMode, setViewMode] = useState<'hub' | 'history'>('hub');
    const [activeTab, setActiveTab] = useState<'academic' | 'general'>('academic');
    const [expandedSeriesId, setExpandedSeriesId] = useState<string | null>(null);

    // Active Exam Workspace Launch State (Eliminates intermediate start screens)
    const [showExam, setShowExam] = useState<boolean>(false);
    const [examSourceType, setExamSourceType] = useState<'cambridge' | 'mock_series'>('cambridge');
    const [examBookNumber, setExamBookNumber] = useState<number>(7);
    const [examTestNumber, setExamTestNumber] = useState<number>(1);
    const [examCategory, setExamCategory] = useState<'academic' | 'general'>('academic');

    const customGradingRef = useRef<HTMLDivElement>(null);

    /**
     * Direct test launch: clicking a test immediately loads SpeakingExamWorkspace
     * with the selected book and test number, completely bypassing any intermediate screens.
     */
    const handleSubTestClick = (series: TestSeries, testIndex: number) => {
        sessionStorage.setItem('speaking_exam_series', series.id);
        sessionStorage.setItem('speaking_exam_index', String(testIndex));

        setExamCategory(activeTab);
        setExamSourceType(series.group === 'mock' ? 'mock_series' : 'cambridge');
        setExamBookNumber(series.bookNumber);
        setExamTestNumber(testIndex + 1);

        setShowExam(true);
        onExamStateChange?.(true);
    };

    const handleExitExam = () => {
        setShowExam(false);
        onExamStateChange?.(false);
    };

    const handleToggleAccordion = (id: string) => {
        setExpandedSeriesId((prev) => (prev === id ? null : id));
    };

    const scrollToCustomGrading = () => {
        customGradingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // ── Active Exam Workspace with Pre-Exam Onboarding ───────────────────────
    if (showExam) {
        return (
            <ExamLauncherFlow
                module="speaking"
                sourceType={examSourceType}
                category={examCategory}
                bookNumber={examBookNumber}
                testNumber={examTestNumber}
                onExit={handleExitExam}
            >
                <div className="flex-1 h-full w-full bg-[#0B0C0E] overflow-hidden">
                    <SpeakingExamWorkspace
                        candidateEmail={userEmail}
                        sourceType={examSourceType}
                        bookNumber={examBookNumber}
                        testNumber={examTestNumber}
                        category={examCategory}
                        onExit={handleExitExam}
                        onActiveChange={onExamStateChange}
                    />
                </div>
            </ExamLauncherFlow>
        );
    }

    // ── History Mode ─────────────────────────────────────────────────────────
    if (viewMode === 'history') {
        return (
            <div className="h-full bg-[#0B0C0E] flex flex-col overflow-hidden">
                <div className="px-6 py-4 flex items-center gap-4 flex-shrink-0 border-b border-zinc-800/80">
                    <button
                        onClick={() => setViewMode('hub')}
                        className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Speaking Studio
                    </button>
                    <div className="h-4 w-px bg-zinc-800" />
                    <span className="text-lg font-bold text-white">Speaking History</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto p-6">
                    <ModuleHistorySection moduleType="speaking" />
                </div>
            </div>
        );
    }

    // ── Hub Dashboard Mode ───────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0B0C0E] p-6 text-white">
            <div className="max-w-5xl mx-auto">
                {/* ── Top Control Bar ─────────────────────────────────────────── */}
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                    {/* General / Academic Toggle Switch */}
                    <div className="bg-[#141519] border border-zinc-800 p-1 rounded-xl flex gap-1">
                        <button
                            onClick={() => setActiveTab('academic')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'academic'
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Academic
                        </button>
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === 'general'
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            General Training
                        </button>
                    </div>

                    {/* Custom AI Button */}
                    <button
                        onClick={scrollToCustomGrading}
                        className="bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-700/50 rounded-xl px-4 py-1.5 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                        ✨ Custom AI
                    </button>

                    {/* History Matrix Button */}
                    <button
                        onClick={() => setViewMode('history')}
                        className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 rounded-xl px-4 py-1.5 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                        📊 History Matrix
                    </button>
                </div>

                {/* ── Hero Banner ─────────────────────────────────────────────── */}
                <div className="bg-gradient-to-r from-purple-950/40 via-[#141519] to-purple-950/20 border border-purple-900/30 rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />

                    <div className="relative z-10 max-w-xl">
                        <span className="text-purple-400 text-xs font-mono tracking-wider font-semibold uppercase">
                            {activeTab === 'academic' ? 'CAMBRIDGE IELTS ACADEMIC' : 'CAMBRIDGE IELTS GENERAL TRAINING'}
                        </span>
                        <h1 className="text-4xl font-black text-white mt-1 mb-2 tracking-tight">
                            Speaking Studio
                        </h1>
                        <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
                            Practice real IELTS Speaking tests across Parts 1, 2, and 3. Select any test to immediately start speaking with authentic cue cards, prep timers, and AI band evaluations.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-purple-900/50 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-700/40 font-medium flex items-center gap-1.5">
                                {activeTab === 'academic' ? 'Cambridge 7–21 (15 Books)' : 'Cambridge 7–20 (14 Books)'}
                            </span>
                            {activeTab === 'academic' && (
                                <span className="bg-purple-900/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-800/40 font-medium flex items-center gap-1.5">
                                    Mock Tests 1–4
                                </span>
                            )}
                            <span className="bg-purple-900/30 text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-800/40 font-medium flex items-center gap-1.5">
                                ~15 min per test
                            </span>
                        </div>
                    </div>

                    <div className="w-24 h-24 rounded-2xl bg-purple-900/30 border border-purple-700/40 flex items-center justify-center relative shadow-inner shrink-0 hidden sm:flex">
                        <div className="absolute inset-2 border-2 border-dashed border-purple-600/30 rounded-xl" />
                        <MicrophoneIcon className="w-10 h-10 text-purple-400 relative z-10" />
                    </div>
                </div>

                {/* ── Academic Content: Mock Series + Cambridge 7 through 21 ────── */}
                {activeTab === 'academic' && (
                    <>
                        {/* Mock Tests 1-4 */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                                    IELTS Dynasty Mock Tests
                                </h2>
                                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    {ACADEMIC_MOCK_SERIES.length}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {ACADEMIC_MOCK_SERIES.map((s) => (
                                    <AccordionCard
                                        key={s.id}
                                        series={s}
                                        isExpanded={expandedSeriesId === s.id}
                                        onToggle={() => handleToggleAccordion(s.id)}
                                        onSubTestClick={handleSubTestClick}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Cambridge Tests 7 through 21 */}
                        <section className="mt-8">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                                    Cambridge Tests (Academic)
                                </h2>
                                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    {ACADEMIC_CAMBRIDGE_SERIES.length} Books (7–21)
                                </span>
                            </div>
                            <div className="space-y-3">
                                {ACADEMIC_CAMBRIDGE_SERIES.map((s) => (
                                    <AccordionCard
                                        key={s.id}
                                        series={s}
                                        isExpanded={expandedSeriesId === s.id}
                                        onToggle={() => handleToggleAccordion(s.id)}
                                        onSubTestClick={handleSubTestClick}
                                    />
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {/* ── General Training Content: Cambridge Books 7 through 20 ───── */}
                {activeTab === 'general' && (
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                                Cambridge Tests (General Training)
                            </h2>
                            <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                {GT_CAMBRIDGE_SERIES.length} Books (7–20)
                            </span>
                        </div>
                        <div className="space-y-3">
                            {GT_CAMBRIDGE_SERIES.map((s) => (
                                <AccordionCard
                                    key={s.id}
                                    series={s}
                                    isExpanded={expandedSeriesId === s.id}
                                    onToggle={() => handleToggleAccordion(s.id)}
                                    onSubTestClick={handleSubTestClick}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Custom Speaking Grading Section ───────────────────────────── */}
                <section ref={customGradingRef} id="custom-speaking-section" className="mt-8">
                    <div className="bg-gradient-to-r from-purple-950/30 via-[#141519] to-purple-950/20 border border-purple-800/40 rounded-2xl p-6 relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    ✨ Custom Speaking Grading
                                </h2>
                                <p className="text-zinc-400 text-xs max-w-xl mt-1 leading-relaxed">
                                    Bring your own Part 2 cue-card prompt, record one long-turn response, and receive instant AI speaking band evaluation and criterion feedback.
                                </p>
                            </div>
                            <button
                                onClick={() => toast.info('Custom AI Speaking Grading is in private beta.')}
                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer text-sm shrink-0"
                            >
                                Start Custom Speaking
                            </button>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-300 leading-relaxed">
                                Custom Part 2 cue-card prompt with official prep timer and recording flow.
                            </div>
                            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-300 leading-relaxed">
                                Audio evaluated by official IELTS band descriptors via Google Gemini.
                            </div>
                            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 text-xs text-zinc-300 leading-relaxed">
                                Detailed scoring breakdown across Fluency, Lexical, Grammar, and Pronunciation.
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SpeakingHubView;

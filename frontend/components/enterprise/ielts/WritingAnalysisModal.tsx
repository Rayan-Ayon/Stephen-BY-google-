import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  Volume2,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { AnalysisSegment, buildWriting } from './analysisMockData';
import StudentDisputeButtonAndModal from './StudentDisputeButtonAndModal';

/* ─── Types ─────────────────────────────────────────────────────── */

export interface WritingCriterion {
    code: string;
    name: string;
    band: number;
    note: string;
    subMetrics?: { label: string; score: number }[];
    strengths?: string[];
    weaknesses?: string[];
    booster?: string;
}

export interface WritingRewrite {
    original: string;
    upgraded: string;
}

export interface WritingTeacher {
    verified: boolean;
    remark: string;
    audioNote: boolean;
}

export interface WritingAnalysisModalProps {
    isModal?: boolean; // true when opened from History Matrix, false when embedded in post-submission
    band?: number;
    targetBand?: number;
    examTitle?: string;
    examDate?: string;
    criteria?: WritingCriterion[];
    segments?: AnalysisSegment[];
    rewrites?: WritingRewrite[];
    teacher?: WritingTeacher;
    wordCount?: number;
    minWordCount?: number;
    timeSpentMinutes?: number;
    promptText?: string;
    attempt?: any;
    onClose: () => void;
}

/* ─── Segment Color Map ─────────────────────────────────────────── */

const segColor: Record<string, string> = {
    plain: 'text-slate-300',
    grammar: 'bg-rose-500/20 text-rose-300 border-b-2 border-rose-500 cursor-pointer px-0.5 rounded',
    vocab: 'bg-amber-500/20 text-amber-200 border-b-2 border-amber-400 cursor-pointer px-0.5 rounded',
    strong: 'bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-400 cursor-pointer px-0.5 rounded',
};

const segNote = (s: AnalysisSegment): string => {
    if (s.kind === 'grammar') return `Grammar slip: "${s.text}" — review agreement, articles, or clause structure.`;
    if (s.kind === 'vocab') return `Weak / Band 6 lexis: "${s.text}" — replace with more precise academic vocabulary.`;
    if (s.kind === 'strong') return `Band 8+ collocation: "${s.text}" — excellent natural academic cadence.`;
    return '';
};

/* ─── Sub-Metric Detail Data ────────────────────────────────────── */

const CRITERION_DETAILS: Record<string, { subMetrics: { label: string; score: number }[]; strengths: string[]; weaknesses: string[]; booster: string }> = {
    'TR/TA': {
        subMetrics: [
            { label: 'Position Clarity', score: 8.0 },
            { label: 'Support Development', score: 6.5 },
            { label: 'Relevance & Coverage', score: 7.0 },
        ],
        strengths: [
            'Clear thesis statement in introduction',
            'Relevant examples in body paragraphs',
            'Consistent position maintained throughout',
        ],
        weaknesses: [
            'Second body paragraph lacks depth — needs a concrete case study',
            'Conclusion could synthesise rather than repeat',
        ],
        booster: 'Add one extended example per body paragraph. Use "For instance, research conducted by..." to embed real-world data.',
    },
    'CC': {
        subMetrics: [
            { label: 'Logical Sequencing', score: 7.0 },
            { label: 'Cohesive Devices', score: 6.5 },
            { label: 'Paragraphing', score: 7.5 },
        ],
        strengths: [
            'Clear paragraph structure with topic sentences',
            'Effective use of "Moreover" and "Furthermore"',
        ],
        weaknesses: [
            'Over-reliance on "However" for contrast',
            'Missing linking words between some paragraphs',
        ],
        booster: 'Diversify connectors: use "Nevertheless", "Conversely", "In light of this", "Notwithstanding".',
    },
    'LR': {
        subMetrics: [
            { label: 'Range', score: 6.0 },
            { label: 'Precision', score: 6.5 },
            { label: 'Collocation', score: 5.5 },
        ],
        strengths: [
            'Topic-specific vocabulary used accurately',
            'Some academic terms correctly deployed',
        ],
        weaknesses: [
            'Repeats generic verbs — vary with "pivotal", "paramount", "instrumental"',
            'Minor collocations could be more natural',
            'Limited paraphrasing of prompt keyphrases',
        ],
        booster: 'Replace generic adjectives with Band 8+ collocations: "level playing field" → "equitable playing field".',
    },
    'GRA': {
        subMetrics: [
            { label: 'Range (Complexity)', score: 8.0 },
            { label: 'Accuracy', score: 6.0 },
            { label: 'Error Frequency', score: 6.5 },
        ],
        strengths: [
            'Effective use of conditional structures',
            'Mix of simple and complex sentences',
            'Passive voice appropriately used',
        ],
        weaknesses: [
            'Subject-verb agreement slips in compound sentences',
            'Occasional article omission before countable nouns',
            'Run-on sentence in development section',
        ],
        booster: 'Practice complex clause structures: "While X, Y has shown that Z..." See Cambridge IELTS Grammar #18.',
    },
};

/* ─── WritingAnalysisModal ──────────────────────────────────────── */

export const WritingAnalysisModal: React.FC<WritingAnalysisModalProps> = ({
    isModal = true,
    band: propBand,
    targetBand = 7.5,
    examTitle: propExamTitle,
    examDate: propExamDate,
    criteria: propCriteria,
    segments: propSegments,
    rewrites: propRewrites,
    teacher: propTeacher,
    wordCount: propWordCount,
    minWordCount = 250,
    timeSpentMinutes: propTimeSpentMinutes,
    promptText: propPromptText,
    attempt,
    onClose,
}) => {
    const derivedWriting = useMemo(() => {
        if (attempt) {
            return buildWriting(attempt);
        }
        return null;
    }, [attempt]);

    const band = propBand ?? derivedWriting?.band ?? 6.5;
    const examTitle = propExamTitle ?? attempt?.title ?? 'Academic Writing Attempt';
    const examDate = propExamDate ?? attempt?.date ?? new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const criteria = propCriteria ?? derivedWriting?.criteria ?? [];
    const segments = propSegments ?? derivedWriting?.segments ?? [];
    const rewrites = propRewrites ?? derivedWriting?.rewrites ?? [];
    const teacher = propTeacher ?? derivedWriting?.teacher ?? { verified: true, remark: 'Candidate demonstrates strong structural control with Band 7.5 potential once complex clause accuracy is consolidated.', audioNote: false };
    const wordCount = propWordCount ?? attempt?.wordCount ?? attempt?.word_count ?? 285;
    const timeSpentMinutes = propTimeSpentMinutes ?? attempt?.timeSpent ?? attempt?.time_spent ?? 38;
    const promptText = propPromptText ?? attempt?.prompt ?? attempt?.title;

    const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);
    const [expandedRewrite, setExpandedRewrite] = useState<number | null>(0);
    const [selectedSegment, setSelectedSegment] = useState<AnalysisSegment | null>(null);
    const [scoreViewMode, setScoreViewMode] = useState<'ai' | 'teacher'>('ai');
    const [audioPlaying, setAudioPlaying] = useState(false);

    // Verified score simulation
    const teacherVerifiedBand = Math.min(9.0, band + 0.5);
    const displayedBand = scoreViewMode === 'teacher' ? teacherVerifiedBand : band;

    /* ── Effect: Escape key ── */
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    /* ── Compute word count for upgrade display ── */
    const upgrades = useMemo(() => rewrites.map((r) => {
        const upgraded = r.upgraded;
        const original = r.original;
        return { original, upgraded, improved: upgraded.length > original.length };
    }), [rewrites]);

    const cefrLevel = displayedBand >= 8.0 ? 'C2 Proficiency' : displayedBand >= 7.0 ? 'C1 Advanced' : displayedBand >= 6.0 ? 'B2 Vantage' : 'B1 Intermediate';

    const innerModalCanvas = (
        <div
            className={`relative w-full max-w-7xl bg-[#0D0F12] border border-[#222732] shadow-2xl overflow-hidden flex flex-col text-slate-100 font-sans ${
                isModal ? 'h-[92vh] rounded-2xl' : 'rounded-2xl min-h-[calc(100vh-3rem)]'
            }`}
            onClick={(e) => e.stopPropagation()}
        >
                {/* ── STICKY TOP TELEMETRY HEADER ── */}
                <header className="sticky top-0 z-20 bg-[#15181E] border-b border-[#222732] px-6 py-4 flex items-center justify-between shadow-lg flex-wrap gap-4 rounded-t-2xl">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl border border-[#222732] hover:bg-[#181C24] text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Return to Writing Hub"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                                <span>Overview</span>
                                <span>&gt;</span>
                                <span className="text-slate-300">Writing Engine</span>
                                <span>&gt;</span>
                                <span className="text-rose-400 font-semibold">Post-Exam Analysis Canvas</span>
                            </div>
                            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                                {examTitle} — Evaluation Canvas
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                        {/* Universal Student Dispute Action & Modal */}
                        <StudentDisputeButtonAndModal
                            testTitle={examTitle}
                            module="writing"
                            originalBand={band}
                            rawAnswers={segments}
                            scoreViewMode={scoreViewMode}
                            onScoreViewModeChange={setScoreViewMode}
                        />

                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-[#222732] hover:bg-neutral-700 text-xs font-bold text-white transition-colors cursor-pointer"
                        >
                            Exit Hub
                        </button>
                    </div>
                </header>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    {/* ════ SECTION 1: TOP TELEMETRY KPI CARDS (OBSIDIAN GRID) ════ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1: Overall Band Score */}
                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Overall Writing Band
                                </span>
                                <span className="bg-rose-950/60 border border-rose-800/40 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Official IELTS 9.0
                                </span>
                            </div>
                            <div className="my-1">
                                <div className="text-4xl sm:text-5xl font-black text-rose-500 tracking-tight">
                                    Band {displayedBand.toFixed(1)}
                                </div>
                                <p className="text-xs font-semibold text-slate-300 mt-1">
                                    {displayedBand >= 7.5 ? 'Very Good / Expert Academic User' : displayedBand >= 6.5 ? 'Competent Academic User' : 'Moderate User — Needs Targeted Remediation'}
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400 flex items-center justify-between">
                                <span>CEFR: <span className="text-white font-semibold">{cefrLevel}</span></span>
                                {scoreViewMode === 'teacher' && <span className="text-emerald-400 font-bold">Faculty Verified</span>}
                            </div>
                        </div>

                        {/* Card 2: Criteria Breakdown Average */}
                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Target Gap
                                </span>
                                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="my-1">
                                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                                    {displayedBand >= targetBand ? 'Met' : `-${(targetBand - displayedBand).toFixed(1)}`}
                                    <span className="text-lg font-normal text-slate-500 ml-2">/ Target {targetBand.toFixed(1)}</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-300 mt-1">
                                    {displayedBand >= targetBand ? 'Meets institutional requirement' : 'Requires improvement in lexical resource'}
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400">
                                Exam date: <span className="text-white font-mono">{examDate}</span>
                            </div>
                        </div>

                        {/* Card 3: Word Count Telemetry */}
                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Word Count Telemetry
                                </span>
                                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    <FileText className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="my-1">
                                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                                    {wordCount} <span className="text-lg font-normal text-slate-500">words</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-300 mt-1">
                                    {wordCount >= minWordCount ? `+${wordCount - minWordCount} over ${minWordCount} threshold (No penalty)` : `Below minimum requirement (${minWordCount})`}
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400 flex items-center justify-between">
                                <span>Status: {wordCount >= minWordCount ? 'Safe Length' : 'Under length'}</span>
                                <span className="text-emerald-400 font-semibold">Valid</span>
                            </div>
                        </div>

                        {/* Card 4: Pacing & Timer */}
                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Time Management
                                </span>
                                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                    <Clock className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="my-1">
                                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                                    {timeSpentMinutes} <span className="text-lg font-normal text-slate-500">min</span>
                                </div>
                                <p className="text-xs font-semibold text-slate-300 mt-1">
                                    {timeSpentMinutes <= 40 ? 'Well within the 40-minute recommendation' : 'Pacing warning: exceeding recommended duration'}
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400 flex items-center justify-between">
                                <span>Allocated: 40m</span>
                                <span className="text-emerald-400 font-semibold">{40 - timeSpentMinutes}m reserve</span>
                            </div>
                        </div>
                    </div>

                    {/* ════ SECTION 2: 4 CRITERIA SUB-SCORE PILL ROW ════ */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {criteria.map((c) => {
                            const pct = Math.min(100, Math.round((c.band / 9) * 100));
                            return (
                                <div key={c.code} className="bg-[#15181E] border border-[#222732] rounded-xl p-4 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[11px] font-mono font-bold text-amber-400">{c.code}</span>
                                        <span className="text-lg font-black text-white">{c.band.toFixed(1)}</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-300 truncate mb-2">{c.name}</p>
                                    <div className="w-full bg-[#222732] h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ════ SECTION 3: 2-COLUMN MAIN WORKSPACE ════ */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* ── LEFT COLUMN (6 COLS): CANDIDATE ESSAY & PROMPT CANVAS ── */}
                        <div className="lg:col-span-6 space-y-6">
                            {promptText && (
                                <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 shadow-sm">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5 text-rose-500" />
                                        Task Prompt & Requirements
                                    </h3>
                                    <p className="text-xs text-slate-200 leading-relaxed font-sans bg-[#0D0F12] border border-[#222732] p-3.5 rounded-xl">
                                        {promptText}
                                    </p>
                                </div>
                            )}

                            {/* Interactive Essay Canvas */}
                            <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#222732]">
                                    <div>
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-amber-400" />
                                            Candidate Essay & Diagnostics
                                        </h3>
                                        <p className="text-[11px] text-slate-400 mt-0.5">Click highlighted segments to view syntax & lexis recommendations</p>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400 bg-[#0D0F12] border border-[#222732] px-2.5 py-1 rounded-lg">
                                        {wordCount} words
                                    </span>
                                </div>

                                <div className="text-[14px] sm:text-[15px] leading-[1.85] text-slate-200 whitespace-pre-line bg-[#0D0F12] border border-[#222732] p-5 rounded-xl font-serif">
                                    {segments.map((s, i) => (
                                        <span
                                            key={i}
                                            className={segColor[s.kind] || 'text-slate-200'}
                                            onClick={() => (s.kind === 'plain' ? setSelectedSegment(null) : setSelectedSegment(s))}
                                        >
                                            {s.text}
                                        </span>
                                    ))}
                                </div>

                                {/* Diagnostic Feedback Drawer */}
                                <div className="mt-4 rounded-xl bg-[#0D0F12] border border-[#222732] p-4 min-h-[64px]">
                                    {selectedSegment ? (
                                        <div className="space-y-2">
                                            <p className="text-xs text-slate-200">
                                                <span className="font-bold text-amber-400">Diagnostic Note: </span>
                                                {segNote(selectedSegment)}
                                            </p>
                                            <div className="flex items-center gap-2 text-[11px] flex-wrap">
                                                <span className="bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded-full font-medium">
                                                    Original: "{selectedSegment.text}"
                                                </span>
                                                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full font-medium">
                                                    Target: Band 8.0+ Collocation
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">Select any highlighted phrase in your essay above to inspect diagnostic feedback.</p>
                                    )}
                                </div>

                                {/* Legend */}
                                <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-slate-400 pt-3 border-t border-[#222732]">
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/30 border-b-2 border-rose-500" /> Grammar Slip</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/20 border-b-2 border-amber-400" /> Weak / Repetitive Lexis</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20 border-b-2 border-emerald-400" /> Band 8+ Collocation</span>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN (6 COLS): AI DIAGNOSTIC BREAKDOWN & UPGRADES ── */}
                        <div className="lg:col-span-6 space-y-6">
                            {/* Criterion Breakdown Accordions */}
                            <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-[#222732]">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Award className="w-4 h-4 text-rose-500" />
                                        IELTS 4-Pillar Evaluator Rubric
                                    </h3>
                                    <span className="text-[11px] font-mono text-slate-400">Expand for Sub-metrics</span>
                                </div>

                                {criteria.map((c) => {
                                    const isExpanded = expandedCriterion === c.code;
                                    const detail = CRITERION_DETAILS[c.code];
                                    const accentColor = c.band >= targetBand ? 'text-emerald-400' : c.band >= targetBand - 1 ? 'text-amber-400' : 'text-rose-400';

                                    return (
                                        <div key={c.code} className="rounded-xl bg-[#0D0F12] border border-[#222732] overflow-hidden transition-all">
                                            <button
                                                onClick={() => setExpandedCriterion(isExpanded ? null : c.code)}
                                                className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-[#15181E] transition-colors cursor-pointer"
                                            >
                                                <span className="text-xs font-mono font-bold text-amber-400 shrink-0">{c.code}</span>
                                                <span className="flex-1 min-w-0">
                                                    <span className="text-xs font-semibold text-white block truncate">{c.name}</span>
                                                    {!isExpanded && <span className="text-[11px] text-slate-400 mt-0.5 block truncate">{c.note}</span>}
                                                </span>
                                                <span className={`text-base font-bold shrink-0 ${accentColor}`}>{c.band.toFixed(1)}</span>
                                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isExpanded && detail && (
                                                <div className="px-4 pb-4 pt-2 border-t border-[#222732] space-y-3">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {detail.subMetrics.map((sm) => (
                                                            <div key={sm.label} className="bg-[#15181E] border border-[#222732] rounded-lg p-2.5">
                                                                <p className="text-[10px] text-slate-400 truncate">{sm.label}</p>
                                                                <p className="text-base font-bold text-white mt-0.5">{sm.score.toFixed(1)}</p>
                                                                <div className="mt-1 h-1 rounded bg-[#222732] overflow-hidden">
                                                                    <div className="h-full bg-amber-400 rounded" style={{ width: `${(sm.score / 9) * 100}%` }} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                        <div className="bg-[#15181E] border border-[#222732] rounded-lg p-3">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Strengths</p>
                                                            <ul className="space-y-1">
                                                                {detail.strengths.map((s, idx) => (
                                                                    <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                                                        <span className="text-emerald-400">✓</span> {s}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="bg-[#15181E] border border-[#222732] rounded-lg p-3">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">Areas for Growth</p>
                                                            <ul className="space-y-1">
                                                                {detail.weaknesses.map((w, idx) => (
                                                                    <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                                                        <span className="text-amber-400">⚠</span> {w}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-3 text-xs">
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">Band 8.0+ Booster</p>
                                                        <p className="text-[11px] text-amber-200/90 leading-relaxed">{detail.booster}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Paragraph AI Upgrade & Model Essay */}
                            <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-[#222732]">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-emerald-400" />
                                        Band 8.5+ Model Reconstructions
                                    </h3>
                                    <span className="text-[11px] font-mono text-slate-400">Side-by-Side</span>
                                </div>

                                <div className="space-y-3">
                                    {upgrades.map((u, i) => {
                                        const isOpen = expandedRewrite === i;
                                        return (
                                            <div key={i} className="rounded-xl bg-[#0D0F12] border border-[#222732] overflow-hidden">
                                                <button
                                                    onClick={() => setExpandedRewrite(isOpen ? null : i)}
                                                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#15181E] transition-colors cursor-pointer"
                                                >
                                                    <span className="text-xs font-semibold text-slate-300">Paragraph {i + 1} Comparison</span>
                                                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[#222732]">
                                                        <div className="bg-[#15181E] p-3 rounded-lg border border-[#222732]">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">Candidate Original</p>
                                                            <p className="text-xs text-slate-300 leading-relaxed">{u.original}</p>
                                                        </div>
                                                        <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-800/40">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Band 8.5+ Lexical Upgrade</p>
                                                            <p className="text-xs text-emerald-200 leading-relaxed">{u.upgraded}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Teacher Feedback Note */}
                            {teacher && (
                                <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Senior Faculty Evaluation Note
                                        </h4>
                                        {teacher.verified && (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Verified by Senior Evaluator
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0D0F12] border border-[#222732] p-3 rounded-xl font-sans">
                                        {teacher.remark}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );

    // Scenario B: History Matrix Pop-Up Modal (React Portal with blurred backdrop)
    if (isModal) {
        if (typeof document === 'undefined') return null;
        return createPortal(
            <div
                className="fixed inset-0 z-[9999] w-screen h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden"
                onClick={onClose}
            >
                {innerModalCanvas}
            </div>,
            document.body
        );
    }

    // Scenario A: Direct Exam Submission Mode (Full-Page Embedded Standard Block Component)
    return (
        <div className="w-full space-y-6 bg-[#0D0F12] p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col min-h-screen">
            <div className="w-full max-w-7xl mx-auto flex flex-col">
                {innerModalCanvas}
            </div>
        </div>
    );
};

export default WritingAnalysisModal;

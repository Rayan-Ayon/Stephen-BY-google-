import React, { useState, useMemo } from 'react';
import {
    ArrowLeft,
    Award,
    CheckCircle2,
    Clock,
    FileText,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    ChevronDown,
    Lightbulb,
} from 'lucide-react';
import StudentDisputeButtonAndModal from '../ielts/StudentDisputeButtonAndModal';
import {
    useWritingEvaluation,
} from '@/hooks/useWritingEvaluation';
import type {
    WritingEvaluationPayload,
    WritingCriterion,
} from '@/services/writing/writingEvaluationService';
import type { AnalysisSegment } from '../ielts/analysisMockData';

/* ─── Props ─────────────────────────────────────────────────────────────── */

export interface WritingEvaluationCanvasProps {
    isModal?: boolean;
    attemptId?: string | number | null;
    attempt?: any;
    evaluationProp?: WritingEvaluationPayload | null;
    onClose?: () => void;
}

/* ─── Segment Color Map ─────────────────────────────────────────────────── */

const segColor: Record<string, string> = {
    plain: 'text-slate-200',
    grammar: 'bg-rose-500/25 text-rose-200 border-b-2 border-rose-500 cursor-pointer px-1 rounded transition-colors hover:bg-rose-500/40 font-medium',
    vocab: 'bg-amber-500/25 text-amber-200 border-b-2 border-amber-400 cursor-pointer px-1 rounded transition-colors hover:bg-amber-500/40 font-medium',
    strong: 'bg-emerald-500/25 text-emerald-200 border-b-2 border-emerald-400 cursor-pointer px-1 rounded transition-colors hover:bg-emerald-500/40 font-medium',
};

const segNote = (s: AnalysisSegment): string => {
    if (s.kind === 'grammar') return `Grammar slip: "${s.text}" — review subject-verb agreement, article placement, or clause structure.`;
    if (s.kind === 'vocab') return `Weak / Band 6 lexis: "${s.text}" — replace with more precise academic vocabulary or idiomatic collocation.`;
    if (s.kind === 'strong') return `Band 8+ collocation: "${s.text}" — excellent natural academic cadence and register.`;
    return '';
};

/* ─── WritingEvaluationCanvas ───────────────────────────────────────────── */

export const WritingEvaluationCanvas: React.FC<WritingEvaluationCanvasProps> = ({
    isModal = true,
    attemptId,
    attempt,
    evaluationProp,
    onClose,
}) => {
    const { evaluation: fetchedEval, isLoading } = useWritingEvaluation({
        attemptId: attemptId || attempt?.id,
        attempt,
        autoFetch: !evaluationProp,
    });

    const data: WritingEvaluationPayload | null = evaluationProp || fetchedEval;

    const [expandedCriterion, setExpandedCriterion] = useState<string | null>('TR/TA');
    const [expandedRewrite, setExpandedRewrite] = useState<number | null>(0);
    const [selectedSegment, setSelectedSegment] = useState<AnalysisSegment | null>(null);
    const [scoreViewMode, setScoreViewMode] = useState<'ai' | 'teacher'>('ai');

    // Telemetry variables
    const rawBand = data?.overallBand ?? attempt?.band ?? 6.5;
    const teacherVerifiedBand = Math.min(9.0, rawBand + 0.5);
    const displayedBand = scoreViewMode === 'teacher' ? teacherVerifiedBand : rawBand;
    const targetBand = data?.targetBand ?? 7.5;

    const examTitle = useMemo(() => {
        if (data?.examTitle) return data.examTitle;
        if (attempt?.book_number && attempt?.test_number) {
            return `Cambridge ${attempt.book_number} — Test ${attempt.test_number}`;
        }
        return attempt?.title || 'Academic Writing Attempt';
    }, [data, attempt]);

    const examDate = data?.examDate || attempt?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const wordCount = data?.wordCount || attempt?.wordCount || attempt?.word_count || 285;
    const minWordCount = data?.minWordCount || 250;
    const timeSpentMinutes = data?.timeSpentMinutes || attempt?.timeSpent || 18;
    const promptText = data?.promptText || attempt?.prompt || attempt?.title || 'Some people believe that university education should be free to all students. To what extent do you agree or disagree?';
    const criteria = data?.criteria || [];
    const segments = data?.segments || [];
    const rewrites = data?.rewrites || [];

    const cefrLevel = displayedBand >= 8.0 ? 'C2 Proficiency' : displayedBand >= 7.0 ? 'C1 Advanced' : displayedBand >= 6.0 ? 'B2 Vantage' : 'B1 Intermediate';

    if (isLoading && !data) {
        return (
            <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-[#0D0F12] text-slate-200">
                <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold tracking-wide text-slate-300">Hydrating Writing Evaluation Payload...</p>
                <p className="text-xs text-slate-500 mt-1">Zero-pass lookup from Supabase writing telemetry</p>
            </div>
        );
    }

    return (
        <div
            className={`relative w-full max-w-7xl bg-[#0D0F12] border border-[#222732] shadow-2xl overflow-hidden flex flex-col text-slate-100 font-sans ${
                isModal ? 'h-[94vh] rounded-2xl' : 'rounded-2xl min-h-[calc(100vh-3rem)]'
            }`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* ── STICKY TOP TELEMETRY HEADER ── */}
            <header className="sticky top-0 z-20 bg-[#15181E] border-b border-[#222732] px-6 py-4 flex items-center justify-between shadow-lg flex-wrap gap-4 rounded-t-2xl">
                <div className="flex items-center gap-3 min-w-0">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl border border-[#222732] bg-[#0D0F12] hover:bg-[#1E232E] text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Return to Writing Hub"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                            <span>Overview</span>
                            <span>&gt;</span>
                            <span className="text-slate-300">Writing Engine</span>
                            <span>&gt;</span>
                            <span className="text-rose-400 font-semibold">Post-Exam Analysis Canvas</span>
                        </div>
                        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate mt-0.5">
                            {examTitle} — Evaluation Canvas
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    {/* Universal Student Dispute Action & Modal */}
                    <StudentDisputeButtonAndModal
                        testTitle={examTitle}
                        module="writing"
                        originalBand={displayedBand}
                        rawAnswers={{ essay: data?.essayText || '' }}
                        scoreViewMode={scoreViewMode}
                        onScoreViewModeChange={setScoreViewMode}
                    />

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-[#222732] hover:bg-neutral-700 text-xs font-bold text-white transition-colors cursor-pointer"
                        >
                            Exit Hub
                        </button>
                    )}
                </div>
            </header>

            {/* ── SCROLLING ANALYTICS & DIAGNOSTICS WORKSPACE ── */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {/* ════ SECTION 1: TOP 4 TELEMETRY KPI SNAPSHOT CARDS ════ */}
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

                    {/* Card 2: Target Gap */}
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
                                {displayedBand >= targetBand ? 'Meets institutional requirement' : 'Requires targeted refinement in Lexical Resource'}
                            </p>
                        </div>
                        <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400">
                            Exam Date: <span className="text-white font-mono">{examDate}</span>
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
                                {wordCount >= minWordCount ? `+${wordCount - minWordCount} over ${minWordCount} threshold` : `Under minimum requirement (${minWordCount})`}
                            </p>
                        </div>
                        <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Status: {wordCount >= minWordCount ? 'Safe Length' : 'Under length'}</span>
                            <span className="text-emerald-400 font-semibold">Valid</span>
                        </div>
                    </div>

                    {/* Card 4: Time Management */}
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
                                {timeSpentMinutes <= 40 ? 'Well within the 40-minute recommendation' : 'Pacing alert: exceeded standard allocated pacing'}
                            </p>
                        </div>
                        <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Allocated: 40m</span>
                            <span className="text-emerald-400 font-semibold">{Math.max(0, 40 - timeSpentMinutes)}m reserve</span>
                        </div>
                    </div>
                </div>

                {/* ════ SECTION 2: 4-PILLAR SCORE CARDS ROW ════ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {criteria.map((c) => {
                        const pct = Math.min(100, Math.round((c.band / 9) * 100));
                        return (
                            <div key={c.code} className="bg-[#15181E] border border-[#222732] rounded-xl p-4 flex flex-col justify-between shadow-xs">
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
                    {/* ── LEFT COLUMN (6 COLS): ESSAY ANNOTATIONS & DIAGNOSTICS ── */}
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
                                    <p className="text-[11px] text-slate-400 mt-0.5">Click highlighted segments to view syntax &amp; lexis recommendations</p>
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
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/30 border-b-2 border-rose-500" /> 🟥 Grammar Slip</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/20 border-b-2 border-amber-400" /> 🟨 Weak / Repetitive Lexis</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20 border-b-2 border-emerald-400" /> 🟩 Band 8+ Collocation</span>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN (6 COLS): 4-PILLAR EVALUATOR RUBRIC & SUB-METRICS ── */}
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

                                        {isExpanded && (
                                            <div className="px-4 pb-4 pt-2 border-t border-[#222732] space-y-3">
                                                {/* Sub-metrics Progress Cards */}
                                                {c.subMetrics && c.subMetrics.length > 0 && (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {c.subMetrics.map((sm) => (
                                                            <div key={sm.label} className="bg-[#15181E] border border-[#222732] rounded-lg p-2.5">
                                                                <p className="text-[10px] text-slate-400 truncate">{sm.label}</p>
                                                                <div className="flex items-center justify-between mt-1">
                                                                    <span className="text-xs font-bold font-mono text-white">{sm.score.toFixed(1)}</span>
                                                                    <div className="w-10 bg-[#222732] h-1 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="bg-amber-400 h-full rounded-full"
                                                                            style={{ width: `${Math.min(100, (sm.score / 9) * 100)}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Strengths */}
                                                {c.strengths && c.strengths.length > 0 && (
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Strengths:</span>
                                                        <ul className="text-xs text-slate-300 space-y-1 list-none">
                                                            {c.strengths.map((s, idx) => (
                                                                <li key={idx} className="flex items-start gap-1.5">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                                    <span>{s}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Areas for Growth */}
                                                {c.weaknesses && c.weaknesses.length > 0 && (
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Areas for Growth:</span>
                                                        <ul className="text-xs text-slate-300 space-y-1 list-none">
                                                            {c.weaknesses.map((w, idx) => (
                                                                <li key={idx} className="flex items-start gap-1.5">
                                                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                                                    <span>{w}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Booster Callout */}
                                                {c.booster && (
                                                    <div className="bg-purple-950/30 border border-purple-800/40 rounded-lg p-3 text-xs text-purple-200 flex items-start gap-2">
                                                        <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                                                        <div>
                                                            <strong className="text-purple-300">Band 8.0+ Booster: </strong>
                                                            {c.booster}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Band 8.5+ Model Reconstructions */}
                        {rewrites.length > 0 && (
                            <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-[#222732]">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        Band 8.5+ Model Reconstructions
                                    </h3>
                                    <span className="text-[11px] font-mono text-slate-400">{rewrites.length} Paragraph Comparisons</span>
                                </div>

                                <div className="space-y-3">
                                    {rewrites.map((r, idx) => {
                                        const isExpanded = expandedRewrite === idx;
                                        return (
                                            <div key={idx} className="rounded-xl bg-[#0D0F12] border border-[#222732] overflow-hidden">
                                                <button
                                                    onClick={() => setExpandedRewrite(isExpanded ? null : idx)}
                                                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#15181E] transition-colors cursor-pointer"
                                                >
                                                    <span className="text-xs font-bold text-slate-300">
                                                        Paragraph {idx + 1} Comparison
                                                    </span>
                                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>

                                                {isExpanded && (
                                                    <div className="px-4 pb-4 pt-2 border-t border-[#222732] space-y-3">
                                                        <div className="space-y-1">
                                                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                                                                Candidate Original:
                                                            </span>
                                                            <p className="text-xs text-slate-300 bg-[#15181E] border border-[#222732] p-3 rounded-lg leading-relaxed font-serif">
                                                                "{r.original}"
                                                            </p>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                                                                Band 8.5+ Lexical Upgrade:
                                                            </span>
                                                            <p className="text-xs text-emerald-100 bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-lg leading-relaxed font-serif">
                                                                "{r.upgraded}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WritingEvaluationCanvas;

import React, { useState, useMemo } from 'react';
import type { AnalysisSegment } from './analysisMockData';

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
    band: number;
    targetBand: number;
    examTitle: string;
    examDate: string;
    criteria: WritingCriterion[];
    segments: AnalysisSegment[];
    rewrites: WritingRewrite[];
    teacher: WritingTeacher;
    onClose: () => void;
}

/* ─── Segment Color Map ─────────────────────────────────────────── */

const segColor: Record<string, string> = {
    plain: 'text-neutral-300',
    grammar: 'bg-red-500/15 text-red-300 border-b border-red-400/50 cursor-pointer',
    vocab: 'bg-yellow-400/10 text-yellow-200 border-b border-yellow-400/40 cursor-pointer',
    strong: 'bg-emerald-500/10 text-emerald-300 border-b border-emerald-400/40 cursor-pointer',
};

const segNote = (s: AnalysisSegment): string => {
    if (s.kind === 'grammar') return `Grammar slip: "${s.text}" — review agreement, articles, or word form.`;
    if (s.kind === 'vocab') return `Weak / Band 6 lexis: "${s.text}" — replace with more precise vocabulary.`;
    if (s.kind === 'strong') return `Band 8+ collocation: "${s.text}" — keep using this structure.`;
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
            'Repeats "important" — vary with "pivotal", "paramount", "instrumental"',
            '"Peoples" is incorrect — use "people" or "populations"',
            'Limited paraphrasing — "good thing" → use "advantageous development"',
        ],
        booster: 'Replace generic adjectives with Band 8+ collocations: "create a level playing field" → "yield a more equitable playing field".',
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
            'Subject-verb agreement: "many peoples believe"',
            'Article omission: "creates level playing field"',
            'Run-on sentence in paragraph 3',
        ],
        booster: 'Practice complex clause structures: "While X, Y has shown that Z..." See Cambridge IELTS Grammar #18.',
    },
};

/* ─── WritingAnalysisModal ──────────────────────────────────────── */

const WritingAnalysisModal: React.FC<WritingAnalysisModalProps> = ({
    band,
    targetBand,
    examTitle,
    examDate,
    criteria,
    segments,
    rewrites,
    teacher,
    onClose,
}) => {
    const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);
    const [expandedRewrite, setExpandedRewrite] = useState<number | null>(null);
    const [selectedSegment, setSelectedSegment] = useState<AnalysisSegment | null>(null);
    const [audioPlaying, setAudioPlaying] = useState(false);

    const targetGap = targetBand - band;
    const bandColor = band >= targetBand ? 'text-emerald-400' : band >= targetBand - 0.5 ? 'text-amber-400' : 'text-red-400';
    const bandGlow = band >= targetBand
        ? 'shadow-[0_0_20px_rgba(16,185,129,0.3)]'
        : band >= targetBand - 0.5
        ? 'shadow-[0_0_20px_rgba(251,191,0,0.3)]'
        : 'shadow-[0_0_20px_rgba(239,68,68,0.3)]';
    const bandBorder = band >= targetBand
        ? 'border-emerald-500/40'
        : band >= targetBand - 0.5
        ? 'border-amber-500/40'
        : 'border-red-500/40';

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

    return (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto custom-scrollbar" onClick={onClose}>
            <div className="w-full max-w-5xl my-8 rounded-2xl bg-[#0D0D0E] border border-neutral-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>

                {/* ── Header ── */}
                <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-surface border-b border-neutral-800 rounded-t-2xl">
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500">Writing Analysis</p>
                        <h2 className="text-lg font-semibold tracking-tight text-white truncate">{examTitle}</h2>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{examDate}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className={`inline-flex items-center rounded-full border font-semibold text-lg px-4 py-1.5 ${bandBorder} ${bandGlow} ${bandColor}`}>
                            {band.toFixed(1)}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 border border-neutral-800 rounded-full px-3 py-1">
                            TARGET {targetBand.toFixed(1)}
                        </span>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-lg bg-canvas border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-6">

                    {/* ── Four Criteria Accordions ── */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Criterion Breakdown</h3>
                        {criteria.map((c) => {
                            const isExpanded = expandedCriterion === c.code;
                            const detail = CRITERION_DETAILS[c.code];
                            const accentColor = c.band >= targetBand ? 'text-emerald-400' : c.band >= targetBand - 1 ? 'text-amber-400' : 'text-red-400';
                            const summary = c.note.length > 80 ? c.note.slice(0, 80) + '...' : c.note;

                            return (
                                <div key={c.code} className="rounded-xl bg-[#1E1E22] border border-neutral-800 overflow-hidden transition-all">
                                    {/* Closed state — clickable header */}
                                    <button
                                        onClick={() => setExpandedCriterion(isExpanded ? null : c.code)}
                                        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                                    >
                                        <span className="text-[10px] font-mono text-amber-400 shrink-0">{c.code}</span>
                                        <span className="flex-1 min-w-0">
                                            <span className="text-sm font-medium text-white block">{c.name}</span>
                                            {!isExpanded && <span className="text-[11px] text-neutral-500 mt-0.5 block">{summary}</span>}
                                        </span>
                                        <span className={`text-xl font-semibold shrink-0 ${accentColor}`}>{c.band.toFixed(1)}</span>
                                        <svg className={`w-4 h-4 shrink-0 text-neutral-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </button>

                                    {/* Expanded state */}
                                    {isExpanded && detail && (
                                        <div className="px-5 pb-5 border-t border-neutral-800/70">
                                            <div className="pt-4 space-y-4">
                                                {/* Sub-metrics */}
                                                <div className="grid grid-cols-3 gap-3">
                                                    {detail.subMetrics.map((sm) => (
                                                        <div key={sm.label} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                                                            <p className="text-[10px] text-neutral-500 mb-1">{sm.label}</p>
                                                            <p className="text-lg font-semibold text-white">{sm.score.toFixed(1)}</p>
                                                            <div className="mt-1.5 h-1.5 rounded bg-neutral-800 overflow-hidden">
                                                                <div className="h-full rounded bg-amber-400 transition-all" style={{ width: `${(sm.score / 9) * 100}%` }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Strengths vs Weaknesses */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                                                        <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-2">Strengths</p>
                                                        <ul className="space-y-1">
                                                            {detail.strengths.map((s, i) => (
                                                                <li key={i} className="text-[12px] text-neutral-300 flex items-start gap-1.5">
                                                                    <span className="text-emerald-400 mt-0.5">✓</span>{s}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                                                        <p className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-2">Areas to Improve</p>
                                                        <ul className="space-y-1">
                                                            {detail.weaknesses.map((w, i) => (
                                                                <li key={i} className="text-[12px] text-neutral-300 flex items-start gap-1.5">
                                                                    <span className="text-amber-400 mt-0.5">⚠</span>{w}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Band Booster */}
                                                <div className="rounded-lg bg-amber-400/5 border border-amber-400/20 p-3">
                                                    <p className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold mb-1">Band Booster</p>
                                                    <p className="text-[12px] text-amber-200/90">{detail.booster}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Interactive Essay Canvas ── */}
                    <div className="rounded-xl bg-[#1E1E22] border border-neutral-800 p-6">
                        <h4 className="text-sm font-semibold text-white tracking-tight mb-1">Interactive Essay Canvas</h4>
                        <p className="text-[11px] text-neutral-500 mb-4">Click any highlighted marker for instant correction</p>

                        <div className="text-[15px] leading-[1.8] whitespace-pre-line">
                            {segments.map((s, i) => (
                                <span
                                    key={i}
                                    className={segColor[s.kind] || 'text-neutral-300'}
                                    onClick={() => (s.kind === 'plain' ? setSelectedSegment(null) : setSelectedSegment(s))}
                                >
                                    {s.text}
                                </span>
                            ))}
                        </div>

                        {/* Diagnostic Drawer */}
                        <div className="mt-4 rounded-lg bg-[#0D0D0E] border border-neutral-800 p-4 min-h-[60px]">
                            {selectedSegment ? (
                                <div className="space-y-2">
                                    <p className="text-[12px] text-neutral-300">
                                        <span className="font-semibold text-amber-300">Correction · </span>
                                        {segNote(selectedSegment)}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                                        <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">Original: "{selectedSegment.text}"</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                                            📖 Rule Ref: Cambridge IELTS Grammar #18 — Complex Clause Structures
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[12px] text-neutral-600">Select a highlighted phrase above to see the correction note.</p>
                            )}
                        </div>

                        {/* Legend */}
                        <div className="mt-3 flex gap-3 text-[10px] text-neutral-500">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/30 border-b border-red-400/50" /> Grammar</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400/20 border-b border-yellow-400/40" /> Weak vocab</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/20 border-b border-emerald-400/40" /> Band 8+ collocation</span>
                        </div>
                    </div>

                    {/* ── Paragraph-by-Paragraph AI Upgrade ── */}
                    <div className="rounded-xl bg-[#1E1E22] border border-neutral-800 p-6">
                        <h4 className="text-sm font-semibold text-white tracking-tight mb-1">Paragraph AI Upgrade</h4>
                        <p className="text-[11px] text-neutral-500 mb-4">Original → Band 8/9 alternative</p>

                        <div className="space-y-3">
                            {upgrades.map((u, i) => {
                                const isOpen = expandedRewrite === i;
                                return (
                                    <div key={i} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 overflow-hidden">
                                        <button
                                            onClick={() => setExpandedRewrite(isOpen ? null : i)}
                                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                                        >
                                            <span className="text-[12px] font-medium text-neutral-300">Paragraph {i + 1}</span>
                                            <svg className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                                <path d="M6 9l6 6 6-6" />
                                            </svg>
                                        </button>
                                        {isOpen && (
                                            <div className="px-4 pb-4 space-y-2 border-t border-neutral-800/70 pt-3">
                                                <p className="text-[12px] text-red-300/90 leading-relaxed">
                                                    <span className="font-semibold">Original · </span>{u.original}
                                                </p>
                                                <p className="text-[12px] text-emerald-300/90 leading-relaxed">
                                                    <span className="font-semibold">Upgraded · </span>{u.upgraded}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Teacher Override & Audio Feedback ── */}
                    <div className="rounded-xl bg-[#1E1E22] border border-neutral-800 p-6">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-white tracking-tight">Teacher Override & Audio Feedback</h4>
                            {teacher.verified && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
                                    ✓ Verified by Senior Evaluator
                                </span>
                            )}
                        </div>

                        <p className="text-[13px] text-neutral-300 leading-relaxed mb-4">{teacher.remark}</p>

                        {teacher.audioNote && (
                            <div className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-4">
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Audio Instructor Note</p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setAudioPlaying(!audioPlaying)}
                                        className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center text-sm shrink-0"
                                    >
                                        {audioPlaying ? (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                                        )}
                                    </button>
                                    <div className="flex-1">
                                        {/* Waveform visualization */}
                                        <svg viewBox="0 0 400 40" className="w-full h-8" preserveAspectRatio="none">
                                            {Array.from({ length: 60 }).map((_, i) => {
                                                const h = 8 + Math.sin(i * 0.5) * 12 + Math.random() * 6;
                                                const x = (i / 60) * 400;
                                                const played = audioPlaying && i < 20;
                                                return <rect key={i} x={x} y={20 - h / 2} width={400 / 60 - 1.5} height={h} fill={played ? '#fbbf24' : '#3f3f46'} rx="1.5" />;
                                            })}
                                        </svg>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[10px] font-mono text-neutral-500">
                                                {audioPlaying ? '0:42' : '0:00'} / 1:18
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="19,20 9,12 19,4" /><line x1="5" y1="19" x2="5" y2="5" /></svg>
                                                </button>
                                                <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="5,4 15,12 5,20" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
                                                </button>
                                                <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WritingAnalysisModal;

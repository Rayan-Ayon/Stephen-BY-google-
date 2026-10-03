import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Flag,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    Sparkles,
    BookOpen,
    Eye,
    EyeOff,
    AlertTriangle,
    Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import StudentDisputeButtonAndModal from './StudentDisputeButtonAndModal';
import { useReadingExamData } from '@/hooks/useExamData';
import {
    readAttempts,
    attemptStatus,
    skillLabels,
    skillColors,
    BUNDLES,
    type IeltsAttempt,
    type IeltsSkill,
    type IeltsBundleId,
} from './ieltsShared';
import {
    resolveAnalysis,
    buildObjective,
    buildWriting,
    buildSpeaking,
    type ObjectiveAnalysis,
    type ObjectiveAnswer,
    type WritingAnalysis,
    type SpeakingAnalysis,
    type BundleAnalysis,
    type AnalysisSegment,
    type SegmentKind,
    type ResolvedAnalysis,
} from './analysisMockData';

/* ───────────────────────── Shared UI ───────────────────────── */

const Card: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({
    title,
    subtitle,
    children,
    className,
}) => (
    <div className={`rounded-xl bg-[#1E1E22] border border-neutral-800 p-6 ${className ?? ''}`}>
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-white tracking-tight">{title}</h4>
            {subtitle && <p className="text-[11px] text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
        {children}
    </div>
);

const Bar: React.FC<{ value: number; max?: number; color?: string; critical?: boolean }> = ({
    value,
    max = 100,
    color = '#fbbf24',
    critical,
}) => (
    <div className="h-2 rounded bg-neutral-800 overflow-hidden">
        <div
            className="h-full transition-all"
            style={{ width: `${Math.min(100, (value / max) * 100)}%`, backgroundColor: critical ? '#ef4444' : color }}
        />
    </div>
);

const BandPill: React.FC<{ band: number; size?: 'sm' | 'lg' }> = ({ band, size = 'sm' }) => {
    const status = attemptStatus(band);
    const cls = size === 'lg' ? 'text-lg px-4 py-1.5' : 'text-sm px-3 py-1';
    return (
        <span className={`inline-flex items-center rounded-full border font-semibold ${cls} ${status.color}`}>
            {band.toFixed(1)}
        </span>
    );
};

const segColor: Record<SegmentKind, string> = {
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

/* ───────────────────────── Reading 50/50 Split Analysis Canvas ───────────────────────── */

const ReadingAnalysisSplitCanvas: React.FC<{
    bookNumber: number;
    testNumber: number;
    attemptId?: string | number;
    rawAnswers?: Record<string | number, string>;
    testTitle?: string;
}> = ({ bookNumber, testNumber, attemptId, rawAnswers, testTitle }) => {
    const {
        loading,
        passages,
        questions,
    } = useReadingExamData({
        bookNumber,
        testNumber,
        attemptId,
        initialAnswers: rawAnswers,
        testTitle,
    });

    const [activePassageIndex, setActivePassageIndex] = useState(0);
    const [isPassageHidden, setIsPassageHidden] = useState<boolean>(false);
    const [vocabLookupEnabled, setVocabLookupEnabled] = useState<boolean>(false);
    const [selectedWordDef, setSelectedWordDef] = useState<{ word: string; pos: string; def: string } | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'incorrect' | 'correct' | 'unanswered'>('all');
    const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});

    const passageContainerRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [activeHighlightSection, setActiveHighlightSection] = useState<string | null>(null);

    const activePassage = passages[activePassageIndex] || passages[0] || {
        passage_number: 1,
        title: 'Passage 1',
        passage_text: '',
        sections: [],
    };

    // Filter questions based on filter pills
    const filteredQuestions = useMemo(() => {
        return questions.filter((q) => {
            const hasAns = q.candidate_answer && q.candidate_answer.trim() !== '';
            if (activeFilter === 'incorrect') return hasAns && !q.is_correct;
            if (activeFilter === 'correct') return q.is_correct;
            if (activeFilter === 'unanswered') return !hasAns;
            return true;
        });
    }, [questions, activeFilter]);

    // Expand all explanations by default
    useEffect(() => {
        if (questions.length > 0) {
            const initialMap: Record<number, boolean> = {};
            questions.forEach((q) => {
                initialMap[q.question_number] = true;
            });
            setExpandedExplanations((prev) => ({ ...initialMap, ...prev }));
        }
    }, [questions]);

    const toggleExplanation = (qNum: number) => {
        setExpandedExplanations((prev) => ({ ...prev, [qNum]: !prev[qNum] }));
    };

    const handleReviewThis = (sectionKey: string, passageNumber?: number) => {
        if (passageNumber && passageNumber !== activePassage.passage_number) {
            const targetIndex = passages.findIndex((p) => p.passage_number === passageNumber);
            if (targetIndex !== -1) {
                setActivePassageIndex(targetIndex);
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
                toast.info(`Highlighted Paragraph ${cleanLetter} in the reading passage`);
                setTimeout(() => setActiveHighlightSection(null), 3500);
            }
        }, 100);
    };

    const handleWordClick = (word: string) => {
        if (!vocabLookupEnabled) return;
        const clean = word.toLowerCase().replace(/[^a-z]/g, '');
        if (!clean) return;

        setSelectedWordDef({
            word: clean,
            pos: 'academic lexis',
            def: `Key contextual IELTS reading vocabulary item: "${clean}". Review collocation and nuance in this passage.`
        });
    };

    return (
        <div className="w-full flex flex-col h-[calc(100vh-140px)] overflow-hidden">
            {/* STICKY TOP CONTROL BAR */}
            <div className="shrink-0 bg-[#15181E] border border-[#222732] rounded-2xl p-4 mb-4 flex items-center justify-between z-10 flex-wrap gap-3 shadow-md">
                {/* Passage Selection Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 select-none">
                        REVIEW PASSAGE:
                    </span>
                    {passages.map((p, idx) => (
                        <button
                            key={p.passage_number}
                            onClick={() => setActivePassageIndex(idx)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center ${
                                idx === activePassageIndex
                                    ? 'bg-[#1E232E] border-indigo-500/80 text-white shadow-sm ring-1 ring-indigo-500/50'
                                    : 'bg-[#0D0F12] border-[#222732] text-slate-300 hover:text-white hover:border-slate-700'
                            }`}
                        >
                            <span className="text-slate-300">Passage {p.passage_number}:</span>
                            <span className="text-indigo-300 font-semibold ml-1.5 truncate max-w-[180px] sm:max-w-none">
                                {p.title}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Filter Pills & Actions */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Status filter pills */}
                    <div className="flex items-center gap-1 bg-[#0D0F12] p-1 rounded-xl border border-[#222732]">
                        {(
                            [
                                { id: 'all', label: `All ${questions.length}` },
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

                    {/* Action Buttons */}
                    <button
                        onClick={() => setVocabLookupEnabled((prev) => !prev)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                            vocabLookupEnabled
                                ? 'bg-amber-950/50 border-amber-500/60 text-amber-300 font-bold'
                                : 'bg-[#0D0F12] border-[#222732] text-slate-300 hover:text-white'
                        }`}
                        title="Click words for vocabulary"
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

            {/* Vocabulary Definition Notification */}
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
                    } h-full overflow-y-auto custom-scrollbar bg-[#15181E] border border-[#222732] rounded-2xl p-6 space-y-4`}
                >
                    <div className="flex items-center justify-between border-b border-[#222732] pb-3">
                        <div>
                            <h4 className="text-base font-bold text-white tracking-tight">
                                {activePassage?.title || `Passage ${activePassage?.passage_number || 1}`}
                            </h4>
                            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                                Reading Passage {activePassage?.passage_number || 1}
                            </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 bg-[#0D0F12] border border-[#222732] px-2.5 py-1 rounded-md">
                            Cambridge Authentic
                        </span>
                    </div>

                    <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-serif">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                                <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                <span className="text-xs text-slate-400">Loading authentic passage data from Supabase...</span>
                            </div>
                        ) : activePassage?.sections && activePassage.sections.length > 0 ? (
                            activePassage.sections.map((block) => {
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
                                                ? 'bg-indigo-950/80 border-indigo-500/80 ring-2 ring-indigo-500/50 shadow-xl text-white'
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
                        ) : activePassage?.passage_text ? (
                            <div
                                className="prose prose-invert max-w-none space-y-3"
                                dangerouslySetInnerHTML={{ __html: activePassage.passage_text }}
                            />
                        ) : (
                            <p className="text-xs text-slate-500 text-center py-8">Passage text not available.</p>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: EXPLANATIONS & EVIDENCE (Col-6 or Col-12) */}
                <div
                    className={`${
                        isPassageHidden ? 'col-span-12' : 'col-span-12 lg:col-span-6'
                    } h-full overflow-y-auto custom-scrollbar space-y-4 pr-1`}
                >
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                            <span className="text-xs text-slate-400">Loading questions & responses from Supabase...</span>
                        </div>
                    ) : filteredQuestions.length === 0 ? (
                        <div className="p-8 text-center bg-[#15181E] border border-[#222732] rounded-2xl">
                            <p className="text-sm font-semibold text-slate-300">No questions match filter "{activeFilter}"</p>
                            <p className="text-xs text-slate-500 mt-1">Switch to "All" to inspect all candidate responses.</p>
                        </div>
                    ) : (
                        filteredQuestions.map((q) => {
                            const userRaw = q.candidate_answer;
                            const isCorrect = Boolean(q.is_correct);
                            const hasAnswer = Boolean(userRaw && userRaw.trim() !== '');
                            const isExpanded = Boolean(expandedExplanations[q.question_number]);
                            const evidenceSec = q.evidence_section || `Paragraph A`;

                            return (
                                <div
                                    key={q.question_number}
                                    className={`rounded-2xl border p-5 transition-all bg-[#15181E] ${
                                        !hasAnswer
                                            ? 'border-[#222732]'
                                            : isCorrect
                                            ? 'border-emerald-500/30'
                                            : 'border-rose-500/30'
                                    }`}
                                >
                                    {/* Question Card Header */}
                                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#0D0F12] border border-[#222732] text-white">
                                                QUESTION {q.question_number}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                • Passage {q.passage_number}
                                            </span>
                                            {q.question_type && (
                                                <span className="text-[10px] text-slate-400 bg-[#0D0F12] px-2 py-0.5 rounded border border-[#222732]">
                                                    {q.question_type}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            {isCorrect ? (
                                                <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct: {q.correct_answer}
                                                </span>
                                            ) : hasAnswer ? (
                                                <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                                                    <XCircle className="w-3.5 h-3.5" /> Missed
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                                                    Q{q.question_number} · Not answered
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {q.instruction && (
                                        <p className="text-[11px] text-slate-400 italic mb-1.5">
                                            {q.instruction}
                                        </p>
                                    )}
                                    <p className="text-xs font-medium text-slate-100 leading-snug mb-3">
                                        {q.prompt_text}
                                    </p>

                                    {/* Candidate Response Box */}
                                    <div className="rounded-lg bg-[#0D0F12] border border-[#222732] p-3 flex items-center justify-between gap-3">
                                        <div>
                                            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                                                Candidate Submitted Answer:
                                            </span>
                                            {hasAnswer ? (
                                                <span className={`text-xs font-semibold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                                                    {userRaw}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 italic text-xs">
                                                    {"{No answer provided}"}
                                                </span>
                                            )}
                                        </div>
                                        {!isCorrect && q.correct_answer && (
                                            <div className="text-right">
                                                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                                                    Official Key:
                                                </span>
                                                <span className="text-xs font-mono font-bold text-slate-100 bg-[#15181E] px-2 py-0.5 rounded border border-[#222732]">
                                                    {q.correct_answer}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Explanation & Evidence Drawer */}
                                    {(q.explanation || q.evidence_quote) && (
                                        <div className="mt-3 pt-2.5 border-t border-[#222732] space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={() => toggleExplanation(q.question_number)}
                                                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Sparkles className="w-3 h-3" />
                                                    {isExpanded ? 'Hide Explanation & Evidence' : 'Show Explanation & Evidence'}
                                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                </button>

                                                <button
                                                    onClick={() => handleReviewThis(evidenceSec, q.passage_number)}
                                                    className="text-xs bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                                                >
                                                    Review this →
                                                </button>
                                            </div>

                                            {isExpanded && (
                                                <div className="space-y-2.5 bg-[#0D0F12] p-3 rounded-xl border border-[#222732] animate-in fade-in duration-150">
                                                    {q.explanation && (
                                                        <div className="text-xs text-slate-300 leading-relaxed">
                                                            <span className="font-semibold text-white block text-[11px] mb-0.5">Rationale:</span>
                                                            <p>{q.explanation}</p>
                                                        </div>
                                                    )}

                                                    {q.evidence_quote && (
                                                        <div className="bg-[#15181E] border-l-4 border-indigo-500 p-3 rounded-r-xl space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                                                                    PASSAGE EVIDENCE
                                                                </span>
                                                                <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-2 py-0.5 rounded">
                                                                    {evidenceSec}
                                                                </span>
                                                            </div>
                                                            <p className="text-slate-200 font-serif italic text-xs leading-relaxed">
                                                                "{q.evidence_quote}"
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Common Traps if available */}
                                                    {q.common_traps && q.common_traps.length > 0 && (
                                                        <div className="bg-[#15181E] border border-[#222732] p-2.5 rounded-lg space-y-1 text-xs">
                                                            <span className="font-bold text-white block text-[11px]">Common Traps</span>
                                                            {q.common_traps.map((trap, idx) => (
                                                                <div key={idx} className="text-[11px]">
                                                                    <span className="font-semibold text-rose-400">{trap.trapWord}: </span>
                                                                    <span className="text-slate-300">{trap.explanation}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Strategy Tip if available */}
                                                    {q.strategy_tip && (
                                                        <div className="bg-purple-950/30 border border-purple-800/40 p-2.5 rounded-lg text-purple-200 text-xs leading-relaxed flex items-start gap-2">
                                                            <Lightbulb className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                                            <div>
                                                                <span className="font-bold block text-[11px] text-white">Strategy Tip:</span>
                                                                <span className="text-[11px]">{q.strategy_tip}</span>
                                                            </div>
                                                        </div>
                                                    )}
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
    );
};

/* ───────────────────────── Objective View ───────────────────────── */

const ObjectiveView: React.FC<{ data: ObjectiveAnalysis }> = ({ data }) => {
    const [passage, setPassage] = React.useState<ObjectiveAnalysis['passageCtx'] | null>(null);
    const o = data;

    return (
        <div className="space-y-4">
            <Card title="Overview Metric Bar" subtitle="Performance snapshot vs allocated time">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { l: 'Band Score', v: o.band.toFixed(1) },
                        { l: 'Correct', v: `${o.correct}/${o.total}` },
                        { l: 'Incorrect', v: String(o.incorrect) },
                        { l: 'Unanswered', v: String(o.unanswered) },
                        { l: 'Time / Alloc.', v: `${o.timeSpent}m / ${o.allocated}m` },
                    ].map((m) => (
                        <div key={m.l} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500">{m.l}</p>
                            <p className="text-xl font-semibold text-white mt-1">{m.v}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Question-Type Accuracy Breakdown" subtitle="Critical gaps flagged below 60%">
                <div className="space-y-3">
                    {o.questionTypes.map((qt) => (
                        <div key={qt.type}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] text-neutral-300">{qt.type}</span>
                                <span className={`text-[11px] font-mono ${qt.critical ? 'text-red-400' : 'text-neutral-400'}`}>
                                    {qt.accuracy}% {qt.critical && '⚠️ Critical Gap'}
                                </span>
                            </div>
                            <Bar value={qt.accuracy} critical={qt.critical} />
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Pacing & Time Wasted Matrix" subtitle="Per-section time distribution">
                <div className="space-y-2">
                    {o.pacing.map((p) => (
                        <div
                            key={p.part}
                            className="flex items-center justify-between rounded-lg bg-[#0D0D0E] border border-neutral-800 px-4 py-3"
                        >
                            <span className="text-[12px] text-neutral-300">{p.part}</span>
                            <span className="text-[11px] font-mono text-neutral-500">{p.minutes}m · {p.avgPerQ}s/q</span>
                            <span className={`text-[11px] font-semibold ${p.warning ? 'text-red-400' : 'text-emerald-400'}`}>
                                {p.warning ?? 'On pace'}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Interactive Answer Review" subtitle="Click any row to inspect passage context">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-wider text-neutral-500">
                                <th className="pb-2 pr-4 font-semibold">Q#</th>
                                <th className="pb-2 pr-4 font-semibold">Your</th>
                                <th className="pb-2 pr-4 font-semibold">Correct</th>
                                <th className="pb-2 pr-4 font-semibold">Type</th>
                                <th className="pb-2 pr-4 font-semibold">Time</th>
                                <th className="pb-2 pr-4 font-semibold">Status</th>
                                <th className="pb-2 font-semibold">Context</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/70">
                            {o.answers.map((a) => (
                                <tr key={a.q}>
                                    <td className="py-2 pr-4 text-xs font-mono text-neutral-400">
                                        <div className="font-bold">Q{a.q}</div>
                                        {a.prompt && <div className="text-[10px] text-neutral-500 font-sans truncate max-w-[140px]" title={a.prompt}>{a.prompt}</div>}
                                    </td>
                                    <td className="py-2 pr-4 text-xs text-neutral-300 max-w-[160px] truncate" title={a.your}>{a.your}</td>
                                    <td className="py-2 pr-4 text-xs text-neutral-400 max-w-[160px] truncate" title={a.correct}>{a.correct}</td>
                                    <td className="py-2 pr-4 text-xs text-neutral-500">{a.type}</td>
                                    <td className="py-2 pr-4 text-xs font-mono text-neutral-500">{a.timeSpent}s</td>
                                    <td className="py-2 pr-4">
                                        <span
                                            className={`text-[11px] font-semibold ${
                                                a.status === 'correct'
                                                    ? 'text-emerald-400'
                                                    : a.status === 'incorrect'
                                                    ? 'text-red-400'
                                                    : 'text-neutral-500'
                                            }`}
                                        >
                                            {a.status === 'correct' ? '✅ Correct' : a.status === 'incorrect' ? '❌ Missed' : '— Omitted'}
                                        </span>
                                    </td>
                                    <td className="py-2">
                                        <button
                                            onClick={() => setPassage({
                                                heading: `Question ${a.q}: ${a.prompt || a.type}`,
                                                paragraph: a.tapeScriptExcerpt || o.passageCtx.paragraph,
                                                highlight: a.correct,
                                                trick: a.explanation || o.passageCtx.trick
                                            })}
                                            disabled={a.status === 'unanswered' && !a.tapeScriptExcerpt}
                                            className="text-[11px] text-sky-400 hover:text-sky-300 disabled:opacity-40 disabled:hover:text-sky-400 cursor-pointer"
                                        >
                                            View Context ➔
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {passage && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPassage(null)}>
                    <div className="max-w-lg w-full rounded-2xl bg-[#1E1E22] border border-neutral-800 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-3">
                            <h4 className="text-sm font-semibold text-white">{passage.heading}</h4>
                            <button onClick={() => setPassage(null)} className="text-neutral-500 hover:text-white text-sm">✕</button>
                        </div>
                        <p className="text-sm text-neutral-300 leading-relaxed">
                            {passage.paragraph.split(passage.highlight).map((part, i, arr) => (
                                <React.Fragment key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                        <span className="bg-yellow-400/20 text-yellow-200 px-1 rounded border-b border-yellow-400/50">
                                            {passage.highlight}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </p>
                        <div className="mt-4 rounded-lg bg-[#0D0D0E] border border-amber-500/20 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-amber-400/80 font-semibold mb-1">Paraphrase Trick</p>
                            <p className="text-[12px] text-amber-200/90">{passage.trick}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ───────────────────────── Writing View ───────────────────────── */

const WritingView: React.FC<{ data: WritingAnalysis }> = ({ data }) => {
    const [sel, setSel] = React.useState<AnalysisSegment | null>(null);
    const w = data;

    return (
        <div className="space-y-4">
            <Card title="Official Band Descriptors" subtitle="25% weight each">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {w.criteria.map((c) => (
                        <div key={c.code} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                            <p className="text-[10px] font-mono text-amber-400">{c.code}</p>
                            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{c.name}</p>
                            <p className="text-2xl font-semibold text-white mt-1">{c.band.toFixed(1)}</p>
                            <p className="text-[10px] text-neutral-500 mt-1">{c.note}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Interactive Essay Canvas" subtitle="Click any highlighted marker for instant correction">
                <div className="text-[15px] leading-[1.8] whitespace-pre-line">
                    {w.segments.map((s, i) => (
                        <span
                            key={i}
                            className={segColor[s.kind]}
                            onClick={() => (s.kind === 'plain' ? setSel(null) : setSel(s))}
                            title={s.kind !== 'plain' ? segNote(s) : undefined}
                        >
                            {s.text}
                        </span>
                    ))}
                </div>
                <div className="mt-4 rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3 min-h-[52px]">
                    {sel ? (
                        <p className="text-[12px] text-neutral-300">
                            <span className="font-semibold text-amber-300">Correction · </span>
                            {segNote(sel)}
                        </p>
                    ) : (
                        <p className="text-[12px] text-neutral-600">Select a highlighted phrase above to see the correction note.</p>
                    )}
                </div>
                <div className="mt-2 flex gap-3 text-[10px] text-neutral-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/30 border-b border-red-400/50" /> Grammar</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400/20 border-b border-yellow-400/40" /> Weak vocab</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/20 border-b border-emerald-400/40" /> Band 8+ collocation</span>
                </div>
            </Card>

            <Card title="Paragraph-by-Paragraph AI Upgrade" subtitle="Original → Band 8/9 alternative">
                <div className="space-y-3">
                    {w.rewrites.map((r, i) => (
                        <div key={i} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-4 space-y-2">
                            <p className="text-[12px] text-red-300/90"><span className="font-semibold">Original · </span>{r.original}</p>
                            <p className="text-[12px] text-emerald-300/90"><span className="font-semibold">Upgraded · </span>{r.upgraded}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Teacher Override & Audio Feedback" subtitle="Evaluator verified remarks">
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
                        ✓ Evaluator Verified
                    </span>
                    {w.teacher.audioNote && <span className="text-[11px] text-neutral-500">Audio note attached</span>}
                </div>
                <p className="text-[13px] text-neutral-300 leading-relaxed mb-4">{w.teacher.remark}</p>
                {w.teacher.audioNote && (
                    <div className="flex items-center gap-3 rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                        <button className="w-9 h-9 rounded-full bg-amber-400 text-black flex items-center justify-center text-sm">▶</button>
                        <div className="flex-1 h-2 rounded bg-neutral-800 overflow-hidden">
                            <div className="h-full w-1/3 bg-amber-400" />
                        </div>
                        <span className="text-[11px] font-mono text-neutral-500">0:42 / 1:18</span>
                    </div>
                )}
            </Card>
        </div>
    );
};

/* ───────────────────────── Speaking View ───────────────────────── */

const SpeakingView: React.FC<{ data: SpeakingAnalysis }> = ({ data }) => {
    const s = data;
    return (
        <div className="space-y-4">
            <Card title="Official Speaking Score Cards" subtitle="Examiner descriptor bands">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {s.criteria.map((c) => (
                        <div key={c.code} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                            <p className="text-[10px] font-mono text-violet-400">{c.code}</p>
                            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{c.name}</p>
                            <p className="text-2xl font-semibold text-white mt-1">{c.band.toFixed(1)}</p>
                            <p className="text-[10px] text-neutral-500 mt-1">{c.note}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Timecoded Waveform & Transcript" subtitle="Red flags mark pauses / filler words">
                <div className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-4">
                    <svg viewBox="0 0 600 80" className="w-full h-20" preserveAspectRatio="none">
                        {s.waveform.map((h, i) => {
                            const x = (i / s.waveform.length) * 600;
                            return <rect key={i} x={x} y={40 - h / 2} width={600 / s.waveform.length - 1} height={h} fill="#a78bfa" rx="1" />;
                        })}
                        {s.markers.map((m, i) => {
                            const x = (m.time / 64) * 600;
                            return (
                                <g key={i}>
                                    <line x1={x} y1={0} x2={x} y2={80} stroke={m.type === 'pause' ? '#ef4444' : '#fbbf24'} strokeWidth="1.5" strokeDasharray="2 2" />
                                    <circle cx={x} cy={6} r="3" fill={m.type === 'pause' ? '#ef4444' : '#fbbf24'} />
                                    <title>{`${m.label}`}</title>
                                </g>
                            );
                        })}
                    </svg>
                    <div className="mt-3 space-y-1">
                        {s.transcript.map((t, i) => (
                            <p key={i} className="text-[13px] leading-relaxed">
                                {t.kind === 'plain' ? (
                                    <span className="text-neutral-300">{t.text}</span>
                                ) : (
                                    <span
                                        className={`border-b ${
                                            t.kind === 'grammar'
                                                ? 'text-red-300 border-red-400/50'
                                                : 'text-yellow-200 border-yellow-400/40'
                                        }`}
                                        title={t.note}
                                    >
                                        {t.text}
                                        {t.note ? ' ⚠️' : ''}
                                    </span>
                                )}
                            </p>
                        ))}
                    </div>
                </div>
            </Card>

            <Card title="Speech Metrics Engine" subtitle="Fluency & lexical density">
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between mb-1 text-[12px]"><span className="text-neutral-300">Speech Rate (WPM)</span><span className="font-mono text-neutral-400">{s.metrics.wpm}</span></div>
                        <Bar value={s.metrics.wpm} max={180} color="#a78bfa" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1 text-[12px]"><span className="text-neutral-300">Pause Frequency (/min)</span><span className="font-mono text-neutral-400">{s.metrics.pauseFreq}</span></div>
                        <Bar value={s.metrics.pauseFreq} max={8} critical={s.metrics.pauseFreq > 4} color="#a78bfa" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1 text-[12px]"><span className="text-neutral-300">C1/C2 Vocabulary Density</span><span className="font-mono text-neutral-400">{s.metrics.c1c2Density}%</span></div>
                        <Bar value={s.metrics.c1c2Density} max={100} color="#a78bfa" />
                    </div>
                </div>
            </Card>
        </div>
    );
};

/* ───────────────────────── Bundle View ───────────────────────── */

const RadarChart: React.FC<{ radar: Record<IeltsSkill, number> }> = ({ radar }) => {
    const skills: IeltsSkill[] = ['listening', 'reading', 'writing', 'speaking'];
    const size = 220;
    const cx = size / 2;
    const cy = size / 2;
    const R = 80;
    const angle = (i: number) => (-90 + i * 90) * (Math.PI / 180);
    const pt = (i: number, val: number) => {
        const r = (val / 9) * R;
        return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
    };
    const poly = skills.map((sk, i) => pt(i, radar[sk]).join(',')).join(' ');
    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
            {[3, 6, 9].map((ring) => (
                <polygon
                    key={ring}
                    points={skills.map((_, i) => pt(i, ring).join(',')).join(' ')}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                />
            ))}
            {skills.map((_, i) => {
                const [x, y] = pt(i, 9);
                return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />;
            })}
            <polygon points={poly} fill="rgba(251,191,0,0.18)" stroke="#fbbf24" strokeWidth="2" />
            {skills.map((sk, i) => {
                const [x, y] = pt(i, radar[sk]);
                return <circle key={sk} cx={x} cy={y} r="3" fill="#fbbf24" />;
            })}
            {skills.map((sk, i) => {
                const [x, y] = pt(i, 10.2);
                return (
                    <text key={sk} x={x} y={y} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)" className="font-mono">
                        {skillLabels[sk].slice(0, 3).toUpperCase()}
                    </text>
                );
            })}
        </svg>
    );
};

const BundleView: React.FC<{ data: BundleAnalysis }> = ({ data }) => {
    const [tab, setTab] = React.useState(0);
    const b = data;
    const section = b.sections[tab];

    const renderDetail = () => {
        const synth: IeltsAttempt = { id: 0, skill: section.skill, band: section.band, date: '', bundle: b.label };
        if (section.skill === 'writing') return <WritingView data={buildWriting(synth)} />;
        if (section.skill === 'speaking') return <SpeakingView data={buildSpeaking(synth)} />;
        return <ObjectiveView data={buildObjective(synth)} />;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {b.sections.map((sec, i) => (
                    <button
                        key={sec.skill}
                        onClick={() => setTab(i)}
                        className={`px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                            tab === i
                                ? 'bg-amber-400 text-black'
                                : 'bg-[#1E1E22] border border-neutral-800 text-neutral-300 hover:border-neutral-600'
                        }`}
                    >
                        {skillLabels[sec.skill]}: {sec.band.toFixed(1)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                    <Card title="Combined Skill Radar" subtitle="Balance across modules">
                        <RadarChart radar={b.radar} />
                    </Card>
                    <Card title="Coaching Centre Verdict" subtitle="Readiness & prediction" className="mt-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                                b.verdict.readiness >= 70 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                            }`}>
                                {b.verdict.readiness}% Ready for Target 7.5
                            </span>
                        </div>
                        <p className="text-[12px] text-neutral-300">Overall prediction: <span className="font-semibold text-white">{b.verdict.prediction.toFixed(1)}</span></p>
                        <div className="mt-3">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Primary focus</p>
                            <ul className="space-y-1">
                                {b.verdict.focus.map((f) => (
                                    <li key={f} className="text-[12px] text-amber-300/90">• {f}</li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">{renderDetail()}</div>
            </div>
        </div>
    );
};

/* ───────────────────────── Main Modal ───────────────────────── */

interface IELTSAnalysisViewProps {
    attemptId?: number | string;
    bundleId?: IeltsBundleId;
    onClose: () => void;
}

const IELTSAnalysisView: React.FC<IELTSAnalysisViewProps> = ({ attemptId, bundleId, onClose }) => {
    const rawData = React.useMemo<ResolvedAnalysis>(
        () => resolveAnalysis({ attemptId: typeof attemptId === 'number' ? attemptId : undefined, bundleId }, readAttempts()),
        [attemptId, bundleId],
    );

    const [realObjective, setRealObjective] = useState<ObjectiveAnalysis | null>(null);
    const [scoreViewMode, setScoreViewMode] = useState<'ai' | 'teacher'>('ai');
    const [readingViewMode, setReadingViewMode] = useState<'split' | 'metrics'>('split');

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    // Query Supabase for candidate's actual exam attempt and questions
    useEffect(() => {
        let isMounted = true;
        const fetchRealExamData = async () => {
            try {
                let attemptRow: any = null;
                if (attemptId) {
                    const isUuid = typeof attemptId === 'string' && attemptId.includes('-');
                    if (isUuid) {
                        const { data: att } = await (supabase as any)
                            .from('exam_attempts')
                            .select('*')
                            .eq('id', attemptId)
                            .maybeSingle();
                        attemptRow = att;
                    }
                }
                if (!attemptRow && (rawData.skill === 'reading' || rawData.skill === 'listening')) {
                    const { data: latest } = await (supabase as any)
                        .from('exam_attempts')
                        .select('*')
                        .eq('module', rawData.skill)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle();
                    attemptRow = latest;
                }

                if (!attemptRow) return;

                const userAnswers: Record<string, string> = attemptRow.answers_payload || {};
                const testId = attemptRow.test_id || '';
                const module = attemptRow.module;

                let sectionsOrPassages: any[] = [];
                if (module === 'listening') {
                    const { data: sec } = await (supabase as any)
                        .from('sections')
                        .select('*, question_groups(*, questions(*))')
                        .or(`test_id.ilike.%${testId}%,exam_id.ilike.%${testId}%`)
                        .order('part_number', { ascending: true });
                    sectionsOrPassages = sec || [];
                } else if (module === 'reading') {
                    const { data: pas } = await (supabase as any)
                        .from('passages')
                        .select('*, question_groups(*, questions(*))')
                        .or(`test_id.ilike.%${testId}%,exam_id.ilike.%${testId}%`)
                        .order('part_number', { ascending: true });
                    sectionsOrPassages = pas || [];
                }

                const allQuestions: Array<{ qNum: number; prompt: string; type: string; correct: string; explanation?: string; partName: string }> = [];
                sectionsOrPassages.forEach((sec: any) => {
                    const groups = sec.question_groups || [];
                    groups.forEach((g: any) => {
                        const qs = g.questions || [];
                        qs.forEach((q: any) => {
                            const qNum = q.question_number || (allQuestions.length + 1);
                            allQuestions.push({
                                qNum,
                                prompt: q.prompt || `Question ${qNum}`,
                                type: g.question_type || 'Completion',
                                correct: q.correct_answer || '',
                                explanation: q.explanation || '',
                                partName: sec.passage_title || `Part ${sec.part_number || 1}`
                            });
                        });
                    });
                });

                if (allQuestions.length === 0) return;

                allQuestions.sort((a, b) => a.qNum - b.qNum);
                const normalize = (v: string) => (v || '').toLowerCase().replace(/[^a-z0-9]/g, '');

                let correctCount = 0;
                let incorrectCount = 0;
                let unansweredCount = 0;

                const answers: ObjectiveAnswer[] = allQuestions.map((q) => {
                    const userRaw = (userAnswers[q.qNum] || userAnswers[String(q.qNum)] || '').trim();
                    const isBlank = !userRaw;
                    const isMatch = !isBlank && normalize(userRaw) === normalize(q.correct);
                    if (isBlank) unansweredCount++;
                    else if (isMatch) correctCount++;
                    else incorrectCount++;

                    return {
                        q: q.qNum,
                        your: userRaw || '(No answer provided)',
                        correct: q.correct || '—',
                        type: q.type,
                        timeSpent: Math.round(attemptRow.time_spent_seconds ? attemptRow.time_spent_seconds / allQuestions.length : 45),
                        status: isBlank ? 'unanswered' : isMatch ? 'correct' : 'incorrect',
                        prompt: q.prompt,
                        explanation: q.explanation,
                        tapeScriptExcerpt: q.explanation || q.prompt
                    };
                });

                const typeMap: Record<string, { total: number; correct: number }> = {};
                answers.forEach((ans) => {
                    if (!typeMap[ans.type]) typeMap[ans.type] = { total: 0, correct: 0 };
                    typeMap[ans.type].total += 1;
                    if (ans.status === 'correct') typeMap[ans.type].correct += 1;
                });

                const questionTypes = Object.entries(typeMap).map(([type, stats]) => {
                    const acc = Math.round((stats.correct / (stats.total || 1)) * 100);
                    return {
                        type,
                        accuracy: acc,
                        count: stats.total,
                        critical: acc < 60
                    };
                });

                if (isMounted) {
                    setRealObjective({
                        band: Number(attemptRow.band_score) || rawData.objective?.band || 6.5,
                        correct: correctCount,
                        incorrect: incorrectCount,
                        unanswered: unansweredCount,
                        total: allQuestions.length,
                        timeSpent: Math.round((attemptRow.time_spent_seconds || 1800) / 60),
                        allocated: rawData.objective?.allocated || 60,
                        questionTypes: questionTypes.length > 0 ? questionTypes : (rawData.objective?.questionTypes || []),
                        pacing: rawData.objective?.pacing || [],
                        answers,
                        passageCtx: rawData.objective?.passageCtx || {
                            heading: `${rawData.title || 'Official'} Context`,
                            paragraph: 'Official exam passage and transcript telemetry.',
                            highlight: '',
                            trick: 'Pay attention to synonyms and grammatical shifts.'
                        }
                    });
                }
            } catch (err) {
                console.warn('[IELTSAnalysisView] Real exam data ingestion note:', err);
            }
        };

        fetchRealExamData();
        return () => { isMounted = false; };
    }, [attemptId, rawData.skill, rawData.title, rawData.objective]);

    const data: ResolvedAnalysis = {
        ...rawData,
        objective: realObjective || rawData.objective
    };

    const title = data.title ?? (data.skill ? skillLabels[data.skill] : 'Analysis');
    const rawAiBand =
        data.kind === 'bundle'
            ? data.bundle?.verdict.prediction ?? 0
            : data.kind === 'objective'
            ? data.objective?.band ?? 0
            : data.kind === 'writing'
            ? data.writing?.band ?? 0
            : data.speaking?.band ?? 0;
            
    // If teacher verified, simulated +0.5 band increase
    const teacherBand = Math.min(9.0, rawAiBand + 0.5);
    const headerBand = scoreViewMode === 'teacher' ? teacherBand : rawAiBand;
    const accent = data.skill ? skillColors[data.skill] : 'text-amber-400';

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[999] w-screen h-screen min-h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-6xl xl:max-w-7xl max-h-[94vh] my-auto rounded-2xl bg-[#0D0F12] border border-[#222732] shadow-2xl overflow-y-auto custom-scrollbar flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-[#15181E] border-b border-[#222732] rounded-t-2xl flex-wrap">
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500">Test Analysis</p>
                        <h2 className={`text-lg font-semibold tracking-tight truncate ${accent}`}>{title}</h2>
                        {data.attemptDate && <p className="text-[11px] text-neutral-500 mt-0.5">{data.attemptDate}</p>}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                        {/* Universal Student Dispute Action & Modal */}
                        <StudentDisputeButtonAndModal
                            testTitle={title}
                            module={(data.skill as any) || 'writing'}
                            originalBand={rawAiBand}
                            rawAnswers={data.objective?.answers}
                            scoreViewMode={scoreViewMode}
                            onScoreViewModeChange={setScoreViewMode}
                        />

                        <BandPill band={headerBand} size="lg" />
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 border border-neutral-800 rounded-full px-3 py-1">Target 7.5</span>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-lg bg-canvas border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                </header>

                {/* Reading View Switcher: 50/50 Split Canvas vs Analytics */}
                {data.skill === 'reading' && (
                    <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-[#0D0F12] border-b border-[#222732] flex-wrap">
                        <button
                            onClick={() => setReadingViewMode('split')}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                                readingViewMode === 'split'
                                    ? 'bg-rose-500/15 border-rose-500/60 text-rose-300 shadow-sm'
                                    : 'bg-[#15181E] border-[#222732] text-neutral-400 hover:text-white'
                            }`}
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            50/50 Split Analysis (Passages & Questions)
                        </button>
                        <button
                            onClick={() => setReadingViewMode('metrics')}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                readingViewMode === 'metrics'
                                    ? 'bg-rose-500/15 border-rose-500/60 text-rose-300 shadow-sm'
                                    : 'bg-[#15181E] border-[#222732] text-neutral-400 hover:text-white'
                            }`}
                        >
                            📊 Performance Breakdown & Pacing
                        </button>
                    </div>
                )}

                <div className="p-6 flex-1 min-h-0">
                    {data.skill === 'reading' && readingViewMode === 'split' ? (
                        <ReadingAnalysisSplitCanvas
                            bookNumber={parseInt((title || '').match(/Cambridge\s*(\d+)/i)?.[1] || '7', 10)}
                            testNumber={parseInt((title || '').match(/Test\s*(\d+)/i)?.[1] || '1', 10)}
                            attemptId={attemptId}
                            testTitle={title}
                        />
                    ) : (
                        <>
                            {data.kind === 'objective' && data.objective && <ObjectiveView data={data.objective} />}
                            {data.kind === 'writing' && data.writing && <WritingView data={data.writing} />}
                            {data.kind === 'speaking' && data.speaking && <SpeakingView data={data.speaking} />}
                            {data.kind === 'bundle' && data.bundle && <BundleView data={data.bundle} />}
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default IELTSAnalysisView;


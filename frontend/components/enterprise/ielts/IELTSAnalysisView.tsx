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
    Lightbulb,
    ArrowLeft,
    RotateCcw,
    HelpCircle,
    Target
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import StudentDisputeButtonAndModal from './StudentDisputeButtonAndModal';
import { useExamData, type ReadingPassageItem, type SupabaseQuestionData } from '@/hooks/useExamData';
import PerformanceBreakdown, { type QuestionTypeStat, type PassageStat } from '../analysis/PerformanceBreakdown';
import { CAMBRIDGE_PASSAGE_TITLES } from './data/cambridgeQuestionSnippets';
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

/* ───────────────────────── Reading 50/50 Split Analysis Canvas ───────────────────────── */

const ReadingAnalysisSplitCanvas: React.FC<{
    bookNumber: number;
    testNumber: number;
    attemptId?: string | number;
    rawAnswers?: Record<string | number, string>;
    testTitle?: string;
    timeSpentSeconds?: number;
    bandScoreProp?: number;
    scoreProp?: number;
}> = ({ bookNumber, testNumber, attemptId, rawAnswers, testTitle, timeSpentSeconds = 0, bandScoreProp, scoreProp }) => {
    const memoizedAnswers = useMemo(() => {
        if (!rawAnswers) return {};
        if (typeof rawAnswers === 'object') return rawAnswers;
        try {
            return JSON.parse(rawAnswers as unknown as string);
        } catch {
            return {};
        }
    }, [rawAnswers]);

    const {
        loading,
        isLoading,
        passages,
        questions,
        correctCount: hookCorrectCount,
        bandScore: hookBandScore,
    } = useExamData({
        bookNumber,
        testNumber,
        module: 'reading',
        attemptId,
        initialAnswers: memoizedAnswers,
        testTitle,
    });

    const effectiveBandScore = bandScoreProp !== undefined && bandScoreProp !== null ? bandScoreProp : (hookBandScore || 0);
    const effectiveCorrectCount = scoreProp !== undefined && scoreProp !== null ? scoreProp : (hookCorrectCount || 0);

    const [activePassage, setActivePassage] = useState<1 | 2 | 3>(1);
    const [activePassageIndex, setActivePassageIndex] = useState(0);
    const [isPassageHidden, setIsPassageHidden] = useState<boolean>(false);
    const [vocabLookupEnabled, setVocabLookupEnabled] = useState<boolean>(false);
    const [selectedWordDef, setSelectedWordDef] = useState<{ word: string; pos: string; def: string } | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'missed' | 'correct' | 'omitted'>('all');
    const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});

    const passageContainerRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [activeHighlightSection, setActiveHighlightSection] = useState<string | null>(null);

    const isInitialLoading = (loading || isLoading) && passages.length === 0;

    const allQuestions = questions;

    const activePassageData = passages.find((p) => p.passage_number === activePassage) || passages[activePassageIndex] || passages[0] || {
        passage_number: activePassage,
        title: `Passage ${activePassage}`,
        passage_text: '',
        sections: [],
    };

    // Calculate Performance Breakdown for Question Types (4 standard typologies)
    const questionTypeBreakdown = useMemo<QuestionTypeStat[]>(() => {
        const typeBuckets: Record<string, { correct: number; total: number }> = {
            'Matching Qs': { correct: 0, total: 0 },
            'Gap Fill Qs': { correct: 0, total: 0 },
            'Short Answer Qs': { correct: 0, total: 0 },
            'Multiple Choice': { correct: 0, total: 0 },
        };

        allQuestions.forEach((q) => {
            const raw = (q.question_type || '').toLowerCase();
            let key = 'Short Answer Qs';
            if (raw.includes('matching') || raw.includes('heading') || raw.includes('feature')) {
                key = 'Matching Qs';
            } else if (raw.includes('completion') || raw.includes('gap') || raw.includes('summary') || raw.includes('fill') || raw.includes('table') || raw.includes('sentence')) {
                key = 'Gap Fill Qs';
            } else if (raw.includes('choice') || raw.includes('multiple')) {
                key = 'Multiple Choice';
            } else {
                key = 'Short Answer Qs';
            }

            typeBuckets[key].total += 1;
            if (q.is_correct) {
                typeBuckets[key].correct += 1;
            }
        });

        return Object.entries(typeBuckets).map(([label, stats]) => {
            const fallbackTotal = label === 'Short Answer Qs' ? 16 : label === 'Matching Qs' ? 12 : label === 'Gap Fill Qs' ? 8 : 4;
            const total = stats.total || fallbackTotal;
            const correct = stats.correct;
            const pct = total > 0 ? correct / total : 0;
            return {
                typeLabel: label,
                correct,
                total,
                status: pct >= 0.7 ? 'On Target' : 'Needs Work',
            };
        });
    }, [allQuestions]);

    // Calculate Breakdown by Passage
    const passageBreakdown = useMemo<PassageStat[]>(() => {
        return [1, 2, 3].map((pNum) => {
            const pQuestions = allQuestions.filter((q) => {
                if (q.passage_number) return q.passage_number === pNum;
                if (pNum === 1) return q.question_number >= 1 && q.question_number <= 13;
                if (pNum === 2) return q.question_number >= 14 && q.question_number <= 26;
                return q.question_number >= 27 && q.question_number <= 40;
            });
            const correct = pQuestions.filter((q) => q.is_correct).length;
            const fallbackTotal = pNum === 3 ? 14 : 13;
            const total = pQuestions.length || fallbackTotal;
            const foundPassage = passages.find((p) => p.passage_number === pNum);
            const title = foundPassage?.title || CAMBRIDGE_PASSAGE_TITLES[bookNumber]?.[testNumber]?.[pNum - 1] || `Passage ${pNum}`;
            const pct = total > 0 ? correct / total : 0;
            return {
                passageNumber: pNum,
                title,
                correct,
                total,
                status: pct >= 0.6 ? 'Good' : 'Needs Focus',
            };
        });
    }, [allQuestions, passages, bookNumber, testNumber]);

    // Compute questions strictly belonging to the currently selected passage
    const currentPassageQuestions = useMemo(() => {
        if (!allQuestions || allQuestions.length === 0) return [];

        return allQuestions.filter((q) => {
            if (q.passage_number) {
                return q.passage_number === activePassage;
            }
            if (activePassage === 1) return q.question_number >= 1 && q.question_number <= 13;
            if (activePassage === 2) return q.question_number >= 14 && q.question_number <= 26;
            if (activePassage === 3) return q.question_number >= 27 && q.question_number <= 40;
            return true;
        });
    }, [allQuestions, activePassage]);

    // Sub-Filter Binding (All, Missed, Correct, Omitted)
    const displayedQuestions = useMemo(() => {
        if (statusFilter === 'missed') {
            return currentPassageQuestions.filter(
                (q) => (q as any).is_incorrect || (q.candidate_answer && q.candidate_answer.trim() !== '' && !q.is_correct)
            );
        }
        if (statusFilter === 'correct') {
            return currentPassageQuestions.filter((q) => q.is_correct);
        }
        if (statusFilter === 'omitted') {
            return currentPassageQuestions.filter((q) => !q.candidate_answer || q.candidate_answer.trim() === '');
        }
        return currentPassageQuestions;
    }, [currentPassageQuestions, statusFilter]);

    // Expand all explanations by default for questions in the active passage
    useEffect(() => {
        if (currentPassageQuestions.length > 0) {
            setExpandedExplanations((prev) => {
                const initialMap: Record<number, boolean> = { ...prev };
                currentPassageQuestions.forEach((q) => {
                    if (initialMap[q.question_number] === undefined) {
                        initialMap[q.question_number] = true;
                    }
                });
                return initialMap;
            });
        }
    }, [currentPassageQuestions]);

    const toggleExplanation = (qNum: number) => {
        setExpandedExplanations((prev) => ({ ...prev, [qNum]: !prev[qNum] }));
    };

    const handleReviewThis = (passageNumberOrRef: number | string, paragraphRefOrPassage?: string | number) => {
        let pNum: 1 | 2 | 3 = activePassage;
        let sectionRef = 'Paragraph A';

        if (typeof passageNumberOrRef === 'number') {
            pNum = (passageNumberOrRef as 1 | 2 | 3);
            sectionRef = String(paragraphRefOrPassage || 'Paragraph A');
        } else {
            sectionRef = String(passageNumberOrRef || 'Paragraph A');
            if (typeof paragraphRefOrPassage === 'number') {
                pNum = paragraphRefOrPassage as 1 | 2 | 3;
            }
        }

        if (pNum && pNum !== activePassage) {
            setActivePassage(pNum);
            const targetIndex = passages.findIndex((p) => p.passage_number === pNum);
            if (targetIndex !== -1) {
                setActivePassageIndex(targetIndex);
            }
        }

        if (isPassageHidden) {
            setIsPassageHidden(false);
        }

        const cleanLetter = (sectionRef || '').replace(/[^A-Za-z]/g, '').slice(-1) || 'A';
        const normalizedKey = `Section ${cleanLetter}`;
        const altKey = `Paragraph ${cleanLetter}`;

        setTimeout(() => {
            const targetNode = sectionRefs.current[normalizedKey] || sectionRefs.current[altKey] || sectionRefs.current[sectionRef];
            if (targetNode && passageContainerRef.current) {
                targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setActiveHighlightSection(normalizedKey);
                toast.info(`Highlighted Paragraph ${cleanLetter} in Passage ${pNum}`);
                setTimeout(() => setActiveHighlightSection(null), 3500);
            }
        }, 150);
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

    if (isInitialLoading) {
        return (
            <div className="w-full space-y-6 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="h-32 bg-[#15181E] border border-[#222732] rounded-xl" />
                    <div className="h-32 bg-[#15181E] border border-[#222732] rounded-xl" />
                    <div className="h-32 bg-[#15181E] border border-[#222732] rounded-xl" />
                </div>
                <div className="h-44 bg-[#15181E] border border-[#222732] rounded-xl" />
                <div className="h-14 bg-[#15181E] border border-[#222732] rounded-2xl" />
                <div className="grid grid-cols-12 gap-4 h-[600px]">
                    <div className="col-span-12 lg:col-span-6 bg-[#15181E] border border-[#222732] rounded-2xl" />
                    <div className="col-span-12 lg:col-span-6 bg-[#15181E] border border-[#222732] rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* ════ ROW 1: TOP 3 ANALYTICS KPI CARDS & ROW 2: PERFORMANCE BREAKDOWN CONTAINER ════ */}
            <PerformanceBreakdown
                bandScore={effectiveBandScore}
                correctCount={effectiveCorrectCount}
                totalQuestions={allQuestions.length || 40}
                timeSpentSeconds={timeSpentSeconds}
                questionTypeBreakdown={questionTypeBreakdown}
                passageBreakdown={passageBreakdown}
                isLoading={loading || isLoading}
            />

            {/* ════ SECTION 3: UNIFIED DUAL-PANE ENGINE WITH STICKY PASSAGE/FILTER BAR ════ */}
            <div className="w-full flex flex-col space-y-4">
                {/* STICKY TOP CONTROL BAR */}
                <div className="shrink-0 bg-[#15181E] border border-[#222732] rounded-2xl p-4 flex items-center justify-between z-10 flex-wrap gap-3 shadow-md">
                    {/* Passage Selection Tabs */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 select-none">
                            REVIEW PASSAGE:
                        </span>
                        {passages.map((p, idx) => {
                            const pNum = (p.passage_number || (idx + 1)) as 1 | 2 | 3;
                            return (
                                <button
                                    key={p.passage_number || idx}
                                    onClick={() => {
                                        setActivePassageIndex(idx);
                                        setActivePassage(pNum);
                                    }}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center ${
                                        activePassage === pNum
                                            ? 'bg-[#1E232E] border-indigo-500/80 text-white shadow-sm ring-1 ring-indigo-500/50'
                                            : 'bg-[#0D0F12] border-[#222732] text-slate-300 hover:text-white hover:border-slate-700'
                                    }`}
                                >
                                    <span className="text-slate-300">Passage {p.passage_number}:</span>
                                    <span className="text-indigo-300 font-semibold ml-1.5 truncate max-w-[180px] sm:max-w-none">
                                        {p.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Filter Pills & Actions */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Status filter pills */}
                        <div className="flex items-center gap-1 bg-[#0D0F12] p-1 rounded-xl border border-[#222732]">
                            {(
                                [
                                    { id: 'all', label: `All ${currentPassageQuestions.length}` },
                                    { id: 'missed', label: 'Missed' },
                                    { id: 'correct', label: 'Correct' },
                                    { id: 'omitted', label: 'Omitted' },
                                ] as const
                            ).map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setStatusFilter(filter.id)}
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                        statusFilter === filter.id
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
                    <div className="bg-amber-950/40 border border-amber-800/60 text-amber-200 p-3.5 rounded-xl flex items-start justify-between gap-4 shadow-sm animate-in fade-in">
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
                <div className="grid grid-cols-12 gap-4 h-[750px] min-h-[600px] overflow-hidden">
                    {/* LEFT PANEL: READING PASSAGE (Col-6) */}
                    <div
                        ref={passageContainerRef}
                        className={`${
                            isPassageHidden ? 'hidden' : 'col-span-12 lg:col-span-6'
                        } h-full overflow-y-auto custom-scrollbar bg-[#15181E] border border-[#222732] rounded-2xl p-6 space-y-4`}
                    >
                        <div className="flex items-center justify-between border-b border-[#222732] pb-3.5 flex-wrap gap-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 uppercase">
                                        Passage {activePassageData?.passage_number || activePassage} • {activePassageData?.difficulty ? (activePassageData.difficulty.charAt(0).toUpperCase() + activePassageData.difficulty.slice(1)) : (activePassage === 1 ? 'Easy' : activePassage === 2 ? 'Medium' : 'Hard')}
                                    </span>
                                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-md font-semibold">
                                        Cambridge Verified
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-tight">
                                    {activePassageData?.title || `Passage ${activePassageData?.passage_number || activePassage}`}
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-4 text-slate-200 text-[14px] leading-[1.85] font-serif">
                            {activePassageData?.sections && activePassageData.sections.length > 0 ? (
                                activePassageData.sections.map((block) => {
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
                                            className={`transition-all duration-300 rounded-xl p-4 border ${
                                                isHighlighted
                                                    ? 'bg-indigo-950/70 border-indigo-500/80 ring-2 ring-indigo-500/40 shadow-xl text-white'
                                                    : 'border-[#222732]/40 bg-[#0D0F12]/40 hover:border-[#222732] text-slate-200'
                                            }`}
                                        >
                                            <div className="mb-2">
                                                <span className="inline-block font-sans font-extrabold text-[11px] text-indigo-300 bg-indigo-950/90 border border-indigo-700/80 px-2.5 py-0.5 rounded shadow-xs">
                                                    Paragraph {block.sectionLabel}
                                                </span>
                                            </div>
                                            <div
                                                className={`font-serif text-[14px] leading-[1.85] text-slate-200 whitespace-pre-line ${
                                                    vocabLookupEnabled ? 'cursor-pointer selection:bg-amber-400/30' : ''
                                                }`}
                                                onClick={() => {
                                                    if (!vocabLookupEnabled) return;
                                                    const selection = window.getSelection()?.toString().trim();
                                                    if (selection && selection.length > 2) {
                                                        handleWordClick(selection);
                                                    }
                                                }}
                                            >
                                                {block.content}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : activePassageData?.passage_text ? (
                                <div
                                    className="prose prose-invert max-w-none space-y-4 text-slate-200 text-[14px] leading-[1.85] font-serif"
                                    dangerouslySetInnerHTML={{ __html: activePassageData.passage_text }}
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
                        {displayedQuestions.length === 0 ? (
                            <div className="p-8 text-center bg-[#15181E] border border-[#222732] rounded-2xl">
                                <p className="text-sm font-semibold text-slate-300">
                                    No questions match filter "{statusFilter}" in Passage {activePassage}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Switch to "All {currentPassageQuestions.length}" to inspect all candidate responses for this passage.
                                </p>
                            </div>
                        ) : (
                            displayedQuestions.map((q) => {
                                const isExpanded = expandedExplanations[q.question_number] !== false;
                                const wasAnswered = Boolean(q.candidate_answer && q.candidate_answer.trim() !== '');
                                const expObj = typeof q.explanation === 'object' && q.explanation ? q.explanation : {
                                    why_correct: q.explanation_text || (typeof q.explanation === 'string' ? q.explanation : 'Official Cambridge verified response.'),
                                    passage_evidence: q.evidence_quote || '',
                                    paragraph_ref: q.evidence_section || 'Paragraph A',
                                    common_trap: q.common_traps?.[0]?.explanation,
                                    strategy_tip: q.strategy_tip
                                };

                                return (
                                    <div
                                        key={q.question_number}
                                        className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 space-y-3.5 transition-all hover:border-slate-700 shadow-sm"
                                    >
                                        {/* Question Header & Stem */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#0D0F12] border border-[#222732] text-white">
                                                        QUESTION {q.question_number}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                                                        {q.question_type?.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                                {q.instruction && (
                                                    <p className="text-[11px] text-slate-400 italic pt-0.5">
                                                        {q.instruction}
                                                    </p>
                                                )}
                                                <p className="font-medium text-sm text-slate-100 leading-snug pt-1">
                                                    {q.prompt || q.prompt_text}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => toggleExplanation(q.question_number)}
                                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#0D0F12] transition-colors cursor-pointer shrink-0"
                                                title={isExpanded ? 'Collapse' : 'Expand'}
                                            >
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Candidate Answer vs Correct Answer Status Pills */}
                                        <div className="flex items-center flex-wrap gap-2 pt-1">
                                            {wasAnswered ? (
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                                                        q.is_correct
                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                                    }`}
                                                >
                                                    {q.is_correct ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    Your answer: {q.candidate_answer}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                                    Q{q.question_number} · Not answered
                                                </span>
                                            )}

                                            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-700/60">
                                                Correct: {q.correct_answer}
                                            </span>
                                        </div>

                                        {/* Explanation Drawer / Card */}
                                        {isExpanded && (
                                            <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-4 shadow-sm space-y-3 mt-3">
                                                {/* Header: ⚠️ QUESTION {X} EXPLANATION & RATIONALE + [ Review this → ] */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                                        <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                                                            ⚠️ QUESTION {q.question_number} EXPLANATION &amp; RATIONALE
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleReviewThis(q.passage_number, expObj.paragraph_ref)}
                                                        className="text-xs bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/60 text-indigo-300 font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                                                        title="Scroll Left Panel to exact paragraph"
                                                    >
                                                        Review this →
                                                    </button>
                                                </div>

                                                {/* Status Notice Box */}
                                                <div className="bg-[#15181E] border border-[#222732] rounded-xl p-3 text-slate-300 text-xs">
                                                    {!wasAnswered ? (
                                                        <span className="text-amber-300 font-medium">⚠️ This question was left unanswered</span>
                                                    ) : !q.is_correct ? (
                                                        <span className="text-rose-300 font-medium">⚠️ Your answer "{q.candidate_answer}" was incorrect</span>
                                                    ) : (
                                                        <span className="text-emerald-400 font-medium">✓ Your answer is correct!</span>
                                                    )}
                                                </div>

                                                {/* Why this is correct */}
                                                <div className="space-y-1">
                                                    <span className="text-xs font-bold text-white block">Why this is correct:</span>
                                                    <p className="text-xs text-slate-300 leading-relaxed">{expObj.why_correct}</p>
                                                </div>

                                                {/* PASSAGE EVIDENCE Block */}
                                                {expObj.passage_evidence && (
                                                    <div className="bg-[#0D0F12] border-l-4 border-indigo-500 p-3.5 rounded-r-xl space-y-1.5 my-2 border-t border-b border-r border-[#222732]">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
                                                                PASSAGE EVIDENCE
                                                            </span>
                                                            <span className="text-[10px] font-mono text-slate-400 bg-[#15181E] px-2 py-0.5 rounded border border-[#222732]">
                                                                {expObj.paragraph_ref}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-200 font-serif italic text-xs leading-relaxed">
                                                            "{expObj.passage_evidence}"
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Common Trap */}
                                                {expObj.common_trap && (
                                                    <div className="bg-amber-950/20 border border-amber-800/30 p-3 rounded-lg text-xs text-amber-300">
                                                        <strong>⚠️ Common Trap:</strong> {expObj.common_trap}
                                                    </div>
                                                )}

                                                {/* Strategy Tip */}
                                                {expObj.strategy_tip && (
                                                    <div className="bg-purple-950/30 border border-purple-800/40 p-3 rounded-xl text-purple-200 text-xs leading-relaxed flex items-start gap-2.5">
                                                        <Lightbulb className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                                        <div>
                                                            <strong className="text-purple-200">Strategy Tip:</strong> {expObj.strategy_tip}
                                                        </div>
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
    );
};

/* ───────────────────────── Objective View ───────────────────────── */

const ObjectiveView: React.FC<{
    data: ObjectiveAnalysis;
    passages?: ReadingPassageItem[];
    bookNumber?: number;
    testNumber?: number;
}> = ({ data, passages = [], bookNumber, testNumber }) => {
    const [passage, setPassage] = React.useState<ObjectiveAnalysis['passageCtx'] | null>(null);
    const o = data;

    const passageBreakdown = useMemo(() => {
        const p1 = o.answers.filter((a) => a.q <= 13);
        const p2 = o.answers.filter((a) => a.q >= 14 && a.q <= 26);
        const p3 = o.answers.filter((a) => a.q >= 27);
        const p1Correct = p1.filter((a) => a.status === 'correct').length;
        const p2Correct = p2.filter((a) => a.status === 'correct').length;
        const p3Correct = p3.filter((a) => a.status === 'correct').length;

        const p1Title = passages.find(p => p.passage_number === 1)?.title
            || (bookNumber && testNumber && CAMBRIDGE_PASSAGE_TITLES[bookNumber]?.[testNumber]?.[0])
            || 'Passage 1';
        const p2Title = passages.find(p => p.passage_number === 2)?.title
            || (bookNumber && testNumber && CAMBRIDGE_PASSAGE_TITLES[bookNumber]?.[testNumber]?.[1])
            || 'Passage 2';
        const p3Title = passages.find(p => p.passage_number === 3)?.title
            || (bookNumber && testNumber && CAMBRIDGE_PASSAGE_TITLES[bookNumber]?.[testNumber]?.[2])
            || 'Passage 3';

        return [
            { name: 'Passage 1 (Q1–13)', title: p1Title, correct: p1Correct, total: p1.length || 13, accuracy: Math.round((p1Correct / (p1.length || 13)) * 100), difficulty: 'Easy' },
            { name: 'Passage 2 (Q14–26)', title: p2Title, correct: p2Correct, total: p2.length || 13, accuracy: Math.round((p2Correct / (p2.length || 13)) * 100), difficulty: 'Medium' },
            { name: 'Passage 3 (Q27–40)', title: p3Title, correct: p3Correct, total: p3.length || 14, accuracy: Math.round((p3Correct / (p3.length || 14)) * 100), difficulty: 'Hard' },
        ];
    }, [o.answers, passages, bookNumber, testNumber]);

    return (
        <div className="space-y-4">
            <Card title="Overview Metric Bar" subtitle="Performance snapshot vs allocated time">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { l: 'Band Score', v: o.band.toFixed(1) },
                        { l: 'Accuracy Rate', v: `${Math.round((o.correct / (o.total || 40)) * 100)}%` },
                        { l: 'Correct', v: `${o.correct}/${o.total}` },
                        { l: 'Missed / Omitted', v: `${o.incorrect} / ${o.unanswered}` },
                        { l: 'Elapsed Duration', v: `${o.timeSpent}m / ${o.allocated}m` },
                    ].map((m) => (
                        <div key={m.l} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500">{m.l}</p>
                            <p className="text-xl font-semibold text-white mt-1">{m.v}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Breakdown by Passage" subtitle="Accuracy rate and completion progress per reading passage">
                <div className="space-y-4">
                    {passageBreakdown.map((pb) => (
                        <div key={pb.name} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-white">
                                    {pb.name} <span className="text-slate-400 font-normal">({pb.title} • {pb.difficulty})</span>
                                </span>
                                <span className="font-mono text-slate-300">
                                    {pb.correct}/{pb.total} Correct ({pb.accuracy}%)
                                </span>
                            </div>
                            <Bar value={pb.accuracy} max={100} color={pb.accuracy >= 70 ? '#10b981' : pb.accuracy >= 50 ? '#fbbf24' : '#ef4444'} />
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

export interface IELTSAnalysisViewProps {
    isModal?: boolean; // true when opened from History Matrix, false when embedded in post-submission
    attemptId?: number | string;
    bundleId?: IeltsBundleId;
    bookNumber?: number;
    testNumber?: number;
    answersPayload?: any;
    skillModule?: 'reading' | 'listening' | 'writing' | 'speaking';
    title?: string;
    timeSpent?: number; // seconds
    bandScoreProp?: number;
    scoreProp?: number;
    onClose?: () => void;
    onRetake?: () => void;
}

const IELTSAnalysisView: React.FC<IELTSAnalysisViewProps> = ({
    isModal = false,
    attemptId,
    bundleId,
    bookNumber,
    testNumber,
    answersPayload,
    skillModule,
    title: propsTitle,
    timeSpent,
    bandScoreProp,
    scoreProp,
    onClose,
    onRetake,
}) => {
    const parsedUserAnswers = useMemo(() => {
        if (!answersPayload) return {};
        if (typeof answersPayload === 'object') return answersPayload;
        try {
            return JSON.parse(answersPayload as unknown as string);
        } catch (e) {
            console.error('Failed to parse answersPayload:', e);
            return {};
        }
    }, [answersPayload]);

    const rawData = React.useMemo<ResolvedAnalysis>(
        () => resolveAnalysis({ attemptId: typeof attemptId === 'number' ? attemptId : undefined, bundleId }, readAttempts()),
        [attemptId, bundleId],
    );

    const [realObjective, setRealObjective] = useState<ObjectiveAnalysis | null>(null);
    const [scoreViewMode, setScoreViewMode] = useState<'ai' | 'teacher'>('ai');

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose?.();
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
    }, [attemptId, rawData.skill, rawData.title]);

    const parsedBook = bookNumber || parseInt(((propsTitle || rawData.title) || '').match(/Cambridge\s*(\d+)/i)?.[1] || '7', 10);
    const parsedTest = testNumber || parseInt(((propsTitle || rawData.title) || '').match(/Test\s*(\d+)/i)?.[1] || '1', 10);
    const effectiveSkill = skillModule || (bookNumber ? 'reading' : rawData.skill || 'reading');
    const title = propsTitle || ((bookNumber && testNumber)
        ? `Cambridge IELTS ${parsedBook} — Test ${parsedTest}`
        : (rawData.title ?? (rawData.skill ? skillLabels[rawData.skill] : 'Cambridge IELTS Test Results')));

    const {
        passages: examPassages,
        questions: examQuestions,
        correctCount: examCorrectCount,
        bandScore: examBandScore,
    } = useExamData({
        bookNumber: parsedBook,
        testNumber: parsedTest,
        module: effectiveSkill,
        attemptId,
        initialAnswers: parsedUserAnswers,
        testTitle: title,
    });

    useEffect(() => {
        if (effectiveSkill === 'reading' && examQuestions && examQuestions.length > 0) {
            let correctCount = 0;
            let incorrectCount = 0;
            let unansweredCount = 0;

            const answers: ObjectiveAnswer[] = examQuestions.map((q) => {
                const userRaw = (q.candidate_answer || '').trim();
                const isBlank = !userRaw;
                const isMatch = Boolean(q.is_correct);
                if (isBlank) unansweredCount++;
                else if (isMatch) correctCount++;
                else incorrectCount++;

                return {
                    q: q.question_number,
                    your: userRaw || '(No answer provided)',
                    correct: q.correct_answer || '—',
                    type: q.question_type || 'Reading Question',
                    timeSpent: 45,
                    status: isBlank ? 'unanswered' : isMatch ? 'correct' : 'incorrect',
                    prompt: q.prompt || q.prompt_text,
                    explanation: q.explanation?.why_correct,
                    tapeScriptExcerpt: q.explanation?.passage_evidence
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

            setRealObjective({
                band: bandScoreProp || examBandScore || 6.5,
                correct: scoreProp !== undefined ? scoreProp : correctCount,
                incorrect: incorrectCount,
                unanswered: unansweredCount,
                total: examQuestions.length,
                timeSpent: timeSpent ? Math.round(timeSpent / 60) : 60,
                allocated: 60,
                questionTypes,
                pacing: [
                    { part: 'Passage 1 (Q1-13)', minutes: 18, avgPerQ: 83 },
                    { part: 'Passage 2 (Q14-26)', minutes: 20, avgPerQ: 92 },
                    { part: 'Passage 3 (Q27-40)', minutes: 22, avgPerQ: 94 },
                ],
                answers,
                passageCtx: {
                    heading: `${title} Context`,
                    paragraph: examPassages[0]?.sections?.[0]?.content || 'Authentic Cambridge Reading telemetry.',
                    highlight: '',
                    trick: 'Focus on contextual synonyms and grammatical paraphrase.'
                }
            });
        }
    }, [effectiveSkill, examQuestions, examPassages, examBandScore, bandScoreProp, scoreProp, timeSpent, title]);

    const data: ResolvedAnalysis = {
        ...rawData,
        objective: realObjective || rawData.objective
    };

    const rawAiBand =
        bandScoreProp !== undefined
            ? bandScoreProp
            : data.kind === 'bundle'
            ? data.bundle?.verdict.prediction ?? 0
            : data.kind === 'objective'
            ? data.objective?.band ?? 0
            : data.kind === 'writing'
            ? data.writing?.band ?? 0
            : data.speaking?.band ?? 0;
            
    // If teacher verified, simulated +0.5 band increase
    const teacherBand = Math.min(9.0, rawAiBand + 0.5);
    const headerBand = scoreViewMode === 'teacher' ? teacherBand : rawAiBand;

    const innerModalCanvas = (
        <div
            className={`relative w-full max-w-7xl bg-[#0D0F12] border border-[#222732] shadow-2xl overflow-hidden flex flex-col ${
                isModal ? 'h-[94vh] rounded-2xl' : 'rounded-2xl min-h-[calc(100vh-3rem)]'
            }`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* ── TOP UNIFIED HEADER ── */}
            <header className="sticky top-0 z-20 shrink-0 flex items-center justify-between gap-4 px-6 py-3.5 bg-[#15181E] border-b border-[#222732] rounded-t-2xl flex-wrap shadow-sm">
                <div className="flex items-center gap-4 min-w-0">
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg border border-[#222732] bg-[#0D0F12] hover:bg-[#1E232E] text-slate-300 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                            title="Return to Reading Hub"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <span>Overview</span>
                            <span>&gt;</span>
                            <span className="text-slate-300">Reading</span>
                            <span>&gt;</span>
                            <span className="text-rose-400 font-semibold">Results Analysis</span>
                        </div>
                        <h1 className="text-base sm:text-lg font-bold text-white leading-tight mt-0.5 truncate">
                            {title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    {/* Universal Student Dispute Action & Modal */}
                    <StudentDisputeButtonAndModal
                        testTitle={title}
                        module={(effectiveSkill as any) || 'reading'}
                        originalBand={headerBand || 6.5}
                        rawAnswers={parsedUserAnswers || data.objective?.answers}
                        bookNumber={parsedBook}
                        testNumber={parsedTest}
                        scoreViewMode={scoreViewMode}
                        onScoreViewModeChange={setScoreViewMode}
                    />

                    {/* Retake Test Button */}
                    <button
                        onClick={() => {
                            if (onRetake) onRetake();
                            else toast.info('Starting test retake session...');
                        }}
                        className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#222732] bg-[#0D0F12] hover:bg-[#1E232E] text-slate-300 transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Retake Test
                    </button>

                    {/* Quick Guide Button */}
                    <button
                        onClick={() => toast.info('Quick Guide: Review each question using the independent dual-pane split view. Click "Review this →" to jump directly to passage evidence.')}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-[#1E232E] transition-colors cursor-pointer"
                    >
                        <HelpCircle className="w-3.5 h-3.5" />
                        Quick Guide
                    </button>

                    {/* Brand Pill */}
                    <div className="bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wider shadow-sm select-none">
                        IELTS Dynasty
                    </div>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="px-3.5 py-1.5 rounded-xl bg-[#222732] hover:bg-neutral-700 text-xs font-bold text-white transition-colors cursor-pointer ml-1"
                            title="Close Analysis"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </header>

            {/* ── UNIFIED SCROLLING ENGINE CANVAS (NO TAB TOGGLES) ── */}
            <div className="p-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                {effectiveSkill === 'reading' ? (
                    <ReadingAnalysisSplitCanvas
                        bookNumber={parsedBook}
                        testNumber={parsedTest}
                        attemptId={attemptId}
                        rawAnswers={parsedUserAnswers}
                        testTitle={title}
                        timeSpentSeconds={timeSpent}
                        bandScoreProp={bandScoreProp}
                        scoreProp={scoreProp}
                    />
                ) : (
                    <>
                        {data.kind === 'objective' && data.objective && (
                            <ObjectiveView
                                data={data.objective}
                                passages={examPassages}
                                bookNumber={parsedBook}
                                testNumber={parsedTest}
                            />
                        )}
                        {data.kind === 'writing' && data.writing && <WritingView data={data.writing} />}
                        {data.kind === 'speaking' && data.speaking && <SpeakingView data={data.speaking} />}
                        {data.kind === 'bundle' && data.bundle && <BundleView data={data.bundle} />}
                    </>
                )}
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

export default IELTSAnalysisView;


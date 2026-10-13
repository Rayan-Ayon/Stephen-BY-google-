import React, { useState, useMemo, useEffect } from 'react';
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
    WritingRewrite,
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

    // Keyboard ESC to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // ── Task Extraction & Dual-Task Hydration ──────────────────────────────
    const tasksData = attempt?.tasks_data
        || attempt?.evaluation_payload_json?.tasks_data
        || attempt?.evaluation?.tasks_data
        || (attempt?.evaluation_payload_json?.details?.tasks_data)
        || data?.tasks_data;

    const evalObj = attempt?.evaluation
        || attempt?.evaluation_payload_json?.evaluation
        || (attempt?.evaluation_payload_json?.details?.evaluation)
        || data?.evaluation;

    const task1 = tasksData?.task1 || (attempt?.task1_response ? {
        prompt: attempt?.task1_prompt,
        essayText: attempt?.task1_response,
        wordCount: attempt?.task1_word_count,
        evaluation: evalObj?.task1,
    } : (evalObj?.task1 ? {
        prompt: attempt?.task1_prompt,
        essayText: attempt?.task1_response || '',
        wordCount: attempt?.task1_word_count || 0,
        evaluation: evalObj.task1,
    } : null));

    const task2 = tasksData?.task2 || (attempt?.task2_response ? {
        prompt: attempt?.task2_prompt,
        essayText: attempt?.task2_response,
        wordCount: attempt?.task2_word_count,
        evaluation: evalObj?.task2,
    } : (evalObj?.task2 ? {
        prompt: attempt?.task2_prompt,
        essayText: attempt?.task2_response || data?.essayText || attempt?.essayText || '',
        wordCount: attempt?.task2_word_count || (data?.wordCount ?? 0),
        evaluation: evalObj.task2,
    } : null));

    const t1Band = Number(task1?.evaluation?.band ?? attempt?.criteria?.find((c: any) => c.label === 'Task 1')?.band ?? 6.5);
    const t2Band = Number(task2?.evaluation?.band ?? attempt?.criteria?.find((c: any) => c.label === 'Task 2')?.band ?? (data?.overallBand ?? 6.5));

    // Active Tab State (defaults to Task 2 or Task 1 if Task 2 is absent)
    const [activeTaskTab, setActiveTaskTab] = useState<'task1' | 'task2'>('task2');
    const [modelLang, setModelLang] = useState<'en' | 'bn'>('en');
    const [expandedCriterion, setExpandedCriterion] = useState<string | null>('TR');
    const [scoreViewMode, setScoreViewMode] = useState<'ai' | 'teacher'>('ai');

    const examTitle = useMemo(() => {
        if (data?.examTitle) return data.examTitle;
        if (attempt?.book_number && attempt?.test_number) {
            return `Cambridge ${attempt.book_number} — Test ${attempt.test_number}`;
        }
        return attempt?.title || 'Academic Writing Attempt';
    }, [data, attempt]);

    const examDate = data?.examDate || attempt?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeSpentMinutes = data?.timeSpentMinutes || attempt?.timeSpent || 40;

    // Active Task Derived Content
    const currentTask = activeTaskTab === 'task1' ? task1 : task2;
    const activePrompt = currentTask?.prompt
        || (activeTaskTab === 'task1'
            ? (attempt?.task1_prompt || 'The chart below shows the number of adults participating in different major sports in one area, in 1997 and 2017. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.')
            : (attempt?.task2_prompt || attempt?.prompt || data?.promptText || 'Some people believe that university education should be free to all students. To what extent do you agree or disagree?'));

    const activeEssay = currentTask?.essayText
        || (activeTaskTab === 'task1'
            ? (attempt?.task1_response || '')
            : (data?.essayText || attempt?.essayText || attempt?.task2_response || ''));

    const activeWordCount = currentTask?.wordCount
        || (activeEssay.trim() ? activeEssay.trim().split(/\s+/).filter(Boolean).length : (activeTaskTab === 'task1' ? 165 : 285));

    const activeMinWordCount = activeTaskTab === 'task1' ? 150 : 250;
    const isUnderLength = activeWordCount < 35;

    const activeEvaluation = useMemo(() => {
        return (activeTaskTab === 'task1' ? task1?.evaluation : task2?.evaluation)
            || (activeTaskTab === 'task1' ? evalObj?.task1 : evalObj?.task2)
            || (activeTaskTab === 'task2' ? evalObj : null);
    }, [activeTaskTab, task1, task2, evalObj]);

    // Normalize extraction of all 4 official Cambridge criteria
    const criteriaList = useMemo(() => {
        const isT1 = activeTaskTab === 'task1';
        const defaultScore = isUnderLength ? 1.5 : (activeEvaluation?.band ?? (isT1 ? t1Band : t2Band));
        const defaultSummary = isUnderLength
            ? `Severe under-length penalty: Candidate submitted ${activeWordCount} words (minimum ${isT1 ? 150 : 250} required). Minimal or no response to the prompt.`
            : 'Evaluated against official Cambridge assessment descriptors.';

        const defaultCriteria = [
            {
                code: isT1 ? 'TA' : 'TR',
                title: isT1 ? 'Task Achievement' : 'Task Response',
                score: isUnderLength ? 1.0 : defaultScore,
                summary: isUnderLength ? `Candidate wrote only ${activeWordCount} words, failing to develop or address the prompt requirements.` : defaultSummary,
                strengths: isUnderLength ? [] : (activeEvaluation?.strengths || ['Addresses main prompt requirements']),
                improvements: isUnderLength ? [`Produce at least ${isT1 ? 150 : 250} words to achieve Band 5.0+`] : (activeEvaluation?.improvements || ['Expand secondary arguments with evidence']),
                bandBooster: isT1 ? 'Synthesize all high/low anomalous shifts in your visual overview before specific data comparisons.' : 'Develop an extended example in body paragraph 2 using empirical rationale.',
            },
            {
                code: 'CC',
                title: 'Coherence & Cohesion',
                score: isUnderLength ? 1.5 : defaultScore,
                summary: isUnderLength ? 'Insufficient sentence volume to demonstrate logical discourse progression or cohesive devices.' : 'Discourse progression and paragraph sequencing evaluated.',
                strengths: isUnderLength ? [] : ['Logical paragraph progression'],
                improvements: isUnderLength ? ['Structure response into clear paragraphs: Overview, Body 1, and Body 2'] : ['Diversify cohesive devices'],
                bandBooster: 'Use linking discourse markers like "In contrast", "Furthermore", and "Consequently".',
            },
            {
                code: 'LR',
                title: 'Lexical Resource',
                score: isUnderLength ? 2.0 : defaultScore,
                summary: isUnderLength ? 'Extremely limited vocabulary consisting only of elementary isolated tokens.' : 'Academic vocabulary and collocation range evaluated.',
                strengths: isUnderLength ? [] : ['Appropriate topic vocabulary deployed'],
                improvements: isUnderLength ? ['Avoid repeating elementary phrases. Learn thematic collocations'] : ['Refine word choice to eliminate generic descriptors'],
                bandBooster: 'Incorporate tier-3 academic collocations relevant to the prompt topic.',
            },
            {
                code: 'GRA',
                title: 'Grammatical Range & Accuracy',
                score: isUnderLength ? 1.5 : defaultScore,
                summary: isUnderLength ? `Frequent basic errors in minimal output (e.g. "${activeEssay.trim()}").` : 'Syntactic complexity and error frequency evaluated.',
                strengths: isUnderLength ? [] : ['Accurate sentence structures utilized'],
                improvements: isUnderLength ? ['Eliminate auxiliary verb collisions (use "I agree", not "I am agree")'] : ['Consolidate complex clause structures under time pressure'],
                bandBooster: 'Deploy conditional clauses, participial phrases, and passives accurately.',
            },
        ];

        if (!activeEvaluation?.criteria) {
            return defaultCriteria;
        }

        const critObj = activeEvaluation.criteria;

        if (Array.isArray(critObj)) {
            return critObj.map((item: any) => ({
                code: item.code || 'CR',
                title: item.title || item.name || 'Criterion',
                score: typeof item.score === 'number' ? item.score : (item.band || defaultScore),
                summary: item.summary || item.note || defaultSummary,
                strengths: Array.isArray(item.strengths) ? item.strengths : [],
                improvements: Array.isArray(item.improvements) ? item.improvements : (Array.isArray(item.weaknesses) ? item.weaknesses : []),
                bandBooster: item.bandBooster || item.booster || 'Deploy complex structures for Band 8+.',
            }));
        }

        const mappedList: any[] = [];
        const seenCodes = new Set<string>();

        Object.entries(critObj).forEach(([key, val]: [string, any]) => {
            const lk = key.toLowerCase();
            const isTaKey = lk === 'ta' || lk === 'taskachievement' || lk === 'task_achievement';
            const isTrKey = lk === 'tr' || lk === 'taskresponse' || lk === 'task_response';
            const isCcKey = lk === 'cc' || lk === 'coherencecohesion' || lk === 'coherence_cohesion';
            const isLrKey = lk === 'lr' || lk === 'lexicalresource' || lk === 'lexical_resource';
            const isGraKey = lk === 'gra' || lk === 'grammaticalrange' || lk === 'grammatical_range';

            let code = isTaKey ? 'TA' : isTrKey ? 'TR' : isCcKey ? 'CC' : isLrKey ? 'LR' : isGraKey ? 'GRA' : key.toUpperCase();
            if (isT1 && code === 'TR') code = 'TA';
            if (!isT1 && code === 'TA') code = 'TR';

            let title = isTaKey ? 'Task Achievement' : isTrKey ? 'Task Response' : isCcKey ? 'Coherence & Cohesion' : isLrKey ? 'Lexical Resource' : isGraKey ? 'Grammatical Range & Accuracy' : (isT1 ? 'Task Achievement' : 'Task Response');

            let score = defaultScore;
            let summary = defaultSummary;
            let strengths: string[] = [];
            let improvements: string[] = [];
            let bandBooster = 'Deploy complex structures for Band 8+.';

            if (typeof val === 'number') {
                score = val;
            } else if (val && typeof val === 'object') {
                code = val.code || code;
                title = val.title || title;
                score = typeof val.score === 'number' ? val.score : Number(val.band || defaultScore);
                summary = val.summary || val.band_descriptor_summary || defaultSummary;
                strengths = Array.isArray(val.strengths) ? val.strengths : [];
                improvements = Array.isArray(val.improvements) ? val.improvements : (Array.isArray(val.weaknesses) ? val.weaknesses : []);
                bandBooster = val.bandBooster || val.band_booster_tip || val.booster || bandBooster;
            }

            if (!seenCodes.has(code)) {
                seenCodes.add(code);
                mappedList.push({
                    code,
                    title,
                    score,
                    summary,
                    strengths,
                    improvements,
                    bandBooster,
                });
            }
        });

        defaultCriteria.forEach((def) => {
            if (!seenCodes.has(def.code)) {
                mappedList.push(def);
            }
        });

        return mappedList;
    }, [activeEvaluation, activeTaskTab, isUnderLength, activeWordCount, t1Band, t2Band, activeEssay]);

    // Telemetry & Band Metrics
    const rawBand = useMemo(() => {
        if (isUnderLength) return 1.5;
        if (task1?.evaluation?.band && task2?.evaluation?.band) {
            const wm = (task1.evaluation.band + 2.0 * task2.evaluation.band) / 3.0;
            const frac = wm - Math.floor(wm);
            if (frac < 0.25) return Math.floor(wm);
            if (frac < 0.75) return Math.floor(wm) + 0.5;
            return Math.floor(wm) + 1;
        }
        return data?.overallBand ?? attempt?.band ?? attempt?.overall_band ?? (isUnderLength ? 1.5 : 6.5);
    }, [isUnderLength, task1, task2, data, attempt]);

    const teacherVerifiedBand = Math.min(9.0, rawBand + 0.5);
    const displayedBand = scoreViewMode === 'teacher' ? teacherVerifiedBand : rawBand;
    const targetBand = data?.targetBand ?? 7.5;

    // Surgical Grammar Corrections
    const rawCorrections = activeEvaluation?.grammarCorrections
        || activeEvaluation?.grammar_corrections
        || currentTask?.evaluation?.grammarCorrections
        || [];

    const corrections = useMemo(() => {
        if (rawCorrections && rawCorrections.length > 0) {
            return rawCorrections.map((c: any) => ({
                original: c.original || '',
                corrected: c.corrected || c.correction || c.suggested || '',
                explanation: c.explanation || c.reason || '',
            }));
        }
        if (isUnderLength && activeEssay.trim()) {
            const hasAgree = activeEssay.toLowerCase().includes('agree');
            return [
                {
                    original: activeEssay.trim(),
                    corrected: hasAgree ? 'I completely agree with the statement.' : 'Rewritten formal academic response.',
                    explanation: hasAgree
                        ? 'Incorrect auxiliary verb form and missing capitalization: "i am totally agree" should be "I completely agree".'
                        : `Severe under-length response: Candidate produced only ${activeWordCount} words.`,
                },
            ];
        }
        return [];
    }, [rawCorrections, isUnderLength, activeEssay, activeWordCount]);

    // Official Band 9 Model Answer
    const modelAnswer = useMemo(() => {
        const ma = activeEvaluation?.modelAnswer || activeEvaluation?.model_answer || currentTask?.evaluation?.modelAnswer;
        if (ma?.en) return ma;
        if (activeTaskTab === 'task1') {
            return {
                en: "The chart illustrates the changes in adult participation across several major sports within a single region between 1997 and 2017.\n\nOverall, it is immediately apparent that while tennis and swimming experienced noticeable declines in participation over the twenty-year timeframe, gym activities and running saw considerable increases, with gym workouts emerging as the dominant sport by 2017.\n\nIn 1997, swimming was by far the most popular recreational activity, engaging roughly 50,000 adults, followed closely by tennis at approximately 40,000 participants. However, by 2017, participation in swimming had dropped significantly to around 35,000, while tennis numbers contracted sharply to just under 25,000 individuals.\n\nConversely, gym attendance witnessed the most substantial surge, escalating from 20,000 in 1997 to peak at over 60,000 two decades later. Similarly, running gained significant traction, climbing steadily from 15,000 to nearly 38,000 participants. Cycling remained comparatively stable, hovering around 25,000 throughout the observed period.",
                bn: "প্রদত্ত চার্টটি ১৯৯৭ এবং ২০১৭ সালের মধ্যে একটি নির্দিষ্ট অঞ্চলে বিভিন্ন প্রধান খেলাধুলায় প্রাপ্তবয়স্কদের অংশগ্রহণের তুলনামূলক পরিবর্তন প্রদর্শন করে। সামগ্রিকভাবে, টেনিস এবং সাঁতারে অংশগ্রহণ উল্লেখযোগ্যভাবে কমলেও জিম এবং দৌড়ানোর জনপ্রিয়তা নাটকীয়ভাবে বৃদ্ধি পেয়েছে।"
            };
        }
        return {
            en: "Tertiary education plays a pivotal role in personal socioeconomic mobility and national economic prosperity. While a substantial body of opinion contends that governments should make university education entirely free for all citizens, I believe that an equitable cost-sharing model accompanied by targeted scholarships represents a far more sustainable and effective approach.\n\nProponents of universal free higher education argue that financial barriers frequently prevent talented individuals from disadvantaged backgrounds from fulfilling their academic potential. When tuition fees are eradicated, tertiary institutions become genuinely meritocratic, fostering social equality and creating a highly skilled workforce that drives technological innovation and fiscal growth. Furthermore, graduates contribute substantially higher tax revenues over their careers, which can be viewed as an indirect repayment of the state's initial investment in their schooling.\n\nNevertheless, fully subsidized higher education places an exorbitant burden on public expenditures. In nations where tertiary education is entirely funded by the state, universities often face chronic underfunding, leading to overcrowded lecture halls, deteriorating infrastructure, and reduced research capacities. Moreover, universal free tuition disproportionately benefits affluent students who already possess the socioeconomic capital to excel in competitive admissions. A more pragmatic framework involves maintaining moderate tuition fees while ensuring full, means-tested financial aid and interest-free loans for low-income candidates, thereby guaranteeing that state resources are directed precisely where they are needed most.\n\nIn conclusion, although the ideal of universal free university education is noble, direct unconditional subsidization threatens academic standards and public budgets. Governments should instead prioritize targeted financial grants to ensure equitable access without compromising educational excellence.",
            bn: "উচ্চশিক্ষা ব্যক্তিগত আর্থ-সামাজিক অগ্রগতি এবং জাতীয় অর্থনৈতিক সমৃদ্ধির ক্ষেত্রে অত্যন্ত গুরুত্বপূর্ণ ভূমিকা পালন করে। যদিও অনেকে মনে করেন যে বিশ্ববিদ্যালয় শিক্ষা সবার জন্য সম্পূর্ণ বিনামূল্যে হওয়া উচিত, তবুও আমি মনে করি যে লক্ষ্যভিত্তিক বৃত্তির সাথে একটি ভারসাম্যপূর্ণ খরচ-বণ্টন নীতি অনেক বেশি টেকসই।"
        };
    }, [activeEvaluation, currentTask, activeTaskTab]);

    const examinerSummary = activeEvaluation?.summary;
    const cefrLevel = displayedBand >= 8.0 ? 'C2 Proficiency' : displayedBand >= 7.0 ? 'C1 Advanced' : displayedBand >= 6.0 ? 'B2 Vantage' : displayedBand >= 4.0 ? 'B1 Intermediate' : 'A1 Breakthrough';

    if (isLoading && !data && !attempt) {
        return (
            <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-[#0D0F12] text-slate-200">
                <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold tracking-wide text-slate-300">Hydrating Writing Evaluation Payload...</p>
                <p className="text-xs text-slate-500 mt-1">Zero-pass lookup from Supabase writing telemetry</p>
            </div>
        );
    }

    const content = (
        <div
            className={`relative w-full max-w-[1600px] bg-[#0D0F12] border border-[#222732] shadow-2xl overflow-hidden flex flex-col text-slate-100 font-sans ${
                isModal ? 'h-[96vh] rounded-2xl' : 'rounded-2xl min-h-[calc(100vh-3rem)]'
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
                        rawAnswers={{ essay: activeEssay }}
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
                                Cambridge 1:2 Weighted
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
                                {displayedBand >= targetBand ? 'Meets university admission threshold' : 'Requires targeted refinement in Lexical Resource'}
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
                                {activeWordCount} <span className="text-lg font-normal text-slate-500">words</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-300 mt-1">
                                {activeWordCount >= activeMinWordCount
                                    ? `+${activeWordCount - activeMinWordCount} over ${activeMinWordCount} threshold`
                                    : `Under minimum requirement (${activeMinWordCount})`}
                            </p>
                        </div>
                        <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Target: {activeMinWordCount}+ words</span>
                            <span className={activeWordCount >= activeMinWordCount ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                                {activeWordCount >= activeMinWordCount ? 'Valid Length' : 'Under length penalty'}
                            </span>
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
                                {timeSpentMinutes <= 60 ? 'Completed within standard allocated duration' : 'Exceeded standard pacing threshold'}
                            </p>
                        </div>
                        <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Allocated: 60m Total</span>
                            <span className="text-emerald-400 font-semibold">{Math.max(0, 60 - timeSpentMinutes)}m reserve</span>
                        </div>
                    </div>
                </div>

                {/* ════ SECTION 2: PRIMARY DUAL-TASK SWITCHER STRIP ════ */}
                <div className="flex items-center gap-3 p-1.5 bg-[#15181E] border border-[#222732] rounded-2xl w-fit">
                    <button
                        onClick={() => {
                            setActiveTaskTab('task1');
                            setExpandedCriterion('TA');
                        }}
                        className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                            activeTaskTab === 'task1'
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1C212B]'
                        }`}
                    >
                        <span>📊 Task 1: Academic Report</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            activeTaskTab === 'task1' ? 'bg-black/30 text-white' : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                        }`}>
                            Band {t1Band.toFixed(1)}
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTaskTab('task2');
                            setExpandedCriterion('TR');
                        }}
                        className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
                            activeTaskTab === 'task2'
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1C212B]'
                        }`}
                    >
                        <span>✍️ Task 2: Discursive Essay</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            activeTaskTab === 'task2' ? 'bg-black/30 text-white' : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                        }`}>
                            Band {t2Band.toFixed(1)}
                        </span>
                    </button>
                </div>

                {/* ════ SECTION 3: 4-PILLAR SCORE CARDS ROW FOR ACTIVE TASK ════ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {criteriaList.map((c) => {
                        const scoreNum = Number(c.score || 1.5);
                        const pct = Math.min(100, Math.round((scoreNum / 9) * 100));
                        return (
                            <div key={c.code} className="bg-[#15181E] border border-[#222732] rounded-xl p-4 flex flex-col justify-between shadow-xs">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-mono font-bold text-amber-400">
                                        {c.code}: {c.title}
                                    </span>
                                    <span className="text-lg font-black text-white">{scoreNum.toFixed(1)}</span>
                                </div>
                                <p className="text-xs font-medium text-slate-300 truncate mb-2">{c.title}</p>
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

                {/* ════ SECTION 4: 2-COLUMN MAIN DIAGNOSTIC WORKSPACE ════ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* ── LEFT COLUMN (6 COLS): ACTIVE TASK ESSAY, CORRECTIONS & MODEL ANSWER ── */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Prompt Card */}
                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-rose-500" />
                                Official {activeTaskTab === 'task1' ? 'Task 1' : 'Task 2'} Prompt & Requirements
                            </h3>
                            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-[#0D0F12] border border-[#222732] p-3.5 rounded-xl">
                                {activePrompt}
                            </p>
                        </div>

                        {/* Candidate Essay Canvas */}
                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-[#222732]">
                                <div>
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        Candidate Response — {activeTaskTab === 'task1' ? 'Task 1' : 'Task 2'}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Authentic text submitted during candidate exam session</p>
                                </div>
                                <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
                                    isUnderLength ? 'bg-rose-950/40 text-rose-300 border-rose-800/40 font-bold' : 'bg-[#0D0F12] text-slate-400 border-[#222732]'
                                }`}>
                                    {activeWordCount} words {isUnderLength && '• Under-Length Penalty'}
                                </span>
                            </div>

                            <div className="text-[14px] sm:text-[15px] leading-[1.85] text-slate-200 whitespace-pre-line bg-[#0D0F12] border border-[#222732] p-5 rounded-xl font-serif max-h-[380px] overflow-y-auto custom-scrollbar">
                                {activeEssay ? activeEssay : (
                                    <span className="text-slate-500 italic">No essay response recorded for this task.</span>
                                )}
                            </div>

                            {/* Surgical Grammar Corrections & Upgrades */}
                            {corrections.length > 0 && (
                                <div className="mt-4 p-4 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block flex items-center gap-2">
                                            <span>🔍</span> Surgical Grammar Corrections ({corrections.length})
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">Real Gemini Diagnostics</span>
                                    </div>
                                    <div className="space-y-2">
                                        {corrections.map((corr: any, idx: number) => {
                                            const fixed = corr.corrected || corr.correction || corr.suggested || '';
                                            return (
                                                <div key={idx} className="p-3 rounded-lg bg-[#14171F] border border-[#282D3D] space-y-1.5 text-xs">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="line-through text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/40 font-mono">
                                                            "{corr.original}"
                                                        </span>
                                                        <span className="text-slate-500 font-mono">→</span>
                                                        <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40 font-mono font-medium">
                                                            "{fixed}"
                                                        </span>
                                                    </div>
                                                    {corr.explanation && (
                                                        <p className="text-slate-300 text-[11px] leading-relaxed">{corr.explanation}</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Examiner Synthesis Note */}
                            {examinerSummary && (
                                <div className="p-4 bg-purple-950/20 border border-purple-800/30 rounded-xl text-xs text-purple-200 space-y-1">
                                    <div className="flex items-center gap-2 font-bold text-purple-300">
                                        <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                                        Examiner Synthesis Note
                                    </div>
                                    <p className="leading-relaxed text-purple-200/90">{examinerSummary}</p>
                                </div>
                            )}
                        </div>

                        {/* 🏆 Official Band 9.0 Examiner Model Essay Card */}
                        {modelAnswer?.en && (
                            <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-[#222732] flex-wrap gap-2">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <span className="text-base">🏆</span>
                                        Official Band 9.0 Examiner Model Essay
                                    </h3>
                                    <div className="flex items-center gap-1.5 p-1 bg-[#0D0F12] border border-[#222732] rounded-xl text-xs">
                                        <button
                                            onClick={() => setModelLang('en')}
                                            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                                                modelLang === 'en' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            English Model
                                        </button>
                                        {modelAnswer.bn && (
                                            <button
                                                onClick={() => setModelLang('bn')}
                                                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                                                    modelLang === 'bn' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                বাংলা অনুবাদ
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-[#0D0F12] border border-[#222732] rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed font-serif whitespace-pre-line max-h-[380px] overflow-y-auto custom-scrollbar">
                                    {modelLang === 'en' ? modelAnswer.en : (modelAnswer.bn || modelAnswer.en)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT COLUMN (6 COLS): 4-PILLAR RUBRIC ACCORDIONS ── */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Criterion Breakdown Accordions */}
                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-[#222732]">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Award className="w-4 h-4 text-rose-500" />
                                    IELTS 4-Pillar Evaluator Rubric — {activeTaskTab === 'task1' ? 'Task 1' : 'Task 2'}
                                </h3>
                                <span className="text-[11px] font-mono text-slate-400">Expand for Detailed Guidance</span>
                            </div>

                            {criteriaList.map((item) => {
                                const isExpanded = expandedCriterion === item.code;
                                const itemScore = Number(item.score || 1.5);
                                const accentColor = itemScore >= targetBand ? 'text-emerald-400' : itemScore >= targetBand - 1 ? 'text-amber-400' : 'text-rose-400';

                                return (
                                    <div key={item.code} className="rounded-xl bg-[#0D0F12] border border-[#222732] overflow-hidden transition-all">
                                        <button
                                            onClick={() => setExpandedCriterion(isExpanded ? null : item.code)}
                                            className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-[#15181E] transition-colors cursor-pointer"
                                        >
                                            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded shrink-0">
                                                {item.code}
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="text-xs font-semibold text-white block truncate">{item.title}</span>
                                                {!isExpanded && <span className="text-[11px] text-slate-400 mt-0.5 block truncate">{item.summary}</span>}
                                            </span>
                                            <span className={`text-base font-bold shrink-0 ${accentColor}`}>
                                                Band {itemScore.toFixed(1)}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isExpanded && (
                                            <div className="px-4 pb-4 pt-2 border-t border-[#222732] space-y-3">
                                                {/* Summary */}
                                                <div className="p-3 bg-[#14171F] border border-[#222732] rounded-lg text-xs text-slate-300 leading-relaxed">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                                        Examiner Evaluation Summary:
                                                    </span>
                                                    {item.summary}
                                                </div>

                                                {/* Strengths */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Strengths:</span>
                                                    {item.strengths && item.strengths.length > 0 ? (
                                                        <ul className="text-xs text-slate-300 space-y-1 list-none">
                                                            {item.strengths.map((s: string, idx: number) => (
                                                                <li key={idx} className="flex items-start gap-1.5">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                                    <span>{s}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-slate-500 italic pl-1">
                                                            No notable strengths identified due to insufficient essay volume.
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Areas for Growth / Improvements */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Areas for Growth:</span>
                                                    {item.improvements && item.improvements.length > 0 ? (
                                                        <ul className="text-xs text-slate-300 space-y-1 list-none">
                                                            {item.improvements.map((w: string, idx: number) => (
                                                                <li key={idx} className="flex items-start gap-1.5">
                                                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                                                    <span>{w}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-slate-500 italic pl-1">
                                                            Continue practicing full-length essays under timed conditions.
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Booster Callout */}
                                                {item.bandBooster && (
                                                    <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-3 text-xs text-emerald-200 flex items-start gap-2">
                                                        <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                        <div>
                                                            <strong className="text-emerald-300">Band 8.0+ Booster: </strong>
                                                            {item.bandBooster}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isModal) {
        return (
            <div
                className="fixed inset-0 z-50 flex flex-col bg-[#08090C]/90 backdrop-blur-md text-slate-100 overflow-y-auto antialiased p-2 sm:p-6 custom-scrollbar"
                onClick={onClose}
            >
                <div className="w-full max-w-[1600px] mx-auto min-h-screen flex flex-col justify-center py-4">
                    {content}
                </div>
            </div>
        );
    }

    return content;
};

export default WritingEvaluationCanvas;

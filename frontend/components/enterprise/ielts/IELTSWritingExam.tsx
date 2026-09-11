
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    TASK2_PROMPTS,
    GENERAL_TASK1_PROMPTS,
    buildSegments,
    buildBilingual,
    evaluateWritingText,
    addAttempt,
    formatClock,
    type SimulationProps,
    type WritingCriteria,
} from './ieltsShared';
import IELTSLobbyCard from './IELTSLobbyCard';
import IELTSExitModal from './IELTSExitModal';
import IeltsExamOptionsModal from '../../exam/IeltsExamOptionsModal';

const Check = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export const WRITING_PART1_CHART_DATA: { sport: string; y1997: number; y2017: number }[] = [
    { sport: 'Tennis', y1997: 50, y2017: 55 },
    { sport: 'Basketball', y1997: 9, y2017: 23 },
    { sport: 'Cricket', y1997: 26, y2017: 7 },
    { sport: 'Golf', y1997: 32, y2017: 33 },
    { sport: 'Swimming', y1997: 35, y2017: 35 },
    { sport: 'Football', y1997: 32, y2017: 48 },
    { sport: 'Rugby', y1997: 33, y2017: 49 },
];

const TASK1_ACADEMIC_TITLE = 'The chart below shows the number of adults participating in different major sports in one area, in 1997 and 2017.';
const TASK1_INSTRUCTION = 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.';
const TASK1_WORD_HINT = 'Write at least 150 words.';

const DRAFT_KEY_P1 = 'stephen_enterprise_farmgate_ielts_writing_p1';
const DRAFT_KEY_P2 = 'stephen_enterprise_farmgate_ielts_writing_p2';

const readDraft = (key: string): string => {
    try { return localStorage.getItem(key) || ''; } catch { return ''; }
};
const writeDraft = (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
};

type TestState = 'lobby' | 'active' | 'saving' | 'evaluating' | 'completed';

interface WritingResult {
    taskType: 'task1' | 'task2';
    prompt: string;
    text: string;
    band: number;
    criteria: WritingCriteria;
    feedback: { en: string; bn: string };
    date: string;
}

type WritingMode = 'full_mock' | 'task_2' | 'task_1_academic' | 'task_1_general';

interface IELTSWritingExamProps {
    candidateEmail?: string;
    simulation?: SimulationProps;
    testMode?: WritingMode;
    onActiveChange?: (active: boolean) => void;
    exitPulse?: boolean;
}

const ChartSVG: React.FC = () => {
    const W = 720; const H = 400;
    const plotL = 56; const plotR = 700; const plotT = 34; const plotB = 340;
    const plotW = plotR - plotL; const plotH = plotB - plotT;
    const n = WRITING_PART1_CHART_DATA.length;
    const groupW = plotW / n;
    const barW = 24;
    const yMax = 60;
    const yScale = plotH / yMax;
    const ticks = [0, 10, 20, 30, 40, 50, 60];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Number of adults participating in major sports, 1997 and 2017">
            <text x={plotL + plotW / 2} y={20} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#222222">
                Number of adults participating in major sports, 1997 and 2017
            </text>
            <g fontSize={11} fill="#555555">
                <rect x={plotR - 182} y={9} width={14} height={10} fill="#333333" />
                <text x={plotR - 164} y={18}>1997</text>
                <rect x={plotR - 102} y={9} width={14} height={10} fill="#888888" />
                <text x={plotR - 84} y={18}>2017</text>
            </g>
            {ticks.map((t) => {
                const y = plotB - t * yScale;
                return (
                    <g key={t}>
                        <line x1={plotL} y1={y} x2={plotR} y2={y} stroke="#E5E7EB" strokeWidth={1} />
                        <text x={plotL - 8} y={y + 4} textAnchor="end" fontSize={10} fill="#666666">{t}</text>
                    </g>
                );
            })}
            <text x={16} y={plotT + plotH / 2} textAnchor="middle" fontSize={11} fill="#444444" transform={`rotate(-90 16 ${plotT + plotH / 2})`}>
                Number of adults in thousands
            </text>
            {WRITING_PART1_CHART_DATA.map((d, i) => {
                const cx = plotL + groupW * i + groupW / 2;
                const h97 = d.y1997 * yScale;
                const h17 = d.y2017 * yScale;
                return (
                    <g key={d.sport}>
                        <rect x={cx - barW - 2} y={plotB - h97} width={barW} height={h97} fill="#333333" />
                        <rect x={cx + 2} y={plotB - h17} width={barW} height={h17} fill="#888888" />
                        <text x={cx} y={plotB + 16} textAnchor="middle" fontSize={10.5} fill="#444444">{d.sport}</text>
                    </g>
                );
            })}
            <text x={plotL + plotW / 2} y={H - 12} textAnchor="middle" fontSize={11} fill="#444444">Major sport</text>
        </svg>
    );
};

const IELTSWritingExam: React.FC<IELTSWritingExamProps> = ({ candidateEmail, simulation, testMode = 'full_mock', onActiveChange, exitPulse }) => {
    const [testState, setTestState] = useState<TestState>(simulation ? 'active' : 'lobby');
    const [activePart, setActivePart] = useState<1 | 2>(1);
    const [essayPart1, setEssayPart1] = useState<string>(() => readDraft(DRAFT_KEY_P1));
    const [essayPart2, setEssayPart2] = useState<string>(() => readDraft(DRAFT_KEY_P2));
    const [seconds, setSeconds] = useState(simulation ? simulation.timeLimitSeconds : 60 * 60);
    const [result, setResult] = useState<WritingResult | null>(null);
    const [lang, setLang] = useState<'en' | 'bn'>('en');
    const [showExitModal, setShowExitModal] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [resultsTab, setResultsTab] = useState<1 | 2>(1);
    const [expandedAnswer, setExpandedAnswer] = useState(false);

    const timeLimit = simulation ? simulation.timeLimitSeconds : 60 * 60;
    const showTaskSwitcher = testMode === 'full_mock';
    const isSingleTask = !showTaskSwitcher;
    const locked = testState !== 'active';
    const timerLow = seconds <= 300;
    const isEvaluating = testState === 'evaluating';

    const effectivePart = isSingleTask
        ? (testMode === 'task_2' ? 2 : 1)
        : activePart;

    const text = effectivePart === 1 ? essayPart1 : essayPart2;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const wordCount1 = essayPart1.trim() ? essayPart1.trim().split(/\s+/).length : 0;
    const wordCount2 = essayPart2.trim() ? essayPart2.trim().split(/\s+/).length : 0;
    const promptForPart = effectivePart === 1 ? TASK1_ACADEMIC_TITLE : TASK2_PROMPTS[0];
    const instructionForPart = effectivePart === 1 ? TASK1_INSTRUCTION : '';

    const prompt = effectivePart === 1
        ? (testMode === 'task_1_general' ? GENERAL_TASK1_PROMPTS[0] : promptForPart)
        : TASK2_PROMPTS[0];

    const minWords = effectivePart === 2 ? 250 : 150;
    const taskLabel = testMode === 'task_2' ? 'Task 2' : testMode === 'task_1_general' ? 'Task 1 Letter' : effectivePart === 1 ? 'Task 1 Academic' : 'Task 2';
    const pillText = testMode === 'task_1_general' ? '📄 Task 1 Letter Prompt' : effectivePart === 1 ? '📄 Task 1 Prompt' : '📄 Task 2 Prompt';

    const showChart = testMode !== 'task_1_general';

    const updatePart = (value: string) => {
        if (effectivePart === 1) {
            setEssayPart1(value);
            writeDraft(DRAFT_KEY_P1, value);
        } else {
            setEssayPart2(value);
            writeDraft(DRAFT_KEY_P2, value);
        }
    };

    const navigatePart = (dir: 1 | -1) => {
        if (!showTaskSwitcher) return;
        const next = effectivePart + dir;
        if (next === 1 || next === 2) setActivePart(next as 1 | 2);
    };

    useEffect(() => {
        if (testState !== 'active') return;
        const id = window.setInterval(() => setSeconds((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
        return () => window.clearInterval(id);
    }, [testState]);

    const openSubmitModal = () => {
        if (testState !== 'active') return;
        setShowSubmitModal(true);
    };

    const finalizeSubmit = (force = false) => {
        if (testState !== 'active') return;
        const trimmed1 = essayPart1.trim();
        const trimmed2 = essayPart2.trim();
        const activeTrimmed = (effectivePart === 1 ? trimmed1 : trimmed2) || '';
        if (!activeTrimmed && !trimmed1 && !trimmed2 && !force) return;
        setShowSubmitModal(false);
        setTestState('saving');
        window.setTimeout(() => {
            const evalText = activeTrimmed || trimmed2 || trimmed1 || ' ';
            const { criteria, band } = evaluateWritingText(evalText);
            const count = evalText.trim() ? evalText.trim().split(/\s+/).length : 0;
            const timeSpent = Math.max(1, Math.round((timeLimit - seconds) / 60));
            const taskType = effectivePart === 1 ? 'task1' : 'task2';
            const criteriaList = [
                { label: effectivePart === 1 ? 'Task Achievement' : 'Task Response', band: criteria.taskAchievement },
                { label: 'Coherence & Cohesion', band: criteria.coherence },
                { label: 'Lexical Resource', band: criteria.lexical },
                { label: 'Grammar Accuracy', band: criteria.grammar },
            ];
            if (simulation) {
                const evalResult: WritingResult = {
                    taskType,
                    prompt,
                    text: evalText,
                    band,
                    criteria,
                    feedback: buildBilingual(band, count),
                    date: new Date().toLocaleString(),
                };
                setResult(evalResult);
                addAttempt({
                    id: Date.now(),
                    skill: 'writing',
                    band,
                    taskType,
                    timeSpent,
                    criteria: criteriaList,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });
                setTestState('completed');
            } else {
                const evalResult: WritingResult = {
                    taskType,
                    prompt,
                    text: evalText,
                    band,
                    criteria,
                    feedback: buildBilingual(band, count),
                    date: new Date().toLocaleString(),
                };
                setResult(evalResult);
                addAttempt({
                    id: Date.now(),
                    skill: 'writing',
                    band,
                    taskType,
                    timeSpent,
                    criteria: criteriaList,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });
                setTestState('completed');
            }
        }, 2000);
    };

    const submit = (force = false) => {
        openSubmitModal();
    };

    useEffect(() => {
        if (testState === 'active' && seconds === 0) finalizeSubmit(true);
    }, [seconds, testState]);

    useEffect(() => {
        onActiveChange?.(testState !== 'lobby');
    }, [testState, onActiveChange]);

    const startExam = () => { setTestState('active'); };

    const resetExam = () => {
        setEssayPart1('');
        setEssayPart2('');
        setActivePart(1);
        setSeconds(simulation ? simulation.timeLimitSeconds : 60 * 60);
        setResult(null);
        setLang('en');
        setTestState('lobby');
        setShowExitModal(false);
        setShowSubmitModal(false);
    };

    const handleExit = () => {
        setShowExitModal(false);
        setShowSubmitModal(false);
        onActiveChange?.(false);
        if (simulation?.onExit) {
            simulation.onExit();
        } else {
            resetExam();
            onActiveChange?.(false);
        }
    };

    if (testState === 'lobby') {
        return (
            <IELTSLobbyCard
                skill="writing"
                candidateEmail={candidateEmail || ''}
                title="Writing Lab"
                subtitle="Computer-delivered academic writing with bilingual band evaluation."
                onStart={startExam}
            />
        );
    }

    const overallBand = result?.band ?? 7.5;
    const criteriaScores = {
        task: result?.criteria.taskAchievement ?? 7.5,
        coherence: result?.criteria.coherence ?? 7.0,
        lexical: result?.criteria.lexical ?? 8.0,
        grammar: result?.criteria.grammar ?? 7.5,
    };

    if (testState === 'saving' || testState === 'evaluating') {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center bg-white min-h-[60vh]">
                <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-orange-500 animate-spin mb-6" />
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Saving your test...</h2>
                <p className="text-sm text-neutral-500">Your answers are being recorded and sent for AI grading.</p>
            </div>
        );
    }

    if (testState === 'completed') {
        const activeAnswer = resultsTab === 1 ? essayPart1 : essayPart2;
        const activeWords = resultsTab === 1 ? wordCount1 : wordCount2;
        const strengths = resultsTab === 1
            ? ['Clear overview with well-selected main trends', 'Good use of comparison language and data grouping', 'Appropriate academic tone with varied vocabulary']
            : ['Well-structured paragraphs with clear topic sentences', 'Good range of linking words and academic vocabulary', 'Clear position maintained throughout the essay'];
        const improvements = resultsTab === 1
            ? ['Add more precise data references to support comparisons', 'Vary sentence starters to improve sentence variety', 'Check article usage in overview sentences for coherence']
            : ['Develop second body paragraph with a more specific example', 'Reduce repetition of high-frequency adjectives', 'Review subject-verb agreement in complex sentences'];
        const corrections = [
            { original: 'Many peoples now choose public transport because it is very good.', suggested: 'Many people now choose public transport because it is efficient and affordable.' },
            { original: 'The the results are clear in their innovation.', suggested: 'The results are clearly reflected in their innovation.' },
            { original: 'This is a very good thing because it creates a level playing field.', suggested: 'This is beneficial because it creates a level playing field.' },
        ];
        const modelAnswer = resultsTab === 1
            ? 'The chart compares adult participation in seven major sports in one region in 1997 and 2017. Overall, tennis remained the most popular sport in both years, while participation in basketball, football and rugby rose sharply. In contrast, cricket experienced a dramatic decline. In 1997, around 50,000 adults played tennis, rising slightly to 55,000 by 2017. Football and rugby both increased from roughly 32-33,000 to 48-49,000, overtaking swimming, which remained stable at 35,000. Basketball more than doubled from 9,000 to 23,000. Cricket, however, fell from 26,000 to just 7,000, the steepest drop of any sport. Golf changed little, edging up from 32,000 to 33,000.'
            : 'University education should be accessible to all, and making it free is one of the most effective ways to achieve this. Firstly, free tuition removes financial barriers for talented students from disadvantaged backgrounds, allowing them to focus on study rather than part-time work. Secondly, an educated workforce strengthens the economy and public services, as seen in Germany and Norway. Critics argue that free education lowers quality, but many tuition-free universities maintain world-class standards through public funding. In conclusion, the long-term social and economic benefits of free university education far outweigh the costs.';
        return (
            <div className="flex flex-col h-full w-full bg-white text-black overflow-hidden">
                <header className="shrink-0 h-14 bg-[#121212] flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={handleExit} className="text-gray-400 hover:text-white flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-800" aria-label="Back to Writing Hub">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        </button>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Cambridge · Test 1</p>
                            <p className="text-sm font-bold text-white leading-tight">Results & Analysis</p>
                        </div>
                    </div>
                    <button onClick={handleExit} className="text-sm font-semibold text-gray-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-xl transition-colors">Back to Writing Hub</button>
                </header>
                <div className="flex-1 min-h-0 overflow-y-auto bg-[#F7F7F8] p-6 custom-scrollbar">
                    <div className="max-w-5xl mx-auto space-y-6 pb-10">
                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col md:flex-row gap-6 items-start">
                            <div className="text-center bg-orange-50 border border-orange-200 rounded-2xl px-8 py-6 min-w-[180px]">
                                <p className="text-[11px] uppercase tracking-wider text-orange-600 font-bold mb-1">Overall Band</p>
                                <p className="text-5xl font-black text-neutral-900">{overallBand.toFixed(1)}</p>
                                <p className="text-xs text-neutral-500 mt-2">{wordCount1 + wordCount2} words · Task 1: {wordCount1} · Task 2: {wordCount2}</p>
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                {[
                                    { label: 'Task Achievement / Response', value: criteriaScores.task },
                                    { label: 'Coherence & Cohesion', value: criteriaScores.coherence },
                                    { label: 'Lexical Resource', value: criteriaScores.lexical },
                                    { label: 'Grammatical Range & Accuracy', value: criteriaScores.grammar },
                                ].map((c) => (
                                    <div key={c.label} className="rounded-xl bg-[#FAFAFA] border border-neutral-200 p-4">
                                        <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold mb-1">{c.label}</p>
                                        <p className="text-2xl font-bold text-neutral-900">{c.value.toFixed(1)}</p>
                                        <div className="h-1.5 rounded bg-neutral-200 overflow-hidden mt-2">
                                            <div className="h-full bg-orange-500" style={{ width: `${(c.value / 9) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 bg-white border border-neutral-200 p-1 rounded-xl w-fit">
                            {([1, 2] as (1 | 2)[]).map((t) => (
                                <button key={t} onClick={() => { setResultsTab(t); setExpandedAnswer(false); }} className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${resultsTab === t ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-black'}`}>
                                    Task {t} Analysis
                                </button>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
                            <div>
                                <button onClick={() => setExpandedAnswer(!expandedAnswer)} className="flex items-center justify-between w-full text-left">
                                    <h3 className="text-base font-bold text-neutral-900">User Answer Preview — Task {resultsTab} ({activeWords} words)</h3>
                                    <span className="text-neutral-400 text-sm">{expandedAnswer ? 'Hide ▲' : 'Expand ▼'}</span>
                                </button>
                                <div className={`mt-3 rounded-xl bg-[#FAFAFA] border border-neutral-200 p-4 text-sm leading-relaxed text-neutral-800 whitespace-pre-wrap ${expandedAnswer ? '' : 'line-clamp-4 overflow-hidden'}`}>
                                    {activeAnswer.trim() || '(No answer submitted for this task)'}
                                </div>
                                <div className="mt-3 rounded-xl bg-canvas border border-neutral-800 p-4">
                                    <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">Inline Highlight Preview</p>
                                    <p className="text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap">
                                        {activeAnswer.trim() ? buildSegments(activeAnswer).map((seg, i) =>
                                            seg.kind === 'plain' ? <span key={i}>{seg.text}</span> : seg.kind === 'vocab' ? <span key={i} className="bg-yellow-400/20 border-b border-yellow-400/50 text-yellow-100">{seg.text}</span> : <span key={i} className="bg-red-500/20 border-b border-red-500/60 text-red-200">{seg.text}</span>
                                        ) : <span className="text-neutral-500">No text to highlight</span>}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                                    <h4 className="text-sm font-bold text-emerald-800 mb-2">Key Strengths</h4>
                                    <ul className="list-disc ml-5 space-y-1.5 text-sm text-emerald-900">
                                        {strengths.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                                    <h4 className="text-sm font-bold text-amber-800 mb-2">Areas for Improvement</h4>
                                    <ul className="list-disc ml-5 space-y-1.5 text-sm text-amber-900">
                                        {improvements.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-neutral-900 mb-3">Grammar & Spelling Error Corrections</h4>
                                <div className="space-y-3">
                                    {corrections.map((c, i) => (
                                        <div key={i} className="rounded-xl border border-neutral-200 overflow-hidden">
                                            <div className="bg-red-50 px-4 py-2.5 text-sm"><span className="text-[10px] uppercase font-bold text-red-600 block mb-1">Original</span><span className="text-neutral-800 line-through decoration-red-400">{c.original}</span></div>
                                            <div className="bg-emerald-50 px-4 py-2.5 text-sm"><span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">Suggested Correction</span><span className="text-neutral-900 font-medium">{c.suggested}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl bg-[#121212] p-5">
                                <h4 className="text-sm font-bold text-white mb-2">Model Answer / High Band Sample (Band 8.0+)</h4>
                                <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{modelAnswer}</p>
                                <div className="flex items-center gap-1 rounded-lg bg-neutral-800 border border-neutral-700 p-1 w-fit mt-4">
                                    {(['en', 'bn'] as const).map((l) => (
                                        <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${lang === l ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}>{l.toUpperCase()}</button>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap mt-3">{lang === 'en' ? result?.feedback.en : result?.feedback.bn || result?.feedback.en}</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <button onClick={handleExit} className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-colors">Back to Writing Hub</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const progressPct = `${wordCount} / ${minWords}`;

    return (
        <div className="flex flex-col h-full w-full relative bg-[#FFFFFF] text-black font-sans min-w-0 overflow-hidden">
            {/* ── Clean Minimalist Top Header Bar ── */}
            <header className="shrink-0 h-14 bg-[#121212] border-b border-neutral-800 flex items-center justify-between px-6">
                {/* Left: Back arrow + Test info */}
                <div className="flex items-center gap-4">
                    <button onClick={handleExit} className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Cambridge · Test 1</p>
                        <p className="text-sm font-bold text-white leading-tight">Writing Test</p>
                    </div>
                </div>
                {/* Right: Autosave + Timer + Submit */}
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">✓ Autosave ready</span>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${timerLow ? 'bg-red-500/10 animate-pulse' : 'bg-neutral-800'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={timerLow ? '#ef4444' : '#9ca3af'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span className={`font-mono text-sm ${timerLow ? 'text-red-400' : 'text-white'}`}>{formatClock(seconds)}</span>
                    </div>
                    <button onClick={openSubmitModal} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-orange-500/20">
                        Submit
                    </button>
                </div>
            </header>

            <IeltsExamOptionsModal open={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} />

            {/* ── Main Content: 50/50 Split ── */}
            <div className="flex-1 min-h-0 flex overflow-hidden bg-[#FFFFFF]">
                {/* Left Column — Prompt & Question Panel */}
                <div className="w-1/2 h-full overflow-y-auto pr-6 pt-4 pb-20 custom-scrollbar border-r border-neutral-100">
                    {/* Pill Badge */}
                    <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7ED] border border-orange-200 text-orange-700 text-xs font-semibold">
                            {pillText} · Min. {minWords} words
                        </span>
                    </div>

                    {/* Question Text Container */}
                    <div className="text-neutral-800 space-y-3">
                        {isSingleTask ? (
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{prompt}</p>
                        ) : effectivePart === 1 ? (
                            <>
                                <h3 className="text-[16px] font-bold mb-1">{prompt}</h3>
                                <p className="text-[15px] font-medium mb-3">{instructionForPart}</p>
                                {showChart && (
                                    <div className="rounded-md border border-neutral-200 p-2 mt-3">
                                        <ChartSVG />
                                    </div>
                                )}
                                <p className="text-xs text-neutral-500 mt-3">{TASK1_WORD_HINT}</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-[16px] font-bold mb-3">Task 2 — Essay</h3>
                                <p className="text-[15px] leading-relaxed text-neutral-900 whitespace-pre-wrap mb-3">{prompt}</p>
                                <p className="text-[15px] font-medium">Write at least 250 words.</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column — Response Area */}
                <div className="w-1/2 h-full overflow-y-auto pl-6 pt-4 pb-20 bg-[#F9F9F9] relative">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-neutral-900">Your Answer</h3>
                        <span className="text-[10px] font-mono text-neutral-500 bg-white border border-neutral-200 px-2 py-1 rounded-full">{progressPct}</span>
                    </div>

                    {/* Text Input Box */}
                    <div className="max-w-3xl bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
                        <textarea
                            value={text}
                            onChange={(e) => updatePart(e.target.value)}
                            disabled={locked}
                            placeholder="Enter your response here..."
                            className="w-full min-h-[400px] p-4 text-base focus:outline-none rounded-lg font-sans leading-relaxed resize-y border border-transparent focus:border-orange-400 disabled:opacity-50 bg-[#FAFAFA]"
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-sm font-mono text-neutral-500">{wordCount} words</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Task Navigation Bar ── */}
            <footer className="shrink-0 h-12 bg-white border-t border-neutral-200 flex items-center justify-between px-4 z-10">
                <div className="flex items-center gap-6 h-full flex-1 px-4">
                    {([1, 2] as (1 | 2)[]).map((p) => {
                        const isActive = effectivePart === p;
                        const liveCount = p === 1 ? wordCount1 : wordCount2;
                        return (
                            <div key={p} className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => setActivePart(p)}
                                    className={`text-sm font-bold transition-colors ${isActive ? 'text-black' : 'text-neutral-500 hover:text-black'}`}
                                >
                                    Task {p}
                                </button>
                                <span className={`text-sm ${isActive ? 'text-black font-semibold' : 'text-neutral-500'}`}>
                                    {liveCount} words
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="shrink-0 flex items-center h-full border-l border-neutral-200 pl-2">
                    <button onClick={openSubmitModal} className="w-[60px] h-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-colors text-white" aria-label="Submit test">
                        <Check size={24} strokeWidth={3} />
                    </button>
                </div>
            </footer>

            <IELTSExitModal open={showExitModal} onConfirm={handleExit} onCancel={() => setShowExitModal(false)} />

            {showSubmitModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubmitModal(false)} />
                    <div className="relative w-full max-w-[480px] bg-white rounded-[24px] p-8 shadow-2xl text-center">
                        <h2 className="text-2xl font-black text-neutral-900 mb-2">Submit Test?</h2>
                        <p className="text-sm text-neutral-500 mb-6">You have {formatClock(seconds)} remaining. Once submitted, you cannot edit your answers.</p>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] p-4">
                                <p className="text-[10px] font-bold tracking-wider text-neutral-500 mb-1">TASK 1</p>
                                <p className="text-2xl font-black text-emerald-600">{wordCount1} words</p>
                            </div>
                            <div className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] p-4">
                                <p className="text-[10px] font-bold tracking-wider text-neutral-500 mb-1">TASK 2</p>
                                <p className="text-2xl font-black text-emerald-600">{wordCount2} words</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-3 rounded-full font-bold text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors">Continue Writing</button>
                            <button onClick={() => finalizeSubmit(false)} className="flex-1 py-3 rounded-full font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-lg shadow-orange-500/20">Submit Test</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #CCCCCC; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #AAAAAA; }
            `}</style>
        </div>
    );
};

export default IELTSWritingExam;

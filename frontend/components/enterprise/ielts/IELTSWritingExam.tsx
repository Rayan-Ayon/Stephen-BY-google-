import React, { useEffect, useRef, useState } from 'react';
import {
    TASK2_PROMPTS,
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

const Wifi = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
);
const Bell = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const Menu = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
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

const TASK1_TITLE = 'The chart below shows the number of adults participating in different major sports in one area, in 1997 and 2017.';
const TASK1_INSTRUCTION = 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.';
const TASK1_WORD_HINT = 'Write at least 150 words.';

const DRAFT_KEY_P1 = 'stephen_enterprise_farmgate_ielts_writing_p1';
const DRAFT_KEY_P2 = 'stephen_enterprise_farmgate_ielts_writing_p2';

const readDraft = (key: string): string => {
    try {
        return localStorage.getItem(key) || '';
    } catch {
        return '';
    }
};

const writeDraft = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // storage unavailable — ignore
    }
};

type TestState = 'lobby' | 'active' | 'evaluating' | 'completed';

interface WritingResult {
    taskType: 'task1' | 'task2';
    prompt: string;
    text: string;
    band: number;
    criteria: WritingCriteria;
    feedback: { en: string; bn: string };
    date: string;
}

interface IELTSWritingExamProps {
    candidateEmail?: string;
    simulation?: SimulationProps;
    onActiveChange?: (active: boolean) => void;
}

const ChartSVG: React.FC = () => {
    const W = 720;
    const H = 400;
    const plotL = 56;
    const plotR = 700;
    const plotT = 34;
    const plotB = 340;
    const plotW = plotR - plotL;
    const plotH = plotB - plotT;
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

const IELTSWritingExam: React.FC<IELTSWritingExamProps> = ({ candidateEmail, simulation, onActiveChange }) => {
    const [testState, setTestState] = useState<TestState>(simulation ? 'active' : 'lobby');
    const [activePart, setActivePart] = useState<1 | 2>(1);
    const [essayPart1, setEssayPart1] = useState<string>(() => readDraft(DRAFT_KEY_P1));
    const [essayPart2, setEssayPart2] = useState<string>(() => readDraft(DRAFT_KEY_P2));
    const [split, setSplit] = useState(50);
    const splitAreaRef = useRef<HTMLDivElement>(null);
    const [seconds, setSeconds] = useState(simulation ? simulation.timeLimitSeconds : 60 * 60);
    const [result, setResult] = useState<WritingResult | null>(null);
    const [lang, setLang] = useState<'en' | 'bn'>('en');
    const [showExitModal, setShowExitModal] = useState(false);

    const timeLimit = simulation ? simulation.timeLimitSeconds : 60 * 60;
    const text = activePart === 1 ? essayPart1 : essayPart2;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const locked = testState !== 'active';
    const timerLow = seconds <= 300;
    const isEvaluating = testState === 'evaluating';
    const prompt = activePart === 1 ? TASK1_TITLE : TASK2_PROMPTS[0];

    const updatePart = (value: string) => {
        if (activePart === 1) {
            setEssayPart1(value);
            writeDraft(DRAFT_KEY_P1, value);
        } else {
            setEssayPart2(value);
            writeDraft(DRAFT_KEY_P2, value);
        }
    };

    const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const rect = splitAreaRef.current?.parentElement?.getBoundingClientRect();
        if (!rect) return;
        const move = (ev: PointerEvent) => {
            const pct = ((ev.clientX - rect.left) / rect.width) * 100;
            setSplit(Math.min(70, Math.max(30, pct)));
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
    };

    const navigatePart = (dir: 1 | -1) => {
        const next = activePart + dir;
        if (next === 1 || next === 2) setActivePart(next as 1 | 2);
    };

    useEffect(() => {
        if (testState !== 'active') return;
        const id = window.setInterval(() => setSeconds((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
        return () => window.clearInterval(id);
    }, [testState]);

    const submit = (force = false) => {
        if (testState !== 'active') return;
        const trimmed = text.trim();
        if (!trimmed && !force) return;
        setTestState('evaluating');
        window.setTimeout(() => {
            const { criteria, band } = evaluateWritingText(trimmed || ' ');
            const count = trimmed ? trimmed.split(/\s+/).length : 0;
            const timeSpent = Math.max(1, Math.round((timeLimit - seconds) / 60));
            const taskType = activePart === 1 ? 'task1' : 'task2';
            const criteriaList = [
                { label: activePart === 1 ? 'Task Achievement' : 'Task Response', band: criteria.taskAchievement },
                { label: 'Coherence & Cohesion', band: criteria.coherence },
                { label: 'Lexical Resource', band: criteria.lexical },
                { label: 'Grammar Accuracy', band: criteria.grammar },
            ];
            if (simulation) {
                simulation.onComplete({ skill: 'writing', band, criteria: criteriaList, timeSpent });
            } else {
                const evalResult: WritingResult = {
                    taskType,
                    prompt,
                    text: trimmed,
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
            }
            setTestState('completed');
        }, 1400);
    };

    useEffect(() => {
        if (simulation && testState === 'active' && seconds === 0) submit(true);
    }, [seconds, testState, simulation]);

    useEffect(() => {
        onActiveChange?.(testState === 'active' || testState === 'evaluating');
    }, [testState, onActiveChange]);

    const startExam = () => {
        if (simulation) return;
        setTestState('active');
    };

    const resetExam = () => {
        setEssayPart1('');
        setEssayPart2('');
        setActivePart(1);
        setSeconds(simulation ? simulation.timeLimitSeconds : 60 * 60);
        setResult(null);
        setLang('en');
        setTestState('lobby');
        setShowExitModal(false);
    };

    const handleExit = () => {
        if (simulation) {
            setShowExitModal(false);
            simulation.onExit?.();
        } else {
            resetExam();
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

    const metricLabels: { key: keyof WritingCriteria; label: string }[] = [
        { key: 'taskAchievement', label: activePart === 1 ? 'Task Achievement' : 'Task Response' },
        { key: 'coherence', label: 'Coherence & Cohesion' },
        { key: 'lexical', label: 'Lexical Resource' },
        { key: 'grammar', label: 'Grammatical Range & Accuracy' },
    ];

    if (testState === 'evaluating') {
        return (
            <div className="flex-1 min-h-0 flex items-center justify-center bg-[#F2F2F2]">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full border border-[#CCCCCC]">
                    <h2 className="text-2xl font-bold text-[#0072CE] mb-4">Exam Completed</h2>
                    <p className="text-neutral-600">Evaluating your answers...</p>
                </div>
            </div>
        );
    }

    if (testState === 'completed') {
        return (
            <div className="flex-1 min-h-0 overflow-y-auto bg-[#F2F2F2] p-6">
                <div className="max-w-5xl mx-auto space-y-4">
                    <div className="rounded-2xl bg-[#141414] border border-amber-500/20 p-5">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
                                <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold">Overall Band</p>
                                <p className="text-3xl font-semibold tracking-tight text-amber-400">{result?.band.toFixed(1)}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                                    {result?.taskType === 'task1' ? 'TASK 1 · REPORT' : 'TASK 2 · ESSAY'}
                                </p>
                                <p className="text-sm text-neutral-300 mt-1 line-clamp-2">{result?.prompt}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {metricLabels.map((metric) => {
                                const value = result?.criteria[metric.key] ?? 0;
                                return (
                                    <div key={metric.key} className="rounded-xl bg-[#0b0b0b] border border-neutral-800 p-4">
                                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">{metric.label}</p>
                                        <p className="text-xl font-semibold text-white mb-2">{value.toFixed(1)}</p>
                                        <div className="h-1 rounded bg-neutral-800 overflow-hidden">
                                            <div className="h-full bg-amber-400" style={{ width: `${(value / 9) * 100}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Bilingual Feedback</p>
                                <div className="flex items-center gap-1 rounded-lg bg-[#0b0b0b] border border-neutral-800 p-1">
                                    {([
                                        { key: 'en' as const, label: 'EN' },
                                        { key: 'bn' as const, label: 'BN' },
                                    ]).map((l) => (
                                        <button
                                            key={l.key}
                                            onClick={() => setLang(l.key)}
                                            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                                                lang === l.key ? 'bg-white text-black' : 'text-neutral-500 hover:text-neutral-300'
                                            }`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                {lang === 'en' ? result?.feedback.en : result?.feedback.bn || result?.feedback.en}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">Inline Highlight Preview</p>
                            <div className="flex items-center gap-4 mb-3">
                                <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-yellow-400/60" /> Vocabulary suggestion
                                </span>
                                <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500/60" /> Grammar error
                                </span>
                            </div>
                            <div className="max-h-56 overflow-y-auto rounded-xl bg-[#0b0b0b] border border-neutral-800 p-4">
                                <p className="text-sm leading-relaxed text-neutral-200 whitespace-pre-wrap">
                                    {result ? buildSegments(result.text).map((seg, i) =>
                                        seg.kind === 'plain' ? (
                                            <span key={i}>{seg.text}</span>
                                        ) : seg.kind === 'vocab' ? (
                                            <span key={i} className="bg-yellow-400/20 border-b border-yellow-400/50 text-yellow-100">{seg.text}</span>
                                        ) : (
                                            <span key={i} className="bg-red-500/20 border-b border-red-500/60 text-red-200">{seg.text}</span>
                                        )
                                    ) : null}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => setTestState('lobby')}
                            className="px-6 py-2 bg-[#0072CE] text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Return to Lobby
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const partBannerText = activePart === 1
        ? 'You should spend about 20 minutes on this task. Write at least 150 words.'
        : 'You should spend about 40 minutes on this task. Write at least 250 words.';
    const completedPart1 = result?.taskType === 'task1';
    const completedPart2 = result?.taskType === 'task2';

    return (
        <div className="flex flex-col h-full bg-[#FFFFFF] text-black font-sans min-w-0" style={{ flex: 1 }}>
            {/* Top Navigation Bar */}
            <header className="shrink-0 h-14 border-b border-[#E5E7EB] bg-[#FFFFFF] flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <span className="text-[#D32F2F] text-2xl font-black tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>IELTS<sup className="text-sm">™</sup></span>
                    <span className="text-sm font-semibold text-black tracking-wide ml-2">Test taker ID</span>
                </div>
                <div className="flex items-center gap-5 text-black">
                    <Wifi size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <Bell size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <Menu size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E5E7EB] text-[11px] text-neutral-700 hover:bg-[#D1D5DB] transition-colors">
                        Notes / Help
                    </button>
                </div>
            </header>

            {/* Task Context Banner */}
            <div className="shrink-0 bg-[#F5F5F5] border border-[#E5E7EB] px-6 py-4 mx-4 mt-4 rounded-md flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="text-lg font-bold mb-1">Part {activePart}</h2>
                    <p className="text-sm text-neutral-800">{partBannerText}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setShowExitModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#CCCCCC] text-[11px] text-neutral-600 hover:text-red-600 hover:border-red-400 transition-colors"
                    >
                        <span>⬅️</span> Exit Exam
                    </button>
                    <div className={`rounded-md border bg-white px-3 py-1.5 text-center ${timerLow ? 'border-red-400 animate-pulse' : 'border-[#CCCCCC]'}`}>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Time Remaining</p>
                        <p className={`font-mono text-sm ${timerLow ? 'text-red-600' : 'text-neutral-800'}`}>{formatClock(seconds)}</p>
                    </div>
                </div>
            </div>

            {/* Dual Split-Pane Workspace */}
            <div className="flex-1 min-h-0 flex mx-4 mb-4 mt-2 border-t border-[#E5E7EB] relative overflow-hidden bg-[#FFFFFF]" ref={splitAreaRef}>
                {/* Left Task Prompt Pane */}
                <div style={{ width: `${split}%` }} className="h-full min-w-0 overflow-y-auto pr-6 pt-4 pb-20 custom-scrollbar">
                    {activePart === 1 ? (
                        <>
                            <h3 className="text-[16px] font-bold mb-3">{TASK1_TITLE}</h3>
                            <p className="text-[15px] font-bold mb-4">{TASK1_INSTRUCTION}</p>
                            <div className="rounded-md border border-[#E5E7EB] p-2">
                                <ChartSVG />
                            </div>
                            <p className="text-xs text-neutral-500 mt-3">{TASK1_WORD_HINT}</p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-[16px] font-bold mb-3">Task 2 — Essay</h3>
                            <p className="text-[15px] leading-relaxed text-neutral-900 whitespace-pre-wrap mb-3">{TASK2_PROMPTS[0]}</p>
                            <p className="text-[15px] font-bold mb-4">Write at least 250 words.</p>
                        </>
                    )}
                </div>

                {/* Draggable Splitter Divider */}
                <div
                    onPointerDown={startResize}
                    className="w-8 shrink-0 cursor-col-resize select-none flex items-center justify-center group z-10 -ml-4"
                >
                    <div className="w-px h-full bg-[#CCCCCC] group-hover:bg-[#0072CE] transition-colors relative flex items-center justify-center">
                        <div className="absolute w-6 h-8 bg-white border border-[#CCCCCC] rounded-sm flex items-center justify-center shadow-sm text-neutral-500 text-lg group-hover:border-[#0072CE] group-hover:text-[#0072CE]">
                            ↔
                        </div>
                    </div>
                </div>

                {/* Right Writing Editor Pane */}
                <div style={{ width: `${100 - split}%` }} className="h-full min-w-0 overflow-y-auto pl-6 pt-4 pb-20 bg-[#F9F9F9] border-l border-[#E5E7EB] custom-scrollbar relative">
                    <div className="max-w-3xl bg-white p-6 rounded-md shadow-sm border border-[#CCCCCC]">
                        <textarea
                            value={text}
                            onChange={(e) => updatePart(e.target.value)}
                            disabled={locked}
                            placeholder="Write your answer here…"
                            className="w-full h-[400px] p-4 text-base focus:outline-none rounded-none font-sans leading-relaxed resize-none border-2 border-[#0072CE] disabled:opacity-60"
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-sm font-mono text-neutral-500">Words: {wordCount}</span>
                        </div>
                    </div>

                    {/* Bottom-Right Navigation Arrows */}
                    <div className="absolute bottom-6 right-6 flex shadow-md rounded overflow-hidden">
                        <button
                            onClick={() => navigatePart(-1)}
                            disabled={activePart === 1}
                            className="bg-[#E5E7EB] hover:bg-[#D0D0D0] text-black w-12 h-10 flex items-center justify-center transition-colors disabled:opacity-40"
                        >
                            ◄
                        </button>
                        <button
                            onClick={() => navigatePart(1)}
                            disabled={activePart === 2}
                            className="bg-black hover:bg-neutral-800 text-white w-12 h-10 flex items-center justify-center transition-colors disabled:opacity-40"
                        >
                            ►
                        </button>
                    </div>
                </div>
            </div>

            {/* Official Bottom Question Deck (Footer) */}
            <footer className="shrink-0 h-12 bg-white border-t border-[#E5E7EB] flex items-center justify-between px-2 w-full z-10">
                <div className="flex items-center gap-6 h-full flex-1 px-4">
                    {[1, 2].map((p) => {
                        const isActive = activePart === p;
                        const completed = p === 1 ? completedPart1 : completedPart2;
                        return (
                            <div key={p} className="flex items-center gap-3 shrink-0">
                                <button
                                    onClick={() => setActivePart(p as 1 | 2)}
                                    className={`text-sm font-bold ${isActive ? 'text-black' : 'text-neutral-500 hover:text-black'}`}
                                >
                                    Part {p}
                                </button>
                                {isActive ? (
                                    <span className="text-sm text-neutral-500">{wordCount} words</span>
                                ) : (
                                    <span className="text-sm text-neutral-500">{completed ? '1 of 1' : '0 of 1'}</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="shrink-0 flex items-center h-full border-l border-[#E5E7EB] pl-2">
                    <button
                        onClick={() => submit(false)}
                        className="w-[60px] h-full bg-[#E0E0E0] hover:bg-[#D0D0D0] flex items-center justify-center transition-colors text-black"
                    >
                        <Check size={24} strokeWidth={3} />
                    </button>
                </div>
            </footer>

            <IELTSExitModal
                open={showExitModal}
                onConfirm={handleExit}
                onCancel={() => setShowExitModal(false)}
            />

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #CCCCCC;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #AAAAAA;
                }
            `}</style>
        </div>
    );
};

export default IELTSWritingExam;
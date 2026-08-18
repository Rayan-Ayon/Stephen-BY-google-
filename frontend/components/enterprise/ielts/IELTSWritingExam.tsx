import React, { useEffect, useState } from 'react';
import {
    TASK1_PROMPTS,
    TASK2_PROMPTS,
    SAMPLE_TASK1,
    SAMPLE_TASK2,
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

const TASK_DURATION: Record<'task1' | 'task2', number> = {
    task1: 20 * 60,
    task2: 60 * 60,
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
}

const IELTSWritingExam: React.FC<IELTSWritingExamProps> = ({ candidateEmail, simulation }) => {
    const [taskType, setTaskType] = useState<'task1' | 'task2'>('task2');
    const [prompt, setPrompt] = useState(TASK2_PROMPTS[0]);
    const [text, setText] = useState(SAMPLE_TASK2);
    const [seconds, setSeconds] = useState(simulation ? simulation.timeLimitSeconds : TASK_DURATION.task2);
    const [running, setRunning] = useState(!!simulation);
    const [testState, setTestState] = useState<TestState>(simulation ? 'active' : 'lobby');
    const [result, setResult] = useState<WritingResult | null>(null);
    const [lang, setLang] = useState<'en' | 'bn'>('en');
    const [showExitModal, setShowExitModal] = useState(false);
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const timeLimit = simulation ? simulation.timeLimitSeconds : TASK_DURATION[taskType];

    const switchTask = (t: 'task1' | 'task2') => {
        if (t === taskType || simulation) return;
        setTaskType(t);
        setPrompt(t === 'task1' ? TASK1_PROMPTS[0] : TASK2_PROMPTS[0]);
        setText(t === 'task1' ? SAMPLE_TASK1 : SAMPLE_TASK2);
        setSeconds(TASK_DURATION[t]);
        setRunning(true);
        setResult(null);
    };

    useEffect(() => {
        if (testState !== 'active' || !running || result) return;
        const id = window.setInterval(() => {
            setSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
        return () => window.clearInterval(id);
    }, [testState, running, result]);

    const submit = (force = false) => {
        if (testState !== 'active') return;
        const trimmed = text.trim();
        if (!trimmed && !force) return;
        setTestState('evaluating');
        setRunning(false);
        window.setTimeout(() => {
            const { criteria, band } = evaluateWritingText(trimmed || ' ');
            const timeSpent = Math.max(1, Math.round((timeLimit - seconds) / 60));
            const criteriaList = [
                { label: taskType === 'task1' ? 'Task Achievement' : 'Task Response', band: criteria.taskAchievement },
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
                    feedback: buildBilingual(band, wordCount),
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
        }, simulation ? 900 : 1400);
    };

    useEffect(() => {
        if (simulation && testState === 'active' && seconds === 0) submit(true);
    }, [seconds, testState, simulation]);

    const startExam = () => {
        if (simulation) return;
        setTestState('active');
        setRunning(true);
    };

    const resetExam = () => {
        setTaskType('task2');
        setPrompt(TASK2_PROMPTS[0]);
        setText(SAMPLE_TASK2);
        setSeconds(simulation ? simulation.timeLimitSeconds : TASK_DURATION.task2);
        setRunning(false);
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
        { key: 'taskAchievement', label: taskType === 'task1' ? 'Task Achievement' : 'Task Response' },
        { key: 'coherence', label: 'Coherence & Cohesion' },
        { key: 'lexical', label: 'Lexical Resource' },
        { key: 'grammar', label: 'Grammatical Range & Accuracy' },
    ];

    const segments = result ? buildSegments(result.text) : [];
    const timerLow = seconds <= 300;
    const isEvaluating = testState === 'evaluating';

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-[#141414] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {testState === 'active' && (
                        <button
                            onClick={() => setShowExitModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b0b0b] border border-neutral-800 text-[11px] text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        >
                            <span>⬅️</span> Exit Exam
                        </button>
                    )}
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                        {simulation ? simulation.sectionLabel : 'Computer-Delivered Writing'}
                    </span>
                    {!simulation && (
                        <div className="flex gap-1 rounded-lg bg-[#0b0b0b] border border-neutral-800 p-1">
                            {([
                                { key: 'task1' as const, label: 'Task 1' },
                                { key: 'task2' as const, label: 'Task 2' },
                            ]).map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => switchTask(t.key)}
                                    disabled={testState !== 'active'}
                                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors disabled:opacity-50 ${
                                        taskType === t.key
                                            ? 'bg-[#0a0a0a] text-amber-300 border border-amber-500/20'
                                            : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className={`font-mono text-sm ${timerLow ? 'text-red-400' : 'text-neutral-300'}`}>{formatClock(seconds)}</span>
                    {!simulation && (
                        <button
                            onClick={() => setRunning((r) => !r)}
                            disabled={testState !== 'active'}
                            className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-50"
                        >
                            {running ? 'Pause' : 'Resume'}
                        </button>
                    )}
                    <button
                        onClick={() => submit(false)}
                        disabled={isEvaluating || wordCount === 0 || testState !== 'active'}
                        className="px-4 py-1.5 rounded-lg bg-white text-black text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200 disabled:opacity-50"
                    >
                        {isEvaluating ? 'Analyzing…' : simulation ? 'Submit Section' : 'Submit'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                        {taskType === 'task1' ? 'Task 1 · Academic Report' : 'Task 2 · Essay'} — Question
                    </p>
                    {simulation ? (
                        <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{prompt}</p>
                    ) : (
                        <select
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={testState !== 'active'}
                            className="w-full px-3 py-2.5 rounded-lg bg-[#0b0b0b] border border-neutral-800 text-xs text-neutral-200 outline-none focus:border-neutral-600"
                        >
                            {(taskType === 'task1' ? TASK1_PROMPTS : TASK2_PROMPTS).map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    )}
                    <p className="text-sm text-neutral-300 leading-relaxed mt-4 whitespace-pre-wrap">
                        {prompt}
                    </p>
                    <p className="text-xs text-neutral-600 mt-4">
                        {taskType === 'task1'
                            ? `Minimum 150 words. ${formatClock(TASK_DURATION.task1)} allowed.`
                            : `Minimum 250 words. ${formatClock(TASK_DURATION.task2)} allowed.`}
                    </p>
                </div>

                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Your Answer</p>
                        <span className={`text-[11px] font-mono ${wordCount >= (taskType === 'task1' ? 150 : 250) ? 'text-emerald-400' : 'text-neutral-500'}`}>
                            {wordCount} words
                        </span>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={testState !== 'active'}
                        placeholder="Write your answer here…"
                        rows={18}
                        className="w-full rounded-xl bg-[#0b0b0b] border border-neutral-800 p-4 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-neutral-600 resize-none"
                    />
                    <p className="text-[11px] text-neutral-600 mt-2">Timer continues while you type. Submit to evaluate.</p>
                </div>
            </div>

            {!simulation && result && (
                <div className="space-y-4">
                    <div className="rounded-2xl bg-[#141414] border border-amber-500/20 p-5">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
                                <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold">Overall Band</p>
                                <p className="text-3xl font-semibold tracking-tight text-amber-400">{result.band.toFixed(1)}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                                    {result.taskType === 'task1' ? 'TASK 1 · REPORT' : 'TASK 2 · ESSAY'}
                                </p>
                                <p className="text-sm text-neutral-300 mt-1 line-clamp-2">{result.prompt}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {metricLabels.map((metric) => {
                                const value = result.criteria[metric.key];
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
                                                lang === l.key
                                                    ? 'bg-white text-black'
                                                    : 'text-neutral-500 hover:text-neutral-300'
                                            }`}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                {lang === 'en' ? result.feedback.en : result.feedback.bn || result.feedback.en}
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
                                    {segments.map((seg, i) =>
                                        seg.kind === 'plain' ? (
                                            <span key={i}>{seg.text}</span>
                                        ) : seg.kind === 'vocab' ? (
                                            <span key={i} className="bg-yellow-400/20 border-b border-yellow-400/50 text-yellow-100">{seg.text}</span>
                                        ) : (
                                            <span key={i} className="bg-red-500/20 border-b border-red-500/60 text-red-200">{seg.text}</span>
                                        )
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <IELTSExitModal
                open={showExitModal}
                onConfirm={handleExit}
                onCancel={() => setShowExitModal(false)}
            />
        </div>
    );
};

export default IELTSWritingExam;
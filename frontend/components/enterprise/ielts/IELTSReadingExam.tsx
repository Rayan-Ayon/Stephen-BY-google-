import React, { useEffect, useRef, useState } from 'react';
import { addAttempt, rawToBand, formatClock, type SimulationProps } from './ieltsShared';
import IELTSLobbyCard from './IELTSLobbyCard';
import IELTSExitModal from './IELTSExitModal';

const PASSAGE = `Cities around the world are turning to vertical forests as a response to rising temperatures and shrinking green space. These high-rise buildings, wrapped in hundreds of trees and thousands of shrubs, act as living filters. They absorb carbon dioxide, release oxygen, and reduce the surface temperature of the surrounding streets by several degrees.

The first completed vertical forest, the Bosco Verticale in Milan, was finished in 2014 and contains more than 900 trees. Architects argue that such buildings create habitats for birds and insects, improving urban biodiversity. However, critics point out that the maintenance costs are high. Irrigation systems, pruning schedules, and structural weight all demand constant attention from specialists.

Despite these challenges, interest in the concept has spread rapidly. Developers in Asia and Latin America have adapted the model to local climates, choosing native plant species that need less water. Some studies suggest that a single vertical forest can remove up to 30 tonnes of carbon every year. Whether this justifies the initial construction expense remains a matter of debate.`;

interface ReadingQuestion {
    id: number;
    type: 'tfng' | 'gap';
    prompt: string;
    answer: string;
}

const QUESTIONS: ReadingQuestion[] = [
    { id: 1, type: 'tfng', prompt: 'The Bosco Verticale was the first vertical forest ever proposed by an architect.', answer: 'false' },
    { id: 2, type: 'tfng', prompt: 'Vertical forests reduce surrounding street temperatures by several degrees.', answer: 'true' },
    { id: 3, type: 'tfng', prompt: 'All developers have abandoned the vertical forest model because of maintenance costs.', answer: 'false' },
    { id: 4, type: 'gap', prompt: 'A single vertical forest can remove up to ____ tonnes of carbon per year.', answer: '30' },
    { id: 5, type: 'gap', prompt: 'The Bosco Verticale was completed in the year ____.', answer: '2014' },
];

const normalize = (s: string) => s.trim().toLowerCase();

interface HighlightSegment {
    text: string;
    highlighted: boolean;
}

const buildHighlightSegments = (text: string, ranges: [number, number][]): HighlightSegment[] => {
    if (ranges.length === 0) return [{ text, highlighted: false }];
    const sorted = [...ranges].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const merged: [number, number][] = [];
    for (const r of sorted) {
        const prev = merged[merged.length - 1];
        if (prev && r[0] < prev[1]) prev[1] = Math.max(prev[1], r[1]);
        else merged.push([r[0], r[1]]);
    }
    const segments: HighlightSegment[] = [];
    let cursor = 0;
    for (const [s, e] of merged) {
        if (s > cursor) segments.push({ text: text.slice(cursor, s), highlighted: false });
        segments.push({ text: text.slice(s, e), highlighted: true });
        cursor = e;
    }
    if (cursor < text.length) segments.push({ text: text.slice(cursor), highlighted: false });
    return segments;
};

type TestState = 'lobby' | 'active' | 'evaluating' | 'completed';

interface IELTSReadingExamProps {
    candidateEmail?: string;
    simulation?: SimulationProps;
}

const IELTSReadingExam: React.FC<IELTSReadingExamProps> = ({ candidateEmail, simulation }) => {
    const passageRef = useRef<HTMLDivElement>(null);
    const [answers, setAnswers] = useState<string[]>(() => QUESTIONS.map(() => ''));
    const [highlights, setHighlights] = useState<[number, number][]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [testState, setTestState] = useState<TestState>(simulation ? 'active' : 'lobby');
    const [showExitModal, setShowExitModal] = useState(false);

    const timeLimit = simulation ? simulation.timeLimitSeconds : 20 * 60;
    const locked = submitted || testState !== 'active';

    useEffect(() => {
        if (testState !== 'active' || submitted) return;
        const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => window.clearInterval(id);
    }, [testState, submitted]);

    const handleHighlight = () => {
        if (locked) return;
        const container = passageRef.current;
        const sel = window.getSelection();
        if (!container || !sel || sel.rangeCount === 0 || sel.isCollapsed) return;
        const range = sel.getRangeAt(0);
        if (!container.contains(range.commonAncestorContainer)) return;
        const pre = range.cloneRange();
        pre.selectNodeContents(container);
        pre.setEnd(range.startContainer, range.startOffset);
        const start = pre.toString().length;
        const end = start + range.toString().length;
        if (end <= start) return;
        setHighlights((prev) => [...prev, [start, end]]);
        sel.removeAllRanges();
    };

    const clearHighlights = () => {
        if (locked) return;
        setHighlights([]);
    };

    const submit = (force = false) => {
        if (locked) return;
        setTestState('evaluating');
        window.setTimeout(() => {
            const tfngIds = QUESTIONS.filter((q) => q.type === 'tfng');
            const gapIds = QUESTIONS.filter((q) => q.type === 'gap');
            const tfngCorrect = tfngIds.reduce((acc, q) => {
                const idx = QUESTIONS.findIndex((x) => x.id === q.id);
                return acc + (normalize(answers[idx]) === q.answer ? 1 : 0);
            }, 0);
            const gapCorrect = gapIds.reduce((acc, q) => {
                const idx = QUESTIONS.findIndex((x) => x.id === q.id);
                return acc + (normalize(answers[idx]) === q.answer ? 1 : 0);
            }, 0);
            const correct = tfngCorrect + gapCorrect;
            const timeSpent = Math.max(1, Math.round(elapsed / 60));
            const criteria = [
                { label: 'TFNG Traps', band: tfngIds.length ? rawToBand(Math.round((tfngCorrect / tfngIds.length) * 40)) : 4 },
                { label: 'Gap-Fill Word Forms', band: gapIds.length ? rawToBand(Math.round((gapCorrect / gapIds.length) * 40)) : 4 },
            ];
            if (simulation) {
                simulation.onComplete({ skill: 'reading', band: rawToBand(correct), score: correct, criteria, timeSpent });
            } else {
                setScore(correct);
                addAttempt({
                    id: Date.now(),
                    skill: 'reading',
                    band: rawToBand(correct),
                    score: correct,
                    timeSpent,
                    criteria,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });
            }
            setSubmitted(true);
            setTestState('completed');
        }, 900);
    };

    useEffect(() => {
        if (simulation && testState === 'active' && elapsed >= timeLimit) submit(true);
    }, [elapsed, testState, simulation, timeLimit]);

    const startExam = () => {
        if (simulation) return;
        setTestState('active');
    };

    const resetExam = () => {
        setAnswers(QUESTIONS.map(() => ''));
        setHighlights([]);
        setSubmitted(false);
        setScore(null);
        setElapsed(0);
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
                skill="reading"
                candidateEmail={candidateEmail || ''}
                title="Reading Hub"
                subtitle="Passage scanning with highlight tooling and targeted TFNG practice."
                onStart={startExam}
            />
        );
    }

    const segments = buildHighlightSegments(PASSAGE, highlights);
    const band = score != null ? rawToBand(score) : null;
    const isEvaluating = testState === 'evaluating';

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-[#141414] px-4 py-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                    {simulation ? simulation.sectionLabel : 'Reading · Passage & Questions'}
                </span>
                <div className="flex items-center gap-3">
                    {testState === 'active' && (
                        <button
                            onClick={() => setShowExitModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b0b0b] border border-neutral-800 text-[11px] text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        >
                            <span>⬅️</span> Exit Exam
                        </button>
                    )}
                    <span className={`font-mono text-sm ${timeLimit - elapsed <= 300 ? 'text-red-400' : 'text-neutral-300'}`}>
                        {formatClock(elapsed)}<span className="text-neutral-600"> / {formatClock(timeLimit)}</span>
                    </span>
                    <button
                        onClick={handleHighlight}
                        disabled={locked}
                        className="px-3 py-1.5 rounded-lg bg-[#0b0b0b] border border-neutral-800 text-[11px] text-neutral-300 hover:border-neutral-600 transition-colors disabled:opacity-50"
                    >
                        Highlight Selection
                    </button>
                    <button
                        onClick={clearHighlights}
                        disabled={locked}
                        className="px-3 py-1.5 rounded-lg bg-[#0b0b0b] border border-neutral-800 text-[11px] text-neutral-300 hover:border-neutral-600 transition-colors disabled:opacity-50"
                    >
                        Clear Highlights
                    </button>
                    <button
                        onClick={() => submit(false)}
                        disabled={locked}
                        className="px-4 py-1.5 rounded-lg bg-white text-black text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200 disabled:opacity-50"
                    >
                        {isEvaluating ? 'Grading…' : simulation ? 'Submit Section' : 'Submit'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">Passage</p>
                    <p className="text-[11px] text-neutral-600 mb-3">Select text in the passage, then press Highlight Selection.</p>
                    <div
                        ref={passageRef}
                        className="rounded-xl bg-[#0b0b0b] border border-neutral-800 p-4 select-text"
                    >
                        <p className="text-sm leading-relaxed text-neutral-200">
                            {segments.map((seg, i) =>
                                seg.highlighted ? (
                                    <mark key={i} className="bg-yellow-400/30 text-yellow-50 rounded-sm px-0.5">{seg.text}</mark>
                                ) : (
                                    <span key={i}>{seg.text}</span>
                                )
                            )}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Questions 1–5</p>
                        <span className="text-[11px] font-mono text-neutral-600">{score != null ? `${score}/5` : '—'}</span>
                    </div>
                    <div className="space-y-4">
                        {QUESTIONS.map((q, i) => (
                            <div key={q.id}>
                                <p className="text-sm text-neutral-300 mb-2">
                                    <span className="font-mono text-amber-400 mr-2">{q.id}.</span>
                                    {q.prompt}
                                </p>
                                {q.type === 'tfng' ? (
                                    <div className="flex gap-1 rounded-lg bg-[#0b0b0b] border border-neutral-800 p-1 w-fit">
                                        {(['true', 'false', 'ng'] as const).map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => {
                                                    const next = [...answers];
                                                    next[i] = opt;
                                                    setAnswers(next);
                                                }}
                                                disabled={locked}
                                                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors disabled:opacity-50 ${
                                                    normalize(answers[i]) === opt
                                                        ? 'bg-[#0a0a0a] text-amber-300 border border-amber-500/20'
                                                        : 'text-neutral-500 hover:text-neutral-300'
                                                }`}
                                            >
                                                {opt === 'ng' ? 'Not Given' : opt === 'true' ? 'True' : 'False'}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <input
                                        value={answers[i]}
                                        onChange={(e) => {
                                            const next = [...answers];
                                            next[i] = e.target.value;
                                            setAnswers(next);
                                        }}
                                        disabled={locked}
                                        placeholder="Answer…"
                                        className="w-full px-3 py-2 rounded-lg bg-[#0b0b0b] border border-neutral-800 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-neutral-600"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {!simulation && submitted && score != null && band != null && (
                <div className="rounded-2xl bg-[#141414] border border-amber-500/20 p-5 flex items-center gap-4">
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold">Reading Band</p>
                        <p className="text-3xl font-semibold tracking-tight text-amber-400">{band.toFixed(1)}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-neutral-300">Raw score: <span className="font-mono text-white">{score}/5</span> scaled against the 40-item band scale.</p>
                        <p className="text-xs text-neutral-600 mt-1">Attempt logged to the IELTS tracker.</p>
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

export default IELTSReadingExam;
import React, { useEffect, useState } from 'react';
import { addAttempt, rawToBand } from './ieltsShared';

interface ListeningQuestion {
    id: number;
    section: number;
    prompt: string;
    answer: string;
}

const QUESTIONS: ListeningQuestion[] = [
    { id: 1, section: 1, prompt: 'Customer orders a ____ bedroom flat.', answer: 'two' },
    { id: 2, section: 1, prompt: 'Rent is $____ per month.', answer: '950' },
    { id: 3, section: 2, prompt: 'The museum opens at ____ a.m.', answer: '9' },
    { id: 4, section: 3, prompt: 'The students chose ____ as their research topic.', answer: 'renewable' },
    { id: 5, section: 4, prompt: 'The lecture focuses on ____ ecosystems.', answer: 'coastal' },
];

const SECTIONS = [1, 2, 3, 4];

const normalize = (s: string) => s.trim().toLowerCase();

const WAVEBARS = [10, 18, 26, 14, 30, 22, 12, 28, 16, 24, 20, 10, 26, 18, 30, 14, 22, 12, 28, 16];

const IELTSListeningExam: React.FC = () => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [answers, setAnswers] = useState<string[]>(() => QUESTIONS.map(() => ''));
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const TOTAL = 180;

    useEffect(() => {
        if (!playing) return;
        const id = window.setInterval(() => {
            setProgress((p) => (p >= TOTAL ? 0 : p + 1));
        }, 1000);
        return () => window.clearInterval(id);
    }, [playing]);

    const currentSection = Math.min(4, Math.floor((progress / TOTAL) * 4) + 1);
    const pct = Math.min(100, (progress / TOTAL) * 100);

    const submit = () => {
        if (submitted) return;
        setPlaying(false);
        const correct = QUESTIONS.reduce((acc, q, i) => {
            return acc + (normalize(answers[i]) === q.answer ? 1 : 0);
        }, 0);
        setScore(correct);
        setSubmitted(true);
        addAttempt({
            id: Date.now(),
            skill: 'listening',
            band: rawToBand(correct),
            score: correct,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        });
    };

    const band = score != null ? rawToBand(score) : null;

    return (
        <div className="space-y-4">
            <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Listening · Section {currentSection} of 4</p>
                        <p className="text-xs text-neutral-600 mt-1">{Math.floor(progress / 60)}:{String(progress % 60).padStart(2, '0')} / 3:00 simulated track</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPlaying((p) => !p)}
                            disabled={submitted}
                            className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center text-sm transition-colors hover:bg-amber-300 disabled:opacity-50"
                        >
                            {playing ? '❚❚' : '▶'}
                        </button>
                        <button
                            onClick={submit}
                            disabled={submitted}
                            className="px-4 py-2 rounded-lg bg-white text-black text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200 disabled:opacity-50"
                        >
                            {submitted ? 'Submitted' : 'Submit'}
                        </button>
                    </div>
                </div>

                <div className="h-1 rounded bg-neutral-800 overflow-hidden mb-4">
                    <div className="h-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                </div>

                <div className="flex items-center gap-1 h-12">
                    {WAVEBARS.map((h, i) => (
                        <span
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-150 ${playing ? 'bg-amber-400/80' : 'bg-neutral-700'}`}
                            style={{ height: playing ? `${h + (progress + i) % 8}px` : '3px' }}
                        />
                    ))}
                </div>
                <p className="text-[11px] text-neutral-600 mt-2">{playing ? 'Playing simulated audio — answer questions as you listen.' : 'Press ▶ to start the simulated audio.'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {SECTIONS.map((section) => (
                    <div key={section} className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">Section {section}</p>
                        <div className="space-y-3">
                            {QUESTIONS.filter((q) => q.section === section).map((q, i) => {
                                const qIndex = QUESTIONS.findIndex((x) => x.id === q.id);
                                return (
                                    <div key={q.id}>
                                        <p className="text-sm text-neutral-300 mb-2">
                                            <span className="font-mono text-amber-400 mr-2">{q.id}.</span>
                                            {q.prompt}
                                        </p>
                                        <input
                                            value={answers[qIndex]}
                                            onChange={(e) => {
                                                const next = [...answers];
                                                next[qIndex] = e.target.value;
                                                setAnswers(next);
                                            }}
                                            disabled={submitted}
                                            placeholder="Answer…"
                                            className="w-full px-3 py-2 rounded-lg bg-[#0b0b0b] border border-neutral-800 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-neutral-600"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {submitted && score != null && band != null && (
                <div className="rounded-2xl bg-[#141414] border border-amber-500/20 p-5 flex items-center gap-4">
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold">Listening Band</p>
                        <p className="text-3xl font-semibold tracking-tight text-amber-400">{band.toFixed(1)}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-neutral-300">Raw score: <span className="font-mono text-white">{score}/5</span> scaled against the 40-item band scale.</p>
                        <p className="text-xs text-neutral-600 mt-1">Attempt logged to the IELTS tracker.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IELTSListeningExam;
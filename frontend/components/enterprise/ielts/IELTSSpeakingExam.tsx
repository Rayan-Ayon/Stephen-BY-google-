import React, { useEffect, useState } from 'react';
import { addAttempt, clampBand } from './ieltsShared';

type Phase = 'intro' | 'cue' | 'discussion' | 'done';

const PART1_QUESTIONS = [
    'Can you tell me a little about yourself and where you are from?',
    'Do you enjoy spending time with your family? Why?',
    'What kind of food do you like to eat?',
];

const CUE_CARD = {
    topic: 'Describe a place you like to visit',
    prompts: [
        'Where the place is',
        'How often you go there',
        'What you do there',
        'And explain why you enjoy visiting it',
    ],
};

const PART3_QUESTIONS = [
    'Why do you think some places become popular tourist destinations?',
    'How can governments balance tourism with the needs of local residents?',
    'Do you believe travel broadens the mind? Give reasons.',
];

const WAVEBARS = [8, 16, 24, 12, 28, 18, 10, 26, 14, 20, 22, 12, 26, 16, 24, 10, 18, 28, 14, 20];

const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

interface SubBands {
    fluency: number;
    lexical: number;
    pronunciation: number;
    grammar: number;
}

const IELTS_SpeakingExam: React.FC = () => {
    const [phase, setPhase] = useState<Phase>('intro');
    const [part1Index, setPart1Index] = useState(0);
    const [prepSeconds, setPrepSeconds] = useState(60);
    const [speakSeconds, setSpeakSeconds] = useState(120);
    const [stage, setStage] = useState<'prep' | 'speak'>('prep');
    const [recording, setRecording] = useState(false);
    const [subBands, setSubBands] = useState<SubBands | null>(null);
    const [overall, setOverall] = useState<number | null>(null);

    useEffect(() => {
        if (phase !== 'cue') return;
        const id = window.setInterval(() => {
            if (stage === 'prep') {
                setPrepSeconds((s) => (s <= 1 ? 0 : s - 1));
            } else {
                setSpeakSeconds((s) => (s <= 1 ? 0 : s - 1));
            }
        }, 1000);
        return () => window.clearInterval(id);
    }, [phase, stage]);

    const startPrep = () => {
        setStage('prep');
        setPrepSeconds(60);
        setSpeakSeconds(120);
    };

    const startSpeak = () => {
        setStage('speak');
        setRecording(true);
    };

    const finishCue = () => {
        setRecording(false);
        setPhase('discussion');
    };

    const complete = () => {
        const bands: SubBands = {
            fluency: clampBand(6.0 + (part1Index % 3) * 0.5),
            lexical: clampBand(6.0 + (part1Index % 4) * 0.5),
            pronunciation: clampBand(6.5 + (prepSeconds >= 30 ? 0.5 : 0)),
            grammar: clampBand(6.0 + (speakSeconds >= 60 ? 0.5 : 0)),
        };
        const avg = (bands.fluency + bands.lexical + bands.pronunciation + bands.grammar) / 4;
        setSubBands(bands);
        setOverall(Math.round(avg * 2) / 2);
        setPhase('done');
        addAttempt({
            id: Date.now(),
            skill: 'speaking',
            band: Math.round(avg * 2) / 2,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        });
    };

    const subBandLabels: { key: keyof SubBands; label: string }[] = [
        { key: 'fluency', label: 'Fluency & Coherence' },
        { key: 'lexical', label: 'Lexical Resource' },
        { key: 'pronunciation', label: 'Pronunciation' },
        { key: 'grammar', label: 'Grammatical Range' },
    ];

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-[#141414] px-4 py-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Speaking · Face-to-Face Simulation</span>
                <div className="flex gap-1">
                    {(['intro', 'cue', 'discussion'] as const).map((p, i) => (
                        <span key={p} className={`text-[11px] font-mono ${phase === p ? 'text-amber-400' : phase === 'done' || ['cue', 'discussion'].indexOf(p) < ['intro', 'cue', 'discussion'].indexOf(phase) ? 'text-neutral-500' : 'text-neutral-700'}`}>
                            Part {i + 1}
                        </span>
                    ))}
                </div>
            </div>

            {phase === 'intro' && (
                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">Part 1 · Introduction &amp; Interview</p>
                    <p className="text-base text-neutral-200 mb-1">
                        <span className="font-mono text-amber-400 mr-2">Q{part1Index + 1}.</span>
                        {PART1_QUESTIONS[part1Index]}
                    </p>
                    <p className="text-xs text-neutral-600 mb-6">Read the question aloud and answer in 2–3 sentences to simulate the interview.</p>
                    <div className="flex gap-2">
                        {part1Index < PART1_QUESTIONS.length - 1 ? (
                            <button
                                onClick={() => setPart1Index((i) => i + 1)}
                                className="px-4 py-2 rounded-lg bg-white text-black text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200"
                            >
                                Next Question
                            </button>
                        ) : (
                            <button
                                onClick={() => { startPrep(); setPhase('cue'); }}
                                className="px-4 py-2 rounded-lg bg-white text-black text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200"
                            >
                                Proceed to Part 2
                            </button>
                        )}
                    </div>
                </div>
            )}

            {phase === 'cue' && (
                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">Part 2 · Individual Long Turn</p>
                    <div className="rounded-xl bg-[#0b0b0b] border border-neutral-800 p-5 mb-5">
                        <p className="text-xs uppercase tracking-wider text-amber-400 mb-1">Cue Card</p>
                        <p className="text-base text-white mb-3">{CUE_CARD.topic}</p>
                        <ul className="space-y-1.5">
                            {CUE_CARD.prompts.map((p) => (
                                <li key={p} className="text-sm text-neutral-300 flex items-start gap-2">
                                    <span className="text-amber-400/70 mt-0.5">•</span>
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-2">
                            <button
                                onClick={startPrep}
                                className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${stage === 'prep' ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-neutral-800 bg-[#0b0b0b] text-neutral-500 hover:text-neutral-300'}`}
                            >
                                1-min Prep
                            </button>
                            <button
                                onClick={startSpeak}
                                className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${stage === 'speak' ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-neutral-800 bg-[#0b0b0b] text-neutral-500 hover:text-neutral-300'}`}
                            >
                                2-min Speak
                            </button>
                        </div>
                        <span className={`font-mono text-sm ${stage === 'speak' && speakSeconds <= 15 ? 'text-red-400' : 'text-neutral-300'}`}>
                            {stage === 'prep' ? formatTime(prepSeconds) : formatTime(speakSeconds)}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-[#0b0b0b] border border-neutral-800 p-4 mb-5">
                        <button
                            onClick={() => setRecording((r) => !r)}
                            disabled={stage !== 'speak'}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors disabled:opacity-40 ${recording ? 'bg-red-500 text-white' : 'bg-amber-400 text-black hover:bg-amber-300'}`}
                        >
                            {recording ? '❚❚' : '🎙'}
                        </button>
                        <div className="flex-1">
                            <div className="flex items-center gap-1 h-8">
                                {WAVEBARS.map((h, i) => (
                                    <span
                                        key={i}
                                        className={`flex-1 rounded-full transition-all duration-150 ${recording ? 'bg-red-400/80' : 'bg-neutral-700'}`}
                                        style={{ height: recording ? `${h + (i % 5) * 2}px` : '3px' }}
                                    />
                                ))}
                            </div>
                            <p className="text-[11px] text-neutral-600 mt-1">
                                {recording ? 'Recording voice response…' : stage === 'speak' ? 'Press the mic to start your voice response.' : 'Start the speak timer to unlock the microphone.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={finishCue}
                            className="px-4 py-2 rounded-lg bg-white text-black text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200"
                        >
                            Finish Part 2
                        </button>
                    </div>
                </div>
            )}

            {phase === 'discussion' && (
                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">Part 3 · Two-Way Discussion</p>
                    <div className="space-y-4 mb-6">
                        {PART3_QUESTIONS.map((q, i) => (
                            <p key={q} className="text-sm text-neutral-300">
                                <span className="font-mono text-amber-400 mr-2">D{i + 1}.</span>
                                {q}
                            </p>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={complete}
                            className="px-4 py-2 rounded-lg bg-white text-black text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200"
                        >
                            Complete Exam
                        </button>
                    </div>
                </div>
            )}

            {phase === 'done' && subBands && overall != null && (
                <div className="space-y-4">
                    <div className="rounded-2xl bg-[#141414] border border-amber-500/20 p-5">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
                                <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold">Speaking Band</p>
                                <p className="text-3xl font-semibold tracking-tight text-amber-400">{overall.toFixed(1)}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">SPEAKING · FULL TEST</p>
                                <p className="text-xs text-neutral-600 mt-1">Attempt logged to the IELTS tracker.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {subBandLabels.map((m) => (
                                <div key={m.key} className="rounded-xl bg-[#0b0b0b] border border-neutral-800 p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">{m.label}</p>
                                    <p className="text-xl font-semibold text-white mb-2">{subBands[m.key].toFixed(1)}</p>
                                    <div className="h-1 rounded bg-neutral-800 overflow-hidden">
                                        <div className="h-full bg-amber-400" style={{ width: `${(subBands[m.key] / 9) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IELTS_SpeakingExam;
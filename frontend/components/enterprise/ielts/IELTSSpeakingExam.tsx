import React, { useEffect, useState } from 'react';
import { addAttempt, clampBand, formatClock, type SimulationProps } from './ieltsShared';
import IELTSLobbyCard from './IELTSLobbyCard';
import IELTSExitModal from './IELTSExitModal';
import IeltsExamOptionsModal from '../../exam/IeltsExamOptionsModal';

const Wifi = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
);
const Bell = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const Menu = ({ size, strokeWidth, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

type Phase = 'intro' | 'cue' | 'discussion' | 'done';
type TestState = 'lobby' | 'active' | 'evaluating' | 'completed';

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

const STT_SAMPLES = [
    'I think one of the main reasons is that',
    'for example, when I visited the place last summer',
    'the local community really benefited from the experience',
    'however, we should also consider the environment',
    'overall, I believe travel broadens the mind',
];

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

interface IELTSSpeakingExamProps {
    candidateEmail?: string;
    simulation?: SimulationProps;
    onActiveChange?: (active: boolean) => void;
}

const IELTS_SpeakingExam: React.FC<IELTSSpeakingExamProps> = ({ candidateEmail, simulation, onActiveChange }) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [testState, setTestState] = useState<TestState>(simulation ? 'active' : 'lobby');
    const [phase, setPhase] = useState<Phase>('intro');
    const [part1Index, setPart1Index] = useState(0);
    const [prepSeconds, setPrepSeconds] = useState(60);
    const [speakSeconds, setSpeakSeconds] = useState(120);
    const [stage, setStage] = useState<'prep' | 'speak'>('prep');
    const [recording, setRecording] = useState(false);
    const [subBands, setSubBands] = useState<SubBands | null>(null);
    const [overall, setOverall] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [showExitModal, setShowExitModal] = useState(false);
    const [paused, setPaused] = useState(false);
    const [scratch, setScratch] = useState('');
    const [transcript, setTranscript] = useState('');

    const timeLimit = simulation ? simulation.timeLimitSeconds : 15 * 60;
    const locked = testState !== 'active';

    useEffect(() => {
        if (testState !== 'active' || paused) return;
        const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => window.clearInterval(id);
    }, [testState, paused]);

    useEffect(() => {
        if (phase !== 'cue' || locked || paused) return;
        const id = window.setInterval(() => {
            if (stage === 'prep') {
                setPrepSeconds((s) => (s <= 1 ? 0 : s - 1));
            } else {
                setSpeakSeconds((s) => (s <= 1 ? 0 : s - 1));
            }
        }, 1000);
        return () => window.clearInterval(id);
    }, [phase, stage, locked, paused]);

    useEffect(() => {
        if (!(recording && stage === 'speak')) return;
        let i = 0;
        const id = window.setInterval(() => {
            setTranscript((t) => `${t}${t ? ' ' : ''}${STT_SAMPLES[i % STT_SAMPLES.length]}`);
            i += 1;
        }, 2500);
        return () => window.clearInterval(id);
    }, [recording, stage]);

    const startPrep = () => {
        setStage('prep');
        setPrepSeconds(60);
        setSpeakSeconds(120);
    };

    const startSpeak = () => {
        setStage('speak');
        setRecording(true);
        setTranscript('');
    };

    const finishCue = () => {
        setRecording(false);
        setPhase('discussion');
    };

    const complete = (force = false) => {
        if (locked) return;
        setRecording(false);
        setTestState('evaluating');
        window.setTimeout(() => {
            const bands: SubBands = {
                fluency: clampBand(6.0 + (part1Index % 3) * 0.5),
                lexical: clampBand(6.0 + (part1Index % 4) * 0.5),
                pronunciation: clampBand(6.5 + (prepSeconds >= 30 ? 0.5 : 0)),
                grammar: clampBand(6.0 + (speakSeconds >= 60 ? 0.5 : 0)),
            };
            const avg = (bands.fluency + bands.lexical + bands.pronunciation + bands.grammar) / 4;
            const criteria = [
                { label: 'Fluency & Coherence', band: bands.fluency },
                { label: 'Lexical Resource', band: bands.lexical },
                { label: 'Grammatical Accuracy', band: bands.grammar },
                { label: 'Pronunciation', band: bands.pronunciation },
            ];
            const timeSpent = Math.max(1, Math.round(elapsed / 60));
            if (simulation) {
                simulation.onComplete({ skill: 'speaking', band: Math.round(avg * 2) / 2, criteria, timeSpent });
            } else {
                setSubBands(bands);
                setOverall(Math.round(avg * 2) / 2);
                addAttempt({
                    id: Date.now(),
                    skill: 'speaking',
                    band: Math.round(avg * 2) / 2,
                    timeSpent,
                    criteria,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });
            }
            setTestState('completed');
            setPhase('done');
        }, 900);
    };

    useEffect(() =>{
        if (simulation && testState === 'active' && elapsed >= timeLimit) complete(true);
    }, [elapsed, testState, simulation, timeLimit]);

    useEffect(() => {
        onActiveChange?.(testState === 'active' || testState === 'evaluating');
    }, [testState, onActiveChange]);

    const startExam = () => {
        if (simulation) return;
        setTestState('active');
        setPhase('intro');
    };

    const resetExam = () => {
        setTestState('lobby');
        setPhase('intro');
        setPart1Index(0);
        setPrepSeconds(60);
        setSpeakSeconds(120);
        setStage('prep');
        setRecording(false);
        setSubBands(null);
        setOverall(null);
        setElapsed(0);
        setPaused(false);
        setScratch('');
        setTranscript('');
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

    const advance = () => {
        if (locked) return;
        if (phase === 'intro') {
            if (part1Index < PART1_QUESTIONS.length - 1) setPart1Index((i) => i + 1);
            else {
                startPrep();
                setPhase('cue');
            }
        } else if (phase === 'cue') {
            finishCue();
        } else if (phase === 'discussion') {
            complete(false);
        }
    };

    const goBack = () => {
        if (locked) return;
        if (phase === 'discussion') {
            setPhase('cue');
            setStage('prep');
            setPrepSeconds(60);
        } else if (phase === 'cue') {
            setPhase('intro');
        }
    };

    const primaryLabel =
        phase === 'intro'
            ? part1Index < PART1_QUESTIONS.length - 1
                ? 'Next Question'
                : 'Proceed to Part 2'
            : phase === 'cue'
            ? 'Submit Part & Continue'
            : 'Finish Speaking Exam';

    const subBandLabels: { key: keyof SubBands; label: string }[] = [
        { key: 'fluency', label: 'Fluency & Coherence' },
        { key: 'lexical', label: 'Lexical Resource' },
        { key: 'grammar', label: 'Grammatical Accuracy' },
        { key: 'pronunciation', label: 'Pronunciation' },
    ];

    if (testState === 'lobby') {
        return (
            <IELTSLobbyCard
                skill="speaking"
                candidateEmail={candidateEmail || ''}
                title="Speaking Studio"
                subtitle="Face-to-face simulation with cue-card prep and voice recording."
                onStart={startExam}
            />
        );
    }

    if (!simulation && testState === 'completed' && phase === 'done' && subBands && overall != null) {
        return (
            <div className="min-h-full bg-[#F9FAFB] p-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
                                <p className="text-[10px] uppercase tracking-wider text-amber-500 font-semibold">Speaking Band</p>
                                <p className="text-3xl font-semibold tracking-tight text-amber-500">{overall.toFixed(1)}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">SPEAKING · FULL TEST</p>
                                <p className="text-xs text-slate-500 mt-1">Attempt logged to the IELTS tracker.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {subBandLabels.map((m) => (
                                <div key={m.key} className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">{m.label}</p>
                                    <p className="text-xl font-semibold text-slate-900 mb-2">{subBands[m.key].toFixed(1)}</p>
                                    <div className="h-1 rounded bg-slate-200 overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{ width: `${(subBands[m.key] / 9) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-center">
                        <button
                            onClick={resetExam}
                            className="px-6 py-2.5 rounded-lg bg-[#0072CE] text-white text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-[#005bb5]"
                        >
                            Return to Lobby
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isEvaluating = testState === 'evaluating';
    const audioPill = phase === 'cue' && stage === 'prep' ? '👂 LISTENING' : '🔊 EXAMINER SPEAKING';
    const examinerSpeaking = !(phase === 'cue' && stage === 'prep');

    return (
        <div className="flex flex-col h-full relative bg-[#FFFFFF] text-black font-sans min-w-0">
            {/* White Official Top Bar */}
            <header className="shrink-0 h-14 border-b border-[#E5E7EB] bg-white flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <span className="text-[#D32F2F] text-2xl font-black tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>IELTS<sup className="text-sm">™</sup></span>
                    <span className="text-sm font-semibold text-black tracking-wide ml-2">Test taker ID</span>
                </div>
                <div className="flex items-center gap-3">
                    <Wifi size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <Bell size={20} strokeWidth={2.5} className="cursor-pointer" />
                    <button onClick={() => setIsOptionsOpen(true)} aria-label="Open options" className="cursor-pointer">
                        <Menu size={20} strokeWidth={2.5} />
                    </button>
                    <span className="text-[11px] font-mono bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md">{formatClock(elapsed)} / {formatClock(timeLimit)}</span>
                    <button
                        onClick={() => setPaused((p) => !p)}
                        className="px-3 py-1.5 rounded-md bg-[#E5E7EB] text-[11px] text-neutral-700 hover:bg-[#D1D5DB] transition-colors"
                    >
                        {paused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                        onClick={() => setShowExitModal(true)}
                        className="px-3 py-1.5 rounded-md bg-white border border-[#CCCCCC] text-[11px] text-neutral-700 hover:text-red-600 hover:border-red-400 transition-colors"
                    >
                        Exit Exam
                    </button>
                </div>
            </header>

            <IeltsExamOptionsModal open={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} />

            {isEvaluating && (
                <div className="shrink-0 mx-4 mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
                    <p className="text-sm text-amber-600 font-medium">Grading your response…</p>
                </div>
            )}

            {/* Split-Pane Body */}
            <div className="flex-1 min-h-0 flex">
                {/* LEFT: Examiner & Prompt Studio */}
                <div className="w-full lg:w-[42%] h-full min-w-0 overflow-y-auto pr-6 pt-4 pb-20 bg-white custom-scrollbar">
                    {/* AI Examiner Header */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#0072CE] text-white flex items-center justify-center text-sm">AI</span>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">AI Examiner</p>
                                    <p className="text-[10px] text-slate-500">Cambridge-style interviewer</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-200 text-slate-700">{audioPill}</span>
                        </div>
                        <div className="flex items-end gap-1 h-8 mt-3">
                            {WAVEBARS.slice(0, 14).map((h, i) => (
                                <span
                                    key={i}
                                    className={`flex-1 rounded-full ${examinerSpeaking ? 'bg-[#0072CE]/70 animate-pulse' : 'bg-slate-300'}`}
                                    style={{ height: examinerSpeaking ? `${h}px` : '4px' }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Test Phase Navigator */}
                    <div className="flex items-center gap-2 mb-4">
                        {(['intro', 'cue', 'discussion'] as const).map((p, i) => (
                            <span
                                key={p}
                                className={`text-[11px] font-medium px-3 py-1.5 rounded-full border ${
                                    phase === p
                                        ? 'border-[#0072CE] bg-[#0072CE]/10 text-[#0072CE]'
                                        : phase === 'done' || ['cue', 'discussion'].indexOf(p) < ['intro', 'cue', 'discussion'].indexOf(phase)
                                        ? 'border-slate-200 text-slate-500'
                                        : 'border-slate-200 text-slate-400'
                                }`}
                            >
                                Part {i + 1}
                            </span>
                        ))}
                    </div>

                    {/* Prompt Canvas */}
                    {phase === 'intro' && (
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-slate-800">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Part 1 · Introduction &amp; Interview · 4–5 mins</p>
                            <p className="text-base text-slate-900 mb-1">
                                <span className="font-mono text-[#0072CE] mr-2">Q{part1Index + 1}.</span>
                                {PART1_QUESTIONS[part1Index]}
                            </p>
                            <p className="text-xs text-slate-500 mt-3">Read the question aloud and answer in 2–3 sentences to simulate the interview.</p>
                        </div>
                    )}

                    {phase === 'cue' && (
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-slate-800">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Part 2 · Individual Long Turn · 1 min prep, 2 mins speak</p>
                            <div className="rounded-lg bg-white border border-slate-200 p-4 mb-4">
                                <p className="text-xs uppercase tracking-wider text-[#0072CE] mb-1">Cue Card</p>
                                <p className="text-base text-slate-900 mb-3">{CUE_CARD.topic}</p>
                                <ul className="space-y-1.5">
                                    {CUE_CARD.prompts.map((p) => (
                                        <li key={p} className="text-sm text-slate-700 flex items-start gap-2">
                                            <span className="text-[#0072CE]/70 mt-0.5">•</span>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] uppercase tracking-wider text-slate-500">Prep Timer</span>
                                <span className={`font-mono text-lg ${stage === 'speak' && speakSeconds <= 15 ? 'text-red-500' : 'text-slate-900'}`}>
                                    {formatTime(prepSeconds)}
                                </span>
                            </div>
                            <textarea
                                value={scratch}
                                onChange={(e) => setScratch(e.target.value)}
                                placeholder="Jot a quick outline of your long turn…"
                                className="w-full h-28 p-3 text-sm bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-[#0072CE] resize-none"
                            />
                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={startSpeak}
                                    disabled={locked}
                                    className="px-4 py-2 rounded-lg bg-[#0072CE] text-white text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-[#005bb5] disabled:opacity-50"
                                >
                                    Begin Speaking ➔
                                </button>
                            </div>
                        </div>
                    )}

                    {phase === 'discussion' && (
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 text-slate-800">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-3">Part 3 · Two-Way Discussion · 4–5 mins</p>
                            <div className="space-y-3">
                                {PART3_QUESTIONS.map((q, i) => (
                                    <p key={q} className="text-sm text-slate-800">
                                        <span className="font-mono text-[#0072CE] mr-2">D{i + 1}.</span>
                                        {q}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px bg-[#E5E7EB]" />

                {/* RIGHT: Recording Studio */}
                <div className="flex-1 h-full min-w-0 overflow-y-auto pl-6 pt-4 pb-20 bg-[#F9F9F9] border-l border-[#E5E7EB] custom-scrollbar">
                    <div className="rounded-xl bg-white border border-[#E5E7EB] p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Live Audio Input</p>
                            <span className={`text-[11px] font-mono px-3 py-1 rounded-full ${recording ? 'bg-red-500/10 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                {recording ? `RECORDING... ${formatTime(speakSeconds)} / 02:00` : stage === 'prep' ? 'PREP' : 'READY'}
                            </span>
                        </div>
                        <div className="flex items-end gap-1 h-16 bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
                            {WAVEBARS.map((h, i) => (
                                <span
                                    key={i}
                                    className={`flex-1 rounded-full ${recording ? (i % 2 ? 'bg-emerald-500' : 'bg-cyan-500') : 'bg-slate-300'} ${recording ? 'animate-pulse' : ''}`}
                                    style={{ height: recording ? `${h + (i % 5) * 2}px` : '6px' }}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => { if (stage !== 'speak') return; setRecording((r) => !r); }}
                            disabled={stage !== 'speak'}
                            className={`mb-4 w-full py-2.5 rounded-lg text-[11px] font-semibold uppercase tracking-widest transition-colors disabled:opacity-40 ${
                                recording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#0072CE] text-white hover:bg-[#005bb5]'
                            }`}
                        >
                            {recording ? 'Stop Recording' : 'Start Recording'}
                        </button>

                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Live Transcript · AI Speech-to-Text</p>
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Your spoken response will appear here in real time…"
                            className="w-full h-40 p-3 text-sm bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-[#0072CE] resize-none"
                        />
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={advance}
                            disabled={locked}
                            className="px-5 py-2.5 rounded-lg bg-[#0072CE] text-white text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-[#005bb5] disabled:opacity-50"
                        >
                            {primaryLabel} ➔
                        </button>
                    </div>
                </div>
            </div>

            {/* White Official Bottom Bar */}
            <footer className="shrink-0 h-12 bg-white border-t border-[#E5E7EB] flex items-center justify-between px-2 w-full z-10">
                <div className="flex items-center gap-4 h-full px-4">
                    <button
                        onClick={goBack}
                        disabled={phase === 'intro' || locked}
                        className="text-sm font-bold text-neutral-700 disabled:opacity-30 hover:text-black"
                    >
                        ◄ Previous
                    </button>
                    {phase === 'intro' && (
                        <button
                            onClick={advance}
                            disabled={locked}
                            className="text-sm font-bold text-[#0072CE] hover:text-[#005bb5]"
                        >
                            Next Question ►
                        </button>
                    )}
                </div>
                <div className="shrink-0 flex items-center h-full border-l border-[#E5E7EB] pl-2">
                    <button
                        onClick={advance}
                        disabled={locked}
                        className="w-auto px-5 h-full bg-[#E0E0E0] hover:bg-[#D0D0D0] flex items-center justify-center transition-colors text-black text-[11px] font-semibold uppercase tracking-widest"
                    >
                        {primaryLabel} ✓
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

export default IELTS_SpeakingExam;

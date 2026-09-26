import React, { useEffect, useState } from 'react';
import { addAttempt, clampBand, formatClock, type SimulationProps } from './ieltsShared';
import IELTSLobbyCard from './IELTSLobbyCard';
import IELTSExitModal from './IELTSExitModal';
import IeltsExamOptionsModal from '../../exam/IeltsExamOptionsModal';
import LexiSpeakStudio from './LexiSpeakStudio';
import { useAuth } from '../../../authContext';

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
    exitPulse?: boolean;
    mode?: 'full_mock' | 'part-practice';
    practicePart?: number;
    onExit?: () => void;
}

const IELTS_SpeakingExam: React.FC<IELTSSpeakingExamProps> = ({
    candidateEmail,
    simulation,
    onActiveChange,
    exitPulse,
    mode = 'full_mock',
    practicePart = 1,
    onExit,
}) => {
    const isPartPractice = mode === 'part-practice';
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const lexiMode = true;
    const [testState, setTestState] = useState<TestState>(simulation || isPartPractice ? 'active' : 'lobby');
    const [phase, setPhase] = useState<Phase>(
        isPartPractice && practicePart === 2 ? 'cue' : isPartPractice && practicePart === 3 ? 'discussion' : 'intro'
    );
    const [part1Index, setPart1Index] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [lexiElapsed, setLexiElapsed] = useState(0);
    const [showExitModal, setShowExitModal] = useState(false);
    const [paused, setPaused] = useState(false);
    const [subBands, setSubBands] = useState<SubBands | null>(null);
    const [overall, setOverall] = useState<number | null>(null);

    const { session } = useAuth();
    const sessionToken = session?.access_token || '';

    const timeLimit = simulation ? simulation.timeLimitSeconds : 15 * 60;
    const locked = testState !== 'active';

    useEffect(() => {
        if (testState !== 'active' || paused) return;
        const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => window.clearInterval(id);
    }, [testState, paused]);

    useEffect(() => {
        onActiveChange?.(!lexiMode && (testState === 'active' || testState === 'evaluating'));
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
        setSubBands(null);
        setOverall(null);
        setElapsed(0);
        setPaused(false);
        setShowExitModal(false);
    };

    const handleExit = () => {
        setShowExitModal(false);
        if (isPartPractice && onExit) {
            onExit();
            return;
        }
        if (simulation) {
            simulation.onExit?.();
        } else if (onExit) {
            onExit();
        } else {
            resetExam();
        }
    };

    if (testState === 'lobby') {
        if (isPartPractice) {
            startExam();
            return null;
        }
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
                            {([
                                { key: 'fluency', label: 'Fluency & Coherence' },
                                { key: 'lexical', label: 'Lexical Resource' },
                                { key: 'grammar', label: 'Grammatical Accuracy' },
                                { key: 'pronunciation', label: 'Pronunciation' },
                            ] as const).map((m) => (
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
                    <span className="text-[11px] font-mono bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md">{formatClock(lexiMode ? lexiElapsed : elapsed)} / {formatClock(timeLimit)}</span>
                    <button
                        onClick={() => setPaused((p) => !p)}
                        className="px-3 py-1.5 rounded-md bg-[#E5E7EB] text-[11px] text-neutral-700 hover:bg-[#D1D5DB] transition-colors"
                    >
                        {paused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                        onClick={() => setShowExitModal(true)}
                        className={`px-3 py-1.5 rounded-md bg-white border border-[#CCCCCC] text-[11px] text-neutral-700 hover:text-red-600 hover:border-red-400 transition-all${exitPulse ? ' scale-105 ring-2 ring-rose-500/80 shadow-[0_0_15px_rgba(225,29,72,0.5)] animate-pulse' : ''}`}
                    >
                        Exit Exam
                    </button>
                </div>
            </header>

            <IeltsExamOptionsModal open={isOptionsOpen} onClose={() => setIsOptionsOpen(false)} />

            {lexiMode && <LexiSpeakStudio onTimer={setLexiElapsed} onActiveChange={onActiveChange} sessionToken={sessionToken} />}

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

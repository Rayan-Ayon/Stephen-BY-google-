import React, { useEffect, useRef, useState, useCallback } from 'react';
import CueCardTaskCard from './CueCardTaskCard';
import { MaraAvatar } from '../../../src/components/mock-tests/speaking/MaraAvatar';
import {
    playPart2Instructions,
    stopSpeakingAudio,
    stopAllAudio,
    IELTS_PART2_RULES_SCRIPT,
} from '../../../services/speaking/speakingAudioService';

export type Part2StateMachineState = 'PART2_EXAMINER_RULES' | 'PART2_PREPARATION' | 'PART2_SPEAKING';

export interface CueCardPhaseProps {
    topic: string;
    prompts: string[];
    notes: string;
    onNotesChange: (notes: string) => void;
    onStartRecording: () => void;
    isRecording?: boolean;
    prepDurationSeconds?: number; // Defaults to 60s
    onSkipInstructions?: () => void;
    className?: string;
}

export const CueCardPhase: React.FC<CueCardPhaseProps> = ({
    topic,
    prompts,
    notes,
    onNotesChange,
    onStartRecording,
    isRecording = false,
    prepDurationSeconds = 60,
    onSkipInstructions,
    className = '',
}) => {
    const [subPhase, setSubPhase] = useState<Part2StateMachineState>('PART2_EXAMINER_RULES');
    const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);
    const [prepTimeRemaining, setPrepTimeRemaining] = useState<number>(prepDurationSeconds);

    const timerRef = useRef<number | null>(null);
    const hasStartedAudioRef = useRef<boolean>(false);

    // ── Function to advance from RULES to PREPARATION ───────────────────────
    // Critical: 60s prep must proceed in ABSOLUTE SILENCE (zero speech synthesis)
    const advanceToPreparation = useCallback(() => {
        stopAllAudio();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {
                // ignore
            }
        }
        setIsExaminerSpeaking(false);
        setSubPhase('PART2_PREPARATION');
        setPrepTimeRemaining(prepDurationSeconds);
        onSkipInstructions?.();
    }, [prepDurationSeconds, onSkipInstructions]);

    // ── 1. State 1: PART2_EXAMINER_RULES (Play audio on mount) ──────────────
    useEffect(() => {
        if (hasStartedAudioRef.current) return;
        hasStartedAudioRef.current = true;

        setIsExaminerSpeaking(true);
        const cancelSpeech = playPart2Instructions({
            onStart: () => {
                setIsExaminerSpeaking(true);
            },
            onEnd: () => {
                setIsExaminerSpeaking(false);
                advanceToPreparation();
            },
            onError: () => {
                setIsExaminerSpeaking(false);
                advanceToPreparation();
            },
        });

        return () => {
            cancelSpeech();
            stopSpeakingAudio();
        };
    }, [advanceToPreparation]);

    // ── 2. State 2: PART2_PREPARATION (60s countdown) ───────────────────────
    useEffect(() => {
        if (subPhase !== 'PART2_PREPARATION') return;

        timerRef.current = window.setInterval(() => {
            setPrepTimeRemaining((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    timerRef.current = null;
                    // Auto-start speaking when prep time expires
                    setSubPhase('PART2_SPEAKING');
                    onStartRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [subPhase, onStartRecording]);

    // ── User initiates speaking early ──────────────────────────────────────
    const handleStartSpeakingNow = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setSubPhase('PART2_SPEAKING');
        onStartRecording();
    }, [onStartRecording]);

    return (
        <div className={`w-full flex flex-col items-center justify-center gap-4 ${className}`}>
            {/* ── SUBPHASE 1: EXAMINER RULES & ORIENTATION ── */}
            {subPhase === 'PART2_EXAMINER_RULES' ? (
                <div className="w-full max-w-lg flex flex-col items-center justify-center p-6 rounded-2xl bg-[#15181E] border border-[#222732] shadow-2xl animate-fadeIn">
                    {/* Mara Examiner Avatar */}
                    <div className="mb-4">
                        <MaraAvatar isSpeaking={isExaminerSpeaking} size={150} />
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-4">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span>Examiner explaining Part 2 rules</span>
                    </div>

                    {/* Instruction Transcript Box */}
                    <div className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl p-4 mb-6 shadow-inner">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                            Official Examiner Script
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium italic">
                            "{IELTS_PART2_RULES_SCRIPT}"
                        </p>
                    </div>

                    {/* Prominent High-Contrast Skip Control */}
                    <button
                        onClick={advanceToPreparation}
                        className="w-full py-3 px-5 rounded-xl bg-[#222732] hover:bg-[#2B3242] border border-zinc-700 hover:border-rose-500/60 text-white font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer group active:scale-[0.99]"
                    >
                        <span>⏭️ Skip Instructions / Jump to Cue Card</span>
                        <span className="text-[11px] font-normal text-zinc-400 group-hover:text-zinc-200">
                            (Begin 60s Prep)
                        </span>
                    </button>
                </div>
            ) : (
                /* ── SUBPHASE 2 & 3: REVEALED CUE CARD & PREPARATION / RECORDING ── */
                <CueCardTaskCard
                    topic={topic}
                    prompts={prompts}
                    notes={notes}
                    onNotesChange={onNotesChange}
                    isLocked={false}
                    prepTimeRemaining={subPhase === 'PART2_PREPARATION' ? prepTimeRemaining : 0}
                    onStartSpeaking={subPhase === 'PART2_PREPARATION' ? handleStartSpeakingNow : undefined}
                    disabled={isRecording}
                />
            )}
        </div>
    );
};

export default CueCardPhase;

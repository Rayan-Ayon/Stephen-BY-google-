import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    fetchSpeakingExamData,
    type SpeakingTestData,
    type SpeakingEvaluation,
} from './speakingExamShared';

interface SpeakingExamWorkspaceProps {
    candidateEmail?: string;
    sourceType?: 'cambridge' | 'mock_series';
    bookNumber?: number;
    testNumber?: number;
    category?: 'academic' | 'general';
    onExit: () => void;
    onActiveChange?: (active: boolean) => void;
    exitPulse?: boolean;
}

type RecordingState = 'idle' | 'ready' | 'recording' | 'recorded';

const formatClock = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const SpeakingExamWorkspace: React.FC<SpeakingExamWorkspaceProps> = ({
    candidateEmail,
    sourceType = 'cambridge',
    bookNumber = 7,
    testNumber = 1,
    category = 'academic',
    onExit,
    onActiveChange,
    exitPulse = false,
}) => {
    // ── Exam Data & Loading ────────────────────────────────────────────────
    const [testData, setTestData] = useState<SpeakingTestData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // ── Exam Navigation State ──────────────────────────────────────────────
    const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());
    const [showExitModal, setShowExitModal] = useState(false);
    const [paused, setPaused] = useState(false);

    // ── Timer State ────────────────────────────────────────────────────────
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef<number | null>(null);

    // ── Part 2 Cue Card Prep Timer ─────────────────────────────────────────
    const [prepTimeRemaining, setPrepTimeRemaining] = useState(60);
    const [isPrepActive, setIsPrepActive] = useState(false);
    const prepTimerRef = useRef<number | null>(null);

    // ── Recording State ────────────────────────────────────────────────────
    const [recordingState, setRecordingState] = useState<RecordingState>('ready');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    // ── Playback State ─────────────────────────────────────────────────────
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);

    // ── AI Evaluation State ────────────────────────────────────────────────
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState<SpeakingEvaluation | null>(null);
    const [evalError, setEvalError] = useState<string | null>(null);

    // ── Fetch Question Data on Mount / Test Change ─────────────────────────
    useEffect(() => {
        let isMounted = true;
        setIsLoadingData(true);
        fetchSpeakingExamData(sourceType, bookNumber, testNumber, category).then((data) => {
            if (isMounted) {
                setTestData(data);
                setIsLoadingData(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [sourceType, bookNumber, testNumber, category]);

    // ── Notify Active State ────────────────────────────────────────────────
    useEffect(() => {
        onActiveChange?.(true);
        return () => {
            onActiveChange?.(false);
        };
    }, [onActiveChange]);

    // ── Main Timer ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (paused) return;
        timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [paused]);

    // ── Prep Timer for Part 2 ──────────────────────────────────────────────
    useEffect(() => {
        if (!isPrepActive || prepTimeRemaining <= 0) return;
        prepTimerRef.current = window.setInterval(() => {
            setPrepTimeRemaining((prev) => {
                if (prev <= 1) {
                    setIsPrepActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
        };
    }, [isPrepActive, prepTimeRemaining]);

    // ── Reset recording state on question or part change ───────────────────
    useEffect(() => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioBlob(null);
        setAudioUrl(null);
        setIsPlaying(false);
        setPlaybackTime(0);
        setPlaybackDuration(0);
        setRecordingState('ready');
        setEvaluationResult(null);
        setEvalError(null);
    }, [currentPart, questionIndex]);

    // ── Cleanup on unmount ─────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((t) => t.stop());
            }
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            if (timerRef.current) window.clearInterval(timerRef.current);
            if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
        };
    }, [audioUrl]);

    // ── Audio Recording Controls ───────────────────────────────────────────
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { sampleRate: 16000, channelCount: 1 },
            });
            streamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setRecordingState('recorded');
                stream.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setRecordingState('recording');
        } catch (err) {
            console.error('Microphone access denied:', err);
            setRecordingState('ready');
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    const reRecord = useCallback(() => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingState('ready');
        setEvaluationResult(null);
        setEvalError(null);
    }, [audioUrl]);

    // ── Audio Playback Controls ────────────────────────────────────────────
    const togglePlayback = useCallback(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }, [isPlaying]);

    const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
    }, []);

    // ── Active Prompt Retrieval ────────────────────────────────────────────
    const getCurrentPrompt = (): string => {
        if (!testData) return '';
        if (currentPart === 1) {
            return testData.part1.questions[questionIndex] || 'Tell me about yourself.';
        }
        if (currentPart === 2) {
            return `Describe ${testData.part2.topic}. Bullet prompts: ${testData.part2.prompts.join(', ')}`;
        }
        return testData.part3.questions[questionIndex] || 'What is your opinion on this topic?';
    };

    const currentPromptText = getCurrentPrompt();

    const getQuestionsList = (): string[] => {
        if (!testData) return [];
        if (currentPart === 1) return testData.part1.questions;
        if (currentPart === 2) return [testData.part2.topic];
        return testData.part3.questions;
    };

    const questionsList = getQuestionsList();
    const totalQuestionsInPart = questionsList.length;

    // ── Navigation Between Questions & Parts ───────────────────────────────
    const handleNextQuestion = useCallback(() => {
        if (currentPart === 2) {
            setCompletedParts((prev) => new Set(prev).add(2));
            setCurrentPart(3);
            setQuestionIndex(0);
        } else if (questionIndex < totalQuestionsInPart - 1) {
            setQuestionIndex((prev) => prev + 1);
        } else {
            setCompletedParts((prev) => new Set(prev).add(currentPart));
            if (currentPart === 1) {
                setCurrentPart(2);
                setQuestionIndex(0);
            }
        }
    }, [currentPart, questionIndex, totalQuestionsInPart]);

    const handlePrevQuestion = useCallback(() => {
        if (questionIndex > 0) {
            setQuestionIndex((prev) => prev - 1);
        } else if (currentPart === 3) {
            setCurrentPart(2);
            setQuestionIndex(0);
        } else if (currentPart === 2) {
            setCurrentPart(1);
            if (testData?.part1.questions.length) {
                setQuestionIndex(testData.part1.questions.length - 1);
            }
        }
    }, [currentPart, questionIndex, testData]);

    // ── AI Evaluation Submission ───────────────────────────────────────────
    const submitForEvaluation = useCallback(async () => {
        if (!audioBlob || isEvaluating) return;
        setIsEvaluating(true);
        setEvalError(null);
        setEvaluationResult(null);

        try {
            const formData = new FormData();
            formData.append('file', audioBlob, `recording-part${currentPart}-q${questionIndex}.webm`);
            formData.append('question_prompt', currentPromptText);

            const response = await fetch('/api/ielts/evaluate-speaking', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || `API error ${response.status}`);
            }

            const result: SpeakingEvaluation = await response.json();
            setEvaluationResult(result);
        } catch (err: any) {
            console.error('Speaking evaluation failed:', err);
            setEvalError(err.message || 'Evaluation service unavailable. Please try again.');
        } finally {
            setIsEvaluating(false);
        }
    }, [audioBlob, isEvaluating, currentPart, questionIndex, currentPromptText]);

    // ── Render Loading Screen ──────────────────────────────────────────────
    if (isLoadingData) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center bg-[#0B0C0E] text-white">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-zinc-400">Loading exam questions from Supabase...</p>
                <p className="text-xs text-zinc-600 mt-1">
                    {sourceType === 'cambridge' ? `Cambridge ${bookNumber}` : `Mock Series ${bookNumber}`} · Test {testNumber}
                </p>
            </div>
        );
    }

    const seriesSubtitle = sourceType === 'cambridge'
        ? `CAMBRIDGE ${bookNumber}${category === 'general' ? ' (GT)' : ''}`
        : `MOCK SERIES ${bookNumber}`;

    return (
        <div className="flex flex-col h-full w-full relative bg-[#0B0C0E] text-white font-sans min-w-0 overflow-hidden select-none">
            {/* ── Global Unified Header (Dark Sticky Header Bar matching Reading/Listening) ── */}
            <header className="shrink-0 h-14 bg-[#121212] border-b border-neutral-800 flex items-center justify-between px-4 sm:px-6 z-20">
                {/* Left: Exit button + Test title */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => setShowExitModal(true)}
                        className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-800 cursor-pointer"
                        title="Exit Exam"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div>
                        <span className="text-[10px] sm:text-xs font-semibold text-purple-400 uppercase tracking-wider block">
                            {seriesSubtitle}
                        </span>
                        <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                            Speaking Test {testNumber}
                        </h1>
                    </div>
                </div>

                {/* Center: Part Navigation Pills */}
                <div className="hidden md:flex items-center gap-2 bg-[#1A1A1E] border border-zinc-800/80 p-1 rounded-xl">
                    {([1, 2, 3] as const).map((part) => {
                        const isActive = currentPart === part;
                        const isCompleted = completedParts.has(part);
                        return (
                            <button
                                key={part}
                                onClick={() => {
                                    setCurrentPart(part);
                                    setQuestionIndex(0);
                                }}
                                className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : isCompleted
                                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                {isCompleted && '✓ '}Part {part}
                            </button>
                        );
                    })}
                </div>

                {/* Right: Live Exam Mode + Timer + Pause + Exit */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <span className="hidden sm:inline-flex text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">
                        ✓ Live Exam Mode
                    </span>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700/60">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className="font-mono text-sm text-white">{formatClock(elapsed)}</span>
                    </div>

                    <button
                        onClick={() => setPaused((p) => !p)}
                        className="hidden sm:inline-flex px-3 py-1.5 rounded-md bg-neutral-800 text-[11px] text-neutral-300 hover:bg-neutral-700 transition-colors cursor-pointer"
                    >
                        {paused ? 'Resume' : 'Pause'}
                    </button>

                    <button
                        onClick={() => setShowExitModal(true)}
                        className={`px-3 py-1.5 rounded-md bg-white border border-[#CCCCCC] text-[11px] text-neutral-800 font-semibold hover:text-red-600 hover:border-red-400 transition-all cursor-pointer ${
                            exitPulse ? 'scale-105 ring-2 ring-rose-500/80 animate-pulse' : ''
                        }`}
                    >
                        Exit Exam
                    </button>
                </div>
            </header>

            {/* ── Mobile Part Switcher Row ── */}
            <div className="flex md:hidden items-center justify-center gap-2 bg-[#121316] border-b border-zinc-800 px-4 py-2">
                {([1, 2, 3] as const).map((part) => (
                    <button
                        key={part}
                        onClick={() => {
                            setCurrentPart(part);
                            setQuestionIndex(0);
                        }}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                            currentPart === part
                                ? 'bg-purple-600 text-white'
                                : 'bg-zinc-800/60 text-zinc-400'
                        }`}
                    >
                        Part {part}
                    </button>
                ))}
            </div>

            {/* ── Main Exam Container ── */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-[#0B0C0E]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                    {/* Part Header & Subtitle */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-purple-400 text-xs font-mono tracking-wider font-semibold uppercase">
                                {currentPart === 1 && 'Part 1: Interview & Introduction'}
                                {currentPart === 2 && 'Part 2: Individual Long Turn (Cue Card)'}
                                {currentPart === 3 && 'Part 3: Two-Way Discussion'}
                            </span>
                            {currentPart !== 2 && (
                                <span className="text-xs text-zinc-500 font-mono">
                                    Question {questionIndex + 1} of {totalQuestionsInPart}
                                </span>
                            )}
                        </div>

                        {currentPart !== 2 && (
                            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden mt-2">
                                <div
                                    className="bg-purple-600 h-full transition-all duration-300"
                                    style={{ width: `${((questionIndex + 1) / totalQuestionsInPart) * 100}%` }}
                                />
                            </div>
                        )}
                    </div>

                    {/* ── PART 1 / PART 3 QUESTION CARD ── */}
                    {currentPart !== 2 ? (
                        <div className="bg-[#141519] border border-purple-900/30 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
                                Examiner Question
                            </p>
                            <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                                {currentPromptText}
                            </h2>
                        </div>
                    ) : (
                        /* ── PART 2 OFFICIAL CUE CARD ── */
                        <div className="bg-[#141519] border-2 border-purple-800/40 rounded-2xl p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="bg-purple-950/80 border border-purple-700/60 text-purple-300 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                                        Candidate Task Card
                                    </span>
                                    <span className="text-xs text-zinc-500 font-medium">IELTS Official Speaking Format</span>
                                </div>
                                <span className="text-xs text-zinc-400 font-mono">1–2 minutes</span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                                Describe {testData?.part2.topic}
                            </h3>

                            <div className="bg-[#0B0C0E] border border-zinc-800/80 rounded-xl p-4 sm:p-5 mb-6">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
                                    You should say:
                                </p>
                                <ul className="space-y-2">
                                    {testData?.part2.prompts.map((prompt, idx) => (
                                        <li key={idx} className="text-sm text-zinc-200 flex items-start gap-2.5">
                                            <span className="text-purple-400 font-bold">•</span>
                                            <span>{prompt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 1-Minute Preparation Assistant */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-purple-950/20 border border-purple-800/30 rounded-xl p-4">
                                <div>
                                    <p className="text-xs font-bold text-purple-300">1-Minute Preparation Timer</p>
                                    <p className="text-[11px] text-zinc-400">
                                        Use this minute to plan your talking points before speaking.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-lg font-bold text-purple-400">
                                        00:{String(prepTimeRemaining).padStart(2, '0')}
                                    </span>
                                    <button
                                        onClick={() => {
                                            if (prepTimeRemaining === 0) setPrepTimeRemaining(60);
                                            setIsPrepActive((a) => !a);
                                        }}
                                        className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        {isPrepActive ? 'Pause Prep' : prepTimeRemaining === 0 ? 'Restart Prep' : 'Start Prep'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── RECORDING & EVALUATION SECTION ── */}
                    <div className="bg-[#141519] border border-zinc-800/80 rounded-2xl p-6 shadow-xl mb-8">
                        {/* Status Line */}
                        <div className="flex items-center justify-center mb-4">
                            {recordingState === 'recording' && (
                                <span className="flex items-center gap-2 text-sm font-semibold text-rose-500 animate-pulse">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                    Recording your answer... Speak clearly into your microphone
                                </span>
                            )}
                            {recordingState === 'recorded' && (
                                <span className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                                    ✓ Response recorded successfully
                                </span>
                            )}
                            {recordingState === 'ready' && (
                                <span className="text-xs text-zinc-400">
                                    Click below when you are ready to begin speaking
                                </span>
                            )}
                        </div>

                        {/* Main Recording Action Buttons */}
                        {recordingState === 'ready' && (
                            <button
                                onClick={startRecording}
                                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-base shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                                </svg>
                                Start Recording
                            </button>
                        )}

                        {recordingState === 'recording' && (
                            <button
                                onClick={stopRecording}
                                className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-base shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                            >
                                <span className="w-4 h-4 rounded bg-white" />
                                Stop Recording
                            </button>
                        )}

                        {/* Playback & AI Evaluation Button */}
                        {recordingState === 'recorded' && audioUrl && (
                            <div className="space-y-4">
                                <audio
                                    ref={audioRef}
                                    src={audioUrl}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onTimeUpdate={() => {
                                        if (audioRef.current) setPlaybackTime(audioRef.current.currentTime);
                                    }}
                                    onLoadedMetadata={() => {
                                        if (audioRef.current) setPlaybackDuration(audioRef.current.duration);
                                    }}
                                    onEnded={() => setIsPlaying(false)}
                                />

                                {/* Waveform Seekbar */}
                                <div className="bg-[#0B0C0E] border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
                                    <button
                                        onClick={togglePlayback}
                                        className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shrink-0 transition-transform cursor-pointer"
                                    >
                                        {isPlaying ? (
                                            <span className="w-3 h-3 bg-white" />
                                        ) : (
                                            <svg className="w-4 h-4 ml-0.5 fill-white" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>

                                    <span className="text-xs text-zinc-400 font-mono w-10">
                                        {formatClock(Math.floor(playbackTime))}
                                    </span>

                                    <div
                                        className="flex-1 h-2 bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden"
                                        onClick={handleSeek}
                                    >
                                        <div
                                            className="h-full bg-purple-500 rounded-full transition-all"
                                            style={{ width: playbackDuration ? `${(playbackTime / playbackDuration) * 100}%` : '0%' }}
                                        />
                                    </div>

                                    <span className="text-xs text-zinc-400 font-mono w-10 text-right">
                                        {formatClock(Math.floor(playbackDuration))}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <button
                                        onClick={reRecord}
                                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                        Re-record answer
                                    </button>

                                    {!evaluationResult && (
                                        <button
                                            onClick={submitForEvaluation}
                                            disabled={isEvaluating}
                                            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                                                isEvaluating
                                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                                            }`}
                                        >
                                            {isEvaluating ? (
                                                <>
                                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Grading Speaking...
                                                </>
                                            ) : (
                                                '✨ Get AI Speaking Evaluation'
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Evaluation Error Message */}
                                {evalError && (
                                    <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 text-center text-xs text-rose-300">
                                        {evalError}
                                    </div>
                                )}

                                {/* Evaluation Result Card */}
                                {evaluationResult && (
                                    <div className="bg-[#0B0C0E] border border-zinc-800 rounded-2xl p-5 space-y-4">
                                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                            <div>
                                                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                                                    IELTS Official Band Estimate
                                                </p>
                                                <p className="text-3xl font-black text-white mt-0.5">
                                                    Band {evaluationResult.overallBand.toFixed(1)}
                                                </p>
                                            </div>
                                            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
                                                ✓ Saved to Speaking Submissions
                                            </span>
                                        </div>

                                        {/* 4 Criteria Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            {[
                                                { label: 'Fluency', score: evaluationResult.fluency.score, color: 'text-purple-400' },
                                                { label: 'Lexical', score: evaluationResult.lexical.score, color: 'text-blue-400' },
                                                { label: 'Grammar', score: evaluationResult.grammar.score, color: 'text-amber-400' },
                                                { label: 'Pronunciation', score: evaluationResult.pronunciation.score, color: 'text-emerald-400' },
                                            ].map((criterion) => (
                                                <div key={criterion.label} className="bg-[#141519] border border-zinc-800 rounded-xl p-3 text-center">
                                                    <p className="text-[11px] text-zinc-400 font-semibold">{criterion.label}</p>
                                                    <p className={`text-xl font-bold mt-1 ${criterion.color}`}>
                                                        {criterion.score.toFixed(1)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Strengths & Improvements */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                            {evaluationResult.what_you_did_well?.length > 0 && (
                                                <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-xl p-3.5">
                                                    <p className="text-xs font-bold text-emerald-400 mb-2">Strengths</p>
                                                    <ul className="text-xs text-zinc-300 space-y-1">
                                                        {evaluationResult.what_you_did_well.map((s, idx) => (
                                                            <li key={idx}>• {s}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {evaluationResult.areas_to_improve?.length > 0 && (
                                                <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-3.5">
                                                    <p className="text-xs font-bold text-amber-400 mb-2">Areas for Improvement</p>
                                                    <ul className="text-xs text-zinc-300 space-y-1">
                                                        {evaluationResult.areas_to_improve.map((imp, idx) => (
                                                            <li key={idx}>• {imp}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        {/* Transcript */}
                                        {evaluationResult.transcript && (
                                            <div className="bg-[#141519] border border-zinc-800/80 rounded-xl p-3.5">
                                                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                                                    AI Transcription
                                                </p>
                                                <p className="text-xs text-zinc-300 leading-relaxed italic">
                                                    "{evaluationResult.transcript}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Bottom Dock Navigation Bar ── */}
            <div className="shrink-0 h-14 bg-[#121212] border-t border-neutral-800 px-6 flex items-center justify-between z-20">
                <button
                    onClick={handlePrevQuestion}
                    disabled={currentPart === 1 && questionIndex === 0}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    &lt; Previous Question
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                    >
                        {currentPart === 3 && questionIndex === totalQuestionsInPart - 1
                            ? 'Finish Speaking Test'
                            : 'Next Question >'}
                    </button>
                </div>
            </div>

            {/* ── Exit Confirmation Modal ── */}
            {showExitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#141519] border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/40 flex items-center justify-center mx-auto mb-4 text-rose-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Exit Speaking Test?</h3>
                        <p className="text-xs text-zinc-400 mb-6">
                            Any un-evaluated recordings in your current question will not be saved. Are you sure you want to exit to the Speaking Studio hub?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setShowExitModal(false)}
                                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Continue Test
                            </button>
                            <button
                                onClick={() => {
                                    setShowExitModal(false);
                                    onExit();
                                }}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                                Exit to Hub
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpeakingExamWorkspace;

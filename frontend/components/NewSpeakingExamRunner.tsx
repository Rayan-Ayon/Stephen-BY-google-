import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

type RecordingState = 'idle' | 'listening' | 'ready' | 'recording' | 'recorded';

interface Part1Topic {
    id: string;
    label: string;
    hint: string;
    examinerPrompt: string;
}

interface Part2Topic {
    id: string;
    label: string;
    hint: string;
    topic: string;
    prompts: string[];
}

interface Part3Topic {
    id: string;
    label: string;
    hint: string;
    examinerPrompt: string;
}

interface NewSpeakingExamRunnerProps {
    userEmail?: string;
    testTitle?: string;
    onExit: () => void;
}

// ─── Data Constants (reused from LexiSpeakStudio) ───────────────────────────

const PART1_TOPICS: Part1Topic[] = [
    { id: 'hometown', label: 'Hometown & Living', hint: 'Places & daily life', examinerPrompt: "Let's talk about where you live. Can you describe your hometown and what you like most about it?" },
    { id: 'work_study', label: 'Work or Study', hint: 'Routine & ambition', examinerPrompt: 'Do you work or are you a student? What do you find most interesting about your job or course?' },
    { id: 'routine', label: 'Daily Routine', hint: 'Habits & rhythm', examinerPrompt: 'What does a typical day look like for you? Is your routine very different at the weekend?' },
    { id: 'leisure', label: 'Leisure & Hobbies', hint: 'Free time', examinerPrompt: 'How do you usually spend your free time? Why do these activities appeal to you?' },
    { id: 'weather', label: 'Weather & Seasons', hint: 'Climate', examinerPrompt: 'What is the weather like in your country? Which season do you enjoy the most and why?' },
];

const PART2_TOPICS: Part2Topic[] = [
    { id: 'journey', label: 'Describe a Memorable Journey', hint: 'Cue card', topic: 'a memorable journey you went on', prompts: ['where you went', 'who you went with', 'what you did there', 'and explain why it was memorable'] },
    { id: 'skill', label: 'Describe an Important Skill', hint: 'Cue card', topic: 'an important skill you learned', prompts: ['what the skill was', 'when and how you learned it', 'who taught or helped you', 'and explain why it is important'] },
    { id: 'book', label: 'Describe a Book You Enjoyed', hint: 'Cue card', topic: 'a book you enjoyed reading', prompts: ['what the book was', 'who wrote it', 'what it was about', 'and explain why you enjoyed it'] },
    { id: 'gadget', label: 'Describe a Technological Gadget', hint: 'Cue card', topic: 'a technological gadget you find useful', prompts: ['what the gadget is', 'how often you use it', 'what you use it for', 'and explain why it is useful'] },
];

const PART3_TOPICS: Part3Topic[] = [
    { id: 'ai', label: 'Future of Artificial Intelligence', hint: 'Abstract discussion', examinerPrompt: 'To what extent do you think artificial intelligence will change the way people work in the future?' },
    { id: 'tourism', label: 'Global Tourism Trends', hint: 'Society', examinerPrompt: 'Why has international tourism grown so rapidly, and what impact does it have on local cultures?' },
    { id: 'education', label: 'Education System Changes', hint: 'Institutions', examinerPrompt: 'How should school systems adapt to prepare students for a rapidly changing world?' },
    { id: 'environment', label: 'Environmental Conservation', hint: 'Responsibility', examinerPrompt: 'What role should individuals play in protecting the environment compared with governments?' },
];

// ─── Utility ────────────────────────────────────────────────────────────────

const formatClock = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

// ─── Icons ──────────────────────────────────────────────────────────────────

const ArrowLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

// ─── Main Component ─────────────────────────────────────────────────────────

const NewSpeakingExamRunner: React.FC<NewSpeakingExamRunnerProps> = ({
    userEmail,
    testTitle = 'Speaking Studio',
    onExit,
}) => {
    // ── Navigation State ──────────────────────────────────────────────────
    const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());

    // ── Recording State ───────────────────────────────────────────────────
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    // ── Timer ─────────────────────────────────────────────────────────────
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef<number | null>(null);

    // ── TTS Delay ─────────────────────────────────────────────────────────
    const [ttsDelayComplete, setTtsDelayComplete] = useState(false);

    // ── Audio Playback ────────────────────────────────────────────────────
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);
    const playbackIntervalRef = useRef<number | null>(null);

    // ── Timer Effect ──────────────────────────────────────────────────────
    useEffect(() => {
        timerRef.current = window.setInterval(() => setElapsed(e => e + 1), 1000);
        return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    }, []);

    // ── TTS Delay Effect (2s on each new question) ────────────────────────
    useEffect(() => {
        setRecordingState('listening');
        setTtsDelayComplete(false);
        setAudioBlob(null);
        setAudioUrl(null);
        setIsPlaying(false);
        setPlaybackTime(0);
        setPlaybackDuration(0);
        const timer = window.setTimeout(() => {
            setTtsDelayComplete(true);
            setRecordingState('ready');
        }, 2000);
        return () => window.clearTimeout(timer);
    }, [currentPart, questionIndex]);

    // ── Cleanup on unmount ────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            if (timerRef.current) window.clearInterval(timerRef.current);
            if (playbackIntervalRef.current) window.clearInterval(playbackIntervalRef.current);
        };
    }, []);

    // ── Recording Functions ───────────────────────────────────────────────
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
                stream.getTracks().forEach(t => t.stop());
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
    }, [audioUrl]);

    // ── Audio Playback Controls ───────────────────────────────────────────
    const togglePlayback = useCallback(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }, [isPlaying]);

    const handleTimeUpdate = useCallback(() => {
        if (audioRef.current) {
            setPlaybackTime(audioRef.current.currentTime);
        }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        if (audioRef.current) {
            setPlaybackDuration(audioRef.current.duration);
        }
    }, []);

    const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
    }, []);

    // ── Question/Part Navigation ──────────────────────────────────────────
    const isLastQuestionOfPart = () => {
        if (currentPart === 1) return questionIndex >= PART1_TOPICS.length - 1;
        if (currentPart === 2) return true;
        if (currentPart === 3) return questionIndex >= PART3_TOPICS.length - 1;
        return false;
    };

    const handleNext = useCallback(() => {
        if (isLastQuestionOfPart()) {
            setCompletedParts(prev => new Set(prev).add(currentPart));
            if (currentPart < 3) {
                setCurrentPart((currentPart + 1) as 1 | 2 | 3);
                setQuestionIndex(0);
            } else {
                onExit();
            }
        } else {
            setQuestionIndex(q => q + 1);
        }
    }, [currentPart, questionIndex, onExit]);

    const handlePrevious = useCallback(() => {
        if (questionIndex > 0) {
            setQuestionIndex(q => q - 1);
        } else if (currentPart > 1) {
            setCurrentPart((currentPart - 1) as 1 | 2 | 3);
            setQuestionIndex(0);
        }
    }, [currentPart, questionIndex]);

    // ── Current Question Data ─────────────────────────────────────────────
    const getQuestionText = () => {
        switch (currentPart) {
            case 1: return PART1_TOPICS[questionIndex]?.examinerPrompt || '';
            case 2: return PART2_TOPICS[0].topic;
            case 3: return PART3_TOPICS[questionIndex]?.examinerPrompt || '';
        }
    };

    const getQuestionCount = () => {
        switch (currentPart) {
            case 1: return PART1_TOPICS.length;
            case 2: return 1;
            case 3: return PART3_TOPICS.length;
        }
    };

    const questionText = getQuestionText();
    const questionCount = getQuestionCount();

    // ── Recording Flow (Shared) ───────────────────────────────────────────
    const renderRecordingFlow = () => (
        <div className="space-y-4">
            {/* Status indicator */}
            {recordingState === 'recording' && (
                <p className="text-rose-500 text-sm font-medium animate-pulse text-center">
                    🔴 Recording...
                </p>
            )}
            {recordingState === 'recorded' && (
                <p className="text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2">
                    ✓ Answer recorded
                </p>
            )}

            {/* Listen Again button (hidden during TTS delay and recording) */}
            {ttsDelayComplete && recordingState !== 'recording' && recordingState !== 'recorded' && (
                <div className="flex justify-center">
                    <button className="bg-[#1E1B4B]/80 hover:bg-[#1E1B4B] text-purple-300 border border-purple-800/40 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer">
                        🔊 Listen Again
                    </button>
                </div>
            )}

            {/* Main action button */}
            {!ttsDelayComplete && (
                <button
                    disabled
                    className="w-full bg-[#2A1B4E]/60 text-purple-400/60 cursor-not-allowed font-bold py-3.5 rounded-xl transition-all"
                >
                    🎙 Listen to question first
                </button>
            )}
            {ttsDelayComplete && recordingState === 'ready' && (
                <button
                    onClick={startRecording}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
                >
                    🎙 Start Recording
                </button>
            )}
            {recordingState === 'recording' && (
                <button
                    onClick={stopRecording}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
                >
                    ⏹ Stop Recording
                </button>
            )}

            {/* Audio Player (after recording) */}
            {recordingState === 'recorded' && audioUrl && (
                <div className="space-y-3">
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                    />
                    <div className="bg-[#0F0F12] border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
                        <button
                            onClick={togglePlayback}
                            className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shrink-0 transition-all"
                        >
                            {isPlaying ? (
                                <PauseIcon className="w-4 h-4" />
                            ) : (
                                <PlayIcon className="w-4 h-4 ml-0.5" />
                            )}
                        </button>
                        <span className="text-xs text-zinc-400 font-mono w-10">
                            {formatClock(Math.floor(playbackTime))}
                        </span>
                        <div
                            className="flex-1 h-1.5 bg-zinc-700 rounded-full cursor-pointer relative overflow-hidden"
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
                    <div className="flex justify-center">
                        <button
                            onClick={reRecord}
                            className="text-zinc-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                            🔄 Re-record
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // ── Part 2 Cue Card ───────────────────────────────────────────────────
    const renderCueCard = () => {
        if (currentPart !== 2) return null;
        const cue = PART2_TOPICS[0];
        return (
            <div className="bg-[#18112C] border border-purple-900/40 rounded-2xl p-6 text-left mb-6">
                <span className="text-purple-400 text-xs font-bold tracking-wider uppercase">
                    📖 CUE CARD
                </span>
                <h3 className="text-white text-lg font-bold mt-2">
                    Describe {cue.topic}
                </h3>
                <div className="text-zinc-300 text-sm space-y-1 mt-3">
                    <p>You should say:</p>
                    {cue.prompts.map((p, i) => (
                        <p key={i}>• {p}</p>
                    ))}
                </div>
                <p className="text-zinc-400 text-xs mt-4">Speak for 1–2 minutes.</p>
            </div>
        );
    };

    // ── Part Label ────────────────────────────────────────────────────────
    const getPartLabel = () => {
        switch (currentPart) {
            case 1: return 'PART 1';
            case 2: return 'PART 2';
            case 3: return 'PART 3';
        }
    };

    const getPartSubtitle = () => {
        switch (currentPart) {
            case 1: return 'Interview — Personal questions';
            case 2: return 'Long Turn — Cue card';
            case 3: return 'Discussion — Abstract questions';
        }
    };

    return (
        <div className="h-full bg-[#0B0C0E] flex flex-col overflow-hidden text-white font-sans">
            {/* ── Sticky Header Bar ──────────────────────────────────────── */}
            <div className="shrink-0 bg-[#0B0C0E] border-b border-zinc-800 px-6 py-3 flex items-center justify-between z-50">
                {/* Left: Exit */}
                <button
                    onClick={onExit}
                    className="text-zinc-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Exit
                </button>

                {/* Center: Part pills */}
                <div className="flex items-center gap-2">
                    {[1, 2, 3].map(part => {
                        const isActive = currentPart === part;
                        const isCompleted = completedParts.has(part);
                        return (
                            <span
                                key={part}
                                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                                    isActive
                                        ? 'bg-purple-600 text-white'
                                        : isCompleted
                                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                                        : 'bg-zinc-800/60 text-zinc-400'
                                }`}
                            >
                                {isCompleted && '✓ '}Part {part}
                            </span>
                        );
                    })}
                </div>

                {/* Right: Timer */}
                <div className="flex items-center gap-2 text-zinc-300 font-mono text-sm">
                    <ClockIcon className="w-4 h-4" />
                    {formatClock(elapsed)}
                </div>
            </div>

            {/* ── Main Content ───────────────────────────────────────────── */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-6 py-8">
                    {/* Part Header */}
                    <div className="mb-6">
                        <span className="text-purple-400 text-xs font-mono tracking-wider font-semibold uppercase">
                            {getPartLabel()}
                        </span>
                        <p className="text-zinc-500 text-xs mt-1">{getPartSubtitle()}</p>
                    </div>

                    {/* Question Counter */}
                    {currentPart !== 2 && (
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-zinc-600 text-xs font-medium">
                                Question {questionIndex + 1} of {questionCount}
                            </span>
                            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-600 rounded-full transition-all"
                                    style={{ width: `${((questionIndex + 1) / questionCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Question / Cue Card */}
                    {currentPart === 2 ? (
                        renderCueCard()
                    ) : (
                        <div className="bg-[#18112C] border border-purple-900/40 rounded-2xl p-6 mb-6">
                            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                                Examiner Question
                            </p>
                            <p className="text-white text-lg font-medium leading-relaxed">
                                {questionText}
                            </p>
                        </div>
                    )}

                    {/* Recording Flow */}
                    {renderRecordingFlow()}
                </div>
            </div>

            {/* ── Bottom Navigation Bar ──────────────────────────────────── */}
            <div className="shrink-0 bg-[#0B0C0E] border-t border-zinc-800 px-6 py-3 flex items-center justify-between z-50">
                <button
                    onClick={handlePrevious}
                    disabled={currentPart === 1 && questionIndex === 0}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    &lt; Previous
                </button>
                <button
                    onClick={handleNext}
                    className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-purple-500 transition-all text-sm shadow-lg"
                >
                    {isLastQuestionOfPart() ? '✓ Finish Part' : 'Next >'}
                </button>
            </div>
        </div>
    );
};

export default NewSpeakingExamRunner;

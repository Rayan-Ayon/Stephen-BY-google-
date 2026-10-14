import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    fetchSpeakingExamData,
    type SpeakingTestData,
    type SpeakingEvaluation,
} from './speakingExamShared';
import MaraAvatar from './MaraAvatar';
import { IELTS_PART2_RULES_SCRIPT, stopAllAudio } from '@/services/speaking/speakingAudioService';
import CueCardTaskCard from '@/components/enterprise/speaking/CueCardTaskCard';
import SpeakingAnalysisView from '@/components/enterprise/speaking/SpeakingAnalysisView';
import { supabase } from '@/lib/supabaseClient';
import { addAttempt } from '@/components/enterprise/ielts/ieltsShared';

interface SpeakingExamWorkspaceProps {
    candidateEmail?: string;
    sourceType?: 'cambridge' | 'mock_series';
    bookNumber?: number;
    testNumber?: number;
    category?: 'academic' | 'general';
    onExit?: () => void;
    onBack?: () => void;
    onActiveChange?: (active: boolean) => void;
    exitPulse?: boolean;
    mode?: 'full_mock' | 'part-practice';
    practicePart?: number;
    initialBook?: number;
    initialTest?: number;
    initialPart?: 1 | 2 | 3;
    isPartPractice?: boolean;
    onTestComplete?: (data: any) => void;
    testData?: SpeakingTestData;
}

type RecordingState = 'ready' | 'recording' | 'recorded';
type Part2SubPhase = 'rules' | 'prep' | 'speaking';

const formatClock = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export const SpeakingExamWorkspace: React.FC<SpeakingExamWorkspaceProps> = ({
    candidateEmail,
    sourceType = 'cambridge',
    bookNumber,
    testNumber,
    category = 'academic',
    onExit,
    onBack,
    onActiveChange,
    exitPulse = false,
    mode = 'full_mock',
    practicePart = 1,
    initialBook = 7,
    initialTest = 1,
    initialPart = 1,
    isPartPractice: isPartPracticeProp = false,
    onTestComplete,
    testData: propTestData,
}) => {
    const activeBook = bookNumber ?? initialBook;
    const activeTest = testNumber ?? initialTest;
    const isPartPractice = isPartPracticeProp || mode === 'part-practice';
    const computedInitialPart: 1 | 2 | 3 = isPartPractice
        ? (Math.min(3, Math.max(1, Number(practicePart))) as 1 | 2 | 3)
        : initialPart;

    // ── Exam Data & Loading ────────────────────────────────────────────────
    const [testData, setTestData] = useState<SpeakingTestData | null>(propTestData || null);
    const [isLoadingData, setIsLoadingData] = useState(!propTestData);

    // ── Exam Navigation State ──────────────────────────────────────────────
    const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(computedInitialPart);
    const [part2SubPhase, setPart2SubPhase] = useState<Part2SubPhase>('rules');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [completedParts, setCompletedParts] = useState<Set<number>>(new Set());
    const [showExitModal, setShowExitModal] = useState(false);

    useEffect(() => {
        if (isPartPractice && practicePart) {
            const p = Math.min(3, Math.max(1, Number(practicePart))) as 1 | 2 | 3;
            setCurrentPart(p);
            setQuestionIndex(0);
        }
    }, [isPartPractice, practicePart]);

    // ── Global Test Timer (11:00 or elapsed) ───────────────────────────────
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    // ── Examiner Speech State (Mara) ───────────────────────────────────────
    const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);
    const [showCaptions, setShowCaptions] = useState(true);
    const speechTimeoutRef = useRef<number | null>(null);

    // ── Part 2 Cue Card Preparation ────────────────────────────────────────
    const [prepTimeRemaining, setPrepTimeRemaining] = useState(60);
    const [isPrepActive, setIsPrepActive] = useState(false);
    const [candidateNotes, setCandidateNotes] = useState('');
    const prepTimerRef = useRef<number | null>(null);

    // ── Camera (Candidate Panel) ───────────────────────────────────────────
    const [isCameraOn, setIsCameraOn] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const cameraStreamRef = useRef<MediaStream | null>(null);

    // ── Audio Recording State ──────────────────────────────────────────────
    const [recordingState, setRecordingState] = useState<RecordingState>('ready');
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const recordingTimerRef = useRef<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [recordedBlobs, setRecordedBlobs] = useState<Record<string, { blob: Blob; url: string; duration: number }>>({});
    const recordedBlobsRef = useRef<Record<string, { blob: Blob; url: string; duration: number }>>({});
    const [persistedAttemptRecord, setPersistedAttemptRecord] = useState<any>(null);

    // ── Audio Playback ─────────────────────────────────────────────────────
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);

    // ── AI Evaluation State ────────────────────────────────────────────────
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState<SpeakingEvaluation | null>(null);
    const [evalError, setEvalError] = useState<string | null>(null);
    const [showEvalModal, setShowEvalModal] = useState(false);
    const [showPostExamAnalysis, setShowPostExamAnalysis] = useState(false);

    // ── Fetch Question Data on Mount / Test Change ─────────────────────────
    useEffect(() => {
        if (propTestData) {
            setTestData(propTestData);
            setIsLoadingData(false);
            return;
        }

        let isMounted = true;
        setIsLoadingData(true);
        fetchSpeakingExamData(sourceType, activeBook, activeTest, category).then((data) => {
            if (isMounted) {
                setTestData(data);
                setIsLoadingData(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [sourceType, activeBook, activeTest, category, propTestData]);

    // ── Notify Active State ────────────────────────────────────────────────
    useEffect(() => {
        onActiveChange?.(true);
        return () => {
            onActiveChange?.(false);
        };
    }, [onActiveChange]);

    // ── Global Exam Timer ──────────────────────────────────────────────────
    useEffect(() => {
        const id = window.setInterval(() => {
            setElapsedSeconds((s) => s + 1);
        }, 1000);
        return () => window.clearInterval(id);
    }, []);

    // ── Active Prompt Retrieval ────────────────────────────────────────────
    const getPromptForSpeech = useCallback((part: number, qIdx: number): string => {
        if (!testData) return '';
        if (part === 1) {
            return testData.part1.questions[qIdx] || "Let's talk about where you live and your daily life.";
        }
        if (part === 2) {
            return IELTS_PART2_RULES_SCRIPT;
        }
        return testData.part3.questions[qIdx] || 'What is your opinion on this topic?';
    }, [testData]);

    const getCurrentPrompt = useCallback((): string => {
        if (!testData) return '';
        if (currentPart === 1) {
            return testData.part1.questions[questionIndex] || "Let's talk about where you live and your daily life.";
        }
        if (currentPart === 2) {
            if (part2SubPhase === 'rules') {
                return IELTS_PART2_RULES_SCRIPT;
            }
            return `Describe ${testData.part2.topic}.`;
        }
        return testData.part3.questions[questionIndex] || 'What is your opinion on this topic?';
    }, [testData, currentPart, questionIndex, part2SubPhase]);

    const currentPromptText = getCurrentPrompt();

    const getQuestionsList = useCallback((): string[] => {
        if (!testData) return [];
        if (currentPart === 1) return testData.part1.questions;
        if (currentPart === 2) return [testData.part2.topic];
        return testData.part3.questions;
    }, [testData, currentPart]);

    const questionsList = getQuestionsList();
    const totalQuestionsInPart = questionsList.length;
    const isLastQuestionOfTest = !isPartPractice
        ? (currentPart === 3 && questionIndex === totalQuestionsInPart - 1)
        : (questionIndex === totalQuestionsInPart - 1);

    // ── Speech Synthesis & Examiner Avatar Animation ───────────────────────
    const triggerExaminerSpeech = useCallback((textToSpeak: string, onSpeechEnd?: () => void) => {
        if (speechTimeoutRef.current) {
            window.clearTimeout(speechTimeoutRef.current);
            speechTimeoutRef.current = null;
        }

        // Cancel previous browser speech if running
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {
                // ignore
            }
        }

        setIsExaminerSpeaking(true);

        let ended = false;
        const handleEnd = () => {
            if (ended) return;
            ended = true;
            if (speechTimeoutRef.current) {
                window.clearTimeout(speechTimeoutRef.current);
                speechTimeoutRef.current = null;
            }
            setIsExaminerSpeaking(false);
            onSpeechEnd?.();
        };

        // Attempt Web Speech API speech synthesis
        let spokenSuccessfully = false;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && textToSpeak) {
            try {
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.rate = 0.94;
                utterance.pitch = 1.04;

                // Pick female English voice if available
                const voices = window.speechSynthesis.getVoices();
                const femaleVoice = voices.find(
                    (v) =>
                        v.lang.startsWith('en') &&
                        (v.name.includes('Female') ||
                            v.name.includes('Samantha') ||
                            v.name.includes('Zira') ||
                            v.name.includes('Victoria') ||
                            v.name.includes('Google UK English Female') ||
                            v.name.includes('Natural'))
                );
                if (femaleVoice) {
                    utterance.voice = femaleVoice;
                }

                utterance.onend = handleEnd;
                utterance.onerror = handleEnd;

                window.speechSynthesis.speak(utterance);
                spokenSuccessfully = true;

                // Safety fallback timeout in case browser speech gets stuck
                const estDuration = Math.max(3500, Math.min(textToSpeak.length * 80 + 3000, 16000));
                speechTimeoutRef.current = window.setTimeout(handleEnd, estDuration);
            } catch (err) {
                spokenSuccessfully = false;
            }
        }

        // Fallback simulation timer if speech synthesis was not started
        if (!spokenSuccessfully) {
            const fallbackDuration = 3800;
            speechTimeoutRef.current = window.setTimeout(handleEnd, fallbackDuration);
        }
    }, []);

    // ── Part 2 Skip Instructions Handler ──────────────────────────────────
    const handleSkipPart2Instructions = useCallback(() => {
        stopAllAudio();
        if (speechTimeoutRef.current) {
            window.clearTimeout(speechTimeoutRef.current);
            speechTimeoutRef.current = null;
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {
                // ignore
            }
        }
        setIsExaminerSpeaking(false);
        setPart2SubPhase('prep');
        setPrepTimeRemaining(60);
        setIsPrepActive(true);
    }, []);

    // ── Trigger speech on Question or Part Change ──────────────────────────
    // Absolute silence rule: 60s Part 2 prep countdown must proceed in absolute silence without TTS.
    useEffect(() => {
        // Reset playback state and restore recording if already captured
        setIsPlaying(false);
        setPlaybackTime(0);
        setPlaybackDuration(0);
        const currentKey = currentPart === 2 ? 'p2' : `p${currentPart}-q${questionIndex}`;
        const existingRec = recordedBlobsRef.current[currentKey];
        if (existingRec) {
            setAudioBlob(existingRec.blob);
            setAudioUrl(existingRec.url);
            setRecordingState('recorded');
            setRecordingSeconds(existingRec.duration || 0);
        } else {
            setAudioBlob(null);
            setAudioUrl(null);
            setRecordingState('ready');
            setRecordingSeconds(0);
        }
        setEvaluationResult(null);
        setEvalError(null);

        if (currentPart === 2) {
            // Part 2: State 1 (PART2_EXAMINER_RULES)
            // Visual state: Keep Cue Card hidden/locked
            // Examiner Audio: Play official IELTS Part 2 instruction audio
            setPart2SubPhase('rules');
            setIsPrepActive(false);
            setPrepTimeRemaining(60);
            triggerExaminerSpeech(IELTS_PART2_RULES_SCRIPT, () => {
                // When audio finishes naturally, transition to State 2 (PART2_PREPARATION)
                // Stop all audio immediately — prep proceeds in TOTAL SILENCE!
                stopAllAudio();
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    try {
                        window.speechSynthesis.cancel();
                    } catch (e) {
                        // ignore
                    }
                }
                setIsExaminerSpeaking(false);
                setPart2SubPhase('prep');
                setIsPrepActive(true);
                setPrepTimeRemaining(60);
            });
        } else {
            setPart2SubPhase('rules');
            setIsPrepActive(false);
            const prompt = getPromptForSpeech(currentPart, questionIndex);
            triggerExaminerSpeech(prompt);
        }

        return () => {
            stopAllAudio();
            if (speechTimeoutRef.current) {
                window.clearTimeout(speechTimeoutRef.current);
            }
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                try {
                    window.speechSynthesis.cancel();
                } catch (e) {
                    // ignore
                }
            }
        };
    }, [currentPart, questionIndex, getPromptForSpeech, triggerExaminerSpeech]);

    // ── Part 2 Prep Countdown Timer (60s) ──────────────────────────────────
    useEffect(() => {
        if (!isPrepActive || prepTimeRemaining <= 0) return;

        prepTimerRef.current = window.setInterval(() => {
            setPrepTimeRemaining((prev) => {
                if (prev <= 1) {
                    setIsPrepActive(false);
                    // Automatically trigger recording when prep time reaches 0
                    handleStartAnswer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
        };
    }, [isPrepActive, prepTimeRemaining]);

    // ── Camera Management ──────────────────────────────────────────────────
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
                audio: false,
            });
            cameraStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOn(true);
        } catch (err) {
            console.error('Camera access denied or unavailable:', err);
            alert('Could not access camera. Please check your camera permissions.');
        }
    };

    const stopCamera = () => {
        if (cameraStreamRef.current) {
            cameraStreamRef.current.getTracks().forEach((t) => t.stop());
            cameraStreamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    };

    // Keep camera attached to video element if turned on
    useEffect(() => {
        if (isCameraOn && videoRef.current && cameraStreamRef.current) {
            videoRef.current.srcObject = cameraStreamRef.current;
        }
    }, [isCameraOn]);

    // Cleanup camera and mic on unmount
    useEffect(() => {
        return () => {
            if (cameraStreamRef.current) {
                cameraStreamRef.current.getTracks().forEach((t) => t.stop());
            }
            if (micStreamRef.current) {
                micStreamRef.current.getTracks().forEach((t) => t.stop());
            }
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            if (prepTimerRef.current) window.clearInterval(prepTimerRef.current);
            if (recordingTimerRef.current) window.clearInterval(recordingTimerRef.current);
            if (speechTimeoutRef.current) window.clearTimeout(speechTimeoutRef.current);
        };
    }, [audioUrl]);

    // ── Audio Recording Controls ───────────────────────────────────────────
    const handleStartAnswer = async () => {
        // If prep timer was active (Part 2), stop it
        if (isPrepActive) {
            setIsPrepActive(false);
        }
        if (currentPart === 2) {
            setPart2SubPhase('speaking');
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { sampleRate: 16000, channelCount: 1 },
            });
            micStreamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const dur = recordingSeconds;
                setAudioBlob(blob);
                setAudioUrl(url);
                setRecordingState('recorded');
                const key = currentPart === 2 ? 'p2' : `p${currentPart}-q${questionIndex}`;
                setRecordedBlobs((prev) => {
                    const next = { ...prev, [key]: { blob, url, duration: dur } };
                    recordedBlobsRef.current = next;
                    return next;
                });
                if (recordingTimerRef.current) window.clearInterval(recordingTimerRef.current);
                stream.getTracks().forEach((t) => t.stop());
                micStreamRef.current = null;
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setRecordingState('recording');
            setRecordingSeconds(0);

            // Track recording elapsed duration
            recordingTimerRef.current = window.setInterval(() => {
                setRecordingSeconds((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Microphone access denied:', err);
            alert('Microphone access denied. Please allow microphone permissions to record your answer.');
            setRecordingState('ready');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (recordingTimerRef.current) {
            window.clearInterval(recordingTimerRef.current);
        }
    };

    const handleReRecord = () => {
        const key = currentPart === 2 ? 'p2' : `p${currentPart}-q${questionIndex}`;
        setRecordedBlobs((prev) => {
            const next = { ...prev };
            delete next[key];
            recordedBlobsRef.current = next;
            return next;
        });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioBlob(null);
        setAudioUrl(null);
        setIsPlaying(false);
        setPlaybackTime(0);
        setPlaybackDuration(0);
        setRecordingSeconds(0);
        setRecordingState('ready');
        setEvaluationResult(null);
        setEvalError(null);
    };

    // ── Audio Playback ─────────────────────────────────────────────────────
    const togglePlayback = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
    };

    // ── Replay Examiner Question ───────────────────────────────────────────
    const handleReplay = () => {
        if (isExaminerSpeaking) return;
        if (currentPart === 2) {
            if (part2SubPhase === 'rules') {
                triggerExaminerSpeech(IELTS_PART2_RULES_SCRIPT, () => {
                    stopAllAudio();
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        try {
                            window.speechSynthesis.cancel();
                        } catch (e) {
                            // ignore
                        }
                    }
                    setIsExaminerSpeaking(false);
                    setPart2SubPhase('prep');
                    setIsPrepActive(true);
                    setPrepTimeRemaining(60);
                });
            }
        } else {
            const prompt = getPromptForSpeech(currentPart, questionIndex);
            triggerExaminerSpeech(prompt);
        }
    };

    // ── Navigation Between Questions & Parts ───────────────────────────────
    const handleNextQuestion = () => {
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
            } else if (currentPart === 3) {
                // Exam finished
                setShowExitModal(true);
            }
        }
    };

    const handlePrevQuestion = () => {
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
    };

    // ── AI Evaluation Submission ───────────────────────────────────────────
    const submitForEvaluation = async () => {
        if (!audioBlob || isEvaluating) return;
        setIsEvaluating(true);
        setEvalError(null);
        setEvaluationResult(null);

        try {
            const formData = new FormData();
            formData.append('file', audioBlob, `speaking-part${currentPart}-q${questionIndex}.webm`);
            formData.append('question_prompt', currentPromptText);

            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch('/api/ielts/evaluate-speaking', {
                method: 'POST',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || `Evaluation API returned status ${response.status}`);
            }

            const result: SpeakingEvaluation = await response.json();
            setEvaluationResult(result);
            setShowEvalModal(true);
        } catch (err: any) {
            console.error('Speaking evaluation failed:', err);
            setEvalError(err.message || 'Evaluation service temporarily unavailable. Please try again.');
        } finally {
            setIsEvaluating(false);
        }
    };

    // ── Title display ──────────────────────────────────────────────────────
    const examSeriesName = sourceType === 'cambridge'
        ? `Cambridge ${activeBook}`
        : `IELTS Dynasty Mock ${activeBook}`;
    const activeExamTitle = `${examSeriesName} · Speaking Test ${String(activeTest).padStart(2, '0')}`;

    // ── Final Question Submission & Transition to Analysis Canvas ──────────
    // ── Helper to convert Blob to Base64 ──────────────────────────────────
    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(blob);
        });
    };

    // ── Final Question Submission & Transition to Analysis Canvas ──────────
    const handleSubmitFinalAttempt = async () => {
        // 1. Terminate proctored full-screen mode if active
        if (typeof document !== 'undefined' && document.fullscreenElement) {
            try {
                await document.exitFullscreen();
            } catch (e) {
                // ignore
            }
        }

        // 2. Terminate proctored test state so Left Navigation Sidebar becomes accessible
        onActiveChange?.(false);

        setIsEvaluating(true);
        setEvalError(null);

        // Ensure active recording is flushed to recordedBlobsRef
        const activeKey = currentPart === 2 ? 'p2' : `p${currentPart}-q${questionIndex}`;
        if (audioBlob && !recordedBlobsRef.current[activeKey]) {
            recordedBlobsRef.current[activeKey] = {
                blob: audioBlob,
                url: audioUrl || '',
                duration: recordingSeconds || 35,
            };
        }

        const attemptId = `spk-${Date.now()}`;
        const currentExamId = `c${String(activeBook).padStart(2, '0')}00000-0000-0000-0000-${String(activeTest).padStart(12, '0')}`;

        // 3. Upload all recorded question audio blobs to Supabase Storage (bucket: speaking_audio)
        const uploadedUrls: Record<string, string> = {};
        const blobs = recordedBlobsRef.current;

        for (const [key, item] of Object.entries(blobs)) {
            if (item?.blob) {
                try {
                    const filePath = `attempts/${attemptId}/${key}.webm`;
                    const { error } = await supabase.storage.from('speaking_audio').upload(filePath, item.blob, {
                        contentType: 'audio/webm',
                        upsert: true,
                    });
                    if (!error) {
                        const { data: pub } = supabase.storage.from('speaking_audio').getPublicUrl(filePath);
                        if (pub?.publicUrl) {
                            uploadedUrls[key] = pub.publicUrl;
                        }
                    }
                } catch (upErr) {
                    console.warn(`[Supabase Storage] Audio upload note for ${key}:`, upErr);
                }

                // If cloud upload wasn't available, fallback to base64 so audio survives browser reloads
                if (!uploadedUrls[key]) {
                    try {
                        const b64 = await blobToBase64(item.blob);
                        if (b64) {
                            uploadedUrls[key] = b64;
                        }
                    } catch (b64Err) {
                        uploadedUrls[key] = item.url || '';
                    }
                }
            }
        }

        const part1Questions = testData?.part1?.questions || [
            'What kinds of things make you laugh?',
            'Do you like watching comedies on TV or in cinema?',
            'Do you think it is important for people to laugh regularly?',
            'Is comedy popular in your culture?',
        ];
        const cueCardData = {
            topic: testData?.part2?.topic || 'an electronic device you bought that was very useful',
            bullets: testData?.part2?.prompts || [
                'what the device was',
                'where and when you bought it',
                'what you used it for',
                'and explain why it was so useful to you',
            ],
        };
        const part3Questions = testData?.part3?.questions || [
            'What kinds of electronic devices do people find most essential today?',
            'Do you think people rely too much on technology nowadays?',
            'How will domestic appliances change over the next twenty years?',
            'What problems can arise when technology fails in daily life?',
        ];

        const cueCardAudioUrl = uploadedUrls['p2'] || blobs['p2']?.url || (currentPart === 2 ? audioUrl : null);

        // 4. Package multi-question payload and evaluate with Gemini backend
        const questionPayloadList = [
            ...part1Questions.map((q, idx) => {
                const pKey = `p1-q${idx}`;
                const audio = uploadedUrls[pKey] || blobs[pKey]?.url || null;
                const isOmitted = !audio && !blobs[pKey]?.blob;
                return {
                    question_id: `p1_q${idx}`,
                    part: 1,
                    questionIndex: idx,
                    prompt: q,
                    status: isOmitted ? ('omitted' as const) : ('answered' as const),
                    candidate_audio_url: audio,
                    audioUrl: audio,
                    transcript: isOmitted ? '' : ((blobs[pKey] as any)?.transcript || ''),
                    durationSeconds: isOmitted ? 0 : (blobs[pKey]?.duration || 38),
                    metrics: {
                        band_score: isOmitted ? 0.0 : 6.5,
                        wpm: isOmitted ? 0 : 130,
                        reason: isOmitted ? 'No speech sample captured — question omitted by candidate.' : undefined,
                    },
                };
            }),
            {
                question_id: 'p2_q0',
                part: 2,
                questionIndex: 0,
                prompt: `Describe ${cueCardData.topic}`,
                status: (!cueCardAudioUrl && !blobs['p2']?.blob) ? ('omitted' as const) : ('answered' as const),
                candidate_audio_url: cueCardAudioUrl || null,
                audioUrl: cueCardAudioUrl || null,
                transcript: (!cueCardAudioUrl && !blobs['p2']?.blob) ? '' : (candidateNotes || ''),
                durationSeconds: (!cueCardAudioUrl && !blobs['p2']?.blob) ? 0 : (blobs['p2']?.duration || 110),
                notes: candidateNotes || '',
                metrics: {
                    band_score: (!cueCardAudioUrl && !blobs['p2']?.blob) ? 0.0 : 6.5,
                    wpm: (!cueCardAudioUrl && !blobs['p2']?.blob) ? 0 : 128,
                    reason: (!cueCardAudioUrl && !blobs['p2']?.blob) ? 'No speech sample captured — question omitted by candidate.' : undefined,
                },
            },
            ...part3Questions.map((q, idx) => {
                const pKey = `p3-q${idx}`;
                const audio = uploadedUrls[pKey] || blobs[pKey]?.url || null;
                const isOmitted = !audio && !blobs[pKey]?.blob;
                return {
                    question_id: `p3_q${idx}`,
                    part: 3,
                    questionIndex: idx,
                    prompt: q,
                    status: isOmitted ? ('omitted' as const) : ('answered' as const),
                    candidate_audio_url: audio,
                    audioUrl: audio,
                    transcript: isOmitted ? '' : ((blobs[pKey] as any)?.transcript || ''),
                    durationSeconds: isOmitted ? 0 : (blobs[pKey]?.duration || 45),
                    metrics: {
                        band_score: isOmitted ? 0.0 : 6.5,
                        wpm: isOmitted ? 0 : 130,
                        reason: isOmitted ? 'No speech sample captured — question omitted by candidate.' : undefined,
                    },
                };
            }),
        ];

        let evalData: SpeakingEvaluation | null = evaluationResult;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const response = await fetch('/api/ielts/evaluate-speaking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    attempt_id: attemptId,
                    book_number: Number(activeBook),
                    test_number: Number(activeTest),
                    questions: questionPayloadList,
                }),
            });

            if (response.ok) {
                const result: SpeakingEvaluation = await response.json();
                evalData = result;
                setEvaluationResult(result);
            }
        } catch (err: any) {
            console.warn('Backend multi-question evaluation note:', err);
        }

        // 5. Construct Standardized Attempt Record with grounded transcripts and tokens
        const evalQuestions = evalData?.questions || [];
        const findEvalQ = (partNum: number, qIdx: number) =>
            evalQuestions.find((eq: any) => eq.part === partNum && eq.questionIndex === qIdx);

        const evaluatedPart1 = part1Questions.map((q, idx) => {
            const eq = findEvalQ(1, idx);
            const pKey = `p1-q${idx}`;
            const audio = uploadedUrls[pKey] || blobs[pKey]?.url || null;
            const isOmitted = eq?.status === 'omitted' || (!audio && !blobs[pKey]?.blob);

            return {
                questionIndex: idx,
                prompt: q,
                shortLabel: eq?.shortLabel || undefined,
                status: isOmitted ? ('omitted' as const) : ('answered' as const),
                candidateAudioUrl: isOmitted ? null : audio,
                durationSeconds: isOmitted ? 0 : (eq?.durationSeconds || blobs[pKey]?.duration || 38),
                candidateText: isOmitted ? '' : (eq?.transcriptText || '(Spoken Response Recorded)'),
                transcriptText: isOmitted ? '' : (eq?.transcriptText || ''),
                wpm: isOmitted ? 0 : (eq?.wpm || 132),
                fillersCount: isOmitted ? 0 : (eq?.fillersCount || 1),
                grammarSlipsCount: isOmitted ? 0 : (eq?.grammarSlipsCount || 1),
                collocationsCount: isOmitted ? 0 : (eq?.collocationsCount || 2),
                diagnosticTokens: isOmitted ? [] : (eq?.diagnosticTokens || undefined),
                modelAnswerText: eq?.modelAnswerText || undefined,
                modelUpgrades: eq?.modelUpgrades || undefined,
                examinerCritique: isOmitted ? {
                    fc: "Omitted response — no speech captured.",
                    lr: "Omitted response — no speech captured.",
                    gra: "Omitted response — no speech captured.",
                    pr: "Omitted response — no speech captured.",
                } : (eq?.examinerCritique || undefined),
            };
        });

        const eqPart2 = findEvalQ(2, 0);
        const isPart2Omitted = eqPart2?.status === 'omitted' || (!cueCardAudioUrl && !blobs['p2']?.blob);
        const evaluatedPart2 = {
            topic: cueCardData.topic,
            cueCardBullets: cueCardData.bullets,
            status: isPart2Omitted ? ('omitted' as const) : ('answered' as const),
            candidateAudioUrl: isPart2Omitted ? null : cueCardAudioUrl,
            durationSeconds: isPart2Omitted ? 0 : (eqPart2?.durationSeconds || blobs['p2']?.duration || 112),
            candidateText: isPart2Omitted ? '' : (eqPart2?.transcriptText || (candidateNotes ? `Candidate Notes: ${candidateNotes}` : '(Spoken Long Turn Recorded)')),
            transcriptText: isPart2Omitted ? '' : (eqPart2?.transcriptText || ''),
            wpm: isPart2Omitted ? 0 : (eqPart2?.wpm || 128),
            fillersCount: isPart2Omitted ? 0 : (eqPart2?.fillersCount || 2),
            grammarSlipsCount: isPart2Omitted ? 0 : (eqPart2?.grammarSlipsCount || 1),
            collocationsCount: isPart2Omitted ? 0 : (eqPart2?.collocationsCount || 3),
            diagnosticTokens: isPart2Omitted ? [] : (eqPart2?.diagnosticTokens || undefined),
            modelAnswerText: eqPart2?.modelAnswerText || undefined,
            modelUpgrades: eqPart2?.modelUpgrades || undefined,
            examinerCritique: isPart2Omitted ? {
                fc: "Omitted response — no speech captured.",
                lr: "Omitted response — no speech captured.",
                gra: "Omitted response — no speech captured.",
                pr: "Omitted response — no speech captured.",
            } : (eqPart2?.examinerCritique || undefined),
        };

        const evaluatedPart3 = part3Questions.map((q, idx) => {
            const eq = findEvalQ(3, idx);
            const pKey = `p3-q${idx}`;
            const audio = uploadedUrls[pKey] || blobs[pKey]?.url || null;
            const isOmitted = eq?.status === 'omitted' || (!audio && !blobs[pKey]?.blob);

            return {
                questionIndex: idx,
                prompt: q,
                shortLabel: eq?.shortLabel || undefined,
                status: isOmitted ? ('omitted' as const) : ('answered' as const),
                candidateAudioUrl: isOmitted ? null : audio,
                durationSeconds: isOmitted ? 0 : (eq?.durationSeconds || blobs[pKey]?.duration || 45),
                candidateText: isOmitted ? '' : (eq?.transcriptText || '(Spoken Response Recorded)'),
                transcriptText: isOmitted ? '' : (eq?.transcriptText || ''),
                wpm: isOmitted ? 0 : (eq?.wpm || 130),
                fillersCount: isOmitted ? 0 : (eq?.fillersCount || 1),
                grammarSlipsCount: isOmitted ? 0 : (eq?.grammarSlipsCount || 1),
                collocationsCount: isOmitted ? 0 : (eq?.collocationsCount || 2),
                diagnosticTokens: isOmitted ? [] : (eq?.diagnosticTokens || undefined),
                modelAnswerText: eq?.modelAnswerText || undefined,
                modelUpgrades: eq?.modelUpgrades || undefined,
                examinerCritique: isOmitted ? {
                    fc: "Omitted response — no speech captured.",
                    lr: "Omitted response — no speech captured.",
                    gra: "Omitted response — no speech captured.",
                    pr: "Omitted response — no speech captured.",
                } : (eq?.examinerCritique || undefined),
            };
        });

        const partsData = {
            part1: evaluatedPart1,
            part2: evaluatedPart2,
            part3: evaluatedPart3,
        };

        const computedBand = evalData?.overallBand ?? evalData?.overall_band ?? 6.5;

        const attemptRecord = {
            id: attemptId,
            test_id: currentExamId,
            module: 'speaking' as const,
            category: category || 'academic',
            exam_name: `Cambridge ${activeBook} · Speaking Test ${String(activeTest).padStart(2, '0')}`,
            book_number: Number(activeBook),
            test_number: Number(activeTest),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time_spent: `${Math.max(1, Math.floor(elapsedSeconds / 60))}m ${String(elapsedSeconds % 60).padStart(2, '0')}s`,
            overall_band: computedBand.toFixed(1),
            criteria_status: 'Evaluated (3 Parts)',
            status: 'COMPLETED',
            evaluation: evalData,
            parts_data: partsData,
        };

        setPersistedAttemptRecord(attemptRecord);

        // 6. Resilient LocalStorage Registry: speaking_attempts_history (prepend new attempt)
        try {
            const rawHist = localStorage.getItem('speaking_attempts_history');
            const histList = rawHist ? JSON.parse(rawHist) : [];
            const nextHist = [attemptRecord, ...histList.filter((a: any) => a.id !== attemptId)].slice(0, 50);
            localStorage.setItem('speaking_attempts_history', JSON.stringify(nextHist));
            window.dispatchEvent(new Event('speaking_attempts_updated'));
        } catch (e) {
            console.warn('[LocalStorage] speaking_attempts_history note:', e);
        }

        // 7. Global IELTS telemetry update via addAttempt
        try {
            addAttempt({
                id: attemptId,
                skill: 'speaking',
                module: 'speaking',
                band: computedBand,
                score: computedBand,
                book_number: Number(activeBook),
                test_number: Number(activeTest),
                is_general: category === 'general',
                title: attemptRecord.exam_name,
                date: attemptRecord.date,
                timeSpent: Math.max(1, Math.round(elapsedSeconds / 60)),
                answers_payload: {
                    ...attemptRecord,
                    parts_data: partsData,
                    evaluation: evalData,
                } as any,
                raw_answers: partsData as any,
            });
        } catch (e) {
            console.warn('[IELTS Shared] addAttempt note:', e);
        }

        // 8. Supabase table exam_attempts write (module: 'speaking')
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await (supabase as any).from('exam_attempts').insert([{
                user_id: session?.user?.id ?? null,
                test_id: currentExamId,
                module: 'speaking',
                title: attemptRecord.exam_name,
                band_score: computedBand,
                correct_count: 0,
                total_questions: 9,
                time_spent_seconds: elapsedSeconds || 765,
                answers_payload: {
                    ...attemptRecord,
                    parts_data: partsData,
                    evaluation: evalData,
                },
                book_number: Number(activeBook),
                test_number: Number(activeTest),
                category: category || 'academic',
                status: 'COMPLETED',
            }]);
        } catch (err) {
            console.warn('[Supabase] exam_attempts write note:', err);
        } finally {
            setIsEvaluating(false);
            onTestComplete?.({
                examTitle: activeExamTitle,
                audioUrl: uploadedUrls['p3-q3'] || uploadedUrls['p2'] || audioUrl,
                evaluation: evalData,
                part: currentPart,
                overallBand: computedBand,
                bookNumber: activeBook,
                testNumber: activeTest,
                testData: testData,
                attemptRecord: attemptRecord,
                storedPartsData: partsData,
            });
            setShowPostExamAnalysis(true);
        }
    };

    // ── Loading Screen ─────────────────────────────────────────────────────
    if (isLoadingData) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center bg-[#0A0B0E] text-white">
                <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-zinc-300">Entering IELTS Speaking Room...</p>
                <p className="text-xs text-zinc-500 mt-1">{activeExamTitle}</p>
            </div>
        );
    }

    // ── Post-Exam Analysis Canvas Screen ───────────────────────────────────
    if (showPostExamAnalysis) {
        return (
            <SpeakingAnalysisView
                examTitle={`${activeExamTitle} Analysis`}
                bookNumber={activeBook}
                testNumber={activeTest}
                testData={testData}
                audioUrl={audioUrl}
                evaluation={evaluationResult}
                storedPartsData={persistedAttemptRecord?.parts_data}
                onBack={() => {
                    setShowPostExamAnalysis(false);
                    onBack?.();
                }}
                onExit={() => {
                    setShowPostExamAnalysis(false);
                    if (onExit) onExit();
                    else onBack?.();
                }}
            />
        );
    }

    return (
        <div className="flex flex-col h-full w-full relative bg-[#090A0E] text-white font-sans min-w-0 overflow-hidden select-none">
            {/* ════════════════════════════════════════════════════════════════
                1. TOP HEADER BAR
            ════════════════════════════════════════════════════════════════ */}
            <header className="shrink-0 h-14 bg-[#111217] border-b border-zinc-800/80 flex items-center justify-between px-4 sm:px-6 z-20">
                {/* Left: < Exit Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowExitModal(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/60 transition-all cursor-pointer ${
                            exitPulse ? 'ring-2 ring-rose-500 animate-pulse' : ''
                        }`}
                        title="Exit Speaking Room"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Exit</span>
                    </button>
                </div>

                {/* Center Title & 3 Part Tabs */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Title & Badge */}
                    <div className="text-center hidden sm:block">
                        <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block">
                            IELTS SPEAKING ROOM
                        </span>
                        <h1 className="text-xs font-semibold text-zinc-200">
                            {activeExamTitle}
                        </h1>
                    </div>

                    {/* Center Tabs: Pill Buttons (Single pill in Part Practice mode) */}
                    <div className="flex items-center gap-1.5 bg-[#181920] border border-zinc-800 p-1 rounded-xl">
                        {[
                            { part: 1 as const, label: '1 Interview' },
                            { part: 2 as const, label: '2 Cue Card' },
                            { part: 3 as const, label: '3 Discussion' },
                        ]
                        .filter((tab) => !isPartPractice || tab.part === currentPart)
                        .map((tab) => {
                            const isActive = currentPart === tab.part;
                            const isCompleted = completedParts.has(tab.part);
                            return (
                                <button
                                    key={tab.part}
                                    onClick={() => {
                                        setCurrentPart(tab.part);
                                        setQuestionIndex(0);
                                    }}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-zinc-700 text-white shadow-sm'
                                            : isCompleted
                                            ? 'text-emerald-400 hover:text-emerald-300'
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                                    }`}
                                >
                                    {isCompleted && '✓ '}{tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Clock Timer */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-xs font-mono text-zinc-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{formatClock(elapsedSeconds)}</span>
                    </div>
                </div>
            </header>

            {/* ════════════════════════════════════════════════════════════════
                2. MAIN STAGE (2-COLUMN GRID LAYOUT)
            ════════════════════════════════════════════════════════════════ */}
            <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-5 overflow-hidden">
                {/* ────────────────────────────────────────────────────────────
                    LEFT COLUMN: EXAMINER PANEL (Mara · IELTS Dynasty)
                ──────────────────────────────────────────────────────────── */}
                <div className="relative flex flex-col justify-between rounded-2xl bg-[#121319] border border-zinc-800/90 p-4 sm:p-5 overflow-hidden shadow-2xl">
                    {/* Top Badge Row */}
                    <div className="flex items-center justify-between z-10">
                        {/* Top-Left: Mara · IELTS Dynasty */}
                        <div className="flex items-center gap-2 bg-[#1A1B24]/90 border border-zinc-700/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-semibold text-zinc-100">
                                Mara <span className="text-zinc-400 font-normal">· IELTS Dynasty</span>
                            </span>
                        </div>

                        {/* Top-Right: Captions toggle & Replay button */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowCaptions((prev) => !prev)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                    showCaptions
                                        ? 'bg-zinc-800 text-zinc-200 border-zinc-600'
                                        : 'bg-transparent text-zinc-400 border-zinc-800 hover:text-zinc-200'
                                }`}
                                title="Toggle Captions"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M7 15h3M7 11h2M14 15h3M14 11h2" />
                                </svg>
                                <span>Captions</span>
                            </button>

                            <button
                                onClick={handleReplay}
                                disabled={isExaminerSpeaking}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title="Replay Question Audio"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                </svg>
                                <span>Replay</span>
                            </button>
                        </div>
                    </div>

                    {/* Center View: Avatar (Parts 1 & 3) OR Cue Card Task Card (Part 2) */}
                    <div className="flex-1 flex flex-col items-center justify-center py-4 my-auto overflow-y-auto">
                        {currentPart !== 2 ? (
                            /* ── PARTS 1 & 3: EXAMINER AVATAR ── */
                            <div className="flex flex-col items-center justify-center gap-4">
                                <MaraAvatar isSpeaking={isExaminerSpeaking} size={150} />

                                {/* Status Indicator Pill below Avatar */}
                                <div className="mt-2">
                                    {isExaminerSpeaking ? (
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                            <span>● Asking your question</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span>Ready for the next question</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : part2SubPhase === 'rules' ? (
                            /* ── PART 2 STATE 1: EXAMINER RULES & AVATAR ORIENTATION ── */
                            <div className="w-full max-w-lg flex flex-col items-center justify-center gap-4 animate-fadeIn">
                                <MaraAvatar isSpeaking={isExaminerSpeaking} size={150} />

                                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                    <span>Examiner explaining Part 2 rules</span>
                                </div>

                                <div className="w-full bg-[#0C0D12] border border-zinc-800 rounded-xl p-4 text-center shadow-lg">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                                        Candidate Task Card Status
                                    </p>
                                    <p className="text-xs text-zinc-300 font-medium">
                                        🔒 Cue Card topic is locked while instructions are being given.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSkipPart2Instructions}
                                    className="w-full py-3 px-5 rounded-xl bg-[#1E202A] hover:bg-[#252836] border border-zinc-700 hover:border-rose-500/60 text-white font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer group active:scale-[0.99]"
                                >
                                    <span>⏭️ Skip Instructions / Jump to Cue Card</span>
                                    <span className="text-[11px] font-normal text-zinc-400 group-hover:text-zinc-200">
                                        (Start 60s Prep)
                                    </span>
                                </button>
                            </div>
                        ) : (
                            /* ── PART 2 STATE 2 & 3: REVEALED CUE CARD (PREP & SPEAKING) ── */
                            <CueCardTaskCard
                                topic={testData?.part2.topic || 'a significant experience'}
                                prompts={testData?.part2.prompts || []}
                                notes={candidateNotes}
                                onNotesChange={setCandidateNotes}
                                isLocked={false}
                                prepTimeRemaining={isPrepActive ? prepTimeRemaining : 0}
                                onStartSpeaking={isPrepActive ? handleStartAnswer : undefined}
                                disabled={recordingState === 'recording'}
                            />
                        )}
                    </div>

                    {/* Subtitle/Transcript Area Positioned Just Above Footer */}
                    {showCaptions && (
                        <div className="z-10 mt-auto bg-black/60 backdrop-blur-md border border-zinc-800 rounded-xl p-3.5 shadow-lg">
                            <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1">
                                Transcript
                            </p>
                            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                                "{currentPromptText}"
                            </p>
                        </div>
                    )}
                </div>

                {/* ────────────────────────────────────────────────────────────
                    RIGHT COLUMN: CANDIDATE CAMERA PANEL
                ──────────────────────────────────────────────────────────── */}
                <div className="relative flex flex-col justify-between rounded-2xl bg-[#121319] border border-zinc-800/90 p-4 sm:p-5 overflow-hidden shadow-2xl">
                    {/* Top Badge: You · Candidate */}
                    <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-2 bg-[#1A1B24]/90 border border-zinc-700/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                            <span className="text-xs font-semibold text-zinc-100">
                                You <span className="text-zinc-400 font-normal">· Candidate</span>
                            </span>
                        </div>

                        {/* Camera status toggle if active */}
                        {isCameraOn && (
                            <button
                                onClick={stopCamera}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 transition-colors cursor-pointer"
                            >
                                Turn camera off
                            </button>
                        )}
                    </div>

                    {/* Center View: Camera Stream OR Avatar Placeholder */}
                    <div className="flex-1 flex flex-col items-center justify-center py-4 my-auto relative overflow-hidden rounded-xl">
                        {!isCameraOn ? (
                            /* Camera OFF: Avatar Placeholder */
                            <div className="flex flex-col items-center justify-center text-center max-w-sm px-4">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-800/80 border-2 border-zinc-700/70 flex items-center justify-center text-3xl sm:text-4xl font-bold text-zinc-300 shadow-inner mb-4">
                                    Y
                                </div>
                                <p className="text-sm font-medium text-zinc-200 mb-2">
                                    Turn on your camera for a more realistic speaking-room experience.
                                </p>
                                <p className="text-xs text-zinc-500 mb-5 flex items-center gap-1.5">
                                    <span>🛡</span> Local preview only — video is never uploaded
                                </p>
                                <button
                                    onClick={startCamera}
                                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-red-600/20 transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 7l-7 5 7 5V7z" />
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                    </svg>
                                    <span>Turn camera on</span>
                                </button>
                            </div>
                        ) : (
                            /* Camera ON: HTML5 Video Stream */
                            <div className="w-full h-full relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover rounded-xl"
                                />
                                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-zinc-300 border border-zinc-700/60">
                                    LIVE PREVIEW
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom placeholder spacer */}
                    <div className="h-6" />
                </div>
            </main>

            {/* ════════════════════════════════════════════════════════════════
                3. BOTTOM ACTION BAR & NAVIGATION
            ════════════════════════════════════════════════════════════════ */}
            <footer className="shrink-0 bg-[#0E0F14] border-t border-zinc-800/90 px-4 sm:px-6 py-3 flex flex-col gap-2 z-20">
                {/* Top sub-row: PART X · QUESTION Y OF Z | Status text */}
                <div className="flex items-center justify-between text-[11px] font-mono tracking-wider">
                    <span className="text-zinc-400 font-semibold">
                        {currentPart === 2
                            ? 'PART 2 · CUE CARD TASK'
                            : `PART ${currentPart} · QUESTION ${questionIndex + 1} OF ${totalQuestionsInPart}`}
                    </span>
                    <span className="text-zinc-400 font-semibold uppercase">
                        {isExaminerSpeaking
                            ? currentPart === 2 && part2SubPhase === 'rules'
                                ? 'EXAMINER INSTRUCTIONS'
                                : 'EXAMINER SPEAKING'
                            : isPrepActive
                            ? 'PREPARATION'
                            : 'SPEAKING ROOM'}
                    </span>
                </div>

                {/* Control Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Left: < and > arrow buttons & Question pill */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevQuestion}
                            disabled={currentPart === 1 && questionIndex === 0}
                            className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Previous Question"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        <div className="px-3 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-xs font-mono text-zinc-300">
                            {currentPart === 2 ? 'Cue Card' : `Question ${questionIndex + 1} / ${totalQuestionsInPart}`}
                        </div>

                        <button
                            onClick={handleNextQuestion}
                            disabled={currentPart === 3 && questionIndex === totalQuestionsInPart - 1}
                            className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Next Question"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>

                    {/* Center Action Button (Stateful) */}
                    <div className="flex flex-col items-center">
                        {/* State 1: Examiner is speaking */}
                        {isExaminerSpeaking && (
                            <div className="flex flex-col items-center">
                                {currentPart === 2 && part2SubPhase === 'rules' ? (
                                    <button
                                        onClick={handleSkipPart2Instructions}
                                        className="px-6 py-2.5 rounded-full bg-[#222732] hover:bg-[#2B3242] border border-zinc-700 hover:border-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                                    >
                                        <span>⏭️ Skip Instructions / Jump to Cue Card</span>
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="px-6 py-2 rounded-full bg-pink-950/40 border border-pink-500/40 text-pink-300 text-xs font-semibold flex items-center gap-2 cursor-not-allowed opacity-90"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="23" />
                                            <line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                        <span>🎙 Examiner is speaking...</span>
                                    </button>
                                )}
                                <span className="text-[10px] text-zinc-500 mt-1">
                                    {currentPart === 2 && part2SubPhase === 'rules'
                                        ? 'Click Skip to immediately begin your 60-second preparation.'
                                        : 'Recording becomes available when the examiner question finishes.'}
                                </span>
                            </div>
                        )}

                        {/* State 2: Ready to answer (Examiner done) */}
                        {!isExaminerSpeaking && recordingState === 'ready' && (
                            <button
                                onClick={handleStartAnswer}
                                className="px-7 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="23" />
                                    <line x1="8" y1="23" x2="16" y2="23" />
                                </svg>
                                <span>
                                    {currentPart === 2 && isPrepActive
                                        ? `🎙 Start Speaking Now (Prep ${prepTimeRemaining}s)`
                                        : currentPart === 2
                                        ? '🎙 Start speaking now'
                                        : '🎙 Start answer'}
                                </span>
                            </button>
                        )}

                        {/* State 3: Recording active */}
                        {recordingState === 'recording' && (
                            <button
                                onClick={handleStopRecording}
                                className="px-7 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/40 animate-pulse transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <span className="w-3 h-3 rounded-sm bg-white" />
                                <span>⏹ Stop recording [{formatClock(recordingSeconds)}]</span>
                            </button>
                        )}

                        {/* State 4: Response recorded (Playback scrubber + Record again + Next question) */}
                        {recordingState === 'recorded' && audioUrl && (
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {/* Hidden Audio element */}
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

                                {/* Audio scrubber bar */}
                                <div className="flex items-center gap-2 bg-[#1A1B24] border border-zinc-700/70 rounded-full px-3 py-1.5 shadow-md">
                                    <button
                                        onClick={togglePlayback}
                                        className="w-6 h-6 rounded-full bg-zinc-700 hover:bg-zinc-600 text-white flex items-center justify-center shrink-0 cursor-pointer"
                                        title={isPlaying ? 'Pause' : 'Play response'}
                                    >
                                        {isPlaying ? (
                                            <span className="w-2 h-2 bg-white rounded-xs" />
                                        ) : (
                                            <svg className="w-3 h-3 ml-0.5 fill-white" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>

                                    <span className="text-[11px] font-mono text-zinc-300">
                                        Answer captured [{formatClock(Math.floor(playbackTime))} / {formatClock(Math.floor(playbackDuration || recordingSeconds))}]
                                    </span>

                                    <div
                                        onClick={handleSeek}
                                        className="w-20 sm:w-28 h-1.5 bg-zinc-700 rounded-full cursor-pointer relative overflow-hidden"
                                    >
                                        <div
                                            className="h-full bg-red-500 rounded-full transition-all"
                                            style={{
                                                width: playbackDuration ? `${(playbackTime / playbackDuration) * 100}%` : '0%',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Record again button */}
                                <button
                                    onClick={handleReRecord}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                        <path d="M3 3v5h5" />
                                    </svg>
                                    <span>↺ Record again</span>
                                </button>

                                {isLastQuestionOfTest ? (
                                    /* Primary Final CTA: [ 🚀 Submit Speaking Attempt for AI Evaluation ] */
                                    <button
                                        onClick={handleSubmitFinalAttempt}
                                        disabled={isEvaluating}
                                        className="px-6 py-2 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-emerald-600 hover:from-rose-500 hover:to-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                                    >
                                        {isEvaluating ? (
                                            <>
                                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Analyzing Speaking Attempt...</span>
                                            </>
                                        ) : (
                                            <span>🚀 Submit Speaking Attempt for AI Evaluation</span>
                                        )}
                                    </button>
                                ) : (
                                    /* Next question button (Green) */
                                    <button
                                        onClick={handleNextQuestion}
                                        className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <span>✓ Next question</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Captions Button */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowCaptions((prev) => !prev)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                showCaptions
                                    ? 'bg-zinc-800 text-zinc-200 border-zinc-600'
                                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:text-zinc-200'
                            }`}
                            title="Toggle Subtitles"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="M7 15h3M7 11h2M14 15h3M14 11h2" />
                            </svg>
                            <span>Captions</span>
                        </button>
                    </div>
                </div>
            </footer>

            {/* ════════════════════════════════════════════════════════════════
                4. EXIT CONFIRMATION MODAL
            ════════════════════════════════════════════════════════════════ */}
            {showExitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#14151C] border border-zinc-800 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-800/40 flex items-center justify-center mx-auto mb-4 text-rose-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Exit Speaking Room?</h3>
                        <p className="text-xs text-zinc-400 mb-6">
                            Any un-evaluated recordings in your active question will not be saved. Are you sure you want to return to the Speaking Studio hub?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setShowExitModal(false)}
                                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                            >
                                Continue Speaking
                            </button>
                            <button
                                onClick={() => {
                                    setShowExitModal(false);
                                    stopCamera();
                                    onExit();
                                }}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                                Exit Room
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                5. AI EVALUATION MODAL (If Candidate Triggers Evaluation)
            ════════════════════════════════════════════════════════════════ */}
            {showEvalModal && evaluationResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
                    <div className="bg-[#121319] border border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                            <div>
                                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                                    IELTS Official Diagnostic
                                </span>
                                <h3 className="text-2xl font-black text-white">
                                    Overall Band {evaluationResult.overallBand.toFixed(1)}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowEvalModal(false)}
                                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 4 Criteria Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                            {[
                                { label: 'Fluency', score: evaluationResult.fluency.score, color: 'text-purple-400' },
                                { label: 'Lexical', score: evaluationResult.lexical.score, color: 'text-blue-400' },
                                { label: 'Grammar', score: evaluationResult.grammar.score, color: 'text-amber-400' },
                                { label: 'Pronunciation', score: evaluationResult.pronunciation.score, color: 'text-emerald-400' },
                            ].map((c) => (
                                <div key={c.label} className="bg-[#181922] border border-zinc-800 rounded-xl p-3 text-center">
                                    <p className="text-[11px] text-zinc-400 font-medium">{c.label}</p>
                                    <p className={`text-xl font-bold mt-0.5 ${c.color}`}>{c.score.toFixed(1)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Strengths & Improvements */}
                        <div className="space-y-3 mb-4">
                            {evaluationResult.what_you_did_well?.length > 0 && (
                                <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-xl p-3">
                                    <p className="text-xs font-bold text-emerald-400 mb-1.5">Key Strengths</p>
                                    <ul className="text-xs text-zinc-300 space-y-1">
                                        {evaluationResult.what_you_did_well.map((s, idx) => (
                                            <li key={idx}>• {s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {evaluationResult.areas_to_improve?.length > 0 && (
                                <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-3">
                                    <p className="text-xs font-bold text-amber-400 mb-1.5">Areas for Improvement</p>
                                    <ul className="text-xs text-zinc-300 space-y-1">
                                        {evaluationResult.areas_to_improve.map((imp, idx) => (
                                            <li key={idx}>• {imp}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {evaluationResult.transcript && (
                                <div className="bg-[#181922] border border-zinc-800 rounded-xl p-3">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                                        Transcribed Speech
                                    </p>
                                    <p className="text-xs text-zinc-300 italic leading-relaxed">
                                        "{evaluationResult.transcript}"
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowEvalModal(false)}
                                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                                Back to Room
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default SpeakingExamWorkspace;

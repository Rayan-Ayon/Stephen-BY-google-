import React, { useCallback, useEffect, useRef, useState } from 'react';
import GrammarEvaluationCard from './GrammarEvaluationCard';

interface ProofItem { question: string; user_answer: string; rating: string | number; feedback: string; }
interface CriteriaBreakdown { score: number; relevance: ProofItem[]; logical_sequencing: ProofItem[]; topic_development: ProofItem[]; }
interface LexicalBreakdown { score: number; diversity_and_advanced_words: string[]; accuracy: string[]; }
interface GrammarBreakdown { score: number; sentence_complexity: string[]; errors: string[]; }
interface PronunciationBreakdown { score: number; individual_sounds: string[]; word_stress: string[]; rhythm_intonation: string[]; }
interface SpeakingEvaluationResponse {
    overallBand: number;
    fluency: CriteriaBreakdown;
    lexical: LexicalBreakdown;
    grammar: GrammarBreakdown;
    pronunciation: PronunciationBreakdown;
    transcript: string;
    what_you_did_well: string[];
    areas_to_improve: string[];
}

type ExamStage = 'preset_setup' | 'topic_picker' | 'cue_card_prep' | 'live_speaking' | 'evaluation_summary';
type PresetType = 'part1' | 'part2' | 'part3' | 'full_mock';
type OrbState = 'idle_pulse' | 'listening_ripple' | 'thinking_shimmer' | 'speaking_waveform';
type DrawerTab = 'quick_start' | 'qna' | 'scoring' | 'about';
type ChatRole = 'examiner' | 'user';
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface ChatMessage {
    id: number;
    role: ChatRole;
    part: 1 | 2 | 3;
    text: string;
    ts: string;
    tags?: string[];
}

interface Part1Topic { id: string; label: string; hint: string; examinerPrompt: string; }
interface Part2Topic { id: string; label: string; hint: string; topic: string; prompts: string[]; }
interface Part3Topic { id: string; label: string; hint: string; examinerPrompt: string; }

const PART1_TOPICS: Part1Topic[] = [
    { id: 'hometown', label: 'Hometown & Living', hint: 'Places & daily life', examinerPrompt: 'Let\'s talk about where you live. Can you describe your hometown and what you like most about it?' },
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

const PRESETS: { id: PresetType; title: string; duration: string; badges: string[] }[] = [
    { id: 'part1', title: 'IELTS Speaking Part 1', duration: '5 min', badges: ['IELTS', 'Part 1'] },
    { id: 'part2', title: 'IELTS Speaking Part 2', duration: '3 min', badges: ['IELTS', 'Part 2'] },
    { id: 'part3', title: 'IELTS Speaking Part 3', duration: '5 min', badges: ['IELTS', 'Part 3'] },
    { id: 'full_mock', title: 'IELTS Full Mock Test', duration: '14 min', badges: ['IELTS', 'Full Test'] },
];

const PIXEL_TOPICS: { id: string; label: string; examinerPrompt: string }[] = [
    { id: 'random', label: 'Random Topics', examinerPrompt: 'Let\'s begin with a few warm-up questions. Tell me a little about yourself and what you do in your free time.' },
    { id: 'hometown', label: 'Hometown', examinerPrompt: 'Let\'s talk about where you live. Can you describe your hometown and what you like most about it?' },
    { id: 'work_study', label: 'Work or Study', examinerPrompt: 'Do you work or are you a student? What do you find most interesting about your job or course?' },
    { id: 'accommodation', label: 'Accommodation', examinerPrompt: 'Where do you live at the moment — a house or an apartment? What do you like about your accommodation?' },
    { id: 'family', label: 'Family', examinerPrompt: 'Could you tell me a bit about your family and the people you are closest to?' },
    { id: 'hobbies', label: 'Hobbies & Interests', examinerPrompt: 'How do you usually spend your free time? Why do these hobbies appeal to you?' },
];

const formatClock = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const flatMap = <T, U>(arr: T[], fn: (item: T, i: number) => U[]): U[] => arr.flatMap(fn);

const renderStreamingWords = (text: string, revealed: number) => {
    const words = text.split(' ');
    return (
        <>
            {words.slice(0, revealed).map((w, i) => (
                <span key={i} className="animate-[lexiGlow_600ms_ease-out] text-[#0F172A] font-semibold">{w} </span>
            ))}
        </>
    );
};

const downsampleBuffer = (buffer: Float32Array, sampleRate: number, outSampleRate: number): Float32Array => {
    if (outSampleRate === sampleRate) return buffer;
    const ratio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0, offsetBuffer = 0;
    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
        let accum = 0, count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i]; count++;
        }
        result[offsetResult] = accum / count;
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }
    return result;
};

const float32ToInt16 = (buffer: Float32Array): Int16Array => {
    const buf = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        buf[i] = Math.min(1, Math.max(-1, buffer[i])) * 0x7FFF;
    }
    return buf;
};

const LexiOrb: React.FC<{ state: OrbState }> = ({ state }) => {
    const base = 'relative w-[280px] h-[280px] transition-all duration-700 will-change-transform';
    const gradient = 'bg-gradient-to-tr from-[#00F5A0] via-[#00D2FF] to-[#0072FF]';
    const morph = 'rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-[lexiLiquid_8s_ease-in-out_infinite]';
    const stateClass: Record<OrbState, string> = {
        idle_pulse: 'animate-[lexiBreath_3s_ease-in-out_infinite]',
        listening_ripple: 'scale-110',
        thinking_shimmer: 'animate-[lexiShimmer_750ms_linear_infinite] opacity-90',
        speaking_waveform: 'drop-shadow-[0_0_35px_rgba(0,210,255,0.4)]',
    };
    return (
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#00D2FF] blur-3xl opacity-30 rounded-full animate-pulse" />
            {state === 'listening_ripple' && (
                <>
                    <span className="absolute w-[320px] h-[320px] rounded-full ring-4 ring-emerald-400/40 animate-ping" />
                    <span className="absolute w-[360px] h-[360px] rounded-full ring-2 ring-emerald-400/20 animate-ping" style={{ animationDelay: '200ms' }} />
                </>
            )}
            <div className={`${base} ${gradient} ${morph} ${stateClass[state]}`}>
                <div className="absolute inset-3 rounded-[58%_42%_38%_62%/58%_38%_62%_42%] bg-white/10 backdrop-blur-sm" />
            </div>
        </div>
    );
};

const QAMessageCard: React.FC<{ message: ChatMessage; qNum: number; attempt: number; isStreaming: boolean; revealed: number; onCheckScore: () => void }> = ({ message, qNum, attempt, isStreaming, revealed, onCheckScore }) => {
    const [showHint, setShowHint] = useState(false);
    const [showSample, setShowSample] = useState(false);
    if (message.role === 'examiner') {
        return (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="bg-[#1E293B] text-white rounded-t-xl px-4 py-2 text-[12px] font-semibold">Q{qNum} • Examiner</div>
                <div className="p-4">
                    <p className="text-[13px] text-slate-700 leading-relaxed">
                        {isStreaming ? renderStreamingWords(message.text, revealed) : message.text}
                        {isStreaming && <span className="text-[#94A3B8]"> ▌</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => setShowHint((v) => !v)} className="text-[12px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">Show Hint</button>
                        <button onClick={() => setShowSample((v) => !v)} className="text-[12px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">Show Sample</button>
                    </div>
                    {showHint && <p className="mt-2 text-[12px] text-slate-500 bg-slate-50 rounded-lg p-3">Expand your answer with a reason and a concrete personal example to extend the response.</p>}
                    {showSample && <p className="mt-2 text-[12px] text-slate-500 bg-slate-50 rounded-lg p-3">Well, I suppose the key point is that it gives me a real sense of routine, and I'd say that's exactly why I value it so much in my daily life.</p>}
                </div>
            </div>
        );
    }
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="bg-[#059669] text-white rounded-t-xl px-4 py-2 text-[12px] font-semibold">Q{qNum} • Attempt {attempt} • You</div>
            <div className="p-4">
                <p className="text-[13px] text-slate-700 leading-relaxed">{message.text}</p>
                {message.tags && message.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {message.tags.map((tg, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{tg}</span>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                    <button className="text-[12px] px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">Correct</button>
                    <button className="text-[12px] px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">Improve</button>
                    <button className="text-[12px] px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">Analyze</button>
                </div>
            </div>
        </div>
    );
};

const LexiSpeakStudio: React.FC<{ onTimer?: (s: number) => void; onActiveChange?: (active: boolean) => void; sessionToken?: string }> = ({ onTimer, onActiveChange, sessionToken }) => {
    const [activeStage, setActiveStage] = useState<ExamStage>('preset_setup');
    const [activePreset, setActivePreset] = useState<PresetType>('part2');
    const [orbState, setOrbState] = useState<OrbState>('idle_pulse');
    const [drawerTab, setDrawerTab] = useState<DrawerTab>('quick_start');
    const [targetBand, setTargetBand] = useState<string>('Band 8.0+');
    const [showTranscript, setShowTranscript] = useState(true);
    const [cueCardTimer, setCueCardTimer] = useState(60);
    const [drawerOpen, setDrawerOpen] = useState(true);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [examinerStream, setExaminerStream] = useState<{ id: number; full: string; revealed: number } | null>(null);
    const [sessionElapsed, setSessionElapsed] = useState(0);
    const [stageRemaining, setStageRemaining] = useState(0);
    const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
    const [sessionTopic, setSessionTopic] = useState('');
    const [selectedTopicLabel, setSelectedTopicLabel] = useState('');
    const [selectedCue, setSelectedCue] = useState<Part2Topic>(PART2_TOPICS[0]);
    const [selectedPixelTopic, setSelectedPixelTopic] = useState<{ id: string; label: string; examinerPrompt: string } | null>(null);
    const [aiReplying, setAiReplying] = useState(false);
    const [hoveredPresetId, setHoveredPresetId] = useState<string | null>(null);
    const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
    const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);
    const [showSampleResult, setShowSampleResult] = useState(false);
    const [showFluencyDetails, setShowFluencyDetails] = useState(false);
    const [showRelevanceProof, setShowRelevanceProof] = useState(false);
    const [showLogicalProof, setShowLogicalProof] = useState(false);
    const [showTopicProof, setShowTopicProof] = useState(false);
    const [showCohesiveProof, setShowCohesiveProof] = useState(false);
    const [ratingFilter, setRatingFilter] = useState<'ALL' | 'EXCELLENT' | 'STRONG'>('ALL');
    const [showLexicalDetails, setShowLexicalDetails] = useState(false);
    const [showDiversityProof, setShowDiversityProof] = useState(false);
    const [showAdvVocabProof, setShowAdvVocabProof] = useState(false);
    const [showMultiWordProof, setShowMultiWordProof] = useState(false);
    const [showAdvExpProof, setShowAdvExpProof] = useState(false);
    const [showLexAccuracyProof, setShowLexAccuracyProof] = useState(false);

    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationError, setEvaluationError] = useState<string | null>(null);
    const [sessionEvaluation, setSessionEvaluation] = useState<SpeakingEvaluationResponse | null>(null);
    const [showPronDetails, setShowPronDetails] = useState(false);
    const [showWordStressProof, setShowWordStressProof] = useState(false);
    const [showIndividualSoundsProof, setShowIndividualSoundsProof] = useState(false);
    const [showRhythmProof, setShowRhythmProof] = useState(false);

    // ── WebSocket / Live API state ───────────────────────────────────
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [bargeInActive, setBargeInActive] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimerRef = useRef<number | null>(null);

    const thinkTimer = useRef<number | null>(null);
    const cueTimer = useRef<number | null>(null);
    const evaluationsRef = useRef<SpeakingEvaluationResponse[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const playbackQueueRef = useRef<{ source: AudioBufferSourceNode; startTime: number }[]>([]);
    const nextPlaybackTimeRef = useRef(0);
    const sessionTranscriptRef = useRef('');
    const sessionTurnsRef = useRef<{ role: string; text: string }[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const recordingTimeRef = useRef(0);

    const pushExaminer = (text: string, part: 1 | 2 | 3) => {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        setMessages((prev) => [...prev, { id, role: 'examiner', part, text, ts: formatClock(sessionElapsed) }]);
        setExaminerStream({ id, full: text, revealed: 0 });
        setOrbState('speaking_waveform');
    };

    const pushUser = (text: string, part: 1 | 2 | 3, tags?: string[]) => {
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + Math.floor(Math.random() * 1000),
                role: 'user',
                part,
                text,
                ts: formatClock(sessionElapsed),
                tags,
            },
        ]);
    };

    const stopAudioPlayback = () => {
        playbackQueueRef.current.forEach((p) => {
            try { p.source.stop(); } catch (_e) { /* already stopped */ }
        });
        playbackQueueRef.current = [];
        nextPlaybackTimeRef.current = audioContextRef.current?.currentTime || 0;
    };

    const playAudioChunk = useCallback((pcmData: ArrayBuffer) => {
        const ctx = audioContextRef.current;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();

        const int16 = new Int16Array(pcmData);
        const float32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) {
            float32[i] = int16[i] / 32768.0;
        }

        const buffer = ctx.createBuffer(1, float32.length, 24000);
        buffer.getChannelData(0).set(float32);

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);

        const now = ctx.currentTime;
        nextPlaybackTimeRef.current = Math.max(now, nextPlaybackTimeRef.current);
        source.start(nextPlaybackTimeRef.current);
        nextPlaybackTimeRef.current += buffer.duration;

        playbackQueueRef.current.push({ source, startTime: nextPlaybackTimeRef.current });
        source.onended = () => {
            const idx = playbackQueueRef.current.findIndex((p) => p.source === source);
            if (idx > -1) playbackQueueRef.current.splice(idx, 1);
            if (playbackQueueRef.current.length === 0) {
                setIsSpeaking(false);
                setOrbState('idle_pulse');
            }
        };

        setIsSpeaking(true);
        setOrbState('speaking_waveform');
    }, []);

    const handleBargeIn = useCallback(() => {
        if (!isSpeaking) return;
        stopAudioPlayback();
        setIsSpeaking(false);
        setOrbState('listening_ripple');
        setBargeInActive(true);
        setTimeout(() => setBargeInActive(false), 300);
    }, [isSpeaking]);

    // ── AudioWorklet PCM capture ──────────────────────────────────────
    const startAudioCapture = useCallback(async () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                await audioContextRef.current.audioWorklet.addModule('/worklets/pcm-processor.js');
            }
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });
            streamRef.current = stream;
            const source = audioContextRef.current.createMediaStreamSource(stream);
            const workletNode = new AudioWorkletNode(audioContextRef.current, 'pcm-processor');

            workletNode.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
                if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
                    console.log("Socket is NOT open. Audio chunk dropped.");
                    return;
                }

                // Barge-in: if Gemini is speaking, stop playback
                if (isSpeaking) {
                    handleBargeIn();
                }

                console.log("SENDING CHUNK TO BACKEND. Size:", event.data.byteLength);
                wsRef.current.send(event.data);
            };

            source.connect(workletNode);
            // Mute local playback to prevent feedback
            const muteGain = audioContextRef.current.createGain();
            muteGain.gain.value = 0;
            workletNode.connect(muteGain);
            muteGain.connect(audioContextRef.current.destination);

            setOrbState('listening_ripple');
        } catch (err: any) {
            console.error('Microphone access denied or AudioWorklet failed:', err);
            const msg = err?.name === 'NotAllowedError'
                ? 'Microphone permission denied. Please allow mic access and try again.'
                : err?.name === 'NotFoundError'
                    ? 'No microphone found. Please connect a mic and try again.'
                    : `Mic error: ${err?.message || 'unknown'}`;
            setMicError(msg);
            setConnectionStatus('disconnected');
        }
    }, [isSpeaking, handleBargeIn]);

    const stopAudioCapture = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    }, []);

    // ── WebSocket session message handler ─────────────────────────────
    const handleSessionMessage = useCallback((msg: any) => {
        switch (msg.type) {
            case 'user_transcript':
                pushUser(msg.text, currentPart);
                break;
            case 'gemini_transcript':
                pushExaminer(msg.text, currentPart);
                break;
            case 'turn_complete':
                setOrbState('idle_pulse');
                setAiReplying(false);
                break;
            case 'interrupted':
                stopAudioPlayback();
                setIsSpeaking(false);
                break;
            case 'error':
                console.error('Session error:', msg.error);
                setConnectionStatus('disconnected');
                break;
            case 'session_ended':
                sessionTranscriptRef.current = msg.transcript || '';
                sessionTurnsRef.current = msg.turns || [];
                break;
            case 'ping':
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({ type: 'pong' }));
                }
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPart]);

    // ── WebSocket connect ─────────────────────────────────────────────
    const connectToSession = useCallback(async () => {
        if (!sessionToken) {
            console.error('No session token available');
            return;
        }
        const partNum = activePreset === 'part2' ? 2 : activePreset === 'part3' ? 3 : 1;
        setCurrentPart(partNum);
        setMicError(null);

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const topicParam = encodeURIComponent(selectedPixelTopic?.label || sessionTopic || '');
        const wsUrl = `${wsProtocol}//${window.location.host}/api/ielts/ws/speaking-session?token=${sessionToken}&part=${partNum}&topic=${topicParam}`;

        setConnectionStatus('connecting');
        const ws = new WebSocket(wsUrl);
        ws.binaryType = 'arraybuffer';
        wsRef.current = ws;

        ws.onopen = () => {
            setConnectionStatus('connected');
            setOrbState('idle_pulse');
            reconnectAttemptsRef.current = 0;
            setIsReconnecting(false);
            startAudioCapture();
        };

        ws.onmessage = (event: MessageEvent) => {
            if (event.data instanceof ArrayBuffer) {
                playAudioChunk(event.data);
            } else {
                try {
                    const msg = JSON.parse(event.data);
                    handleSessionMessage(msg);
                } catch (_e) { /* ignore non-JSON */ }
            }
        };

        ws.onclose = () => {
            setConnectionStatus('disconnected');
            stopAudioCapture();
            stopAudioPlayback();
            // Auto-reconnect with exponential backoff (max 3 attempts)
            if (reconnectAttemptsRef.current < 3 && activeStage === 'live_speaking') {
                const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 8000);
                reconnectAttemptsRef.current += 1;
                setIsReconnecting(true);
                setConnectionStatus('connecting');
                reconnectTimerRef.current = window.setTimeout(() => {
                    connectToSession();
                }, delay);
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
            setConnectionStatus('disconnected');
        };
    }, [sessionToken, activePreset, selectedPixelTopic, sessionTopic, activeStage, startAudioCapture, stopAudioCapture, playAudioChunk, handleSessionMessage]);

    const disconnectSession = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close(1000, 'User ended call');
            wsRef.current = null;
        }
        stopAudioCapture();
        stopAudioPlayback();
        setConnectionStatus('disconnected');
        setIsSpeaking(false);
    }, [stopAudioCapture]);

    // ── Session lifecycle ─────────────────────────────────────────────
    const startSession = (pixel?: { id: string; label: string; examinerPrompt: string }) => {
        const topic = pixel || selectedPixelTopic || PIXEL_TOPICS[0];
        const partNum = activePreset === 'part2' ? 2 : activePreset === 'part3' ? 3 : 1;
        setCurrentPart(partNum);
        setSessionTopic(topic.label);
        setSelectedTopicLabel(topic.label);
        setSessionElapsed(0);
        setDrawerTab('qna');
        evaluationsRef.current = [];
        sessionTranscriptRef.current = '';
        sessionTurnsRef.current = [];
        setSessionEvaluation(null);
        setMessages([]);
        setExaminerStream(null);

        if (activePreset === 'part2') {
            setActiveStage('cue_card_prep');
            setStageRemaining(60);
            setCueCardTimer(60);
        } else {
            setActiveStage('live_speaking');
            setStageRemaining(300);
        }

        // Connect WebSocket — greeting is sent by the backend
        connectToSession();
    };

    const endSession = useCallback(async () => {
        disconnectSession();
        setActiveStage('evaluation_summary');
        setDrawerTab('scoring');

        // Post-call evaluation with transcript
        if (sessionTranscriptRef.current) {
            setIsEvaluating(true);
            setEvaluationError(null);
            try {
                const questionPrompt = sessionTurnsRef.current
                    .filter((t) => t.role === 'gemini')
                    .map((t) => t.text)
                    .join('\n');
                const formData = new FormData();
                formData.append('transcript', sessionTranscriptRef.current);
                formData.append('question_prompt', questionPrompt);
                formData.append('part', String(currentPart));
                formData.append('topic', sessionTopic);

                const response = await fetch('/api/ielts/evaluate-speaking', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.detail || `API returned ${response.status}`);
                }
                const result: SpeakingEvaluationResponse = await response.json();
                setSessionEvaluation(result);
                evaluationsRef.current.push(result);
            } catch (err: any) {
                console.error('Post-call evaluation failed:', err);
                setEvaluationError(err.message || 'Evaluation failed');
            } finally {
                setIsEvaluating(false);
            }
        }
    }, [disconnectSession, currentPart, sessionTopic]);

    const handleEndCall = () => {
        endSession();
    };

    const beginPart2Speak = () => {
        if (activeStage !== 'cue_card_prep') return;
        setActiveStage('live_speaking');
        setStageRemaining(120);
    };

    // ── Effects ───────────────────────────────────────────────────────

    // Examiner word-by-word streaming
    useEffect(() => {
        if (!examinerStream) return;
        const words = examinerStream.full.split(' ');
        if (examinerStream.revealed >= words.length) {
            setOrbState('idle_pulse');
            setAiReplying(false);
            setExaminerStream(null);
            return;
        }
        const id = window.setInterval(() => {
            setExaminerStream((prev) => {
                if (!prev) return prev;
                const w = prev.full.split(' ');
                const nextRevealed = prev.revealed + 1;
                if (nextRevealed >= w.length) {
                    window.setTimeout(() => {
                        setExaminerStream(null);
                        setOrbState('idle_pulse');
                    }, 0);
                    return { ...prev, revealed: w.length };
                }
                return { ...prev, revealed: nextRevealed };
            });
        }, 45);
        return () => window.clearInterval(id);
    }, [examinerStream]);

    // Cue card prep countdown
    useEffect(() => {
        if (activeStage !== 'cue_card_prep') return;
        cueTimer.current = window.setInterval(() => setCueCardTimer((s) => (s <= 1 ? 0 : s - 1)), 1000);
        return () => {
            if (cueTimer.current) window.clearInterval(cueTimer.current);
        };
    }, [activeStage]);

    // Stage remaining countdown
    useEffect(() => {
        if (activeStage !== 'live_speaking' && activeStage !== 'cue_card_prep') return;
        const id = window.setInterval(() => setStageRemaining((s) => (s <= 1 ? 0 : s - 1)), 1000);
        return () => window.clearInterval(id);
    }, [activeStage]);

    useEffect(() => {
        if (stageRemaining !== 0) return;
        if (activeStage === 'cue_card_prep') beginPart2Speak();
        else if (activeStage === 'live_speaking') endSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stageRemaining, activeStage]);

    // Drive parent full-bleed only while a session is actually running
    useEffect(() => {
        const running = activeStage === 'live_speaking' || activeStage === 'cue_card_prep' || activeStage === 'evaluation_summary';
        onActiveChange?.(running);
        return () => {
            if (running) onActiveChange?.(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStage]);

    // Resume AudioContext on user interaction (iOS/Safari policy)
    useEffect(() => {
        const resume = async () => {
            if (audioContextRef.current?.state === 'suspended') {
                await audioContextRef.current.resume();
            }
        };
        const events = ['click', 'touchstart', 'keydown'];
        events.forEach((e) => document.addEventListener(e, resume, { once: true }));
        return () => events.forEach((e) => document.removeEventListener(e, resume));
    }, []);

    // Session elapsed clock
    useEffect(() => {
        if (activeStage !== 'live_speaking') return;
        const id = window.setInterval(() => {
            setSessionElapsed((e) => {
                const next = e + 1;
                onTimer?.(next);
                return next;
            });
        }, 1000);
        return () => window.clearInterval(id);
    }, [activeStage]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnectSession();
            if (thinkTimer.current) window.clearTimeout(thinkTimer.current);
            if (cueTimer.current) window.clearInterval(cueTimer.current);
            if (reconnectTimerRef.current) window.clearTimeout(reconnectTimerRef.current);
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => {});
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const lastMsg = messages[messages.length - 1];
    const renderMsgText = (m: ChatMessage): React.ReactNode => {
        if (m.role === 'examiner' && examinerStream && examinerStream.id === m.id) {
            return <>{renderStreamingWords(m.text, examinerStream.revealed)}<span className="text-[#94A3B8]"> ▌</span></>;
        }
        return <>{m.text}</>;
    };

    const DrawerPillButton: React.FC<{ tab: DrawerTab; label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setDrawerTab(tab)}
            className={`flex-1 px-2 py-2 rounded-[10px] text-[13px] font-medium transition-all ${
                drawerTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex-1 min-h-screen w-full bg-[#FAFCFF] relative overflow-y-auto flex flex-col font-sans">
            <div className={`flex-1 transition-all duration-300 ease-in-out flex relative min-h-0 ${drawerOpen ? 'mr-[460px]' : 'mr-0'}`}>
                {/* Center Ambient Canvas */}
                <div className="flex-1 relative flex flex-col items-center justify-center min-w-0 pb-16">
                    <div className="absolute top-5 left-6 flex items-center gap-2 text-slate-400 text-[12px] font-medium">
                        <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : connectionStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-slate-300'}`} />
                        {connectionStatus === 'connected' ? 'LexiSpeak · Live' : connectionStatus === 'connecting' ? 'Connecting...' : 'LexiSpeak · AI Vocal Engine'}
                    </div>

                    {/* Connection Status Indicator */}
                    {connectionStatus === 'connecting' && (
                        <div className="absolute top-5 right-6 flex items-center gap-2 text-amber-500 text-[12px] font-medium">
                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                            Connecting to Mohana...
                        </div>
                    )}
                    {connectionStatus === 'connected' && isSpeaking && (
                        <div className="absolute top-5 right-6 flex items-center gap-2 text-sky-500 text-[12px] font-medium">
                            <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                            Mohana is speaking...
                        </div>
                    )}
                    {connectionStatus === 'connected' && !isSpeaking && (
                        <div className="absolute top-5 right-6 flex items-center gap-2 text-emerald-500 text-[12px] font-medium">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                            Listening...
                        </div>
                    )}
                    {bargeInActive && (
                        <div className="absolute top-5 right-6 flex items-center gap-2 text-amber-500 text-[12px] font-medium">
                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                            Interrupted — listening...
                        </div>
                    )}
                    {isReconnecting && (
                        <div className="absolute top-5 right-6 flex items-center gap-2 text-amber-500 text-[12px] font-medium">
                            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                            Reconnecting ({reconnectAttemptsRef.current}/3)...
                        </div>
                    )}
                    {micError && (
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 rounded-2xl px-6 py-4 shadow-lg max-w-[400px] text-center">
                            <p className="text-[13px] text-red-600 font-medium mb-3">{micError}</p>
                            <button
                                onClick={() => { setMicError(null); startAudioCapture(); }}
                                className="px-4 py-2 bg-red-500 text-white text-[12px] font-semibold rounded-xl hover:bg-red-600 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {activeStage === 'evaluation_summary' && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#FAFCFF]/80 backdrop-blur-sm p-6">
                            <div className="w-full max-w-[520px] bg-white border border-slate-200 rounded-3xl shadow-xl p-8 text-center">
                                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Session Complete</p>
                                {isEvaluating ? (
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 border-4 border-[#00898A] border-t-transparent rounded-full animate-spin mx-auto" />
                                        <p className="text-[13px] text-slate-500">Generating your evaluation...</p>
                                    </div>
                                ) : sessionEvaluation ? (
                                    <>
                                        <p className="text-4xl font-bold text-slate-800 mb-1">Band {sessionEvaluation.overallBand.toFixed(1)}</p>
                                        <p className="text-[13px] text-slate-500 mb-6">Estimated IELTS Speaking score</p>
                                        <div className="space-y-3 text-left">
                                            {([
                                                { key: 'fluency', label: 'Fluency & Coherence', score: sessionEvaluation.fluency.score },
                                                { key: 'lexical', label: 'Lexical Resource', score: sessionEvaluation.lexical.score },
                                                { key: 'grammar', label: 'Grammatical Range & Accuracy', score: sessionEvaluation.grammar.score },
                                                { key: 'pronunciation', label: 'Pronunciation', score: sessionEvaluation.pronunciation.score },
                                            ]).map((p) => (
                                                <div key={p.key} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[13px] font-semibold text-slate-700">{p.label}</span>
                                                        <span className="text-[13px] font-bold text-[#00898A]">{p.score.toFixed(1)}</span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-[#00F5A0] to-[#0072FF]" style={{ width: `${(p.score / 9) * 100}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-4xl font-bold text-slate-800 mb-1">No Data</p>
                                        <p className="text-[13px] text-slate-500 mb-6">Complete a speaking session to see your score.</p>
                                    </>
                                )}
                                <button onClick={() => { setActiveStage('preset_setup'); setActivePreset('part2'); setSessionEvaluation(null); evaluationsRef.current = []; }} className="mt-6 w-full py-3 rounded-xl bg-[#00898A] text-white text-[13px] font-semibold hover:bg-[#007074] transition-colors shadow-md">
                                    Start New Session
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="w-full h-full flex flex-col items-center justify-center self-start">
                    <LexiOrb state={orbState} />

                    {/* Audio & Transcript Controls */}
                    <div className="mt-12 w-full max-w-[500px] flex flex-col items-center gap-4 z-10">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setOrbState((s) => (s === 'speaking_waveform' ? 'idle_pulse' : 'speaking_waveform'))}
                                className="w-[42px] h-[42px] rounded-full bg-[#1E293B] text-white flex items-center justify-center hover:scale-105 transition-all shadow-md"
                                aria-label="Play"
                            >
                                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </button>
                            <button
                                onClick={() => setShowTranscript((v) => !v)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                {showTranscript ? 'Hide last message' : 'Show last message'}
                                <svg className={`w-3.5 h-3.5 transition-transform ${showTranscript ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>

                        {showTranscript && (
                            <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)] min-h-[100px]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Transcript</span>
                                    <span className="text-[11px] text-slate-400">{connectionStatus === 'connected' ? 'Live' : 'Offline'}</span>
                                </div>
                                <div className="space-y-3 text-left">
                                    {activeStage === 'cue_card_prep' ? (
                                        <>
                                            <p className="text-[14px] font-bold text-slate-800 mb-2">Cue Card</p>
                                            <p className="text-[13px] text-slate-600 leading-relaxed">Describe {selectedCue.topic}. You should say:</p>
                                            <ul className="text-[13px] text-slate-600 leading-relaxed">
                                                {selectedCue.prompts.map((p, i) => (
                                                    <li key={i} className="flex items-start gap-2 mt-1">
                                                        <span className="text-teal-500 mt-0.5">•</span>{p}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button onClick={beginPart2Speak} className="w-full py-2.5 rounded-xl bg-teal-600 text-white text-[13px] font-semibold hover:bg-teal-500 transition-colors shadow-md">
                                                Begin Speaking
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-[14px] text-slate-500 leading-relaxed">
                                            {lastMsg ? (
                                                <span className="text-slate-800">{renderMsgText(lastMsg)}</span>
                                            ) : (
                                                "The transcript of the AI's last voice message will appear here. You can expand or collapse this section using the button above."
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    </div>

                    {/* Call Controls Footer */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
                        {connectionStatus === 'disconnected' && activeStage !== 'evaluation_summary' && (
                            <button
                                onClick={() => {
                                    if (activeStage === 'preset_setup') {
                                        startSession(selectedPixelTopic || undefined);
                                    } else {
                                        connectToSession();
                                    }
                                }}
                                className="px-8 py-3.5 rounded-[20px] font-medium text-[14px] text-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] transition-all bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 hover:scale-[1.02]"
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                                    Start Call
                                </div>
                            </button>
                        )}
                        {connectionStatus === 'connecting' && (
                            <div className="px-8 py-3.5 rounded-[20px] font-medium text-[14px] text-slate-500 bg-slate-100 border border-slate-200">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                                    Connecting...
                                </div>
                            </div>
                        )}
                        {connectionStatus === 'connected' && (
                            <button
                                onClick={handleEndCall}
                                className="px-6 py-3.5 rounded-[20px] font-medium text-[14px] text-red-600 shadow-[0_4px_20px_rgb(0,0,0,0.05)] transition-all border border-red-200 bg-gradient-to-b from-red-50 to-white hover:from-red-100 hover:to-red-50 hover:shadow-[0_4px_20px_rgb(239,68,68,0.1)] hover:scale-[1.02]"
                            >
                                End Call
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Floating Control Drawer */}
                    <aside className={`fixed right-0 top-[60px] bottom-0 h-[calc(100vh-60px)] w-[460px] bg-white shadow-2xl transition-transform duration-300 ease-in-out z-40 flex flex-col p-6 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        {/* Top Header Bar */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-amber-500">
                                FREE <span className="text-slate-300 font-normal">|</span> 19 LC <span className="text-slate-300 font-normal">/</span> 20 LC
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-50" aria-label="Expand">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                </button>
                                <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-50" aria-label="Close">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Navigation Segmented Switcher */}
                        <div className="flex p-1 mb-6 rounded-[12px] border border-slate-100 bg-slate-50/80">
                            <DrawerPillButton tab="quick_start" label="Quick Start" />
                            <DrawerPillButton tab="qna" label="Q&A" />
                            <DrawerPillButton tab="scoring" label="Scoring" />
                            <DrawerPillButton tab="about" label="About" />
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
                            {/* Quick Start Presets Section */}
                            {drawerTab === 'quick_start' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                        <h3 className="text-[14px] font-semibold text-slate-700">Quick Start Presets</h3>
                                    </div>

                                    {activeStage === 'topic_picker' ? (
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => { setActiveStage('preset_setup'); }}
                                                className="text-[#00898A] text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer mb-3"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                                Back to IELTS Speaking Practice
                                            </button>
                                            <h3 className="text-[18px] font-bold text-slate-800">IELTS Speaking {activePreset === 'part2' ? 2 : activePreset === 'part3' ? 3 : 1} Topics</h3>
                                            {PIXEL_TOPICS.map((t) => {
                                                const partNum = activePreset === 'part2' ? 2 : activePreset === 'part3' ? 3 : 1;
                                                const isSel = selectedPixelTopic?.id === t.id;
                                                return (
                                                    <div
                                                        key={t.id}
                                                        className={`rounded-2xl p-[18px] transition-all cursor-pointer ${
                                                            isSel ? 'bg-[#DDF7F6] border-2 border-[#00B4B6]' : hoveredTopicId === t.id ? 'bg-[#DDF7F6]/60 border border-slate-200/60' : 'bg-[#F1F5F9]/70 border border-slate-200/60'
                                                        }`}
                                                        onClick={() => { setSelectedPixelTopic(t); setSelectedTopicLabel(t.label); }}
                                                        onMouseEnter={() => setHoveredTopicId(t.id)}
                                                        onMouseLeave={() => setHoveredTopicId(null)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">Part {partNum}</span>
                                                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">{t.label}</span>
                                                            </div>
                                                            {isSel && <span className="text-[11px] font-bold text-[#00898A]">Selected</span>}
                                                        </div>
                                                        <p className="text-[12px] text-slate-500 mt-2 leading-relaxed">{t.examinerPrompt}</p>
                                                    </div>
                                                );
                                            })}
                                            {selectedPixelTopic && (
                                                <button
                                                    onClick={() => startSession(selectedPixelTopic)}
                                                    className="w-full py-3 rounded-xl bg-[#00898A] text-white text-[13px] font-semibold hover:bg-[#007074] transition-colors shadow-md mt-4"
                                                >
                                                    Start with {selectedPixelTopic.label}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {PRESETS.map((preset) => {
                                                const isActive = activePreset === preset.id;
                                                return (
                                                    <div
                                                        key={preset.id}
                                                        className={`rounded-2xl p-[18px] transition-all cursor-pointer ${
                                                            isActive ? 'bg-[#DDF7F6] border-2 border-[#00B4B6]' : hoveredPresetId === preset.id ? 'bg-[#DDF7F6]/60 border border-slate-200/60' : 'bg-[#F1F5F9]/70 border border-slate-200/60'
                                                        }`}
                                                        onClick={() => {
                                                            setActivePreset(preset.id);
                                                            setSelectedPresetId(preset.id);
                                                            if (preset.id === 'full_mock') {
                                                                startSession(PIXEL_TOPICS[0]);
                                                            } else {
                                                                setActiveStage('topic_picker');
                                                            }
                                                        }}
                                                        onMouseEnter={() => setHoveredPresetId(preset.id)}
                                                        onMouseLeave={() => setHoveredPresetId(null)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="text-[14px] font-bold text-slate-800">{preset.title}</h4>
                                                                <p className="text-[12px] text-slate-500 mt-0.5">Duration: {preset.duration}</p>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                                {preset.badges.map((b) => (
                                                                    <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500">{b}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Q&A Tab */}
                            {drawerTab === 'qna' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                        <h3 className="text-[14px] font-semibold text-slate-700">Q&A Transcript</h3>
                                    </div>
                                    {messages.length === 0 ? (
                                        <div className="text-center py-10">
                                            <p className="text-sm text-slate-400">Start a session to see the Q&A transcript here.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {messages.map((msg, i) => {
                                                const qNum = Math.floor(i / 2) + 1;
                                                const attempt = 1;
                                                return (
                                                    <QAMessageCard
                                                        key={msg.id}
                                                        message={msg}
                                                        qNum={qNum}
                                                        attempt={attempt}
                                                        isStreaming={!!examinerStream && examinerStream.id === msg.id}
                                                        revealed={examinerStream && examinerStream.id === msg.id ? examinerStream.revealed : 0}
                                                        onCheckScore={() => setDrawerTab('scoring')}
                                                    />
                                                );
                                            })}
                                            {connectionStatus === 'connected' && (
                                                <div className="flex items-center gap-2 px-4 py-3 text-slate-400">
                                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    <span className="text-xs ml-1">Listening...</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Scoring Tab */}
                            {drawerTab === 'scoring' && (
                                <div className="space-y-4">
                                    {isEvaluating && !sessionEvaluation ? (
                                        /* Loading Skeleton */
                                        <div className="space-y-4 animate-pulse">
                                            <div className="h-4 w-32 bg-slate-200 rounded" />
                                            <div className="h-8 w-48 bg-slate-200 rounded" />
                                            <div className="border border-slate-200 bg-white rounded-2xl p-5 space-y-3">
                                                <div className="h-4 w-24 bg-slate-200 rounded" />
                                                <div className="h-3 w-full bg-slate-100 rounded" />
                                                <div className="h-3 w-3/4 bg-slate-100 rounded" />
                                            </div>
                                            <div className="border-2 border-slate-200 bg-white rounded-2xl p-5 space-y-3">
                                                <div className="flex justify-between">
                                                    <div className="h-5 w-40 bg-slate-200 rounded" />
                                                    <div className="h-6 w-12 bg-slate-200 rounded" />
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <div className="h-5 w-20 bg-slate-100 rounded" />
                                                    <div className="h-5 w-20 bg-slate-100 rounded" />
                                                    <div className="h-5 w-20 bg-slate-100 rounded" />
                                                </div>
                                            </div>
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="border border-slate-200 bg-white rounded-2xl p-5 space-y-3">
                                                    <div className="flex justify-between">
                                                        <div className="h-4 w-36 bg-slate-200 rounded" />
                                                        <div className="h-5 w-10 bg-slate-200 rounded" />
                                                    </div>
                                                    <div className="h-3 w-full bg-slate-100 rounded" />
                                                    <div className="h-3 w-2/3 bg-slate-100 rounded" />
                                                </div>
                                            ))}
                                            <div className="flex items-center justify-center py-4 gap-2">
                                                <span className="w-2 h-2 bg-[#00898A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-2 h-2 bg-[#00898A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-2 h-2 bg-[#00898A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                <span className="text-xs text-slate-400 ml-2">Evaluating your responses...</span>
                                            </div>
                                        </div>
                                    ) : !sessionEvaluation ? (
                                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-full min-h-[400px]">
                                            <div className="bg-[#EEF2F6] p-4 rounded-full mb-4 text-[#475569] flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                                            </div>
                                            <h3 className="text-[17px] font-bold text-slate-800 mb-2">Complete your answers, then check your score.</h3>
                                            <p className="text-xs text-slate-400 max-w-[280px] mb-6 leading-relaxed">Start a session, speak naturally, then click "End Call" to see your AI scoring.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-y-auto max-h-full pr-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="text-[11px] font-bold text-[#00898A] tracking-wider uppercase block">SCORING</span>
                                                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">IELTS Speaking Score</h2>
                                                    <p className="text-xs text-slate-500 mt-1 mb-4">Review your estimated band and criterion evidence below.</p>
                                                </div>
                                            </div>

                                            <div className="border border-slate-200/80 bg-white rounded-2xl p-4 mb-4 shadow-2xs">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-800 text-sm">AI Quick Check</span>
                                                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium ml-2">{evaluationsRef.current.length} answer{evaluationsRef.current.length !== 1 ? 's' : ''} checked</span>
                                                    <div className="bg-[#00898A] text-white p-1 rounded-full text-xs ml-auto"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed mt-2.5">Your answers have been evaluated by AI against IELTS Speaking band descriptors.</p>
                                            </div>

                                            <div className="border-2 border-[#00B4B6] bg-white rounded-2xl p-4 mb-4">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-900 text-base">Overall Band Score</span>
                                                    <span className="bg-[#00898A] text-white text-sm font-bold px-3 py-1 rounded-lg ml-auto">{sessionEvaluation.overallBand.toFixed(1)}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed mt-2">Based on Gemini AI audio analysis, adjusted for IELTS Speaking band descriptors.</p>
                                                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
                                                    <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">Fluency <strong className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">{sessionEvaluation.fluency.score.toFixed(1)}</strong></span>
                                                    <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">Lexical <strong className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">{sessionEvaluation.lexical.score.toFixed(1)}</strong></span>
                                                    <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">Grammar <strong className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">{sessionEvaluation.grammar.score.toFixed(1)}</strong></span>
                                                    <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">Pronunciation <strong className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">{sessionEvaluation.pronunciation.score.toFixed(1)}</strong></span>
                                                </div>
                                            </div>

                                            {/* Fluency & Coherence */}
                                            <div className="border border-blue-500/80 bg-white rounded-2xl p-5 shadow-sm transition-all mb-4">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-900 text-sm">Fluency and Coherence</span>
                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2.5 py-1 rounded-lg ml-auto">{sessionEvaluation.fluency.score.toFixed(1)}</span>
                                                </div>
                                                <button onClick={() => setShowFluencyDetails(!showFluencyDetails)} className="w-full text-right text-[#3B82F6] text-xs font-medium hover:underline flex items-center justify-end gap-1 mt-3">
                                                    <span>{showFluencyDetails ? 'Hide details' : 'Show details'}</span>
                                                </button>
                                                {showFluencyDetails && (
                                                    <div className="relative mt-4 pl-8 space-y-4">
                                                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
                                                        {[
                                                            { label: 'Relevance', items: sessionEvaluation.fluency.relevance, toggle: showRelevanceProof, set: setShowRelevanceProof },
                                                            { label: 'Logical Sequencing', items: sessionEvaluation.fluency.logical_sequencing, toggle: showLogicalProof, set: setShowLogicalProof },
                                                            { label: 'Topic Development', items: sessionEvaluation.fluency.topic_development, toggle: showTopicProof, set: setShowTopicProof },
                                                        ].map((section) => (
                                                            <div key={section.label} className="relative">
                                                                <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                                <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-xs font-bold text-slate-800">{section.label}</span>
                                                                        <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">{section.items.length} items</span>
                                                                    </div>
                                                                    <button onClick={() => section.set(!section.toggle)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{section.toggle ? 'Hide proof' : 'Show proof'}</button>
                                                                    {section.toggle && section.items.length > 0 && (
                                                                        <div className="mt-3 space-y-3">
                                                                            <div className="space-y-3">
                                                                                {section.items.map((item, i) => (
                                                                                    <div key={i} className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                        <div className="flex items-center gap-2 mb-2">
                                                                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q{i + 1}</span>
                                                                                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">{String(item.rating)}</span>
                                                                                        </div>
                                                                                        <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">{item.question}</div></div>
                                                                                        <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">{item.user_answer}</div></div>
                                                                                        {item.feedback && <p className="text-[11px] text-slate-500 mt-2 italic">{item.feedback}</p>}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Lexical Resource */}
                                            <div className="border border-blue-500 bg-white rounded-2xl p-5 shadow-sm transition-all mb-4">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-900 text-sm">Lexical Resource</span>
                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2.5 py-1 rounded-lg ml-auto">{sessionEvaluation.lexical.score.toFixed(1)}</span>
                                                </div>
                                                <button onClick={() => setShowLexicalDetails(!showLexicalDetails)} className="w-full text-right text-[#3B82F6] text-xs font-medium hover:underline flex items-center justify-end gap-1 mt-3">
                                                    <span>{showLexicalDetails ? 'Hide details' : 'Show details'}</span>
                                                </button>
                                                {showLexicalDetails && (
                                                    <div className="relative mt-4 pl-8 space-y-4">
                                                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <span className="text-xs font-bold text-slate-800">Advanced Vocabulary</span>
                                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                                    {sessionEvaluation.lexical.diversity_and_advanced_words.map((w, i) => (
                                                                        <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{w}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <span className="text-xs font-bold text-slate-800">Accuracy</span>
                                                                <ul className="text-slate-600 text-xs space-y-1 mt-2">
                                                                    {sessionEvaluation.lexical.accuracy.map((a, i) => <li key={i}>• {a}</li>)}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Grammar */}
                                            <GrammarEvaluationCard
                                                overallScore={sessionEvaluation.grammar.score}
                                                sentenceComplexity={sessionEvaluation.grammar.sentence_complexity}
                                                errors={sessionEvaluation.grammar.errors}
                                            />

                                            {/* Pronunciation */}
                                            <div className="border border-purple-500 bg-white rounded-2xl p-5 shadow-sm transition-all mb-4">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-900 text-sm">Pronunciation</span>
                                                    <span className="border border-purple-500 text-purple-500 font-bold text-xs px-2.5 py-1 rounded-lg ml-auto">{sessionEvaluation.pronunciation.score.toFixed(1)}</span>
                                                </div>
                                                <button onClick={() => setShowPronDetails(!showPronDetails)} className="w-full text-right text-purple-500 text-xs font-medium hover:underline flex items-center justify-end gap-1 mt-3">
                                                    <span>{showPronDetails ? 'Hide details' : 'Show details'}</span>
                                                </button>
                                                {showPronDetails && (
                                                    <div className="relative mt-4 pl-8 space-y-4">
                                                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
                                                        {[
                                                            { label: 'Word Stress', items: sessionEvaluation.pronunciation.word_stress, toggle: showWordStressProof, set: setShowWordStressProof },
                                                            { label: 'Individual Sounds', items: sessionEvaluation.pronunciation.individual_sounds, toggle: showIndividualSoundsProof, set: setShowIndividualSoundsProof },
                                                            { label: 'Rhythm & Intonation', items: sessionEvaluation.pronunciation.rhythm_intonation, toggle: showRhythmProof, set: setShowRhythmProof },
                                                        ].map((section) => (
                                                            <div key={section.label} className="relative">
                                                                <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                                <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-xs font-bold text-slate-800">{section.label}</span>
                                                                        <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">{section.items.length} items</span>
                                                                    </div>
                                                                    <button onClick={() => section.set(!section.toggle)} className="text-purple-500 text-[11px] font-medium hover:underline">{section.toggle ? 'Hide proof' : 'Show proof'}</button>
                                                                    {section.toggle && section.items.length > 0 && (
                                                                        <div className="mt-3 space-y-2">
                                                                            {section.items.map((item, i) => (
                                                                                <div key={i} className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                    <p className="text-[11px] text-slate-700 leading-relaxed">{item}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Feedback Summary */}
                                            <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-sm mb-4">
                                                <span className="text-[11px] font-bold text-[#00898A] tracking-wider uppercase block mb-3">Feedback Summary</span>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-emerald-600 mb-2">What You Did Well</h4>
                                                        <ul className="text-slate-600 text-xs space-y-1">
                                                            {sessionEvaluation.what_you_did_well.map((s, i) => <li key={i}>• {s}</li>)}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-amber-600 mb-2">Areas to Improve</h4>
                                                        <ul className="text-slate-600 text-xs space-y-1">
                                                            {sessionEvaluation.areas_to_improve.map((s, i) => <li key={i}>• {s}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}


                            {drawerTab === 'about' && (
                                <div className="overflow-y-auto max-h-full pr-1 space-y-6 text-slate-700 animate-[fadeIn_200ms_ease-in]">
                                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                        <strong className="font-semibold text-slate-800">LexiSpeak</strong> is built by the <strong className="font-semibold text-slate-800">LexiBot</strong> team to give you focused, real-time speaking practice that replaces old cue card and recording methods.
                                    </p>

                                    <div>
                                        <h3 className="text-[15px] font-bold text-slate-900 mb-2">Current Usage Limits</h3>
                                        <p className="text-xs text-slate-500 mb-3">
                                            We're using LexiCredits (LC) to manage usage during beta. Credits reset every Monday:
                                        </p>
                                        <div className="border border-slate-200/80 bg-[#F8FAFC]/50 rounded-2xl p-4 space-y-2.5">
                                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                <span><strong className="font-bold text-slate-800">Free:</strong> 20 LC per week</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                <span><strong className="font-bold text-slate-800">Writing:</strong> 20 LC per week (same as Free)</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                                <span><strong className="font-bold text-slate-800">Writing & Speaking (SW):</strong> Unlimited</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                                <span><strong className="font-bold text-slate-800">4-Skill:</strong> Unlimited</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-xs text-slate-600">
                                                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                                <span><strong className="font-bold text-slate-800">Guests:</strong> 0 LC — log in to practice</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 italic pt-2.5 mt-2 border-t border-slate-200/60 leading-normal">
                                                <strong className="font-semibold not-italic text-slate-500">Note:</strong> The Free/Writing beta allowance may be adjusted within 20-50 LC per week as we tune LexiSpeak during beta.
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[15px] font-bold text-slate-900 mb-3">What's Coming Next</h3>
                                        <div className="space-y-3">
                                            <div className="border border-slate-200/80 bg-white rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">LIVE</span>
                                                    <h4 className="text-xs font-bold text-slate-800">Phase 1: Core Speaking Practice (Now Live)</h4>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    We help you get familiar with real test formats and guide you on how to answer questions effectively.
                                                </p>
                                            </div>
                                            <div className="border-2 border-[#00B4B6] bg-white rounded-xl p-4 shadow-2xs">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="bg-[#00898A] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">BETA</span>
                                                    <h4 className="text-xs font-bold text-slate-900">Phase 2: Basic Scoring</h4>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    You'll get simple feedback on grammar, vocabulary, and coherence to help you improve your answers.
                                                </p>
                                            </div>
                                            <div className="border border-slate-200/80 bg-white rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">PLANNED</span>
                                                    <h4 className="text-xs font-bold text-slate-800">Phase 3: Pronunciation & Fluency</h4>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    We'll add tools to check your pronunciation and fluency, with actionable tips for better speaking.
                                                </p>
                                            </div>
                                            <div className="border border-slate-200/80 bg-white rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">FUTURE</span>
                                                    <h4 className="text-xs font-bold text-slate-800">Phase 4: Full Scoring</h4>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    Comprehensive scoring, including pronunciation and fluency, for a complete evaluation experience.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[15px] font-bold text-slate-900 mb-3">Help Us Improve</h3>
                                        <div className="border border-slate-200/80 bg-white rounded-2xl p-4">
                                            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                                                Got feedback, found a bug, or want a new feature? We'd love to hear from you.
                                            </p>
                                            <button
                                                onClick={() => window.open('https://forms.gle', '_blank')}
                                                className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold w-full py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                                            >
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                                Share Feedback
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Essential Settings — inline (scrollable) */}
                        <div className="mt-8 pt-6 border-t border-slate-100 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                <h3 className="text-[13px] font-semibold text-slate-700">Essential Settings</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <select className="w-full text-[12px] p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 outline-none hover:border-slate-300 transition-colors focus:ring-2 focus:ring-[#00B4B6]/20">
                                    <option>Random Topics</option>
                                    {PART1_TOPICS.map(t => <option key={t.id}>{t.label}</option>)}
                                </select>
                                <select value={targetBand} onChange={(e) => setTargetBand(e.target.value)} className="w-full text-[12px] p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 outline-none hover:border-slate-300 transition-colors focus:ring-2 focus:ring-[#00B4B6]/20">
                                    <option>Band 8.0+</option>
                                    <option>Band 7.5</option>
                                    <option>Band 6.5</option>
                                </select>
                                <select className="w-full text-[12px] p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 outline-none hover:border-slate-300 transition-colors focus:ring-2 focus:ring-[#00B4B6]/20">
                                    <option>Interactive Interview</option>
                                    <option>Self-Paced</option>
                                </select>
                                <select className="w-full text-[12px] p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 outline-none hover:border-slate-300 transition-colors focus:ring-2 focus:ring-[#00B4B6]/20">
                                    <option>English Global</option>
                                </select>
                            </div>
                        </div>
                        </div>
                    </aside>
                    {!drawerOpen && (
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#0F172A] hover:bg-slate-800 text-white px-2.5 py-4 rounded-l-xl font-medium text-xs tracking-wider [writing-mode:vertical-lr] shadow-lg transition-all flex items-center gap-2 z-30 cursor-pointer"
                        >
                            <span>Open Toolbox</span>
                            <svg className="w-4 h-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    )}
            </div>

            <style>{`
                @keyframes lexiLiquid {
                    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    50% { border-radius: 40% 60% 70% 30% / 50% 60% 40% 50%; }
                }
                @keyframes lexiBreath {
                    0%,100% { transform: scale(1.0); }
                    50% { transform: scale(1.04); }
                }
                @keyframes lexiShimmer {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes lexiGlow {
                    0% { color: #94A3B8; opacity: 0.6; }
                    100% { color: #0F172A; opacity: 1; }
                }
                @keyframes lexiSlideInRight {
                    0% { opacity: 0; transform: translateX(8px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
            `}</style>
        </div>
    );
};

export default LexiSpeakStudio;

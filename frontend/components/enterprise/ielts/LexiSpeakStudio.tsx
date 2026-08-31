import React, { useEffect, useRef, useState } from 'react';
import GrammarEvaluationCard from './GrammarEvaluationCard';

type ExamStage = 'preset_setup' | 'topic_picker' | 'cue_card_prep' | 'live_speaking' | 'evaluation_summary';
type PresetType = 'part1' | 'part2' | 'part3' | 'full_mock';
type OrbState = 'idle_pulse' | 'listening_ripple' | 'thinking_shimmer' | 'speaking_waveform';
type DrawerTab = 'quick_start' | 'qna' | 'scoring' | 'about';
type ChatRole = 'examiner' | 'user';

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
    { id: 'hometown', label: 'Hometown & Living', hint: 'Places & daily life', examinerPrompt: 'Let’s talk about where you live. Can you describe your hometown and what you like most about it?' },
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

const USER_SAMPLE_POOL: string[] = [
    'Well, I come from a fairly small coastal town, and what I appreciate most is the sense of community and the calm pace of life there.',
    'I’m currently studying software engineering, which I find fascinating because it combines logic with real-world problem solving.',
    'In my free time I usually read non-fiction and go running, as it helps me clear my head after a long day.',
    'The journey was truly unforgettable because the landscape changed dramatically and we met incredibly welcoming people.',
    'I believe technology is a ubiquitous part of modern life, and it has a profound effect on how we communicate and learn.',
];

const USER_TAGS_POOL: string[][] = [
    ['Good collocations used'],
    ['Hesitation detected at 0:14'],
    ['Strong topic development', 'Natural intonation'],
    ['Minor grammar slip', 'Clear examples given'],
    ['Confident delivery'],
];

const PRESETS: { id: PresetType; title: string; duration: string; badges: string[] }[] = [
    { id: 'part1', title: 'IELTS Speaking Part 1', duration: '5 min', badges: ['IELTS', 'Part 1'] },
    { id: 'part2', title: 'IELTS Speaking Part 2', duration: '3 min', badges: ['IELTS', 'Part 2'] },
    { id: 'part3', title: 'IELTS Speaking Part 3', duration: '5 min', badges: ['IELTS', 'Part 3'] },
    { id: 'full_mock', title: 'IELTS Full Mock Test', duration: '14 min', badges: ['IELTS', 'Full Test'] },
];

const SCORING = {
    overall: 7.5,
    pillars: [
        { key: 'fluency', label: 'Fluency & Coherence', score: 7.5, detail: 'Natural pace, slight self-correction on Part 3.' },
        { key: 'lexical', label: 'Lexical Resource', score: 8.0, detail: 'Used advanced vocabulary.' },
        { key: 'grammar', label: 'Grammatical Range & Accuracy', score: 7.0, detail: 'Good complex clauses.' },
        { key: 'pronunciation', label: 'Pronunciation', score: 7.5, detail: 'Clear rhythm and intonation.' },
    ],
    recommendations: [
        'Replace simple connectors with cohesive devices.',
        'Extend Part 3 answers with a reason + example.',
        'Practise conditionals and passive voice.',
        'Record and self-review to eliminate filler words.',
    ],
};

const PIXEL_TOPICS: { id: string; label: string; examinerPrompt: string }[] = [
    { id: 'random', label: 'Random Topics', examinerPrompt: 'Let’s begin with a few warm-up questions. Tell me a little about yourself and what you do in your free time.' },
    { id: 'hometown', label: 'Hometown', examinerPrompt: 'Let’s talk about where you live. Can you describe your hometown and what you like most about it?' },
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
                        <button onClick={() => setShowHint((v) => !v)} className="text-[12px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">💡 Show Hint</button>
                        <button onClick={() => setShowSample((v) => !v)} className="text-[12px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">🔀 Show Sample</button>
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
                    <button className="text-[12px] px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Correct</button>
                    <button className="text-[12px] px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">✨ Improve</button>
                    <button className="text-[12px] px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">⚡ Analyze</button>
                </div>
            </div>
        </div>
    );
};

const LexiSpeakStudio: React.FC<{ onTimer?: (s: number) => void; onActiveChange?: (active: boolean) => void }> = ({ onTimer, onActiveChange }) => {
    const [activeStage, setActiveStage] = useState<ExamStage>('preset_setup');
    const [activePreset, setActivePreset] = useState<PresetType>('part2');
    const [orbState, setOrbState] = useState<OrbState>('idle_pulse');
    const [drawerTab, setDrawerTab] = useState<DrawerTab>('quick_start');
    const [targetBand, setTargetBand] = useState<string>('Band 8.0+');
    const [isRecording, setIsRecording] = useState(false);
    const [showTranscript, setShowTranscript] = useState(true);
    const [cueCardTimer, setCueCardTimer] = useState(60);
    const [drawerOpen, setDrawerOpen] = useState(true);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [examinerStream, setExaminerStream] = useState<{ id: number; full: string; revealed: number } | null>(null);
    const [sessionElapsed, setSessionElapsed] = useState(0);
    const [stageRemaining, setStageRemaining] = useState(0);
    const [qIndex, setQIndex] = useState(0);
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

    const thinkTimer = useRef<number | null>(null);
    const cueTimer = useRef<number | null>(null);
    const mockTimers = useRef<number[]>([]);

    const schedule = (fn: () => void, delay: number) => {
        const id = window.setTimeout(fn, delay);
        mockTimers.current.push(id);
    };
    const clearMock = () => {
        mockTimers.current.forEach((id) => window.clearTimeout(id));
        mockTimers.current = [];
    };

    const pushExaminer = (text: string, part: 1 | 2 | 3) => {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        setMessages((prev) => [...prev, { id, role: 'examiner', part, text, ts: formatClock(sessionElapsed) }]);
        setExaminerStream({ id, full: text, revealed: 0 });
        setOrbState('speaking_waveform');
    };

    const pushUser = (text: string, part: 1 | 2 | 3) => {
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + Math.floor(Math.random() * 1000),
                role: 'user',
                part,
                text,
                ts: formatClock(sessionElapsed),
                tags: USER_TAGS_POOL[prev.length % USER_TAGS_POOL.length],
            },
        ]);
    };

    const endSession = () => {
        clearMock();
        setActiveStage('evaluation_summary');
        setIsRecording(false);
        setAiReplying(false);
        setOrbState('speaking_waveform');
    };

    const beginPart2Speak = () => {
        if (activeStage !== 'cue_card_prep') return;
        setActiveStage('live_speaking');
        setStageRemaining(120);
        const cue = selectedCue;
        pushExaminer(`Thank you. Now, please speak for up to two minutes on: ${cue.topic}. You should say: ${cue.prompts.join('; ')}.`, 2);
    };

    const startSession = (pixel?: { id: string; label: string; examinerPrompt: string }) => {
        clearMock();
        setMessages([]);
        setSessionElapsed(0);
        setQIndex(0);
        setDrawerTab('qna');
        const topic = pixel || selectedPixelTopic || PIXEL_TOPICS[0];
        if (activePreset === 'part2') {
            setCurrentPart(2);
            setSessionTopic(topic.label);
            setActiveStage('live_speaking');
            setStageRemaining(120);
            pushExaminer(`Please speak for up to two minutes on: ${topic.label}. You should say what it is, why it matters to you, and give a personal example to support your answer.`, 2);
        } else if (activePreset === 'part1') {
            setCurrentPart(1);
            setSessionTopic(topic.label);
            setActiveStage('live_speaking');
            setStageRemaining(300);
            pushExaminer(topic.examinerPrompt, 1);
        } else {
            setCurrentPart(3);
            setSessionTopic(topic.label);
            setActiveStage('live_speaking');
            setStageRemaining(300);
            pushExaminer(topic.examinerPrompt, 3);
        }
    };

    const scheduleNextQuestion = () => {
        if (qIndex >= 2) return;
        const next = qIndex + 1;
        setQIndex(next);
        const prompt = currentPart === 1 ? PART1_TOPICS[next % PART1_TOPICS.length].examinerPrompt : PART3_TOPICS[next % PART3_TOPICS.length].examinerPrompt;
        pushExaminer(prompt, currentPart);
    };

    const startRecording = () => {
        setIsRecording(true);
        setOrbState('listening_ripple');
    };
    const stopRecording = () => {
        if (!isRecording) return;
        setIsRecording(false);
        setOrbState('thinking_shimmer');
        setAiReplying(true);
        pushUser(USER_SAMPLE_POOL[messages.length % USER_SAMPLE_POOL.length], currentPart);
        if (thinkTimer.current) window.clearTimeout(thinkTimer.current);
        thinkTimer.current = window.setTimeout(() => {
            setOrbState('speaking_waveform');
            if (activePreset !== 'full_mock' && activeStage === 'live_speaking' && (currentPart === 1 || currentPart === 3)) {
                scheduleNextQuestion();
            }
        }, 1500);
    };

    const runFullMock = () => {
        clearMock();
        setMessages([]);
        setSessionElapsed(0);
        setQIndex(0);
        setDrawerTab('qna');
        setActivePreset('full_mock');
        setCurrentPart(1);
        setSessionTopic('Full Mock');
        setActiveStage('live_speaking');
        setStageRemaining(300);
        pushExaminer(PART1_TOPICS[0].examinerPrompt, 1);
        const beat = 14000;
        schedule(() => pushUser(USER_SAMPLE_POOL[0], 1), 6000);
        schedule(() => pushExaminer(PART1_TOPICS[1].examinerPrompt, 1), beat);
        schedule(() => pushUser(USER_SAMPLE_POOL[1], 1), beat + 6000);
        schedule(() => pushExaminer(PART1_TOPICS[2].examinerPrompt, 1), beat * 2);
        schedule(() => pushUser(USER_SAMPLE_POOL[2], 1), beat * 2 + 6000);
        schedule(() => {
            setCurrentPart(2);
            setActiveStage('cue_card_prep');
            setCueCardTimer(60);
            setStageRemaining(60);
        }, beat * 3);
        schedule(() => {
            setActiveStage('live_speaking');
            setStageRemaining(120);
            const cue = PART2_TOPICS[0];
            pushExaminer(`Now, please speak for up to two minutes on: ${cue.topic}. You should say: ${cue.prompts.join('; ')}.`, 2);
            schedule(() => pushUser(USER_SAMPLE_POOL[3], 2), 30000);
        }, beat * 3 + 60000);
        schedule(() => {
            setCurrentPart(3);
            setActiveStage('live_speaking');
            setStageRemaining(300);
            pushExaminer(PART3_TOPICS[0].examinerPrompt, 3);
            schedule(() => pushExaminer(PART3_TOPICS[1].examinerPrompt, 3), beat);
            schedule(() => pushUser(USER_SAMPLE_POOL[4 % USER_SAMPLE_POOL.length], 3), beat + 6000);
            schedule(() => pushExaminer(PART3_TOPICS[2].examinerPrompt, 3), beat * 2);
            schedule(() => endSession(), beat * 3);
        }, beat * 3 + 60000 + 120000);
    };

    // Spacebar push-to-talk
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code !== 'Space') return;
            const el = document.activeElement;
            if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.tagName === 'SELECT')) return;
            e.preventDefault();
            if (isRecording) return;
            startRecording();
        };
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code !== 'Space') return;
            e.preventDefault();
            stopRecording();
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            if (thinkTimer.current) window.clearTimeout(thinkTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording, activeStage, currentPart, qIndex, activePreset, messages.length]);

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
                        <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
                        LexiSpeak · AI Vocal Engine
                    </div>
                    {activeStage === 'evaluation_summary' && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#FAFCFF]/80 backdrop-blur-sm p-6">
                            <div className="w-full max-w-[520px] bg-white border border-slate-200 rounded-3xl shadow-xl p-8 text-center">
                                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-2">Session Complete</p>
                                <p className="text-4xl font-bold text-slate-800 mb-1">Band {SCORING.overall.toFixed(1)}</p>
                                <p className="text-[13px] text-slate-500 mb-6">Estimated IELTS Speaking score</p>
                                <div className="space-y-3 text-left">
                                    {SCORING.pillars.map((p) => (
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
                                <button onClick={() => { setActiveStage('preset_setup'); setActivePreset('part2'); }} className="mt-6 w-full py-3 rounded-xl bg-[#00898A] text-white text-[13px] font-semibold hover:bg-[#007074] transition-colors shadow-md">
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
                                {activeStage === 'cue_card_prep' ? (
                                    <>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Cue Card · Prep</p>
                                            <span className="text-[12px] font-mono text-amber-600 font-semibold">{formatClock(cueCardTimer)}</span>
                                        </div>
                                        <h3 className="text-[15px] font-semibold text-slate-800 mb-2">{selectedCue.topic}</h3>
                                        <ul className="space-y-1.5 mb-4">
                                            {selectedCue.prompts.map((p) => (
                                                <li key={p} className="text-[13px] text-slate-600 flex items-start gap-2">
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
                        )}
                    </div>
                    </div>

                    {/* Push-to-Talk Footer Control */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                        <button
                            onPointerDown={startRecording}
                            onPointerUp={stopRecording}
                            className={`px-8 py-3.5 rounded-[20px] font-medium text-[14px] text-slate-700 shadow-[0_4px_20px_rgb(0,0,0,0.05)] transition-all border border-white/50 bg-gradient-to-b from-white to-slate-100 ${
                                isRecording ? 'from-teal-400 to-teal-500 text-white border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.4)] scale-95' : 'hover:scale-[1.02]'
                            }`}
                        >
                            {isRecording ? 'Recording...' : aiReplying ? 'AI is Replying...' : (
                                <div className="flex items-center gap-2">
                                    Hold <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md text-[12px] font-mono mx-0.5 shadow-inner">Space</span> to Talk
                                </div>
                            )}
                        </button>
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
                            <DrawerPillButton tab="quick_start" label="≈ Quick Start" />
                            <DrawerPillButton tab="qna" label="💬 Q&A" />
                            <DrawerPillButton tab="scoring" label="📊 Scoring" />
                            <DrawerPillButton tab="about" label="✦ About" />
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
                                            <h3 className="text-[18px] font-bold text-slate-800">🔖 IELTS Speaking {activePreset === 'part2' ? 2 : activePreset === 'part3' ? 3 : 1} Topics</h3>
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
                                                        </div>
                                                        {isSel && (
                                                            <div className="mt-3 flex items-center justify-between">
                                                                <span className="text-[12px] font-medium text-slate-500 transition-all">🕒 {(PRESETS.find(p => p.id === activePreset)?.duration ?? '5 min')} min</span>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); startSession(t); }}
                                                                    className="px-5 py-2 rounded-xl bg-[#00898A] text-white text-sm font-semibold hover:bg-[#007576] transition-colors animate-[lexiSlideInRight_200ms_ease-out]"
                                                                >
                                                                    Start
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        PRESETS.map((p) => {
                                            const isSel = selectedPresetId === p.id;
                                            const isHov = hoveredPresetId === p.id && !isSel;
                                            return (
                                                <div
                                                    key={p.id}
                                                    onClick={() => { setSelectedPresetId(p.id); setActivePreset(p.id); }}
                                                    onMouseEnter={() => setHoveredPresetId(p.id)}
                                                    onMouseLeave={() => setHoveredPresetId(null)}
                                                    className={`w-full text-left rounded-2xl p-[18px] cursor-pointer transition-all relative overflow-hidden ${
                                                        isSel ? 'bg-[#DDF7F6] border-2 border-[#00B4B6]'
                                                        : isHov ? 'bg-[#DDF7F6]/70 border border-[#A5F0ED]'
                                                        : 'bg-[#F1F5F9]/70 border border-slate-200/60'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-[15px] font-semibold text-slate-800">{p.title}</span>
                                                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                                                            <svg className="w-3.5 h-3.5 text-fuchsia-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
                                                            {p.duration}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {p.badges.map((b) => (
                                                                <span key={b} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm">{b}</span>
                                                            ))}
                                                        </div>
                                                        {isSel && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); if (p.id === 'full_mock') runFullMock(); else { setActivePreset(p.id); setSelectedPixelTopic(PIXEL_TOPICS[0]); setSelectedTopicLabel(PIXEL_TOPICS[0].label); setActiveStage('topic_picker'); } }}
                                                                className="bg-[#00898A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#007374] shadow-sm transition-all duration-200 animate-[lexiSlideInRight_200ms_ease-out]"
                                                            >
                                                                {p.id === 'full_mock' ? 'Start Mock' : 'Choose Topic'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {/* ... Other tabs ... */}
                            {drawerTab === 'qna' && (
                                <div className="space-y-4 pb-2">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col h-full min-h-[420px] justify-between p-4 bg-white">
                                            <div className="flex flex-col items-center justify-center flex-1 py-12 px-4 text-center">
                                                <div className="bg-[#F0F4F8] p-4 rounded-2xl mb-4 text-[#475569] flex items-center justify-center">
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 20.105V4.875A1.875 1.875 0 015.625 3h12.75A1.875 1.875 0 0120.25 4.875v10.5A1.875 1.875 0 0118.375 17.25H7.5l-3.75 2.855z" /></svg>
                                                </div>
                                                <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5"><span className="text-[#00898A] font-semibold">Select a topic</span> or hold <kbd className="px-2 py-0.5 text-[11px] bg-white border border-slate-200 rounded-md font-mono text-slate-500 shadow-xs">space</kbd> to start.</p>
                                                <p className="text-xs text-slate-400 mt-1">Questions and transcripts will appear here.</p>
                                            </div>
                                            <div className="pt-4 mt-auto">
                                                <button disabled className="w-full py-3 bg-[#94A3B8] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-90">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                                    Check Score (beta)
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        (() => {
                                            let q = 0;
                                            const attemptCount: Record<number, number> = {};
                                            const cards = messages.map((m) => {
                                                if (m.role === 'examiner') {
                                                    q += 1;
                                                    return { m, qNum: q, attempt: 0 };
                                                }
                                                attemptCount[q] = (attemptCount[q] || 0) + 1;
                                                return { m, qNum: q, attempt: attemptCount[q] };
                                            });
                                            return (
                                                <>
                                                    {cards.map(({ m, qNum, attempt }) => (
                                                        <QAMessageCard
                                                            key={m.id}
                                                            message={m}
                                                            qNum={qNum}
                                                            attempt={attempt}
                                                            isStreaming={!!examinerStream && examinerStream.id === m.id}
                                                            revealed={examinerStream?.revealed ?? 0}
                                                            onCheckScore={() => setDrawerTab('scoring')}
                                                        />
                                                    ))}
                                                    <div className="sticky bottom-0 mt-4 -mx-2 px-2 pt-3 bg-gradient-to-t from-white via-white to-transparent flex items-center gap-2">
                                                        <button onClick={() => {}} className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors">⬇ Download</button>
                                                        <button onClick={() => setDrawerTab('scoring')} className="flex-1 py-2.5 rounded-xl bg-[#00898A] text-white text-[13px] font-semibold hover:bg-[#007576] transition-colors">📊 Check Score (beta)</button>
                                                    </div>
                                                </>
                                            );
                                        })()
                                    )}
                                </div>
                            )}
                            
                            {drawerTab === 'scoring' && (
                                <div className="space-y-4">
                                    {!showSampleResult ? (
                                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-full min-h-[400px]">
                                            <div className="bg-[#EEF2F6] p-4 rounded-full mb-4 text-[#475569] flex items-center justify-center">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                                            </div>
                                            <h3 className="text-[17px] font-bold text-slate-800 mb-2">Complete your answers, then check your score.</h3>
                                            <p className="text-xs text-slate-400 max-w-[280px] mb-6 leading-relaxed">Your AI Quick Check, overall score, and criteria feedback will appear here.</p>
                                            <button onClick={() => setShowSampleResult(true)} className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                                Preview sample result
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="overflow-y-auto max-h-full pr-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="text-[11px] font-bold text-[#00898A] tracking-wider uppercase block">SCORING</span>
                                                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">IELTS Speaking Score</h2>
                                                    <p className="text-xs text-slate-500 mt-1 mb-4">Review your estimated band and criterion evidence below.</p>
                                                </div>
                                                <span className="bg-[#F1F5F9] text-slate-600 text-xs font-medium px-3 py-1 rounded-full">Preview</span>
                                            </div>

                                            <div className="border border-slate-200/80 bg-white rounded-2xl p-4.5 mb-4 shadow-2xs">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-800 text-sm">AI Quick Check</span>
                                                    <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium ml-2">6 answers checked</span>
                                                    <div className="bg-[#00898A] text-white p-1 rounded-full text-xs ml-auto"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed mt-2.5">Your answers are ready for a full scoring pass. The sample includes enough connected responses to estimate overall performance and criterion evidence.</p>
                                            </div>

                                            <div className="border-2 border-[#00B4B6] bg-white rounded-2xl p-4.5 mb-4">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-900 text-base">Overall Band Score</span>
                                                    <span className="bg-[#00898A] text-white text-sm font-bold px-3 py-1 rounded-lg ml-auto">6.5</span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed mt-2">Based on LEXI Analysis Algorithm, adjusted for IELTS Speaking, with possible +/-0.5 discrepancy. Scoring is currently in beta, so results may change as we improve the system. <button className="text-[#00898A] text-xs font-medium underline block mt-2 hover:opacity-80">Report a bug or request a feature</button></p>
                                                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
                                                    <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">Fluency and Coherence <strong className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">7.0</strong></span>
                                                    <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">Lexical Resource <strong className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">6.0</strong></span>
                                                    <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5">Grammatical Range and Accuracy <strong className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">7.0</strong></span>
                                                </div>
                                            </div>

                                            <div className="border border-blue-500/80 bg-white rounded-2xl p-5 shadow-sm transition-all mb-4">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-900 text-sm">Fluency and Coherence</span>
                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2.5 py-1 rounded-lg ml-auto">7.0</span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-3">Your answers are mostly relevant, logically connected, and developed enough for a clear IELTS response.</p>
                                                <button onClick={() => setShowFluencyDetails(!showFluencyDetails)} className="w-full text-right text-[#3B82F6] text-xs font-medium hover:underline flex items-center justify-end gap-1 mt-3">
                                                    <span>{showFluencyDetails ? '∧ Hide details' : '∨ Show details'}</span>
                                                </button>

                                                {showFluencyDetails && (
                                                    <div className="relative mt-4 pl-8 space-y-4">
                                                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />

                                                        {/* Relevance */}
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-800">Relevance</span>
                                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2 py-0.5 rounded-md">8.0</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">Most answers respond directly to the question and stay on topic.</p>
                                                                <button onClick={() => setShowRelevanceProof(!showRelevanceProof)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{showRelevanceProof ? '∧ Hide proof' : '∨ Show proof'}</button>

                                                                {showRelevanceProof && (
                                                                    <div className="mt-3 space-y-3">
                                                                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex gap-8">
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average Rating</span><span className="text-lg font-bold text-slate-900">4.7/5</span></div>
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Questions</span><span className="text-lg font-bold text-slate-900">3</span></div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                                                            <span className="text-[11px] text-slate-400">Rating</span>
                                                                            {(['ALL', 'EXCELLENT', 'STRONG'] as const).map((r) => (
                                                                                <button key={r} onClick={() => setRatingFilter(r)} className={`rounded-full px-2.5 py-1 font-medium transition-colors ${ratingFilter === r ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{r} {r === 'ALL' ? '3' : r === 'EXCELLENT' ? '2' : '1'}</button>
                                                                            ))}
                                                                            <span className="bg-slate-100 text-slate-400 rounded-full px-2.5 py-1">Clear 0</span>
                                                                            <span className="bg-slate-100 text-slate-400 rounded-full px-2.5 py-1">Developing 0</span>
                                                                            <span className="bg-slate-100 text-slate-400 rounded-full px-2.5 py-1">Limited 0</span>
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                <div className="flex items-center gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q1</span><span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Excellent</span></div>
                                                                                <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">Can you describe your hometown and what you like most about it?</div></div>
                                                                                <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">I grew up in a mid-sized coastal city. It is not very famous, but it has a calm beach, friendly neighborhoods, and enough small cafes to make daily life comfortable.</div></div>
                                                                            </div>
                                                                            <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                <div className="flex items-center gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q2</span><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Strong</span></div>
                                                                                <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">What are the advantages and disadvantages of living in a big city?</div></div>
                                                                                <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">A big city gives people better job opportunities and access to entertainment. However, it can also be stressful because transport is crowded and housing is expensive.</div></div>
                                                                            </div>
                                                                            <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                <div className="flex items-center gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q3</span><span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Excellent</span></div>
                                                                                <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">Do you think technology has made people's lives better or worse?</div></div>
                                                                                <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">Overall, I think technology has improved life because information is easier to find and communication is faster. That said, people should manage screen time more carefully.</div></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Logical Sequencing */}
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-800">Logical Sequencing</span>
                                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2 py-0.5 rounded-md">7.0</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">Ideas are sequenced clearly, with occasional places where transitions could be smoother.</p>
                                                                <button onClick={() => setShowLogicalProof(!showLogicalProof)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{showLogicalProof ? '∧ Hide proof' : '∨ Show proof'}</button>

                                                                {showLogicalProof && (
                                                                    <div className="mt-3 space-y-3">
                                                                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex gap-8">
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average Rating</span><span className="text-lg font-bold text-slate-900">4.3/5</span></div>
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Questions</span><span className="text-lg font-bold text-slate-900">3</span></div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                                                            <span className="text-[11px] text-slate-400">Rating</span>
                                                                            {(['ALL', 'EXCELLENT', 'STRONG'] as const).map((r) => (
                                                                                <button key={r} onClick={() => setRatingFilter(r)} className={`rounded-full px-2.5 py-1 font-medium transition-colors ${ratingFilter === r ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{r} {r === 'ALL' ? '3' : r === 'EXCELLENT' ? '1' : '2'}</button>
                                                                            ))}
                                                                            <span className="bg-slate-100 text-slate-400 rounded-full px-2.5 py-1">Clear 0</span>
                                                                            <span className="bg-slate-100 text-slate-400 rounded-full px-2.5 py-1">Developing 0</span>
                                                                            <span className="bg-slate-100 text-slate-400 rounded-full px-2.5 py-1">Limited 0</span>
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                <div className="flex items-center gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q1</span><span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Strong</span></div>
                                                                                <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">Can you describe your hometown and what you like most about it?</div></div>
                                                                                <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">I grew up in a mid-sized coastal city. It is not very famous, but it has a calm beach, friendly neighborhoods, and enough small cafes to make daily life comfortable.</div></div>
                                                                            </div>
                                                                            <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                <div className="flex items-center gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q2</span><span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Strong</span></div>
                                                                                <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">What are the advantages and disadvantages of living in a big city?</div></div>
                                                                                <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">A big city gives people better job opportunities and access to entertainment. However, it can also be stressful because transport is crowded and housing is expensive.</div></div>
                                                                            </div>
                                                                            <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                <div className="flex items-center gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q3</span><span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Excellent</span></div>
                                                                                <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">Do you think technology has made people's lives better or worse?</div></div>
                                                                                <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">Overall, I think technology has improved life because information is easier to find and communication is faster. That said, people should manage screen time more carefully.</div></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Topic Development */}
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-800">Topic Development</span>
                                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2 py-0.5 rounded-md">7.0</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">Several answers include reasons and contrast, though some points could be extended with examples.</p>
                                                                <button onClick={() => setShowTopicProof(!showTopicProof)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{showTopicProof ? '∧ Hide proof' : '∨ Show proof'}</button>

                                                                {showTopicProof && (
                                                                    <div className="mt-3 space-y-3">
                                                                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex gap-8">
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average Rating</span><span className="text-lg font-bold text-slate-900">3.7/5</span></div>
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Questions</span><span className="text-lg font-bold text-slate-900">3</span></div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                                                            <span className="text-[11px] text-slate-400">Rating</span>
                                                                            <span className="bg-slate-900 text-white rounded-full px-2.5 py-1 font-medium">ALL 3</span>
                                                                            <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">Excellent 0</span>
                                                                            <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">Strong 2</span>
                                                                            <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">Clear 1</span>
                                                                            <span className="bg-slate-100 text-slate-400 rounded-full px-2.5 py-1">Developing 0</span>
                                                                            <span className="bg-slate-100 text-slate-400 rounded-full px-2.5 py-1">Limited 0</span>
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                <div className="flex items-center gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q1</span><span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Strong</span></div>
                                                                                <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">Can you describe your hometown and what you like most about it?</div></div>
                                                                                <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">I grew up in a mid-sized coastal city. It is not very famous, but it has a calm beach, friendly neighborhoods, and enough small cafes to make daily life comfortable.</div></div>
                                                                            </div>
                                                                            <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                <div className="flex items-center gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q2</span><span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">Clear</span></div>
                                                                                <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">What are the advantages and disadvantages of living in a big city?</div></div>
                                                                                <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">A big city gives people better job opportunities and access to entertainment. However, it can also be stressful because transport is crowded and housing is expensive.</div></div>
                                                                            </div>
                                                                            <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                                                                <div className="flex items-center gap-2 mb-2"><span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Q3</span><span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Strong</span></div>
                                                                                <div className="flex items-start gap-2 mb-2"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">Q</span><div className="bg-blue-50 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">Do you think technology has made people's lives better or worse?</div></div>
                                                                                <div className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span><div className="bg-white border border-slate-100 text-[11px] text-slate-700 rounded-xl rounded-tl-sm px-3 py-2 leading-relaxed">Overall, I think technology has improved life because information is easier to find and communication is faster. That said, people should manage screen time more carefully.</div></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Cohesive Devices */}
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-800">Cohesive Devices</span>
                                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2 py-0.5 rounded-md">6.0</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">Cohesive devices are varied enough to connect reasons, contrast, and additions.</p>
                                                                <button onClick={() => setShowCohesiveProof(!showCohesiveProof)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{showCohesiveProof ? '∧ Hide proof' : '∨ Show proof'}</button>

                                                                {showCohesiveProof && (
                                                                    <div className="mt-3 space-y-3">
                                                                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex gap-8">
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Devices</span><span className="text-lg font-bold text-slate-900">7</span></div>
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Categories</span><span className="text-lg font-bold text-slate-900">4</span></div>
                                                                        </div>
                                                                        <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/30 flex flex-col gap-3">
                                                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Devices Found</span>
                                                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                                                <span className="text-xs text-slate-600 font-medium mr-2 inline-block">Type</span>
                                                                                <span className="bg-slate-900 text-white rounded-full px-2.5 py-1 text-xs font-medium">All 7</span>
                                                                                <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs">Reason 2</span>
                                                                                <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs">Contrast 3</span>
                                                                                <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs">Addition 1</span>
                                                                                <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs">Summary 1</span>
                                                                            </div>
                                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">because x2</span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">but</span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">and</span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">however</span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">overall</span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">that said</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="border border-blue-500 bg-white rounded-2xl p-5 shadow-sm transition-all mt-6 mb-4">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-900 text-sm">Lexical Resource</span>
                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2.5 py-1 rounded-lg ml-auto">6.0</span>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-3">Your vocabulary is flexible enough for common IELTS topics. You include several precise topic words, with only minor word-choice limitations.</p>
                                                <div className="flex flex-wrap gap-3 mt-4 mb-4">
                                                    <span className="text-sm text-slate-600">Lexical Diversity <span className="border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 ml-1">6.0</span></span>
                                                    <span className="text-sm text-slate-600">Advanced Vocabulary <span className="border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 ml-1">6.0</span></span>
                                                    <span className="text-sm text-slate-600">Multi-word Expression Use <span className="border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 ml-1">7.0</span></span>
                                                    <span className="text-sm text-slate-600">Advanced Expression Level <span className="border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 ml-1">6.0</span></span>
                                                    <span className="text-sm text-slate-600">Lexical Accuracy <span className="border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 ml-1">7.0</span></span>
                                                </div>
                                                <button onClick={() => setShowLexicalDetails(!showLexicalDetails)} className="w-full text-right text-[#3B82F6] text-xs font-medium hover:underline flex items-center justify-end gap-1 mt-3">
                                                    <span>{showLexicalDetails ? '∧ Hide details' : '∨ Show details'}</span>
                                                </button>

                                                {showLexicalDetails && (
                                                    <div className="relative mt-4 pl-8 space-y-4">
                                                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />

                                                        {/* Lexical Diversity */}
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-800">Lexical Diversity</span>
                                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2 py-0.5 rounded-md">6.0</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">Your word choice shows good variety and avoids heavy repetition across the sample answers.</p>
                                                                <button onClick={() => setShowDiversityProof(!showDiversityProof)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{showDiversityProof ? '∧ Hide proof' : '∨ Show proof'}</button>

                                                                {showDiversityProof && (
                                                                    <div className="mt-3 space-y-3">
                                                                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex gap-8">
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Variety</span><span className="text-lg font-bold text-slate-900">62%</span></div>
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Unique</span><span className="text-lg font-bold text-slate-900">82</span></div>
                                                                            <div><span className="text-[10px] text-slate-400 uppercase tracking-wider block">Counted</span><span className="text-lg font-bold text-slate-900">132</span></div>
                                                                        </div>
                                                                        <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/30">
                                                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Repeated Words</span>
                                                                            <div className="flex gap-2 mt-3">
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">city<span className="text-slate-400 ml-1">3x</span></span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">technology<span className="text-slate-400 ml-1">2x</span></span>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-sm text-slate-500 mt-4">Most repeated words are topic words, so they do not strongly weaken the answer.</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Advanced Vocabulary */}
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-800">Advanced Vocabulary</span>
                                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2 py-0.5 rounded-md">6.0</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">You use several higher-value words accurately in context.</p>
                                                                <button onClick={() => setShowAdvVocabProof(!showAdvVocabProof)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{showAdvVocabProof ? '∧ Hide proof' : '∨ Show proof'}</button>

                                                                {showAdvVocabProof && (
                                                                    <div className="mt-3">
                                                                        <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/30">
                                                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Advanced Words Found</span>
                                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">opportunities</span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">accessible</span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">perspective</span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">significantly</span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs">drawbacks</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Multi-word Expression Use */}
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-800">Multi-word Expression Use</span>
                                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2 py-0.5 rounded-md">7.0</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">You include useful multi-word expressions that make the answers sound more natural.</p>
                                                                <button onClick={() => setShowMultiWordProof(!showMultiWordProof)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{showMultiWordProof ? '∧ Hide proof' : '∨ Show proof'}</button>

                                                                {showMultiWordProof && (
                                                                    <div className="mt-3">
                                                                        <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/30">
                                                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expressions Found</span>
                                                                            <div className="flex items-center gap-2 text-xs text-slate-600 mt-3">
                                                                                <span className="text-xs text-slate-600 font-medium mr-2 inline-block">Type</span>
                                                                                <span className="bg-slate-900 text-white rounded-full px-2.5 py-1 text-xs font-medium">All 3</span>
                                                                                <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs">Discourse phrase 1</span>
                                                                                <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs">Idiom 1</span>
                                                                                <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs">Fixed expression 1</span>
                                                                            </div>
                                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs flex items-center">That said <span className="text-blue-600/70 text-[10px] ml-1.5">Discourse phrase</span></span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs flex items-center">clear my head <span className="text-purple-600/70 text-[10px] ml-1.5">Idiom</span></span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs flex items-center">worth considering <span className="text-emerald-600/70 text-[10px] ml-1.5">Fixed expression</span></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Advanced Expression Level */}
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-800">Advanced Expression Level</span>
                                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2 py-0.5 rounded-md">6.0</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">Some expressions are advanced enough for a stronger IELTS response, especially when used to qualify opinions.</p>
                                                                <button onClick={() => setShowAdvExpProof(!showAdvExpProof)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{showAdvExpProof ? '∧ Hide proof' : '∨ Show proof'}</button>

                                                                {showAdvExpProof && (
                                                                    <div className="mt-3">
                                                                        <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/30">
                                                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Advanced Expressions Found</span>
                                                                            <div className="flex items-center gap-2 text-xs text-slate-600 mt-3">
                                                                                <span className="text-xs text-slate-600 font-medium mr-2 inline-block">Type</span>
                                                                                <span className="bg-slate-900 text-white rounded-full px-2.5 py-1 text-xs font-medium">All 2</span>
                                                                                <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs">Discourse phrase 1</span>
                                                                                <span className="bg-slate-100 text-slate-600 rounded-full px-2.5 py-1 text-xs">Fixed expression 1</span>
                                                                            </div>
                                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs flex items-center">That said <span className="text-blue-600/70 text-[10px] ml-1.5">Discourse phrase</span></span>
                                                                                <span className="border border-slate-200 bg-white text-slate-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-2xs flex items-center">worth considering <span className="text-emerald-600/70 text-[10px] ml-1.5">Fixed expression</span></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Lexical Accuracy */}
                                                        <div className="relative">
                                                            <div className="absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 border-slate-300 bg-white" />
                                                            <div className="border border-slate-200 bg-white rounded-xl p-4 shadow-sm">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-bold text-slate-800">Lexical Accuracy</span>
                                                                    <span className="border border-[#3B82F6] text-[#3B82F6] font-bold text-xs px-2 py-0.5 rounded-md">7.0</span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">No critical word-choice errors were found in the sample answers.</p>
                                                                <button onClick={() => setShowLexAccuracyProof(!showLexAccuracyProof)} className="text-[#3B82F6] text-[11px] font-medium hover:underline">{showLexAccuracyProof ? '∧ Hide proof' : '∨ Show proof'}</button>

                                                                {showLexAccuracyProof && (
                                                                    <div className="mt-3 space-y-3">
                                                                        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex justify-between items-center">
                                                                            <span className="text-sm font-medium text-slate-600">Error rate</span>
                                                                            <span className="text-lg font-bold text-slate-900">0%</span>
                                                                        </div>
                                                                        <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/30">
                                                                            <p className="text-sm text-slate-600">No critical word-choice errors found.</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <GrammarEvaluationCard rangeScore={7.0} accuracyScore={6.0} overallScore={7.0} />

                                            <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4.5 mb-4">
                                                <div className="flex items-center">
                                                    <span className="font-bold text-slate-800 text-sm">Feedback preview</span>
                                                    <span className="bg-slate-200/70 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium ml-2">Demo only</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2 mb-4 leading-relaxed">This preview keeps the feedback and download actions visible in the sample state, but the real completed-result flow uses the polished controls above.</p>
                                                <button className="bg-[#475569] hover:bg-[#334155] text-white w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 mb-2 transition-all">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                                                    Get clearer AI feedback
                                                </button>
                                                <button className="bg-white border border-slate-200/80 text-slate-700 w-full py-2.5 rounded-xl font-medium text-xs hover:bg-slate-50 transition-all flex items-center justify-center">Download score (.docx)</button>
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
                                        <div className="border border-slate-200/80 bg-white rounded-2xl p-4.5">
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

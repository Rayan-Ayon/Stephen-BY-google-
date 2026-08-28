
import React, { useEffect, useRef, useState } from 'react';

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
    { id: 'part1', title: 'IELTS Speaking Part 1', duration: '⏱️ 5 min', badges: ['IELTS', 'Part 1'] },
    { id: 'part2', title: 'IELTS Speaking Part 2', duration: '⏱️ 3 min', badges: ['IELTS', 'Part 2'] },
    { id: 'part3', title: 'IELTS Speaking Part 3', duration: '⏱️ 5 min', badges: ['IELTS', 'Part 3'] },
    { id: 'full_mock', title: 'IELTS Full Mock Test', duration: '⏱️ 14 min', badges: ['IELTS', 'Full Test'] },
];

const SCORING = {
    overall: 7.5,
    pillars: [
        { key: 'fluency', label: 'Fluency & Coherence', score: 7.5, detail: 'Natural pace, slight self-correction on Part 3.' },
        { key: 'lexical', label: 'Lexical Resource', score: 8.0, detail: 'Used advanced vocabulary ("ubiquitous", "profound effect", "pivot").' },
        { key: 'grammar', label: 'Grammatical Range & Accuracy', score: 7.0, detail: 'Good complex clauses; minor preposition tense errors.' },
        { key: 'pronunciation', label: 'Pronunciation', score: 7.5, detail: 'Clear rhythm and intonation with accent clarity.' },
    ],
    recommendations: [
        'Replace simple connectors ("and", "but") with cohesive devices ("moreover", "nevertheless").',
        'Extend Part 3 answers with a reason + example to reach Band 8.0+ depth.',
        'Practise conditionals and passive voice to lift Grammatical Range.',
        'Record and self-review to eliminate filler words ("um", "basically").',
    ],
};

const formatClock = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const LexiOrb: React.FC<{ state: OrbState }> = ({ state }) => {
    const base = 'relative w-[280px] h-[280px] transition-all duration-700 will-change-transform';
    const gradient = 'bg-[radial-gradient(circle_at_35%_35%,#00F5A0,#00D2FF,#0072FF)]';
    const morph = 'rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-[lexiMorph_8s_ease-in-out_infinite]';

    const stateClass: Record<OrbState, string> = {
        idle_pulse: 'animate-[lexiBreath_3s_ease-in-out_infinite]',
        listening_ripple: 'scale-110',
        thinking_shimmer: 'animate-[lexiShimmer_750ms_linear_infinite] opacity-90',
        speaking_waveform: 'drop-shadow-[0_0_35px_rgba(0,210,255,0.4)]',
    };

    return (
        <div className="relative flex items-center justify-center">
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

const LexiSpeakStudio: React.FC = () => {
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
        setOrbState('speaking_waveform');
    };

    const beginPart2Speak = () => {
        if (activeStage !== 'cue_card_prep') return;
        setActiveStage('live_speaking');
        setStageRemaining(120);
        const cue = selectedCue;
        pushExaminer(`Thank you. Now, please speak for up to two minutes on: ${cue.topic}. You should say: ${cue.prompts.join('; ')}.`, 2);
    };

    const startSession = () => {
        clearMock();
        setMessages([]);
        setSessionElapsed(0);
        setQIndex(0);
        if (activePreset === 'part2') {
            setCurrentPart(2);
            setSessionTopic(selectedCue.topic);
            setActiveStage('cue_card_prep');
            setCueCardTimer(60);
            setStageRemaining(60);
        } else if (activePreset === 'part1') {
            setCurrentPart(1);
            setSessionTopic(selectedTopicLabel || PART1_TOPICS[0].label);
            setActiveStage('live_speaking');
            setStageRemaining(300);
            pushExaminer(PART1_TOPICS[0].examinerPrompt, 1);
        } else {
            setCurrentPart(3);
            setSessionTopic(selectedTopicLabel || PART3_TOPICS[0].label);
            setActiveStage('live_speaking');
            setStageRemaining(300);
            pushExaminer(PART3_TOPICS[0].examinerPrompt, 3);
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

    // Session elapsed clock
    useEffect(() => {
        if (activeStage !== 'live_speaking') return;
        const id = window.setInterval(() => setSessionElapsed((e) => e + 1), 1000);
        return () => window.clearInterval(id);
    }, [activeStage]);

    const centerBanner = (() => {
        if (activeStage === 'cue_card_prep') return 'PART 2: CUE CARD';
        if (activeStage === 'live_speaking') {
            if (currentPart === 1) return `PART 1: ${sessionTopic.toUpperCase()}`;
            if (currentPart === 2) return 'PART 2: LONG TURN';
            if (currentPart === 3) return `PART 3: ${sessionTopic.toUpperCase()}`;
        }
        return null;
    })();

    const lastMsg = messages[messages.length - 1];
    const renderMsgText = (m: ChatMessage) => {
        if (m.role === 'examiner' && examinerStream && examinerStream.id === m.id) {
            const words = m.text.split(' ');
            const shown = words.slice(0, examinerStream.revealed).join(' ');
            return examinerStream.revealed < words.length ? `${shown} ▌` : shown;
        }
        return m.text;
    };

    const DrawerPillButton: React.FC<{ tab: DrawerTab; icon: string; label: string }> = ({ tab, icon, label }) => (
        <button
            onClick={() => setDrawerTab(tab)}
            className={`flex-1 px-2 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                drawerTab === tab ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="flex-1 bg-[#FAFAFA] dark:bg-[#080808] relative overflow-hidden flex">
            {/* Center Ambient Canvas */}
            <div className="flex-1 relative flex flex-col items-center justify-center px-8 min-w-0">
                {centerBanner && (
                    <div className="mb-4 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                        {centerBanner}
                    </div>
                )}

                <LexiOrb state={orbState} />

                {/* Cue Card / Transcript Card */}
                <div className="mt-10 w-full max-w-lg">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <button
                            onClick={() => setOrbState((s) => (s === 'speaking_waveform' ? 'idle_pulse' : 'speaking_waveform'))}
                            className="w-10 h-10 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center hover:scale-105 transition-all"
                            aria-label="Play"
                        >
                            ▶
                        </button>
                        <button
                            onClick={() => setShowTranscript((v) => !v)}
                            className="px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-[12px] font-medium text-neutral-700 dark:text-neutral-200 shadow-md transition-all"
                        >
                            {showTranscript ? 'Hide last message ▲' : 'Show last message ▼'}
                        </button>
                    </div>

                    {activeStage === 'cue_card_prep' ? (
                        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">Cue Card · Prep {formatClock(cueCardTimer)}</p>
                                <span className="text-[11px] font-mono text-amber-600">{formatClock(cueCardTimer)}</span>
                            </div>
                            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">{selectedCue.topic}</h3>
                            <ul className="space-y-1.5 mb-4">
                                {selectedCue.prompts.map((p) => (
                                    <li key={p} className="text-sm text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                                        <span className="text-cyan-500/70 mt-0.5">•</span>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={beginPart2Speak}
                                className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-500 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                            >
                                Begin Speaking ➔
                            </button>
                        </div>
                    ) : (
                        showTranscript && (
                            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm transition-all">
                                {lastMsg ? (
                                    <>
                                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                                            {lastMsg.role === 'examiner' ? `AI Examiner · ${lastMsg.ts}` : `You · ${lastMsg.ts}`}
                                        </p>
                                        <p className="text-sm text-neutral-800 dark:text-neutral-100 leading-relaxed">{renderMsgText(lastMsg)}</p>
                                    </>
                                ) : (
                                    <p className="text-sm text-neutral-500">Press and hold Space (or the button) to begin your response.</p>
                                )}
                            </div>
                        )
                    )}
                </div>

                {/* Session clock */}
                {(activeStage === 'live_speaking' || activeStage === 'cue_card_prep') && (
                    <div className="mt-4 text-[11px] font-mono text-neutral-500">
                        Stage Time {formatClock(stageRemaining)} · Session {formatClock(sessionElapsed)}
                    </div>
                )}

                {/* Push-to-Talk Control Bar */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
                    <button
                        onPointerDown={startRecording}
                        onPointerUp={stopRecording}
                        className={`px-8 py-3.5 rounded-2xl font-medium text-neutral-700 dark:text-neutral-200 shadow-md transition-all border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 ${
                            isRecording ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'hover:scale-[1.02]'
                        }`}
                    >
                        {isRecording ? '● Recording… Release to Stop' : 'Hold Space to Talk'}
                    </button>
                </div>
            </div>

            {/* Right Floating Practice Drawer */}
            {drawerOpen ? (
                <aside className="absolute top-4 right-4 bottom-4 w-[420px] bg-white/95 dark:bg-[#0D0D0D]/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col z-20">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="flex items-center gap-2 text-[11px] font-mono px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600">
                            FREE | 19 LC / 20 LC
                        </span>
                        <div className="flex items-center gap-1">
                            <button className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors" aria-label="Expand">↗</button>
                            <button onClick={() => setDrawerOpen(false)} className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-red-500 transition-colors" aria-label="Close">✕</button>
                        </div>
                    </div>

                    {/* Nav Switcher */}
                    <div className="flex items-center gap-1 mb-5 bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-1">
                        <DrawerPillButton tab="quick_start" icon="🎛️" label="Quick Start" />
                        <DrawerPillButton tab="qna" icon="💬" label="Q&A" />
                        <DrawerPillButton tab="scoring" icon="📊" label="Scoring" />
                        <DrawerPillButton tab="about" icon="ℹ️" label="About" />
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                        {/* Quick Start */}
                        {drawerTab === 'quick_start' && (
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">Choose IELTS Format</p>
                                {PRESETS.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => { setActivePreset(p.id); if (p.id === 'full_mock') runFullMock(); else setActiveStage('topic_picker'); }}
                                        className={`w-full text-left rounded-2xl border p-4 transition-all ${
                                            activePreset === p.id ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-500/5' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{p.title}</span>
                                            <span className="text-[11px] font-mono text-neutral-500">{p.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            {p.badges.map((b) => (
                                                <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500">{b}</span>
                                            ))}
                                        </div>
                                        {p.id === 'full_mock' ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); runFullMock(); }}
                                                className="w-full py-2 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-500 transition-colors"
                                            >
                                                🚀 Start Full Mock
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActivePreset(p.id); setActiveStage('topic_picker'); }}
                                                className="w-full py-2 rounded-lg bg-cyan-500 text-white text-[11px] font-semibold hover:bg-cyan-400 transition-colors"
                                            >
                                                Choose Topic
                                            </button>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Topic Picker */}
                        {drawerTab === 'quick_start' && activeStage === 'topic_picker' && (
                            <div className="space-y-3 mt-4">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
                                    Select {activePreset === 'part2' ? 'Part 2 Cue Card' : activePreset === 'part1' ? 'Part 1 Topic' : 'Part 3 Topic'}
                                </p>
                                {activePreset === 'part1' && PART1_TOPICS.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTopicLabel(t.label)}
                                        className={`w-full text-left rounded-xl border p-3 transition-all ${selectedTopicLabel === t.label ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'}`}
                                    >
                                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{t.label}</span>
                                        <span className="block text-[11px] text-neutral-500">{t.hint}</span>
                                    </button>
                                ))}
                                {activePreset === 'part3' && PART3_TOPICS.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedTopicLabel(t.label)}
                                        className={`w-full text-left rounded-xl border p-3 transition-all ${selectedTopicLabel === t.label ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'}`}
                                    >
                                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{t.label}</span>
                                        <span className="block text-[11px] text-neutral-500">{t.hint}</span>
                                    </button>
                                ))}
                                {activePreset === 'part2' && PART2_TOPICS.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setSelectedCue(t)}
                                        className={`w-full text-left rounded-xl border p-3 transition-all ${selectedCue.id === t.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'}`}
                                    >
                                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{t.label}</span>
                                        <span className="block text-[11px] text-neutral-500">{t.hint}</span>
                                        <ul className="mt-1.5 space-y-0.5">
                                            {t.prompts.map((p) => (
                                                <li key={p} className="text-[11px] text-neutral-500 flex items-start gap-1.5"><span className="text-cyan-500/70">•</span>{p}</li>
                                            ))}
                                        </ul>
                                    </button>
                                ))}
                                <button
                                    onClick={startSession}
                                    className="w-full py-2.5 rounded-lg bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-500 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                                >
                                    🚀 Start Examination Session
                                </button>
                            </div>
                        )}

                        {/* Q&A Timeline */}
                        {drawerTab === 'qna' && (
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">Live Session Transcript</p>
                                {messages.length === 0 && <p className="text-xs text-neutral-500">No dialogue yet. Start a session to see real-time transcripts.</p>}
                                {messages.map((m) => (
                                    <div key={m.id} className={`rounded-xl border p-3 ${m.role === 'examiner' ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900' : 'border-emerald-500/30 bg-emerald-500/5'}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{m.role === 'examiner' ? 'AI Examiner' : 'You'}</span>
                                            <span className="text-[10px] font-mono text-neutral-400">{m.ts}</span>
                                        </div>
                                        <p className="text-[12px] text-neutral-800 dark:text-neutral-200 leading-relaxed">{renderMsgText(m)}</p>
                                        {m.tags && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {m.tags.map((tag) => (
                                                    <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30">{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Scoring */}
                        {drawerTab === 'scoring' && (
                            <div className="space-y-4">
                                <div className="rounded-2xl bg-slate-900 text-white p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">Overall Band Estimate</p>
                                        <p className="text-2xl font-bold">Band {SCORING.overall.toFixed(1)}</p>
                                    </div>
                                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/10">DIAGNOSTIC</span>
                                </div>
                                {SCORING.pillars.map((p) => (
                                    <div key={p.key} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-200">{p.label} <span className="text-neutral-400">({p.score.toFixed(1)})</span></span>
                                            <span className="text-sm font-bold text-emerald-600">{p.score.toFixed(1)}</span>
                                        </div>
                                        <div className="h-1.5 rounded bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: `${(p.score / 9) * 100}%` }} />
                                        </div>
                                        <p className="text-[10px] text-neutral-500 mt-1.5">{p.detail}</p>
                                    </div>
                                ))}
                                <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/5 p-4">
                                    <p className="text-[11px] font-semibold text-cyan-600 mb-2">Key Recommendations · Reach Band 8.0+</p>
                                    <ul className="space-y-1.5">
                                        {SCORING.recommendations.map((r) => (
                                            <li key={r} className="text-[11px] text-neutral-600 dark:text-neutral-300 flex items-start gap-1.5"><span className="text-cyan-500/70 mt-0.5">•</span>{r}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* About */}
                        {drawerTab === 'about' && (
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                                <p><span className="font-semibold text-neutral-800 dark:text-neutral-100">LexiSpeak AI Vocal Engine v2.4 (IELTS Edition)</span></p>
                                <p>Feature highlights:</p>
                                <ul className="space-y-1.5">
                                    <li className="flex items-start gap-1.5"><span className="text-cyan-500/70 mt-0.5">•</span>Real-time acoustic pitch mapping</li>
                                    <li className="flex items-start gap-1.5"><span className="text-cyan-500/70 mt-0.5">•</span>Natural turn-taking with examiner interruptions</li>
                                    <li className="flex items-start gap-1.5"><span className="text-cyan-500/70 mt-0.5">•</span>Automated descriptor rubric matching</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Settings Panel */}
                    {(activeStage === 'preset_setup' || activeStage === 'topic_picker') && (
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-2">
                            <select value={selectedTopicLabel || 'Topic'} onChange={(e) => setSelectedTopicLabel(e.target.value)} className="text-[11px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-neutral-700 dark:text-neutral-200">
                                <option>Topic</option>
                                {PART1_TOPICS.map((t) => (<option key={t.id} value={t.label}>{t.label}</option>))}
                            </select>
                            <select value={targetBand} onChange={(e) => setTargetBand(e.target.value)} className="text-[11px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-neutral-700 dark:text-neutral-200">
                                <option>Band 6.5</option><option>Band 7.5</option><option>Band 8.0+</option>
                            </select>
                            <select className="text-[11px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-neutral-700 dark:text-neutral-200">
                                <option>Interactive Interview</option><option>Self-Paced</option>
                            </select>
                            <select className="text-[11px] rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-neutral-700 dark:text-neutral-200">
                                <option>English Global</option>
                            </select>
                        </div>
                    )}

                    {(activeStage === 'live_speaking' || activeStage === 'cue_card_prep') && (
                        <button onClick={endSession} className="mt-4 w-full py-2.5 rounded-lg bg-amber-500 text-white text-[12px] font-semibold hover:bg-amber-400 transition-colors">
                            End Session &amp; View Report
                        </button>
                    )}
                    {activeStage === 'evaluation_summary' && (
                        <button onClick={() => { setActiveStage('preset_setup'); setMessages([]); }} className="mt-4 w-full py-2.5 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-black text-[12px] font-semibold hover:opacity-90 transition-colors">
                            Return to Presets
                        </button>
                    )}
                </aside>
            ) : (
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="absolute top-4 right-4 z-20 px-4 py-2 rounded-xl bg-white/95 dark:bg-[#0D0D0D]/95 border border-neutral-200 dark:border-neutral-800 text-[12px] font-semibold text-neutral-700 dark:text-neutral-200 shadow-2xl"
                >
                    🎛️ Open Studio
                </button>
            )}

            <style>{`
                @keyframes lexiMorph {
                    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    50% { border-radius: 40% 60% 70% 30% / 50% 60% 40% 50%; }
                }
                @keyframes lexiBreath {
                    0%,100% { transform: scale(1.0); }
                    50% { transform: scale(1.06); }
                }
                @keyframes lexiShimmer {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #444; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #666; }
            `}</style>
        </div>
    );
};

export default LexiSpeakStudio;

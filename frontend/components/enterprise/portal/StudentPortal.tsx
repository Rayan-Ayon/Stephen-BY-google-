import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================== TYPES ============================== */
export interface SubSkill {
    name: string;
    band: number;
    status: 'critical' | 'warning' | 'on_track';
}

export interface StudentProfile {
    name: string;
    currentBand: number;
    targetBand: number;
    targetGap: string;
    bottleneck: string;
}

export type TaskStatus = 'graded' | 'due_today' | 'in_progress' | 'overdue';

export interface VoiceNote {
    duration: number;
    current: number;
}

export interface AssignedTask {
    id: string;
    title: string;
    status: TaskStatus;
    score?: string;
    teacherVerified?: boolean;
    teacherNote?: string;
    action?: string;
    progress?: { completed: number; total: number };
    voiceNote?: VoiceNote;
}

export interface BatchNotice {
    title: string;
    dateTime: string;
    countdownSeconds: number;
}

export interface QaReply {
    author: string;
    verified?: boolean;
    text: string;
}

export interface QaThread {
    id: string;
    question: string;
    topic: string;
    replies: number;
    verified: boolean;
    body?: string;
}

/* ============================== ICONS ============================== */
export const InlineCampusIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10l9-5 9 5" />
        <path d="M5 10v9h14v-9" />
        <path d="M9 19v-5h6v5" />
    </svg>
);

const PlayIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);

const PauseIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
);

const ChevronIcon = ({ open, className = 'w-4 h-4' }: { open: boolean; className?: string }) => (
    <svg className={`${className} transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const BellIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
);

const CheckIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
    </svg>
);

/* ============================== DEMO DATA ============================== */
const PROFILE: StudentProfile = {
    name: 'Ayon (Farmgate Executive Batch A)',
    currentBand: 6.5,
    targetBand: 7.5,
    targetGap: '+1.0 Band overall',
    bottleneck: 'Writing Task 2 (Grammatical Range & Accuracy - 6.0)',
};

const SUB_SKILLS: SubSkill[] = [
    { name: 'Writing', band: 6.0, status: 'critical' },
    { name: 'Speaking', band: 6.5, status: 'warning' },
    { name: 'Reading', band: 7.5, status: 'on_track' },
    { name: 'Listening', band: 7.0, status: 'on_track' },
];

const NOTICE: BatchNotice = {
    title: 'Friday Mega Mock Exam (L + R + W)',
    dateTime: 'Friday 3:00 PM | Room 302 / Live Simulcast',
    countdownSeconds: 14 * 3600 + 22 * 60 + 10,
};

const TASKS: AssignedTask[] = [
    {
        id: 't1',
        title: 'Cambridge 18 Test 2 Essay',
        status: 'graded',
        score: 'Band 7.0',
        teacherVerified: true,
        teacherNote: 'Upgraded from 6.5 AI draft. Great paragraph unity.',
        voiceNote: { duration: 45, current: 28 },
    },
    {
        id: 't2',
        title: 'Speaking Part 2 Cue Card - Environment',
        status: 'due_today',
        action: 'Start Task',
    },
    {
        id: 't3',
        title: 'Academic Collocations Drill #4',
        status: 'in_progress',
        progress: { completed: 4, total: 10 },
    },
];

const PASSPORT = {
    rank: 2,
    total: 34,
    attendance: 94,
    weeklyHours: '4h 15m',
    weeklyActivity: [3, 5, 2, 6, 4, 7, 5],
};

const QA_THREADS: QaThread[] = [
    {
        id: 'q1',
        question: 'How to structure Paragraph 3 in Cause & Effect essays?',
        topic: '#WritingTask2',
        replies: 3,
        verified: true,
        body: 'Use a "balancing counter-argument" approach: state the opposing cause, concede partially, then reaffirm your position with a concession clause.',
    },
    {
        id: 'q2',
        question: 'Reading Passage 2 - Question 18 True/False/Not Given confusion',
        topic: '#ReadingPassages',
        replies: 1,
        verified: false,
        body: 'The statement was not given in the passage — it paraphrases a claim but the text never confirms it, so the answer is NOT GIVEN.',
    },
];

const STATUS_META: Record<TaskStatus, { label: string; cls: string }> = {
    graded: { label: 'Graded', cls: 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30' },
    due_today: { label: 'Due Today', cls: 'bg-amber-400/15 text-amber-300 border border-amber-400/30' },
    in_progress: { label: 'In Progress', cls: 'bg-indigo-400/15 text-indigo-300 border border-indigo-400/30' },
    overdue: { label: 'Overdue', cls: 'bg-red-400/15 text-red-300 border border-red-400/30' },
};

const STATUS_COLOR: Record<SubSkill['status'], string> = {
    critical: 'text-red-300',
    warning: 'text-amber-300',
    on_track: 'text-emerald-300',
};

/* ============================== SUB-COMPONENTS ============================== */
const CountdownTimer: React.FC<{ seconds: number }> = ({ seconds }) => {
    const [left, setLeft] = useState(seconds);
    useEffect(() => {
        const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(id);
    }, []);
    const h = Math.floor(left / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;
    const fmt = (n: number) => n.toString().padStart(2, '0');
    return (
        <span className="font-mono tabular-nums text-cyan-200">
            {fmt(h)}h {fmt(m)}m {fmt(s)}s
        </span>
    );
};

const BandGauge: React.FC<{ current: number; target: number }> = ({ current, target }) => {
    const pct = (b: number) => (b / 9) * 100;
    const cur = pct(current);
    const tgt = pct(target);
    return (
        <div className="relative w-full h-10 mt-2">
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-indigo-500/40 to-cyan-400/40" />
            </div>
            <div
                className="absolute top-1/2 -translate-y-1/2 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_14px_rgba(99,102,241,0.6)]"
                style={{ left: 0, width: `${tgt}%` }}
            />
            <div className="absolute -top-1 -translate-x-1/2 flex flex-col items-center" style={{ left: `${cur}%` }}>
                <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-400 shadow" />
                <span className="text-[10px] text-white mt-1 font-semibold">{current}</span>
            </div>
            <div className="absolute -top-1 -translate-x-1/2 flex flex-col items-center" style={{ left: `${tgt}%` }}>
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-cyan-200 shadow" />
                <span className="text-[10px] text-cyan-200 mt-1 font-semibold">{target}</span>
            </div>
        </div>
    );
};

const Waveform: React.FC<{ playing: boolean; bars?: number[] }> = ({ playing, bars }) => {
    const data = bars ?? [6, 10, 4, 14, 8, 18, 6, 12, 9, 16, 5, 11, 7, 13, 4, 9, 14, 6, 10, 8];
    return (
        <div className="flex items-end gap-0.5 h-9">
            {data.map((h, i) => (
                <motion.span
                    key={i}
                    className="w-1 rounded-full bg-gradient-to-t from-indigo-500 to-cyan-400"
                    animate={{ height: playing ? [h, h * 1.6, h] : h }}
                    transition={{ duration: 0.6, repeat: playing ? Infinity : 0, delay: i * 0.03 }}
                    style={{ height: h }}
                />
            ))}
        </div>
    );
};

const VoiceNotePlayer: React.FC<{ note: VoiceNote }> = ({ note }) => {
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState<'1.0x' | '1.5x'>('1.0x');
    const [time, setTime] = useState(note.current);
    const ref = useRef<number | null>(null);

    useEffect(() => {
        if (playing) {
            ref.current = window.setInterval(() => {
                setTime((t) => {
                    const next = t + (speed === '1.5x' ? 1.5 : 1);
                    if (next >= note.duration) {
                        setPlaying(false);
                        return note.duration;
                    }
                    return next;
                });
            }, 1000);
        }
        return () => { if (ref.current) window.clearInterval(ref.current); };
    }, [playing, speed, note.duration]);

    const fmt = (n: number) => {
        const m = Math.floor(n / 60);
        const s = Math.floor(n % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-2">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? 'Pause voice note' : 'Play voice note'}
                    className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_14px_rgba(99,102,241,0.4)]"
                >
                    {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <Waveform playing={playing} />
                <span className="text-xs text-neutral-400 font-mono whitespace-nowrap">{fmt(time)} / {fmt(note.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-500">Speed</span>
                {(['1.0x', '1.5x'] as const).map((sp) => (
                    <button
                        key={sp}
                        onClick={() => setSpeed(sp)}
                        className={`px-2 py-0.5 rounded-md text-[11px] border ${speed === sp ? 'border-cyan-400/50 bg-cyan-400/15 text-white' : 'border-white/10 bg-white/5 text-neutral-400'}`}
                    >
                        {sp}
                    </button>
                ))}
            </div>
        </div>
    );
};

const WeeklyChart: React.FC<{ data: number[] }> = ({ data }) => {
    const max = Math.max(...data, 1);
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return (
        <div className="flex items-end justify-between gap-2 h-28 px-1">
            {data.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full flex items-end justify-center h-20">
                        <motion.div
                            className="w-4 rounded-t-md bg-gradient-to-t from-indigo-500 to-cyan-400"
                            initial={{ height: 0 }}
                            animate={{ height: `${(v / max) * 100}%` }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                        />
                    </div>
                    <span className="text-[10px] text-neutral-500">{days[i]}</span>
                </div>
            ))}
        </div>
    );
};

const WaitingRoomModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [checks, setChecks] = useState({ fullscreen: false, audio: false });
    const ready = checks.fullscreen && checks.audio;
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F17] backdrop-blur-xl p-6 shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Mock Exam Waiting Room</h3>
                            <button onClick={onClose} aria-label="Close" className="text-neutral-400 hover:text-white">✕</button>
                        </div>
                        <p className="text-sm text-neutral-300 mb-2">{NOTICE.title}</p>
                        <p className="text-xs text-neutral-500 mb-4">{NOTICE.dateTime}</p>
                        <div className="space-y-2 mb-5">
                            {([
                                { key: 'fullscreen', label: 'Full-screen lock enabled' },
                                { key: 'audio', label: 'Audio check passed' },
                            ] as const).map((c) => (
                                <button
                                    key={c.key}
                                    onClick={() => setChecks((prev) => ({ ...prev, [c.key]: !prev[c.key] }))}
                                    className="w-full flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left"
                                >
                                    <span className={`w-5 h-5 rounded border flex items-center justify-center ${checks[c.key] ? 'bg-cyan-400/20 border-cyan-400 text-cyan-300' : 'border-white/20'}`}>
                                        {checks[c.key] && <CheckIcon />}
                                    </span>
                                    <span className="text-sm text-neutral-200">{c.label}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={!ready}
                            onClick={() => { window.alert('Demo: Beginning mock exam environment…'); onClose(); }}
                            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${ready ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-[0_0_18px_rgba(99,102,241,0.4)] hover:brightness-110' : 'bg-white/5 text-neutral-500 border border-white/10 cursor-not-allowed'}`}
                        >
                            {ready ? 'Begin Exam' : 'Complete proctor checks'}
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const AskDrawer: React.FC<{ open: boolean; onClose: () => void; onPost: (q: QaThread) => void }> = ({ open, onClose, onPost }) => {
    const [subject, setSubject] = useState('');
    const [snippet, setSnippet] = useState('');
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex justify-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/50" />
                    <motion.div
                        className="relative w-full max-w-sm h-full bg-[#0B0F17] border-l border-white/10 backdrop-blur-xl p-6 overflow-y-auto"
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Ask Instructor</h3>
                            <button onClick={onClose} aria-label="Close" className="text-neutral-400 hover:text-white">✕</button>
                        </div>
                        <label className="block text-xs text-neutral-400 mb-1">Subject / Topic</label>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Writing Task 2 structure"
                            className="w-full mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400/60"
                        />
                        <label className="block text-xs text-neutral-400 mb-1">Code / Text Snippet (optional)</label>
                        <textarea
                            value={snippet}
                            onChange={(e) => setSnippet(e.target.value)}
                            rows={5}
                            placeholder="Paste the sentence or question you are stuck on…"
                            className="w-full mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-400/60 resize-none"
                        />
                        <button
                            disabled={!subject.trim()}
                            onClick={() => {
                                onPost({ id: `q${Date.now()}`, question: subject, topic: '#General', replies: 0, verified: false, body: snippet });
                                setSubject(''); setSnippet(''); onClose();
                            }}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-semibold disabled:opacity-40"
                        >
                            Post Question
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/* ============================== MAIN COMPONENT ============================== */
const StudentPortal: React.FC = () => {
    const [waitingOpen, setWaitingOpen] = useState(false);
    const [askOpen, setAskOpen] = useState(false);
    const [qaFilter, setQaFilter] = useState<string>('all');
    const [threads, setThreads] = useState<QaThread[]>(QA_THREADS);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setWaitingOpen(false); setAskOpen(false); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const filteredThreads = qaFilter === 'all' ? threads : threads.filter((t) => t.topic === qaFilter);

    return (
        <div className="flex-1 min-h-0 w-full h-full overflow-y-auto custom-scrollbar bg-[#0B0F17] text-white p-4 md:p-8 pb-12">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* A. HEADER & NOTICE BANNER */}
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">Digital Campus &amp; Student Portal</h1>
                            <span className="inline-flex items-center px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                                [Farmgate Enterprise Campus - Batch A]
                            </span>
                        </div>
                        <p className="text-sm text-neutral-400 mt-1">{PROFILE.name}</p>
                    </div>
                </header>

                <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-400/10 to-cyan-400/10 backdrop-blur-xl p-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <BellIcon className="w-6 h-6 text-amber-300 mt-0.5" />
                        <div>
                            <p className="font-semibold text-white">{NOTICE.title}</p>
                            <p className="text-xs text-neutral-300 mt-0.5">{NOTICE.dateTime}</p>
                            <p className="text-xs text-neutral-400 mt-1">
                                Starts in <CountdownTimer seconds={NOTICE.countdownSeconds} />
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setWaitingOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-[#0B0F17] text-sm font-semibold shadow-[0_0_20px_rgba(251,191,36,0.35)] hover:brightness-110 transition-all"
                    >
                        Join Waiting Room
                    </button>
                </div>

                {/* B. BAND GAP ANALYZER */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 lg:col-span-2">
                        <h2 className="text-sm font-semibold text-white">AI Diagnostic Target Gap</h2>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="text-center">
                                <p className="text-[11px] uppercase text-neutral-400">Current</p>
                                <p className="text-3xl font-bold text-white">{PROFILE.currentBand}</p>
                            </div>
                            <div className="flex-1">
                                <BandGauge current={PROFILE.currentBand} target={PROFILE.targetBand} />
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] uppercase text-neutral-400">Target</p>
                                <p className="text-3xl font-bold text-cyan-300">{PROFILE.targetBand}</p>
                            </div>
                        </div>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
                            Gap {PROFILE.targetGap}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Sub-skill Bottleneck</h2>
                        {SUB_SKILLS.map((sk) => (
                            <div key={sk.name} className="flex items-center justify-between">
                                <span className="text-sm text-neutral-200">{sk.name}</span>
                                <span className="flex items-center gap-2">
                                    <span className={`text-sm font-semibold ${STATUS_COLOR[sk.status]}`}>{sk.band}</span>
                                    <span className={`text-[10px] uppercase ${STATUS_COLOR[sk.status]}`}>{sk.status.replace('_', ' ')}</span>
                                </span>
                            </div>
                        ))}
                        <div className="pt-2 border-t border-white/10">
                            <p className="text-[11px] text-neutral-400">Primary Bottleneck</p>
                            <p className="text-xs text-red-300 mt-0.5">{PROFILE.bottleneck}</p>
                        </div>
                    </div>
                </section>

                {/* Daily Prescription */}
                <div className="rounded-2xl border border-indigo-400/30 bg-gradient-to-r from-indigo-500/10 to-cyan-400/5 backdrop-blur-xl p-5">
                    <div className="flex items-center gap-3">
                        <Spark className="w-6 h-6 text-indigo-300" />
                        <div>
                            <p className="text-sm font-semibold text-white">Recommended Today</p>
                            <p className="text-xs text-neutral-300 mt-0.5">1 × Lexical Resource Drill + 15 SRS Cards to close the 1.0 gap.</p>
                        </div>
                    </div>
                </div>

                {/* C + D */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* C. ASSIGNED TASKS */}
                    <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Assigned Tasks &amp; Teacher Feedback</h2>
                        {TASKS.map((task) => {
                            const meta = STATUS_META[task.status];
                            return (
                                <div key={task.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-medium text-white">{task.title}</p>
                                        <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${meta.cls}`}>{meta.label}</span>
                                    </div>

                                    {task.status === 'graded' && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-2 py-0.5 rounded-md bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold">AI: 6.5 → Teacher: 7.0</span>
                                                {task.teacherVerified && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 text-[11px]">
                                                        <CheckIcon className="w-3 h-3" /> Teacher Verified
                                                    </span>
                                                )}
                                            </div>
                                            {task.voiceNote && <VoiceNotePlayer note={task.voiceNote} />}
                                            {task.teacherNote && (
                                                <p className="text-xs text-neutral-400 italic">“{task.teacherNote}”</p>
                                            )}
                                        </div>
                                    )}

                                    {task.status === 'due_today' && (
                                        <button className="w-full py-2 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-200 text-sm font-semibold hover:bg-amber-400/25 transition-colors">
                                            {task.action}
                                        </button>
                                    )}

                                    {task.status === 'in_progress' && task.progress && (
                                        <div>
                                            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${(task.progress.completed / task.progress.total) * 100}%` }} />
                                            </div>
                                            <p className="text-[11px] text-neutral-400 mt-1">{task.progress.completed}/{task.progress.total} completed</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* D. MOCK SIMULATOR */}
                    <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Scheduled Batch Mocks</h2>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-sm text-white font-medium">{NOTICE.title}</p>
                            <p className="text-xs text-neutral-400 mt-1">{NOTICE.dateTime}</p>
                            <p className="text-xs text-cyan-200 mt-2">Opens in <CountdownTimer seconds={NOTICE.countdownSeconds} /></p>
                            <button
                                onClick={() => setWaitingOpen(true)}
                                className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-semibold shadow-[0_0_18px_rgba(99,102,241,0.3)] hover:brightness-110 transition-all"
                            >
                                Enter Waiting Room
                            </button>
                        </div>
                    </div>
                </section>

                {/* E. PASSPORT & ATTENDANCE */}
                <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h2 className="text-sm font-semibold text-white">Student Passport &amp; Attendance</h2>
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 text-sm font-semibold hover:bg-cyan-400/20 transition-colors"
                        >
                            Export PDF Progress Report
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                            <p className="text-[11px] uppercase text-neutral-400">Batch Rank</p>
                            <p className="text-2xl font-bold text-white mt-1">#{PASSPORT.rank}</p>
                            <p className="text-[11px] text-neutral-400">of {PASSPORT.total}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                            <p className="text-[11px] uppercase text-neutral-400">Attendance</p>
                            <p className="text-2xl font-bold text-emerald-300 mt-1">{PASSPORT.attendance}%</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                            <p className="text-[11px] uppercase text-neutral-400">Weekly Practice</p>
                            <p className="text-2xl font-bold text-white mt-1">{PASSPORT.weeklyHours}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                            <p className="text-[11px] uppercase text-neutral-400">Current Band</p>
                            <p className="text-2xl font-bold text-cyan-300 mt-1">{PROFILE.currentBand}</p>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-400 mb-2">7-Day Practice Intensity</p>
                    <WeeklyChart data={PASSPORT.weeklyActivity} />
                </section>

                {/* F. HELPDESK & Q&A */}
                <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <h2 className="text-sm font-semibold text-white">Batch Helpdesk &amp; Q&amp;A Board</h2>
                        <button
                            onClick={() => setAskOpen(true)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-semibold shadow-[0_0_18px_rgba(99,102,241,0.3)] hover:brightness-110 transition-colors"
                        >
                            Ask Instructor
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {['all', '#WritingTask2', '#ReadingPassages'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setQaFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${qaFilter === f ? 'border-cyan-400/50 bg-cyan-400/15 text-white' : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'}`}
                            >
                                {f === 'all' ? 'All Topics' : f}
                            </button>
                        ))}
                    </div>
                    <div className="space-y-3">
                        {filteredThreads.map((t) => (
                            <div key={t.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-white font-medium">{t.question}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[11px] text-neutral-500">{t.topic}</span>
                                            <span className="text-[11px] text-neutral-500">· {t.replies} {t.replies === 1 ? 'reply' : 'replies'}</span>
                                            {t.verified && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 text-[10px]">
                                                    <CheckIcon className="w-3 h-3" /> Verified Instructor
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {t.body && <p className="text-xs text-neutral-300 mt-2 border-l-2 border-cyan-400/40 pl-3">{t.body}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <WaitingRoomModal open={waitingOpen} onClose={() => setWaitingOpen(false)} />
            <AskDrawer open={askOpen} onClose={() => setAskOpen(false)} onPost={(q) => setThreads((prev) => [q, ...prev])} />
        </div>
    );
};

const Spark: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
    </svg>
);

export default StudentPortal;

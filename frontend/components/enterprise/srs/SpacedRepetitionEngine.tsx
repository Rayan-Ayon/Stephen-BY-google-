import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

/* ============================================================
   Enterprise Spaced Repetition Engine (Vocabulary & Grammar Error Bank)
   Dark/slate glassmorphic theme aligned with the landing / Add Content segment.
   ============================================================ */

type CardFormat = 'flashcard' | 'fill_blank' | 'sentence_upgrade';
type SrsRating = 'again' | 'hard' | 'good' | 'easy';
type DeckCategory = 'grammar' | 'lexical' | 'topic';

interface SrsCard {
    id: string;
    format: CardFormat;
    category: string;
    front: string;
    back: string;
    source?: string;
    banglaHint?: string;
    grammarRule?: string;
    prompt?: string;
    answer?: string;
    band6?: string;
    band8?: string;
}

interface Deck {
    id: string;
    name: string;
    due: number;
    total: number;
    category: DeckCategory;
    progress: number;
}

interface CohortError {
    label: string;
    pct: number;
}

/* ---------------- Demo Data Layer ---------------- */

const STATS = {
    totalCards: 128,
    dueToday: 18,
    mastered: 84,
    retention: 89,
    streak: 12,
};

const DECKS: Deck[] = [
    { id: 'ai_essay', name: 'AI Essay Auto-Captured Errors', due: 12, total: 64, category: 'grammar', progress: 72 },
    { id: 'speaking_lex', name: 'Speaking Practice Lexical Gaps', due: 6, total: 38, category: 'lexical', progress: 65 },
    { id: 'topic_env', name: 'High-Frequency Topic: Environment & Tech', due: 0, total: 26, category: 'topic', progress: 88 },
];

const COHORT_ERRORS: CohortError[] = [
    { label: "Misuse preposition after 'responsible' (responsible of → responsible for)", pct: 72 },
    { label: "Confuse 'effect' (noun) vs 'affect' (verb)", pct: 61 },
    { label: "Overuse generic 'big problem' instead of precise collocations", pct: 54 },
];

const BASE_CARDS: SrsCard[] = [
    {
        id: 'c1',
        format: 'fill_blank',
        category: 'Prepositions & Gerunds',
        front: 'Education is vital for improve society.',
        back: 'Education is vital for improving society.',
        source: 'Essay Attempt #4 (Task 2)',
        banglaHint: "Preposition 'for' er por verb er sathe 'ing' jog hoy.",
        grammarRule: "After a preposition (for), use the gerund (-ing) form of the verb.",
        prompt: 'Education is vital for ____ society.',
        answer: 'improving',
    },
    {
        id: 'c2',
        format: 'sentence_upgrade',
        category: 'Lexical Resource (Collocations)',
        front: 'Traffic congestion is a big problem in urban areas.',
        back: 'Traffic congestion is a pressing issue in urban centers.',
        source: 'Speaking Part 2 Sprint',
        banglaHint: "Replace generic 'big problem' with high-impact collocation 'pressing issue'.",
        band6: 'Traffic congestion is a big problem in urban areas.',
        band8: 'Traffic congestion is a pressing issue in urban centers.',
    },
    {
        id: 'c3',
        format: 'flashcard',
        category: 'Verb-Noun Collocations',
        front: 'Governments should make steps to mitigate pollution.',
        back: 'Governments should take steps to mitigate pollution.',
        source: 'Essay Attempt #2',
        grammarRule: "Use 'take steps' (not 'make steps') with the noun 'steps'.",
    },
];

const EXTRA_CARDS: SrsCard[] = [
    { id: 'c4', format: 'fill_blank', category: 'Prepositions', front: 'He is very good ___ mathematics.', back: 'He is very good at mathematics.', source: 'Speaking Part 1', grammarRule: "Use 'good at' (not 'good in').", prompt: 'He is very good ____ mathematics.', answer: 'at' },
    { id: 'c5', format: 'flashcard', category: 'Participle Adjectives', front: 'I am interesting in learning languages.', back: 'I am interested in learning languages.', source: 'Essay Attempt #1', grammarRule: "Use -ed adjectives (interested) to describe a person's feelings." },
    { id: 'c6', format: 'fill_blank', category: 'Gerunds', front: 'She suggested ____ to the cinema.', back: 'She suggested going to the cinema.', source: 'Speaking Part 3', grammarRule: "'suggest' is followed by a gerund, not the infinitive.", prompt: 'She suggested ____ to the cinema.', answer: 'going' },
    { id: 'c7', format: 'flashcard', category: 'Subject-Verb Agreement', front: 'The number of students are increasing.', back: 'The number of students is increasing.', source: 'Essay Attempt #3', grammarRule: "'The number of' takes a singular verb." },
    { id: 'c8', format: 'fill_blank', category: 'Tenses', front: 'I ____ to Paris last summer.', back: 'I went to Paris last summer.', source: 'Speaking Part 2', grammarRule: 'Past time markers (last summer) require the simple past.', prompt: 'I ____ to Paris last summer.', answer: 'went' },
    { id: 'c9', format: 'flashcard', category: 'Bare Infinitive', front: 'He did not went to school.', back: 'He did not go to school.', source: 'Essay Attempt #5', grammarRule: "After 'did not', use the base form of the verb." },
    { id: 'c10', format: 'sentence_upgrade', category: 'Lexical Upgrade', front: 'This is very important for the economy.', back: 'This is crucial for the economy.', source: 'Writing Task 2', banglaHint: "'very important' er jaygay 'crucial' bebohar koro.", band6: 'This is very important for the economy.', band8: 'This is crucial for the economy.' },
    { id: 'c11', format: 'flashcard', category: 'Verb-Noun Collocations', front: 'We should do a decision quickly.', back: 'We should make a decision quickly.', source: 'Essay Attempt #2', grammarRule: "Use 'make a decision' (not 'do a decision')." },
    { id: 'c12', format: 'fill_blank', category: 'Collocations', front: 'There was a ____ rain yesterday.', back: 'There was heavy rain yesterday.', source: 'Speaking Part 2', grammarRule: "Use 'heavy rain' (not 'strong rain').", prompt: 'There was a ____ rain yesterday.', answer: 'heavy' },
    { id: 'c13', format: 'sentence_upgrade', category: 'Lexical Upgrade', front: 'The government needs a lot of money.', back: 'The government requires substantial funding.', source: 'Writing Task 2', band6: 'The government needs a lot of money.', band8: 'The government requires substantial funding.' },
    { id: 'c14', format: 'flashcard', category: 'Prepositions', front: 'She is married with a doctor.', back: 'She is married to a doctor.', source: 'Speaking Part 1', grammarRule: "Use 'married to' (not 'married with')." },
    { id: 'c15', format: 'fill_blank', category: 'Prepositions', front: 'He is responsible ____ the project.', back: 'He is responsible for the project.', source: 'Essay Attempt #2', banglaHint: "'responsible' er pore 'for' bebohar hoy.", grammarRule: "Use 'responsible for' (not 'responsible of').", prompt: 'He is responsible ____ the project.', answer: 'for' },
    { id: 'c16', format: 'flashcard', category: 'Quantifiers', front: 'I have much friends.', back: 'I have many friends.', source: 'Speaking Part 1', grammarRule: "Use 'many' with countable nouns (not 'much')." },
    { id: 'c17', format: 'sentence_upgrade', category: 'Lexical Upgrade', front: 'This helps people to know more.', back: 'This fosters greater awareness.', source: 'Writing Task 2', band6: 'This helps people to know more.', band8: 'This fosters greater awareness.' },
    { id: 'c18', format: 'flashcard', category: 'Gerunds', front: 'They enjoyed to swim.', back: 'They enjoyed swimming.', source: 'Speaking Part 3', grammarRule: "'enjoy' is followed by a gerund." },
];

const SESSION_CARDS: SrsCard[] = [...BASE_CARDS, ...EXTRA_CARDS];

const RATING_META: Record<SrsRating, { label: string; interval: string; glow: string; ring: string; text: string }> = {
    again: { label: 'Again', interval: '< 1 day', glow: 'shadow-[0_0_22px_rgba(239,68,68,0.5)]', ring: 'border-red-500/60 bg-red-500/10 hover:bg-red-500/20', text: 'text-red-300' },
    hard: { label: 'Hard', interval: '2 days', glow: 'shadow-[0_0_22px_rgba(245,158,11,0.5)]', ring: 'border-amber-500/60 bg-amber-500/10 hover:bg-amber-500/20', text: 'text-amber-300' },
    good: { label: 'Good', interval: '4 days', glow: 'shadow-[0_0_22px_rgba(59,130,246,0.5)]', ring: 'border-blue-500/60 bg-blue-500/10 hover:bg-blue-500/20', text: 'text-blue-300' },
    easy: { label: 'Easy', interval: '7 days', glow: 'shadow-[0_0_22px_rgba(16,185,129,0.5)]', ring: 'border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20', text: 'text-emerald-300' },
};

const HEATMAP = Array.from({ length: 30 }, (_, i) => (i * 7 + (i % 5) * 3) % 9);
const HEAT_TIERS = [
    'bg-white/5 border border-white/10',
    'bg-indigo-500/15 border border-indigo-500/20',
    'bg-indigo-500/35 border border-indigo-500/40',
    'bg-indigo-500/60 border border-indigo-500/70',
    'bg-gradient-to-br from-indigo-500 to-cyan-400 border border-cyan-400/60',
];

/* ---------------- Inline Icons ---------------- */

const RepeatIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
);

const SparkIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7L12 2z" />
    </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const BanglaAccordion: React.FC<{ hint: string }> = ({ hint }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="mt-3 rounded-xl bg-white/5 border border-white/10">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-amber-200 hover:text-amber-100 transition-colors"
            >
                <span>Bangla / Banglish Hint</span>
                <ChevronIcon open={open} />
            </button>
            {open && (
                <div className="px-3 pb-3 text-sm text-neutral-200 border-t border-white/10 pt-2">{hint}</div>
            )}
        </div>
    );
};

const RetentionRing: React.FC<{ value: number }> = ({ value }) => {
    const r = 30;
    const c = 2 * Math.PI * r;
    const offset = c - (value / 100) * c;
    return (
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 flex items-center gap-4">
            <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
                <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7" />
                <circle
                    cx="36" cy="36" r={r} fill="none" stroke="url(#srsGrad)" strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 36 36)"
                />
                <defs>
                    <linearGradient id="srsGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                </defs>
            </svg>
            <div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Retention Score</p>
                <p className="text-3xl font-bold tracking-tight text-white">{value}%</p>
            </div>
        </div>
    );
};

/* ---------------- Main Component ---------------- */

const SpacedRepetitionEngine: React.FC = () => {
    const [view, setView] = useState<'decks' | 'session'>('decks');
    const [filter, setFilter] = useState<'all' | DeckCategory>('all');
    const [sessionMode, setSessionMode] = useState<CardFormat>('flashcard');
    const [sessionIndex, setSessionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [fillInput, setFillInput] = useState('');
    const [upgradePick, setUpgradePick] = useState<'band6' | 'band8' | null>(null);
    const [cohortOpen, setCohortOpen] = useState(false);

    const filteredDecks = useMemo(
        () => (filter === 'all' ? DECKS : DECKS.filter((d) => d.category === filter)),
        [filter],
    );

    const sessionCards = useMemo(
        () => SESSION_CARDS.filter((c) => c.format === sessionMode),
        [sessionMode],
    );

    const current = sessionCards[sessionIndex] ?? SESSION_CARDS[0];

    const startSession = (mode: CardFormat = 'flashcard') => {
        setSessionMode(mode);
        setSessionIndex(0);
        setShowAnswer(false);
        setFillInput('');
        setUpgradePick(null);
        setView('session');
    };

    const rate = (r: SrsRating) => {
        const next = sessionIndex + 1;
        if (next >= sessionCards.length) {
            setView('decks');
            return;
        }
        setSessionIndex(next);
        setShowAnswer(false);
        setFillInput('');
        setUpgradePick(null);
    };

    useEffect(() => {
        if (view !== 'session') return;
        const onKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!showAnswer) setShowAnswer(true);
            } else if (['1', '2', '3', '4'].includes(e.key) && showAnswer) {
                const map: Record<string, SrsRating> = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' };
                rate(map[e.key]);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, showAnswer, sessionIndex, sessionCards.length]);

    const fillCorrect = current.format === 'fill_blank' && current.answer
        ? fillInput.trim().toLowerCase() === current.answer.toLowerCase()
        : false;

    return (
        <div className="w-full h-full overflow-y-auto bg-[#0B0F17] text-white">
            <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
                {/* Header */}
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">Spaced Repetition Engine</h1>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                                <SparkIcon /> SM-2 Algorithmic Memory Engine
                            </span>
                        </div>
                        <p className="text-sm text-neutral-400 mt-1">Turn every captured error into long-term mastery.</p>
                    </div>
                    <button
                        onClick={() => startSession('flashcard')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:brightness-110 transition-all"
                    >
                        Start Daily Session
                    </button>
                </header>
                {/* Quick Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative rounded-2xl border border-indigo-400/40 bg-gradient-to-br from-indigo-500/15 to-cyan-400/10 shadow-[0_0_28px_rgba(99,102,241,0.25)] p-5 overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/20 blur-2xl rounded-full" />
                        <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Cards Due Today</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-white">{STATS.dueToday}</p>
                        <p className="mt-1 text-xs text-neutral-400">Review now to protect retention</p>
                    </div>
                    <RetentionRing value={STATS.retention} />
                    <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 overflow-hidden">
                        <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Mastered Cards</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-white">{STATS.mastered}</p>
                        <p className="mt-1 text-xs text-neutral-400">of {STATS.totalCards} total</p>
                    </div>
                    <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 overflow-hidden">
                        <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Daily Active Streak</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-white">{STATS.streak}</p>
                        <p className="mt-1 text-xs text-neutral-400">consecutive days</p>
                    </div>
                </div>
                {/* Mastery Heatmap */}
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-white">Mastery Activity — Last 30 Days</h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                            Less
                            {HEAT_TIERS.map((t, i) => (
                                <span key={i} className={`w-3 h-3 rounded-sm ${t}`} />
                            ))}
                            More
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {HEATMAP.map((v, i) => (
                            <span
                                key={i}
                                title={`Day ${i + 1}: ${v} reviews`}
                                className={`w-3.5 h-3.5 rounded-sm ${HEAT_TIERS[Math.min(4, Math.floor(v / 2))]}`}
                            />
                        ))}
                    </div>
                </div>
                {/* Dual-Mode Practice Hub */}
                {view === 'decks' ? (
                    <section className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold">Decks Overview</h2>
                            <div className="flex items-center gap-2">
                                {(['all', 'grammar', 'lexical', 'topic'] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${filter === f ? 'border-indigo-400/50 bg-indigo-500/15 text-white' : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'}`}
                                    >
                                        {f === 'all' ? 'All Decks' : f === 'grammar' ? 'Grammar Errors' : f === 'lexical' ? 'Lexical Upgrades' : 'Topic Collections'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDecks.map((deck) => (
                                <div key={deck.id} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 flex flex-col gap-3 hover:border-white/20 transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-white leading-snug">{deck.name}</h3>
                                        <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${deck.due > 0 ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' : 'bg-white/5 text-neutral-400 border border-white/10'}`}>
                                            {deck.due > 0 ? `${deck.due} due` : 'Caught up'}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${deck.progress}%` }} />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-neutral-400">
                                        <span>{deck.progress}% mastered</span>
                                        <span>{deck.total} cards</span>
                                    </div>
                                    <button
                                        disabled={deck.due === 0}
                                        onClick={() => startSession('flashcard')}
                                        className={`mt-1 w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${deck.due > 0 ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-[0_0_18px_rgba(99,102,241,0.3)] hover:brightness-110' : 'bg-white/5 text-neutral-500 border border-white/10 cursor-not-allowed'}`}
                                    >
                                        {deck.due > 0 ? 'Start Daily Session' : 'No cards due'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : (
                    <section className="space-y-5">
                        {/* Session Header */}
                        <div className="flex items-center justify-between gap-4">
                            <button onClick={() => setView('decks')} className="text-sm text-neutral-400 hover:text-white transition-colors">← Back to Decks</button>
                            <div className="flex items-center gap-2">
                                {(['flashcard', 'fill_blank', 'sentence_upgrade'] as const).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => { setSessionMode(m); setSessionIndex(0); setShowAnswer(false); setFillInput(''); setUpgradePick(null); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${sessionMode === m ? 'border-cyan-400/50 bg-cyan-400/15 text-white' : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'}`}
                                    >
                                        {m === 'flashcard' ? 'Flip' : m === 'fill_blank' ? 'Fill-in-blank' : 'Sentence Upgrade'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all" style={{ width: `${((sessionIndex) / Math.max(1, sessionCards.length)) * 100}%` }} />
                            </div>
                            <p className="text-right text-[11px] text-neutral-400 mt-1 pr-1">Card {Math.min(sessionIndex + 1, sessionCards.length)} of {sessionCards.length}</p>
                        </div>

                        {/* Flip Card */}
                        <div className="relative mx-auto max-w-2xl" style={{ perspective: 1200 }}>
                            <motion.div
                                className="relative w-full"
                                style={{ transformStyle: 'preserve-3d' }}
                                animate={{ rotateY: showAnswer ? 180 : 0 }}
                                transition={{ duration: 0.55, ease: 'easeInOut' }}
                            >
                                {/* Front Face */}
                                <div style={{ backfaceVisibility: 'hidden' }} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 min-h-[280px] flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-400/30">{current.category}</span>
                                        {current.source && <span className="text-[11px] text-neutral-400">{current.source}</span>}
                                    </div>
                                    {current.format === 'fill_blank' ? (
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-xl leading-relaxed text-center text-white">{current.prompt}</p>
                                        </div>
                                    ) : current.format === 'sentence_upgrade' ? (
                                        <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                            <p className="text-[11px] uppercase tracking-wider text-neutral-400">Original (Band 6.0)</p>
                                            <p className="text-xl text-center text-white">{current.band6}</p>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-xl leading-relaxed text-center text-white">"{current.front}"</p>
                                        </div>
                                    )}
                                    {!showAnswer && (
                                        <button
                                            onClick={() => setShowAnswer(true)}
                                            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-semibold shadow-[0_0_18px_rgba(99,102,241,0.3)] hover:brightness-110 transition-all"
                                        >
                                            Show Answer (Space)
                                        </button>
                                    )}
                                </div>

                                {/* Back Face */}
                                <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute inset-0 rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 backdrop-blur-xl p-8 min-h-[280px] flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">Corrected</span>
                                        {current.source && <span className="text-[11px] text-neutral-400">{current.source}</span>}
                                    </div>

                                    {current.format === 'fill_blank' ? (
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-xl leading-relaxed text-center text-white">
                                                {current.prompt?.split('____').map((part, i, arr) => (
                                                    <React.Fragment key={i}>
                                                        {part}
                                                        {i < arr.length - 1 && <span className="text-cyan-300 font-semibold">{current.answer}</span>}
                                                    </React.Fragment>
                                                ))}
                                            </p>
                                        </div>
                                    ) : current.format === 'sentence_upgrade' ? (
                                        <div className="flex-1 flex flex-col items-center justify-center gap-3">
                                            <p className="text-[11px] uppercase tracking-wider text-neutral-400">Stronger (Band 8.0)</p>
                                            <p className="text-xl text-center text-cyan-200">{current.band8}</p>
                                            {upgradePick && (
                                                <p className={`text-xs ${upgradePick === 'band8' ? 'text-emerald-300' : 'text-amber-300'}`}>
                                                    {upgradePick === 'band8' ? '✓ You picked the Band 8.0 phrasing' : 'The Band 8.0 phrasing is stronger'}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center">
                                            <p className="text-xl leading-relaxed text-center text-cyan-200">"{current.back}"</p>
                                        </div>
                                    )}

                                    {current.grammarRule && (
                                        <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3">
                                            <p className="text-[11px] uppercase tracking-wider text-indigo-300 mb-1">Grammar Rule</p>
                                            <p className="text-sm text-neutral-200">{current.grammarRule}</p>
                                        </div>
                                    )}

                                    {current.banglaHint && (
                                        <BanglaAccordion hint={current.banglaHint} />
                                    )}

                                    {current.format === 'sentence_upgrade' && (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <button onClick={() => setUpgradePick('band6')} className={`py-2 rounded-lg text-sm border ${upgradePick === 'band6' ? 'border-amber-400/50 bg-amber-500/10 text-amber-200' : 'border-white/10 bg-white/5 text-neutral-300'}`}>Band 6.0</button>
                                            <button onClick={() => setUpgradePick('band8')} className={`py-2 rounded-lg text-sm border ${upgradePick === 'band8' ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-white/5 text-neutral-300'}`}>Band 8.0</button>
                                        </div>
                                    )}

                                    {current.format === 'fill_blank' && (
                                        <div className="mt-4">
                                            <input
                                                autoFocus
                                                value={fillInput}
                                                onChange={(e) => setFillInput(e.target.value)}
                                                placeholder="Type the missing word…"
                                                className={`w-full px-4 py-3 rounded-xl text-center text-lg bg-white/5 border outline-none transition-colors ${fillInput === '' ? 'border-white/10 focus:border-cyan-400/60' : fillCorrect ? 'border-emerald-400/60 text-emerald-200' : 'border-red-400/60 text-red-200'}`}
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* SM-2 Rating Controls */}
                        <div className="flex items-stretch gap-3 max-w-2xl mx-auto w-full">
                            {(Object.keys(RATING_META) as SrsRating[]).map((r, i) => {
                                const m = RATING_META[r];
                                return (
                                    <button
                                        key={r}
                                        disabled={!showAnswer}
                                        onClick={() => rate(r)}
                                        className={`flex-1 py-3 rounded-xl border text-center transition-all disabled:opacity-40 disabled:cursor-not-allowed ${m.ring} ${m.glow}`}
                                        title={`${m.interval}`}
                                    >
                                        <div className={`text-sm font-bold ${m.text}`}>{m.label}</div>
                                        <div className="text-[10px] text-neutral-400 mt-0.5">{m.interval}</div>
                                        <div className="text-[10px] text-neutral-500 mt-0.5">[{i + 1}]</div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}
                {/* Enterprise Coaching & Tracker Sync (Farmgate) */}
                <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                    <button
                        onClick={() => setCohortOpen((o) => !o)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <RepeatIcon className="w-5 h-5 text-cyan-300" />
                            <div className="text-left">
                                <h3 className="font-semibold text-white">Farmgate Enterprise Class Aggregates</h3>
                                <p className="text-xs text-neutral-400">Cohort-wide error patterns & warmup exports</p>
                            </div>
                        </div>
                        <ChevronIcon open={cohortOpen} />
                    </button>
                    {cohortOpen && (
                        <div className="px-5 pb-5 space-y-4">
                            <div className="space-y-3">
                                {COHORT_ERRORS.map((c, i) => (
                                    <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-neutral-200">{c.label}</span>
                                            <span className="text-sm font-bold text-amber-300">{c.pct}%</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-400" style={{ width: `${c.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="w-full py-2.5 rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 text-sm font-semibold hover:bg-cyan-400/20 transition-colors"
                            >
                                Export PDF Class Warmup
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default SpacedRepetitionEngine;

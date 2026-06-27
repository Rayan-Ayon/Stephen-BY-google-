
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SearchIcon, AdjustIcon, DotsHorizontalIcon,
    ChevronDownIcon, StarIcon, TrophyIcon,
    GlobeIcon, ClockIcon, CheckCircleIcon, UsersIcon,
    ListBulletIcon, FlagIcon, FlaskIcon, XIcon, TagIcon,
    ChevronLeftIcon, ChevronRightIcon, BrainIcon, CubeIcon,
    LightningIcon, FireIcon, MicroscopeIcon, MapPinIcon,
    SparkleIcon, DatabaseIcon, GoogleIcon, SettingsIcon,
    BarChartIcon, DollarIcon, PlusIcon, CheckIcon,
} from './icons';
import {
    CompetitionEvent, CompetitionSource, ExecutionType,
    TeamScale, PreferenceVector,
} from './competitions/types';
import {
    heroEvents, gridEvents, defaultPreferences, domainOptions,
} from './competitions/seeds';

// ── Onboarding Flow (4 panes) ──
const sourceMeta: { key: CompetitionSource; label: string; icon: React.ReactNode }[] = [
    { key: 'Kaggle', label: 'Kaggle', icon: <DatabaseIcon className="w-5 h-5" /> },
    { key: 'Google', label: 'Google', icon: <GoogleIcon className="w-5 h-5" /> },
    { key: 'Facebook', label: 'Facebook', icon: <UsersIcon className="w-5 h-5" /> },
    { key: 'Anthropic', label: 'Anthropic', icon: <BrainIcon className="w-5 h-5" /> },
];

const domainIcons: Record<string, React.ReactNode> = {
    AI: <BrainIcon className="w-4 h-4" />,
    Robotics: <CubeIcon className="w-4 h-4" />,
    Space: <GlobeIcon className="w-4 h-4" />,
    'Vibe-coding': <LightningIcon className="w-4 h-4" />,
    Quantum: <FireIcon className="w-4 h-4" />,
    Biotech: <FlaskIcon className="w-4 h-4" />,
};

interface OnboardingFlowProps {
    preferences: PreferenceVector;
    onUpdate: (p: PreferenceVector) => void;
    onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ preferences, onUpdate, onComplete }) => {
    const [step, setStep] = useState(1);
    const [localPrefs, setLocalPrefs] = useState<PreferenceVector>(preferences);
    const [customDomain, setCustomDomain] = useState('');

    const update = (patch: Partial<PreferenceVector>) => {
        const next = { ...localPrefs, ...patch };
        setLocalPrefs(next);
        onUpdate(next);
    };

    const toggleDomain = (d: string) => {
        const next = localPrefs.domains.includes(d)
            ? localPrefs.domains.filter(x => x !== d)
            : [...localPrefs.domains, d];
        update({ domains: next });
    };

    const addCustomDomain = () => {
        const val = customDomain.trim();
        if (!val || localPrefs.domains.includes(val)) return;
        update({ domains: [...localPrefs.domains, val] });
        setCustomDomain('');
    };

    const toggleSource = (source: CompetitionSource) => {
        const next = localPrefs.sources.includes(source)
            ? localPrefs.sources.filter(s => s !== source)
            : [...localPrefs.sources, source];
        update({ sources: next });
    };

    const toggleExecution = () => {
        update({ executionType: localPrefs.executionType === 'online' ? 'offline' : 'online' as ExecutionType });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-5 border-b border-white/5 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-white font-serif leading-none mb-0.5">
                                Personalize Your Competition Feed
                            </h2>
                            <p className="text-xs text-gray-500">Configure your preference vectors</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4].map(s => (
                                <div
                                    key={s}
                                    className={`w-2 h-2 rounded-full transition-colors ${s <= step ? 'bg-emerald-500' : 'bg-gray-700'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
                        <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {/* ─── Pane 1: Domains ─── */}
                        {step === 1 && (
                            <motion.div key="p1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <h3 className="text-xl font-bold text-white mb-1">Select Your Domains</h3>
                                <p className="text-sm text-gray-500 mb-5">Choose the fields you want to track in competitions.</p>
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {domainOptions.map(d => (
                                        <button
                                            key={d}
                                            onClick={() => toggleDomain(d)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                                                localPrefs.domains.includes(d)
                                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                                    : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'
                                            }`}
                                        >
                                            {domainIcons[d]}
                                            {d}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="+ Add Custom Domain String"
                                        value={customDomain}
                                        onChange={e => setCustomDomain(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') addCustomDomain(); }}
                                        className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-gray-500"
                                    />
                                    <button
                                        onClick={addCustomDomain}
                                        className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                {localPrefs.domains.filter(d => !domainOptions.includes(d)).length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {localPrefs.domains.filter(d => !domainOptions.includes(d)).map(d => (
                                            <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-900/20 border border-emerald-500/30 rounded-full text-xs text-emerald-300">
                                                {d}
                                                <button onClick={() => toggleDomain(d)} className="hover:text-white"><XIcon className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ─── Pane 2: Sources ─── */}
                        {step === 2 && (
                            <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <h3 className="text-xl font-bold text-white mb-1">Select Competition Sources</h3>
                                <p className="text-sm text-gray-500 mb-5">Toggle the platforms you want to pull events from.</p>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {sourceMeta.map(s => (
                                        <button
                                            key={s.key}
                                            onClick={() => toggleSource(s.key)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                                                localPrefs.sources.includes(s.key)
                                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                                                    : 'bg-[#111] border-white/10 text-gray-500 hover:border-white/30'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-lg ${localPrefs.sources.includes(s.key) ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>
                                                {s.icon}
                                            </div>
                                            <span className="text-sm font-semibold">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl border bg-[#111] border-white/10 mb-6">
                                    <button
                                        onClick={() => toggleSource('All Formal')}
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                            localPrefs.sources.includes('All Formal')
                                                ? 'bg-emerald-600 border-emerald-600'
                                                : 'border-gray-600'
                                        }`}
                                    >
                                        {localPrefs.sources.includes('All Formal') && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                                    </button>
                                    <span className="text-sm text-gray-400">All Formal Sources</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="+ Add Custom Competition Link"
                                        value={localPrefs.customSources.length > 0 ? localPrefs.customSources.join(', ') : ''}
                                        onChange={e => update({ customSources: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                        className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-gray-500"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* ─── Pane 3: Parameters ─── */}
                        {step === 3 && (
                            <motion.div key="p3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <h3 className="text-xl font-bold text-white mb-1">Set Your Parameters</h3>
                                <p className="text-sm text-gray-500 mb-5">Configure search constraints and preferences.</p>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Minimum Prize Tier ($)</label>
                                        <input
                                            type="number"
                                            value={localPrefs.minPrizeTier}
                                            onChange={e => update({ minPrizeTier: e.target.value })}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">Execution Type</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => update({ executionType: 'online' })}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                                                    localPrefs.executionType === 'online'
                                                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                                        : 'bg-[#111] border-white/10 text-gray-400'
                                                }`}
                                            >
                                                Online
                                            </button>
                                            <button
                                                onClick={() => update({ executionType: 'offline' })}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                                                    localPrefs.executionType === 'offline'
                                                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                                        : 'bg-[#111] border-white/10 text-gray-400'
                                                }`}
                                            >
                                                Offline
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {localPrefs.executionType === 'offline' && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-4 overflow-hidden"
                                            >
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Target Country</label>
                                                    <input
                                                        type="text"
                                                        value={localPrefs.targetCountry}
                                                        onChange={e => update({ targetCountry: e.target.value })}
                                                        placeholder="e.g. Switzerland"
                                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Target City</label>
                                                    <input
                                                        type="text"
                                                        value={localPrefs.targetCity}
                                                        onChange={e => update({ targetCity: e.target.value })}
                                                        placeholder="e.g. Zurich"
                                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── Pane 4: Deep Diagnostics ─── */}
                        {step === 4 && (
                            <motion.div key="p4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <h3 className="text-xl font-bold text-white mb-1">Deep Diagnostics</h3>
                                <p className="text-sm text-gray-500 mb-5">Fine-tune your profile or skip to get started.</p>

                                <div className="flex items-center gap-3 p-4 rounded-xl border bg-[#111] border-white/10 mb-6">
                                    <button
                                        onClick={() => update({ showAdvanced: !localPrefs.showAdvanced })}
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                            localPrefs.showAdvanced
                                                ? 'bg-emerald-600 border-emerald-600'
                                                : 'border-gray-600'
                                        }`}
                                    >
                                        {localPrefs.showAdvanced && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                                    </button>
                                    <span className="text-sm text-gray-300 font-medium">More Details</span>
                                    <span className="text-xs text-gray-600">(Skip if you prefer quick start)</span>
                                </div>

                                <AnimatePresence>
                                    {localPrefs.showAdvanced && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-6 overflow-hidden"
                                        >
                                            {/* Team Scale */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-3">Team Scale</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {(['solo', 'small', 'large'] as TeamScale[]).map(scale => (
                                                        <button
                                                            key={scale}
                                                            onClick={() => update({ teamScale: scale })}
                                                            className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${
                                                                localPrefs.teamScale === scale
                                                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                                                    : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'
                                                            }`}
                                                        >
                                                            {scale === 'solo' ? 'Solo' : scale === 'small' ? '2-3 People' : '3-5 People'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Difficulty Slider */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                                    Target Difficulty: <span className="text-emerald-400">{localPrefs.difficulty}/10</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min={1}
                                                    max={10}
                                                    value={localPrefs.difficulty}
                                                    onChange={e => update({ difficulty: parseInt(e.target.value) })}
                                                    className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                                />
                                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                                    <span>Beginner</span>
                                                    <span>Expert</span>
                                                </div>
                                            </div>

                                            {/* Win Probability Preview */}
                                            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-500/20">
                                                <p className="text-xs text-gray-500 mb-1">Estimated Win Probability</p>
                                                <p className="text-2xl font-bold text-emerald-400 font-serif">
                                                    {Math.max(5, 40 - localPrefs.difficulty * 3 + (localPrefs.teamScale === 'solo' ? 10 : localPrefs.teamScale === 'small' ? 5 : 0))}%
                                                </p>
                                                <p className="text-[10px] text-gray-600 mt-1">
                                                    Based on your domain breadth ({localPrefs.domains.length} areas), team preference, and target difficulty.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!localPrefs.showAdvanced && (
                                    <div className="p-5 rounded-xl bg-gray-900/30 border border-white/5 text-center">
                                        <p className="text-sm text-gray-500">Advanced diagnostics skipped. Defaulting to balanced profile.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-white/5 shrink-0 flex justify-between items-center">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                            Back
                        </button>
                    ) : <div />}
                    {step < 4 ? (
                        <button onClick={() => setStep(step + 1)} className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors">
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={onComplete}
                            className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
                        >
                            Activate My Feed
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// ── Nav Carousel (from existing view) ──
const NavCarousel: React.FC<{
    items: string[];
    activeFilter: string;
    setActiveFilter: (f: string) => void;
}> = ({ items, activeFilter, setActiveFilter }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [items]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group flex items-center w-full">
            {showLeftArrow && (
                <button onClick={() => scroll('left')} className="absolute left-0 z-10 p-1.5 bg-white dark:bg-[#1a1a1a] rounded-full shadow-md border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-black dark:hover:text-white transition-all -ml-2">
                    <ChevronLeftIcon className="w-4 h-4" />
                </button>
            )}
            <div ref={scrollRef} onScroll={checkScroll} className="flex items-center space-x-2 overflow-hidden scroll-smooth w-full px-1 py-1">
                {items.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 ${
                            activeFilter === filter
                                ? 'dark:bg-white bg-black dark:text-black text-white dark:border-white border-black'
                                : 'dark:bg-[#1a1a1a] bg-neutral-50 dark:text-gray-400 text-neutral-600 dark:border-gray-800 border-neutral-200 hover:dark:border-gray-600'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
            {showRightArrow && (
                <button onClick={() => scroll('right')} className="absolute right-0 z-10 p-1.5 bg-white dark:bg-[#1a1a1a] rounded-full shadow-md border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-black dark:hover:text-white transition-all -mr-2">
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

// ── Source icon lookup ──
const sourceIcon = (src: CompetitionSource): React.ReactNode => {
    switch (src) {
        case 'Kaggle': return <DatabaseIcon className="w-3.5 h-3.5" />;
        case 'Google': return <GoogleIcon className="w-3.5 h-3.5" />;
        case 'Facebook': return <UsersIcon className="w-3.5 h-3.5" />;
        case 'Anthropic': return <BrainIcon className="w-3.5 h-3.5" />;
        default: return <GlobeIcon className="w-3.5 h-3.5" />;
    }
};

const sourceColor = (src: CompetitionSource): string => {
    switch (src) {
        case 'Kaggle': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        case 'Google': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        case 'Facebook': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
        case 'Anthropic': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
        default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
};

// ── Competition Card ──
const EventCard: React.FC<{ event: CompetitionEvent }> = ({ event }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-[#161b22] border rounded-2xl p-5 flex flex-col transition-all hover:shadow-lg hover:shadow-emerald-900/5 ${
            event.isHighlighted ? 'border-emerald-500/40' : 'border-gray-800/60'
        }`}
    >
        {/* Tags row */}
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {event.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                    {domainIcons[tag] || <TagIcon className="w-3 h-3" />}
                    {tag}
                </span>
            ))}
        </div>

        {/* Title & Description */}
        <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{event.title}</h3>
        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{event.description}</p>

        {/* Source + Meta row */}
        <div className="flex items-center justify-between mb-4">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${sourceColor(event.source)}`}>
                {sourceIcon(event.source)}
                {event.source}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <TrophyIcon className="w-3 h-3" />
                <span className="font-semibold text-gray-300">{event.rewardPool}</span>
            </div>
        </div>

        {/* Info row */}
        <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-4 flex-wrap">
            <span className="flex items-center gap-1">
                <BarChartIcon className="w-3 h-3" />
                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < Math.round(event.difficulty / 2) ? 'text-amber-400' : 'text-gray-700'}>★</span>
                ))}
            </span>
            <span className="flex items-center gap-1">
                <UsersIcon className="w-3 h-3" />
                {event.teamConstraints === 'solo' ? 'Solo' : event.teamConstraints === 'small' ? '2-3' : '3-5'}
            </span>
            {event.region && (
                <span className="flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3" />
                    {event.region.city}
                </span>
            )}
            <span className={`flex items-center gap-1 ml-auto font-medium ${event.daysLeft > 0 ? 'text-orange-400' : 'text-gray-600'}`}>
                <ClockIcon className="w-3 h-3" />
                {event.daysLeft > 0 ? `${event.daysLeft}d left` : 'Ended'}
            </span>
        </div>

        {/* Scorecard */}
        <div className="mt-auto pt-3 border-t border-gray-800 space-y-2.5">
            <div>
                <div className="flex justify-between text-[10px] font-medium mb-1">
                    <span className="text-gray-500 flex items-center gap-1"><SparkleIcon className="w-3 h-3" /> Dynamic Win Probability</span>
                    <span className="text-emerald-400">{event.computedWinRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${event.computedWinRate}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-emerald-500"
                    />
                </div>
            </div>
            <div className="flex justify-between text-[10px] font-medium">
                <span className="text-gray-500 flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Stephen Skill Target Match</span>
                <span className="text-amber-400">{Math.round(event.computedWinRate / 10)}/10</span>
            </div>
        </div>
    </motion.div>
);

// ── Main Competition View ──
const CompetitionView: React.FC = () => {
    const [isConfigured, setIsConfigured] = useState(false);
    const [preferences, setPreferences] = useState<PreferenceVector>(defaultPreferences);
    const [heroIndex, setHeroIndex] = useState(0);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // 2-second hero auto-cycle
    useEffect(() => {
        if (!isConfigured) return;
        const t = setInterval(() => setHeroIndex(prev => (prev + 1) % heroEvents.length), 2000);
        return () => clearInterval(t);
    }, [isConfigured]);

    const allFilters = useMemo(() => {
        const tags = new Set<string>();
        heroEvents.forEach(e => e.tags.forEach(t => tags.add(t)));
        gridEvents.forEach(e => e.tags.forEach(t => tags.add(t)));
        return ['All', ...Array.from(tags).sort()];
    }, []);

    const allEvents = useMemo(() => [...heroEvents, ...gridEvents], []);

    const filteredEvents = useMemo(() => {
        return allEvents.filter(e => {
            if (activeFilter !== 'All' && !e.tags.includes(activeFilter)) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                if (!e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [allEvents, activeFilter, searchQuery]);

    const handleCompleteOnboarding = () => {
        setIsConfigured(true);
    };

    // ── Onboarding Phase ──
    if (!isConfigured) {
        return (
            <div className="flex-1 flex h-full overflow-hidden dark:bg-black bg-neutral-100">
                <OnboardingFlow
                    preferences={preferences}
                    onUpdate={setPreferences}
                    onComplete={handleCompleteOnboarding}
                />
            </div>
        );
    }

    // ── Main View Phase ──
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden dark:bg-black bg-white">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 dark:bg-black/95 bg-white/95 backdrop-blur-md border-b dark:border-gray-800 border-neutral-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex gap-4">
                        <div className="relative group flex-grow">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 dark:text-gray-400 text-gray-500">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search competitions"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full h-[48px] pl-14 pr-32 dark:bg-[#1a1a1a] bg-neutral-100 dark:border-transparent border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm dark:text-white transition-all"
                            />
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2 px-4 py-1.5 border rounded-full text-xs font-bold transition-colors ${isFilterOpen ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'dark:bg-black bg-white border-neutral-200 dark:border-gray-800 dark:text-gray-300 text-neutral-700 hover:dark:bg-gray-900'}`}
                            >
                                <AdjustIcon className="w-4 h-4" />
                                <span>Filters</span>
                            </button>
                        </div>
                        <button
                            onClick={() => { setIsConfigured(false); }}
                            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-700/30 transition-colors"
                        >
                            <SettingsIcon className="w-4 h-4" />
                            Preferences
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-7xl mx-auto w-full px-6 pb-16">

                    {/* ── Hero Carousel ── */}
                    <div className="pt-8 pb-8">
                        <div className="relative h-[280px] md:h-[340px] w-full rounded-[32px] overflow-hidden shadow-xl border dark:border-white/5 border-neutral-200">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={heroEvents[heroIndex].id}
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={`https://images.unsplash.com/photo-${[
                                            '1635070041078-e363dbe005cb?w=1200&h=600&fit=crop',
                                            '1509228468518-180dd4864904?w=1200&h=600&fit=crop',
                                            '1464822759023-fed622ff2c3b?w=1200&h=600&fit=crop',
                                            '1579621970795-87facc2f976d?w=1200&h=600&fit=crop',
                                            '1532094349884-543bc11b234d?w=1200&h=600&fit=crop',
                                            '1500382017468-9049fed747ef?w=1200&h=600&fit=crop',
                                        ][heroEvents.indexOf(heroEvents[heroIndex]) % 6]}`}
                                        alt={heroEvents[heroIndex].title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex flex-col justify-center px-10 md:px-16">
                                        <div className="flex items-center gap-2 mb-3">
                                            {heroEvents[heroIndex].tags.map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                                                    {domainIcons[tag]}{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <motion.h2
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-white text-2xl md:text-4xl font-bold max-w-xl leading-tight mb-3 font-serif"
                                        >
                                            {heroEvents[heroIndex].title}
                                        </motion.h2>
                                        <motion.p
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-gray-300 text-sm max-w-md mb-5 line-clamp-2"
                                        >
                                            {heroEvents[heroIndex].description}
                                        </motion.p>
                                        <motion.div
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex items-center gap-4"
                                        >
                                            <button className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors text-sm">
                                                View Challenge
                                            </button>
                                            <span className="flex items-center gap-1.5 text-sm text-gray-300">
                                                <TrophyIcon className="w-4 h-4 text-amber-400" />
                                                {heroEvents[heroIndex].rewardPool}
                                            </span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                            {/* Dot indicators */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                                {heroEvents.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setHeroIndex(i)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Filter Pills ── */}
                    <div className="mb-6">
                        <NavCarousel items={allFilters} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    </div>

                    {/* ── Results count ── */}
                    <div className="text-sm text-gray-500 mb-5">
                        {filteredEvents.length} competition{filteredEvents.length !== 1 ? 's' : ''}
                        {activeFilter !== 'All' && <> in <span className="text-emerald-400 font-medium">{activeFilter}</span></>}
                    </div>

                    {/* ── Event Grid ── */}
                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CompetitionView;

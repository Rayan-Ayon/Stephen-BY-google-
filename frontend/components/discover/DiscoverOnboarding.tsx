
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XIcon, PlusIcon, YoutubeIcon, XLogoIcon, RedditIcon, GlobeIcon, BookOpenIcon
} from '../icons';
import { SourceConfig } from './types';

const domains = [
    'AI & Machine Learning', 'Quantum Computing', 'Biotechnology', 'Climate Science',
    'Neuroscience', 'Robotics', 'Space Exploration', 'Cybersecurity', 'Energy',
    'Mathematics', 'Linguistics', 'Economics'
];

const defaultChannels: Record<string, string[]> = {
    youtube: ['3Blue1Brown', 'TwoMinutePapers', 'YannicKilcher', 'Sentdex', 'Lex Fridman'],
    twitter: ['@kareem_carr', '@ylecun', '@AndrewYNg', '@miramurati', '@jimfanvision'],
    reddit: ['r/MachineLearning', 'r/singularity', 'r/deeplearning', 'r/artificial', 'r/compsci'],
    news: ['MIT Technology Review', 'Nature News', 'arXiv Blog', 'ScienceDaily', 'Wired AI'],
    journal: ['NeurIPS Proceedings', 'Nature Machine Intelligence', 'JMLR', 'ICLR Papers', 'IEEE TPAMI'],
};

const platformMeta: { key: keyof SourceConfig; label: string; icon: React.ReactNode; badgeBg: string }[] = [
    { key: 'youtube', label: 'YouTube', icon: <YoutubeIcon className="w-6 h-6" />, badgeBg: 'bg-red-600' },
    { key: 'twitter', label: 'X (Twitter)', icon: <XLogoIcon className="w-6 h-6" />, badgeBg: 'bg-slate-700' },
    { key: 'reddit', label: 'Reddit', icon: <RedditIcon className="w-6 h-6" />, badgeBg: 'bg-orange-500' },
    { key: 'news', label: 'News', icon: <GlobeIcon className="w-6 h-6" />, badgeBg: 'bg-blue-600' },
    { key: 'journal', label: 'Journals', icon: <BookOpenIcon className="w-6 h-6" />, badgeBg: 'bg-emerald-700' },
];

const DiscoverOnboarding: React.FC<{
    sourceConfig: SourceConfig;
    onUpdateConfig: (config: SourceConfig) => void;
    onComplete: () => void;
    onClose: () => void;
}> = ({ sourceConfig, onUpdateConfig, onComplete, onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedDomains, setSelectedDomains] = useState<string[]>(['AI & Machine Learning', 'Quantum Computing']);
    const [activePlatforms, setActivePlatforms] = useState<Set<keyof SourceConfig>>(new Set(['youtube', 'twitter', 'reddit', 'news', 'journal']));
    const [channelSelections, setChannelSelections] = useState<Record<string, string[]>>(
        Object.fromEntries(Object.entries(defaultChannels).map(([k, v]) => [k, [...v]]))
    );
    const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

    const togglePlatform = (key: keyof SourceConfig) => {
        const next = new Set(activePlatforms);
        if (next.has(key)) next.delete(key); else next.add(key);
        setActivePlatforms(next);
    };

    const toggleChannel = (platform: string, channel: string) => {
        const current = [...(channelSelections[platform] || [])];
        const idx = current.indexOf(channel);
        if (idx >= 0) current.splice(idx, 1); else current.push(channel);
        setChannelSelections(prev => ({ ...prev, [platform]: current }));
    };

    const addCustomLink = (platform: string) => {
        const val = (customInputs[platform] || '').trim();
        if (!val) return;
        setChannelSelections(prev => ({ ...prev, [platform]: [...(prev[platform] || []), val] }));
        setCustomInputs(prev => ({ ...prev, [platform]: '' }));
    };

    const handleGenerate = () => {
        const config: SourceConfig = {
            youtube: channelSelections.youtube || [],
            twitter: channelSelections.twitter || [],
            reddit: channelSelections.reddit || [],
            news: channelSelections.news || [],
            journal: channelSelections.journal || [],
        };
        onUpdateConfig(config);
        onComplete();
    };

    const StepDomains = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">Select Your Research Domains</h2>
            <p className="text-gray-500 text-sm mb-4">Choose the fields you want to track across all platforms.</p>
            <div className="flex flex-wrap gap-3">
                {domains.map(d => (
                    <button
                        key={d}
                        onClick={() => {
                            setSelectedDomains(prev =>
                                prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
                            );
                        }}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                            selectedDomains.includes(d)
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                    >
                        {d}
                    </button>
                ))}
            </div>
        </div>
    );

    const StepSources = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif mb-2">Choose Your Source Platforms</h2>
            <p className="text-gray-500 text-sm mb-4">Toggle the platforms you want to include in your discovery feed.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformMeta.map(p => (
                    <button
                        key={p.key}
                        onClick={() => togglePlatform(p.key)}
                        className={`p-5 rounded-xl border text-left transition-all flex items-center gap-4 ${
                            activePlatforms.has(p.key)
                                ? 'bg-white/10 border-white text-white'
                                : 'bg-[#111] border-white/10 text-gray-500 hover:border-white/30'
                        }`}
                    >
                        <div className={`p-3 rounded-lg ${p.badgeBg}/20 ${p.badgeBg.replace('bg-', 'text-')}`}>
                            {p.icon}
                        </div>
                        <div>
                            <div className="font-bold text-sm">{p.label}</div>
                            <div className="text-xs text-gray-500">{activePlatforms.has(p.key) ? 'Active' : 'Disabled'}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const StepChannels = () => (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold font-serif mb-2">Configure Your Channels</h2>
            <p className="text-gray-500 text-sm mb-4">Select specific channels and add custom links for each platform.</p>
            {platformMeta.filter(p => activePlatforms.has(p.key)).map(p => (
                <div key={p.key} className="dark:bg-[#121212] bg-gray-50 border dark:border-gray-800 border-gray-200 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${p.badgeBg}/20 ${p.badgeBg.replace('bg-', 'text-')}`}>{p.icon}</div>
                        <h3 className="font-bold text-sm dark:text-white text-black">{p.label}</h3>
                    </div>
                    <div className="space-y-2 mb-4">
                        {(defaultChannels[p.key] || []).map(ch => (
                            <label key={ch} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                    (channelSelections[p.key] || []).includes(ch)
                                        ? 'bg-emerald-600 border-emerald-600'
                                        : 'border-gray-600 group-hover:border-gray-400'
                                }`}>
                                    {(channelSelections[p.key] || []).includes(ch) && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={(channelSelections[p.key] || []).includes(ch)}
                                    onChange={() => toggleChannel(p.key, ch)}
                                />
                                <span className="text-sm dark:text-gray-300 text-neutral-700">{ch}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={`+ Add custom ${p.label} link/handle...`}
                            value={customInputs[p.key] || ''}
                            onChange={e => setCustomInputs(prev => ({ ...prev, [p.key]: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter') addCustomLink(p.key); }}
                            className="flex-1 bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-gray-500"
                        />
                        <button
                            onClick={() => addCustomLink(p.key)}
                            className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                        </button>
                    </div>
                    {(channelSelections[p.key] || []).filter(ch => !(defaultChannels[p.key] || []).includes(ch)).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(channelSelections[p.key] || []).filter(ch => !(defaultChannels[p.key] || []).includes(ch)).map(ch => (
                                <span key={ch} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-900/20 border border-emerald-500/30 rounded-full text-xs text-emerald-300">
                                    {ch}
                                    <button onClick={() => toggleChannel(p.key, ch)} className="hover:text-white">
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-[#0a0a0a] border dark:border-white/10 border-gray-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
                    <div>
                        <h3 className="text-lg font-bold text-white font-serif leading-none mb-0.5">Cross-Mapping Setup</h3>
                        <p className="text-xs text-gray-500">Configure your discovery pipeline</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-[#1a1a1a]">
                    <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${(step / 3) * 100}%` }} />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <StepDomains />
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <StepSources />
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <StepChannels />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-[#0a0a0a] flex justify-between items-center">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors">Back</button>
                    ) : (
                        <div />
                    )}
                    {step < 3 ? (
                        <button onClick={() => setStep(step + 1)} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors">Next</button>
                    ) : (
                        <button onClick={handleGenerate} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20">
                            Generate Feed Matrix
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default DiscoverOnboarding;

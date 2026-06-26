
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShareIcon, CloudyIcon, SunIcon, TrendingUpIcon, TrendingDownIcon,
    XIcon, RefreshIcon
} from './icons';
import { SourceConfig, DiscoverPhase } from './discover/types';
import DiscoverOnboarding from './discover/DiscoverOnboarding';
import DiscoverGrid from './discover/DiscoverGrid';

const processingLogs: string[] = [
    '[KERNEL] Initializing cross-mapping pipeline v2.4.1...',
    '[YOUTUBE] Scanning 5 channels · 142 videos queued',
    '[TWITTER] Streaming timeline · 8 accounts · 2400 tweets processed',
    '[REDDIT] Crawling r/MachineLearning, r/deeplearning, r/singularity ...',
    '[NEWS] Parsing 3 RSS feeds · deduplication active',
    '[JOURNAL] Querying arXiv, NeurIPS, JMLR · 89 preprints found',
    '[EMBEDDING] Generating vector representations · dim=4096',
    '[CLUSTER] Community detection · k=12 · modularity=0.73',
    '[CROSS-MAP] Linking entities across YouTube ↔ Twitter ↔ arXiv',
    '[CROSS-MAP] Confidence threshold 0.75 · 340 edges established',
    '[FILTER] Applying domain weights · AI=0.85 Quantum=0.62 Bio=0.31',
    '[RANK] Scoring by cross-source signal strength',
    '[COMPLETE] Feed matrix generated · 8 cross-mapped cards ready',
];

interface DiscoverViewProps {
    email?: string;
}

const defaultConfig: SourceConfig = {
    youtube: ['3Blue1Brown', 'TwoMinutePapers', 'YannicKilcher', 'Sentdex', 'Lex Fridman'],
    twitter: ['@kareem_carr', '@ylecun', '@AndrewYNg', '@miramurati', '@jimfanvision'],
    reddit: ['r/MachineLearning', 'r/singularity', 'r/deeplearning', 'r/artificial', 'r/compsci'],
    news: ['MIT Technology Review', 'Nature News', 'arXiv Blog', 'ScienceDaily', 'Wired AI'],
    journal: ['NeurIPS Proceedings', 'Nature Machine Intelligence', 'JMLR', 'ICLR Papers', 'IEEE TPAMI'],
};

const DiscoverView: React.FC<DiscoverViewProps> = ({ email = 'ayonburg@gmail.com' }) => {
    const userEmail = email;
    const stateKey = `discover_phase_${userEmail}`;
    const configKey = `discover_config_${userEmail}`;
    const lastPhaseRef = useRef<DiscoverPhase>('welcome');

    const [phase, setPhase] = useState<DiscoverPhase>(() => {
        try {
            const stored = localStorage.getItem(stateKey);
            if (stored === 'feed') return 'feed';
        } catch {}
        return 'welcome';
    });
    const [sourceConfig, setSourceConfig] = useState<SourceConfig>(() => {
        try {
            const stored = localStorage.getItem(configKey);
            if (stored) return JSON.parse(stored);
        } catch {}
        return defaultConfig;
    });
    const [logIndex, setLogIndex] = useState(0);
    const [activeLogs, setActiveLogs] = useState<string[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    // Processing simulation
    useEffect(() => {
        if (phase !== 'processing') return;
        setActiveLogs([]);
        setLogIndex(0);
        const interval = setInterval(() => {
            setLogIndex(prev => {
                const next = prev + 1;
                setActiveLogs(logs => [...logs, processingLogs[prev]].slice(-8));
                if (next >= processingLogs.length) {
                    clearInterval(interval);
                    setTimeout(() => setPhase('feed'), 400);
                    return next;
                }
                return next;
            });
        }, 320);
        return () => clearInterval(interval);
    }, [phase]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeLogs]);

    // Persist phase and config to localStorage on every change
    useEffect(() => {
        try {
            localStorage.setItem(stateKey, phase);
            localStorage.setItem(configKey, JSON.stringify(sourceConfig));
        } catch {}
    }, [phase, sourceConfig, stateKey, configKey]);

    const handleStartOnboarding = () => {
        lastPhaseRef.current = phase;
        setPhase('onboarding');
    };
    const handleOnboardingComplete = () => setPhase('processing');

    return (
        <div className="flex-1 flex h-full overflow-hidden dark:bg-black bg-neutral-100 dark:text-gray-300 text-neutral-800">

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 pt-24">

                {phase === 'welcome' && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-xl"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 flex items-center justify-center">
                                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold dark:text-white text-black mb-3 font-serif">Multi-Source Discovery</h1>
                            <p className="dark:text-gray-500 text-neutral-600 text-sm mb-8 leading-relaxed max-w-md mx-auto">
                                Cross-map content from YouTube, X, Reddit, news, and journals into a unified, ranked feed.
                                Configure your sources, then let the engine find the signal across platforms.
                            </p>
                            <button
                                onClick={handleStartOnboarding}
                                className="px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20 text-sm"
                            >
                                Configure Your Discovery Engine
                            </button>
                        </motion.div>
                    </div>
                )}

                {phase === 'processing' && (
                    <div className="h-full flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full max-w-lg"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <RefreshIcon className="w-5 h-5 text-emerald-400 animate-spin" />
                                <h2 className="text-lg font-bold dark:text-white text-black font-serif">Generating Your Discovery Feed</h2>
                            </div>
                            <div className="dark:bg-[#121212] bg-white border dark:border-white/10 border-gray-200 rounded-xl p-5 font-mono text-xs leading-relaxed h-64 overflow-y-auto custom-scrollbar">
                                {activeLogs.map((log, i) => (
                                    <motion.div
                                        key={`${i}-${log}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={log.includes('COMPLETE') ? 'text-emerald-400' : 'dark:text-gray-400 text-neutral-600'}
                                    >
                                        {log}
                                    </motion.div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-xs dark:text-gray-600 text-neutral-500">
                                <div className="w-32 h-1.5 dark:bg-neutral-800 bg-neutral-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500 rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${(logIndex / processingLogs.length) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <span>{Math.round((logIndex / processingLogs.length) * 100)}%</span>
                            </div>
                        </motion.div>
                    </div>
                )}

                {phase === 'feed' && (
                    <>
                        <header className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-bold dark:text-white text-black font-serif">Discovery Feed</h1>
                                <div className="flex items-center space-x-1 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 rounded-lg p-1">
                                    <button className="px-3 py-1 text-sm rounded-md dark:bg-gray-700 bg-neutral-200 dark:text-white text-black font-medium">Cross-Mapped</button>
                                    <button className="px-3 py-1 text-sm rounded-md text-gray-500 dark:hover:bg-gray-800 hover:bg-neutral-100 transition-colors">Latest</button>
                                    <button className="px-3 py-1 text-sm rounded-md text-gray-500 dark:hover:bg-gray-800 hover:bg-neutral-100 transition-colors">Trending</button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="hidden sm:flex text-xs dark:text-gray-600 text-neutral-500 items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    5 platforms · {sourceConfig.youtube.length + sourceConfig.twitter.length + sourceConfig.reddit.length + sourceConfig.news.length + sourceConfig.journal.length} sources
                                </span>
                                <button
                                    onClick={handleStartOnboarding}
                                    className="flex items-center text-sm font-semibold dark:text-gray-300 text-neutral-700 dark:hover:text-white hover:text-black dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 px-4 py-2 rounded-lg transition-colors hover:bg-neutral-50"
                                >
                                    <RefreshIcon className="w-4 h-4 mr-2" />
                                    Reconfigure
                                </button>
                                <button className="flex items-center text-sm font-semibold dark:text-gray-300 text-neutral-700 dark:hover:text-white hover:text-black dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 px-4 py-2 rounded-lg transition-colors hover:bg-neutral-50">
                                    <ShareIcon className="w-4 h-4 mr-2" />
                                    Share Feed
                                </button>
                            </div>
                        </header>
                        <DiscoverGrid />
                    </>
                )}

            </div>

            {/* Right Sidebar — preserved exactly */}
            <aside className="w-96 border-l dark:border-gray-800 border-neutral-200 p-6 pt-24 overflow-y-auto hidden lg:block shrink-0 dark:bg-black bg-neutral-50">

                <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-5 mb-6 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold dark:text-white text-black text-3xl">29°c</p>
                            <p className="dark:text-gray-400 text-neutral-500">Dhaka</p>
                        </div>
                        <div className="text-right">
                           <CloudyIcon className="w-10 h-10 text-gray-400 mb-1"/>
                           <p className="text-sm text-gray-400">Cloudy</p>
                           <p className="text-xs text-gray-500">H: 32° L: 26°</p>
                        </div>
                    </div>
                    <div className="border-t dark:border-gray-800 border-neutral-200 my-4"></div>
                    <div className="flex justify-between text-center text-sm">
                        {['Thu', 'Fri', 'Sat', 'Sun', 'Mon'].map((day, i) => (
                             <div key={day} className="flex flex-col items-center">
                                 <span className="dark:text-gray-400 text-neutral-500">{day}</span>
                                 { i % 2 === 0 ? <SunIcon className="w-6 h-6 my-1.5 text-yellow-400"/> : <CloudyIcon className="w-6 h-6 my-1.5 text-gray-400"/>}
                                 <span className="dark:text-white text-black font-medium">{32-i}°</span>
                             </div>
                        ))}
                    </div>
                </div>

                <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-5 mb-6 shadow-sm">
                    <h3 className="font-bold dark:text-white text-black mb-4">Market Outlook</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm">
                            <p className="dark:text-gray-400 text-neutral-500">S&P 500</p>
                            <p className="text-red-400 flex items-center">-0.41% <TrendingDownIcon className="w-4 h-4 ml-1"/></p>
                            <p className="dark:text-white text-black font-semibold text-lg mt-1">6,865.55</p>
                        </div>
                         <div className="text-sm">
                            <p className="dark:text-gray-400 text-neutral-500">NASDAQ</p>
                            <p className="text-green-400 flex items-center">+0.79% <TrendingUpIcon className="w-4 h-4 ml-1"/></p>
                            <p className="dark:text-white text-black font-semibold text-lg mt-1">23,770.195</p>
                        </div>
                    </div>
                </div>

                 <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold dark:text-white text-black mb-4">Trending Companies</h3>
                    <div className="space-y-4">
                         {[{name: 'Apple Inc.', ticker: 'AAPL', price: '+0.23%', color: 'green'}, {name: 'Amazon.com, Inc.', ticker: 'AMZN', price: '-1.15%', color: 'red'}, {name: 'Microsoft Corporation', ticker: 'MSFT', price: '-2.45%', color: 'red'}].map(c => (
                            <div key={c.name} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-semibold dark:text-white text-black">{c.ticker}</p>
                                    <p className="text-gray-500 text-xs">{c.name}</p>
                                </div>
                                <div className={`font-medium ${c.color === 'green' ? 'text-green-400' : 'text-red-400'}`}>{c.price}</div>
                            </div>
                        ))}
                    </div>
                 </div>

            </aside>

            {/* Onboarding Modal */}
            <AnimatePresence>
                {phase === 'onboarding' && (
                    <DiscoverOnboarding
                        sourceConfig={sourceConfig}
                        onUpdateConfig={setSourceConfig}
                        onComplete={handleOnboardingComplete}
                        onClose={() => setPhase(lastPhaseRef.current)}
                    />
                )}
            </AnimatePresence>

        </div>
    );
};

export default DiscoverView;

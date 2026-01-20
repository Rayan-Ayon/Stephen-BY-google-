
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircleIcon, StarIcon, ChatIcon, UsersIcon, 
    TrophyIcon, TrendingUpIcon, ClockIcon, ChevronRightIcon,
    LocationTrackerIcon, FlaskIcon, MicroscopeIcon,
    BrainIcon, AdjustIcon, FileTextIcon,
    GlobeIcon,
    LightningIcon, // Assuming visual for impact, if not present will fallback
    SparkleIcon,
    AlertIcon, // Fallback if not present
    LabIcon,
    WrenchIcon,
    BookOpenIcon
} from './icons';

// --- Mock Data & Types ---

const RESEARCH_PROJECT = {
    title: "Neuromorphic Vision Processors for Autonomous Swarms",
    domain: "Robotics / Edge AI",
    status: "Prototyping",
    progress: 68,
    healthScore: 92, // 0-100
    mentor: "Dr. Sarah Chen",
    deadline: "Nov 14, 2026",
    milestones: [
        { id: 1, label: "Hypothesis", status: "completed", date: "Jan 10" },
        { id: 2, label: "Literature Review", status: "completed", date: "Feb 15" },
        { id: 3, label: "Simulation", status: "completed", date: "Mar 20" },
        { id: 4, label: "Hardware Prototype", status: "active", eta: "2 weeks" },
        { id: 5, label: "Field Testing", status: "pending", eta: "2 months" },
        { id: 6, label: "Publication", status: "pending", eta: "4 months" },
    ]
};

const EXPERIMENTS = [
    { id: "EXP-042", name: "Latency Test v4.1", date: "Today, 10:42 AM", status: "Success", metric: "12ms", delta: "-4ms", result: "pass" },
    { id: "EXP-041", name: "Power Consumption", date: "Yesterday", status: "Failed", metric: "4.2W", delta: "+1.2W", result: "fail" },
    { id: "EXP-040", name: "Optical Flow Algo", date: "Oct 24", status: "Success", metric: "98% Acc", delta: "+2%", result: "pass" },
];

const RESOURCES = [
    { type: "Paper", title: "Spiking Neural Networks in Edge Devices (2024)", status: "Read" },
    { type: "Dataset", title: "Drone-Swarm-Vision-v2 (12TB)", status: "Linked" },
    { type: "Tool", title: "PyTorch Lightning / CUDA 12.4", status: "Active" },
];

const AI_SUGGESTIONS = [
    { type: "insight", text: "Based on EXP-041 failure, consider reducing the batch size for the inference engine." },
    { type: "resource", text: "New paper published by MIT CSAIL relates to your optical flow algorithm." },
    { type: "risk", text: "Milestone 'Field Testing' is at risk of delay due to hardware procurement." }
];

// --- Sub-Components ---

const HealthBadge = ({ score }: { score: number }) => {
    let color = "text-green-500 border-green-500/30 bg-green-500/10";
    if (score < 80) color = "text-yellow-500 border-yellow-500/30 bg-yellow-500/10";
    if (score < 50) color = "text-red-500 border-red-500/30 bg-red-500/10";

    return (
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${color}`}>
            <div className="relative w-2.5 h-2.5">
                <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <div className={`relative rounded-full w-2.5 h-2.5 ${score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            </div>
            <span className="text-xs font-bold font-mono tracking-wider">HEALTH: {score}%</span>
        </div>
    );
};

const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
        />
    </div>
);

const TimelineStep = ({ label, status, date, eta, isLast }: { label: string, status: string, date?: string, eta?: string, isLast?: boolean }) => {
    const isActive = status === 'active';
    const isCompleted = status === 'completed';
    
    return (
        <div className="flex flex-col relative flex-1">
            <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full border-2 z-10 ${isCompleted ? 'bg-green-500 border-green-500' : isActive ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-gray-600'}`}></div>
                {!isLast && <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`}></div>}
            </div>
            <div className="pr-4">
                <p className={`text-xs font-bold mb-0.5 ${isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-gray-500'}`}>{label}</p>
                <p className="text-[10px] text-gray-500 font-mono">{date || eta}</p>
            </div>
        </div>
    );
};

const MiniChart = ({ data, color = "stroke-blue-500" }: { data: number[], color?: string }) => {
    // Simple SVG Sparkline
    const max = Math.max(...data);
    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 100}`).join(" ");

    return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <polyline
                fill="none"
                strokeWidth="2"
                className={color}
                points={points}
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
};

const RadarChart = () => {
    // Decorative simplified radar chart for "Growth"
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 overflow-visible">
                <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" className="fill-none stroke-gray-700 stroke-1" />
                <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" className="fill-none stroke-gray-800 stroke-1" />
                <polygon points="50,0 80,25 90,75 50,90 20,70 10,30" className="fill-blue-500/20 stroke-blue-500 stroke-2" />
                <circle cx="50" cy="0" r="2" className="fill-blue-400" />
                <circle cx="80" cy="25" r="2" className="fill-blue-400" />
                <circle cx="90" cy="75" r="2" className="fill-blue-400" />
            </svg>
            <div className="absolute top-0 text-[9px] text-gray-400 font-mono bg-black/50 px-1">Research</div>
            <div className="absolute bottom-0 text-[9px] text-gray-400 font-mono bg-black/50 px-1">Ethics</div>
            <div className="absolute left-0 text-[9px] text-gray-400 font-mono bg-black/50 px-1">Coding</div>
            <div className="absolute right-0 text-[9px] text-gray-400 font-mono bg-black/50 px-1">Collab</div>
        </div>
    );
};

const TrackerView = () => {
    const [selectedTab, setSelectedTab] = useState('Overview');

    return (
        <div className="flex-1 overflow-y-auto h-full dark:bg-black bg-neutral-100 dark:text-gray-200 text-neutral-800 p-6 lg:p-10 font-sans">
            <div className="max-w-[1400px] mx-auto space-y-6">
                
                {/* Header Area */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                            <span>Research Command Center</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-black font-serif tracking-tight">
                            Project Alpha: Vision
                        </h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-semibold hover:border-gray-400 transition-colors">
                            Export Log
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
                            + New Experiment
                        </button>
                    </div>
                </header>

                {/* --- GRID LAYOUT --- */}
                <div className="grid grid-cols-12 gap-6">

                    {/* COL 1: Main Project Context (8 cols) */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        
                        {/* 1. Active Project Card */}
                        <div className="dark:bg-[#0f0f0f] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center space-x-3 mb-1">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            {RESEARCH_PROJECT.domain}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                            {RESEARCH_PROJECT.status}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold dark:text-white text-black mt-2">{RESEARCH_PROJECT.title}</h2>
                                    <p className="text-sm text-gray-500 mt-1">Lead: Me • Mentor: {RESEARCH_PROJECT.mentor}</p>
                                </div>
                                <HealthBadge score={RESEARCH_PROJECT.healthScore} />
                            </div>

                            <div className="space-y-2 mb-8">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <span>Progress</span>
                                    <span>{RESEARCH_PROJECT.progress}%</span>
                                </div>
                                <ProgressBar progress={RESEARCH_PROJECT.progress} />
                            </div>

                            {/* Milestones Stepper */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Milestone Timeline</h3>
                                <div className="flex flex-wrap gap-y-4">
                                    {RESEARCH_PROJECT.milestones.map((m, i) => (
                                        <TimelineStep 
                                            key={m.id} 
                                            label={m.label}
                                            status={m.status}
                                            date={m.date}
                                            eta={m.eta}
                                            isLast={i === RESEARCH_PROJECT.milestones.length - 1} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 5. Experiments & Logs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="dark:bg-[#0f0f0f] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold dark:text-white text-black flex items-center">
                                        <FlaskIcon className="w-4 h-4 mr-2 text-violet-500" /> Recent Experiments
                                    </h3>
                                    <button className="text-xs text-gray-500 hover:text-white transition-colors">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {EXPERIMENTS.map(exp => (
                                        <div key={exp.id} className="group flex items-center justify-between p-3 rounded-xl dark:bg-[#1a1a1a] bg-gray-50 border dark:border-white/5 border-gray-200 hover:border-gray-400 dark:hover:border-gray-600 transition-all cursor-pointer">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-mono text-xs text-gray-500">{exp.id}</span>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${exp.result === 'pass' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                </div>
                                                <div className="font-bold text-sm dark:text-gray-200 text-gray-800">{exp.name}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono text-sm font-bold dark:text-white text-black">{exp.metric}</div>
                                                <div className={`text-[10px] ${exp.result === 'pass' ? 'text-green-500' : 'text-red-500'}`}>{exp.delta}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Knowledge & Resources */}
                            <div className="dark:bg-[#0f0f0f] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold dark:text-white text-black flex items-center">
                                        <BookOpenIcon className="w-4 h-4 mr-2 text-blue-500" /> Active Resources
                                    </h3>
                                    <button className="p-1 hover:bg-gray-800 rounded text-gray-500"><AdjustIcon className="w-4 h-4"/></button>
                                </div>
                                <div className="space-y-3">
                                    {RESOURCES.map((res, i) => (
                                        <div key={i} className="flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10">
                                            <div className="mt-1 mr-3 text-gray-500 group-hover:text-blue-400">
                                                {res.type === 'Paper' ? <FileTextIcon className="w-4 h-4" /> : res.type === 'Dataset' ? <LocationTrackerIcon className="w-4 h-4" /> : <WrenchIcon className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium dark:text-gray-300 text-gray-800 leading-snug">{res.title}</div>
                                                <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{res.type} • <span className="text-green-500">{res.status}</span></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t dark:border-gray-800 border-gray-100">
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <p className="text-xs text-blue-400 font-medium flex items-center">
                                            <BrainIcon className="w-3 h-3 mr-2" />
                                            AI Detected: Knowledge gap in "Spiking Neural Networks" optimization.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* 6. Output & Impact (Bottom Full) */}
                        <div className="dark:bg-[#0f0f0f] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold dark:text-white text-black flex items-center">
                                    <GlobeIcon className="w-4 h-4 mr-2 text-teal-500" /> Output & Impact
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="p-4 rounded-xl dark:bg-[#1a1a1a] bg-gray-50 border dark:border-white/5 border-gray-200">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Papers</div>
                                    <div className="text-2xl font-bold dark:text-white text-black">1 <span className="text-sm text-gray-500 font-normal">published</span></div>
                                    <div className="text-sm text-gray-500">2 preprints</div>
                                </div>
                                <div className="p-4 rounded-xl dark:bg-[#1a1a1a] bg-gray-50 border dark:border-white/5 border-gray-200">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Code</div>
                                    <div className="text-2xl font-bold dark:text-white text-black">85% <span className="text-sm text-gray-500 font-normal">coverage</span></div>
                                    <div className="text-sm text-gray-500">Reproduction score: High</div>
                                </div>
                                <div className="p-4 rounded-xl dark:bg-[#1a1a1a] bg-gray-50 border dark:border-white/5 border-gray-200">
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Innovation</div>
                                    <div className="text-2xl font-bold dark:text-white text-black">1 <span className="text-sm text-gray-500 font-normal">Prototype</span></div>
                                    <div className="text-sm text-gray-500">TRL Level 4</div>
                                </div>
                                <div className="p-4 rounded-xl dark:bg-[#1a1a1a] bg-gray-50 border dark:border-white/5 border-gray-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
                                    <div className="relative z-10">
                                        <div className="text-xs text-green-500 uppercase tracking-widest mb-2 font-bold">Impact Score</div>
                                        <div className="text-2xl font-bold dark:text-white text-black">8.4</div>
                                        <div className="text-sm text-green-500 font-medium">Top 5% in Domain</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* COL 2: Assistant & Support (4 cols) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        
                        {/* 7. AI Research Assistant (Signature) */}
                        <div className="dark:bg-[#0f0f0f] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 shadow-lg shadow-purple-900/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                            
                            <div className="flex items-center space-x-2 mb-6">
                                <SparkleIcon className="w-5 h-5 text-purple-500" />
                                <h3 className="font-bold dark:text-white text-black">AI Assistant</h3>
                            </div>

                            <div className="space-y-4 mb-6">
                                {AI_SUGGESTIONS.map((sug, i) => (
                                    <div key={i} className="p-3 rounded-lg dark:bg-white/5 bg-gray-50 border dark:border-white/10 border-gray-200 text-sm">
                                        <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                                            sug.type === 'risk' ? 'text-red-400' : sug.type === 'insight' ? 'text-blue-400' : 'text-green-400'
                                        }`}>
                                            {sug.type}
                                        </div>
                                        <p className="dark:text-gray-300 text-gray-700 leading-snug">{sug.text}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Ask about your data..." 
                                    className="w-full bg-neutral-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all dark:text-white placeholder-gray-500"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-400">
                                    <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* 8. Personal Growth & Team */}
                        <div className="dark:bg-[#0f0f0f] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold dark:text-white text-black mb-6 flex items-center justify-between">
                                <div className="flex items-center"><UsersIcon className="w-4 h-4 mr-2 text-yellow-500" /> Team</div>
                                <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-500">3 Active</span>
                            </h3>
                            <div className="flex -space-x-2 overflow-hidden mb-6">
                                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#111]" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#111]" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#111]" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80" alt="" />
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-[#111]">+1</div>
                            </div>
                            
                            <div className="border-t dark:border-gray-800 border-gray-100 pt-6">
                                <h3 className="font-bold dark:text-white text-black mb-4 flex items-center">
                                    <TrophyIcon className="w-4 h-4 mr-2 text-orange-500" /> Growth
                                </h3>
                                <div className="h-40 w-full mb-4">
                                    <RadarChart />
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Research Maturity</span>
                                    <span className="font-bold dark:text-white text-black">Level 4</span>
                                </div>
                                <div className="flex justify-between items-center text-xs mt-2">
                                    <span className="text-gray-500">Bloom's Level</span>
                                    <span className="font-bold text-blue-500">Analyzing</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default TrackerView;
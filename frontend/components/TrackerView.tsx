
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Added missing ShieldCheckIcon to imports
import { 
    CheckCircleIcon, StarIcon, MessageCircleIcon, UsersIcon, 
    TrophyIcon, TrendingUpIcon, ClockIcon, ChevronRightIcon,
    FlaskIcon, MicroscopeIcon, BrainIcon, AdjustIcon, FileTextIcon,
    GlobeIcon, SparkleIcon, LightningIcon, AlertIcon, 
    DoubleChevronUpIcon, BookOpenIcon, PlusIcon, SendIcon,
    ShieldCheckIcon
} from './icons';

// --- Types & Data ---

interface Milestone {
    id: string;
    label: string;
    status: 'completed' | 'active' | 'pending';
    date?: string;
    eta?: string;
}

interface Experiment {
    id: string;
    name: string;
    version: string;
    metric: string;
    result: 'success' | 'failed';
    date: string;
}

const ACTIVE_RESEARCH = {
    title: "Neuromorphic Vision Processors for Autonomous Swarms",
    domain: "Robotics / Edge AI",
    phase: "Experimentation",
    status: "Ongoing",
    progress: 72,
    healthScore: 88,
    mentor: "Dr. Sarah Chen (MIT)",
    nextCheckpoint: "Nov 14, 2026",
    milestones: [
        { id: '1', label: "Idea", status: 'completed', date: "Jan 10" },
        { id: '2', label: "Proposal", status: 'completed', date: "Feb 15" },
        { id: '3', label: "Review", status: 'completed', date: "Mar 20" },
        { id: '4', label: "Experiment", status: 'active', eta: "2 weeks" },
        { id: '5', label: "Validation", status: 'pending', eta: "2 months" },
        { id: '6', label: "Publication", status: 'pending', eta: "4 months" },
    ] as Milestone[],
    team: [
        { name: "AyonLogy", role: "Lead", institution: "UaiU", status: "Active" },
        { name: "S. Brown", role: "Researcher", institution: "Stanford", status: "Active" },
        { name: "K. Tanaka", role: "Engineer", institution: "Kyoto U", status: "External" },
    ],
    experiments: [
        { id: "EXP-802", name: "Backprop Latency", version: "v4.2.1", metric: "12.4ms", result: "success", date: "Today" },
        { id: "EXP-801", name: "Power Load Alpha", version: "v4.2.0", metric: "4.8W", result: "failed", date: "Yesterday" },
        { id: "EXP-799", name: "Swarm Optical Flow", version: "v4.1.9", metric: "98.2%", result: "success", date: "Oct 28" },
    ] as Experiment[],
};

// --- Sub-Components ---

const HealthScoreHUD = ({ score }: { score: number }) => (
    <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-gray-800" />
            <motion.circle 
                cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="4" fill="transparent" 
                strokeDasharray={213.6} 
                initial={{ strokeDashoffset: 213.6 }}
                animate={{ strokeDashoffset: 213.6 - (213.6 * score) / 100 }}
                className={score > 80 ? "text-green-500" : "text-yellow-500"} 
            />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold font-mono">{score}</span>
            <span className="text-[8px] font-bold text-gray-500">HEALTH</span>
        </div>
    </div>
);

const RadarChart = () => (
    <div className="relative w-full h-40 flex items-center justify-center mt-4">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" className="fill-none stroke-gray-300 dark:stroke-gray-800 stroke-1" />
            <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" className="fill-none stroke-gray-300 dark:stroke-gray-800 stroke-1" />
            <motion.polygon 
                points="50,10 90,30 85,70 50,90 25,75 15,35" 
                className="fill-blue-500/20 stroke-blue-500 stroke-2" 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
            />
        </svg>
        <div className="absolute top-0 text-[9px] font-bold text-gray-400">Analysis</div>
        <div className="absolute bottom-0 text-[9px] font-bold text-gray-400">Creativity</div>
        <div className="absolute left-0 text-[9px] font-bold text-gray-400">Ethics</div>
        <div className="absolute right-0 text-[9px] font-bold text-gray-400">Research</div>
    </div>
);

// --- Main Tracker Segment ---

const TrackerView: React.FC = () => {
    return (
        <div className="flex-1 h-full overflow-y-auto dark:bg-black bg-neutral-50 p-6 lg:p-10 pt-24 custom-scrollbar">
            <div className="max-w-[1600px] mx-auto space-y-6">
                
                {/* Header HUD */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 text-blue-500 font-bold text-xs uppercase tracking-[0.2em] mb-2">
                            <LightningIcon className="w-4 h-4" />
                            <span>UaiU Strategic Intelligence</span>
                        </div>
                        <h1 className="text-4xl font-bold dark:text-white text-black font-serif">Research Command Center</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-6 py-2.5 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-gray-800 rounded-xl text-sm font-bold shadow-sm hover:border-gray-400 transition-all">
                            Export Manifest
                        </button>
                        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all">
                            Start New Stream
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN: Project Context */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        
                        {/* 1. Active Projects Box */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="dark:bg-[#0d0d0d] bg-white border dark:border-gray-800 border-neutral-200 rounded-[32px] p-8 shadow-sm relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-500/10 transition-colors" />
                            
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                            {ACTIVE_RESEARCH.domain}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-500 border border-purple-500/20">
                                            {ACTIVE_RESEARCH.status}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold dark:text-white text-black mb-2 leading-tight">{ACTIVE_RESEARCH.title}</h2>
                                    <p className="text-gray-500 text-sm flex items-center">
                                        <ClockIcon className="w-4 h-4 mr-2" />
                                        Next Checkpoint: <span className="text-blue-500 font-bold ml-1">{ACTIVE_RESEARCH.nextCheckpoint}</span>
                                    </p>
                                </div>
                                <HealthScoreHUD score={ACTIVE_RESEARCH.healthScore} />
                            </div>

                            <div className="space-y-3 mb-10 relative z-10">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
                                    <span>Sync Progress</span>
                                    <span>{ACTIVE_RESEARCH.progress}%</span>
                                </div>
                                <div className="w-full h-2 dark:bg-gray-800 bg-neutral-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-500" 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${ACTIVE_RESEARCH.progress}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            {/* 2. Research Milestones Box */}
                            <div className="relative z-10 pt-6 border-t dark:border-gray-800 border-neutral-100">
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center justify-between">
                                    <span>Research Milestones</span>
                                    <span className="text-blue-500 normal-case">AI Prediction: +3 Days Acceleration Expected</span>
                                </h3>
                                <div className="flex flex-wrap items-center gap-y-6">
                                    {ACTIVE_RESEARCH.milestones.map((m, i) => (
                                        <div key={m.id} className="flex-1 min-w-[140px] relative group/ms">
                                            <div className="flex items-center mb-3">
                                                <div className={`w-4 h-4 rounded-full border-2 z-10 transition-all ${
                                                    m.status === 'completed' ? 'bg-green-500 border-green-500 shadow-[0_0_10px_#22c55e]' : 
                                                    m.status === 'active' ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_#3b82f6]' : 
                                                    'bg-transparent border-gray-600'
                                                }`} />
                                                {i < ACTIVE_RESEARCH.milestones.length - 1 && (
                                                    <div className={`flex-1 h-0.5 mx-2 ${m.status === 'completed' ? 'bg-green-500' : 'bg-gray-800'}`} />
                                                )}
                                            </div>
                                            <div>
                                                <p className={`text-xs font-bold ${m.status === 'active' ? 'dark:text-white text-black' : 'text-gray-500'}`}>{m.label}</p>
                                                <p className="text-[10px] font-mono text-gray-600 mt-1">{m.date || m.eta}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 5. Experiments & Logs Box */}
                            <div className="dark:bg-[#0d0d0d] bg-white border dark:border-gray-800 border-neutral-200 rounded-[32px] p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold dark:text-white text-black flex items-center">
                                        <FlaskIcon className="w-5 h-5 mr-3 text-purple-500" />
                                        Experiments & Logs
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">AUTO-GEN SYNC</span>
                                </div>
                                <div className="space-y-3">
                                    {ACTIVE_RESEARCH.experiments.map(exp => (
                                        <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl dark:bg-[#151515] bg-neutral-50 border dark:border-white/5 border-neutral-200 hover:border-gray-400 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${exp.result === 'success' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                                                <div>
                                                    <p className="text-xs font-bold dark:text-white text-black leading-none mb-1">{exp.name}</p>
                                                    <p className="text-[10px] font-mono text-gray-500 uppercase">{exp.version} • {exp.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold font-mono dark:text-blue-400 text-blue-600">{exp.metric}</p>
                                                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Repro: 0.98</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors border border-dashed dark:border-gray-800 rounded-lg">
                                    + View All 84 Experiments
                                </button>
                            </div>

                            {/* 4. Knowledge & Resources Box */}
                            <div className="dark:bg-[#0d0d0d] bg-white border dark:border-gray-800 border-neutral-200 rounded-[32px] p-6 shadow-sm flex flex-col">
                                <h3 className="font-bold dark:text-white text-black flex items-center mb-6">
                                    <BookOpenIcon className="w-5 h-5 mr-3 text-orange-500" />
                                    Knowledge Graph
                                </h3>
                                <div className="space-y-4 flex-1">
                                    <div className="p-3 rounded-xl dark:bg-orange-500/5 bg-orange-50 border border-orange-500/20">
                                        <p className="text-[11px] font-bold text-orange-500 uppercase mb-2 flex items-center">
                                            <BrainIcon className="w-3 h-3 mr-2" /> Knowledge Gap Detected
                                        </p>
                                        <p className="text-xs dark:text-gray-300 text-gray-700 leading-relaxed">You have 12% lower mastery in "Asynchronous Swarm Protocols" than required for the next phase.</p>
                                    </div>
                                    <div className="space-y-2">
                                        {['Paper: Spiking Vision v2', 'Dataset: Swarm-42-Lidar', 'Tool: CUDA Lab 12.4'].map(res => (
                                            <div key={res} className="flex items-center justify-between text-xs px-2 group cursor-pointer">
                                                <span className="text-gray-500 group-hover:text-blue-500 transition-colors flex items-center">
                                                    <ChevronRightIcon className="w-3 h-3 mr-2" /> {res}
                                                </span>
                                                <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 border-t dark:border-gray-800 border-neutral-100 mt-auto">
                                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
                                        <span>READING PROGRESS</span>
                                        <span>68% Total</span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-orange-500 w-[68%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 6. Output & Impact Box */}
                        <div className="dark:bg-[#0d0d0d] bg-white border dark:border-gray-800 border-neutral-200 rounded-[32px] p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold dark:text-white text-black flex items-center">
                                    <TrophyIcon className="w-5 h-5 mr-3 text-yellow-500" />
                                    Output & Impact
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold dark:text-gray-400">Scientific Impact Score:</span>
                                    <span className="text-xl font-bold dark:text-white font-mono">8.4</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Published', val: '2', sub: 'Citations: 14' },
                                    { label: 'Prototypes', val: '1', sub: 'TRL Level: 4' },
                                    { label: 'Patents', val: '0', sub: '1 Pending' },
                                    { label: 'Startups', val: '0', sub: 'In Stealth' },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center p-4 rounded-2xl dark:bg-[#151515] bg-neutral-50 border dark:border-white/5 border-neutral-200">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold dark:text-white text-black mb-1">{stat.val}</p>
                                        <p className="text-[9px] text-blue-500 font-bold">{stat.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: AI & Growth */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        
                        {/* 7. AI Research Assistant Box */}
                        <div className="dark:bg-[#0d0d0d] bg-white border dark:border-gray-800 border-neutral-200 rounded-[32px] p-6 shadow-xl shadow-blue-500/5 flex flex-col h-[500px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
                            
                            <div className="flex items-center space-x-3 mb-6 relative z-10">
                                <SparkleIcon className="w-6 h-6 text-blue-500" />
                                <h3 className="font-bold dark:text-white text-black">UaiU Assistant</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar relative z-10">
                                <div className="p-3 rounded-2xl dark:bg-white/5 bg-neutral-100 border dark:border-white/5 border-neutral-200 text-xs leading-relaxed">
                                    <p className="font-bold text-blue-500 mb-1">SMART SUGGESTION</p>
                                    "Based on EXP-801, the power load exceeds edge limits. I recommend switching to the RISC-V V-extension profile."
                                </div>
                                <div className="p-3 rounded-2xl dark:bg-red-500/5 bg-red-50 border border-red-500/20 text-xs leading-relaxed">
                                    <p className="font-bold text-red-500 mb-1 flex items-center">
                                        <AlertIcon className="w-3 h-3 mr-2" /> RISK ALERT
                                    </p>
                                    "Milestone 'Validation' is currently blocked by hardware shipment delay. Accelerate Simulation v2 to compensate."
                                </div>
                            </div>

                            <div className="relative mt-auto z-10">
                                <textarea 
                                    placeholder="Consult Hawking..." 
                                    className="w-full dark:bg-[#151515] bg-neutral-50 border dark:border-gray-800 border-neutral-200 rounded-2xl p-4 pr-12 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none dark:text-white"
                                    rows={2}
                                />
                                <button className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                                    <SendIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* 3. Team & Collaboration Box */}
                        <div className="dark:bg-[#0d0d0d] bg-white border dark:border-gray-800 border-neutral-200 rounded-[32px] p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold dark:text-white text-black flex items-center">
                                    <UsersIcon className="w-5 h-5 mr-3 text-teal-500" />
                                    Research Team
                                </h3>
                                <button className="p-1.5 rounded-lg hover:dark:bg-white/5 transition-colors"><AdjustIcon className="w-4 h-4 text-gray-500" /></button>
                            </div>
                            <div className="space-y-4">
                                {ACTIVE_RESEARCH.team.map((member, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-gray-800 overflow-hidden border border-white/10">
                                                <img src={`https://picsum.photos/seed/${i+42}/100/100`} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold dark:text-white text-black">{member.name}</p>
                                                <p className="text-[10px] text-gray-500">{member.role} • {member.institution}</p>
                                            </div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-gray-600'}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 rounded-2xl dark:bg-blue-500/5 bg-blue-50 border border-blue-500/10">
                                <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">AI Recommendation</p>
                                <p className="text-[11px] dark:text-gray-400 text-gray-600">Suggesting: <span className="font-bold dark:text-gray-200">Li Wei (ETH Zurich)</span> for Swarm Optimization. Matches 94% of project requirements.</p>
                            </div>
                        </div>

                        {/* 8. Personal Growth Tracker Box */}
                        <div className="dark:bg-[#0d0d0d] bg-white border dark:border-gray-800 border-neutral-200 rounded-[32px] p-6 shadow-sm">
                            <h3 className="font-bold dark:text-white text-black flex items-center mb-6">
                                <DoubleChevronUpIcon className="w-5 h-5 mr-3 text-indigo-500" />
                                Cognitive Maturity
                            </h3>
                            <RadarChart />
                            <div className="space-y-4 mt-6 pt-6 border-t dark:border-gray-800 border-neutral-100">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 font-medium">Research Maturity</span>
                                    <span className="font-bold dark:text-white text-black px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">LEVEL 4</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 font-medium">Weekly Research</span>
                                    <span className="font-bold text-blue-500">42.5 Hours</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 font-medium">Bloom's Taxonomy Level</span>
                                    <span className="font-bold text-orange-500 uppercase tracking-tighter">Evaluating</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Insight */}
                <div className="pt-12 pb-20 text-center">
                    <p className="text-gray-500 text-sm max-w-xl mx-auto flex items-center justify-center gap-2">
                        <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                        All research data is encrypted and monitored for ethical compliance by UaiU Governance.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default TrackerView;

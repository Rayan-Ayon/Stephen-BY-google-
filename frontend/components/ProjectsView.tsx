
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { 
    HomeIcon, BookOpenIcon, BarChartIcon, MessageCircleIcon, BrainIcon, 
    DebatePodiumIcon, PresentationIcon, FlashIcon, ChevronRightIcon, 
    SearchIcon, ChevronDownIcon, AdjustIcon, ArrowUpIcon, TrophyIcon, 
    UsersIcon, ExamPaperPenIcon, PlusIcon, PaperclipIcon, CheckIcon,
    MicIcon, XIcon, ProjectIcon, GlobeIcon, LockClosedIcon, UploadIcon,
    ChevronLeftIcon
} from './icons';
import DebateView from './DebateView';

interface ProjectsViewProps {
    onNavigate: (view: string, data?: any) => void;
}

const models = [
    { name: 'Auto', free: true },
    { name: 'Gemini 3 Flash', free: true },
    { name: 'Claude 4.5 Sonnet', free: false },
    { name: 'GPT-5.2', free: false },
    { name: 'Gemini 3 Pro', free: false },
    { name: 'Grok 4.1', free: false },
];

// Data for Incomplete Section (Reddish) - Updated to 6 specific boxes
const incompleteItems = [
    {
        type: 'Chats',
        badge: 'Active',
        title: 'Deep Learning Conversation',
        desc: 'Ongoing chat session exploring the fundamentals of backpropagation and neural network architecture.',
        duration: '10m ago',
        status: 'Incomplete',
        icon: <MessageCircleIcon className="w-5 h-5" />
    },
    {
        type: 'Recalls',
        badge: 'Review',
        title: 'React Hooks Mastery',
        desc: 'Active recall session scheduled to review useState, useEffect, and custom hooks implementation.',
        duration: '2h ago',
        status: 'Incomplete',
        icon: <BrainIcon className="w-5 h-5" />
    },
    {
        type: 'Debates',
        badge: 'Challenge',
        title: 'AI Ethics & Regulation',
        desc: 'Debate session: "Should AI development be paused?" Preparing arguments for the affirmative side.',
        duration: '1d ago',
        status: 'Incomplete',
        icon: <DebatePodiumIcon className="w-5 h-5" />
    },
    {
        type: 'Presentation',
        badge: 'Draft',
        title: 'Q3 Research Findings',
        desc: 'Drafting slides for the upcoming quarterly review. Focusing on data visualization and key metrics.',
        duration: '3d ago',
        status: 'Incomplete',
        icon: <PresentationIcon className="w-5 h-5" />
    },
    {
        type: 'Q&A',
        badge: 'Study',
        title: 'System Design Interview',
        desc: 'Mock Q&A session for distributed systems, load balancing, and database sharding concepts.',
        duration: '4d ago',
        status: 'Incomplete',
        icon: <MessageCircleIcon className="w-5 h-5" /> // Reusing MessageCircle for Q&A if specific icon not present
    },
    {
        type: 'Instant describe',
        badge: 'Analysis',
        title: 'Architecture Diagram',
        desc: 'Quick analysis of the uploaded microservices architecture diagram. Identifying potential bottlenecks.',
        duration: '5d ago',
        status: 'Incomplete',
        icon: <FlashIcon className="w-5 h-5" />
    }
];

// Data for Complete Section (Greenish)
const completeItems = [
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Migrate MySQL Data to Cloud SQL',
        desc: 'Complete the introductory Migrate MySQL Data to Cloud SQL Using Database Migration Service skill badge course to demonstrate skills in the following...',
        duration: '1 hour 15 minutes',
        status: 'Completed',
        action: 'arrow',
        icon: <UsersIcon className="w-5 h-5" />
    },
    {
        type: 'Course',
        badge: '',
        title: 'Managing Cloud Infrastructure with Terraform',
        desc: 'In this Quest, the experienced user of Google Cloud will learn how to describe and launch cloud resources with Terraform.',
        duration: '3 hours 45 minutes',
        status: 'Completed',
        action: 'arrow',
        icon: <UsersIcon className="w-5 h-5" />
    },
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Use Machine Learning APIs on Google Cloud',
        desc: 'Earn the advanced skill badge by completing the Use Machine Learning APIs on Google Cloud course, where you learn the basic features for the...',
        duration: '30 minutes',
        status: 'Completed',
        action: 'arrow',
        icon: <UsersIcon className="w-5 h-5" />
    },
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Mitigate Threats and Vulnerabilities',
        desc: 'Complete the intermediate Mitigate Threats and Vulnerabilities with Security Command Center skill badge course to demonstrate skills...',
        duration: '30 minutes',
        status: 'Completed',
        action: 'arrow',
        icon: <UsersIcon className="w-5 h-5" />
    },
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Monitor Environments with Google Cloud',
        desc: 'Earn a skill badge by completing the Monitor Environments with Google Cloud Managed Service for Prometheus skill badge course.',
        duration: '30 minutes',
        status: 'Completed',
        action: 'arrow',
        icon: <UsersIcon className="w-5 h-5" />
    },
    {
        type: 'Lab',
        badge: 'Skill badge',
        title: 'Develop No-Code Chat Apps with AppSheet',
        desc: 'In this lab, you’ll use AppSheet to create a no-code app for Google Chat.',
        duration: '1 hour',
        status: 'Completed',
        action: 'arrow',
        icon: <ExamPaperPenIcon className="w-5 h-5" />
    }
];

const AddProjectModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-[#0d1117] text-gray-300 rounded-md shadow-2xl border border-gray-700 overflow-hidden z-10 flex flex-col max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-semibold text-white mb-2">Create a new repository</h2>
                    <p className="text-sm text-gray-400">
                        Repositories contain a project's files and version history. Have a project elsewhere? <a href="#" className="text-blue-400 hover:underline">Import a repository.</a>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 italic">Required fields are marked with an asterisk (*).</p>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* General Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">1</span>
                            <h3 className="text-lg font-semibold text-white">General</h3>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="w-full md:w-1/3">
                                <label className="block text-sm font-bold text-white mb-2">Owner *</label>
                                <button className="w-full p-2 bg-[#21262d] border border-gray-600 rounded-md flex items-center justify-between text-white text-sm hover:border-gray-400 transition-colors">
                                    <div className="flex items-center">
                                        <img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=2823&auto=format&fit=crop" className="w-5 h-5 rounded-full mr-2" alt="Owner" />
                                        <span>Rayan-Ayon</span>
                                    </div>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-center pt-8 text-xl text-gray-500">/</div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-white mb-2">Repository name *</label>
                                <input type="text" className="w-full p-2 bg-[#0d1117] border border-gray-600 rounded-md text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">Great repository names are short and memorable. How about <span className="text-green-400 font-mono">ideal-pancake</span>?</p>
                        
                        <div>
                            <label className="block text-sm font-bold text-white mb-2">Description <span className="text-gray-500 font-normal">(optional)</span></label>
                            <input type="text" className="w-full p-2 bg-[#0d1117] border border-gray-600 rounded-md text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    {/* Configuration Section */}
                    <div className="pt-6 border-t border-gray-800">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">2</span>
                            <h3 className="text-lg font-semibold text-white">Configuration</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Visibility */}
                            <div className="p-4 border border-gray-700 rounded-md">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-sm font-bold text-white">Choose visibility *</label>
                                    <div className="relative">
                                        <button className="flex items-center space-x-2 text-sm text-gray-300 bg-[#21262d] border border-gray-600 px-3 py-1.5 rounded-md">
                                            <GlobeIcon className="w-4 h-4" />
                                            <span>Public</span>
                                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Choose who can see and commit to this repository</p>
                            </div>

                            {/* Template */}
                            <div className="p-4 border border-gray-700 rounded-md flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-bold text-white block">Start with a template</label>
                                    <p className="text-xs text-gray-500">Templates pre-configure your repository with files.</p>
                                </div>
                                <button className="flex items-center space-x-2 text-sm text-gray-300 bg-[#21262d] border border-gray-600 px-3 py-1.5 rounded-md">
                                    <span>No template</span>
                                    <ChevronDownIcon className="w-4 h-4 ml-2" />
                                </button>
                            </div>

                            {/* Init Options */}
                            <div className="p-4 border border-gray-700 rounded-md space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center">
                                            <input type="checkbox" className="mr-2 bg-[#0d1117] border-gray-600 rounded text-blue-500 focus:ring-0" />
                                            <label className="text-sm font-bold text-white">Add README</label>
                                        </div>
                                        <p className="text-xs text-gray-500 pl-6">READMEs can be used as longer descriptions.</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                    <div>
                                        <label className="text-sm font-bold text-white block">Add .gitignore</label>
                                        <p className="text-xs text-gray-500">.gitignore tells git which files not to track.</p>
                                    </div>
                                    <button className="flex items-center space-x-2 text-sm text-gray-300 bg-[#21262d] border border-gray-600 px-3 py-1.5 rounded-md">
                                        <span>No .gitignore</span>
                                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                    <div>
                                        <label className="text-sm font-bold text-white block">Add license</label>
                                        <p className="text-xs text-gray-500">Licenses explain how others can use your code.</p>
                                    </div>
                                    <button className="flex items-center space-x-2 text-sm text-gray-300 bg-[#21262d] border border-gray-600 px-3 py-1.5 rounded-md">
                                        <span>No license</span>
                                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-800 flex justify-end space-x-3 bg-[#161b22]">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-blue-400 hover:underline transition-colors">
                        Cancel
                    </button>
                    <button onClick={onClose} className="px-6 py-2 rounded-md text-sm font-bold bg-[#238636] text-white hover:bg-[#2ea043] transition-colors shadow-sm border border-[rgba(240,246,252,0.1)]">
                        Create repository
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [viewMode, setViewMode] = useState<'complete' | 'incomplete'>('incomplete');
    const [isDebateStarted, setIsDebateStarted] = useState(false);
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);

    const learnTrackItems = [
        { label: 'Chats', id: 'chats', icon: <MessageCircleIcon className="w-4 h-4"/> },
        { label: 'Recalls', id: 'recalls', icon: <BrainIcon className="w-4 h-4"/> },
        { label: 'Debates', id: 'debates', icon: <DebatePodiumIcon className="w-4 h-4"/> },
        { label: 'Presentation', id: 'presentation', icon: <PresentationIcon className="w-4 h-4"/> },
        { label: 'Q&A', id: 'qa', icon: <MessageCircleIcon className="w-4 h-4"/> },
        { label: 'Instant describe', id: 'instant_describe', icon: <FlashIcon className="w-4 h-4"/> },
    ];

    const renderCard = (item: any, idx: number) => {
        const isComplete = viewMode === 'complete';
        
        const cardBgClass = isComplete 
            ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600' 
            : 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600';
        
        const badgeBgClass = isComplete
            ? 'bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300';

        const iconBgClass = isComplete
            ? 'bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400'
            : 'bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400';

        return (
            <div key={idx} className={`border rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 ${cardBgClass} relative`}>
                {/* Top Right Icon */}
                <div className={`absolute top-6 right-6 p-2 rounded-full ${iconBgClass}`}>
                    {item.icon}
                </div>

                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <span className={`flex items-center text-[11px] font-bold px-2 py-1 rounded ${badgeBgClass}`}>
                            {item.type}
                        </span>
                        {item.badge && (
                            <span className={`flex items-center text-[11px] font-bold px-2 py-1 rounded ${badgeBgClass}`}>
                                <TrophyIcon className="w-3 h-3 mr-1.5"/>
                                {item.badge}
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-3 leading-tight pr-10">
                        {item.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                        {item.desc}
                    </p>
                </div>
                <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
                    <div className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <div className={`w-4 h-4 border-2 rounded-full mr-2 flex items-center justify-center ${isComplete ? 'border-green-500 bg-green-500' : 'border-red-400 dark:border-red-500'}`}>
                            {isComplete && <CheckIcon className="w-3 h-3 text-white" />}
                        </div>
                        {item.duration}
                    </div>
                    <button className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${iconBgClass}`}>
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDebates = () => {
        if (!isDebateStarted) {
            return (
                <div className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-[#0b0b0b]">
                    <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DebatePodiumIcon className="w-12 h-12 text-orange-500" />
                        </div>
                        <h2 className="text-4xl font-bold dark:text-white text-black font-serif">Debate Arena</h2>
                        <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
                            Challenge your perspectives. Engage in structured debates with an AI opponent to refine your critical thinking.
                        </p>
                        <button 
                            onClick={() => setIsDebateStarted(true)}
                            className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-90 transition-all shadow-xl hover:shadow-2xl text-base"
                        >
                            Start Debate
                        </button>
                    </div>
                </div>
            )
        }
        return <DebateView />;
    }

    const renderEmptySegment = () => (
        <div className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-[#0b0b0b]">
            <p className="text-gray-500 text-lg font-medium">this segment will be add soon</p>
        </div>
    );

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#0b0b0b] text-neutral-900 dark:text-neutral-100 overflow-hidden">
            {/* Main Content - No Sidebar */}
            <main className={`flex-1 ${activeSection === 'debates' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
                {['chats', 'recalls', 'presentation', 'qa', 'instant_describe'].includes(activeSection) ? (
                    renderEmptySegment()
                ) : activeSection === 'debates' ? (
                    renderDebates()
                ) : (
                    // Default Overview View
                    <div className="pt-24 px-8 pb-12 max-w-6xl mx-auto">
                        
                        {/* New Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                            <div>
                                <h1 className="text-4xl font-bold dark:text-white text-black mb-1" style={{ fontFamily: "'Lora', serif" }}>
                                    Hey, Ayon.
                                </h1>
                                <p className="text-xl text-gray-500 dark:text-gray-400">Ready to start a project?</p>
                            </div>
                            <button 
                                onClick={() => setShowAddProjectModal(true)}
                                className="px-5 py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-bold rounded-md flex items-center shadow-sm border border-[rgba(240,246,252,0.1)] transition-colors"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                New
                            </button>
                        </div>

                        {/* Controls Row */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button className="flex items-center px-4 py-2 bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Recent <ChevronDownIcon className="w-4 h-4 ml-2"/>
                                </button>
                                <button className="px-4 py-2 bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Projects
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-grow md:flex-grow-0">
                                    <input 
                                        type="text" 
                                        placeholder="Search catalog" 
                                        className="w-full md:w-64 pl-9 pr-4 py-2 bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <SearchIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"/>
                                </div>
                                <button className="flex items-center px-4 py-2 bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    <AdjustIcon className="w-4 h-4 mr-2"/> Filters
                                </button>
                            </div>
                        </div>

                        {/* Learn Track Nav Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                            {learnTrackItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${
                                        activeSection === item.id 
                                        ? 'bg-neutral-800 dark:bg-white text-white dark:text-black border-transparent' 
                                        : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 border-neutral-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <span className="mr-2 opacity-70">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Toggle Switch */}
                        <div className="flex items-center justify-start mb-8">
                            <div className="bg-neutral-100 dark:bg-[#1a1a1a] p-1 rounded-lg flex items-center border border-neutral-200 dark:border-gray-800">
                                <button 
                                    onClick={() => setViewMode('incomplete')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'incomplete' ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    Incomplete
                                </button>
                                <button 
                                    onClick={() => setViewMode('complete')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'complete' ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                >
                                    Complete
                                </button>
                            </div>
                        </div>
                        
                        {/* Results Count */}
                        <div className="text-left mb-6 text-sm text-gray-500">
                            {viewMode === 'incomplete' ? incompleteItems.length : completeItems.length} results
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                            {viewMode === 'incomplete' 
                                ? incompleteItems.map((item, idx) => renderCard(item, idx))
                                : completeItems.map((item, idx) => renderCard(item, idx))
                            }
                        </div>
                    </div>
                )}
            </main>

            <AnimatePresence>
                {showAddProjectModal && <AddProjectModal onClose={() => setShowAddProjectModal(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default ProjectsView;

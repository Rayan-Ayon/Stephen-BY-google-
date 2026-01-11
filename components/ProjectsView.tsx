
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import { 
    HomeIcon, BookOpenIcon, BarChartIcon, MessageCircleIcon, BrainIcon, 
    DebatePodiumIcon, PresentationIcon, FlashIcon, ChevronRightIcon, 
    SearchIcon, ChevronDownIcon, AdjustIcon, ArrowUpIcon, TrophyIcon, 
    UsersIcon, ExamPaperPenIcon, PlusIcon, PaperclipIcon, CheckIcon,
    MicIcon, XIcon, ProjectIcon, GlobeIcon, LockClosedIcon, UploadIcon
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

// Data for Incomplete Section (Reddish)
const incompleteItems = [
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Manage Kubernetes in Google Cloud',
        desc: 'Complete the intermediate Manage Kubernetes in Google Cloud skill badge course to demonstrate skills in the following: managing deployments with...',
        duration: '30 minutes',
        status: 'Incomplete',
        action: 'arrow'
    },
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Derive Insights from BigQuery Data',
        desc: 'Complete the introductory Derive Insights from BigQuery Data skill badge course to demonstrate skills in the following: Write SQL queries.Query...',
        duration: '1 hour 15 minutes',
        status: 'Incomplete',
        action: 'arrow'
    },
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Share Data Using Google Data Cloud',
        desc: 'Earn a skill badge by completing the Share Data Using Google Data Cloud skill badge course, where you will gain practical experience with Google...',
        duration: '30 minutes',
        status: 'Incomplete',
        action: 'arrow'
    },
    {
        type: 'Lab',
        badge: '',
        title: 'Predicting Customer Churn with Vertex AI',
        desc: 'In this lab, you will use Vertex AI to train and deploy a machine learning model to predict customer churn.',
        duration: '45 minutes',
        status: 'Incomplete',
        action: 'arrow'
    },
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Build Infrastructure with Terraform',
        desc: 'Learn how to use Terraform to provision and manage Google Cloud resources using Infrastructure as Code principles.',
        duration: '2 hours',
        status: 'Incomplete',
        action: 'arrow'
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
        action: 'arrow'
    },
    {
        type: 'Course',
        badge: '',
        title: 'Managing Cloud Infrastructure with Terraform',
        desc: 'In this Quest, the experienced user of Google Cloud will learn how to describe and launch cloud resources with Terraform.',
        duration: '3 hours 45 minutes',
        status: 'Completed',
        action: 'arrow'
    },
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Use Machine Learning APIs on Google Cloud',
        desc: 'Earn the advanced skill badge by completing the Use Machine Learning APIs on Google Cloud course, where you learn the basic features for the...',
        duration: '30 minutes',
        status: 'Completed',
        action: 'arrow'
    },
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Mitigate Threats and Vulnerabilities',
        desc: 'Complete the intermediate Mitigate Threats and Vulnerabilities with Security Command Center skill badge course to demonstrate skills...',
        duration: '30 minutes',
        status: 'Completed',
        action: 'arrow'
    },
    {
        type: 'Course',
        badge: 'Skill badge',
        title: 'Monitor Environments with Google Cloud',
        desc: 'Earn a skill badge by completing the Monitor Environments with Google Cloud Managed Service for Prometheus skill badge course.',
        duration: '30 minutes',
        status: 'Completed',
        action: 'arrow'
    },
    {
        type: 'Lab',
        badge: 'Skill badge',
        title: 'Develop No-Code Chat Apps with AppSheet',
        desc: 'In this lab, you’ll use AppSheet to create a no-code app for Google Chat.',
        duration: '1 hour',
        status: 'Completed',
        action: 'arrow'
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
    const [isLearnTrackOpen, setIsLearnTrackOpen] = useState(true);
    const [viewMode, setViewMode] = useState<'complete' | 'incomplete'>('incomplete');
    
    // Debate local state
    const [isDebateStarted, setIsDebateStarted] = useState(false);

    // Chat State
    const [inputValue, setInputValue] = useState('');
    const [selectedModel, setSelectedModel] = useState('Auto');
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [chatResponse, setChatResponse] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    
    // Tools Dropdown State
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [activeTool, setActiveTool] = useState<{name: string, icon: React.ReactNode} | null>(null);
    const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
    
    const modelMenuRef = useRef<HTMLDivElement>(null);
    const toolsMenuRef = useRef<HTMLDivElement>(null);
    const plusMenuRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);

    // GenAI instance (initialized on demand or effect)
    const [ai, setAi] = useState<GoogleGenAI | null>(null);

    useEffect(() => {
        setAi(new GoogleGenAI({ apiKey: process.env.API_KEY }));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
                setIsModelMenuOpen(false);
            }
            if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
                setIsToolsOpen(false);
            }
            if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
                setIsPlusMenuOpen(false);
            }
            if (inputContainerRef.current && !inputContainerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sidebarItems = [
        { type: 'section', label: 'Overview', id: 'overview', icon: <HomeIcon className="w-5 h-5"/> },
        { 
            type: 'folder', 
            label: 'Learn Track', 
            id: 'learn_track', 
            icon: <BookOpenIcon className="w-5 h-5"/>,
            children: [
                { label: 'Chats', id: 'chats', icon: <MessageCircleIcon className="w-4 h-4"/> },
                { label: 'Recalls', id: 'recalls', icon: <BrainIcon className="w-4 h-4"/> },
                { 
                    label: 'Debates', 
                    id: 'debates', 
                    icon: <DebatePodiumIcon className="w-4 h-4"/>
                },
                { label: 'Presentation', id: 'presentation', icon: <PresentationIcon className="w-4 h-4"/> },
                { label: 'Q&A', id: 'qa', icon: <MessageCircleIcon className="w-4 h-4"/> },
                { label: 'Instant describe', id: 'instant_describe', icon: <FlashIcon className="w-4 h-4"/> },
            ]
        },
        { type: 'section', label: 'Analysis', id: 'analysis', icon: <BarChartIcon className="w-5 h-5"/> },
        { type: 'section', label: 'Exams', id: 'exams', icon: <ExamPaperPenIcon className="w-5 h-5"/> }
    ];

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || !ai) return;
        
        // Special Navigation for Tools
        if (activeTool?.name === 'Debate') {
            setActiveSection('debates');
            setIsDebateStarted(true); // Auto-start debate if accessing via tool? Or maybe pass message
            // Ideally we'd pass the initial message to the embedded DebateView
            return;
        }
        if (activeTool?.name === 'Add Courses') {
            onNavigate('add_courses', { topic: inputValue });
            return;
        }

        setIsLoading(true);
        setChatResponse(''); 
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: inputValue
            });
            setChatResponse(response.text || '');
            setInputValue('');
        } catch (error) {
            console.error("GenAI Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toolsList = [
        { name: 'Add Project', icon: <ProjectIcon className="w-4 h-4" /> },
        { name: 'Add Content', icon: <PlusIcon className="w-4 h-4" /> },
        { name: 'Add Courses', icon: <BookOpenIcon className="w-4 h-4" /> },
        { name: 'Debate', icon: <DebatePodiumIcon className="w-4 h-4" /> },
        { name: 'Q&A', icon: <MessageCircleIcon className="w-4 h-4" /> },
        { name: 'Instant describe', icon: <FlashIcon className="w-4 h-4" /> },
        { name: 'Presentation', icon: <PresentationIcon className="w-4 h-4" /> }
    ];

    const handleToolClick = (toolName: string) => {
        setIsToolsOpen(false);
        const tool = toolsList.find(t => t.name === toolName);
        if (tool) {
            setActiveTool(tool);
        }
        
        if (toolName === 'Add Project') {
            setShowAddProjectModal(true);
        }
    };

    const renderCard = (item: any, idx: number) => {
        // Reddish for Incomplete, Greenish for Complete
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
            <div key={idx} className={`border rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 ${cardBgClass}`}>
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <span className={`flex items-center text-[11px] font-bold px-2 py-1 rounded ${badgeBgClass}`}>
                            {item.type === 'Course' ? <UsersIcon className="w-3 h-3 mr-1.5"/> : <ArrowUpIcon className="w-3 h-3 mr-1.5 transform rotate-45"/>}
                            {item.type}
                        </span>
                        {item.badge && (
                            <span className={`flex items-center text-[11px] font-bold px-2 py-1 rounded ${badgeBgClass}`}>
                                <TrophyIcon className="w-3 h-3 mr-1.5"/>
                                {item.badge}
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-3 leading-tight">
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

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#0b0b0b] text-neutral-900 dark:text-neutral-100 overflow-hidden">
            {/* Inner Sidebar */}
            <aside className="w-64 border-r border-neutral-200 dark:border-white/10 flex flex-col shrink-0 overflow-y-auto pt-20 pb-6 px-4 bg-neutral-50 dark:bg-[#0f0f0f]">
                <div className="space-y-1">
                    {sidebarItems.map((item: any) => (
                        <div key={item.id}>
                            {item.type === 'section' ? (
                                <button 
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id ? 'bg-neutral-200 dark:bg-white/10 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.label}
                                </button>
                            ) : (
                                <div>
                                    <button 
                                        onClick={() => setIsLearnTrackOpen(!isLearnTrackOpen)}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <span className="mr-3">{item.icon}</span>
                                            {item.label}
                                        </div>
                                        <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${isLearnTrackOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isLearnTrackOpen && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden pl-4 mt-1 space-y-1"
                                            >
                                                {item.children.map((child: any) => (
                                                    <button 
                                                        key={child.id}
                                                        onClick={() => {
                                                            if (child.action) {
                                                                child.action();
                                                            } else {
                                                                setActiveSection(child.id);
                                                            }
                                                        }}
                                                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === child.id ? 'bg-neutral-200 dark:bg-white/10 text-black dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                                                    >
                                                        <span className="mr-3">{child.icon}</span>
                                                        {child.label}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${activeSection === 'debates' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
                {activeSection === 'debates' ? (
                    renderDebates()
                ) : (
                    <div className="pt-24 px-8 pb-12 max-w-6xl mx-auto">
                        {/* Hero */}
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: "'Lora', serif" }}>
                                Stephen is hearing your questions
                            </h1>
                            
                            {/* Cinematic Chat Box */}
                            <div className="w-full max-w-3xl mx-auto mb-10">
                                <div 
                                    ref={inputContainerRef}
                                    className={`relative dark:bg-[#111] bg-neutral-50 border border-gray-200 dark:border-[#1e1e1e] shadow-lg transition-all duration-300 ${
                                        isFocused || inputValue.trim() ? 'rounded-[28px] ring-1 ring-neutral-300 dark:ring-white/10' : 'rounded-full hover:shadow-xl'
                                    }`}
                                >
                                    <textarea 
                                        ref={textareaRef} 
                                        value={inputValue} 
                                        onChange={(e) => {
                                            setInputValue(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                        }} 
                                        onKeyPress={handleKeyPress}
                                        onFocus={() => setIsFocused(true)}
                                        placeholder="What do you want to know about yourself?"
                                        className={`w-full bg-transparent border-none focus:outline-none text-lg text-black dark:text-white placeholder-gray-500 px-6 py-4 resize-none transition-all font-medium`} 
                                        rows={1}
                                        style={{ minHeight: isFocused || inputValue.trim() ? '72px' : '56px' }}
                                    />
                                    
                                    <div className={`flex items-center justify-between px-4 pb-3 transition-opacity duration-200 ${isFocused || inputValue.trim() ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                                        <div className="flex items-center space-x-2">
                                            <div className="relative" ref={plusMenuRef}>
                                                <button 
                                                    onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                                                    className="p-2 rounded-full dark:hover:bg-white/10 hover:bg-neutral-200 text-gray-500 transition-colors"
                                                >
                                                    <PlusIcon className="w-5 h-5" />
                                                </button>
                                                <AnimatePresence>
                                                    {isPlusMenuOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute bottom-full left-0 mb-2 w-48 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
                                                        >
                                                            {[
                                                                { label: 'Upload files', icon: <UploadIcon className="w-4 h-4" /> },
                                                                { label: 'Add from Drive', icon: <div className="w-4 h-4 text-green-500"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l3.43 6h11.72l6.55-11.5-3.42-6H7.71zm8.87 1.5l3.4 6-3.27 5.75H5.43L8.7 5h7.88zm-6.55 1.7L4.57 16h6.86l5.46-9.28H10.03z"/></svg></div> }, // Simple SVG
                                                                { label: 'Photos', icon: <div className="w-4 h-4 text-blue-500"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3.2"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg></div> },
                                                                { label: 'NotebookLM', icon: <div className="w-4 h-4 text-purple-500"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div> },
                                                            ].map((item) => (
                                                                <button 
                                                                    key={item.label}
                                                                    onClick={() => setIsPlusMenuOpen(false)}
                                                                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-[13px] dark:text-gray-300 text-gray-700 hover:dark:bg-white/5 hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <div className="dark:text-white text-black opacity-70">{item.icon}</div>
                                                                    <span className="font-medium">{item.label}</span>
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            
                                            {/* Tools Dropdown */}
                                            <div className="relative" ref={toolsMenuRef}>
                                                <button 
                                                    onClick={() => setIsToolsOpen(!isToolsOpen)}
                                                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-colors text-xs font-bold ${isToolsOpen ? 'dark:bg-white/10 bg-neutral-200 border-gray-400 dark:border-white/20 text-black dark:text-white' : 'dark:hover:bg-white/10 hover:bg-neutral-200 border-transparent text-gray-500'}`}
                                                >
                                                    <AdjustIcon className="w-4 h-4" />
                                                    <span>Tools</span>
                                                    <ChevronDownIcon className={`w-3 h-3 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {isToolsOpen && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute top-full left-0 mt-2 w-56 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                                                        >
                                                            {toolsList.map((tool) => (
                                                                <button 
                                                                    key={tool.name}
                                                                    onClick={() => handleToolClick(tool.name)}
                                                                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-[13px] dark:text-gray-300 text-gray-700 hover:dark:bg-white/5 hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <div className="text-gray-500 dark:text-gray-400">{tool.icon}</div>
                                                                    <span className="font-medium">{tool.name}</span>
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Active Tool Chip */}
                                            <AnimatePresence>
                                                {activeTool && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, scale: 0.9, x: -10 }}
                                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, x: -10 }}
                                                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full dark:bg-[#2a2a2a] bg-gray-200 border dark:border-white/10 border-gray-300 text-[11px] font-bold dark:text-white text-black"
                                                    >
                                                        <div className="dark:text-white text-black">
                                                            {activeTool.icon}
                                                        </div>
                                                        <span>{activeTool.name}</span>
                                                        <button 
                                                            onClick={() => setActiveTool(null)}
                                                            className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 text-gray-500 dark:text-gray-400"
                                                        >
                                                            <XIcon className="w-3 h-3" />
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        
                                        <div className="flex items-center space-x-3">
                                            <div className="relative" ref={modelMenuRef}>
                                                <button 
                                                    onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                                                    className="flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                                                >
                                                    <span>{selectedModel}</span>
                                                    <ChevronDownIcon className={`w-3 h-3 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {isModelMenuOpen && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute bottom-full right-0 mb-2 w-48 dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-gray-200 rounded-xl shadow-xl overflow-hidden py-1 z-50"
                                                        >
                                                            {models.map((m) => (
                                                                <button 
                                                                    key={m.name}
                                                                    onClick={() => { setSelectedModel(m.name); setIsModelMenuOpen(false); }}
                                                                    className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] dark:text-gray-300 text-gray-700 hover:dark:bg-white/5 hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className={selectedModel === m.name ? "font-bold text-orange-500" : ""}>{m.name}</span>
                                                                    {selectedModel === m.name && <CheckIcon className="w-3 h-3 text-orange-500" />}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <button className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                                <MicIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={handleSendMessage}
                                                disabled={isLoading || !inputValue.trim()}
                                                className={`p-2 rounded-full transition-all ${inputValue.trim() ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-transparent text-gray-600'}`}
                                            >
                                                <ArrowUpIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {!isFocused && !inputValue.trim() && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-4">
                                            <div className="flex items-center space-x-1 text-xs font-bold text-gray-500">
                                                <span>{selectedModel}</span>
                                                <ChevronDownIcon className="w-3 h-3" />
                                            </div>
                                            <MicIcon className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Chat Response Display */}
                                {chatResponse && (
                                    <div className="mt-6 p-6 rounded-2xl dark:bg-[#1a1a1a] bg-white border dark:border-white/10 border-neutral-200 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                                            {chatResponse}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Controls Row */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
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

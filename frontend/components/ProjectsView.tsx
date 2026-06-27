
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon, BookOpenIcon, BarChartIcon, MessageCircleIcon, BrainIcon,
    DebatePodiumIcon, PresentationIcon, FlashIcon, ChevronRightIcon,
    SearchIcon, ChevronDownIcon, AdjustIcon, ArrowUpIcon, TrophyIcon,
    UsersIcon, ExamPaperPenIcon, PlusIcon, PaperclipIcon, CheckIcon,
    MicIcon, XIcon, ProjectIcon, GlobeIcon, LockClosedIcon, UploadIcon,
    ChevronLeftIcon, SparkleIcon, CheckCircleIcon, RefreshIcon, ClockIcon,
} from './icons';
import { ProjectCard, ProjectType, ProjectCategory } from './projects/types';
import { seedProjects, courseOptions, moduleOptions, categoryOptions } from './projects/seeds';
import DebateView from './DebateView';

interface ProjectsViewProps {
    onNavigate: (view: string, data?: any) => void;
}

// ── Processing logs for the new-project ingestion ──
const newProjectLogs = [
    'AI ingestion engine eating project context...',
    'Mapping validation loops against neural nodes...',
    'Generating initial execution scaffold...',
    'Cross-referencing curriculum prerequisites...',
    'Bootstrapping project workspace...',
    'Ready — project initialized.',
];

// ── Dual-Pathway Add Project Modal ──
interface AddProjectModalProps {
    onClose: () => void;
    onAddProject: (project: ProjectCard) => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, onAddProject }) => {
    const [step, setStep] = useState<'select' | 'form' | 'processing'>('select');
    const [projectType, setProjectType] = useState<ProjectType | null>(null);
    const [courseForm, setCourseForm] = useState({ courseName: courseOptions[0], moduleNo: moduleOptions[0], projectNo: '' });
    const [outerForm, setOuterForm] = useState({ name: '', domain: '', context: '' });
    const [category, setCategory] = useState<ProjectCategory>('Chats');
    const [logIndex, setLogIndex] = useState(0);
    const [activeLogs, setActiveLogs] = useState<string[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (step !== 'processing') return;
        setActiveLogs([]);
        setLogIndex(0);
        const interval = setInterval(() => {
            setLogIndex(prev => {
                const next = prev + 1;
                setActiveLogs(logs => [...logs, newProjectLogs[prev]].slice(-8));
                if (next >= newProjectLogs.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        const newProject: ProjectCard = {
                            id: `p_${Date.now()}`,
                            title: projectType === 'course' ? `${courseForm.courseName} — Project ${courseForm.projectNo}` : outerForm.name,
                            description: projectType === 'course'
                                ? `Course project for ${courseForm.courseName}, module ${courseForm.moduleNo}.`
                                : outerForm.context.slice(0, 120) || `Independent research in ${outerForm.domain}.`,
                            status: 'incomplete',
                            type: projectType!,
                            category,
                            timestamp: 'Just now',
                            meta: projectType === 'course'
                                ? { courseName: courseForm.courseName, moduleNo: courseForm.moduleNo, projectNo: courseForm.projectNo, completionRate: 0, architecturalScore: 0 }
                                : { completionRate: 0, architecturalScore: 0 },
                        };
                        onAddProject(newProject);
                        onClose();
                    }, 200);
                    return next;
                }
                return next;
            });
        }, 320);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeLogs]);

    const handleSubmit = () => setStep('processing');

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0d1117] rounded-2xl border border-gray-700/60 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {step === 'form' && (
                            <button onClick={() => setStep('select')} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-white font-serif leading-none mb-0.5">
                                {step === 'select' && 'New Project'}
                                {step === 'form' && (projectType === 'course' ? 'Stephen Course Project' : 'Independent Outer Project')}
                                {step === 'processing' && 'Initializing Project...'}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {step === 'select' && 'Choose the origin of your project'}
                                {step === 'form' && 'Fill in the details below'}
                                {step === 'processing' && 'AI engine is building your workspace'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 text-gray-500 hover:text-white transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 px-6 pt-4">
                    {['select', 'form', 'processing'].map((s, i) => (
                        <div key={s} className={`flex items-center gap-2 ${i > 0 ? 'ml-2' : ''}`}>
                            {i > 0 && <div className="w-8 h-px bg-gray-700" />}
                            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                (step === 'select' && i === 0) || (step === 'form' && i <= 1) || (step === 'processing' && i <= 2)
                                    ? 'bg-emerald-500'
                                    : 'bg-gray-700'
                            }`} />
                        </div>
                    ))}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {/* ── Step 1: Select Type ── */}
                    {step === 'select' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {([
                                { type: 'course' as ProjectType, label: 'Stephen Course Project', desc: 'A structured project tied to a specific course, module, and lesson.', icon: <BookOpenIcon className="w-8 h-8" /> },
                                { type: 'outer' as ProjectType, label: 'Independent Outer Project', desc: 'A self-directed project outside any course — research, open-source, or experimental.', icon: <SparkleIcon className="w-8 h-8" /> },
                            ]).map(opt => (
                                <button
                                    key={opt.type}
                                    onClick={() => { setProjectType(opt.type); setStep('form'); }}
                                    className="group p-6 rounded-xl border text-left transition-all bg-[#161b22] border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-500/5"
                                >
                                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4 group-hover:scale-105 transition-transform">
                                        {opt.icon}
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-1.5">{opt.label}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ── Step 2: Form ── */}
                    {step === 'form' && projectType === 'course' && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Select Course</label>
                                <select
                                    value={courseForm.courseName}
                                    onChange={e => setCourseForm(f => ({ ...f, courseName: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none"
                                >
                                    {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Select Module</label>
                                <select
                                    value={courseForm.moduleNo}
                                    onChange={e => setCourseForm(f => ({ ...f, moduleNo: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none"
                                >
                                    {moduleOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Project Number</label>
                                <input
                                    type="text"
                                    value={courseForm.projectNo}
                                    onChange={e => setCourseForm(f => ({ ...f, projectNo: e.target.value }))}
                                    placeholder="e.g. P3"
                                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Category</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value as ProjectCategory)}
                                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none"
                                >
                                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 'form' && projectType === 'outer' && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Project Name</label>
                                <input
                                    type="text"
                                    value={outerForm.name}
                                    onChange={e => setOuterForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. Distributed Cache Layer"
                                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Research Domain</label>
                                <input
                                    type="text"
                                    value={outerForm.domain}
                                    onChange={e => setOuterForm(f => ({ ...f, domain: e.target.value }))}
                                    placeholder="e.g. Distributed Systems, Computer Vision"
                                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Context / Code Repository Link</label>
                                <textarea
                                    value={outerForm.context}
                                    onChange={e => setOuterForm(f => ({ ...f, context: e.target.value }))}
                                    placeholder="Describe the project scope, key technologies, goals, or paste a GitHub repo link..."
                                    rows={5}
                                    className="w-full px-4 py-3 bg-[#0d1117] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none resize-none custom-scrollbar"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Category</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value as ProjectCategory)}
                                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none"
                                >
                                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Processing ── */}
                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <RefreshIcon className="w-8 h-8 text-emerald-400 animate-spin mb-5" />
                            <div className="w-full max-w-lg bg-[#161b22] border border-gray-700/60 rounded-xl p-5 font-mono text-xs leading-relaxed h-48 overflow-y-auto custom-scrollbar">
                                {activeLogs.map((log, i) => (
                                    <motion.div
                                        key={`${i}-${log}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={log.includes('Ready') ? 'text-emerald-400' : 'text-gray-400'}
                                    >
                                        {log}
                                    </motion.div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                            <div className="mt-4 w-full max-w-lg">
                                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500 rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${(logIndex / newProjectLogs.length) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">{Math.round((logIndex / newProjectLogs.length) * 100)}%</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 'form' && (
                    <div className="px-6 py-4 border-t border-gray-800 flex justify-end gap-3 shrink-0">
                        <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 rounded-xl text-sm font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors shadow-sm"
                        >
                            Initialize Project
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// ── Projects View ──
const ProjectsView: React.FC<ProjectsViewProps> = ({ onNavigate }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [viewMode, setViewMode] = useState<'incomplete' | 'complete'>('incomplete');
    const [isDebateStarted, setIsDebateStarted] = useState(false);
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [projects, setProjects] = useState<ProjectCard[]>(seedProjects);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            if (p.status !== (viewMode === 'incomplete' ? 'incomplete' : 'complete')) return false;
            if (activeCategory !== 'All' && p.category !== activeCategory) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [projects, viewMode, activeCategory, searchQuery]);

    const handleAddProject = (project: ProjectCard) => {
        setProjects(prev => [project, ...prev]);
    };

    const learnTrackItems = [
        { label: 'Chats', id: 'chats', icon: <MessageCircleIcon className="w-4 h-4" /> },
        { label: 'Recalls', id: 'recalls', icon: <BrainIcon className="w-4 h-4" /> },
        { label: 'Debates', id: 'debates', icon: <DebatePodiumIcon className="w-4 h-4" /> },
        { label: 'Presentation', id: 'presentation', icon: <PresentationIcon className="w-4 h-4" /> },
        { label: 'Q&A', id: 'qa', icon: <MessageCircleIcon className="w-4 h-4" /> },
        { label: 'Instant describe', id: 'instant_describe', icon: <FlashIcon className="w-4 h-4" /> },
    ];

    const categoryFilterOptions = ['All', ...categoryOptions];

    const renderCard = (project: ProjectCard) => {
        const isComplete = project.status === 'complete';
        const borderColor = isComplete
            ? 'border-green-500/40 hover:border-green-400'
            : 'border-red-500/40 hover:border-red-400';
        const bgAccent = isComplete ? 'bg-green-500/10' : 'bg-red-500/10';

        return (
            <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative border ${borderColor} rounded-2xl p-5 flex flex-col justify-between bg-[#161b22] transition-all hover:shadow-lg hover:shadow-${isComplete ? 'green' : 'red'}-900/10`}
            >
                {/* Top badges row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {/* Type badge */}
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        project.type === 'course'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    }`}>
                        {project.type === 'course' ? <BookOpenIcon className="w-3 h-3" /> : <SparkleIcon className="w-3 h-3" />}
                        {project.type === 'course' ? 'Course' : 'Outer'}
                    </span>
                    {/* Category pill */}
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                        {project.category}
                    </span>
                    {/* Timestamp */}
                    <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-500">
                        <ClockIcon className="w-3 h-3" />
                        {project.timestamp}
                    </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-white mb-1.5 leading-snug">{project.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">{project.description}</p>

                {/* AI Execution Scorecard */}
                <div className="space-y-2.5 mt-auto pt-3 border-t border-gray-800">
                    <div>
                        <div className="flex justify-between text-[10px] font-medium mb-1">
                            <span className="text-gray-500">Completion</span>
                            <span className={isComplete ? 'text-green-400' : 'text-red-400'}>{project.meta.completionRate}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.meta.completionRate}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-red-500'}`}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] font-medium mb-1">
                            <span className="text-gray-500">Architectural Integrity</span>
                            <span className="text-emerald-400">{project.meta.architecturalScore}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.meta.architecturalScore}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                                className="h-full rounded-full bg-emerald-500"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
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
                        <h2 className="text-4xl font-bold text-black dark:text-white font-serif">Debate Arena</h2>
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
            );
        }
        return <DebateView />;
    };

    const renderEmptySegment = () => (
        <div className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-[#0b0b0b]">
            <p className="text-gray-500 text-lg font-medium">this segment will be add soon</p>
        </div>
    );

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#0b0b0b] text-neutral-900 dark:text-neutral-100 overflow-hidden">
            {/* Main Content */}
            <main className={`flex-1 ${activeSection === 'debates' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
                {['chats', 'recalls', 'presentation', 'qa', 'instant_describe'].includes(activeSection) ? (
                    renderEmptySegment()
                ) : activeSection === 'debates' ? (
                    renderDebates()
                ) : (
                    <div className="pt-24 px-8 pb-12 max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                            <div>
                                <h1 className="text-4xl font-bold text-black dark:text-white mb-1" style={{ fontFamily: "'Lora', serif" }}>
                                    Hey, Ayon.
                                </h1>
                                <p className="text-xl text-gray-500 dark:text-gray-400">Ready to start a project?</p>
                            </div>
                            <button
                                onClick={() => setShowAddProjectModal(true)}
                                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl flex items-center shadow-sm transition-colors"
                            >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                New
                            </button>
                        </div>

                        {/* Controls Row — single unified row */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                {/* Search */}
                                <div className="relative flex-grow md:flex-grow-0">
                                    <input
                                        type="text"
                                        placeholder="Search catalog"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full md:w-64 pl-9 pr-4 py-2 bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                                    />
                                    <SearchIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                </div>
                                {/* Filters button */}
                                <button className="flex items-center px-4 py-2 bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                                    <AdjustIcon className="w-4 h-4 mr-2" /> Filters
                                </button>
                            </div>

                            {/* Category Dropdown — to the right of Filters */}
                            <div className="relative w-full md:w-auto">
                                <button
                                    onClick={() => setCategoryOpen(!categoryOpen)}
                                    className="flex items-center justify-between w-full md:w-44 px-4 py-2 bg-neutral-100 dark:bg-[#1a1a1a] border border-neutral-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                >
                                    <span>{activeCategory === 'All' ? 'Category' : activeCategory}</span>
                                    <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {categoryOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden"
                                        >
                                            {categoryFilterOptions.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => { setActiveCategory(cat); setCategoryOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                                        activeCategory === cat
                                                            ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-800'
                                                    }`}
                                                >
                                                    {cat === 'All' ? 'All Categories' : cat}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Learn Track Nav Pills */}
                        <div className="flex flex-wrap items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                            {learnTrackItems.map(item => (
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
                        <div className="flex items-center justify-start mb-6">
                            <div className="bg-neutral-100 dark:bg-[#1a1a1a] p-1 rounded-lg flex items-center border border-neutral-200 dark:border-gray-800">
                                <button
                                    onClick={() => setViewMode('incomplete')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                                        viewMode === 'incomplete' ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Incomplete
                                </button>
                                <button
                                    onClick={() => setViewMode('complete')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                                        viewMode === 'complete' ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Complete
                                </button>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="text-left mb-6 text-sm text-gray-500">
                            {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''}
                        </div>

                        {/* Cards Grid */}
                        <AnimatePresence mode="popLayout">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredProjects.map(project => renderCard(project))}
                            </div>
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* New Project Modal */}
            <AnimatePresence>
                {showAddProjectModal && (
                    <AddProjectModal
                        onClose={() => setShowAddProjectModal(false)}
                        onAddProject={handleAddProject}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectsView;


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Theme } from '../App';
import {
    PlusIcon, AddCoursesIcon, FeedbackIcon, GuideIcon, ExtensionIcon, SettingsIcon, HistoryIcon,
    SunIcon, MoonIcon, LogoutIcon,
    TrophyIcon, ProjectsResearchIcon, ExamPaperPenIcon, MicroscopeIcon,
    ProfessorStudentIcon, DebatePodiumIcon, EdgramIcon, GlobeIcon,
    LocationTrackerIcon, LearningMethodIcon, ChevronDownIcon, CrownIcon,
    ViewSidebarIcon, CheckCircleIcon, DollarIcon, SidebarToggleIcon, CubeIcon, DotsHorizontalIcon, TrashIcon, ShareIcon, PencilIcon, ChevronRightIcon,
    HomeIcon, ShieldCheckIcon, UserIcon, MicIcon, SpeakerWaveIcon, BookOpenIcon, LabIcon, FireIcon, PhoneIcon, ChatIcon
} from './icons';
import type { Space } from '../utils/mockDb';
import WorkspaceDropdown from './WorkspaceDropdown';
import { InlineCampusIcon } from './enterprise/portal/StudentPortal';
import { DORMANT_NAV_ENABLED, DORMANT_NAV_KEYS } from './dormantNav';

const RepeatIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 2l4 4-4 4" />
        <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
        <path d="M7 22l-4-4 4-4" />
        <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
);

interface SidebarProps {
  toggleTheme: () => void;
  theme: Theme;
  onNavigate: (view: string) => void;
  activeItem: string;
  sidebarMode: 'hover' | 'manual';
  setSidebarMode: (mode: 'hover' | 'manual') => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  spaces: Space[];
  onCreateSpace: () => void;
  onRenameSpace: (id: string, newTitle: string) => void;
  onDeleteSpace: (id: string) => void;
  onShareSpace: (id: string) => void;
  userEmail: string;
  onLogout: () => void;
  isEnterprise: boolean;
  isExamActive?: boolean;
  onLockedNavigationAttempt?: () => void;
}

const navConfig = [
    {
        items: [
            { name: 'Sandbox', icon: <CubeIcon className="w-5 h-5" />, key: 'sandbox' },
            { name: 'Profile Workspace', icon: <UserIcon className="w-5 h-5" />, key: 'profile_workspace' },
            { name: 'Spaced Repetition', icon: <RepeatIcon className="w-5 h-5" />, key: 'spaced_repetition' },
            { name: 'Student Portal', icon: <InlineCampusIcon className="w-5 h-5" />, key: 'student_portal' },
            { name: 'Add Content', icon: <PlusIcon className="w-5 h-5" />, key: 'add_content' },
            { name: 'Add Courses', icon: <AddCoursesIcon className="w-5 h-5" />, key: 'add_courses' },
            { name: 'Competitions', icon: <TrophyIcon className="w-5 h-5" />, key: 'competitions' },
            { name: 'Projects', icon: <ProjectsResearchIcon className="w-5 h-5" />, key: 'projects' },
            // Removed static "Create Space" from here
        ]
    },
    { type: 'separator' },
    {
        items: [
            { name: 'Research Lab', icon: <MicroscopeIcon className="w-5 h-5" />, key: 'research_lab' },
            { name: 'Consult', icon: <ProfessorStudentIcon className="w-5 h-5" />, key: 'consult_professors' },
            // Debate removed from here
            { name: 'Edgram', icon: <EdgramIcon className="w-5 h-5" />, key: 'edgram' },
            { name: 'Discover', icon: <GlobeIcon className="w-5 h-5" />, key: 'discover' },
            { name: 'Tracker', icon: <LocationTrackerIcon className="w-5 h-5" />, key: 'tracker' },
            { name: 'Learning Methods', icon: <LearningMethodIcon className="w-5 h-5" />, key: 'learning_methods_1' },
        ]
    },
    { type: 'separator' },
    {
        label: 'Help & Tools',
        items: [
            { name: 'Feedback', icon: <FeedbackIcon className="w-5 h-5" />, key: 'feedback' },
            { name: 'Quick Guide', icon: <GuideIcon className="w-5 h-5" />, key: 'quick_guide' },
            { name: 'Chrome Extension', icon: <ExtensionIcon className="w-5 h-5" />, key: 'chrome_extension' },
            { name: 'Invite & Earn', icon: <DollarIcon className="w-5 h-5" />, key: 'invite_earn' },
        ]
    }
];

const Sidebar: React.FC<SidebarProps> = ({ 
    toggleTheme, theme, onNavigate, activeItem, 
    sidebarMode, setSidebarMode, isExpanded, setIsExpanded,
    spaces, onCreateSpace, onRenameSpace, onDeleteSpace, onShareSpace,
    userEmail, onLogout, isEnterprise, isExamActive, onLockedNavigationAttempt
}) => {
    const [isShaking, setIsShaking] = useState(false);
    const [shakingKey, setShakingKey] = useState<string | null>(null);
    const guardedNavigate = (key: string) => {
        if (isExamActive) {
            setShakingKey(key);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 600);
            onLockedNavigationAttempt?.();
            return;
        }
        onNavigate(key);
    };
    const visibleNavConfig = (DORMANT_NAV_ENABLED
        ? navConfig.map((group) =>
              'items' in group && group.items
                  ? { ...group, items: group.items.filter((i) => !DORMANT_NAV_KEYS.has(i.key)) }
                  : group,
          )
        : navConfig) as typeof navConfig;
    const [profileOpen, setProfileOpen] = useState(false);
    const [sidebarSettingsOpen, setSidebarSettingsOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isMockTestsOpen, setIsMockTestsOpen] = useState(true);
    const [isWritingLabOpen, setIsWritingLabOpen] = useState(false);
    
    // Space management state
    const [hoveredSpaceId, setHoveredSpaceId] = useState<string | null>(null);
    const [menuOpenSpaceId, setMenuOpenSpaceId] = useState<string | null>(null);
    const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sidebarMode === 'hover') {
             setIsExpanded(isSidebarHovered);
        }
    }, [sidebarMode, isSidebarHovered, setIsExpanded]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
                setSidebarSettingsOpen(false);
            }
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenSpaceId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEditStart = (space: Space, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSpaceId(space.id);
        setEditValue(space.title);
        setMenuOpenSpaceId(null);
    };

    const handleEditSave = (id: string) => {
        if (editValue.trim()) {
            onRenameSpace(id, editValue);
        }
        setEditingSpaceId(null);
    };

    const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            handleEditSave(id);
        } else if (e.key === 'Escape') {
            setEditingSpaceId(null);
        }
    };

    const textColor = theme === 'dark' ? 'text-gray-200' : 'text-neutral-700';
    const iconColor = theme === 'dark' ? 'text-gray-400' : 'text-neutral-500';
    const hoverClasses = 'dark:hover:bg-gray-800 hover:bg-neutral-200 dark:hover:text-white hover:text-black';
    const activeClasses = theme === 'dark' 
        ? 'bg-gray-800 border border-gray-700 text-white' 
        : 'bg-neutral-200 border border-neutral-300 text-black';

    const handleToggle = (e: React.MouseEvent) => {
        if (sidebarMode === 'manual') {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <motion.aside
            layout
            initial={{ width: '5rem' }}
            animate={{ width: isExpanded ? '17rem' : '5rem' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => { setIsSidebarHovered(false); setShowTooltip(false); }}
            className={`group h-screen flex flex-col shrink-0 border-r z-30 relative ${theme === 'dark' ? 'bg-[#131313] border-gray-800/50' : 'bg-neutral-100 border-neutral-200'}`}
        >
            <style>{`@keyframes lock-shake {0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
            <div className="flex items-center px-4 h-16 shrink-0 relative">
                <WorkspaceDropdown theme={theme} isExpanded={isExpanded} />
                {sidebarMode === 'manual' && (
                    <div className="relative">
                        <button
                            onClick={handleToggle}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-gray-800 transition-all"
                        >
                            <SidebarToggleIcon className="w-6 h-6" />
                        </button>
                        {showTooltip && (
                            <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 px-3 py-1.5 bg-black text-white text-[11px] font-bold rounded-lg whitespace-nowrap shadow-xl z-50 pointer-events-none">
                                {isExpanded ? 'close sidebar' : 'open sidebar'}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <nav className={`flex-grow px-3 mt-4 space-y-1.5 overflow-y-auto overflow-x-hidden${isShaking ? ' animate-[lock-shake_0.6s_ease-in-out]' : ''}`}>
                {visibleNavConfig.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        {section.type === 'separator' && <div className="py-2"><div className={`border-t ${theme === 'dark' ? 'border-gray-800/60' : 'border-neutral-200'}`}></div></div>}
                        {section.label && isExpanded && (
                            <motion.h3 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {section.label}
                            </motion.h3>
                        )}
                        {section.items?.map(item => (
                            <button key={item.key} onClick={() => guardedNavigate(item.key)} 
                                className={`relative w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200 ${activeItem === item.key ? activeClasses : ''}${shakingKey === item.key && isShaking ? ' ring-2 ring-rose-500/80' : ''}`}
                            >
                                <div className={`${activeItem === item.key ? 'text-current' : iconColor} shrink-0`}>
                                     {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-5 h-5" })}
                                </div>
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.span 
                                                initial={{ opacity: 0, width: 0 }} 
                                                animate={{ opacity: 1, width: 'auto' }} 
                                                exit={{ opacity: 0, width: 0 }} 
                                                transition={{ duration: 0.2, delay: 0.05 }} 
                                                className="ml-4 font-medium text-[15px] whitespace-nowrap overflow-hidden">
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {shakingKey === item.key && isShaking && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 text-sm">🔒</span>
                                    )}
                                </button>
                        ))}
                        
                        {/* ── Mock Tests Accordion ── */}
                        {sectionIndex === 0 && (
                            <div className="mt-1">
                                <button
                                    onClick={() => isExpanded && setIsMockTestsOpen(!isMockTestsOpen)}
                                    title={!isExpanded ? 'Mock Tests' : undefined}
                                    className={`relative group w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200`}
                                >
                                    <div className={`${iconColor} shrink-0`}>
                                        <CubeIcon className="w-5 h-5" />
                                    </div>
                                    {isExpanded && (
                                        <>
                                            <span className="ml-3 text-[15px] font-medium">Mock Tests</span>
                                            <ChevronDownIcon className={`w-4 h-4 ml-auto shrink-0 transition-transform duration-200 ${isMockTestsOpen ? '' : '-rotate-90'}`} />
                                        </>
                                    )}
                                    {!isExpanded && (
                                        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                                            Mock Tests
                                        </span>
                                    )}
                                </button>

                                {isExpanded && isMockTestsOpen && (
                                    <div className="border-l border-zinc-800 ml-4 pl-3 space-y-0.5 mb-1">
                                        <button
                                            onClick={() => guardedNavigate('ielts_dashboard')}
                                            className={`relative group w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                                                activeItem === 'ielts_dashboard'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                                                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            <HomeIcon className="w-4 h-4 shrink-0" />
                                            <span>Dashboard</span>
                                        </button>

                                        <button
                                            onClick={() => guardedNavigate('full_cambridge_mock')}
                                            className={`relative group w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                                                activeItem === 'full_cambridge_mock'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                                                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            <TrophyIcon className="w-4 h-4 shrink-0" />
                                            <span>Full Cambridge Mock</span>
                                        </button>

                                        <button
                                            onClick={() => guardedNavigate('speaking_studio')}
                                            className={`relative group w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                                                activeItem === 'speaking_studio'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                                                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            <MicIcon className="w-4 h-4 shrink-0" />
                                            <span>Speaking Studio</span>
                                        </button>

                                        <button
                                            onClick={() => guardedNavigate('listening_engine')}
                                            className={`relative group w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                                                activeItem === 'listening_engine'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                                                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            <SpeakerWaveIcon className="w-4 h-4 shrink-0" />
                                            <span>Listening Engine</span>
                                        </button>

                                        <button
                                            onClick={() => guardedNavigate('reading_hub')}
                                            className={`relative group w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                                                activeItem === 'reading_hub'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                                                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            <BookOpenIcon className="w-4 h-4 shrink-0" />
                                            <span>Reading Hub</span>
                                        </button>

                                        <div>
                                            <button
                                                onClick={() => setIsWritingLabOpen(!isWritingLabOpen)}
                                                className={`relative group w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                                                    ['task2_checker', 'task1_academic', 'task1_general', 'writing_lab'].includes(activeItem)
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                                                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03]'
                                                }`}
                                            >
                                                <LabIcon className="w-4 h-4 shrink-0" />
                                                <span className="flex-1 text-left">Writing Lab</span>
                                                <ChevronDownIcon className={`w-3 h-3 shrink-0 transition-transform duration-200 ${isWritingLabOpen ? '' : '-rotate-90'}`} />
                                            </button>

                                            {isExpanded && isWritingLabOpen && (
                                                <div className="border-l border-zinc-800 ml-5 pl-3 space-y-0.5 mt-0.5 mb-1">
                                                    <button
                                                        onClick={() => guardedNavigate('task2_checker')}
                                                        className={`w-full text-left rounded-md px-3 py-1.5 text-[12px] transition-colors ${
                                                            activeItem === 'task2_checker'
                                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]'
                                                        }`}
                                                    >
                                                        Task 2 Checker
                                                    </button>
                                                    <button
                                                        onClick={() => guardedNavigate('task1_academic')}
                                                        className={`w-full text-left rounded-md px-3 py-1.5 text-[12px] transition-colors ${
                                                            activeItem === 'task1_academic'
                                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]'
                                                        }`}
                                                    >
                                                        Task 1 Academic
                                                    </button>
                                                    <button
                                                        onClick={() => guardedNavigate('task1_general')}
                                                        className={`w-full text-left rounded-md px-3 py-1.5 text-[12px] transition-colors ${
                                                            activeItem === 'task1_general'
                                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]'
                                                        }`}
                                                    >
                                                        Task 1 General
                                                    </button>
                                                    <button
                                                        onClick={() => guardedNavigate('writing_lab')}
                                                        className={`w-full text-left rounded-md px-3 py-1.5 text-[12px] transition-colors ${
                                                            activeItem === 'writing_lab'
                                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]'
                                                        }`}
                                                    >
                                                        Mock Tests &amp; Practice
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* AI Speaking Partner */}
                        {sectionIndex === 0 && (
                            <button
                                onClick={() => guardedNavigate('ai_speaking_partner')}
                                className={`relative w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200 ${activeItem === 'ai_speaking_partner' ? activeClasses : ''}${shakingKey === 'ai_speaking_partner' && isShaking ? ' ring-2 ring-rose-500/80' : ''}`}
                            >
                                <div className={`${activeItem === 'ai_speaking_partner' ? 'text-current' : iconColor} shrink-0`}>
                                    <PhoneIcon className="w-5 h-5" />
                                </div>
                                {isExpanded && (
                                    <AnimatePresence>
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 }}
                                            className="ml-4 font-medium text-[15px] whitespace-nowrap overflow-hidden"
                                        >
                                            AI Speaking Partner
                                        </motion.span>
                                    </AnimatePresence>
                                )}
                                {!isExpanded && (
                                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                                        AI Speaking Partner
                                    </span>
                                )}
                                {shakingKey === 'ai_speaking_partner' && isShaking && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 text-sm">🔒</span>
                                )}
                            </button>
                        )}
                        
                        {/* AI Rewriter */}
                        {sectionIndex === 0 && (
                            <button
                                onClick={() => guardedNavigate('ai_rewriter')}
                                className={`relative w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200 ${activeItem === 'ai_rewriter' ? activeClasses : ''}${shakingKey === 'ai_rewriter' && isShaking ? ' ring-2 ring-rose-500/80' : ''}`}
                            >
                                <div className={`${activeItem === 'ai_rewriter' ? 'text-current' : iconColor} shrink-0`}>
                                    <PencilIcon className="w-5 h-5" />
                                </div>
                                {isExpanded && (
                                    <AnimatePresence>
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 }}
                                            className="ml-4 font-medium text-[15px] whitespace-nowrap overflow-hidden"
                                        >
                                            AI Rewriter
                                        </motion.span>
                                    </AnimatePresence>
                                )}
                                {!isExpanded && (
                                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                                        AI Rewriter
                                    </span>
                                )}
                                {shakingKey === 'ai_rewriter' && isShaking && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 text-sm">🔒</span>
                                )}
                            </button>
                        )}
                        
                        {/* AI IELTS Chatbot */}
                        {sectionIndex === 0 && (
                            <button
                                onClick={() => guardedNavigate('ai_ielts_chatbot')}
                                className={`relative w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200 ${activeItem === 'ai_ielts_chatbot' ? activeClasses : ''}${shakingKey === 'ai_ielts_chatbot' && isShaking ? ' ring-2 ring-rose-500/80' : ''}`}
                            >
                                <div className={`${activeItem === 'ai_ielts_chatbot' ? 'text-current' : iconColor} shrink-0`}>
                                    <ChatIcon className="w-5 h-5" />
                                </div>
                                {isExpanded && (
                                    <AnimatePresence>
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 }}
                                            className="ml-4 font-medium text-[15px] whitespace-nowrap overflow-hidden"
                                        >
                                            AI IELTS Chatbot
                                        </motion.span>
                                    </AnimatePresence>
                                )}
                                {!isExpanded && (
                                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                                        AI IELTS Chatbot
                                    </span>
                                )}
                                {shakingKey === 'ai_ielts_chatbot' && isShaking && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 text-sm">🔒</span>
                                )}
                            </button>
                        )}
                        
                        {/* Free Content Library */}
                        {sectionIndex === 0 && (
                            <button
                                onClick={() => guardedNavigate('free_content_library')}
                                className={`relative w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200 ${
                                    activeItem === 'free_content_library' ? activeClasses : ''
                                }${shakingKey === 'free_content_library' && isShaking ? ' ring-2 ring-rose-500/80' : ''}`}
                            >
                                <div className={`${activeItem === 'free_content_library' ? 'text-current' : iconColor} shrink-0`}>
                                    <BookOpenIcon className="w-5 h-5" />
                                </div>
                                {isExpanded && (
                                    <AnimatePresence>
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 }}
                                            className="ml-4 font-medium text-[15px] whitespace-nowrap overflow-hidden"
                                        >
                                            Free Content Library
                                        </motion.span>
                                    </AnimatePresence>
                                )}
                                {!isExpanded && (
                                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                                        Free Content Library
                                    </span>
                                )}
                                {shakingKey === 'free_content_library' && isShaking && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 text-sm">🔒</span>
                                )}
                            </button>
                        )}
                        
                        {/* Leaderboard */}
                        {sectionIndex === 0 && (
                            <button
                                onClick={() => guardedNavigate('leaderboard')}
                                className={`relative w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200 ${activeItem === 'leaderboard' ? activeClasses : ''}${shakingKey === 'leaderboard' && isShaking ? ' ring-2 ring-rose-500/80' : ''}`}
                            >
                                <div className={`${activeItem === 'leaderboard' ? 'text-current' : iconColor} shrink-0`}>
                                    <TrophyIcon className="w-5 h-5" />
                                </div>
                                {isExpanded && (
                                    <AnimatePresence>
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 }}
                                            className="ml-4 font-medium text-[15px] whitespace-nowrap overflow-hidden"
                                        >
                                            Leaderboard
                                        </motion.span>
                                    </AnimatePresence>
                                )}
                                {!isExpanded && (
                                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                                        Leaderboard
                                    </span>
                                )}
                                {shakingKey === 'leaderboard' && isShaking && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 text-sm">🔒</span>
                                )}
                            </button>
                        )}
                        
                        {/* Streaks */}
                        {sectionIndex === 0 && (
                            <button
                                onClick={() => guardedNavigate('streaks')}
                                className={`relative w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200 ${activeItem === 'streaks' ? activeClasses : ''}${shakingKey === 'streaks' && isShaking ? ' ring-2 ring-rose-500/80' : ''}`}
                            >
                                <div className={`${activeItem === 'streaks' ? 'text-current' : iconColor} shrink-0`}>
                                    <FireIcon className="w-5 h-5" />
                                </div>
                                {isExpanded && (
                                    <AnimatePresence>
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 }}
                                            className="ml-4 font-medium text-[15px] whitespace-nowrap overflow-hidden"
                                        >
                                            Streaks
                                        </motion.span>
                                    </AnimatePresence>
                                )}
                                {!isExpanded && (
                                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                                        Streaks
                                    </span>
                                )}
                                {shakingKey === 'streaks' && isShaking && (
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 text-sm">🔒</span>
                                )}
                            </button>
                        )}
                        
                        {/* Inject Spaces Section after the first group (index 0) */}
                        {!isEnterprise && sectionIndex === 0 && (
                            <div className="mt-2 mb-2">
                                <div className="px-3 pt-2 pb-1 flex items-center justify-between group/header">
                                    {isExpanded ? (
                                        <motion.h3
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                        >
                                            Spaces
                                        </motion.h3>
                                    ) : (
                                        <div className="h-4"></div> /* Spacer when collapsed */
                                    )}
                                </div>
                                
                                <button 
                                    onClick={onCreateSpace}
                                    className={`w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200`}
                                >
                                    <div className={`${iconColor} shrink-0`}>
                                        <PlusIcon className="w-5 h-5" />
                                    </div>
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.span 
                                                initial={{ opacity: 0, width: 0 }} 
                                                animate={{ opacity: 1, width: 'auto' }} 
                                                exit={{ opacity: 0, width: 0 }} 
                                                transition={{ duration: 0.2, delay: 0.05 }} 
                                                className="ml-4 font-medium text-[15px] whitespace-nowrap overflow-hidden"
                                            >
                                                Create Space
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>

                                {spaces.map(space => (
                                    <div 
                                        key={space.id} 
                                        className="relative group/space"
                                        onMouseEnter={() => setHoveredSpaceId(space.id)}
                                        onMouseLeave={() => setHoveredSpaceId(null)}
                                    >
                                        <button 
                                            onClick={() => guardedNavigate(`space_${space.id}`)} 
                                            className={`w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200 ${activeItem === `space_${space.id}` ? (space.isInstitutional ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : activeClasses) : ''}`}
                                        >
                                            <div className={`${activeItem === `space_${space.id}` ? 'text-current' : iconColor} shrink-0 transition-transform duration-200`}>
                                                {space.isInstitutional ? (
                                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                        <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                                                    </div>
                                                ) : hoveredSpaceId === space.id && isExpanded ? (
                                                    <ChevronRightIcon className="w-5 h-5" />
                                                ) : (
                                                    <CubeIcon className="w-5 h-5" />
                                                )}
                                            </div>
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, width: 0 }} 
                                                        animate={{ opacity: 1, width: 'auto' }} 
                                                        exit={{ opacity: 0, width: 0 }} 
                                                        transition={{ duration: 0.2, delay: 0.05 }} 
                                                        className="ml-4 flex-1 overflow-hidden"
                                                    >
                                                        {editingSpaceId === space.id ? (
                                                            <input 
                                                                type="text" 
                                                                value={editValue} 
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                onBlur={() => handleEditSave(space.id)}
                                                                onKeyDown={(e) => handleEditKeyDown(e, space.id)}
                                                                autoFocus
                                                                className="w-full bg-transparent border-none outline-none text-[15px] font-medium p-0"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        ) : (
                                                            <span className={`font-medium text-[15px] whitespace-nowrap overflow-hidden block ${space.isInstitutional ? 'text-emerald-200' : ''}`}>{space.title}</span>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            
                                            {/* Institutional verification badge */}
                                            {space.isInstitutional && isExpanded && (
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.5)] shrink-0 ml-2" />
                                            )}
                                            
                                            {/* Three Dots Button - Only visible on hover and when expanded */}
                                            {isExpanded && hoveredSpaceId === space.id && editingSpaceId !== space.id && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuOpenSpaceId(menuOpenSpaceId === space.id ? null : space.id);
                                                    }}
                                                    className="shrink-0 p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                                                >
                                                    <DotsHorizontalIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </button>

                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {menuOpenSpaceId === space.id && (
                                                <motion.div 
                                                    ref={menuRef}
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-1 w-40 dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                                                >
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onShareSpace(space.id);
                                                            setMenuOpenSpaceId(null);
                                                        }}
                                                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                                                    >
                                                        <ShareIcon className="w-4 h-4" />
                                                        <span>Share</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleEditStart(space, e)}
                                                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteSpace(space.id);
                                                            setMenuOpenSpaceId(null);
                                                        }}
                                                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                        <span>Delete Space</span>
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

             <div className="px-3 pb-6 pt-2 shrink-0 relative" ref={profileRef}>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mx-3 -mb-1 relative z-0"
                        >
                            <div className={`rounded-t-xl border-t border-x ${theme === 'dark' ? 'border-green-600 bg-[#0c2414]' : 'border-green-500 bg-[#e7f5eb]'} px-3 py-1 pb-2`}>
                                <div className="flex justify-center items-center">
                                    <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-[#38d361]' : 'text-green-700'} tracking-wide`}>Free Plan</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative z-10">
                    <AnimatePresence>
                        {profileOpen && (
                             <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute bottom-full left-0 right-0 mb-3 w-full border rounded-2xl shadow-xl overflow-visible ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-neutral-200'}`}
                            >
                                <div className="p-1.5 space-y-0.5 relative">
                                    <button onClick={() => { guardedNavigate('profile_workspace'); setProfileOpen(false); }} className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700`}>
                                        <UserIcon className="w-4 h-4 mr-3 text-emerald-400" />
                                        Profile Workspace
                                    </button>
                                    <button onClick={() => { guardedNavigate('settings'); setProfileOpen(false); }} className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700`}>
                                        <SettingsIcon className="w-4 h-4 mr-3" /> 
                                        Settings
                                    </button>
                                    <button onClick={() => { guardedNavigate('pricing'); setProfileOpen(false); }} className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700`}>
                                        <CrownIcon className="w-4 h-4 mr-3" />
                                        Pricing
                                    </button>
                                    <button onClick={() => { guardedNavigate('history'); setProfileOpen(false); }} className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700`}>
                                        <HistoryIcon className="w-4 h-4 mr-3" /> 
                                        History
                                    </button>
                                    <div className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-default ${theme === 'dark' ? 'text-gray-300' : 'text-neutral-700'}`}>
                                        <div className="flex items-center">
                                            {theme === 'dark' ? <MoonIcon className="w-4 h-4 mr-3" /> : <SunIcon className="w-4 h-4 mr-3" />}
                                            <span className="text-sm">Dark mode</span>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                                            className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-white' : 'bg-gray-300'}`}
                                        >
                                            <div className={`bg-black w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-3.5' : ''}`}></div>
                                        </button>
                                    </div>
                                    <div 
                                        className="relative" 
                                        onMouseEnter={() => setSidebarSettingsOpen(true)}
                                        onMouseLeave={() => setSidebarSettingsOpen(false)}
                                    >
                                        <button className={`w-full text-left text-sm flex items-center justify-between px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700`}>
                                            <div className="flex items-center">
                                                <ViewSidebarIcon className="w-4 h-4 mr-3" />
                                                Sidebar
                                            </div>
                                            <ChevronDownIcon className="w-3 h-3 -rotate-90" />
                                        </button>
                                        <AnimatePresence>
                                            {sidebarSettingsOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className={`absolute bottom-0 left-full ml-2 w-48 border rounded-xl shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-neutral-200'}`}
                                                >
                                                    <div className="p-1.5 space-y-0.5">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setSidebarMode('manual'); if(!isExpanded) setIsExpanded(true); }}
                                                            className={`w-full text-left text-sm flex items-center justify-between px-3 py-2.5 rounded-xl ${hoverClasses} ${sidebarMode === 'manual' ? (theme === 'dark' ? 'text-white' : 'text-black font-semibold') : 'dark:text-gray-400 text-gray-500'}`}
                                                        >
                                                            <span>Expand Manual</span>
                                                            {sidebarMode === 'manual' && <CheckCircleIcon className="w-4 h-4 text-orange-500" />}
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setSidebarMode('hover'); }}
                                                            className={`w-full text-left text-sm flex items-center justify-between px-3 py-2.5 rounded-xl ${hoverClasses} ${sidebarMode === 'hover' ? (theme === 'dark' ? 'text-white' : 'text-black font-semibold') : 'dark:text-gray-400 text-gray-500'}`}
                                                        >
                                                            <span>On Hover</span>
                                                            {sidebarMode === 'hover' && <CheckCircleIcon className="w-4 h-4 text-orange-500" />}
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <button 
                                        onClick={() => guardedNavigate('landing')} 
                                        className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700`}
                                    >
                                        <HomeIcon className="w-4 h-4 mr-3" />
                                        About
                                    </button>
                                    <div className="pt-1 pb-1">
                                        <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-neutral-200'}`}></div>
                                    </div>
                                    <button 
                                        onClick={onLogout}
                                        className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700 hover:text-red-500 dark:hover:text-red-400`}
                                    >
                                        <LogoutIcon className="w-4 h-4 mr-3" /> 
                                        Log out
                                    </button>
                                </div>
                             </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <button 
                        onClick={() => setProfileOpen(p => !p)} 
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all border ${
                            profileOpen 
                            ? (theme === 'dark' ? 'bg-[#222] border-gray-400' : 'bg-neutral-50 border-gray-500')
                            : (theme === 'dark' ? 'bg-[#0a0a0a] border-[#333] hover:bg-[#1a1a1a] hover:border-gray-50 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]' : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400')
                        }`}
                    >
                        <div className="flex items-center min-w-0">
                            <img className="w-9 h-9 rounded-full shrink-0 object-cover border border-gray-300 dark:border-gray-700" src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=2823&auto=format&fit=crop" alt="User avatar" />
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="ml-3 text-left overflow-hidden">
                                        <p className={`font-semibold text-[15px] truncate ${theme === 'dark' ? 'text-[#eee]' : 'text-neutral-900'}`}>{userEmail}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {isExpanded && <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />}
                    </button>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;

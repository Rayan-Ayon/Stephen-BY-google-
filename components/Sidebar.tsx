

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Theme } from '../App';
import {
    PlusIcon, AddCoursesIcon, FeedbackIcon, GuideIcon, ExtensionIcon, SettingsIcon, HistoryIcon,
    SunIcon, MoonIcon, LogoutIcon,
    TrophyIcon, ProjectsResearchIcon, ExamPaperPenIcon, MicroscopeIcon,
    ProfessorStudentIcon, DebatePodiumIcon, EdgramIcon, GlobeIcon,
    LocationTrackerIcon, LearningMethodIcon, ChevronDownIcon, CrownIcon,
    DoubleChevronLeftIcon, ViewSidebarIcon, CheckCircleIcon
} from './icons';

interface SidebarProps {
  toggleTheme: () => void;
  theme: Theme;
  onNavigate: (view: string) => void;
  activeItem: string;
  // New props for state management
  sidebarMode: 'hover' | 'manual';
  setSidebarMode: (mode: 'hover' | 'manual') => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const navConfig = [
    {
        items: [
            { name: 'Add Content', icon: <PlusIcon className="w-5 h-5" />, key: 'add_content' },
            { name: 'Add Courses', icon: <AddCoursesIcon className="w-5 h-5" />, key: 'add_courses' },
            { name: 'Competitions', icon: <TrophyIcon className="w-5 h-5" />, key: 'competitions' },
            { name: 'Projects & Research', icon: <ProjectsResearchIcon className="w-5 h-5" />, key: 'projects' },
            { name: 'Exams', icon: <ExamPaperPenIcon className="w-5 h-5" />, key: 'exams' },
            { name: 'Create Space', icon: <PlusIcon className="w-5 h-5" />, key: 'create_space' },
        ]
    },
    { type: 'separator' },
    {
        items: [
            { name: 'Research Lab', icon: <MicroscopeIcon className="w-5 h-5" />, key: 'research_lab' },
            { name: 'Consult', icon: <ProfessorStudentIcon className="w-5 h-5" />, key: 'consult_professors' },
            { name: 'Debate', icon: <DebatePodiumIcon className="w-5 h-5" />, key: 'debate' },
            { name: 'Edgram', icon: <EdgramIcon className="w-5 h-5" />, key: 'edgram' },
            { name: 'Discover', icon: <GlobeIcon className="w-5 h-5" />, key: 'discover' },
            { name: 'Tracker', icon: <LocationTrackerIcon className="w-5 h-5" />, key: 'tracker' },
            { name: 'Learning Methods', icon: <LearningMethodIcon className="w-5 h-5" />, key: 'learning_methods' },
        ]
    },
    { type: 'separator' },
    {
        label: 'Help & Tools',
        items: [
            { name: 'Feedback', icon: <FeedbackIcon className="w-5 h-5" />, key: 'feedback' },
            { name: 'Quick Guide', icon: <GuideIcon className="w-5 h-5" />, key: 'quick_guide' },
            { name: 'Chrome Extension', icon: <ExtensionIcon className="w-5 h-5" />, key: 'chrome_extension' },
        ]
    }
];

const Sidebar: React.FC<SidebarProps> = ({ 
    toggleTheme, theme, onNavigate, activeItem, 
    sidebarMode, setSidebarMode, isExpanded, setIsExpanded 
}) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [sidebarSettingsOpen, setSidebarSettingsOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Determine actual expanded state based on mode
    const [hoverExpanded, setHoverExpanded] = useState(false);
    
    // Effective expanded state logic
    useEffect(() => {
        if (sidebarMode === 'hover') {
             setIsExpanded(hoverExpanded);
        }
    }, [sidebarMode, hoverExpanded, setIsExpanded]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
                setSidebarSettingsOpen(false); // Close submenu too
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const textColor = theme === 'dark' ? 'text-gray-200' : 'text-neutral-700'; // Lighter/Better contrast
    const iconColor = theme === 'dark' ? 'text-gray-400' : 'text-neutral-500';
    const hoverClasses = 'dark:hover:bg-gray-800 hover:bg-neutral-200 dark:hover:text-white hover:text-black';
    const activeClasses = theme === 'dark' 
        ? 'bg-gray-800 border border-gray-700 text-white' 
        : 'bg-neutral-200 border border-neutral-300 text-black';

    const handleMouseEnter = () => {
        if (sidebarMode === 'hover') setHoverExpanded(true);
    };

    const handleMouseLeave = () => {
        if (sidebarMode === 'hover') setHoverExpanded(false);
    };

    return (
        <motion.aside
            layout
            initial={{ width: '5rem' }}
            animate={{ width: isExpanded ? '17rem' : '5rem' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`group h-screen flex flex-col shrink-0 border-r z-30 relative ${theme === 'dark' ? 'bg-[#131313] border-gray-800/50' : 'bg-neutral-100 border-neutral-200'}`}
        >
            <div className="flex items-center px-6 h-16 shrink-0 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isExpanded ? 'full' : 'short'}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`font-semibold flex items-center justify-between w-full ${theme === 'dark' ? 'text-gray-200' : 'text-neutral-700'}`}
                    >
                       {isExpanded ? (
                           <>
                               <span className="text-xl">Stephen</span>
                               {/* Collapse Button (Only visible on hover in expanded mode) */}
                               <button 
                                    onClick={(e) => { e.stopPropagation(); if(sidebarMode === 'manual') setIsExpanded(false); }}
                                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300`}
                                    title="Collapse Sidebar"
                               >
                                   <DoubleChevronLeftIcon className="w-4 h-4" />
                               </button>
                           </>
                       ) : (
                           <span className="text-2xl">S</span>
                       )}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <nav className="flex-grow px-3 mt-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
                {navConfig.map((section, sectionIndex) => (
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
                            <button key={item.key} onClick={() => onNavigate(item.key)} 
                                className={`w-full flex items-center p-3 rounded-lg ${textColor} ${hoverClasses} transition-colors duration-200 ${activeItem === item.key ? activeClasses : ''}`}
                            >
                                <div className={`${activeItem === item.key ? 'text-current' : iconColor} shrink-0`}>
                                     {React.cloneElement(item.icon, { className: "w-5 h-5" })}
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
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

             <div className="px-3 pb-4 pt-2 shrink-0" ref={profileRef}>
                {/* Free Plan Widget */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            className="mb-2 px-3 py-2 rounded-lg border border-green-800/40 bg-green-900/10 relative overflow-hidden group mx-1"
                        >
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Free Plan</span>
                                <span className="text-[10px] text-green-300">1/10</span>
                            </div>
                            <div className="w-full h-1 bg-gray-700/50 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[10%]"></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
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
                                    <button onClick={() => { onNavigate('settings'); setProfileOpen(false); }} className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700`}>
                                        <SettingsIcon className="w-4 h-4 mr-3" /> 
                                        Settings
                                    </button>
                                    <button onClick={() => { onNavigate('pricing'); setProfileOpen(false); }} className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700`}>
                                        <CrownIcon className="w-4 h-4 mr-3" />
                                        Pricing
                                    </button>
                                    <button onClick={() => { onNavigate('history'); setProfileOpen(false); }} className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700`}>
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
                                    
                                    {/* Sidebar Settings Option */}
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
                                        
                                        {/* Nested Submenu */}
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

                                    <div className="pt-1 pb-1">
                                        <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-neutral-200'}`}></div>
                                    </div>
                                    <button className={`w-full text-left text-sm flex items-center px-3 py-2.5 rounded-xl ${hoverClasses} dark:text-gray-300 text-neutral-700 hover:text-red-500 dark:hover:text-red-400`}>
                                        <LogoutIcon className="w-4 h-4 mr-3" /> 
                                        Log out
                                    </button>
                                </div>
                             </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <button 
                        onClick={() => setProfileOpen(p => !p)} 
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all border ${
                            profileOpen 
                            ? (theme === 'dark' ? 'bg-[#1a1a1a] border-gray-600' : 'bg-white border-gray-400')
                            : (theme === 'dark' ? 'bg-transparent border-gray-600 hover:bg-[#252525] hover:border-gray-500' : 'bg-transparent border-gray-300 hover:bg-gray-50 hover:border-gray-400')
                        }`}
                    >
                        <div className="flex items-center min-w-0">
                            <img className="w-9 h-9 rounded-full shrink-0 object-cover border border-gray-300 dark:border-gray-600" src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=2823&auto=format&fit=crop" alt="User avatar" />
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="ml-3 text-left overflow-hidden">
                                        <p className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-gray-200' : 'text-neutral-800'}`}>AyonLogy</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {isExpanded && <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />}
                    </button>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Theme } from '../App';
import {
    PlusIcon, AddCoursesIcon, FeedbackIcon, GuideIcon, ExtensionIcon, SettingsIcon, HistoryIcon,
    SunIcon, MoonIcon, LogoutIcon,
    TrophyIcon, ProjectsResearchIcon, ExamPaperPenIcon, MicroscopeIcon,
    ProfessorStudentIcon, DebatePodiumIcon, EdgramIcon, GlobeIcon,
    LocationTrackerIcon, LearningMethodIcon
} from './icons';

interface SidebarProps {
  toggleTheme: () => void;
  theme: Theme;
  onNavigate: (view: string) => void;
  activeItem: string;
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
            { name: 'Consult Professors', icon: <ProfessorStudentIcon className="w-5 h-5" />, key: 'consult_professors' },
            { name: 'Consult Students', icon: <ProfessorStudentIcon className="w-5 h-5" />, key: 'consult_students' },
            { name: 'Debate', icon: <DebatePodiumIcon className="w-5 h-5" />, key: 'debate' },
            { name: 'Edgrame', icon: <EdgramIcon className="w-5 h-5" />, key: 'edgrame' },
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

const Sidebar: React.FC<SidebarProps> = ({ toggleTheme, theme, onNavigate, activeItem }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const isExpanded = isHovering;
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const textColor = 'text-gray-400';
    const hoverClasses = 'hover:bg-gray-800 hover:text-white';
    const activeClasses = 'bg-gray-800/50 border border-gray-700 text-white';

    return (
        <motion.aside
            layout
            initial={{ width: '5rem' }}
            animate={{ width: isExpanded ? '16rem' : '5rem' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`h-screen flex flex-col shrink-0 border-r bg-[#131313] border-gray-800/50`}
        >
            <div className="flex items-center px-6 h-16 shrink-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isExpanded ? 'full' : 'short'}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`font-semibold text-gray-400`}
                    >
                       {isExpanded ? <span className="text-xl">Stephen</span> : <span className="text-2xl">S</span>}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <nav className="flex-grow px-4 mt-4 space-y-2 overflow-y-auto">
                {navConfig.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                        {section.type === 'separator' && <div className="py-2"><div className="border-t border-gray-800/60"></div></div>}
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
                                {React.cloneElement(item.icon, { className: "w-5 h-5 shrink-0" })}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.span 
                                            initial={{ opacity: 0, width: 0 }} 
                                            animate={{ opacity: 1, width: 'auto' }} 
                                            exit={{ opacity: 0, width: 0 }} 
                                            transition={{ duration: 0.2, delay: 0.1 }} 
                                            className="ml-4 font-medium text-sm whitespace-nowrap overflow-hidden">
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

             <div className="px-4 pb-4 shrink-0" ref={profileRef}>
                <div className="border-t border-gray-800/60 pt-4 mt-2">
                    <AnimatePresence>
                        {profileOpen && (
                             <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mb-2 w-full bg-[#1f1f1f] border border-gray-700 rounded-lg shadow-2xl"
                            >
                                <div className="p-1.5 space-y-1">
                                    <button className={`w-full text-left text-sm flex items-center p-2 rounded ${hoverClasses}`}><SettingsIcon className="w-4 h-4 mr-3" /> Settings</button>
                                    <button className={`w-full text-left text-sm flex items-center p-2 rounded ${hoverClasses}`}>$ Pricing</button>
                                    <button onClick={() => { onNavigate('history'); setProfileOpen(false); }} className={`w-full text-left text-sm flex items-center p-2 rounded ${hoverClasses}`}><HistoryIcon className="w-4 h-4 mr-3" /> History</button>
                                    <button onClick={toggleTheme} className={`w-full text-left text-sm flex items-center p-2 rounded ${hoverClasses}`}>
                                        {theme === 'dark' ? <SunIcon className="w-4 h-4 mr-3" /> : <MoonIcon className="w-4 h-4 mr-3" />}
                                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                    </button>
                                    <div className="pt-1 pb-1"><div className="border-t border-gray-700/80"></div></div>
                                    <button className={`w-full text-left text-sm flex items-center p-2 rounded ${hoverClasses}`}><LogoutIcon className="w-4 h-4 mr-3" /> Logout</button>
                                </div>
                             </motion.div>
                        )}
                    </AnimatePresence>
                    <button onClick={() => setProfileOpen(p => !p)} className={`w-full flex items-center p-2 rounded-lg transition-colors ${hoverClasses}`}>
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-sm shrink-0">A</div>
                        <AnimatePresence>
                        {isExpanded && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} exit={{ opacity: 0 }} className="ml-3 text-left overflow-hidden whitespace-nowrap">
                                <p className="font-semibold text-sm text-gray-200">Farhan Tanvir Ayon</p>
                                <p className="text-xs text-gray-500">Paid</p>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
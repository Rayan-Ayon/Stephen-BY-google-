
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Workspace from './Workspace';
import HistoryView from './HistoryView';
import AddContentView from './AddContentView';
import AddCoursesView from './AddCoursesView';
import CompetitionView from './CompetitionView';
import DiscoverView from './DiscoverView';
import EdgramView from './EdgramView';
import DebateView from './DebateView';
import TrackerView from './TrackerView';
import ConsultProfessorsView from './ConsultProfessorsView';
import PricingView from './PricingView';
import InviteEarnView from './InviteEarnView';
import QuickGuideModal from './QuickGuideModal';
import FeedbackModal from './FeedbackModal';
import SettingsModal from './SettingsModal';
import ContactUsSlide from './ContactUsSlide';
import { UpgradeModal } from './modals';
import HawkingFab from './HawkingFab';
import type { Theme } from '../App';

export interface HistoryItem {
    id: number;
    title: string;
    description: string;
    type: 'video' | 'article';
    time: string;
    videoUrl: string;
    day: number;
    totalDays: number;
    depth: number;
    level: string;
    learningReason: string;
}

const dummyHistory: HistoryItem[] = [
    {
        id: 1,
        title: 'Introduction to Quantum Computing',
        description: 'A beginner-friendly course on the principles of quantum mechanics and computation.',
        type: 'video',
        time: '2 days ago',
        videoUrl: 'https://www.youtube.com/embed/g_IaVepNDT4',
        day: 3,
        totalDays: 28,
        depth: 25,
        level: 'Beginner',
        learningReason: 'To understand the future of computing and its potential impact on various industries.',
    },
    {
        id: 2,
        title: 'Advanced Machine Learning Techniques',
        description: 'Explore deep learning, reinforcement learning, and other advanced topics in machine learning.',
        type: 'video',
        time: '5 days ago',
        videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
        day: 12,
        totalDays: 45,
        depth: 60,
        level: 'Advanced',
        learningReason: 'To build complex AI models and solve real-world problems.',
    },
    {
        id: 3,
        title: 'The Art of Web Design',
        description: 'Learn about UI/UX principles, color theory, and typography to create beautiful websites.',
        type: 'article',
        time: '1 week ago',
        videoUrl: 'https://www.youtube.com/embed/5a0csh5KiAY', // Placeholder for article
        day: 7,
        totalDays: 15,
        depth: 40,
        level: 'Intermediate',
        learningReason: 'To improve design skills for personal and professional web projects.',
    },
     {
        id: 4,
        title: 'Data Structures and Algorithms in Python',
        description: 'Master essential data structures and algorithms for coding interviews and software development.',
        type: 'video',
        time: '2 weeks ago',
        videoUrl: 'https://www.youtube.com/embed/8hly31xKli0',
        day: 1,
        totalDays: 30,
        depth: 5,
        level: 'Beginner',
        learningReason: 'To strengthen foundational computer science knowledge.',
    },
];


interface DashboardProps {
    toggleTheme: () => void;
    theme: Theme;
    initialView?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ toggleTheme, theme, initialView = 'add_content' }) => {
    const [currentView, setCurrentView] = useState(initialView);
    const [selectedCourse, setSelectedCourse] = useState<HistoryItem | null>(null);
    const [showWorkspaceHeader, setShowWorkspaceHeader] = useState(true);
    const [isQuickGuideOpen, setIsQuickGuideOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isContactUsOpen, setIsContactUsOpen] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    // Sidebar State
    const [sidebarMode, setSidebarMode] = useState<'hover' | 'manual'>('hover');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    useEffect(() => {
        if (initialView) setCurrentView(initialView);
    }, [initialView]);


    const handleNavigate = (view: string) => {
        if (view === currentView) return;

        if (view === 'quick_guide') {
            setIsQuickGuideOpen(true);
            return;
        }

        if (view === 'feedback') {
            setIsFeedbackOpen(true);
            return;
        }

        if (view === 'settings') {
            setIsSettingsOpen(true);
            return;
        }
        
        if (view !== 'discover' && view !== 'tracker' && view !== 'consult_professors' && view !== 'pricing' && view !== 'invite_earn') {
            setIsNavigating(true);
            setTimeout(() => {
                setCurrentView(view);
                setSelectedCourse(null);
                setIsNavigating(false);
            }, 60);
        } else {
            setCurrentView(view);
            setSelectedCourse(null);
        }
    };
    
    const handleSelectCourse = (course: HistoryItem) => {
        setIsNavigating(true);
        setTimeout(() => {
            setSelectedCourse(course);
            setShowWorkspaceHeader(true);
            setCurrentView('workspace');
            setIsNavigating(false);
        }, 60);
    };
    
    const handleCourseCreated = (newCourse: HistoryItem) => {
        dummyHistory.unshift(newCourse);
        setIsNavigating(true);
        setTimeout(() => {
            setSelectedCourse(newCourse);
            setShowWorkspaceHeader(false); // As requested, hide header for pasted URL courses
            setCurrentView('workspace');
            setIsNavigating(false);
        }, 60);
    };

    const renderView = () => {
        switch (currentView) {
            case 'workspace':
                return selectedCourse ? <Workspace course={selectedCourse} showHeader={showWorkspaceHeader} /> : <AddContentView onCourseCreated={handleCourseCreated} />;
            case 'history':
                return <HistoryView historyItems={dummyHistory} onSelectCourse={handleSelectCourse} />;
            case 'add_content':
                return <AddContentView onCourseCreated={handleCourseCreated} />;
            case 'add_courses':
                 return <AddCoursesView onSelectCourse={handleSelectCourse} />;
            case 'competitions':
                return <CompetitionView />;
            case 'discover':
                return <DiscoverView />;
            case 'edgram':
                return <EdgramView />;
            case 'debate':
                return <DebateView />;
            case 'tracker':
                return <TrackerView />;
            case 'consult_professors':
                return <ConsultProfessorsView />;
            case 'pricing':
                return <PricingView />;
            case 'invite_earn':
                return <InviteEarnView onContactUs={() => setIsContactUsOpen(true)} />;
            default:
                return <AddContentView onCourseCreated={handleCourseCreated} />;
        }
    };

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center h-full">
            <svg className="animate-spin h-10 w-10 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );

    return (
        <div className={`flex h-screen ${theme === 'dark' ? 'bg-[#0b0b0b]' : 'bg-white'}`}>
            <Sidebar 
                toggleTheme={toggleTheme} 
                theme={theme} 
                onNavigate={handleNavigate} 
                activeItem={currentView}
                sidebarMode={sidebarMode}
                setSidebarMode={setSidebarMode}
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
            />
            
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-4 right-8 z-20">
                    <button 
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="px-5 py-1.5 rounded-full border border-green-800 bg-green-900/20 text-green-500 hover:bg-green-900/40 hover:text-green-400 font-semibold text-sm transition-all duration-300"
                    >
                        Upgrade
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {isNavigating ? (
                        <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                           <LoadingSpinner />
                        </motion.div>
                    ) : (
                        <motion.div key={currentView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                           {renderView()}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <HawkingFab />
            </main>
            <AnimatePresence>
                {isQuickGuideOpen && <QuickGuideModal onClose={() => setIsQuickGuideOpen(false)} />}
                {isFeedbackOpen && <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />}
                {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
                {isContactUsOpen && <ContactUsSlide onClose={() => setIsContactUsOpen(false)} />}
                {isUpgradeModalOpen && (
                    <UpgradeModal 
                        onClose={() => setIsUpgradeModalOpen(false)} 
                        onNavigateToPricing={() => handleNavigate('pricing')} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;

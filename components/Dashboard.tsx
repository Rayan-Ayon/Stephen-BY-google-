
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AddContentView from './AddContentView';
import AddCoursesView from './AddCoursesView';
import CompetitionView from './CompetitionView';
import ProjectsView from './ProjectsView';
import DiscoverView from './DiscoverView';
import EdgramView from './EdgramView';
import DebateView from './DebateView';
import TrackerView from './TrackerView';
import ConsultProfessorsView from './ConsultProfessorsView';
import PricingView from './PricingView';
import HistoryView from './HistoryView';
import InviteEarnView from './InviteEarnView';
import Workspace from './Workspace';
import SettingsModal from './SettingsModal';
import FeedbackModal from './FeedbackModal';
import QuickGuideModal from './QuickGuideModal';
import ContactUsSlide from './ContactUsSlide';
import HawkingFab from './HawkingFab';
import ResearchLabView from './ResearchLabView';
import SpaceView from './SpaceView';
import { DeleteSpaceModal, ShareSpaceModal } from './modals';
import { Theme } from '../App';

export interface HistoryItem {
    id: number;
    title: string;
    description: string;
    type: string;
    time: string;
    videoUrl?: string;
    day?: number;
    totalDays?: number;
    depth?: number;
    level?: string;
    learningReason?: string;
    isStructured?: boolean;
}

interface Space {
    id: string;
    title: string;
}

interface DashboardProps {
    toggleTheme: () => void;
    theme: Theme;
    initialView: string;
}

const ShimmerLoader = () => (
    <div className="flex-1 h-full bg-[#0b0b0b] p-8 lg:p-12">
        <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-800 rounded w-1/3"></div>
                <div className="flex gap-3">
                    <div className="h-10 bg-gray-800 rounded w-24"></div>
                    <div className="h-10 bg-gray-800 rounded w-24"></div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center pt-20 space-y-6">
                <div className="h-12 bg-gray-800 rounded w-1/2"></div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-3xl">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-28 bg-gray-800 rounded-2xl"></div>
                    ))}
                </div>
                <div className="h-14 bg-gray-800 rounded-2xl w-full max-w-3xl"></div>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ toggleTheme, theme, initialView }) => {
    const [currentView, setCurrentView] = useState(initialView);
    const [selectedCourse, setSelectedCourse] = useState<HistoryItem | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [sidebarMode, setSidebarMode] = useState<'hover' | 'manual'>('hover');
    
    // Modals state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isQuickGuideOpen, setIsQuickGuideOpen] = useState(false);
    const [isContactUsOpen, setIsContactUsOpen] = useState(false);

    // State for AddCourses flow context persistence
    const [addCoursesContext, setAddCoursesContext] = useState({ flow: 'landing', topic: '' });
    
    // State for Debate flow context
    const [debateInitialMessage, setDebateInitialMessage] = useState('');

    // Spaces State
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [isCreatingSpace, setIsCreatingSpace] = useState(false);
    const [deleteSpaceId, setDeleteSpaceId] = useState<string | null>(null);
    const [shareSpaceId, setShareSpaceId] = useState<string | null>(null);

    // Mock History Items
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
        {
            id: 1,
            title: "Generative AI Essentials",
            description: "Master the fundamentals of generative AI models and applications.",
            type: "video",
            time: "2 hours ago",
            videoUrl: "https://www.youtube.com/embed/g_IaVepNDT4",
            isStructured: false
        },
        {
            id: 2,
            title: "Advanced React Patterns",
            description: "Deep dive into component composition and state management.",
            type: "article",
            time: "Yesterday",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            isStructured: false
        }
    ]);

    useEffect(() => {
        if (initialView) {
            setCurrentView(initialView);
        }
    }, [initialView]);

    const handleNavigate = (view: string, data?: any) => {
        if (view === 'settings') {
            setIsSettingsOpen(true);
        } else if (view === 'feedback') {
            setIsFeedbackOpen(true);
        } else if (view === 'quick_guide') {
            setIsQuickGuideOpen(true);
        } else if (view === 'contact_us') {
             setIsContactUsOpen(true);
        } else {
            // Handle data passing for specific views
            if (view === 'add_courses' && data?.topic) {
                setAddCoursesContext({ flow: 'qa', topic: data.topic });
            }
            if (view === 'debate') {
                if (data?.initialMessage) {
                    setDebateInitialMessage(data.initialMessage);
                } else {
                    setDebateInitialMessage('');
                }
            }

            setCurrentView(view);
            setSelectedCourse(null);
        }
    };

    const handleSelectCourse = (course: HistoryItem) => {
        setSelectedCourse(course);
        // Add to history if not present
        if (!historyItems.find(i => i.id === course.id)) {
            setHistoryItems([course, ...historyItems]);
        }
    };

    const handleCourseCreated = (course: HistoryItem) => {
        setHistoryItems([course, ...historyItems]);
        handleSelectCourse(course);
    };

    const handleCreateSpace = () => {
        setIsCreatingSpace(true);
        // Simulate creation delay and shimmer effect
        setTimeout(() => {
            const newId = (spaces.length + 1).toString();
            const newSpace = { id: newId, title: `Untitled Space (${newId})` };
            setSpaces(prev => [...prev, newSpace]);
            setIsCreatingSpace(false);
            setCurrentView(`space_${newId}`);
        }, 1500);
    };

    const handleRenameSpace = (id: string, newTitle: string) => {
        setSpaces(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    };

    const handleDeleteSpace = () => {
        if (deleteSpaceId) {
            setSpaces(prev => prev.filter(s => s.id !== deleteSpaceId));
            if (currentView === `space_${deleteSpaceId}`) {
                setCurrentView('add_content'); // Fallback view
            }
            setDeleteSpaceId(null);
        }
    };

    const renderContent = () => {
        if (selectedCourse) {
            return <Workspace course={selectedCourse} showHeader={false} onBack={() => setSelectedCourse(null)} />;
        }

        if (isCreatingSpace) {
            return <ShimmerLoader />;
        }

        if (currentView.startsWith('space_')) {
            const spaceId = currentView.split('_')[1];
            const space = spaces.find(s => s.id === spaceId);
            if (space) {
                return <SpaceView space={space} />;
            } else {
                // If space doesn't exist (e.g. deleted), show fallback
                return <div className="flex items-center justify-center h-full text-gray-500">Space not found</div>;
            }
        }

        switch (currentView) {
            case 'add_content':
                return <AddContentView onCourseCreated={handleCourseCreated} />;
            case 'add_courses':
                 return (
                    <AddCoursesView 
                        onSelectCourse={(c) => handleSelectCourse({...c, isStructured: true})} 
                        context={addCoursesContext}
                        setContext={setAddCoursesContext}
                    />
                 );
            case 'competitions': return <CompetitionView />;
            case 'projects': return <ProjectsView onNavigate={handleNavigate} />;
            case 'discover': return <DiscoverView />;
            case 'edgram': return <EdgramView />;
            case 'debate': return <DebateView initialMessage={debateInitialMessage} />;
            case 'tracker': return <TrackerView />;
            case 'consult_professors': return <ConsultProfessorsView />;
            case 'pricing': return <PricingView />;
            case 'history': return <HistoryView historyItems={historyItems} onSelectCourse={handleSelectCourse} />;
            case 'invite_earn': return <InviteEarnView onContactUs={() => setIsContactUsOpen(true)} />;
            case 'research_lab': return <ResearchLabView />;
            case 'create_space': return <div className="flex items-center justify-center h-full text-gray-500">Create Space Coming Soon</div>; // Fallback if navigated via other means, though sidebar handles logic
            case 'learning_methods': return <div className="flex items-center justify-center h-full text-gray-500">Learning Methods Coming Soon</div>;
            case 'chrome_extension': return <div className="flex items-center justify-center h-full text-gray-500">Chrome Extension Coming Soon</div>;
            default:
                return <AddContentView onCourseCreated={handleCourseCreated} />;
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">
            <Sidebar 
                toggleTheme={toggleTheme} 
                theme={theme} 
                onNavigate={(view) => handleNavigate(view)} 
                activeItem={currentView}
                sidebarMode={sidebarMode}
                setSidebarMode={setSidebarMode}
                isExpanded={isSidebarExpanded}
                setIsExpanded={setIsSidebarExpanded}
                spaces={spaces}
                onCreateSpace={handleCreateSpace}
                onRenameSpace={handleRenameSpace}
                onDeleteSpace={(id) => setDeleteSpaceId(id)}
                onShareSpace={(id) => setShareSpaceId(id)}
            />
            
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {renderContent()}
                <HawkingFab onNavigate={handleNavigate} />
            </main>

            {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
            {isFeedbackOpen && <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />}
            {isQuickGuideOpen && <QuickGuideModal onClose={() => setIsQuickGuideOpen(false)} />}
            {isContactUsOpen && <ContactUsSlide onClose={() => setIsContactUsOpen(false)} />}
            
            {deleteSpaceId && (
                <DeleteSpaceModal 
                    spaceName={spaces.find(s => s.id === deleteSpaceId)?.title || 'Space'} 
                    onClose={() => setDeleteSpaceId(null)} 
                    onDelete={handleDeleteSpace} 
                />
            )}
            
            {shareSpaceId && (
                <ShareSpaceModal onClose={() => setShareSpaceId(null)} />
            )}
        </div>
    );
};

export default Dashboard;

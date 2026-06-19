
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
    thumbnailUrl?: string;
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
    onExit: () => void;
    userEmail: string;
    spaceCode: string;
    onLogout: () => void;
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

const isInstitutionalSpace = (code: string): boolean => {
    return !!code && code !== 'Personal Sandbox';
};

const Dashboard: React.FC<DashboardProps> = ({ toggleTheme, theme, initialView, onExit, userEmail, spaceCode, onLogout }) => {
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

    // Recent Videos State (persisted to localStorage)
    const [recentVideos, setRecentVideos] = useState<HistoryItem[]>(() => {
        const saved = localStorage.getItem('stephen_recent_videos');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist recentVideos to localStorage
    useEffect(() => {
        localStorage.setItem('stephen_recent_videos', JSON.stringify(recentVideos));
    }, [recentVideos]);

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
        if (view === 'landing') {
            onExit();
            return;
        }

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

    const extractYouTubeId = (url: string): string => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : '';
    };

    const handleCourseCreated = (course: HistoryItem) => {
        setHistoryItems([course, ...historyItems]);
        
        // Add to recent videos if it's a video type - dedupe by YouTube video ID
        if (course.type === 'video' && course.videoUrl) {
            const videoId = extractYouTubeId(course.videoUrl);
            setRecentVideos(prev => {
                const filtered = prev.filter(v => extractYouTubeId(v.videoUrl) !== videoId);
                return [course, ...filtered].slice(0, 20);
            });
        }
        
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
                if (isInstitutionalSpace(spaceCode)) {
                    return (
                        <div className="flex-1 h-full bg-[#0b0b0b] p-8 lg:p-12 overflow-y-auto">
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to {spaceCode} Workspace</h1>
                                    <p className="text-gray-400 text-sm">Your institutional learning environment</p>
                                </div>

                                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 flex items-start gap-4">
                                    <div className="shrink-0 mt-0.5">
                                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-amber-200 text-sm font-medium">You are currently viewing materials assigned by your institution.</p>
                                        <p className="text-amber-400/60 text-xs mt-1">Content is curated and managed by your {spaceCode} administrators.</p>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-white mb-4">Assigned Content</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {recentVideos.length > 0 ? (
                                            recentVideos.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleSelectCourse(item)}
                                                    className="group cursor-pointer rounded-2xl bg-[#141414] border border-neutral-800 p-5 hover:border-neutral-600 transition-all"
                                                >
                                                    <h3 className="text-white font-medium text-sm mb-1 group-hover:text-amber-300 transition-colors">{item.title}</h3>
                                                    <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <span className="text-[10px] uppercase tracking-wider text-gray-600 bg-neutral-800 px-2 py-0.5 rounded-full">{item.type}</span>
                                                        <span className="text-[10px] text-gray-600">{item.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-16 text-gray-600">
                                                <p className="text-sm">No content has been assigned yet.</p>
                                                <p className="text-xs mt-1 text-gray-700">Check back later for updates from your institution.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                return <AddContentView onCourseCreated={handleCourseCreated} recentVideos={recentVideos} onSelectRecent={handleSelectCourse} />;
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
                return <AddContentView onCourseCreated={handleCourseCreated} recentVideos={recentVideos} onSelectRecent={handleSelectCourse} />;
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
                userEmail={userEmail}
                onLogout={onLogout}
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

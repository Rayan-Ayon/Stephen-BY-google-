
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardView from './DashboardView';
import WorkspaceOverview from './WorkspaceOverview';
import RightSidebar from './RightSidebar';
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
import ProfileView from './ProfileView';
import ProfileWorkspace from './ProfileWorkspace';
import Workspace from './Workspace';
import SettingsModal from './SettingsModal';
import FeedbackModal from './FeedbackModal';
import QuickGuideModal from './QuickGuideModal';
import ContactUsSlide from './ContactUsSlide';
import HawkingFab from './HawkingFab';
import ResearchLabView from './ResearchLabView';
import LearningMethods1View from './LearningMethods1View';
import LeaderboardView from './LeaderboardView';
import StreaksView from './StreaksView';
import AISpeakingPartnerView from './AISpeakingPartnerView';
import AIIELTSChatbotView from './AIIELTSChatbotView';
import AIRewriterView from './AIRewriterView';
import FreeContentLibraryView from './FreeContentLibraryView';
import StudyPlanView from './StudyPlanView';
import SpaceView from './SpaceView';
import IndividualSandboxView from './IndividualSandboxView';
import EnterpriseSandboxView from './EnterpriseSandboxView';
import IELTSEvaluationHub from './enterprise/IELTSEvaluationHub';
import ReadingHubView from './ReadingHubView';
import WritingHubView from './WritingHubView';
import ListeningHubView from './ListeningHubView';
import SpeakingHubView from './SpeakingHubView';
import FullMockTestHub from './FullMockTestHub';
import PartPracticeHub from './PartPracticeHub';
import SpeakUIRestore from './SpeakUIRestore';
import { DORMANT_NAV_ENABLED, DORMANT_NAV_KEYS } from './dormantNav';
import SpacedRepetitionEngine from './enterprise/srs/SpacedRepetitionEngine';
import StudentPortal from './enterprise/portal/StudentPortal';
import { DeleteSpaceModal, ShareSpaceModal } from './modals';
import { Theme } from '../App';
import { useWorkspace } from '../workspaceContext';
import WorkspaceDropdown from './WorkspaceDropdown';
import {
  initMockDb,
  getSpaces,
  addSpace,
  updateSpace,
  deleteSpace,
  type Space,
} from '../utils/mockDb';

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

interface DashboardProps {
    toggleTheme: () => void;
    theme: Theme;
    initialView: string;
    onExit: () => void;
    userEmail: string;
    userId?: string;
    spaceCode: string;
    onLogout: () => void;
}

const ShimmerLoader = () => (
    <div className="flex-1 h-full bg-canvas p-8 lg:p-12">
        <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center">
                <div className="h-8 bg-surface rounded w-1/3"></div>
                <div className="flex gap-3">
                    <div className="h-10 bg-surface rounded w-24"></div>
                    <div className="h-10 bg-surface rounded w-24"></div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center pt-20 space-y-6">
                <div className="h-12 bg-surface rounded w-1/2"></div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-3xl">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-28 bg-surface rounded-2xl"></div>
                    ))}
                </div>
                <div className="h-14 bg-surface rounded-2xl w-full max-w-3xl"></div>
            </div>
        </div>
    </div>
);

const isInstitutionalSpace = (code: string): boolean => {
    return !!code && code !== 'Personal Sandbox';
};

const Dashboard: React.FC<DashboardProps> = ({ toggleTheme, theme, initialView, onExit, userEmail, userId, spaceCode, onLogout }) => {
    const { activeWorkspace } = useWorkspace();
    const isEnterprise = activeWorkspace.type === 'enterprise';
    const [currentView, setCurrentView] = useState(() => initialView === 'add_content' ? 'sandbox' : initialView);
    const [selectedCourse, setSelectedCourse] = useState<HistoryItem | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [sidebarMode, setSidebarMode] = useState<'hover' | 'manual'>('hover');

    // Modals state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isQuickGuideOpen, setIsQuickGuideOpen] = useState(false);
    const [isContactUsOpen, setIsContactUsOpen] = useState(false);

    // Exam navigation lock state
    const [isExamActive, setIsExamActive] = useState(false);
    const [exitPulse, setExitPulse] = useState(false);
    const handleLockedNav = () => {
        setExitPulse(true);
        setTimeout(() => setExitPulse(false), 1500);
    };

    // State for AddCourses flow context persistence
    const [addCoursesContext, setAddCoursesContext] = useState({ flow: 'landing', topic: '' });
    
    // State for Debate flow context
    const [debateInitialMessage, setDebateInitialMessage] = useState('');

    // Spaces State
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [isCreatingSpace, setIsCreatingSpace] = useState(false);
    const [deleteSpaceId, setDeleteSpaceId] = useState<string | null>(null);
    const [shareSpaceId, setShareSpaceId] = useState<string | null>(null);

    // Recent Videos State
    const [recentVideos, setRecentVideos] = useState<HistoryItem[]>([]);

    useEffect(() => {
        if (!userEmail || isEnterprise) return;
        localStorage.setItem(`recents_${userEmail}`, JSON.stringify(recentVideos));
    }, [recentVideos, userEmail, isEnterprise]);

    useEffect(() => {
        if (!userEmail || isEnterprise) return;
        setRecentVideos([]);
        const storageKey = `recents_${userEmail}`;
        const cached = localStorage.getItem(storageKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setRecentVideos(parsed);
                }
            } catch { /* ignore corrupt cache */ }
        }
        const controller = new AbortController();
        fetch(`/api/user/recent-videos?userEmail=${encodeURIComponent(userEmail)}`, {
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    const mapped: HistoryItem[] = data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description || '',
                        type: item.contentType || 'video',
                        time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
                        videoUrl: item.videoUrl || '',
                        thumbnailUrl: item.thumbnailUrl || '',
                        isStructured: false,
                    }));
                    setRecentVideos(mapped);
                }
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.warn('Failed to fetch recent videos from server, using localStorage:', err);
                }
            });
        return () => controller.abort();
    }, [userEmail, isEnterprise]);

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
        initMockDb();
        const stored = getSpaces();
        if (stored.length > 0) {
            setSpaces(stored);
        }
    }, []);

    useEffect(() => {
        if (initialView && initialView !== 'add_content') {
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
        if (course.type === 'video' && course.videoUrl) {
            const videoId = extractYouTubeId(course.videoUrl);
            setRecentVideos(prev => {
                const filtered = prev.filter(v => extractYouTubeId(v.videoUrl) !== videoId);
                return [course, ...filtered].slice(0, 20);
            });
            if (userEmail) {
                fetch('/api/user/recent-video', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        videoId,
                        title: course.title,
                        description: course.description || '',
                        videoUrl: course.videoUrl,
                        thumbnailUrl: course.thumbnailUrl || '',
                        contentType: course.type,
                        userEmail,
                    }),
                }).catch((err) => console.warn('Failed to sync recent video to server:', err));
            }
        }
        handleSelectCourse(course);
    };

    const handleCreateSpace = () => {
        setIsCreatingSpace(true);
        setTimeout(() => {
            const newId = `space_${Date.now()}`;
            const newSpace: Space = { id: newId, title: `Untitled Space (${spaces.length + 1})` };
            addSpace(newSpace);
            setSpaces(prev => [...prev, newSpace]);
            setIsCreatingSpace(false);
            setCurrentView(`space_${newId}`);
        }, 1500);
    };

    const handleRenameSpace = (id: string, newTitle: string) => {
        updateSpace(id, { title: newTitle });
        setSpaces(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    };

    const handleDeleteSpace = () => {
        if (deleteSpaceId) {
            deleteSpace(deleteSpaceId);
            setSpaces(prev => prev.filter(s => s.id !== deleteSpaceId));
            if (currentView === `space_${deleteSpaceId}`) {
                setCurrentView('add_content');
            }
            setDeleteSpaceId(null);
        }
    };

    const isDashboardView = currentView === 'sandbox';

    const renderContent = () => {
        if (selectedCourse) {
            return <Workspace course={selectedCourse} showHeader={false} onBack={() => setSelectedCourse(null)} userEmail={userEmail} />;
        }

        if (isCreatingSpace) {
            return <ShimmerLoader />;
        }

        if (currentView.startsWith('space_')) {
            if (isEnterprise) {
                return (
                    <div className="flex-1 h-full bg-canvas p-8 lg:p-12 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-sm text-gray-400">Spaces are private to your Personal Sandbox.</p>
                            <p className="text-xs text-gray-600 mt-1">Switch back to your individual workspace to access them.</p>
                        </div>
                    </div>
                );
            }
            const spaceId = currentView.slice('space_'.length);
            const space = spaces.find(s => s.id === spaceId) || spaces[0];
            if (space) {
                return <SpaceView space={space} />;
            } else {
                return <div className="flex items-center justify-center h-full text-gray-500">Space not found</div>;
            }
        }

        if (DORMANT_NAV_ENABLED && DORMANT_NAV_KEYS.has(currentView)) {
            return <AddContentView onCourseCreated={handleCourseCreated} recentVideos={isEnterprise ? [] : recentVideos} onSelectRecent={handleSelectCourse} />;
        }

        switch (currentView) {
            case 'sandbox': return isEnterprise
                ? (
                    <div className="flex gap-6 w-full min-h-screen bg-[#0E0F12] p-6">
                        <div className="flex-[7] min-w-0">
                            <DashboardView userEmail={userEmail} onNavigate={handleNavigate} />
                        </div>
                        <div className="flex-[3] min-w-0">
                            <RightSidebar onNavigate={handleNavigate} />
                        </div>
                    </div>
                )
                : <WorkspaceOverview userEmail={userEmail} onNavigate={handleNavigate} />;
            case 'ielts_dashboard': return <IELTSEvaluationHub key="ielts_dashboard" userEmail={userEmail} onExamStateChange={setIsExamActive} exitPulse={exitPulse} onLockedNavigationAttempt={handleLockedNav} initialView="dashboard" hideInternalNav />;
            case 'speaking_studio': return <SpeakingHubView userEmail={userEmail} />;
            case 'listening_engine': return <ListeningHubView userEmail={userEmail} />;
            case 'reading_hub': return <ReadingHubView userEmail={userEmail} />;
            case 'writing_lab':
            case 'task2_checker':
            case 'task1_academic':
            case 'task1_general':
            case 'writing_lab_overview':
                return <WritingHubView userEmail={userEmail} />;
            case 'full_cambridge_mock':
            case 'full_mock_test':
            case 'mock_tests':
                return <FullMockTestHub userEmail={userEmail} onNavigate={(viewKey) => setCurrentView(viewKey)} />;
            case 'part_practice': return <PartPracticeHub userEmail={userEmail} />;
            case 'speak_ui_restore': return <SpeakUIRestore userEmail={userEmail} />;
            case 'ielts_evaluation': return <IELTSEvaluationHub userEmail={userEmail} onExamStateChange={setIsExamActive} exitPulse={exitPulse} onLockedNavigationAttempt={handleLockedNav} />;
            case 'my_reports': return <IELTSEvaluationHub key="my_reports" userEmail={userEmail} onExamStateChange={setIsExamActive} exitPulse={exitPulse} onLockedNavigationAttempt={handleLockedNav} initialView="dashboard" hideInternalNav />;
            case 'leaderboard': return <LeaderboardView userEmail={userEmail} />;
            case 'streaks': return <StreaksView userEmail={userEmail} />;
            case 'ai_speaking_partner': return <AISpeakingPartnerView userEmail={userEmail} />;
            case 'ai_rewriter': return <AIRewriterView userEmail={userEmail} />;
            case 'ai_ielts_chatbot': return <AIIELTSChatbotView userEmail={userEmail} />;
            case 'free_content_library': return <FreeContentLibraryView userEmail={userEmail} />;
            case 'study_plan': return <StudyPlanView userEmail={userEmail} />;
            case 'spaced_repetition': return <SpacedRepetitionEngine />;
            case 'student_portal': return <StudentPortal />;
            case 'add_content':
                if (isInstitutionalSpace(spaceCode)) {
                    return (
                        <div className="flex-1 h-full bg-canvas p-8 lg:p-12 overflow-y-auto">
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to {spaceCode} Workspace</h1>
                                    <p className="text-gray-400 text-sm">Your institutional learning environment</p>
                                </div>
                                <div className="rounded-2xl bg-warning/10 border border-warning/30 p-5 flex items-start gap-4">
                                    <div className="shrink-0 mt-0.5">
                                        <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-warning text-sm font-medium">You are currently viewing materials assigned by your institution.</p>
                                        <p className="text-warning/60 text-xs mt-1">Content is curated and managed by your {spaceCode} administrators.</p>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white mb-4">Assigned Content</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {isEnterprise ? [] : recentVideos.length > 0 ? (
                                            recentVideos.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleSelectCourse(item)}
                                                    className="group cursor-pointer rounded-2xl bg-surface border border-border p-5 hover:border-gray-600 transition-all"
                                                >
                                                    <h3 className="text-white font-medium text-sm mb-1 group-hover:text-warning transition-colors">{item.title}</h3>
                                                    <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <span className="text-[10px] uppercase tracking-wider text-gray-600 bg-surfaceAlt px-2 py-0.5 rounded-full">{item.type}</span>
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
                return <AddContentView onCourseCreated={handleCourseCreated} recentVideos={isEnterprise ? [] : recentVideos} onSelectRecent={handleSelectCourse} />;
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
            case 'discover': return <DiscoverView email={userEmail} workspaceScopeId={isEnterprise ? activeWorkspace.id : undefined} />;
            case 'edgram': return <EdgramView />;
            case 'debate': return <DebateView initialMessage={debateInitialMessage} />;
            case 'tracker': return <TrackerView />;
            case 'consult_professors': return <ConsultProfessorsView />;
            case 'pricing': return <PricingView />;
            case 'history': return <HistoryView historyItems={isEnterprise ? [] : historyItems} onSelectCourse={handleSelectCourse} />;
            case 'invite_earn': return <InviteEarnView onContactUs={() => setIsContactUsOpen(true)} />;
            case 'research_lab': return <ResearchLabView />;
            case 'profile': return <ProfileWorkspace />;
            case 'profile_workspace': return <ProfileWorkspace />;
            case 'create_space': return <div className="flex items-center justify-center h-full text-gray-500">Create Space Coming Soon</div>;
            case 'learning_methods_1': return <LearningMethods1View />;
            case 'chrome_extension': return <div className="flex items-center justify-center h-full text-gray-500">Chrome Extension Coming Soon</div>;
            default:
                return <DashboardView userEmail={userEmail} onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-canvas">
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
                isEnterprise={isEnterprise}
                isExamActive={isExamActive}
                onLockedNavigationAttempt={handleLockedNav}
            />
            
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header with WorkspaceDropdown */}
                <div className="h-16 shrink-0 border-b border-border bg-canvas flex items-center px-6 gap-4">
                    <WorkspaceDropdown theme={theme} isExpanded={true} />
                    <div className="flex-1" />
                </div>

                {/* Content Area */}
                <div className="flex-1 flex min-h-0 overflow-hidden">
                    {/* Left Column (~68%) */}
                    <div className="flex-[7] min-w-0 overflow-y-auto">
                        {renderContent()}
                    </div>

                    {/* Right Sidebar (~32%) — Dashboard Only */}
                    {isDashboardView && !isEnterprise && (
                        <div className="flex-[3] border-l border-border overflow-y-auto bg-canvas">
                            <RightSidebar onNavigate={handleNavigate} />
                        </div>
                    )}
                </div>
            </main>

            <HawkingFab onNavigate={handleNavigate} />
            
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

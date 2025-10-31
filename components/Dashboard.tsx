import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Workspace from './Workspace';
import HistoryView from './HistoryView';
import AddContentView from './AddContentView';
import AddCoursesView from './AddCoursesView';
import CompetitionView from './CompetitionView';
import DiscoverView from './DiscoverView';
import EdgramView from './EdgramView';
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
}

const Dashboard: React.FC<DashboardProps> = ({ toggleTheme, theme }) => {
    const [currentView, setCurrentView] = useState('add_content');
    const [selectedCourse, setSelectedCourse] = useState<HistoryItem | null>(null);
    const [showWorkspaceHeader, setShowWorkspaceHeader] = useState(true);

    const handleNavigate = (view: string) => {
        setCurrentView(view);
        setSelectedCourse(null);
    };
    
    const handleSelectCourse = (course: HistoryItem) => {
        setSelectedCourse(course);
        setShowWorkspaceHeader(true);
        setCurrentView('workspace');
    };
    
    const handleCourseCreated = (newCourse: HistoryItem) => {
        dummyHistory.unshift(newCourse);
        setSelectedCourse(newCourse);
        setShowWorkspaceHeader(false); // As requested, hide header for pasted URL courses
        setCurrentView('workspace');
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
            default:
                return <AddContentView onCourseCreated={handleCourseCreated} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#0d0d0d]">
            <Sidebar toggleTheme={toggleTheme} theme={theme} onNavigate={handleNavigate} activeItem={currentView} />
            <main className="flex-1 flex flex-col overflow-hidden">
                {renderView()}
            </main>
        </div>
    );
};

export default Dashboard;
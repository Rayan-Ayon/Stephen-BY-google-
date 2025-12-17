import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HistoryItem } from './Dashboard';
import LandingView from './course_creation/LandingView';
import QAView from './course_creation/QAView';
import ReasoningView from './course_creation/ReasoningView';
import RoadmapView from './course_creation/RoadmapView';

const initialCourses = [
    {
        title: "Organic Chemistry",
        level: "Basic",
        depth: 20,
        duration: "7 Days",
        completed: 70,
    },
    {
        title: "Data Science",
        level: "Intermediate",
        depth: 50,
        duration: "20 Days",
        completed: 50,
    },
    {
        title: "Rocket Physics",
        level: "Advanced",
        depth: 70,
        duration: "2 Months",
        completed: 90,
    }
];


const AddCoursesView: React.FC<{ onSelectCourse: (course: HistoryItem) => void }> = ({ onSelectCourse }) => {
    const [flowState, setFlowState] = useState('landing'); // landing, qa, reasoning, roadmap
    const [courses, setCourses] = useState(initialCourses);
    const [topic, setTopic] = useState('');

    const handleStartFlow = (userTopic: string) => {
        setTopic(userTopic);
        setFlowState('qa');
    };

    const handleQAFinish = () => {
        setFlowState('reasoning');
    };

    const handleReasoningFinish = () => {
        setFlowState('roadmap');
    };

    const handleBackToLanding = () => {
        const newCourse = {
            title: "Machine Learning",
            level: "Basic",
            depth: 20, // Based on dummy answers
            duration: "7 Days",
            completed: 0,
        };
        setCourses(prev => [
            {...prev[0], title: "Organic Chemistry"}, // Ensure first title is correct
            ...prev.slice(1),
            newCourse
        ]);
        setFlowState('landing');
    };

    const renderContent = () => {
        switch(flowState) {
            case 'qa':
                return <QAView key="qa" topic={topic} onFinish={handleQAFinish} />;
            case 'reasoning':
                return <ReasoningView key="reasoning" topic={topic} onFinish={handleReasoningFinish} />;
            case 'roadmap':
                return <RoadmapView key="roadmap" onBack={handleBackToLanding} />;
            case 'landing':
            default:
                 return <LandingView key="landing" onSelectCourse={onSelectCourse} courses={courses} onStartFlow={handleStartFlow} />;
        }
    }
    
    return (
        <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={flowState}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col items-center justify-center"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AddCoursesView;
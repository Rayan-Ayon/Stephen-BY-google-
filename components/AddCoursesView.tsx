
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HistoryItem } from './Dashboard';
import LandingView from './course_creation/LandingView';
import QAView from './course_creation/QAView';
import ReasoningView from './course_creation/ReasoningView';
import RoadmapView from './course_creation/RoadmapView';

const initialCourses = [
    {
        org: "Google",
        title: "Foundations: Data, Data, Everywhere",
        level: "Course",
        depth: 20,
        duration: "7 Days",
        completed: 6,
        estimatedDate: "Dec 19, 2025",
        nextStep: {
            title: "Evaluate your current data analytics skills",
            type: "Reading",
            duration: "4 minutes"
        }
    },
    {
        org: "University of Colorado System",
        title: "Foundation and Potential of AI in Healthcare",
        level: "Course",
        depth: 50,
        duration: "20 Days",
        completed: 15,
        estimatedDate: "Dec 8, 2025",
        nextStep: {
            title: "AI Evolution",
            type: "Video",
            duration: "5 minutes"
        }
    },
    {
        org: "IBM",
        title: "Gen AI Foundational Models for NLP & Language Understanding",
        level: "Course",
        depth: 70,
        duration: "2 Months",
        completed: 0,
        estimatedDate: "Nov 28, 2025",
        nextStep: {
            title: "Course Introduction",
            type: "Video",
            duration: "2 minutes"
        }
    },
    {
        org: "IBM",
        title: "Generative AI Advance Fine-Tuning for LLMs",
        level: "Course",
        depth: 70,
        duration: "3 Months",
        completed: 0,
        estimatedDate: "Dec 3, 2025",
        nextStep: {
            title: "Course Introduction",
            type: "Video",
            duration: "3 minutes"
        }
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
            org: "Stephen AI",
            title: topic || "New Course",
            level: "Course",
            depth: 20,
            duration: "7 Days",
            completed: 0,
            estimatedDate: "Jan 25, 2026",
            nextStep: {
                title: "Introduction to Topic",
                type: "Reading",
                duration: "5 minutes"
            }
        };
        setCourses(prev => [newCourse, ...prev]);
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
        <div className="flex-1 flex flex-col p-4 lg:p-12 overflow-y-auto h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={flowState}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AddCoursesView;

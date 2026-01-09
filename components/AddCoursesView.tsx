
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HistoryItem } from './Dashboard';
import LandingView from './course_creation/LandingView';
import QAView from './course_creation/QAView';
import ReasoningView from './course_creation/ReasoningView';
import CourseOutlineView from './course_creation/CourseOutlineView';

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

interface AddCoursesViewProps {
    onSelectCourse: (course: HistoryItem) => void;
    context: { flow: string; topic: string };
    setContext: React.Dispatch<React.SetStateAction<{ flow: string; topic: string }>>;
}

const AddCoursesView: React.FC<AddCoursesViewProps> = ({ onSelectCourse, context, setContext }) => {
    // We use the context passed from Dashboard to control flow state
    // Default fallback if context is empty/fresh is handled by Dashboard initial state ('landing')
    
    const [courses, setCourses] = useState(initialCourses);

    const handleStartFlow = (userTopic: string) => {
        setContext({ flow: 'qa', topic: userTopic });
    };

    const handleQAFinish = () => {
        setContext(prev => ({ ...prev, flow: 'reasoning' }));
    };

    const handleReasoningFinish = () => {
        setContext(prev => ({ ...prev, flow: 'roadmap' }));
    };

    const handleBackToLanding = () => {
        // When going back from Roadmap (outline) to Landing
        // We might want to create a "draft" course or just reset.
        // For simplicity, we create a new course entry in the list and go to landing.
        if (context.topic) {
            const newCourse = {
                org: "Stephen AI",
                title: context.topic,
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
        }
        setContext({ flow: 'landing', topic: '' });
    };

    const handleEnterWorkspace = () => {
        // Entering from Roadmap/Outline
        // We DO NOT change the context flow here. We want to stay on 'roadmap' 
        // so if user clicks 'Back' in workspace, they return to the roadmap.
        const selected: HistoryItem = {
            id: Date.now(),
            title: context.topic || "Foundations: Data, Data, Everywhere",
            description: "Master the foundations of data analytics with this comprehensive course.",
            type: 'video',
            time: 'Just now',
            videoUrl: 'https://www.youtube.com/embed/g_IaVepNDT4',
            day: 1, totalDays: 30, depth: 20, level: 'Beginner', learningReason: 'Mastering analytics',
            isStructured: true
        };
        onSelectCourse(selected);
    };

    const handlePreviewCourse = (course: any) => {
        setContext({ flow: 'roadmap', topic: course.title });
    };

    // Logic for Resume button on Landing Page
    const handleResumeCourse = (course: any) => {
        // Entering from Landing Page (Resume)
        // We keep the context flow as 'landing' (or explicit 'landing') 
        // so if user clicks 'Back' in workspace, they return to landing.
        
        // Ensure state is landing
        setContext({ flow: 'landing', topic: '' }); 
        
        const selected: HistoryItem = {
            id: Date.now(),
            title: course.title,
            description: "Resuming course...",
            type: 'video',
            time: 'Just now',
            videoUrl: 'https://www.youtube.com/embed/g_IaVepNDT4',
            day: 1, totalDays: 30, depth: 20, level: 'Beginner', learningReason: 'Resuming',
            isStructured: true
        };
        onSelectCourse(selected);
    };

    const renderContent = () => {
        switch(context.flow) {
            case 'qa':
                return <QAView key="qa" topic={context.topic} onFinish={handleQAFinish} />;
            case 'reasoning':
                return <ReasoningView key="reasoning" topic={context.topic} onFinish={handleReasoningFinish} />;
            case 'roadmap':
                return (
                    <CourseOutlineView 
                        key="roadmap" 
                        onBack={handleBackToLanding} 
                        topic={context.topic} 
                        onStartLearning={handleEnterWorkspace}
                    />
                );
            case 'landing':
            default:
                 return (
                    <LandingView 
                        key="landing" 
                        onSelectCourse={(item) => onSelectCourse({...item, isStructured: true})} // Fallback for unstructured items if any
                        onPreviewCourse={handlePreviewCourse}
                        courses={courses} 
                        onStartFlow={handleStartFlow}
                    />
                 );
        }
    }
    
    // We need to pass a specific handler to LandingView for the Resume button 
    // since LandingView's current onResume calls onSelectCourse directly with dummy data.
    // We'll interception LandingView's onSelectCourse for the "Resume" action by modifying LandingView 
    // OR we just use the `onSelectCourse` passed to `LandingView` but wrapped.
    // In LandingView.tsx: `onResume={() => handleSelectDummyCourse(course)}`.
    // `handleSelectDummyCourse` calls `onSelectCourse`.
    // So we wrap the `onSelectCourse` prop passed to LandingView.

    const wrappedOnSelectForLanding = (item: HistoryItem) => {
        // This is called when a "Resume" or dummy item is clicked in LandingView
        // We ensure context is landing
        setContext({ flow: 'landing', topic: '' });
        onSelectCourse({...item, isStructured: true});
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            <AnimatePresence mode="wait">
                <motion.div
                    key={context.flow}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full flex flex-col"
                >
                    {context.flow === 'landing' ? (
                         <LandingView 
                            key="landing" 
                            onSelectCourse={wrappedOnSelectForLanding}
                            onPreviewCourse={handlePreviewCourse}
                            courses={courses} 
                            onStartFlow={handleStartFlow} 
                        />
                    ) : renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AddCoursesView;

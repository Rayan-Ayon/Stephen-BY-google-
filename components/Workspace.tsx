import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TutorPanel from './TutorPanel';
import { ChevronDownIcon } from './icons';
import { HistoryItem } from './Dashboard';

interface WorkspaceProps {
    course: HistoryItem;
    showHeader: boolean;
}

const CourseHeader: React.FC<{ course: HistoryItem }> = ({ course }) => {
    const chipStyle = "flex items-center px-3 py-1.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm cursor-pointer hover:bg-gray-800 transition-colors";

    return (
        <header className="flex items-center space-x-3 p-4 border-b border-gray-800 shrink-0">
            <div className={chipStyle} style={{ fontFamily: "'Lora', serif" }}>
                {course.title}
            </div>
            <div className={chipStyle}>Day {course.day} of {course.totalDays}</div>
            <div className={chipStyle}>{course.depth}% ({course.level})</div>
            <div className={`${chipStyle} group relative`}>
                Why learning?
                <ChevronDownIcon className="w-4 h-4 ml-1 text-gray-500 group-hover:text-white" />
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#1f1f1f] border border-gray-700 rounded-lg p-3 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
                    {course.learningReason}
                </div>
            </div>
        </header>
    );
};

const VideoPlayer: React.FC<{ course: HistoryItem }> = ({ course }) => {
    const [activeTab, setActiveTab] = useState('Chapters');
    
    return (
        <div className="flex flex-col h-full bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800">
            <div className="aspect-video bg-black flex-shrink-0">
                <iframe
                    className="w-full h-full"
                    src={course.videoUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center border-b border-gray-700">
                    <button onClick={() => setActiveTab('Chapters')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'Chapters' ? 'text-white border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>Chapters</button>
                    <button onClick={() => setActiveTab('Transcripts')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'Transcripts' ? 'text-white border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>Transcripts</button>
                </div>
                <div className="prose prose-invert prose-sm py-4 flex-grow overflow-y-auto">
                    <h3 style={{ fontFamily: "'Lora', serif" }}>Introduction to {course.title}</h3>
                    <p>{course.description}</p>
                </div>
            </div>
        </div>
    );
}

const Workspace: React.FC<WorkspaceProps> = ({ course, showHeader }) => {
    const [isPanelExpanded, setIsPanelExpanded] = useState(false);

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden stephen-bg">
            {showHeader && <CourseHeader course={course} />}
            <div className="flex-1 flex p-4 lg:p-6 gap-6 overflow-hidden">
                <motion.div
                    className="h-full flex-1"
                    layout
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <VideoPlayer course={course} />
                </motion.div>
                <TutorPanel isPanelExpanded={isPanelExpanded} setIsPanelExpanded={setIsPanelExpanded} />
            </div>
        </div>
    );
};

export default Workspace;
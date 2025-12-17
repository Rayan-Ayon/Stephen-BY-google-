import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HistoryItem } from '../Dashboard';
import { ChevronDownIcon, SendIcon } from '../icons';

type Course = {
    title: string;
    level: string;
    depth: number;
    duration: string;
    completed: number;
};

interface LandingViewProps {
    onSelectCourse: (course: HistoryItem) => void;
    courses: Course[];
    onStartFlow: (topic: string) => void;
}


const CourseCard = ({ course }: { course: Course }) => {
    return (
        <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-2xl p-6 transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/5 h-full flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4" style={{ fontFamily: "'Lora', serif" }}>{course.title}</h3>
            <div className="space-y-3 text-sm flex-grow">
                <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span className="font-medium dark:text-gray-200 text-neutral-700">{course.level}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Depth:</span>
                    <span className="font-medium dark:text-gray-200 text-neutral-700">{course.depth}%</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-medium dark:text-gray-200 text-neutral-700">{course.duration}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400">Completed:</span>
                    <span className="font-medium dark:text-gray-200 text-neutral-700">{course.completed}%</span>
                </div>
            </div>
            <div className="mt-4">
                <div className="w-full dark:bg-gray-700 bg-neutral-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                        style={{ width: `${course.completed}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};


const LandingView: React.FC<LandingViewProps> = ({ onSelectCourse, courses, onStartFlow }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSelectDummyCourse = (course: Course) => {
        const parseDuration = (duration: string): number => {
            const parts = duration.split(' ');
            if (parts.length < 2) return 0;
            const value = parseInt(parts[0], 10);
            if (isNaN(value)) return 0;
            
            if (parts[1].toLowerCase().startsWith('month')) return value * 30;
            return value;
        };

        const totalDays = parseDuration(course.duration);

        const newCourse: HistoryItem = {
            id: Math.floor(Math.random() * 10000),
            title: course.title,
            description: `A generated course for ${course.title} at a ${course.level} level.`,
            type: 'video',
            time: 'Existing Course',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            day: Math.floor(totalDays * (course.completed / 100)),
            totalDays: totalDays,
            depth: course.depth,
            level: course.level,
            learningReason: `To achieve a ${course.level} understanding of ${course.title}. This course was pre-generated.`
        };
        onSelectCourse(newCourse);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            onStartFlow(inputValue);
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center">
                 <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-8" style={{ fontFamily: "'Lora', serif" }}>
                    Which course are you looking for?
                </h1>
                <div className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Write about your desired course..."
                        className="w-full dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl py-4 pl-5 pr-16 text-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                     <button 
                        onClick={() => inputValue.trim() && onStartFlow(inputValue)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                        disabled={!inputValue.trim()}
                    >
                        <SendIcon className="w-5 h-5 -rotate-45" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-16 mb-6">
                 <h2 className="text-3xl font-bold text-black dark:text-white" style={{ fontFamily: "'Lora', serif" }}>Your Courses</h2>
                 <button className="flex items-center text-sm dark:text-gray-300 text-neutral-600 hover:text-white dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 px-4 py-2 rounded-lg">
                     Recent
                     <ChevronDownIcon className="w-4 h-4 ml-2" />
                 </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                     <motion.div
                        key={index}
                        onClick={() => handleSelectDummyCourse(course)}
                        className="cursor-pointer"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CourseCard course={course} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default LandingView;
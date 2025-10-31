import React from 'react';
import { motion } from 'framer-motion';
import { HistoryItem } from './Dashboard';
import { ChevronDownIcon, SendIcon } from './icons';

const dummyCourses = [
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

const CourseCard = ({ course }: { course: typeof dummyCourses[0] }) => {
    return (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/5 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "'Lora', serif" }}>{course.title}</h3>
            <div className="space-y-3 text-sm flex-grow">
                <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span className="font-medium text-gray-200">{course.level}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Depth:</span>
                    <span className="font-medium text-gray-200">{course.depth}%</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-medium text-gray-200">{course.duration}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400">Completed:</span>
                    <span className="font-medium text-gray-200">{course.completed}%</span>
                </div>
            </div>
            <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-green-400 to-teal-500 h-2 rounded-full"
                        style={{ width: `${course.completed}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};


const AddCoursesView: React.FC<{ onSelectCourse: (course: HistoryItem) => void }> = ({ onSelectCourse }) => {
    
    const handleSelectDummyCourse = (course: typeof dummyCourses[0]) => {
        // Simple duration parser to convert strings like "7 Days" or "2 Months" to days
        const parseDuration = (duration: string): number => {
            const parts = duration.split(' ');
            if (parts.length < 2) return 0;
            const value = parseInt(parts[0], 10);
            if (isNaN(value)) return 0;
            
            if (parts[1].toLowerCase().startsWith('month')) {
                return value * 30;
            }
            return value; // Assume days
        };

        const totalDays = parseDuration(course.duration);

        const newCourse: HistoryItem = {
            id: Math.floor(Math.random() * 10000),
            title: course.title,
            description: `A generated course for ${course.title} at a ${course.level} level.`,
            type: 'video',
            time: 'Existing Course',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Generic placeholder video
            day: Math.floor(totalDays * (course.completed / 100)),
            totalDays: totalDays,
            depth: course.depth,
            level: course.level,
            learningReason: `To achieve a ${course.level} understanding of ${course.title}. This course was pre-generated.`
        };
        onSelectCourse(newCourse);
    };

    return (
        <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto stephen-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl mx-auto"
            >
                <div className="text-center">
                     <h1 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: "'Lora', serif" }}>
                        Which course are you looking for?
                    </h1>
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Write about your desired course..."
                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-4 pl-5 pr-16 text-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                         <button className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                            <SendIcon className="w-5 h-5 -rotate-45" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-12 mb-6">
                     <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>Your Courses</h2>
                     <button className="flex items-center text-sm text-gray-300 hover:text-white bg-[#1a1a1a] border border-gray-800 px-4 py-2 rounded-lg">
                         Recent
                         <ChevronDownIcon className="w-4 h-4 ml-2" />
                     </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dummyCourses.map((course, index) => (
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

            </motion.div>
        </div>
    );
};

export default AddCoursesView;
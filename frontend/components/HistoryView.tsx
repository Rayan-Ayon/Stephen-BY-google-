import React from 'react';
import { motion } from 'framer-motion';
import { HistoryItem } from './Dashboard';
import { VideoCameraIcon, BookOpenIcon } from './icons';

interface HistoryViewProps {
    historyItems: HistoryItem[];
    onSelectCourse: (course: HistoryItem) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ historyItems, onSelectCourse }) => {
    return (
        <div className="p-8 h-full">
            <div>
                <h1 className="text-3xl font-bold dark:text-white text-black mb-2" style={{ fontFamily: "'Lora', serif" }}>
                    Welcome Back
                </h1>
                <p className="dark:text-gray-400 text-neutral-500 mb-8">Select a recent item to continue your learning journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {historyItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => onSelectCourse(item)}
                        className="dark:bg-[#1a1a1a] bg-white rounded-xl border dark:border-gray-800 border-neutral-200 p-5 cursor-pointer hover:border-orange-500 hover:scale-[1.02] transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 dark:bg-gray-700 bg-neutral-100 rounded-full">
                                {item.type === 'video' ? <VideoCameraIcon className="w-5 h-5 text-orange-500" /> : <BookOpenIcon className="w-5 h-5 text-orange-500" />}
                            </div>
                             <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                        <h3 className="font-semibold dark:text-white text-black mb-2 group-hover:text-orange-500 transition-colors">{item.title}</h3>
                        <p className="text-sm dark:text-gray-400 text-neutral-500 line-clamp-2">{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HistoryView;
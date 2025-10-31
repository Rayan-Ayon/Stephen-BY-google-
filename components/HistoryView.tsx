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
        <div className="p-8 h-full stephen-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Lora', serif" }}>
                    Welcome Back
                </h1>
                <p className="text-gray-400 mb-8">Select a recent item to continue your learning journey.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {historyItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        onClick={() => onSelectCourse(item)}
                        className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-5 cursor-pointer hover:border-green-500 hover:scale-[1.02] transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-gray-700 rounded-full">
                                {item.type === 'video' ? <VideoCameraIcon className="w-5 h-5 text-green-400" /> : <BookOpenIcon className="w-5 h-5 text-green-400" />}
                            </div>
                             <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                        <h3 className="font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HistoryView;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem } from './Dashboard';
import { PasteUrlModal } from './modals';
import { UploadIcon, LinkIcon, MicIcon, ArrowUpIcon, PlusIcon, ClockIcon, ChevronDownIcon, CubeIcon } from './icons';

interface AddContentViewProps {
  onCourseCreated: (course: HistoryItem) => void;
}

const AddContentView: React.FC<AddContentViewProps> = ({ onCourseCreated }) => {
    const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

    const ActionButton = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
        <button
            onClick={() => title === 'Paste' && setIsPasteModalOpen(true)}
            className="flex items-center text-left p-4 bg-[#1a1a1a] border border-gray-800 rounded-xl hover:bg-gray-800 hover:border-gray-700 transition-all duration-300"
        >
            <div className="mr-4 text-gray-400">
                {icon}
            </div>
            <div>
                <p className="font-semibold text-white">{title}</p>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
        </button>
    );

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-8 lg:p-12 overflow-y-auto stephen-bg">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl"
            >
                <h1 className="text-3xl font-bold text-white mb-6 text-center" style={{ fontFamily: "'Lora', serif" }}>
                    What do you want to learn?
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <ActionButton icon={<UploadIcon className="w-6 h-6" />} title="Upload" subtitle="File, audio, video" />
                    <ActionButton icon={<LinkIcon className="w-6 h-6" />} title="Paste" subtitle="YouTube, website, text" />
                    <ActionButton icon={<MicIcon className="w-6 h-6" />} title="Record" subtitle="Record class, video call" />
                </div>
                
                <div className="relative mb-12">
                    <input
                        type="text"
                        placeholder="Learn anything"
                        className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3.5 pl-5 pr-14 text-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                    <button className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                        <ArrowUpIcon className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <div className="flex items-center justify-between mb-4">
                     <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>My Spaces</h2>
                     <button className="flex items-center text-sm text-gray-400 hover:text-white bg-[#1a1a1a] border border-gray-800 px-3 py-1.5 rounded-lg">
                         <ClockIcon className="w-4 h-4 mr-2" />
                         Newest
                         <ChevronDownIcon className="w-4 h-4 ml-1" />
                     </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex flex-col items-center justify-center p-6 bg-[#1a1a1a] border-2 border-dashed border-gray-800 rounded-xl hover:border-gray-700 hover:bg-gray-800/50 transition-all text-gray-500 hover:text-white">
                        <PlusIcon className="w-6 h-6 mb-2" />
                        <span className="font-semibold">Create Space</span>
                    </button>
                    <div className="flex flex-col p-6 bg-[#1a1a1a] border border-gray-800 rounded-xl">
                        <CubeIcon className="w-6 h-6 mb-4 text-gray-400" />
                        <p className="font-semibold text-white">my space</p>
                        <p className="text-sm text-gray-500">0 content</p>
                    </div>
                </div>
            </motion.div>
            
            <AnimatePresence>
                {isPasteModalOpen && (
                    <PasteUrlModal 
                        onClose={() => setIsPasteModalOpen(false)}
                        onCourseCreated={onCourseCreated}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddContentView;

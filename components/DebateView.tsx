import React from 'react';
import { motion } from 'framer-motion';
import { SendIcon, LinkIcon } from './icons';

const DebateSidebar: React.FC = () => (
    <aside className="w-72 bg-[#131313] border-r border-gray-800/50 p-6 flex flex-col shrink-0">
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Lora', serif" }}>Debate</h1>
        <p className="text-sm text-gray-400 mb-8">Place where you can debate with the Hawking in any topics.</p>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recents</h2>
        <nav className="flex flex-col space-y-2">
            <button className="text-left text-sm text-gray-300 p-2 rounded-md hover:bg-gray-800">Is earth a planet or not?</button>
            <button className="text-left text-sm text-gray-300 p-2 rounded-md hover:bg-gray-800">Does the sun circle the earth?</button>
        </nav>
    </aside>
);

const DebateView: React.FC = () => {
    return (
        <div className="flex-1 flex h-full overflow-hidden stephen-bg">
            <DebateSidebar />
            <motion.div 
                className="flex-1 flex flex-col items-center justify-center p-8 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center">
                    <h2 className="text-4xl text-white font-semibold" style={{ fontFamily: "'Lora', serif" }}>In which topic are you want to debate?</h2>
                </div>
                <div className="absolute bottom-8 w-full max-w-3xl">
                    <div className="relative">
                        <textarea
                            placeholder="Debate with comparative Hawking."
                            rows={1}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl py-3 pl-5 pr-28 text-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none overflow-hidden"
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                            }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                            <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors" aria-label="Attach file">
                                <LinkIcon className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg bg-gray-200 text-black hover:bg-white transition-colors" aria-label="Send message">
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DebateView;

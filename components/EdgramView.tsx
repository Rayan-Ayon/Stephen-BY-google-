import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SettingsIcon, CubeIcon, UsersIcon, BookmarkIcon, HeartIcon, MessageCircleIcon } from './icons';

const EdgramView = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const posts = Array(12).fill(0);

    const TabButton = ({ name, label, icon, active, onClick }: { name: string, label: string, icon: React.ReactElement, active: boolean, onClick: (name: string) => void }) => (
        <button
            onClick={() => onClick(name)}
            className={`flex items-center justify-center w-full sm:w-auto sm:px-4 py-3 text-sm font-semibold border-t-2 transition-colors ${
                active ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-white'
            }`}
        >
            {React.cloneElement(icon, { className: "w-4 h-4 mr-2"})}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    const PostGridItem = ({ index }: { index: number }) => (
        <>
            <img src={`https://picsum.photos/seed/${index+30}/500/500`} alt="Post content" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                <div className="flex items-center gap-1 font-bold">
                    <HeartIcon className="w-5 h-5" />
                    <span>{Math.floor(Math.random() * 2000)}</span>
                </div>
                <div className="flex items-center gap-1 font-bold">
                    <MessageCircleIcon className="w-5 h-5" />
                    <span>{Math.floor(Math.random() * 100)}</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto stephen-bg items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl">
                {/* Profile Header */}
                <header className="flex mb-8 md:mb-12 px-2">
                    <div className="w-24 h-24 sm:w-36 sm:h-36 shrink-0 mr-6 sm:mr-10 md:mr-20">
                        <div className="w-full h-full bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                            <h2 className="text-2xl text-white font-light">stephen_ai</h2>
                            <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                                <button className="px-4 py-1.5 text-sm font-semibold bg-gray-700 rounded-lg hover:bg-gray-600 w-full sm:w-auto">Edit Profile</button>
                                <button className="px-4 py-1.5 text-sm font-semibold bg-gray-700 rounded-lg hover:bg-gray-600 w-full sm:w-auto">View Archive</button>
                            </div>
                             <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"><SettingsIcon className="w-5 h-5"/></button>
                        </div>

                        <div className="hidden md:flex items-center gap-8 mb-4">
                            <div><span className="font-bold text-white">102</span> <span className="text-gray-400">posts</span></div>
                            <div><span className="font-bold text-white">5.1k</span> <span className="text-gray-400">connections</span></div>
                        </div>
                        
                        <div>
                            <p className="font-semibold text-white">Stephen AI</p>
                            <p className="text-gray-300 text-sm">
                                Your personal AI learning companion. 🚀<br/>
                                Turning any content into interactive courses.
                            </p>
                            <a href="#" className="text-sm text-blue-400 font-semibold hover:underline">stephen.ai</a>
                        </div>
                    </div>
                </header>
                
                {/* Stats for mobile */}
                <div className="md:hidden flex items-center justify-around text-center border-y border-gray-800 py-3 mb-4">
                    <div><span className="font-bold text-white block">102</span> <span className="text-gray-400 text-sm">posts</span></div>
                    <div><span className="font-bold text-white block">5.1k</span> <span className="text-gray-400 text-sm">connections</span></div>
                </div>

                {/* Feed Tabs */}
                <div className="border-t border-gray-800 flex justify-center gap-4 sm:gap-12 -mt-px">
                    <TabButton name="posts" label="POSTS" icon={<CubeIcon />} active={activeTab === 'posts'} onClick={setActiveTab} />
                    <TabButton name="saved" label="SAVED" icon={<BookmarkIcon />} active={activeTab === 'saved'} onClick={setActiveTab} />
                    <TabButton name="tagged" label="TAGGED" icon={<UsersIcon />} active={activeTab === 'tagged'} onClick={setActiveTab} />
                </div>

                {/* Feed Grid */}
                <div className="mt-1">
                    <AnimatePresence>
                    {activeTab === 'posts' && (
                        <motion.div 
                            key="posts"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-3 gap-1"
                        >
                            {posts.map((_, index) => (
                                // FIX: Wrapped PostGridItem in motion.div and moved animation props here to resolve key prop error.
                                <motion.div
                                    key={index}
                                    className="relative aspect-square group cursor-pointer"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <PostGridItem index={index} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                    {(activeTab === 'saved' || activeTab === 'tagged') && (
                         <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-20 text-gray-500"
                         >
                            <h3 className="text-2xl font-bold text-white mb-2" style={{fontFamily: "'Lora', serif"}}>Nothing to see here yet</h3>
                            <p>Posts will appear here once they are available.</p>
                         </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default EdgramView;
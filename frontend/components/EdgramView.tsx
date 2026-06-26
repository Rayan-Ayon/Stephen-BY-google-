
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SettingsIcon, ReelsIcon, UsersIcon, BookmarkIcon, HeartIcon, MessageCircleIcon,
    FacebookIcon, TiktokIcon, InstagramIcon, YoutubeIcon, HomeIcon, CompassIcon,
    SendIcon, PlusSquareIcon, DotsHorizontalIcon, EdgramIcon, PencilIcon, SearchIcon,
    ChevronDownIcon, LayersIcon, XIcon
} from './icons';
import EdgramHome from './edgram/EdgramHome';
import ContentDNA from './edgram/ContentDNA';
import EdgramProfile from './edgram/EdgramProfile';
import EdgramMessages from './edgram/EdgramMessages';
import { FeedConfig } from './edgram/types';

const socialIcons = [FacebookIcon, TiktokIcon, InstagramIcon, YoutubeIcon];

// --- Sub-Components kept inline (not extracted) ---

const ExploreView = () => {
    const posts = Array(21).fill(0);
    return (
        <div className="w-full max-w-6xl mx-auto py-4 px-4 pt-20 dark:text-white text-black">
            <div className="relative mb-6">
                <input type="text" placeholder="Search" className="w-full dark:bg-[#262626] bg-neutral-200 rounded-lg py-2 pl-10 pr-4 text-sm dark:text-white text-black focus:outline-none placeholder-gray-500" />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
            <div className="grid grid-cols-3 gap-1">
                {posts.map((_, index) => {
                    const RandomSocialIcon = socialIcons[index % socialIcons.length];
                    return (
                        <motion.div
                            key={index}
                            className="relative aspect-[9/16] group cursor-pointer dark:bg-gray-800 bg-neutral-200 overflow-hidden"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            whileHover={{ zIndex: 10 }}
                        >
                            <img src={`https://picsum.photos/seed/${index + 100}/500/800`} alt="Explore content" className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black/30 p-1 rounded-full backdrop-blur-sm">
                                <RandomSocialIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute top-2 right-2 bg-black/30 p-1 rounded-full backdrop-blur-sm">
                                <ReelsIcon className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                                <div className="flex items-center gap-1 font-bold">
                                    <HeartIcon className="w-6 h-6 fill-white" />
                                    <span>{Math.floor(Math.random() * 2000)}</span>
                                </div>
                                <div className="flex items-center gap-1 font-bold">
                                    <MessageCircleIcon className="w-6 h-6 fill-white" />
                                    <span>{Math.floor(Math.random() * 100)}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

const NotificationsView = () => {
    const notifications = {
        'This Week': [
            { id: 1, type: 'like', user: 'learner_3', time: '2d', postImage: `https://picsum.photos/seed/31/50/50`, message: 'liked your reel.' },
            { id: 2, type: 'follow', user: 'learner_5', time: '4d', message: 'started following you.' },
        ],
        'This Month': [
            { id: 3, type: 'like', user: 'learner_8', time: '2w', postImage: `https://picsum.photos/seed/32/50/50`, message: 'liked your story.' },
            { id: 4, type: 'like', user: 'learner_2', time: '3w', postImage: `https://picsum.photos/seed/33/50/50`, message: 'commented: "Great work!"' },
            { id: 5, type: 'follow', user: 'design_guru', time: '3w', message: 'started following you.' },
        ]
    };

    return (
        <div className="max-w-2xl mx-auto py-8 pt-16 px-4 w-full h-full dark:bg-black bg-white overflow-y-auto transition-colors duration-300 dark:text-white text-black">
            <h1 className="text-2xl font-bold dark:text-white text-black mb-6">Notifications</h1>
            {Object.entries(notifications).map(([period, items]) => (
                <div key={period} className="mb-6">
                    <h2 className="text-md font-bold dark:text-white text-black mb-4 border-b dark:border-gray-800 border-neutral-200 pb-2">{period}</h2>
                    {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 mb-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#121212] transition-colors cursor-pointer">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="w-11 h-11 rounded-full dark:bg-gray-800 bg-neutral-300 shrink-0 overflow-hidden border dark:border-gray-800 border-gray-200">
                                    <img src={`https://picsum.photos/seed/${item.id + 800}/100/100`} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-sm pr-2">
                                    <p className="dark:text-white text-black leading-snug">
                                        <span className="font-bold mr-1">{item.user}</span>
                                        {item.message}
                                        <span className="text-gray-500 text-xs ml-1.5">{item.time}</span>
                                    </p>
                                </div>
                            </div>
                            {item.postImage ? (
                                <div className="w-11 h-11 dark:bg-gray-800 bg-neutral-200 rounded-md overflow-hidden shrink-0 ml-2 border dark:border-gray-800 border-gray-200">
                                    <img src={item.postImage} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <button className={`px-4 py-1.5 text-sm font-semibold rounded-lg shrink-0 ml-2 ${item.type === 'follow' ? 'bg-[#0095f6] hover:bg-[#1877f2] text-white' : 'dark:bg-gray-800 bg-gray-200 dark:text-white text-black dark:hover:bg-gray-700 hover:bg-gray-300'}`}>
                                    {item.type === 'follow' ? 'Follow' : 'Reply'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex-1 flex items-center justify-center text-center text-gray-500 h-full dark:bg-black bg-white transition-colors duration-300 pt-16">
        <div>
            <h2 className="text-3xl font-bold dark:text-white text-black mb-2" style={{ fontFamily: "'Lora', serif" }}>{title}</h2>
            <p>This section is under construction.</p>
        </div>
    </div>
);

// --- Main Edgram View ---

const EdgramView = () => {
    const [activeView, setActiveView] = useState('home');
    const [feedConfig, setFeedConfig] = useState<FeedConfig>({ discovery: 30, video: 70, education: 80 });

    const navItems = [
        { key: 'home', label: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
        { key: 'explore', label: 'Explore', icon: <CompassIcon className="w-6 h-6" /> },
        { key: 'content', label: 'Content', icon: <LayersIcon className="w-6 h-6" /> },
        { key: 'messages', label: 'Messages', icon: <MessageCircleIcon className="w-6 h-6" /> },
        { key: 'notifications', label: 'Notifications', icon: <HeartIcon className="w-6 h-6" /> },
        { key: 'create', label: 'Create', icon: <PlusSquareIcon className="w-6 h-6" /> },
        { key: 'profile', label: 'Profile', icon: <div className="w-6 h-6 rounded-full dark:bg-gray-600 bg-neutral-400 overflow-hidden border dark:border-gray-600 border-gray-300"><img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=2823&auto=format&fit=crop" className="w-full h-full object-cover" /></div> },
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'home': return <EdgramHome feedConfig={feedConfig} />;
            case 'explore': return <ExploreView />;
            case 'content': return <ContentDNA feedConfig={feedConfig} onFeedConfigChange={setFeedConfig} />;
            case 'profile': return <EdgramProfile />;
            case 'messages': return <EdgramMessages />;
            case 'notifications': return <NotificationsView />;
            case 'create': return <PlaceholderView title="Create Post" />;
            default: return <EdgramHome feedConfig={feedConfig} />;
        }
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden dark:bg-black bg-white transition-colors duration-300 dark:text-white text-black">
            {/* Edgram Navigation */}
            <nav className="w-16 lg:w-64 dark:bg-black bg-white border-r dark:border-gray-800 border-neutral-200 pt-24 pb-3 px-3 flex flex-col items-center lg:items-start shrink-0 transition-colors duration-300">
                <div className="text-2xl font-bold dark:text-white text-black hidden lg:block py-6 px-4 mb-2" style={{ fontFamily: "'Lora', serif" }}>Edgram</div>
                <div className="w-10 h-10 lg:hidden flex items-center justify-center mb-4 mt-4">
                    <EdgramIcon className="w-8 h-8 dark:text-white text-black" />
                </div>

                <div className="flex flex-col space-y-2 w-full">
                    {navItems.map(item => (
                        <button
                            key={item.key}
                            onClick={() => setActiveView(item.key)}
                            className={`flex items-center p-3 rounded-full lg:rounded-lg transition-all duration-200 group ${activeView === item.key ? 'font-bold' : ''} hover:bg-gray-100 dark:hover:bg-[#121212]`}
                        >
                            <div className={`group-hover:scale-110 transition-transform duration-200 dark:text-white text-black`}>
                                {item.icon}
                            </div>
                            <span className={`ml-4 dark:text-white text-black hidden lg:block ${activeView === item.key ? 'font-bold' : 'font-normal'}`}>{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-auto w-full">
                    <button className="flex items-center p-3 rounded-full lg:rounded-lg transition-all duration-200 group hover:bg-gray-100 dark:hover:bg-[#121212] w-full">
                        <div className="group-hover:scale-110 transition-transform duration-200 dark:text-white text-black">
                            <SettingsIcon className="w-6 h-6" />
                        </div>
                        <span className="ml-4 dark:text-white text-black hidden lg:block">Settings</span>
                    </button>
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default EdgramView;

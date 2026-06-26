
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircleIcon, ChevronDownIcon, PencilIcon,
    XIcon, LightningIcon, FireIcon, PlayIcon
} from '../icons';

const EdgramMessages = () => {
    const [selectedChat, setSelectedChat] = useState(1);
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);

    const chats = [
        { id: 1, name: 'learner_3', lastMessage: 'Sounds good! 👍', time: '2h', active: true, isGroup: false },
        { id: 2, name: 'learner_5', lastMessage: 'See you then.', time: '1d', active: false, isGroup: false },
        { id: 3, name: 'study_group', lastMessage: 'Alice: Are we still on for 3pm?', time: '3d', active: false, isGroup: true },
        { id: 4, name: 'prof_smith', lastMessage: 'Please review the attached notes.', time: '4d', active: false, isGroup: false },
        { id: 5, name: 'design_enthusiast', lastMessage: 'Love your recent project!', time: '1w', active: false, isGroup: false },
    ];

    const selectedChatData = chats.find(c => c.id === selectedChat);
    const isGroup = selectedChatData?.isGroup || false;

    return (
        <div className="flex h-full dark:bg-black bg-white dark:text-white text-black">
            {/* Left Panel — Chat List */}
            <div className={`${isGroup && isWorkspaceOpen ? 'w-24 md:w-72' : 'w-24 md:w-96'} border-r dark:border-gray-800 border-neutral-200 flex flex-col shrink-0 dark:bg-black bg-white transition-all duration-300`}>
                <div className="flex items-center justify-center md:justify-between p-4 border-b dark:border-gray-800 border-neutral-200 shrink-0 h-16 md:h-20 pt-16 md:pt-4">
                    <h2 className="text-xl font-bold dark:text-white text-black hidden md:flex items-center cursor-pointer">
                        stephen_ai <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </h2>
                    <button className="hover:opacity-70"><PencilIcon className="w-6 h-6 dark:text-white text-black" /></button>
                </div>
                <div className="p-2 md:p-4 overflow-y-auto hidden md:flex space-x-4 overflow-x-auto no-scrollbar mb-2">
                    {['Your Note', 'learner_3', 'learner_5'].map((name, i) => (
                        <div key={i} className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer">
                            <div className="w-16 h-16 rounded-full dark:bg-gray-800 bg-gray-200 relative overflow-hidden border dark:border-gray-700 border-gray-300">
                                <img src={`https://picsum.photos/seed/${i + 600}/100/100`} className="w-full h-full object-cover opacity-80" />
                                {i === 0 && <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-gray-500 font-semibold bg-white/50 dark:bg-black/50 backdrop-blur-[1px]">Note</div>}
                            </div>
                            <span className="text-xs text-gray-500 w-16 text-center truncate dark:text-gray-400">{i === 0 ? 'Your Note' : name}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between px-4 pb-2 hidden md:flex">
                    <h3 className="font-bold dark:text-white text-black">Messages</h3>
                    <button className="text-sm text-gray-500 font-semibold hover:text-gray-800 dark:hover:text-gray-300">Requests</button>
                </div>

                <div className="flex-grow overflow-y-auto">
                    {chats.map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`w-full flex items-center p-3 md:p-4 text-left transition-colors ${
                                selectedChat === chat.id
                                    ? 'dark:bg-[#262626] bg-gray-100'
                                    : 'dark:hover:bg-[#121212] hover:bg-gray-50'
                            }`}
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full dark:bg-gray-800 bg-neutral-300 mr-0 md:mr-3 shrink-0 overflow-hidden relative">
                                <img src={`https://picsum.photos/seed/${chat.id + 600}/100/100`} className="w-full h-full object-cover" />
                                {chat.active && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 dark:border-black border-white rounded-full"></div>}
                            </div>
                            <div className="flex-grow overflow-hidden hidden md:block">
                                <p className={`text-sm font-medium dark:text-white text-black`}>{chat.name}</p>
                                <div className={`flex items-baseline text-sm ${selectedChat === chat.id ? 'dark:text-gray-300 text-gray-700' : 'text-gray-500'}`}>
                                    <p className="truncate mr-1 max-w-[140px]">{chat.lastMessage}</p>
                                    <span className="shrink-0 text-xs">• {chat.time}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Panel — Chat View + Workspace */}
            <div className="flex-1 flex">
                {/* Chat Messages Area */}
                <div className="flex-1 flex flex-col dark:bg-black bg-white transition-colors duration-300">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800 border-neutral-200 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full dark:bg-gray-800 bg-neutral-300 overflow-hidden">
                                        <img src={`https://picsum.photos/seed/${selectedChat + 600}/100/100`} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm dark:text-white text-black">{selectedChatData?.name}</p>
                                        <p className="text-xs text-gray-500">{selectedChatData?.active ? 'Active now' : 'Offline'}</p>
                                    </div>
                                </div>
                                {isGroup && (
                                    <button
                                        onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                                        className="p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-100 transition-colors"
                                    >
                                        <LightningIcon className="w-5 h-5 text-amber-400" />
                                    </button>
                                )}
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 flex items-center justify-center text-gray-500 p-8">
                                <div className="text-center">
                                    <div className="border-2 dark:border-white border-black rounded-full p-6 inline-block mb-4">
                                        <MessageCircleIcon className="w-16 h-16 dark:text-white text-black" />
                                    </div>
                                    <h3 className="text-2xl dark:text-white text-black font-medium">{selectedChatData?.name}</h3>
                                    <p className="text-gray-500 mt-2 text-sm">Send private photos and messages to a friend or group.</p>
                                    <button className="mt-6 px-5 py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg text-sm transition-colors">Send Message</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center dark:bg-black bg-white p-8">
                            <div className="border-2 dark:border-white border-black rounded-full p-6 inline-block mb-4">
                                <MessageCircleIcon className="w-16 h-16 dark:text-white text-black" />
                            </div>
                            <h3 className="text-2xl dark:text-white text-black font-medium">Your Messages</h3>
                            <p className="text-gray-500 mt-2 text-sm">Send private photos and messages to a friend or group.</p>
                            <button className="mt-6 px-5 py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg text-sm transition-colors">Send Message</button>
                        </div>
                    )}
                </div>

                {/* Collapsible Workspace Panel (Group Chat Only) */}
                <AnimatePresence>
                    {isGroup && isWorkspaceOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-l dark:border-gray-800 border-neutral-200 dark:bg-[#0a0a0a] bg-gray-50 overflow-hidden shrink-0"
                        >
                            <div className="w-[280px] h-full p-4 overflow-y-auto">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-sm dark:text-white text-black">Workspace</h3>
                                    <button onClick={() => setIsWorkspaceOpen(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <XIcon className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>

                                {/* Level-Up Progress */}
                                <div className="mb-6 p-4 rounded-xl dark:bg-[#121212] bg-white border dark:border-gray-800 border-gray-200">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                                        <LightningIcon className="w-3.5 h-3.5 text-amber-400" /> Level-Up Progress
                                    </h4>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="dark:text-white text-black font-bold">Lv 4 → Lv 5</span>
                                        <span className="text-xs text-gray-500">64%</span>
                                    </div>
                                    <div className="w-full h-2 dark:bg-gray-800 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: '64%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">2 more peer reviews to level up</p>
                                </div>

                                {/* Daily Bug Count Tracker */}
                                <div className="mb-6 p-4 rounded-xl dark:bg-[#121212] bg-white border dark:border-gray-800 border-gray-200">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                                        <FireIcon className="w-3.5 h-3.5 text-red-400" /> Daily Bug Tracker
                                    </h4>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold dark:text-white text-black">3</div>
                                        <p className="text-xs text-gray-500 mt-1">bugs squashed today</p>
                                    </div>
                                    <div className="flex justify-center gap-1.5 mt-3">
                                        {[true, true, true, false, false].map((done, i) => (
                                            <div key={i} className={`w-3 h-3 rounded-full ${done ? 'bg-green-500' : 'dark:bg-gray-700 bg-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-500 text-center mt-2">Goal: 5 bugs / day</p>
                                </div>

                                {/* Code Terminal Shortcut */}
                                <button className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 hover:border-purple-500/40 transition-colors text-left group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-purple-500/20">
                                            <PlayIcon className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">Launch Code Terminal</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Shared collaborative session</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EdgramMessages;

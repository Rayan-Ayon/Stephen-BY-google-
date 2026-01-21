
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SettingsIcon, ReelsIcon, UsersIcon, BookmarkIcon, HeartIcon, MessageCircleIcon, 
    FacebookIcon, TiktokIcon, InstagramIcon, YoutubeIcon, HomeIcon, CompassIcon,
    SendIcon, PlusSquareIcon, DotsHorizontalIcon, EdgramIcon, PencilIcon, SearchIcon,
    ChevronDownIcon, LayersIcon, XIcon
} from './icons';

const socialIcons = [FacebookIcon, TiktokIcon, InstagramIcon, YoutubeIcon];

// --- Sub-Components for Edgram ---

const ContentView = () => {
    return (
        <div className="max-w-2xl mx-auto py-8 pt-16 px-4 w-full h-full dark:bg-black bg-white overflow-y-auto transition-colors duration-300 dark:text-white text-black custom-scrollbar">
            <h1 className="text-2xl font-bold mb-2">Content DNA</h1>
            <p className="text-gray-500 text-sm mb-8">Control what you see and how our algorithms understand you.</p>

            {/* Algorithm Confidence Score */}
            <div className="mb-8 p-6 rounded-2xl dark:bg-[#121212] bg-gray-50 border dark:border-gray-800 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Algorithm Accuracy</h3>
                    <span className="text-green-500 font-bold">85% Match</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Based on your last 30 days of activity.</p>
            </div>

            {/* Topic Bubbles */}
            <div className="mb-8">
                <h3 className="font-bold mb-4">Active Interests</h3>
                <div className="flex flex-wrap gap-2">
                    {['AI Research', 'Quantum Computing', 'Digital Art', 'UX Design', 'Space Exploration'].map(topic => (
                        <div key={topic} className="px-3 py-1.5 rounded-full border dark:border-gray-700 border-gray-300 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                            {topic}
                            <XIcon className="w-3 h-3 text-gray-500" />
                        </div>
                    ))}
                    <button className="px-3 py-1.5 rounded-full border border-dashed dark:border-gray-600 border-gray-400 text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors">+ Add Topic</button>
                </div>
            </div>

            {/* Sliders */}
            <div className="mb-8 space-y-6">
                <h3 className="font-bold">Feed Composition</h3>
                
                <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-300">
                        <span>Discovery</span>
                        <span>Familiar</span>
                    </div>
                    <input type="range" className="w-full accent-blue-500" defaultValue={30} />
                </div>
                 <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-300">
                        <span>Video</span>
                        <span>Reading</span>
                    </div>
                    <input type="range" className="w-full accent-purple-500" defaultValue={70} />
                </div>
                 <div>
                    <div className="flex justify-between text-sm mb-2 text-gray-600 dark:text-gray-300">
                        <span>Education</span>
                        <span>Entertainment</span>
                    </div>
                    <input type="range" className="w-full accent-orange-500" defaultValue={80} />
                </div>
            </div>

            {/* Value Check */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-purple-900 text-white">
                <h3 className="font-bold text-lg mb-2">Real Value Meter</h3>
                <p className="text-sm opacity-80 mb-4">You've consumed 14 hours of high-value educational content this week.</p>
                <div className="flex gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold">14h</div>
                        <div className="text-xs opacity-70">Learning</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">2h</div>
                        <div className="text-xs opacity-70">Entertainment</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProfileView = () => {
    const [activeTab, setActiveTab] = useState('reels');
    const posts = Array(12).fill(0);

    const TabButton = ({ name, label, icon, active, onClick }: { name: string, label: string, icon: React.ReactElement<any>, active: boolean, onClick: (name: string) => void }) => (
        <button
            onClick={() => onClick(name)}
            className={`flex items-center justify-center w-full sm:w-auto sm:px-4 py-3 text-sm font-semibold border-t-2 transition-colors ${
                active ? 'dark:border-white border-black dark:text-white text-black' : 'border-transparent text-gray-500 dark:hover:text-white hover:text-black'
            }`}
        >
            {React.cloneElement(icon, { className: "w-4 h-4 mr-2"})}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    const ReelGridItem = ({ index }: { index: number }) => {
        return (
            <div className="relative aspect-[9/16] group cursor-pointer dark:bg-gray-800 bg-neutral-200">
                <img src={`https://picsum.photos/seed/${index+30}/500/800`} alt="Post content" className="w-full h-full object-cover"/>
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
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto dark:text-white text-black">
             <header className="flex mb-8 md:mb-12 px-4 pt-16">
                <div className="w-20 h-20 sm:w-36 sm:h-36 shrink-0 mr-6 sm:mr-10 md:mr-20">
                    <div className="w-full h-full dark:bg-gray-700 bg-neutral-300 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                         <div className="w-full h-full rounded-full border-2 dark:border-black border-white overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=2823&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                         </div>
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <h2 className="text-xl sm:text-2xl dark:text-white text-black font-normal">stephen_ai</h2>
                        <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                            <button className="px-4 py-1.5 text-sm font-semibold dark:bg-gray-800 bg-neutral-200 dark:text-white text-black rounded-lg dark:hover:bg-gray-700 hover:bg-neutral-300 w-full sm:w-auto transition-colors">Edit Profile</button>
                            <button className="px-4 py-1.5 text-sm font-semibold dark:bg-gray-800 bg-neutral-200 dark:text-white text-black rounded-lg dark:hover:bg-gray-700 hover:bg-neutral-300 w-full sm:w-auto transition-colors">View Archive</button>
                        </div>
                            <button className="p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-neutral-200 dark:text-gray-300 text-neutral-700 dark:hover:text-white hover:text-black transition-colors"><SettingsIcon className="w-5 h-5"/></button>
                    </div>

                    <div className="hidden md:flex items-center gap-8 mb-4 text-base">
                        <div><span className="font-bold dark:text-white text-black">102</span> <span className="dark:text-white text-black">posts</span></div>
                        <div><span className="font-bold dark:text-white text-black">5.1k</span> <span className="dark:text-white text-black">followers</span></div>
                        <div><span className="font-bold dark:text-white text-black">420</span> <span className="dark:text-white text-black">following</span></div>
                    </div>
                    
                    <div className="text-sm sm:text-base">
                        <p className="font-semibold dark:text-white text-black">Stephen AI</p>
                        <p className="dark:text-gray-300 text-neutral-700 whitespace-pre-line">
                            Your personal AI learning companion. 🚀
                            Turning any content into interactive courses.
                        </p>
                        <a href="#" className="text-[#00376b] dark:text-[#e0f1ff] font-semibold hover:underline">stephen.ai</a>
                    </div>
                </div>
            </header>
            
            <div className="md:hidden flex items-center justify-around text-center border-y dark:border-gray-800 border-neutral-200 py-3 mb-4">
                 <div><span className="font-bold dark:text-white text-black block">102</span> <span className="text-gray-500 text-sm">posts</span></div>
                 <div><span className="font-bold dark:text-white text-black block">5.1k</span> <span className="text-gray-500 text-sm">followers</span></div>
                 <div><span className="font-bold dark:text-white text-black block">420</span> <span className="text-gray-500 text-sm">following</span></div>
            </div>

            <div className="border-t dark:border-gray-800 border-neutral-200 flex justify-center gap-4 sm:gap-12 -mt-px">
                <TabButton name="reels" label="REELS" icon={<ReelsIcon />} active={activeTab === 'reels'} onClick={setActiveTab} />
                <TabButton name="saved" label="SAVED" icon={<BookmarkIcon />} active={activeTab === 'saved'} onClick={setActiveTab} />
                <TabButton name="tagged" label="TAGGED" icon={<UsersIcon />} active={activeTab === 'tagged'} onClick={setActiveTab} />
            </div>

            <div className="mt-1">
                <AnimatePresence mode="wait">
                {activeTab === 'reels' && (
                    <motion.div 
                        key="reels"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-3 gap-1"
                    >
                        {posts.map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                               <ReelGridItem index={index} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
                {(activeTab === 'saved' || activeTab === 'tagged') && (
                        <motion.div
                        key="empty"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-center py-20 text-gray-500"
                        >
                        <div className="w-16 h-16 rounded-full border-2 dark:border-gray-700 border-neutral-300 flex items-center justify-center mx-auto mb-4">
                             {activeTab === 'saved' ? <BookmarkIcon className="w-8 h-8"/> : <UsersIcon className="w-8 h-8"/>}
                        </div>
                        <h3 className="text-2xl font-bold dark:text-white text-black mb-2">Nothing to see here yet</h3>
                        <p>Content will appear here once it is available.</p>
                        </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const HomeView = () => {
    const posts = Array(8).fill(0);
    const stories = Array(10).fill(0).map((_, i) => ({
        username: i === 0 ? 'Your Story' : `user_${i}`,
        isUser: i === 0,
        img: `https://picsum.photos/seed/${i + 500}/100/100`
    }));

    return (
        <div className="w-full max-w-lg mx-auto py-6 pt-16 space-y-4 dark:text-white text-black">
            {/* Stories Section - Instagram Style Line */}
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-1 border-b dark:border-gray-800 border-neutral-200">
                {stories.map((story, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer group">
                        <div className={`p-[3px] rounded-full ${story.isUser ? 'bg-transparent border border-gray-300 dark:border-gray-600' : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600'}`}>
                            <div className="p-[2px] rounded-full bg-white dark:bg-black">
                                <img src={story.img} alt={story.username} className="w-16 h-16 rounded-full object-cover transition-transform group-hover:scale-105" />
                            </div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate w-16 text-center">{story.username}</span>
                    </div>
                ))}
            </div>

            {/* Posts Feed */}
            {posts.map((_, index) => {
                 return (
                    <div key={index} className="dark:bg-black bg-white border-b dark:border-gray-800 border-neutral-200 pb-6">
                        <div className="flex items-center py-3 px-1">
                            <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 mr-3">
                                <div className="p-[2px] rounded-full bg-white dark:bg-black">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                        <img src={`https://picsum.photos/seed/${index+50}/100/100`} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                            <div className="font-semibold text-sm dark:text-white text-black">learner_{index+1}</div>
                            <div className="text-gray-500 text-sm ml-2">• {index + 1}h</div>
                            <button className="ml-auto text-gray-500 dark:text-gray-400"><DotsHorizontalIcon className="w-5 h-5"/></button>
                        </div>
                        <div className="relative aspect-square dark:bg-gray-900 bg-neutral-100 rounded-sm overflow-hidden border dark:border-gray-800 border-neutral-200">
                             <img src={`https://picsum.photos/seed/${index+50}/600/600`} alt="Post content" className="w-full h-full object-cover"/>
                        </div>
                        <div className="py-3 px-1">
                            <div className="flex items-center space-x-4 mb-3">
                                <button><HeartIcon className="w-6 h-6 dark:text-white text-black hover:text-gray-500 transition-colors"/></button>
                                <button><MessageCircleIcon className="w-6 h-6 dark:text-white text-black hover:text-gray-500 transition-colors"/></button>
                                <button><SendIcon className="w-6 h-6 dark:text-white text-black hover:text-gray-500 transition-colors -rotate-12"/></button>
                                <button className="ml-auto"><BookmarkIcon className="w-6 h-6 dark:text-white text-black hover:text-gray-500 transition-colors"/></button>
                            </div>
                             <div className="text-sm font-semibold dark:text-white text-black mb-1">{Math.floor(Math.random()*2000).toLocaleString()} likes</div>
                            <p className="text-sm dark:text-white text-black">
                                <span className="font-semibold mr-2">learner_{index+1}</span>
                                <span className="dark:text-gray-300 text-neutral-800">Exploring the depths of quantum computing today. It's mind-bending! 🤯 #learning #AI</span>
                            </p>
                            <p className="text-gray-500 text-sm mt-1 cursor-pointer">View all {Math.floor(Math.random()*50)} comments</p>
                            <div className="flex items-center mt-2">
                                <input type="text" placeholder="Add a comment..." className="bg-transparent text-sm w-full focus:outline-none dark:text-white text-black placeholder-gray-500"/>
                            </div>
                        </div>
                    </div>
                 );
            })}
        </div>
    );
};

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
                            
                            {/* Top Left Social Icon */}
                            <div className="absolute top-2 left-2 bg-black/30 p-1 rounded-full backdrop-blur-sm">
                                <RandomSocialIcon className="w-4 h-4 text-white" />
                            </div>
                            
                            {/* Top Right Reel Icon */}
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
                    )
                })}
            </div>
        </div>
    );
};

const MessagesView = () => {
    const [selectedChat, setSelectedChat] = useState(1);
    const chats = [
        { id: 1, name: 'learner_3', lastMessage: 'Sounds good! 👍', time: '2h', active: true },
        { id: 2, name: 'learner_5', lastMessage: 'See you then.', time: '1d', active: false },
        { id: 3, name: 'study_group', lastMessage: 'Alice: Are we still on for 3pm?', time: '3d', active: false },
        { id: 4, name: 'prof_smith', lastMessage: 'Please review the attached notes.', time: '4d', active: false },
        { id: 5, name: 'design_enthusiast', lastMessage: 'Love your recent project!', time: '1w', active: false },
    ];

    return (
        <div className="flex h-full dark:bg-black bg-white dark:text-white text-black">
            <div className="w-24 md:w-96 border-r dark:border-gray-800 border-neutral-200 flex flex-col shrink-0 dark:bg-black bg-white transition-colors duration-300">
                <div className="flex items-center justify-center md:justify-between p-4 border-b dark:border-gray-800 border-neutral-200 shrink-0 h-16 md:h-20 pt-16 md:pt-4">
                    <h2 className="text-xl font-bold dark:text-white text-black hidden md:flex items-center cursor-pointer">
                        stephen_ai <ChevronDownIcon className="w-4 h-4 ml-1" />
                    </h2>
                    <button className="hover:opacity-70"><PencilIcon className="w-6 h-6 dark:text-white text-black"/></button>
                </div>
                 <div className="p-2 md:p-4 overflow-y-auto hidden md:flex space-x-4 overflow-x-auto no-scrollbar mb-2">
                    {['Your Note', 'learner_3', 'learner_5'].map((name, i) => (
                         <div key={i} className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer">
                            <div className="w-16 h-16 rounded-full dark:bg-gray-800 bg-gray-200 relative overflow-hidden border dark:border-gray-700 border-gray-300">
                                 <img src={`https://picsum.photos/seed/${i + 600}/100/100`} className="w-full h-full object-cover opacity-80" />
                                 {i===0 && <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs text-gray-500 font-semibold bg-white/50 dark:bg-black/50 backdrop-blur-[1px]">Note</div>}
                            </div>
                            <span className="text-xs text-gray-500 w-16 text-center truncate dark:text-gray-400">{i===0 ? 'Your Note' : name}</span>
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
            <div className="flex-1 flex flex-col items-center justify-center text-center dark:bg-black bg-white p-8 transition-colors duration-300">
                <div className="border-2 dark:border-white border-black rounded-full p-6 inline-block mb-4">
                    <MessageCircleIcon className="w-16 h-16 dark:text-white text-black"/>
                </div>
                <h3 className="text-2xl dark:text-white text-black font-medium">Your Messages</h3>
                <p className="text-gray-500 mt-2 text-sm">Send private photos and messages to a friend or group.</p>
                <button className="mt-6 px-5 py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg text-sm transition-colors">Send Message</button>
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
                                     <img src={`https://picsum.photos/seed/${item.id + 800}/100/100`} className="w-full h-full object-cover"/>
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
                                    <img src={item.postImage} className="w-full h-full object-cover"/>
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

const PlaceholderView: React.FC<{title: string}> = ({title}) => (
    <div className="flex-1 flex items-center justify-center text-center text-gray-500 h-full dark:bg-black bg-white transition-colors duration-300 pt-16">
        <div>
            <h2 className="text-3xl font-bold dark:text-white text-black mb-2" style={{fontFamily: "'Lora', serif"}}>{title}</h2>
            <p>This section is under construction.</p>
        </div>
    </div>
);

const EdgramView = () => {
    const [activeView, setActiveView] = useState('home');

    const navItems = [
        { key: 'home', label: 'Home', icon: <HomeIcon className="w-6 h-6"/> },
        { key: 'explore', label: 'Explore', icon: <CompassIcon className="w-6 h-6"/> },
        { key: 'content', label: 'Content', icon: <LayersIcon className="w-6 h-6"/> },
        { key: 'messages', label: 'Messages', icon: <MessageCircleIcon className="w-6 h-6"/> }, 
        { key: 'notifications', label: 'Notifications', icon: <HeartIcon className="w-6 h-6"/> },
        { key: 'create', label: 'Create', icon: <PlusSquareIcon className="w-6 h-6"/> },
        { key: 'profile', label: 'Profile', icon: <div className="w-6 h-6 rounded-full dark:bg-gray-600 bg-neutral-400 overflow-hidden border dark:border-gray-600 border-gray-300"><img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=2823&auto=format&fit=crop" className="w-full h-full object-cover"/></div> },
    ];

    const renderContent = () => {
        switch(activeView) {
            case 'home': return <HomeView />;
            case 'explore': return <ExploreView />;
            case 'content': return <ContentView />;
            case 'profile': return <ProfileView />;
            case 'messages': return <MessagesView />;
            case 'notifications': return <NotificationsView />;
            case 'create': return <PlaceholderView title="Create Post"/>;
            default: return <HomeView />;
        }
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden dark:bg-black bg-white transition-colors duration-300 dark:text-white text-black">
            {/* Edgram Navigation */}
            <nav className="w-16 lg:w-64 dark:bg-black bg-white border-r dark:border-gray-800 border-neutral-200 pt-24 pb-3 px-3 flex flex-col items-center lg:items-start shrink-0 transition-colors duration-300">
                <div className="text-2xl font-bold dark:text-white text-black hidden lg:block py-6 px-4 mb-2" style={{ fontFamily: "'Lora', serif" }}>Edgram</div>
                 <div className="w-10 h-10 lg:hidden flex items-center justify-center mb-4 mt-4">
                    <EdgramIcon className="w-8 h-8 dark:text-white text-black"/>
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

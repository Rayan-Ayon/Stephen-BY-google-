import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SettingsIcon, ReelsIcon, UsersIcon, BookmarkIcon, HeartIcon, MessageCircleIcon, 
    FacebookIcon, TiktokIcon, InstagramIcon, YoutubeIcon, HomeIcon, CompassIcon,
    SendIcon, PlusSquareIcon, DotsHorizontalIcon, EdgramIcon, PencilIcon
} from './icons';

const socialIcons = [FacebookIcon, TiktokIcon, InstagramIcon, YoutubeIcon];

// --- Sub-Components for Edgram ---

const ProfileView = () => {
    const [activeTab, setActiveTab] = useState('reels');
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

    const ReelGridItem = ({ index }: { index: number }) => {
        const RandomSocialIcon = socialIcons[index % socialIcons.length];
        return (
            <div className="relative aspect-square group cursor-pointer bg-gray-800">
                <img src={`https://picsum.photos/seed/${index+30}/500/500`} alt="Post content" className="w-full h-full object-cover"/>
                <div className="absolute top-2 right-2 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <RandomSocialIcon className="w-4 h-4 text-white drop-shadow-lg" />
                </div>
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
        <div className="w-full max-w-4xl mx-auto">
             <header className="flex mb-8 md:mb-12 px-2 pt-8">
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
                        <div><span className="font-bold text-white">102</span> <span className="text-gray-400">reels</span></div>
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
            
            <div className="md:hidden flex items-center justify-around text-center border-y border-gray-800 py-3 mb-4">
                <div><span className="font-bold text-white block">102</span> <span className="text-gray-400 text-sm">reels</span></div>
                <div><span className="font-bold text-white block">5.1k</span> <span className="text-gray-400 text-sm">connections</span></div>
            </div>

            <div className="border-t border-gray-800 flex justify-center gap-4 sm:gap-12 -mt-px">
                <TabButton name="reels" label="REELS" icon={<ReelsIcon />} active={activeTab === 'reels'} onClick={setActiveTab} />
                <TabButton name="saved" label="SAVED" icon={<BookmarkIcon />} active={activeTab === 'saved'} onClick={setActiveTab} />
                <TabButton name="tagged" label="TAGGED" icon={<UsersIcon />} active={activeTab === 'tagged'} onClick={setActiveTab} />
            </div>

            <div className="mt-1">
                <AnimatePresence>
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
                        <h3 className="text-2xl font-bold text-white mb-2" style={{fontFamily: "'Lora', serif"}}>Nothing to see here yet</h3>
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
    return (
        <div className="w-full max-w-lg mx-auto py-8 space-y-8">
            {posts.map((_, index) => {
                 const RandomSocialIcon = socialIcons[index % socialIcons.length];
                 return (
                    <div key={index} className="bg-[#1a1a1a] border border-gray-800 rounded-xl">
                        <div className="flex items-center p-4">
                            <div className="w-10 h-10 rounded-full bg-gray-700 mr-3"></div>
                            <div className="font-semibold text-sm text-white">learner_{index+1}</div>
                            <button className="ml-auto text-gray-400"><DotsHorizontalIcon className="w-5 h-5"/></button>
                        </div>
                        <div className="relative aspect-square bg-gray-800">
                             <img src={`https://picsum.photos/seed/${index+50}/600/600`} alt="Post content" className="w-full h-full object-cover"/>
                              <div className="absolute top-2 right-2">
                                <RandomSocialIcon className="w-5 h-5 text-white drop-shadow-lg" />
                             </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center space-x-4 mb-2">
                                <button><HeartIcon className="w-6 h-6 text-gray-300 hover:text-red-500"/></button>
                                <button><MessageCircleIcon className="w-6 h-6 text-gray-300 hover:text-white"/></button>
                                <button><SendIcon className="w-6 h-6 text-gray-300 hover:text-white"/></button>
                                <button className="ml-auto"><BookmarkIcon className="w-6 h-6 text-gray-300 hover:text-white"/></button>
                            </div>
                             <div className="text-sm font-semibold text-white mb-2">{Math.floor(Math.random()*2000)} likes</div>
                            <p className="text-sm text-white">
                                <span className="font-semibold">learner_{index+1}</span>
                                <span className="text-gray-300"> Exploring the depths of quantum computing today. It's mind-bending! #learning #AI</span>
                            </p>
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
        <div className="w-full max-w-4xl mx-auto py-8">
             <div className="grid grid-cols-3 gap-1">
                {posts.map((_, index) => {
                     const RandomSocialIcon = socialIcons[index % socialIcons.length];
                     return (
                        <motion.div
                            key={index}
                            className="relative aspect-square group cursor-pointer bg-gray-800"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                        >
                            <img src={`https://picsum.photos/seed/${index + 100}/500/500`} alt="Explore content" className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <RandomSocialIcon className="w-4 h-4 text-white drop-shadow-lg" />
                            </div>
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
        { id: 1, name: 'learner_3', lastMessage: 'Sounds good!', time: '2h', active: true },
        { id: 2, name: 'learner_5', lastMessage: 'See you then.', time: '1d', active: false },
        { id: 3, name: 'study_group', lastMessage: 'Alice: Are we still on for 3pm?', time: '3d', active: false },
    ];

    return (
        <div className="flex h-full border-t border-gray-800">
            <div className="w-96 border-r border-gray-800 flex flex-col shrink-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-800 shrink-0 h-20">
                    <h2 className="text-xl font-bold text-white">stephen_ai</h2>
                    <button><PencilIcon className="w-6 h-6 text-gray-300"/></button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {chats.map(chat => (
                        <button key={chat.id} onClick={() => setSelectedChat(chat.id)} className={`w-full flex items-center p-4 text-left hover:bg-gray-800 ${selectedChat === chat.id ? 'bg-gray-800/70' : ''}`}>
                            <div className="w-14 h-14 rounded-full bg-gray-700 mr-3 shrink-0"></div>
                            <div className="flex-grow overflow-hidden">
                                <p className="text-sm text-white font-medium">{chat.name}</p>
                                <div className="flex items-baseline text-sm text-gray-500">
                                    <p className="truncate mr-2">{chat.lastMessage}</p>
                                    <span className="shrink-0">• {chat.time}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="border-4 border-gray-700 rounded-full p-4 inline-block mb-4">
                    <SendIcon className="w-12 h-12 text-gray-300 -rotate-12"/>
                </div>
                <h3 className="text-2xl text-white font-light">Your Messages</h3>
                <p className="text-gray-500 mt-1">Send private photos and messages to a friend or group.</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg text-sm">Send Message</button>
            </div>
        </div>
    );
};

const NotificationsView = () => {
    const notifications = {
        'This Week': [
            { id: 1, type: 'like', user: 'learner_3', time: '2d', postImage: `https://picsum.photos/seed/31/50/50` },
            { id: 2, type: 'follow', user: 'learner_5', time: '4d' },
        ],
        'This Month': [
            { id: 3, type: 'like', user: 'learner_8', time: '2w', postImage: `https://picsum.photos/seed/32/50/50` },
             { id: 4, type: 'like', user: 'learner_2', time: '3w', postImage: `https://picsum.photos/seed/33/50/50` },
        ]
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 w-full">
            <h1 className="text-2xl font-bold text-white mb-6">Notifications</h1>
            {Object.entries(notifications).map(([period, items]) => (
                <div key={period}>
                    <h2 className="text-md font-semibold text-white my-3">{period}</h2>
                    {items.map(item => (
                         <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50">
                             <div className="w-11 h-11 rounded-full bg-gray-700 shrink-0"></div>
                             <div className="flex-grow text-sm">
                                 <p className="text-gray-300">
                                     <span className="font-semibold text-white">{item.user}</span>
                                     {item.type === 'like' ? ' liked your reel.' : ' started following you.'}
                                     <span className="text-gray-500 ml-1">{item.time}</span>
                                 </p>
                             </div>
                             {item.postImage && (
                                <div className="w-11 h-11 bg-gray-800 rounded-md overflow-hidden shrink-0">
                                    <img src={item.postImage} className="w-full h-full object-cover"/>
                                </div>
                             )}
                              {item.type === 'follow' && (
                                 <button className="px-4 py-1.5 text-sm font-semibold bg-gray-700 rounded-lg hover:bg-gray-600 shrink-0">Follow</button>
                             )}
                         </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const PlaceholderView: React.FC<{title: string}> = ({title}) => (
    <div className="flex-1 flex items-center justify-center text-center text-gray-500 h-full">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2" style={{fontFamily: "'Lora', serif"}}>{title}</h2>
            <p>This section is under construction.</p>
        </div>
    </div>
);

const EdgramView = () => {
    const [activeView, setActiveView] = useState('home');

    const navItems = [
        { key: 'home', label: 'Home', icon: <HomeIcon className="w-6 h-6"/> },
        { key: 'explore', label: 'Explore', icon: <CompassIcon className="w-6 h-6"/> },
        { key: 'messages', label: 'Messages', icon: <SendIcon className="w-6 h-6"/> },
        { key: 'notifications', label: 'Notifications', icon: <HeartIcon className="w-6 h-6"/> },
        { key: 'create', label: 'Create', icon: <PlusSquareIcon className="w-6 h-6"/> },
        { key: 'profile', label: 'Profile', icon: <div className="w-6 h-6 rounded-full bg-gray-600"></div> },
    ];

    const renderContent = () => {
        switch(activeView) {
            case 'home': return <HomeView />;
            case 'explore': return <ExploreView />;
            case 'profile': return <ProfileView />;
            case 'messages': return <MessagesView />;
            case 'notifications': return <NotificationsView />;
            case 'create': return <PlaceholderView title="Create Post"/>;
            default: return <HomeView />;
        }
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden stephen-bg">
            {/* Edgram Navigation */}
            <nav className="w-20 lg:w-64 bg-[#0d0d0d] border-r border-gray-800/50 p-3 flex flex-col items-center lg:items-start shrink-0">
                <div className="text-2xl font-bold text-white hidden lg:block py-4 px-3" style={{ fontFamily: "'Lora', serif" }}>Edgram</div>
                 <div className="w-10 h-10 lg:hidden flex items-center justify-center mb-4">
                    <EdgramIcon className="w-7 h-7 text-white"/>
                </div>

                <div className="flex flex-col space-y-2 w-full">
                    {navItems.map(item => (
                        <button 
                            key={item.key}
                            onClick={() => setActiveView(item.key)}
                            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeView === item.key ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
                        >
                            {item.icon}
                            <span className={`ml-4 text-white hidden lg:block ${activeView === item.key ? 'font-bold' : 'font-normal'}`}>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
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
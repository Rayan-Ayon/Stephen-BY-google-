
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ReelsIcon, UsersIcon, BookmarkIcon, HeartIcon, MessageCircleIcon,
    SettingsIcon, BookOpenIcon, StarIcon, DollarIcon, BriefcaseIcon
} from '../icons';
import { Course, Bounty } from './types';

const mockCourses: Course[] = [
    { id: 1, title: 'Intro to Neural Networks', instructor: 'Stephen AI', price: 150, enrolled: 342, rating: 4.8, image: 'https://picsum.photos/seed/701/300/200' },
    { id: 2, title: 'Rust Systems Programming', instructor: 'Alice Codes', price: 200, enrolled: 128, rating: 4.6, image: 'https://picsum.photos/seed/702/300/200' },
    { id: 3, title: 'Quantum Computing 101', instructor: 'Prof. Wu', price: 300, enrolled: 89, rating: 4.9, image: 'https://picsum.photos/seed/703/300/200' },
    { id: 4, title: 'Full Stack Next.js', instructor: 'Dev Ankit', price: 120, enrolled: 215, rating: 4.5, image: 'https://picsum.photos/seed/704/300/200' },
    { id: 5, title: 'Linear Algebra for ML', instructor: 'Peer Maria', price: 80, enrolled: 410, rating: 4.7, image: 'https://picsum.photos/seed/705/300/200' },
    { id: 6, title: 'Python Debugging Mastery', instructor: 'Tutor Ray', price: 60, enrolled: 567, rating: 4.4, image: 'https://picsum.photos/seed/706/300/200' },
];

const mockBounties: Bounty[] = [
    { id: 1, title: 'Fix recursive tree traversal bug', description: 'My BST inorder traversal is returning null for left subtrees.', reward: 45, difficulty: 'Easy', status: 'Open' },
    { id: 2, title: 'Optimize SQL query (N+1 problem)', description: 'Rails app with 5 nested includes causing slow loads.', reward: 80, difficulty: 'Medium', status: 'Open' },
    { id: 3, title: 'Debug WebSocket reconnect loop', description: 'Client keeps reconnecting every 3s after token refresh.', reward: 120, difficulty: 'Hard', status: 'Open' },
    { id: 4, title: 'CSS Grid alignment issue on mobile', description: 'Product cards misaligned below 768px breakpoint.', reward: 30, difficulty: 'Easy', status: 'In Progress' },
    { id: 5, title: 'Fix async/await race condition', description: 'Two concurrent API calls overwrite each other results.', reward: 95, difficulty: 'Medium', status: 'Open' },
    { id: 6, title: 'Patch memory leak in WebSocket handler', description: 'Unclosed connections pile up after 30 min usage.', reward: 150, difficulty: 'Hard', status: 'Resolved' },
];

const difficultyColor: Record<string, string> = {
    Easy: 'text-green-400 bg-green-900/20 border-green-500/30',
    Medium: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
    Hard: 'text-red-400 bg-red-900/20 border-red-500/30',
};

const statusColor: Record<string, string> = {
    Open: 'text-blue-400',
    'In Progress': 'text-amber-400',
    Resolved: 'text-gray-500',
};

const ProfileView = () => {
    const [activeTab, setActiveTab] = useState('reels');

    const TabButton = ({ name, label, icon, active }: { name: string; label: string; icon: React.ReactElement<any>; active: boolean }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`flex items-center justify-center w-full sm:w-auto sm:px-4 py-3 text-sm font-semibold border-t-2 transition-colors ${
                active ? 'dark:border-white border-black dark:text-white text-black' : 'border-transparent text-gray-500 dark:hover:text-white hover:text-black'
            }`}
        >
            {React.cloneElement(icon, { className: "w-4 h-4 mr-2" })}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    const ReelGridItem = ({ index }: { index: number }) => (
        <div className="relative aspect-[9/16] group cursor-pointer dark:bg-gray-800 bg-neutral-200">
            <img src={`https://picsum.photos/seed/${index + 30}/500/800`} alt="Post content" className="w-full h-full object-cover" />
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

    return (
        <div className="w-full max-w-4xl mx-auto dark:text-white text-black">
            {/* Profile Header */}
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
                        <button className="p-2 rounded-lg dark:hover:bg-gray-800 hover:bg-neutral-200 dark:text-gray-300 text-neutral-700 dark:hover:text-white hover:text-black transition-colors"><SettingsIcon className="w-5 h-5" /></button>
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

            {/* Mobile Stats */}
            <div className="md:hidden flex items-center justify-around text-center border-y dark:border-gray-800 border-neutral-200 py-3 mb-4">
                <div><span className="font-bold dark:text-white text-black block">102</span> <span className="text-gray-500 text-sm">posts</span></div>
                <div><span className="font-bold dark:text-white text-black block">5.1k</span> <span className="text-gray-500 text-sm">followers</span></div>
                <div><span className="font-bold dark:text-white text-black block">420</span> <span className="text-gray-500 text-sm">following</span></div>
            </div>

            {/* Tab Navigation */}
            <div className="border-t dark:border-gray-800 border-neutral-200 flex justify-center gap-4 sm:gap-12 -mt-px">
                <TabButton name="reels" label="REELS" icon={<ReelsIcon />} active={activeTab === 'reels'} />
                <TabButton name="courses" label="COURSES" icon={<BookOpenIcon />} active={activeTab === 'courses'} />
                <TabButton name="bounties" label="BOUNTIES" icon={<BriefcaseIcon />} active={activeTab === 'bounties'} />
                <TabButton name="saved" label="SAVED" icon={<BookmarkIcon />} active={activeTab === 'saved'} />
                <TabButton name="tagged" label="TAGGED" icon={<UsersIcon />} active={activeTab === 'tagged'} />
            </div>

            {/* Tab Content */}
            <div className="mt-1">
                <AnimatePresence mode="wait">
                    {activeTab === 'reels' && (
                        <motion.div key="reels" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 gap-1">
                            {Array(12).fill(0).map((_, index) => (
                                <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                                    <ReelGridItem index={index} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'courses' && (
                        <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {mockCourses.map(course => (
                                    <div key={course.id} className="dark:bg-[#121212] bg-gray-50 rounded-xl border dark:border-gray-800 border-gray-200 overflow-hidden hover:border-blue-500/50 transition-colors group">
                                        <div className="aspect-[3/2] overflow-hidden dark:bg-gray-800 bg-gray-200">
                                            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-sm dark:text-white text-black mb-1">{course.title}</h4>
                                            <p className="text-xs text-gray-500 mb-3">{course.instructor}</p>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    <StarIcon className="w-3.5 h-3.5" />
                                                    <span className="font-bold dark:text-white text-black">{course.rating}</span>
                                                </div>
                                                <div className="text-gray-500">{course.enrolled} enrolled</div>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between border-t dark:border-gray-800 border-gray-200 pt-3">
                                                <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                                                    <DollarIcon className="w-4 h-4" /> {course.price}
                                                </div>
                                                <button className="text-xs font-bold px-3 py-1.5 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">Enroll</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'bounties' && (
                        <motion.div key="bounties" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                            <div className="space-y-3">
                                {mockBounties.map(bounty => (
                                    <div key={bounty.id} className="dark:bg-[#121212] bg-gray-50 rounded-xl border dark:border-gray-800 border-gray-200 p-4 flex items-start justify-between hover:border-amber-500/30 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-sm dark:text-white text-black">{bounty.title}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColor[bounty.difficulty]}`}>{bounty.difficulty}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">{bounty.description}</p>
                                            <span className={`text-[11px] font-semibold ${statusColor[bounty.status]}`}>{bounty.status}</span>
                                        </div>
                                        <div className="shrink-0 ml-4 text-right">
                                            <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                                                <DollarIcon className="w-4 h-4" /> {bounty.reward}
                                            </div>
                                            <button className="mt-2 text-xs font-bold px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors">
                                                {bounty.status === 'Open' ? 'Claim' : bounty.status === 'In Progress' ? 'View' : 'Solved'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {(activeTab === 'saved' || activeTab === 'tagged') && (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20 text-gray-500">
                            <div className="w-16 h-16 rounded-full border-2 dark:border-gray-700 border-neutral-300 flex items-center justify-center mx-auto mb-4">
                                {activeTab === 'saved' ? <BookmarkIcon className="w-8 h-8" /> : <UsersIcon className="w-8 h-8" />}
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

export default ProfileView;

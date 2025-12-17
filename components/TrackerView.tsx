
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    CheckCircleIcon, StarIcon, ChatIcon, UsersIcon, 
    TrophyIcon, TrendingUpIcon, ClockIcon, ChevronRightIcon,
    LocationTrackerIcon
} from './icons';

// --- Sub-Components ---

const StatRow = ({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) => (
    <div className="flex items-center justify-between py-2 group cursor-pointer">
        <div className="flex items-center text-sm dark:text-gray-400 text-neutral-600 group-hover:dark:text-white group-hover:text-black transition-colors">
            <div className="mr-3 text-gray-500 group-hover:text-orange-500 transition-colors">
                {icon}
            </div>
            {label}
        </div>
        <div className="text-right">
            <span className="block font-semibold text-sm dark:text-white text-black">{value}</span>
            {subValue && <span className="block text-xs text-gray-500">{subValue}</span>}
        </div>
    </div>
);

const SkillTag: React.FC<{ label: string }> = ({ label }) => (
    <span className="inline-block px-3 py-1 mr-2 mb-2 text-xs font-medium dark:bg-gray-800 bg-neutral-100 dark:text-gray-300 text-neutral-700 rounded-full hover:bg-neutral-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
        {label}
    </span>
);

const CircularProgress = ({ size, strokeWidth, percentage, color, trackColor = "#e5e7eb" }: { size: number, strokeWidth: number, percentage: number, color: string, trackColor?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={trackColor}
                strokeWidth={strokeWidth}
                fill="none"
                className="dark:stroke-gray-800 stroke-neutral-200"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
        </svg>
    );
};

const Heatmap = () => {
    // Generate dummy data for the heatmap (52 weeks * 7 days)
    const weeks = 52;
    const days = 7;
    const getIntensity = () => {
        const rand = Math.random();
        if (rand > 0.9) return 4; // High
        if (rand > 0.7) return 3;
        if (rand > 0.5) return 2;
        if (rand > 0.2) return 1;
        return 0; // None
    };

    const getColor = (intensity: number) => {
        switch (intensity) {
            case 4: return 'bg-green-500 dark:bg-green-600';
            case 3: return 'bg-green-400 dark:bg-green-700';
            case 2: return 'bg-green-300 dark:bg-green-800';
            case 1: return 'bg-green-200 dark:bg-green-900/50';
            default: return 'bg-gray-100 dark:bg-gray-800';
        }
    };

    return (
        <div className="flex flex-col space-y-2 overflow-x-auto pb-2">
            <div className="flex space-x-1 min-w-max">
                {Array.from({ length: weeks }).map((_, wIndex) => (
                    <div key={wIndex} className="flex flex-col space-y-1">
                        {Array.from({ length: days }).map((_, dIndex) => {
                            const intensity = getIntensity();
                            return (
                                <div
                                    key={`${wIndex}-${dIndex}`}
                                    className={`w-3 h-3 rounded-[2px] ${getColor(intensity)} hover:ring-1 ring-gray-400 transition-all cursor-pointer relative group`}
                                >
                                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                        {intensity * 3} submissions
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-end text-xs text-gray-500 space-x-2 mt-2">
                <span>Less</span>
                <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-[2px]"></div>
                <div className="w-3 h-3 bg-green-200 dark:bg-green-900/50 rounded-[2px]"></div>
                <div className="w-3 h-3 bg-green-300 dark:bg-green-800 rounded-[2px]"></div>
                <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-[2px]"></div>
                <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-[2px]"></div>
                <span>More</span>
            </div>
        </div>
    );
};

const TrackerView = () => {
    const [activeTab, setActiveTab] = useState<'Recent AC' | 'List' | 'Solutions' | 'Discuss'>('Recent AC');

    const difficultyColor = {
        Easy: 'text-teal-500',
        Medium: 'text-yellow-500',
        Hard: 'text-red-500'
    };

    return (
        <div className="flex-1 overflow-y-auto h-full dark:bg-black bg-neutral-100 dark:text-gray-300 text-neutral-800 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* --- Left Column: Profile & Stats --- */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 dark:border-gray-700 border-neutral-200">
                                <img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=2823&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold dark:text-white text-black leading-tight">Farhan Tanvir</h2>
                                <p className="text-sm text-gray-500 mb-1">ayonlogy</p>
                                <p className="text-sm font-medium dark:text-white text-black">Rank ~5,000,000</p>
                            </div>
                        </div>
                        <button className="w-full py-2 bg-green-600/10 hover:bg-green-600/20 text-green-600 dark:text-green-500 text-sm font-semibold rounded-lg transition-colors mb-6">
                            Edit Profile
                        </button>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center text-sm text-gray-500">
                                <LocationTrackerIcon className="w-4 h-4 mr-2" />
                                Bangladesh
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-2">🎓</span>
                                Daffodil International University
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                                <span className="mr-2">🐙</span>
                                ayonlogy
                            </div>
                        </div>

                        <div className="border-t dark:border-gray-800 border-neutral-200 pt-4 mb-6">
                            <h3 className="text-sm font-bold dark:text-white text-black mb-4">Community Stats</h3>
                            <StatRow icon={<UsersIcon className="w-4 h-4"/>} label="Views" value="171" subValue="Last week +2" />
                            <StatRow icon={<CheckCircleIcon className="w-4 h-4"/>} label="Solution" value="8" />
                            <StatRow icon={<ChatIcon className="w-4 h-4"/>} label="Discuss" value="0" />
                            <StatRow icon={<StarIcon className="w-4 h-4"/>} label="Reputation" value="2" />
                        </div>

                        <div className="border-t dark:border-gray-800 border-neutral-200 pt-4">
                             <h3 className="text-sm font-bold dark:text-white text-black mb-4">Languages</h3>
                             <div className="space-y-2">
                                 <div className="flex justify-between text-sm">
                                     <span className="dark:text-gray-400 text-neutral-600">C++</span>
                                     <span className="font-medium dark:text-white text-black">940 problems</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                     <span className="dark:text-gray-400 text-neutral-600">MySQL</span>
                                     <span className="font-medium dark:text-white text-black">35 problems</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                     <span className="dark:text-gray-400 text-neutral-600">JavaScript</span>
                                     <span className="font-medium dark:text-white text-black">30 problems</span>
                                 </div>
                             </div>
                        </div>
                         <div className="border-t dark:border-gray-800 border-neutral-200 pt-4 mt-6">
                             <h3 className="text-sm font-bold dark:text-white text-black mb-4">Skills</h3>
                             <div className="mb-4">
                                 <p className="text-xs font-semibold text-gray-500 mb-2">• Advanced</p>
                                 <div className="flex flex-wrap">
                                     {['Dynamic Programming', 'Graph', 'Tree', 'Hash Table'].map(s => <SkillTag key={s} label={s} />)}
                                 </div>
                             </div>
                             <div>
                                 <p className="text-xs font-semibold text-gray-500 mb-2">• Intermediate</p>
                                 <div className="flex flex-wrap">
                                     {['Greedy', 'Binary Search', 'Sorting', 'DFS'].map(s => <SkillTag key={s} label={s} />)}
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Main Content --- */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Solved Problems */}
                        <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                            <h3 className="text-sm font-semibold text-gray-500 mb-4">Solved Problems</h3>
                            <div className="flex items-center space-x-8">
                                <div className="relative">
                                    <div className="transform -rotate-90">
                                        <svg width="120" height="120">
                                            <circle cx="60" cy="60" r="54" strokeWidth="8" className="dark:stroke-gray-800 stroke-neutral-200" fill="none" />
                                            {/* Hard Segment */}
                                            <circle cx="60" cy="60" r="54" strokeWidth="8" className="stroke-red-500" fill="none" strokeDasharray="339.292" strokeDashoffset="250" strokeLinecap="round" />
                                            {/* Medium Segment */}
                                            <circle cx="60" cy="60" r="54" strokeWidth="8" className="stroke-yellow-500" fill="none" strokeDasharray="339.292" strokeDashoffset="180" strokeLinecap="round" style={{ transform: 'rotate(80deg)', transformOrigin: '50% 50%' }} />
                                            {/* Easy Segment */}
                                            <circle cx="60" cy="60" r="54" strokeWidth="8" className="stroke-teal-500" fill="none" strokeDasharray="339.292" strokeDashoffset="280" strokeLinecap="round" style={{ transform: 'rotate(240deg)', transformOrigin: '50% 50%' }} />
                                        </svg>
                                    </div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold dark:text-white text-black">1005</span>
                                        <span className="text-xs text-gray-500">Solved</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-teal-500 font-medium">Easy</span>
                                            <span className="font-bold dark:text-white text-black">227 <span className="text-gray-500 font-normal text-xs">/ 782</span></span>
                                        </div>
                                        <div className="w-full h-1.5 dark:bg-gray-800 bg-neutral-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-teal-500 rounded-full" style={{ width: '30%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-yellow-500 font-medium">Medium</span>
                                            <span className="font-bold dark:text-white text-black">488 <span className="text-gray-500 font-normal text-xs">/ 1620</span></span>
                                        </div>
                                        <div className="w-full h-1.5 dark:bg-gray-800 bg-neutral-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-red-500 font-medium">Hard</span>
                                            <span className="font-bold dark:text-white text-black">290 <span className="text-gray-500 font-normal text-xs">/ 685</span></span>
                                        </div>
                                        <div className="w-full h-1.5 dark:bg-gray-800 bg-neutral-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: '20%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                         {/* Badges */}
                         <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6 z-10">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500">Badges</h3>
                                    <span className="text-3xl font-bold dark:text-white text-black block mt-1">16</span>
                                </div>
                                <button className="text-gray-400 hover:text-white"><ChevronRightIcon className="w-5 h-5"/></button>
                            </div>
                            
                            <div className="flex space-x-4 z-10 overflow-x-auto pb-2 scrollbar-hide">
                                 {/* Example Badges */}
                                 <div className="flex flex-col items-center shrink-0">
                                     <div className="w-16 h-16 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg transform rotate-45 opacity-20"></div>
                                        <div className="absolute inset-1 bg-black rounded-lg transform rotate-45 flex items-center justify-center border border-teal-500/50">
                                            <TrophyIcon className="w-8 h-8 text-teal-400 transform -rotate-45" />
                                        </div>
                                     </div>
                                     <span className="text-xs font-medium dark:text-white text-black mt-3">Knight</span>
                                 </div>
                                  <div className="flex flex-col items-center shrink-0">
                                     <div className="w-16 h-16 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full opacity-20"></div>
                                        <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center border border-yellow-500/50">
                                            <span className="text-xs font-bold text-yellow-500">50 Days</span>
                                        </div>
                                     </div>
                                     <span className="text-xs font-medium dark:text-white text-black mt-3">50 Days Badge</span>
                                 </div>
                                  <div className="flex flex-col items-center shrink-0">
                                     <div className="w-16 h-16 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg opacity-20"></div>
                                        <div className="absolute inset-1 bg-black rounded-lg flex items-center justify-center border border-purple-500/50">
                                            <span className="text-xs font-bold text-purple-400">2024</span>
                                        </div>
                                     </div>
                                     <span className="text-xs font-medium dark:text-white text-black mt-3">Annual Badge</span>
                                 </div>
                            </div>
                            
                            {/* Background decoration */}
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>

                    {/* Heatmap Section */}
                    <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                             <div className="flex items-baseline space-x-2">
                                <h3 className="text-lg font-bold dark:text-white text-black">1,639</h3>
                                <span className="text-sm text-gray-500">submissions in the past one year</span>
                             </div>
                             <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div>Total active days: <span className="font-semibold dark:text-white text-black">357</span></div>
                                <div>Max streak: <span className="font-semibold dark:text-white text-black">257</span></div>
                             </div>
                        </div>
                        <Heatmap />
                    </div>

                    {/* Recent Activity */}
                    <div className="dark:bg-[#1a1a1a] bg-white border dark:border-gray-800 border-neutral-200 rounded-xl p-6 shadow-sm min-h-[300px]">
                         <div className="flex items-center space-x-6 border-b dark:border-gray-800 border-neutral-200 pb-2 mb-4">
                             {['Recent AC', 'List', 'Solutions', 'Discuss'].map(tab => (
                                 <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-colors border-b-2 -mb-2.5 ${
                                        activeTab === tab 
                                        ? 'border-white dark:text-white text-black' 
                                        : 'border-transparent text-gray-500 hover:text-gray-300'
                                    }`}
                                 >
                                     {tab === 'Recent AC' && <CheckCircleIcon className="w-4 h-4" />}
                                     {tab === 'List' && <div className="w-4 h-4 border border-current rounded flex items-center justify-center text-[10px]">L</div>}
                                     {tab === 'Solutions' && <CheckCircleIcon className="w-4 h-4" />}
                                     {tab === 'Discuss' && <ChatIcon className="w-4 h-4" />}
                                     <span>{tab}</span>
                                 </button>
                             ))}
                         </div>

                         <div className="space-y-2">
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:dark:bg-[#121212] hover:bg-neutral-50 transition-colors group">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium dark:text-white text-black group-hover:text-blue-500">
                                            {i % 2 === 0 ? 'Two Sum' : 'Median of Two Sorted Arrays'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                         <span className="text-xs">{i + 1} hours ago</span>
                                         <span className={`font-medium ${i % 3 === 0 ? difficultyColor.Hard : (i % 2 === 0 ? difficultyColor.Easy : difficultyColor.Medium)}`}>
                                            {i % 3 === 0 ? 'Hard' : (i % 2 === 0 ? 'Easy' : 'Medium')}
                                         </span>
                                    </div>
                                </div>
                            ))}
                         </div>
                         <div className="mt-4 pt-4 border-t dark:border-gray-800 border-neutral-200 flex justify-end">
                             <button className="text-sm text-gray-500 hover:text-white flex items-center transition-colors">
                                 View all submissions <ChevronRightIcon className="w-4 h-4 ml-1" />
                             </button>
                         </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TrackerView;

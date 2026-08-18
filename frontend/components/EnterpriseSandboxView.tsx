import React, { useState } from 'react';
import type { Workspace } from '../workspaceContext';

interface EnterpriseSandboxViewProps {
    workspace: Workspace;
}

const LEADERBOARD_DATA = [
    { rank: 1, name: 'Saima Akter', score: '9.0' },
    { rank: 2, name: 'jack chen', score: '9.0' },
    { rank: 3, name: 'saikat.das', score: '9.0' },
    { rank: 4, name: 'Alok Biswas', score: '9.0' },
    { rank: 5, name: 'md.maynuddin', score: '8.5' },
    { rank: 6, name: 'AyonLogy', score: '8.0' },
    { rank: 7, name: 'John Doe', score: '7.5' },
    { rank: 8, name: 'Jane Smith', score: '7.5' },
    { rank: 9, name: 'Test User', score: '7.0' },
    { rank: 10, name: 'Another Student', score: '6.5' },
];

const EnterpriseSandboxView: React.FC<EnterpriseSandboxViewProps> = ({ workspace }) => {
    const [showMoreLeaderboard, setShowMoreLeaderboard] = useState(false);

    const visibleLeaderboard = showMoreLeaderboard ? LEADERBOARD_DATA : LEADERBOARD_DATA.slice(0, 5);

    return (
        <div className="w-full h-full overflow-y-auto bg-[#fafafa] dark:bg-[#0b0b0b] text-zinc-900 dark:text-zinc-100">
            <div className="mx-auto max-w-5xl py-8 px-6 space-y-8 pb-20">
                {/* Enterprise Context Title Bar */}
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Farmgate Executive Batch, Assign Task, Portal Matrix and Execute Sandbox Stats for this workshop.
                    </h1>
                </div>

                {/* Greeting & Badges */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Good Morning, AyonLogy!</h2>
                        <p className="text-zinc-500 mt-1">Start your IELTS journey to achieve your goal.</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold rounded-md uppercase tracking-wider">Academic</span>
                        <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-semibold rounded-md">92 days to exam</span>
                    </div>
                </div>

                {/* Core Metrics & Goal Tracking */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Day Streak', value: '1', icon: '🔥' },
                            { label: 'Tests Done', value: '0', icon: '📝' },
                            { label: 'Practice Time', value: '0m', icon: '⏱️' },
                            { label: 'Weekly Rank', value: '-', icon: '🏆' },
                        ].map(metric => (
                            <div key={metric.label} className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-center items-center shadow-sm">
                                <span className="text-2xl mb-2">{metric.icon}</span>
                                <span className="text-3xl font-bold text-zinc-800 dark:text-white">{metric.value}</span>
                                <span className="text-xs text-zinc-500 mt-1 uppercase tracking-wider text-center">{metric.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="col-span-1 bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-zinc-500 font-medium">Your Goal</p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">Target 8.0</p>
                            <p className="text-sm text-zinc-400 mt-1">Current <span className="font-semibold text-zinc-800 dark:text-zinc-200">-</span></p>
                            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-3 hover:underline">Change Target</button>
                        </div>
                        <div className="relative w-24 h-24">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-100 dark:text-zinc-800" />
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="251.2" className="text-red-600 dark:text-red-500" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Practice Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button className="flex items-center gap-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl p-6 transition-colors shadow-sm text-left">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Full IELTS Test</h3>
                            <p className="text-red-100 text-sm">Practice in exam-like conditions</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-4 bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-white rounded-2xl p-6 transition-colors shadow-sm text-left">
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Vocabulary Bank</h3>
                            <p className="text-zinc-500 text-sm">Build your IELTS vocabulary</p>
                        </div>
                    </button>
                </div>

                {/* Section Performance */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Section Performance</h2>
                        <button className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1">
                            View Details
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Listening', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
                            { name: 'Reading', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, color: 'text-green-500 bg-green-50 dark:bg-green-500/10' },
                            { name: 'Writing', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
                            { name: 'Speaking', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
                        ].map(section => (
                            <div key={section.name} className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${section.color}`}>
                                    {section.icon}
                                </div>
                                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{section.name}</h3>
                                <div className="flex items-end gap-1 mb-3">
                                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">-</span>
                                    <span className="text-zinc-400 text-sm pb-1">/ 9.0</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3"></div>
                                <div className="flex justify-between items-center text-xs text-zinc-500 mb-4">
                                    <span>0 tests</span>
                                    <span>Best: -</span>
                                </div>
                                <button className="mt-auto w-full py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                                    Practice
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Timeline */}
                <div className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Your Progress Timeline</h2>
                    </div>
                    <div className="relative">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0"></div>
                        <div className="relative z-10 flex justify-between items-center px-4">
                            <div className="w-3 h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                            <div className="w-3 h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                            <div className="w-3 h-3 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
                        </div>
                    </div>
                    <div className="text-center mt-10">
                        <p className="text-sm text-zinc-500 mb-4">Complete tests to see your progress timeline</p>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
                            Take Your First Test
                        </button>
                    </div>
                </div>

                {/* Leaderboard & Smart Tip */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-red-600">💡</span>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Smart Tip</h2>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                            For Writing Task 2, spend 5 minutes planning before writing. Structure is key!
                        </p>
                    </div>

                    <div className="lg:col-span-2 bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-red-600">🏆</span>
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Leaderboard</h2>
                            </div>
                            <span className="text-xs text-zinc-500 uppercase tracking-wider">This Week</span>
                        </div>
                        
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {visibleLeaderboard.map((student, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                            student.rank === 1 ? 'bg-amber-400 text-amber-900' :
                                            student.rank === 2 ? 'bg-zinc-300 text-zinc-800' :
                                            student.rank === 3 ? 'bg-orange-400 text-orange-950' :
                                            'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                        }`}>
                                            {student.rank}
                                        </div>
                                        <span className="font-medium text-sm text-zinc-900 dark:text-white">{student.name}</span>
                                    </div>
                                    <span className="font-bold text-red-600">{student.score}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
                            <button 
                                onClick={() => setShowMoreLeaderboard(!showMoreLeaderboard)}
                                className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex items-center justify-center gap-1"
                            >
                                {showMoreLeaderboard ? 'Show Less' : 'Show More'}
                                <svg className={`w-4 h-4 transform transition-transform ${showMoreLeaderboard ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EnterpriseSandboxView;
import React, { useState } from 'react';
import DashboardTopHeader from './DashboardTopHeader';
import {
    FireIcon, LightningIcon, XIcon,
    PlayCircleIcon, CalendarIcon, BookOpenIcon, MicIcon,
    HeadphonesIcon, PenIcon, TargetIcon, ClockIcon
} from './icons';

interface OverviewProps {
    userEmail: string;
    onNavigate: (view: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ userEmail, onNavigate }) => {
    const [tourDismissed, setTourDismissed] = useState(false);
    const username = userEmail.split('@')[0] || 'User';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'GOOD MORNING';
        if (hour < 17) return 'GOOD AFTERNOON';
        return 'GOOD EVENING';
    };

    // 14-Day Calendar Data for Consistency Card
    const calendarGrid = [
        [27, 28, 29, 30, 31, 1, 2],
        [3, 4, 5, 6, 7, 8, 9],
    ];
    const goldDays = [6, 7];
    const currentDay = 9;

    return (
        <div className="w-full min-h-screen bg-[#0D0F12] text-slate-100 p-6 space-y-6 font-sans">

            {/* ═══════════════════════════════════════════
                1. TOP HEADER BAR
                (Spans 100% Width Across Both Columns)
            ═══════════════════════════════════════════ */}
            <div className="w-full">
                <DashboardTopHeader userEmail={userEmail} onNavigate={onNavigate} />
            </div>

            {/* ═══════════════════════════════════════════
                2. MAIN 2-COLUMN DASHBOARD GRID
            ═══════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* ═══════════════════════════════════════════
                    LEFT COLUMN: Main Feed (lg:col-span-8)
                ═══════════════════════════════════════════ */}
                <div className="lg:col-span-8 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 custom-scrollbar">

                    {/* 1. Header Greeting Area */}
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-gray-400 text-[11px] font-semibold tracking-widest uppercase mb-1">{getGreeting()}</p>
                            <h1 className="text-[32px] font-bold text-white leading-tight">Welcome back, {username}!</h1>
                            <p className="text-gray-400 text-sm mt-1">A little practice today. A step closer to your dream score.</p>
                        </div>
                        <button
                            onClick={() => onNavigate('study_plan')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300 text-sm font-medium hover:text-white hover:border-slate-600 transition-all shadow-sm"
                        >
                            <CalendarIcon className="w-4 h-4" />
                            View study plan
                        </button>
                    </div>

                    {/* 2. 4-Card Top Telemetry Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Overall Band */}
                        <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 relative shadow-sm">
                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#2C1819] flex items-center justify-center">
                                <TargetIcon className="w-4 h-4 text-[#FF4D4D]" />
                            </div>
                            <p className="text-gray-400 text-[13px] mb-3">Overall Band</p>
                            <p className="text-[28px] font-bold text-white leading-none mb-1">—</p>
                            <p className="text-gray-500 text-[12px]">Take a test to see your band score</p>
                        </div>

                        {/* Day Streak */}
                        <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 relative shadow-sm">
                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#261F18] flex items-center justify-center">
                                <FireIcon className="w-4 h-4 text-[#F59E0B]" />
                            </div>
                            <p className="text-gray-400 text-[13px] mb-3">Day Streak</p>
                            <p className="text-[28px] font-bold text-white leading-none mb-1">0 <span className="text-[14px] font-normal text-gray-400">days</span></p>
                            <p className="text-gray-500 text-[12px]">Keep the momentum going</p>
                        </div>

                        {/* Practice Time */}
                        <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 relative shadow-sm">
                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#142921] flex items-center justify-center">
                                <ClockIcon className="w-4 h-4 text-[#10B981]" />
                            </div>
                            <p className="text-gray-400 text-[13px] mb-1">Practice time</p>
                            <p className="text-[11px] text-[#10B981] font-medium mb-1">Last 7 days</p>
                            <p className="text-[28px] font-bold text-white leading-none mb-3">6 <span className="text-[14px] font-normal text-gray-400">min</span></p>
                            <div className="border-t border-[#222732] pt-2 flex items-center justify-between">
                                <span className="text-gray-500 text-[11px]">Total tracked</span>
                                <span className="text-gray-400 text-[11px] font-medium">6 min</span>
                            </div>
                        </div>

                        {/* Total Experience */}
                        <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 relative shadow-sm">
                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#21182B] flex items-center justify-center">
                                <LightningIcon className="w-4 h-4 text-[#A855F7]" />
                            </div>
                            <p className="text-gray-400 text-[13px] mb-3">Total experience</p>
                            <p className="text-[28px] font-bold text-white leading-none mb-1">140 XP</p>
                            <p className="text-gray-500 text-[12px]">Every effort adds up</p>
                        </div>
                    </div>

                    {/* 3. Video Walkthrough Tour Card */}
                    {!tourDismissed && (
                        <div className="rounded-2xl bg-[#161316] border border-[#2A1B1E] p-5 flex flex-col sm:flex-row gap-5 relative">
                            <button
                                onClick={() => setTourDismissed(true)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>

                            {/* Video Thumbnail */}
                            <div className="w-[180px] shrink-0">
                                <div className="relative rounded-xl overflow-hidden bg-[#222732] aspect-video">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-11 h-11 rounded-full bg-[#E11D48]/80 flex items-center justify-center">
                                            <PlayCircleIcon className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                        5:38
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-1 bg-[#32181C] text-[#E11D48] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit mb-3">
                                    <span>🧭</span> NEW HERE?
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Take the 5-minute IELTSly dashboard tour</h3>
                                <p className="text-gray-400 text-[13px] mb-4">Learn the diagnostic test, content library, and every feature in one quick walkthrough.</p>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <button className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
                                        <PlayCircleIcon className="w-4 h-4" />
                                        Watch the tour
                                    </button>
                                    <button className="text-[#FF4D4D] text-sm font-semibold hover:underline">
                                        See all 10 tutorials →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Your Next Chapter Banner */}
                    <div className="rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1F1113 0%, #141113 100%)' }}>
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-30">
                            <div className="w-48 h-48 rounded-full border-[3px] border-[#FF4D4D]/30 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border-[2px] border-[#FF4D4D]/20 flex items-center justify-center">
                                    <span className="text-5xl">🐦</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 p-8 max-w-lg">
                            <p className="text-[#FF4D4D] text-[11px] font-bold tracking-widest uppercase mb-3">YOUR NEXT CHAPTER</p>
                            <h2 className="text-[32px] font-extrabold text-white leading-tight mb-3">
                                Big dreams.<br />Small daily steps.
                            </h2>
                            <p className="text-[#A0A6B2] text-[13px] mb-5">Your next band starts with today's practice. Let's make it count, together.</p>
                            <button
                                onClick={() => onNavigate('part_practice')}
                                className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-md"
                            >
                                Continue learning →
                            </button>
                        </div>
                    </div>

                    {/* 5. Practice Skills Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Make time for your skills</h3>
                                <p className="text-gray-400 text-[13px]">Four skills. One step closer to your goal.</p>
                            </div>
                            <button
                                onClick={() => onNavigate('part_practice')}
                                className="text-[#FF4D4D] text-sm font-semibold hover:underline"
                            >
                                All tests →
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { key: 'reading_hub', label: 'Reading', icon: BookOpenIcon, iconBg: '#1E293B', iconColor: '#3B82F6', linkColor: 'text-[#3B82F6]' },
                                { key: 'listening_engine', label: 'Listening', icon: HeadphonesIcon, iconBg: '#2E1E18', iconColor: '#F97316', linkColor: 'text-[#F97316]' },
                                { key: 'writing_lab', label: 'Writing', icon: PenIcon, iconBg: '#142E23', iconColor: '#10B981', linkColor: 'text-[#10B981]' },
                                { key: 'speaking_studio', label: 'Speaking', icon: MicIcon, iconBg: '#261B33', iconColor: '#A855F7', linkColor: 'text-[#A855F7]' },
                            ].map((skill) => {
                                const Icon = skill.icon;
                                return (
                                    <div key={skill.key} className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 flex flex-col shadow-sm">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: skill.iconBg }}>
                                            <Icon className="w-5 h-5" style={{ color: skill.iconColor }} />
                                        </div>
                                        <h4 className="text-[14px] font-bold text-white mb-0.5">{skill.label}</h4>
                                        <p className="text-[12px] text-gray-500 mb-3">No score yet</p>
                                        <button
                                            onClick={() => onNavigate(skill.key)}
                                            className={`text-[13px] font-semibold ${skill.linkColor} hover:underline mt-auto text-left`}
                                        >
                                            Practice →
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 6. Today's Tasks */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Today's Tasks</h3>
                                <p className="text-gray-400 text-[13px]">Your tasks for today (0/1 completed)</p>
                            </div>
                            <button
                                onClick={() => onNavigate('study_plan')}
                                className="text-[#FF4D4D] text-sm font-semibold hover:underline"
                            >
                                View plan →
                            </button>
                        </div>

                        <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <MicIcon className="w-5 h-5 text-[#A855F7]" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-semibold text-white">Format and Assessment Criteria</p>
                                    <p className="text-[12px] text-gray-400 flex items-center gap-1.5">
                                        Speaking · 30 min
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onNavigate('speaking_studio')}
                                className="bg-[#1D1B26] hover:bg-[#252330] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 border border-[#222732]"
                            >
                                Start <span className="text-[#F59E0B]">⚡</span> +20 XP →
                            </button>
                        </div>
                    </div>

                    {/* 7. Guidance from Mihu */}
                    <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#2C1517] border border-rose-500/20 flex items-center justify-center shrink-0">
                                <span className="text-lg">🐦</span>
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-white">A little guidance from Mihu</h3>
                                <p className="text-[11px] text-gray-400">Personalized insights powered by AI</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 mb-4">
                            <p className="text-[15px] font-bold text-white">Keep practicing consistently across all four skills</p>
                            <p className="text-[13px] text-gray-400">Complete your diagnostic test to track progress</p>
                            <p className="text-[13px] text-gray-400">Among the top 19% of learners globally</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#222732]">
                            <p className="text-[11px] text-gray-500">Insights updated daily based on your performance</p>
                            <button
                                onClick={() => onNavigate('ai_ielts_chatbot')}
                                className="text-[#FF4D4D] text-[13px] font-semibold hover:underline"
                            >
                                Ask Mihu →
                            </button>
                        </div>
                    </div>

                    {/* 8. Suggest a Feature */}
                    <div>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-white">Suggest a feature</h3>
                            <p className="text-gray-400 text-[13px]">Share ideas and see what others are asking for</p>
                        </div>

                        <div className="space-y-2 mb-4">
                            {[
                                { text: 'Explanations for reading and listening answers', count: 36 },
                                { text: 'Remove glitches and add an active hotline number', count: 6 },
                                { text: 'Remove bugs and glitches', count: 4 },
                            ].map((f, i) => (
                                <div key={i} className="flex items-center justify-between bg-[#15181E] border border-[#222732] rounded-xl px-4 py-3">
                                    <p className="text-[13px] text-gray-300 flex-1 mr-3">{f.text}</p>
                                    <span className="text-[11px] text-gray-500 shrink-0">👥 {f.count} people interested</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onNavigate('feedback')}
                                className="text-[13px] font-semibold text-gray-300 bg-[#1A1D24] border border-[#222732] hover:text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                + Suggest a feature
                            </button>
                            <button
                                onClick={() => onNavigate('feedback')}
                                className="text-[#FF4D4D] text-[13px] font-semibold hover:underline"
                            >
                                See all →
                            </button>
                        </div>
                    </div>

                </div>

                {/* ═══════════════════════════════════════════
                    RIGHT COLUMN: Progress & Consistency Sidebar (lg:col-span-4)
                ═══════════════════════════════════════════ */}
                <div className="lg:col-span-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pl-2 custom-scrollbar">

                    {/* 5. "Your progress" CARD */}
                    <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-5 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-[15px] font-bold text-white">Your progress</h3>
                            <p className="text-[11px] text-gray-400">Small steps. Measurable progress.</p>
                        </div>

                        {/* Donut Chart */}
                        <div className="flex items-center gap-4 mb-5">
                            <div className="relative w-20 h-20 shrink-0">
                                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="#1E2026" strokeWidth="6" />
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="#FF4D4D" strokeWidth="6"
                                        strokeDasharray="213.6" strokeDashoffset="213.6" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-[18px] font-bold text-white leading-none">—</span>
                                    <span className="text-[9px] text-gray-500 mt-0.5">out of 9.0</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[13px] font-medium text-gray-300">Overall Band</p>
                                <p className="text-[11px] text-gray-500">Take a test to see your band score</p>
                            </div>
                        </div>

                        {/* Skill Breakdown */}
                        <div className="space-y-0">
                            {[
                                { icon: '📖', label: 'Reading', value: '—' },
                                { icon: '🎧', label: 'Listening', value: '—' },
                                { icon: '✍️', label: 'Writing', value: '—' },
                                { icon: '🎙️', label: 'Speaking', value: '—' },
                            ].map((skill, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#222732] last:border-b-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px]">{skill.icon}</span>
                                        <span className="text-[13px] text-gray-300">{skill.label}</span>
                                    </div>
                                    <span className="text-[13px] text-white font-medium">{skill.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer Stats */}
                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#222732]">
                            <div>
                                <p className="text-[20px] font-bold text-white leading-none">0</p>
                                <p className="text-[11px] text-gray-500 mt-1">Questions answered</p>
                            </div>
                            <div>
                                <p className="text-[20px] font-bold text-white leading-none">—</p>
                                <p className="text-[11px] text-gray-500 mt-1">Accuracy rate</p>
                            </div>
                        </div>

                        <button
                            onClick={() => onNavigate('my_reports')}
                            className="text-[#FF4D4D] text-[13px] font-semibold hover:underline mt-4 block"
                        >
                            Explore your reports →
                        </button>
                    </div>

                    {/* 6. "Your consistency" CARD */}
                    <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-5 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-[15px] font-bold text-white">Your consistency</h3>
                            <p className="text-[11px] text-gray-400">Your last 14 days of practice.</p>
                        </div>

                        {/* 7x2 Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {calendarGrid.flat().map((day, i) => {
                                const isGold = goldDays.includes(day);
                                const isCurrent = day === currentDay;
                                return (
                                    <div
                                        key={i}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-[12px] font-medium ${
                                            isCurrent
                                                ? 'bg-[#1E2026] border-2 border-[#FF4D4D] text-white'
                                                : isGold
                                                    ? 'bg-[#1E2026] border border-[#F59E0B]/40 text-white'
                                                    : 'bg-[#121316] text-gray-400 border border-transparent'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-wrap">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                                <span>Completed</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>
                                <span>Partial</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#FF4D4D]"></div>
                                <span>Missed</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#3A3D47]"></div>
                                <span>No activity</span>
                            </div>
                        </div>
                    </div>

                    {/* 7. Diagnostic Test CTA Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#1C1518] to-[#15181E] border border-[#3A1F25] p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-[#E11D48]/15 border border-[#E11D48]/30 flex items-center justify-center">
                                <span className="text-base">🎯</span>
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-white">Diagnostic Test</h4>
                                <p className="text-[11px] text-gray-400">10-min comprehensive audit</p>
                            </div>
                        </div>
                        <p className="text-[12px] text-gray-300 mb-4">
                            Pinpoint your exact IELTS band score across Reading, Listening, Writing, and Speaking in 10 minutes.
                        </p>
                        <button
                            onClick={() => onNavigate('part_practice')}
                            className="w-full py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-[13px] font-semibold transition-all shadow-sm"
                        >
                            Take Diagnostic Test →
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Overview;

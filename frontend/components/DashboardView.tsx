
import React, { useState } from 'react';
import {
    FireIcon, LightningIcon, XIcon,
    PlayCircleIcon, CalendarIcon, BookOpenIcon, MicIcon,
    HeadphonesIcon, PenIcon, TargetIcon, ClockIcon
} from './icons';

interface DashboardViewProps {
    userEmail: string;
    onNavigate: (view: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ userEmail, onNavigate }) => {
    const [tourDismissed, setTourDismissed] = useState(false);
    const username = userEmail.split('@')[0] || 'User';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'GOOD MORNING';
        if (hour < 17) return 'GOOD AFTERNOON';
        return 'GOOD EVENING';
    };

    const calendarGrid = [
        [27, 28, 29, 30, 31, 1, 2],
        [3, 4, 5, 6, 7, 8, 9],
    ];
    const goldDays = [6, 7];
    const currentDay = 9;

    return (
        <div className="p-6 space-y-6">

            {/* ═══════════════════════════════════════════
                SECTION A: Header Greeting Area
            ═══════════════════════════════════════════ */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-secondary text-[11px] font-semibold tracking-widest uppercase mb-1">{getGreeting()}</p>
                    <h1 className="text-[32px] font-bold text-white leading-tight">Welcome back, {username}!</h1>
                    <p className="text-secondary text-sm mt-1">A little practice today. A step closer to your dream score.</p>
                </div>
                <button
                    onClick={() => onNavigate('study_plan')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surfaceAlt border border-border text-secondary text-sm font-medium hover:text-white hover:border-gray-600 transition-all"
                >
                    <CalendarIcon className="w-4 h-4" />
                    View study plan
                </button>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION B: Quick Stats Row (4 Columns)
            ═══════════════════════════════════════════ */}
            <div className="grid grid-cols-4 gap-3">
                {/* 1. Overall Band */}
                <div className="rounded-2xl bg-surface border border-border p-4 relative">
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#2C1819] flex items-center justify-center">
                        <TargetIcon className="w-4 h-4 text-brand" />
                    </div>
                    <p className="text-secondary text-[13px] mb-3">Overall Band</p>
                    <p className="text-[28px] font-bold text-white leading-none mb-1">—</p>
                    <p className="text-muted text-[12px]">Take a test to see your band score</p>
                </div>

                {/* 2. Day Streak */}
                <div className="rounded-2xl bg-surface border border-border p-4 relative">
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#261F18] flex items-center justify-center">
                        <FireIcon className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <p className="text-secondary text-[13px] mb-3">Day Streak</p>
                    <p className="text-[28px] font-bold text-white leading-none mb-1">0 <span className="text-[14px] font-normal text-secondary">days</span></p>
                    <p className="text-muted text-[12px]">Keep the momentum going</p>
                </div>

                {/* 3. Practice Time */}
                <div className="rounded-2xl bg-surface border border-border p-4 relative">
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#142921] flex items-center justify-center">
                        <ClockIcon className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <p className="text-secondary text-[13px] mb-1">Practice time</p>
                    <p className="text-[11px] text-[#10B981] font-medium mb-1">Last 7 days</p>
                    <p className="text-[28px] font-bold text-white leading-none mb-3">6 <span className="text-[14px] font-normal text-secondary">min</span></p>
                    <div className="border-t border-border pt-2 flex items-center justify-between">
                        <span className="text-muted text-[11px]">Total tracked</span>
                        <span className="text-secondary text-[11px] font-medium">6 min</span>
                    </div>
                </div>

                {/* 4. Total Experience */}
                <div className="rounded-2xl bg-surface border border-border p-4 relative">
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#21182B] flex items-center justify-center">
                        <LightningIcon className="w-4 h-4 text-[#A855F7]" />
                    </div>
                    <p className="text-secondary text-[13px] mb-3">Total experience</p>
                    <p className="text-[28px] font-bold text-white leading-none mb-1">140 XP</p>
                    <p className="text-muted text-[12px]">Every effort adds up</p>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION C: Dashboard Tour Card
            ═══════════════════════════════════════════ */}
            {!tourDismissed && (
                <div className="rounded-2xl bg-[#161316] border border-[#2A1B1E] p-5 flex gap-5 relative">
                    <button
                        onClick={() => setTourDismissed(true)}
                        className="absolute top-4 right-4 text-secondary hover:text-white transition-colors"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>

                    {/* Video Thumbnail */}
                    <div className="w-[180px] shrink-0">
                        <div className="relative rounded-xl overflow-hidden bg-surfaceAlt aspect-video">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-11 h-11 rounded-full bg-brand/80 flex items-center justify-center">
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
                        <div className="inline-flex items-center gap-1 bg-[#32181C] text-brand text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit mb-3">
                            <span>🧭</span> NEW HERE?
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Take the 5-minute IELTSly dashboard tour</h3>
                        <p className="text-secondary text-[13px] mb-4">Learn the diagnostic test, content library, and every feature in one quick walkthrough.</p>
                        <div className="flex items-center gap-4">
                            <button className="bg-brandSolid hover:brightness-110 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
                                <PlayCircleIcon className="w-4 h-4" />
                                Watch the tour
                            </button>
                            <button className="text-brand text-sm font-semibold hover:underline">
                                See all 10 tutorials →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════
                SECTION D: Hero Motivation Banner
            ═══════════════════════════════════════════ */}
            <div className="rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1F1113 0%, #141113 100%)' }}>
                {/* Decorative red ring + mascot (right side) */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-30">
                    <div className="w-48 h-48 rounded-full border-[3px] border-[#FF4D4D]/30 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-[2px] border-[#FF4D4D]/20 flex items-center justify-center">
                            <span className="text-5xl">🐦</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 p-8 max-w-lg">
                    <p className="text-brand text-[11px] font-bold tracking-widest uppercase mb-3">YOUR NEXT CHAPTER</p>
                    <h2 className="text-[32px] font-extrabold text-white leading-tight mb-3">
                        Big dreams.<br />Small daily steps.
                    </h2>
                    <p className="text-[#A0A6B2] text-[13px] mb-5">Your next band starts with today's practice. Let's make it count, together.</p>
                    <button className="bg-brandSolid hover:brightness-110 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all">
                        Continue learning →
                    </button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION E: Practice Skills Grid
            ═══════════════════════════════════════════ */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">Make time for your skills</h3>
                        <p className="text-secondary text-[13px]">Four skills. One step closer to your goal.</p>
                    </div>
                    <button className="text-brand text-sm font-semibold hover:underline">All tests →</button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {[
                        { key: 'reading_hub', label: 'Reading', icon: BookOpenIcon, iconBg: '#1E293B', iconColor: '#3B82F6', linkColor: 'text-[#3B82F6]' },
                        { key: 'listening_engine', label: 'Listening', icon: HeadphonesIcon, iconBg: '#2E1E18', iconColor: '#F97316', linkColor: 'text-[#F97316]' },
                        { key: 'writing_lab', label: 'Writing', icon: PenIcon, iconBg: '#142E23', iconColor: '#10B981', linkColor: 'text-[#10B981]' },
                        { key: 'speaking_studio', label: 'Speaking', icon: MicIcon, iconBg: '#261B33', iconColor: '#A855F7', linkColor: 'text-[#A855F7]' },
                    ].map((skill) => {
                        const Icon = skill.icon;
                        return (
                            <div key={skill.key} className="rounded-2xl bg-surface border border-border p-4 flex flex-col">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: skill.iconBg }}>
                                    <Icon className="w-5 h-5" style={{ color: skill.iconColor }} />
                                </div>
                                <h4 className="text-[14px] font-bold text-white mb-0.5">{skill.label}</h4>
                                <p className="text-[12px] text-muted mb-3">No score yet</p>
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

            {/* ═══════════════════════════════════════════
                SECTION F: Today's Tasks
            ═══════════════════════════════════════════ */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">Today's Tasks</h3>
                        <p className="text-secondary text-[13px]">Your tasks for today (0/1 completed)</p>
                    </div>
                    <button className="text-brand text-sm font-semibold hover:underline">View plan →</button>
                </div>

                <div className="rounded-2xl bg-[#16141B] border border-[#251F30] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2C1E3F] flex items-center justify-center">
                            <MicIcon className="w-5 h-5 text-[#A855F7]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-semibold text-white">Format এবং Assessment Criteria</p>
                            <p className="text-[12px] text-secondary flex items-center gap-1.5">
                                Speaking ·
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                30 min
                            </p>
                        </div>
                    </div>
                    <button className="bg-[#1D1B26] hover:bg-[#252330] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
                        Start <span className="text-[#F59E0B]">⚡</span> +20 XP →
                    </button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION G: Guidance Card
            ═══════════════════════════════════════════ */}
            <div className="rounded-2xl bg-[#141215] border border-[#22181A] p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#2C1517] flex items-center justify-center shrink-0">
                        <span className="text-lg">🐦</span>
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-white">A little guidance from Mihu</h3>
                        <p className="text-[11px] text-muted">Personalized insights powered by AI</p>
                    </div>
                </div>

                <div className="space-y-2.5 mb-4">
                    <p className="text-[15px] font-bold text-white">Keep practicing consistently across all four skills</p>
                    <p className="text-[13px] text-secondary">Complete your diagnostic test to track progress</p>
                    <p className="text-[13px] text-secondary">Among the top 19% of learners globally</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#22181A]">
                    <p className="text-[11px] text-muted">Insights updated daily based on your performance</p>
                    <button className="text-brand text-[13px] font-semibold hover:underline">Ask Mihu →</button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION H: Suggest a Feature
            ═══════════════════════════════════════════ */}
            <div>
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-white">Suggest a feature</h3>
                    <p className="text-secondary text-[13px]">Share ideas and see what others are asking for</p>
                </div>

                <div className="space-y-2 mb-4">
                    {[
                        { text: 'Explanations for reading and listening answers', count: 36 },
                        { text: 'Remove glitches and add an active hotline number', count: 6 },
                        { text: 'Remove bugs and glitches', count: 4 },
                    ].map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#17181D] rounded-xl px-4 py-3">
                            <p className="text-[13px] text-secondary flex-1 mr-3">{f.text}</p>
                            <span className="text-[11px] text-muted shrink-0">👥 {f.count} people interested</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-[13px] font-semibold text-secondary bg-surfaceAlt border border-border hover:text-white px-4 py-2 rounded-lg transition-colors">
                        + Suggest a feature
                    </button>
                    <button className="text-brand text-[13px] font-semibold hover:underline">See all →</button>
                </div>
            </div>

        </div>
    );
};

export default DashboardView;

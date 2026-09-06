import React, { useState } from 'react';

// ── Types ──

type ScoreFilter = 'overall' | 'reading' | 'writing' | 'speaking' | 'listening';
type TimeFilter = 'week' | 'month' | 'all';

// ── Inline SVG Icons ──

const FireIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
    </svg>
);

const RotateCwIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
    </svg>
);

const ChevronLeftIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

const TargetIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const ChartBarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

const TrophyIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1 1 9 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75L12 12m0 0l-1.5 1.5m1.5-1.5L13.5 12m-1.5-1.5L12 9m0 0l1.5-1.5M12 9l-1.5-1.5m0 9l1.5-1.5m-1.5 1.5l-1.5-1.5" />
    </svg>
);

const ClockIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const BookOpenIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);

const BoltIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

const LockClosedIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

const PlayIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const SparklesIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
);

const CalendarIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
);

const TrendingUpIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
);

const StarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
);

const SparkleIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
    </svg>
);

// ── Helper: SVG Ring Donut ──

const DonutRing = ({ value, max, color, label }: { value: number; max: number; color: string; label: string }) => {
    const size = 56;
    const stroke = 5;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(value / max, 1);

    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - pct)}
                        className="transition-all duration-700"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-gray-700">{value}</span>
                </div>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</p>
        </div>
    );
};

// ── Achievement Badge ──

const AchievementBadge = ({ name, icon }: { name: string; icon: string }) => (
    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl opacity-60">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <LockClosedIcon className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-[11px] font-semibold text-gray-500 text-center leading-tight">{name}</p>
    </div>
);

// ── Main Component ──

interface StreaksViewProps {
    userEmail?: string;
}

const StreaksView: React.FC<StreaksViewProps> = ({ userEmail }) => {
    const [activeScoreFilter, setActiveScoreFilter] = useState<ScoreFilter>('overall');
    const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('week');

    const currentStreak = 0;
    const monthDays = 0;
    const bestStreak = 0;
    const freezesLeft = 1;

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
    const today = 6; // September 6

    const scoreFilters: { key: ScoreFilter; label: string }[] = [
        { key: 'overall', label: 'Overall' },
        { key: 'reading', label: 'Reading' },
        { key: 'writing', label: 'Writing' },
        { key: 'speaking', label: 'Speaking' },
        { key: 'listening', label: 'Listening' },
    ];

    const timeFilters: { key: TimeFilter; label: string }[] = [
        { key: 'week', label: 'Week' },
        { key: 'month', label: 'Month' },
        { key: 'all', label: 'All' },
    ];

    const streakBadges = ['3-Day Streak', 'Week Warrior', 'Two-Week Titan', 'Monthly Master', 'Century Champion'];
    const practiceBadges = ['First 50', 'Question Cruncher', 'Half-Thousand Hero', '10 Hours In', 'Dedicated Learner'];
    const scoreBadges = ['Band 6 Achiever', 'Band 7 Expert', 'Band 8 Elite'];
    const specialBadges = ['First Step', 'All-Rounder'];

    return (
        <div className="bg-gray-50 min-h-screen p-6 max-w-5xl mx-auto space-y-6">

            {/* ═══ 2.1 HEADER BAR ═══ */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-extrabold text-gray-900">Streaks</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Your IELTS journey at a glance</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <RotateCwIcon className="w-5 h-5" />
                </button>
            </div>

            {/* ═══ 2.2 HERO STREAK CARD & CALENDAR ═══ */}
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm space-y-6 text-center">

                {/* Main Streak Display */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                            <span className="text-3xl font-bold text-white">{currentStreak}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center">
                            <FireIcon className="w-4 h-4 text-orange-500" />
                        </div>
                    </div>
                    <div>
                        <p className="text-[28px] font-bold text-orange-500">{currentStreak} day streak!</p>
                        <p className="text-sm text-gray-500 mt-1">Start your streak today — every great journey begins with day 1.</p>
                    </div>
                </div>

                {/* Weekly Progress Tracker Pills */}
                <div className="flex justify-center gap-3">
                    {weekDays.map((day, i) => (
                        <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold ${
                            i === 6
                                ? 'border-2 border-dashed border-red-500 text-red-500 bg-red-50/50'
                                : 'bg-gray-200 text-gray-500'
                        }`}>
                            {day}
                        </div>
                    ))}
                </div>
                <div>
                    <span className="inline-block px-5 py-1.5 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        Keep Going
                    </span>
                </div>

                {/* KPI Stat Cards Row */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center justify-center gap-1">
                            <FireIcon className="w-3 h-3" /> MONTH
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{monthDays}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">days practiced</p>
                    </div>
                    <div className="bg-yellow-50/60 border border-yellow-100 rounded-2xl p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-500 flex items-center justify-center gap-1">
                            <TrophyIcon className="w-3 h-3" /> BEST
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{bestStreak}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">longest streak</p>
                    </div>
                    <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center justify-center gap-1">
                            ❄️ FREEZE
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{freezesLeft}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">freezes left</p>
                    </div>
                </div>

                {/* Calendar Month View (September 2026) */}
                <div className="space-y-3 pt-2">
                    {/* Month Bar */}
                    <div className="flex items-center justify-center gap-4">
                        <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-semibold text-gray-900">September 2026</span>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronRightIcon className="w-5 h-5" /></button>
                    </div>

                    {/* Day Header Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d) => (
                            <div key={d} className="text-[10px] font-bold text-gray-400 uppercase py-1">{d}</div>
                        ))}
                    </div>

                    {/* Date Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {/* Empty slots before Sept 1 (starts on Tuesday = index 2) */}
                        <div />
                        <div />
                        {calendarDays.map((day) => (
                            <div
                                key={day}
                                className={`py-1.5 text-sm rounded-lg ${
                                    day === today
                                        ? 'border-2 border-dashed border-red-500 text-red-500 font-bold bg-red-50/50'
                                        : 'text-gray-700'
                                }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Streak Freeze Button */}
                <button className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-blue-200 bg-blue-50/40 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">
                    ❄️ Use Streak Freeze ({freezesLeft} left)
                </button>

                {/* Footer Divider */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">Activity · last 180 days</p>
                    <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* ═══ 2.3 ROW 2: DAILY GOALS & TODAY'S ACTIVITY ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Daily Goals */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <TargetIcon className="w-4 h-4 text-gray-500" />
                                <h3 className="text-sm font-bold text-gray-900">Daily Goals</h3>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">Resets at midnight</p>
                        </div>
                        <button className="text-gray-300 hover:text-gray-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center justify-around">
                        <DonutRing value={0} max={30} color="#f43f5e" label="MINUTES" />
                        <DonutRing value={0} max={20} color="#3b82f6" label="QUESTIONS" />
                        <DonutRing value={0} max={3} color="#22c55e" label="TASKS" />
                    </div>
                </div>

                {/* Today's Activity */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm text-center flex flex-col">
                    <div className="flex items-center justify-center gap-2 mb-5">
                        <ChartBarIcon className="w-4 h-4 text-gray-500" />
                        <h3 className="text-sm font-bold text-gray-900">Today's Activity</h3>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-3">
                        <SparklesIcon className="w-12 h-12 text-gray-300" />
                        <div>
                            <p className="text-sm font-bold text-gray-700">No activity yet today</p>
                            <p className="text-[12px] text-gray-400 mt-1">Start practicing now to keep that flame alive 🔥</p>
                        </div>
                    </div>
                    <button className="mt-4 w-full py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
                        Start Practicing <PlayIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ═══ 2.4 ROW 3: SCORE TREND ═══ */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <TrendingUpIcon className="w-4 h-4 text-gray-500" />
                            <h3 className="text-sm font-bold text-gray-900">Score Trend</h3>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">Band progression</p>
                    </div>
                    <div className="flex bg-gray-100 rounded-full p-1">
                        {scoreFilters.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setActiveScoreFilter(f.key)}
                                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
                                    activeScoreFilter === f.key
                                        ? 'bg-red-600 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <TrendingUpIcon className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-bold text-gray-600">Not enough data yet</p>
                    <p className="text-[12px] text-gray-400 mt-1">Complete at least 2 tests to see your trend.</p>
                </div>
            </div>

            {/* ═══ 2.5 ROW 4: SUMMARY & PRACTICE MIX ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Summary */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <ChartBarIcon className="w-4 h-4 text-gray-500" />
                                <h3 className="text-sm font-bold text-gray-900">Summary</h3>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">At-a-glance totals</p>
                        </div>
                        <div className="flex bg-gray-100 rounded-full p-0.5">
                            {timeFilters.map((f) => (
                                <button
                                    key={f.key}
                                    onClick={() => setActiveTimeFilter(f.key)}
                                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                                        activeTimeFilter === f.key
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-center">
                            <ClockIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-gray-900">0m</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Practice Time</p>
                        </div>
                        <div className="bg-yellow-50/60 border border-yellow-100 rounded-2xl p-4 text-center">
                            <TrophyIcon className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-gray-900">0</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tests Completed</p>
                        </div>
                        <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 text-center">
                            <BookOpenIcon className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-gray-900">0</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Questions</p>
                        </div>
                        <div className="bg-green-50/60 border border-green-100 rounded-2xl p-4 text-center">
                            <TargetIcon className="w-5 h-5 text-green-500 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-gray-900">—</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Band</p>
                        </div>
                    </div>
                </div>

                {/* Practice Mix */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm text-center flex flex-col">
                    <div className="flex items-center justify-center gap-2 mb-5">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                        </svg>
                        <h3 className="text-sm font-bold text-gray-900">Practice Mix</h3>
                    </div>
                    <p className="text-[11px] text-gray-400 mb-4">Time per module</p>
                    <div className="flex-1 flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-600">No data yet</p>
                            <p className="text-[12px] text-gray-400 mt-1">Complete tests to see your mix.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ 2.6 ROW 5: ACHIEVEMENTS ═══ */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🎖️</span>
                            <h3 className="text-sm font-bold text-gray-900">Achievements</h3>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">0/15 unlocked</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">0%</span>
                </div>

                {/* 🔥 STREAK */}
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">🔥 STREAK 0/5</p>
                    <div className="grid grid-cols-5 gap-3">
                        {streakBadges.map((name) => (
                            <AchievementBadge key={name} name={name} icon="🔒" />
                        ))}
                    </div>
                </div>

                {/* 📝 PRACTICE */}
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">📝 PRACTICE 0/5</p>
                    <div className="grid grid-cols-5 gap-3">
                        {practiceBadges.map((name) => (
                            <AchievementBadge key={name} name={name} icon="🔒" />
                        ))}
                    </div>
                </div>

                {/* ⭐ SCORE */}
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">⭐ SCORE 0/3</p>
                    <div className="grid grid-cols-3 gap-3">
                        {scoreBadges.map((name) => (
                            <AchievementBadge key={name} name={name} icon="🔒" />
                        ))}
                    </div>
                </div>

                {/* 🎪 SPECIAL */}
                <div>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">🎪 SPECIAL 0/2</p>
                    <div className="grid grid-cols-2 gap-3">
                        {specialBadges.map((name) => (
                            <AchievementBadge key={name} name={name} icon="🔒" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreaksView;

import React, { useState, useMemo } from 'react';

// ── Types ──

interface LeaderboardUser {
    rank: number;
    name: string;
    initials: string;
    band: number;
    streak: number;
    badge: string;
    avatarColor: string;
    isCurrentUser?: boolean;
}

interface StreakUser {
    rank: number;
    name: string;
    initials: string;
    longestStreak: number;
    currentStreak: number;
    avatarColor: string;
    isCurrentUser?: boolean;
}

interface WeeklyXPUser {
    rank: number;
    name: string;
    initials: string;
    weeklyXP: number;
    lifetimeXP: number;
    league: string;
    avatarColor: string;
    isCurrentUser?: boolean;
}

type FilterTab = 'band' | 'streaks' | 'weekly_xp';
type StreakScope = 'global' | 'country';

// ── Mock Data: Band League ──

const BAND_MOCK_USERS: LeaderboardUser[] = [
    { rank: 1, name: 'Nafisa Rahman', initials: 'NR', band: 9.0, streak: 30, badge: '🥇 GOLD', avatarColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
    { rank: 2, name: 'Farhan Ahmed', initials: 'FA', band: 8.5, streak: 24, badge: '🥈 SILVER', avatarColor: 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30' },
    { rank: 3, name: 'Sadia Kabir', initials: 'SK', band: 8.0, streak: 18, badge: '🥉 BRONZE', avatarColor: 'bg-orange-500/15 text-orange-400 border border-orange-500/30' },
    { rank: 4, name: 'Tanvir Hossain', initials: 'TH', band: 7.5, streak: 15, badge: 'Bronze', avatarColor: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' },
    { rank: 5, name: 'Mim Akter', initials: 'MA', band: 7.0, streak: 12, badge: 'Bronze', avatarColor: 'bg-violet-500/15 text-violet-400 border border-violet-500/30' },
    { rank: 6, name: 'Hasan Ali', initials: 'HA', band: 6.8, streak: 10, badge: 'Bronze', avatarColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30' },
    { rank: 7, name: 'Nusrat Jahan', initials: 'NJ', band: 6.5, streak: 8, badge: 'Bronze', avatarColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    { rank: 8, name: 'Rakibul Hasan', initials: 'RH', band: 6.0, streak: 5, badge: 'Bronze', avatarColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
    { rank: 9, name: 'Labiba Noor', initials: 'LN', band: 5.5, streak: 3, badge: 'Bronze', avatarColor: 'bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30' },
    { rank: 10, name: 'Imran Sheikh', initials: 'IS', band: 5.0, streak: 1, badge: 'Bronze', avatarColor: 'bg-teal-500/15 text-teal-400 border border-teal-500/30' },
];

// ── Mock Data: Streaks ──

const STREAK_GLOBAL_USERS: StreakUser[] = [
    { rank: 1, name: 'shashanka', initials: 'SK', longestStreak: 39, currentStreak: 39, avatarColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
    { rank: 2, name: 'MEHEDI HASAN FAHIM', initials: 'MF', longestStreak: 34, currentStreak: 34, avatarColor: 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30' },
    { rank: 3, name: 'Nafisa Rahman', initials: 'NR', longestStreak: 30, currentStreak: 28, avatarColor: 'bg-orange-500/15 text-orange-400 border border-orange-500/30' },
    { rank: 4, name: 'Farhan Ahmed', initials: 'FA', longestStreak: 24, currentStreak: 22, avatarColor: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' },
    { rank: 5, name: 'Sadia Kabir', initials: 'SK', longestStreak: 21, currentStreak: 18, avatarColor: 'bg-violet-500/15 text-violet-400 border border-violet-500/30' },
    { rank: 6, name: 'Tanvir Hossain', initials: 'TH', longestStreak: 18, currentStreak: 15, avatarColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30' },
    { rank: 7, name: 'Mim Akter', initials: 'MA', longestStreak: 15, currentStreak: 12, avatarColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    { rank: 8, name: 'Hasan Ali', initials: 'HA', longestStreak: 12, currentStreak: 10, avatarColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
    { rank: 9, name: 'Nusrat Jahan', initials: 'NJ', longestStreak: 10, currentStreak: 8, avatarColor: 'bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30' },
    { rank: 10, name: 'Rakibul Hasan', initials: 'RH', longestStreak: 8, currentStreak: 5, avatarColor: 'bg-teal-500/15 text-teal-400 border border-teal-500/30' },
];

const CURRENT_STREAK_USER: StreakUser = {
    rank: 1008,
    name: 'YOU',
    initials: 'AY',
    longestStreak: 1,
    currentStreak: 1,
    avatarColor: 'bg-rose-600 text-white',
    isCurrentUser: true,
};

// ── Mock Data: Weekly XP ──

const WEEKLY_XP_USERS: WeeklyXPUser[] = [
    { rank: 1, name: 'Nafisa Rahman', initials: 'NR', weeklyXP: 280, lifetimeXP: 1450, league: 'Bronze', avatarColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
    { rank: 2, name: 'Farhan Ahmed', initials: 'FA', weeklyXP: 245, lifetimeXP: 1320, league: 'Bronze', avatarColor: 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30' },
    { rank: 3, name: 'Sadia Kabir', initials: 'SK', weeklyXP: 210, lifetimeXP: 1180, league: 'Bronze', avatarColor: 'bg-orange-500/15 text-orange-400 border border-orange-500/30' },
    { rank: 4, name: 'Tanvir Hossain', initials: 'TH', weeklyXP: 190, lifetimeXP: 1050, league: 'Bronze', avatarColor: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' },
    { rank: 5, name: 'Mim Akter', initials: 'MA', weeklyXP: 175, lifetimeXP: 980, league: 'Bronze', avatarColor: 'bg-violet-500/15 text-violet-400 border border-violet-500/30' },
    { rank: 6, name: 'Hasan Ali', initials: 'HA', weeklyXP: 160, lifetimeXP: 920, league: 'Bronze', avatarColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30' },
    { rank: 7, name: 'Nusrat Jahan', initials: 'NJ', weeklyXP: 145, lifetimeXP: 860, league: 'Bronze', avatarColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    { rank: 8, name: 'Rakibul Hasan', initials: 'RH', weeklyXP: 130, lifetimeXP: 790, league: 'Bronze', avatarColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
    { rank: 9, name: 'Labiba Noor', initials: 'LN', weeklyXP: 115, lifetimeXP: 720, league: 'Bronze', avatarColor: 'bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30' },
    { rank: 10, name: 'Imran Sheikh', initials: 'IS', weeklyXP: 100, lifetimeXP: 650, league: 'Bronze', avatarColor: 'bg-teal-500/15 text-teal-400 border border-teal-500/30' },
    { rank: 11, name: 'Towhid Islam', initials: 'TI', weeklyXP: 95, lifetimeXP: 600, league: 'Bronze', avatarColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
    { rank: 12, name: 'Sabrina Akter', initials: 'SA', weeklyXP: 88, lifetimeXP: 560, league: 'Bronze', avatarColor: 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30' },
    { rank: 13, name: 'Kamal Hossain', initials: 'KH', weeklyXP: 82, lifetimeXP: 520, league: 'Bronze', avatarColor: 'bg-orange-500/15 text-orange-400 border border-orange-500/30' },
    { rank: 14, name: 'Ruma Begum', initials: 'RB', weeklyXP: 76, lifetimeXP: 490, league: 'Bronze', avatarColor: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' },
    { rank: 15, name: 'Jahidul Islam', initials: 'JI', weeklyXP: 70, lifetimeXP: 450, league: 'Bronze', avatarColor: 'bg-violet-500/15 text-violet-400 border border-violet-500/30' },
    { rank: 16, name: 'Priya Das', initials: 'PD', weeklyXP: 64, lifetimeXP: 410, league: 'Bronze', avatarColor: 'bg-rose-500/15 text-rose-400 border border-rose-500/30' },
    { rank: 17, name: 'Shanto Roy', initials: 'SR', weeklyXP: 58, lifetimeXP: 380, league: 'Bronze', avatarColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    { rank: 18, name: 'YOU', initials: 'AY', weeklyXP: 50, lifetimeXP: 100, league: 'Bronze', avatarColor: 'bg-rose-600 text-white', isCurrentUser: true },
    { rank: 19, name: 'Mizanur Rahman', initials: 'MR', weeklyXP: 44, lifetimeXP: 320, league: 'Bronze', avatarColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
    { rank: 20, name: 'Fatema Begum', initials: 'FB', weeklyXP: 38, lifetimeXP: 280, league: 'Bronze', avatarColor: 'bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30' },
];

const CURRENT_XP_USER: WeeklyXPUser = {
    rank: 18,
    name: 'YOU',
    initials: 'AY',
    weeklyXP: 50,
    lifetimeXP: 100,
    league: 'Bronze',
    avatarColor: 'bg-rose-600 text-white',
    isCurrentUser: true,
};

const TIERS = [
    { label: 'Bronze', letter: 'B', color: 'text-orange-400', activeColor: 'bg-amber-400 text-black border-2 border-amber-300 shadow-md shadow-amber-400/20 scale-110' },
    { label: 'Silver', letter: 'S', color: 'text-zinc-300', activeColor: '' },
    { label: 'Gold', letter: 'G', color: 'text-amber-400', activeColor: '' },
    { label: 'Platinum', letter: 'P', color: 'text-cyan-400', activeColor: '' },
    { label: 'Diamond', letter: 'D', color: 'text-violet-400', activeColor: '' },
];

// ── Inline SVG Icons ──

const FlameIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
    </svg>
);

const ArrowUpIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
    </svg>
);

const BoltIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

// ── Main Component ──

interface LeaderboardViewProps {
    userEmail?: string;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ userEmail }) => {
    const [activeTab, setActiveTab] = useState<FilterTab>('band');
    const [streakScope, setStreakScope] = useState<StreakScope>('global');

    const sortedBandUsers = useMemo(() => {
        return [...BAND_MOCK_USERS].sort((a, b) => b.band - a.band);
    }, []);

    const sortedStreakUsers = useMemo(() => {
        return [...STREAK_GLOBAL_USERS].sort((a, b) => b.longestStreak - a.longestStreak);
    }, []);

    const sortedWeeklyXPUsers = useMemo(() => {
        return [...WEEKLY_XP_USERS].sort((a, b) => b.weeklyXP - a.weeklyXP);
    }, []);

    const isUnranked = CURRENT_STREAK_USER.rank === 0;

    const tabButtonClass = (tab: FilterTab) =>
        `px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === tab
                ? 'bg-zinc-800 text-white shadow'
                : 'text-zinc-400 hover:text-white'
        }`;

    const streakScopeClass = (scope: StreakScope) =>
        `px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
            streakScope === scope
                ? 'bg-[#1E2638] text-white font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
        }`;

    const bandRankBadge = (rank: number) => {
        if (rank === 1) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/15 text-amber-400 text-xs font-bold border border-amber-400/30">#1</span>;
        if (rank === 2) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-400/15 text-zinc-300 text-xs font-bold border border-zinc-400/30">#2</span>;
        if (rank === 3) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-400/15 text-orange-400 text-xs font-bold border border-orange-400/30">#3</span>;
        return <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold text-zinc-500">#{rank}</span>;
    };

    const streakRankBadge = (rank: number) => {
        if (rank === 1) return <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-400 text-black font-extrabold text-xs px-2.5 py-1 rounded-md">#1</span>;
        if (rank === 2) return <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-300 text-black font-extrabold text-xs px-2.5 py-1 rounded-md">#2</span>;
        if (rank === 3) return <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-700 text-white font-extrabold text-xs px-2.5 py-1 rounded-md">#3</span>;
        return <span className="inline-flex items-center justify-center w-7 text-center text-xs font-bold text-zinc-400">{rank}</span>;
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#0B0C0E] text-zinc-100 font-sans p-6 space-y-6">
            {/* ═══ HEADER ═══ */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Leaderboard</h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        {activeTab === 'streaks'
                            ? streakScope === 'global'
                                ? '3329 learners · 🔥 Global streaks'
                                : 'Loading... · 🔥 Unknown streaks'
                            : activeTab === 'weekly_xp'
                                ? '3329 learners · Global'
                                : '1 learners · Bronze League'}
                    </p>
                </div>
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-full p-1 items-center gap-1">
                    <button onClick={() => setActiveTab('band')} className={tabButtonClass('band')}>Band League</button>
                    <button onClick={() => setActiveTab('streaks')} className={tabButtonClass('streaks')}>🔥 Streaks</button>
                    <button onClick={() => setActiveTab('weekly_xp')} className={tabButtonClass('weekly_xp')}>⚡ Weekly XP</button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════ */}
            {/* ═══ STREAKS VIEW ═══ */}
            {/* ═══════════════════════════════════════════════════ */}
            {activeTab === 'streaks' && (
                <>
                    {/* Sub-Navigation: Global vs Country */}
                    <div className="bg-[#121620] border border-zinc-800/80 rounded-full p-1 inline-flex items-center gap-1">
                        <button onClick={() => setStreakScope('global')} className={streakScopeClass('global')}>
                            🌐 Global
                        </button>
                        <button onClick={() => setStreakScope('country')} className={streakScopeClass('country')}>
                            📍 Country
                        </button>
                    </div>

                    {/* User Streaks Hero Card */}
                    <div className="bg-[#10141E] border border-zinc-800/80 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
                        {/* Center Flame Icon */}
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20">
                            <span className="text-2xl">🔥</span>
                        </div>
                        <h2 className="text-xl font-black text-white">
                            {streakScope === 'global' ? 'Global Streaks' : 'Unknown Streaks'}
                        </h2>
                        <p className="text-zinc-400 text-xs mt-1">Ranked by current daily streak</p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 border-t border-zinc-800/80 mt-6 pt-4 text-center">
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">YOUR RANK</p>
                                <p className={`text-xl font-extrabold mt-1 ${isUnranked ? 'text-rose-500' : 'text-rose-500'}`}>
                                    #{CURRENT_STREAK_USER.rank}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">CURRENT STREAK</p>
                                <p className="text-xl font-extrabold text-white mt-1 flex items-center justify-center gap-1">
                                    {CURRENT_STREAK_USER.currentStreak} 🔥
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">LONGEST STREAK</p>
                                <p className="text-xl font-extrabold text-white mt-1 flex items-center justify-center gap-1">
                                    {CURRENT_STREAK_USER.longestStreak} 🔥
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Streaks Leaderboard List */}
                    {streakScope === 'country' ? (
                        <div className="bg-[#10141E] border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-400 text-sm font-medium">
                            No leaderboard data available.
                        </div>
                    ) : (
                        <div className="bg-[#10141E] border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/50">
                            {sortedStreakUsers.map((user) => (
                                <div key={user.rank} className={`px-6 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors`}>
                                    {/* Left Section */}
                                    <div className="flex items-center">
                                        {/* Rank Badge */}
                                        <div className="w-7 shrink-0 flex justify-center">
                                            {streakRankBadge(user.rank)}
                                        </div>

                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-bold text-white text-sm ml-4 ${
                                            user.rank <= 3 ? 'border-2 border-amber-400' : 'bg-zinc-700 border border-zinc-600'
                                        } ${user.avatarColor}`}>
                                            {user.initials}
                                        </div>

                                        {/* User Info */}
                                        <div className="ml-3">
                                            <p className="text-sm font-bold text-white">{user.name}</p>
                                            <p className="text-[11px] font-semibold text-zinc-400 uppercase mt-0.5">
                                                🔥 LONGEST {user.longestStreak}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    <div className="text-right">
                                        <p className="text-lg font-extrabold text-white">{user.longestStreak}</p>
                                        <div className="flex items-center justify-end gap-1">
                                            <span className="text-sm">🔥</span>
                                            <span className="text-[9px] font-bold text-zinc-400 tracking-wider">DAYS</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Current User Row */}
                            <div className="px-6 py-4 flex items-center justify-between bg-[#210D15] hover:bg-[#2A111B] border-l-4 border-rose-600 transition-colors">
                                <div className="flex items-center">
                                    <div className="w-7 shrink-0 flex justify-center">
                                        <span className="text-rose-500 font-extrabold text-sm">{CURRENT_STREAK_USER.rank}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-rose-600 ml-4">
                                        {CURRENT_STREAK_USER.initials}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-rose-500 font-black text-sm tracking-wide">YOU</p>
                                        <p className="text-[11px] font-semibold text-rose-400/70 uppercase mt-0.5">
                                            🔥 LONGEST {CURRENT_STREAK_USER.longestStreak}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-extrabold text-rose-500">{CURRENT_STREAK_USER.longestStreak}</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <span className="text-sm">🔥</span>
                                        <span className="text-[9px] font-bold text-zinc-400 tracking-wider">DAYS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════════════════════════════════════════════════ */}
            {/* ═══ WEEKLY XP VIEW ═══ */}
            {/* ═══════════════════════════════════════════════════ */}
            {activeTab === 'weekly_xp' && (
                <>
                    {/* League Hero Card */}
                    <div className="bg-[#10141E] border border-zinc-800/80 rounded-2xl p-6 text-center shadow-xl relative">
                        {/* League Badges Bar */}
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {TIERS.map((tier) => (
                                <div key={tier.label} className="relative">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                        tier.letter === 'B'
                                            ? tier.activeColor
                                            : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50'
                                    }`}>
                                        {tier.letter}
                                    </div>
                                    {/* Red notification dot for active Bronze */}
                                    {tier.letter === 'B' && (
                                        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <h2 className="text-2xl font-black text-white mt-1">Bronze XP League</h2>
                        <p className="text-zinc-400 text-xs mt-1">Top 3 earn promotion · Bottom 5 at risk</p>

                        {/* Timer Pill */}
                        <div className="mt-3 inline-flex items-center gap-1 bg-amber-950/40 text-amber-400 border border-amber-800/50 px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider">
                            ⏱ 6 DAYS LEFT
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 border-t border-zinc-800/80 mt-6 pt-4 text-center">
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">YOUR RANK</p>
                                <p className="text-xl font-extrabold text-rose-500 mt-1">#{CURRENT_XP_USER.rank}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">THIS WEEK</p>
                                <p className="text-xl font-extrabold text-white mt-1 flex items-center justify-center gap-1">
                                    {CURRENT_XP_USER.weeklyXP} ⚡
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">LIFETIME</p>
                                <p className="text-xl font-extrabold text-white mt-1">{CURRENT_XP_USER.lifetimeXP}</p>
                            </div>
                        </div>
                    </div>

                    {/* Weekly XP Leaderboard List */}
                    <div className="bg-[#10141E] border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/50">
                        {sortedWeeklyXPUsers.map((user, idx) => (
                            <React.Fragment key={user.rank}>
                                {/* Promotion Zone Divider — strictly between rank 3 and 4 */}
                                {idx === 3 && (
                                    <div className="bg-[#07241A] border-y border-emerald-800/60 py-2 px-6 flex items-center justify-between text-emerald-400 text-[11px] font-bold tracking-widest uppercase">
                                        <span>▲</span>
                                        <span>PROMOTION ZONE</span>
                                        <span>▲</span>
                                    </div>
                                )}

                                {/* User Row */}
                                <div className={`px-6 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors ${
                                    user.isCurrentUser
                                        ? 'bg-[#210D15] hover:bg-[#2A111B] border-l-4 border-rose-600'
                                        : ''
                                }`}>
                                    {/* Left Section */}
                                    <div className="flex items-center">
                                        {/* Rank Number */}
                                        <div className="w-7 shrink-0 flex justify-center">
                                            <span className={`font-bold text-sm ${
                                                user.isCurrentUser
                                                    ? 'text-rose-500 font-extrabold'
                                                    : user.rank <= 3
                                                        ? 'text-amber-400 font-extrabold'
                                                        : 'text-zinc-400'
                                            }`}>
                                                {user.rank}
                                            </span>
                                        </div>

                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ml-4 ${
                                            user.isCurrentUser
                                                ? 'bg-rose-600'
                                                : 'bg-zinc-700 border border-zinc-600'
                                        } ${user.isCurrentUser ? '' : user.avatarColor}`}>
                                            {user.initials}
                                        </div>

                                        {/* User Info */}
                                        <div className="ml-3">
                                            <p className={`text-sm font-bold ${
                                                user.isCurrentUser ? 'text-rose-500 font-black tracking-wide' : 'text-white'
                                            }`}>
                                                {user.isCurrentUser ? 'YOU' : user.name}
                                            </p>
                                            <p className={`text-xs mt-0.5 ${
                                                user.isCurrentUser ? 'text-rose-400/70' : 'text-zinc-400'
                                            }`}>
                                                {user.league} league
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right XP Value */}
                                    <div className="text-right">
                                        <p className={`text-sm font-extrabold ${
                                            user.isCurrentUser ? 'text-rose-500' : 'text-white'
                                        }`}>
                                            {user.isCurrentUser ? CURRENT_XP_USER.weeklyXP : user.weeklyXP} ⚡ XP
                                        </p>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </>
            )}

            {/* ═══════════════════════════════════════════════════ */}
            {/* ═══ BAND LEAGUE VIEW ═══ */}
            {/* ═══════════════════════════════════════════════════ */}
            {activeTab === 'band' && (
                <>
                    {/* ═══ HERO LEAGUE STATUS CARD ═══ */}
                    <div className="bg-[#10141E] border border-zinc-800/80 rounded-2xl p-6 text-center shadow-xl">
                        {/* Tier Badges */}
                        <div className="flex items-center justify-center gap-4 mb-5">
                            {TIERS.map((tier, i) => (
                                <div key={tier.label} className="flex flex-col items-center gap-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold ${tier.color} ${
                                        tier.label === 'Bronze' && i === 0 ? 'bg-orange-500/10 border border-orange-500/30 ring-2 ring-orange-500/20' : 'bg-zinc-800/80 border border-zinc-700/50'
                                    }`}>
                                        {tier.label === 'Bronze' ? '🥉' : tier.label === 'Silver' ? '🥈' : tier.label === 'Gold' ? '🥇' : tier.label === 'Diamond' ? '💎' : '👑'}
                                    </div>
                                    <span className="text-[10px] text-zinc-500 font-medium">{tier.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* League Name */}
                        <h2 className="text-xl font-bold text-white mb-1">Bronze League</h2>
                        <p className="text-sm text-zinc-500 mb-4">Band 0.0 – 5.5</p>

                        {/* Countdown */}
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[12px] font-semibold mb-6">
                            ⏰ 7 DAYS LEFT
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 border-t border-zinc-800/80 pt-4">
                            <div className="px-4">
                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Your Rank</p>
                                <p className="text-2xl font-bold text-rose-500">#?</p>
                            </div>
                            <div className="px-4">
                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Band Score</p>
                                <p className="text-2xl font-bold text-white">0.0</p>
                            </div>
                            <div className="px-4">
                                <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">Streak</p>
                                <p className="text-2xl font-bold text-white">0 <FlameIcon className="w-5 h-5 inline text-orange-400" /></p>
                            </div>
                        </div>
                    </div>

                    {/* ═══ RANKINGS LIST ═══ */}
                    <div className="bg-[#10141E] border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/50">
                        {sortedBandUsers.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-zinc-400 text-sm">No leaderboard data available.</p>
                            </div>
                        ) : (
                            <>
                                {sortedBandUsers.map((user, idx) => (
                                    <React.Fragment key={user.rank}>
                                        {/* Promotion Zone Divider */}
                                        {idx === 3 && (
                                            <div className="bg-[#07241A] border-y border-emerald-800/60 py-2 px-4 text-center">
                                                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                                                    <ArrowUpIcon className="w-3.5 h-3.5" />
                                                    PROMOTION ZONE
                                                    <ArrowUpIcon className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                        )}

                                        <div className={`flex items-center gap-4 px-5 py-3.5 border-b border-zinc-800/50 last:border-b-0 transition-colors ${
                                            user.isCurrentUser ? 'bg-[#210D15] border-l-4 border-rose-600' : 'hover:bg-zinc-800/30'
                                        }`}>
                                            {/* Rank Badge */}
                                            <div className="w-8 shrink-0">
                                                {bandRankBadge(user.rank)}
                                            </div>

                                            {/* Avatar */}
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                                                user.rank <= 3 ? 'border-2 border-amber-400' : ''
                                            } ${user.avatarColor}`}>
                                                {user.initials}
                                            </div>

                                            {/* User Details */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-semibold ${user.isCurrentUser ? 'text-rose-500' : 'text-white'}`}>
                                                    {user.isCurrentUser ? 'YOU' : user.name}
                                                </p>
                                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                                    Band {user.band.toFixed(1)} learner · {user.badge}
                                                </p>
                                            </div>

                                            {/* Right Metrics */}
                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-white">{user.band.toFixed(1)} <span className="text-[10px] font-medium text-zinc-400">BAND</span></p>
                                                </div>
                                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[12px] font-semibold">
                                                    <FlameIcon className="w-3.5 h-3.5" />
                                                    {user.streak}
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}

                                {/* Current User (Unranked) at Bottom */}
                                <div className="flex items-center gap-4 px-5 py-3.5 bg-[#210D15] border-t-2 border-rose-800/60">
                                    <div className="w-8 shrink-0">
                                        <span className="inline-flex items-center justify-center w-7 h-7 text-sm font-bold text-rose-500">#?</span>
                                    </div>
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 bg-rose-600 text-white">
                                        AY
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-rose-500">YOU</p>
                                        <p className="text-[11px] text-zinc-400 mt-0.5">
                                            Band 0.0 learner · Unranked
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white">0.0 <span className="text-[10px] font-medium text-zinc-400">BAND</span></p>
                                        </div>
                                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500 text-[12px] font-semibold">
                                            <FlameIcon className="w-3.5 h-3.5" />
                                            0
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default LeaderboardView;

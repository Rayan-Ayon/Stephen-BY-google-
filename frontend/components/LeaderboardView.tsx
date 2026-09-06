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

type FilterTab = 'band' | 'streaks' | 'weekly_xp';
type FilterPill = 'bronze' | 'global' | 'country';

// ── Mock Data ──

const MOCK_USERS: LeaderboardUser[] = [
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

const CURRENT_USER: LeaderboardUser = {
    rank: 0,
    name: 'YOU',
    initials: 'AY',
    band: 0.0,
    streak: 0,
    badge: 'Unranked',
    avatarColor: 'bg-red-500/15 text-red-400 border border-red-500/30',
    isCurrentUser: true,
};

const TIERS = [
    { label: 'Bronze', count: 3, color: 'text-orange-400', ring: 'ring-orange-500/30' },
    { label: 'Silver', count: 2, color: 'text-zinc-300', ring: 'ring-zinc-500/30' },
    { label: 'Gold', count: 1, color: 'text-amber-400', ring: 'ring-amber-500/30' },
    { label: 'Diamond', count: 0, color: 'text-cyan-400', ring: 'ring-cyan-500/30' },
    { label: 'Crown', count: 0, color: 'text-violet-400', ring: 'ring-violet-500/30' },
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

const TrophyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1 1 9 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75L12 12m0 0l-1.5 1.5m1.5-1.5L13.5 12m-1.5-1.5L12 9m0 0l1.5-1.5M12 9l-1.5-1.5m0 9l1.5-1.5m-1.5 1.5l-1.5-1.5" />
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
    const [activePill, setActivePill] = useState<FilterPill>('bronze');

    const sortedUsers = useMemo(() => {
        const sorted = [...MOCK_USERS].sort((a, b) => {
            if (activeTab === 'band') return b.band - a.band;
            if (activeTab === 'streaks') return b.streak - a.streak;
            return b.streak - a.streak;
        });
        return sorted;
    }, [activeTab]);

    const isUnranked = CURRENT_USER.band === 0;
    const leagueName = activePill === 'bronze' ? 'Bronze League' : activePill === 'global' ? 'Global' : 'Country';
    const leagueSubtext = activePill === 'bronze' ? 'Band 0.0 – 5.5' : 'All regions';

    const tabButtonClass = (tab: FilterTab) =>
        `px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
            activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
        }`;

    const pillButtonClass = (pill: FilterPill) =>
        `px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
            activePill === pill
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`;

    const rankBadge = (rank: number) => {
        if (rank === 1) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/15 text-amber-400 text-xs font-bold border border-amber-400/30">#1</span>;
        if (rank === 2) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-400/15 text-zinc-300 text-xs font-bold border border-zinc-400/30">#2</span>;
        if (rank === 3) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-400/15 text-orange-400 text-xs font-bold border border-orange-400/30">#3</span>;
        return <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold text-gray-400">#{rank}</span>;
    };

    const unrankedBadge = () => (
        <span className="inline-flex items-center justify-center w-7 h-7 text-sm font-bold text-red-400">#?</span>
    );

    return (
        <div className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 font-sans p-6 space-y-6">
            {/* ═══ HEADER ═══ */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-white tracking-tight">Leaderboard</h1>
                    <p className="text-sm text-zinc-500 mt-1">1 learners · {leagueName}</p>
                </div>
                <div className="flex bg-zinc-900 rounded-full p-1 border border-zinc-800">
                    <button onClick={() => setActiveTab('band')} className={tabButtonClass('band')}>Band League</button>
                    <button onClick={() => setActiveTab('streaks')} className={tabButtonClass('streaks')}>🔥 Streaks</button>
                    <button onClick={() => setActiveTab('weekly_xp')} className={tabButtonClass('weekly_xp')}>⚡ Weekly XP</button>
                </div>
            </div>

            {/* ═══ FILTER PILLS ═══ */}
            <div className="flex gap-2">
                <button onClick={() => setActivePill('bronze')} className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${activePill === 'bronze' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-zinc-900'}`}>
                    🥉 Bronze
                </button>
                <button onClick={() => setActivePill('global')} className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${activePill === 'global' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-zinc-900'}`}>
                    🌐 Global
                </button>
                <button onClick={() => setActivePill('country')} className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${activePill === 'country' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-zinc-900'}`}>
                    📍 Country
                </button>
            </div>

            {/* ═══ HERO LEAGUE STATUS CARD ═══ */}
            <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm text-center">
                {/* Tier Badges */}
                <div className="flex items-center justify-center gap-4 mb-5">
                    {TIERS.map((tier, i) => (
                        <div key={tier.label} className="flex flex-col items-center gap-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold ${tier.color} ${
                                tier.label === 'Bronze' && i === 0 ? 'bg-orange-500/10 border border-orange-500/30 ring-2 ring-orange-500/20' : 'bg-zinc-100 border border-gray-200'
                            }`}>
                                {tier.label === 'Bronze' ? '🥉' : tier.label === 'Silver' ? '🥈' : tier.label === 'Gold' ? '🥇' : tier.label === 'Diamond' ? '💎' : '👑'}
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">{tier.label}</span>
                        </div>
                    ))}
                </div>

                {/* League Name */}
                <h2 className="text-xl font-bold text-gray-900 mb-1">{leagueName}</h2>
                <p className="text-sm text-gray-500 mb-4">{leagueSubtext}</p>

                {/* Countdown */}
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[12px] font-semibold mb-6">
                    ⏰ 7 DAYS LEFT
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                    <div className="px-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Your Rank</p>
                        <p className={`text-2xl font-bold ${isUnranked ? 'text-red-400' : 'text-gray-900'}`}>
                            {isUnranked ? '#?' : `#${CURRENT_USER.rank}`}
                        </p>
                    </div>
                    <div className="px-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Band Score</p>
                        <p className="text-2xl font-bold text-gray-900">{CURRENT_USER.band.toFixed(1)}</p>
                    </div>
                    <div className="px-4">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Streak</p>
                        <p className="text-2xl font-bold text-gray-900">{CURRENT_USER.streak} <FlameIcon className="w-5 h-5 inline text-orange-400" /></p>
                    </div>
                </div>
            </div>

            {/* ═══ RANKINGS LIST ═══ */}
            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                {sortedUsers.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-400 text-sm">No leaderboard data available.</p>
                    </div>
                ) : (
                    <>
                        {sortedUsers.map((user, idx) => (
                            <React.Fragment key={user.rank}>
                                {/* Promotion Zone Divider */}
                                {idx === 3 && (
                                    <div className="bg-emerald-50 border-y border-emerald-200 py-2 px-4 text-center">
                                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-center gap-1.5">
                                            <ArrowUpIcon className="w-3.5 h-3.5" />
                                            PROMOTION ZONE
                                            <ArrowUpIcon className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                )}

                                <div className={`flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-b-0 transition-colors ${user.isCurrentUser ? 'bg-red-50/40' : 'hover:bg-gray-50/50'}`}>
                                    {/* Rank Badge */}
                                    <div className="w-8 shrink-0">
                                        {rankBadge(user.rank)}
                                    </div>

                                    {/* Avatar */}
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${user.avatarColor}`}>
                                        {user.initials}
                                    </div>

                                    {/* User Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold ${user.isCurrentUser ? 'text-red-600' : 'text-gray-900'}`}>
                                            {user.isCurrentUser ? 'YOU' : user.name}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">
                                            Band {user.band.toFixed(1)} learner · {user.badge}
                                        </p>
                                    </div>

                                    {/* Right Metrics */}
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{user.band.toFixed(1)} <span className="text-[10px] font-medium text-gray-400">BAND</span></p>
                                        </div>
                                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[12px] font-semibold">
                                            <FlameIcon className="w-3.5 h-3.5" />
                                            {user.streak}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}

                        {/* Current User (Unranked) at Bottom */}
                        {isUnranked && (
                            <div className="flex items-center gap-4 px-5 py-3.5 bg-red-50/40 border-t-2 border-red-200">
                                <div className="w-8 shrink-0">
                                    {unrankedBadge()}
                                </div>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${CURRENT_USER.avatarColor}`}>
                                    {CURRENT_USER.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-red-600">YOU</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                        Band 0.0 learner · Unranked
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">0.0 <span className="text-[10px] font-medium text-gray-400">BAND</span></p>
                                    </div>
                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-400 text-[12px] font-semibold">
                                        <FlameIcon className="w-3.5 h-3.5" />
                                        0
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LeaderboardView;

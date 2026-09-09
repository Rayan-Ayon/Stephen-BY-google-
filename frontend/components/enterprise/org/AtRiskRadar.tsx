import React, { useState, useMemo } from 'react';

type RiskLevel = 'critical' | 'watchlist';
type StatusFilter = 'all' | 'active' | 'inactive';
type InterventionFilter = 'all' | 'flagged' | 'assigned';

interface Candidate {
    id: string;
    studentId: string;
    name: string;
    targetBand: number;
    currentBand: number;
    daysInactive: number;
    risk: RiskLevel;
    interventionStatus: 'flagged' | 'assigned' | 'none';
}

const CANDIDATES: Candidate[] = [
    {
        id: '1',
        studentId: 'STU-2024-0847',
        name: 'Tanvir Hossain',
        targetBand: 7.5,
        currentBand: 5.5,
        daysInactive: 18,
        risk: 'critical',
        interventionStatus: 'flagged',
    },
    {
        id: '2',
        studentId: 'STU-2024-0912',
        name: 'Anika Rahman',
        targetBand: 7.0,
        currentBand: 5.5,
        daysInactive: 12,
        risk: 'watchlist',
        interventionStatus: 'assigned',
    },
    {
        id: '3',
        studentId: 'STU-2024-0756',
        name: 'Rafiqul Islam',
        targetBand: 6.5,
        currentBand: 5.0,
        daysInactive: 14,
        risk: 'critical',
        interventionStatus: 'flagged',
    },
];

const RISK_PILL: Record<RiskLevel, { label: string; icon: string; className: string }> = {
    critical: {
        label: 'Critical Risk',
        icon: '🔴',
        className: 'bg-red-500/15 text-red-400 border border-red-500/25',
    },
    watchlist: {
        label: 'Watchlist',
        icon: '🟡',
        className: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    },
};

const INTERVENTION_PILL: Record<string, { label: string; className: string }> = {
    flagged: {
        label: 'Flagged',
        className: 'bg-red-500/10 text-red-400 border border-red-500/20',
    },
    assigned: {
        label: 'Assigned',
        className: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
    },
    none: {
        label: 'None',
        className: 'bg-white/5 text-[#565E6D] border border-[#1E2026]',
    },
};

const MetricCard: React.FC<{
    icon: string;
    label: string;
    value: string;
    color: string;
}> = ({ icon, label, value, color }) => (
    <div className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-3 flex items-center gap-3">
        <span className={`text-xl ${color}`}>{icon}</span>
        <div>
            <p className="text-[#8E95A3] text-xs uppercase tracking-wider">{label}</p>
            <p className="text-[#F3F4F6] text-lg font-semibold">{value}</p>
        </div>
    </div>
);

const SearchIcon: React.FC = () => (
    <svg className="w-4 h-4 text-[#565E6D]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const BellIcon: React.FC = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const FlagIcon: React.FC = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
);

const MessageIcon: React.FC = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const ClockIcon: React.FC = () => (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AtRiskRadar: React.FC = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [interventionFilter, setInterventionFilter] = useState<InterventionFilter>('all');

    const filtered = useMemo(() => {
        let result = CANDIDATES;

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.studentId.toLowerCase().includes(q)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter((c) =>
                statusFilter === 'active' ? c.daysInactive < 14 : c.daysInactive >= 14
            );
        }

        if (interventionFilter !== 'all') {
            result = result.filter((c) => c.interventionStatus === interventionFilter);
        }

        return result;
    }, [search, statusFilter, interventionFilter]);

    const criticalCount = CANDIDATES.filter((c) => c.risk === 'critical').length;
    const watchlistCount = CANDIDATES.filter((c) => c.risk === 'watchlist').length;
    const avgGap =
        CANDIDATES.reduce((sum, c) => sum + (c.targetBand - c.currentBand), 0) / CANDIDATES.length;
    const avgInactivity =
        CANDIDATES.reduce((sum, c) => sum + c.daysInactive, 0) / CANDIDATES.length;

    return (
        <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] p-6 space-y-6">
            <div>
                <h1 className="text-sm font-semibold tracking-[0.2em] uppercase text-[#8E95A3]">
                    Cohort Telemetry // At-Risk Radar &amp; Early Warning Pipeline
                </h1>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <MetricCard icon="🔴" label="Critical Risk" value={`${criticalCount} Candidates`} color="text-red-400" />
                <MetricCard icon="🟡" label="Watchlist" value={`${watchlistCount} Candidates`} color="text-amber-400" />
                <MetricCard icon="📊" label="Avg Band Gap" value={avgGap.toFixed(1)} color="text-sky-400" />
                <MetricCard icon="⏱" label="Avg Inactivity" value={`${avgInactivity.toFixed(1)} Days`} color="text-purple-400" />
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#121316] border border-[#1E2026] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F3F4F6] placeholder-[#565E6D] focus:outline-none focus:border-[#FF4D4D]/50 transition-colors"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <SearchIcon />
                    </span>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="bg-[#121316] border border-[#1E2026] rounded-lg px-3 py-2 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#FF4D4D]/50 transition-colors appearance-none cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                <select
                    value={interventionFilter}
                    onChange={(e) => setInterventionFilter(e.target.value as InterventionFilter)}
                    className="bg-[#121316] border border-[#1E2026] rounded-lg px-3 py-2 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#FF4D4D]/50 transition-colors appearance-none cursor-pointer"
                >
                    <option value="all">All Intervention</option>
                    <option value="flagged">Flagged</option>
                    <option value="assigned">Assigned</option>
                </select>

                <button className="flex items-center gap-2 bg-[#F04438] hover:bg-[#FF4D4D] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    <BellIcon />
                    Send Alert
                </button>
            </div>

            <div className="bg-[#121316] border border-[#1E2026] rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#1E2026]">
                            <th className="text-left text-[#8E95A3] text-xs uppercase tracking-wider font-medium px-5 py-3">Candidate</th>
                            <th className="text-center text-[#8E95A3] text-xs uppercase tracking-wider font-medium px-5 py-3">Target Band</th>
                            <th className="text-center text-[#8E95A3] text-xs uppercase tracking-wider font-medium px-5 py-3">Current Band</th>
                            <th className="text-center text-[#8E95A3] text-xs uppercase tracking-wider font-medium px-5 py-3">Gap</th>
                            <th className="text-center text-[#8E95A3] text-xs uppercase tracking-wider font-medium px-5 py-3">Last Active</th>
                            <th className="text-left text-[#8E95A3] text-xs uppercase tracking-wider font-medium px-5 py-3">Intervention</th>
                            <th className="text-left text-[#8E95A3] text-xs uppercase tracking-wider font-medium px-5 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-[#565E6D] py-12">
                                    No candidates match the current filters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((c) => {
                                const gap = c.targetBand - c.currentBand;
                                const risk = RISK_PILL[c.risk];
                                const intervention = INTERVENTION_PILL[c.interventionStatus];

                                return (
                                    <tr
                                        key={c.id}
                                        className="border-b border-[#1E2026]/50 hover:bg-[#181A20] transition-colors"
                                    >
                                        <td className="px-5 py-3">
                                            <p className="text-[#F3F4F6] font-medium">{c.name}</p>
                                            <p className="text-[#565E6D] text-xs">{c.studentId}</p>
                                        </td>
                                        <td className="text-center px-5 py-3 text-[#F3F4F6]">{c.targetBand}</td>
                                        <td className="text-center px-5 py-3 text-[#F3F4F6]">{c.currentBand}</td>
                                        <td className="text-center px-5 py-3">
                                            <span className={`font-semibold ${gap >= 2.0 ? 'text-red-400' : gap >= 1.5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                {gap.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="text-center px-5 py-3">
                                            <span className={`inline-flex items-center gap-1.5 text-xs ${c.daysInactive >= 14 ? 'text-red-400' : 'text-[#8E95A3]'}`}>
                                                <ClockIcon />
                                                {c.daysInactive}d
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${risk.className}`}>
                                                    {risk.icon} {risk.label}
                                                </span>
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${intervention.className}`}>
                                                    {intervention.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-[#1E2026] text-[#8E95A3] hover:text-[#F3F4F6] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                                                    <FlagIcon />
                                                    Flag
                                                </button>
                                                <button className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-[#1E2026] text-[#8E95A3] hover:text-[#F3F4F6] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                                                    <MessageIcon />
                                                    Message
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <p className="text-[#565E6D] text-xs">
                Showing {filtered.length} of {CANDIDATES.length} at-risk candidates
            </p>
        </div>
    );
};

export default AtRiskRadar;

import React, { useState, useMemo } from 'react';

type StatusFilter = 'All' | 'Pending' | 'Approved' | 'Overridden';
type ModuleFilter = 'All' | 'Writing' | 'Speaking';

interface ReviewEntry {
    id: string;
    name: string;
    batch: string;
    module: string;
    aiScore: number;
    status: 'Pending' | 'Approved' | 'Overridden';
    submitted: string;
}

const ENTRIES: ReviewEntry[] = [
    {
        id: '1',
        name: 'Tanvir Hossain',
        batch: 'Batch A-2024',
        module: 'Writing Task 2',
        aiScore: 6.0,
        status: 'Pending',
        submitted: '2h ago',
    },
    {
        id: '2',
        name: 'Anika Rahman',
        batch: 'Batch B-2024',
        module: 'Speaking Part 3',
        aiScore: 7.0,
        status: 'Pending',
        submitted: '5h ago',
    },
    {
        id: '3',
        name: 'Rafiqul Islam',
        batch: 'Batch A-2024',
        module: 'Writing Task 2',
        aiScore: 5.5,
        status: 'Approved',
        submitted: '1d ago',
    },
];

const STATUS_PILL: Record<string, { label: string; icon: string; className: string }> = {
    Pending: {
        label: 'Pending',
        icon: '⏳',
        className: 'bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B]',
    },
    Approved: {
        label: 'Approved',
        icon: '✅',
        className: 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]',
    },
    Overridden: {
        label: 'Overridden',
        icon: '🔄',
        className: 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]',
    },
};

const METRICS = [
    { label: 'Pending Reviews', value: '5', icon: '📝' },
    { label: 'Approved Today', value: '12', icon: '✅' },
    { label: 'Overridden Scores', value: '3', icon: '🔄' },
    { label: 'Avg Review Time', value: '3.8 min', icon: '⏱' },
];

const TeacherOverride: React.FC = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
    const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('All');

    const filtered = useMemo(() => {
        let result = ENTRIES;

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (e) =>
                    e.name.toLowerCase().includes(q) ||
                    e.batch.toLowerCase().includes(q)
            );
        }

        if (statusFilter !== 'All') {
            result = result.filter((e) => e.status === statusFilter);
        }

        if (moduleFilter !== 'All') {
            result = result.filter((e) =>
                moduleFilter === 'Writing'
                    ? e.module.startsWith('Writing')
                    : e.module.startsWith('Speaking')
            );
        }

        return result;
    }, [search, statusFilter, moduleFilter]);

    return (
        <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] p-6 space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-wide text-[#F3F4F6] uppercase">
                    EVALUATION STUDIO <span className="text-[#565E6D]">//</span> TEACHER REVIEW &amp; SCORE OVERRIDE
                </h1>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {METRICS.map((m) => (
                    <div
                        key={m.label}
                        className="rounded-xl bg-[#121316] border border-[#1E2026] px-5 py-4 flex items-center gap-4"
                    >
                        <span className="text-2xl">{m.icon}</span>
                        <div>
                            <p className="text-[11px] uppercase tracking-wider text-[#565E6D] font-semibold">
                                {m.label}
                            </p>
                            <p className="text-xl font-bold text-[#F3F4F6] mt-0.5">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search candidates or batch..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder:text-[#565E6D] focus:outline-none focus:border-[#8E95A3] transition-colors"
                    />
                    <svg
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565E6D]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#8E95A3] transition-colors appearance-none cursor-pointer min-w-[140px]"
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Overridden">Overridden</option>
                </select>

                <select
                    value={moduleFilter}
                    onChange={(e) => setModuleFilter(e.target.value as ModuleFilter)}
                    className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#8E95A3] transition-colors appearance-none cursor-pointer min-w-[140px]"
                >
                    <option value="All">All</option>
                    <option value="Writing">Writing</option>
                    <option value="Speaking">Speaking</option>
                </select>

                <button className="flex items-center gap-2 bg-[#F04438] hover:bg-[#FF4D4D] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
                    📋 Review All
                </button>
            </div>

            <div className="rounded-xl border border-[#1E2026] overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#121316] border-b border-[#1E2026]">
                            <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                                Candidate
                            </th>
                            <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                                Module
                            </th>
                            <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                                AI Score
                            </th>
                            <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                                Status
                            </th>
                            <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                                Submitted
                            </th>
                            <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((entry) => {
                            const pill = STATUS_PILL[entry.status];

                            return (
                                <tr
                                    key={entry.id}
                                    className="border-b border-[#1E2026] last:border-b-0 hover:bg-[#181A20] transition-colors"
                                >
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-[#F3F4F6]">{entry.name}</p>
                                        <p className="text-[11px] text-[#565E6D] mt-0.5">{entry.batch}</p>
                                    </td>
                                    <td className="px-5 py-4 text-[#8E95A3]">{entry.module}</td>
                                    <td className="px-5 py-4">
                                        <span className="font-mono text-[#F3F4F6] font-semibold">{entry.aiScore.toFixed(1)}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${pill.className}`}
                                        >
                                            {pill.icon} {pill.label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-[#8E95A3]">{entry.submitted}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {entry.status === 'Pending' ? (
                                                <>
                                                    <button className="px-3 py-1.5 rounded-lg bg-[#121316] border border-[#1E2026] text-[#8E95A3] text-xs font-semibold hover:bg-[#181A20] hover:text-[#F3F4F6] transition-colors">
                                                        Review
                                                    </button>
                                                    <button className="px-3 py-1.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold hover:bg-[#EF4444]/20 transition-colors">
                                                        Override Score
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="px-3 py-1.5 rounded-lg bg-[#121316] border border-[#1E2026] text-[#8E95A3] text-xs font-semibold hover:bg-[#181A20] hover:text-[#F3F4F6] transition-colors">
                                                    View
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="px-5 py-10 text-center text-[#565E6D] text-sm">
                        No entries match the current filters.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherOverride;

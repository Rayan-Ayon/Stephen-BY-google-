import React from 'react';
import {
    readAttempts,
    clearAttemptsBySkill,
    attemptStatus,
    skillLabels,
    skillDotColors,
    ATTEMPTS_UPDATED_EVENT,
    type IeltsAttempt,
    type IeltsSkill,
} from '../ielts/ieltsShared';

export interface ModuleHistoryItem {
    id: number;
    skill: IeltsSkill;
    title: string;
    band: number;
    date: string;
    timeSpent?: number;
    status: { label: string; color: string };
    criteria?: { label: string; band: number }[];
}

export interface ModuleHistoryProps {
    moduleType: IeltsSkill;
}

type StatusFilter = 'all' | 'approved' | 'developing' | 'at-risk';

const STATUS_LABEL: Record<StatusFilter, string> = {
    all: 'All Status',
    approved: 'Approved',
    developing: 'Developing',
    'at-risk': 'At Risk',
};

const formatMins = (m?: number) => (m != null ? `${m}m` : '—');

const buildTopic = (a: IeltsAttempt): string => {
    if (a.title) return a.title;
    const base = skillLabels[a.skill];
    if (a.taskType) return `${base} · ${a.taskType === 'task1' ? 'T1' : 'T2'}`;
    if (a.bundle) return `${base} · ${a.bundle}`;
    return `${base} Attempt`;
};

const ModuleHistorySection: React.FC<ModuleHistoryProps> = ({ moduleType }) => {
    const [attempts, setAttempts] = React.useState<IeltsAttempt[]>(readAttempts);
    const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
    const [selected, setSelected] = React.useState<IeltsAttempt | null>(null);
    const [confirmClear, setConfirmClear] = React.useState(false);

    React.useEffect(() => {
        const refresh = () => setAttempts(readAttempts());
        window.addEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
        return () => window.removeEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
    }, []);

    const moduleAttempts = attempts.filter((a) => a.skill === moduleType);

    const filtered = moduleAttempts.filter((a) => {
        if (statusFilter === 'all') return true;
        const status = attemptStatus(a.band).label.toLowerCase().replace(' ', '-');
        return status === statusFilter;
    });

    const handleClear = () => {
        clearAttemptsBySkill(moduleType);
        setConfirmClear(false);
    };

    return (
        <section className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                    {skillLabels[moduleType]} History Matrix
                </h3>
                <button
                    onClick={() => setConfirmClear(true)}
                    className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                    Clear History
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="px-3 py-2 rounded-lg bg-[#0b0b0b] border border-neutral-800 text-[11px] text-neutral-300 outline-none focus:border-neutral-600"
                >
                    {(Object.keys(STATUS_LABEL) as StatusFilter[]).map((s) => (
                        <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                        </option>
                    ))}
                </select>
                <span className="text-[11px] font-mono text-neutral-600 ml-auto">
                    {filtered.length} row{filtered.length === 1 ? '' : 's'}
                </span>
            </div>

            {filtered.length === 0 ? (
                <p className="text-sm text-neutral-600 py-8 text-center">No attempts match the current filters.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-wider text-neutral-500">
                                <th className="pb-2 pr-4 font-semibold">Date</th>
                                <th className="pb-2 pr-4 font-semibold">Exam Module / Topic</th>
                                <th className="pb-2 pr-4 font-semibold">Time Spent</th>
                                <th className="pb-2 pr-4 font-semibold">Overall Band</th>
                                <th className="pb-2 pr-4 font-semibold">Criteria Breakdown</th>
                                <th className="pb-2 font-semibold">Status</th>
                                <th className="pb-2 pl-2 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/70">
                            {filtered.map((a) => {
                                const status = attemptStatus(a.band);
                                return (
                                    <tr key={a.id}>
                                        <td className="py-2.5 pr-4 text-xs font-mono text-neutral-500">{a.date}</td>
                                        <td className="py-2.5 pr-4">
                                            <span className="flex items-center gap-2 text-sm text-neutral-300">
                                                <span className={`w-2 h-2 rounded-full ${skillDotColors[a.skill]}`} />
                                                {buildTopic(a)}
                                            </span>
                                        </td>
                                        <td className="py-2.5 pr-4 text-xs font-mono text-neutral-500">{formatMins(a.timeSpent)}</td>
                                        <td className="py-2.5 pr-4 text-sm font-mono text-amber-400">{a.band.toFixed(1)}</td>
                                        <td className="py-2.5 pr-4">
                                            {a.criteria && a.criteria.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {a.criteria.slice(0, 4).map((c) => (
                                                        <span
                                                            key={c.label}
                                                            className="rounded bg-[#0b0b0b] border border-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-400"
                                                        >
                                                            {c.label.split(' ')[0]} {c.band.toFixed(1)}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-neutral-600">—</span>
                                            )}
                                        </td>
                                        <td className="py-2.5">
                                            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="py-2.5 pl-2">
                                            <button
                                                onClick={() => setSelected(a)}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-indigo-300 hover:border-indigo-400/40 hover:text-indigo-200 transition-colors"
                                            >
                                                View Analysis
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {confirmClear && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setConfirmClear(false)}>
                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-6" onClick={(e) => e.stopPropagation()}>
                        <h4 className="text-sm font-semibold text-white">Clear {skillLabels[moduleType]} history?</h4>
                        <p className="text-xs text-neutral-400 mt-2">
                            This permanently removes only the {skillLabels[moduleType].toLowerCase()} attempts. Other modules and the IELTS Evaluation Dashboard are unaffected.
                        </p>
                        <div className="flex justify-end gap-2 mt-5">
                            <button
                                onClick={() => setConfirmClear(false)}
                                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-3 py-2 rounded-lg bg-red-500/15 border border-red-400/30 text-[11px] text-red-300 hover:bg-red-500/25 transition-colors"
                            >
                                Clear {skillLabels[moduleType]} History
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="text-sm font-semibold text-white">{buildTopic(selected)}</h4>
                                <p className="text-[11px] font-mono text-neutral-500 mt-1">{selected.date}{selected.timeSpent != null ? ` · ${selected.timeSpent}m` : ''}</p>
                            </div>
                            <span className="rounded-md bg-gradient-to-r from-indigo-500 to-cyan-400 px-2.5 py-1 text-[11px] font-mono font-semibold text-white">
                                Band {selected.band.toFixed(1)}
                            </span>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${attemptStatus(selected.band).color}`}>
                                {attemptStatus(selected.band).label}
                            </span>
                        </div>

                        {selected.criteria && selected.criteria.length > 0 && (
                            <div className="mt-5 space-y-3">
                                <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">Criteria Breakdown</p>
                                {selected.criteria.map((c) => (
                                    <div key={c.label}>
                                        <div className="flex items-center justify-between text-[11px] text-neutral-300 mb-1">
                                            <span>{c.label}</span>
                                            <span className="font-mono text-neutral-400">{c.band.toFixed(1)}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                                                style={{ width: `${(c.band / 9) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelected(null)}
                                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[11px] text-neutral-300 hover:text-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ModuleHistorySection;

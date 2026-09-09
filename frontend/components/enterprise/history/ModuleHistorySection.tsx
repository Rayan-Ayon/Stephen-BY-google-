import React from 'react';
import {
    readAttempts,
    clearAttemptsBySkill,
    clearAttemptsByBundle,
    attemptStatus,
    skillLabels,
    skillDotColors,
    BUNDLES,
    ATTEMPTS_UPDATED_EVENT,
    type IeltsAttempt,
    type IeltsSkill,
    type IeltsBundleId,
} from '../ielts/ieltsShared';
import WritingAnalysisModal from '../ielts/WritingAnalysisModal';
import { buildWriting } from '../ielts/analysisMockData';

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
    moduleType?: IeltsSkill;
    bundle?: IeltsBundleId;
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
    if (a.bundle) return `${a.bundle} · ${base}`;
    if (a.taskType) return `${base} · ${a.taskType === 'task1' ? 'T1' : 'T2'}`;
    return `${base} Attempt`;
};

const ModuleHistorySection: React.FC<ModuleHistoryProps> = ({ moduleType, bundle }) => {
    const [attempts, setAttempts] = React.useState<IeltsAttempt[]>(readAttempts);
    const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
    const [taskTypeFilter, setTaskTypeFilter] = React.useState<string>('all');
    const [analysisId, setAnalysisId] = React.useState<number | null>(null);
    const [confirmClear, setConfirmClear] = React.useState(false);

    const bundleLabel = bundle ? BUNDLES.find((b) => b.id === bundle)?.label : undefined;
    const sectionLabel = bundleLabel ?? (moduleType ? `${skillLabels[moduleType]} History Matrix` : 'History Matrix');

    React.useEffect(() => {
        const refresh = () => setAttempts(readAttempts());
        window.addEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
        return () => window.removeEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
    }, []);

    const moduleAttempts = attempts.filter((a) =>
        bundle ? a.bundle === bundleLabel : a.skill === moduleType
    );

    const filtered = moduleAttempts.filter((a) => {
        if (statusFilter === 'all') return true;
        const status = attemptStatus(a.band).label.toLowerCase().replace(' ', '-');
        return status === statusFilter;
    });

    const taskFiltered = moduleType === 'writing' && taskTypeFilter !== 'all'
        ? filtered.filter((a) => {
            if (taskTypeFilter === 'task2') return a.taskType === 'task2';
            if (taskTypeFilter === 'task1-academic') return a.taskType === 'task1' && !a.title?.toLowerCase().includes('general');
            if (taskTypeFilter === 'task1-general') return a.taskType === 'task1' && a.title?.toLowerCase().includes('general');
            if (taskTypeFilter === 'full-mock') return !a.taskType;
            return true;
        })
        : filtered;

    const handleClear = () => {
        if (bundle) clearAttemptsByBundle(bundle);
        else if (moduleType) clearAttemptsBySkill(moduleType);
        setConfirmClear(false);
    };

    return (
        <section className="rounded-2xl bg-surface border border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                    {sectionLabel}
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
                    className="px-3 py-2 rounded-lg bg-canvas border border-neutral-800 text-[11px] text-neutral-300 outline-none focus:border-neutral-600"
                >
                    {(Object.keys(STATUS_LABEL) as StatusFilter[]).map((s) => (
                        <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                        </option>
                    ))}
                </select>
                {moduleType === 'writing' && (
                    <select
                        value={taskTypeFilter}
                        onChange={(e) => setTaskTypeFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-canvas border border-neutral-800 text-[11px] text-neutral-300 outline-none focus:border-neutral-600"
                    >
                        <option value="all">All Modules</option>
                        <option value="task2">Task 2 Essay</option>
                        <option value="task1-academic">Task 1 Academic</option>
                        <option value="task1-general">Task 1 General</option>
                        <option value="full-mock">Full Mock Exam</option>
                    </select>
                )}
                <span className="text-[11px] font-mono text-neutral-600 ml-auto">
                    {taskFiltered.length} row{taskFiltered.length === 1 ? '' : 's'}
                </span>
            </div>

            {taskFiltered.length === 0 ? (
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
                            {taskFiltered.map((a) => {
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
                                                            className="rounded bg-canvas border border-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-400"
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
                                                onClick={() => setAnalysisId(a.id)}
                                                className="px-3 py-1.5 rounded-lg bg-amber-400 text-black text-[11px] font-semibold uppercase tracking-wider hover:bg-amber-300 transition-colors"
                                            >
                                                View Analysis ➔
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
                        <h4 className="text-sm font-semibold text-white">Clear {sectionLabel}?</h4>
                        <p className="text-xs text-neutral-400 mt-2">
                            This permanently removes only the {sectionLabel.toLowerCase()} attempts. Other modules and the IELTS Evaluation Dashboard are unaffected.
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
                                Clear {sectionLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {analysisId != null && (() => {
                const attempt = filtered.find((a) => a.id === analysisId);
                if (!attempt) return null;
                const writingData = buildWriting(attempt);
                return (
                    <WritingAnalysisModal
                        band={writingData.band}
                        targetBand={7.5}
                        examTitle={attempt.title ?? 'Writing Attempt'}
                        examDate={attempt.date}
                        criteria={writingData.criteria}
                        segments={writingData.segments}
                        rewrites={writingData.rewrites}
                        teacher={writingData.teacher}
                        onClose={() => setAnalysisId(null)}
                    />
                );
            })()}
        </section>
    );
};

export default ModuleHistorySection;

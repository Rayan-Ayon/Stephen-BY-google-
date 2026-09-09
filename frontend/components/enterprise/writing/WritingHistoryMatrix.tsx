import React, { useState, useEffect, useMemo } from 'react';
import {
    readAttempts,
    attemptStatus,
    skillLabels,
    skillDotColors,
    ATTEMPTS_UPDATED_EVENT,
    type IeltsAttempt,
} from '../ielts/ieltsShared';
import WritingAnalysisModal from '../ielts/WritingAnalysisModal';
import { buildWriting } from '../ielts/analysisMockData';

interface WritingHistoryMatrixProps {
    moduleFilter?: 'task2' | 'task1-academic' | 'task1-general';
}

type StatusFilter = 'all' | 'approved' | 'developing' | 'at-risk';

const STATUS_LABEL: Record<StatusFilter, string> = {
    all: 'All Status',
    approved: 'Approved',
    developing: 'Developing',
    'at-risk': 'At Risk',
};

const TASK_LABELS: Record<string, string> = {
    'task2': 'Task 2 — Essay',
    'task1-academic': 'Task 1 — Academic Report',
    'task1-general': 'Task 1 — General Training',
};

const formatMins = (m?: number) => (m != null ? `${m}m` : '—');

const buildTopic = (a: IeltsAttempt): string => {
    if (a.title) return a.title;
    const base = skillLabels[a.skill];
    if (a.taskType) return `${base} · ${a.taskType === 'task1' ? 'Task 1' : 'Task 2'}`;
    return `${base} Attempt`;
};

const WritingHistoryMatrix: React.FC<WritingHistoryMatrixProps> = ({ moduleFilter }) => {
    const [attempts, setAttempts] = useState<IeltsAttempt[]>(readAttempts);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [analysisId, setAnalysisId] = useState<number | null>(null);
    const [confirmClear, setConfirmClear] = useState(false);

    useEffect(() => {
        const refresh = () => setAttempts(readAttempts());
        window.addEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
        return () => window.removeEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
    }, []);

    const filteredAttempts = useMemo(() => {
        let result = attempts.filter((a) => a.skill === 'writing');

        if (moduleFilter) {
            result = result.filter((a) => {
                if (moduleFilter === 'task2') return a.taskType === 'task2';
                if (moduleFilter === 'task1-academic') return a.taskType === 'task1' && !a.title?.toLowerCase().includes('general');
                if (moduleFilter === 'task1-general') return a.taskType === 'task1' && a.title?.toLowerCase().includes('general');
                return true;
            });
        }

        if (statusFilter !== 'all') {
            result = result.filter((a) => {
                const status = attemptStatus(a.band).label.toLowerCase().replace(' ', '-');
                return status === statusFilter;
            });
        }

        return result;
    }, [attempts, moduleFilter, statusFilter]);

    const handleClear = () => {
        setConfirmClear(false);
    };

    const filterLabel = moduleFilter ? TASK_LABELS[moduleFilter] ?? 'Writing History' : 'Writing History Matrix';

    return (
        <section className="rounded-2xl bg-surface border border-neutral-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold tracking-tight text-white">
                    {filterLabel}
                </h3>
                {moduleFilter && (
                    <span className="text-[10px] uppercase tracking-wider text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1">
                        {TASK_LABELS[moduleFilter]}
                    </span>
                )}
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
                <span className="text-[11px] font-mono text-neutral-600 ml-auto">
                    {filteredAttempts.length} row{filteredAttempts.length === 1 ? '' : 's'}
                </span>
            </div>

            {filteredAttempts.length === 0 ? (
                <p className="text-sm text-neutral-600 py-8 text-center">No writing attempts match the current filters.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-wider text-neutral-500">
                                <th className="pb-2 pr-4 font-semibold">Date</th>
                                <th className="pb-2 pr-4 font-semibold">Task Type</th>
                                <th className="pb-2 pr-4 font-semibold">Time Spent</th>
                                <th className="pb-2 pr-4 font-semibold">Overall Band</th>
                                <th className="pb-2 pr-4 font-semibold">Criteria Breakdown</th>
                                <th className="pb-2 font-semibold">Status</th>
                                <th className="pb-2 pl-2 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/70">
                            {filteredAttempts.map((a) => {
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
                                                            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-neutral-800 text-neutral-400"
                                                        >
                                                            {c.label} {c.band.toFixed(1)}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-neutral-600">—</span>
                                            )}
                                        </td>
                                        <td className="py-2.5">
                                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="py-2.5 pl-2">
                                            <button
                                                onClick={() => setAnalysisId(a.id)}
                                                className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors"
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

            {analysisId !== null && (() => {
                const attempt = filteredAttempts.find((a) => a.id === analysisId);
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

            {confirmClear && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setConfirmClear(false)}>
                    <div className="max-w-sm w-full rounded-2xl bg-[#1E1E22] border border-neutral-800 p-6" onClick={(e) => e.stopPropagation()}>
                        <h4 className="text-sm font-semibold text-white mb-2">Clear Writing History?</h4>
                        <p className="text-xs text-neutral-400 mb-4">This will remove all writing attempts. This action cannot be undone.</p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setConfirmClear(false)} className="px-4 py-2 rounded-lg bg-canvas border border-neutral-800 text-xs text-neutral-300 hover:border-neutral-600 transition-colors">Cancel</button>
                            <button onClick={handleClear} className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-xs text-red-400 hover:bg-red-500/30 transition-colors">Clear All</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default WritingHistoryMatrix;

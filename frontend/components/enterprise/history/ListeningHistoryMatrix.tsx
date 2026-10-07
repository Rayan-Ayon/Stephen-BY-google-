import React, { useState, useEffect, useMemo } from 'react';
import {
    readAttempts,
    attemptStatus,
    formatTimeSpent,
    resolveExamTitle,
    isGeneralAttempt,
    transformExamAttemptRow,
    ATTEMPTS_UPDATED_EVENT,
    type IeltsAttempt,
} from '../ielts/ieltsShared';
import ListeningAnalysisModal from '../ielts/ListeningAnalysisModal';
import { supabase } from '@/lib/supabaseClient';

export interface ListeningHistoryMatrixProps {
    bookFilter?: number;
}

type StatusFilter = 'all' | 'approved' | 'developing' | 'at-risk';
type ExamTypeFilter = 'all' | 'academic' | 'general';

const STATUS_LABEL: Record<StatusFilter, string> = {
    all: 'All Status',
    approved: 'Approved',
    developing: 'Developing',
    'at-risk': 'At Risk',
};

export { resolveExamTitle };

export const ListeningHistoryMatrix: React.FC<ListeningHistoryMatrixProps> = ({ bookFilter }) => {
    const [attempts, setAttempts] = useState<IeltsAttempt[]>(readAttempts);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [typeFilter, setTypeFilter] = useState<ExamTypeFilter>('all');
    const [selectedAttempt, setSelectedAttempt] = useState<IeltsAttempt | null>(null);

    useEffect(() => {
        let mounted = true;
        const loadAttempts = async () => {
            const local = readAttempts();
            try {
                const { data: dbAttempts } = await supabase
                    .from('exam_attempts')
                    .select('*')
                    .eq('module', 'listening')
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (dbAttempts && dbAttempts.length > 0 && mounted) {
                    const mappedDb: IeltsAttempt[] = dbAttempts.map((row: any) => transformExamAttemptRow(row, 'listening'));

                    const seen = new Set(mappedDb.map((d) => String(d.id)));
                    const merged = [...mappedDb];
                    local.forEach((loc) => {
                        if (!seen.has(String(loc.id))) merged.push(loc);
                    });
                    setAttempts(merged);
                    return;
                }
            } catch {
                // fallback to local
            }
            if (mounted) setAttempts(local);
        };

        loadAttempts();
        const refresh = () => loadAttempts();
        window.addEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
        return () => {
            mounted = false;
            window.removeEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
        };
    }, []);

    const filteredAttempts = useMemo(() => {
        let result = attempts.filter((a) => (a.skill === 'listening' || a.module === 'listening'));

        if (bookFilter != null) {
            result = result.filter((a) => {
                const book = a.book_number || parseInt((a.title || '').match(/Cambridge\s*(\d+)/i)?.[1] || '0', 10);
                return book === bookFilter;
            });
        }

        // 1. Status Filter
        if (statusFilter !== 'all') {
            result = result.filter((a) => {
                const status = attemptStatus(a.band).label.toLowerCase().replace(' ', '-');
                if (statusFilter === 'approved') return a.band >= 7.0;
                if (statusFilter === 'developing') return a.band >= 6.0 && a.band < 7.0;
                if (statusFilter === 'at-risk') return a.band < 6.0;
                return status === statusFilter;
            });
        }

        // 2. Type Filter (Academic vs General Training)
        if (typeFilter !== 'all') {
            result = result.filter((a) => {
                const rowType = isGeneralAttempt(a) ? 'general' : 'academic';
                return rowType === typeFilter;
            });
        }

        return result;
    }, [attempts, bookFilter, statusFilter, typeFilter]);

    return (
        <section className="rounded-2xl bg-[#15181E]/90 border border-[#222732] shadow-xl backdrop-blur-md p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span>🎧 Listening History Matrix</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                        Historical Cambridge Listening test attempts, synchronized audio telemetry, and tapescript breakdowns
                    </p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        className="bg-[#0D0F12] border border-[#222732] hover:border-slate-600 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-rose-500/50 transition-all cursor-pointer"
                    >
                        {(Object.keys(STATUS_LABEL) as StatusFilter[]).map((s) => (
                            <option key={s} value={s} className="bg-[#0D0F12] text-slate-200">
                                {STATUS_LABEL[s]}
                            </option>
                        ))}
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as ExamTypeFilter)}
                        className="bg-[#0D0F12] border border-[#222732] hover:border-slate-600 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-rose-500/50 transition-all cursor-pointer"
                    >
                        <option value="all" className="bg-[#0D0F12] text-slate-200">All Exam Types</option>
                        <option value="academic" className="bg-[#0D0F12] text-slate-200">Academic</option>
                        <option value="general" className="bg-[#0D0F12] text-slate-200">General Training</option>
                    </select>

                    <span className="text-[11px] font-mono text-slate-500 ml-1">
                        {filteredAttempts.length} row{filteredAttempts.length === 1 ? '' : 's'}
                    </span>
                </div>
            </div>

            {filteredAttempts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#222732] bg-[#0D0F12]/50 p-8 text-center">
                    <p className="text-sm font-medium text-slate-400">No listening test attempts match the selected filters.</p>
                    <p className="text-xs text-slate-500 mt-1">Adjust your filters or complete a Cambridge Listening exam to populate this matrix.</p>
                </div>
            ) : (
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-[#222732] text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-[#0D0F12]/60 select-none">
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Module / Type</th>
                                <th className="px-4 py-3">Exam Name</th>
                                <th className="px-4 py-3">Time Spent</th>
                                <th className="px-4 py-3">Overall Band</th>
                                <th className="px-4 py-3">Criteria Status</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222732]/60">
                            {filteredAttempts.map((a) => {
                                const status = attemptStatus(a.band);
                                const isGen = isGeneralAttempt(a);
                                return (
                                    <tr key={String(a.id)} className="border-b border-[#222732]/60 hover:bg-[#1A1E26]/80 transition-colors duration-150 group">
                                        {/* 1. DATE */}
                                        <td className="px-4 py-3.5 text-xs text-slate-400 font-mono align-middle">
                                            {a.date}
                                        </td>

                                        {/* 2. MODULE / TYPE */}
                                        <td className="px-4 py-3.5 text-xs align-middle">
                                            {isGen ? (
                                                <span className="inline-flex items-center gap-1.5 text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap">
                                                    <span>🟣</span> General Training
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap">
                                                    <span>🔵</span> Academic
                                                </span>
                                            )}
                                        </td>

                                        {/* 3. EXAM NAME (NEW COLUMN) */}
                                        <td className="px-4 py-3.5 text-xs font-semibold text-slate-100 align-middle">
                                            <span>{resolveExamTitle(a)}</span>
                                        </td>

                                        {/* 4. TIME SPENT */}
                                        <td className="px-4 py-3.5 text-xs font-mono text-slate-300 align-middle">
                                            {formatTimeSpent(a.timeSpent)}
                                        </td>

                                        {/* 5. OVERALL BAND */}
                                        <td className="px-4 py-3.5 text-xs align-middle">
                                            <span className={`font-bold font-mono text-sm ${a.band >= 7.0 ? 'text-emerald-400' : a.band >= 6.0 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                {a.band.toFixed(1)}
                                            </span>
                                        </td>

                                        {/* 6. CRITERIA STATUS */}
                                        <td className="px-4 py-3.5 text-xs font-mono text-slate-300 align-middle">
                                            {a.score != null ? `${a.score}/40 Correct` : '0/40 Correct'}
                                        </td>

                                        {/* 7. STATUS */}
                                        <td className="px-4 py-3.5 text-xs align-middle">
                                            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>

                                        {/* 8. ACTION */}
                                        <td className="px-4 py-3.5 text-xs text-right align-middle">
                                            <button
                                                onClick={() => setSelectedAttempt(a)}
                                                className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 font-bold text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition-all duration-200 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                                            >
                                                [ VIEW ANALYSIS → ]
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Listening Dedicated Analysis Modal Portal */}
            {selectedAttempt && (
                <ListeningAnalysisModal
                    isModal={true}
                    key={`${selectedAttempt.id || selectedAttempt.book_number}-${selectedAttempt.test_number}`}
                    attemptId={selectedAttempt.id}
                    bookNumber={selectedAttempt.book_number || parseInt((selectedAttempt.title || '').match(/Cambridge\s*(\d+)/i)?.[1] || '18', 10)}
                    testNumber={selectedAttempt.test_number || parseInt((selectedAttempt.title || '').match(/Test\s*(\d+)/i)?.[1] || '1', 10)}
                    answersPayload={selectedAttempt.answers_payload || selectedAttempt.raw_answers}
                    onClose={() => setSelectedAttempt(null)}
                />
            )}
        </section>
    );
};

export default ListeningHistoryMatrix;

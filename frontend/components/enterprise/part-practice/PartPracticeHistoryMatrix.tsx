import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowLeft,
    Search,
    Filter,
    BookOpen,
    Headphones,
    PenTool,
    Mic,
    CheckCircle2,
    Clock,
    Target,
    Layers,
    ChevronRight,
    TrendingUp,
    BarChart3
} from 'lucide-react';
import {
    fetchPartPracticeAttempts,
    PART_PRACTICE_UPDATED_EVENT,
    type PartPracticeAttempt,
    type PartPracticeSkill,
    type PartPracticeAttemptType
} from '@/services/part-practice/partPracticeHistoryService';
import { WritingEvaluationCanvas } from '@/components/enterprise/writing/WritingEvaluationCanvas';
import { IELTSAnalysisView } from '@/components/enterprise/ielts/IELTSAnalysisView';
import { ListeningAnalysisModal } from '@/components/enterprise/ielts/ListeningAnalysisModal';
import { SpeakingEvaluationCanvas } from '@/components/enterprise/speaking/SpeakingEvaluationCanvas';
import {
    adaptWritingPartPractice,
    adaptReadingPartPractice,
    adaptListeningPartPractice,
    adaptSpeakingPartPractice,
} from '@/services/part-practice/partPracticeCanvasAdapter';

export interface PartPracticeHistoryMatrixProps {
    onBack: () => void;
    userEmail?: string;
    initialTab?: 'parts' | 'question_types';
}

export const PartPracticeHistoryMatrix: React.FC<PartPracticeHistoryMatrixProps> = ({
    onBack,
    userEmail,
    initialTab = 'parts'
}) => {
    const [viewMode, setViewMode] = useState<PartPracticeAttemptType>(
        initialTab === 'question_types' ? 'question_type' : 'part'
    );
    const [moduleFilter, setModuleFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [attempts, setAttempts] = useState<PartPracticeAttempt[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedAttempt, setSelectedAttempt] = useState<PartPracticeAttempt | null>(null);

    // Fetch attempts
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await fetchPartPracticeAttempts({
                    userEmail,
                    attemptType: viewMode,
                    module: moduleFilter !== 'all' ? moduleFilter : undefined
                });
                if (mounted) {
                    setAttempts(data);
                }
            } catch (err) {
                console.warn('[PartPracticeHistoryMatrix] Load attempts note:', err);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        load();

        const handleUpdate = () => {
            load();
        };

        window.addEventListener(PART_PRACTICE_UPDATED_EVENT, handleUpdate);
        return () => {
            mounted = false;
            window.removeEventListener(PART_PRACTICE_UPDATED_EVENT, handleUpdate);
        };
    }, [viewMode, moduleFilter, userEmail]);

    // Client-side filtering & search
    const filteredAttempts = useMemo(() => {
        return attempts.filter(att => {
            if (att.attempt_type !== viewMode) return false;
            if (moduleFilter !== 'all' && att.module !== moduleFilter) return false;
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                att.exam_title.toLowerCase().includes(q) ||
                att.scoped_target.toLowerCase().includes(q) ||
                (att.drill_name && att.drill_name.toLowerCase().includes(q)) ||
                (att.source_exam && att.source_exam.toLowerCase().includes(q))
            );
        });
    }, [attempts, viewMode, moduleFilter, searchQuery]);

    // Aggregate statistics
    const metrics = useMemo(() => {
        const total = filteredAttempts.length;
        if (total === 0) return { total: 0, avgBand: '0.0', avgAccuracy: '0%' };
        const avgBand = (
            filteredAttempts.reduce((acc, a) => acc + a.band_score, 0) / total
        ).toFixed(1);
        const avgAccuracy = Math.round(
            filteredAttempts.reduce((acc, a) => acc + a.accuracy_percentage, 0) / total
        );
        return { total, avgBand, avgAccuracy: `${avgAccuracy}%` };
    }, [filteredAttempts]);

    // Helper for module badge
    const renderModuleBadge = (mod: PartPracticeSkill) => {
        switch (mod) {
            case 'reading':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <BookOpen className="w-3.5 h-3.5" />
                        Reading
                    </span>
                );
            case 'listening':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Headphones className="w-3.5 h-3.5" />
                        Listening
                    </span>
                );
            case 'writing':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <PenTool className="w-3.5 h-3.5" />
                        Writing
                    </span>
                );
            case 'speaking':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Mic className="w-3.5 h-3.5" />
                        Speaking
                    </span>
                );
        }
    };

    // Helper for status badge
    const renderStatusBadge = (status: string) => {
        const normalized = (status || 'TARGET').toUpperCase();
        if (normalized === 'TARGET') {
            return (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    TARGET
                </span>
            );
        }
        if (normalized === 'GOOD') {
            return (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    GOOD
                </span>
            );
        }
        if (normalized === 'DEVELOP') {
            return (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    DEVELOP
                </span>
            );
        }
        return (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
                AT RISK
            </span>
        );
    };

    // Format date e.g. "Oct 14, 26"
    const formatDate = (iso: string) => {
        try {
            const d = new Date(iso);
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit'
            });
        } catch {
            return 'Oct 14, 26';
        }
    };


    return (
        <div className="min-h-screen bg-[#0D0F12] text-zinc-100 flex flex-col font-sans select-text">
            {/* ═══ TOP BREADCRUMB & HEADER ═══ */}
            <div className="bg-[#15181E] border-b border-[#222732] px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={onBack}
                            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-2 mb-2 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to Part Practice Hub
                        </button>
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl">📜</span>
                            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                Part Practice Drill History Matrix
                            </h1>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                            Comprehensive evaluation telemetry and single-part attempt logs across all modules
                        </p>
                    </div>

                    {/* Quick Metric Pills */}
                    <div className="flex items-center gap-3">
                        <div className="bg-[#0D0F12] border border-[#222732] rounded-xl px-3.5 py-2">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">
                                Total Drills
                            </span>
                            <span className="text-base font-bold text-white font-mono">
                                {metrics.total}
                            </span>
                        </div>
                        <div className="bg-[#0D0F12] border border-[#222732] rounded-xl px-3.5 py-2">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">
                                Mean Band
                            </span>
                            <span className="text-base font-bold text-emerald-400 font-mono">
                                {metrics.avgBand}
                            </span>
                        </div>
                        <div className="bg-[#0D0F12] border border-[#222732] rounded-xl px-3.5 py-2">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">
                                Mean Accuracy
                            </span>
                            <span className="text-base font-bold text-sky-400 font-mono">
                                {metrics.avgAccuracy}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ MATRIX TOOLBAR (DUAL TOGGLE & FILTERS) ═══ */}
            <div className="max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
                <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                    {/* Dual Segment Switcher */}
                    <div className="bg-[#0D0F12] border border-[#222732] p-1 rounded-xl flex gap-1 w-full md:w-auto">
                        <button
                            onClick={() => setViewMode('part')}
                            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                viewMode === 'part'
                                    ? 'bg-[#222732] text-white shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <span>📖</span>
                            Parts Practice Logs
                        </button>
                        <button
                            onClick={() => setViewMode('question_type')}
                            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                viewMode === 'question_type'
                                    ? 'bg-[#222732] text-white shadow-sm'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <span>🎯</span>
                            Question Type Drill Logs
                        </button>
                    </div>

                    {/* Filter & Search Controls */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative flex-1 md:w-56">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search drills or exams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
                            />
                        </div>

                        {/* Module Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Filter:</span>
                            <select
                                value={moduleFilter}
                                onChange={(e) => setModuleFilter(e.target.value)}
                                className="bg-[#0D0F12] border border-[#222732] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-zinc-700 transition-colors"
                            >
                                <option value="all">All Modules</option>
                                <option value="reading">Reading</option>
                                <option value="listening">Listening</option>
                                <option value="writing">Writing</option>
                                {viewMode === 'part' && <option value="speaking">Speaking</option>}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ═══ TELEMETRY TABLE ═══ */}
                <div className="bg-[#15181E] border border-[#222732] rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#222732] bg-[#12151B] text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                    <th className="py-3.5 px-4">DATE</th>
                                    <th className="py-3.5 px-4">MODULE / TYPE</th>
                                    <th className="py-3.5 px-4">
                                        {viewMode === 'part' ? 'EXAM / DRILL NAME' : 'DRILL NAME'}
                                    </th>
                                    <th className="py-3.5 px-4">
                                        {viewMode === 'part' ? 'SCOPED TARGET' : 'SOURCE EXAM'}
                                    </th>
                                    <th className="py-3.5 px-4">BAND / ACCURACY</th>
                                    <th className="py-3.5 px-4">STATUS</th>
                                    <th className="py-3.5 px-4 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#222732]/60 text-xs">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-zinc-500">
                                            Loading drill telemetry...
                                        </td>
                                    </tr>
                                ) : attempts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8">
                                            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-[#12141a]/50">
                                                <span className="text-3xl mb-3">📋</span>
                                                <h3 className="text-sm font-semibold text-zinc-300">No practice history yet</h3>
                                                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                                                    You haven't completed any drills under this account. Complete a practice drill to view detailed diagnostic telemetry.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredAttempts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-zinc-500">
                                            No drill records found matching the active filters.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAttempts.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="hover:bg-[#1A1D24]/80 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedAttempt(row)}
                                        >
                                            {/* Date */}
                                            <td className="py-4 px-4 font-mono text-zinc-400">
                                                {formatDate(row.created_at)}
                                            </td>

                                            {/* Module */}
                                            <td className="py-4 px-4">
                                                {renderModuleBadge(row.module)}
                                            </td>

                                            {/* Exam Title or Drill Name */}
                                            <td className="py-4 px-4">
                                                <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                                    {viewMode === 'part'
                                                        ? row.exam_title
                                                        : (row.drill_name || row.exam_title)}
                                                </div>
                                                <div className="text-[11px] text-zinc-500 mt-0.5">
                                                    {row.category === 'general' ? 'General Training' : 'Academic Cambridge Series'}
                                                </div>
                                            </td>

                                            {/* Scoped Target or Source Exam */}
                                            <td className="py-4 px-4">
                                                <span className="font-mono text-zinc-300 bg-[#0D0F12] px-2.5 py-1 rounded-md border border-[#222732]">
                                                    {viewMode === 'part'
                                                        ? row.scoped_target
                                                        : (row.source_exam || row.exam_title)}
                                                </span>
                                            </td>

                                            {/* Band / Accuracy */}
                                            <td className="py-4 px-4 font-mono">
                                                <div className="text-white font-bold">
                                                    {row.band_score > 0
                                                        ? `${row.band_score.toFixed(1)} / ${row.accuracy_percentage}%`
                                                        : `${row.accuracy_percentage}%`}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 mt-0.5">
                                                    {row.total_questions > 0 ? `${row.raw_score}/${row.total_questions} correct` : 'AI Evaluation'}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4">
                                                {renderStatusBadge(row.status)}
                                            </td>

                                            {/* Action Button */}
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedAttempt(row);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#222732] hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    VIEW ANALYSIS →
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Canonical Analysis Canvas Modal Mount */}
            {selectedAttempt && (
                <>
                    {selectedAttempt.module === 'writing' && (
                        <WritingEvaluationCanvas
                            {...adaptWritingPartPractice(selectedAttempt, () => setSelectedAttempt(null), true)}
                        />
                    )}
                    {selectedAttempt.module === 'reading' && (
                        <IELTSAnalysisView
                            {...adaptReadingPartPractice(selectedAttempt, () => setSelectedAttempt(null), true)}
                        />
                    )}
                    {selectedAttempt.module === 'listening' && (
                        <ListeningAnalysisModal
                            {...adaptListeningPartPractice(selectedAttempt, () => setSelectedAttempt(null), true)}
                        />
                    )}
                    {selectedAttempt.module === 'speaking' && (
                        <SpeakingEvaluationCanvas
                            {...adaptSpeakingPartPractice(selectedAttempt, () => setSelectedAttempt(null), true)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default PartPracticeHistoryMatrix;

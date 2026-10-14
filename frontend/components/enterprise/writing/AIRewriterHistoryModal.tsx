import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface RewriterHistoryRecord {
    id: string;
    user_id?: string;
    task_type: string;
    target_band: number;
    prompt_text?: string;
    original_text: string;
    rewritten_text: string;
    overall_band?: number;
    criteria_scores: {
        tr?: { score: number; feedback?: string; fixes?: string[] };
        cc?: { score: number; feedback?: string; fixes?: string[] };
        lr?: { score: number; feedback?: string; fixes?: string[] };
        gra?: { score: number; feedback?: string; fixes?: string[] };
    };
    diff_chunks?: Array<{ type: 'unchanged' | 'removed' | 'added'; text: string; explanation?: string }>;
    high_yield_collocations?: string[];
    lexical_index?: number;
    complexity_ratio?: number;
    created_at: string;
}

export interface AIRewriterHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectRewrite?: (record: RewriterHistoryRecord) => void;
    userEmail?: string;
    selectedRewriteId?: string | null;
}

export const AIRewriterHistoryModal: React.FC<AIRewriterHistoryModalProps> = ({
    isOpen,
    onClose,
    onSelectRewrite,
    selectedRewriteId,
}) => {
    const [history, setHistory] = useState<RewriterHistoryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<RewriterHistoryRecord | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        const loadHistory = async () => {
            setIsLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                const res = await fetch('/api/ielts/writing/history', {
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                });

                if (res.ok) {
                    const data: RewriterHistoryRecord[] = await res.json();
                    if (isMounted) {
                        setHistory(data);
                        if (selectedRewriteId) {
                            const found = data.find(r => r.id === selectedRewriteId);
                            if (found) setSelectedRecord(found);
                        } else if (data.length > 0) {
                            setSelectedRecord(data[0]);
                        }
                    }
                } else {
                    console.warn('[RewriterHistory] API returned status:', res.status);
                }
            } catch (err) {
                console.error('[RewriterHistory] Failed to load history:', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadHistory();
        return () => { isMounted = false; };
    }, [isOpen, selectedRewriteId]);

    if (!isOpen) return null;

    const formatTaskLabel = (type: string) => {
        if (type === 'academic_task1') return 'Academic Task 1';
        if (type === 'gt_task1') return 'GT Task 1';
        return 'Task 2 Essay';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-5xl h-[88vh] bg-[#0D0F12] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-200">
                {/* Header */}
                <div className="px-6 py-4 bg-[#141519] border-b border-zinc-800/80 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                            📜
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white tracking-wide">
                                AI Rewriter & Diagnostic History
                            </h2>
                            <p className="text-xs text-zinc-400">
                                Authenticated student repository of Cambridge 4-pillar redline rewrites
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
                    {/* Left: Attempts List */}
                    <div className="w-full md:w-80 border-r border-zinc-800/80 bg-[#101216] flex flex-col shrink-0 overflow-y-auto">
                        <div className="p-3 border-b border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                            <span>Saved Rewrites ({history.length})</span>
                            {isLoading && <span className="animate-spin text-rose-400">⏳</span>}
                        </div>

                        {history.length === 0 && !isLoading && (
                            <div className="p-8 text-center text-xs text-zinc-500">
                                No rewritten essays found. Run a diagnostic or generate a model answer in Writing Studio!
                            </div>
                        )}

                        <div className="p-2 space-y-1.5">
                            {history.map((record) => {
                                const isSelected = selectedRecord?.id === record.id;
                                return (
                                    <button
                                        key={record.id}
                                        onClick={() => setSelectedRecord(record)}
                                        className={`w-full p-3 rounded-xl border text-left transition-all ${
                                            isSelected
                                                ? 'bg-[#181B22] border-rose-500/50 shadow-sm'
                                                : 'bg-[#141519] border-zinc-800/70 hover:border-zinc-700 hover:bg-[#16181F]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="text-xs font-semibold text-white">
                                                {formatTaskLabel(record.task_type)}
                                            </span>
                                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                                                Band {record.overall_band?.toFixed(1) || record.target_band.toFixed(1)}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                                            {record.prompt_text || record.original_text.substring(0, 60)}
                                        </p>
                                        <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                                            {new Date(record.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Selected Attempt Detail */}
                    <div className="flex-1 min-h-0 bg-[#0D0F12] p-6 overflow-y-auto space-y-5">
                        {selectedRecord ? (
                            <>
                                {/* Top Badges & Actions */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-800 text-zinc-200 border border-zinc-700">
                                            {formatTaskLabel(selectedRecord.task_type)}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                            Overall: Band {selectedRecord.overall_band?.toFixed(1) || selectedRecord.target_band.toFixed(1)}
                                        </span>
                                        <span className="text-xs text-zinc-500 font-mono">
                                            Target: Band {selectedRecord.target_band.toFixed(1)}
                                        </span>
                                    </div>

                                    {onSelectRewrite && (
                                        <button
                                            onClick={() => {
                                                onSelectRewrite(selectedRecord);
                                                onClose();
                                            }}
                                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md active:scale-95"
                                        >
                                            [ Load into Studio ]
                                        </button>
                                    )}
                                </div>

                                {/* Criteria Pillars */}
                                {selectedRecord.criteria_scores && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                                            Cambridge 4-Pillar Scores
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <div className="p-2.5 bg-[#141519] border border-zinc-800 rounded-xl">
                                                <div className="text-[10px] text-zinc-500 font-bold uppercase">Task Response</div>
                                                <div className="text-lg font-black text-white mt-0.5">
                                                    {selectedRecord.criteria_scores.tr?.score?.toFixed(1) || '—'}
                                                </div>
                                            </div>
                                            <div className="p-2.5 bg-[#141519] border border-zinc-800 rounded-xl">
                                                <div className="text-[10px] text-zinc-500 font-bold uppercase">Coherence & Cohesion</div>
                                                <div className="text-lg font-black text-white mt-0.5">
                                                    {selectedRecord.criteria_scores.cc?.score?.toFixed(1) || '—'}
                                                </div>
                                            </div>
                                            <div className="p-2.5 bg-[#141519] border border-zinc-800 rounded-xl">
                                                <div className="text-[10px] text-zinc-500 font-bold uppercase">Lexical Resource</div>
                                                <div className="text-lg font-black text-white mt-0.5">
                                                    {selectedRecord.criteria_scores.lr?.score?.toFixed(1) || '—'}
                                                </div>
                                            </div>
                                            <div className="p-2.5 bg-[#141519] border border-zinc-800 rounded-xl">
                                                <div className="text-[10px] text-zinc-500 font-bold uppercase">Grammar Range</div>
                                                <div className="text-lg font-black text-white mt-0.5">
                                                    {selectedRecord.criteria_scores.gra?.score?.toFixed(1) || '—'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Prompt & Texts Comparison */}
                                {selectedRecord.prompt_text && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Prompt / Topic</h3>
                                        <p className="text-xs text-zinc-300 bg-[#141519] p-3 rounded-xl border border-zinc-800/80">
                                            {selectedRecord.prompt_text}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                                            Original Student Draft
                                        </h3>
                                        <div className="p-3.5 bg-[#141519] rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed max-h-72 overflow-y-auto font-sans whitespace-pre-wrap">
                                            {selectedRecord.original_text}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                                            Band 9.0 Benchmark Model Rewrite
                                        </h3>
                                        <div className="p-3.5 bg-[#141519] rounded-xl border border-emerald-900/30 text-xs text-emerald-100/90 leading-relaxed max-h-72 overflow-y-auto font-sans whitespace-pre-wrap">
                                            {selectedRecord.rewritten_text}
                                        </div>
                                    </div>
                                </div>

                                {/* High-Yield Collocations */}
                                {selectedRecord.high_yield_collocations && selectedRecord.high_yield_collocations.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
                                            C1 / C2 Academic Collocations Deployed
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedRecord.high_yield_collocations.map((col, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 rounded-lg text-[11px] bg-cyan-950/40 text-cyan-300 border border-cyan-800/40"
                                                >
                                                    {col}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs text-zinc-500">
                                Select an attempt on the left to inspect redline details and criteria scores.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIRewriterHistoryModal;

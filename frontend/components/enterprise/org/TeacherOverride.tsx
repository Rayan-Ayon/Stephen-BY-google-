import React, { useState, useMemo } from 'react';
import { useCoachingTelemetry, CoachingHandwrittenSubmission, CoachingSpeakingSession } from '@/hooks/useCoachingTelemetry';
import { X, CheckCircle2, RotateCcw, Award, RefreshCw, Eye } from 'lucide-react';
import { toast } from 'sonner';

export interface TeacherOverrideProps {
  essays?: CoachingHandwrittenSubmission[];
  speaking?: CoachingSpeakingSession[];
  loading?: boolean;
  onRefresh?: () => void;
}

type StatusFilter = 'All' | 'Pending' | 'Approved' | 'Overridden';
type ModuleFilter = 'All' | 'Writing' | 'Speaking';

interface UnifiedReviewItem {
  id: string;
  submissionType: 'essay' | 'speaking';
  name: string;
  batch: string;
  module: string;
  aiScore: number;
  overrideScore?: number;
  status: 'Pending' | 'Approved' | 'Overridden';
  submitted: string;
  feedback?: string;
  audioUrl?: string;
  imageUrl?: string;
  rawText?: string;
}

const STATUS_PILL: Record<string, { label: string; icon: string; className: string }> = {
  Pending: {
    label: 'Pending',
    icon: '⏳',
    className: 'bg-amber-500/10 border border-amber-500/30 text-amber-400',
  },
  Approved: {
    label: 'Approved',
    icon: '✅',
    className: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
  },
  Overridden: {
    label: 'Overridden',
    icon: '🔄',
    className: 'bg-rose-500/10 border border-rose-500/30 text-rose-400',
  },
};

export const TeacherOverride: React.FC<TeacherOverrideProps> = ({
  essays: essaysProp,
  speaking: speakingProp,
  loading: loadingProp,
  onRefresh: onRefreshProp,
}) => {
  const telemetry = useCoachingTelemetry();
  const loading = loadingProp !== undefined ? loadingProp : telemetry.loading;
  const refresh = onRefreshProp || telemetry.refresh;
  const submitReview = telemetry.submitReview;
  const metrics = telemetry.metrics;

  const rawEssays = essaysProp !== undefined ? essaysProp : telemetry.handwrittenEssays;
  const rawSpeaking = speakingProp !== undefined ? speakingProp : telemetry.speakingSessions;
  const essays = Array.isArray(rawEssays) ? rawEssays : [];
  const speaking = Array.isArray(rawSpeaking) ? rawSpeaking : [];

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>('All');

  // Modal State
  const [selectedItem, setSelectedItem] = useState<UnifiedReviewItem | null>(null);
  const [newScore, setNewScore] = useState<number>(7.0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transform live data into unified review entries with defensive validation
  const unifiedEntries: UnifiedReviewItem[] = useMemo(() => {
    const list: UnifiedReviewItem[] = [];

    // 1. Handwritten Essays
    if (Array.isArray(essays)) {
      essays.forEach((e) => {
        if (!e) return;
        const isOverridden = !!e.teacher_override_band && e.teacher_override_band !== e.ai_band_score;
        const status: 'Pending' | 'Approved' | 'Overridden' =
          e.status === 'pending' ? 'Pending' : isOverridden ? 'Overridden' : 'Approved';

        list.push({
          id: e.id || `essay-${Math.random()}`,
          submissionType: 'essay',
          name: e.student_name || 'Candidate Scholar',
          batch: 'Cohort #08',
          module: `Writing (${e.prompt_title || 'Task 2'})`,
          aiScore: e.ai_band_score || 6.5,
          overrideScore: e.teacher_override_band,
          status,
          submitted: e.created_at ? new Date(e.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          }) : 'Recent',
          feedback: e.teacher_feedback,
          imageUrl: e.image_url,
          rawText: e.ocr_extracted_text
        });
      });
    }

    // 2. Speaking Sessions
    if (Array.isArray(speaking)) {
      speaking.forEach((s) => {
        if (!s) return;
        const isOverridden = !!s.teacher_override_band && s.teacher_override_band !== s.overall_band;
        const status: 'Pending' | 'Approved' | 'Overridden' =
          s.status === 'pending' ? 'Pending' : isOverridden ? 'Overridden' : 'Approved';

        list.push({
          id: s.id || `speaking-${Math.random()}`,
          submissionType: 'speaking',
          name: s.student_name || (s as any)?.profiles?.full_name || 'Speaking Candidate',
          batch: 'Cohort #08',
          module: 'Speaking (AI Live Partner)',
          aiScore: s.overall_band || 6.5,
          overrideScore: s.teacher_override_band,
          status,
          submitted: s.created_at ? new Date(s.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          }) : 'Recent',
          feedback: s.teacher_feedback,
          audioUrl: s.audio_url,
          rawText: s.transcript
        });
      });
    }

    return list;
  }, [essays, speaking]);

  // 1. Loading Skeleton State
  if (loading && unifiedEntries.length === 0) {
    return (
      <div className="w-full min-h-[600px] bg-[#0D0F12] text-[#F3F4F6] p-6 lg:p-8 font-sans space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-6 w-80 bg-[#15181E] animate-pulse rounded-lg" />
            <div className="h-4 w-96 bg-[#15181E]/60 animate-pulse rounded-lg" />
          </div>
          <div className="h-8 w-32 bg-[#15181E] animate-pulse rounded-lg" />
        </header>

        <div className="rounded-2xl border border-[#222732] bg-[#15181E] p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full bg-[#181C24] animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // 2. Resilient Empty State Card
  if (!loading && unifiedEntries.length === 0) {
    return (
      <div className="w-full min-h-[600px] bg-[#0D0F12] text-[#F3F4F6] p-6 lg:p-8 font-sans space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white uppercase">
              TEACHER OVERRIDE STUDIO <span className="text-slate-600">//</span> UNIFIED EVALUATION QUEUE
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review AI band scores, calibrate sub-criteria sub-scores, and issue definitive teacher overrides
            </p>
          </div>

          <button
            onClick={() => refresh()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300 hover:text-white text-xs font-semibold transition-all hover:bg-[#181C24] cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync All Queues</span>
          </button>
        </header>

        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-950/40 text-amber-400 border border-amber-800/30 flex items-center justify-center mx-auto text-xl font-bold">
            ⚖️
          </div>
          <h3 className="text-lg font-bold text-white">No Submissions Requiring Teacher Override</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            All AI evaluated essays and speaking tests are currently calibrated. Newly submitted assignments will appear here automatically.
          </p>
          <button
            onClick={() => refresh()}
            className="mt-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Evaluation Pipeline</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter application
  const filtered = unifiedEntries.filter((item) => {
    const matchSearch =
      (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.module || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.batch || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchModule =
      moduleFilter === 'All' ||
      (moduleFilter === 'Writing' && item.submissionType === 'essay') ||
      (moduleFilter === 'Speaking' && item.submissionType === 'speaking');

    return matchSearch && matchStatus && matchModule;
  });

  const handleOpenOverride = (item: UnifiedReviewItem) => {
    setSelectedItem(item);
    setNewScore(item.overrideScore || item.aiScore);
    setFeedback(item.feedback || '');
  };

  const handleQuickApprove = async (item: UnifiedReviewItem) => {
    try {
      await submitReview({
        submissionId: item.id,
        submissionType: item.submissionType,
        overrideBand: item.aiScore,
        feedbackText: 'AI score verified and officially approved by Faculty.'
      });
      toast.success(`Score verified at Band ${item.aiScore} for ${item.name}!`);
    } catch {
      toast.error('Failed to quick-approve score');
    }
  };

  const handleSaveOverride = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);

    try {
      await submitReview({
        submissionId: selectedItem.id,
        submissionType: selectedItem.submissionType,
        overrideBand: Number(newScore),
        feedbackText: feedback.trim()
      });
      toast.success(`Teacher override saved! New score: Band ${newScore}`);
      setSelectedItem(null);
    } catch {
      toast.error('Failed to save teacher override');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = unifiedEntries.filter((e) => e.status === 'Pending').length;
  const approvedCount = unifiedEntries.filter((e) => e.status === 'Approved').length;

  return (
    <div className="w-full min-h-[600px] bg-[#0D0F12] text-[#F3F4F6] p-6 lg:p-8 font-sans space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-white uppercase">
            TEACHER OVERRIDE STUDIO <span className="text-slate-600">//</span> UNIFIED EVALUATION QUEUE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review AI band scores, calibrate sub-criteria sub-scores, and issue definitive teacher overrides
          </p>
        </div>

        <button
          onClick={() => refresh()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300 hover:text-white text-xs font-semibold transition-all hover:bg-[#181C24] cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync All Queues</span>
        </button>
      </header>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search candidate name, module, or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#15181E] border border-[#222732] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-600/70 transition-colors shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="bg-[#15181E] border border-[#222732] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-rose-600/70 transition-colors cursor-pointer"
          >
            <option value="All">All Statuses ({unifiedEntries.length})</option>
            <option value="Pending">Pending ({pendingCount})</option>
            <option value="Approved">Approved ({approvedCount})</option>
            <option value="Overridden">Overridden</option>
          </select>

          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value as ModuleFilter)}
            className="bg-[#15181E] border border-[#222732] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-rose-600/70 transition-colors cursor-pointer"
          >
            <option value="All">All Modules</option>
            <option value="Writing">Writing Essays</option>
            <option value="Speaking">Speaking Audios</option>
          </select>
        </div>
      </div>

      {/* Main Review Table */}
      <div className="rounded-2xl border border-[#222732] overflow-hidden bg-[#15181E] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#181C24] border-b border-[#222732]">
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Candidate
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Module &amp; Task
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  AI Score
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Teacher Score
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Submitted
                </th>
                <th className="text-right px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222732]">
              {filtered.map((entry) => {
                const pill = STATUS_PILL[entry.status] || STATUS_PILL.Pending;

                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-[#181C24] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-100">{entry.name}</p>
                      <p className="text-[11px] text-slate-400">{entry.batch}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-300 font-medium max-w-xs truncate">
                      {entry.module}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-300">
                      Band {entry.aiScore.toFixed(1)}
                    </td>
                    <td className="px-5 py-4">
                      {entry.overrideScore ? (
                        <span className="font-mono font-bold text-amber-400">
                          Band {entry.overrideScore.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs italic">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${pill.className}`}
                      >
                        <span>{pill.icon}</span>
                        <span>{pill.label}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-mono text-xs">
                      {entry.submitted}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {entry.status === 'Pending' && (
                          <button
                            onClick={() => handleQuickApprove(entry)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Quick Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenOverride(entry)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#181C24] hover:bg-rose-600 text-slate-200 hover:text-white border border-[#222732] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Audit / Override</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-slate-400 text-sm space-y-1">
            <p className="font-semibold text-slate-300">No submissions matching filter</p>
            <p className="text-xs text-slate-500">All submissions have been verified or filtered out.</p>
          </div>
        )}
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Reviews', value: String(pendingCount), icon: '📝' },
          { label: 'Approved Today', value: String(metrics?.approvedTodayCount ?? approvedCount), icon: '✅' },
          { label: 'Cohort Average Band', value: String(metrics?.averageBandScore ?? 6.8), icon: '🎯' },
          { label: 'Avg Review Time', value: '3.6 min', icon: '⏱' },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl bg-[#15181E] border border-[#222732] px-5 py-4 flex items-center gap-4"
          >
            <span className="text-2xl">{m.icon}</span>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                {m.label}
              </p>
              <p className="text-xl font-bold text-white mt-0.5">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Override Calibration Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#15181E] border border-[#222732] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#222732] flex items-center justify-between bg-[#181C24]">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Teacher Calibration &amp; Score Override
                  </h3>
                  <p className="text-xs text-slate-400">
                    Candidate: <span className="text-amber-400 font-semibold">{selectedItem.name}</span> • {selectedItem.module}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#15181E] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {/* Submission preview */}
              {selectedItem.submissionType === 'essay' && selectedItem.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-[#222732] bg-black h-48 flex items-center justify-center">
                  <img
                    src={selectedItem.imageUrl}
                    alt="Submission Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              {selectedItem.submissionType === 'speaking' && selectedItem.audioUrl && (
                <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Speaking Audio Clip</span>
                  <audio controls src={selectedItem.audioUrl} className="h-8 w-60" />
                </div>
              )}

              {/* Text content preview */}
              {selectedItem.rawText && (
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
                    Extracted Submission Content
                  </span>
                  <div className="bg-[#12141A] border border-[#222732] rounded-xl p-3 text-xs text-slate-200 max-h-36 overflow-y-auto font-mono whitespace-pre-line leading-relaxed">
                    {selectedItem.rawText}
                  </div>
                </div>
              )}

              {/* Side-by-side Score Calibration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#181C24] border border-[#222732] rounded-2xl p-4 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Original AI Score
                  </span>
                  <p className="text-2xl font-black text-slate-300 font-mono mt-1">
                    Band {selectedItem.aiScore.toFixed(1)}
                  </p>
                </div>

                <div className="bg-[#181C24] border border-amber-500/30 rounded-2xl p-4 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
                    Teacher Overridden Score
                  </span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <input
                      type="number"
                      step="0.5"
                      min="4.0"
                      max="9.0"
                      value={newScore}
                      onChange={(e) => setNewScore(parseFloat(e.target.value) || 7.0)}
                      className="w-20 bg-[#12141A] border border-[#222732] rounded-lg px-2 py-1 text-center font-bold text-amber-400 text-lg focus:outline-none focus:border-rose-600"
                    />
                    <span className="text-xs text-slate-400 font-bold">/ 9.0</span>
                  </div>
                </div>
              </div>

              {/* Feedback text */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Teacher Calibration Notes &amp; Official Feedback:
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide definitive feedback explaining any discrepancy between AI rubric evaluation and instructor calibration..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-[#12141A] border border-[#222732] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-600 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#222732] bg-[#181C24] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Apply Official Override'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherOverride;

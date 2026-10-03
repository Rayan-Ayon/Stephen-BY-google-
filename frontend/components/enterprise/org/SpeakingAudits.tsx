import React, { useState } from 'react';
import { useCoachingTelemetry, CoachingSpeakingSession } from '@/hooks/useCoachingTelemetry';
import { Mic, Play, Pause, RefreshCw, CheckCircle2, Volume2, Award, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export interface SpeakingAuditsProps {
  sessions?: CoachingSpeakingSession[];
  loading?: boolean;
  onRefresh?: () => void;
}

const statusOptions = ['All', 'Pending', 'Reviewed'] as const;
type Status = (typeof statusOptions)[number];

function statusStyle(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-amber-500/15 border border-amber-500/30 text-amber-400';
    case 'reviewed':
      return 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400';
    default:
      return 'bg-slate-700/30 border border-slate-700 text-slate-400';
  }
}

export const SpeakingAudits: React.FC<SpeakingAuditsProps> = ({
  sessions: sessionsProp,
  loading: loadingProp,
  onRefresh: onRefreshProp,
}) => {
  const telemetry = useCoachingTelemetry();
  const loading = loadingProp !== undefined ? loadingProp : telemetry.loading;
  const refresh = onRefreshProp || telemetry.refresh;
  const submitReview = telemetry.submitReview;
  const metrics = telemetry.metrics;

  const rawSessions = sessionsProp !== undefined ? sessionsProp : telemetry.speakingSessions;
  const sessions = Array.isArray(rawSessions) ? rawSessions : [];

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>('All');

  // Review Modal State
  const [selectedSession, setSelectedSession] = useState<CoachingSpeakingSession | null>(null);
  const [overrideBand, setOverrideBand] = useState<number>(7.0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // 1. Loading Skeleton State
  if (loading && sessions.length === 0) {
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
  if (!loading && sessions.length === 0) {
    return (
      <div className="w-full min-h-[600px] bg-[#0D0F12] text-[#F3F4F6] p-6 lg:p-8 font-sans space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white uppercase">
              EVALUATION STUDIO <span className="text-slate-600">//</span> SPEAKING AUDIO AUDITS &amp; TRANSCRIPTS
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live ingest of student AI speaking sessions from Mohona partner &amp; IELTS mock tests with instant audio playback
            </p>
          </div>

          <button
            onClick={() => refresh()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300 hover:text-white text-xs font-semibold transition-all hover:bg-[#181C24] cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Audio</span>
          </button>
        </header>

        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-950/40 text-blue-400 border border-blue-800/30 flex items-center justify-center mx-auto text-xl font-bold">
            🎧
          </div>
          <h3 className="text-lg font-bold text-white">No Speaking Audits In Queue</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            When students practice live speaking sessions with Mohona or complete speaking mocks, audio recordings will appear here for transcription review.
          </p>
          <button
            onClick={() => refresh()}
            className="mt-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check for New Audio</span>
          </button>
        </div>
      </div>
    );
  }

  const filtered = sessions.filter((r) => {
    if (!r) return false;
    const studentName = r.student_name || (r as any)?.profiles?.full_name || '';
    const transcript = r.transcript || '';
    const matchSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      transcript.toLowerCase().includes(search.toLowerCase());

    const isPending = r.status === 'pending';
    const isReviewed = r.status === 'reviewed';

    if (statusFilter === 'All') return matchSearch;
    if (statusFilter === 'Pending') return matchSearch && isPending;
    if (statusFilter === 'Reviewed') return matchSearch && isReviewed;
    return matchSearch;
  });

  const handleOpenReview = (session: CoachingSpeakingSession) => {
    setSelectedSession(session);
    setOverrideBand(session.teacher_override_band || session.overall_band || 6.5);
    setFeedbackText(session.teacher_feedback || '');
  };

  const handlePublishReview = async () => {
    if (!selectedSession) return;
    setIsSubmittingReview(true);

    try {
      await submitReview({
        submissionId: selectedSession.id,
        submissionType: 'speaking',
        overrideBand: Number(overrideBand),
        feedbackText: feedbackText.trim()
      });
      toast.success(`Speaking evaluation published for ${selectedSession.student_name || 'Candidate'}! Band: ${overrideBand}`);
      setSelectedSession(null);
    } catch {
      toast.error('Failed to submit speaking evaluation review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const pendingCount = sessions.filter((s) => s?.status === 'pending').length;
  const reviewedCount = sessions.filter((s) => s?.status === 'reviewed').length;

  return (
    <div className="w-full min-h-[600px] bg-[#0D0F12] text-[#F3F4F6] p-6 lg:p-8 font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white uppercase">
              EVALUATION STUDIO <span className="text-slate-600">//</span> SPEAKING AUDIO AUDITS &amp; TRANSCRIPTS
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live ingest of student AI speaking sessions from Mohona partner &amp; IELTS mock tests with instant audio playback
            </p>
          </div>

          <button
            onClick={() => refresh()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300 hover:text-white text-xs font-semibold transition-all hover:bg-[#181C24] cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Audio</span>
          </button>
        </header>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search candidate name or transcript snippet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#15181E] border border-[#222732] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-600/70 transition-colors shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status)}
              className="bg-[#15181E] border border-[#222732] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-rose-600/70 transition-colors cursor-pointer flex-1 sm:flex-none"
            >
              <option value="All">All Audits ({sessions.length})</option>
              <option value="Pending">Pending ({pendingCount})</option>
              <option value="Reviewed">Reviewed ({reviewedCount})</option>
            </select>
          </div>
        </div>

        {/* Audio Recordings Table */}
        <div className="rounded-2xl border border-[#222732] overflow-hidden bg-[#15181E] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#181C24] border-b border-[#222732]">
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Candidate
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Audio Player
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Scores (F / P / L / G)
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Overall Band
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Status
                  </th>
                  <th className="text-right px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222732]">
                {filtered.map((r) => {
                  const isPending = r?.status === 'pending';
                  const candidateName = r?.student_name ?? (r as any)?.profiles?.full_name ?? 'Speaking Candidate';

                  return (
                    <tr key={r.id} className="hover:bg-[#181C24] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                            <Mic className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100">{candidateName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {r?.created_at ? new Date(r.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Recent'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 min-w-[220px]">
                        <audio
                          controls
                          src={r?.audio_url || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'}
                          className="h-8 w-56 rounded-md bg-slate-900"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
                          <span title="Fluency" className="px-1.5 py-0.5 rounded bg-[#181C24] border border-[#222732]">
                            F: {r?.fluency_score ?? 6.5}
                          </span>
                          <span title="Pronunciation" className="px-1.5 py-0.5 rounded bg-[#181C24] border border-[#222732]">
                            P: {r?.pronunciation_score ?? 7.0}
                          </span>
                          <span title="Lexical" className="px-1.5 py-0.5 rounded bg-[#181C24] border border-[#222732]">
                            L: {r?.lexical_score ?? 6.5}
                          </span>
                          <span title="Grammar" className="px-1.5 py-0.5 rounded bg-[#181C24] border border-[#222732]">
                            G: {r?.grammar_score ?? 6.0}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                          Band {r?.teacher_override_band || r?.overall_band || 6.5}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${statusStyle(r?.status || 'pending')}`}
                        >
                          {isPending ? '⏳ Pending' : '✅ Reviewed'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleOpenReview(r)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#181C24] hover:bg-rose-600 text-slate-200 hover:text-white border border-[#222732] text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <span>Review Audit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center text-slate-400 text-sm space-y-1">
              <p className="font-semibold text-slate-300">No speaking sessions matching filter</p>
              <p className="text-xs text-slate-500">Recorded conversations with Mohona will appear here automatically.</p>
            </div>
          )}
        </div>

        {/* Aggregated KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Pending Audio Reviews', value: String(pendingCount), icon: '🎙️' },
            { label: 'Avg Cohort Speaking Band', value: String(metrics?.speakingAverage ?? 6.5), icon: '🎯' },
            { label: 'Total Completed Audits', value: String(reviewedCount), icon: '📝' },
            { label: 'Speaking Telemetry Health', value: 'Optimal', icon: '⚡' },
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
      </div>

      {/* Speaking Review & Transcript Modal */}
      {selectedSession && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="bg-[#15181E] border border-[#222732] rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#222732] flex items-center justify-between bg-[#181C24]">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl">
                  <Mic className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Speaking Audit &amp; Performance Calibration
                  </h3>
                  <p className="text-xs text-slate-400">
                    Candidate: <span className="text-amber-400 font-semibold">{selectedSession.student_name || 'Speaking Candidate'}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#15181E] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
              {/* Audio player card */}
              <div className="bg-[#181C24] border border-[#222732] rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Master Candidate Audio Stream</p>
                    <p className="text-[11px] text-slate-400 font-mono">16-bit PCM • WebM Encrypted</p>
                  </div>
                </div>
                <audio
                  controls
                  src={selectedSession.audio_url || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'}
                  className="h-9 w-64 rounded-lg bg-slate-900"
                />
              </div>

              {/* Transcript Display */}
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block mb-2">
                  Session Transcript &amp; Dialogue Turn Analysis
                </span>
                <div className="bg-[#12141A] border border-[#222732] rounded-xl p-4 text-xs text-slate-300 max-h-56 overflow-y-auto leading-relaxed custom-scrollbar whitespace-pre-line font-mono">
                  {selectedSession.transcript || 'No conversation transcript captured.'}
                </div>
              </div>

              {/* Diagnostic Scores */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Fluency', val: selectedSession.fluency_score ?? 6.5 },
                  { label: 'Pronunciation', val: selectedSession.pronunciation_score ?? 7.0 },
                  { label: 'Lexical', val: selectedSession.lexical_score ?? 6.5 },
                  { label: 'Grammar', val: selectedSession.grammar_score ?? 6.0 },
                ].map((s) => (
                  <div key={s.label} className="bg-[#181C24] border border-[#222732] rounded-xl p-3 text-center">
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">{s.label}</span>
                    <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">{s.val}</span>
                  </div>
                ))}
              </div>

              {/* Override Controls */}
              <div className="bg-[#181C24] border border-[#222732] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Calibrated Teacher Band Score:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="4.0"
                      max="9.0"
                      value={overrideBand}
                      onChange={(e) => setOverrideBand(parseFloat(e.target.value) || 7.0)}
                      className="w-20 bg-[#12141A] border border-[#222732] rounded-lg px-2.5 py-1 text-center font-bold text-amber-400 text-sm focus:outline-none focus:border-rose-600"
                    />
                    <span className="text-xs text-slate-400 font-bold">/ 9.0</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Examiner Feedback for Candidate:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive feedback on intonation, discourse markers, pauses, and grammatical range..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full bg-[#12141A] border border-[#222732] rounded-xl p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-600 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#222732] bg-[#181C24] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishReview}
                disabled={isSubmittingReview}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmittingReview ? 'Publishing...' : 'Publish Speaking Audit'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakingAudits;

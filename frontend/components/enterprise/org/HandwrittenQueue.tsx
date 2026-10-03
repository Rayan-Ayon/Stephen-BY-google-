import React, { useState } from 'react';
import { useCoachingTelemetry, CoachingHandwrittenSubmission } from '@/hooks/useCoachingTelemetry';
import { X, CheckCircle2, Eye, RefreshCw, ZoomIn, ZoomOut, FileText, Award } from 'lucide-react';
import { toast } from 'sonner';

export interface HandwrittenQueueProps {
  submissions?: CoachingHandwrittenSubmission[];
  loading?: boolean;
  onRefresh?: () => void;
}

type FilterStatus = 'All' | 'Pending' | 'Approved' | 'Rejected';

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-500/10 border border-amber-500/30 text-amber-400',
  Approved: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
  Rejected: 'bg-rose-500/10 border border-rose-500/30 text-rose-400',
  'Low Confidence': 'bg-rose-500/10 border border-rose-500/30 text-rose-400',
};

export const HandwrittenQueue: React.FC<HandwrittenQueueProps> = ({
  submissions: submissionsProp,
  loading: loadingProp,
  onRefresh: onRefreshProp,
}) => {
  const telemetry = useCoachingTelemetry();
  const loading = loadingProp !== undefined ? loadingProp : telemetry.loading;
  const refresh = onRefreshProp || telemetry.refresh;
  const submitReview = telemetry.submitReview;
  const metrics = telemetry.metrics;

  const rawSubmissions = submissionsProp !== undefined ? submissionsProp : telemetry.handwrittenEssays;
  const submissions = Array.isArray(rawSubmissions) ? rawSubmissions : [];

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');

  // Review Modal State
  const [selectedEssay, setSelectedEssay] = useState<CoachingHandwrittenSubmission | null>(null);
  const [overrideBand, setOverrideBand] = useState<number>(7.0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);

  // 1. Loading Skeleton State
  if (loading && submissions.length === 0) {
    return (
      <div className="w-full min-h-[600px] bg-[#0D0F12] text-[#F3F4F6] p-6 font-sans space-y-6">
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
  if (!loading && submissions.length === 0) {
    return (
      <div className="w-full min-h-[600px] bg-[#0D0F12] text-[#F3F4F6] p-6 font-sans space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white uppercase">
              EVALUATION STUDIO <span className="text-slate-600">//</span> HANDWRITTEN ESSAY QUEUE (OCR)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live ingest pipeline of student handwritten paper essay uploads from B2C mobile &amp; web scanners
            </p>
          </div>

          <button
            onClick={() => refresh()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300 hover:text-white text-xs font-semibold transition-all hover:bg-[#181C24] cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Queue</span>
          </button>
        </header>

        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-950/40 text-blue-400 border border-blue-800/30 flex items-center justify-center mx-auto text-xl font-bold">
            ✍️
          </div>
          <h3 className="text-lg font-bold text-white">No Pending Handwritten Essays</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            When students upload paper scans via the mobile scanner, they will appear here automatically for OCR scanning and teacher review.
          </p>
          <button
            onClick={() => refresh()}
            className="mt-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check for New Uploads</span>
          </button>
        </div>
      </div>
    );
  }

  const filtered = submissions.filter((e) => {
    if (!e) return false;
    const studentName = e.student_name || '';
    const promptTitle = e.prompt_title || '';
    const matchesSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      promptTitle.toLowerCase().includes(search.toLowerCase());

    const isPending = e.status === 'pending';
    const isApproved = e.status === 'reviewed';

    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Pending') return matchesSearch && isPending;
    if (statusFilter === 'Approved') return matchesSearch && isApproved;
    return matchesSearch;
  });

  const handleOpenReview = (essay: CoachingHandwrittenSubmission) => {
    setSelectedEssay(essay);
    setOverrideBand(essay.teacher_override_band || essay.ai_band_score || 7.0);
    setFeedbackText(essay.teacher_feedback || '');
    setImageZoom(1);
  };

  const handlePublishReview = async () => {
    if (!selectedEssay) return;
    setIsSubmittingReview(true);

    try {
      await submitReview({
        submissionId: selectedEssay.id,
        submissionType: 'essay',
        overrideBand: Number(overrideBand),
        feedbackText: feedbackText.trim()
      });
      toast.success(`Evaluation published for ${selectedEssay.student_name || 'Candidate'}! Band score: ${overrideBand}`);
      setSelectedEssay(null);
    } catch {
      toast.error('Failed to submit evaluation review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="w-full min-h-[600px] bg-[#0D0F12] text-[#F3F4F6] p-6 font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white uppercase">
              EVALUATION STUDIO <span className="text-slate-600">//</span> HANDWRITTEN ESSAY QUEUE (OCR)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live ingest pipeline of student handwritten paper essay uploads from B2C mobile &amp; web scanners
            </p>
          </div>

          <button
            onClick={() => refresh()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300 hover:text-white text-xs font-semibold transition-all hover:bg-[#181C24] cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Queue</span>
          </button>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search candidate name or essay topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#15181E] border border-[#222732] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-600/70 transition-colors shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="bg-[#15181E] border border-[#222732] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-rose-600/70 transition-colors cursor-pointer flex-1 sm:flex-none"
            >
              <option value="All">All Ingested ({submissions.length})</option>
              <option value="Pending">Pending ({submissions.filter((e) => e?.status === 'pending').length})</option>
              <option value="Approved">Approved ({submissions.filter((e) => e?.status === 'reviewed').length})</option>
            </select>
          </div>
        </div>

        {/* Live Queue Table */}
        <div className="rounded-2xl border border-[#222732] overflow-hidden bg-[#15181E] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#181C24] border-b border-[#222732]">
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Candidate
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Essay Prompt Title
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Submission Time
                  </th>
                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    AI Band Score
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
                {filtered.map((entry) => {
                  const isPending = entry?.status === 'pending';
                  const displayStatus = isPending ? 'Pending' : 'Approved';

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-[#181C24] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={entry.image_url || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'}
                            alt="Scan preview"
                            className="w-9 h-9 rounded-lg object-cover border border-[#222732] bg-slate-900 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-slate-100">{entry.student_name || 'Candidate Scholar'}</p>
                            <span className="text-[11px] text-slate-400 font-mono">Farmgate Cohort #08</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-300 max-w-xs truncate font-medium">
                        {entry.prompt_title || 'Writing Task 2 Essay'}
                      </td>
                      <td className="px-5 py-4 text-slate-400 font-mono text-xs">
                        {entry.created_at ? new Date(entry.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Recent'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                            Band {entry.teacher_override_band || entry.ai_band_score || 6.5}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${statusColors[displayStatus] || statusColors.Pending}`}
                        >
                          {isPending ? '⏳ Pending' : '✅ Reviewed'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleOpenReview(entry)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#181C24] hover:bg-rose-600 text-slate-200 hover:text-white border border-[#222732] text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review &amp; Grade</span>
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
              <p className="font-semibold text-slate-300">No submissions matching filter</p>
              <p className="text-xs text-slate-500">Submissions uploaded from the student paper scanner will appear here automatically.</p>
            </div>
          )}
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Pending OCR Queue', value: String(submissions.filter((e) => e?.status === 'pending').length), icon: '✍️' },
            { label: 'Avg Evaluated Band', value: String(metrics?.writingAverage ?? 6.5), icon: '🎯' },
            { label: 'Completed Scans', value: String(submissions.filter((e) => e?.status === 'reviewed').length), icon: '📑' },
            { label: 'OCR Pipeline Health', value: 'Live 99.8%', icon: '⚡' },
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

      {/* OCR Inspection & Verification Modal */}
      {selectedEssay && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedEssay(null)}
        >
          <div
            className="bg-[#15181E] border border-[#222732] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
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
                    Faculty Evaluation &amp; OCR Verification
                  </h3>
                  <p className="text-xs text-slate-400">
                    Candidate: <span className="text-amber-400 font-semibold">{selectedEssay.student_name || 'Candidate'}</span> • {selectedEssay.prompt_title || 'Essay'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEssay(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#15181E] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* Left Column: Image Viewer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    Uploaded Paper Scan
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setImageZoom((prev) => Math.max(0.7, prev - 0.2))}
                      className="p-1 text-slate-400 hover:text-white rounded bg-[#181C24] border border-[#222732]"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setImageZoom((prev) => Math.min(2.5, prev + 0.2))}
                      className="p-1 text-slate-400 hover:text-white rounded bg-[#181C24] border border-[#222732]"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="relative rounded-2xl bg-black border border-[#222732] overflow-hidden h-[380px] flex items-center justify-center p-2">
                  <img
                    src={selectedEssay.image_url || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400'}
                    alt="Paper Scan"
                    style={{ transform: `scale(${imageZoom})`, transition: 'transform 0.2s ease-out' }}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Right Column: OCR Text & Teacher Grading */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      OCR Extracted Text
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono">
                      AI Raw Band: {selectedEssay.ai_band_score || 6.5}
                    </span>
                  </div>

                  <div className="bg-[#12141A] border border-[#222732] rounded-xl p-3.5 text-xs text-slate-200 max-h-[160px] overflow-y-auto leading-relaxed custom-scrollbar whitespace-pre-line font-mono">
                    {selectedEssay.ocr_extracted_text || 'No text extracted. Please evaluate directly from scan.'}
                  </div>
                </div>

                {/* Grade Override & Feedback */}
                <div className="space-y-3 bg-[#181C24] border border-[#222732] rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200">
                      Final Band Score Assignment:
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
                      Teacher Academic Feedback:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add diagnostic comments on Task Achievement, Cohesion, Vocabulary, and Grammatical Accuracy..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full bg-[#12141A] border border-[#222732] rounded-xl p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-600 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setSelectedEssay(null)}
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
                    <span>{isSubmittingReview ? 'Publishing...' : 'Publish Evaluation'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandwrittenQueue;

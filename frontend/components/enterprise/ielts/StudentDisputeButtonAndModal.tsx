import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Flag, Clock, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { submitStudentDispute } from '@/lib/telemetryEgress';
import { TeacherReviewModal } from './TeacherReviewModal';
import {
  listTeacherReviews,
  subscribeTeacherReviews,
  type TeacherReviewNotification,
} from '@/lib/teacherReviewNotifications';

export interface StudentDisputeButtonAndModalProps {
  testTitle: string;
  module: 'reading' | 'listening' | 'writing' | 'speaking';
  originalBand: number;
  studentName?: string;
  studentAvatar?: string;
  rawAnswers?: any;
  sourceType?: string;
  bookNumber?: number;
  testNumber?: number;
  onDisputeSubmitted?: (note: string) => void;
  initialStatus?: 'none' | 'under_review' | 'verified';
  teacherBand?: number;
  scoreViewMode?: 'ai' | 'teacher';
  onScoreViewModeChange?: (mode: 'ai' | 'teacher') => void;
}

export const StudentDisputeButtonAndModal: React.FC<StudentDisputeButtonAndModalProps> = ({
  testTitle,
  module,
  originalBand,
  studentName = 'Candidate Scholar',
  studentAvatar,
  rawAnswers,
  sourceType = 'cambridge',
  bookNumber,
  testNumber,
  onDisputeSubmitted,
  initialStatus = 'none',
  teacherBand,
  scoreViewMode = 'ai',
  onScoreViewModeChange,
}) => {
  const [disputeState, setDisputeState] = useState<'none' | 'under_review' | 'verified'>(initialStatus);
  const [showModal, setShowModal] = useState(false);
  const [disputeNote, setDisputeNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTeacherReviewModal, setShowTeacherReviewModal] = useState(false);
  const [teacherReview, setTeacherReview] = useState<TeacherReviewNotification | null>(null);

  // Sync teacher review notifications & stored disputes on mount
  useEffect(() => {
    const syncState = () => {
      try {
        const storageKey = `dispute_${module}_${testTitle.replace(/\s+/g, '_')}`;
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.status === 'under_review' || parsed?.status === 'verified') {
            setDisputeState(parsed.status);
          }
        }

        const allReviews = listTeacherReviews();
        const matchedReview = allReviews.find(
          (r) =>
            r.testTitle.toLowerCase().includes(testTitle.toLowerCase()) ||
            testTitle.toLowerCase().includes(r.testTitle.toLowerCase()) ||
            r.module === module
        ) || allReviews[0] || null;

        if (matchedReview) {
          setTeacherReview(matchedReview);
        }
      } catch {
        // ignore
      }
    };

    syncState();
    return subscribeTeacherReviews(syncState);
  }, [module, testTitle]);

  const handleSubmit = async () => {
    if (!disputeNote.trim()) {
      toast.error('Please describe your reason for challenging the evaluation.');
      return;
    }

    setIsSubmitting(true);
    const bookMatch = testTitle.match(/Cambridge\s*(\d+)/i);
    const testMatch = testTitle.match(/Test\s*(\d+)/i);
    const resolved_book_number = bookNumber ?? (bookMatch ? parseInt(bookMatch[1], 10) : undefined);
    const resolved_test_number = testNumber ?? (testMatch ? parseInt(testMatch[1], 10) : undefined);

    const storageKey = `dispute_${module}_${testTitle.replace(/\s+/g, '_')}`;
    const disputePayload = {
      test_title: testTitle,
      module,
      source_type: sourceType || 'cambridge',
      book_number: resolved_book_number,
      test_number: resolved_test_number,
      original_band: originalBand,
      student_name: studentName,
      student_avatar: studentAvatar,
      dispute_note: disputeNote.trim(),
      raw_answers: rawAnswers,
      status: 'pending_teacher_review',
      created_at: new Date().toISOString(),
    };

    // 1. Store locally for instant UI sync
    try {
      localStorage.setItem(storageKey, JSON.stringify({ status: 'under_review', ...disputePayload }));
      const allLocal = JSON.parse(localStorage.getItem('all_student_disputes') || '[]');
      allLocal.unshift({ id: `disp-local-${Date.now()}`, ...disputePayload });
      localStorage.setItem('all_student_disputes', JSON.stringify(allLocal));
      window.dispatchEvent(new CustomEvent('student-dispute-submitted', { detail: disputePayload }));
    } catch (e) {
      console.warn('Local dispute store note:', e);
    }

    // 2. Persist to Supabase public.student_disputes via telemetry egress
    await submitStudentDispute(disputePayload);

    setIsSubmitting(false);
    setShowModal(false);
    setDisputeState('under_review');
    onDisputeSubmitted?.(disputeNote.trim());
    toast.success('Dispute submitted! Dispatched to Faculty Evaluation Queue.');
  };

  return (
    <div className="flex items-center gap-3">
      {/* ── Badge & Trigger States ── */}
      {disputeState === 'none' && (
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#15181E] border border-[#222732] hover:border-rose-500 text-slate-200 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          title="Challenge AI score and dispatch to Faculty Evaluation Studio"
        >
          <Flag className="w-4 h-4 text-rose-500" />
          <span>🚩 Challenge / Send to Teacher Review</span>
        </button>
      )}

      {disputeState === 'under_review' && (
        <div className="flex items-center gap-2">
          <span className="bg-amber-950/40 text-amber-400 border border-amber-800/40 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
            <Clock className="w-4 h-4 animate-pulse text-amber-400" />
            <span>⏳ Under Teacher Review</span>
          </span>
          <button
            onClick={() => setDisputeState('verified')}
            className="text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
            title="Simulate faculty review approval"
          >
            (Simulate Verified)
          </button>
        </div>
      )}

      {disputeState === 'verified' && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>✓ Teacher Reviewed &amp; Verified</span>
          </span>

          {onScoreViewModeChange && (
            <div className="flex items-center bg-[#15181E] p-0.5 rounded-xl border border-[#222732]">
              <button
                onClick={() => onScoreViewModeChange('ai')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  scoreViewMode === 'ai'
                    ? 'bg-[#222732] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Original AI Score
              </button>
              <button
                onClick={() => onScoreViewModeChange('teacher')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  scoreViewMode === 'teacher'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🎓 Teacher Verified Final Score
              </button>
            </div>
          )}

          {teacherReview && (
            <button
              type="button"
              onClick={() => setShowTeacherReviewModal(true)}
              className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="View Faculty Band, Audio Note & Critiques"
            >
              🎓 View Faculty Feedback &amp; Score
            </button>
          )}
        </div>
      )}

      {/* ── Student Dispute Justification Modal ── */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-all">
          <div
            className="relative w-full max-w-xl bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-2xl my-auto space-y-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#222732]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Dispute Evaluation &amp; Request Faculty Audit
                  </h3>
                  <p className="text-[11px] text-slate-400">{testTitle} • Band {originalBand.toFixed(1)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#222732] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Context Note */}
            <div className="p-3 bg-rose-950/30 border border-rose-800/30 rounded-xl text-xs text-rose-200 leading-relaxed">
              <span className="font-semibold text-rose-300">Faculty Audit Notice:</span> This exact exam submission will be dispatched to the teacher's B2B Coaching Command Center (/coaching/evaluations) for manual critique, criteria recalibration, and voice note feedback.
            </div>

            {/* Mandatory Explanation Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Please describe why you are challenging this result: <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={disputeNote}
                onChange={(e) => setDisputeNote(e.target.value)}
                placeholder="Please describe why you are challenging this result (e.g., 'I disagree with the AI evaluation on Question 14 / Paragraph 3 because...')"
                className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-600 transition-colors custom-scrollbar"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-[#222732] text-xs font-bold text-slate-400 hover:text-white hover:bg-[#181C24] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!disputeNote.trim() || isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#E11D48] hover:bg-rose-700 text-xs font-bold text-white transition-colors disabled:opacity-50 cursor-pointer shadow-md shadow-rose-900/20"
              >
                {isSubmitting ? 'Dispatching...' : 'Submit to Teacher Queue'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Student-Facing Teacher Feedback Review Modal ── */}
      {showTeacherReviewModal && teacherReview && (
        <TeacherReviewModal
          review={teacherReview}
          onClose={() => setShowTeacherReviewModal(false)}
        />
      )}
    </div>
  );
};

export default StudentDisputeButtonAndModal;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, GraduationCap, Play, Pause, BadgeCheck, MessageSquareText } from 'lucide-react';
import { TeacherReviewNotification } from '@/lib/teacherReviewNotifications';

interface TeacherReviewModalProps {
  review: TeacherReviewNotification;
  onClose: () => void;
}

const WAVE = [25, 45, 75, 40, 90, 60, 85, 30, 95, 70, 45, 80, 50, 65, 90, 35, 70, 85, 40, 95, 60, 50, 80, 45];

export const TeacherReviewModal: React.FC<TeacherReviewModalProps> = ({ review, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeNote, setActiveNote] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      audioRef.current?.pause();
    };
  }, [onClose]);

  const togglePlay = () => {
    if (!review.voiceUrl) return;
    if (!audioRef.current) {
      const a = new Audio(review.voiceUrl);
      a.ontimeupdate = () => a.duration && setProgress(a.currentTime / a.duration);
      a.onended = () => {
        setPlaying(false);
        setProgress(0);
      };
      audioRef.current = a;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  // Split the candidate text around each critiqued phrase so phrases render as highlights.
  const segments = useMemo(() => {
    const text = review.essayText || '';
    if (!text) return [] as { text: string; critiqueId?: string }[];
    const marks: { start: number; end: number; id: string }[] = [];
    review.critiques.forEach((c) => {
      const idx = text.toLowerCase().indexOf(c.text.toLowerCase());
      if (idx >= 0 && !marks.some((m) => idx < m.end && idx + c.text.length > m.start)) {
        marks.push({ start: idx, end: idx + c.text.length, id: c.id });
      }
    });
    marks.sort((a, b) => a.start - b.start);
    const out: { text: string; critiqueId?: string }[] = [];
    let cursor = 0;
    marks.forEach((m) => {
      if (m.start > cursor) out.push({ text: text.slice(cursor, m.start) });
      out.push({ text: text.slice(m.start, m.end), critiqueId: m.id });
      cursor = m.end;
    });
    if (cursor < text.length) out.push({ text: text.slice(cursor) });
    return out;
  }, [review]);

  const delta = review.teacherBand - review.originalBand;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-all"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Faculty Re-Evaluation Audit"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] my-auto overflow-y-auto bg-[#0D0F12] border border-[#222732] rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#15181E] border-b border-[#222732] px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white">Faculty Re-Evaluation Audit</h2>
              <p className="text-xs text-slate-400 truncate">{review.testTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <BadgeCheck className="w-3.5 h-3.5" />
              {review.teacherName} {review.teacherCredential}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white border border-[#222732] hover:bg-[#1C212B] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Original AI Score</p>
              <p className="text-3xl font-bold text-slate-300 mt-1">Band {review.originalBand.toFixed(1)}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">🎓 Faculty Verified Score</p>
              <p className="text-3xl font-bold text-emerald-300 mt-1">Band {review.teacherBand.toFixed(1)}</p>
              {delta !== 0 && (
                <p className="text-[11px] font-mono text-emerald-400 mt-1">
                  {delta > 0 ? '+' : ''}
                  {delta.toFixed(1)} vs AI
                </p>
              )}
            </div>
          </div>

          {/* Audio feedback */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Audio Feedback</h3>
            {review.voiceUrl ? (
              <div className="flex items-center gap-4 bg-[#15181E] border border-[#222732] rounded-2xl p-4">
                <button
                  onClick={togglePlay}
                  className="w-11 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shrink-0 transition-colors"
                  aria-label={playing ? 'Pause voice note' : 'Play voice note'}
                >
                  {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                </button>
                <div className="flex-1 flex items-center gap-1 h-10">
                  {WAVE.map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-full transition-colors ${
                        i / WAVE.length <= progress ? 'bg-rose-500' : 'bg-slate-700/60'
                      } ${playing ? 'animate-pulse' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">15s note</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic bg-[#15181E] border border-[#222732] rounded-2xl p-4">
                No voice note was attached to this review.
              </p>
            )}
          </div>

          {/* Written feedback */}
          {review.feedbackText && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Mentor Summary</h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-[#15181E] border border-[#222732] rounded-2xl p-4">
                {review.feedbackText}
              </p>
            </div>
          )}

          {/* Interactive critiques */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-amber-400" />
              Teacher Critique Notes ({review.critiques.length})
            </h3>

            {segments.length > 0 && review.critiques.length > 0 && (
              <p className="text-sm text-slate-300 leading-relaxed font-mono bg-[#15181E] border border-[#222732] rounded-2xl p-4 whitespace-pre-line">
                {segments.map((s, i) =>
                  s.critiqueId ? (
                    <button
                      key={i}
                      onClick={() => setActiveNote((p) => (p === s.critiqueId ? null : s.critiqueId!))}
                      className={`px-0.5 rounded border-b-2 transition-colors ${
                        activeNote === s.critiqueId
                          ? 'bg-amber-500/30 border-amber-400 text-white'
                          : 'bg-amber-500/10 border-amber-500/50 text-amber-200 hover:bg-amber-500/20'
                      }`}
                    >
                      {s.text}
                    </button>
                  ) : (
                    <span key={i}>{s.text}</span>
                  )
                )}
              </p>
            )}

            {review.critiques.length > 0 ? (
              <div className="space-y-2">
                {review.critiques.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveNote((p) => (p === c.id ? null : c.id))}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      activeNote === c.id
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-[#15181E] border-[#222732] hover:border-amber-500/30'
                    }`}
                  >
                    <p className="text-[11px] font-mono text-amber-300">📌 “{c.text}”</p>
                    {activeNote === c.id && (
                      <p className="text-xs text-slate-200 mt-2 leading-relaxed animate-in fade-in duration-150">{c.critique}</p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic bg-[#15181E] border border-[#222732] rounded-2xl p-4">
                Your mentor didn't attach inline notes to this submission.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TeacherReviewModal;

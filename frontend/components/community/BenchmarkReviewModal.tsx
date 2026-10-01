import React, { useRef, useState, useEffect } from 'react';
import { BenchmarkItem } from '@/types/community';
import { X, Award, Volume2, Play, Pause, CheckCircle, FileText, Sparkles } from 'lucide-react';

interface BenchmarkReviewModalProps {
  benchmark: BenchmarkItem | null;
  onClose: () => void;
}

export const BenchmarkReviewModal: React.FC<BenchmarkReviewModalProps> = ({
  benchmark,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (!benchmark) return null;

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.warn('Audio play error:', err));
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-gray-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center font-black">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Band</span>
              <span className="text-xl leading-none">{benchmark.bandScore.toFixed(1)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                  {benchmark.module} Spotlight
                </span>
                <span className="text-xs text-gray-500">By {benchmark.studentName}</span>
              </div>
              <h2 className="text-base font-bold text-gray-900 mt-1">{benchmark.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Sub-Scores Radar / Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
              Official Assessment Criteria Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-xl text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Task Achievement</span>
                <span className="text-2xl font-black text-indigo-700">
                  {benchmark.aiSubScores.TR ? benchmark.aiSubScores.TR.toFixed(1) : '8.5'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Clear overview, full coverage</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-xl text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Coherence & Cohesion</span>
                <span className="text-2xl font-black text-indigo-700">
                  {benchmark.aiSubScores.CC ? benchmark.aiSubScores.CC.toFixed(1) : '8.0'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Effortless paragraph transitions</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-xl text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Lexical Resource</span>
                <span className="text-2xl font-black text-indigo-700">
                  {benchmark.aiSubScores.LR ? benchmark.aiSubScores.LR.toFixed(1) : '8.0'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">High-tier precise vocabulary</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-xl text-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Grammar Range</span>
                <span className="text-2xl font-black text-indigo-700">
                  {benchmark.aiSubScores.GRA ? benchmark.aiSubScores.GRA.toFixed(1) : '7.5'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Complex clause mastery</span>
              </div>
            </div>
          </div>

          {/* Mentor Voice Note */}
          {benchmark.mentorVoiceNoteUrl && (
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 flex items-center gap-4">
              <audio ref={audioRef} src={benchmark.mentorVoiceNoteUrl} preload="metadata" />
              <button
                onClick={toggleAudio}
                className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-600" /> Dr. Vance's Live Voice Evaluation
                  </span>
                  <span className="text-[11px] text-indigo-600 font-bold">{isPlaying ? 'Playing' : 'Ready'}</span>
                </div>
                <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-200"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submission Text */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Candidate Submission Text
            </h4>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 font-serif leading-relaxed whitespace-pre-line shadow-2xs">
              {benchmark.submissionContent}
            </div>
          </div>

          {/* Examiner Commentary */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Key Takeaway for the Cohort:
            </span>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {benchmark.highlightReason}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkReviewModal;

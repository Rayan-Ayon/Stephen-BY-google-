import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Award, Play, Pause, Volume2, FileText, ExternalLink, Sparkles, ChevronRight } from 'lucide-react';
import { BenchmarkItem } from '@/types/community';
import { obsidianTokens } from './obsidianTokens';

interface BenchmarkSpotlightCardProps {
  benchmark: BenchmarkItem;
  onReviewFull?: (benchmark: BenchmarkItem) => void;
}

export const BenchmarkSpotlightCard: React.FC<BenchmarkSpotlightCardProps> = ({
  benchmark,
  onReviewFull
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [durationTime, setDurationTime] = useState('1:45');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const formatSeconds = (sec: number) => {
      const mins = Math.floor(sec / 60);
      const secs = Math.floor(sec % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(formatSeconds(audio.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration) {
        setDurationTime(formatSeconds(audio.duration));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
      setCurrentTime('0:00');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header Row: Trophy Badge + Title + Big Band Score Stamp */}
      <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`p-1.5 rounded-lg flex items-center justify-center ${obsidianTokens.badgeAmber}`}>
              <Trophy className="w-3.5 h-3.5 fill-amber-400/20" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Benchmark of the Week Spotlight
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 uppercase font-mono font-medium">
              {benchmark.module} Exemplar
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
            {benchmark.title || 'Band 8.0 Model Paper Showcase: Academic Writing Task 2'}
          </h3>
          <p className="text-xs text-slate-400">
            Authored by <span className="font-semibold text-slate-200">{benchmark.studentName || 'Samira Akter'}</span>
            <span className="text-slate-600 mx-1.5">•</span>
            <span>Reviewed by Dr. Stephen Vance</span>
          </p>
        </div>

        {/* Big Band Score Stamp */}
        <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-[#181C24] border border-amber-800/40 text-amber-400 shadow-md">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400/70">Official</span>
          <span className="text-2xl font-black text-amber-400 leading-none">
            {benchmark.bandScore ? benchmark.bandScore.toFixed(1) : '8.0'}
          </span>
          <span className="text-[10px] font-bold text-slate-400">Band</span>
        </div>
      </div>

      {/* Official Criteria Breakdown Grid (TR, CC, LR, GRA) */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
          <span>Official Criteria Sub-scores</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" /> All Sub-Scores &ge; 7.5
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* TR */}
          <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5">
              <span>Task Response</span>
            </div>
            <span className="text-lg font-black text-white">
              {benchmark.aiSubScores.TR ? benchmark.aiSubScores.TR.toFixed(1) : '8.5'}
            </span>
            <span className="block text-[10px] text-blue-400/80 font-mono mt-0.5">TR: 8.5</span>
          </div>

          {/* CC */}
          <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
              <span>Coherence</span>
            </div>
            <span className="text-lg font-black text-white">
              {benchmark.aiSubScores.CC ? benchmark.aiSubScores.CC.toFixed(1) : '8.0'}
            </span>
            <span className="block text-[10px] text-amber-400/80 font-mono mt-0.5">CC: 8.0</span>
          </div>

          {/* LR */}
          <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-0.5">
              <span>Lexical</span>
            </div>
            <span className="text-lg font-black text-white">
              {benchmark.aiSubScores.LR ? benchmark.aiSubScores.LR.toFixed(1) : '8.0'}
            </span>
            <span className="block text-[10px] text-purple-400/80 font-mono mt-0.5">LR: 8.0</span>
          </div>

          {/* GRA */}
          <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">
              <span>Grammar</span>
            </div>
            <span className="text-lg font-black text-white">
              {benchmark.aiSubScores.GRA ? benchmark.aiSubScores.GRA.toFixed(1) : '7.5'}
            </span>
            <span className="block text-[10px] text-emerald-400/80 font-mono mt-0.5">GRA: 7.5</span>
          </div>
        </div>
      </div>

      {/* Model Essay Snippet */}
      <div className="relative bg-[#181C24] border border-[#222732] rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-serif italic max-h-36 overflow-hidden">
        <p className="line-clamp-4">{benchmark.submissionContent}</p>
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#181C24] to-transparent pointer-events-none" />
      </div>

      {/* Mentor Voice Note Audio Player */}
      <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3.5 flex items-center justify-between gap-3">
        <audio
          ref={audioRef}
          src={benchmark.mentorVoiceNoteUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
          preload="metadata"
        />
        <button
          onClick={toggleAudio}
          className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-95 cursor-pointer"
          title={isPlaying ? 'Pause feedback note' : 'Play feedback note'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Mentor Voice Feedback — Dr. Stephen Vance</span>
            </span>
            <span className="font-mono text-slate-400 text-[10px]">
              {currentTime} / {durationTime}
            </span>
          </div>

          {/* Waveform / Progress Line */}
          <div className="w-full h-1.5 bg-[#0D0F12] rounded-full overflow-hidden border border-[#222732]">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-200"
              style={{ width: `${audioProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* View Full Model Paper CTA */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-slate-400">
          {benchmark.highlightReason || 'Nuanced concession paragraphs, precise academic verbs, and balanced task coverage.'}
        </span>
        <button
          onClick={() => onReviewFull?.(benchmark)}
          className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Review Full Paper</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BenchmarkSpotlightCard;

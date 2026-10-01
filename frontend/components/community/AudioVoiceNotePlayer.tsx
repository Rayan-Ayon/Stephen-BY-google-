import React, { useState, useRef, useEffect } from 'react';

interface AudioVoiceNotePlayerProps {
  audioUrl: string;
  senderRole?: 'mentor' | 'faculty' | 'student';
  durationSeconds?: number;
}

export const AudioVoiceNotePlayer: React.FC<AudioVoiceNotePlayerProps> = ({
  audioUrl,
  senderRole = 'student',
  durationSeconds = 28,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.round(audio.duration));
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(Math.round(audio.currentTime));
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.warn('Audio play error:', err));
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Waveform visualization bars
  const bars = [35, 60, 45, 80, 50, 95, 70, 40, 65, 85, 30, 90, 55, 75, 40, 60];

  return (
    <div className="flex items-center gap-3 bg-black/30 border border-slate-700/60 rounded-xl px-3.5 py-2.5 my-1.5 max-w-xs sm:max-w-sm">
      <button
        onClick={togglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
          senderRole === 'mentor'
            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
        }`}
      >
        {isPlaying ? (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Waveform track */}
      <div className="flex-1 flex flex-col justify-center gap-1 min-w-[120px]">
        <div className="flex items-center gap-1 h-6">
          {bars.map((height, idx) => {
            const barProgress = (idx / bars.length) * 100;
            const isFilled = barProgress <= progress;
            return (
              <span
                key={idx}
                className={`w-1 rounded-full transition-colors ${
                  isFilled
                    ? senderRole === 'mentor'
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                    : 'bg-slate-700'
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

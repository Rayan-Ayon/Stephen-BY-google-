import React, { useState, useEffect } from 'react';
import { Video, Clock, ExternalLink, Play, ChevronRight, Sparkles, Headphones } from 'lucide-react';
import { CohortRecording } from '@/types/community';
import { obsidianTokens } from './obsidianTokens';

interface LiveClassBridgeCardProps {
  meetingUrl?: string;
  nextSessionIso?: string;
  recordings?: CohortRecording[];
  onSelectTimestamp?: (recording: CohortRecording, time: string) => void;
}

export const LiveClassBridgeCard: React.FC<LiveClassBridgeCardProps> = ({
  meetingUrl = 'https://meet.google.com/stephen-ielts-alpha',
  nextSessionIso,
  recordings = [],
  onSelectTimestamp
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isLive: boolean }>({
    hours: 4,
    minutes: 15,
    seconds: 0,
    isLive: false
  });
  const [activeRecording, setActiveRecording] = useState<CohortRecording | null>(null);

  useEffect(() => {
    // If nextSessionIso is provided, calculate against it; else fallback to 4h 15m countdown
    const target = nextSessionIso ? new Date(nextSessionIso).getTime() : Date.now() + (4 * 3600 + 15 * 60) * 1000;

    const calculateTime = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0 && diff > -3600 * 1000 * 2) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isLive: true });
      } else if (diff <= -3600 * 1000 * 2) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isLive: false });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isLive: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [nextSessionIso]);

  const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

  return (
    <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 shadow-sm space-y-4.5">
      {/* Header: Video/Headset Badge + Live Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`p-2 rounded-xl flex items-center justify-center ${obsidianTokens.badgeBlue}`}>
            <Video className="w-4 h-4 text-blue-400" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${timeLeft.isLive ? 'bg-rose-400' : 'bg-emerald-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${timeLeft.isLive ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {timeLeft.isLive ? 'Live Masterclass Active' : 'Live Class Bridge'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Dr. Stephen Vance Direct Sync</p>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${obsidianTokens.badgeRed}`}>
          Masterclass
        </span>
      </div>

      {/* Countdown Card */}
      {!timeLeft.isLive ? (
        <div className="space-y-1.5">
          <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>Next session in:</span>
            <span className="font-mono text-amber-400 font-bold">
              {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#181C24] border border-[#222732] rounded-xl py-2 shadow-inner">
              <span className="block text-xl font-black text-white">{pad(timeLeft.hours)}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Hours</span>
            </div>
            <div className="bg-[#181C24] border border-[#222732] rounded-xl py-2 shadow-inner">
              <span className="block text-xl font-black text-white">{pad(timeLeft.minutes)}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mins</span>
            </div>
            <div className="bg-[#181C24] border border-[#222732] rounded-xl py-2 shadow-inner">
              <span className="block text-xl font-black text-white">{pad(timeLeft.seconds)}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Secs</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3 text-center">
          <p className="text-rose-400 font-bold text-sm">Meeting In Progress Now</p>
          <p className="text-xs text-rose-300/80">Join the live interactive room immediately!</p>
        </div>
      )}

      {/* 1-Click Gateway: Solid Crimson Red Button */}
      <a
        href={meetingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm"
      >
        <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>Join Live Session</span>
        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
      </a>

      {/* Past Class Recording Vault Timecodes */}
      <div className="pt-2 border-t border-[#222732] space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Class Recording Vault Timecodes</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {recordings.length} Vaults
          </span>
        </div>

        <div className="space-y-2">
          {recordings.slice(0, 2).map((rec) => (
            <div key={rec.id} className="bg-[#181C24] border border-[#222732] rounded-xl p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-slate-200 line-clamp-1 leading-snug">
                  {rec.title}
                </p>
                <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                  {rec.durationMinutes}m
                </span>
              </div>

              {/* Timecode Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rec.timestamps?.slice(0, 3).map((ts, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectTimestamp?.(rec, ts.time)}
                    className="px-2 py-0.5 rounded-md bg-[#12141A] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-[#222732] text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    title={ts.label}
                  >
                    <Play className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                    <span>{ts.time}</span>
                    <span className="truncate max-w-[90px]">{ts.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveClassBridgeCard;

import React, { useState, useEffect } from 'react';
import { Video, Clock, ExternalLink, Play, ChevronRight, Sparkles } from 'lucide-react';
import { CohortRecording } from '@/types/community';

interface LiveCallBridgeProps {
  meetingUrl?: string;
  nextSessionIso?: string;
  recordings?: CohortRecording[];
  onSelectTimestamp?: (recording: CohortRecording, time: string) => void;
}

export const LiveCallBridge: React.FC<LiveCallBridgeProps> = ({
  meetingUrl = 'https://meet.google.com/stephen-ielts-alpha',
  nextSessionIso,
  recordings = [],
  onSelectTimestamp
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isLive: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false
  });
  const [activeRecording, setActiveRecording] = useState<CohortRecording | null>(null);

  useEffect(() => {
    if (!nextSessionIso) return;

    const calculateTime = () => {
      const target = new Date(nextSessionIso).getTime();
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
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Live Session Status & Countdown */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${timeLeft.isLive ? 'bg-red-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${timeLeft.isLive ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {timeLeft.isLive ? 'Live Masterclass Active' : 'Next Live Session'}
            </span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Dr. Vance Live
          </span>
        </div>

        {/* Big Countdown Timer */}
        {!timeLeft.isLive ? (
          <div className="grid grid-cols-3 gap-2 my-3 text-center">
            <div className="bg-gray-50 border border-gray-200/60 rounded-xl py-2.5">
              <span className="block text-2xl font-black text-gray-900">{pad(timeLeft.hours)}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hours</span>
            </div>
            <div className="bg-gray-50 border border-gray-200/60 rounded-xl py-2.5">
              <span className="block text-2xl font-black text-gray-900">{pad(timeLeft.minutes)}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mins</span>
            </div>
            <div className="bg-gray-50 border border-gray-200/60 rounded-xl py-2.5">
              <span className="block text-2xl font-black text-gray-900">{pad(timeLeft.seconds)}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secs</span>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 my-3 text-center">
            <p className="text-red-700 font-bold text-sm">Meeting In Progress</p>
            <p className="text-xs text-red-500">Join the live interactive room now!</p>
          </div>
        )}

        {/* 1-Click Join Button */}
        <a
          href={meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 animate-pulse group cursor-pointer text-sm"
        >
          <Video className="w-4 h-4 text-white transition-transform group-hover:scale-110" />
          <span>Join Live Zoom / Meet Room</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
        </a>
      </div>

      {/* Recording Vault Header */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <h4 className="text-sm font-bold text-gray-900">Class Recording Vault</h4>
          </div>
          <span className="text-[11px] font-semibold text-gray-500">{recordings.length} Recorded</span>
        </div>

        {/* Recording List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="p-3 bg-gray-50 border border-gray-200/70 rounded-xl hover:border-gray-300 transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">{rec.title}</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {rec.durationMinutes} mins • {new Date(rec.conductedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <a
                  href={rec.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-1.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors"
                  title="Watch recording"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </a>
              </div>

              {/* Timestamp Pills */}
              {rec.timestamps && rec.timestamps.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-semibold text-gray-400">Jumps:</span>
                  {rec.timestamps.map((ts, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectTimestamp?.(rec, ts.time)}
                      className="px-2 py-0.5 bg-white border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 rounded-md text-[10px] font-medium text-gray-600 transition-colors flex items-center gap-1 shadow-2xs"
                      title={ts.label}
                    >
                      <span className="font-bold text-indigo-600">{ts.time}</span>
                      <span className="truncate max-w-[80px]">{ts.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveCallBridge;

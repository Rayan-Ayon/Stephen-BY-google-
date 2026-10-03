import React, { useEffect, useRef, useState } from 'react';
import { Zap } from 'lucide-react';
import {
  RELEASES,
  LATEST_RELEASE_VERSION,
  UPDATES_SEEN_KEY,
  UPDATES_FOCUS_KEY,
} from './updates/releases';

interface UpdatesDropdownProps {
  onNavigate?: (view: string) => void;
}

export const UpdatesDropdown: React.FC<UpdatesDropdownProps> = ({ onNavigate }) => {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(() => {
    try {
      return localStorage.getItem(UPDATES_SEEN_KEY) !== LATEST_RELEASE_VERSION;
    } catch {
      return true;
    }
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const markSeen = () => {
    try {
      localStorage.setItem(UPDATES_SEEN_KEY, LATEST_RELEASE_VERSION);
    } catch {}
    setHasUnread(false);
  };

  const goToUpdates = (releaseId?: string) => {
    markSeen();
    setOpen(false);
    try {
      if (releaseId) sessionStorage.setItem(UPDATES_FOCUS_KEY, releaseId);
      else sessionStorage.removeItem(UPDATES_FOCUS_KEY);
      window.history.pushState({}, '', '/updates');
    } catch {}
    onNavigate?.('updates');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        id="header-updates-button"
        onClick={() => {
          setOpen((p) => !p);
          markSeen();
        }}
        aria-haspopup="true"
        aria-expanded={open}
        className="bg-[#15181E] border border-[#222732] text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1C212B] transition-all relative"
      >
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>Updates</span>
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" />
            <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 bg-[#15181E] border border-[#222732] w-80 rounded-2xl p-4 shadow-2xl space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222732]">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Platform Updates &amp; Releases
            </span>
          </div>

          <div className="space-y-1.5">
            {RELEASES.slice(0, 3).map((r) => (
              <button
                key={r.id}
                onClick={() => goToUpdates(r.id)}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#1C212B] transition-colors group"
              >
                <p className="text-[10px] font-mono text-slate-500 mb-0.5">{r.date}</p>
                <p className="text-xs font-semibold text-slate-200 group-hover:text-white leading-snug">
                  {r.shortTitle}
                </p>
              </button>
            ))}
          </div>

          <button
            onClick={() => goToUpdates()}
            className="w-full pt-3 border-t border-[#222732] text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors text-center"
          >
            View All Release Notes &amp; Media →
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdatesDropdown;

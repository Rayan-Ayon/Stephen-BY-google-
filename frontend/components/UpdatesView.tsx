import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Search, X, Mic, GraduationCap, BookOpen, Play } from 'lucide-react';
import { RELEASES, ReleaseNote, ReleaseVisual, UPDATES_FOCUS_KEY } from './updates/releases';

interface UpdatesViewProps {
  onNavigate?: (view: string) => void;
}

/** Lightweight in-code product mockups so every release has a showcase image without external assets. */
const ScreenshotMock: React.FC<{ kind: ReleaseVisual; large?: boolean }> = ({ kind, large }) => {
  const pad = large ? 'p-8' : 'p-5';
  return (
    <div className={`w-full aspect-[16/9] bg-[#0D0F12] ${pad} flex flex-col gap-3 select-none`}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-3 h-2 w-40 rounded bg-[#222732]" />
      </div>

      {kind === 'speaking' && (
        <div className="flex-1 grid grid-cols-5 gap-3 min-h-0">
          <div className="col-span-2 bg-[#15181E] border border-[#222732] rounded-xl flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-rose-600/20 border border-rose-500/40 flex items-center justify-center">
              <Mic className="w-7 h-7 text-rose-400" />
            </div>
            <div className="flex items-end gap-1 h-8">
              {[40, 70, 100, 60, 85, 45, 75, 55, 90, 35].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} className="w-1 rounded-full bg-rose-500" />
              ))}
            </div>
            <span className="text-[10px] font-mono text-emerald-400">LIVE • Mohona is listening</span>
          </div>
          <div className="col-span-3 bg-[#15181E] border border-[#222732] rounded-xl p-3 space-y-2">
            <div className="max-w-[80%] rounded-xl rounded-tl-none bg-[#1C212B] px-3 py-2 text-[10px] text-slate-300">
              Tell me about your hometown.
            </div>
            <div className="max-w-[80%] ml-auto rounded-xl rounded-tr-none bg-rose-600/20 border border-rose-500/30 px-3 py-2 text-[10px] text-rose-100">
              I come from a busy riverside city…
            </div>
            <div className="max-w-[60%] rounded-xl rounded-tl-none bg-[#1C212B] px-3 py-2 text-[10px] text-slate-300">
              That sounds lovely — what do you enjoy most?
            </div>
          </div>
        </div>
      )}

      {kind === 'dispute' && (
        <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
          <div className="bg-[#15181E] border border-[#222732] rounded-xl p-3 space-y-2">
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/40 px-2.5 py-2 text-[10px] text-amber-200">
              Student Note: I don't agree with the TR score in Paragraph 2…
            </div>
            {[90, 100, 75, 95, 60].map((w, i) => (
              <div key={i} style={{ width: `${w}%` }} className="h-1.5 rounded bg-[#222732]" />
            ))}
          </div>
          <div className="bg-[#15181E] border border-[#222732] rounded-xl p-3 space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              {['TR 7.0', 'CC 7.0', 'LR 7.5', 'GRA 7.0'].map((s) => (
                <span key={s} className="text-[10px] font-mono text-slate-300 bg-[#0D0F12] border border-[#222732] rounded px-2 py-1 text-center">
                  {s}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-[#0D0F12] border border-[#222732] rounded-lg px-2 py-1.5">
              <Play className="w-3 h-3 text-rose-400" />
              <div className="flex-1 flex items-center gap-0.5 h-3">
                {[30, 80, 50, 100, 60, 90, 40, 70].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} className="w-0.5 bg-rose-500/80 rounded-full" />
                ))}
              </div>
              <span className="text-[9px] font-mono text-slate-500">0:15</span>
            </div>
            <div className="rounded-lg bg-rose-600 text-white text-[10px] font-bold text-center py-1.5">
              Approve &amp; Dispatch Final Score
            </div>
          </div>
        </div>
      )}

      {kind === 'reading' && (
        <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
          <div className="bg-[#15181E] border border-[#222732] rounded-xl p-3 space-y-1.5">
            {[100, 90, 95, 70].map((w, i) => (
              <div key={i} style={{ width: `${w}%` }} className="h-1.5 rounded bg-[#222732]" />
            ))}
            <div className="h-2 w-[85%] rounded bg-emerald-500/40 border border-emerald-500/50" />
            {[95, 60].map((w, i) => (
              <div key={i} style={{ width: `${w}%` }} className="h-1.5 rounded bg-[#222732]" />
            ))}
          </div>
          <div className="bg-[#15181E] border border-[#222732] rounded-xl p-3 space-y-2">
            <span className="text-[10px] font-bold text-emerald-400">Q38 • TRUE</span>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              The passage states markers persist across generations, which confirms the statement.
            </p>
            <span className="inline-block text-[9px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded px-1.5 py-0.5">
              Trap: Not Given confusion
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const VISUAL_ICON: Record<ReleaseVisual, React.ReactNode> = {
  speaking: <Mic className="w-4 h-4" />,
  dispute: <GraduationCap className="w-4 h-4" />,
  reading: <BookOpen className="w-4 h-4" />,
};

export const UpdatesView: React.FC<UpdatesViewProps> = ({ onNavigate }) => {
  const [lightbox, setLightbox] = useState<ReleaseNote | null>(null);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    let target: string | null = null;
    try {
      target = sessionStorage.getItem(UPDATES_FOCUS_KEY);
      sessionStorage.removeItem(UPDATES_FOCUS_KEY);
    } catch {}
    if (target && refs.current[target]) {
      refs.current[target]!.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const goBack = () => {
    try {
      window.history.pushState({}, '', '/overview');
    } catch {}
    onNavigate?.('overview');
  };

  return (
    <div className="w-full min-h-screen bg-[#0D0F12] text-slate-100 font-sans p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <button
            onClick={goBack}
            className="bg-[#15181E] border border-[#222732] text-slate-200 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#1C212B] transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Stephen IELTS Product Changelog &amp; Integration Log
          </h1>
          <p className="text-sm text-slate-400">
            Every platform release, what changed, and why it matters for students and coaching centers.
          </p>
        </div>

        <div className="relative space-y-8 pl-6 border-l border-[#222732]">
          {RELEASES.map((r) => (
            <article
              key={r.id}
              ref={(el) => {
                refs.current[r.id] = el;
              }}
              className="relative bg-[#15181E] border border-[#222732] rounded-2xl p-6 space-y-4 scroll-mt-6"
            >
              <span className="absolute -left-[31px] top-7 w-3 h-3 rounded-full bg-rose-600 ring-4 ring-[#0D0F12]" />

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 bg-[#0D0F12] border border-[#222732] px-2.5 py-1 rounded-lg">
                  {r.longDate} — VERSION {r.version}
                </span>
                <span className="text-rose-400">{VISUAL_ICON[r.visual]}</span>
              </div>

              <h2 className="text-lg font-bold text-white">{r.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{r.description}</p>

              <div className="flex flex-wrap gap-2">
                {r.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full"
                  >
                    {h}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setLightbox(r)}
                aria-label={`Expand screenshot for ${r.title}`}
                className="group relative block w-full rounded-xl overflow-hidden border border-[#222732] hover:border-rose-500/50 transition-colors cursor-zoom-in"
              >
                <div className="transition-transform duration-500 group-hover:scale-105">
                  <ScreenshotMock kind={r.visual} />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="flex items-center gap-2 bg-[#15181E]/90 border border-[#222732] text-white text-xs font-semibold px-4 py-2 rounded-xl">
                    <Search className="w-4 h-4" />
                    Click to Expand Screenshot
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-150"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300 hover:text-white"
            aria-label="Close screenshot"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="w-full max-w-5xl rounded-2xl overflow-hidden border border-rose-500/40 shadow-2xl shadow-rose-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            <ScreenshotMock kind={lightbox.visual} large />
            <div className="bg-[#15181E] border-t border-[#222732] px-5 py-3 text-xs text-slate-400">
              <span className="font-bold text-slate-200">{lightbox.title}</span> • v{lightbox.version}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatesView;

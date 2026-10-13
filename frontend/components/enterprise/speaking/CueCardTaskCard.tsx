import React from 'react';

export interface CueCardTaskCardProps {
    topic: string;
    prompts: string[];
    notes?: string;
    onNotesChange?: (notes: string) => void;
    isLocked?: boolean;
    prepTimeRemaining?: number;
    onStartSpeaking?: () => void;
    disabled?: boolean;
    className?: string;
}

export const CueCardTaskCard: React.FC<CueCardTaskCardProps> = ({
    topic,
    prompts,
    notes = '',
    onNotesChange,
    isLocked = false,
    prepTimeRemaining,
    onStartSpeaking,
    disabled = false,
    className = '',
}) => {
    return (
        <div
            className={`relative w-full max-w-lg rounded-2xl bg-[#15181E] border border-[#222732] p-5 sm:p-6 shadow-2xl overflow-hidden transition-all ${className}`}
        >
            {/* ── LOCKED / BLURRED OVERLAY STATE ── */}
            {isLocked && (
                <div className="absolute inset-0 z-20 backdrop-blur-md bg-[#0D0F12]/80 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                    <div className="w-14 h-14 rounded-2xl bg-[#1F2430] border border-[#2B3242] flex items-center justify-center mb-3 shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#E11D48"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span>Examiner Orientation in Progress</span>
                    </div>

                    <p className="text-sm font-semibold text-zinc-100 max-w-xs mb-1">
                        Listen carefully to the Part 2 instructions.
                    </p>
                    <p className="text-xs text-zinc-400 max-w-xs">
                        Your Cue Card topic and 60-second preparation countdown will unlock automatically.
                    </p>
                </div>
            )}

            {/* ── CARD HEADER: BADGE ROW ── */}
            <div className={`flex items-center justify-between border-b border-[#222732] pb-3 mb-4 ${isLocked ? 'filter blur-[3px] select-none' : ''}`}>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
                        Candidate Task Card
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                        Part 2
                    </span>
                </div>

                {prepTimeRemaining !== undefined && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Prep: {prepTimeRemaining}s</span>
                    </div>
                )}
            </div>

            {/* ── CARD BODY: TOPIC & PROMPTS ── */}
            <div className={`flex flex-col gap-4 ${isLocked ? 'filter blur-[3px] select-none' : ''}`}>
                {/* Topic Headline */}
                <div>
                    <p className="text-xs font-medium text-rose-400 uppercase tracking-wider mb-1">
                        You should talk about:
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        Describe {topic || 'a significant experience or topic'}
                    </h3>
                </div>

                {/* Structured Prompts (4 Bullets) */}
                <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-4">
                    <p className="text-xs font-semibold text-zinc-300 mb-2.5">You should say:</p>
                    <ul className="space-y-2 text-xs text-zinc-200">
                        {prompts && prompts.length > 0 ? (
                            prompts.map((prompt, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] mt-1.5 shrink-0" />
                                    <span className="leading-relaxed">{prompt}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-zinc-500 italic">No specific prompts specified.</li>
                        )}
                    </ul>
                </div>

                {/* Candidate Scratchpad */}
                <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 flex items-center justify-between">
                        <span>Preparation Notes (Private Scratchpad)</span>
                        <span className="text-[10px] text-zinc-500">Not graded</span>
                    </label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => onNotesChange?.(e.target.value)}
                        disabled={disabled || isLocked}
                        placeholder="Jot down keywords, vocabulary, or structure (1 minute prep)..."
                        className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/30 resize-none transition-colors"
                    />
                </div>

                {/* Optional Call to Action */}
                {onStartSpeaking && !isLocked && (
                    <button
                        onClick={onStartSpeaking}
                        disabled={disabled}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                        <span>
                            {prepTimeRemaining !== undefined
                                ? `Start Speaking Now (Prep ${prepTimeRemaining}s)`
                                : 'Start Speaking Now'}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default CueCardTaskCard;

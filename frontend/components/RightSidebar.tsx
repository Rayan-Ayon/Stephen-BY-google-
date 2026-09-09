
import React from 'react';

interface RightSidebarProps {
    onNavigate: (view: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigate }) => {
    const calendarGrid = [
        [27, 28, 29, 30, 31, 1, 2],
        [3, 4, 5, 6, 7, 8, 9],
    ];
    const goldDays = [6, 7];
    const currentDay = 9;

    return (
        <div className="p-5 space-y-5 w-full">

            {/* ═══════════════════════════════════════════
                WIDGET A: Your Progress
            ═══════════════════════════════════════════ */}
            <div className="rounded-2xl bg-surface border border-border p-5">
                <div className="mb-4">
                    <h3 className="text-[15px] font-bold text-white">Your progress</h3>
                    <p className="text-[11px] text-muted">Small steps. Measurable progress.</p>
                </div>

                {/* Donut Chart */}
                <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-20 h-20 shrink-0">
                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="34" fill="none" stroke="#1E2026" strokeWidth="6" />
                            <circle cx="40" cy="40" r="34" fill="none" stroke="#FF4D4D" strokeWidth="6"
                                strokeDasharray="213.6" strokeDashoffset="213.6" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[18px] font-bold text-white leading-none">—</span>
                            <span className="text-[9px] text-muted mt-0.5">out of 9.0</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[13px] font-medium text-secondary">Overall Band</p>
                        <p className="text-[11px] text-muted">Take a test to see your band score</p>
                    </div>
                </div>

                {/* Skill Breakdown */}
                <div className="space-y-0">
                    {[
                        { icon: '📖', label: 'Reading', value: '—' },
                        { icon: '🎧', label: 'Listening', value: '—' },
                        { icon: '✍️', label: 'Writing', value: '—' },
                        { icon: '🎙️', label: 'Speaking', value: '—' },
                    ].map((skill, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[14px]">{skill.icon}</span>
                                <span className="text-[13px] text-secondary">{skill.label}</span>
                            </div>
                            <span className="text-[13px] text-white font-medium">{skill.value}</span>
                        </div>
                    ))}
                </div>

                {/* Footer Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                    <div>
                        <p className="text-[20px] font-bold text-white leading-none">0</p>
                        <p className="text-[11px] text-muted mt-1">Questions answered</p>
                    </div>
                    <div>
                        <p className="text-[20px] font-bold text-white leading-none">—</p>
                        <p className="text-[11px] text-muted mt-1">Accuracy rate</p>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('my_reports')}
                    className="text-brand text-[13px] font-semibold hover:underline mt-4 block"
                >
                    Explore your reports →
                </button>
            </div>

            {/* ═══════════════════════════════════════════
                WIDGET B: Consistency Calendar
            ═══════════════════════════════════════════ */}
            <div className="rounded-2xl bg-surface border border-border p-5">
                <div className="mb-4">
                    <h3 className="text-[15px] font-bold text-white">Your consistency</h3>
                    <p className="text-[11px] text-muted">Your last 14 days of practice.</p>
                </div>

                {/* 7x2 Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {calendarGrid.flat().map((day, i) => {
                        const isGold = goldDays.includes(day);
                        const isCurrent = day === currentDay;
                        return (
                            <div
                                key={i}
                                className={`aspect-square rounded-lg flex items-center justify-center text-[12px] font-medium ${
                                    isCurrent
                                        ? 'bg-surfaceAlt border-2 border-brand text-white'
                                        : isGold
                                            ? 'bg-surfaceAlt border border-[#F59E0B]/40 text-white'
                                            : 'bg-[#1A1C22] text-secondary border border-transparent'
                                }`}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-[10px] text-muted">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>
                        <span>Partial</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#FF4D4D]"></div>
                        <span>Missed</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#3A3D47]"></div>
                        <span>No activity</span>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                WIDGET C: Leaderboard
            ═══════════════════════════════════════════ */}
            <div className="rounded-2xl bg-surface border border-border p-5">
                <div className="mb-4">
                    <h3 className="text-[15px] font-bold text-white">Leaderboard</h3>
                    <p className="text-[11px] text-muted">Your ranking among learners.</p>
                </div>

                <div className="space-y-3">
                    {/* Global Rank */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#262018] flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[13px] font-medium text-white">Global</p>
                                <p className="text-[11px] text-muted">Top 19% of learners</p>
                            </div>
                        </div>
                        <p className="text-[22px] font-bold text-white">#607</p>
                    </div>

                    {/* Regional Rank */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#262018] flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-[13px] font-medium text-white">Unknown</p>
                                <p className="text-[11px] text-muted">Top 100% of learners</p>
                            </div>
                        </div>
                        <p className="text-[22px] font-bold text-white">#1</p>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('leaderboard')}
                    className="text-brand text-[13px] font-semibold hover:underline mt-4 block"
                >
                    View leaderboard →
                </button>
            </div>

        </div>
    );
};

export default RightSidebar;

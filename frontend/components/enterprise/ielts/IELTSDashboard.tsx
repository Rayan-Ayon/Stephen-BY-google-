import React from 'react';
import {
    readAttempts,
    clearAttempts,
    skillLabels,
    skillDotColors,
    type IeltsAttempt,
    type IeltsSkill,
} from './ieltsShared';

const SKILLS: IeltsSkill[] = ['listening', 'reading', 'writing', 'speaking'];

const IELTSDashboard: React.FC = () => {
    const [attempts, setAttempts] = React.useState<IeltsAttempt[]>(readAttempts);

    const skillBests = SKILLS.map((skill) => {
        const skillAttempts = attempts.filter((a) => a.skill === skill);
        const best = skillAttempts.length > 0 ? Math.max(...skillAttempts.map((a) => a.band)) : 0;
        const recent = skillAttempts[0]?.band ?? 0;
        return { skill, best, recent, count: skillAttempts.length };
    });

    const overall = attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.band, 0) / attempts.length
        : 0;

    const chart = (() => {
        const ordered = [...attempts].reverse();
        if (ordered.length === 0) return null;
        const width = 560;
        const height = 180;
        const padX = 36;
        const padY = 20;
        const maxBand = 9;
        const minBand = 4;
        const innerW = width - padX * 2;
        const innerH = height - padY * 2;
        const stepX = innerW / Math.max(ordered.length - 1, 1);
        const yFor = (band: number) => padY + innerH - ((band - minBand) / (maxBand - minBand)) * innerH;
        const points = ordered
            .map((a, i) => `${(padX + i * stepX).toFixed(1)},${yFor(a.band).toFixed(1)}`)
            .join(' ');
        const area = `M ${padX},${padY + innerH} L ${points.replace(/ /g, ' L ')} L ${padX + innerW},${padY + innerH} Z`;
        const gridLines = [5, 6, 7, 8, 9];
        return { width, height, padX, padY, innerH, ordered, stepX, yFor, points, area, gridLines, maxBand, minBand };
    })();

    return (
        <div className="space-y-6">
            <header className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-white">IELTS Dashboard &amp; Tracker</h2>
                    <p className="text-sm text-neutral-400 mt-1">Band trends, skill breakdown, and attempt history for the Farmgate executive batch.</p>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold">Overall Avg Band</p>
                    <p className="text-2xl font-semibold tracking-tight text-amber-400">{overall.toFixed(1)}</p>
                </div>
            </header>

            <section className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Band Score Trend</p>
                    <div className="flex items-center gap-3">
                        {SKILLS.map((s) => (
                            <span key={s} className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                                <span className={`w-2 h-2 rounded-full ${skillDotColors[s]}`} /> {skillLabels[s]}
                            </span>
                        ))}
                    </div>
                </div>
                {chart ? (
                    <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="w-full h-auto">
                        {chart.gridLines.map((b) => (
                            <g key={b}>
                                <line x1={chart.padX} y1={chart.yFor(b)} x2={chart.width - chart.padX} y2={chart.yFor(b)} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                                <text x={chart.padX - 8} y={chart.yFor(b) + 3} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.35)" className="font-mono">{b.toFixed(1)}</text>
                            </g>
                        ))}
                        <path d={chart.area} fill="rgba(255,191,0,0.06)" />
                        <polyline points={chart.points} fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
                        {chart.ordered.map((a, i) => (
                            <g key={a.id}>
                                <circle cx={chart.padX + i * chart.stepX} cy={chart.yFor(a.band)} r="4" fill="#0a0a0a" stroke={skillDotColors[a.skill] === 'bg-sky-400' ? '#38bdf8' : skillDotColors[a.skill] === 'bg-emerald-400' ? '#34d399' : skillDotColors[a.skill] === 'bg-amber-400' ? '#fbbf24' : '#a78bfa'} strokeWidth="2" />
                                <title>{`${skillLabels[a.skill]} · ${a.band.toFixed(1)} · ${a.date}`}</title>
                            </g>
                        ))}
                    </svg>
                ) : (
                    <p className="text-sm text-neutral-600 py-10 text-center">No attempts recorded yet.</p>
                )}
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {skillBests.map(({ skill, best, recent, count }) => (
                    <div key={skill} className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{skillLabels[skill]}</p>
                            <span className="text-[10px] font-mono text-neutral-600">{count} attempt{count === 1 ? '' : 's'}</span>
                        </div>
                        <p className={`text-3xl font-semibold tracking-tight mb-3 ${skillDotColors[skill] === 'bg-sky-400' ? 'text-sky-400' : skillDotColors[skill] === 'bg-emerald-400' ? 'text-emerald-400' : skillDotColors[skill] === 'bg-amber-400' ? 'text-amber-400' : 'text-violet-400'}`}>
                            {best.toFixed(1)}
                        </p>
                        <div className="h-1.5 rounded bg-neutral-800 overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${(best / 9) * 100}%` }} />
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-2">Recent: {recent.toFixed(1)}</p>
                    </div>
                ))}
            </section>

            <section className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold tracking-tight text-white">Attempt History</h3>
                    <button
                        onClick={() => { clearAttempts(); setAttempts([]); }}
                        className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                        Clear history
                    </button>
                </div>
                {attempts.length === 0 ? (
                    <p className="text-sm text-neutral-600 py-8 text-center">No attempts recorded yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-wider text-neutral-500">
                                    <th className="pb-2 pr-4 font-semibold">Skill</th>
                                    <th className="pb-2 pr-4 font-semibold">Date</th>
                                    <th className="pb-2 pr-4 font-semibold">Raw Score</th>
                                    <th className="pb-2 font-semibold">Band</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/70">
                                {attempts.map((a) => (
                                    <tr key={a.id}>
                                        <td className="py-2.5 pr-4">
                                            <span className="flex items-center gap-2 text-sm text-neutral-300">
                                                <span className={`w-2 h-2 rounded-full ${skillDotColors[a.skill]}`} />
                                                {skillLabels[a.skill]}{a.taskType ? ` · ${a.taskType === 'task1' ? 'T1' : 'T2'}` : ''}
                                            </span>
                                        </td>
                                        <td className="py-2.5 pr-4 text-xs font-mono text-neutral-500">{a.date}</td>
                                        <td className="py-2.5 pr-4 text-xs font-mono text-neutral-500">{a.score != null ? `${a.score}/40` : '—'}</td>
                                        <td className="py-2.5 text-sm font-mono text-amber-400">{a.band.toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default IELTSDashboard;
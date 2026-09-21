import React from 'react';
import {
    readAttempts,
    clearAttempts,
    skillLabels,
    skillDotColors,
    BUNDLES,
    DIAGNOSTIC_SUBSKILLS,
    MISTAKE_TOKENS,
    attemptStatus,
    ATTEMPTS_UPDATED_EVENT,
    type IeltsAttempt,
    type IeltsSkill,
    type IeltsBundleId,
} from './ieltsShared';
import IELTSAnalysisView from './IELTSAnalysisView';

const SKILLS: IeltsSkill[] = ['listening', 'reading', 'writing', 'speaking'];
const TARGET_BAND = 7.5;

const SKILL_HEX: Record<IeltsSkill, string> = {
    listening: '#38bdf8',
    reading: '#34d399',
    writing: '#fbbf24',
    speaking: '#a78bfa',
};

const BUNDLE_HEX: Record<IeltsBundleId, string> = {
    sprint: '#8B5CF6',
    express: '#F43F5E',
    mock: '#10B981',
};

const TOKEN_TYPE_COLOR: Record<string, string> = {
    grammar: 'text-red-300 bg-red-400/10 border-red-400/20',
    vocab: 'text-yellow-200 bg-yellow-400/10 border-yellow-400/20',
    logic: 'text-sky-300 bg-sky-400/10 border-sky-400/20',
};

const formatMins = (m?: number) => (m != null ? `${m}m` : '—');
interface IELTSDashboardProps {
    onNavigate?: (view: string) => void;
}

const IELTSDashboard: React.FC<IELTSDashboardProps> = ({ onNavigate }) => {
    const [attempts, setAttempts] = React.useState<IeltsAttempt[]>(readAttempts);
    const [viewMode, setViewMode] = React.useState<'dashboard' | 'command_deck'>('dashboard');

    React.useEffect(() => {
        const refresh = () => setAttempts(readAttempts());
        window.addEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
        return () => window.removeEventListener(ATTEMPTS_UPDATED_EVENT, refresh);
    }, []);

    const [expandedSkill, setExpandedSkill] = React.useState<IeltsSkill | null>(null);
    const [moduleFilter, setModuleFilter] = React.useState<'all' | IeltsSkill>('all');
    const [statusFilter, setStatusFilter] = React.useState<'all' | 'approved' | 'developing' | 'at-risk'>('all');
    const [analysis, setAnalysis] = React.useState<{ attemptId?: number; bundleId?: IeltsBundleId } | null>(null);

    const newestFirst = [...attempts].sort((a, b) => b.id - a.id);

    const overall = attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.band, 0) / attempts.length
        : 0;
    const gap = overall - TARGET_BAND;
    const readiness = attempts.length > 0
        ? Math.round(Math.min(100, (overall / 9) * 60 + Math.min(attempts.length, 10) * 4))
        : 0;

    const skillBests = SKILLS.map((skill) => {
        const skillAttempts = attempts.filter((a) => a.skill === skill);
        const best = skillAttempts.length > 0 ? Math.max(...skillAttempts.map((a) => a.band)) : 0;
        const recent = skillAttempts[0] ?? null;
        return { skill, best, recent, count: skillAttempts.length };
    });

    const bundleStats = BUNDLES.map((b) => {
        const bundleAttempts = attempts.filter((a) => a.bundle === b.label);
        const avg = bundleAttempts.length > 0
            ? bundleAttempts.reduce((sum, a) => sum + a.band, 0) / bundleAttempts.length
            : 0;
        return { id: b.id, label: b.label, avg, count: bundleAttempts.length };
    });

    const filtered = newestFirst.filter((a) => {
        const moduleOk = moduleFilter === 'all' || a.skill === moduleFilter;
        const status = attemptStatus(a.band).label.toLowerCase().replace(' ', '-');
        const statusOk = statusFilter === 'all' || status === statusFilter;
        return moduleOk && statusOk;
    });

    const chart = (() => {
        const ordered = [...newestFirst].reverse();
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
        return { width, height, padX, padY, innerH, ordered, stepX, yFor, points, area, gridLines };
    })();

    return (
        <div className="min-h-full bg-[#121212] text-white p-6 md:p-8 space-y-6">
            {/* ── 1. Top Header & KPI Summary Cards ── */}
            <section className="space-y-4">
                {/* Header & Breadcrumb Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2A2A2A]">
                    {/* Breadcrumb Navigation (Top Left) */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-medium">
                        <button
                            type="button"
                            onClick={() => onNavigate?.('dashboard')}
                            className="text-[#888888] hover:text-[#AAAAAA] transition-colors cursor-pointer"
                        >
                            Overview
                        </button>
                        <span className="text-[#888888]/60 select-none">&gt;</span>
                        <span className="text-[#FFFFFF] font-semibold tracking-tight">My Reports</span>
                    </nav>

                    {/* Header Controls (Top Right) */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAnalysis({ attemptId: newestFirst[0]?.id })}
                            disabled={newestFirst.length === 0}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-semibold hover:bg-amber-300 disabled:opacity-40 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                        >
                            View Last Test Analysis ➔
                        </button>
                        <div className="flex items-center p-0.5 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A]">
                            <button
                                type="button"
                                onClick={() => setViewMode('dashboard')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    viewMode === 'dashboard'
                                        ? 'bg-[#2A2A2A] text-white shadow-sm'
                                        : 'text-[#888888] hover:text-white'
                                }`}
                            >
                                Dashboard
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('command_deck')}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    viewMode === 'command_deck'
                                        ? 'bg-[#2A2A2A] text-white shadow-sm'
                                        : 'text-[#888888] hover:text-white'
                                }`}
                            >
                                Command Deck
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-sm">
                        <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold">Overall Avg Band</p>
                        <div className="flex items-end gap-2 mt-1">
                            <p className="text-4xl font-bold tracking-tight text-amber-400">{overall.toFixed(1)}</p>
                            <p className="text-xs text-[#888888] mb-1.5">/ 9.0</p>
                        </div>
                        <p className="text-xs text-[#888888] mt-1">{attempts.length} attempt{attempts.length === 1 ? '' : 's'} recorded</p>
                    </div>
                    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-sm">
                        <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold">Target Gap · {TARGET_BAND.toFixed(1)}</p>
                        <p className={`text-4xl font-bold tracking-tight mt-1 ${gap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {gap >= 0 ? '+' : '−'}{Math.abs(gap).toFixed(1)}
                        </p>
                        <p className="text-xs text-[#888888] mt-1">{gap >= 0 ? 'At or above target' : 'Below target'}</p>
                    </div>
                    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-sm">
                        <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold">Completed Exams</p>
                        <p className="text-4xl font-bold tracking-tight text-white mt-1">{attempts.length}</p>
                        <p className="text-xs text-[#888888] mt-1">Across {SKILLS.length} exam modules</p>
                    </div>
                    <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-sm">
                        <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold">Diagnostic Readiness</p>
                        <p className="text-4xl font-bold tracking-tight text-sky-400 mt-1">{readiness}<span className="text-base text-[#888888]">/100</span></p>
                        <div className="h-1.5 rounded-full bg-[#121212] border border-[#2A2A2A]/40 overflow-hidden mt-3">
                            <div className="h-full bg-sky-400 transition-all duration-500" style={{ width: `${readiness}%` }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. Band Performance Trend Graph ── */}
            <section className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold">Band Score Trend</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Multi-skill band progression over time</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {SKILLS.map((s) => (
                            <span key={s} className="flex items-center gap-1.5 text-xs text-neutral-400">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SKILL_HEX[s] }} /> {skillLabels[s]}
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
                        <path d={chart.area} fill="rgba(251,191,36,0.06)" />
                        <polyline points={chart.points} fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
                        {chart.ordered.map((a, i) => (
                            <g key={a.id}>
                                <circle cx={chart.padX + i * chart.stepX} cy={chart.yFor(a.band)} r="4" fill="#121212" stroke={SKILL_HEX[a.skill]} strokeWidth="2" />
                                <title>{`${skillLabels[a.skill]} · ${a.band.toFixed(1)} · ${a.date}`}</title>
                            </g>
                        ))}
                    </svg>
                ) : (
                    <p className="text-sm text-neutral-500 py-10 text-center">No attempts recorded yet.</p>
                )}
            </section>

            {/* ── 3. 4-Skill Summary Row ── */}
            <section>
                <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold mb-3">Skill Score Summary</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {skillBests.map(({ skill, best, recent, count }) => {
                        const isOpen = expandedSkill === skill;
                        const subSkills = recent?.criteria?.length
                            ? recent.criteria
                            : DIAGNOSTIC_SUBSKILLS.filter((d) => d.skill === skill).map((d) => ({ label: d.subSkill, band: Math.max(4, 9 - (d.weight / 100) * 3) }));
                        return (
                            <div key={skill} className={`rounded-2xl border bg-[#1A1A1A] transition-all duration-200 ${isOpen ? 'border-[#4A4A4A]' : 'border-[#2A2A2A]'}`}>
                                <div className="flex items-start justify-between p-5">
                                    <button onClick={() => setExpandedSkill(isOpen ? null : skill)} className="flex-1 text-left min-w-0 cursor-pointer">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold">{skillLabels[skill]}</p>
                                            <span className="text-[10px] font-mono text-neutral-500">{count} attempt{count === 1 ? '' : 's'}</span>
                                        </div>
                                        <p className="text-3xl font-bold tracking-tight mb-3" style={{ color: SKILL_HEX[skill] }}>{best.toFixed(1)}</p>
                                        <div className="h-1.5 rounded-full bg-[#121212] border border-[#2A2A2A]/40 overflow-hidden">
                                            <div className="h-full" style={{ width: `${(best / 9) * 100}%`, backgroundColor: SKILL_HEX[skill] }} />
                                        </div>
                                        <p className="text-xs text-[#888888] mt-2 flex items-center justify-between">
                                            <span>Recent: {recent ? recent.band.toFixed(1) : '—'}</span>
                                            <span className="text-neutral-500">{isOpen ? '▲' : '▼'}</span>
                                        </p>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setAnalysis({ attemptId: recent?.id }); }}
                                        disabled={!recent}
                                        className="ml-3 shrink-0 px-2.5 py-1.5 rounded-lg bg-amber-400 text-black text-[10px] font-semibold uppercase tracking-wider hover:bg-amber-300 disabled:opacity-40 transition-colors cursor-pointer"
                                    >
                                        Analysis ➔
                                    </button>
                                </div>
                                {isOpen && (
                                    <div className="px-5 pb-5 space-y-3 border-t border-[#2A2A2A] pt-4">
                                        {subSkills.map((c) => (
                                            <div key={c.label}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-xs text-neutral-300">{c.label}</p>
                                                    <p className="text-xs font-mono font-semibold" style={{ color: SKILL_HEX[skill] }}>{c.band.toFixed(1)}</p>
                                                </div>
                                                <div className="h-1 rounded bg-[#121212] overflow-hidden">
                                                    <div className="h-full" style={{ width: `${(c.band / 9) * 100}%`, backgroundColor: SKILL_HEX[skill] }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── 4. Examination History Matrix (Promoted Section directly beneath 4-skill summary row) ── */}
            <section className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-base font-semibold tracking-tight text-white">Examination History Matrix</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">Historical exam records, module breakdown, and verification statuses</p>
                    </div>
                    <button
                        onClick={() => { clearAttempts(); setAttempts([]); }}
                        className="text-xs text-[#888888] hover:text-neutral-300 transition-colors cursor-pointer"
                    >
                        Clear history
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex gap-1 rounded-lg bg-[#121212] border border-[#2A2A2A] p-1">
                        {(['all', ...SKILLS] as ('all' | IeltsSkill)[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setModuleFilter(m)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    moduleFilter === m
                                        ? 'bg-[#2A2A2A] text-amber-300 border border-amber-500/20'
                                        : 'text-[#888888] hover:text-neutral-300'
                                }`}
                            >
                                {m === 'all' ? 'All Modules' : skillLabels[m]}
                            </button>
                        ))}
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        className="px-3 py-1.5 rounded-lg bg-[#121212] border border-[#2A2A2A] text-xs text-neutral-300 outline-none focus:border-neutral-500 cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="developing">Developing</option>
                        <option value="at-risk">At Risk</option>
                    </select>
                    <span className="text-xs font-mono text-[#888888] ml-auto">{filtered.length} row{filtered.length === 1 ? '' : 's'}</span>
                </div>

                {filtered.length === 0 ? (
                    <p className="text-sm text-neutral-500 py-8 text-center">No attempts match the current filters.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-wider text-[#888888] border-b border-[#2A2A2A]">
                                    <th className="pb-3 pr-4 font-semibold">Date</th>
                                    <th className="pb-3 pr-4 font-semibold">Exam Module</th>
                                    <th className="pb-3 pr-4 font-semibold">Time Spent</th>
                                    <th className="pb-3 pr-4 font-semibold">Overall Band</th>
                                    <th className="pb-3 pr-4 font-semibold">Criteria Breakdown</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2A2A]">
                                {filtered.map((a) => {
                                    const status = attemptStatus(a.band);
                                    return (
                                        <tr key={a.id} className="hover:bg-[#121212]/50 transition-colors">
                                            <td className="py-3 pr-4 text-xs font-mono text-[#888888]">{a.date}</td>
                                            <td className="py-3 pr-4">
                                                <span className="flex items-center gap-2 text-sm text-neutral-200">
                                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: SKILL_HEX[a.skill] }} />
                                                    {skillLabels[a.skill]}{a.taskType ? ` · ${a.taskType === 'task1' ? 'T1' : 'T2'}` : ''}{a.bundle ? ` · ${a.bundle}` : ''}
                                                </span>
                                            </td>
                                            <td className="py-3 pr-4 text-xs font-mono text-[#888888]">{formatMins(a.timeSpent)}</td>
                                            <td className="py-3 pr-4 text-sm font-mono font-bold text-amber-400">{a.band.toFixed(1)}</td>
                                            <td className="py-3 pr-4">
                                                {a.criteria && a.criteria.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {a.criteria.slice(0, 4).map((c) => (
                                                            <span key={c.label} className="rounded bg-[#121212] border border-[#2A2A2A] px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                                                                {c.label.split(' ')[0]} {c.band.toFixed(1)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-neutral-600">—</span>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* ── 5. Secondary Analytics & Diagnostics (Below History Matrix) ── */}
            <section className="space-y-6">
                {/* Timed Bundle Performance */}
                <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold mb-3">Timed Bundle Performance</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bundleStats.map(({ id, label, avg, count }) => (
                            <div key={id} className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold">{label}</p>
                                    <span className="text-[10px] font-mono text-neutral-500">{count} attempt{count === 1 ? '' : 's'}</span>
                                </div>
                                <p className="text-3xl font-bold tracking-tight mb-3" style={{ color: BUNDLE_HEX[id] }}>{avg > 0 ? avg.toFixed(1) : '—'}</p>
                                <div className="h-1.5 rounded-full bg-[#121212] border border-[#2A2A2A]/40 overflow-hidden">
                                    <div className="h-full" style={{ width: `${(avg / 9) * 100}%`, backgroundColor: BUNDLE_HEX[id] }} />
                                </div>
                                <p className="text-xs text-[#888888] mt-2">Avg band · {count > 0 ? 'synced' : 'no data'}</p>
                                <button
                                    onClick={() => setAnalysis({ bundleId: id })}
                                    className="mt-3 w-full px-3 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider hover:bg-amber-300 transition-colors cursor-pointer"
                                >
                                    View Analysis ➔
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weakness & Diagnostic Vault */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold">Weakness &amp; Diagnostic Vault</p>
                        <span className="text-[10px] font-mono text-neutral-500">Sub-skill error detection · live</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Sub-Skill Error Breakdown */}
                        <div className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-5 shadow-sm">
                            <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold mb-4">Sub-Skill Error Breakdown</p>
                            <div className="space-y-4">
                                {DIAGNOSTIC_SUBSKILLS.map((d) => (
                                    <div key={`${d.skill}-${d.subSkill}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: SKILL_HEX[d.skill] }} />
                                                <p className="text-xs text-neutral-300 truncate">
                                                    <span className="text-[#888888]">{skillLabels[d.skill]}</span> · {d.subSkill}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-mono font-semibold ${d.weight >= 70 ? 'text-red-400' : d.weight >= 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                {d.weight}%
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-[#121212] border border-[#2A2A2A]/40 overflow-hidden">
                                            <div className={`h-full ${d.weight >= 70 ? 'bg-red-400' : d.weight >= 60 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${d.weight}%` }} />
                                        </div>
                                        <p className="text-[11px] text-neutral-500 mt-1">{d.note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Frequent Mistake Tokens */}
                        <div className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-5 shadow-sm flex flex-col justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold mb-4">Frequent Mistake Tokens</p>
                                <div className="flex flex-wrap gap-2">
                                    {MISTAKE_TOKENS.map((t) => (
                                        <div key={t.token} className={`rounded-lg border px-3 py-2 ${TOKEN_TYPE_COLOR[t.type]}`}>
                                            <p className="text-xs font-mono font-semibold">{t.token}</p>
                                            <p className="text-[10px] uppercase tracking-wider opacity-75 mt-0.5">{t.type} · {t.occurrences}×</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-5 rounded-xl bg-[#121212] border border-[#2A2A2A] p-4">
                                <p className="text-[11px] uppercase tracking-wider text-[#888888] font-semibold mb-1.5">Intervention Recommendation</p>
                                <p className="text-xs text-neutral-300 leading-relaxed">
                                    Prioritise <span className="text-amber-300 font-medium">TFNG reading traps</span> and <span className="text-amber-300 font-medium">lexical range</span> drilling. Book a focused grammar clinic before the next full mock cycle.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {analysis && (
                <IELTSAnalysisView attemptId={analysis.attemptId} bundleId={analysis.bundleId} onClose={() => setAnalysis(null)} />
            )}
        </div>
    );
};

export default IELTSDashboard;
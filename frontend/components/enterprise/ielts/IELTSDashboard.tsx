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
    const [showQuickGuide, setShowQuickGuide] = React.useState(false);
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    const newestFirst = [...attempts].sort((a, b) => b.id - a.id);

    // KPI Metrics
    const completedCount = attempts.length;
    const scoredCount = attempts.filter((a) => a.band >= 0).length;
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.band)).toFixed(1) : '0.0';
    const thisWeekCount = attempts.filter((a) => {
        try {
            const d = new Date(a.date);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return !isNaN(d.getTime()) ? d >= sevenDaysAgo : true;
        } catch {
            return true;
        }
    }).length;

    // Skills breakdown metrics
    const readingAttempts = attempts.filter((a) => a.skill === 'reading');
    const readingCount = readingAttempts.length;
    const readingAvg = readingCount > 0 ? readingAttempts.reduce((s, a) => s + a.band, 0) / readingCount : 0;

    const listeningAttempts = attempts.filter((a) => a.skill === 'listening');
    const listeningCount = listeningAttempts.length;
    const listeningAvg = listeningCount > 0 ? listeningAttempts.reduce((s, a) => s + a.band, 0) / listeningCount : 0;

    const writingAttempts = attempts.filter((a) => a.skill === 'writing');
    const writingCount = writingAttempts.length;
    const writingAvg = writingCount > 0 ? writingAttempts.reduce((s, a) => s + a.band, 0) / writingCount : 0;

    const speakingAttempts = attempts.filter((a) => a.skill === 'speaking');
    const speakingCount = speakingAttempts.length;
    const speakingAvg = speakingCount > 0 ? speakingAttempts.reduce((s, a) => s + a.band, 0) / speakingCount : 0;

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

    const formatShortDate = (dateStr?: string) => {
        if (!dateStr) return '';
        try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
        } catch {}
        const parts = dateStr.split(',');
        return parts[0].trim();
    };

    const chart = (() => {
        const ordered = [...newestFirst].reverse();
        if (ordered.length === 0) return null;
        const width = 640;
        const height = 210;
        const padX = 40;
        const padY = 24;
        const padBottom = 34;
        const innerW = width - padX * 2;
        const innerH = height - padY - padBottom;
        const stepX = ordered.length > 1 ? innerW / (ordered.length - 1) : 0;
        const yFor = (band: number) => padY + innerH - (Math.max(0, Math.min(9, band)) / 9) * innerH;
        const gridLines = [9, 7, 5, 3, 0];

        const pointsData = ordered.map((a, i) => {
            const x = ordered.length > 1 ? padX + i * stepX : padX + innerW / 2;
            const y = yFor(a.band);
            return {
                attempt: a,
                x,
                y,
                shortDate: formatShortDate(a.date),
            };
        });

        const polyline = pointsData.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

        return {
            width,
            height,
            padX,
            padY,
            innerH,
            ordered,
            gridLines,
            yFor,
            pointsData,
            polyline,
        };
    })();

    const activeHoverIndex = hoveredIndex !== null && hoveredIndex < (chart?.pointsData.length ?? 0)
        ? hoveredIndex
        : (chart?.pointsData.length ? Math.max(0, chart.pointsData.length - 4) : null);
    const activeHoverPoint = activeHoverIndex !== null && chart ? chart.pointsData[activeHoverIndex] : null;

    return (
        <div className="min-h-full bg-[#121212] text-white p-6 md:p-8 space-y-6">
            {/* ── 1. Page Header Section ── */}
            <section className="space-y-3">
                {/* Top Breadcrumb & Quick Guide */}
                <div className="flex items-center justify-between">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-medium">
                        <button
                            type="button"
                            onClick={() => onNavigate?.('dashboard')}
                            className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                        >
                            Overview
                        </button>
                        <span className="text-neutral-600 select-none">&gt;</span>
                        <span className="text-white font-semibold tracking-tight">My Reports</span>
                    </nav>

                    <button
                        type="button"
                        onClick={() => setShowQuickGuide(true)}
                        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01" />
                        </svg>
                        <span>Quick guide</span>
                    </button>
                </div>

                {/* Title & Right Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">My Reports</h1>
                        <p className="text-sm text-neutral-400 mt-1">Track your progress across all IELTS skills</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => onNavigate?.('dashboard')}
                            className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#242424] border border-neutral-700/60 text-sm font-medium text-neutral-200 flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
                                <circle cx="12" cy="12" r="5" strokeWidth="1.8" />
                                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                            </svg>
                            <span>Dashboard</span>
                        </button>
                    </div>
                </div>

                {/* ── 2. Top Metric Cards Row (Grid of 4) ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {/* Card 1: Completed Reports */}
                    <div className="rounded-2xl border border-[#262626] bg-[#181818] p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">COMPLETED REPORTS</p>
                                <p className="text-3xl font-bold tracking-tight text-white mt-2">{completedCount}</p>
                                <p className="text-xs text-neutral-400 mt-1">{completedCount} all reports</p>
                            </div>
                            <div className="rounded-xl p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Scored Reports */}
                    <div className="rounded-2xl border border-[#262626] bg-[#181818] p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">SCORED REPORTS</p>
                                <p className="text-3xl font-bold tracking-tight text-white mt-2">{scoredCount}</p>
                                <p className="text-xs text-neutral-400 mt-1">with a result</p>
                            </div>
                            <div className="rounded-xl p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Best Score */}
                    <div className="rounded-2xl border border-[#262626] bg-[#181818] p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">BEST SCORE</p>
                                <p className="text-3xl font-bold tracking-tight text-rose-400 mt-2">{bestScore}</p>
                                <p className="text-xs text-neutral-400 mt-1">personal best</p>
                            </div>
                            <div className="rounded-xl p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 3h14v2c0 3.314-2.686 6-6 6s-6-2.686-6-6V3zm0 2H3c0 2.5 1.5 4.5 4 4.88M19 5h2c0 2.5-1.5 4.5-4 4.88M12 11v5m-4 5h8m-5-5h2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: This Week */}
                    <div className="rounded-2xl border border-[#262626] bg-[#181818] p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">THIS WEEK</p>
                                <p className="text-3xl font-bold tracking-tight text-white mt-2">{thisWeekCount}</p>
                                <p className="text-xs text-neutral-400 mt-1">tests taken</p>
                            </div>
                            <div className="rounded-xl p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeWidth="1.8" d="M16 2v4M8 2v4M3 10h18" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. PERFORMANCE OVERVIEW Section (Grid Layout) ── */}
            <section className="space-y-3">
                <div className="flex items-center gap-2 pt-1 pb-1">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h2 className="text-[12px] uppercase font-bold tracking-wider text-neutral-400">PERFORMANCE OVERVIEW</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Card: Score Progress Graph */}
                    <div className="rounded-2xl border border-[#262626] bg-[#181818] p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    <h3 className="text-base font-semibold text-white">Score Progress</h3>
                                </div>
                            </div>

                            {/* Chart with Interactive Tooltip */}
                            <div className="relative w-full">
                                {chart ? (
                                    <>
                                        <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="w-full h-auto overflow-visible">
                                            {/* Dotted Grid Lines & Y-axis labels */}
                                            {chart.gridLines.map((b) => (
                                                <g key={b}>
                                                    <line
                                                        x1={chart.padX}
                                                        y1={chart.yFor(b)}
                                                        x2={chart.width - chart.padX}
                                                        y2={chart.yFor(b)}
                                                        stroke="rgba(255,255,255,0.06)"
                                                        strokeDasharray="3 3"
                                                    />
                                                    <text
                                                        x={chart.padX - 10}
                                                        y={chart.yFor(b) + 3.5}
                                                        textAnchor="end"
                                                        fontSize="10"
                                                        fill="rgba(255,255,255,0.35)"
                                                        className="font-mono"
                                                    >
                                                        {b}
                                                    </text>
                                                </g>
                                            ))}

                                            {/* Active vertical guideline if a point is hovered */}
                                            {activeHoverPoint && (
                                                <line
                                                    x1={activeHoverPoint.x}
                                                    y1={chart.padY}
                                                    x2={activeHoverPoint.x}
                                                    y2={chart.padY + chart.innerH}
                                                    stroke="rgba(255,255,255,0.7)"
                                                    strokeWidth="1.5"
                                                />
                                            )}

                                            {/* Polyline connecting points */}
                                            <polyline
                                                points={chart.polyline}
                                                fill="none"
                                                stroke="#60a5fa"
                                                strokeWidth="2.5"
                                                strokeLinejoin="round"
                                                strokeLinecap="round"
                                            />

                                            {/* Data Points */}
                                            {chart.pointsData.map((pt, i) => {
                                                const isListening = pt.attempt.skill === 'listening';
                                                const isHovered = activeHoverIndex === i;
                                                return (
                                                    <g key={pt.attempt.id}>
                                                        <circle
                                                            cx={pt.x}
                                                            cy={pt.y}
                                                            r={isHovered ? 5.5 : 4}
                                                            fill={isListening ? '#f59e0b' : '#38bdf8'}
                                                            stroke="#181818"
                                                            strokeWidth="2"
                                                            className="transition-all duration-150"
                                                        />
                                                        {/* Transparent hit target for hover */}
                                                        <circle
                                                            cx={pt.x}
                                                            cy={pt.y}
                                                            r="14"
                                                            fill="transparent"
                                                            className="cursor-pointer"
                                                            onMouseEnter={() => setHoveredIndex(i)}
                                                            onClick={() => setHoveredIndex(i)}
                                                        />
                                                        {/* X-axis date labels */}
                                                        <text
                                                            x={pt.x}
                                                            y={chart.height - 10}
                                                            textAnchor="middle"
                                                            fontSize="9"
                                                            fill={isHovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)'}
                                                            className="font-mono select-none"
                                                        >
                                                            {pt.shortDate}
                                                        </text>
                                                    </g>
                                                );
                                            })}
                                        </svg>

                                        {/* Floating Tooltip HTML Overlay */}
                                        {activeHoverPoint && (
                                            <div
                                                className="absolute pointer-events-none bg-white text-neutral-900 rounded-xl px-3 py-1.5 shadow-2xl text-center z-20 transition-all duration-100 -translate-x-1/2 -translate-y-full mb-3 min-w-[68px]"
                                                style={{
                                                    left: `${(activeHoverPoint.x / chart.width) * 100}%`,
                                                    top: `${(activeHoverPoint.y / chart.height) * 100}%`,
                                                }}
                                            >
                                                <p className="text-[11px] font-medium text-neutral-400 leading-tight">{activeHoverPoint.shortDate}</p>
                                                <p className="text-xs font-bold font-mono text-neutral-900 leading-tight mt-0.5">: {activeHoverPoint.attempt.band.toFixed(1)} / 9</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-neutral-500 py-12 text-center">No attempts recorded yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Bottom Legend */}
                        <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#262626]/60 mt-3">
                            <span className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                Listening
                            </span>
                            <span className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                                Reading
                            </span>
                        </div>
                    </div>

                    {/* Right Card: Skills Breakdown */}
                    <div className="rounded-2xl border border-[#262626] bg-[#181818] p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-[#262626]/60 mb-5">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    <h3 className="text-base font-semibold text-white">Skills Breakdown</h3>
                                </div>
                                <span className="text-xs text-neutral-500 font-medium">avg band</span>
                            </div>

                            <div className="space-y-6">
                                {/* Reading Row */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                                        <span className="font-medium text-neutral-200">Reading</span>
                                        <span className="text-xs font-mono text-neutral-400">
                                            {readingAvg.toFixed(1)} / 9 · {readingCount} test{readingCount === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                            style={{ width: `${(readingAvg / 9) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Listening Row */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                                        <span className="font-medium text-neutral-200">Listening</span>
                                        <span className="text-xs font-mono text-neutral-400">
                                            {listeningAvg.toFixed(1)} / 9 · {listeningCount} test{listeningCount === 1 ? '' : 's'}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                            style={{ width: `${(listeningAvg / 9) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {writingCount > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-1.5">
                                            <span className="font-medium text-neutral-200">Writing</span>
                                            <span className="text-xs font-mono text-neutral-400">
                                                {writingAvg.toFixed(1)} / 9 · {writingCount} test{writingCount === 1 ? '' : 's'}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                style={{ width: `${(writingAvg / 9) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {speakingCount > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-1.5">
                                            <span className="font-medium text-neutral-200">Speaking</span>
                                            <span className="text-xs font-mono text-neutral-400">
                                                {speakingAvg.toFixed(1)} / 9 · {speakingCount} test{speakingCount === 1 ? '' : 's'}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-purple-400 rounded-full transition-all duration-500"
                                                style={{ width: `${(speakingAvg / 9) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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

            {/* Quick Guide Modal */}
            {showQuickGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="relative w-full max-w-lg rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01" />
                                </svg>
                                <h3 className="text-lg font-bold text-white">Quick Guide: My Reports</h3>
                            </div>
                            <button
                                onClick={() => setShowQuickGuide(false)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-3 text-sm text-neutral-300">
                            <p>
                                <strong className="text-white">KPI Cards:</strong> Track your completed evaluations, scored results, all-time best band, and active tests taken this week.
                            </p>
                            <p>
                                <strong className="text-white">Score Progress:</strong> Interactive timeline showing your IELTS Band scores (0–9 scale) across test dates for Reading and Listening. Hover any point to inspect test scores.
                            </p>
                            <p>
                                <strong className="text-white">Skills Breakdown:</strong> Displays your average band score and total test count per module.
                            </p>
                            <p>
                                <strong className="text-white">Historical Matrix:</strong> Filter and review complete transcripts, sub-criteria diagnostics, and past exam attempts below.
                            </p>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setShowQuickGuide(false)}
                                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IELTSDashboard;
import React from 'react';
import {
    readAttempts,
    attemptStatus,
    skillLabels,
    skillColors,
    BUNDLES,
    type IeltsAttempt,
    type IeltsSkill,
    type IeltsBundleId,
} from './ieltsShared';
import {
    resolveAnalysis,
    buildObjective,
    buildWriting,
    buildSpeaking,
    type ObjectiveAnalysis,
    type WritingAnalysis,
    type SpeakingAnalysis,
    type BundleAnalysis,
    type AnalysisSegment,
    type SegmentKind,
    type ResolvedAnalysis,
} from './analysisMockData';

/* ───────────────────────── Shared UI ───────────────────────── */

const Card: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({
    title,
    subtitle,
    children,
    className,
}) => (
    <div className={`rounded-xl bg-[#1E1E22] border border-neutral-800 p-6 ${className ?? ''}`}>
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-white tracking-tight">{title}</h4>
            {subtitle && <p className="text-[11px] text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
        {children}
    </div>
);

const Bar: React.FC<{ value: number; max?: number; color?: string; critical?: boolean }> = ({
    value,
    max = 100,
    color = '#fbbf24',
    critical,
}) => (
    <div className="h-2 rounded bg-neutral-800 overflow-hidden">
        <div
            className="h-full transition-all"
            style={{ width: `${Math.min(100, (value / max) * 100)}%`, backgroundColor: critical ? '#ef4444' : color }}
        />
    </div>
);

const BandPill: React.FC<{ band: number; size?: 'sm' | 'lg' }> = ({ band, size = 'sm' }) => {
    const status = attemptStatus(band);
    const cls = size === 'lg' ? 'text-lg px-4 py-1.5' : 'text-sm px-3 py-1';
    return (
        <span className={`inline-flex items-center rounded-full border font-semibold ${cls} ${status.color}`}>
            {band.toFixed(1)}
        </span>
    );
};

const segColor: Record<SegmentKind, string> = {
    plain: 'text-neutral-300',
    grammar: 'bg-red-500/15 text-red-300 border-b border-red-400/50 cursor-pointer',
    vocab: 'bg-yellow-400/10 text-yellow-200 border-b border-yellow-400/40 cursor-pointer',
    strong: 'bg-emerald-500/10 text-emerald-300 border-b border-emerald-400/40 cursor-pointer',
};

const segNote = (s: AnalysisSegment): string => {
    if (s.kind === 'grammar') return `Grammar slip: "${s.text}" — review agreement, articles, or word form.`;
    if (s.kind === 'vocab') return `Weak / Band 6 lexis: "${s.text}" — replace with more precise vocabulary.`;
    if (s.kind === 'strong') return `Band 8+ collocation: "${s.text}" — keep using this structure.`;
    return '';
};

/* ───────────────────────── Objective View ───────────────────────── */

const ObjectiveView: React.FC<{ data: ObjectiveAnalysis }> = ({ data }) => {
    const [passage, setPassage] = React.useState<ObjectiveAnalysis['passageCtx'] | null>(null);
    const o = data;

    return (
        <div className="space-y-4">
            <Card title="Overview Metric Bar" subtitle="Performance snapshot vs allocated time">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { l: 'Band Score', v: o.band.toFixed(1) },
                        { l: 'Correct', v: `${o.correct}/${o.total}` },
                        { l: 'Incorrect', v: String(o.incorrect) },
                        { l: 'Unanswered', v: String(o.unanswered) },
                        { l: 'Time / Alloc.', v: `${o.timeSpent}m / ${o.allocated}m` },
                    ].map((m) => (
                        <div key={m.l} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500">{m.l}</p>
                            <p className="text-xl font-semibold text-white mt-1">{m.v}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Question-Type Accuracy Breakdown" subtitle="Critical gaps flagged below 60%">
                <div className="space-y-3">
                    {o.questionTypes.map((qt) => (
                        <div key={qt.type}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] text-neutral-300">{qt.type}</span>
                                <span className={`text-[11px] font-mono ${qt.critical ? 'text-red-400' : 'text-neutral-400'}`}>
                                    {qt.accuracy}% {qt.critical && '⚠️ Critical Gap'}
                                </span>
                            </div>
                            <Bar value={qt.accuracy} critical={qt.critical} />
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Pacing & Time Wasted Matrix" subtitle="Per-section time distribution">
                <div className="space-y-2">
                    {o.pacing.map((p) => (
                        <div
                            key={p.part}
                            className="flex items-center justify-between rounded-lg bg-[#0D0D0E] border border-neutral-800 px-4 py-3"
                        >
                            <span className="text-[12px] text-neutral-300">{p.part}</span>
                            <span className="text-[11px] font-mono text-neutral-500">{p.minutes}m · {p.avgPerQ}s/q</span>
                            <span className={`text-[11px] font-semibold ${p.warning ? 'text-red-400' : 'text-emerald-400'}`}>
                                {p.warning ?? 'On pace'}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Interactive Answer Review" subtitle="Click any row to inspect passage context">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-wider text-neutral-500">
                                <th className="pb-2 pr-4 font-semibold">Q#</th>
                                <th className="pb-2 pr-4 font-semibold">Your</th>
                                <th className="pb-2 pr-4 font-semibold">Correct</th>
                                <th className="pb-2 pr-4 font-semibold">Type</th>
                                <th className="pb-2 pr-4 font-semibold">Time</th>
                                <th className="pb-2 pr-4 font-semibold">Status</th>
                                <th className="pb-2 font-semibold">Context</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/70">
                            {o.answers.map((a) => (
                                <tr key={a.q}>
                                    <td className="py-2 pr-4 text-xs font-mono text-neutral-400">{a.q}</td>
                                    <td className="py-2 pr-4 text-xs text-neutral-300">{a.your}</td>
                                    <td className="py-2 pr-4 text-xs text-neutral-400">{a.correct}</td>
                                    <td className="py-2 pr-4 text-xs text-neutral-500">{a.type}</td>
                                    <td className="py-2 pr-4 text-xs font-mono text-neutral-500">{a.timeSpent}s</td>
                                    <td className="py-2 pr-4">
                                        <span
                                            className={`text-[11px] font-semibold ${
                                                a.status === 'correct'
                                                    ? 'text-emerald-400'
                                                    : a.status === 'incorrect'
                                                    ? 'text-red-400'
                                                    : 'text-neutral-500'
                                            }`}
                                        >
                                            {a.status === 'correct' ? '✅' : a.status === 'incorrect' ? '❌' : '—'}
                                        </span>
                                    </td>
                                    <td className="py-2">
                                        <button
                                            onClick={() => setPassage(o.passageCtx)}
                                            disabled={a.status === 'unanswered'}
                                            className="text-[11px] text-sky-400 hover:text-sky-300 disabled:opacity-40 disabled:hover:text-sky-400"
                                        >
                                            View Context ➔
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {passage && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPassage(null)}>
                    <div className="max-w-lg w-full rounded-2xl bg-[#1E1E22] border border-neutral-800 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-3">
                            <h4 className="text-sm font-semibold text-white">{passage.heading}</h4>
                            <button onClick={() => setPassage(null)} className="text-neutral-500 hover:text-white text-sm">✕</button>
                        </div>
                        <p className="text-sm text-neutral-300 leading-relaxed">
                            {passage.paragraph.split(passage.highlight).map((part, i, arr) => (
                                <React.Fragment key={i}>
                                    {part}
                                    {i < arr.length - 1 && (
                                        <span className="bg-yellow-400/20 text-yellow-200 px-1 rounded border-b border-yellow-400/50">
                                            {passage.highlight}
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </p>
                        <div className="mt-4 rounded-lg bg-[#0D0D0E] border border-amber-500/20 p-3">
                            <p className="text-[10px] uppercase tracking-wider text-amber-400/80 font-semibold mb-1">Paraphrase Trick</p>
                            <p className="text-[12px] text-amber-200/90">{passage.trick}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ───────────────────────── Writing View ───────────────────────── */

const WritingView: React.FC<{ data: WritingAnalysis }> = ({ data }) => {
    const [sel, setSel] = React.useState<AnalysisSegment | null>(null);
    const w = data;

    return (
        <div className="space-y-4">
            <Card title="Official Band Descriptors" subtitle="25% weight each">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {w.criteria.map((c) => (
                        <div key={c.code} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                            <p className="text-[10px] font-mono text-amber-400">{c.code}</p>
                            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{c.name}</p>
                            <p className="text-2xl font-semibold text-white mt-1">{c.band.toFixed(1)}</p>
                            <p className="text-[10px] text-neutral-500 mt-1">{c.note}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Interactive Essay Canvas" subtitle="Click any highlighted marker for instant correction">
                <div className="text-[15px] leading-[1.8] whitespace-pre-line">
                    {w.segments.map((s, i) => (
                        <span
                            key={i}
                            className={segColor[s.kind]}
                            onClick={() => (s.kind === 'plain' ? setSel(null) : setSel(s))}
                            title={s.kind !== 'plain' ? segNote(s) : undefined}
                        >
                            {s.text}
                        </span>
                    ))}
                </div>
                <div className="mt-4 rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3 min-h-[52px]">
                    {sel ? (
                        <p className="text-[12px] text-neutral-300">
                            <span className="font-semibold text-amber-300">Correction · </span>
                            {segNote(sel)}
                        </p>
                    ) : (
                        <p className="text-[12px] text-neutral-600">Select a highlighted phrase above to see the correction note.</p>
                    )}
                </div>
                <div className="mt-2 flex gap-3 text-[10px] text-neutral-500">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/30 border-b border-red-400/50" /> Grammar</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400/20 border-b border-yellow-400/40" /> Weak vocab</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/20 border-b border-emerald-400/40" /> Band 8+ collocation</span>
                </div>
            </Card>

            <Card title="Paragraph-by-Paragraph AI Upgrade" subtitle="Original → Band 8/9 alternative">
                <div className="space-y-3">
                    {w.rewrites.map((r, i) => (
                        <div key={i} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-4 space-y-2">
                            <p className="text-[12px] text-red-300/90"><span className="font-semibold">Original · </span>{r.original}</p>
                            <p className="text-[12px] text-emerald-300/90"><span className="font-semibold">Upgraded · </span>{r.upgraded}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Teacher Override & Audio Feedback" subtitle="Evaluator verified remarks">
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300">
                        ✓ Evaluator Verified
                    </span>
                    {w.teacher.audioNote && <span className="text-[11px] text-neutral-500">Audio note attached</span>}
                </div>
                <p className="text-[13px] text-neutral-300 leading-relaxed mb-4">{w.teacher.remark}</p>
                {w.teacher.audioNote && (
                    <div className="flex items-center gap-3 rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                        <button className="w-9 h-9 rounded-full bg-amber-400 text-black flex items-center justify-center text-sm">▶</button>
                        <div className="flex-1 h-2 rounded bg-neutral-800 overflow-hidden">
                            <div className="h-full w-1/3 bg-amber-400" />
                        </div>
                        <span className="text-[11px] font-mono text-neutral-500">0:42 / 1:18</span>
                    </div>
                )}
            </Card>
        </div>
    );
};

/* ───────────────────────── Speaking View ───────────────────────── */

const SpeakingView: React.FC<{ data: SpeakingAnalysis }> = ({ data }) => {
    const s = data;
    return (
        <div className="space-y-4">
            <Card title="Official Speaking Score Cards" subtitle="Examiner descriptor bands">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {s.criteria.map((c) => (
                        <div key={c.code} className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-3">
                            <p className="text-[10px] font-mono text-violet-400">{c.code}</p>
                            <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{c.name}</p>
                            <p className="text-2xl font-semibold text-white mt-1">{c.band.toFixed(1)}</p>
                            <p className="text-[10px] text-neutral-500 mt-1">{c.note}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Timecoded Waveform & Transcript" subtitle="Red flags mark pauses / filler words">
                <div className="rounded-lg bg-[#0D0D0E] border border-neutral-800 p-4">
                    <svg viewBox="0 0 600 80" className="w-full h-20" preserveAspectRatio="none">
                        {s.waveform.map((h, i) => {
                            const x = (i / s.waveform.length) * 600;
                            return <rect key={i} x={x} y={40 - h / 2} width={600 / s.waveform.length - 1} height={h} fill="#a78bfa" rx="1" />;
                        })}
                        {s.markers.map((m, i) => {
                            const x = (m.time / 64) * 600;
                            return (
                                <g key={i}>
                                    <line x1={x} y1={0} x2={x} y2={80} stroke={m.type === 'pause' ? '#ef4444' : '#fbbf24'} strokeWidth="1.5" strokeDasharray="2 2" />
                                    <circle cx={x} cy={6} r="3" fill={m.type === 'pause' ? '#ef4444' : '#fbbf24'} />
                                    <title>{`${m.label}`}</title>
                                </g>
                            );
                        })}
                    </svg>
                    <div className="mt-3 space-y-1">
                        {s.transcript.map((t, i) => (
                            <p key={i} className="text-[13px] leading-relaxed">
                                {t.kind === 'plain' ? (
                                    <span className="text-neutral-300">{t.text}</span>
                                ) : (
                                    <span
                                        className={`border-b ${
                                            t.kind === 'grammar'
                                                ? 'text-red-300 border-red-400/50'
                                                : 'text-yellow-200 border-yellow-400/40'
                                        }`}
                                        title={t.note}
                                    >
                                        {t.text}
                                        {t.note ? ' ⚠️' : ''}
                                    </span>
                                )}
                            </p>
                        ))}
                    </div>
                </div>
            </Card>

            <Card title="Speech Metrics Engine" subtitle="Fluency & lexical density">
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between mb-1 text-[12px]"><span className="text-neutral-300">Speech Rate (WPM)</span><span className="font-mono text-neutral-400">{s.metrics.wpm}</span></div>
                        <Bar value={s.metrics.wpm} max={180} color="#a78bfa" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1 text-[12px]"><span className="text-neutral-300">Pause Frequency (/min)</span><span className="font-mono text-neutral-400">{s.metrics.pauseFreq}</span></div>
                        <Bar value={s.metrics.pauseFreq} max={8} critical={s.metrics.pauseFreq > 4} color="#a78bfa" />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1 text-[12px]"><span className="text-neutral-300">C1/C2 Vocabulary Density</span><span className="font-mono text-neutral-400">{s.metrics.c1c2Density}%</span></div>
                        <Bar value={s.metrics.c1c2Density} max={100} color="#a78bfa" />
                    </div>
                </div>
            </Card>
        </div>
    );
};

/* ───────────────────────── Bundle View ───────────────────────── */

const RadarChart: React.FC<{ radar: Record<IeltsSkill, number> }> = ({ radar }) => {
    const skills: IeltsSkill[] = ['listening', 'reading', 'writing', 'speaking'];
    const size = 220;
    const cx = size / 2;
    const cy = size / 2;
    const R = 80;
    const angle = (i: number) => (-90 + i * 90) * (Math.PI / 180);
    const pt = (i: number, val: number) => {
        const r = (val / 9) * R;
        return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
    };
    const poly = skills.map((sk, i) => pt(i, radar[sk]).join(',')).join(' ');
    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
            {[3, 6, 9].map((ring) => (
                <polygon
                    key={ring}
                    points={skills.map((_, i) => pt(i, ring).join(',')).join(' ')}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                />
            ))}
            {skills.map((_, i) => {
                const [x, y] = pt(i, 9);
                return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />;
            })}
            <polygon points={poly} fill="rgba(251,191,0,0.18)" stroke="#fbbf24" strokeWidth="2" />
            {skills.map((sk, i) => {
                const [x, y] = pt(i, radar[sk]);
                return <circle key={sk} cx={x} cy={y} r="3" fill="#fbbf24" />;
            })}
            {skills.map((sk, i) => {
                const [x, y] = pt(i, 10.2);
                return (
                    <text key={sk} x={x} y={y} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)" className="font-mono">
                        {skillLabels[sk].slice(0, 3).toUpperCase()}
                    </text>
                );
            })}
        </svg>
    );
};

const BundleView: React.FC<{ data: BundleAnalysis }> = ({ data }) => {
    const [tab, setTab] = React.useState(0);
    const b = data;
    const section = b.sections[tab];

    const renderDetail = () => {
        const synth: IeltsAttempt = { id: 0, skill: section.skill, band: section.band, date: '', bundle: b.label };
        if (section.skill === 'writing') return <WritingView data={buildWriting(synth)} />;
        if (section.skill === 'speaking') return <SpeakingView data={buildSpeaking(synth)} />;
        return <ObjectiveView data={buildObjective(synth)} />;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {b.sections.map((sec, i) => (
                    <button
                        key={sec.skill}
                        onClick={() => setTab(i)}
                        className={`px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors ${
                            tab === i
                                ? 'bg-amber-400 text-black'
                                : 'bg-[#1E1E22] border border-neutral-800 text-neutral-300 hover:border-neutral-600'
                        }`}
                    >
                        {skillLabels[sec.skill]}: {sec.band.toFixed(1)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                    <Card title="Combined Skill Radar" subtitle="Balance across modules">
                        <RadarChart radar={b.radar} />
                    </Card>
                    <Card title="Coaching Centre Verdict" subtitle="Readiness & prediction" className="mt-4">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                                b.verdict.readiness >= 70 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                            }`}>
                                {b.verdict.readiness}% Ready for Target 7.5
                            </span>
                        </div>
                        <p className="text-[12px] text-neutral-300">Overall prediction: <span className="font-semibold text-white">{b.verdict.prediction.toFixed(1)}</span></p>
                        <div className="mt-3">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Primary focus</p>
                            <ul className="space-y-1">
                                {b.verdict.focus.map((f) => (
                                    <li key={f} className="text-[12px] text-amber-300/90">• {f}</li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">{renderDetail()}</div>
            </div>
        </div>
    );
};

/* ───────────────────────── Main Modal ───────────────────────── */

interface IELTSAnalysisViewProps {
    attemptId?: number;
    bundleId?: IeltsBundleId;
    onClose: () => void;
}

const IELTSAnalysisView: React.FC<IELTSAnalysisViewProps> = ({ attemptId, bundleId, onClose }) => {
    const data = React.useMemo<ResolvedAnalysis>(
        () => resolveAnalysis({ attemptId, bundleId }, readAttempts()),
        [attemptId, bundleId],
    );

    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const title = data.title ?? (data.skill ? skillLabels[data.skill] : 'Analysis');
    const headerBand =
        data.kind === 'bundle'
            ? data.bundle?.verdict.prediction ?? 0
            : data.kind === 'objective'
            ? data.objective?.band ?? 0
            : data.kind === 'writing'
            ? data.writing?.band ?? 0
            : data.speaking?.band ?? 0;
    const accent = data.skill ? skillColors[data.skill] : 'text-amber-400';

    return (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto custom-scrollbar" onClick={onClose}>
            <div
                className="w-full max-w-5xl my-8 rounded-2xl bg-[#0D0D0E] border border-neutral-800 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-surface border-b border-neutral-800 rounded-t-2xl">
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500">Test Analysis</p>
                        <h2 className={`text-lg font-semibold tracking-tight truncate ${accent}`}>{title}</h2>
                        {data.attemptDate && <p className="text-[11px] text-neutral-500 mt-0.5">{data.attemptDate}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <BandPill band={headerBand} size="lg" />
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 border border-neutral-800 rounded-full px-3 py-1">Target 7.5</span>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-lg bg-canvas border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </header>

                <div className="p-6">
                    {data.kind === 'objective' && data.objective && <ObjectiveView data={data.objective} />}
                    {data.kind === 'writing' && data.writing && <WritingView data={data.writing} />}
                    {data.kind === 'speaking' && data.speaking && <SpeakingView data={data.speaking} />}
                    {data.kind === 'bundle' && data.bundle && <BundleView data={data.bundle} />}
                </div>
            </div>
        </div>
    );
};

export default IELTSAnalysisView;


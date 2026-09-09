import React, { useEffect, useState } from 'react';
import {
    BUNDLES,
    addAttempt,
    skillLabels,
    formatClock,
    EXAM_META,
    type IeltsBundleId,
    type IeltsSkill,
    type SimSectionResult,
} from './ieltsShared';
import IELTSLobbyCard from './IELTSLobbyCard';
import IELTSExitModal from './IELTSExitModal';
import IELTSListeningExam from './IELTSListeningExam';
import IELTSReadingExam from './IELTSReadingExam';
import IELTSWritingExam from './IELTSWritingExam';
import IELTSSpeakingExam from './IELTSSpeakingExam';

type RunnerState = 'lobby' | 'section' | 'break' | 'summary';

const SKILL_HEX: Record<IeltsSkill, string> = {
    listening: '#38bdf8',
    reading: '#34d399',
    writing: '#fbbf24',
    speaking: '#a78bfa',
};

interface IELTSSimulationRunnerProps {
    bundleId: IeltsBundleId;
    candidateEmail?: string;
    onFinish: () => void;
    onActiveChange?: (active: boolean) => void;
    exitPulse?: boolean;
}

const IELTSSimulationRunner: React.FC<IELTSSimulationRunnerProps> = ({ bundleId, candidateEmail, onFinish, onActiveChange, exitPulse }) => {
    const bundle = BUNDLES.find((b) => b.id === bundleId) ?? BUNDLES[0];
    const [state, setState] = useState<RunnerState>('lobby');
    const [sectionIndex, setSectionIndex] = useState(0);
    const [breakCountdown, setBreakCountdown] = useState(5);
    const [results, setResults] = useState<SimSectionResult[]>([]);
    const [showExitModal, setShowExitModal] = useState(false);

    const current = bundle.sections[sectionIndex];
    const totalSections = bundle.sections.length;
    const totalQuestions = bundle.sections.reduce((acc, s) => acc + EXAM_META[s.skill].questions, 0);

    useEffect(() => {
        if (state !== 'break') return;
        if (breakCountdown <= 0) {
            setSectionIndex((i) => i + 1);
            setState('section');
            return;
        }
        const id = window.setTimeout(() => setBreakCountdown((c) => c - 1), 1000);
        return () => window.clearTimeout(id);
    }, [state, breakCountdown]);

    useEffect(() => {
        onActiveChange?.(state !== 'lobby');
    }, [state, onActiveChange]);

    const handleSectionComplete = (result: SimSectionResult) => {
        setResults((prev) => {
            const next = [...prev, result];
            if (sectionIndex + 1 < totalSections) {
                setBreakCountdown(5);
                setState('break');
            } else {
                setState('summary');
            }
            return next;
        });
    };

    const abandon = () => {
        setResults([]);
        setSectionIndex(0);
        setBreakCountdown(5);
        setState('lobby');
        setShowExitModal(false);
    };

    const saveResults = () => {
        const now = Date.now();
        results.forEach((r, i) => {
            addAttempt({
                id: now + i,
                skill: r.skill,
                band: r.band,
                score: r.score,
                criteria: r.criteria,
                timeSpent: r.timeSpent,
                bundle: bundle.label,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            });
        });
        onFinish();
    };

    const overall = results.length > 0
        ? results.reduce((sum, r) => sum + r.band, 0) / results.length
        : 0;

    if (state === 'lobby') {
        return (
            <IELTSLobbyCard
                skill="listening"
                candidateEmail={candidateEmail || ''}
                title={bundle.label}
                subtitle="Timed bundled simulation — results route directly to the Dashboard tracker."
                onStart={() => setState('section')}
                startLabel="START EXAMINATION"
                durationLabel={bundle.durationLabel}
                questionCount={totalQuestions}
                sectionsLabel={`${totalSections} timed modules · auto-advancing`}
                bundleSections={bundle.sections}
            />
        );
    }

    const renderSection = () => {
        if (!current) return null;
        const simulation = {
            sectionLabel: current.label,
            timeLimitSeconds: current.minutes * 60,
            onComplete: handleSectionComplete,
            onExit: abandon,
        };
        switch (current.skill) {
            case 'listening': return <IELTSListeningExam candidateEmail={candidateEmail} simulation={simulation} />;
            case 'reading': return <IELTSReadingExam candidateEmail={candidateEmail} simulation={simulation} />;
            case 'writing': return <IELTSWritingExam candidateEmail={candidateEmail} simulation={simulation} exitPulse={exitPulse} />;
            case 'speaking': return <IELTSSpeakingExam candidateEmail={candidateEmail} simulation={simulation} />;
        }
    };

    return (
        <div className={state === 'section' ? 'h-full w-full min-h-0 flex flex-col overflow-hidden bg-white' : 'space-y-4'}>
            {state === 'section' && (
                <>
                    <div className="shrink-0 rounded-xl border border-neutral-800 bg-surface px-4 py-3 flex items-center justify-between m-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowExitModal(true)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-canvas border border-neutral-800 text-[11px] text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-all${exitPulse ? ' scale-105 ring-2 ring-rose-500/80 shadow-[0_0_15px_rgba(225,29,72,0.5)] animate-pulse' : ''}`}
                            >
                                <span>⬅️</span> Exit Exam
                            </button>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                                {bundle.label} · Section {sectionIndex + 1} of {totalSections}
                            </span>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-500">{current.label} · {current.minutes}m</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden">{renderSection()}</div>
                </>
            )}

            {state === 'break' && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-surface p-10 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">
                            {bundle.label} · Section Break
                        </p>
                        <p className="text-2xl font-semibold tracking-tight text-white">
                            Section {sectionIndex + 1} of {totalSections} complete
                        </p>
                        <p className="text-sm text-neutral-400 mt-2">
                            Starting <span className="text-amber-300">{bundle.sections[sectionIndex + 1]?.label}</span> in…
                        </p>
                        <p className="text-5xl font-semibold text-amber-400 mt-6 font-mono">{breakCountdown}</p>
                        <div className="h-1.5 rounded bg-neutral-800 overflow-hidden mt-6">
                            <div className="h-full bg-amber-400" style={{ width: `${((5 - breakCountdown) / 5) * 100}%` }} />
                        </div>
                    </div>
                </div>
            )}

            {state === 'summary' && (
                <div className="rounded-2xl border border-neutral-800 bg-surface p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight text-white">{bundle.label} — Results</h2>
                            <p className="text-sm text-neutral-400 mt-1">Aggregate band report across all simulated sections.</p>
                        </div>
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-4 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold">Overall Band</p>
                            <p className="text-3xl font-semibold tracking-tight text-amber-400">{overall.toFixed(1)}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-wider text-neutral-500">
                                    <th className="pb-2 pr-4 font-semibold">Module</th>
                                    <th className="pb-2 pr-4 font-semibold">Section</th>
                                    <th className="pb-2 pr-4 font-semibold">Time Spent</th>
                                    <th className="pb-2 pr-4 font-semibold">Raw Score</th>
                                    <th className="pb-2 font-semibold">Band</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/70">
                                {results.map((r, i) => (
                                    <tr key={`${r.skill}-${i}`}>
                                        <td className="py-2.5 pr-4">
                                            <span className="flex items-center gap-2 text-sm text-neutral-300">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SKILL_HEX[r.skill] }} />
                                                {skillLabels[r.skill]}
                                            </span>
                                        </td>
                                        <td className="py-2.5 pr-4 text-xs text-neutral-500">{bundle.sections[i]?.label}</td>
                                        <td className="py-2.5 pr-4 text-xs font-mono text-neutral-500">{r.timeSpent}m</td>
                                        <td className="py-2.5 pr-4 text-xs font-mono text-neutral-500">{r.score != null ? `${r.score}/40` : '—'}</td>
                                        <td className="py-2.5 text-sm font-mono text-amber-400">{r.band.toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        onClick={saveResults}
                        className="w-full px-6 py-4 rounded-xl bg-amber-400 text-black text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-amber-300"
                    >
                        Save &amp; View on Dashboard
                    </button>
                    <p className="text-[11px] text-neutral-600 mt-3 text-center">
                        Results are written to the enterprise tracker before you leave.
                    </p>
                </div>
            )}

            <IELTSExitModal
                open={showExitModal}
                onConfirm={abandon}
                onCancel={() => setShowExitModal(false)}
            />
        </div>
    );
};

export default IELTSSimulationRunner;
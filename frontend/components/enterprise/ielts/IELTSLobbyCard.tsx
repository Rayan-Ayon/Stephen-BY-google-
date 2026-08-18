import React from 'react';
import {
    EXAM_META,
    skillLabels,
    type IeltsSkill,
    type BundleSection,
} from './ieltsShared';

interface IELTSLobbyCardProps {
    skill: IeltsSkill;
    candidateEmail: string;
    title: string;
    subtitle: string;
    onStart: () => void;
    startLabel?: string;
    durationLabel?: string;
    questionCount?: number;
    sectionsLabel?: string;
    bundleSections?: BundleSection[];
}

const EQUIPMENT_CHECKS = [
    { icon: '🎧', label: 'Headphones connected' },
    { icon: '🎙', label: 'Microphone ready' },
    { icon: '⚡', label: 'Stable connection verified' },
];

const IELTSLobbyCard: React.FC<IELTSLobbyCardProps> = ({
    skill,
    candidateEmail,
    title,
    subtitle,
    onStart,
    startLabel = 'START EXAMINATION',
    durationLabel,
    questionCount,
    sectionsLabel,
    bundleSections,
}) => {
    const meta = EXAM_META[skill];

    const stats = [
        { label: 'Duration', value: durationLabel ?? meta.durationLabel },
        { label: 'Question Count', value: String(questionCount ?? meta.questions) },
        { label: 'Structure', value: sectionsLabel ?? meta.sections },
    ];

    return (
        <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-8">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
                    <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 whitespace-nowrap">Pre-Test Lobby</span>
            </div>

            <div className="rounded-xl bg-[#0b0b0b] border border-neutral-800 p-5 mb-5">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">Candidate Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-600">Candidate</p>
                        <p className="text-sm text-neutral-200 mt-0.5">{candidateEmail || 'farmgate@stephen.ai'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-600">Batch</p>
                        <p className="text-sm text-neutral-200 mt-0.5">Farmgate Executive Batch</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-600">Module</p>
                        <p className="text-sm text-neutral-200 mt-0.5">{skillLabels[skill]}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {stats.map((s) => (
                    <div key={s.label} className="rounded-xl bg-[#0b0b0b] border border-neutral-800 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{s.label}</p>
                        <p className="text-sm text-neutral-200 mt-1.5">{s.value}</p>
                    </div>
                ))}
            </div>

            {bundleSections && bundleSections.length > 0 && (
                <div className="rounded-xl bg-[#0b0b0b] border border-neutral-800 p-5 mb-5">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">Simulation Sequence</p>
                    <div className="space-y-2">
                        {bundleSections.map((sec, i) => (
                            <div key={`${sec.skill}-${i}`} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full border border-neutral-700 text-[11px] font-mono text-neutral-400 flex items-center justify-center shrink-0">
                                    {i + 1}
                                </span>
                                <span className="flex-1 text-sm text-neutral-300">{sec.label}</span>
                                <span className="text-[11px] font-mono text-neutral-500">{sec.minutes}m · {skillLabels[sec.skill]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="rounded-xl bg-[#0b0b0b] border border-neutral-800 p-5 mb-6">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">Equipment Check</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {EQUIPMENT_CHECKS.map((c) => (
                        <div key={c.label} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] flex items-center justify-center">✓</span>
                            <span className="text-sm">{c.icon}</span>
                            <span className="text-[12px] text-neutral-300">{c.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onStart}
                className="w-full px-6 py-4 rounded-xl bg-amber-400 text-black text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-amber-300"
            >
                {startLabel}
            </button>
            <p className="text-[11px] text-neutral-600 mt-3 text-center">
                Timers begin only after you start the examination.
            </p>
        </div>
    );
};

export default IELTSLobbyCard;
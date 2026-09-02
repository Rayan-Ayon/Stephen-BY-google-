import React, { useState, useCallback } from 'react';

// ── Types ──

export type PrivacyLevel = 'public' | 'private';

export interface SkillTelemetry {
    skill: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
    band: number;
    progressPercent: number;
    subDescriptor: string;
    status: 'Mastered' | 'Target Gap' | 'Optimal';
}

export interface MockTestRecord {
    id: string;
    testName: string;
    date: string;
    overallBand: number;
    verified: boolean;
    breakdown: { listening: number; reading: number; writing: number; speaking: number };
    examinerNotes: string;
}

export interface WeaknessVector {
    id: string;
    category: string;
    defectName: string;
    severity: 'High' | 'Medium' | 'Low';
    aiRecommendation: string;
    chapterRef: string;
}

export interface TargetUniversity {
    institution: string;
    degree: string;
    requiredBand: number;
    minWritingBand: number;
    targetDate: string;
    readinessPercentage: number;
}

// ── Mock Data ──

const skills: SkillTelemetry[] = [
    { skill: 'Listening', band: 7.0, progressPercent: 70, subDescriptor: 'L3 Academic Lecture Comprehension', status: 'Target Gap' },
    { skill: 'Reading', band: 8.0, progressPercent: 80, subDescriptor: 'R4 Complex Argument Mapping', status: 'Optimal' },
    { skill: 'Writing', band: 6.5, progressPercent: 65, subDescriptor: 'W2 Task Response Accuracy', status: 'Target Gap' },
    { skill: 'Speaking', band: 7.5, progressPercent: 75, subDescriptor: 'S2 Fluency & Collocation Recall', status: 'Mastered' },
];

const weaknesses: WeaknessVector[] = [
    {
        id: 'WK-01', category: 'Grammar', defectName: 'Subject-Verb Agreement Drift',
        severity: 'High', aiRecommendation: 'Complete Module 4.2: Advanced Clause Structure Drills',
        chapterRef: 'Advanced Grammar Vol. I',
    },
    {
        id: 'WK-02', category: 'Vocabulary', defectName: 'Academic Paraphrase Failure',
        severity: 'Medium', aiRecommendation: 'Retake Task 2 Strategy Pack: Lexical Substitution',
        chapterRef: 'IELTS Vocabulary Matrix',
    },
    {
        id: 'WK-03', category: 'Fluency', defectName: 'Filler Overuse in Part 3',
        severity: 'Low', aiRecommendation: 'Practice Mock Speaking Session with Timeboxed Delivery',
        chapterRef: 'Speaking Mastery Ch. 3',
    },
];

const mockTests: MockTestRecord[] = [
    {
        id: 'mock-01', testName: 'Cambridge IELTS 18 Mock #1', date: '2026-06-15', overallBand: 7.0, verified: false,
        breakdown: { listening: 7.0, reading: 7.5, writing: 6.5, speaking: 7.0 },
        examinerNotes: 'Writing Task 2 lacked coherent thesis. Speaking Part 3 needed more opinion depth.',
    },
    {
        id: 'mock-02', testName: 'Cambridge IELTS 18 Mock #2', date: '2026-07-01', overallBand: 7.0, verified: false,
        breakdown: { listening: 7.0, reading: 7.5, writing: 6.5, speaking: 7.0 },
        examinerNotes: 'Reading improved significantly. Listening Section 4 still weak on proper nouns.',
    },
    {
        id: 'mock-03', testName: 'Cambridge IELTS 18 Mock #3', date: '2026-07-20', overallBand: 7.0, verified: false,
        breakdown: { listening: 7.0, reading: 7.5, writing: 6.5, speaking: 7.0 },
        examinerNotes: 'Consistent performance. Writing Task 1 needs graph description vocabulary.',
    },
    {
        id: 'mock-04', testName: 'Official IDP Practice Test', date: '2026-08-10', overallBand: 7.5, verified: true,
        breakdown: { listening: 7.5, reading: 8.0, writing: 7.0, speaking: 7.5 },
        examinerNotes: 'Excellent overall improvement. Writing needs paraphrasing polish for 8.0+.',
    },
];

const targetUniversity: TargetUniversity = {
    institution: 'University of Melbourne',
    degree: 'Master of Data Science',
    requiredBand: 7.5,
    minWritingBand: 7.0,
    targetDate: '2027-02-15',
    readinessPercentage: 88,
};

const certificates = [
    { id: 'c1', label: 'IELTS Academic — Band 7.0 (2025)', icon: '📜' },
    { id: 'c2', label: 'Pearson PTE Core — Score 65 (2024)', icon: '🎯' },
    { id: 'c3', label: 'Cambridge C1 Advanced — Grade A (2024)', icon: '🏅' },
];

const vaultItems = [
    { id: 'v1', label: 'Task 2 Essay — "Climate Change Policy"', type: 'essay', storedAt: '2026-08-01' },
    { id: 'v2', label: 'Speaking Session 07 — Part 2 Retelling', type: 'audio', storedAt: '2026-08-05' },
    { id: 'v3', label: 'Writing Task 1 — Line Graph Analysis', type: 'essay', storedAt: '2026-08-10' },
    { id: 'v4', label: 'Speaking Session 09 — Mock Interview', type: 'audio', storedAt: '2026-08-12' },
];

const peerNetwork = {
    seniorExaminer: { name: 'Dr. Aisha Rahman', role: 'Lead Senior Examiner', status: 'Online' },
    studyPartner: { name: 'Farhan Ahmed', role: 'Band 8.0 Study Partner', status: 'Active' },
    aiCopilot: { name: 'Stephen AI Co-Pilot', role: 'Automated Diagnostic Engine', status: 'Running' },
};

// ── Inline SVG Icons ──

const AvatarGlow: React.FC = () => (
    <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <span className="text-2xl font-bold text-emerald-300">AY</span>
        </div>
    </div>
);

const GlobeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

const LockIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

const CopyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const RefreshIcon = ({ className = 'w-4 h-4', spinning = false }: { className?: string; spinning?: boolean }) => (
    <svg className={`${className} ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
    </svg>
);

const SaveIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const ChevronIcon = ({ className = 'w-4 h-4', open = false }: { className?: string; open?: boolean }) => (
    <svg className={`${className} transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const DownloadIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const BoltIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

const ChartBarIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

const UserGroupIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
);

const AcademicCapIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
    </svg>
);

const ShieldCheckMini = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
);

const SparklesIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
);

const DocumentIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const MicrophoneIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
);

// ── Progress Fill ──

const ProgressFill: React.FC<{ percent: number; color?: string }> = ({ percent, color = 'from-emerald-500 to-emerald-400' }) => (
    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
            className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
            style={{ width: `${percent}%` }}
        />
    </div>
);

// ── Toast Component ──

const Toast: React.FC<{ message: string; onDone: () => void }> = ({ message, onDone }) => {
    React.useEffect(() => {
        const t = setTimeout(onDone, 2500);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-2 px-5 py-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-medium shadow-[0_8px_32px_rgba(16,185,129,0.15)] backdrop-blur-xl">
                <ShieldCheckMini className="w-4 h-4 text-emerald-400" />
                {message}
            </div>
        </div>
    );
};

// ── Main Component ──

const ProfileWorkspace: React.FC = () => {
    const [globalPrivacyOverride, setGlobalPrivacyOverride] = useState<'custom' | 'all_private'>('custom');
    const [cardPrivacy, setCardPrivacy] = useState<Record<string, PrivacyLevel>>({
        header: 'public', skills: 'private', diagnostics: 'private',
        network: 'public', mocks: 'public', university: 'public',
        certificates: 'public', vault: 'private',
    });
    const [expandedMockId, setExpandedMockId] = useState<string | null>('mock-04');
    const [isSyncing, setIsSyncing] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [vaultOpen, setVaultOpen] = useState(false);

    const toggleCardPrivacy = useCallback((cardKey: string) => {
        setCardPrivacy((prev) => ({ ...prev, [cardKey]: prev[cardKey] === 'public' ? 'private' : 'public' }));
    }, []);

    const isCardPublic = useCallback((cardKey: string) => {
        return globalPrivacyOverride === 'all_private' ? false : cardPrivacy[cardKey] === 'public';
    }, [globalPrivacyOverride, cardPrivacy]);

    const handleResync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setToast('AI candidate metrics re-synced successfully');
        }, 1500);
    };

    const handleSave = () => {
        setToast('Profile privacy settings saved');
    };

    const severityColor = (s: string) => {
        if (s === 'High') return 'bg-red-500/10 text-red-400 border border-red-500/30';
        if (s === 'Medium') return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    };

    const statusColor = (s: string) => {
        if (s === 'Mastered') return 'text-emerald-400';
        if (s === 'Target Gap') return 'text-amber-400';
        return 'text-cyan-400';
    };

    const PrivacyToggle: React.FC<{ cardKey: string }> = ({ cardKey }) => (
        <button
            onClick={() => toggleCardPrivacy(cardKey)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                isCardPublic(cardKey)
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
            }`}
        >
            {isCardPublic(cardKey) ? (
                <><GlobeIcon className="w-3 h-3" /> Public</>
            ) : (
                <><LockIcon className="w-3 h-3" /> Private</>
            )}
        </button>
    );

    return (
        <div className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-100 font-sans p-6 space-y-6">
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {/* ═══ SECTION A: HEADER CARD ═══ */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    <AvatarGlow />
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-xl font-bold text-white tracking-tight">ayonburg@gmail.com</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                Lv. 7 Scholar
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                                Tier 3 Candidate
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                                🎯 Target: Band 7.5+
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-medium">
                                ⚡ Status: Exam Ready (88%)
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-medium">
                                🏛️ Melbourne Node
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-medium">
                                🎓 DS Master&apos;s Track
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Privacy Mode</span>
                            <div className="flex bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
                                <button
                                    onClick={() => setGlobalPrivacyOverride('custom')}
                                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                                        globalPrivacyOverride === 'custom'
                                            ? 'bg-zinc-700 text-white'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    [Custom]
                                </button>
                                <button
                                    onClick={() => setGlobalPrivacyOverride('all_private')}
                                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                                        globalPrivacyOverride === 'all_private'
                                            ? 'bg-zinc-700 text-white'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                                >
                                    [Force All Private]
                                </button>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all">
                            <CopyIcon className="w-3.5 h-3.5" />
                            COPY PUBLIC LINK
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══ SECTION B: TWO-COLUMN GRID ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* ── LEFT COLUMN ── */}
                <div className="lg:col-span-5 space-y-6">

                    {/* CARD 1: IELTS Band Estimator & Mastery Radar */}
                    <div className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-zinc-700/80 transition-all duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <ChartBarIcon className="w-4 h-4 text-emerald-400" />
                                IELTS Band Estimator & Mastery Radar
                            </h2>
                            <PrivacyToggle cardKey="skills" />
                        </div>
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl" />
                                <div className="relative w-28 h-28 rounded-full bg-zinc-800 border-2 border-emerald-500/30 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                    <span className="text-3xl font-bold text-emerald-300">7.5</span>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Overall Band</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {skills.map((s) => (
                                <div key={s.skill} className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">{s.skill}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold ${statusColor(s.status)}`}>{s.status}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold">{s.band}</span>
                                        </div>
                                    </div>
                                    <ProgressFill percent={s.progressPercent} />
                                    <p className="text-[11px] text-zinc-500 mt-1.5">{s.subDescriptor}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CARD 2: AI Diagnostic & Weakness Vector */}
                    <div className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-zinc-700/80 transition-all duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4 text-amber-400" />
                                AI Diagnostic & Weakness Vector
                            </h2>
                            <PrivacyToggle cardKey="diagnostics" />
                        </div>
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-zinc-400">Error Density Meter</span>
                                <span className="text-xs font-bold text-amber-400">18.4%</span>
                            </div>
                            <ProgressFill percent={18.4} color="from-amber-500 to-amber-400" />
                        </div>
                        <div className="space-y-3">
                            {weaknesses.map((w) => (
                                <div key={w.id} className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-zinc-300">{w.category}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${severityColor(w.severity)}`}>
                                            {w.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white font-medium mb-1">{w.defectName}</p>
                                    <p className="text-[11px] text-zinc-500 mb-2">{w.aiRecommendation}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-zinc-700 text-zinc-400 text-[10px] font-medium border border-zinc-600">
                                            📖 {w.chapterRef}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all">
                            <BoltIcon className="w-3.5 h-3.5" />
                            LAUNCH TARGETED DRILL
                        </button>
                    </div>

                    {/* CARD 3: Peer Network & Coaching Links */}
                    <div className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-zinc-700/80 transition-all duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <UserGroupIcon className="w-4 h-4 text-cyan-400" />
                                Peer Network & Coaching Links
                            </h2>
                            <PrivacyToggle cardKey="network" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                                    AR
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{peerNetwork.seniorExaminer.name}</p>
                                    <p className="text-[11px] text-zinc-500">{peerNetwork.seniorExaminer.role}</p>
                                </div>
                                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    {peerNetwork.seniorExaminer.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                <div className="w-9 h-9 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">
                                    FA
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{peerNetwork.studyPartner.name}</p>
                                    <p className="text-[11px] text-zinc-500">{peerNetwork.studyPartner.role}</p>
                                </div>
                                <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    {peerNetwork.studyPartner.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
                                    <SparklesIcon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{peerNetwork.aiCopilot.name}</p>
                                    <p className="text-[11px] text-zinc-500">{peerNetwork.aiCopilot.role}</p>
                                </div>
                                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    {peerNetwork.aiCopilot.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="lg:col-span-7 space-y-6">

                    {/* CARD 4: Official Mock Scores & Showcase */}
                    <div className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-zinc-700/80 transition-all duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <AcademicCapIcon className="w-4 h-4 text-violet-400" />
                                Official Mock Scores & Showcase
                            </h2>
                            <PrivacyToggle cardKey="mocks" />
                        </div>
                        <div className="space-y-3">
                            {mockTests.map((m) => (
                                <div key={m.id} className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 overflow-hidden hover:border-zinc-600/50 transition-all">
                                    <button
                                        onClick={() => setExpandedMockId(expandedMockId === m.id ? null : m.id)}
                                        className="w-full flex items-center justify-between p-4 text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                                                m.overallBand >= 7.5
                                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                            }`}>
                                                {m.overallBand}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-white">{m.testName}</p>
                                                <p className="text-[11px] text-zinc-500">{m.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {m.verified && (
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                                                    <ShieldCheckMini className="w-3 h-3" /> Verified
                                                </span>
                                            )}
                                            <ChevronIcon className="w-4 h-4 text-zinc-500" open={expandedMockId === m.id} />
                                        </div>
                                    </button>
                                    {expandedMockId === m.id && (
                                        <div className="px-4 pb-4 space-y-4 border-t border-zinc-700/50">
                                            <div className="grid grid-cols-4 gap-2 pt-4">
                                                {Object.entries(m.breakdown).map(([k, v]) => (
                                                    <div key={k} className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-700/40 text-center">
                                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">{k}</p>
                                                        <p className="text-sm font-bold text-white">{v}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
                                                <p className="text-[11px] text-zinc-500 mb-1 font-semibold uppercase tracking-wider">Examiner Notes</p>
                                                <p className="text-xs text-zinc-300 italic">"{m.examinerNotes}"</p>
                                            </div>
                                            <button className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors">
                                                <DownloadIcon className="w-3.5 h-3.5" />
                                                Download Scorecard PDF
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CARD 5: Target University & Visa Goals */}
                    <div className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-zinc-700/80 transition-all duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <AcademicCapIcon className="w-4 h-4 text-blue-400" />
                                Target University & Visa Goals
                            </h2>
                            <PrivacyToggle cardKey="university" />
                        </div>
                        <div className="flex items-start gap-4 mb-5">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                                <AcademicCapIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">{targetUniversity.institution}</h3>
                                <p className="text-xs text-zinc-500">{targetUniversity.degree}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Required Overall Band</p>
                                <p className="text-lg font-bold text-white">{targetUniversity.requiredBand}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Minimum Writing Band</p>
                                <p className="text-lg font-bold text-white">{targetUniversity.minWritingBand}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Target Date</p>
                                <p className="text-sm font-bold text-white">{targetUniversity.targetDate}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Visa Readiness</p>
                                <p className="text-lg font-bold text-emerald-400">{targetUniversity.readinessPercentage}%</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-zinc-400">Overall Readiness</span>
                                <span className="text-xs font-bold text-emerald-400">{targetUniversity.readinessPercentage}%</span>
                            </div>
                            <ProgressFill percent={targetUniversity.readinessPercentage} color="from-blue-500 to-cyan-400" />
                        </div>
                    </div>

                    {/* CARD 6: Verified Certificates & Digital Assets */}
                    <div className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-zinc-700/80 transition-all duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <ShieldCheckMini className="w-4 h-4 text-emerald-400" />
                                Verified Certificates & Digital Assets
                            </h2>
                            <PrivacyToggle cardKey="certificates" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {certificates.map((c) => (
                                <div key={c.id} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-emerald-500/30 transition-all">
                                    <span className="text-lg">{c.icon}</span>
                                    <span className="text-xs font-medium text-zinc-300">{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CARD 7: Practice History & Raw Vault */}
                    <div className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-zinc-700/80 transition-all duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <DocumentIcon className="w-4 h-4 text-zinc-400" />
                                Practice History & Raw Vault
                            </h2>
                            <PrivacyToggle cardKey="vault" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-zinc-500">{vaultItems.length} stored items</span>
                            <button
                                onClick={() => setVaultOpen(!vaultOpen)}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                {vaultOpen ? 'Collapse' : 'Expand'}
                                <ChevronIcon className="w-3.5 h-3.5" open={vaultOpen} />
                            </button>
                        </div>
                        {vaultOpen && (
                            <div className="space-y-2">
                                {vaultItems.map((v) => (
                                    <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-all">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center shrink-0">
                                            {v.type === 'essay' ? (
                                                <DocumentIcon className="w-4 h-4 text-zinc-400" />
                                            ) : (
                                                <MicrophoneIcon className="w-4 h-4 text-zinc-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-zinc-300 truncate">{v.label}</p>
                                            <p className="text-[10px] text-zinc-500">{v.storedAt}</p>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-500 border border-zinc-600 uppercase tracking-wider">
                                            {v.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ SECTION C: BOTTOM GLOBAL FOOTER BAR ═══ */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-between">
                <button
                    onClick={handleResync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-all disabled:opacity-50"
                >
                    <RefreshIcon className="w-3.5 h-3.5" spinning={isSyncing} />
                    {isSyncing ? 'Syncing AI Candidate Metrics...' : 'RE-SYNC AI CANDIDATE METRICS'}
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all"
                >
                    <SaveIcon className="w-3.5 h-3.5" />
                    SAVE PROFILE PRIVACY SETTINGS
                </button>
            </div>

            {/* Toast */}
            {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        </div>
    );
};

export default ProfileWorkspace;

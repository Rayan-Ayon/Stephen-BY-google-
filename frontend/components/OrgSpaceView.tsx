import React, { useState, useMemo, useEffect } from 'react';
import {
    BuildingLibraryIcon, ShieldCheckIcon, BarChartIcon,
    BookOpenIcon, LockClosedIcon, SettingsIcon,
    UsersIcon, DollarIcon, ClockIcon, TrendingUpIcon,
    ChevronDownIcon, CheckCircleIcon, CubeIcon,
    GlobeIcon, DatabaseIcon,
} from './icons';

// ── Types ──

interface StudentTelemetry {
    id: string;
    name: string;
    videos: { watched: number; total: number };
    exams: { done: number; total: number; avg: number; status: string };
    projects: { done: number; total: number; avg: number; status: string };
    questioning: { understanding: number; divergent: number; convergent: number; status: string };
    flashcards: { done: number; total: number; acc: number; status: string };
    quizzes: { done: number; total: number; acc: number; status: string };
    ovrScore: number;
    batch: string;
}

interface NavLeaf { label: string; key: string }

interface NavGroup {
    label: string;
    icon: React.ReactNode;
    key: string;
    subItems?: NavLeaf[];
    isLeaf?: boolean;
    leafKey?: string;
}

interface EvaluationItem {
    id: string;
    candidateName: string;
    batch: string;
    module: string;
    type: 'essay' | 'speaking';
    submission: string;
    aiScores: { label: string; value: number }[];
    aiFlags: string[];
    status: 'pending' | 'approved' | 'requeued';
}

interface Toast { id: number; msg: string; }

// ── Data ──

const navGroups: NavGroup[] = [
    { label: 'Workspace Overview', icon: <BuildingLibraryIcon className="w-4 h-4" />, key: 'overview', isLeaf: true, leafKey: 'overview_main' },
    {
        label: 'Cohort Telemetry', icon: <BarChartIcon className="w-4 h-4" />, key: 'telemetry',
        subItems: [
            { label: 'Daily Engagements', key: 'daily_engagements' },
            { label: 'Performance Analytics', key: 'performance_analytics' },
        ],
    },
    {
        label: 'Curriculum Assets', icon: <BookOpenIcon className="w-4 h-4" />, key: 'curriculum',
        subItems: [
            { label: 'Course Deployment', key: 'course_deployment' },
            { label: 'Institute Knowledge Base', key: 'vector_repos' },
        ],
    },
    {
        label: 'Identity & Seats', icon: <LockClosedIcon className="w-4 h-4" />, key: 'identity',
        subItems: [
            { label: 'License Allocation', key: 'license_seats' },
            { label: 'LMS & Portal Bridges', key: 'sso_gateways' },
        ],
    },
    { label: 'Node Settings', icon: <SettingsIcon className="w-4 h-4" />, key: 'settings', isLeaf: true, leafKey: 'node_settings' },
];

const students: StudentTelemetry[] = [
    { id: 'S-TB29', name: 'Ayon', batch: 'EXEC-BATCH-B', videos: { watched: 572, total: 601 }, exams: { done: 7, total: 10, avg: 6.5, status: 'Good' }, projects: { done: 2, total: 7, avg: 6.0, status: 'Fair' }, questioning: { understanding: 7, divergent: 4, convergent: 6, status: 'Fair' }, flashcards: { done: 1, total: 10, acc: 84, status: 'Fair' }, quizzes: { done: 8, total: 10, acc: 73, status: 'Good' }, ovrScore: 5.5 },
    { id: 'S-TB20', name: 'Farhan', batch: 'EXEC-BATCH-A', videos: { watched: 601, total: 601 }, exams: { done: 9, total: 10, avg: 8.2, status: 'Excellent' }, projects: { done: 6, total: 7, avg: 8.5, status: 'Excellent' }, questioning: { understanding: 9, divergent: 8, convergent: 8, status: 'Excellent' }, flashcards: { done: 9, total: 10, acc: 96, status: 'Excellent' }, quizzes: { done: 10, total: 10, acc: 91, status: 'Excellent' }, ovrScore: 8.8 },
    { id: 'S-TB21', name: 'Tanvir', batch: 'EXEC-BATCH-B', videos: { watched: 489, total: 601 }, exams: { done: 6, total: 10, avg: 5.8, status: 'Good' }, projects: { done: 4, total: 7, avg: 7.2, status: 'Good' }, questioning: { understanding: 6, divergent: 5, convergent: 5, status: 'Good' }, flashcards: { done: 5, total: 10, acc: 72, status: 'Good' }, quizzes: { done: 7, total: 10, acc: 68, status: 'Fair' }, ovrScore: 6.2 },
    { id: 'S-TB22', name: 'Nafisa', batch: 'EXEC-BATCH-B', videos: { watched: 534, total: 601 }, exams: { done: 10, total: 10, avg: 9.1, status: 'Excellent' }, projects: { done: 7, total: 7, avg: 9.3, status: 'Excellent' }, questioning: { understanding: 8, divergent: 7, convergent: 9, status: 'Excellent' }, flashcards: { done: 8, total: 10, acc: 93, status: 'Excellent' }, quizzes: { done: 9, total: 10, acc: 88, status: 'Excellent' }, ovrScore: 9.0 },
    { id: 'S-TB23', name: 'Rahim', batch: 'EXEC-BATCH-A', videos: { watched: 412, total: 601 }, exams: { done: 5, total: 10, avg: 4.2, status: 'Fair' }, projects: { done: 3, total: 7, avg: 5.5, status: 'Fair' }, questioning: { understanding: 5, divergent: 3, convergent: 4, status: 'Fair' }, flashcards: { done: 3, total: 10, acc: 61, status: 'Fair' }, quizzes: { done: 4, total: 10, acc: 55, status: 'Low' }, ovrScore: 4.1 },
    { id: 'S-TB24', name: 'Jarin', batch: 'EXEC-BATCH-A', videos: { watched: 378, total: 601 }, exams: { done: 8, total: 10, avg: 7.5, status: 'Good' }, projects: { done: 5, total: 7, avg: 7.8, status: 'Good' }, questioning: { understanding: 7, divergent: 6, convergent: 6, status: 'Good' }, flashcards: { done: 6, total: 10, acc: 79, status: 'Good' }, quizzes: { done: 7, total: 10, acc: 76, status: 'Good' }, ovrScore: 6.9 },
    { id: 'S-TB25', name: 'Shakib', batch: 'EXEC-BATCH-A', videos: { watched: 301, total: 601 }, exams: { done: 4, total: 10, avg: 3.5, status: 'Low' }, projects: { done: 1, total: 7, avg: 4.0, status: 'Low' }, questioning: { understanding: 3, divergent: 2, convergent: 3, status: 'Low' }, flashcards: { done: 2, total: 10, acc: 45, status: 'Low' }, quizzes: { done: 3, total: 10, acc: 42, status: 'Low' }, ovrScore: 2.8 },
    { id: 'S-TB26', name: 'Mim', batch: 'EXEC-BATCH-B', videos: { watched: 546, total: 601 }, exams: { done: 8, total: 10, avg: 7.8, status: 'Good' }, projects: { done: 5, total: 7, avg: 7.5, status: 'Good' }, questioning: { understanding: 8, divergent: 6, convergent: 7, status: 'Good' }, flashcards: { done: 7, total: 10, acc: 86, status: 'Good' }, quizzes: { done: 8, total: 10, acc: 81, status: 'Good' }, ovrScore: 7.2 },
    { id: 'S-TB27', name: 'Hasan', batch: 'EXEC-BATCH-B', videos: { watched: 445, total: 601 }, exams: { done: 6, total: 10, avg: 5.2, status: 'Fair' }, projects: { done: 3, total: 7, avg: 5.8, status: 'Fair' }, questioning: { understanding: 5, divergent: 4, convergent: 5, status: 'Fair' }, flashcards: { done: 4, total: 10, acc: 68, status: 'Fair' }, quizzes: { done: 5, total: 10, acc: 62, status: 'Fair' }, ovrScore: 4.8 },
    { id: 'S-TB28', name: 'Nusrat', batch: 'EXEC-BATCH-B', videos: { watched: 510, total: 601 }, exams: { done: 7, total: 10, avg: 6.8, status: 'Good' }, projects: { done: 4, total: 7, avg: 6.5, status: 'Good' }, questioning: { understanding: 6, divergent: 5, convergent: 6, status: 'Good' }, flashcards: { done: 5, total: 10, acc: 75, status: 'Good' }, quizzes: { done: 6, total: 10, acc: 71, status: 'Good' }, ovrScore: 6.0 },
    { id: 'S-TB30', name: 'Tariq', batch: 'EXEC-BATCH-B', videos: { watched: 388, total: 601 }, exams: { done: 5, total: 10, avg: 4.8, status: 'Fair' }, projects: { done: 2, total: 7, avg: 5.0, status: 'Fair' }, questioning: { understanding: 4, divergent: 3, convergent: 4, status: 'Fair' }, flashcards: { done: 3, total: 10, acc: 58, status: 'Fair' }, quizzes: { done: 4, total: 10, acc: 59, status: 'Fair' }, ovrScore: 4.0 },
    { id: 'S-TB31', name: 'Sadia', batch: 'EXEC-BATCH-C', videos: { watched: 562, total: 601 }, exams: { done: 9, total: 10, avg: 8.5, status: 'Excellent' }, projects: { done: 6, total: 7, avg: 8.2, status: 'Excellent' }, questioning: { understanding: 9, divergent: 7, convergent: 8, status: 'Excellent' }, flashcards: { done: 8, total: 10, acc: 91, status: 'Excellent' }, quizzes: { done: 9, total: 10, acc: 87, status: 'Excellent' }, ovrScore: 8.5 },
    { id: 'S-TB32', name: 'Zubair', batch: 'EXEC-BATCH-C', videos: { watched: 267, total: 601 }, exams: { done: 3, total: 10, avg: 3.0, status: 'Low' }, projects: { done: 1, total: 7, avg: 3.5, status: 'Low' }, questioning: { understanding: 2, divergent: 2, convergent: 2, status: 'Low' }, flashcards: { done: 1, total: 10, acc: 38, status: 'Low' }, quizzes: { done: 2, total: 10, acc: 35, status: 'Low' }, ovrScore: 2.2 },
    { id: 'S-TB33', name: 'Fahim', batch: 'EXEC-BATCH-C', videos: { watched: 475, total: 601 }, exams: { done: 7, total: 10, avg: 6.2, status: 'Good' }, projects: { done: 4, total: 7, avg: 6.8, status: 'Good' }, questioning: { understanding: 6, divergent: 5, convergent: 5, status: 'Good' }, flashcards: { done: 4, total: 10, acc: 71, status: 'Good' }, quizzes: { done: 6, total: 10, acc: 67, status: 'Fair' }, ovrScore: 5.8 },
    { id: 'S-TB34', name: 'Labiba', batch: 'EXEC-BATCH-C', videos: { watched: 523, total: 601 }, exams: { done: 8, total: 10, avg: 7.2, status: 'Good' }, projects: { done: 5, total: 7, avg: 7.0, status: 'Good' }, questioning: { understanding: 7, divergent: 6, convergent: 7, status: 'Good' }, flashcards: { done: 6, total: 10, acc: 82, status: 'Good' }, quizzes: { done: 7, total: 10, acc: 78, status: 'Good' }, ovrScore: 6.8 },
    { id: 'S-TB35', name: 'Imran', batch: 'EXEC-BATCH-C', videos: { watched: 341, total: 601 }, exams: { done: 4, total: 10, avg: 4.0, status: 'Fair' }, projects: { done: 2, total: 7, avg: 4.5, status: 'Fair' }, questioning: { understanding: 4, divergent: 3, convergent: 3, status: 'Fair' }, flashcards: { done: 2, total: 10, acc: 52, status: 'Fair' }, quizzes: { done: 3, total: 10, acc: 48, status: 'Low' }, ovrScore: 3.5 },
    { id: 'S-TB36', name: 'Maliha', batch: 'EXEC-BATCH-C', videos: { watched: 497, total: 601 }, exams: { done: 6, total: 10, avg: 5.5, status: 'Good' }, projects: { done: 3, total: 7, avg: 5.2, status: 'Fair' }, questioning: { understanding: 5, divergent: 4, convergent: 5, status: 'Fair' }, flashcards: { done: 4, total: 10, acc: 65, status: 'Fair' }, quizzes: { done: 5, total: 10, acc: 63, status: 'Fair' }, ovrScore: 5.0 },
    { id: 'S-TB37', name: 'Rakib', batch: 'EXEC-BATCH-C', videos: { watched: 248, total: 601 }, exams: { done: 2, total: 10, avg: 2.5, status: 'Low' }, projects: { done: 0, total: 7, avg: 0, status: 'Low' }, questioning: { understanding: 2, divergent: 1, convergent: 2, status: 'Low' }, flashcards: { done: 0, total: 10, acc: 0, status: 'Low' }, quizzes: { done: 1, total: 10, acc: 28, status: 'Low' }, ovrScore: 1.5 },
    { id: 'S-TB38', name: 'Sumaiya', batch: 'EXEC-BATCH-C', videos: { watched: 436, total: 601 }, exams: { done: 5, total: 10, avg: 5.0, status: 'Fair' }, projects: { done: 3, total: 7, avg: 5.5, status: 'Fair' }, questioning: { understanding: 5, divergent: 4, convergent: 4, status: 'Fair' }, flashcards: { done: 3, total: 10, acc: 62, status: 'Fair' }, quizzes: { done: 4, total: 10, acc: 58, status: 'Fair' }, ovrScore: 4.5 },
    { id: 'S-TB39', name: 'Arif', batch: 'EXEC-BATCH-C', videos: { watched: 320, total: 601 }, exams: { done: 4, total: 10, avg: 3.8, status: 'Low' }, projects: { done: 1, total: 7, avg: 3.0, status: 'Low' }, questioning: { understanding: 3, divergent: 2, convergent: 3, status: 'Low' }, flashcards: { done: 1, total: 10, acc: 42, status: 'Low' }, quizzes: { done: 2, total: 10, acc: 38, status: 'Low' }, ovrScore: 2.5 },
];

const engagementTabs = ['Videos', 'Flashcards', 'Quizzes', 'Exams', 'Speaking Drills'];

const licenseAudit = [
    'Farmgate Branch requested 150 additional student seats — Approved by Admin Ayon.',
    'Uttara Branch instructor pool expanded by 4 — Auto-provisioned via quota override.',
    'Monthly renewal cycle auto-invoiced — 1,420 seats synced within 12 minutes.',
    'Cambridge 18 Mock Batch license renewal — $4,200 invoiced for Q3 2026 cycle.',
];

const btnBase = 'w-full flex items-center justify-between text-xs px-3 py-1.5 rounded-md transition-all text-neutral-400 hover:text-white hover:bg-neutral-900';

// ── New subview data ──

const overviewMetrics = [
    { label: 'Total Enrolled Candidates', value: '1,420', subtext: 'Active Seats' },
    { label: 'Active Batch Band Average', value: 'Band 6.5', subtext: 'Target 7.5 // Growth +0.5' },
    { label: 'Pending Essay & Speaking Evaluations', value: '18', subtext: 'Teacher Sign-off Required' },
];

const infrastructureTasks = [
    'Writing Task 2 drops ingested — 64 essays auto-graded',
    'Speaking recordings queued — 38 candidate audio files pending',
    'Cambridge 18 Mock #3 pushed — 1,420 candidates notified',
    'AI Writing Grader processed — 84 essays flagged for review',
    'Batch Sync complete — 420 student logs reconciled',
];

const riskProfiles = [
    { rank: 1, name: 'Tanvir', id: 'EXEC-BATCH-B', hours: '489 min', deficiency: 'Writing Task 2 (GRA 5.0)', status: '[Assign Grammar Drill]' },
    { rank: 2, name: 'Rahim', id: 'EXEC-BATCH-A', hours: '412 min', deficiency: 'Listening Part 4 Spelling', status: '[Send Voice Feedback]' },
    { rank: 3, name: 'Imran', id: 'EXEC-BATCH-C', hours: '341 min', deficiency: 'Speaking Hesitation (8/min)', status: '[Schedule 1-on-1]' },
];

const skillDomains = [
    { label: 'Writing Task 2 Coherence & Cohesion', pct: 58 },
    { label: 'Reading True / False / Not Given', pct: 71 },
    { label: 'Listening Part 3 Multiple Choice', pct: 84 },
];

const courseModules = [
    { name: 'Cambridge 18 Academic Writing 1', sync: 92, seats: '1,420', route: '/ielts/writing/c18-w1', live: false },
    { name: 'Speaking Cue Card Master Drill #4', sync: 100, seats: '1,110', route: '/ielts/speaking/cue-4', live: true },
];

const vectorDocs = [
    { file: 'Cambridge_18_Official_Answers.pdf', chunks: '1,420 Items', model: 'IELTS-Eval-v4', status: 'Encrypted & Mapped' },
    { file: 'Writing_Task2_Band9_Templates.json', chunks: '890 Prompts', model: 'IELTS-Eval-v4', status: 'Active Context Room' },
];

const identityProviders = [
    { name: 'Google Classroom LMS Bridge', accounts: '1,420', status: 'Active Synchronized Tunnel', token: '24h' },
    { name: 'Microsoft Entra ID SSO Gateway', accounts: '12', status: 'Active Synchronized Tunnel', provisioning: 'Active' },
];

const buildEval = (name: string, batch: string, module: string, type: 'essay' | 'speaking', idx: number): EvaluationItem => {
    const scores = type === 'essay'
        ? [{ label: 'TR', value: 5.5 }, { label: 'CC', value: 5.0 }, { label: 'LR', value: 5.5 }, { label: 'GRA', value: 5.0 }]
        : [{ label: 'FC', value: 5.0 }, { label: 'LR', value: 5.5 }, { label: 'P', value: 4.5 }, { label: 'G', value: 5.0 }];
    const aiFlags = type === 'essay'
        ? ['+ Adequate Task Response', '- Inadequate Paragraphing', '- Recurrent Grammar Errors']
        : ['+ Clear Pronunciation', '- Frequent Filler Words', '- Long Pauses >2.5s'];
    const submission = type === 'essay'
        ? `${name} submitted a ${module} response addressing the prompt with moderate development and noticeable grammatical inaccuracies across paragraphs.`
        : `${name} delivered a ${module} monologue with uneven fluency, several hesitations, and limited lexical range throughout.`;
    return { id: `EV-${idx.toString().padStart(2, '0')}`, candidateName: name, batch, module, type, submission, aiScores: scores, aiFlags, status: 'pending' };
};

const seedEvaluations: EvaluationItem[] = [
    ['Tanvir', 'EXEC-BATCH-B', 'Writing Task 2', 'essay'],
    ['Rahim', 'EXEC-BATCH-A', 'Writing Task 2', 'essay'],
    ['Imran', 'EXEC-BATCH-C', 'Speaking Part 2', 'speaking'],
    ['Shakib', 'EXEC-BATCH-A', 'Writing Task 2', 'essay'],
    ['Zubair', 'EXEC-BATCH-C', 'Speaking Part 3', 'speaking'],
    ['Rakib', 'EXEC-BATCH-C', 'Writing Task 2', 'essay'],
    ['Arif', 'EXEC-BATCH-C', 'Speaking Part 2', 'speaking'],
    ['Hasan', 'EXEC-BATCH-B', 'Writing Task 2', 'essay'],
    ['Tariq', 'EXEC-BATCH-B', 'Speaking Part 3', 'speaking'],
    ['Sumaiya', 'EXEC-BATCH-C', 'Writing Task 2', 'essay'],
    ['Maliha', 'EXEC-BATCH-C', 'Speaking Part 2', 'speaking'],
    ['Ayon', 'EXEC-BATCH-B', 'Writing Task 2', 'essay'],
    ['Nusrat', 'EXEC-BATCH-B', 'Speaking Part 3', 'speaking'],
    ['Farhan', 'EXEC-BATCH-A', 'Writing Task 2', 'essay'],
    ['Nafisa', 'EXEC-BATCH-B', 'Speaking Part 2', 'speaking'],
    ['Jarin', 'EXEC-BATCH-A', 'Writing Task 2', 'essay'],
    ['Sadia', 'EXEC-BATCH-C', 'Speaking Part 3', 'speaking'],
    ['Labiba', 'EXEC-BATCH-C', 'Writing Task 2', 'essay'],
].map((spec, i) => buildEval(spec[0], spec[1], spec[2], spec[3] as 'essay' | 'speaking', i + 1));

// ── Helpers ──

const getTabMetric = (s: StudentTelemetry, tab: string): number => {
    switch (tab) {
        case 'Videos': return s.videos.watched;
        case 'Flashcards': return s.flashcards.acc;
        case 'Quizzes': return s.quizzes.acc;
        case 'Exams': return s.exams.avg;
        case 'Speaking Drills': return s.questioning.understanding + s.questioning.divergent + s.questioning.convergent;
        default: return 0;
    }
};

const getTabLabel = (s: StudentTelemetry, tab: string): string => {
    switch (tab) {
        case 'Videos': return `${s.videos.watched} / ${s.videos.total} min`;
        case 'Flashcards': return `${s.flashcards.acc}%`;
        case 'Quizzes': return `${s.quizzes.acc}%`;
        case 'Exams': return `${s.exams.avg} / 10`;
        case 'Speaking Drills': return `${s.questioning.understanding + s.questioning.divergent + s.questioning.convergent}`;
        default: return '';
    }
};

const trajectoryColor = (s: StudentTelemetry): string => {
    if (s.ovrScore >= 7) return 'text-emerald-400';
    if (s.ovrScore >= 5) return 'text-neutral-300';
    if (s.ovrScore >= 3) return 'text-amber-400';
    return 'text-red-400';
};

const trajectoryLabel = (s: StudentTelemetry): string => {
    if (s.ovrScore >= 7) return 'Excellent';
    if (s.ovrScore >= 5) return 'Good';
    if (s.ovrScore >= 3) return 'Fair';
    return 'Low';
};

// ── Module-scope UI components (props-driven) ──

let toastSeq = 0;

const ToastStack: React.FC<{ toasts: Toast[] }> = ({ toasts }) => (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 w-80">
        {toasts.map(t => (
            <div key={t.id} className="bg-[#0a0a0a] border border-emerald-500/40 rounded-lg px-4 py-3 text-xs shadow-2xl flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                <span className="text-neutral-200">{t.msg}</span>
            </div>
        ))}
    </div>
);

const VoiceNoteSim: React.FC = () => {
    const [rec, setRec] = useState(false);
    const [done, setDone] = useState(false);
    const toggle = () => {
        if (rec) { setRec(false); setDone(true); }
        else { setRec(true); setDone(false); }
    };
    return (
        <div className="mb-4 bg-[#050505] border border-neutral-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Teacher Voice Note</p>
                <button onClick={toggle} className={`text-[10px] font-medium px-2 py-0.5 rounded border ${rec ? 'text-red-400 border-red-500/40 bg-red-500/10 animate-pulse' : 'text-neutral-400 border-neutral-800 hover:text-white'}`}>
                    {rec ? '● Recording' : done ? '↻ Re-record' : '● Record 15s'}
                </button>
            </div>
            <div className="h-8 flex items-center gap-[2px]">
                {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} className={`w-1 rounded-sm ${done || rec ? 'bg-emerald-500/70' : 'bg-neutral-800'}`} style={{ height: done ? `${20 + Math.abs(Math.sin(i)) * 60}%` : '20%' }} />
                ))}
            </div>
        </div>
    );
};

const WaveformStudio: React.FC<{
    scores: { label: string; value: number }[];
    onScoreChange: (label: string, value: number) => void;
}> = ({ scores, onScoreChange }) => {
    const [speed, setSpeed] = useState(1.0);
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const bars = useMemo(() => {
        let seed = 7;
        const arr: number[] = [];
        for (let i = 0; i < 72; i++) {
            seed = (seed * 1103515245 + 12345) % 2147483648;
            arr.push(0.15 + (seed / 2147483648) * 0.85);
        }
        return arr;
    }, []);
    const flagKind = (i: number): 'pause' | 'filler' | 'mispron' | null => {
        if (bars[i] < 0.24) return 'pause';
        if (i % 19 === 0) return 'filler';
        if (i % 29 === 0) return 'mispron';
        return null;
    };
    const flagColor = (k: string) => k === 'pause' ? 'bg-amber-400' : k === 'filler' ? 'bg-cyan-400' : 'bg-red-400';
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Speaking Waveform Review Studio</p>
                <div className="flex items-center gap-1">
                    {speeds.map(s => (
                        <button key={s} onClick={() => setSpeed(s)}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded ${speed === s ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-neutral-500 hover:text-white border border-neutral-800'}`}>
                            {s}×
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-end gap-[2px] h-24 bg-[#050505] border border-neutral-800 rounded-lg p-3 overflow-hidden">
                {bars.map((b, i) => {
                    const k = flagKind(i);
                    return (
                        <div key={i} title={k ?? ''} className={`flex-1 rounded-sm ${k ? flagColor(k) : 'bg-neutral-600'}`} style={{ height: `${b * 100}%` }} />
                    );
                })}
            </div>
            <div className="flex flex-wrap gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 bg-amber-400 rounded-sm" />Pause &gt;2.5s</span>
                <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 bg-cyan-400 rounded-sm" />Filler Word</span>
                <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 bg-red-400 rounded-sm" />Mispronunciation</span>
            </div>
            <div className="space-y-3">
                {scores.map(sc => (
                    <div key={sc.label}>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-neutral-400">{sc.label}</span>
                            <span className="text-white font-mono">{sc.value.toFixed(1)}</span>
                        </div>
                        <input type="range" min={0} max={9} step={0.5} value={sc.value}
                            onChange={e => onScoreChange(sc.label, parseFloat(e.target.value))}
                            className="w-full accent-emerald-500" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const EvaluationQueue: React.FC<{
    items: EvaluationItem[];
    setItems: React.Dispatch<React.SetStateAction<EvaluationItem[]>>;
    setAuditLogs: React.Dispatch<React.SetStateAction<string[]>>;
    pushToast: (m: string) => void;
}> = ({ items, setItems, setAuditLogs, pushToast }) => {
    const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? '');
    const selected = items.find(i => i.id === selectedId) ?? items[0];
    const pending = items.filter(i => i.status === 'pending');
    const [scoreDraft, setScoreDraft] = useState<{ label: string; value: number }[]>(selected?.aiScores ?? []);

    useEffect(() => {
        setScoreDraft(selected?.aiScores ?? []);
    }, [selectedId]);

    if (!selected) return <p className="text-sm text-neutral-500">No evaluations in queue.</p>;

    const onScoreChange = (label: string, value: number) => {
        setScoreDraft(prev => prev.map(s => s.label === label ? { ...s, value } : s));
    };
    const handleApprove = () => {
        setItems(prev => prev.map(i => i.id === selected.id ? { ...i, status: 'approved', aiScores: scoreDraft } : i));
        setAuditLogs(prev => [`Teacher approved & released score for ${selected.candidateName} (${selected.batch}) — ${new Date().toLocaleTimeString()}`, ...prev]);
        pushToast(`Score released for ${selected.candidateName}`);
        const next = pending.find(p => p.id !== selected.id);
        setSelectedId(next ? next.id : selected.id);
    };
    const handleReject = () => {
        setItems(prev => prev.map(i => i.id === selected.id ? { ...i, status: 'requeued' } : i));
        setAuditLogs(prev => [`Submission re-queued for ${selected.candidateName} (${selected.batch}) — ${new Date().toLocaleTimeString()}`, ...prev]);
        pushToast(`Submission re-queued for ${selected.candidateName}`);
        const next = pending.find(p => p.id !== selected.id);
        setSelectedId(next ? next.id : selected.id);
    };

    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 bg-[#0a0a0a] border border-neutral-800 rounded-xl p-3 max-h-[70vh] overflow-y-auto">
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-3">Pending Submissions ({pending.length})</p>
                <div className="space-y-1">
                    {pending.map(p => (
                        <button key={p.id} onClick={() => setSelectedId(p.id)}
                            className={`w-full text-left text-xs px-3 py-2 rounded-md transition-all ${selectedId === p.id ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-900'}`}>
                            <span className="block font-medium">{p.candidateName}</span>
                            <span className="block text-[10px] text-neutral-500 font-mono">{p.batch} · {p.type === 'speaking' ? 'Speaking' : 'Essay'}</span>
                        </button>
                    ))}
                    {pending.length === 0 && <p className="text-[11px] text-neutral-600 px-1">Queue cleared.</p>}
                </div>
            </div>
            <div className="col-span-5 bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-white">{selected.candidateName} <span className="text-neutral-500 font-mono text-xs">// {selected.batch}</span></p>
                    <span className="text-[10px] font-mono text-neutral-500">{selected.module}</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Candidate Submission</p>
                <div className="text-xs text-neutral-300 leading-relaxed bg-[#050505] border border-neutral-800 rounded-lg p-4 whitespace-pre-wrap">
                    {selected.submission}
                </div>
                {selected.type === 'speaking' && (
                    <div className="mt-4">
                        <WaveformStudio scores={scoreDraft} onScoreChange={onScoreChange} />
                    </div>
                )}
            </div>
            <div className="col-span-4 bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 overflow-y-auto max-h-[70vh]">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-3">AI Pre-Assessment</p>
                <div className="space-y-3 mb-4">
                    {scoreDraft.map(sc => (
                        <div key={sc.label}>
                            <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="text-neutral-400">{sc.label}</span>
                                <span className="text-white font-mono">{sc.value.toFixed(1)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${(sc.value / 9) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">AI Flags</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {selected.aiFlags.map((f, i) => (
                        <span key={i} className={`text-[10px] font-medium px-2 py-0.5 rounded border ${f.startsWith('+') ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 'text-red-400 border-red-500/30 bg-red-500/5'}`}>{f}</span>
                    ))}
                </div>
                <VoiceNoteSim />
                <div className="mt-5 space-y-2">
                    <button onClick={handleReject} className="w-full text-xs font-medium py-2.5 rounded-md border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all">[Reject & Re-queue]</button>
                    <button onClick={handleApprove} className="w-full text-xs font-medium py-2.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all">[Approve & Release Score]</button>
                </div>
            </div>
        </div>
    );
};

const HomeworkDispatchModal: React.FC<{
    open: boolean; student: { name: string; id: string; deficiency: string } | null;
    onClose: () => void; pushToast: (m: string) => void;
}> = ({ open, student, onClose, pushToast }) => {
    if (!open || !student) return null;
    const weakDefault = student.deficiency.includes('GRA') ? 'Grammatical Range & Accuracy'
        : student.deficiency.includes('Spelling') ? 'Listening Part 4 Spelling'
        : student.deficiency.includes('Hesitation') ? 'Speaking Fluency & Hesitation'
        : 'Coherence & Cohesion';
    const [weak, setWeak] = useState(weakDefault);
    const [target, setTarget] = useState<'individual' | 'batch'>('individual');
    const [ctype, setCtype] = useState('10-Min Micro-Drill');
    return (
        <div className="fixed inset-0 z-[150] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-semibold text-white">Remedial Homework Dispatcher</h3>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white text-xs">✕ Close</button>
                </div>
                <p className="text-xs text-neutral-400 mb-4">Target Candidate: <span className="text-white font-medium">{student.name}</span> <span className="font-mono text-neutral-500">// {student.id}</span></p>
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Auto-Identified Weak Sub-Skill</p>
                        <select value={weak} onChange={e => setWeak(e.target.value)} className="bg-[#050505] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 w-full outline-none">
                            <option>{weakDefault}</option>
                            <option>Coherence & Cohesion</option>
                            <option>Lexical Resource</option>
                            <option>Pronunciation</option>
                            <option>Listening Part 4 Spelling</option>
                        </select>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Target Scope</p>
                        <div className="flex gap-2">
                            <button onClick={() => setTarget('individual')} className={`flex-1 text-xs py-2 rounded-md border ${target === 'individual' ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : 'border-neutral-800 text-neutral-400'}`}>Individual ({student.name})</button>
                            <button onClick={() => setTarget('batch')} className={`flex-1 text-xs py-2 rounded-md border ${target === 'batch' ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' : 'border-neutral-800 text-neutral-400'}`}>Whole Batch ({student.id})</button>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-2">Content Type</p>
                        <select value={ctype} onChange={e => setCtype(e.target.value)} className="bg-[#050505] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 w-full outline-none">
                            <option>10-Min Micro-Drill</option>
                            <option>Cue Card Audio Practice</option>
                            <option>Writing Task 2 Model Essay Analysis</option>
                        </select>
                    </div>
                </div>
                <button onClick={() => { onClose(); pushToast('Drill successfully assigned and pushed to candidate mobile app'); }} className="mt-6 w-full text-xs font-medium py-2.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 transition-all">
                    [Push Drill to Student App]
                </button>
            </div>
        </div>
    );
};

const ReportModal: React.FC<{
    open: boolean; studentId: string | null; students: StudentTelemetry[];
    onClose: () => void; pushToast: (m: string) => void;
}> = ({ open, studentId, students, onClose, pushToast }) => {
    if (!open || !studentId) return null;
    const s = students.find(x => x.id === studentId);
    if (!s) return null;
    return (
        <div className="fixed inset-0 z-[150] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white text-black rounded-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="border-b-2 border-black pb-3 mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold tracking-tight">FARMGATE BRANCH COMMAND CENTER</p>
                        <p className="text-[10px] font-medium uppercase tracking-wider">// IELTS AI Node</p>
                    </div>
                    <div className="text-[10px] font-bold border-2 border-green-700 text-green-700 px-2 py-1 rounded rotate-[-8deg]">VERIFIED</div>
                </div>
                <p className="text-xs font-semibold mb-3">Candidate Progress Report: {s.name} <span className="font-mono text-neutral-500">// {s.id}</span></p>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div className="bg-neutral-100 rounded p-2"><p className="text-[10px] uppercase text-neutral-500">Band Average</p><p className="font-bold text-lg">Band {s.ovrScore.toFixed(1)}</p></div>
                    <div className="bg-neutral-100 rounded p-2"><p className="text-[10px] uppercase text-neutral-500">Practice Velocity</p><p className="font-bold text-lg">{s.videos.watched} min/wk</p></div>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Skill Weakness Heatmap</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {[{ l: 'Writing', v: s.projects.avg }, { l: 'Exams', v: s.exams.avg }, { l: 'Speaking', v: (s.questioning.understanding + s.questioning.divergent + s.questioning.convergent) }, { l: 'Quizzes', v: s.quizzes.acc }].map(x => (
                        <div key={x.l} className="bg-neutral-100 rounded p-2">
                            <div className="flex justify-between text-[10px]"><span>{x.l}</span><span className="font-mono">{x.v}</span></div>
                            <div className="w-full h-1.5 bg-neutral-300 rounded-full overflow-hidden mt-1"><div className="h-full bg-emerald-600" style={{ width: `${Math.min(100, (x.v / 10) * 100)}%` }} /></div>
                        </div>
                    ))}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Teacher Feedback</p>
                <p className="text-xs bg-neutral-100 rounded p-2 mb-4">{s.ovrScore >= 7 ? 'Excellent trajectory — maintain current regimen.' : s.ovrScore >= 5 ? 'Steady progress — increase Writing Task 2 output.' : 'High intervention required — daily micro-drills advised.'}</p>
                <div className="flex gap-2">
                    <button onClick={() => { onClose(); pushToast('Official PDF downloaded'); }} className="flex-1 text-xs font-medium py-2 rounded-md bg-black text-white">[Download Official PDF]</button>
                    <button onClick={() => { onClose(); pushToast('Progress report sent to parent via WhatsApp'); }} className="flex-1 text-xs font-medium py-2 rounded-md border border-black">[Send to WhatsApp / Parent]</button>
                </div>
            </div>
        </div>
    );
};

const BatchForecastWidget: React.FC = () => {
    const batches = ['EXEC-BATCH-A', 'EXEC-BATCH-B', 'EXEC-BATCH-C'];
    const data = useMemo(() => batches.map(b => {
        const members = students.filter(s => s.batch === b);
        const avg = members.reduce((a, s) => a + s.ovrScore, 0) / (members.length || 1);
        const prob = Math.max(8, Math.min(95, Math.round((avg / 7) * 100 + (members.filter(s => s.ovrScore >= 7).length / (members.length || 1)) * 15)));
        const bottleneck = avg >= 7 ? 'Lexical precision at Band 8 threshold' : avg >= 5 ? 'Coherence & Cohesion in Task 2 capping growth −0.5 Band' : 'Foundational Grammar blocking Band 5 threshold';
        return { batch: b, avg: avg.toFixed(1), prob, bottleneck };
    }), []);
    return (
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">BATCH BAND 7+ PROBABILITY FORECAST ENGINE // TARGET DATE OCT 12, 2026</p>
            <div className="grid grid-cols-3 gap-4">
                {data.map(d => (
                    <div key={d.batch} className="bg-[#050505] border border-neutral-800 rounded-lg p-4">
                        <p className="text-xs font-mono text-neutral-400 mb-2">{d.batch}</p>
                        <p className="text-3xl font-semibold tracking-tight text-white mb-1">{d.prob}%</p>
                        <p className="text-[10px] text-neutral-500 mb-3">probability of Band 7.0+ by target</p>
                        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden mb-3">
                            <div className="h-full rounded-full bg-emerald-500/70" style={{ width: `${d.prob}%` }} />
                        </div>
                        <p className="text-[10px] text-amber-400 leading-relaxed">⚠ {d.bottleneck}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Component ──

const OrgSpaceView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [currentSection, setCurrentSection] = useState('telemetry');
    const [currentSubView, setCurrentSubView] = useState('daily_engagements');
    const [expandedSection, setExpandedSection] = useState<string | null>('telemetry');
    const [engagementTab, setEngagementTab] = useState('Videos');
    const [hoveredProfileId, setHoveredProfileId] = useState<string | null>(null);
    const [activeRole, setActiveRole] = useState<'director' | 'teacher'>('director');
    const [pendingEvaluations, setPendingEvaluations] = useState<EvaluationItem[]>(seedEvaluations);
    const [auditLogs, setAuditLogs] = useState<string[]>(infrastructureTasks);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [dispatchModal, setDispatchModal] = useState<{ open: boolean; student: { name: string; id: string; deficiency: string } | null }>({ open: false, student: null });
    const [reportModal, setReportModal] = useState<{ open: boolean; studentId: string | null }>({ open: false, studentId: null });

    const sortedStudents = useMemo(() => {
        return [...students].sort((a, b) => getTabMetric(b, engagementTab) - getTabMetric(a, engagementTab));
    }, [engagementTab]);

    const handleNavClick = (group: NavGroup) => {
        if (group.isLeaf) {
            setCurrentSection(group.key);
            setCurrentSubView(group.leafKey ?? group.key);
            setExpandedSection(null);
        } else {
            setExpandedSection(prev => (prev === group.key ? null : group.key));
        }
    };

    const handleSubClick = (section: string, subKey: string) => {
        setCurrentSection(section);
        setCurrentSubView(subKey);
    };

    const activeSub = (key: string) =>
        currentSubView === key
            ? 'bg-neutral-800 text-white font-medium'
            : 'text-neutral-500 hover:text-white';

    const pushToast = (msg: string) => {
        const id = ++toastSeq;
        setToasts(prev => [...prev, { id, msg }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
    };

    const handleRoleChange = (r: 'director' | 'teacher') => {
        setActiveRole(r);
        if (r === 'teacher' && (currentSubView === 'license_seats' || currentSubView === 'node_settings')) {
            setCurrentSubView('overview_main');
        }
    };

    const visibleNavGroups = useMemo(() => {
        const withEval = navGroups.map(g => g.key === 'telemetry'
            ? { ...g, subItems: [...(g.subItems ?? []), { label: 'Evaluation Queue', key: 'evaluation_queue' }] }
            : g);
        if (activeRole === 'director') return withEval;
        return withEval.filter(g => g.key !== 'identity' && g.key !== 'settings');
    }, [activeRole]);

    return (
        <div className="w-full min-h-screen bg-black text-neutral-100 font-sans flex">
            {/* ── Left Sidebar ── */}
            <aside className="w-[260px] shrink-0 border-r border-neutral-800 bg-[#050505] p-4 flex flex-col justify-between">
                <div>
                    <div className="mb-6 px-3">
                        <h1 className="text-sm font-semibold tracking-tight text-white">FARMGATE BRANCH COMMAND CENTER // IELTS AI Node</h1>
                        <div className="mt-2 flex gap-1">
                            <button onClick={() => handleRoleChange('director')} className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border transition-all ${activeRole === 'director' ? 'bg-neutral-800 text-white border-neutral-700' : 'text-neutral-500 border-neutral-800 hover:text-white'}`}>Director</button>
                            <button onClick={() => handleRoleChange('teacher')} className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border transition-all ${activeRole === 'teacher' ? 'bg-neutral-800 text-white border-neutral-700' : 'text-neutral-500 border-neutral-800 hover:text-white'}`}>Teacher</button>
                        </div>
                        <span className="inline-block mt-2 text-[10px] font-medium uppercase tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                            {activeRole === 'director' ? 'TENANT ADMIN' : 'SENIOR TEACHER · EXAMINER'}
                        </span>
                    </div>
                    <nav className="space-y-0.5">
                        {visibleNavGroups.map(group => {
                            const isExpanded = expandedSection === group.key;
                            const isActive = currentSection === group.key;
                            return (
                                <div key={group.key}>
                                    <button
                                        onClick={() => handleNavClick(group)}
                                        className={`${btnBase} ${isActive && group.isLeaf ? 'bg-neutral-800 text-white font-medium' : ''}`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            {group.icon}
                                            {group.label}
                                        </span>
                                        {group.subItems && (
                                            <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                                        )}
                                    </button>
                                    {group.subItems && isExpanded && (
                                        <div className="mt-0.5 space-y-0.5">
                                            {group.subItems.map(sub => (
                                                <button
                                                    key={sub.key}
                                                    onClick={() => handleSubClick(group.key, sub.key)}
                                                    className={`w-full flex items-center justify-between text-left text-xs pl-8 pr-3 py-1.5 rounded-md transition-all ${activeSub(sub.key)}`}
                                                >
                                                    <span>{sub.label}</span>
                                                    {sub.key === 'evaluation_queue' && (
                                                        <span className="text-[9px] font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                                                            {pendingEvaluations.filter(e => e.status === 'pending').length} Pending
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-auto pt-4 border-t border-neutral-900">
                    <button
                        onClick={onExit}
                        className="w-full text-left text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md py-2 px-3 font-medium transition-all"
                    >
                        ← Exit Operational Node
                    </button>
                </div>
            </aside>

            {/* ── Right Viewport ── */}
            <main className="flex-1 p-8 bg-neutral-950 overflow-y-auto">
                {currentSubView === 'daily_engagements' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Institute Daily Engagement Matrix // Practice Time & Band Trajectory
                        </h2>

                        {/* Sub-classification tabs */}
                        <div className="flex gap-1 mb-6">
                            {engagementTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setEngagementTab(tab)}
                                    className={`text-xs font-medium px-3.5 py-2 rounded-lg transition-all ${
                                        engagementTab === tab
                                            ? 'bg-neutral-800 text-white'
                                            : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Leaderboard table */}
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Rank</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Student Identifier</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Batch ID</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Practice Time (Total / Target)</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Performance Trajectory</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedStudents.map((s, i) => (
                                        <tr key={s.id} className="border-b border-neutral-800 last:border-b-0 relative">
                                            <td className="px-5 py-3.5 text-neutral-400 font-mono">{i + 1}</td>
                                            <td
                                                className="px-5 py-3.5 text-white font-medium relative"
                                                onMouseEnter={() => setHoveredProfileId(s.id)}
                                                onMouseLeave={() => setHoveredProfileId(null)}
                                            >
                                                {s.name}
                                                {hoveredProfileId === s.id && (
                                                    <div className="absolute left-0 top-full mt-2 bg-[#0d0d0d] border border-neutral-700 shadow-2xl rounded-xl p-4 w-80 z-50 pointer-events-none">
                                                        <p className="text-xs font-semibold text-white mb-2">
                                                            Candidate Profile Matrix: {s.name} // {s.id}
                                                        </p>
                                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-3">
                                                            OVR Band Score: {s.ovrScore} / 9
                                                        </p>
                                                        <div className="space-y-1.5 text-[11px]">
                                                            <p className="text-neutral-400">
                                                                Exams: {s.exams.done}/{s.exams.total} | Avg: {s.exams.avg} | {s.exams.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Assignments: {s.projects.done}/7 | Avg: {s.projects.avg} | {s.projects.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Speaking: U:{s.questioning.understanding} D:{s.questioning.divergent} C:{s.questioning.convergent} | {s.questioning.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Flashcards: {s.flashcards.done}/{s.flashcards.total} | Acc: {s.flashcards.acc}% | {s.flashcards.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Quizzes: {s.quizzes.done}/{s.quizzes.total} | Acc: {s.quizzes.acc}% | {s.quizzes.status}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-neutral-500 font-mono">{s.batch}</td>
                                            <td className="px-5 py-3.5 text-white font-mono">{getTabLabel(s, engagementTab)}</td>
                                            <td className={`px-5 py-3.5 font-mono ${trajectoryColor(s)}`}>Band {s.ovrScore.toFixed(1)} // {trajectoryLabel(s)}</td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    onClick={() => setReportModal({ open: true, studentId: s.id })}
                                                    className="text-[10px] font-medium text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 rounded px-2 py-1 transition-all"
                                                >
                                                    [Progress Report]
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {currentSubView === 'license_seats' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Infrastructure & Ledger Operations // License Allocation Portal
                        </h2>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                    Total Active Student Seats
                                </p>
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    1,420 / 2,000 Seats Used
                                </p>
                            </div>
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                    Instructor Accounts
                                </p>
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    12 Active Teachers
                                </p>
                            </div>
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                    Next Cycle Invoicing
                                </p>
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    $4,200 / Month
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                            <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">
                                License Provisioning Audit Trail
                            </h3>
                            <div className="space-y-3">
                                {licenseAudit.map((msg, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <ClockIcon className="w-3.5 h-3.5 text-neutral-600 mt-0.5 shrink-0" />
                                        <p className="text-xs text-neutral-400 leading-relaxed">{msg}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {currentSubView === 'overview_main' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Institute Operational Node // System Performance & AI Ingestion
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {overviewMetrics.map(m => (
                                <div key={m.label} className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">{m.label}</p>
                                    <p className="text-2xl font-semibold tracking-tight text-white">{m.value}</p>
                                    {m.subtext && <p className="text-xs text-neutral-400 mt-1 font-mono">{m.subtext}</p>}
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 mb-6">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">INSTITUTE BAND GROWTH TRAJECTORY (24H)</p>
                            <svg viewBox="0 0 600 120" className="w-full h-24">
                                <polyline points="0,90 40,70 80,80 120,40 160,50 200,20 240,35 280,55 320,30 360,45 400,15 440,25 480,50 520,35 560,10 600,30" fill="none" stroke="#555" strokeWidth="1.5" />
                                <polyline points="0,95 40,75 80,85 120,45 160,55 200,25 240,40 280,60 320,35 360,50 400,20 440,30 480,55 520,40 560,15 600,35" fill="none" stroke="#888" strokeWidth="0.8" opacity="0.5" />
                            </svg>
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">INSTITUTE REAL-TIME AUDIT LOG</p>
                            <div className="space-y-2">
                                {auditLogs.map((task, i) => (
                                    <div key={i} className="flex items-start gap-3 py-2 border-b border-neutral-800 last:border-b-0">
                                        <ClockIcon className="w-3.5 h-3.5 text-neutral-600 mt-0.5 shrink-0" />
                                        <p className="text-xs text-neutral-400">{task}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <BatchForecastWidget />

                {currentSubView === 'performance_analytics' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Cohort Operational Engine // Cross-Segment Risk Quadrant
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 mb-6">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-amber-500 mb-4">
                                RISK ISOLATION ANALYSIS (HIGH PRACTICE TIME // LOW OUTPUT YIELD)
                            </p>
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Rank</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Identifier</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">System ID</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Engagement Overhead</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Metric Deficiency</th>
                                        <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Intervention Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riskProfiles.map(r => (
                                        <tr key={r.rank} className="border-b border-neutral-800 last:border-b-0">
                                            <td className="px-4 py-3 text-neutral-400 font-mono">{r.rank}</td>
                                            <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                                            <td className="px-4 py-3 text-neutral-500 font-mono">{r.id}</td>
                                            <td className="px-4 py-3 text-neutral-400">{r.hours}</td>
                                            <td className="px-4 py-3 text-amber-400">{r.deficiency}</td>
                                            <td className="px-4 py-3 font-mono text-[10px] font-semibold">
                                                <button
                                                    onClick={() => setDispatchModal({ open: true, student: { name: r.name, id: r.id, deficiency: r.deficiency } })}
                                                    className={`${r.status.includes('FLAGGED') ? 'text-amber-400' : 'text-orange-400'} border border-current rounded px-2 py-0.5 hover:bg-neutral-800 transition-all`}
                                                >
                                                    {r.status}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">BATCH SKILL DOMAIN MASTERY HEATMAP</p>
                            <div className="grid grid-cols-1 gap-4">
                                {skillDomains.map(d => (
                                    <div key={d.label} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-neutral-400">{d.label}</span>
                                            <span className="text-white font-mono">{d.pct}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-white" style={{ width: `${d.pct}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <BatchForecastWidget />

                {currentSubView === 'course_deployment' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Curriculum Asset Pipeline // Active Exam & Assignment Compilations
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Course Module</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Deploy State</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Enrolled Candidates</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Module Route</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseModules.map(m => (
                                        <tr key={m.name} className="border-b border-neutral-800 last:border-b-0">
                                            <td className="px-5 py-4 text-white font-medium">{m.name}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-1 bg-neutral-900 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${m.live ? 'bg-emerald-400' : 'bg-neutral-600'}`} style={{ width: `${m.sync}%` }} />
                                                    </div>
                                                    <span className={`text-[10px] font-mono font-semibold ${m.live ? 'text-emerald-400' : 'text-neutral-400'}`}>
                                                        {m.live ? 'LIVE // VERIFIED' : `${m.sync}% Syncing`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-neutral-400 font-mono">{m.seats} Candidates</td>
                                            <td className="px-5 py-4 text-neutral-500 font-mono">{m.route}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 mt-6">
                            <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-5">
                                AI Evaluation Parameter Lab // Cohort Grading Directives
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                                            System Pedagogical Strategy
                                        </p>
                                        <select className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 w-full outline-none">
                                            <option className="bg-[#0a0a0a]">Strict Examiner Mode (IDP/BC Standard)</option>
                                            <option className="bg-[#0a0a0a]">Balanced Feedback</option>
                                            <option className="bg-[#0a0a0a]">Beginner Encouraging Mode</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-3">
                                            AI Evaluation Strictness Margin
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-neutral-500 font-mono">0.0 (Lenient)</span>
                                            <div className="flex-1 h-1 bg-neutral-900 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full bg-emerald-500/60" style={{ width: '80%' }} />
                                            </div>
                                            <span className="text-[10px] text-neutral-500 font-mono">1.0 (Strict)</span>
                                            <span className="text-[11px] text-emerald-400 font-mono font-semibold ml-2">0.8</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                                        Teacher Override Directive
                                    </p>
                                    <textarea
                                        readOnly
                                        className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded font-mono text-[11px] p-3 text-neutral-400 focus:outline-none focus:border-neutral-700 resize-none"
                                        value={`REQUIREMENT: Flag any student using generic templates in Writing Task 2. Prioritize Lexical Resource and Coherence feedback for Band 6.5 cohort.`}
                                    />
                                </div>
                            </div>
                            <div className="mt-5 pt-5 border-t border-neutral-800">
                                <button className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/30 text-emerald-400 text-xs py-2 px-4 rounded font-mono transition-all duration-150">
                                    [+ Update Live Cohort System Directives]
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {currentSubView === 'vector_repos' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Knowledge Base Infrastructure // Custom Curriculum & Question Stores
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">File / Question Bank</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Total Items / Vectors</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">AI Evaluator Model</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vectorDocs.map(d => (
                                        <tr key={d.file} className="border-b border-neutral-800 last:border-b-0">
                                            <td className="px-5 py-4 text-white font-medium font-mono text-[11px]">{d.file}</td>
                                            <td className="px-5 py-4 text-neutral-400 font-mono">{d.chunks}</td>
                                            <td className="px-5 py-4 text-neutral-500 font-mono text-[10px]">{d.model}</td>
                                            <td className="px-5 py-4">
                                                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button className="text-[10px] font-medium text-neutral-500 hover:text-white transition-colors">[Inspect]</button>
                                                    <button className="text-[10px] font-medium text-neutral-500 hover:text-red-400 transition-colors">[Purge]</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {currentSubView === 'sso_gateways' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Institute LMS & Portal Bridges // Identity Integration
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {identityProviders.map(p => (
                                <div key={p.name} className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <GlobeIcon className="w-5 h-5 text-neutral-400" />
                                        <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                                    </div>
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">Linked Student Accounts</p>
                                    <p className="text-lg font-semibold text-white mb-3">{p.accounts} Linked</p>
                                    <span className="inline-flex text-[10px] font-medium text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20 mb-3">
                                        {p.status}
                                    </span>
                                    <p className="text-[10px] text-neutral-500 mt-2 font-mono">
                                        {p.token ? `SAML Token Exp: ${p.token}` : `Auto-Provisioning: ${p.provisioning}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {currentSubView === 'node_settings' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            System Parameter Overrides // IELTS AI Evaluation Constants
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 space-y-6">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Default Evaluation Base Model</p>
                                <div className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 w-full">
                                    Claude 3.5 Sonnet // IELTS Evaluator Pipeline
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">AI Evaluation Strictness Margin</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-neutral-500 font-mono">0.0 (Lenient)</span>
                                    <div className="flex-1 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-neutral-600" style={{ width: '80%' }} />
                                    </div>
                                    <span className="text-[10px] text-neutral-500 font-mono">1.0 (Strict)</span>
                                    <span className="text-xs text-neutral-400 font-mono whitespace-nowrap ml-2">0.8 Strictness Margin</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Teacher Override Mandate: Require manual teacher approval before students view Writing scores.</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-5 rounded-full bg-emerald-500 flex items-center p-0.5 justify-end">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow" />
                                    </div>
                                    <span className="text-xs text-emerald-400 font-medium">TRUE — Teacher approval required before score release</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentSubView === 'evaluation_queue' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Teacher Evaluation Queue // Pending Sign-off & Speaking Review
                        </h2>
                        <EvaluationQueue
                            items={pendingEvaluations}
                            setItems={setPendingEvaluations}
                            setAuditLogs={setAuditLogs}
                            pushToast={pushToast}
                        />
                    </>
                )}

                {currentSubView !== 'daily_engagements' && currentSubView !== 'license_seats'
                    && currentSubView !== 'overview_main' && currentSubView !== 'performance_analytics'
                    && currentSubView !== 'course_deployment' && currentSubView !== 'vector_repos'
                    && currentSubView !== 'sso_gateways' && currentSubView !== 'node_settings'
                    && currentSubView !== 'evaluation_queue' && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-neutral-600">
                            {currentSubView.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </p>
                    </div>
                )}

                <HomeworkDispatchModal
                    key={dispatchModal.student?.id}
                    open={dispatchModal.open}
                    student={dispatchModal.student}
                    onClose={() => setDispatchModal({ open: false, student: null })}
                    pushToast={pushToast}
                />
                <ReportModal
                    open={reportModal.open}
                    studentId={reportModal.studentId}
                    students={students}
                    onClose={() => setReportModal({ open: false, studentId: null })}
                    pushToast={pushToast}
                />
            </main>
            <ToastStack toasts={toasts} />
        </div>
    );
};

export default OrgSpaceView;

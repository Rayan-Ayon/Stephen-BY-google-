import React, { useState, useMemo } from 'react';
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
            { label: 'Private Vector Repos', key: 'vector_repos' },
        ],
    },
    {
        label: 'Identity & Seats', icon: <LockClosedIcon className="w-4 h-4" />, key: 'identity',
        subItems: [
            { label: 'License Allocation', key: 'license_seats' },
            { label: 'SSO Gateways', key: 'sso_gateways' },
        ],
    },
    { label: 'Node Settings', icon: <SettingsIcon className="w-4 h-4" />, key: 'settings', isLeaf: true, leafKey: 'node_settings' },
];

const students: StudentTelemetry[] = [
    { id: 'S-TB29', name: 'Ayon', videos: { watched: 572, total: 601 }, exams: { done: 7, total: 10, avg: 6.5, status: 'Good' }, projects: { done: 2, total: 7, avg: 6.0, status: 'Fair' }, questioning: { understanding: 7, divergent: 4, convergent: 6, status: 'Fair' }, flashcards: { done: 1, total: 10, acc: 84, status: 'Fair' }, quizzes: { done: 8, total: 10, acc: 73, status: 'Good' }, ovrScore: 5.5 },
    { id: 'S-TB20', name: 'Farhan', videos: { watched: 601, total: 601 }, exams: { done: 9, total: 10, avg: 8.2, status: 'Excellent' }, projects: { done: 6, total: 7, avg: 8.5, status: 'Excellent' }, questioning: { understanding: 9, divergent: 8, convergent: 8, status: 'Excellent' }, flashcards: { done: 9, total: 10, acc: 96, status: 'Excellent' }, quizzes: { done: 10, total: 10, acc: 91, status: 'Excellent' }, ovrScore: 8.8 },
    { id: 'S-TB21', name: 'Tanvir', videos: { watched: 489, total: 601 }, exams: { done: 6, total: 10, avg: 5.8, status: 'Good' }, projects: { done: 4, total: 7, avg: 7.2, status: 'Good' }, questioning: { understanding: 6, divergent: 5, convergent: 5, status: 'Good' }, flashcards: { done: 5, total: 10, acc: 72, status: 'Good' }, quizzes: { done: 7, total: 10, acc: 68, status: 'Fair' }, ovrScore: 6.2 },
    { id: 'S-TB22', name: 'Nafisa', videos: { watched: 534, total: 601 }, exams: { done: 10, total: 10, avg: 9.1, status: 'Excellent' }, projects: { done: 7, total: 7, avg: 9.3, status: 'Excellent' }, questioning: { understanding: 8, divergent: 7, convergent: 9, status: 'Excellent' }, flashcards: { done: 8, total: 10, acc: 93, status: 'Excellent' }, quizzes: { done: 9, total: 10, acc: 88, status: 'Excellent' }, ovrScore: 9.0 },
    { id: 'S-TB23', name: 'Rahim', videos: { watched: 412, total: 601 }, exams: { done: 5, total: 10, avg: 4.2, status: 'Fair' }, projects: { done: 3, total: 7, avg: 5.5, status: 'Fair' }, questioning: { understanding: 5, divergent: 3, convergent: 4, status: 'Fair' }, flashcards: { done: 3, total: 10, acc: 61, status: 'Fair' }, quizzes: { done: 4, total: 10, acc: 55, status: 'Low' }, ovrScore: 4.1 },
    { id: 'S-TB24', name: 'Jarin', videos: { watched: 378, total: 601 }, exams: { done: 8, total: 10, avg: 7.5, status: 'Good' }, projects: { done: 5, total: 7, avg: 7.8, status: 'Good' }, questioning: { understanding: 7, divergent: 6, convergent: 6, status: 'Good' }, flashcards: { done: 6, total: 10, acc: 79, status: 'Good' }, quizzes: { done: 7, total: 10, acc: 76, status: 'Good' }, ovrScore: 6.9 },
    { id: 'S-TB25', name: 'Shakib', videos: { watched: 301, total: 601 }, exams: { done: 4, total: 10, avg: 3.5, status: 'Low' }, projects: { done: 1, total: 7, avg: 4.0, status: 'Low' }, questioning: { understanding: 3, divergent: 2, convergent: 3, status: 'Low' }, flashcards: { done: 2, total: 10, acc: 45, status: 'Low' }, quizzes: { done: 3, total: 10, acc: 42, status: 'Low' }, ovrScore: 2.8 },
    { id: 'S-TB26', name: 'Mim', videos: { watched: 546, total: 601 }, exams: { done: 8, total: 10, avg: 7.8, status: 'Good' }, projects: { done: 5, total: 7, avg: 7.5, status: 'Good' }, questioning: { understanding: 8, divergent: 6, convergent: 7, status: 'Good' }, flashcards: { done: 7, total: 10, acc: 86, status: 'Good' }, quizzes: { done: 8, total: 10, acc: 81, status: 'Good' }, ovrScore: 7.2 },
    { id: 'S-TB27', name: 'Hasan', videos: { watched: 445, total: 601 }, exams: { done: 6, total: 10, avg: 5.2, status: 'Fair' }, projects: { done: 3, total: 7, avg: 5.8, status: 'Fair' }, questioning: { understanding: 5, divergent: 4, convergent: 5, status: 'Fair' }, flashcards: { done: 4, total: 10, acc: 68, status: 'Fair' }, quizzes: { done: 5, total: 10, acc: 62, status: 'Fair' }, ovrScore: 4.8 },
    { id: 'S-TB28', name: 'Nusrat', videos: { watched: 510, total: 601 }, exams: { done: 7, total: 10, avg: 6.8, status: 'Good' }, projects: { done: 4, total: 7, avg: 6.5, status: 'Good' }, questioning: { understanding: 6, divergent: 5, convergent: 6, status: 'Good' }, flashcards: { done: 5, total: 10, acc: 75, status: 'Good' }, quizzes: { done: 6, total: 10, acc: 71, status: 'Good' }, ovrScore: 6.0 },
    { id: 'S-TB30', name: 'Tariq', videos: { watched: 388, total: 601 }, exams: { done: 5, total: 10, avg: 4.8, status: 'Fair' }, projects: { done: 2, total: 7, avg: 5.0, status: 'Fair' }, questioning: { understanding: 4, divergent: 3, convergent: 4, status: 'Fair' }, flashcards: { done: 3, total: 10, acc: 58, status: 'Fair' }, quizzes: { done: 4, total: 10, acc: 59, status: 'Fair' }, ovrScore: 4.0 },
    { id: 'S-TB31', name: 'Sadia', videos: { watched: 562, total: 601 }, exams: { done: 9, total: 10, avg: 8.5, status: 'Excellent' }, projects: { done: 6, total: 7, avg: 8.2, status: 'Excellent' }, questioning: { understanding: 9, divergent: 7, convergent: 8, status: 'Excellent' }, flashcards: { done: 8, total: 10, acc: 91, status: 'Excellent' }, quizzes: { done: 9, total: 10, acc: 87, status: 'Excellent' }, ovrScore: 8.5 },
    { id: 'S-TB32', name: 'Zubair', videos: { watched: 267, total: 601 }, exams: { done: 3, total: 10, avg: 3.0, status: 'Low' }, projects: { done: 1, total: 7, avg: 3.5, status: 'Low' }, questioning: { understanding: 2, divergent: 2, convergent: 2, status: 'Low' }, flashcards: { done: 1, total: 10, acc: 38, status: 'Low' }, quizzes: { done: 2, total: 10, acc: 35, status: 'Low' }, ovrScore: 2.2 },
    { id: 'S-TB33', name: 'Fahim', videos: { watched: 475, total: 601 }, exams: { done: 7, total: 10, avg: 6.2, status: 'Good' }, projects: { done: 4, total: 7, avg: 6.8, status: 'Good' }, questioning: { understanding: 6, divergent: 5, convergent: 5, status: 'Good' }, flashcards: { done: 4, total: 10, acc: 71, status: 'Good' }, quizzes: { done: 6, total: 10, acc: 67, status: 'Fair' }, ovrScore: 5.8 },
    { id: 'S-TB34', name: 'Labiba', videos: { watched: 523, total: 601 }, exams: { done: 8, total: 10, avg: 7.2, status: 'Good' }, projects: { done: 5, total: 7, avg: 7.0, status: 'Good' }, questioning: { understanding: 7, divergent: 6, convergent: 7, status: 'Good' }, flashcards: { done: 6, total: 10, acc: 82, status: 'Good' }, quizzes: { done: 7, total: 10, acc: 78, status: 'Good' }, ovrScore: 6.8 },
    { id: 'S-TB35', name: 'Imran', videos: { watched: 341, total: 601 }, exams: { done: 4, total: 10, avg: 4.0, status: 'Fair' }, projects: { done: 2, total: 7, avg: 4.5, status: 'Fair' }, questioning: { understanding: 4, divergent: 3, convergent: 3, status: 'Fair' }, flashcards: { done: 2, total: 10, acc: 52, status: 'Fair' }, quizzes: { done: 3, total: 10, acc: 48, status: 'Low' }, ovrScore: 3.5 },
    { id: 'S-TB36', name: 'Maliha', videos: { watched: 497, total: 601 }, exams: { done: 6, total: 10, avg: 5.5, status: 'Good' }, projects: { done: 3, total: 7, avg: 5.2, status: 'Fair' }, questioning: { understanding: 5, divergent: 4, convergent: 5, status: 'Fair' }, flashcards: { done: 4, total: 10, acc: 65, status: 'Fair' }, quizzes: { done: 5, total: 10, acc: 63, status: 'Fair' }, ovrScore: 5.0 },
    { id: 'S-TB37', name: 'Rakib', videos: { watched: 248, total: 601 }, exams: { done: 2, total: 10, avg: 2.5, status: 'Low' }, projects: { done: 0, total: 7, avg: 0, status: 'Low' }, questioning: { understanding: 2, divergent: 1, convergent: 2, status: 'Low' }, flashcards: { done: 0, total: 10, acc: 0, status: 'Low' }, quizzes: { done: 1, total: 10, acc: 28, status: 'Low' }, ovrScore: 1.5 },
    { id: 'S-TB38', name: 'Sumaiya', videos: { watched: 436, total: 601 }, exams: { done: 5, total: 10, avg: 5.0, status: 'Fair' }, projects: { done: 3, total: 7, avg: 5.5, status: 'Fair' }, questioning: { understanding: 5, divergent: 4, convergent: 4, status: 'Fair' }, flashcards: { done: 3, total: 10, acc: 62, status: 'Fair' }, quizzes: { done: 4, total: 10, acc: 58, status: 'Fair' }, ovrScore: 4.5 },
    { id: 'S-TB39', name: 'Arif', videos: { watched: 320, total: 601 }, exams: { done: 4, total: 10, avg: 3.8, status: 'Low' }, projects: { done: 1, total: 7, avg: 3.0, status: 'Low' }, questioning: { understanding: 3, divergent: 2, convergent: 3, status: 'Low' }, flashcards: { done: 1, total: 10, acc: 42, status: 'Low' }, quizzes: { done: 2, total: 10, acc: 38, status: 'Low' }, ovrScore: 2.5 },
];

const engagementTabs = ['Videos', 'Flashcards', 'Quizzes', 'Exams', 'Questioning Depth'];

const licenseAudit = [
    'BUET Electrical Dept requested 250 additional user nodes — Approved by Admin Ayon.',
    'CSE Department seat pool expanded by 120 — Auto-provisioned via quota override.',
    'ME Department SSO bridge activated — 48 users synced within 12 minutes.',
    'BBA Program license renewal — $4,200 invoiced for Q3 2026 cycle.',
];

const btnBase = 'w-full flex items-center justify-between text-xs px-3 py-1.5 rounded-md transition-all text-neutral-400 hover:text-white hover:bg-neutral-900';

// ── New subview data ──

const overviewMetrics = [
    { label: 'Node Deployment Status', value: 'OPERATIONAL', subtext: '14ms Latency Edge' },
    { label: 'Active Token Ingestion Velocity', value: '242.8k tokens/sec', subtext: '' },
    { label: 'System Sync Compliance', value: '99.98%', subtext: 'Verification Vector Check' },
];

const infrastructureTasks = [
    'SSO Node Handshake Success — 12 bridges synchronized',
    'Context Database Re-indexed — 340 vector shards compacted',
    'SAML Gateway Refreshed — Certificate rotation complete',
    'Edge CDN Cache Primed — 2.4M embeddings distributed',
    'Audit Log Flush — 48hr retention window trimmed',
];

const riskProfiles = [
    { rank: 1, name: 'Tanvir', id: 'WS-S-TB21', hours: '489 min', deficiency: 'Quiz Accuracy: 58%', status: 'FLAGGED – REQUIRED REVIEW' },
    { rank: 2, name: 'Rahim', id: 'WS-S-TB23', hours: '412 min', deficiency: 'Project Score: 4.8/10', status: 'PENDING ACTION' },
    { rank: 3, name: 'Imran', id: 'WS-S-TB35', hours: '341 min', deficiency: 'Exams Avg: 4.0/10', status: 'PENDING ACTION' },
];

const skillDomains = [
    { label: 'Machine Learning Foundations', pct: 84 },
    { label: 'System Orchestration', pct: 71 },
    { label: 'Context Architecture', pct: 68 },
];

const courseModules = [
    { name: 'Python Vector Processing v2.4', sync: 92, seats: '4,850', route: '/sys-core-py', live: false },
    { name: 'Multi-Agent LLM Orchestration', sync: 100, seats: '4,110', route: '/llm-agents', live: true },
];

const vectorDocs = [
    { file: 'BUET_EEE_Exam_Pool_2026.pdf', chunks: '1,420 Vectors', model: 'text-embedding-3-large', status: 'Encrypted & Mapped' },
    { file: 'MIT_Robotics_Lab_Node_Context.json', chunks: '890 Vectors', model: 'text-embedding-3-large', status: 'Active Context Room' },
];

const identityProviders = [
    { name: 'Google Workspace Connection Hub', accounts: '3,200', status: 'Active Synchronized Tunnel', token: '24h' },
    { name: 'Microsoft Entra ID Integration Gateway', accounts: '1,650', status: 'Active Synchronized Tunnel', provisioning: 'Active' },
];

// ── Helpers ──

const getTabMetric = (s: StudentTelemetry, tab: string): number => {
    switch (tab) {
        case 'Videos': return s.videos.watched;
        case 'Flashcards': return s.flashcards.acc;
        case 'Quizzes': return s.quizzes.acc;
        case 'Exams': return s.exams.avg;
        case 'Questioning Depth': return s.questioning.understanding + s.questioning.divergent + s.questioning.convergent;
        default: return 0;
    }
};

const getTabLabel = (s: StudentTelemetry, tab: string): string => {
    switch (tab) {
        case 'Videos': return `${s.videos.watched} / ${s.videos.total} min`;
        case 'Flashcards': return `${s.flashcards.acc}%`;
        case 'Quizzes': return `${s.quizzes.acc}%`;
        case 'Exams': return `${s.exams.avg} / 10`;
        case 'Questioning Depth': return `${s.questioning.understanding + s.questioning.divergent + s.questioning.convergent}`;
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

// ── Component ──

const OrgSpaceView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [currentSection, setCurrentSection] = useState('telemetry');
    const [currentSubView, setCurrentSubView] = useState('daily_engagements');
    const [expandedSection, setExpandedSection] = useState<string | null>('telemetry');
    const [engagementTab, setEngagementTab] = useState('Videos');
    const [hoveredProfileId, setHoveredProfileId] = useState<string | null>(null);

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

    return (
        <div className="w-full min-h-screen bg-black text-neutral-100 font-sans flex">
            {/* ── Left Sidebar ── */}
            <aside className="w-[260px] shrink-0 border-r border-neutral-800 bg-[#050505] p-4 flex flex-col justify-between">
                <div>
                    <div className="mb-6 px-3">
                        <h1 className="text-sm font-semibold tracking-tight text-white">BUET Portal Node // Operations</h1>
                        <span className="inline-block mt-1.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                            TENANT ADMIN
                        </span>
                    </div>
                    <nav className="space-y-0.5">
                        {navGroups.map(group => {
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
                                                    className={`w-full text-left text-xs pl-8 pr-3 py-1.5 rounded-md transition-all ${activeSub(sub.key)}`}
                                                >
                                                    {sub.label}
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
                            Cohort Operational Engine // Daily Engagement Matrix
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
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Workspace System ID</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Tab Specific Traffic Metric</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Performance Trajectory</th>
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
                                                            Student Profile Matrix: {s.name} // {s.id}
                                                        </p>
                                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-3">
                                                            OVR System Score: {s.ovrScore} / 10
                                                        </p>
                                                        <div className="space-y-1.5 text-[11px]">
                                                            <p className="text-neutral-400">
                                                                Exams: {s.exams.done}/{s.exams.total} | Avg: {s.exams.avg} | {s.exams.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Projects: {s.projects.done}/7 | Avg: {s.projects.avg} | {s.projects.status}
                                                            </p>
                                                            <p className="text-neutral-400">
                                                                Questioning: U:{s.questioning.understanding} D:{s.questioning.divergent} C:{s.questioning.convergent} | {s.questioning.status}
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
                                            <td className="px-5 py-3.5 text-neutral-500 font-mono">WS-{s.id}</td>
                                            <td className="px-5 py-3.5 text-white font-mono">{getTabLabel(s, engagementTab)}</td>
                                            <td className={`px-5 py-3.5 font-mono ${trajectoryColor(s)}`}>{trajectoryLabel(s)}</td>
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
                                    Total Active Corporate Seats
                                </p>
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    4,850 / 10,000
                                </p>
                            </div>
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                    Available SSO Ingestion Node Bridges
                                </p>
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    4
                                </p>
                            </div>
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                    Next Cycle Invoicing
                                </p>
                                <p className="text-2xl font-semibold tracking-tight text-white">
                                    $38,210
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
                            Node Infrastructure Command // System Health & Ingestion
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
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">Throughput Velocity (24h)</p>
                            <svg viewBox="0 0 600 120" className="w-full h-24">
                                <polyline points="0,90 40,70 80,80 120,40 160,50 200,20 240,35 280,55 320,30 360,45 400,15 440,25 480,50 520,35 560,10 600,30" fill="none" stroke="#555" strokeWidth="1.5" />
                                <polyline points="0,95 40,75 80,85 120,45 160,55 200,25 240,40 280,60 320,35 360,50 400,20 440,30 480,55 520,40 560,15 600,35" fill="none" stroke="#888" strokeWidth="0.8" opacity="0.5" />
                            </svg>
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">Infrastructure Task Log</p>
                            <div className="space-y-2">
                                {infrastructureTasks.map((task, i) => (
                                    <div key={i} className="flex items-start gap-3 py-2 border-b border-neutral-800 last:border-b-0">
                                        <ClockIcon className="w-3.5 h-3.5 text-neutral-600 mt-0.5 shrink-0" />
                                        <p className="text-xs text-neutral-400">{task}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {currentSubView === 'performance_analytics' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Cohort Operational Engine // Cross-Segment Risk Quadrant
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 mb-6">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-amber-500 mb-4">
                                Risk Isolation Analysis (High Watchtime // Low Output Yield)
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
                                            <td className={`px-4 py-3 font-mono text-[10px] font-semibold ${r.status.includes('FLAGGED') ? 'text-amber-400' : 'text-orange-400'}`}>{r.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">Skill Domain Heatmap</p>
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

                {currentSubView === 'course_deployment' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Curriculum Asset Pipeline // Active Node Compilations
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Module</th>
                                        <th className="px-5 py-3.5 text-[10pxpx] font-medium uppercase tracking-wider text-neutral-500">Sync State</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Cohort Seats</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Node Route</th>
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
                                            <td className="px-5 py-4 text-neutral-400 font-mono">{m.seats} Active</td>
                                            <td className="px-5 py-4 text-neutral-500 font-mono">{m.route}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 mt-6">
                            <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-5">
                                Core Ingestion Agent Parameter Lab // Cohort System Instructions
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                                            System Pedagogical Framework Strategy
                                        </p>
                                        <div className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 w-full">
                                            Socratic Questioning Mode
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-3">
                                            Agent Processing Temperature
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-neutral-500 font-mono">0.0</span>
                                            <div className="flex-1 h-1 bg-neutral-900 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full bg-emerald-500/60" style={{ width: '20%' }} />
                                            </div>
                                            <span className="text-[10px] text-neutral-500 font-mono">1.0</span>
                                            <span className="text-[11px] text-emerald-400 font-mono font-semibold ml-2">0.2</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                                        System Instruction Workspace
                                    </p>
                                    <textarea
                                        readOnly
                                        className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded font-mono text-[11px] p-3 text-neutral-400 focus:outline-none focus:border-neutral-700 resize-none"
                                        value={`SYSTEM_INSTRUCTION: You are an autonomous synthesis proxy for Stephen UAIU. Process the incoming multi-page academic PDF context array. Force structural JSON generation maps. Do not hallucinate tensor boundaries...`}
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
                            Knowledge Base Infrastructure // Semantic Vector Embedding Stores
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">File Name</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Chunk Size</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Model</th>
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
                                                    <button className="text-[10px] font-medium text-neutral-500 hover:text-white transition-colors">[Inspect Embeddings]</button>
                                                    <button className="text-[10px] font-medium text-neutral-500 hover:text-red-400 transition-colors">[Purge Context]</button>
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
                            Identity Control Node // Corporate Security Gates
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {identityProviders.map(p => (
                                <div key={p.name} className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <GlobeIcon className="w-5 h-5 text-neutral-400" />
                                        <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                                    </div>
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">Mapped Identities</p>
                                    <p className="text-lg font-semibold text-white mb-3">{p.accounts} Accounts</p>
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
                            System Parameter Overrides // Node Execution Constants
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 space-y-6">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Default Base Model Routing Matrix</p>
                                <div className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 w-full">
                                    Claude 3.5 Sonnet // Multi-Agent Pipeline Optimized
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Context Window Sliding Pruning Window Threshold</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-neutral-600" style={{ width: '64%' }} />
                                    </div>
                                    <span className="text-xs text-neutral-400 font-mono whitespace-nowrap">128k context allocation target tokens</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Strict System Multi-Tenant Security Flag</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-5 rounded-full bg-emerald-500 flex items-center p-0.5 justify-end">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow" />
                                    </div>
                                    <span className="text-xs text-emerald-400 font-medium">TRUE — Restrict domain sharing across nodes</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentSubView !== 'daily_engagements' && currentSubView !== 'license_seats'
                    && currentSubView !== 'overview_main' && currentSubView !== 'performance_analytics'
                    && currentSubView !== 'course_deployment' && currentSubView !== 'vector_repos'
                    && currentSubView !== 'sso_gateways' && currentSubView !== 'node_settings' && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-neutral-600">
                            {currentSubView.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrgSpaceView;

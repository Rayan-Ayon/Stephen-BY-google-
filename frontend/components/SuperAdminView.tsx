import React, { useState } from 'react';
import {
    HomeIcon, BookOpenIcon, UserIcon, BrainIcon,
    ClipboardCheckIcon, BarChartIcon, UsersIcon,
    DollarIcon, SettingsIcon, ShieldCheckIcon,
    CheckCircleIcon, XIcon, CheckIcon, GlobeIcon,
    DatabaseIcon, ClockIcon, TrendingUpIcon,
    SparkleIcon, ChevronDownIcon,
} from './icons';

// ── Data ──

interface NavLeaf {
    label: string;
    key: string;
}

interface NavGroup {
    label: string;
    icon: React.ReactNode;
    key: string;
    subItems?: NavLeaf[];
    isLeaf?: boolean;
    leafKey?: string;
}

const navGroups: NavGroup[] = [
    { label: 'Dashboard', icon: <HomeIcon className="w-4 h-4" />, key: 'dashboard', isLeaf: true, leafKey: 'dashboard_main' },
    {
        label: 'Learning', icon: <BookOpenIcon className="w-4 h-4" />, key: 'learning',
        subItems: [
            { label: 'Courses', key: 'learning_courses' },
            { label: 'Lessons', key: 'learning_lessons' },
            { label: 'Categories', key: 'learning_categories' },
            { label: 'Playlists', key: 'learning_playlists' },
            { label: 'Learning Paths', key: 'learning_paths' },
        ],
    },
    {
        label: 'Users', icon: <UserIcon className="w-4 h-4" />, key: 'users',
        subItems: [
            { label: 'Students', key: 'users_students' },
            { label: 'Instructors', key: 'users_instructors' },
            { label: 'Managers', key: 'users_managers' },
            { label: 'Teams', key: 'users_teams' },
            { label: 'Roles', key: 'users_roles' },
        ],
    },
    {
        label: 'AI', icon: <BrainIcon className="w-4 h-4" />, key: 'ai',
        subItems: [
            { label: 'AI Course Builder', key: 'ai_course_builder' },
            { label: 'AI Tutor', key: 'ai_tutor' },
            { label: 'AI Analytics', key: 'ai_analytics' },
            { label: 'AI Assistant', key: 'ai_assistant' },
            { label: 'AI Prompts', key: 'ai_prompts' },
            { label: 'AI Knowledge Base', key: 'ai_knowledge_base' },
        ],
    },
    {
        label: 'Assessments', icon: <ClipboardCheckIcon className="w-4 h-4" />, key: 'assessments',
        subItems: [
            { label: 'Quizzes', key: 'assessments_quizzes' },
            { label: 'Exams', key: 'assessments_exams' },
            { label: 'Assignments', key: 'assessments_assignments' },
            { label: 'Projects', key: 'assessments_projects' },
            { label: 'Certificates', key: 'assessments_certificates' },
        ],
    },
    {
        label: 'Analytics', icon: <BarChartIcon className="w-4 h-4" />, key: 'analytics',
        subItems: [
            { label: 'Engagement', key: 'analytics_engagement' },
            { label: 'Performance', key: 'analytics_performance' },
            { label: 'Skills', key: 'analytics_skills' },
            { label: 'Heatmaps', key: 'analytics_heatmaps' },
            { label: 'Reports', key: 'analytics_reports' },
        ],
    },
    {
        label: 'Community', icon: <UsersIcon className="w-4 h-4" />, key: 'community',
        subItems: [
            { label: 'Discussions', key: 'community_discussions' },
            { label: 'Announcements', key: 'community_announcements' },
            { label: 'Events', key: 'community_events' },
        ],
    },
    { label: 'Billing', icon: <DollarIcon className="w-4 h-4" />, key: 'billing', isLeaf: true, leafKey: 'billing_metrics' },
    { label: 'Settings', icon: <SettingsIcon className="w-4 h-4" />, key: 'settings', isLeaf: true },
];

const metrics = [
    { label: 'Active Learners', value: '12,458' },
    { label: 'Active Courses', value: '347' },
    { label: 'Completion Rate', value: '83%' },
    { label: "Today's AI Questions", value: '8,927' },
    { label: 'Revenue This Month', value: '$38,210' },
];

const recentActivity = [
    'Google Workspace Hub completed AI course vector compilation for 1,200 engineers.',
    'Microsoft Enterprise uploaded new HR policy documentation (12,400 tokens indexed).',
    'IBM Corporate Hub invited 42 new learners to the Advanced ML pathway.',
    '3 new instructors joined the BUET Private Portal space this week.',
];

const pendingTenants = [
    { name: 'Sayed Rahman', org: 'BUET University Space', email: 'speakbangla.always@gmail.com', status: 'pending' as const },
    { name: 'Dr. Elena Rostova', org: 'MIT Robotics Lab Node', email: 'rostova@mit.edu', status: 'cleared' as const },
];

const quickActions = [
    '+ Create Course', '+ Invite Users', '+ AI Generate Course', '+ Upload Documents', '+ Create Exam',
];

const billingTabs = ['Users Tier', 'Active Seats', 'Metered Usage', 'PDF / Invoices', 'AI Token Costs', 'Storage', 'API Keys'];

const billingData: Record<string, { col1: string; col2: string; col3: string }[]> = {
    'Users Tier': [
        { col1: 'Free Tier', col2: '2,340 learners', col3: '12 orgs' },
        { col1: 'Pro Tier', col2: '5,812 learners', col3: '48 orgs' },
        { col1: 'Enterprise Tier', col2: '4,306 learners', col3: '21 orgs' },
    ],
    'Active Seats': [
        { col1: 'Total Provisioned', col2: '12,458 seats', col3: '100%' },
        { col1: 'Currently Active', col2: '9,823 seats', col3: '78.8%' },
        { col1: 'Idle / Unused', col2: '2,635 seats', col3: '21.2%' },
    ],
    'Metered Usage': [
        { col1: 'API Calls (30d)', col2: '847,230 requests', col3: '$0.003 / req' },
        { col1: 'Bandwidth (30d)', col2: '12.4 TB', col3: '$0.09 / GB' },
        { col1: 'Compute Hours (30d)', col2: '3,210 hrs', col3: '$0.45 / hr' },
    ],
    'PDF / Invoices': [
        { col1: 'INV-2026-0421', col2: 'Apr 21, 2026', col3: '$12,400' },
        { col1: 'INV-2026-0415', col2: 'Apr 15, 2026', col3: '$8,920' },
        { col1: 'INV-2026-0401', col2: 'Apr 01, 2026', col3: '$16,890' },
    ],
    'AI Token Costs': [
        { col1: 'GPT-4o Tokens', col2: '2.4M tokens', col3: '$48.20' },
        { col1: 'Embedding Tokens', col2: '8.1M tokens', col3: '$12.15' },
        { col1: 'Claude 3.5 Tokens', col2: '1.8M tokens', col3: '$27.00' },
    ],
    'Storage': [
        { col1: 'Course Assets', col2: '340 GB', col3: '68% used' },
        { col1: 'User Data', col2: '128 GB', col3: '42% used' },
        { col1: 'AI Model Cache', col2: '512 GB', col3: '85% used' },
    ],
    'API Keys': [
        { col1: 'Production Key', col2: 'sk-prod-••••a3f8', col3: 'Active' },
        { col1: 'Staging Key', col2: 'sk-stag-••••b2e1', col3: 'Active' },
        { col1: 'Dev Key', col2: 'sk-dev-••••c7d4', col3: 'Expired' },
    ],
};

const btnBase = 'w-full flex items-center justify-between text-xs px-3 py-1.5 rounded-md transition-all text-neutral-400 hover:text-white hover:bg-neutral-900';

// ── New subview data ──

const compilerPipelines = [
    { name: 'PDF Ingestion Pipeline Node 01', status: 'PROCESSING', pct: 84 },
    { name: 'Vectorization Core 04', status: 'IDLE', pct: 0 },
    { name: 'Audio Synthesis Core 02', status: 'COMPILING', pct: 62 },
];

const courseCatalog = [
    { name: 'Advanced Quantum Electronics v3.1', tenant: 'BUET University Space', stage: 'Curriculum Vector Approval' },
    { name: 'Autonomous Systems Architecture', tenant: 'MIT Robotics Lab Node', stage: 'Syllabus Ingestion Queue' },
    { name: 'Introduction to NLP Engineering', tenant: 'Google Workspace Hub', stage: 'AI Compilation Complete' },
];

const adminKeys = [
    { name: 'Ayon // Primary Root Admin', key: 'root-admin-••••a1b2' },
    { name: 'System_Automator_Core // Agentic Service Key', key: 'svc-agent-••••c3d4' },
];

const tenantSpaces = [
    { org: 'BUET University Space', email: 'speakbangla.always@gmail.com', seats: '2,450', endpoint: 'buet.stephen-infra.net' },
    { org: 'MIT Robotics Lab Node', email: 'rostova@mit.edu', seats: '1,820', endpoint: 'mit-robotics.stephen-infra.net' },
    { org: 'Google Workspace Hub', email: 'admin@google.com', seats: '4,200', endpoint: 'google.stephen-infra.net' },
];

const aiMetrics = [
    { label: 'Total Model Ingestion Payload', value: '42.1M Tokens / hr' },
    { label: 'Core Safety Firewall Intercepts', value: '0 Flags Triggered today' },
    { label: 'Model Routing Latency Index', value: '12.4ms Base Edge Target' },
];

const tenantCostLedger = [
    { space: 'BUET University Space Node', allocatedGpu: 'A100-SXM4-80GB (x4)', tokenSpike: '12.4M tkn', costAccumulated: '$1,242.10', efficiency: '98.2%' },
    { space: 'MIT Robotics Lab Node', allocatedGpu: 'H100-PCIe-80GB (x2)', tokenSpike: '8.1M tkn', costAccumulated: '$1,940.50', efficiency: '99.1%' },
    { space: 'Google Workspace Connection Hub', allocatedGpu: 'Serverless Tensor Cluster v4', tokenSpike: '21.6M tkn', costAccumulated: '$3,110.00', efficiency: '99.8%' },
];

const anomalyAlerts = [
    { exam: 'Term Exam 02 - Signals', institution: 'BUET University Space', indicator: 'Tab-Focus Focus Loss Timeout', score: 'Risk Level: Low', action: 'Dismiss Alert', critical: false },
    { exam: 'Machine Learning Baseline', institution: 'MIT Robotics Lab Node', indicator: 'Simultaneous Token Input Signature Spikes', score: 'Risk Level: CRITICAL', action: 'Lock Node Session', critical: true },
];

const shardHealth = [
    { id: 'shard-alpha-01', pools: '24 active', throughput: '3.2 GB/s', status: 'OPERATIONAL' as const },
    { id: 'shard-beta-02', pools: '18 active', throughput: '2.8 GB/s', status: 'OPERATIONAL' as const },
    { id: 'shard-gamma-03', pools: '12 active', throughput: '1.1 GB/s', status: 'DEGRADED' as const },
    { id: 'shard-delta-04', pools: '30 active', throughput: '4.5 GB/s', status: 'OPERATIONAL' as const },
];

const moderationEntries = [
    { user: 'Farhan', node: 'BUET Node', text: 'generated an automated flashcard deck compilation on Vector Space Analysis for shared peer study groups.' },
    { user: 'System', node: null, text: 'Resource space sharing pool between BUET Space Node and MIT Robotics Space updated.' },
];

// ── Component ──

const SuperAdminView: React.FC = () => {
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [currentSubView, setCurrentSubView] = useState('dashboard_main');
    const [expandedSection, setExpandedSection] = useState<string | null>('learning');
    const [billingTab, setBillingTab] = useState('Users Tier');

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
                    {/* Brand */}
                    <div className="mb-6 px-3">
                        <h1 className="text-sm font-semibold tracking-tight text-white">Stephen // Global Infrastructure</h1>
                        <span className="inline-block mt-1.5 text-[10px] font-medium uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            SUPER ADMIN
                        </span>
                    </div>

                    {/* Navigation */}
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

                <div className="pt-4 border-t border-neutral-800 px-3">
                    <p className="text-[10px] text-neutral-600">Infrastructure v3.2.1</p>
                </div>
            </aside>

            {/* ── Right Viewport ── */}
            <main className="flex-1 p-8 bg-neutral-950 overflow-y-auto">
                {currentSubView === 'dashboard_main' && (
                    <>
                        {/* Greeting */}
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Good Morning, Ayon 👋
                        </h2>

                        {/* 5 Metrics */}
                        <div className="grid grid-cols-5 gap-4 mb-6">
                            {metrics.map(m => (
                                <div key={m.label} className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-4">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                        {m.label}
                                    </p>
                                    <p className="text-2xl font-semibold tracking-tight text-white">
                                        {m.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* 3-Column Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

                            {/* Card 1: Recent Activity */}
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                                <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">
                                    Recent Activity Ledger
                                </h3>
                                <div className="space-y-3">
                                    {recentActivity.map((msg, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <ClockIcon className="w-3.5 h-3.5 text-neutral-600 mt-0.5 shrink-0" />
                                            <p className="text-xs text-neutral-400 leading-relaxed">{msg}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 2: AI Diagnostics */}
                            <div className="bg-[#0a0a0a] border border-amber-500/20 rounded-xl p-5">
                                <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">
                                    AI Diagnostics & Recommendations
                                </h3>
                                <div className="flex items-start gap-2.5 mb-4 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                                    <TrendingUpIcon className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-300 mb-1">
                                            Python Course completion dropped 18%
                                        </p>
                                        <p className="text-xs text-neutral-400">
                                            Completion rates dropped 18% inside Module 6 vector pipeline across 3 active cohorts.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
                                    <BrainIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">
                                            AI Recommendation
                                        </p>
                                        <p className="text-xs text-neutral-300 leading-relaxed">
                                            Split Module 6 into two lesson paths automatically. Estimated recovery: +14% completion within 2 cycles.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Trust Gate */}
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                                        Trust Gate — Core Pending Verifications Queue
                                    </h3>
                                    <button
                                        onClick={() => { setCurrentSection('users'); setCurrentSubView('tenant_provisioning'); }}
                                        className="text-[10px] text-neutral-400 hover:text-white font-medium uppercase tracking-wider transition-colors"
                                    >
                                        + View More
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {pendingTenants.map(t => (
                                        <div key={t.email} className="bg-[#050505] border border-neutral-800 rounded-lg p-3.5 space-y-3 mb-3 flex flex-col">
                                            {/* Top Row: Info & Status Badge */}
                                            <div className="flex justify-between items-start w-full gap-2">
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-semibold text-white tracking-tight truncate">
                                                        {t.name}
                                                    </h4>
                                                    <p className="text-[11px] text-neutral-500 font-mono truncate mt-0.5">
                                                        {t.org}
                                                    </p>
                                                </div>
                                                <span className={`text-[9px] shrink-0 px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider ${
                                                    t.status === 'pending'
                                                        ? 'bg-amber-500/5 text-amber-400 border-amber-500/20'
                                                        : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                                                }`}>
                                                    {t.status === 'pending' ? 'Pending' : 'Cleared'}
                                                </span>
                                            </div>

                                            {/* Bottom Row: Full-Width Actions Grid */}
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-900 w-full">
                                                <button className="text-center text-[11px] text-red-400 hover:bg-red-950/20 border border-neutral-800 font-medium py-1.5 rounded-md transition-all">
                                                    Deny
                                                </button>
                                                <button className="text-center text-[11px] bg-white text-black hover:bg-neutral-200 font-semibold py-1.5 rounded-md transition-all whitespace-nowrap">
                                                    Approve & Provision Passkey
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-5 gap-3">
                            {quickActions.map(action => (
                                <button
                                    key={action}
                                    className="bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-600 rounded-lg px-4 py-3 text-sm text-neutral-400 hover:text-white transition-all text-left"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {currentSubView === 'billing_metrics' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Infrastructure & Ledger Operations // Billing Management
                        </h2>

                        {/* 7-Tab Bar */}
                        <div className="flex gap-1 mb-6 flex-wrap">
                            {billingTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setBillingTab(tab)}
                                    className={`text-xs font-medium px-3.5 py-2 rounded-lg transition-all ${
                                        billingTab === tab
                                            ? 'bg-neutral-800 text-white'
                                            : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                                            {billingTab === 'Users Tier' && 'Tier'}
                                            {billingTab === 'Active Seats' && 'Category'}
                                            {billingTab === 'Metered Usage' && 'Resource'}
                                            {billingTab === 'PDF / Invoices' && 'Invoice'}
                                            {billingTab === 'AI Token Costs' && 'Model'}
                                            {billingTab === 'Storage' && 'Type'}
                                            {billingTab === 'API Keys' && 'Key Name'}
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                                            Details
                                        </th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                                            Status / Cost
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(billingData[billingTab] ?? []).map((row, i) => (
                                        <tr key={i} className="border-b border-neutral-800 last:border-b-0">
                                            <td className="px-5 py-3.5 text-white font-medium">{row.col1}</td>
                                            <td className="px-5 py-3.5 text-neutral-400">{row.col2}</td>
                                            <td className="px-5 py-3.5 text-neutral-400">{row.col3}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {currentSection === 'learning' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Global Curriculum Ingestion Panel // Cross-Tenant Compilation Sync
                        </h2>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                                <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">
                                    Core AI Compiler Cluster Status
                                </h3>
                                <div className="space-y-4">
                                    {compilerPipelines.map(p => (
                                        <div key={p.name}>
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="text-neutral-400">{p.name}</span>
                                                <span className={`font-mono text-[10px] font-semibold ${
                                                    p.status === 'PROCESSING' ? 'text-amber-400' :
                                                    p.status === 'COMPILING' ? 'text-amber-300' :
                                                    'text-neutral-500'
                                                }`}>
                                                    {p.status === 'PROCESSING' ? `[PROCESSING - ${p.pct}%]` :
                                                     p.status === 'COMPILING' ? `[COMPILING]` :
                                                     `[IDLE]`}
                                                </span>
                                            </div>
                                            <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${
                                                    p.status === 'PROCESSING' ? 'bg-amber-500' :
                                                    p.status === 'COMPILING' ? 'bg-amber-400' :
                                                    'bg-neutral-700'
                                                }`} style={{ width: `${p.pct || 4}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                                <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 px-5 pt-5 pb-3 border-b border-neutral-800">
                                    Global Course Catalog Validation
                                </h3>
                                <table className="w-full border-collapse text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-neutral-800">
                                            <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Course Identifier</th>
                                            <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Tenant Node Location</th>
                                            <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Verification Stage</th>
                                            <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Action Target</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courseCatalog.map(c => (
                                            <tr key={c.name} className="border-b border-neutral-800 last:border-b-0">
                                                <td className="px-5 py-3.5 text-white font-medium">{c.name}</td>
                                                <td className="px-5 py-3.5 text-neutral-400">{c.tenant}</td>
                                                <td className="px-5 py-3.5 text-neutral-400 font-mono text-[10px]">{c.stage}</td>
                                                <td className="px-5 py-3.5">
                                                    <button className="text-[10px] font-medium text-amber-400 hover:text-amber-300 transition-colors mr-3">[Authorize]</button>
                                                    <button className="text-[10px] font-medium text-neutral-500 hover:text-white transition-colors">[Hold]</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {currentSection === 'users' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Global Identity Matrix // Multi-Tenant Tenant Controls
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5">
                                <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">
                                    System Admins Registry
                                </h3>
                                <div className="space-y-3">
                                    {adminKeys.map(a => (
                                        <div key={a.key} className="flex items-center justify-between bg-[#050505] border border-neutral-800 rounded-lg px-4 py-3">
                                            <div>
                                                <p className="text-xs font-medium text-white">{a.name}</p>
                                                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{a.key}</p>
                                            </div>
                                            <span className="bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded text-[11px] font-mono">
                                                {a.key.includes('root') ? 'ROOT' : 'SERVICE'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                                <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 px-5 pt-5 pb-3 border-b border-neutral-800">
                                    Tenant Administrative Spaces
                                </h3>
                                <table className="w-full border-collapse text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-neutral-800">
                                            <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Organization Target Space</th>
                                            <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Primary Controller Email</th>
                                            <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Mapped Seats</th>
                                            <th className="px-5 py-3 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Network Endpoint Cluster</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tenantSpaces.map(t => (
                                            <tr key={t.org} className="border-b border-neutral-800 last:border-b-0">
                                                <td className="px-5 py-3.5 text-white font-medium">{t.org}</td>
                                                <td className="px-5 py-3.5 text-neutral-400 font-mono text-[11px]">{t.email}</td>
                                                <td className="px-5 py-3.5 text-neutral-400 font-mono">{t.seats}</td>
                                                <td className="px-5 py-3.5 text-neutral-400 font-mono text-[11px]">{t.endpoint}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center gap-4 px-1">
                                <button className="text-[11px] text-red-400 hover:text-red-300 border border-neutral-800 hover:border-red-800 px-4 py-2 rounded-md transition-all font-medium">[Revoke Token]</button>
                                <button className="text-[11px] text-amber-400 hover:text-amber-300 border border-neutral-800 hover:border-amber-700 px-4 py-2 rounded-md transition-all font-medium">[Migrate Database Shard]</button>
                            </div>
                        </div>
                    </>
                )}

                {currentSection === 'ai' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            AI Core Infrastructure // Model Routing & Ingestion Guardrails
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {aiMetrics.map(m => (
                                <div key={m.label} className="bg-[#0a0a0a] border border-amber-500/20 rounded-lg p-4">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-1">{m.label}</p>
                                    <p className="text-lg font-semibold tracking-tight text-amber-300">{m.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 space-y-5">
                            <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                                Parameter Workspace Configuration
                            </h3>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Default Global Base Fallback Model</p>
                                <div className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 w-full">
                                    Claude 3.5 Sonnet // Primary Pipeline
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Prompt Ingestion Safety Token Threshold</p>
                                <div className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 w-full">
                                    4,096 tokens per session window
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">Strict Output Context Evaluation</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-5 rounded-full bg-amber-500 flex items-center p-0.5 justify-end">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white shadow" />
                                    </div>
                                    <span className="text-xs text-amber-400 font-medium">TRUE // Restrict Speculative Decoding</span>
                                </div>
                            </div>
                        </div>
                        <hr className="border-neutral-800 my-6" />
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 px-5 pt-5 pb-3 border-b border-neutral-800">
                                GPU Cluster Attribution & Multi-Tenant Compute Costs
                            </h3>
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">TENANT SPACE NODE</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">ALLOCATED HARDWARE</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">PAYLOAD WEIGHT</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">COMPUTE SPEND</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">EFFICIENCY NODE</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenantCostLedger.map(row => (
                                        <tr key={row.space} className="border-b border-neutral-800 last:border-b-0">
                                            <td className="px-5 py-3.5 text-neutral-300 font-mono text-xs">{row.space}</td>
                                            <td className="px-5 py-3.5 text-neutral-400 font-mono text-xs">{row.allocatedGpu}</td>
                                            <td className="px-5 py-3.5 text-neutral-400 font-mono text-xs">{row.tokenSpike}</td>
                                            <td className="px-5 py-3.5 text-amber-400 font-semibold font-mono text-xs">{row.costAccumulated}</td>
                                            <td className="px-5 py-3.5 text-neutral-400 font-mono text-xs">{row.efficiency}</td>
                                            <td className="px-5 py-3.5">
                                                <button className="text-[10px] font-medium text-neutral-500 hover:text-amber-400 transition-colors">[Recalibrate Quota]</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {currentSection === 'assessments' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Global Examination Telemetry Node // Anomalous Behavior Monitor
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Evaluation Target</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Mapped Institution Node</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Logged Indicator</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">System Integrity Assessment Score</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Operational Response Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {anomalyAlerts.map(a => (
                                        <tr key={a.exam} className="border-b border-neutral-800 last:border-b-0">
                                            <td className="px-5 py-3.5 text-white font-medium">{a.exam}</td>
                                            <td className="px-5 py-3.5 text-neutral-400">{a.institution}</td>
                                            <td className="px-5 py-3.5 text-neutral-400 font-mono text-[10px]">{a.indicator}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                                    a.critical
                                                        ? 'text-red-400 bg-red-500/5 border-red-500/20'
                                                        : 'text-amber-400 bg-amber-500/5 border-amber-500/20'
                                                }`}>
                                                    {a.score}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button className={`text-[10px] font-medium transition-colors ${
                                                    a.critical
                                                        ? 'text-red-400 hover:text-red-300'
                                                        : 'text-neutral-500 hover:text-white'
                                                }`}>
                                                    [{a.action}]
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {currentSection === 'analytics' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Global Telemetry Dashboard // Infrastructure Capacity Allocation
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 mb-6">
                            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">
                                Global Query Load (24h) // Primary Traffic vs Cache Hit Ratio
                            </p>
                            <svg viewBox="0 0 800 150" className="w-full h-32">
                                <polyline points="0,130 40,120 80,125 120,90 160,100 200,70 240,80 280,50 320,65 360,40 400,55 440,25 480,35 520,60 560,45 600,20 640,30 680,55 720,40 760,15 800,35" fill="none" stroke="#b45309" strokeWidth="2" />
                                <polyline points="0,135 40,128 80,130 120,105 160,112 200,85 240,92 280,70 320,80 360,60 400,72 440,50 480,58 520,78 560,65 600,45 640,52 680,72 720,58 760,42 800,55" fill="none" stroke="#404040" strokeWidth="1.5" opacity="0.7" />
                            </svg>
                        </div>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-800">
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Shard ID</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Active Connection Pools</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Read/Write Throughput Target</th>
                                        <th className="px-5 py-3.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500">Operational Status Flag</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shardHealth.map(s => (
                                        <tr key={s.id} className="border-b border-neutral-800 last:border-b-0">
                                            <td className="px-5 py-3.5 text-white font-mono text-[11px]">{s.id}</td>
                                            <td className="px-5 py-3.5 text-neutral-400 font-mono">{s.pools}</td>
                                            <td className="px-5 py-3.5 text-neutral-400 font-mono">{s.throughput}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                                                    s.status === 'OPERATIONAL'
                                                        ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20'
                                                        : 'text-red-400 bg-red-500/5 border-red-500/20'
                                                }`}>
                                                    {s.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {currentSection === 'community' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Cross-Tenant Peer Collaboration Framework // Global Moderation Feed
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 space-y-4">
                            {moderationEntries.map((entry, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-[#050505] border border-neutral-800 rounded-lg">
                                    <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-[10px] font-semibold text-neutral-400">{entry.user.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-neutral-300 leading-relaxed">
                                            <span className="font-semibold text-white">User '{entry.user}'</span>
                                            {entry.node && <span className="text-neutral-500"> ({entry.node})</span>}
                                            {' '}{entry.text}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <button className="text-[10px] font-medium text-neutral-500 hover:text-amber-400 transition-colors">[Flag Log Entry]</button>
                                            <button className="text-[10px] font-medium text-neutral-500 hover:text-white transition-colors">[Pin To Global Knowledge Base]</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {currentSubView === 'settings' && (
                    <>
                        <h2 className="text-2xl font-semibold tracking-tight text-white mb-6">
                            Global Environment Parameters // System Core Constant Overrides
                        </h2>
                        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-5 space-y-6 max-w-2xl">
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                                    Base Application Production Endpoint URL
                                </p>
                                <div className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 font-mono w-full">
                                    https://api.stephen-infra.net/v3
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                                    Maintenance State Control Switcher
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-md">
                                        [Live Node Execution Mode]
                                    </span>
                                    <span className="text-xs font-medium text-neutral-500 border border-neutral-800 px-3 py-1.5 rounded-md">
                                        [Halt All Ingestion Handshakes]
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                                    Global System Diagnostic Reporting Velocity
                                </p>
                                <div className="bg-transparent border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-300 w-full">
                                    Real-time Streaming Matrix Ingestion // 1s Intervals
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentSubView !== 'dashboard_main' && currentSubView !== 'billing_metrics'
                    && currentSection !== 'learning' && currentSection !== 'users'
                    && currentSection !== 'ai' && currentSection !== 'assessments'
                    && currentSection !== 'analytics' && currentSection !== 'community'
                    && currentSubView !== 'settings' && (
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

export default SuperAdminView;

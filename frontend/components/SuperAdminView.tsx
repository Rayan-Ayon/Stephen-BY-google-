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
                                <h3 className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 mb-4">
                                    Trust Gate — Core Pending Verifications Queue
                                </h3>
                                <div className="space-y-3">
                                    {pendingTenants.map(t => (
                                        <div key={t.email} className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
                                            <div className="min-w-0 flex-1 mr-3">
                                                <p className="text-sm font-medium text-white">{t.name}</p>
                                                <p className="text-xs text-neutral-500">{t.org}</p>
                                                <p className="text-xs text-neutral-600 truncate">{t.email}</p>
                                            </div>
                                            <div className="shrink-0 mr-3">
                                                <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                                                    t.status === 'pending'
                                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                }`}>
                                                    {t.status === 'pending' ? 'Pending Verification Review' : 'Automated Check Cleared'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button className="text-xs font-medium text-red-400 hover:bg-red-950/20 px-3 py-1.5 rounded-lg border border-neutral-800 transition-all">
                                                    <XIcon className="w-3 h-3 inline mr-1" />
                                                    Deny
                                                </button>
                                                <button className="text-xs font-semibold text-black bg-white hover:bg-neutral-200 px-4 py-1.5 rounded-lg transition-all">
                                                    <CheckIcon className="w-3 h-3 inline mr-1" />
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

                {currentSubView !== 'dashboard_main' && currentSubView !== 'billing_metrics' && (
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

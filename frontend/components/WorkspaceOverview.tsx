
import React from 'react';
import {
    CubeIcon, CalendarIcon, BookOpenIcon, MicIcon,
    HeadphonesIcon, PenIcon, TargetIcon, ClockIcon,
    FireIcon, LightningIcon
} from './icons';

interface WorkspaceOverviewProps {
    userEmail: string;
    onNavigate: (view: string) => void;
}

const WorkspaceOverview: React.FC<WorkspaceOverviewProps> = ({ userEmail, onNavigate }) => {
    const username = userEmail.split('@')[0] || 'Admin';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'GOOD MORNING';
        if (hour < 17) return 'GOOD AFTERNOON';
        return 'GOOD EVENING';
    };

    const skillPerformance = [
        { label: 'Listening', band: 7.5, icon: HeadphonesIcon, color: '#F97316', pct: 75 },
        { label: 'Reading', band: 6.5, icon: BookOpenIcon, color: '#3B82F6', pct: 65 },
        { label: 'Writing', band: 5.5, icon: PenIcon, color: '#10B981', pct: 55, bottleneck: true },
        { label: 'Speaking', band: 6.5, icon: MicIcon, color: '#A855F7', pct: 65 },
    ];

    const kpis = [
        { label: 'TOTAL ENROLLED SEATS', value: '1,420 / 2,000', sub: 'Active', bar: 71, barColor: 'bg-[#FF4D4D]' },
        { label: 'BATCH ESTIMATED BAND', value: '6.8 Band', sub: 'Target: 7.5', delta: '-0.7 Gap', deltaColor: 'text-[#F59E0B]' },
        { label: 'EVALUATION QUEUE', value: '18', sub: 'Pending Items', detail: '12 OCR | 6 Audio', detailColor: 'text-[#F59E0B]' },
        { label: 'CRITICAL AT-RISK RADAR', value: '5', sub: 'Flagged Candidates', badge: 'Requires Action', badgeColor: 'bg-[#EF4444]' },
    ];

    const quickActions = [
        { label: 'Assign Daily Mission', icon: '⚡', key: 'study_plan' },
        { label: 'Deploy Cambridge Test', icon: '📑', key: 'mock_tests' },
        { label: 'Top-up AI Coins', icon: '🪙', key: 'pricing' },
        { label: 'Add Candidate', icon: '👥', key: 'add_content' },
    ];

    return (
        <div className="p-6 space-y-6" style={{ backgroundColor: '#0A0B0D' }}>

            {/* ═══════════════════════════════════════════
                HEADER SLUG
            ═══════════════════════════════════════════ */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🏢</span>
                    <h1 className="text-[22px] font-extrabold text-white tracking-tight">Farmgate Branch Command Center</h1>
                </div>
                <span className="text-[#A0A6B2] text-sm font-medium">// IELTS AI Operational Node Space</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap text-[12px]">
                <span className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block"></span>
                    SYSTEM ONLINE
                </span>
                <span className="text-[#A0A6B2]">|</span>
                <span className="text-[#A0A6B2]">Active Batch Focus: <span className="text-white font-semibold">EXEC-BATCH-2026</span></span>
                <span className="text-[#A0A6B2]">|</span>
                <span className="text-[#A0A6B2]">Last Synced: <span className="text-white font-medium">2 mins ago</span></span>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION 1: MASTER METRIC KPI STRIP
            ═══════════════════════════════════════════ */}
            <div className="grid grid-cols-4 gap-3">
                {kpis.map((kpi, i) => (
                    <div key={i} className="rounded-2xl p-5 flex flex-col justify-between min-h-[130px]" style={{ backgroundColor: '#121316', border: '1px solid #1E2026' }}>
                        <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#A0A6B2] mb-2">{kpi.label}</p>
                            <p className="text-[28px] font-extrabold text-white leading-none mb-1">{kpi.value}</p>
                            <p className="text-[12px] text-[#A0A6B2]">{kpi.sub}</p>
                        </div>
                        {kpi.bar !== undefined && (
                            <div className="mt-3">
                                <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#1E2026' }}>
                                    <div className={`h-full rounded-full ${kpi.barColor}`} style={{ width: `${kpi.bar}%` }}></div>
                                </div>
                                <p className="text-[11px] text-[#A0A6B2] mt-1">{kpi.bar}%</p>
                            </div>
                        )}
                        {kpi.delta && (
                            <p className={`text-[13px] font-semibold mt-2 ${kpi.deltaColor}`}>Delta: {kpi.delta}</p>
                        )}
                        {kpi.detail && (
                            <p className="text-[12px] text-[#A0A6B2] mt-2">[ {kpi.detail} ]</p>
                        )}
                        {kpi.badge && (
                            <span className="mt-2 inline-flex items-center gap-1 bg-[#EF4444]/15 text-[#EF4444] text-[11px] font-bold px-2.5 py-1 rounded-full w-fit">
                                🔴 {kpi.badge}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* ═══════════════════════════════════════════
                SECTION 2: DUAL-COLUMN OPERATIONAL CONTROL CENTER
            ═══════════════════════════════════════════ */}
            <div className="grid grid-cols-2 gap-4">

                {/* LEFT COLUMN: BATCH TELEMETRY & MODULE ACCURACY */}
                <div className="rounded-2xl p-6" style={{ backgroundColor: '#121316', border: '1px solid #1E2026' }}>
                    <h2 className="text-[13px] font-bold tracking-widest uppercase text-[#FF4D4D] mb-5">📊 SKILL PERFORMANCE BREAKDOWN (COHORT AVG)</h2>

                    <div className="space-y-4 mb-8">
                        {skillPerformance.map((skill) => {
                            const Icon = skill.icon;
                            return (
                                <div key={skill.label} className="flex items-center gap-3">
                                    <Icon className="w-4 h-4 shrink-0" style={{ color: skill.color }} />
                                    <span className="text-white text-[13px] font-medium w-20">{skill.label}</span>
                                    <span className="text-[#A0A6B2] text-[13px] font-mono w-16">Band {skill.band}</span>
                                    <div className="flex-1 h-2.5 rounded-full" style={{ backgroundColor: '#1E2026' }}>
                                        <div className="h-full rounded-full" style={{ width: `${skill.pct}%`, backgroundColor: skill.color }}></div>
                                    </div>
                                    {skill.bottleneck && (
                                        <span className="text-[#F59E0B] text-[11px] font-bold ml-1">⚠️ BOTTLENECK</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <h3 className="text-[13px] font-bold tracking-widest uppercase text-[#A0A6B2] mb-3">📈 DAILY CANDIDATE ENGAGEMENT HEATMAP</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[#10B981] text-lg">🟢</span>
                            <p className="text-white text-[13px]"><span className="font-bold">1,180</span> Students completed daily mission today</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#F59E0B] text-lg">🟡</span>
                            <p className="text-white text-[13px]">Peak practice window: <span className="font-bold font-mono">08:00 PM - 10:30 PM</span></p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: LIVE EVALUATION & URGENT ALERTS */}
                <div className="rounded-2xl p-6" style={{ backgroundColor: '#121316', border: '1px solid #1E2026' }}>
                    <h2 className="text-[13px] font-bold tracking-widest uppercase text-[#EF4444] mb-5">🚨 IMMEDIATE ACTION ITEMS</h2>

                    <div className="space-y-5">
                        {/* Alert 1: OCR Essays */}
                        <div className="rounded-xl p-4" style={{ backgroundColor: '#0A0B0D', border: '1px solid #1E2026' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[#EF4444] text-sm font-bold">🔴</span>
                                <span className="text-white text-[14px] font-bold">[12 Pending OCR Essays]</span>
                            </div>
                            <p className="text-[#A0A6B2] text-[13px] mb-3">Tanvir Hossain &amp; 11 others waiting for review.</p>
                            <button
                                onClick={() => onNavigate('writing_lab')}
                                className="text-[12px] font-bold text-[#FF4D4D] hover:underline"
                            >
                                [ Action: Open Evaluation Studio Queue ]
                            </button>
                        </div>

                        {/* Alert 2: AI Coin Reserve */}
                        <div className="rounded-xl p-4" style={{ backgroundColor: '#0A0B0D', border: '1px solid #1E2026' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[#F59E0B] text-sm font-bold">🟡</span>
                                <span className="text-white text-[14px] font-bold">[AI Coin Reserve Warning]</span>
                            </div>
                            <p className="text-[#A0A6B2] text-[13px] mb-3">45,200 Coins remaining (~1,800 evaluations).</p>
                            <button
                                onClick={() => onNavigate('pricing')}
                                className="text-[12px] font-bold text-[#FF4D4D] hover:underline"
                            >
                                [ Action: Top-Up Credits ]
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION 3: QUICK LAUNCHPAD ACTIONS
            ═══════════════════════════════════════════ */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: '#121316', border: '1px solid #1E2026' }}>
                <div className="flex items-center gap-6 flex-wrap">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-[#A0A6B2] shrink-0">QUICK ACTIONS:</span>
                    {quickActions.map((action) => (
                        <button
                            key={action.key}
                            onClick={() => onNavigate(action.key)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:brightness-110"
                            style={{ backgroundColor: '#F04438', color: '#fff' }}
                        >
                            <span>{action.icon}</span>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION 4: COHORT PERFORMANCE SUMMARY (Additional depth)
            ═══════════════════════════════════════════ */}
            <div className="grid grid-cols-3 gap-4">
                {/* Active Cohorts */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: '#121316', border: '1px solid #1E2026' }}>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#A0A6B2] mb-3">ACTIVE COHORTS</p>
                    <p className="text-[32px] font-extrabold text-white leading-none mb-1">12</p>
                    <p className="text-[12px] text-[#A0A6B2] mb-4">Running batches across branches</p>
                    <div className="space-y-2">
                        {[
                            { name: 'EXEC-BATCH-2026', students: 180, band: 7.2 },
                            { name: 'MORNING-ELITE', students: 95, band: 6.8 },
                            { name: 'WEEKEND-WARRIORS', students: 140, band: 6.5 },
                        ].map((batch) => (
                            <div key={batch.name} className="flex items-center justify-between py-2 border-t" style={{ borderColor: '#1E2026' }}>
                                <span className="text-white text-[12px] font-semibold">{batch.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#A0A6B2] text-[11px]">{batch.students} students</span>
                                    <span className="text-[#10B981] text-[11px] font-bold font-mono">Band {batch.band}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Evaluation Pipeline */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: '#121316', border: '1px solid #1E2026' }}>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#A0A6B2] mb-3">EVALUATION PIPELINE</p>
                    <p className="text-[32px] font-extrabold text-white leading-none mb-1">142</p>
                    <p className="text-[12px] text-[#A0A6B2] mb-4">Items pending across all evaluators</p>
                    <div className="space-y-3">
                        {[
                            { type: 'OCR Essay Scans', count: 89, color: '#EF4444' },
                            { type: 'Speaking Audio Reviews', count: 34, color: '#F59E0B' },
                            { type: 'AI Flagged for Manual', count: 19, color: '#FF4D4D' },
                        ].map((item) => (
                            <div key={item.type}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-white text-[12px]">{item.type}</span>
                                    <span className="text-[12px] font-bold font-mono" style={{ color: item.color }}>{item.count}</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#1E2026' }}>
                                    <div className="h-full rounded-full" style={{ width: `${(item.count / 142) * 100}%`, backgroundColor: item.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Telemetry */}
                <div className="rounded-2xl p-5" style={{ backgroundColor: '#121316', border: '1px solid #1E2026' }}>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#A0A6B2] mb-3">SYSTEM TELEMETRY</p>
                    <div className="space-y-3">
                        {[
                            { label: 'AI Engine Status', value: 'Operational', color: '#10B981', icon: '🟢' },
                            { label: 'OCR Pipeline', value: '98.2% Accuracy', color: '#10B981', icon: '🟢' },
                            { label: 'Speech-to-Text', value: 'Active', color: '#10B981', icon: '🟢' },
                            { label: 'Coin Burn Rate', value: '~1,800/day', color: '#F59E0B', icon: '🟡' },
                            { label: 'Last Full Backup', value: '2 hours ago', color: '#A0A6B2', icon: '⚪' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-1.5">
                                <div className="flex items-center gap-2">
                                    <span>{item.icon}</span>
                                    <span className="text-white text-[12px]">{item.label}</span>
                                </div>
                                <span className="text-[12px] font-semibold font-mono" style={{ color: item.color }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SECTION 5: RECENT ACTIVITY FEED
            ═══════════════════════════════════════════ */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: '#121316', border: '1px solid #1E2026' }}>
                <p className="text-[10px] font-bold tracking-widest uppercase text-[#A0A6B2] mb-4">LIVE ACTIVITY FEED</p>
                <div className="space-y-3">
                    {[
                        { time: '2 min ago', text: 'Tanvir Hossain submitted Writing Task 2 essay for OCR scan', tag: 'WRITING', tagColor: '#10B981' },
                        { time: '8 min ago', text: 'EXEC-BATCH-2026: 14 students completed Listening Section 3 drill', tag: 'LISTENING', tagColor: '#F97316' },
                        { time: '15 min ago', text: 'AI flagged Speaking sample from Morium Akter — Fluency below threshold', tag: 'SPEAKING', tagColor: '#A855F7' },
                        { time: '22 min ago', text: 'Cambridge IELTS 18 Test 3 deployed to MORNING-ELITE batch', tag: 'MOCK TEST', tagColor: '#FF4D4D' },
                        { time: '31 min ago', text: 'Rakibul Hasan achieved Band 7.5 in full mock — top scorer this week', tag: 'ACHIEVEMENT', tagColor: '#F59E0B' },
                    ].map((event, i) => (
                        <div key={i} className="flex items-start gap-4 py-3 border-t" style={{ borderColor: '#1E2026' }}>
                            <span className="text-[11px] text-[#A0A6B2] font-mono shrink-0 w-20 pt-0.5">{event.time}</span>
                            <div className="flex-1">
                                <p className="text-white text-[13px]">{event.text}</p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: `${event.tagColor}20`, color: event.tagColor }}>{event.tag}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                FOOTER: OPERATIONAL STATUS BAR
            ═══════════════════════════════════════════ */}
            <div className="flex items-center justify-between py-3 px-5 rounded-xl text-[11px]" style={{ backgroundColor: '#121316', border: '1px solid #1E2026' }}>
                <div className="flex items-center gap-4">
                    <span className="text-[#10B981] font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block"></span>
                        All Systems Operational
                    </span>
                    <span className="text-[#A0A6B2]">Uptime: 99.97%</span>
                </div>
                <div className="flex items-center gap-4 text-[#A0A6B2]">
                    <span>API Calls Today: <span className="text-white font-mono font-semibold">12,847</span></span>
                    <span>Active Sessions: <span className="text-white font-mono font-semibold">342</span></span>
                    <span>Queue Depth: <span className="text-white font-mono font-semibold">18</span></span>
                </div>
            </div>

        </div>
    );
};

export default WorkspaceOverview;

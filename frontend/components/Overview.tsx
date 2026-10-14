import React, { useState, useEffect, useCallback } from 'react';
import DashboardTopHeader from './DashboardTopHeader';
import {
    FireIcon, LightningIcon, XIcon,
    PlayCircleIcon, CalendarIcon, BookOpenIcon, MicIcon,
    HeadphonesIcon, PenIcon, TargetIcon, ClockIcon
} from './icons';
import { supabase } from '../supabaseClient';
import { StudyPlanOnboardingWizard } from './study-plan/StudyPlanOnboardingWizard';

interface OverviewMetrics {
    user_email: string;
    overall_band: number | null;
    skills: {
        reading: number | null;
        listening: number | null;
        writing: number | null;
        speaking: number | null;
    };
    day_streak: number;
    practice_time_7d_min: number;
    practice_time_total_min: number;
    total_xp: number;
    questions_answered: number;
    accuracy_rate: number | null;
    todays_tasks: any[];
    consistency: Array<{
        day_number: number;
        date: string;
        is_today: boolean;
        status: 'completed' | 'partial' | 'missed' | 'no_activity';
    }>;
    mihu_guidance: {
        headline: string;
        body: string;
        weak_module: string;
    };
}

interface OverviewProps {
    userEmail: string;
    onNavigate: (view: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ userEmail, onNavigate }) => {
    const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Tour state
    const [tourDismissed, setTourDismissed] = useState(() => {
        try {
            return localStorage.getItem('dashboard_tour_dismissed') === 'true';
        } catch {
            return false;
        }
    });
    const [isTourModalOpen, setIsTourModalOpen] = useState(false);

    // Diagnostic Wizard Modal State
    const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);

    // Suggest Feature Modal & Upvotes State
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [newFeatureTitle, setNewFeatureTitle] = useState('');
    const [newFeatureDesc, setNewFeatureDesc] = useState('');
    const [features, setFeatures] = useState([
        { id: 1, text: 'Explanations for reading and listening answers', count: 36, userUpvoted: false },
        { id: 2, text: 'Remove glitches and add an active hotline number', count: 6, userUpvoted: false },
        { id: 3, text: 'Remove bugs and glitches', count: 4, userUpvoted: false },
    ]);

    // Load Telemetry from Backend Unified Endpoint
    const loadMetrics = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/overview/metrics', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (res.ok) {
                const data: OverviewMetrics = await res.json();
                setMetrics(data);
            }
        } catch (err) {
            console.error('Failed to load overview metrics:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);

    const effectiveEmail = metrics?.user_email || userEmail || '';
    const username = effectiveEmail.split('@')[0] || 'Scholar';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'GOOD MORNING';
        if (hour < 17) return 'GOOD AFTERNOON';
        return 'GOOD EVENING';
    };

    // Handle dismissing the tour card
    const handleDismissTour = () => {
        setTourDismissed(true);
        try {
            localStorage.setItem('dashboard_tour_dismissed', 'true');
        } catch {
            // ignore
        }
    };

    // Ask Mihu: Navigate to Rayan Chatbot pre-populated with weakness inquiry
    const handleAskMihu = () => {
        const weakMod = metrics?.mihu_guidance?.weak_module || 'speaking';
        const prompt = `Mihu, how can I improve my performance in ${weakMod}?`;
        try {
            sessionStorage.setItem('pending_rayan_prompt', prompt);
            localStorage.setItem('pending_rayan_prompt', prompt);
        } catch {
            // ignore
        }
        onNavigate('ai_ielts_chatbot');
    };

    // Handle Upvoting a Feature
    const handleToggleUpvote = (id: number) => {
        setFeatures(prev => prev.map(f => {
            if (f.id === id) {
                return {
                    ...f,
                    count: f.userUpvoted ? f.count - 1 : f.count + 1,
                    userUpvoted: !f.userUpvoted
                };
            }
            return f;
        }));
    };

    // Handle Submitting a New Feature Suggestion
    const handleAddFeature = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFeatureTitle.trim()) return;

        const newEntry = {
            id: Date.now(),
            text: newFeatureTitle.trim(),
            count: 1,
            userUpvoted: true
        };

        setFeatures(prev => [newEntry, ...prev]);
        setNewFeatureTitle('');
        setNewFeatureDesc('');
        setIsFeatureModalOpen(false);
    };

    // Route a task to appropriate module
    const handleStartTask = (task: any) => {
        const mod = (task?.module || '').toLowerCase();
        if (mod.includes('speak')) {
            onNavigate('speaking_studio');
        } else if (mod.includes('writ')) {
            onNavigate('writing_lab');
        } else if (mod.includes('read')) {
            onNavigate('reading_hub');
        } else if (mod.includes('listen')) {
            onNavigate('listening_engine');
        } else {
            onNavigate('study_plan');
        }
    };

    // Route for "Continue learning →"
    const handleContinueLearning = () => {
        const uncompleted = metrics?.todays_tasks?.find(t => !t.is_completed);
        if (uncompleted) {
            handleStartTask(uncompleted);
        } else {
            onNavigate('study_plan');
        }
    };

    const completedTasksCount = metrics?.todays_tasks?.filter(t => t.is_completed).length || 0;
    const totalTasksCount = metrics?.todays_tasks?.length || 0;

    // Consistency Days Grid (Fallback if metrics not yet loaded)
    const consistencyDays = metrics?.consistency || [
        { day_number: 27, is_today: false, status: 'no_activity' },
        { day_number: 28, is_today: false, status: 'no_activity' },
        { day_number: 29, is_today: false, status: 'no_activity' },
        { day_number: 30, is_today: false, status: 'no_activity' },
        { day_number: 31, is_today: false, status: 'no_activity' },
        { day_number: 1, is_today: false, status: 'no_activity' },
        { day_number: 2, is_today: false, status: 'no_activity' },
        { day_number: 3, is_today: false, status: 'no_activity' },
        { day_number: 4, is_today: false, status: 'no_activity' },
        { day_number: 5, is_today: false, status: 'no_activity' },
        { day_number: 6, is_today: false, status: 'completed' },
        { day_number: 7, is_today: false, status: 'completed' },
        { day_number: 8, is_today: false, status: 'missed' },
        { day_number: 9, is_today: true, status: 'no_activity' },
    ];

    // SVG Donut calculation
    const overallBandVal = metrics?.overall_band;
    const donutCircumference = 213.6;
    const donutOffset = overallBandVal != null
        ? Math.max(0, donutCircumference - (donutCircumference * (overallBandVal / 9.0)))
        : donutCircumference;

    return (
        <div className="w-full min-h-screen bg-[#0D0F12] text-slate-100 p-6 space-y-6 font-sans">

            {/* ═══════════════════════════════════════════
                1. TOP HEADER BAR
                (Spans 100% Width Across Both Columns)
            ═══════════════════════════════════════════ */}
            <div className="w-full">
                <DashboardTopHeader userEmail={userEmail} onNavigate={onNavigate} />
            </div>

            {/* ═══════════════════════════════════════════
                2. MAIN 2-COLUMN DASHBOARD GRID
            ═══════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* ═══════════════════════════════════════════
                    LEFT COLUMN: Main Feed (lg:col-span-8)
                ═══════════════════════════════════════════ */}
                <div className="lg:col-span-8 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2 custom-scrollbar">

                    {/* 1. Header Greeting Area */}
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-gray-400 text-[11px] font-semibold tracking-widest uppercase mb-1">{getGreeting()}</p>
                            <h1 className="text-[32px] font-bold text-white leading-tight">Welcome back, {username}!</h1>
                            <p className="text-gray-400 text-sm mt-1">A little practice today. A step closer to your dream score.</p>
                        </div>
                        <button
                            onClick={() => onNavigate('study_plan')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300 text-sm font-medium hover:text-white hover:border-slate-600 transition-all shadow-sm"
                        >
                            <CalendarIcon className="w-4 h-4" />
                            View study plan
                        </button>
                    </div>

                    {/* 2. 4-Card Top Telemetry Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {/* Overall Band */}
                        <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 relative shadow-sm">
                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#2C1819] flex items-center justify-center">
                                <TargetIcon className="w-4 h-4 text-[#FF4D4D]" />
                            </div>
                            <p className="text-gray-400 text-[13px] mb-3">Overall Band</p>
                            <p className="text-[28px] font-bold text-white leading-none mb-1">
                                {metrics?.overall_band != null ? `Band ${metrics.overall_band}` : '—'}
                            </p>
                            <p className="text-gray-500 text-[12px]">
                                {metrics?.overall_band != null ? 'Current Estimated Band' : 'Take a test to see your band score'}
                            </p>
                        </div>

                        {/* Day Streak */}
                        <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 relative shadow-sm">
                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#261F18] flex items-center justify-center">
                                <FireIcon className="w-4 h-4 text-[#F59E0B]" />
                            </div>
                            <p className="text-gray-400 text-[13px] mb-3">Day Streak</p>
                            <p className="text-[28px] font-bold text-white leading-none mb-1">
                                {metrics?.day_streak ?? 0} <span className="text-[14px] font-normal text-gray-400">days</span>
                            </p>
                            <p className="text-gray-500 text-[12px]">
                                {metrics?.day_streak ? 'Keep the momentum going' : 'Start your streak today'}
                            </p>
                        </div>

                        {/* Practice Time */}
                        <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 relative shadow-sm">
                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#142921] flex items-center justify-center">
                                <ClockIcon className="w-4 h-4 text-[#10B981]" />
                            </div>
                            <p className="text-gray-400 text-[13px] mb-1">Practice time</p>
                            <p className="text-[11px] text-[#10B981] font-medium mb-1">Last 7 days</p>
                            <p className="text-[28px] font-bold text-white leading-none mb-3">
                                {metrics?.practice_time_7d_min ?? 0} <span className="text-[14px] font-normal text-gray-400">min</span>
                            </p>
                            <div className="border-t border-[#222732] pt-2 flex items-center justify-between">
                                <span className="text-gray-500 text-[11px]">Total tracked</span>
                                <span className="text-gray-400 text-[11px] font-medium">{metrics?.practice_time_total_min ?? 0} min</span>
                            </div>
                        </div>

                        {/* Total Experience */}
                        <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 relative shadow-sm">
                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#21182B] flex items-center justify-center">
                                <LightningIcon className="w-4 h-4 text-[#A855F7]" />
                            </div>
                            <p className="text-gray-400 text-[13px] mb-3">Total experience</p>
                            <p className="text-[28px] font-bold text-white leading-none mb-1">{metrics?.total_xp ?? 0} XP</p>
                            <p className="text-gray-500 text-[12px]">Every effort adds up</p>
                        </div>
                    </div>

                    {/* 3. Video Walkthrough Tour Card */}
                    {!tourDismissed && (
                        <div className="rounded-2xl bg-[#161316] border border-[#2A1B1E] p-5 flex flex-col sm:flex-row gap-5 relative">
                            <button
                                onClick={handleDismissTour}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                                title="Dismiss tour"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>

                            {/* Video Thumbnail */}
                            <div
                                onClick={() => setIsTourModalOpen(true)}
                                className="w-[180px] shrink-0 cursor-pointer group"
                            >
                                <div className="relative rounded-xl overflow-hidden bg-[#222732] aspect-video group-hover:scale-105 transition-transform">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-11 h-11 rounded-full bg-[#E11D48]/80 group-hover:bg-[#E11D48] flex items-center justify-center transition-colors">
                                            <PlayCircleIcon className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                        5:38
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-1 bg-[#32181C] text-[#E11D48] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit mb-3">
                                    <span>🧭</span> NEW HERE?
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">Take the 5-minute IELTSly dashboard tour</h3>
                                <p className="text-gray-400 text-[13px] mb-4">Learn the diagnostic test, content library, and every feature in one quick walkthrough.</p>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <button
                                        onClick={() => setIsTourModalOpen(true)}
                                        className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer"
                                    >
                                        <PlayCircleIcon className="w-4 h-4" />
                                        Watch the tour
                                    </button>
                                    <button
                                        onClick={() => onNavigate('free_content_library')}
                                        className="text-[#FF4D4D] text-sm font-semibold hover:underline cursor-pointer"
                                    >
                                        See all 10 tutorials →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Your Next Chapter Banner */}
                    <div className="rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1F1113 0%, #141113 100%)' }}>
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-30">
                            <div className="w-48 h-48 rounded-full border-[3px] border-[#FF4D4D]/30 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border-[2px] border-[#FF4D4D]/20 flex items-center justify-center">
                                    <span className="text-5xl">🐦</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 p-8 max-w-lg">
                            <p className="text-[#FF4D4D] text-[11px] font-bold tracking-widest uppercase mb-3">YOUR NEXT CHAPTER</p>
                            <h2 className="text-[32px] font-extrabold text-white leading-tight mb-3">
                                Big dreams.<br />Small daily steps.
                            </h2>
                            <p className="text-[#A0A6B2] text-[13px] mb-5">Your next band starts with today's practice. Let's make it count, together.</p>
                            <button
                                onClick={handleContinueLearning}
                                className="bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-semibold px-6 py-3 rounded-full transition-all shadow-md cursor-pointer"
                            >
                                Continue learning →
                            </button>
                        </div>
                    </div>

                    {/* 5. Practice Skills Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Make time for your skills</h3>
                                <p className="text-gray-400 text-[13px]">Four skills. One step closer to your goal.</p>
                            </div>
                            <button
                                onClick={() => onNavigate('part_practice')}
                                className="text-[#FF4D4D] text-sm font-semibold hover:underline"
                            >
                                All tests →
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { key: 'reading_hub', module: 'reading', label: 'Reading', icon: BookOpenIcon, iconBg: '#1E293B', iconColor: '#3B82F6', linkColor: 'text-[#3B82F6]' },
                                { key: 'listening_engine', module: 'listening', label: 'Listening', icon: HeadphonesIcon, iconBg: '#2E1E18', iconColor: '#F97316', linkColor: 'text-[#F97316]' },
                                { key: 'writing_lab', module: 'writing', label: 'Writing', icon: PenIcon, iconBg: '#142E23', iconColor: '#10B981', linkColor: 'text-[#10B981]' },
                                { key: 'speaking_studio', module: 'speaking', label: 'Speaking', icon: MicIcon, iconBg: '#261B33', iconColor: '#A855F7', linkColor: 'text-[#A855F7]' },
                            ].map((skill) => {
                                const Icon = skill.icon;
                                const score = metrics?.skills?.[skill.module as keyof typeof metrics.skills];
                                const scoreText = score != null ? `Band ${score}` : 'No score yet';

                                return (
                                    <div key={skill.key} className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 flex flex-col shadow-sm">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: skill.iconBg }}>
                                            <Icon className="w-5 h-5" style={{ color: skill.iconColor }} />
                                        </div>
                                        <h4 className="text-[14px] font-bold text-white mb-0.5">{skill.label}</h4>
                                        <p className="text-[12px] text-gray-500 mb-3">{scoreText}</p>
                                        <button
                                            onClick={() => onNavigate(skill.key)}
                                            className={`text-[13px] font-semibold ${skill.linkColor} hover:underline mt-auto text-left cursor-pointer`}
                                        >
                                            Practice →
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 6. Today's Tasks */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">Today's Tasks</h3>
                                <p className="text-gray-400 text-[13px]">
                                    Your tasks for today ({completedTasksCount}/{totalTasksCount} completed)
                                </p>
                            </div>
                            <button
                                onClick={() => onNavigate('study_plan')}
                                className="text-[#FF4D4D] text-sm font-semibold hover:underline"
                            >
                                View plan →
                            </button>
                        </div>

                        {metrics?.todays_tasks && metrics.todays_tasks.length > 0 ? (
                            <div className="space-y-3">
                                {metrics.todays_tasks.map((task: any, idx: number) => {
                                    const mod = (task.module || '').toLowerCase();
                                    const isSpeak = mod.includes('speak');
                                    const isWrite = mod.includes('writ');
                                    const isRead = mod.includes('read');

                                    const IconComponent = isSpeak ? MicIcon : isWrite ? PenIcon : isRead ? BookOpenIcon : HeadphonesIcon;
                                    const iconBg = isSpeak ? 'bg-purple-500/10 border-purple-500/20 text-[#A855F7]'
                                        : isWrite ? 'bg-emerald-500/10 border-emerald-500/20 text-[#10B981]'
                                        : isRead ? 'bg-blue-500/10 border-blue-500/20 text-[#3B82F6]'
                                        : 'bg-orange-500/10 border-orange-500/20 text-[#F97316]';

                                    return (
                                        <div key={task.id || idx} className="rounded-2xl bg-[#15181E] border border-[#222732] p-4 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconBg}`}>
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-semibold text-white">{task.title}</p>
                                                    <p className="text-[12px] text-gray-400 flex items-center gap-1.5 capitalize">
                                                        {task.module || 'IELTS'} · {task.estimated_minutes || 30} min
                                                    </p>
                                                </div>
                                            </div>
                                            {task.is_completed ? (
                                                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                                                    Completed ✓
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleStartTask(task)}
                                                    className="bg-[#1D1B26] hover:bg-[#252330] text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 border border-[#222732] cursor-pointer"
                                                >
                                                    Start <span className="text-[#F59E0B]">⚡</span> +20 XP →
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-6 text-center space-y-3">
                                <p className="text-gray-300 text-sm font-medium">All caught up! Check your Study Plan for upcoming missions.</p>
                                <button
                                    onClick={() => onNavigate('study_plan')}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1A1D24] hover:bg-[#222732] border border-[#2A2E3B] text-rose-400 hover:text-rose-300 text-xs font-semibold transition-all"
                                >
                                    Go to Study Plan →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 7. Guidance from Mihu */}
                    <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#2C1517] border border-rose-500/20 flex items-center justify-center shrink-0">
                                <span className="text-lg">🐦</span>
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-white">A little guidance from Mihu</h3>
                                <p className="text-[11px] text-gray-400">Personalized insights powered by AI</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 mb-4">
                            <p className="text-[15px] font-bold text-white">
                                {metrics?.mihu_guidance?.headline || 'Keep practicing consistently across all four skills'}
                            </p>
                            <p className="text-[13px] text-gray-400">
                                {metrics?.mihu_guidance?.body || 'Complete your diagnostic test or first mock test to unlock personalized AI recommendations.'}
                            </p>
                            <p className="text-[13px] text-gray-400">Among the top 19% of learners globally</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#222732]">
                            <p className="text-[11px] text-gray-500">Insights updated daily based on your performance</p>
                            <button
                                onClick={handleAskMihu}
                                className="text-[#FF4D4D] text-[13px] font-semibold hover:underline cursor-pointer"
                            >
                                Ask Mihu →
                            </button>
                        </div>
                    </div>

                    {/* 8. Suggest a Feature */}
                    <div>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-white">Suggest a feature</h3>
                            <p className="text-gray-400 text-[13px]">Share ideas and see what others are asking for</p>
                        </div>

                        <div className="space-y-2 mb-4">
                            {features.map((f) => (
                                <div key={f.id} className="flex items-center justify-between bg-[#15181E] border border-[#222732] rounded-xl px-4 py-3">
                                    <p className="text-[13px] text-gray-300 flex-1 mr-3">{f.text}</p>
                                    <button
                                        onClick={() => handleToggleUpvote(f.id)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                                            f.userUpvoted
                                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                                                : 'text-gray-500 hover:text-gray-300 bg-[#1A1D24] border border-[#222732]'
                                        }`}
                                    >
                                        <span>👥</span> {f.count} interested
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsFeatureModalOpen(true)}
                                className="text-[13px] font-semibold text-gray-300 bg-[#1A1D24] border border-[#222732] hover:text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                                + Suggest a feature
                            </button>
                            <button
                                onClick={() => onNavigate('feedback')}
                                className="text-[#FF4D4D] text-[13px] font-semibold hover:underline cursor-pointer"
                            >
                                See all →
                            </button>
                        </div>
                    </div>

                </div>

                {/* ═══════════════════════════════════════════
                    RIGHT COLUMN: Progress & Consistency Sidebar (lg:col-span-4)
                ═══════════════════════════════════════════ */}
                <div className="lg:col-span-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pl-2 custom-scrollbar">

                    {/* 5. "Your progress" CARD */}
                    <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-5 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-[15px] font-bold text-white">Your progress</h3>
                            <p className="text-[11px] text-gray-400">Small steps. Measurable progress.</p>
                        </div>

                        {/* Donut Chart */}
                        <div className="flex items-center gap-4 mb-5">
                            <div className="relative w-20 h-20 shrink-0">
                                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                    <circle cx="40" cy="40" r="34" fill="none" stroke="#1E2026" strokeWidth="6" />
                                    <circle
                                        cx="40"
                                        cy="40"
                                        r="34"
                                        fill="none"
                                        stroke="#FF4D4D"
                                        strokeWidth="6"
                                        strokeDasharray={donutCircumference}
                                        strokeDashoffset={donutOffset}
                                        strokeLinecap="round"
                                        className="transition-all duration-700 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-[18px] font-bold text-white leading-none">
                                        {overallBandVal != null ? overallBandVal : '—'}
                                    </span>
                                    <span className="text-[9px] text-gray-500 mt-0.5">out of 9.0</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[13px] font-medium text-gray-300">Overall Band</p>
                                <p className="text-[11px] text-gray-500">
                                    {overallBandVal != null ? 'Current Estimated Band' : 'Take a test to see your band score'}
                                </p>
                            </div>
                        </div>

                        {/* Skill Breakdown */}
                        <div className="space-y-0">
                            {[
                                { icon: '📖', label: 'Reading', value: metrics?.skills?.reading != null ? `Band ${metrics.skills.reading}` : '—' },
                                { icon: '🎧', label: 'Listening', value: metrics?.skills?.listening != null ? `Band ${metrics.skills.listening}` : '—' },
                                { icon: '✍️', label: 'Writing', value: metrics?.skills?.writing != null ? `Band ${metrics.skills.writing}` : '—' },
                                { icon: '🎙️', label: 'Speaking', value: metrics?.skills?.speaking != null ? `Band ${metrics.skills.speaking}` : '—' },
                            ].map((skill, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#222732] last:border-b-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px]">{skill.icon}</span>
                                        <span className="text-[13px] text-gray-300">{skill.label}</span>
                                    </div>
                                    <span className="text-[13px] text-white font-medium">{skill.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer Stats */}
                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#222732]">
                            <div>
                                <p className="text-[20px] font-bold text-white leading-none">{metrics?.questions_answered ?? 0}</p>
                                <p className="text-[11px] text-gray-500 mt-1">Questions answered</p>
                            </div>
                            <div>
                                <p className="text-[20px] font-bold text-white leading-none">
                                    {metrics?.accuracy_rate != null ? `${metrics.accuracy_rate}%` : '—'}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-1">Accuracy rate</p>
                            </div>
                        </div>

                        <button
                            onClick={() => onNavigate('my_reports')}
                            className="text-[#FF4D4D] text-[13px] font-semibold hover:underline mt-4 block cursor-pointer"
                        >
                            Explore your reports →
                        </button>
                    </div>

                    {/* 6. "Your consistency" CARD */}
                    <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-5 shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-[15px] font-bold text-white">Your consistency</h3>
                            <p className="text-[11px] text-gray-400">Your last 14 days of practice.</p>
                        </div>

                        {/* 7x2 Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {consistencyDays.map((item, i) => {
                                let styleClass = 'bg-[#121316] text-gray-500 border border-transparent';
                                if (item.status === 'completed') {
                                    styleClass = 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50';
                                } else if (item.status === 'partial') {
                                    styleClass = 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/50';
                                } else if (item.status === 'missed') {
                                    styleClass = 'bg-[#E11D48]/15 text-[#E11D48] border border-[#E11D48]/30';
                                }

                                const todayClass = item.is_today ? 'ring-2 ring-rose-500 border-rose-500 text-white font-bold' : '';

                                return (
                                    <div
                                        key={i}
                                        title={`${item.date || 'Day ' + item.day_number}: ${item.status}`}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-[12px] font-medium transition-all ${styleClass} ${todayClass}`}
                                    >
                                        {item.day_number}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-wrap">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                                <span>Completed</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                                <span>Partial</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#E11D48]"></div>
                                <span>Missed</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#3A3D47]"></div>
                                <span>No activity</span>
                            </div>
                        </div>
                    </div>

                    {/* 7. Diagnostic Test CTA Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#1C1518] to-[#15181E] border border-[#3A1F25] p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-[#E11D48]/15 border border-[#E11D48]/30 flex items-center justify-center">
                                <span className="text-base">🎯</span>
                            </div>
                            <div>
                                <h4 className="text-[14px] font-bold text-white">Diagnostic Test</h4>
                                <p className="text-[11px] text-gray-400">10-min comprehensive audit</p>
                            </div>
                        </div>
                        <p className="text-[12px] text-gray-300 mb-4">
                            Pinpoint your exact IELTS band score across Reading, Listening, Writing, and Speaking in 10 minutes.
                        </p>
                        <button
                            onClick={() => setIsDiagnosticModalOpen(true)}
                            className="w-full py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-[13px] font-semibold transition-all shadow-sm cursor-pointer"
                        >
                            Take Diagnostic Test →
                        </button>
                    </div>

                </div>

            </div>

            {/* ═══════════════════════════════════════════
                INTERACTIVE MODALS
            ═══════════════════════════════════════════ */}

            {/* 1. Walkthrough Tour Modal */}
            {isTourModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-3xl bg-[#15181E] border border-[#2A2E3B] rounded-2xl overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222732]">
                            <div className="flex items-center gap-2">
                                <span className="text-rose-500">🧭</span>
                                <h3 className="text-base font-bold text-white">5-Minute IELTSly Dashboard Tour</h3>
                            </div>
                            <button
                                onClick={() => setIsTourModalOpen(false)}
                                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#222732] transition-colors"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                title="IELTSly Dashboard Tour"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="p-4 bg-[#12141A] flex items-center justify-between">
                            <p className="text-xs text-gray-400">Master the diagnostic test, content library, and study plan tools in 5 minutes.</p>
                            <button
                                onClick={() => setIsTourModalOpen(false)}
                                className="px-4 py-1.5 rounded-lg bg-[#222732] hover:bg-[#2A2E3B] text-xs font-semibold text-white transition-colors"
                            >
                                Close Tour
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Suggest a Feature Modal */}
            {isFeatureModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-md bg-[#15181E] border border-[#2A2E3B] rounded-2xl overflow-hidden shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Suggest a Feature</h3>
                            <button
                                onClick={() => setIsFeatureModalOpen(false)}
                                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#222732] transition-colors"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddFeature} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1">Feature Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newFeatureTitle}
                                    onChange={(e) => setNewFeatureTitle(e.target.value)}
                                    placeholder="e.g. Band 8+ Vocabulary Flashcard Deck"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F12] border border-[#222732] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1">Details & Rationale (Optional)</label>
                                <textarea
                                    rows={3}
                                    value={newFeatureDesc}
                                    onChange={(e) => setNewFeatureDesc(e.target.value)}
                                    placeholder="Explain how this feature will help your IELTS preparation..."
                                    className="w-full px-3.5 py-2 rounded-xl bg-[#0D0F12] border border-[#222732] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 resize-none"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFeatureModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-[#1A1D24] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-xs font-semibold text-white transition-colors shadow-sm"
                                >
                                    Submit Idea
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. Take Diagnostic Test Wizard Modal */}
            {isDiagnosticModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
                    <div className="relative w-full max-w-2xl my-8">
                        <StudyPlanOnboardingWizard
                            onPlanCreated={() => {
                                setIsDiagnosticModalOpen(false);
                                loadMetrics();
                            }}
                            onCancel={() => setIsDiagnosticModalOpen(false)}
                            initialValues={{
                                current_band: metrics?.overall_band || 6.0,
                                target_band: 7.5,
                                duration_weeks: 4,
                                daily_minutes: 45,
                                exam_type: 'academic',
                                weak_areas: metrics?.mihu_guidance?.weak_module ? [metrics.mihu_guidance.weak_module] : ['Writing', 'Speaking']
                            }}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default Overview;

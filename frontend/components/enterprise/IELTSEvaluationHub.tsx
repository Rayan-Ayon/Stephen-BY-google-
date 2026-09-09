import React, { useState, useEffect } from 'react';
import { useWorkspace, type Workspace } from '../../workspaceContext';
import IELTSDashboard from './ielts/IELTSDashboard';
import IELTSSimulationRunner from './ielts/IELTSSimulationRunner';
import IELTSWritingExam from './ielts/IELTSWritingExam';
import WritingDashboard from './ielts/WritingDashboard';
import IELTSSpeakingExam from './ielts/IELTSSpeakingExam';
import IELTSListeningExam from './ielts/IELTSListeningExam';
import IELTSReadingExam from './ielts/IELTSReadingExam';
import ModuleHistorySection from './history/ModuleHistorySection';
import IELTSExitModal from './ielts/IELTSExitModal';
import WritingHistoryMatrix from './writing/WritingHistoryMatrix';
import type { IeltsBundleId } from './ielts/ieltsShared';

type IeltsView = 'dashboard' | 'writing' | 'speaking' | 'listening' | 'reading' | IeltsBundleId;
type WritingSubView = 'dashboard' | 'task2-checker-landing' | 'task1-academic-landing' | 'task1-general-landing' | 'task2_checker' | 'task1_academic_checker' | 'task1_general_checker' | 'exam_simulation';

const RAIL_KEY = 'stephen_enterprise_farmgate_ielts_rail';

interface IeltsNavItem {
    key: IeltsView;
    icon: string;
    name: string;
    detail?: string;
}

const PRACTICE_ITEMS: IeltsNavItem[] = [
    { key: 'dashboard', icon: '📊', name: 'Dashboard & Tracker' },
    { key: 'speaking', icon: '🗣️', name: 'Speaking Studio' },
    { key: 'listening', icon: '🎧', name: 'Listening Engine' },
    { key: 'reading', icon: '📖', name: 'Reading Hub' },
];

const SIMULATION_ITEMS: IeltsNavItem[] = [
    { key: 'sprint', icon: '⚡', name: 'Diagnostic Sprint', detail: '50m · L+R' },
    { key: 'express', icon: '🔥', name: 'Express Output', detail: '45m · W+S' },
    { key: 'mock', icon: '🎓', name: 'Full Cambridge Mock', detail: '2h 45m · L+R+W+S' },
];

const readRail = (): boolean => {
    const raw = localStorage.getItem(RAIL_KEY);
    return raw === '1';
};

const FALLBACK_FARMGATE: Workspace = {
    id: 'farmgate',
    type: 'enterprise',
    name: 'Farmgate Executive Batch',
    code: 'FARMGATE-2026',
};

interface IELTSEvaluationHubProps {
    userEmail?: string;
    onExamStateChange?: (active: boolean) => void;
    exitPulse?: boolean;
    onLockedNavigationAttempt?: () => void;
    initialView?: IeltsView;
    initialWritingSubView?: WritingSubView;
    hideInternalNav?: boolean;
}

const IELTSEvaluationHub: React.FC<IELTSEvaluationHubProps> = ({ userEmail, onExamStateChange, exitPulse, onLockedNavigationAttempt, initialView = 'dashboard', initialWritingSubView = 'dashboard', hideInternalNav = false }) => {
    const { activeWorkspace, workspaces, setActiveWorkspace } = useWorkspace();
    const [view, setView] = useState<IeltsView>(initialView);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(readRail);
    const [examRunning, setExamRunning] = useState(false);
    const handleExamActive = (active: boolean) => {
        setExamRunning(active);
        onExamStateChange?.(active);
    };
    const [isSubShaking, setIsSubShaking] = useState(false);
    const [shakingSubKey, setShakingSubKey] = useState<string | null>(null);
    const [exitConfirmKey, setExitConfirmKey] = useState<IeltsView | null>(null);
    const [writingSubView, setWritingSubView] = useState<WritingSubView>(initialWritingSubView);
    const [writingExamMode, setWritingExamMode] = useState<string>('mock');
    const [writingTimeMinutes, setWritingTimeMinutes] = useState<number>(60);
    const [writingLabOpen, setWritingLabOpen] = useState(true);
    const [pendingWritingSubView, setPendingWritingSubView] = useState<WritingSubView | null>(null);
    const guardedSubNavigate = (key: string) => {
        if (examRunning) {
            setShakingSubKey(key);
            setIsSubShaking(true);
            setTimeout(() => setIsSubShaking(false), 600);
            setExitConfirmKey(key as IeltsView);
            onLockedNavigationAttempt?.();
            return;
        }
        setView(key as IeltsView);
    };

    const handleWritingStart = (mode: string, timeMinutes: number) => {
        setWritingExamMode(mode);
        setWritingTimeMinutes(timeMinutes);
        setWritingSubView('exam_simulation');
    };

    useEffect(() => {
        setExamRunning(false);
        if (view !== 'writing') {
            setWritingSubView('dashboard');
        }
    }, [view]);

    const toggleRail = () => {
        setIsCollapsed((c) => {
            localStorage.setItem(RAIL_KEY, c ? '0' : '1');
            return !c;
        });
    };

    const isFarmgate = activeWorkspace.type === 'enterprise' && activeWorkspace.id === 'farmgate';

    if (!isFarmgate) {
        const farmgate = workspaces.find((w) => w.type === 'enterprise' && w.id === 'farmgate') ?? FALLBACK_FARMGATE;
        return (
            <div className="w-full flex justify-center py-8 px-6 overflow-y-auto">
                <div className="w-full max-w-3xl mx-auto space-y-6">
                    <header className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-white">IELTS Evaluation</h1>
                            <p className="text-sm text-neutral-400 mt-1">Full computer-delivered test simulation and band tracking.</p>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 whitespace-nowrap">Enterprise</span>
                    </header>

                    <div className="rounded-2xl border border-neutral-800 bg-surface p-10 text-center">
                        <p className="text-4xl mb-4 opacity-50">🔒</p>
                        <h2 className="text-lg font-semibold tracking-tight text-white">Workspace required</h2>
                        <p className="text-sm text-neutral-400 mt-2 max-w-md mx-auto">
                            IELTS Evaluation lives in the <span className="text-neutral-200">Farmgate Executive Batch</span> enterprise workspace. Switch workspaces to access the exam suite and band tracker.
                        </p>
                        <button
                            onClick={() => setActiveWorkspace(farmgate)}
                            className="mt-6 px-5 py-2.5 rounded-lg bg-white text-black text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-neutral-200"
                        >
                            Switch to Farmgate Executive Batch
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isSimulation = view === 'sprint' || view === 'express' || view === 'mock';

    const renderNavItem = (item: IeltsNavItem) => (
        <button
            key={item.key}
            onClick={() => guardedSubNavigate(item.key)}
            title={isCollapsed ? item.name : undefined}
            className={`relative group w-full flex items-center gap-2 rounded-lg text-left transition-colors ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
            } ${view === item.key ? 'bg-white/[0.06] text-white border border-neutral-800' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}${shakingSubKey === item.key && isSubShaking ? ' animate-[lock-shake_0.6s_ease-in-out] ring-2 ring-rose-500/80' : ''}`}
        >
            <span className="text-[13px] leading-none shrink-0">{item.icon}</span>
            {!isCollapsed && (
                <span className="flex-1 min-w-0">
                    <span className="block text-[13px] truncate">{item.name}</span>
                    {item.detail && <span className="block text-[10px] text-neutral-600 mt-0.5">{item.detail}</span>}
                </span>
            )}
            {isCollapsed && (
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                    {item.name}{item.detail ? ` (${item.detail})` : ''}
                </span>
            )}
            {shakingSubKey === item.key && isSubShaking && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 text-xs">🔒</span>
            )}
         </button>
    );

    return (
        <div className={`flex h-full w-full ${view === 'speaking' ? 'p-0 gap-0' : 'p-8 gap-8'} overflow-hidden`}>
            <style>{`@keyframes lock-shake {0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
            {!hideInternalNav && <aside className={`shrink-0 flex flex-col overflow-hidden transition-[width] duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}>
                <div className={`${isCollapsed ? 'flex items-center justify-center mb-3 pb-3 border-b border-zinc-800' : 'flex flex-col gap-1.5 mb-3 pb-3 border-b border-zinc-800'}`}>
                    {!isCollapsed && (
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1 whitespace-nowrap">Farmgate · Enterprise</span>
                            <button
                                onClick={toggleRail}
                                title="Collapse sidebar"
                                className="shrink-0 rounded-lg border border-neutral-800 bg-surface text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors w-8 h-8 flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                                </svg>
                            </button>
                        </div>
                    )}
                    {!isCollapsed && (
                        <h2 className="text-base font-semibold tracking-tight text-white">IELTS Suite</h2>
                    )}
                    {isCollapsed && (
                        <button
                            onClick={toggleRail}
                            title="Expand sidebar"
                            className="shrink-0 rounded-lg border border-neutral-800 bg-surface text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors w-9 h-9 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                            </svg>
                        </button>
                    )}
                </div>

                {!isCollapsed && (
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1 px-1">Practice Drills</p>
                )}
                <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <nav className="space-y-0.5 mb-3">
                    {PRACTICE_ITEMS.map(renderNavItem)}

                    {/* Writing Lab Accordion */}
                    <div>
                        <button
                            onClick={() => setWritingLabOpen(!writingLabOpen)}
                            title={isCollapsed ? 'Writing Lab' : undefined}
                            className={`relative group w-full flex items-center gap-2 rounded-lg text-left transition-colors ${
                                isCollapsed ? 'justify-center px-0 py-1.5' : 'px-3 py-1.5'
                            } ${view === 'writing' ? 'bg-white/[0.06] text-white border border-neutral-800' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}${shakingSubKey === 'writing' && isSubShaking ? ' animate-[lock-shake_0.6s_ease-in-out] ring-2 ring-rose-500/80' : ''}`}
                        >
                            <span className="text-[13px] leading-none shrink-0">✍️</span>
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-[13px] truncate">Writing Lab</span>
                                    </span>
                                    <svg className={`w-3 h-3 shrink-0 transition-transform ${writingLabOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </>
                            )}
                            {isCollapsed && (
                                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                                    Writing Lab
                                </span>
                            )}
                            {shakingSubKey === 'writing' && isSubShaking && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-400 text-xs">🔒</span>
                            )}
                        </button>

                        {!isCollapsed && writingLabOpen && (
                            <div className="border-l-2 border-slate-700 ml-4 pl-3 space-y-1 mt-1.5 mb-1.5">
                                {[
                                    { key: 'task2-checker-landing', label: 'Task 2 Checker', detail: '40 min' },
                                    { key: 'task1-academic-landing', label: 'Task 1 (Academic) Checker', detail: '20 min' },
                                    { key: 'task1-general-landing', label: 'Task 1 (General) Checker', detail: '20 min' },
                                    { key: 'dashboard', label: 'Practice & Mock Test', detail: '' },
                                ].map((sub) => (
                                    <button
                                        key={sub.key}
                                        onClick={() => {
                                            if (examRunning) {
                                                setShakingSubKey('writing');
                                                setIsSubShaking(true);
                                                setTimeout(() => setIsSubShaking(false), 600);
                                                setPendingWritingSubView(sub.key as WritingSubView);
                                                setExitConfirmKey('writing');
                                                onLockedNavigationAttempt?.();
                                                return;
                                            }
                                            setView('writing');
                                            setWritingSubView(sub.key as WritingSubView);
                                        }}
                                        className={`w-full text-left rounded-md px-3 py-1.5 text-[12px] transition-colors ${
                                            writingSubView === sub.key
                                                ? 'bg-white/[0.08] text-white'
                                                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]'
                                        }`}
                                    >
                                        <span className="block">{sub.label}</span>
                                        {sub.detail && <span className="block text-[10px] text-neutral-600 mt-0.5">{sub.detail}</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>

                {!isCollapsed && (
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1 px-1">Exam Simulations · Timed Bundles</p>
                )}
                <nav className="space-y-0.5">
                    {SIMULATION_ITEMS.map(renderNavItem)}
                </nav>
                </div>

                {!isCollapsed && (
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600 mt-6">
                        Data scope: Farmgate enterprise
                    </p>
                )}
            </aside>}

            <main className={`flex-1 min-w-0 ${view === 'speaking' ? 'bg-white' : ''} ${view === 'speaking' || examRunning ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                {isSimulation ? (
                    <>
                        <IELTSSimulationRunner
                            key={view}
                            bundleId={view as IeltsBundleId}
                            candidateEmail={userEmail}
                            onFinish={() => setView('dashboard')}
                            onActiveChange={handleExamActive}
                            exitPulse={exitPulse}
                        />
                        {!examRunning && (
                            <div className="mt-6">
                                <ModuleHistorySection bundle={view as IeltsBundleId} />
                            </div>
                        )}
                    </>
                ) : view === 'dashboard' ? (
                    <IELTSDashboard />
                ) : (
                    <>
                        {view === 'writing' && writingSubView === 'dashboard' && (
                            <WritingDashboard onStartExam={handleWritingStart} />
                        )}

                        {/* ── Pre-Flight Landing: Task 2 ── */}
                        {view === 'writing' && writingSubView === 'task2-checker-landing' && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setWritingSubView('dashboard')}
                                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                                    </svg>
                                    Back to Writing Dashboard
                                </button>
                                <div className="rounded-2xl bg-surface border border-neutral-800 p-8">
                                    <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Task 2 — Essay Generator & Analysis</h2>
                                    <p className="text-sm text-neutral-400 mb-6">Compose a full 250+ word essay on a discursive prompt with AI-powered evaluation.</p>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-400">⏱ 40 mins</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs font-semibold text-cyan-400">📝 250+ words</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-xs font-semibold text-emerald-400">🎯 Band 7.5+</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {['Keyboard layout verified', 'Timer sync active', 'Auto-save enabled'].map((item) => (
                                            <div key={item} className="flex items-center gap-2 text-xs text-neutral-300 bg-[#0D0D0E] border border-neutral-800 rounded-lg px-3 py-2">
                                                <span className="text-emerald-400">✓</span>{item}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleWritingStart('task2_checker', 40)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
                                    >
                                        ⚡ Start Examination
                                    </button>
                                </div>
                                <WritingHistoryMatrix moduleFilter="task2" />
                            </div>
                        )}

                        {/* ── Pre-Flight Landing: Task 1 Academic ── */}
                        {view === 'writing' && writingSubView === 'task1-academic-landing' && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setWritingSubView('dashboard')}
                                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                                    </svg>
                                    Back to Writing Dashboard
                                </button>
                                <div className="rounded-2xl bg-surface border border-neutral-800 p-8">
                                    <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Task 1 — Academic Report</h2>
                                    <p className="text-sm text-neutral-400 mb-6">Summarise visual data (chart, graph, diagram) in a structured academic report.</p>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-400">⏱ 20 mins</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs font-semibold text-cyan-400">📝 150+ words</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-xs font-semibold text-emerald-400">🎯 Band 7.0+</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {['Keyboard layout verified', 'Timer sync active', 'Auto-save enabled'].map((item) => (
                                            <div key={item} className="flex items-center gap-2 text-xs text-neutral-300 bg-[#0D0D0E] border border-neutral-800 rounded-lg px-3 py-2">
                                                <span className="text-emerald-400">✓</span>{item}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleWritingStart('task1_academic_checker', 20)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
                                    >
                                        ⚡ Start Examination
                                    </button>
                                </div>
                                <WritingHistoryMatrix moduleFilter="task1-academic" />
                            </div>
                        )}

                        {/* ── Pre-Flight Landing: Task 1 General ── */}
                        {view === 'writing' && writingSubView === 'task1-general-landing' && (
                            <div className="space-y-6">
                                <button
                                    onClick={() => setWritingSubView('dashboard')}
                                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                                    </svg>
                                    Back to Writing Dashboard
                                </button>
                                <div className="rounded-2xl bg-surface border border-neutral-800 p-8">
                                    <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Task 1 — General Training Letter</h2>
                                    <p className="text-sm text-neutral-400 mb-6">Write a formal or semi-formal letter responding to a given situation.</p>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-400">⏱ 20 mins</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs font-semibold text-cyan-400">📝 150+ words</span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-xs font-semibold text-emerald-400">🎯 Band 7.0+</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {['Keyboard layout verified', 'Timer sync active', 'Auto-save enabled'].map((item) => (
                                            <div key={item} className="flex items-center gap-2 text-xs text-neutral-300 bg-[#0D0D0E] border border-neutral-800 rounded-lg px-3 py-2">
                                                <span className="text-emerald-400">✓</span>{item}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleWritingStart('task1_general_checker', 20)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
                                    >
                                        ⚡ Start Examination
                                    </button>
                                </div>
                                <WritingHistoryMatrix moduleFilter="task1-general" />
                            </div>
                        )}

                        {/* ── Exam: Task 2 ── */}
                        {view === 'writing' && writingSubView === 'task2_checker' && (
                            <>
                                <div className="mb-4">
                                    <button
                                        onClick={() => setWritingSubView('dashboard')}
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                                        </svg>
                                        Back to Writing Prompts
                                    </button>
                                </div>
                                <IELTSWritingExam
                                    key="writing-t2"
                                    candidateEmail={userEmail}
                                    simulation={{
                                        sectionLabel: 'Task 2 Checker',
                                        timeLimitSeconds: 40 * 60,
                                        onComplete: () => { setWritingSubView('dashboard'); },
                                    }}
                                    onActiveChange={handleExamActive}
                                    exitPulse={exitPulse}
                                />
                            </>
                        )}
                        {view === 'writing' && writingSubView === 'task1_academic_checker' && (
                            <>
                                <div className="mb-4">
                                    <button
                                        onClick={() => setWritingSubView('dashboard')}
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                                        </svg>
                                        Back to Writing Prompts
                                    </button>
                                </div>
                                <IELTSWritingExam
                                    key="writing-t1a"
                                    candidateEmail={userEmail}
                                    simulation={{
                                        sectionLabel: 'Task 1 Academic Checker',
                                        timeLimitSeconds: 20 * 60,
                                        onComplete: () => { setWritingSubView('dashboard'); },
                                    }}
                                    onActiveChange={handleExamActive}
                                    exitPulse={exitPulse}
                                />
                            </>
                        )}
                        {view === 'writing' && writingSubView === 'task1_general_checker' && (
                            <>
                                <div className="mb-4">
                                    <button
                                        onClick={() => setWritingSubView('dashboard')}
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                                        </svg>
                                        Back to Writing Prompts
                                    </button>
                                </div>
                                <IELTSWritingExam
                                    key="writing-t1g"
                                    candidateEmail={userEmail}
                                    simulation={{
                                        sectionLabel: 'Task 1 General Checker',
                                        timeLimitSeconds: 20 * 60,
                                        onComplete: () => { setWritingSubView('dashboard'); },
                                    }}
                                    onActiveChange={handleExamActive}
                                    exitPulse={exitPulse}
                                />
                            </>
                        )}
                        {view === 'writing' && writingSubView === 'exam_simulation' && (
                            <>
                                <div className="mb-4">
                                    <button
                                        onClick={() => setWritingSubView('dashboard')}
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                                        </svg>
                                        Back to Writing Prompts
                                    </button>
                                </div>
                                <IELTSWritingExam
                                    key="writing-sim"
                                    candidateEmail={userEmail}
                                    simulation={{
                                        sectionLabel: writingExamMode === 'mock' ? 'Writing — Full Mock' : `Writing — ${writingExamMode}`,
                                        timeLimitSeconds: writingTimeMinutes * 60,
                                        onComplete: () => { setWritingSubView('dashboard'); },
                                    }}
                                    onActiveChange={handleExamActive}
                                    exitPulse={exitPulse}
                                />
                            </>
                        )}
                        {view === 'writing' && writingSubView === 'dashboard' && !examRunning && <div className="mt-6"><ModuleHistorySection moduleType="writing" /></div>}
                        {view === 'speaking' && <IELTSSpeakingExam key="speaking" candidateEmail={userEmail} onActiveChange={handleExamActive} exitPulse={exitPulse} />}
                        {view === 'speaking' && !examRunning && <div className="mt-6"><ModuleHistorySection moduleType="speaking" /></div>}
                        {view === 'listening' && <IELTSListeningExam key="listening" candidateEmail={userEmail} onActiveChange={handleExamActive} exitPulse={exitPulse} />}
                        {view === 'listening' && !examRunning && <div className="mt-6"><ModuleHistorySection moduleType="listening" /></div>}
                        {view === 'reading' && <IELTSReadingExam key="reading" candidateEmail={userEmail} onActiveChange={handleExamActive} exitPulse={exitPulse} />}
                        {view === 'reading' && !examRunning && <div className="mt-6"><ModuleHistorySection moduleType="reading" /></div>}
                    </>
                )}
            </main>

            <IELTSExitModal
                open={exitConfirmKey !== null}
                onConfirm={() => {
                    if (exitConfirmKey) {
                        setExamRunning(false);
                        setView(exitConfirmKey);
                        if (exitConfirmKey === 'writing' && pendingWritingSubView) {
                            // Map checker sub-views to landing views on exit
                            const landingMap: Record<string, WritingSubView> = {
                                'task2_checker': 'task2-checker-landing',
                                'task1_academic_checker': 'task1-academic-landing',
                                'task1_general_checker': 'task1-general-landing',
                            };
                            setWritingSubView(landingMap[pendingWritingSubView] ?? pendingWritingSubView as WritingSubView);
                        } else if (exitConfirmKey !== 'writing') {
                            setWritingSubView('dashboard');
                        }
                    }
                    setPendingWritingSubView(null);
                    setExitConfirmKey(null);
                }}
                onCancel={() => { setPendingWritingSubView(null); setExitConfirmKey(null); }}
            />
        </div>
    );
};

export default IELTSEvaluationHub;
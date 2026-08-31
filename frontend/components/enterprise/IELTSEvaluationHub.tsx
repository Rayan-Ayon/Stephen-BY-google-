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
import AICoPilotTestAuthor from './curriculum/AICoPilotTestAuthor';
import type { IeltsBundleId } from './ielts/ieltsShared';

type IeltsView = 'dashboard' | 'writing' | 'speaking' | 'listening' | 'reading' | 'ai-test-author' | IeltsBundleId;
type WritingSubView = 'dashboard' | 'task2_checker' | 'task1_academic_checker' | 'task1_general_checker' | 'exam_simulation';

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
}

const IELTSEvaluationHub: React.FC<IELTSEvaluationHubProps> = ({ userEmail, onExamStateChange, exitPulse, onLockedNavigationAttempt }) => {
    const { activeWorkspace, workspaces, setActiveWorkspace } = useWorkspace();
    const [view, setView] = useState<IeltsView>('dashboard');
    const [isCollapsed, setIsCollapsed] = useState<boolean>(readRail);
    const [examRunning, setExamRunning] = useState(false);
    const handleExamActive = (active: boolean) => {
        setExamRunning(active);
        onExamStateChange?.(active);
    };
    const [isSubShaking, setIsSubShaking] = useState(false);
    const [shakingSubKey, setShakingSubKey] = useState<string | null>(null);
    const [exitConfirmKey, setExitConfirmKey] = useState<IeltsView | null>(null);
    const [writingSubView, setWritingSubView] = useState<WritingSubView>('dashboard');
    const [writingExamMode, setWritingExamMode] = useState<string>('mock');
    const [writingTimeMinutes, setWritingTimeMinutes] = useState<number>(60);
    const [writingLabOpen, setWritingLabOpen] = useState(true);
    const [curriculumAssetsOpen, setCurriculumAssetsOpen] = useState(true);
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

                    <div className="rounded-2xl border border-neutral-800 bg-[#141414] p-10 text-center">
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
            <aside className={`shrink-0 overflow-hidden transition-[width] duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}>
                <div className={`mb-3 pb-3 border-b border-zinc-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
                    {!isCollapsed && (
                        <h2 className="text-base font-semibold tracking-tight text-white truncate">IELTS Suite</h2>
                    )}
                    {!isCollapsed && (
                        <span className="text-[10px] uppercase tracking-wider text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1 whitespace-nowrap">Farmgate · Enterprise</span>
                    )}
                    <button
                        onClick={toggleRail}
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={`shrink-0 rounded-lg border border-neutral-800 bg-[#141414] text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors ${isCollapsed ? 'w-9 h-9 flex items-center justify-center' : 'w-8 h-8 flex items-center justify-center'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                        </svg>
                    </button>
                </div>

                {!isCollapsed && (
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">Practice Drills</p>
                )}
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-80px)] pr-1">
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
                                    { key: 'task2_checker', label: 'Task 2 Checker', detail: '40 min' },
                                    { key: 'task1_academic_checker', label: 'Task 1 (Academic) Checker', detail: '20 min' },
                                    { key: 'task1_general_checker', label: 'Task 1 (General) Checker', detail: '20 min' },
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

                    {/* Curriculum Assets Accordion */}
                    <div>
                        <button
                            onClick={() => setCurriculumAssetsOpen(!curriculumAssetsOpen)}
                            title={isCollapsed ? 'Curriculum Assets' : undefined}
                            className={`relative group w-full flex items-center gap-2 rounded-lg text-left transition-colors ${
                                isCollapsed ? 'justify-center px-0 py-1.5' : 'px-3 py-1.5'
                            } ${view === 'ai-test-author' ? 'bg-white/[0.06] text-white border border-neutral-800' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}${shakingSubKey === 'ai-test-author' && isSubShaking ? ' animate-[lock-shake_0.6s_ease-in-out] ring-2 ring-rose-500/80' : ''}`}
                        >
                            <span className="text-[13px] leading-none shrink-0">📚</span>
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-[13px] truncate">Curriculum Assets</span>
                                    </span>
                                    <svg className={`w-3 h-3 shrink-0 transition-transform ${curriculumAssetsOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </>
                            )}
                            {isCollapsed && (
                                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-neutral-800 bg-black px-2.5 py-1.5 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-xl">
                                    Curriculum Assets
                                </span>
                            )}
                        </button>

                        {!isCollapsed && curriculumAssetsOpen && (
                            <div className="border-l-2 border-slate-700 ml-4 pl-3 space-y-1 mt-1.5 mb-1.5">
                                {[
                                    { key: 'course_deployment', label: 'Course Deployment', detail: '' },
                                    { key: 'institute_kb', label: 'Institute Knowledge Base', detail: '' },
                                    { key: 'ai-test-author', label: '⚡ AI Co-Pilot Test Author', detail: '' },
                                ].map((sub) => (
                                    <button
                                        key={sub.key}
                                        onClick={() => {
                                            if (examRunning) {
                                                setShakingSubKey('ai-test-author');
                                                setIsSubShaking(true);
                                                setTimeout(() => setIsSubShaking(false), 600);
                                                setExitConfirmKey(sub.key as IeltsView);
                                                onLockedNavigationAttempt?.();
                                                return;
                                            }
                                            setView(sub.key as IeltsView);
                                        }}
                                        className={`w-full text-left rounded-md px-3 py-1.5 text-[12px] transition-colors ${
                                            view === sub.key
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
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">Exam Simulations · Timed Bundles</p>
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
            </aside>

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
                        {view === 'ai-test-author' && <AICoPilotTestAuthor />}
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
                            setWritingSubView(pendingWritingSubView);
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
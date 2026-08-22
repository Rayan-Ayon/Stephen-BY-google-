import React, { useState, useEffect } from 'react';
import { useWorkspace, type Workspace } from '../../workspaceContext';
import IELTSDashboard from './ielts/IELTSDashboard';
import IELTSSimulationRunner from './ielts/IELTSSimulationRunner';
import IELTSWritingExam from './ielts/IELTSWritingExam';
import IELTSSpeakingExam from './ielts/IELTSSpeakingExam';
import IELTSListeningExam from './ielts/IELTSListeningExam';
import IELTSReadingExam from './ielts/IELTSReadingExam';
import ModuleHistorySection from './history/ModuleHistorySection';
import type { IeltsBundleId } from './ielts/ieltsShared';

type IeltsView = 'dashboard' | 'writing' | 'speaking' | 'listening' | 'reading' | IeltsBundleId;

const RAIL_KEY = 'stephen_enterprise_farmgate_ielts_rail';

interface IeltsNavItem {
    key: IeltsView;
    icon: string;
    name: string;
    detail?: string;
}

const PRACTICE_ITEMS: IeltsNavItem[] = [
    { key: 'dashboard', icon: '📊', name: 'Dashboard & Tracker' },
    { key: 'writing', icon: '✍️', name: 'Writing Lab' },
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
}

const IELTSEvaluationHub: React.FC<IELTSEvaluationHubProps> = ({ userEmail }) => {
    const { activeWorkspace, workspaces, setActiveWorkspace } = useWorkspace();
    const [view, setView] = useState<IeltsView>('dashboard');
    const [isCollapsed, setIsCollapsed] = useState<boolean>(readRail);
    const [examRunning, setExamRunning] = useState(false);

    useEffect(() => {
        setExamRunning(false);
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
            onClick={() => setView(item.key)}
            title={isCollapsed ? item.name : undefined}
            className={`relative group w-full flex items-center gap-2 rounded-lg text-left transition-colors ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
            } ${view === item.key ? 'bg-white/[0.06] text-white border border-neutral-800' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'}`}
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
        </button>
    );

    return (
        <div className="flex h-full p-8 gap-8 overflow-hidden">
            <aside className={`shrink-0 overflow-hidden transition-[width] duration-300 ${isCollapsed ? 'w-16' : 'w-60'}`}>
                <div className={`mb-6 pb-4 border-b border-zinc-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
                    {!isCollapsed && (
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Enterprise Segment</p>
                            <h2 className="text-base font-semibold tracking-tight text-white mt-0.5">IELTS Suite</h2>
                        </div>
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
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-2">Practice Drills</p>
                )}
                <nav className="space-y-1 mb-5">
                    {PRACTICE_ITEMS.map(renderNavItem)}
                </nav>

                {!isCollapsed && (
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold mb-2">Exam Simulations · Timed Bundles</p>
                )}
                <nav className="space-y-1">
                    {SIMULATION_ITEMS.map(renderNavItem)}
                </nav>

                {!isCollapsed && (
                    <p className="text-[10px] uppercase tracking-wider text-neutral-600 mt-6">
                        Data scope: Farmgate enterprise
                    </p>
                )}
            </aside>

            <main className={`flex-1 min-w-0 ${examRunning ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                {isSimulation ? (
                    <>
                        <IELTSSimulationRunner
                            key={view}
                            bundleId={view as IeltsBundleId}
                            candidateEmail={userEmail}
                            onFinish={() => setView('dashboard')}
                            onActiveChange={setExamRunning}
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
                        {view === 'writing' && <IELTSWritingExam key="writing" candidateEmail={userEmail} onActiveChange={setExamRunning} />}
                        {view === 'writing' && !examRunning && <div className="mt-6"><ModuleHistorySection moduleType="writing" /></div>}
                        {view === 'speaking' && <IELTSSpeakingExam key="speaking" candidateEmail={userEmail} onActiveChange={setExamRunning} />}
                        {view === 'speaking' && !examRunning && <div className="mt-6"><ModuleHistorySection moduleType="speaking" /></div>}
                        {view === 'listening' && <IELTSListeningExam key="listening" candidateEmail={userEmail} onActiveChange={setExamRunning} />}
                        {view === 'listening' && !examRunning && <div className="mt-6"><ModuleHistorySection moduleType="listening" /></div>}
                        {view === 'reading' && <IELTSReadingExam key="reading" candidateEmail={userEmail} onActiveChange={setExamRunning} />}
                        {view === 'reading' && !examRunning && <div className="mt-6"><ModuleHistorySection moduleType="reading" /></div>}
                    </>
                )}
            </main>
        </div>
    );
};

export default IELTSEvaluationHub;
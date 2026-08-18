import React, { useState } from 'react';
import { useWorkspace, type Workspace } from '../../workspaceContext';
import IELTSDashboard from './ielts/IELTSDashboard';
import IELTSWritingExam from './ielts/IELTSWritingExam';
import IELTSReadingExam from './ielts/IELTSReadingExam';
import IELTSListeningExam from './ielts/IELTSListeningExam';
import IELTSSpeakingExam from './ielts/IELTSSpeakingExam';

type IeltsView = 'dashboard' | 'writing' | 'speaking' | 'listening' | 'reading';

interface IeltsNavItem {
    key: IeltsView;
    label: string;
}

const NAV_ITEMS: IeltsNavItem[] = [
    { key: 'dashboard', label: '📊 Dashboard & Tracker' },
    { key: 'writing', label: '✍️ Writing Exam' },
    { key: 'speaking', label: '🗣️ Speaking Exam' },
    { key: 'listening', label: '🎧 Listening Exam' },
    { key: 'reading', label: '📖 Reading Exam' },
];

const FALLBACK_FARMGATE: Workspace = {
    id: 'farmgate',
    type: 'enterprise',
    name: 'Farmgate Executive Batch',
    code: 'FARMGATE-2026',
};

const IELTSEvaluationHub: React.FC = () => {
    const { activeWorkspace, workspaces, setActiveWorkspace } = useWorkspace();
    const [view, setView] = useState<IeltsView>('dashboard');

    const isFarmgate = activeWorkspace.type === 'enterprise' && activeWorkspace.id === 'farmgate';

    if (!isFarmgate) {
        const farmgate = workspaces.find((w) => w.type === 'enterprise' && w.id === 'farmgate') ?? FALLBACK_FARMGATE;
        return (
            <div className="max-w-3xl">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white">IELTS Evaluation</h1>
                        <p className="text-sm text-neutral-400 mt-1">Full computer-delivered test simulation and band tracking.</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 whitespace-nowrap">Enterprise</span>
                </header>

                <div className="mt-8 rounded-2xl border border-neutral-800 bg-[#141414] p-10 text-center">
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
        );
    }

    return (
        <div className="flex gap-5">
            <aside className="w-52 shrink-0">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-3">IELTS Suite</p>
                <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setView(item.key)}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-[13px] transition-colors ${
                                view === item.key
                                    ? 'bg-white/[0.06] text-white border border-neutral-800'
                                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.02]'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
                <p className="text-[10px] uppercase tracking-wider text-neutral-600 mt-6">
                    Data scope: Farmgate enterprise
                </p>
            </aside>

            <main className="flex-1 min-w-0">
                {view === 'dashboard' && <IELTSDashboard />}
                {view === 'writing' && <IELTSWritingExam />}
                {view === 'speaking' && <IELTSSpeakingExam />}
                {view === 'listening' && <IELTSListeningExam />}
                {view === 'reading' && <IELTSReadingExam />}
            </main>
        </div>
    );
};

export default IELTSEvaluationHub;
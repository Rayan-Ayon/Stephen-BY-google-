import React, { useState } from 'react';
import type { Workspace } from '../workspaceContext';

interface EnterpriseSandboxViewProps {
    workspace: Workspace;
}

interface Task {
    id: string;
    title: string;
    due: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
}

const SEED_TASKS: Task[] = [
    {
        id: 't1',
        title: 'Publish Midterm Band Report',
        due: 'Aug 22, 2026',
        priority: 'high',
        completed: false,
    },
    {
        id: 't2',
        title: 'Complete Grammar Clinic Module',
        due: 'Aug 25, 2026',
        priority: 'medium',
        completed: true,
    },
    {
        id: 't3',
        title: 'Speaking Mock Exam Round 2',
        due: 'Aug 29, 2026',
        priority: 'high',
        completed: false,
    },
    {
        id: 't4',
        title: 'Update Course Materials for Week 5',
        due: 'Sep 1, 2026',
        priority: 'low',
        completed: false,
    },
];

const tasksStorageKey = (workspaceId: string) => `stephen_enterprise_${workspaceId}_tasks`;

const readTasks = (workspaceId: string): Task[] => {
    const raw = localStorage.getItem(tasksStorageKey(workspaceId));
    if (raw) {
        try {
            return JSON.parse(raw) as Task[];
        } catch {
            // ignore
        }
    }
    return SEED_TASKS;
};

const priorityColor: Record<Task['priority'], string> = {
    high: 'text-red-400',
    medium: 'text-amber-400',
    low: 'text-emerald-400',
};

const EnterpriseSandboxView: React.FC<EnterpriseSandboxViewProps> = ({ workspace }) => {
    const [tasks, setTasks] = useState<Task[]>(() => readTasks(workspace.id));

    const persistTasks = (next: Task[]) => {
        localStorage.setItem(tasksStorageKey(workspace.id), JSON.stringify(next));
        setTasks(next);
    };

    const toggleTask = (id: string) => {
        persistTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    };

    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const completionRate = tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0;

    const metrics = [
        { label: 'Active Learners', value: '38', sub: '23 online now', color: 'text-amber-400' },
        { label: 'Grid Utilization', value: '72%', sub: '+6% this week', color: 'text-emerald-400' },
        { label: 'Assignments Due', value: String(pendingTasks), sub: 'within 14 days', color: 'text-sky-400' },
    ];

    const gridStats = [
        { label: 'Mock Exams Taken', value: '142' },
        { label: 'Avg Writing Band', value: '6.4' },
        { label: 'Avg Speaking Band', value: '6.8' },
        { label: 'Attendance Rate', value: '91%' },
        { label: 'Practice Hours Logged', value: '1,284' },
        { label: 'Sentiment Score', value: '4.2/5' },
    ];

    return (
        <div className="w-full flex justify-center py-8 px-6 overflow-y-auto">
            <div className="w-full max-w-5xl mx-auto space-y-6">
            <header className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white">{workspace.name}</h1>
                    <p className="text-sm text-neutral-400 mt-1">Assigned tasks, grid portal metrics, and institute sandbox stats for this workspace.</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 whitespace-nowrap">Enterprise</span>
            </header>

            <section>
                <h2 className="text-lg font-semibold tracking-tight text-white mb-3">Grid Portal Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {metrics.map((m) => (
                        <div key={m.label} className="rounded-xl border border-neutral-800 bg-[#141414] p-4">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500">{m.label}</p>
                            <p className={`text-2xl font-semibold mt-1 ${m.color}`}>{m.value}</p>
                            <p className="text-xs text-neutral-500 mt-1">{m.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold tracking-tight text-white mb-3">Assigned Tasks</h2>
                <div className="rounded-xl border border-neutral-800 bg-[#141414] divide-y divide-neutral-800/70">
                    {tasks.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => toggleTask(t.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                        >
                            <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] transition-colors ${t.completed ? 'bg-amber-400 border-amber-400 text-black' : 'border-neutral-600'}`}>
                                {t.completed ? '✓' : ''}
                            </span>
                            <span className={`flex-1 text-sm ${t.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>{t.title}</span>
                            <span className={`text-[10px] uppercase tracking-wider ${priorityColor[t.priority]}`}>{t.priority}</span>
                            <span className="text-xs text-neutral-500">due {t.due}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-lg font-semibold tracking-tight text-white mb-3">Institute Sandbox Stats</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {gridStats.map((s) => (
                        <div key={s.label} className="rounded-xl border border-neutral-800 bg-[#141414] p-4">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500">{s.label}</p>
                            <p className="text-xl font-semibold text-white mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            <p className="text-[10px] uppercase tracking-wider text-neutral-600">
                Task completion rate — {completionRate}%
            </p>
            </div>
        </div>
    );
};

export default EnterpriseSandboxView;
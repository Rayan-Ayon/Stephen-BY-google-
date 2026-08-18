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
    { id: 't1', title: 'Complete Unit 4: Vector Embeddings', due: 'Aug 22', priority: 'high', completed: false },
    { id: 't2', title: 'Submit RAG Pipeline Case Study', due: 'Aug 24', priority: 'medium', completed: false },
    { id: 't3', title: 'Grid Portal Orientation Module', due: 'Aug 20', priority: 'high', completed: true },
    { id: 't4', title: 'Peer Review: Attention Mechanics', due: 'Aug 27', priority: 'low', completed: false },
];

const tasksStorageKey = (workspaceId: string) => `stephen_enterprise_${workspaceId}_tasks`;

const readTasks = (workspaceId: string): Task[] => {
    const stored = localStorage.getItem(tasksStorageKey(workspaceId));
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            // Corrupt cache — fall through to seeds.
        }
    }
    return SEED_TASKS;
};

const priorityColor: Record<Task['priority'], string> = {
    high: 'text-amber-400',
    medium: 'text-neutral-300',
    low: 'text-neutral-500',
};

const EnterpriseSandboxView: React.FC<EnterpriseSandboxViewProps> = ({ workspace }) => {
    const [tasks, setTasks] = useState<Task[]>(() => readTasks(workspace.id));

    const persistTasks = (next: Task[]) => {
        setTasks(next);
        localStorage.setItem(tasksStorageKey(workspace.id), JSON.stringify(next));
    };

    const toggleTask = (id: string) => {
        persistTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    };

    const pendingTasks = tasks.filter(t => !t.completed);
    const completionRate = tasks.length === 0 ? 0 : Math.round((tasks.length - pendingTasks.length) / tasks.length * 100);

    const metrics = [
        { label: 'Active Learners', value: '128' },
        { label: 'Grid Utilization', value: '87%' },
        { label: 'Assignments Due', value: String(pendingTasks.length) },
    ];

    const gridStats = [
        { label: 'Learners Active', value: '128' },
        { label: 'Sandboxes Running', value: '42' },
        { label: 'Storage Allocated', value: '1.6 TB' },
        { label: 'Avg Session Length', value: '48 min' },
        { label: 'Task Completion Rate', value: `${completionRate}%` },
    ];

    return (
        <div className="flex-1 h-full bg-[#0b0b0b] p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">{workspace.name}</h1>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-amber-500/20 text-amber-400 bg-amber-500/10">
                            [ENTERPRISE]
                        </span>
                    </div>
                    <p className="text-neutral-500 text-sm">
                        Assigned tasks, grid portal metrics, and institute sandbox stats for this workspace.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {metrics.map(metric => (
                        <div key={metric.label} className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{metric.label}</p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight text-amber-400">{metric.value}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold tracking-tight text-white">Assigned Tasks</h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                            {pendingTasks.length} pending
                        </span>
                    </div>
                    {tasks.length === 0 ? (
                        <p className="text-sm text-neutral-600 py-8 text-center">No tasks assigned yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {tasks.map(task => (
                                <button
                                    key={task.id}
                                    onClick={() => toggleTask(task.id)}
                                    className="flex items-center gap-3 w-full rounded-xl bg-[#0b0b0b] border border-neutral-800 px-4 py-3 text-left transition-colors hover:border-neutral-700"
                                >
                                    <span
                                        className={`flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors ${
                                            task.completed
                                                ? 'bg-amber-500/20 border-amber-500/40'
                                                : 'border-neutral-700'
                                        }`}
                                    >
                                        {task.completed && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                    </span>
                                    <span
                                        className={`flex-1 text-sm break-words ${
                                            task.completed ? 'text-neutral-600 line-through' : 'text-neutral-200'
                                        }`}
                                    >
                                        {task.title}
                                    </span>
                                    <span className={`text-[11px] font-mono uppercase tracking-wider ${priorityColor[task.priority]}`}>
                                        {task.priority}
                                    </span>
                                    <span className="text-[11px] font-mono text-neutral-600">due {task.due}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
                    <h2 className="text-lg font-semibold tracking-tight text-white mb-4">Institute Sandbox Stats</h2>
                    <div className="divide-y divide-neutral-800">
                        {gridStats.map(stat => (
                            <div key={stat.label} className="flex items-center justify-between py-3">
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">{stat.label}</p>
                                <p className="text-sm font-mono text-neutral-200">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseSandboxView;
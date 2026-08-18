import React, { useState } from 'react';

interface IndividualSandboxViewProps {
    email: string;
}

const PROMPTS_KEY = 'stephen_individual_sandbox_prompts';
const ACTIVITY_KEY = 'stephen_individual_sandbox_activity';

interface PromptEntry {
    id: number;
    prompt: string;
    time: string;
}

interface Activity {
    sessions: number;
}

const readPrompts = (): PromptEntry[] => {
    const stored = localStorage.getItem(PROMPTS_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        } catch {
            // Corrupt cache — start empty.
        }
    }
    return [];
};

const readActivity = (): Activity => {
    const stored = localStorage.getItem(ACTIVITY_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed.sessions === 'number') return parsed;
        } catch {
            // Corrupt cache — start empty.
        }
    }
    return { sessions: 0 };
};

const IndividualSandboxView: React.FC<IndividualSandboxViewProps> = ({ email }) => {
    const [promptInput, setPromptInput] = useState('');
    const [prompts, setPrompts] = useState<PromptEntry[]>(readPrompts);
    const [activity, setActivity] = useState<Activity>(readActivity);

    const persistPrompts = (next: PromptEntry[]) => {
        setPrompts(next);
        localStorage.setItem(PROMPTS_KEY, JSON.stringify(next));
    };

    const persistActivity = (next: Activity) => {
        setActivity(next);
        localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
    };

    const runPrompt = () => {
        const trimmed = promptInput.trim();
        if (!trimmed) return;
        const entry: PromptEntry = {
            id: Date.now(),
            prompt: trimmed,
            time: new Date().toLocaleString(),
        };
        persistPrompts([entry, ...prompts].slice(0, 50));
        persistActivity({ sessions: activity.sessions + 1 });
        setPromptInput('');
    };

    const clearHistory = () => {
        persistPrompts([]);
    };

    return (
        <div className="flex-1 h-full bg-[#0b0b0b] p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">Personal Sandbox</h1>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-neutral-800 text-neutral-400 bg-neutral-800/60">
                            [INDIVIDUAL]
                        </span>
                    </div>
                    <p className="text-neutral-500 text-sm">
                        Isolated practice environment for <span className="text-neutral-300">{email}</span>. Prompts and history are private to this sandbox.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Prompts Run</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{prompts.length}</p>
                    </div>
                    <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">History Entries</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{prompts.length}</p>
                    </div>
                    <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-5">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Sessions</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{activity.sessions}</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
                    <h2 className="text-lg font-semibold tracking-tight text-white mb-4">Prompt Sandbox</h2>
                    <textarea
                        value={promptInput}
                        onChange={e => setPromptInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runPrompt();
                        }}
                        placeholder="Enter a prompt to log in your private sandbox…"
                        rows={4}
                        className="w-full rounded-xl bg-[#0b0b0b] border border-neutral-800 p-4 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-neutral-600 resize-none"
                    />
                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={clearHistory}
                            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                        >
                            Clear history
                        </button>
                        <button
                            onClick={runPrompt}
                            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold transition-colors hover:bg-neutral-200"
                        >
                            Run
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl bg-[#141414] border border-neutral-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold tracking-tight text-white">Private History Logs</h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">{prompts.length} entries</span>
                    </div>
                    {prompts.length === 0 ? (
                        <p className="text-sm text-neutral-600 py-8 text-center">No prompts logged yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {prompts.map(entry => (
                                <div key={entry.id} className="rounded-xl bg-[#0b0b0b] border border-neutral-800 px-4 py-3">
                                    <p className="text-sm text-neutral-200 break-words">{entry.prompt}</p>
                                    <p className="mt-1 text-[11px] font-mono text-neutral-600">{entry.time}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IndividualSandboxView;
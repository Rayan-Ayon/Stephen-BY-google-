import React, { useEffect, useRef, useState } from 'react';
import type { Theme } from '../App';
import { INDIVIDUAL_WORKSPACE, useWorkspace, type Workspace } from '../workspaceContext';
import { ChevronDownIcon, PlusIcon } from './icons';

interface WorkspaceDropdownProps {
    theme: Theme;
    isExpanded: boolean;
}

const TypeBadge: React.FC<{ type: Workspace['type'] }> = ({ type }) => {
    if (type === 'enterprise') {
        return (
            <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-amber-500/20 text-amber-400 bg-amber-500/10">
                [ENTERPRISE]
            </span>
        );
    }
    return (
        <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-neutral-800 text-neutral-400 bg-neutral-800/60">
            [INDIVIDUAL]
        </span>
    );
};

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = ({ theme, isExpanded }) => {
    const { activeWorkspace, workspaces, setActiveWorkspace, joinWorkspace } = useWorkspace();
    const [open, setOpen] = useState(false);
    const [joining, setJoining] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleJoin = () => {
        const err = joinWorkspace(code);
        if (err) {
            setError(err);
        } else {
            setError(null);
            setCode('');
            setJoining(false);
            setOpen(false);
        }
    };

    const enterpriseWorkspaces = workspaces.filter(ws => ws.type === 'enterprise');
    const popoverPosition = isExpanded ? 'left-0 top-full mt-2' : 'left-full top-0 ml-2';

    return (
        <div ref={containerRef} className="relative min-w-0 flex-1">
            <button
                onClick={() => setOpen(prev => !prev)}
                title={activeWorkspace.name}
                className={`flex items-center gap-2 w-full rounded-lg transition-colors ${
                    isExpanded ? 'px-2 py-1.5' : 'justify-center p-2'
                } ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-800' : 'text-neutral-700 hover:bg-neutral-200'}`}
            >
                {isExpanded ? (
                    <>
                        <span className="flex-1 text-left truncate">
                            <span className="block text-sm font-medium truncate">{activeWorkspace.name}</span>
                            <span className="block mt-1">
                                <TypeBadge type={activeWorkspace.type} />
                            </span>
                        </span>
                        <ChevronDownIcon
                            className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                        />
                    </>
                ) : (
                    <span className="text-2xl font-light dark:text-gray-200 text-neutral-700">S</span>
                )}
            </button>

            {open && (
                <div
                    className={`absolute ${popoverPosition} w-64 z-50 rounded-xl bg-[#0a0a0a] border border-neutral-800 shadow-2xl overflow-hidden`}
                >
                    <div className="px-3 pt-3 pb-1">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                            Individual Account
                        </p>
                    </div>
                    <div className="px-1.5">
                        <button
                            onClick={() => {
                                setActiveWorkspace(INDIVIDUAL_WORKSPACE);
                                setOpen(false);
                            }}
                            className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg transition-colors ${
                                activeWorkspace.id === INDIVIDUAL_WORKSPACE.id
                                    ? 'bg-neutral-800/60'
                                    : 'hover:bg-neutral-800/40'
                            }`}
                        >
                            <span className="flex-1 text-left truncate">
                                <span className="block text-[13px] text-neutral-200 truncate">
                                    {INDIVIDUAL_WORKSPACE.name}
                                </span>
                            </span>
                            <TypeBadge type="individual" />
                            {activeWorkspace.id === INDIVIDUAL_WORKSPACE.id && (
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
                            )}
                        </button>
                    </div>

                    <div className="mt-2 px-3 pt-2 pb-1 border-t border-neutral-800">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                            Enterprise Workspaces
                        </p>
                    </div>
                    <div className="px-1.5">
                        {enterpriseWorkspaces.length === 0 ? (
                            <p className="px-2 py-2 text-xs text-neutral-600">No enterprise spaces joined.</p>
                        ) : (
                            enterpriseWorkspaces.map(ws => (
                                <button
                                    key={ws.id}
                                    onClick={() => {
                                        setActiveWorkspace(ws);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center gap-2 w-full px-2 py-2 rounded-lg transition-colors ${
                                        activeWorkspace.id === ws.id
                                            ? 'bg-amber-500/10'
                                            : 'hover:bg-neutral-800/40'
                                    }`}
                                >
                                    <span className="flex-1 text-left truncate">
                                        <span className="block text-[13px] text-neutral-200 truncate">{ws.name}</span>
                                    </span>
                                    <TypeBadge type="enterprise" />
                                    {activeWorkspace.id === ws.id && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    <div className="mt-2 px-1.5 pb-2 pt-2 border-t border-neutral-800">
                        {joining ? (
                            <div className="px-2 pb-1">
                                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">
                                    Join Space / Redeem Code
                                </p>
                                <input
                                    autoFocus
                                    value={code}
                                    onChange={e => {
                                        setCode(e.target.value);
                                        setError(null);
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleJoin();
                                    }}
                                    placeholder="e.g. FARMGATE-2026"
                                    className="w-full mb-2 px-2.5 py-1.5 rounded-lg bg-[#121212] border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-amber-500/40"
                                />
                                {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleJoin}
                                        className="flex-1 px-2 py-1.5 rounded-lg bg-white text-black text-xs font-semibold transition-colors hover:bg-neutral-200"
                                    >
                                        Join
                                    </button>
                                    <button
                                        onClick={() => {
                                            setJoining(false);
                                            setError(null);
                                            setCode('');
                                        }}
                                        className="px-2 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-400 transition-colors hover:bg-neutral-800/40"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setJoining(true)}
                                className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-[13px] text-neutral-300 transition-colors hover:bg-neutral-800/40"
                            >
                                <PlusIcon className="w-4 h-4 text-neutral-500" />
                                <span>Join Space / Redeem Code</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceDropdown;
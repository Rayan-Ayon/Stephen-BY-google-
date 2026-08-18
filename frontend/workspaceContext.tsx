import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Workspace {
    id: string;
    type: 'individual' | 'enterprise';
    name: string;
    code?: string;
}

export const INDIVIDUAL_WORKSPACE: Workspace = {
    id: 'personal',
    type: 'individual',
    name: 'Personal Sandbox',
};

interface KnownWorkspaceEntry {
    code: string;
    workspace: Workspace;
}

const KNOWN_WORKSPACE_CODES: KnownWorkspaceEntry[] = [
    {
        code: 'FARMGATE-2026',
        workspace: { id: 'farmgate_exec', type: 'enterprise', name: 'Farmgate Executive Batch', code: 'FARMGATE-2026' },
    },
    {
        code: 'BUET-GRID',
        workspace: { id: 'buet_grid', type: 'enterprise', name: 'BUET Engineering Grid Portal', code: 'BUET-GRID' },
    },
];

const WORKSPACES_KEY = 'stephen_workspaces';
const ACTIVE_WORKSPACE_KEY = 'stephen_active_workspace';

const SEEDED_WORKSPACES: Workspace[] = [
    INDIVIDUAL_WORKSPACE,
    ...KNOWN_WORKSPACE_CODES.map(entry => entry.workspace),
];

interface WorkspaceContextValue {
    activeWorkspace: Workspace;
    workspaces: Workspace[];
    setActiveWorkspace: (ws: Workspace) => void;
    joinWorkspace: (code: string) => string | null;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const readStoredWorkspaces = (): Workspace[] => {
    const stored = localStorage.getItem(WORKSPACES_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch {
            // Corrupt cache — fall through to seeds.
        }
    }
    return SEEDED_WORKSPACES;
};

const readStoredActive = (fallback: Workspace[]): Workspace => {
    const stored = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.id && (parsed.type === 'individual' || parsed.type === 'enterprise')) {
                return parsed as Workspace;
            }
        } catch {
            // Corrupt cache — fall through to default.
        }
    }
    return fallback[0] || INDIVIDUAL_WORKSPACE;
};

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>(readStoredWorkspaces);
    const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(() =>
        readStoredActive(readStoredWorkspaces())
    );

    useEffect(() => {
        localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
    }, [workspaces]);

    useEffect(() => {
        localStorage.setItem(ACTIVE_WORKSPACE_KEY, JSON.stringify(activeWorkspace));
    }, [activeWorkspace]);

    const joinWorkspace = (code: string): string | null => {
        const normalized = code.trim().toUpperCase();
        if (!normalized) {
            return 'Enter a valid space code.';
        }
        const known = KNOWN_WORKSPACE_CODES.find(
            entry => entry.code.toUpperCase() === normalized
        );
        if (!known) {
            return 'Invalid code. No workspace found for this code.';
        }
        const existing = workspaces.find(w => w.id === known.workspace.id);
        if (!existing) {
            setWorkspaces(prev => [...prev, known.workspace]);
        }
        setActiveWorkspace(known.workspace);
        return null;
    };

    const value: WorkspaceContextValue = {
        activeWorkspace,
        workspaces,
        setActiveWorkspace,
        joinWorkspace,
    };

    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = (): WorkspaceContextValue => {
    const ctx = useContext(WorkspaceContext);
    if (!ctx) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return ctx;
};
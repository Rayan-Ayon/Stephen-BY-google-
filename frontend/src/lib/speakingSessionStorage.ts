/**
 * Enterprise Session Persistence Repository Layer for AI Speaking Partner.
 * Manages local persistence, resilient schema parsing, multi-persona tracking,
 * and cached 15-subcriteria diagnostic evaluation write-backs.
 */

export interface SpeakingPartnerSessionRecord {
    id: string; // e.g., 'sp_sess_1728695029123'
    persona: {
        id: string; // 'mohona' | 'strict_examiner' | 'priya' | 'alex' | 'sophia' | 'noah'
        name: string;
        avatar: string;
        color: string;
        voice?: string;
    };
    startedAt: string;
    endedAt: string;
    dateFormatted: string;
    durationFormatted: string;
    durationSeconds: number;
    messages: Array<{
        id: string | number;
        sender?: 'user' | 'ai';
        role?: 'user' | 'assistant' | 'system' | 'gemini';
        text: string;
        timestamp: string;
        isStreaming?: boolean;
    }>;
    evaluation?: any | null; // Stores complete 15-subcriteria diagnostic evaluation
    audioUrl?: string | null;

    // Backward-compatibility properties for existing components
    partnerName?: string;
    partnerInitials?: string;
    partnerColor?: string;
    date?: string;
    duration?: string;
    elapsed?: number;
}

const STORAGE_KEY = 'stephen_speaking_partner_sessions_v1';
const UPDATE_EVENT_NAME = 'speaking_partner_sessions_updated';
const MAX_SAVED_SESSIONS = 50;

/**
 * Retrieve saved speaking partner sessions from LocalStorage.
 * Gracefully handles parsing errors, missing data, and invalid formats.
 */
export function getSavedSpeakingSessions(): SpeakingPartnerSessionRecord[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(item => item && typeof item === 'object' && typeof item.id === 'string');
    } catch (err) {
        console.error('[StephenStorage] Failed to load speaking partner sessions:', err);
        return [];
    }
}

/**
 * Save a speaking partner session to LocalStorage.
 * Deduplicates by session ID, prepends new sessions, and caps at MAX_SAVED_SESSIONS.
 * Dispatches an event to notify active listeners for cross-tab or component synchronization.
 */
export function saveSpeakingSession(session: SpeakingPartnerSessionRecord): void {
    if (typeof window === 'undefined') return;
    try {
        const existing = getSavedSpeakingSessions();
        const updated = [session, ...existing.filter(s => s.id !== session.id)].slice(0, MAX_SAVED_SESSIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: { sessionId: session.id } }));
    } catch (err) {
        console.error('[StephenStorage] Failed to save speaking partner session:', err);
    }
}

/**
 * Update the cached evaluation and band scores of an existing session in place.
 * Preserves all conversation turns, timing, and persona metadata.
 */
export function updateSpeakingSessionEvaluation(sessionId: string, evaluation: any): void {
    if (typeof window === 'undefined' || !sessionId) return;
    try {
        const existing = getSavedSpeakingSessions();
        let updatedCount = 0;
        const updated = existing.map(s => {
            if (s.id === sessionId) {
                updatedCount++;
                return { ...s, evaluation };
            }
            return s;
        });

        if (updatedCount > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: { sessionId, evaluation } }));
        }
    } catch (err) {
        console.error('[StephenStorage] Failed to update session evaluation:', err);
    }
}

/**
 * Delete a specific session by ID.
 */
export function deleteSpeakingSession(sessionId: string): void {
    if (typeof window === 'undefined' || !sessionId) return;
    try {
        const existing = getSavedSpeakingSessions();
        const updated = existing.filter(s => s.id !== sessionId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: { sessionId } }));
    } catch (err) {
        console.error('[StephenStorage] Failed to delete session:', err);
    }
}

/**
 * Clear all saved speaking partner sessions (useful for test resets).
 */
export function clearSpeakingSessions(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
    } catch (err) {
        console.error('[StephenStorage] Failed to clear speaking sessions:', err);
    }
}

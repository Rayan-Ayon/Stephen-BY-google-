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

export const getSpeakingStorageKey = (userId?: string) =>
    userId ? `stephen_${userId}_speaking_partner_sessions_v1` : 'stephen_guest_speaking_partner_sessions';

const UPDATE_EVENT_NAME = 'speaking_partner_sessions_updated';
const MAX_SAVED_SESSIONS = 50;

/**
 * Retrieve saved speaking partner sessions from LocalStorage.
 * Gracefully handles parsing errors, missing data, and invalid formats.
 */
export function getSavedSpeakingSessions(userId?: string): SpeakingPartnerSessionRecord[] {
    if (typeof window === 'undefined') return [];
    try {
        const key = getSpeakingStorageKey(userId);
        const raw = localStorage.getItem(key);
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
export function saveSpeakingSession(session: SpeakingPartnerSessionRecord, userId?: string): void {
    if (typeof window === 'undefined') return;
    try {
        const key = getSpeakingStorageKey(userId);
        const existing = getSavedSpeakingSessions(userId);
        const updated = [session, ...existing.filter(s => s.id !== session.id)].slice(0, MAX_SAVED_SESSIONS);
        localStorage.setItem(key, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: { sessionId: session.id, userId } }));
    } catch (err) {
        console.error('[StephenStorage] Failed to save speaking partner session:', err);
    }
}

/**
 * Update the cached evaluation and band scores of an existing session in place.
 * Preserves all conversation turns, timing, and persona metadata.
 */
export function updateSpeakingSessionEvaluation(sessionId: string, evaluation: any, userId?: string): void {
    if (typeof window === 'undefined' || !sessionId) return;
    try {
        const key = getSpeakingStorageKey(userId);
        const existing = getSavedSpeakingSessions(userId);
        let updatedCount = 0;
        const updated = existing.map(s => {
            if (s.id === sessionId) {
                updatedCount++;
                return { ...s, evaluation };
            }
            return s;
        });

        if (updatedCount > 0) {
            localStorage.setItem(key, JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: { sessionId, evaluation, userId } }));
        }
    } catch (err) {
        console.error('[StephenStorage] Failed to update session evaluation:', err);
    }
}

/**
 * Delete a specific session by ID.
 */
export function deleteSpeakingSession(sessionId: string, userId?: string): void {
    if (typeof window === 'undefined' || !sessionId) return;
    try {
        const key = getSpeakingStorageKey(userId);
        const existing = getSavedSpeakingSessions(userId);
        const updated = existing.filter(s => s.id !== sessionId);
        localStorage.setItem(key, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: { sessionId, userId } }));
    } catch (err) {
        console.error('[StephenStorage] Failed to delete session:', err);
    }
}

/**
 * Clear all saved speaking partner sessions (useful for test resets).
 */
export function clearSpeakingSessions(userId?: string): void {
    if (typeof window === 'undefined') return;
    try {
        const key = getSpeakingStorageKey(userId);
        localStorage.removeItem(key);
        window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: { userId } }));
    } catch (err) {
        console.error('[StephenStorage] Failed to clear speaking sessions:', err);
    }
}

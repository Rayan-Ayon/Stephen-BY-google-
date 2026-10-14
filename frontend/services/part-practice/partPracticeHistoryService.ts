import { supabase } from '@/lib/supabaseClient';

export type PartPracticeSkill = 'reading' | 'listening' | 'writing' | 'speaking';
export type PartPracticeAttemptType = 'part' | 'question_type';
export type PartPracticeStatus = 'TARGET' | 'GOOD' | 'DEVELOP' | 'AT_RISK';

export interface PartPracticeQuestionTelemetry {
    qNum: number;
    prompt: string;
    type?: string;
    candidate_answer: string;
    correct_answer: string;
    is_correct: boolean;
    is_omitted?: boolean;
    explanation?: string;
    evidence?: string;
    timestamp?: string;
}

export interface PartPracticeAttempt {
    id: string;
    user_id?: string;
    user_email?: string;
    attempt_type: PartPracticeAttemptType;
    module: PartPracticeSkill;
    book_number: number;
    test_number: number;
    part_number: number;
    scoped_target: string;
    exam_title: string;
    drill_name?: string;
    source_exam?: string;
    category?: 'academic' | 'general';
    source_type?: 'cambridge' | 'mock_series';
    band_score: number;
    raw_score: number;
    total_questions: number;
    accuracy_percentage: number;
    time_spent_seconds: number;
    status: PartPracticeStatus;
    user_responses: Record<string, any>;
    detailed_results?: {
        questions?: PartPracticeQuestionTelemetry[];
        criteria?: { label: string; score: number }[];
        passage_title?: string;
        passage_text?: string;
        audio_url?: string;
        tapescript?: string;
        candidate_essay?: string;
        model_answer?: string;
        highlights?: Array<{ text: string; type: 'grammar' | 'vocab' | 'strong'; note: string }>;
        transcript?: Array<{ speaker: string; text: string; question?: string }>;
        four_pillars?: {
            ta?: number;
            cc?: number;
            lr?: number;
            gra?: number;
            fc?: number;
            pr?: number;
        };
        strengths?: string[];
        improvements?: string[];
        chart_data?: any;
        [key: string]: any;
    };
    created_at: string;
}

export const PART_PRACTICE_UPDATED_EVENT = 'stephen_part_practice_updated';

const getStorageKey = (userId?: string) => (userId ? `stephen_${userId}_part_practice_attempts` : null);

/* ─── Local Storage Helpers (Strictly User-Scoped) ─── */
function getLocalAttempts(userId?: string): PartPracticeAttempt[] {
    if (typeof window === 'undefined' || !userId) return [];
    try {
        const key = getStorageKey(userId);
        if (!key) return [];
        const stored = localStorage.getItem(key);
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
        return [];
    } catch {
        return [];
    }
}

function saveLocalAttempts(attempts: PartPracticeAttempt[], userId?: string) {
    if (typeof window === 'undefined' || !userId) return;
    try {
        const key = getStorageKey(userId);
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(attempts));
        window.dispatchEvent(new CustomEvent(PART_PRACTICE_UPDATED_EVENT, { detail: attempts }));
    } catch (e) {
        console.warn('[partPracticeHistoryService] Error saving local attempts:', e);
    }
}

/* ─── Service API ─── */
export async function fetchPartPracticeAttempts(options?: {
    module?: string;
    attemptType?: PartPracticeAttemptType;
    userEmail?: string;
}): Promise<PartPracticeAttempt[]> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) {
            return [];
        }

        const local = getLocalAttempts(userId);

        let query = (supabase as any)
            .from('part_practice_attempts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (options?.module && options.module !== 'all') {
            query = query.eq('module', options.module);
        }
        if (options?.attemptType) {
            query = query.eq('attempt_type', options.attemptType);
        }

        const { data: dbData, error } = await query.limit(100);

        if (!error && dbData) {
            if (dbData.length === 0 && local.length === 0) {
                return [];
            }
            const seenIds = new Set<string>();
            const merged: PartPracticeAttempt[] = [];

            dbData.forEach((row: any) => {
                const id = String(row.id);
                seenIds.add(id);
                merged.push({
                    id,
                    user_id: row.user_id,
                    user_email: row.user_email,
                    attempt_type: row.attempt_type || 'part',
                    module: row.module,
                    book_number: Number(row.book_number) || 7,
                    test_number: Number(row.test_number) || 1,
                    part_number: Number(row.part_number) || 1,
                    scoped_target: row.scoped_target || `Part ${row.part_number || 1}`,
                    exam_title: row.exam_title || `Cambridge ${row.book_number || 7} Test ${row.test_number || 1}`,
                    drill_name: row.drill_name,
                    source_exam: row.source_exam,
                    category: row.category || 'academic',
                    source_type: row.source_type || 'cambridge',
                    band_score: Number(row.band_score) || 6.5,
                    raw_score: Number(row.raw_score) || 0,
                    total_questions: Number(row.total_questions) || 0,
                    accuracy_percentage: Number(row.accuracy_percentage) || 0,
                    time_spent_seconds: Number(row.time_spent_seconds) || 0,
                    status: (row.status as PartPracticeStatus) || 'TARGET',
                    user_responses: row.user_responses || {},
                    detailed_results: row.detailed_results || {},
                    created_at: row.created_at || new Date().toISOString()
                });
            });

            // Append local attempts that haven't been synced to database yet
            local.forEach(loc => {
                if (!seenIds.has(String(loc.id))) {
                    merged.push(loc);
                }
            });

            return merged;
        }

        return local;
    } catch (err) {
        console.warn('[partPracticeHistoryService] Error fetching part practice attempts:', err);
        return [];
    }
}

export async function recordPartPracticeAttempt(
    data: Omit<PartPracticeAttempt, 'id' | 'created_at' | 'attempt_type'> & {
        id?: string;
        attempt_type?: PartPracticeAttemptType;
    }
): Promise<PartPracticeAttempt> {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = data.user_id || session?.user?.id;
    const userEmail = data.user_email || session?.user?.email;

    const id = data.id || `ppa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const created_at = new Date().toISOString();

    const record: PartPracticeAttempt = {
        ...data,
        attempt_type: data.attempt_type || 'part',
        id,
        user_id: userId,
        user_email: userEmail,
        created_at
    };

    // Save to user-scoped local cache
    if (userId) {
        const current = getLocalAttempts(userId);
        const updated = [record, ...current.filter(c => c.id !== id)];
        saveLocalAttempts(updated, userId);
    }

    // Sync to Supabase in background
    if (userId) {
        try {
            await (supabase as any)
                .from('part_practice_attempts')
                .upsert([
                    {
                        id: record.id.startsWith('ppa-') ? undefined : record.id,
                        user_id: userId,
                        user_email: userEmail,
                        attempt_type: record.attempt_type,
                        module: record.module,
                        book_number: record.book_number,
                        test_number: record.test_number,
                        part_number: record.part_number,
                        scoped_target: record.scoped_target,
                        exam_title: record.exam_title,
                        drill_name: record.drill_name,
                        source_exam: record.source_exam,
                        category: record.category,
                        source_type: record.source_type,
                        band_score: record.band_score,
                        raw_score: record.raw_score,
                        total_questions: record.total_questions,
                        accuracy_percentage: record.accuracy_percentage,
                        time_spent_seconds: record.time_spent_seconds,
                        status: record.status,
                        user_responses: record.user_responses,
                        detailed_results: record.detailed_results,
                        created_at: record.created_at
                    }
                ]);
        } catch (err) {
            console.warn('[partPracticeHistoryService] Supabase insert warning:', err);
        }
    }

    return record;
}

export async function getPartPracticeAttemptById(id: string): Promise<PartPracticeAttempt | null> {
    const attempts = await fetchPartPracticeAttempts();
    return attempts.find(a => String(a.id) === String(id)) || null;
}

import { useState, useEffect, useCallback } from 'react';
import {
    fetchWritingEvaluation,
    saveWritingEvaluation,
    type WritingEvaluationPayload,
} from '@/services/writing/writingEvaluationService';

export interface UseWritingEvaluationProps {
    attemptId?: string | number | null;
    attempt?: any;
    autoFetch?: boolean;
}

export function useWritingEvaluation({
    attemptId,
    attempt,
    autoFetch = true,
}: UseWritingEvaluationProps) {
    const [evaluation, setEvaluation] = useState<WritingEvaluationPayload | null>(() => {
        if (attempt?.evaluation_payload_json && typeof attempt.evaluation_payload_json === 'object') {
            return attempt.evaluation_payload_json;
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState<boolean>(!evaluation && Boolean(attemptId || attempt));
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        const id = attemptId || attempt?.id;
        if (!id && !attempt) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const payload = await fetchWritingEvaluation(id || 'default', attempt);
            setEvaluation(payload);
        } catch (err: any) {
            console.error('[useWritingEvaluation] Failed to load evaluation:', err);
            setError(err?.message || 'Failed to load writing evaluation');
        } finally {
            setIsLoading(false);
        }
    }, [attemptId, attempt]);

    useEffect(() => {
        if (autoFetch && (attemptId || attempt)) {
            load();
        }
    }, [autoFetch, attemptId, attempt, load]);

    return {
        evaluation,
        isLoading,
        error,
        refetch: load,
        saveEvaluation: saveWritingEvaluation,
    };
}

export default useWritingEvaluation;

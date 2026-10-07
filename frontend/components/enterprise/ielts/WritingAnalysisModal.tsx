import React from 'react';
import { createPortal } from 'react-dom';
import WritingEvaluationCanvas from '../writing/WritingEvaluationCanvas';
import type { AnalysisSegment } from './analysisMockData';
import type {
    WritingCriterion,
    WritingRewrite,
    WritingTeacher,
    WritingEvaluationPayload,
} from '@/services/writing/writingEvaluationService';

export type { WritingCriterion, WritingRewrite, WritingTeacher };

export interface WritingAnalysisModalProps {
    isModal?: boolean;
    band?: number;
    targetBand?: number;
    examTitle?: string;
    examDate?: string;
    criteria?: WritingCriterion[];
    segments?: AnalysisSegment[];
    rewrites?: WritingRewrite[];
    teacher?: WritingTeacher;
    wordCount?: number;
    minWordCount?: number;
    timeSpentMinutes?: number;
    promptText?: string;
    attempt?: any;
    onClose: () => void;
}

export const WritingAnalysisModal: React.FC<WritingAnalysisModalProps> = ({
    isModal = true,
    attempt,
    onClose,
    ...rest
}) => {
    // If explicit props were provided without an attempt object, construct an evaluationProp
    const evaluationProp: WritingEvaluationPayload | null = rest.band && rest.criteria ? {
        overallBand: rest.band,
        targetBand: rest.targetBand || 7.5,
        examTitle: rest.examTitle || attempt?.title || 'Academic Writing Attempt',
        examDate: rest.examDate || attempt?.date,
        criteria: rest.criteria,
        segments: rest.segments || [],
        rewrites: rest.rewrites || [],
        teacher: rest.teacher || { verified: true, remark: '', audioNote: false },
        wordCount: rest.wordCount || 285,
        minWordCount: rest.minWordCount || 250,
        timeSpentMinutes: rest.timeSpentMinutes || 38,
        promptText: rest.promptText,
        essayText: attempt?.essayText || '',
    } : null;

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const canvas = (
        <WritingEvaluationCanvas
            isModal={isModal}
            attempt={attempt}
            attemptId={attempt?.id}
            evaluationProp={evaluationProp}
            onClose={onClose}
        />
    );

    if (isModal) {
        if (typeof document === 'undefined') return null;
        return createPortal(
            <div
                className="fixed inset-0 z-[9999] w-screen h-screen bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
                onClick={onClose}
            >
                {canvas}
            </div>,
            document.body
        );
    }

    return (
        <div className="w-full space-y-6 bg-[#0D0F12] p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col min-h-screen">
            <div className="w-full max-w-7xl mx-auto flex flex-col">
                {canvas}
            </div>
        </div>
    );
};

export default WritingAnalysisModal;

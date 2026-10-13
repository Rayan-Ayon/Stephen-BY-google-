import React from 'react';
import SpeakingEvaluationCanvas from './SpeakingEvaluationCanvas';
import type { SpeakingEvaluation } from '../../../src/components/mock-tests/speaking/speakingExamShared';

export interface SpeakingAnalysisViewProps {
    attemptId?: string | number;
    isOpen?: boolean;
    isReviewMode?: boolean;
    storedPartsData?: any;
    onClose?: () => void;
    examTitle?: string;
    bookNumber?: number;
    testNumber?: number;
    testData?: any;
    audioUrl?: string | null;
    evaluation?: SpeakingEvaluation | null;
    onBack?: () => void;
    onExit?: () => void;
    onNavigateHistory?: () => void;
    className?: string;
}

/**
 * SpeakingAnalysisView: Unified Enterprise Post-Exam Speaking Analysis Canvas View
 * Adheres to the San Francisco Modern Startup Obsidian Dark aesthetic (#0D0F12, #15181E, #222732).
 */
export const SpeakingAnalysisView: React.FC<SpeakingAnalysisViewProps> = ({
    attemptId,
    isOpen,
    isReviewMode,
    storedPartsData,
    onClose,
    examTitle,
    bookNumber,
    testNumber,
    testData,
    audioUrl = null,
    evaluation = null,
    onBack,
    onExit,
    onNavigateHistory,
    className = '',
}) => {
    return (
        <div className={`w-full h-full min-h-0 bg-[#0D0F12] text-zinc-100 flex flex-col overflow-hidden ${className}`}>
            <SpeakingEvaluationCanvas
                attemptId={attemptId}
                isOpen={isOpen}
                isReviewMode={isReviewMode}
                storedPartsData={storedPartsData}
                onClose={onClose}
                examTitle={examTitle}
                bookNumber={bookNumber}
                testNumber={testNumber}
                testData={testData}
                audioUrl={audioUrl}
                evaluation={evaluation}
                onBack={onBack}
                onExit={onExit}
                onNavigateHistory={onNavigateHistory}
            />
        </div>
    );
};

export default SpeakingAnalysisView;

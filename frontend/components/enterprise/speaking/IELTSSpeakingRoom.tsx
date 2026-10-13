import React, { useState } from 'react';
import SpeakingExamWorkspace from '../../../src/components/mock-tests/speaking/SpeakingExamWorkspace';
import type { SpeakingTestData } from '../../../src/components/mock-tests/speaking/speakingExamShared';

export interface IELTSSpeakingRoomProps {
    initialBook?: number;
    initialTest?: number;
    initialPart?: 1 | 2 | 3;
    isPartPractice?: boolean;
    onBack?: () => void;
    onExit?: () => void;
    onTestComplete?: (data: any) => void;
    testData?: SpeakingTestData;
}

/**
 * IELTSSpeakingRoom: Enterprise Obsidian Dark Speaking Room Component
 * Wraps the full speaking simulation workflow with authentic Cambridge 7–21 datasets,
 * Mara AI avatar, examiner instruction audio, and two-phase Part 2 Cue Card state machine.
 */
import SpeakingAnalysisView from './SpeakingAnalysisView';

export const IELTSSpeakingRoom: React.FC<IELTSSpeakingRoomProps> = ({
    initialBook = 7,
    initialTest = 2,
    initialPart = 1,
    isPartPractice = false,
    onBack,
    onExit,
    onTestComplete,
    testData,
}) => {
    const [analysisData, setAnalysisData] = useState<any | null>(null);

    if (analysisData) {
        return (
            <div className="w-full h-full min-h-0 bg-[#0D0F12] text-zinc-100 flex flex-col overflow-hidden">
                <SpeakingAnalysisView
                    examTitle={analysisData.examTitle}
                    bookNumber={analysisData.bookNumber ?? initialBook}
                    testNumber={analysisData.testNumber ?? initialTest}
                    testData={analysisData.testData ?? testData}
                    audioUrl={analysisData.audioUrl}
                    evaluation={analysisData.evaluation}
                    onBack={() => {
                        setAnalysisData(null);
                        onBack?.();
                    }}
                    onExit={() => {
                        setAnalysisData(null);
                        if (onExit) onExit();
                        else onBack?.();
                    }}
                />
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-0 bg-[#0D0F12] text-zinc-100 flex flex-col overflow-hidden">
            <SpeakingExamWorkspace
                bookNumber={initialBook}
                testNumber={initialTest}
                initialBook={initialBook}
                initialTest={initialTest}
                initialPart={initialPart}
                isPartPractice={isPartPractice}
                onBack={onBack}
                onExit={onExit || onBack}
                onTestComplete={(data) => {
                    onTestComplete?.(data);
                    setAnalysisData(data);
                }}
                testData={testData}
            />
        </div>
    );
};

export default IELTSSpeakingRoom;

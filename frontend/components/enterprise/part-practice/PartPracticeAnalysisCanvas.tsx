/**
 * @deprecated Deprecated in favor of canonical mock test analysis canvases:
 * - Writing: WritingEvaluationCanvas.tsx
 * - Reading: IELTSAnalysisView.tsx
 * - Listening: ListeningAnalysisModal.tsx
 * - Speaking: SpeakingEvaluationCanvas.tsx
 * Reused via adapters in @/services/part-practice/partPracticeCanvasAdapter
 */
import React from 'react';

export interface PartPracticeAnalysisCanvasProps {
    attempt?: any;
    onBack?: () => void;
}

export const PartPracticeAnalysisCanvas: React.FC<PartPracticeAnalysisCanvasProps> = () => null;
export default PartPracticeAnalysisCanvas;

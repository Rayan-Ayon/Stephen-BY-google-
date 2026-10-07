import React from 'react';
import WritingEvaluationCanvas, { type WritingEvaluationCanvasProps } from './WritingEvaluationCanvas';

export interface WritingAnalysisViewProps extends WritingEvaluationCanvasProps {}

export const WritingAnalysisView: React.FC<WritingAnalysisViewProps> = (props) => {
    return <WritingEvaluationCanvas {...props} />;
};

export default WritingAnalysisView;

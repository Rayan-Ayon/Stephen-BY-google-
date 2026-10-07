import React from 'react';
import IELTSAnalysisView, { type IELTSAnalysisViewProps } from '../ielts/IELTSAnalysisView';

export interface HistoryAnalysisModalProps extends IELTSAnalysisViewProps {
  isOpen?: boolean;
}

export const HistoryAnalysisModal: React.FC<HistoryAnalysisModalProps> = ({
  isOpen = true,
  isModal = true,
  onClose,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <IELTSAnalysisView
      {...props}
      isModal={isModal}
      onClose={onClose}
    />
  );
};

export default HistoryAnalysisModal;

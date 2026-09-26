import React, { useState } from 'react';
import ExamInstructionsScreen, { ModuleType } from './ExamInstructionsScreen';
import ExamModeSelectionScreen from './ExamModeSelectionScreen';
import DeviceCheckWizard from './DeviceCheckWizard';

export type OnboardingStep = 'INSTRUCTIONS' | 'MODE_SELECTION' | 'DEVICE_CHECK' | 'EXAM_PANEL';

export interface ExamLauncherFlowProps {
  module: ModuleType;
  bookNumber?: number;
  testNumber?: number;
  sourceType?: 'cambridge' | 'mock_series';
  category?: 'academic' | 'general';
  onExit: () => void;
  children: React.ReactNode;
}

/**
 * Central Exam Launcher Flow
 *
 * Enforces standardized pre-exam onboarding state machine:
 * - Listening: INSTRUCTIONS -> MODE_SELECTION -> EXAM_PANEL
 * - Writing:   INSTRUCTIONS -> MODE_SELECTION -> EXAM_PANEL
 * - Reading:   INSTRUCTIONS -> EXAM_PANEL (zero-friction direct start)
 * - Speaking:  INSTRUCTIONS -> DEVICE_CHECK -> EXAM_PANEL
 */
export const ExamLauncherFlow: React.FC<ExamLauncherFlowProps> = ({
  module,
  bookNumber = 7,
  testNumber = 1,
  sourceType = 'cambridge',
  category = 'academic',
  onExit,
  children,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('INSTRUCTIONS');

  const handleInstructionsStart = () => {
    if (module === 'reading') {
      // Reading bypasses Mode Selection directly to Exam
      setCurrentStep('EXAM_PANEL');
    } else if (module === 'speaking') {
      setCurrentStep('DEVICE_CHECK');
    } else {
      // Listening & Writing go to Mode Selection
      setCurrentStep('MODE_SELECTION');
    }
  };

  // STEP 1: Instructions Screen
  if (currentStep === 'INSTRUCTIONS') {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen bg-[#FAFAFA] dark:bg-[#0A0B0E] flex flex-col overflow-hidden">
        <ExamInstructionsScreen
          module={module}
          bookNumber={bookNumber}
          testNumber={testNumber}
          sourceType={sourceType}
          category={category}
          onStart={handleInstructionsStart}
          onExit={onExit}
        />
      </div>
    );
  }

  // STEP 2A: Mode Selection Screen (Listening & Writing)
  if (currentStep === 'MODE_SELECTION' && (module === 'listening' || module === 'writing')) {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen bg-[#FAFAFA] dark:bg-[#0A0B0E] flex flex-col overflow-hidden">
        <ExamModeSelectionScreen
          module={module}
          bookNumber={bookNumber}
          testNumber={testNumber}
          sourceType={sourceType}
          category={category}
          onSelectExamMode={() => setCurrentStep('EXAM_PANEL')}
          onBack={() => setCurrentStep('INSTRUCTIONS')}
          onExit={onExit}
        />
      </div>
    );
  }

  // STEP 2B: Device Check Wizard (Speaking)
  if (currentStep === 'DEVICE_CHECK' && module === 'speaking') {
    return (
      <div className="fixed inset-0 z-50 w-screen h-screen bg-[#FAFAFA] dark:bg-[#0A0B0E] flex flex-col overflow-hidden">
        <DeviceCheckWizard
          onComplete={() => setCurrentStep('EXAM_PANEL')}
          onSkip={() => setCurrentStep('EXAM_PANEL')}
          onBack={() => setCurrentStep('INSTRUCTIONS')}
        />
      </div>
    );
  }

  // FINAL: Active Exam Workspace Panel
  return <>{children}</>;
};

/**
 * Standalone ExamLauncherManager per Master Instruction specification
 */
export function ExamLauncherManager({
  moduleType,
  onExit,
  renderExamWorkspace,
}: {
  testId?: string;
  moduleType: ModuleType;
  bookNumber?: number;
  testNumber?: number;
  onExit?: () => void;
  renderExamWorkspace?: () => React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('INSTRUCTIONS');

  const handleInstructionsSubmit = () => {
    if (moduleType === 'reading') {
      setCurrentStep('EXAM_PANEL');
    } else if (moduleType === 'speaking') {
      setCurrentStep('DEVICE_CHECK');
    } else {
      setCurrentStep('MODE_SELECTION');
    }
  };

  if (currentStep === 'INSTRUCTIONS') {
    return (
      <ExamInstructionsScreen
        module={moduleType}
        onStart={handleInstructionsSubmit}
        onExit={onExit}
      />
    );
  }

  if (currentStep === 'MODE_SELECTION' && (moduleType === 'listening' || moduleType === 'writing')) {
    return (
      <ExamModeSelectionScreen
        module={moduleType}
        onSelectExamMode={() => setCurrentStep('EXAM_PANEL')}
        onBack={() => setCurrentStep('INSTRUCTIONS')}
        onExit={onExit}
      />
    );
  }

  if (currentStep === 'DEVICE_CHECK') {
    return (
      <DeviceCheckWizard
        onComplete={() => setCurrentStep('EXAM_PANEL')}
        onSkip={() => setCurrentStep('EXAM_PANEL')}
        onBack={() => setCurrentStep('INSTRUCTIONS')}
      />
    );
  }

  return renderExamWorkspace ? <>{renderExamWorkspace()}</> : null;
}

export default ExamLauncherFlow;

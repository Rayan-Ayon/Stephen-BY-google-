import React from 'react';
import { CohortMember } from '@/types/community';
import { CohortTransparencyMatrix } from './CohortTransparencyMatrix';
import { LiveActivityTicker } from './LiveActivityTicker';

interface RightAccountabilityMatrixProps {
  cohortId?: string;
  members: CohortMember[];
  onSelectMember?: (member: CohortMember) => void;
}

export const RightAccountabilityMatrix: React.FC<RightAccountabilityMatrixProps> = ({
  cohortId,
  members,
  onSelectMember
}) => {
  return (
    <div className="space-y-6">
      {/* Component 6: Transparency Matrix */}
      <CohortTransparencyMatrix
        members={members}
        onSelectMember={onSelectMember}
      />

      {/* Component 7: Live Activity Ticker */}
      <LiveActivityTicker cohortId={cohortId} />
    </div>
  );
};

export default RightAccountabilityMatrix;

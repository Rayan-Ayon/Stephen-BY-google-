import React, { useState } from 'react';
import { CohortMember } from '@/types/community';
import { Users, Award, Flame, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface CohortTransparencyMatrixProps {
  members: CohortMember[];
  onSelectMember?: (member: CohortMember) => void;
}

export const CohortTransparencyMatrix: React.FC<CohortTransparencyMatrixProps> = ({
  members,
  onSelectMember
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredMembers = members.filter((m) => {
    if (filter === 'completed') return m.dailyStatus === 'completed';
    if (filter === 'pending') return m.dailyStatus === 'pending' || m.dailyStatus === 'at_risk';
    return true;
  });

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-gray-900 text-sm">Transparency Matrix</h3>
        </div>
        <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">
          {members.length} Cohort Peers
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
        {(['all', 'completed', 'pending'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
              filter === tab
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Member Cards List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => onSelectMember?.(member)}
            className="p-3 border border-gray-100/90 rounded-xl flex items-center justify-between hover:border-indigo-200 hover:bg-slate-50/50 transition-all cursor-pointer group"
          >
            {/* Left side: Avatar + Name + Streak */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-800 shrink-0">
                {member.userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {member.userName}
                  </span>
                  <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200/80 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shrink-0">
                    🔥 {member.streakCount}d
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 truncate">
                  Latest: <span className="font-semibold text-gray-700">Band {member.latestMockBand ? member.latestMockBand.toFixed(1) : '7.0'}</span>
                </p>
              </div>
            </div>

            {/* Right side: Daily Status Pill */}
            <div className="shrink-0 text-right">
              {member.dailyStatus === 'completed' ? (
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Submitted
                </span>
              ) : member.dailyStatus === 'at_risk' ? (
                <span className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> At Risk
                </span>
              ) : (
                <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CohortTransparencyMatrix;

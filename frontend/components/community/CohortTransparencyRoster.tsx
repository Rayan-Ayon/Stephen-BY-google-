import React, { useState } from 'react';
import { CohortMember } from '@/types/community';
import { Users, CheckCircle2, Clock, Search, Flame, Award, Mail } from 'lucide-react';
import { obsidianTokens } from './obsidianTokens';

interface CohortTransparencyRosterProps {
  members: CohortMember[];
  onSelectMember?: (member: CohortMember) => void;
  onStartDirectMessage?: (member: CohortMember) => void;
}

export const CohortTransparencyRoster: React.FC<CohortTransparencyRosterProps> = ({
  members,
  onSelectMember,
  onStartDirectMessage
}) => {
  const [filter, setFilter] = useState<'all' | 'submitted' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter((m) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'submitted' && m.dailyStatus === 'completed') ||
      (filter === 'pending' && (m.dailyStatus === 'pending' || m.dailyStatus === 'at_risk'));

    const matchesSearch =
      searchQuery === '' ||
      m.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.userId && m.userId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const submittedCount = members.filter((m) => m.dailyStatus === 'completed').length;
  const pendingCount = members.length - submittedCount;

  return (
    <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-lg flex items-center justify-center ${obsidianTokens.badgeGreen}`}>
            <Users className="w-3.5 h-3.5 text-emerald-400" />
          </span>
          <h3 className="font-bold text-white text-sm tracking-tight">Cohort Transparency Matrix</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono font-bold bg-[#181C24] border border-[#222732] px-2.5 py-0.5 rounded-full">
          50 Max Cohort Limit • {members.length} Active Peers
        </span>
      </div>

      {/* Filter Segment Pills: [ All ] [ Submitted ] [ Pending ] */}
      <div className="flex items-center bg-[#181C24] p-1 rounded-xl gap-1 border border-[#222732]">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#15181E] text-white shadow-xs border border-[#222732]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({members.length})
        </button>
        <button
          onClick={() => setFilter('submitted')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'submitted'
              ? 'bg-emerald-950/50 text-emerald-400 shadow-xs border border-emerald-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Submitted ({submittedCount})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'pending'
              ? 'bg-amber-950/50 text-amber-400 shadow-xs border border-amber-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Pending ({pendingCount})
        </button>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter cohort peers..."
          className="w-full bg-[#181C24] border border-[#222732] text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-rose-600/70"
        />
      </div>

      {/* 50 Student Cards List (scrollable) */}
      <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar divide-y divide-[#222732]/40">
        {filteredMembers.map((member) => {
          const username = member.userName.toLowerCase().replace(/\s+/g, '_');
          const isSubmitted = member.dailyStatus === 'completed';

          return (
            <div
              key={member.id}
              className="pt-2 first:pt-0 flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-[#181C24] transition-colors group"
            >
              {/* Left: Avatar + Name + Handle + Streak */}
              <div
                onClick={() => onSelectMember?.(member)}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
              >
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#181C24] border border-[#222732] flex items-center justify-center font-bold text-xs text-slate-200">
                    {member.userName.charAt(0)}
                  </div>
                  {isSubmitted && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#15181E] rounded-full" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-rose-400 transition-colors truncate">
                      {member.userName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      @{username}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span className={`inline-flex items-center gap-0.5 font-bold ${obsidianTokens.badgeOrange} px-1.5 py-0.2 rounded-full`}>
                      🔥 {member.streakCount}d
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-300">
                      Band {member.latestMockBand ? member.latestMockBand.toFixed(1) : '7.0'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Submission Status Badge & Quick DM */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onSelectMember?.(member)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-rose-400 bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/60 px-2 py-1 rounded-lg cursor-pointer hidden sm:inline-flex items-center gap-1"
                >
                  View Profile / Audit Log
                </button>

                {isSubmitted ? (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${obsidianTokens.badgeGreen}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Submitted</span>
                  </span>
                ) : (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${obsidianTokens.badgeAmber}`}>
                    <Clock className="w-3 h-3" />
                    <span>Pending</span>
                  </span>
                )}

                <button
                  onClick={() => onStartDirectMessage?.(member)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-[#12141A] rounded-lg transition-colors cursor-pointer"
                  title={`Message ${member.userName}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CohortTransparencyRoster;

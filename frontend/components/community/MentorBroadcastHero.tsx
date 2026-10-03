import React from 'react';
import { Pin, CheckCircle2, ChevronRight, Clock, Award, Sparkles } from 'lucide-react';
import { MentorInfo } from '@/types/community';
import { obsidianTokens } from './obsidianTokens';

interface MentorBroadcastHeroProps {
  mentor: MentorInfo;
  mission: {
    title: string;
    description: string;
    submittedCount: number;
    totalAssigned: number;
  };
  onSubmitMission?: () => void;
}

export const MentorBroadcastHero: React.FC<MentorBroadcastHeroProps> = ({
  mentor,
  mission,
  onSubmitMission
}) => {
  const percentage = Math.round((mission.submittedCount / (mission.totalAssigned || 1)) * 100);

  return (
    <div className="relative overflow-hidden bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-sm">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Row: Pin Badge + Mentor Info */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className={`p-2 rounded-xl flex items-center justify-center ${obsidianTokens.badgeAmber}`}>
            <Pin className="w-4 h-4 fill-amber-400/20" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Mentor Broadcast &amp; Daily Mission
          </span>
        </div>

        <div className="flex items-center gap-2.5 bg-[#181C24] border border-[#222732] px-3.5 py-1.5 rounded-full shadow-inner">
          <img
            src={mentor.avatarUrl}
            alt={mentor.name}
            className="w-6 h-6 rounded-full object-cover border border-amber-400/60"
          />
          <span className="text-xs font-bold text-slate-200">{mentor.name}</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
          <span className="text-[10px] text-amber-400 font-extrabold bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-800/40">
            Band {mentor.bandScore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Pinned Directive Header */}
      <div className="space-y-2.5 mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
          Pinned Directive: {mission.title || 'Cambridge 18 Test 2 Task 2 Focus'}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          {mission.description || 'Submit your 250-word introduction and body paragraph 1 addressing double-question prompts without lexical repetition. Focus on clear topic sentences and nuanced coherence.'}
        </p>
      </div>

      {/* Submission Counter & Progress Bar (38 / 50 Submissions In - 76%) */}
      <div className="bg-[#181C24] border border-[#222732] rounded-xl p-4.5 space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Award className="w-4 h-4 text-rose-400" />
            <span>Cohort Submission Quota</span>
          </div>
          <div className="font-extrabold text-white text-sm">
            <span className="text-white text-base font-black">{mission.submittedCount}</span>
            <span className="text-slate-400 font-normal"> / {mission.totalAssigned} Submissions In </span>
            <span className="text-rose-400 font-mono">({percentage}%)</span>
          </div>
        </div>

        {/* Progress Bar with vibrant Crimson/Rose fill */}
        <div className="w-full h-2.5 bg-[#0D0F12] rounded-full overflow-hidden p-0.5 border border-[#222732]">
          <div
            className="h-full bg-rose-600 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Due tonight before 11:59 PM BST
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            12 Peer Submissions Remaining
          </span>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="text-xs text-slate-400 font-medium">
          Evaluated by AI Engine + Dr. Stephen Vance Official Assessment
        </span>
        <button
          onClick={onSubmitMission}
          className={`${obsidianTokens.btnCrimson} flex items-center gap-2 text-xs uppercase tracking-wider`}
        >
          <span>Submit Daily Mission</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MentorBroadcastHero;

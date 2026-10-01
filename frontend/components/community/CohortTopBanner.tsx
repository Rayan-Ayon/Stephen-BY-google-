import React from 'react';
import { CohortMetadata } from '@/types/community';
import { Sparkles, ShieldCheck, Flame, Users, Calendar, Trophy } from 'lucide-react';

interface CohortTopBannerProps {
  cohort: CohortMetadata;
}

export const CohortTopBanner: React.FC<CohortTopBannerProps> = ({ cohort }) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/40 shadow-lg relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Cohort Name & Meta */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Verified Masterclass Cohort
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Hub Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {cohort.name}
          </h1>

          <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed font-normal">
            {cohort.description}
          </p>

          <div className="flex items-center gap-4 pt-1 text-xs text-gray-300 flex-wrap">
            <div className="flex items-center gap-2">
              <img
                src={cohort.mentor.avatarUrl}
                alt={cohort.mentor.name}
                className="w-6 h-6 rounded-full object-cover border border-indigo-400"
              />
              <span className="font-semibold text-white">{cohort.mentor.name}</span>
              <span className="text-[10px] font-extrabold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.2 rounded">
                Band {cohort.mentor.bandScore}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Target: <strong className="text-white">Band {cohort.targetBand.toFixed(1)}+</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{cohort.dailyMission.totalAssigned} Registered Candidates</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Stats Pill Box */}
        <div className="shrink-0 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="text-center px-3 border-r border-white/10">
            <span className="block text-2xl font-black text-white">
              {cohort.currentAvgBand.toFixed(1)}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Batch Avg
            </span>
          </div>
          <div className="text-center px-3 border-r border-white/10">
            <span className="block text-2xl font-black text-amber-400">
              {cohort.dailyMission.submittedCount}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Missions In
            </span>
          </div>
          <div className="text-center px-3">
            <span className="block text-2xl font-black text-emerald-400">
              82%
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Engagement
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortTopBanner;

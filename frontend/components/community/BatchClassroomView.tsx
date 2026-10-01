import React, { useState, useEffect } from 'react';
import { CohortMetadata, CohortMember, BenchmarkItem, ProfileUser } from '@/types/community';
import { AudioVoiceNotePlayer } from './AudioVoiceNotePlayer';
import { obsidianTokens } from './obsidianTokens';

interface BatchClassroomViewProps {
  cohort: CohortMetadata;
  members: CohortMember[];
  benchmark: BenchmarkItem;
  onOpenBenchmarkModal: (bm: BenchmarkItem) => void;
  onSelectMemberForProfile: (member: CohortMember | ProfileUser) => void;
  onStartDirectMessage: (member: CohortMember | ProfileUser) => void;
}

export const BatchClassroomView: React.FC<BatchClassroomViewProps> = ({
  cohort,
  members,
  benchmark,
  onOpenBenchmarkModal,
  onSelectMemberForProfile,
  onStartDirectMessage,
}) => {
  const [memberSearch, setMemberSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [timeRemaining, setTimeRemaining] = useState({ hours: 4, minutes: 15, seconds: 0 });

  // Live session countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mission = cohort.dailyMission || {
    title: "Tonight's Focus: Cam 18 Task 2 Paraphrasing Traps",
    description: 'Submit your 250-word introduction and body paragraph 1 addressing double-question prompts without lexical repetition.',
    submittedCount: 38,
    totalAssigned: 50,
  };

  const progressPercent = Math.round((mission.submittedCount / mission.totalAssigned) * 100);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.userName.toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.userId && m.userId.toLowerCase().includes(memberSearch.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && m.dailyStatus === 'completed') ||
      (statusFilter === 'pending' && m.dailyStatus !== 'completed');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ══════════════════════════════════════════════════════════════════
          LEFT COLUMN: ACADEMIC DIRECTIVES (60% -> col-span-7)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="lg:col-span-7 space-y-6">
        {/* 1. Live Class Countdown Card */}
        <div className="bg-gradient-to-br from-[#1E293B] via-[#111827] to-[#111827] border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Live Broadcast Scheduled
              </div>
              <h2 className="text-xl font-extrabold text-slate-100">
                Cambridge 18 Academic Writing Masterclass
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Conducted by Senior Examiner Dr. Stephen Vance • Topic: Band 8.0 Concession Structures
              </p>
            </div>

            {/* Countdown Blocks */}
            <div className="flex items-center gap-2 font-mono">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-center min-w-[52px]">
                <span className="block text-xl font-black text-amber-400">
                  {String(timeRemaining.hours).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-500">Hours</span>
              </div>
              <span className="text-amber-500/80 font-bold">:</span>
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-center min-w-[52px]">
                <span className="block text-xl font-black text-amber-400">
                  {String(timeRemaining.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-500">Mins</span>
              </div>
              <span className="text-amber-500/80 font-bold">:</span>
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-center min-w-[52px]">
                <span className="block text-xl font-black text-amber-400">
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-500">Secs</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 relative z-10">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>📹</span> Zoom Meeting ID: <span className="font-mono text-slate-200">884 1029 3491</span>
            </span>
            <a
              href={cohort.liveMeetingUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <span>🚀</span> Join Zoom Live Class
            </a>
          </div>
        </div>

        {/* 2. Daily Academic Mission Card */}
        <div className={obsidianTokens.cardBg}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Daily Mission Directives
              </h3>
            </div>
            <span className="text-xs text-amber-400 font-mono font-bold">
              {mission.submittedCount} / {mission.totalAssigned} Submitted ({progressPercent}%)
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-100 mb-1.5">{mission.title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">{mission.description}</p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
            <span className="text-slate-400">
              Deadline: <span className="text-slate-200 font-medium">Tonight, 11:59 PM (BDT)</span>
            </span>
            <button
              onClick={() => alert('Mission submitted! Your essay draft has been queued for peer verification.')}
              className="px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              Submit Today's Draft →
            </button>
          </div>
        </div>

        {/* 3. Benchmark Spotlight Card (Band 8.0 Model + Mentor Voice Note) */}
        <div className="bg-[#111827] border border-amber-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  🏆 Benchmark Spotlight
                </span>
                <span className="text-xs text-slate-500 font-mono">Module: {benchmark.module.toUpperCase()}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{benchmark.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Authored by <span className="text-slate-200 font-semibold">{benchmark.studentName}</span>
              </p>
            </div>

            <div className="flex flex-col items-center bg-amber-500/15 border border-amber-500/30 rounded-xl px-3.5 py-2">
              <span className="text-2xl font-black text-amber-400 leading-none">{benchmark.bandScore}</span>
              <span className="text-[9px] uppercase font-bold text-amber-300/80 mt-1">Official Band</span>
            </div>
          </div>

          {/* AI Criteria Pills */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {benchmark.aiSubScores &&
              Object.entries(benchmark.aiSubScores).map(([key, val]) => (
                <div key={key} className="bg-slate-900 border border-slate-800 rounded-xl p-2 text-center">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase">{key}</span>
                  <span className="block text-sm font-bold text-emerald-400">{val}</span>
                </div>
              ))}
          </div>

          {/* Mentor Feedback & Voice Note */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <span>🎙️</span> Mentor Voice Annotation (Dr. Stephen Vance)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">0:28s</span>
            </div>

            <AudioVoiceNotePlayer
              audioUrl={benchmark.mentorVoiceNoteUrl || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'}
              senderRole="mentor"
              durationSeconds={28}
            />

            <p className="text-xs text-slate-300 italic pt-1 leading-relaxed">
              "{benchmark.highlightReason}"
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => onOpenBenchmarkModal(benchmark)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>📄</span> Read Full Model Submission &amp; Breakdown →
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT COLUMN: PEER ACCOUNTABILITY MATRIX (40% -> col-span-5)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
                <span>👥</span> Batch Accountability Matrix
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">50 Candidates in Batch #08</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'completed' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Done
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-4">
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Filter roster by candidate name..."
              className="w-full bg-[#1E293B] border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Scrollable Roster */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredMembers.map((member) => {
              const isCompleted = member.dailyStatus === 'completed';

              return (
                <div
                  key={member.id}
                  className="bg-[#1E293B]/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 transition-all flex items-center justify-between gap-3 group"
                >
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                    onClick={() => onSelectMemberForProfile(member)}
                  >
                    <div className="relative shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face"
                        alt={member.userName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#1E293B] ${
                          isCompleted ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate group-hover:text-amber-400 transition-colors">
                        {member.userName}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono text-slate-300">Band {member.latestMockBand}</span>
                        <span>•</span>
                        <span className="text-orange-400 font-mono">🔥 {member.streakCount}d</span>
                      </div>
                    </div>
                  </div>

                  {/* Daily Status Badge & DM Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={isCompleted ? obsidianTokens.badgeStatusDone : obsidianTokens.badgeStatusPending}>
                      {isCompleted ? '✓ Done' : '⏳ Pending'}
                    </span>

                    <button
                      onClick={() => onStartDirectMessage(member)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-400 text-xs transition-all"
                      title="Direct Message"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.502 49.177 49.177 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

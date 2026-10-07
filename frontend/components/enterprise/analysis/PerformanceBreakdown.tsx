import React from 'react';
import { Target, Clock, Sparkles } from 'lucide-react';

export interface QuestionTypeStat {
  typeLabel: string; // 'Matching', 'Gap Fill', 'Short Answer', 'Multiple Choice'
  correct: number;
  total: number;
  status: 'Needs Work' | 'Moderate' | 'Mastered' | 'On Target';
}

export interface PassageStat {
  passageNumber: number;
  title: string;
  correct: number;
  total: number;
  status: 'Needs Focus' | 'Good' | 'Excellent' | 'On Target';
}

export interface PerformanceBreakdownProps {
  bandScore: number;
  bandLabel?: string;
  correctCount: number;
  totalQuestions?: number;
  timeSpentSeconds?: number;
  questionTypeBreakdown: QuestionTypeStat[];
  passageBreakdown: PassageStat[];
  isLoading?: boolean;
}

export const PerformanceBreakdown: React.FC<PerformanceBreakdownProps> = ({
  bandScore,
  bandLabel,
  correctCount,
  totalQuestions = 40,
  timeSpentSeconds = 0,
  questionTypeBreakdown,
  passageBreakdown,
  isLoading = false,
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  };

  const accuracyPct = Math.round((correctCount / (totalQuestions || 40)) * 100);

  const resolvedBandLabel =
    bandLabel ||
    (bandScore >= 8.5
      ? 'Expert User'
      : bandScore >= 7.5
      ? 'Very Good User'
      : bandScore >= 6.5
      ? 'Competent User'
      : bandScore >= 5.5
      ? 'Modest User'
      : bandScore >= 4.0
      ? 'Limited User'
      : 'Non User');

  return (
    <div className="space-y-6">
      {/* ════ ROW 1: TOP 3 ANALYTICS KPI CARDS ════ */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Band Score */}
        <div className="bg-[#15181E] rounded-xl p-5 border border-[#222732] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Band Score</span>
            <span className="bg-rose-950/60 text-rose-400 border border-rose-800/50 text-[11px] font-bold px-2 py-0.5 rounded-md">
              Official Scale
            </span>
          </div>
          <div className="my-1">
            <div className={`text-4xl font-extrabold ${bandScore >= 6.5 ? 'text-emerald-400' : 'text-rose-500'}`}>
              {bandScore.toFixed(1)}
            </div>
            <div className="text-base font-bold text-white mt-1">
              {resolvedBandLabel}
            </div>
          </div>
          <p className="text-xs text-slate-400 pt-2 border-t border-[#222732]">
            {correctCount} of {totalQuestions} questions correct
          </p>
        </div>

        {/* Card 2: Accuracy Rate */}
        <div className="bg-[#15181E] rounded-xl p-5 border border-[#222732] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accuracy Rate</span>
            <div className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/50 text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1">
            <div className="text-4xl font-extrabold text-white">
              {accuracyPct}%
            </div>
            <div className="text-base font-medium text-slate-300 mt-1">
              Overall Accuracy
            </div>
          </div>
          <p className="text-xs text-slate-400 pt-2 border-t border-[#222732]">
            {correctCount}/{totalQuestions} correct responses
          </p>
        </div>

        {/* Card 3: Duration */}
        <div className="bg-[#15181E] rounded-xl p-5 border border-[#222732] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Duration</span>
            <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/50 text-purple-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-1">
            <div className="text-4xl font-extrabold text-white">
              {formatDuration(timeSpentSeconds)}
            </div>
            <div className="text-base font-medium text-slate-300 mt-1">
              Time Elapsed
            </div>
          </div>
          <p className="text-xs text-slate-400 pt-2 border-t border-[#222732]">
            Exam time limit: 60 minutes
          </p>
        </div>
      </section>

      {/* ════ ROW 2: PERFORMANCE BREAKDOWN CONTAINER ════ */}
      <section className="bg-[#15181E] rounded-xl p-5 sm:p-6 border border-[#222732] shadow-sm space-y-5">
        <div className="border-b border-[#222732] pb-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Performance Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Granular performance by question typology and individual passage sections</p>
          </div>
          {isLoading && (
            <span className="text-xs text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Syncing Supabase Cambridge data...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Col: Performance by Question Type */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Performance by Question Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {questionTypeBreakdown.map((item) => {
                const isMastered = item.status === 'Mastered' || item.status === 'On Target';
                return (
                  <div key={item.typeLabel} className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3.5 flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-200">{item.typeLabel}</span>
                      <span
                        className={
                          isMastered
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 font-semibold text-[10px] px-2 py-0.5 rounded-full'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-800/50 font-semibold text-[10px] px-2 py-0.5 rounded-full'
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-white">{item.correct}/{item.total}</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {Math.round((item.correct / (item.total || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Breakdown by Passage */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Breakdown by Passage</h3>
            <div className="space-y-3">
              {passageBreakdown.map((item) => {
                const pct = Math.round((item.correct / (item.total || 1)) * 100);
                const isFocus = item.status === 'Needs Focus';
                return (
                  <div key={item.passageNumber} className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-white">
                        Passage {item.passageNumber}: <span className="font-normal text-indigo-300 ml-1">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.correct}/{item.total}</span>
                        <span className={isFocus ? 'text-rose-400 font-bold text-xs flex items-center gap-1' : 'text-emerald-400 font-bold text-xs flex items-center gap-1'}>
                          {isFocus ? '❌ Needs Focus' : '✓ Good'}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#1E232E] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isFocus ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PerformanceBreakdown;

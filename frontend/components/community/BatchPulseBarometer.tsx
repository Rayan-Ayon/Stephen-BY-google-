import React from 'react';
import { Target, TrendingUp, CheckCircle2, Award, Zap } from 'lucide-react';

interface BatchPulseBarometerProps {
  currentAvgBand?: number;
  targetBand?: number;
  submittedCount?: number;
  totalAssigned?: number;
}

export const BatchPulseBarometer: React.FC<BatchPulseBarometerProps> = ({
  currentAvgBand = 6.8,
  targetBand = 7.5,
  submittedCount = 38,
  totalAssigned = 50
}) => {
  const percentage = Math.round((submittedCount / (totalAssigned || 1)) * 100);
  const bandDelta = Math.max(0, Number((targetBand - currentAvgBand).toFixed(1)));

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Batch Health Barometer</h4>
            <p className="text-[11px] text-gray-500">Real-time aggregate performance</p>
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Optimal Pulse
        </span>
      </div>

      {/* Band Score Trajectory Box */}
      <div className="bg-gradient-to-r from-gray-50 via-slate-50 to-indigo-50/30 border border-gray-200/70 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Cohort Avg</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-gray-900">Band {currentAvgBand.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-indigo-600">
            <span className="text-xs font-semibold">→</span>
            <span className="text-[11px] font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              +{bandDelta} needed
            </span>
          </div>

          <div className="space-y-0.5 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Cohort Target</span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-black text-indigo-700">Band {targetBand.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Track */}
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, (currentAvgBand / targetBand) * 100)}%` }}
          />
        </div>
      </div>

      {/* Daily Mission Submission Gauge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Daily Mission Rate</span>
          </div>
          <span className="font-extrabold text-gray-900">
            {submittedCount} / {totalAssigned} <span className="text-gray-400 font-normal">({percentage}%)</span>
          </span>
        </div>

        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-emerald-500 to-emerald-600 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-[11px] text-gray-500 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{totalAssigned - submittedCount} students remaining for today's quota.</span>
        </p>
      </div>
    </div>
  );
};

export default BatchPulseBarometer;

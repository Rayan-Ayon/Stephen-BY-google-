import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface WizardProps {
  onPlanCreated: () => void;
  onCancel?: () => void;
  initialValues?: {
    current_band?: number;
    target_band?: number;
    duration_weeks?: number;
    daily_minutes?: number;
    exam_type?: string;
    weak_areas?: string[];
  };
}

export const StudyPlanOnboardingWizard: React.FC<WizardProps> = ({
  onPlanCreated,
  onCancel,
  initialValues,
}) => {
  const [step, setStep] = useState(1);
  const [currentBand, setCurrentBand] = useState<number>(initialValues?.current_band ?? 6.0);
  const [targetBand, setTargetBand] = useState<number>(initialValues?.target_band ?? 7.5);
  const [examType, setExamType] = useState<string>(initialValues?.exam_type ?? 'academic');
  const [durationWeeks, setDurationWeeks] = useState<number>(initialValues?.duration_weeks ?? 4);
  const [dailyMinutes, setDailyMinutes] = useState<number>(initialValues?.daily_minutes ?? 45);
  const [weakAreas, setWeakAreas] = useState<string[]>(
    initialValues?.weak_areas && initialValues.weak_areas.length > 0
      ? initialValues.weak_areas
      : ['Writing', 'Speaking']
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleWeakArea = (area: string) => {
    setWeakAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const API_BASE = (import.meta as any).env?.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/study-plan/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({
          current_band: currentBand,
          target_band: targetBand,
          exam_type: examType,
          duration_weeks: durationWeeks,
          daily_minutes: dailyMinutes,
          weak_areas: weakAreas,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        let message = errJson?.detail;
        if (!message) {
          if (res.status === 401) {
            message = 'Authentication session expired or missing token. Please sign in again.';
          } else if (res.status === 404) {
            message = 'Endpoint /api/study-plan/generate not found (404). Please ensure the backend server has reloaded.';
          } else {
            message = `Server responded with status ${res.status}.`;
          }
        }
        throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
      }

      onPlanCreated();
    } catch (e: any) {
      console.error('[STUDY_PLAN_WIZARD]', e);
      setErrorMsg(e?.message || 'Error generating plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0D10]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#14171F] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition p-1 text-sm rounded-lg hover:bg-zinc-800"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="text-base font-semibold text-white">
              Synthesizing Your Cambridge Study Plan...
            </h3>
            <p className="text-xs text-zinc-400 mt-2 max-w-xs">
              Calculating daily targets, sequencing foundational exercises, and constructing daily missions.
            </p>
          </div>
        ) : (
          <>
            {/* Step 1: Band Goals & Exam Type */}
            {step === 1 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Step 1 of 3 · Target Calibration
                </span>
                <h2 className="text-lg font-bold text-white mt-1">What are your Band Goals?</h2>

                {/* Exam Type Toggle */}
                <div className="flex bg-[#101217] p-1 rounded-xl border border-zinc-800 mt-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setExamType('academic')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      examType === 'academic'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    🎓 IELTS Academic
                  </button>
                  <button
                    type="button"
                    onClick={() => setExamType('general')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      examType === 'general'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    💼 General Training
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="bg-[#101217] p-4 rounded-xl border border-zinc-800">
                    <label className="text-xs text-zinc-400">Current Starting Band</label>
                    <select
                      value={currentBand}
                      onChange={(e) => setCurrentBand(parseFloat(e.target.value))}
                      className="w-full mt-2 bg-[#191D26] text-white p-2 rounded-lg border border-zinc-700 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0].map((b) => (
                        <option key={b} value={b}>
                          Band {b.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-[#101217] p-4 rounded-xl border border-zinc-800">
                    <label className="text-xs text-zinc-400">Target Band Score</label>
                    <select
                      value={targetBand}
                      onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                      className="w-full mt-2 bg-[#191D26] text-emerald-400 p-2 rounded-lg border border-emerald-500/40 text-sm font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                        <option key={b} value={b}>
                          Band {b.toFixed(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  Next: Time Commitment →
                </button>
              </div>
            )}

            {/* Step 2: Time & Duration */}
            {step === 2 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Step 2 of 3 · Timeline & Budget
                </span>
                <h2 className="text-lg font-bold text-white mt-1">When is your exam?</h2>
                <div className="space-y-4 my-6">
                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block">Preparation Duration</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: '2 Weeks', val: 2 },
                        { label: '1 Month', val: 4 },
                        { label: '2 Months', val: 8 },
                        { label: '3 Months', val: 12 },
                      ].map((d) => (
                        <button
                          key={d.val}
                          type="button"
                          onClick={() => setDurationWeeks(d.val)}
                          className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                            durationWeeks === d.val
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                              : 'bg-[#101217] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block">
                      Daily Available Study Time
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: '30 mins', val: 30 },
                        { label: '45 mins', val: 45 },
                        { label: '1.5 hrs', val: 90 },
                        { label: '2+ hrs', val: 120 },
                      ].map((t) => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() => setDailyMinutes(t.val)}
                          className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                            dailyMinutes === t.val
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                              : 'bg-[#101217] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-2.5 px-4 rounded-xl border border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-800 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                  >
                    Next: Focus Areas →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Priority Focus */}
            {step === 3 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Step 3 of 3 · Focus Strategy
                </span>
                <h2 className="text-lg font-bold text-white mt-1">Select your Weakest Modules</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  We'll dedicate extra missions and priority diagnostics to these areas.
                </p>
                <div className="grid grid-cols-2 gap-2 my-5">
                  {['Writing', 'Speaking', 'Reading', 'Listening', 'Grammar', 'Vocabulary'].map(
                    (mod) => (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => toggleWeakArea(mod)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                          weakAreas.includes(mod)
                            ? 'bg-rose-500/10 border-rose-500/60 text-rose-300 shadow-sm'
                            : 'bg-[#101217] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span>{mod}</span>
                        <span>{weakAreas.includes(mod) ? '🎯 Priority' : '+'}</span>
                      </button>
                    )
                  )}
                </div>

                {errorMsg && (
                  <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                    {errorMsg}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-2.5 px-4 rounded-xl border border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-800 transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                  >
                    Generate My Personalized Plan 🚀
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

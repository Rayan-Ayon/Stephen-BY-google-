import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, XIcon } from './icons';
import { supabase } from '@/lib/supabaseClient';
import { StudyPlanOnboardingWizard } from './study-plan/StudyPlanOnboardingWizard';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StudyPlanViewProps {
  userEmail: string;
  onNavigate?: (view: string) => void;
}

export type Skill = 'Reading' | 'Speaking' | 'Listening' | 'Grammar' | 'Writing' | 'Vocabulary';

export interface StudyPlanRecord {
  id: string;
  user_id: string;
  current_band: number;
  target_band: number;
  exam_type: string;
  duration_weeks: number;
  daily_minutes: number;
  exam_date?: string;
  weak_areas: string[];
  phase_name: string;
  is_active: boolean;
  created_at: string;
}

export interface StudyPlanTaskRecord {
  id: string;
  plan_id: string;
  user_id: string;
  scheduled_date: string;
  module: string;
  title: string;
  subtitle?: string;
  duration_minutes: number;
  xp_reward: number;
  task_type: string;
  notes_bangla?: string;
  video_url?: string;
  video_title?: string;
  action_route?: string;
  is_completed: boolean;
  completed_at?: string;
  created_at?: string;
}

export interface StudyPlanMetrics {
  completed_tasks: number;
  total_tasks: number;
  progress_percentage: number;
  day_streak: number;
}

// ─── Visual Constants & Helpers ──────────────────────────────────────────────

const SKILL_COLORS: Record<Skill, { pill: string; text: string; border: string; bg: string }> = {
  Reading:     { pill: 'border border-blue-500/50 bg-blue-950/30 text-blue-400',    text: 'text-blue-400',    border: 'border-blue-600/40',    bg: 'bg-blue-950/40' },
  Speaking:    { pill: 'border border-purple-500/50 bg-purple-950/30 text-purple-400', text: 'text-purple-400', border: 'border-purple-600/40', bg: 'bg-purple-950/40' },
  Listening:   { pill: 'border border-orange-500/50 bg-orange-950/30 text-orange-400', text: 'text-orange-400', border: 'border-orange-600/40', bg: 'bg-orange-950/40' },
  Grammar:     { pill: 'border border-indigo-500/50 bg-indigo-950/30 text-indigo-400', text: 'text-indigo-400', border: 'border-indigo-600/40', bg: 'bg-indigo-950/40' },
  Writing:     { pill: 'border border-emerald-500/50 bg-emerald-950/30 text-emerald-400', text: 'text-emerald-400', border: 'border-emerald-600/40', bg: 'bg-emerald-950/40' },
  Vocabulary:  { pill: 'border border-pink-500/50 bg-pink-950/30 text-pink-400',    text: 'text-pink-400',    border: 'border-pink-600/40',    bg: 'bg-pink-950/40' },
};

const SKILL_EMOJI: Record<Skill, string> = {
  Reading: '📘', Speaking: '🎙', Listening: '🎧', Grammar: '🧠', Writing: '✏️', Vocabulary: '📚',
};

const SKILL_ICON_CIRCLE: Record<Skill, string> = {
  Reading: 'bg-blue-500/20 text-blue-400',
  Speaking: 'bg-purple-500/20 text-purple-400',
  Listening: 'bg-orange-500/20 text-orange-400',
  Grammar: 'bg-indigo-500/20 text-indigo-400',
  Writing: 'bg-emerald-500/20 text-emerald-400',
  Vocabulary: 'bg-pink-500/20 text-pink-400',
};

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function normalizeSkill(raw: string): Skill {
  const lower = (raw || '').toLowerCase().trim();
  if (lower.startsWith('read')) return 'Reading';
  if (lower.startsWith('speak')) return 'Speaking';
  if (lower.startsWith('listen')) return 'Listening';
  if (lower.startsWith('writ')) return 'Writing';
  if (lower.startsWith('gram')) return 'Grammar';
  if (lower.startsWith('vocab')) return 'Vocabulary';
  return 'Reading';
}

function SkillPill({ skill, size = 'xs' }: { skill: Skill; size?: 'xs' | 'sm' }) {
  const colors = SKILL_COLORS[skill] || SKILL_COLORS.Reading;
  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-2 py-0.5'
    : 'text-xs px-3 py-1';
  return (
    <span className={`${colors.pill} ${sizeClasses} rounded-full font-medium inline-flex items-center gap-1`}>
      <span>{SKILL_EMOJI[skill]}</span>
      <span className="truncate">{skill}</span>
    </span>
  );
}

function buildMonthGrid(year: number, monthIndex: number): (number | null)[][] {
  const firstDay = new Date(year, monthIndex, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sun
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();

  const grid: (number | null)[][] = [];
  let dayCounter = 1;

  for (let row = 0; row < 6; row++) {
    const week: (number | null)[] = [];
    for (let col = 0; col < 7; col++) {
      const cellIndex = row * 7 + col;
      if (cellIndex < startDayOfWeek || dayCounter > totalDays) {
        week.push(null);
      } else {
        week.push(dayCounter);
        dayCounter++;
      }
    }
    grid.push(week);
    if (dayCounter > totalDays) break;
  }
  return grid;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StudyPlanView({ userEmail, onNavigate }: StudyPlanViewProps) {
  const [loading, setLoading] = useState(true);
  const [hasPlan, setHasPlan] = useState<boolean>(false);
  const [plan, setPlan] = useState<StudyPlanRecord | null>(null);
  const [tasks, setTasks] = useState<StudyPlanTaskRecord[]>([]);
  const [metrics, setMetrics] = useState<StudyPlanMetrics>({
    completed_tasks: 0,
    total_tasks: 0,
    progress_percentage: 0,
    day_streak: 0,
  });

  const [showWizard, setShowWizard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<StudyPlanTaskRecord | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  // Calendar View State: Year and Month
  const todayDate = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth());

  // Fetch active plan
  const fetchActivePlan = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const API_BASE = (import.meta as any).env?.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/study-plan/active`, {
        headers: {
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
      });

      if (!res.ok) {
        setHasPlan(false);
        setPlan(null);
        setTasks([]);
        return;
      }

      const data = await res.json();
      if (data?.has_plan && data.plan) {
        setHasPlan(true);
        setPlan(data.plan);
        const taskList: StudyPlanTaskRecord[] = data.tasks || [];
        setTasks(taskList);
        setMetrics(data.metrics || {
          completed_tasks: 0,
          total_tasks: taskList.length,
          progress_percentage: 0,
          day_streak: 0,
        });

        // Set calendar to first task date or today
        if (taskList.length > 0) {
          const firstDateStr = taskList[0].scheduled_date;
          const firstD = new Date(firstDateStr);
          if (!isNaN(firstD.getTime())) {
            // Keep current view if within bounds, else jump to task start
            setCurrentYear(firstD.getFullYear());
            setCurrentMonth(firstD.getMonth());
          }
        }
      } else {
        setHasPlan(false);
        setPlan(null);
        setTasks([]);
      }
    } catch (e) {
      console.error('[STUDY_PLAN] fetch error:', e);
      setHasPlan(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivePlan();
  }, [fetchActivePlan]);

  // Tasks grouped by "YYYY-MM-DD"
  const tasksByDate = useMemo(() => {
    const map: Record<string, StudyPlanTaskRecord[]> = {};
    for (const t of tasks) {
      const d = (t.scheduled_date || '').split('T')[0];
      if (!map[d]) map[d] = [];
      map[d].push(t);
    }
    return map;
  }, [tasks]);

  // Tasks indexed by day of current month (e.g., 1..31)
  const tasksByDayOfMonth = useMemo(() => {
    const map: Record<number, StudyPlanTaskRecord> = {};
    for (const t of tasks) {
      const d = (t.scheduled_date || '').split('T')[0];
      const [yStr, mStr, dayStr] = d.split('-');
      const y = parseInt(yStr, 10);
      const m = parseInt(mStr, 10) - 1;
      const day = parseInt(dayStr, 10);
      if (y === currentYear && m === currentMonth) {
        // take first task of the day
        if (!map[day]) {
          map[day] = t;
        }
      }
    }
    return map;
  }, [tasks, currentYear, currentMonth]);

  // Today's Mission Task: Check today's date, or first uncompleted task, or first task
  const todayIso = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const todaysMission = useMemo(() => {
    if (tasks.length === 0) return null;
    const matchToday = tasks.find((t) => (t.scheduled_date || '').split('T')[0] === todayIso);
    if (matchToday) return matchToday;
    const firstPending = tasks.find((t) => !t.is_completed);
    return firstPending || tasks[0];
  }, [tasks, todayIso]);

  // Focus counts for the current week / entire plan
  const focusCounts = useMemo(() => {
    const counts: Record<Skill, number> = {
      Reading: 0,
      Speaking: 0,
      Listening: 0,
      Grammar: 0,
      Writing: 0,
      Vocabulary: 0,
    };
    for (const t of tasks) {
      const skill = normalizeSkill(t.module);
      counts[skill] = (counts[skill] || 0) + 1;
    }
    return counts;
  }, [tasks]);

  // Calendar month grid
  const monthGrid = useMemo(() => {
    return buildMonthGrid(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Click on a calendar day
  const handleDayClick = (dayNumber: number) => {
    const task = tasksByDayOfMonth[dayNumber];
    if (task) {
      setSelectedTask(task);
      setShowModal(true);
    }
  };

  // Toggle Task Completion
  const handleToggleTask = async (taskId: string, newCompleted: boolean) => {
    setIsToggling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const API_BASE = (import.meta as any).env?.VITE_API_URL || '';
      const res = await fetch(`${API_BASE}/api/study-plan/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ is_completed: newCompleted }),
      });

      if (res.ok) {
        const resData = await res.json();
        const updatedTask = resData.task;

        // Update tasks in local state
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, ...updatedTask } : t))
        );
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask((prev) => (prev ? { ...prev, ...updatedTask } : null));
        }

        // Recalculate metrics
        setMetrics((prev) => {
          const delta = newCompleted ? 1 : -1;
          const newCompletedCount = Math.max(0, prev.completed_tasks + delta);
          const total = prev.total_tasks || 1;
          return {
            ...prev,
            completed_tasks: newCompletedCount,
            progress_percentage: Math.round((newCompletedCount / total) * 100 * 10) / 10,
          };
        });
      }
    } catch (e) {
      console.error('[STUDY_PLAN] Error toggling task:', e);
    } finally {
      setIsToggling(false);
    }
  };

  // Open action route
  const handleLaunchTaskRoute = (actionRoute?: string) => {
    setShowModal(false);
    if (!actionRoute) return;

    if (onNavigate) {
      // Map routes to internal navigation keys
      if (actionRoute.includes('reading')) onNavigate('reading_hub');
      else if (actionRoute.includes('speaking')) onNavigate('ai_speaking_partner');
      else if (actionRoute.includes('rewriter') || actionRoute.includes('writing')) onNavigate('ai_rewriter');
      else if (actionRoute.includes('practice') || actionRoute.includes('part')) onNavigate('part_practice');
      else onNavigate(actionRoute.replace('/', ''));
    } else {
      window.location.href = actionRoute;
    }
  };

  // Loading skeleton screen
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-neutral-100 p-8 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">
          Hydrating Personalized Study Plan...
        </p>
      </div>
    );
  }

  // 1. Empty / Diagnostic Gate (If no active plan exists)
  if (!hasPlan || !plan) {
    return (
      <div className="min-h-screen bg-[#0D0F12] flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl mb-3">📅</span>
        <h1 className="text-xl font-bold text-white">Personalized Cambridge Study Plan</h1>
        <p className="text-xs text-zinc-400 max-w-md mt-2 mb-6">
          Stop guessing what to practice every day. Activate your personalized IELTS roadmap calibrated to your target band and daily schedule.
        </p>
        <button
          onClick={() => setShowWizard(true)}
          className="px-6 py-3 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
        >
          <span>Take 2-Minute Diagnostic & Activate Plan →</span>
        </button>

        {showWizard && (
          <StudyPlanOnboardingWizard
            onPlanCreated={() => {
              setShowWizard(false);
              fetchActivePlan();
            }}
            onCancel={() => setShowWizard(false)}
          />
        )}
      </div>
    );
  }

  // 2. Active Dashboard View
  const todayMonth = todayDate.getMonth();
  const todayYear = todayDate.getFullYear();
  const todayDayNum = todayDate.getDate();

  return (
    <div className="min-h-screen bg-black text-neutral-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">Study Plan</h1>
          <span className="inline-block mt-2 bg-neutral-800/80 text-blue-400 border border-neutral-700/50 px-2.5 py-0.5 text-xs rounded-full">
            🗺️ {plan.phase_name || `Phase 1: Foundation to Band ${plan.target_band}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWizard(true)}
            className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-3 py-1.5 text-sm hover:bg-neutral-800 transition flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            Edit plan
          </button>
          <div className="bg-neutral-800/60 border border-neutral-700/40 rounded-xl px-4 py-1.5 text-sm text-neutral-200 flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="text-neutral-400 hover:text-white transition p-0.5"
              aria-label="Previous Month"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="font-medium whitespace-nowrap">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="text-neutral-400 hover:text-white transition p-0.5"
              aria-label="Next Month"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Current Band', value: plan.current_band.toFixed(1), sub: 'Starting point', icon: '🎯' },
          { label: 'Target Band', value: plan.target_band.toFixed(1), sub: 'Your goal', icon: '🏆' },
          { label: 'Day Streak', value: `${metrics.day_streak}`, sub: metrics.day_streak > 0 ? 'Momentum active' : 'Start today', icon: '🔥', suffix: ' 🔥' },
          { label: 'Progress', value: `${metrics.completed_tasks}/${metrics.total_tasks}`, sub: `${metrics.progress_percentage}% complete`, icon: '☑️' },
        ].map((m, i) => (
          <div key={i} className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between relative min-h-[100px]">
            <div className="absolute top-4 right-4 text-xl opacity-60">{m.icon}</div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-1">{m.label}</p>
              <p className="text-3xl font-extrabold text-white">{m.value}{m.suffix || ''}</p>
            </div>
            <p className="text-xs text-neutral-500 mt-2">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Today's Mission Hero Card ───────────────────────────── */}
      {todaysMission && (
        <div className="bg-gradient-to-r from-rose-600 to-red-600 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="text-xs uppercase font-semibold text-rose-100 tracking-wider">🎯 Today's Mission</span>
            <h2 className="text-2xl font-bold mt-1 capitalize">{todaysMission.module}</h2>
            <p className="text-rose-100 mt-1 text-sm">{todaysMission.title} {todaysMission.subtitle ? `— ${todaysMission.subtitle}` : ''}</p>
            <div className="flex items-center gap-4 mt-4 text-sm opacity-90">
              <span>⏱ {todaysMission.duration_minutes} min</span>
              <span>⚡ +{todaysMission.xp_reward} XP</span>
              {todaysMission.is_completed && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">✓ Done</span>}
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedTask(todaysMission);
              setShowModal(true);
            }}
            className="bg-white text-rose-600 font-semibold px-5 py-2 rounded-full shadow hover:bg-rose-50 flex items-center gap-2 transition whitespace-nowrap"
          >
            <PlayIcon className="w-4 h-4" /> Start
          </button>
        </div>
      )}

      {/* ── This Week's Focus ───────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-2">This Week's Focus</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {(['Reading', 'Speaking', 'Listening', 'Grammar', 'Writing', 'Vocabulary'] as Skill[])
            .filter((s) => focusCounts[s] > 0)
            .map((skill) => {
              const colors = SKILL_COLORS[skill];
              return (
                <span key={skill} className={`${colors.bg} ${colors.border} border ${colors.text} px-3 py-1 rounded-full text-xs font-medium`}>
                  {SKILL_EMOJI[skill]} {skill} ×{focusCounts[skill]}
                </span>
              );
            })}
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300">
          📊 Overall Curriculum: {metrics.completed_tasks}/{metrics.total_tasks} tasks done · {Math.round((metrics.completed_tasks * (plan.daily_minutes || 30)) / 60)} hours completed
        </div>
      </div>

      {/* ── Calendar Grid ───────────────────────────────────────── */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} className="text-center text-[10px] uppercase tracking-wider text-neutral-500 font-semibold py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {monthGrid.map((week, ri) =>
            week.map((day, ci) => {
              if (day === null) {
                return <div key={`empty-${ri}-${ci}`} className="min-h-[90px]" />;
              }
              const taskData = tasksByDayOfMonth[day];
              const isToday =
                currentYear === todayYear &&
                currentMonth === todayMonth &&
                day === todayDayNum;

              // Check if date is in past
              const cellDate = new Date(currentYear, currentMonth, day);
              const isPast = cellDate < new Date(todayYear, todayMonth, todayDayNum);
              const isOverdue = isPast && taskData && !taskData.is_completed;

              const skillName = taskData ? normalizeSkill(taskData.module) : null;

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`rounded-2xl p-3 min-h-[90px] transition relative flex flex-col justify-between ${
                    isToday
                      ? 'bg-rose-600 text-white rounded-2xl shadow-lg ring-2 ring-rose-500 cursor-pointer'
                      : taskData
                        ? 'bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer'
                        : isPast
                          ? 'bg-neutral-900/30 border border-neutral-800/40 opacity-40'
                          : 'bg-neutral-900/60 border border-neutral-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isToday ? 'text-white' : isPast ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      {day}
                    </span>

                    {/* Completion or Overdue Indicators */}
                    {taskData?.is_completed ? (
                      <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                    ) : isOverdue ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30" title="Overdue / Incomplete" />
                    ) : null}
                  </div>

                  {taskData && skillName && (
                    <div className="mt-1.5 flex flex-col gap-1">
                      <SkillPill skill={skillName} size="xs" />
                      {isOverdue && !isToday && (
                        <span className="text-[9px] text-amber-400 font-medium">⚠️ Overdue</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Day Detail Modal (Screenshots 15 & 16) ────────────────── */}
      <AnimatePresence>
        {showModal && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 text-neutral-100 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition"
              >
                <XIcon className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              {(() => {
                const sDate = new Date(selectedTask.scheduled_date);
                const dayName = isNaN(sDate.getTime()) ? '' : sDate.toLocaleDateString('en-US', { weekday: 'long' });
                const dateStr = isNaN(sDate.getTime()) ? selectedTask.scheduled_date : sDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                const skill = normalizeSkill(selectedTask.module);

                return (
                  <>
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="text-lg font-bold text-white">{dayName}</h3>
                        <p className="text-xs text-neutral-400 mt-0.5">{dateStr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold text-sm">{selectedTask.duration_minutes} min</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">EST. TIME</p>
                      </div>
                    </div>

                    {/* Main Subject Panel */}
                    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-4 mb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${SKILL_ICON_CIRCLE[skill]}`}>
                          {SKILL_EMOJI[skill]}
                        </div>
                        <span className={`text-sm font-semibold ${SKILL_COLORS[skill].text}`}>{skill}</span>
                      </div>
                      <p className="text-sm font-medium text-white mb-3">{selectedTask.title}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-neutral-700/50 text-neutral-300 text-[10px] px-2 py-0.5 rounded-full border border-neutral-600/30">
                          {selectedTask.task_type === 'drill' ? '🎯 Drill' : '📹 Video Lesson'}
                        </span>
                        <span className="bg-neutral-700/50 text-neutral-300 text-[10px] px-2 py-0.5 rounded-full border border-neutral-600/30">
                          {plan.phase_name || 'Phase 1 - Foundation'}
                        </span>
                        <span className="bg-amber-900/30 text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-600/30">
                          ⚡ +{selectedTask.xp_reward} XP
                        </span>
                      </div>
                    </div>

                    {/* Note Item in Bangla */}
                    <div className="bg-neutral-800/30 border border-neutral-700/30 rounded-xl p-3 flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📘</span>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {selectedTask.subtitle || 'Instructional Note'}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {selectedTask.notes_bangla || `${skill} Module · Note in Bangla`}
                          </p>
                        </div>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    </div>

                    {/* YouTube Video Item */}
                    {selectedTask.video_title && (
                      <a
                        href={selectedTask.video_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedTask.video_title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-neutral-800/30 border border-neutral-700/30 rounded-xl p-3 flex items-center justify-between hover:bg-neutral-800/60 transition mb-3 block"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg flex-shrink-0">📹</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">{selectedTask.video_title}</p>
                            <p className="text-[11px] text-neutral-400 truncate">Educational Lesson · YouTube video</p>
                          </div>
                        </div>
                        <PlayIcon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                      </a>
                    )}

                    {/* Primary Footer Button */}
                    <button
                      onClick={() => handleLaunchTaskRoute(selectedTask.action_route)}
                      className="bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 rounded-2xl w-full text-center flex items-center justify-center gap-2 shadow-lg shadow-rose-950/30 mt-4 transition"
                    >
                      <PlayIcon className="w-4 h-4" /> Open lesson / Launch Practice
                    </button>

                    {/* Completion Toggle Button */}
                    <button
                      disabled={isToggling}
                      onClick={() => handleToggleTask(selectedTask.id, !selectedTask.is_completed)}
                      className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedTask.is_completed
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {selectedTask.is_completed ? '✓ Completed (Click to Undo)' : 'Mark as Completed'}
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Plan Wizard Modal ─────────────────────────────── */}
      {showWizard && (
        <StudyPlanOnboardingWizard
          initialValues={{
            current_band: plan.current_band,
            target_band: plan.target_band,
            duration_weeks: plan.duration_weeks,
            daily_minutes: plan.daily_minutes,
            exam_type: plan.exam_type,
            weak_areas: plan.weak_areas,
          }}
          onPlanCreated={() => {
            setShowWizard(false);
            fetchActivePlan();
          }}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}

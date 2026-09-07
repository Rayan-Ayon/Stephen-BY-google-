import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, XIcon } from './icons';

// ─── Types ───────────────────────────────────────────────────────────────────

interface StudyPlanViewProps {
  userEmail: string;
}

type Skill = 'Reading' | 'Speaking' | 'Listening' | 'Grammar' | 'Writing' | 'Vocabulary';

interface LessonTask {
  dayName: string;
  dateStr: string;
  skill: Skill;
  estTime: string;
  xp: string;
  topicTitle: string;
  noteTitle: string;
  noteSub: string;
  videoTitle: string;
  videoSub: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const STUDY_PLAN_DATA: Record<number, LessonTask> = {
  6: { dayName: "Sunday", dateStr: "September 6, 2026", skill: "Reading", estTime: "35 min", xp: "+20 XP", topicTitle: "২.১ Format Overview — পরীক্ষার কাঠামো", noteTitle: "২.১ Format Overview — পরীক্ষার কাঠামো", noteSub: "Reading Module · note in Bangla", videoTitle: "IELTS Reading Test Format / Introduction for Academic and General Training", videoSub: "IELTS with Liz (IELTS Liz) · YouTube video" },
  7: { dayName: "Monday", dateStr: "September 7, 2026", skill: "Reading", estTime: "35 min", xp: "+20 XP", topicTitle: "২.২ Question Types — সকল প্রশ্নের ধরন", noteTitle: "২.২ Question Types — সকল প্রশ্নের ধরন", noteSub: "Reading Module · note in Bangla", videoTitle: "IELTS Reading Test Format / Introduction for Academic and General Training", videoSub: "IELTS with Liz (IELTS Liz) · YouTube video" },
  8: { dayName: "Tuesday", dateStr: "September 8, 2026", skill: "Speaking", estTime: "30 min", xp: "+20 XP", topicTitle: "Format এবং Assessment Criteria", noteTitle: "Format এবং Assessment Criteria", noteSub: "Speaking Module · note in Bangla", videoTitle: "How IELTS Speaking Is Scored | Band Descriptors Explained in Simple Words!", videoSub: "IELTS with Asad (Asad Yaqub) · YouTube video" },
  9: { dayName: "Wednesday", dateStr: "September 9, 2026", skill: "Speaking", estTime: "30 min", xp: "+20 XP", topicTitle: "Part 1 Fluency & Spontaneity Drills", noteTitle: "Part 1 Fluency & Spontaneity Drills", noteSub: "Speaking Module · note in Bangla", videoTitle: "IELTS Speaking Part 1: Top Strategies & Model Answers", videoSub: "E2 IELTS · YouTube video" },
  10: { dayName: "Thursday", dateStr: "September 10, 2026", skill: "Listening", estTime: "40 min", xp: "+20 XP", topicTitle: "১.১ Format Overview & Section 1 Dictation", noteTitle: "১.১ Format Overview & Section 1 Dictation", noteSub: "Listening Module · note in Bangla", videoTitle: "Understand IELTS Listening in JUST 50 minutes!", videoSub: "E2 IELTS · YouTube video" },
  11: { dayName: "Friday", dateStr: "September 11, 2026", skill: "Listening", estTime: "35 min", xp: "+20 XP", topicTitle: "১.২ Question Types Deep-Dive (MCQ & Map)", noteTitle: "১.২ Question Types Deep-Dive (MCQ & Map)", noteSub: "Listening Module · note in Bangla", videoTitle: "IELTS Listening: ALL Question Types! [+Examples!]", videoSub: "E2 IELTS · YouTube video" },
  12: { dayName: "Saturday", dateStr: "September 12, 2026", skill: "Grammar", estTime: "25 min", xp: "+15 XP", topicTitle: "Complex Sentence Structures for Band 7+", noteTitle: "Complex Sentence Structures for Band 7+", noteSub: "Grammar Module · note in Bangla", videoTitle: "Master IELTS Grammar: Subordinating Conjunctions", videoSub: "IELTS Advantage · YouTube video" },
  13: { dayName: "Sunday", dateStr: "September 13, 2026", skill: "Reading", estTime: "35 min", xp: "+20 XP", topicTitle: "Skimming & Scanning Techniques", noteTitle: "Skimming & Scanning Techniques", noteSub: "Reading Module · note in Bangla", videoTitle: "How to Read Fast in IELTS Reading", videoSub: "IELTS Liz · YouTube video" },
  14: { dayName: "Monday", dateStr: "September 14, 2026", skill: "Writing", estTime: "45 min", xp: "+25 XP", topicTitle: "Task 2 Essay Types Breakdown", noteTitle: "Task 2 Essay Types Breakdown", noteSub: "Writing Module · note in Bangla", videoTitle: "IELTS Writing Task 2 Complete Guide", videoSub: "IELTS Advantage · YouTube video" },
  15: { dayName: "Tuesday", dateStr: "September 15, 2026", skill: "Vocabulary", estTime: "20 min", xp: "+15 XP", topicTitle: "Topic Vocabulary: Education & Environment", noteTitle: "Topic Vocabulary: Education & Environment", noteSub: "Vocabulary Module · note in Bangla", videoTitle: "Band 8+ Academic Vocabulary", videoSub: "E2 IELTS · YouTube video" },
  16: { dayName: "Wednesday", dateStr: "September 16, 2026", skill: "Reading", estTime: "35 min", xp: "+20 XP", topicTitle: "True / False / Not Given Mastery", noteTitle: "True / False / Not Given Mastery", noteSub: "Reading Module · note in Bangla", videoTitle: "Never Miss True False Not Given Again", videoSub: "IELTS Advantage · YouTube video" },
  17: { dayName: "Thursday", dateStr: "September 17, 2026", skill: "Reading", estTime: "35 min", xp: "+20 XP", topicTitle: "Matching Headings Strategies", noteTitle: "Matching Headings Strategies", noteSub: "Reading Module · note in Bangla", videoTitle: "Matching Headings Step-by-Step", videoSub: "IELTS Liz · YouTube video" },
  18: { dayName: "Friday", dateStr: "September 18, 2026", skill: "Speaking", estTime: "30 min", xp: "+20 XP", topicTitle: "Part 2 Cue Card Structure & Note-Taking", noteTitle: "Part 2 Cue Card Structure & Note-Taking", noteSub: "Speaking Module · note in Bangla", videoTitle: "IELTS Speaking Part 2 Template", videoSub: "E2 IELTS · YouTube video" },
  19: { dayName: "Saturday", dateStr: "September 19, 2026", skill: "Speaking", estTime: "30 min", xp: "+20 XP", topicTitle: "Part 3 Abstract Discussion Strategies", noteTitle: "Part 3 Abstract Discussion Strategies", noteSub: "Speaking Module · note in Bangla", videoTitle: "How to Answer IELTS Speaking Part 3", videoSub: "IELTS Advantage · YouTube video" },
  20: { dayName: "Sunday", dateStr: "September 20, 2026", skill: "Listening", estTime: "35 min", xp: "+20 XP", topicTitle: "Handling Distractors & Answer Changes", noteTitle: "Handling Distractors & Answer Changes", noteSub: "Listening Module · note in Bangla", videoTitle: "Avoid IELTS Listening Traps", videoSub: "IELTS Energy · YouTube video" },
  21: { dayName: "Monday", dateStr: "September 21, 2026", skill: "Listening", estTime: "35 min", xp: "+20 XP", topicTitle: "Accents Training (British & Australian)", noteTitle: "Accents Training (British & Australian)", noteSub: "Listening Module · note in Bangla", videoTitle: "Understanding IELTS Listening Accents", videoSub: "Asad Yaqub · YouTube video" },
  22: { dayName: "Tuesday", dateStr: "September 22, 2026", skill: "Grammar", estTime: "25 min", xp: "+15 XP", topicTitle: "Punctuation & Article Traps", noteTitle: "Punctuation & Article Traps", noteSub: "Grammar Module · note in Bangla", videoTitle: "Common IELTS Grammar Errors", videoSub: "engVid · YouTube video" },
  23: { dayName: "Wednesday", dateStr: "September 23, 2026", skill: "Reading", estTime: "35 min", xp: "+20 XP", topicTitle: "Summary Completion Questions", noteTitle: "Summary Completion Questions", noteSub: "Reading Module · note in Bangla", videoTitle: "Summary Completion Tips", videoSub: "IELTS Daily · YouTube video" },
  24: { dayName: "Thursday", dateStr: "September 24, 2026", skill: "Writing", estTime: "45 min", xp: "+25 XP", topicTitle: "Task 1 Line Graphs & Bar Charts", noteTitle: "Task 1 Line Graphs & Bar Charts", noteSub: "Writing Module · note in Bangla", videoTitle: "Academic Task 1 Overview", videoSub: "IELTS Liz · YouTube video" },
  25: { dayName: "Friday", dateStr: "September 25, 2026", skill: "Vocabulary", estTime: "20 min", xp: "+15 XP", topicTitle: "Collocations & Idiomatic Phrases", noteTitle: "Collocations & Idiomatic Phrases", noteSub: "Vocabulary Module · note in Bangla", videoTitle: "Band 8 Collocations for IELTS", videoSub: "E2 IELTS · YouTube video" },
  26: { dayName: "Saturday", dateStr: "September 26, 2026", skill: "Reading", estTime: "40 min", xp: "+25 XP", topicTitle: "Full Passage 1 Timed Practice", noteTitle: "Full Passage 1 Timed Practice", noteSub: "Reading Module · note in Bangla", videoTitle: "Passage 1 Walkthrough", videoSub: "IELTS Advantage · YouTube video" },
  27: { dayName: "Sunday", dateStr: "September 27, 2026", skill: "Reading", estTime: "40 min", xp: "+25 XP", topicTitle: "Full Passage 2 Timed Practice", noteTitle: "Full Passage 2 Timed Practice", noteSub: "Reading Module · note in Bangla", videoTitle: "Passage 2 Strategy Walkthrough", videoSub: "IELTS Liz · YouTube video" },
  28: { dayName: "Monday", dateStr: "September 28, 2026", skill: "Speaking", estTime: "35 min", xp: "+20 XP", topicTitle: "Pronunciation & Intonation Drills", noteTitle: "Pronunciation & Intonation Drills", noteSub: "Speaking Module · note in Bangla", videoTitle: "IELTS Speaking Pronunciation Guide", videoSub: "engVid · YouTube video" },
  29: { dayName: "Tuesday", dateStr: "September 29, 2026", skill: "Speaking", estTime: "35 min", xp: "+20 XP", topicTitle: "Mock Speaking Test Walkthrough", noteTitle: "Mock Speaking Test Walkthrough", noteSub: "Speaking Module · note in Bangla", videoTitle: "Band 8 Mock Speaking Test", videoSub: "IELTS Daily · YouTube video" },
  30: { dayName: "Wednesday", dateStr: "September 30, 2026", skill: "Listening", estTime: "45 min", xp: "+25 XP", topicTitle: "Full Listening Mock Test 1", noteTitle: "Full Listening Mock Test 1", noteSub: "Listening Module · note in Bangla", videoTitle: "Full IELTS Listening Test 2026", videoSub: "IELTS Daily · YouTube video" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function getSeptember2026Grid(): (number | null)[][] {
  const grid: (number | null)[][] = [];
  const startOffset = 0;
  let dayCounter = 1;
  for (let row = 0; row < 6; row++) {
    const week: (number | null)[] = [];
    for (let col = 0; col < 7; col++) {
      const cellIndex = row * 7 + col;
      if (cellIndex < startOffset || dayCounter > 30) {
        week.push(null);
      } else {
        week.push(dayCounter);
        dayCounter++;
      }
    }
    grid.push(week);
  }
  return grid;
}

// Sep 1, 2026 is a Tuesday → offset = 2 (Sun=0, Mon=1, Tue=2)
// Grid covers Aug 30 (Sun) to Oct 10 (Sat)

const SEPTEMBER_GRID = getSeptember2026Grid();

// ─── Skill Pill Component ────────────────────────────────────────────────────

function SkillPill({ skill, size = 'xs' }: { skill: Skill; size?: 'xs' | 'sm' }) {
  const colors = SKILL_COLORS[skill];
  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-2 py-0.5'
    : 'text-xs px-3 py-1';
  return (
    <span className={`${colors.pill} ${sizeClasses} rounded-full font-medium`}>
      {SKILL_EMOJI[skill]} {skill}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StudyPlanView({ userEmail }: StudyPlanViewProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(6);
  const [showModal, setShowModal] = useState(false);

  const today = 6;
  const task = selectedDay ? STUDY_PLAN_DATA[selectedDay] : undefined;

  const handleDayClick = (day: number) => {
    if (STUDY_PLAN_DATA[day]) {
      setSelectedDay(day);
      setShowModal(true);
    }
  };

  const totalTasks = 25;
  const doneTasks = 0;
  const totalHours = 0;

  const grid = SEPTEMBER_GRID;

  return (
    <div className="min-h-screen bg-black text-neutral-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">Study Plan</h1>
          <span className="inline-block mt-2 bg-neutral-800/80 text-blue-400 border border-neutral-700/50 px-2.5 py-0.5 text-xs rounded-full">
            🎏 Phase 1: Foundation
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-3 py-1.5 text-sm hover:bg-neutral-800 transition flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            Edit plan
          </button>
          <div className="bg-neutral-800/60 border border-neutral-700/40 rounded-xl px-4 py-1.5 text-sm text-neutral-200 flex items-center gap-3">
            <button className="text-neutral-400 hover:text-white transition"><ChevronLeftIcon className="w-4 h-4" /></button>
            <span className="font-medium">Sep 2026</span>
            <button className="text-neutral-400 hover:text-white transition"><ChevronRightIcon className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Current Band', value: '6.5', sub: 'Starting point', icon: '🎯' },
          { label: 'Target Band', value: '7.5', sub: 'Your goal', icon: '🏆' },
          { label: 'Day Streak', value: '0', sub: 'Start today', icon: '🔥', suffix: ' 🔥' },
          { label: 'Progress', value: '0/75', sub: '0% complete', icon: '☑️' },
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
      <div className="bg-gradient-to-r from-rose-600 to-red-600 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="text-xs uppercase font-semibold text-rose-100 tracking-wider">🎯 Today's Mission</span>
          <h2 className="text-2xl font-bold mt-1">Reading</h2>
          <p className="text-rose-100 mt-1 text-sm">২.১ Format Overview — পরীক্ষার কাঠামো</p>
          <div className="flex items-center gap-4 mt-4 text-sm opacity-90">
            <span>⏱ 35 min</span>
            <span>0 tasks</span>
          </div>
        </div>
        <button className="bg-white text-rose-600 font-semibold px-5 py-2 rounded-full shadow hover:bg-rose-50 flex items-center gap-2 transition whitespace-nowrap">
          <PlayIcon className="w-4 h-4" /> Start
        </button>
      </div>

      {/* ── This Week's Focus ───────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mb-2">This Week's Focus</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {([
            { skill: 'Reading' as Skill, count: 2 },
            { skill: 'Speaking' as Skill, count: 2 },
            { skill: 'Listening' as Skill, count: 2 },
            { skill: 'Grammar' as Skill, count: 1 },
          ]).map((f) => {
            const colors = SKILL_COLORS[f.skill];
            return (
              <span key={f.skill} className={`${colors.bg} ${colors.border} border ${colors.text} px-3 py-1 rounded-full text-xs font-medium`}>
                {SKILL_EMOJI[f.skill]} {f.skill} ×{f.count}
              </span>
            );
          })}
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300">
          📊 This week: {doneTasks}/{totalTasks} tasks done · {totalHours}.0 hours study
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
          {grid.map((week, ri) =>
            week.map((day, ci) => {
              if (day === null) {
                return <div key={`empty-${ri}-${ci}`} className="min-h-[90px]" />;
              }
              const taskData = STUDY_PLAN_DATA[day];
              const isToday = day === today;
              const isPast = day < today;

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`rounded-2xl p-3 min-h-[90px] transition relative ${
                    isToday
                      ? 'bg-rose-600 text-white rounded-2xl shadow-lg ring-2 ring-rose-500 cursor-pointer'
                      : taskData
                        ? 'bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer'
                        : isPast
                          ? 'bg-neutral-900/30 border border-neutral-800/40 opacity-40'
                          : 'bg-neutral-900/60 border border-neutral-800/80'
                  }`}
                >
                  <span className={`text-xs font-semibold ${isToday ? 'text-white' : isPast ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    {day}
                  </span>
                  {taskData && (
                    <div className="mt-1.5">
                      <SkillPill skill={taskData.skill} size="xs" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Day Detail Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && task && (
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
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">{task.dayName}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{task.dateStr}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-sm">{task.estTime}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">EST. TIME</p>
                </div>
              </div>

              {/* Main Subject Panel */}
              <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-4 mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${SKILL_ICON_CIRCLE[task.skill]}`}>
                    {SKILL_EMOJI[task.skill]}
                  </div>
                  <span className={`text-sm font-semibold ${SKILL_COLORS[task.skill].text}`}>{task.skill}</span>
                </div>
                <p className="text-sm font-medium text-white mb-3">{task.topicTitle}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-neutral-700/50 text-neutral-300 text-[10px] px-2 py-0.5 rounded-full border border-neutral-600/30">📹 Video Lesson</span>
                  <span className="bg-neutral-700/50 text-neutral-300 text-[10px] px-2 py-0.5 rounded-full border border-neutral-600/30">Phase 1 - Foundation</span>
                  <span className="bg-amber-900/30 text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-600/30">⚡ {task.xp}</span>
                </div>
              </div>

              {/* Note Item */}
              <div className="bg-neutral-800/30 border border-neutral-700/30 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-neutral-800/60 transition mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📘</span>
                  <div>
                    <p className="text-sm font-medium text-white">{task.noteTitle}</p>
                    <p className="text-[11px] text-neutral-400">{task.noteSub}</p>
                  </div>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-neutral-500" />
              </div>

              {/* YouTube Video Item */}
              <div className="bg-neutral-800/30 border border-neutral-700/30 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-neutral-800/60 transition mb-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📹</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{task.videoTitle}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{task.videoSub}</p>
                  </div>
                </div>
                <PlayIcon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
              </div>

              {/* Primary Footer Button */}
              <button className="bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 rounded-2xl w-full text-center flex items-center justify-center gap-2 shadow-lg shadow-rose-950/30 mt-4 transition">
                <PlayIcon className="w-4 h-4" /> Open lesson: {task.topicTitle}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

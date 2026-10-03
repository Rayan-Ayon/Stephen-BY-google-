import React, { useState, useEffect } from "react";
import { BookOpen, CheckCircle2, Clock, Send, Sparkles, Calendar, Layers, ShieldCheck, Flame } from "lucide-react";

interface Mission {
  title: string;
  module: "Reading" | "Writing" | "Listening" | "Speaking";
  duration: string;
  priority: "High" | "Medium" | "Low";
  time: string;
  day: string;
}

const timeBlocks = ["09:00", "11:00", "14:00", "16:00"];
const modules: Mission["module"][] = ["Reading", "Writing", "Listening", "Speaking"];
const durations = ["15min", "30min", "45min", "60min"];
const priorities: Mission["priority"][] = ["High", "Medium", "Low"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const CAMBRIDGE_BOOKS = ["Cambridge 19", "Cambridge 18", "Cambridge 17", "Cambridge 16", "Cambridge 15"];
const CAMBRIDGE_TESTS = ["Test 1", "Test 2", "Test 3", "Test 4"];
const CAMBRIDGE_MODULES = [
  "Writing Task 2",
  "Writing Task 1",
  "Reading Full Mock",
  "Listening Section 1-4",
  "Speaking Part 1-3"
];

const CAMBRIDGE_PROMPTS: Record<string, string> = {
  "Cambridge 18-Test 2-Writing Task 2":
    "Some people believe that technological development has made humans more isolated, while others argue that it has connected global communities more closely than ever. Discuss both views and give your opinion. (250 words minimum)",
  "Cambridge 18-Test 1-Writing Task 2":
    "In many countries, paying for healthcare is increasingly the responsibility of the individual rather than the government. Do the advantages of this outweigh the disadvantages?",
  "Cambridge 19-Test 1-Writing Task 2":
    "Universities should focus solely on providing skills for employment rather than theoretical knowledge. To what extent do you agree or disagree?",
};

const initialMockData: Mission[] = [
  { title: "Reading Passage 1", module: "Reading", duration: "45min", priority: "High", time: "09:00", day: "Mon" },
  { title: "Cambridge 18 Task 2", module: "Writing", duration: "40min", priority: "High", time: "11:00", day: "Mon" },
  { title: "Listening Section 3", module: "Listening", duration: "25min", priority: "Low", time: "14:00", day: "Mon" },
  { title: "Speaking Mock 1-on-1", module: "Speaking", duration: "30min", priority: "High", time: "16:00", day: "Mon" },
  { title: "Grammar Range Polish", module: "Writing", duration: "45min", priority: "High", time: "09:00", day: "Tue" },
  { title: "Matching Headings Drill", module: "Reading", duration: "30min", priority: "Medium", time: "11:00", day: "Tue" },
  { title: "Pronunciation Clinic", module: "Speaking", duration: "20min", priority: "Low", time: "14:00", day: "Tue" },
  { title: "Multiple Choice Audio", module: "Listening", duration: "45min", priority: "High", time: "16:00", day: "Tue" },
  { title: "Section 4 Lecture Notes", module: "Listening", duration: "30min", priority: "Medium", time: "09:00", day: "Wed" },
  { title: "True/False/Not Given", module: "Reading", duration: "45min", priority: "High", time: "11:00", day: "Wed" },
  { title: "Concession Paragraphs", module: "Writing", duration: "35min", priority: "Medium", time: "14:00", day: "Wed" },
  { title: "Fluency & Coherence", module: "Speaking", duration: "30min", priority: "Medium", time: "16:00", day: "Wed" },
  { title: "Band 8 Vocabulary", module: "Speaking", duration: "45min", priority: "High", time: "09:00", day: "Thu" },
  { title: "Distractor Detection", module: "Listening", duration: "30min", priority: "Medium", time: "11:00", day: "Thu" },
  { title: "Summary Completion", module: "Reading", duration: "25min", priority: "Low", time: "14:00", day: "Thu" },
  { title: "Task 1 Line Graphs", module: "Writing", duration: "30min", priority: "High", time: "16:00", day: "Thu" },
  { title: "Cambridge 18 Full Test", module: "Writing", duration: "60min", priority: "High", time: "09:00", day: "Fri" },
  { title: "Academic Reading Pass 3", module: "Reading", duration: "30min", priority: "Low", time: "11:00", day: "Fri" },
  { title: "Speaking Part 2 Cue Cards", module: "Speaking", duration: "45min", priority: "High", time: "14:00", day: "Fri" },
  { title: "Full Section Audio Drill", module: "Listening", duration: "30min", priority: "Medium", time: "16:00", day: "Fri" },
];

const metrics = [
  { label: "Active Cohort Missions", value: "24 Live", icon: "📅" },
  { label: "Cambridge Modules Deployed", value: "168 Units", icon: "🎯" },
  { label: "Students in Active Cohort", value: "50 Enrolled", icon: "👥" },
  { label: "Average Submission Rate", value: "88%", icon: "✅" },
];

function priorityColor(p: Mission["priority"]): string {
  if (p === "High") return "bg-rose-500";
  if (p === "Medium") return "bg-amber-500";
  return "bg-emerald-500";
}

function moduleBg(m: Mission["module"]): string {
  if (m === "Reading") return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  if (m === "Writing") return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  if (m === "Listening") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
}

export default function MissionBuilder() {
  const [scheduleData, setScheduleData] = useState<Mission[]>(initialMockData);
  
  // Cambridge Deployment State
  const [selectedBook, setSelectedBook] = useState("Cambridge 18");
  const [selectedTest, setSelectedTest] = useState("Test 2");
  const [selectedModule, setSelectedModule] = useState("Writing Task 2");
  const [deadline, setDeadline] = useState("Today @ 8:00 PM");
  
  // Custom Freeform State
  const [customTitle, setCustomTitle] = useState("");
  const [customMod, setCustomMod] = useState<Mission["module"]>("Writing");
  const [customDuration, setCustomDuration] = useState("45min");
  const [customPriority, setCustomPriority] = useState<Mission["priority"]>("High");
  const [mode, setMode] = useState<"cambridge" | "custom">("cambridge");

  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentActiveDirective, setCurrentActiveDirective] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("stephen_active_pinned_directive");
      if (stored) {
        setCurrentActiveDirective(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const getTaskForSlot = (day: string, time: string): Mission | undefined => {
    return scheduleData.find((m) => m.day === day && m.time === time);
  };

  const promptKey = `${selectedBook}-${selectedTest}-${selectedModule}`;
  const promptText =
    CAMBRIDGE_PROMPTS[promptKey] ||
    `Official Cambridge exam practice from ${selectedBook}, ${selectedTest}, module: ${selectedModule}. Complete under strict timed conditions for AI OCR extraction and Dr. Stephen Vance faculty assessment.`;

  const handlePublishCambridge = () => {
    setIsPublishing(true);

    setTimeout(() => {
      const directivePayload = {
        title: `${selectedBook} ${selectedTest} ${selectedModule}`,
        book: selectedBook,
        test: selectedTest,
        module: selectedModule,
        description: promptText,
        deadline: deadline,
        submittedCount: 0,
        totalAssigned: 50,
        type: "cambridge_official",
        publishedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem("stephen_active_pinned_directive", JSON.stringify(directivePayload));
        window.dispatchEvent(new Event("stephen_mission_published"));
      } catch (e) {
        console.error(e);
      }

      // Add to calendar on Monday 11:00 or Tuesday 09:00
      setScheduleData((prev) => [
        {
          title: `${selectedBook} ${selectedTest}`,
          module: selectedModule.includes("Writing")
            ? "Writing"
            : selectedModule.includes("Reading")
            ? "Reading"
            : selectedModule.includes("Listening")
            ? "Listening"
            : "Speaking",
          duration: "45min",
          priority: "High",
          time: "11:00",
          day: "Mon"
        },
        ...prev.filter((item) => !(item.day === "Mon" && item.time === "11:00"))
      ]);

      setCurrentActiveDirective(directivePayload);
      setIsPublishing(false);
      showToast(`🚀 Published ${selectedBook} ${selectedTest} (${selectedModule}) to 50 Cohort Students! Active pinned directive updated.`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-[#F3F4F6] p-6 font-sans">
      <div className="max-w-[1580px] mx-auto space-y-6">

        {/* Live Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#15181E] border border-rose-500/50 text-slate-100 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
            <span className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400">
              <CheckCircle2 className="w-5 h-5 text-rose-400" />
            </span>
            <div className="text-xs font-semibold">{toastMessage}</div>
          </div>
        )}

        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222732] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#8E95A3] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Curriculum Operations // Mission Builder &amp; Cambridge Dispatch</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Cohort Study Plan &amp; Daily Mission Builder
            </h1>
          </div>

          {currentActiveDirective && (
            <div className="bg-[#15181E] border border-amber-500/30 px-3.5 py-2 rounded-xl flex items-center gap-3 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase block font-bold">Currently Pinned Directive</span>
                <span className="text-xs text-white font-bold">{currentActiveDirective.title}</span>
              </div>
            </div>
          )}
        </header>

        {/* Main Content: Calendar (60%) + Cambridge Sidebar (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Weekly Schedule View (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between bg-[#15181E] border border-[#222732] px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Calendar className="w-4 h-4 text-rose-400" />
                <span>Weekly Cohort Syllabus (Monday - Friday)</span>
              </div>
              <span className="text-xs text-[#8E95A3] font-mono">5 Time Slots • Synchronized with LMS</span>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {days.map((day) => (
                <div
                  key={day}
                  className="bg-[#15181E] border border-[#222732] rounded-xl p-3 flex flex-col gap-2"
                >
                  <p className="text-xs font-bold text-white text-center pb-2 border-b border-[#222732]">
                    {day}
                  </p>
                  <div className="flex flex-col gap-2">
                    {timeBlocks.map((time) => {
                      const task = getTaskForSlot(day, time);
                      return (
                        <div
                          key={time}
                          className="bg-[#0D0F12] border border-[#222732] rounded-lg p-2 min-h-[76px] flex flex-col justify-between hover:border-slate-600 transition-colors"
                        >
                          <p className="text-[10px] text-slate-500 font-mono mb-1">{time}</p>
                          {task ? (
                            <div>
                              <p className="text-[11px] font-bold text-slate-100 leading-tight mb-1.5 truncate">
                                {task.title}
                              </p>
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${moduleBg(task.module)}`}
                                >
                                  {task.module}
                                </span>
                                <span className="text-[9px] text-slate-500 font-mono">
                                  {task.duration}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-600 italic">Empty Slot</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-[#15181E] border border-[#222732] rounded-xl p-3.5 flex items-center gap-3 shadow-sm"
                >
                  <span className="text-xl">{m.icon}</span>
                  <div>
                    <p className="text-base font-extrabold text-white leading-tight">{m.value}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cambridge Test Deployment Sidebar (Col 5) */}
          <div className="lg:col-span-5">
            <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-6 shadow-xl sticky top-6 space-y-5">
              
              {/* Header with Mode Toggle */}
              <div className="flex items-center justify-between border-b border-[#222732] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-white leading-tight">
                      Cambridge Test Deployment
                    </h2>
                    <p className="text-[10px] text-slate-400 font-mono">
                      1-Click Instant Directive to Cohort Dashboard
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-[#0D0F12] border border-[#222732] p-0.5 rounded-lg">
                  <button
                    onClick={() => setMode("cambridge")}
                    className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                      mode === "cambridge"
                        ? "bg-rose-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Cambridge
                  </button>
                  <button
                    onClick={() => setMode("custom")}
                    className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                      mode === "custom"
                        ? "bg-rose-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {mode === "cambridge" ? (
                /* Cambridge Direct Selectors */
                <div className="space-y-4">
                  {/* Select Book Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Select Book</span>
                      <span className="text-[10px] text-slate-500 font-mono">Official Cambridge IELTS</span>
                    </label>
                    <select
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                      className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors font-medium"
                    >
                      {CAMBRIDGE_BOOKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Test & Module Dropdowns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Select Test
                      </label>
                      <select
                        value={selectedTest}
                        onChange={(e) => setSelectedTest(e.target.value)}
                        className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors font-medium"
                      >
                        {CAMBRIDGE_TESTS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Select Module
                      </label>
                      <select
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                        className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors font-medium"
                      >
                        {CAMBRIDGE_MODULES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Prompt Text / Directive Preview */}
                  <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3.5 space-y-2">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      <span>Cambridge Prompt Directive Preview</span>
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      "{promptText}"
                    </p>
                  </div>

                  {/* Deadline Picker */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Deadline Picker</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Cohort Sync</span>
                    </label>
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="e.g. Today @ 8:00 PM"
                      className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  {/* Audience Meta */}
                  <div className="flex items-center justify-between text-xs text-slate-400 bg-[#181C24] px-3.5 py-2 rounded-xl border border-[#222732]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Target: <strong className="text-white">Batch Delta</strong></span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">50 Active Seats</span>
                  </div>

                  {/* Primary CTA: Solid Crimson Red [ Publish to 50 Students ] */}
                  <button
                    onClick={handlePublishCambridge}
                    disabled={isPublishing}
                    className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 group"
                  >
                    {isPublishing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Deploying to 50 Students...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        <span>Publish to 50 Students</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Freeform Custom Mission */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Custom Mission Title</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. Timed Diagnostic Drill #4"
                      className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Module</label>
                    <div className="grid grid-cols-2 gap-2">
                      {modules.map((m) => (
                        <button
                          key={m}
                          onClick={() => setCustomMod(m)}
                          className={`text-xs py-2 rounded-xl border transition-colors ${
                            customMod === m
                              ? "border-rose-500 bg-rose-500/10 text-rose-400"
                              : "border-[#222732] bg-[#0D0F12] text-slate-400 hover:border-slate-600"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Duration</label>
                    <div className="grid grid-cols-2 gap-2">
                      {durations.map((d) => (
                        <button
                          key={d}
                          onClick={() => setCustomDuration(d)}
                          className={`text-xs py-2 rounded-xl border transition-colors ${
                            customDuration === d
                              ? "border-rose-500 bg-rose-500/10 text-rose-400"
                              : "border-[#222732] bg-[#0D0F12] text-slate-400 hover:border-slate-600"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!customTitle) return;
                      showToast(`🚀 Published custom mission "${customTitle}" to students!`);
                    }}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish Custom Mission</span>
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


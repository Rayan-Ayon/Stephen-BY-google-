import React, { useState } from "react";

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

const mockData: Mission[] = [
  { title: "Reading Module", module: "Reading", duration: "45min", priority: "High", time: "09:00", day: "Mon" },
  { title: "Writing Practice", module: "Writing", duration: "30min", priority: "Medium", time: "11:00", day: "Mon" },
  { title: "Listening Drill", module: "Listening", duration: "15min", priority: "Low", time: "14:00", day: "Mon" },
  { title: "Speaking Session", module: "Speaking", duration: "30min", priority: "High", time: "16:00", day: "Mon" },
  { title: "Writing Practice", module: "Writing", duration: "45min", priority: "High", time: "09:00", day: "Tue" },
  { title: "Reading Module", module: "Reading", duration: "30min", priority: "Medium", time: "11:00", day: "Tue" },
  { title: "Speaking Session", module: "Speaking", duration: "15min", priority: "Low", time: "14:00", day: "Tue" },
  { title: "Listening Drill", module: "Listening", duration: "45min", priority: "High", time: "16:00", day: "Tue" },
  { title: "Listening Drill", module: "Listening", duration: "30min", priority: "Medium", time: "09:00", day: "Wed" },
  { title: "Reading Module", module: "Reading", duration: "45min", priority: "High", time: "11:00", day: "Wed" },
  { title: "Writing Practice", module: "Writing", duration: "15min", priority: "Low", time: "14:00", day: "Wed" },
  { title: "Speaking Session", module: "Speaking", duration: "30min", priority: "Medium", time: "16:00", day: "Wed" },
  { title: "Speaking Session", module: "Speaking", duration: "45min", priority: "High", time: "09:00", day: "Thu" },
  { title: "Listening Drill", module: "Listening", duration: "30min", priority: "Medium", time: "11:00", day: "Thu" },
  { title: "Reading Module", module: "Reading", duration: "15min", priority: "Low", time: "14:00", day: "Thu" },
  { title: "Writing Practice", module: "Writing", duration: "45min", priority: "High", time: "16:00", day: "Thu" },
  { title: "Writing Practice", module: "Writing", duration: "30min", priority: "Medium", time: "09:00", day: "Fri" },
  { title: "Reading Module", module: "Reading", duration: "15min", priority: "Low", time: "11:00", day: "Fri" },
  { title: "Speaking Session", module: "Speaking", duration: "45min", priority: "High", time: "14:00", day: "Fri" },
  { title: "Listening Drill", module: "Listening", duration: "30min", priority: "Medium", time: "16:00", day: "Fri" },
];

const metrics = [
  { label: "Active Plans", value: "24", icon: "📅" },
  { label: "Missions Scheduled", value: "168", icon: "🎯" },
  { label: "Students Enrolled", value: "1,420", icon: "👥" },
  { label: "Completion Rate", value: "87%", icon: "✅" },
];

function priorityColor(p: Mission["priority"]): string {
  if (p === "High") return "bg-[#EF4444]";
  if (p === "Medium") return "bg-[#F59E0B]";
  return "bg-[#10B981]";
}

function moduleBg(m: Mission["module"]): string {
  if (m === "Reading") return "bg-[#FF4D4D]/20 text-[#FF4D4D]";
  if (m === "Writing") return "bg-[#3B82F6]/20 text-[#3B82F6]";
  if (m === "Listening") return "bg-[#10B981]/20 text-[#10B981]";
  return "bg-[#F59E0B]/20 text-[#F59E0B]";
}

function getTaskForSlot(day: string, time: string): Mission | undefined {
  return mockData.find((m) => m.day === day && m.time === time);
}

export default function MissionBuilder() {
  const [title, setTitle] = useState("");
  const [mod, setMod] = useState<Mission["module"]>("Reading");
  const [duration, setDuration] = useState("30min");
  const [priority, setPriority] = useState<Mission["priority"]>("High");

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] p-6 font-sans">
      <header className="mb-6">
        <p className="text-xs tracking-[0.2em] text-[#8E95A3] uppercase mb-1">
          Curriculum Assets
        </p>
        <h1 className="text-2xl font-bold text-[#F3F4F6] tracking-tight">
          Study Plan &amp; Daily Mission Builder
        </h1>
      </header>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-[#121316] border border-[#1E2026] rounded-xl p-4 flex items-center gap-4"
          >
            <span className="text-2xl">{m.icon}</span>
            <div>
              <p className="text-2xl font-bold text-[#F3F4F6]">{m.value}</p>
              <p className="text-xs text-[#8E95A3]">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-[2]">
          <div className="grid grid-cols-5 gap-3">
            {days.map((day) => (
              <div
                key={day}
                className="bg-[#121316] border border-[#1E2026] rounded-xl p-3"
              >
                <p className="text-sm font-semibold text-[#F3F4F6] mb-3 text-center">
                  {day}
                </p>
                <div className="flex flex-col gap-2">
                  {timeBlocks.map((time) => {
                    const task = getTaskForSlot(day, time);
                    return (
                      <div
                        key={time}
                        className="bg-[#181A20] border border-[#1E2026] rounded-lg p-2 min-h-[72px]"
                      >
                        <p className="text-[10px] text-[#565E6D] mb-1">{time}</p>
                        {task ? (
                          <div>
                            <p className="text-[11px] font-medium text-[#F3F4F6] leading-tight mb-1">
                              {task.title}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-block w-1.5 h-1.5 rounded-full ${priorityColor(task.priority)}`}
                              />
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded ${moduleBg(task.module)}`}
                              >
                                {task.module}
                              </span>
                              <span className="text-[9px] text-[#565E6D]">
                                {task.duration}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-[#565E6D] italic">Empty</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[1]">
          <div className="bg-[#121316] border border-[#1E2026] rounded-xl p-5 sticky top-6">
            <h2 className="text-sm font-semibold text-[#F3F4F6] mb-5">
              Mission Creator
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-[#8E95A3] mb-1.5">
                  Mission Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter mission title"
                  className="w-full bg-[#181A20] border border-[#1E2026] rounded-lg px-3 py-2 text-sm text-[#F3F4F6] placeholder:text-[#565E6D] focus:outline-none focus:border-[#FF4D4D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8E95A3] mb-1.5">Module</label>
                <div className="grid grid-cols-2 gap-2">
                  {modules.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMod(m)}
                      className={`text-xs py-2 rounded-lg border transition-colors ${
                        mod === m
                          ? "border-[#FF4D4D] bg-[#FF4D4D]/10 text-[#FF4D4D]"
                          : "border-[#1E2026] bg-[#181A20] text-[#8E95A3] hover:border-[#565E6D]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8E95A3] mb-1.5">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {durations.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`text-xs py-2 rounded-lg border transition-colors ${
                        duration === d
                          ? "border-[#FF4D4D] bg-[#FF4D4D]/10 text-[#FF4D4D]"
                          : "border-[#1E2026] bg-[#181A20] text-[#8E95A3] hover:border-[#565E6D]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8E95A3] mb-1.5">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`text-xs py-2 rounded-lg border transition-colors ${
                        priority === p
                          ? `border-${priorityColor(p).replace("bg-", "")} ${
                              priorityColor(p)
                            }/10 text-${priorityColor(p).replace("bg-", "")}`
                          : "border-[#1E2026] bg-[#181A20] text-[#8E95A3] hover:border-[#565E6D]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full mt-2 bg-[#F04438] hover:bg-[#FF4D4D] text-white font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                <span>🚀</span>
                Publish Mission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

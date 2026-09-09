import React, { useState } from "react";

interface MisconceptionEntry {
  id: string;
  category: string;
  dotColor: string;
  frequency: number;
  affectedStudents: number;
  status: "In Progress" | "Unresolved" | "Resolved";
  lastDetected: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  "In Progress": { bg: "bg-[#F59E0B]/15", text: "text-[#F59E0B]", icon: "🟡" },
  Unresolved: { bg: "bg-[#EF4444]/15", text: "text-[#EF4444]", icon: "🔴" },
  Resolved: { bg: "bg-[#10B981]/15", text: "text-[#10B981]", icon: "✅" },
};

const MODULES = ["All", "Writing", "Listening", "Reading", "Speaking"];
const STATUSES = ["All", "Unresolved", "In Progress", "Resolved"];

const MOCK_DATA: MisconceptionEntry[] = [
  {
    id: "1",
    category: "Task Achievement Ignored",
    dotColor: "#EF4444",
    frequency: 18,
    affectedStudents: 12,
    status: "In Progress",
    lastDetected: "2h ago",
  },
  {
    id: "2",
    category: "Passive Voice Overuse",
    dotColor: "#F59E0B",
    frequency: 14,
    affectedStudents: 9,
    status: "Unresolved",
    lastDetected: "5h ago",
  },
  {
    id: "3",
    category: "Misleading Connectors",
    dotColor: "#10B981",
    frequency: 8,
    affectedStudents: 6,
    status: "Resolved",
    lastDetected: "1d ago",
  },
];

function MisconceptionLog() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const maxFrequency = Math.max(...MOCK_DATA.map((d) => d.frequency));

  const filteredData = MOCK_DATA.filter((entry) => {
    const matchesSearch = entry.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] font-sans">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-xs font-mono tracking-[0.2em] text-[#565E6D] uppercase">
            Cohort Telemetry // Student Misconception Log (AI Audit)
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#121316] border border-[#1E2026] rounded-lg px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧠</span>
              <div>
                <p className="text-[#8E95A3] text-sm">Total Misconceptions Logged</p>
                <p className="text-[#F3F4F6] text-2xl font-semibold">47</p>
              </div>
            </div>
          </div>
          <div className="bg-[#121316] border border-[#1E2026] rounded-lg px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔁</span>
              <div>
                <p className="text-[#8E95A3] text-sm">Recurring Patterns</p>
                <p className="text-[#F3F4F6] text-2xl font-semibold">8</p>
              </div>
            </div>
          </div>
          <div className="bg-[#121316] border border-[#1E2026] rounded-lg px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <p className="text-[#8E95A3] text-sm">Raw Chat Entries Scanned</p>
                <p className="text-[#F3F4F6] text-2xl font-semibold">1,240</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6 bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-3">
          <input
            type="text"
            placeholder="Search misconceptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0A0B0D] border border-[#1E2026] rounded-md px-3 py-2 text-sm text-[#F3F4F6] placeholder-[#565E6D] focus:outline-none focus:border-[#FF4D4D] transition-colors w-64"
          />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-[#0A0B0D] border border-[#1E2026] rounded-md px-3 py-2 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#FF4D4D] transition-colors"
          >
            {MODULES.map((m) => (
              <option key={m} value={m}>
                {m === "All" ? "All Modules" : m}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0A0B0D] border border-[#1E2026] rounded-md px-3 py-2 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#FF4D4D] transition-colors"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button className="ml-auto bg-[#F04438] hover:bg-[#FF4D4D] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2">
            <span>🧠</span>
            Run AI Audit
          </button>
        </div>

        <div className="bg-[#121316] border border-[#1E2026] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E2026]">
                <th className="text-left text-xs font-medium text-[#565E6D] uppercase tracking-wider px-5 py-3">
                  Category
                </th>
                <th className="text-left text-xs font-medium text-[#565E6D] uppercase tracking-wider px-5 py-3">
                  Frequency
                </th>
                <th className="text-left text-xs font-medium text-[#565E6D] uppercase tracking-wider px-5 py-3">
                  Affected Students
                </th>
                <th className="text-left text-xs font-medium text-[#565E6D] uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-[#565E6D] uppercase tracking-wider px-5 py-3">
                  Last Detected
                </th>
                <th className="text-left text-xs font-medium text-[#565E6D] uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry) => {
                const statusStyle = STATUS_STYLES[entry.status];
                return (
                  <tr
                    key={entry.id}
                    className="border-b border-[#1E2026] last:border-b-0 hover:bg-[#181A20] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: entry.dotColor }}
                        />
                        <span className="text-sm text-[#F3F4F6] font-medium">
                          {entry.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#F3F4F6] font-medium w-6">
                          {entry.frequency}
                        </span>
                        <div className="flex-1 max-w-[120px]">
                          <div className="h-1.5 bg-[#1E2026] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(entry.frequency / maxFrequency) * 100}%`,
                                backgroundColor: entry.dotColor,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#F3F4F6]">
                        {entry.affectedStudents}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <span>{statusStyle.icon}</span>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#8E95A3]">{entry.lastDetected}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="text-sm text-[#FF4D4D] hover:text-[#F04438] transition-colors font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#565E6D] text-sm">
                    No misconceptions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MisconceptionLog;

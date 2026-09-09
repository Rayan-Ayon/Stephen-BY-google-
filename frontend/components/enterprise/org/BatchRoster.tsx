import { useState } from "react";

type Status = "Active" | "Inactive" | "Graduated";

interface Candidate {
  id: string;
  name: string;
  studentId: string;
  batch: string;
  targetBand: number;
  currentBand: number;
  aiCoins: number;
  status: Status;
}

const CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Tanvir Hossain",
    studentId: "STU-2024-0847",
    batch: "Batch A-2024",
    targetBand: 7.5,
    currentBand: 5.5,
    aiCoins: 450,
    status: "Active",
  },
  {
    id: "2",
    name: "Anika Rahman",
    studentId: "STU-2024-0912",
    batch: "Batch B-2024",
    targetBand: 7.0,
    currentBand: 5.5,
    aiCoins: 380,
    status: "Active",
  },
  {
    id: "3",
    name: "Rafiqul Islam",
    studentId: "STU-2024-0756",
    batch: "Batch A-2024",
    targetBand: 6.5,
    currentBand: 5.0,
    aiCoins: 520,
    status: "Active",
  },
];

const STATUS_STYLES: Record<Status, string> = {
  Active: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30",
  Inactive: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30",
  Graduated: "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30",
};

const STATUS_ICON: Record<Status, string> = {
  Active: "🟢",
  Inactive: "🔴",
  Graduated: "🎓",
};

const BATCH_OPTIONS = ["All", "Batch A-2024", "Batch B-2024", "Batch C-2024"];
const STATUS_OPTIONS: Array<Status | "All"> = ["All", "Active", "Inactive", "Graduated"];

export default function BatchRoster() {
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<Status | "All">("All");

  const filtered = CANDIDATES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesBatch = selectedBatch === "All" || c.batch === selectedBatch;
    const matchesStatus =
      selectedStatus === "All" || c.status === selectedStatus;
    return matchesSearch && matchesBatch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] p-6 space-y-6">
      <header className="border-b border-[#1E2026] pb-4">
        <h1 className="text-lg font-semibold tracking-wide text-[#F3F4F6]">
          IDENTITY &amp; SEATS // BATCH &amp; CANDIDATE ROSTER
        </h1>
      </header>

      <section className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Active Candidates", value: "1,420", icon: "👥" },
          { label: "Active Batches", value: "12", icon: "📦" },
          { label: "Avg Target Band", value: "7.0", icon: "🎯" },
          { label: "Avg AI Coins", value: "450", icon: "⚡" },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-[#121316] border border-[#1E2026] rounded-xl p-5 flex flex-col gap-1"
          >
            <div className="flex items-center gap-2 text-sm text-[#8E95A3]">
              <span>{m.icon}</span>
              {m.label}
            </div>
            <span className="text-2xl font-bold text-[#F3F4F6]">
              {m.value}
            </span>
          </div>
        ))}
      </section>

      <section className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#181A20] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder-[#565E6D] outline-none focus:border-[#FF4D4D] transition-colors"
        />

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="bg-[#181A20] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] outline-none focus:border-[#FF4D4D] transition-colors appearance-none cursor-pointer"
        >
          {BATCH_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Status | "All")}
          className="bg-[#181A20] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] outline-none focus:border-[#FF4D4D] transition-colors appearance-none cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button className="bg-[#F04438] hover:bg-[#FF4D4D] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
          <span>➕</span> Add Candidate
        </button>
      </section>

      <section className="bg-[#121316] border border-[#1E2026] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E2026] text-left text-[#8E95A3] text-xs uppercase tracking-wider">
              <th className="px-5 py-3.5">Candidate</th>
              <th className="px-5 py-3.5">Batch</th>
              <th className="px-5 py-3.5">Target Band</th>
              <th className="px-5 py-3.5">Current Band</th>
              <th className="px-5 py-3.5">AI Coins Balance</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[#1E2026]/50 hover:bg-[#181A20] transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-[#F3F4F6]">
                      {c.name}
                    </span>
                    <span className="text-xs text-[#565E6D]">
                      {c.studentId}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#8E95A3]">{c.batch}</td>
                <td className="px-5 py-4 text-[#F3F4F6] font-medium">
                  {c.targetBand}
                </td>
                <td className="px-5 py-4 text-[#F3F4F6]">{c.currentBand}</td>
                <td className="px-5 py-4 text-[#F59E0B] font-medium">
                  {c.aiCoins}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[c.status]}`}
                  >
                    {STATUS_ICON[c.status]} {c.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-[#1E2026] bg-[#181A20] text-xs text-[#F3F4F6] hover:border-[#FF4D4D] transition-colors">
                      View
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-[#1E2026] bg-[#181A20] text-xs text-[#F3F4F6] hover:border-[#FF4D4D] transition-colors">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-[#565E6D] text-sm"
                >
                  No candidates found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

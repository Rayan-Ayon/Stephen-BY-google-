import { useState } from "react";
import { CANONICAL_20_STUDENTS, CanonicalStudent } from "@/lib/telemetryEgress";
import { Student360AuditModal } from "./Student360AuditModal";

type Status = "Active" | "Inactive" | "Graduated";

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

const BATCH_OPTIONS = ["All", "Farmgate Executive Batch", "Morning Elite", "Weekend Target 7.5+"];
const STATUS_OPTIONS: Array<Status | "All"> = ["All", "Active", "Inactive", "Graduated"];

export default function BatchRoster() {
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<Status | "All">("All");
  const [auditStudent, setAuditStudent] = useState<CanonicalStudent | null>(null);

  const filtered = CANONICAL_20_STUDENTS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.handle.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] p-6 space-y-6">
      <header className="border-b border-[#1E2026] pb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-wide text-[#F3F4F6]">
            IDENTITY &amp; SEATS // BATCH &amp; CANDIDATE ROSTER
          </h1>
          <p className="text-xs text-[#8E95A3] mt-1">
            Farmgate Executive Cohort • Exactly 20 Verified Enrolled Candidates (100% Active)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 bg-rose-950/40 text-rose-400 border border-rose-800/40 rounded-full">
            20 / 20 Enrolled Seats Used
          </span>
        </div>
      </header>

      {/* SEARCH AND FILTER BAR */}
      <section className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, @handle or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[260px] bg-[#181A20] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder-[#565E6D] outline-none focus:border-[#E11D48] transition-colors"
        />

        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="bg-[#181A20] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] outline-none focus:border-[#E11D48] transition-colors appearance-none cursor-pointer"
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
          className="bg-[#181A20] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] outline-none focus:border-[#E11D48] transition-colors appearance-none cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button className="bg-[#E11D48] hover:bg-[#be123c] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
          <span>➕</span> Add Candidate
        </button>
      </section>

      {/* CANDIDATES TABLE */}
      <section className="bg-[#121316] border border-[#1E2026] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2026] text-left text-[#8E95A3] text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Branch</th>
                <th className="px-5 py-3.5">Target Band</th>
                <th className="px-5 py-3.5">Current Band</th>
                <th className="px-5 py-3.5">Active Mins Today</th>
                <th className="px-5 py-3.5">AI Coins</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setAuditStudent(c)}
                  className="border-b border-[#1E2026]/50 hover:bg-[#181A20] transition-colors group cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={c.avatarUrl} 
                        alt={c.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#222732] shrink-0" 
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-[#F3F4F6] group-hover:text-rose-400 transition-colors">
                          {c.name}
                        </span>
                        <span className="text-xs text-[#565E6D] font-mono">
                          @{c.handle}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#8E95A3] text-xs">{c.branch}</td>
                  <td className="px-5 py-4 text-[#F3F4F6] font-medium font-mono">
                    Band {c.targetBand.toFixed(1)}
                  </td>
                  <td className="px-5 py-4 text-[#F3F4F6] font-mono">
                    <span className="text-rose-400 font-bold">Band {c.currentBand.toFixed(1)}</span>
                  </td>
                  <td className="px-5 py-4 text-[#8E95A3] font-mono text-xs">
                    ⚡ {c.activeMinutesToday} mins
                  </td>
                  <td className="px-5 py-4 text-[#F59E0B] font-medium font-mono">
                    🪙 {c.aiCoins}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[c.status]}`}
                    >
                      {STATUS_ICON[c.status]} {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setAuditStudent(c)}
                        className="px-3 py-1.5 rounded-lg border border-rose-900/40 bg-rose-950/30 text-xs font-bold text-rose-400 hover:bg-rose-900/50 hover:border-rose-600 transition-all cursor-pointer"
                      >
                        [ View Profile / Audit Log ]
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-[#565E6D] text-sm"
                  >
                    No candidates found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* METRIC CARDS - STANDARDIZED TO EXACTLY 20 ENROLLED */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Enrolled Candidates", value: "20 / 20", icon: "👥", sub: "100% Capacity Used" },
          { label: "Active Batches", value: "1 Active", icon: "📦", sub: "Farmgate Executive" },
          { label: "Cohort Avg Target Band", value: "7.4 Band", icon: "🎯", sub: "Target Range: 6.5 - 8.0" },
          { label: "Total AI Coin Reserve", value: "9,640", icon: "⚡", sub: "Avg: 482 / Student" },
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
            <span className="text-xs text-slate-500 font-mono">
              {m.sub}
            </span>
          </div>
        ))}
      </section>

      {/* 360 AUDIT MODAL */}
      <Student360AuditModal
        student={auditStudent}
        isOpen={!!auditStudent}
        onClose={() => setAuditStudent(null)}
      />
    </div>
  );
}

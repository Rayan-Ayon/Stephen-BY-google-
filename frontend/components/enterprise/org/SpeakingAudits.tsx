"use client";

import { useState } from "react";

const statusOptions = ["All", "Pending", "Reviewed", "Flagged"] as const;
const partOptions = ["All", "Part 1", "Part 2", "Part 3"] as const;

type Status = (typeof statusOptions)[number];
type Part = (typeof partOptions)[number];

interface Recording {
  id: string;
  candidateName: string;
  batch: string;
  part: string;
  duration: string;
  transcriptionQuality: number;
  fluencyScore: number;
  status: "Pending" | "Flagged" | "Reviewed";
}

const recordings: Recording[] = [
  {
    id: "1",
    candidateName: "Tanvir Hossain",
    batch: "Batch A-2024",
    part: "Part 2",
    duration: "14:32",
    transcriptionQuality: 97,
    fluencyScore: 6.5,
    status: "Pending",
  },
  {
    id: "2",
    candidateName: "Anika Rahman",
    batch: "Batch B-2024",
    part: "Part 3",
    duration: "18:45",
    transcriptionQuality: 94,
    fluencyScore: 7.0,
    status: "Pending",
  },
  {
    id: "3",
    candidateName: "Rafiqul Islam",
    batch: "Batch A-2024",
    part: "Part 1",
    duration: "11:20",
    transcriptionQuality: 82,
    fluencyScore: 5.5,
    status: "Flagged",
  },
];

const metrics = [
  { icon: "\u{1F3A4}", label: "Pending Audio Reviews", value: "6" },
  { icon: "\u23F1\uFE0F", label: "Avg Duration", value: "14.3 min" },
  { icon: "\u{1F4DD}", label: "Transcription Accuracy", value: "96.2%" },
  { icon: "\u26A0\uFE0F", label: "Flagged Recordings", value: "2" },
];

function statusStyle(status: string) {
  switch (status) {
    case "Pending":
      return "bg-[#F59E0B]/15 text-[#F59E0B]";
    case "Flagged":
      return "bg-[#EF4444]/15 text-[#EF4444]";
    case "Reviewed":
      return "bg-[#10B981]/15 text-[#10B981]";
    default:
      return "bg-[#8E95A3]/15 text-[#8E95A3]";
  }
}

function qualityColor(pct: number) {
  if (pct >= 95) return "bg-[#10B981]";
  if (pct >= 80) return "bg-[#F59E0B]";
  return "bg-[#EF4444]";
}

export default function SpeakingAudits() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("All");
  const [partFilter, setPartFilter] = useState<Part>("All");

  const filtered = recordings.filter((r) => {
    const matchSearch =
      r.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      r.batch.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const matchPart = partFilter === "All" || r.part === partFilter;
    return matchSearch && matchStatus && matchPart;
  });

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] p-6 lg:p-8 font-sans">
      <h1 className="text-sm font-semibold tracking-[0.15em] text-[#8E95A3] mb-8 uppercase">
        EVALUATION STUDIO // SPEAKING AUDIO AUDITS &amp; TRANSCRIPTS
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-[#121316] border border-[#1E2026] rounded-xl p-5 flex items-center gap-4"
          >
            <span className="text-2xl">{m.icon}</span>
            <div>
              <p className="text-xs text-[#565E6D] uppercase tracking-wider mb-1">
                {m.label}
              </p>
              <p className="text-xl font-bold text-[#F3F4F6]">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search candidates or batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder-[#565E6D] focus:outline-none focus:border-[#FF4D4D] w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status)}
          className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#FF4D4D] cursor-pointer"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              Status: {s}
            </option>
          ))}
        </select>
        <select
          value={partFilter}
          onChange={(e) => setPartFilter(e.target.value as Part)}
          className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#FF4D4D] cursor-pointer"
        >
          {partOptions.map((p) => (
            <option key={p} value={p}>
              Part: {p}
            </option>
          ))}
        </select>
        <button className="ml-auto bg-[#F04438] hover:bg-[#FF4D4D] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
          {"\u{1F3A7}"} Start Audit Session
        </button>
      </div>

      <div className="bg-[#121316] border border-[#1E2026] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2026]">
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Candidate
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Part
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Duration
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Transcription Quality
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Fluency Score
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#1E2026]/50 hover:bg-[#181A20] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#F3F4F6]">
                      {r.candidateName}
                    </p>
                    <p className="text-xs text-[#565E6D] mt-0.5">{r.batch}</p>
                  </td>
                  <td className="px-6 py-4 text-[#8E95A3]">{r.part}</td>
                  <td className="px-6 py-4 text-[#8E95A3]">{r.duration}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[#1E2026] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${qualityColor(r.transcriptionQuality)}`}
                          style={{ width: `${r.transcriptionQuality}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#8E95A3] tabular-nums">
                        {r.transcriptionQuality}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#F3F4F6] font-medium tabular-nums">
                    {r.fluencyScore}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle(r.status)}`}
                    >
                      {r.status === "Pending" && "⏳ "}
                      {r.status === "Flagged" && "⚠️ "}
                      {r.status === "Reviewed" && "✓ "}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="bg-[#181A20] hover:bg-[#FF4D4D]/15 hover:text-[#FF4D4D] text-[#8E95A3] text-xs font-medium px-3 py-1.5 rounded-md border border-[#1E2026] transition-colors">
                        Listen
                      </button>
                      <button className="bg-[#181A20] hover:bg-[#FF4D4D]/15 hover:text-[#FF4D4D] text-[#8E95A3] text-xs font-medium px-3 py-1.5 rounded-md border border-[#1E2026] transition-colors">
                        Review Transcript
                      </button>
                      {r.status === "Flagged" && (
                        <button className="bg-[#181A20] hover:bg-[#EF4444]/15 hover:text-[#EF4444] text-[#8E95A3] text-xs font-medium px-3 py-1.5 rounded-md border border-[#1E2026] transition-colors">
                          Flag Detail
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-[#565E6D] text-sm"
                  >
                    No recordings match the current filters.
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

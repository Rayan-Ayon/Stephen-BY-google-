"use client";

import { useState, useMemo } from "react";

const statusOptions = ["All", "Draft", "Live", "Completed"] as const;
const typeOptions = ["All", "Cambridge", "Full Mock", "Sectional"] as const;

type StatusFilter = (typeof statusOptions)[number];
type TypeFilter = (typeof typeOptions)[number];
type TestStatus = "Live" | "Scheduled" | "Draft";

interface MockTest {
  id: string;
  name: string;
  type: string;
  duration: string;
  status: TestStatus;
  deployedBatches: number;
}

const tests: MockTest[] = [
  {
    id: "1",
    name: "Cambridge IELTS 18 - Test 1",
    type: "Full Test",
    duration: "2h 45m",
    status: "Live",
    deployedBatches: 3,
  },
  {
    id: "2",
    name: "Cambridge IELTS 17 - Test 3",
    type: "Full Test",
    duration: "2h 30m",
    status: "Live",
    deployedBatches: 2,
  },
  {
    id: "3",
    name: "Writing Task 2 Pack - Advanced",
    type: "Sectional",
    duration: "45m",
    status: "Scheduled",
    deployedBatches: 0,
  },
];

const metrics = [
  { icon: "\u{1F4DD}", label: "Active Mock Tests", value: "8" },
  { icon: "\u{1F465}", label: "Deployed Candidates", value: "1,240" },
  { icon: "\u23F1\uFE0F", label: "Avg Completion Time", value: "2h 45m" },
  { icon: "\u{1F4CA}", label: "Avg Score", value: "6.2" },
];

function statusStyle(status: TestStatus) {
  switch (status) {
    case "Live":
      return "bg-[#10B981]/15 text-[#10B981]";
    case "Scheduled":
      return "bg-[#F59E0B]/15 text-[#F59E0B]";
    case "Draft":
      return "bg-[#8E95A3]/15 text-[#8E95A3]";
    default:
      return "bg-[#8E95A3]/15 text-[#8E95A3]";
  }
}

function statusIcon(status: TestStatus) {
  switch (status) {
    case "Live":
      return "\u{1F7E2}";
    case "Scheduled":
      return "\u{1F4C5}";
    case "Draft":
      return "\u{1F4DD}";
    default:
      return "";
  }
}

export default function MockDeployment() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");

  const filtered = useMemo(() => {
    return tests.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "All" ||
        t.status === (statusFilter === "Completed" ? "Live" : statusFilter);
      const matchType =
        typeFilter === "All" ||
        t.type.toLowerCase().includes(typeFilter.toLowerCase());
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] p-6 lg:p-8 font-sans">
      <h1 className="text-sm font-semibold tracking-[0.15em] text-[#8E95A3] mb-8 uppercase">
        CURRICULUM ASSETS // CAMBRIDGE &amp; MOCK TEST DEPLOYMENT
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
          placeholder="Search tests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder-[#565E6D] focus:outline-none focus:border-[#FF4D4D] w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#FF4D4D] cursor-pointer"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              Status: {s}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#FF4D4D] cursor-pointer"
        >
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              Type: {t}
            </option>
          ))}
        </select>
        <button className="ml-auto bg-[#F04438] hover:bg-[#FF4D4D] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
          {"\u{1F680}"} Deploy New Test
        </button>
      </div>

      <div className="bg-[#121316] border border-[#1E2026] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2026]">
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Test Name
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Type
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Duration
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Deployed To
                </th>
                <th className="text-left text-xs text-[#565E6D] uppercase tracking-wider font-medium px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-[#1E2026]/50 hover:bg-[#181A20] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#F3F4F6]">{t.name}</p>
                  </td>
                  <td className="px-6 py-4 text-[#8E95A3]">{t.type}</td>
                  <td className="px-6 py-4 text-[#8E95A3]">{t.duration}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle(t.status)}`}
                    >
                      {statusIcon(t.status)} {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#8E95A3]">
                    {t.deployedBatches > 0
                      ? `${t.deployedBatches} Batches`
                      : "0 Batches"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {t.status === "Scheduled" || t.deployedBatches === 0 ? (
                        <button className="bg-[#181A20] hover:bg-[#10B981]/15 hover:text-[#10B981] text-[#8E95A3] text-xs font-medium px-3 py-1.5 rounded-md border border-[#1E2026] transition-colors">
                          Deploy
                        </button>
                      ) : (
                        <button className="bg-[#181A20] hover:bg-[#FF4D4D]/15 hover:text-[#FF4D4D] text-[#8E95A3] text-xs font-medium px-3 py-1.5 rounded-md border border-[#1E2026] transition-colors">
                          View Results
                        </button>
                      )}
                      <button className="bg-[#181A20] hover:bg-[#FF4D4D]/15 hover:text-[#FF4D4D] text-[#8E95A3] text-xs font-medium px-3 py-1.5 rounded-md border border-[#1E2026] transition-colors">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-[#565E6D] text-sm"
                  >
                    No mock tests match the current filters.
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

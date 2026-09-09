import React, { useState } from 'react';

type FilterStatus = 'All' | 'Pending' | 'Approved' | 'Rejected';

interface QueueEntry {
  id: string;
  name: string;
  batch: string;
  essayType: string;
  uploadTime: string;
  ocrConfidence: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Low Confidence';
}

const ENTRIES: QueueEntry[] = [
  {
    id: '1',
    name: 'Tanvir Hossain',
    batch: 'Batch A-2024',
    essayType: 'Writing Task 2',
    uploadTime: '2h ago',
    ocrConfidence: 94,
    status: 'Pending',
  },
  {
    id: '2',
    name: 'Anika Rahman',
    batch: 'Batch B-2024',
    essayType: 'Writing Task 1',
    uploadTime: '5h ago',
    ocrConfidence: 87,
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Rafiqul Islam',
    batch: 'Batch A-2024',
    essayType: 'Writing Task 2',
    uploadTime: '1d ago',
    ocrConfidence: 72,
    status: 'Low Confidence',
  },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B]',
  Approved: 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]',
  Rejected: 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]',
  'Low Confidence': 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]',
};

const confidenceColor = (pct: number) => {
  if (pct >= 90) return 'bg-[#10B981]';
  if (pct >= 80) return 'bg-[#F59E0B]';
  return 'bg-[#EF4444]';
};

const HandwrittenQueue: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');

  const filtered = ENTRIES.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.batch.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      e.status === statusFilter ||
      (statusFilter === 'Pending' && e.status === 'Low Confidence');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-xl font-bold tracking-wide text-[#F3F4F6] uppercase">
            EVALUATION STUDIO <span className="text-[#565E6D]">//</span> HANDWRITTEN ESSAY QUEUE (OCR)
          </h1>
        </header>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Pending Reviews', value: '12', icon: '📄' },
            { label: 'Avg Processing Time', value: '4.2 min', icon: '⏱' },
            { label: 'Approved Today', value: '8', icon: '✅' },
            { label: 'Low Confidence OCR', value: '3', icon: '⚠️' },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl bg-[#121316] border border-[#1E2026] px-5 py-4 flex items-center gap-4"
            >
              <span className="text-2xl">{m.icon}</span>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#565E6D] font-semibold">
                  {m.label}
                </p>
                <p className="text-xl font-bold text-[#F3F4F6] mt-0.5">{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search candidates or batch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] placeholder:text-[#565E6D] focus:outline-none focus:border-[#8E95A3] transition-colors"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#565E6D]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="bg-[#121316] border border-[#1E2026] rounded-lg px-4 py-2.5 text-sm text-[#F3F4F6] focus:outline-none focus:border-[#8E95A3] transition-colors appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button className="flex items-center gap-2 bg-[#F04438] hover:bg-[#FF4D4D] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
            🔍 Batch OCR Scan
          </button>
        </div>

        <div className="rounded-xl border border-[#1E2026] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#121316] border-b border-[#1E2026]">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                  Candidate
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                  Essay Type
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                  Upload Time
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                  OCR Confidence
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider text-[#565E6D] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-[#1E2026] last:border-b-0 hover:bg-[#181A20] transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#F3F4F6]">{entry.name}</p>
                    <p className="text-[11px] text-[#565E6D] mt-0.5">{entry.batch}</p>
                  </td>
                  <td className="px-5 py-4 text-[#8E95A3]">{entry.essayType}</td>
                  <td className="px-5 py-4 text-[#8E95A3]">{entry.uploadTime}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[#1E2026] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${confidenceColor(entry.ocrConfidence)}`}
                          style={{ width: `${entry.ocrConfidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#8E95A3] font-mono">{entry.ocrConfidence}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${statusColors[entry.status]}`}
                    >
                      {entry.status === 'Pending' && '⏳'}
                      {entry.status === 'Low Confidence' && '⚠️'}
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-[#121316] border border-[#1E2026] text-[#8E95A3] text-xs font-semibold hover:bg-[#181A20] hover:text-[#F3F4F6] transition-colors">
                        Review Essay
                      </button>
                      {entry.status === 'Low Confidence' && (
                        <button className="px-3 py-1.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold hover:bg-[#EF4444]/20 transition-colors">
                          Re-scan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-[#565E6D] text-sm">
              No entries match the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandwrittenQueue;

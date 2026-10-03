import React, { useState } from "react";
import { Sparkles, Brain, CheckCircle2, AlertTriangle, ArrowRight, X, Send, BookOpen, Clock, Users, Target } from "lucide-react";

interface MisconceptionEntry {
  id: string;
  category: string;
  module: string;
  dotColor: string;
  frequency: number;
  affectedStudents: number;
  status: "In Progress" | "Unresolved" | "Resolved";
  lastDetected: string;
  sampleQuestions: { q: string; type: string; focus: string }[];
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  "In Progress": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: "🟡" },
  Unresolved: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", icon: "🔴" },
  Resolved: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: "✅" },
};

const MODULES = ["All", "Writing", "Listening", "Reading", "Speaking"];
const STATUSES = ["All", "Unresolved", "In Progress", "Resolved"];

const INITIAL_MOCK_DATA: MisconceptionEntry[] = [
  {
    id: "1",
    category: "Task Achievement Ignored",
    module: "Writing",
    dotColor: "#EF4444",
    frequency: 18,
    affectedStudents: 12,
    status: "Unresolved",
    lastDetected: "2h ago",
    sampleQuestions: [
      { q: "Identify the primary thesis flaw in this 2-part IELTS prompt response.", type: "Multiple Choice", focus: "Prompt Coverage" },
      { q: "Rewrite the introductory thesis to address both sides evenly.", type: "Sentence Drill", focus: "Balanced Position" },
      { q: "Select the sentence that deviates off-topic from the prompt question.", type: "Identification", focus: "Relevance Audit" },
      { q: "Formulate a concluding takeaway directly linking to paragraph 2 arguments.", type: "Synthesis", focus: "Task Completion" },
      { q: "Spot the unaddressed sub-clause from the examiner prompt.", type: "Rapid Detection", focus: "Question Dissection" },
    ]
  },
  {
    id: "2",
    category: "Passive Voice Overuse",
    module: "Writing",
    dotColor: "#F59E0B",
    frequency: 14,
    affectedStudents: 9,
    status: "In Progress",
    lastDetected: "5h ago",
    sampleQuestions: [
      { q: "Convert this overly passive complex sentence into an active voice structure.", type: "Transformation", focus: "Sentence Vigor" },
      { q: "Identify where passive voice creates unnecessary ambiguity in IELTS Task 2.", type: "Multiple Choice", focus: "Clarity Audit" },
      { q: "Revise this academic argument to highlight the agent of the research.", type: "Editing Drill", focus: "Agency & Flow" },
      { q: "Distinguish appropriate passive constructions from stylistic errors.", type: "Categorization", focus: "Style Nuance" },
      { q: "Eliminate repetitive 'by the...' phrasing in this 80-word paragraph.", type: "Paragraph Polish", focus: "Conciseness" },
    ]
  },
  {
    id: "3",
    category: "Misleading Connectors",
    module: "Reading",
    dotColor: "#10B981",
    frequency: 8,
    affectedStudents: 6,
    status: "Resolved",
    lastDetected: "1d ago",
    sampleQuestions: [
      { q: "Distinguish between 'Furthermore' and 'Conversely' in concession paragraphs.", type: "Discourse Markers", focus: "Logical Transition" },
      { q: "Identify faulty cohesion caused by 'On the other hand' without 'On the one hand'.", type: "Syntax Audit", focus: "Paired Transitions" },
      { q: "Choose the transition that accurately reflects a causal relationship.", type: "Multiple Choice", focus: "Cause & Effect" },
      { q: "Replace mechanical transitions with cohesive thematic referencing.", type: "Advanced Style", focus: "Band 8+ Cohesion" },
      { q: "Correct punctuation and placement of however / nevertheless in compound clauses.", type: "Punctuation Drill", focus: "Mechanical Precision" },
    ]
  },
  {
    id: "4",
    category: "Over-generalization in Topic Sentences",
    module: "Writing",
    dotColor: "#EF4444",
    frequency: 16,
    affectedStudents: 11,
    status: "Unresolved",
    lastDetected: "3h ago",
    sampleQuestions: [
      { q: "Hedge this absolute claim ('Everyone agrees that...') using academic modality.", type: "Hedging Drill", focus: "Academic Tone" },
      { q: "Select the most defensible topic sentence for an economic impact paragraph.", type: "Multiple Choice", focus: "Claim Calibration" },
      { q: "Identify sweeping generalizations in student sample essays.", type: "Error Analysis", focus: "Critical Stance" },
      { q: "Rephrase an absolute statement using probability modals ('tends to', 'likely').", type: "Rephrasing", focus: "Nuanced Argument" },
      { q: "Evaluate evidence fit against a broad opening generalization.", type: "Evaluation", focus: "Evidence Alignment" },
    ]
  },
];

export default function MisconceptionLog() {
  const [data, setData] = useState<MisconceptionEntry[]>(INITIAL_MOCK_DATA);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState<MisconceptionEntry | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const maxFrequency = Math.max(...data.map((d) => d.frequency));

  const filteredData = data.filter((entry) => {
    const matchesSearch = entry.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || entry.status === statusFilter;
    const matchesModule = moduleFilter === "All" || entry.module === moduleFilter;
    return matchesSearch && matchesStatus && matchesModule;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeployDrill = () => {
    if (!selectedEntry) return;
    setIsDeploying(true);

    setTimeout(() => {
      // Store in localStorage as active pinned directive
      const drillDirective = {
        title: `Remediation Drill: ${selectedEntry.category}`,
        description: `Targeted 5-question corrective drill compiled to resolve ${selectedEntry.category}. Mandatory for ${selectedEntry.affectedStudents} identified cohort candidates.`,
        submittedCount: 0,
        totalAssigned: selectedEntry.affectedStudents,
        deadline: "Tonight @ 9:00 PM BST",
        type: "corrective_drill",
        misconception: selectedEntry.category,
        questions: selectedEntry.sampleQuestions,
        publishedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem("stephen_active_pinned_directive", JSON.stringify(drillDirective));
        window.dispatchEvent(new Event("stephen_mission_published"));
      } catch (e) {
        console.error(e);
      }

      // Update entry status locally
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedEntry.id ? { ...item, status: "In Progress" } : item
        )
      );

      setIsDeploying(false);
      const affectedCount = selectedEntry.affectedStudents;
      const cat = selectedEntry.category;
      setSelectedEntry(null);
      showToast(`🎯 Corrective Drill Dispatched! Pushed 5-question remediation on "${cat}" to ${affectedCount} students.`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-[#F3F4F6] font-sans p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#15181E] border border-rose-500/40 text-slate-100 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
            <span className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400">
              <CheckCircle2 className="w-5 h-5 text-rose-400" />
            </span>
            <div className="text-xs font-semibold">{toastMessage}</div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222732] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#8E95A3] uppercase mb-1">
              <Brain className="w-3.5 h-3.5 text-rose-500" />
              <span>Cohort Telemetry // Student Misconception Log (AI Audit)</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Diagnostic Error Clustering &amp; Remediation
            </h1>
          </div>
          <button
            onClick={() => showToast("🧠 Live AI Telemetry Audit synced. 4 recurring patterns identified across 1,240 essays.")}
            className="self-start sm:self-auto bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-rose-950/30 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run AI Cohort Audit</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#15181E] border border-[#222732] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[#8E95A3] text-xs font-medium uppercase tracking-wider">Total Misconceptions</p>
              <p className="text-white text-2xl font-extrabold tracking-tight">47 Patterns</p>
            </div>
          </div>
          <div className="bg-[#15181E] border border-[#222732] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[#8E95A3] text-xs font-medium uppercase tracking-wider">Recurring Critical Flaws</p>
              <p className="text-white text-2xl font-extrabold tracking-tight">8 Urgent</p>
            </div>
          </div>
          <div className="bg-[#15181E] border border-[#222732] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[#8E95A3] text-xs font-medium uppercase tracking-wider">Essays Scanned</p>
              <p className="text-white text-2xl font-extrabold tracking-tight">1,240 Drafts</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-[#15181E] border border-[#222732] rounded-xl px-4 py-3">
          <input
            type="text"
            placeholder="Search misconceptions (e.g. Task Achievement, Passive Voice)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0D0F12] border border-[#222732] rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#565E6D] focus:outline-none focus:border-rose-500 transition-colors w-72"
          />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-[#0D0F12] border border-[#222732] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 transition-colors"
          >
            {MODULES.map((m) => (
              <option key={m} value={m}>
                {m === "All" ? "All Modules" : `${m} Module`}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0D0F12] border border-[#222732] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 transition-colors"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Statuses" : s}
              </option>
            ))}
          </select>
          <div className="ml-auto text-xs text-slate-400 font-mono">
            Showing <span className="text-white font-bold">{filteredData.length}</span> clustered categories
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="bg-[#15181E] border border-[#222732] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#222732] bg-[#111318]">
                <th className="text-left text-[11px] font-bold text-[#8E95A3] uppercase tracking-wider px-5 py-3.5">
                  Misconception Cluster
                </th>
                <th className="text-left text-[11px] font-bold text-[#8E95A3] uppercase tracking-wider px-5 py-3.5">
                  Frequency
                </th>
                <th className="text-left text-[11px] font-bold text-[#8E95A3] uppercase tracking-wider px-5 py-3.5">
                  Affected Students
                </th>
                <th className="text-left text-[11px] font-bold text-[#8E95A3] uppercase tracking-wider px-5 py-3.5">
                  Status
                </th>
                <th className="text-left text-[11px] font-bold text-[#8E95A3] uppercase tracking-wider px-5 py-3.5">
                  Last Detected
                </th>
                <th className="text-right text-[11px] font-bold text-[#8E95A3] uppercase tracking-wider px-5 py-3.5">
                  Remediation Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222732]">
              {filteredData.map((entry) => {
                const statusStyle = STATUS_STYLES[entry.status];
                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-[#181C24] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: entry.dotColor }}
                        />
                        <div>
                          <span className="text-sm text-white font-bold block">
                            {entry.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {entry.module} Module • Pattern #{entry.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-white font-mono font-bold w-6">
                          {entry.frequency}
                        </span>
                        <div className="flex-1 max-w-[100px]">
                          <div className="h-1.5 bg-[#0D0F12] rounded-full overflow-hidden border border-[#222732]">
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
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-200 font-semibold bg-[#181C24] px-2.5 py-1 rounded-md border border-[#222732]">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {entry.affectedStudents} Students
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        <span>{statusStyle.icon}</span>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-[#8E95A3] font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {entry.lastDetected}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-600 text-rose-400 hover:text-white text-xs font-bold transition-all shadow-sm group"
                      >
                        <Target className="w-3.5 h-3.5 text-rose-400 group-hover:text-white" />
                        <span>Generate Review Drill</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#565E6D] text-sm font-medium">
                    No misconceptions match your current filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE 5-QUESTION CORRECTIVE DRILL COMPILER MODAL
          ========================================================================= */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#15181E] border border-[#222732] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#222732] flex items-center justify-between bg-[#111318]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-600/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Target className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Corrective Drill Generator // 5-Question Mission
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Target Weakness: <span className="text-rose-400 font-bold">{selectedEntry.category}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E222B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Telemetry Summary Pill */}
              <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Target Cohort</span>
                  <span className="text-sm font-bold text-white">{selectedEntry.affectedStudents} Candidates</span>
                </div>
                <div className="border-x border-[#222732]">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Error Frequency</span>
                  <span className="text-sm font-bold text-rose-400">{selectedEntry.frequency} Occurrences</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Est. Completion</span>
                  <span className="text-sm font-bold text-emerald-400">12 - 15 Mins</span>
                </div>
              </div>

              {/* 5-Question Targeted Curriculum */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-rose-400" />
                    <span>Compiled Diagnostic Curriculum (5 Questions)</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">AI Curated from Mistake Corpus</span>
                </div>

                <div className="space-y-2.5">
                  {selectedEntry.sampleQuestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#181C24] border border-[#222732] rounded-xl p-3.5 flex items-start gap-3 hover:border-slate-600 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-100">{item.q}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono bg-[#0D0F12] px-2 py-0.5 rounded border border-[#222732]">
                            Format: {item.type}
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                            Focus: {item.focus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment Settings */}
              <div className="bg-[#181C24] border border-[#222732] rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-200">Deployment Directives:</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1">Deadline:</label>
                    <input
                      type="text"
                      defaultValue="Today @ 9:00 PM BST"
                      className="w-full bg-[#0D0F12] border border-[#222732] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1">Pass Requirement:</label>
                    <select className="w-full bg-[#0D0F12] border border-[#222732] rounded-lg px-3 py-1.5 text-xs text-white">
                      <option>80% Score (4/5 Correct)</option>
                      <option>100% Score (Mandatory Perfect)</option>
                      <option>Completion Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#222732] bg-[#111318] flex items-center justify-between">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleDeployDrill}
                disabled={isDeploying}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-rose-950/40 transition-all flex items-center gap-2"
              >
                {isDeploying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Compiling &amp; Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Push as Active Mission ({selectedEntry.affectedStudents} Students)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


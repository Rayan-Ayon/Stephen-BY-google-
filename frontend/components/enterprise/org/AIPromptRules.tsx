import React, { useState } from "react";

interface Rule {
  id: string;
  text: string;
  active: boolean;
}

const initialRules: Rule[] = [
  {
    id: "1",
    text: "Flag generic templates in Writing Task 2",
    active: true,
  },
  {
    id: "2",
    text: "Prioritize Lexical Resource feedback for Band 6.5 cohort",
    active: true,
  },
  {
    id: "3",
    text: "Require Part 3 depth analysis for Band 7+ targets",
    active: false,
  },
];

export default function AIPromptRules() {
  const [harshness, setHarshness] = useState(0.5);
  const [evaluationMode, setEvaluationMode] = useState("Balanced");
  const [requireOverride, setRequireOverride] = useState(false);
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [sandboxInput, setSandboxInput] = useState("");
  const [sandboxResult, setSandboxResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleAddRule = () => {
    const newRule: Rule = {
      id: String(rules.length + 1),
      text: "New custom rule",
      active: true,
    };
    setRules([...rules, newRule]);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const handleRunSandbox = () => {
    if (!sandboxInput.trim()) return;
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setSandboxResult(
        `[Sandbox AI Response]\n\nMode: ${evaluationMode}\nHarshness: ${harshness.toFixed(2)}\nOverride Required: ${requireOverride ? "Yes" : "No"}\n\nInput: "${sandboxInput}"\n\nAssessment: The submitted response demonstrates adequate coherence but lacks depth in task response. Lexical resource usage is formulaic. Suggested band: ${harshness < 0.3 ? "6.5" : harshness < 0.7 ? "6.0" : "5.5"}\n\nActive Rules Applied: ${rules.filter((r) => r.active).length}`
      );
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F3F4F6] font-sans">
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-2 h-2 rounded-full bg-[#FF4D4D]" />
          <h1 className="text-xl font-semibold tracking-wide text-[#F3F4F6] uppercase">
            NODE SETTINGS // CUSTOM AI ASSESSMENT PROMPTS & RULES
          </h1>
        </div>

        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-[#121316] border border-[#1E2026] rounded-xl p-6">
            <h2 className="text-sm font-medium text-[#8E95A3] uppercase tracking-wider mb-6">
              Global AI Settings
            </h2>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-[#8E95A3]">
                  Harshness Level
                </label>
                <span className="text-sm font-mono text-[#F3F4F6]">
                  {harshness.toFixed(2)}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={harshness}
                  onChange={(e) => setHarshness(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[#1E2026]"
                  style={{
                    background: `linear-gradient(to right, #10B981 0%, #F59E0B 50%, #EF4444 100%)`,
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-[#565E6D]">0.0 Lenient</span>
                  <span className="text-xs text-[#565E6D]">1.0 Strict</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="text-sm text-[#8E95A3] block mb-3">
                Evaluation Mode
              </label>
              <div className="flex gap-2">
                {["Strict Examiner", "Balanced", "Encouraging"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setEvaluationMode(mode)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      evaluationMode === mode
                        ? "bg-[#FF4D4D] border-[#FF4D4D] text-white"
                        : "bg-[#181A20] border-[#1E2026] text-[#8E95A3] hover:bg-[#1E2026] hover:text-[#F3F4F6]"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8E95A3]">
                Require teacher override before score release
              </span>
              <button
                onClick={() => setRequireOverride(!requireOverride)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  requireOverride ? "bg-[#10B981]" : "bg-[#1E2026]"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    requireOverride ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#121316] border border-[#1E2026] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-[#8E95A3] uppercase tracking-wider">
                Custom Rules
              </h2>
              <button
                onClick={handleAddRule}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#FF4D4D] text-white rounded-lg hover:bg-[#F04438] transition-colors"
              >
                <span>+</span>
                <span>Add New Rule</span>
              </button>
            </div>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-3 p-4 bg-[#181A20] border border-[#1E2026] rounded-lg group hover:border-[#2A2C35] transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      rule.active ? "bg-[#10B981]" : "bg-[#565E6D]"
                    }`}
                  />
                  <span className="flex-1 text-sm text-[#F3F4F6]">
                    {rule.text}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className="px-2 py-1 text-xs bg-[#1E2026] text-[#8E95A3] rounded hover:bg-[#2A2C35] hover:text-[#F3F4F6] transition-colors"
                    >
                      {rule.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="px-2 py-1 text-xs bg-[#1E2026] text-[#EF4444] rounded hover:bg-[#EF4444]/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#121316] border border-[#1E2026] rounded-xl p-6">
          <h2 className="text-sm font-medium text-[#8E95A3] uppercase tracking-wider mb-6">
            Sandbox Tester
          </h2>

          <div className="flex gap-4 mb-6">
            <textarea
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              placeholder="Enter test input to simulate AI assessment..."
              className="flex-1 h-32 px-4 py-3 bg-[#181A20] border border-[#1E2026] rounded-lg text-sm text-[#F3F4F6] placeholder-[#565E6D] resize-none focus:outline-none focus:border-[#FF4D4D] transition-colors"
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleRunSandbox}
              disabled={testing || !sandboxInput.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                testing || !sandboxInput.trim()
                  ? "bg-[#1E2026] text-[#565E6D] cursor-not-allowed"
                  : "bg-[#FF4D4D] text-white hover:bg-[#F04438]"
              }`}
            >
              <span>🧪</span>
              <span>{testing ? "Running Test..." : "Run Sandbox Test"}</span>
            </button>
          </div>

          {sandboxResult && (
            <div className="p-4 bg-[#181A20] border border-[#1E2026] rounded-lg">
              <pre className="text-sm text-[#8E95A3] whitespace-pre-wrap font-mono leading-relaxed">
                {sandboxResult}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

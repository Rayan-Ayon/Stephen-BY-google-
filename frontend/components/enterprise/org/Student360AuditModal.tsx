import React, { useState } from 'react';
import { 
  X, Flame, Target, TrendingUp, Clock, Send, FileText, 
  CheckCircle2, AlertTriangle, BookOpen, Headphones, 
  PenTool, Mic, Calendar, ShieldAlert, Sliders, MessageSquare
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { CanonicalStudent } from '@/lib/telemetryEgress';

interface Student360AuditModalProps {
  student: CanonicalStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (student: CanonicalStudent) => void;
}

export const Student360AuditModal: React.FC<Student360AuditModalProps> = ({
  student,
  isOpen,
  onClose,
  onSendMessage
}) => {
  const [targetOverride, setTargetOverride] = useState<number>(student?.targetBand || 7.5);
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'weakpoints' | 'heatmap'>('timeline');

  if (!isOpen || !student) return null;

  // Mock historical exam attempts
  const examHistory = [
    {
      id: 'att-hist-1',
      module: 'reading',
      icon: BookOpen,
      testName: 'Cambridge 18 Academic — Test 2',
      date: 'Yesterday at 09:30 PM',
      score: 6.5,
      delta: '+0.5',
      summary: 'Strong on Passage 1 (13/13). Stumbled on Passage 3 summary completion & TFNG traps.',
      aiRaw: 'TR: 6.5 | CC: 7.0 | Raw Accuracy: 28/40 | TFNG Inversion detected on Q22-26.'
    },
    {
      id: 'att-hist-2',
      module: 'writing',
      icon: PenTool,
      testName: 'Task 2: AI Automation & Labor Market',
      date: '3 days ago',
      score: 6.0,
      delta: '0.0',
      summary: 'Task Response clear thesis, but paragraph 2 lacked lexical range (GRA: 6.0, LR: 5.5).',
      aiRaw: 'TR: 6.5 | CC: 6.5 | LR: 5.5 | GRA: 6.0 | Frequent redundancy with "important", "problem".'
    },
    {
      id: 'att-hist-3',
      module: 'speaking',
      icon: Mic,
      testName: 'Part 2 & 3: Architectural Heritage',
      date: '5 days ago',
      score: 7.0,
      delta: '+0.5',
      summary: 'Part 2 flow was steady. Minor hesitation pauses in Part 3 abstract questions.',
      aiRaw: 'Fluency: 7.0 | Pronunciation: 7.5 | Lexical: 7.0 | Grammar: 6.5 | WPM: 132.'
    },
    {
      id: 'att-hist-4',
      module: 'listening',
      icon: Headphones,
      testName: 'Cambridge 17 General — Section 4',
      date: '1 week ago',
      score: 7.5,
      delta: '+1.0',
      summary: 'Near flawless on numbers and names. Missed 2 questions in Section 3 fast dialogue.',
      aiRaw: 'Raw Score: 33/40 | Distractor Trap triggered on Question 34 (plural "s" dropped).'
    }
  ];

  // Weak Points & Recurring Traps
  const weakPoints = [
    {
      module: 'Reading',
      trap: 'True / False / Not Given Inversion',
      frequency: 'High (4 incidents in last 3 tests)',
      recommendation: 'Assign diagnostic drill on Distinguishing Absence of Evidence vs Contradiction.',
      severity: 'critical'
    },
    {
      module: 'Writing',
      trap: 'Lexical Repetition & Collocation Weakness',
      frequency: 'Moderate (Task 2 Band 5.5 in Lexical Resource)',
      recommendation: 'Trigger AI Essay Rewriter drill on academic synonym replacement.',
      severity: 'moderate'
    },
    {
      module: 'Speaking',
      trap: 'Hesitation Pauses in Abstract Synthesis',
      frequency: 'Low-Medium (Average 2.8s pause before Part 3 answers)',
      recommendation: 'Assign speed signposting drill using conversational discourse markers.',
      severity: 'moderate'
    }
  ];

  // Generate 30-day activity heatmap data
  const heatmapDays = Array.from({ length: 30 }).map((_, i) => {
    const minutes = Math.floor(Math.sin(i * 0.7) * 40 + 45);
    const intensity = minutes > 60 ? 'high' : minutes > 30 ? 'med' : minutes > 0 ? 'low' : 'none';
    return { day: i + 1, minutes: Math.max(0, minutes), intensity };
  });

  const handleOverrideTarget = async () => {
    setIsUpdatingTarget(true);
    try {
      await (supabase as any)
        .from('students')
        .update({ target_band: targetOverride })
        .eq('id', student.id);
    } catch (e) {
      // Local feedback
    } finally {
      setIsUpdatingTarget(false);
      setActionSuccessMsg(`Target Band updated to ${targetOverride.toFixed(1)} for ${student.name}`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  const handleAssignDiagnostic = () => {
    setActionSuccessMsg(`Diagnostic Drill dispatched to ${student.name}'s mission queue.`);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0F1115] border border-[#222732] max-w-4xl w-full rounded-2xl p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR / CLOSE */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222732]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 bg-rose-950/40 border border-rose-900/40 px-2 py-0.5 rounded">
              360° Diagnostic Audit
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Node ID: {student.id}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181C24] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOTIFICATION TOAST */}
        {actionSuccessMsg && (
          <div className="mt-3 py-2 px-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="overflow-y-auto pr-1 py-4 space-y-6 custom-scrollbar flex-1">
          {/* 1. STUDENT HEADER PROFILE */}
          <div className="bg-[#15181E] border border-[#222732] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={student.avatarUrl} 
                alt={student.name}
                className="w-16 h-16 rounded-full border-2 border-rose-500/40 object-cover shrink-0" 
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white tracking-tight">{student.name}</h2>
                  <span className="text-xs font-mono text-slate-400">@{student.handle}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                  <span className="text-rose-400 font-medium">🏢 {student.branch}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold inline-flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {student.streak}d Streak
                  </span>
                  <span>•</span>
                  <span className="text-slate-300 font-mono">
                    🪙 {student.aiCoins} Coins
                  </span>
                </div>
              </div>
            </div>

            {/* Target vs Estimated Band Indicators */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-[#0D0F12] border border-[#222732] px-3.5 py-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block">Estimated</span>
                <span className="text-xl font-bold font-mono text-rose-400">{student.currentBand.toFixed(1)}</span>
              </div>
              <div className="bg-[#0D0F12] border border-rose-900/30 px-3.5 py-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block">Target</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{student.targetBand.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center bg-[#15181E] p-1 rounded-xl border border-[#222732] gap-1">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'timeline' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exam Attempt Timeline
            </button>
            <button
              onClick={() => setActiveTab('weakpoints')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'weakpoints' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weak Point &amp; Trap Radar
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'heatmap' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30-Day Activity Heatmap
            </button>
          </div>

          {/* TAB 1: HISTORICAL EXAM ATTEMPT TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Recent Automated &amp; Proctored Evaluations</span>
                <span className="font-mono">4 Completed Sessions</span>
              </div>

              {examHistory.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={item.id}
                    className="bg-[#15181E] border border-[#222732] rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-lg bg-[#0D0F12] border border-[#222732] text-rose-400">
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.testName}</h4>
                          <span className="text-[11px] text-slate-500 font-mono">{item.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-emerald-400">{item.delta}</span>
                        <span className="text-sm font-bold font-mono text-white bg-[#0D0F12] border border-[#222732] px-2.5 py-1 rounded-lg">
                          Band {item.score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p>
                    <div className="bg-[#0D0F12] p-2 rounded-lg border border-[#222732]/70 text-[11px] font-mono text-slate-400">
                      <span className="text-rose-400 font-bold mr-1">AI Output:</span> {item.aiRaw}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: MODULE WEAK POINT & TRAP RADAR */}
          {activeTab === 'weakpoints' && (
            <div className="space-y-3">
              {weakPoints.map((wp, idx) => (
                <div 
                  key={idx}
                  className="bg-[#15181E] border border-[#222732] rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      {wp.module} Bottleneck
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-rose-950/60 text-rose-400 border border-rose-800/40 px-2 py-0.5 rounded-full">
                      {wp.frequency}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    {wp.trap}
                  </h4>
                  <p className="text-xs text-slate-300">{wp.recommendation}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ACTIVE STUDY HABIT HEATMAP */}
          {activeTab === 'heatmap' && (
            <div className="bg-[#15181E] border border-[#222732] rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-bold">30-Day Practice Habit Intensity</span>
                <span className="text-slate-400 font-mono">Avg: 48 mins/day</span>
              </div>
              <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
                {heatmapDays.map((d) => (
                  <div 
                    key={d.day}
                    title={`Day ${d.day}: ${d.minutes} mins practice`}
                    className={`h-7 rounded flex items-center justify-center text-[10px] font-mono transition-transform hover:scale-110 cursor-pointer ${
                      d.intensity === 'high' 
                        ? 'bg-rose-600 text-white font-bold' 
                        : d.intensity === 'med'
                        ? 'bg-rose-900/60 text-rose-200 border border-rose-800/50'
                        : 'bg-[#181C24] text-slate-500 border border-[#222732]'
                    }`}
                  >
                    {d.day}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#222732]">
                <span>Less active</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-[#181C24] border border-[#222732]" />
                  <span className="w-3 h-3 rounded bg-rose-900/60" />
                  <span className="w-3 h-3 rounded bg-rose-600" />
                </div>
                <span>Peak activity (60m+)</span>
              </div>
            </div>
          )}

          {/* 4. FACULTY ADMINISTRATIVE ACTIONS */}
          <div className="bg-[#15181E] border border-[#222732] rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Faculty Administrative Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Action 1: Send DM */}
              <button
                onClick={() => onSendMessage ? onSendMessage(student) : setActionSuccessMsg(`Direct message channel opened with ${student.name}`)}
                className="flex items-center justify-center gap-2 bg-[#181C24] hover:bg-[#222732] border border-[#222732] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-rose-400" />
                <span>Send Direct Message</span>
              </button>

              {/* Action 2: Assign Diagnostic Drill */}
              <button
                onClick={handleAssignDiagnostic}
                className="flex items-center justify-center gap-2 bg-[#181C24] hover:bg-[#222732] border border-[#222732] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Assign Diagnostic Drill</span>
              </button>

              {/* Action 3: Override Band Target */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="4.0"
                  max="9.0"
                  value={targetOverride}
                  onChange={(e) => setTargetOverride(parseFloat(e.target.value) || 7.0)}
                  className="w-16 bg-[#0D0F12] border border-[#222732] text-white text-xs font-bold text-center py-2 rounded-xl focus:outline-none focus:border-rose-600"
                />
                <button
                  onClick={handleOverrideTarget}
                  disabled={isUpdatingTarget}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-2 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Override Target
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student360AuditModal;

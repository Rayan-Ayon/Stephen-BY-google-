import React, { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Theme, AuthType } from '../../App';
import { Mic, PenTool, BookOpen, Headphones, ShieldAlert, Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface FeaturesShowcaseViewProps {
  theme?: Theme;
  toggleTheme?: () => void;
  userEmail?: string;
  onAuth?: (type: AuthType) => void;
  onStartLearning?: (view?: string) => void;
  onNavigate?: (path: string) => void;
  subPath?: string;
}

export const FeaturesShowcaseView: React.FC<FeaturesShowcaseViewProps> = ({
  theme = 'dark',
  toggleTheme = () => {},
  userEmail,
  onAuth = () => {},
  onStartLearning = () => {},
  onNavigate,
  subPath = '/features',
}) => {
  // Determine active tab from URL path
  const getInitialFeature = () => {
    if (subPath.includes('speaking')) return 'speaking';
    if (subPath.includes('writing')) return 'writing';
    if (subPath.includes('exam')) return 'exam';
    if (subPath.includes('dispute')) return 'dispute';
    return 'speaking';
  };

  const [activeFeature, setActiveFeature] = useState<string>(getInitialFeature);

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const featureTabs = [
    {
      id: 'speaking',
      name: 'Mohona AI Speaking Partner',
      icon: Mic,
      path: '/features/speaking-partner',
    },
    {
      id: 'writing',
      name: 'AI Writing Evaluator',
      icon: PenTool,
      path: '/features/writing-evaluator',
    },
    {
      id: 'exam',
      name: 'Reading & Listening Engine',
      icon: Headphones,
      path: '/features/exam-engine',
    },
    {
      id: 'dispute',
      name: 'Student Dispute Pipeline',
      icon: ShieldAlert,
      path: '/features/dispute-engine',
    },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-rose-500 selection:text-white transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0D0F12] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        userEmail={userEmail}
        onAuth={onAuth}
        onStartLearning={onStartLearning}
        onNavigate={navigateTo}
        isScrolled={true}
      />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold tracking-wide uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              IELTS AI Suite Architecture
            </div>
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              World-Class Examination Intelligence
            </h1>
            <p className={`text-base md:text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Engineered with full-duplex conversational voice, Cambridge rubric parsing, and transparent teacher arbitration.
            </p>
          </div>

          {/* Enterprise 4-Tab Single-Row Segmented Switcher */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl border max-w-5xl mx-auto mb-8 shadow-inner ${
            theme === 'dark'
              ? 'bg-[#0D0F12]/80 border-[#222732]'
              : 'bg-slate-200/70 border-slate-300'
          }`}>
            {featureTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFeature === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFeature(tab.id);
                    navigateTo(tab.path);
                  }}
                  className={`py-3 px-3 md:px-4 rounded-xl text-center text-xs md:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-[#15181E] text-white border border-rose-500/50 shadow-lg shadow-rose-950/20 font-semibold'
                        : 'bg-white text-slate-900 border border-rose-500 shadow-md font-semibold'
                      : theme === 'dark'
                        ? 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-[#15181E]/50 font-medium'
                        : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-300/40 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-500' : 'text-slate-400'}`} />
                  <span className="truncate">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Feature Showcase Container */}
          <div className={`rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border ${
            theme === 'dark'
              ? 'bg-[#15181E] border-[#222732]'
              : 'bg-white border-slate-200 shadow-lg'
          }`}>
            {/* 1. MOHONA SPEAKING PARTNER SHOWCASE */}
            {activeFeature === 'speaking' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold uppercase mb-4">
                    Full-Duplex Conversational Engine
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-snug">
                    Mohona: Your Dedicated IELTS Speaking Examiner
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                    Practice all 3 IELTS parts with an adaptive AI examiner. Mohona listens, responds naturally with human voice modulation, and evaluates fluency, lexical resource, and grammatical accuracy.
                  </p>
                  <ul className="space-y-3 mb-8 text-sm text-slate-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Natural turn-taking with hardware-level audio stream disarming</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Live 16kHz PCM audio streaming via high-speed WebSockets</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Detailed post-call Band 9 criteria diagnostic report</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      if (userEmail) onStartLearning('speaking_partner');
                      else onAuth('signup');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    Launch Speaking Simulator
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Interactive Waveform Card */}
                <div className="rounded-2xl bg-[#0D0F12] border border-[#222732] p-6 shadow-inner flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-rose-900/40 mb-4 ring-4 ring-rose-500/20">
                    M
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Mohona • Examiner Mode</h3>
                  <p className="text-xs text-emerald-400 font-semibold mb-6 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE 16kHz PCM CONNECTION READY
                  </p>
                  {/* Simulated Waveform Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-12 w-full max-w-xs mb-8">
                    {[30, 60, 45, 90, 75, 40, 85, 95, 60, 40, 80, 50, 70, 35].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#15181E] border border-[#222732] text-xs text-slate-300 text-left w-full">
                    <p className="font-semibold text-rose-400 mb-1">Examiner Prompt:</p>
                    <p className="italic">"Let's move on to Part 2. I'm going to give you a topic, and I'd like you to speak for one to two minutes..."</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. AI WRITING EVALUATOR SHOWCASE */}
            {activeFeature === 'writing' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold uppercase mb-4">
                    Band 9 Rubric Diagnostics
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-snug">
                    AI Writing Task 1 & 2 Scoring Engine
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                    Paste your essay or upload a photograph of your handwritten exam sheet. Our multi-agent vision pipeline transcribes your handwriting and scores against official IELTS descriptors.
                  </p>
                  <ul className="space-y-3 mb-8 text-sm text-slate-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Task Achievement, Coherence & Cohesion, Lexical, and Grammar breakdown</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Line-by-line grammar fixes & Band 9 sentence rewrites</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>OCR handwritten paper scanning support</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      if (userEmail) onStartLearning('writing_hub');
                      else onAuth('signup');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    Evaluate Your Essay Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Score Breakdown Preview */}
                <div className="rounded-2xl bg-[#0D0F12] border border-[#222732] p-6 shadow-inner space-y-4">
                  <div className="flex items-center justify-between border-b border-[#222732] pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Predicted Score</span>
                    <span className="text-2xl font-extrabold text-rose-400">Band 7.5</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#15181E] border border-[#222732]">
                      <div className="text-slate-400">Task Response</div>
                      <div className="text-lg font-bold text-white mt-1">8.0</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#15181E] border border-[#222732]">
                      <div className="text-slate-400">Coherence</div>
                      <div className="text-lg font-bold text-white mt-1">7.5</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#15181E] border border-[#222732]">
                      <div className="text-slate-400">Lexical Resource</div>
                      <div className="text-lg font-bold text-white mt-1">7.0</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#15181E] border border-[#222732]">
                      <div className="text-slate-400">Grammar</div>
                      <div className="text-lg font-bold text-white mt-1">7.5</div>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                    <span className="font-bold">Band 9 Rewrite Tip:</span> Upgrade informal transitions to academic discourse markers.
                  </div>
                </div>
              </div>
            )}

            {/* 3. EXAM ENGINE SHOWCASE */}
            {activeFeature === 'exam' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold uppercase mb-4">
                    Cambridge 7–21 Exam Engine
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-snug">
                    Authentic Reading & Listening Exam Experience
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                    Master True/False/Not Given, Heading Matching, and Section 4 academic lecture audio under strictly timed conditions identical to official computer-delivered IELTS tests.
                  </p>
                  <ul className="space-y-3 mb-8 text-sm text-slate-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Zero-latency audio player with synchronized waveform playback</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Instant answer verification & Cambridge official rationale guides</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Section-by-section band conversion calculators</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      if (userEmail) onStartLearning('reading_hub');
                      else onAuth('signup');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    Start Free Cambridge Mock
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="rounded-2xl bg-[#0D0F12] border border-[#222732] p-6 shadow-inner space-y-3 text-xs">
                  <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-[#222732]">
                    <span>Passage 1 • Academic Test</span>
                    <span className="text-rose-400 font-mono font-bold">⏱ 58:14</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#15181E] border border-[#222732] text-slate-300">
                    <p className="font-semibold text-white mb-1">Questions 1–6 (True / False / Not Given)</p>
                    <p className="text-[11px] text-slate-400">Do the following statements agree with the information given in Reading Passage 1?</p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between">
                    <span>Cambridge Test 18 — Full Set Active</span>
                    <span className="font-bold">40 Questions</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. DISPUTE ENGINE SHOWCASE */}
            {activeFeature === 'dispute' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 text-xs font-bold uppercase mb-4">
                    Fairness & Transparency
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-snug">
                    Student Dispute & Teacher Review Pipeline
                  </h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                    Never accept an unfair grade. If you believe the AI missed an essay nuance or speech argument, trigger our 1-click Dispute Pipeline for human teacher re-evaluation.
                  </p>
                  <ul className="space-y-3 mb-8 text-sm text-slate-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Dedicated teacher queue with score overrides</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Audio playback audits for Speaking Part 1–3 responses</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Complete audit trails and discrepancy alerts</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => {
                      if (userEmail) onStartLearning();
                      else onAuth('signup');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    View Dispute Governance
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="rounded-2xl bg-[#0D0F12] border border-[#222732] p-6 shadow-inner space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Dispute Ticket #DSP-409</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">Teacher Review Pending</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#15181E] border border-[#222732] text-xs space-y-1">
                    <p className="text-slate-400">Candidate Argument:</p>
                    <p className="text-white italic">"My Task 2 response included three balanced paragraphs addressing both views, which meets Band 8 criteria."</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#15181E] border border-[#222732] text-xs flex justify-between items-center">
                    <span className="text-slate-400">AI Initial Score: <strong className="text-white">6.5</strong></span>
                    <span className="text-emerald-400 font-bold">Teacher Adjusted: Band 7.5</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
};

export default FeaturesShowcaseView;

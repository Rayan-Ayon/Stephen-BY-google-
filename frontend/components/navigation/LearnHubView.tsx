import React, { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Theme, AuthType } from '../../App';
import {
  BookOpen,
  PenTool,
  Mic,
  Headphones,
  Award,
  FileCheck2,
  Video,
  Sparkles,
  ArrowRight,
  Download,
  ExternalLink,
  BookMarked,
  CheckCircle2,
} from 'lucide-react';

interface LearnHubViewProps {
  theme?: Theme;
  toggleTheme?: () => void;
  userEmail?: string;
  onAuth?: (type: AuthType) => void;
  onStartLearning?: (view?: string) => void;
  onNavigate?: (path: string) => void;
  subPath?: string;
}

export const LearnHubView: React.FC<LearnHubViewProps> = ({
  theme = 'dark',
  toggleTheme = () => {},
  userEmail,
  onAuth = () => {},
  onStartLearning = () => {},
  onNavigate,
  subPath = '/learn',
}) => {
  const getInitialTab = () => {
    if (subPath.includes('writing')) return 'writing';
    if (subPath.includes('speaking')) return 'speaking';
    if (subPath.includes('reading')) return 'reading';
    if (subPath.includes('listening')) return 'listening';
    if (subPath.includes('model-essays')) return 'essays';
    if (subPath.includes('cambridge-guides')) return 'guides';
    if (subPath.includes('grammar')) return 'grammar';
    return 'writing';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const navCategories = [
    {
      group: 'SKILL MODULES',
      tabs: [
        { id: 'writing', name: 'Writing Task 1 & 2 Blueprint', icon: PenTool, path: '/learn/writing' },
        { id: 'speaking', name: 'Speaking Band 8+ Vocabulary', icon: Mic, path: '/learn/speaking' },
        { id: 'reading', name: 'Reading TFNG & Trap Mastery', icon: BookOpen, path: '/learn/reading' },
        { id: 'listening', name: 'Listening Audio Strategies', icon: Headphones, path: '/learn/listening' },
      ],
    },
    {
      group: 'ACADEMIC RESOURCES',
      tabs: [
        { id: 'essays', name: 'Band 9 Model Essay Vault', icon: Award, path: '/learn/model-essays' },
        { id: 'guides', name: 'Cambridge Solution Key Guides', icon: FileCheck2, path: '/learn/cambridge-guides' },
      ],
    },
    {
      group: 'AI STUDY TOOLS',
      tabs: [
        { id: 'video', name: 'Interactive YouTube AI Player', icon: Video, path: '/content-library' },
        { id: 'grammar', name: 'Lexicon & Grammar Booster', icon: Sparkles, path: '/learn/grammar' },
      ],
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
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold tracking-wide uppercase mb-4">
              <BookMarked className="w-3.5 h-3.5" />
              IELTS Dynasty Academic Hub
            </div>
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Curriculum & Methodological Mastery
            </h1>
            <p className={`text-base md:text-lg ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Structured frameworks, verified Band 9 sample repositories, and cognitive trap decoders designed by senior Cambridge examiners.
            </p>
          </div>

          {/* Main Grid: Sidebar Navigator + Content Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar Navigator */}
            <div className="lg:col-span-4 space-y-6">
              <div className={`p-4 rounded-2xl border shadow-xl space-y-6 ${
                theme === 'dark' ? 'bg-[#15181E] border-[#222732]' : 'bg-white border-slate-200'
              }`}>
                {navCategories.map((cat) => (
                  <div key={cat.group} className="space-y-2">
                    <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500 px-3">
                      {cat.group}
                    </div>
                    <div className="space-y-1">
                      {cat.tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isCurrent = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              if (tab.path === '/content-library') {
                                navigateTo('/content-library');
                              } else {
                                setActiveTab(tab.id);
                                navigateTo(tab.path);
                              }
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-rose-500/10 text-white border border-rose-500/30 font-semibold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A1F28] border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${isCurrent ? 'text-rose-400' : 'text-slate-500'}`} />
                              <span>{tab.name}</span>
                            </div>
                            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isCurrent ? 'text-rose-400 translate-x-0.5' : 'text-transparent'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#15181E] to-[#1D222B] border border-rose-500/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                <h4 className="text-base font-bold text-white mb-2">Practice With Real Mocks</h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Put theoretical strategies into practice with authentic Cambridge timed mock tests and AI evaluations.
                </p>
                <button
                  onClick={() => {
                    if (userEmail) {
                      onStartLearning();
                    } else {
                      onAuth('signup');
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Launch Practice Exam
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-8">
              {/* Tab 1: Writing Task 1 & 2 Blueprint */}
              {activeTab === 'writing' && (
                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-8 animate-fadeIn">
                  <div className="flex items-start justify-between border-b border-[#222732] pb-6">
                    <div>
                      <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">Skill Module 01</span>
                      <h2 className="text-2xl font-bold text-white mt-1">Writing Task 1 & Task 2 Blueprint</h2>
                      <p className="text-sm text-slate-400 mt-1">
                        Band 9 structural frameworks for Academic Reports and Opinion, Discussion, & Double-Question Essays.
                      </p>
                    </div>
                    <button
                      onClick={() => navigateTo('/features/writing-evaluator')}
                      className="px-4 py-2 rounded-xl bg-[#1A1F28] hover:bg-[#222732] text-xs font-semibold text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1.5"
                    >
                      Try AI Grader
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-3">
                      <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Task 1: Academic Report</div>
                      <h3 className="text-base font-bold text-white">4-Paragraph Data Architecture</h3>
                      <ul className="text-xs text-slate-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Introduction:</strong> Paraphrase the prompt using passive voice and synonyms.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Overview:</strong> State 2 major trends without citing numerical data.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Body 1:</strong> Group first cluster of data with precise comparative markers.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Body 2:</strong> Detail exceptions, peaks, and troughs with exact numerical ranges.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-3">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Task 2: Discursive Essay</div>
                      <h3 className="text-base font-bold text-white">The P.E.E.L Argument Paradigm</h3>
                      <ul className="text-xs text-slate-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Point:</strong> Explicit topic sentence answering the prompt directly.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Explanation:</strong> Causality chain detailing why this phenomenon occurs.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Evidence:</strong> Empirical citation, case study, or contextual real-world data.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Link:</strong> Synthesize back to your overarching thesis statement.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      Examiner Lexical Cohesion Cheat-Sheet
                    </h3>
                    <p className="text-xs text-slate-400">
                      Eliminate simplistic linkers like "Firstly", "Secondly", and "In conclusion". Use academic transitional phrases:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                      <div className="p-2.5 rounded-lg bg-[#15181E] border border-[#222732] text-center">
                        <div className="text-xs font-semibold text-white">Contrast</div>
                        <div className="text-[11px] text-slate-400 mt-1">Notwithstanding this, / In stark contrast,</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#15181E] border border-[#222732] text-center">
                        <div className="text-xs font-semibold text-white">Causation</div>
                        <div className="text-[11px] text-slate-400 mt-1">Stemming from / Precipitating a surge</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#15181E] border border-[#222732] text-center">
                        <div className="text-xs font-semibold text-white">Condition</div>
                        <div className="text-[11px] text-slate-400 mt-1">Contingent upon / Provided that</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#15181E] border border-[#222732] text-center">
                        <div className="text-xs font-semibold text-white">Synthesis</div>
                        <div className="text-[11px] text-slate-400 mt-1">On balance, / Ultimately,</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Speaking Band 8+ Vocabulary */}
              {activeTab === 'speaking' && (
                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-8 animate-fadeIn">
                  <div className="flex items-start justify-between border-b border-[#222732] pb-6">
                    <div>
                      <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">Skill Module 02</span>
                      <h2 className="text-2xl font-bold text-white mt-1">Speaking Band 8+ Collocations & Idioms</h2>
                      <p className="text-sm text-slate-400 mt-1">
                        High-frequency lexical phrases that unlock the Lexical Resource Band 8 and 9 descriptor bands.
                      </p>
                    </div>
                    <button
                      onClick={() => navigateTo('/features/speaking-partner')}
                      className="px-4 py-2 rounded-xl bg-[#1A1F28] hover:bg-[#222732] text-xs font-semibold text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1.5"
                    >
                      Talk to Mohona AI
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        topic: 'Technology & Automation',
                        collocation: 'Ubiquitous integration / Paradigm shift',
                        example: '"The ubiquitous integration of AI in diagnostic medicine has precipitated a paradigm shift."',
                        band: 'Band 8.5+',
                      },
                      {
                        topic: 'Urbanization & Housing',
                        collocation: 'Urban sprawl / Skyrocketing property valuations',
                        example: '"Unchecked urban sprawl has exerted tremendous pressure on municipal infrastructure."',
                        band: 'Band 8.5+',
                      },
                      {
                        topic: 'Personal Reflection & Memory',
                        collocation: 'Vividly recollect / Etched in my memory',
                        example: '"I can vividly recollect the moment; the sensory details remain firmly etched in my memory."',
                        band: 'Band 9.0',
                      },
                      {
                        topic: 'Society & Economics',
                        collocation: 'Socioeconomic disparity / Widening chasm',
                        example: '"Policymakers must address the widening chasm between affluent metropolitan enclaves and rural areas."',
                        band: 'Band 9.0',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">{item.topic}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {item.band}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-white">{item.collocation}</div>
                        <div className="text-xs text-slate-300 italic">{item.example}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Reading TFNG & Trap Mastery */}
              {activeTab === 'reading' && (
                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-8 animate-fadeIn">
                  <div className="border-b border-[#222732] pb-6">
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">Skill Module 03</span>
                    <h2 className="text-2xl font-bold text-white mt-1">Reading True / False / Not Given Mastery</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      The mathematical logic behind Cambridge qualifying statements and the "Not Given" illusion.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-emerald-500/30 space-y-2">
                      <div className="text-xs font-bold text-emerald-400 uppercase">TRUE / YES</div>
                      <div className="text-sm font-bold text-white">Direct Semantic Paraphrase</div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        The passage statement agrees 100% with the claim, including degrees of certainty (likely vs. definite).
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-rose-500/30 space-y-2">
                      <div className="text-xs font-bold text-rose-400 uppercase">FALSE / NO</div>
                      <div className="text-sm font-bold text-white">Direct Logical Contradiction</div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        The passage explicitly disproves the statement, or asserts the opposite outcome or condition.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-amber-500/30 space-y-2">
                      <div className="text-xs font-bold text-amber-400 uppercase">NOT GIVEN</div>
                      <div className="text-sm font-bold text-white">The Omission Boundary</div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        The passage mentions the subject, but makes NO verifiable claim about the specific relationship queried.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-3">
                    <h3 className="text-sm font-bold text-white">The 3 Qualifier Trap Words</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-[#15181E] border border-[#222732]">
                        <span className="font-bold text-rose-400">All / Every vs. Some:</span>
                        <p className="text-slate-400 mt-1">If the text says "most participants" and the prompt says "all participants", the answer is FALSE.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#15181E] border border-[#222732]">
                        <span className="font-bold text-rose-400">Must vs. May:</span>
                        <p className="text-slate-400 mt-1">Obligation vs. possibility. Conflating necessity with likelihood creates false affirmations.</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#15181E] border border-[#222732]">
                        <span className="font-bold text-rose-400">Past vs. Present:</span>
                        <p className="text-slate-400 mt-1">Check temporal tense markers: "historically was" vs "remains currently".</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Listening Audio Strategies */}
              {activeTab === 'listening' && (
                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-8 animate-fadeIn">
                  <div className="border-b border-[#222732] pb-6">
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">Skill Module 04</span>
                    <h2 className="text-2xl font-bold text-white mt-1">Listening Audio Distractor Decoders</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Techniques to catch self-corrections, signpost words, and plural form acoustic nuances.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                      <div className="text-xs font-bold text-rose-400 uppercase">Strategy 1: The Self-Correction Pivot</div>
                      <h3 className="text-sm font-bold text-white">"Actually, let me double-check that..."</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Speakers in Sections 1 & 2 deliberately state an initial number or date, and then immediately amend it.
                        Never record the first spoken token without listening through the subordinate clause.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                      <div className="text-xs font-bold text-rose-400 uppercase">Strategy 2: Section 3 Colloquial Flow</div>
                      <h3 className="text-sm font-bold text-white">Tutor-Student Agreement Matrices</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        When two students discuss an assignment, one often suggests an approach while the other respectfully dissents.
                        The answer corresponds ONLY to actions mutually agreed upon.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                      <div className="text-xs font-bold text-rose-400 uppercase">Strategy 3: Section 4 Monologue Cadence</div>
                      <h3 className="text-sm font-bold text-white">Signpost Transitions</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Track academic markers: <em>"Turning our attention to...", "An unexpected byproduct was...", "Prior to this breakthrough..."</em>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Band 9 Model Essay Vault */}
              {activeTab === 'essays' && (
                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-8 animate-fadeIn">
                  <div className="border-b border-[#222732] pb-6">
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">Academic Resource</span>
                    <h2 className="text-2xl font-bold text-white mt-1">Band 9 Model Essay Vault</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Fully annotated official essays scored at Band 9 with examiner criterion breakdown.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Cambridge 18 Academic • Test 2 Task 2</span>
                        <span className="text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          Scored: Band 9.0
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        "Some people believe that university students should pay the full cost of their education, while others believe that the government should establish tuition-free higher education. Discuss both views and give your opinion."
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed pl-4 border-l-2 border-rose-500 space-y-2">
                        <p>
                          The allocation of higher education funding represents a perennial dilemma for contemporary governments. While proponents of personal liability argue that individual graduates derive substantial private financial rewards, I contend that tuition-free university education serves as an indispensable public good that yields collective socio-economic prosperity.
                        </p>
                        <p>
                          On the one hand, advocates of self-funded tuition maintain that public subsidization places an unfair fiscal burden on taxpayers who may not possess tertiary credentials...
                        </p>
                      </div>
                      <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[11px]">
                        <div className="p-2 rounded bg-[#15181E] border border-[#222732] text-slate-300">
                          <strong className="text-white block">TR</strong> Band 9.0
                        </div>
                        <div className="p-2 rounded bg-[#15181E] border border-[#222732] text-slate-300">
                          <strong className="text-white block">CC</strong> Band 9.0
                        </div>
                        <div className="p-2 rounded bg-[#15181E] border border-[#222732] text-slate-300">
                          <strong className="text-white block">LR</strong> Band 9.0
                        </div>
                        <div className="p-2 rounded bg-[#15181E] border border-[#222732] text-slate-300">
                          <strong className="text-white block">GRA</strong> Band 9.0
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: Cambridge Solution Key Guides */}
              {activeTab === 'guides' && (
                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-8 animate-fadeIn">
                  <div className="border-b border-[#222732] pb-6">
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">Academic Resource</span>
                    <h2 className="text-2xl font-bold text-white mt-1">Cambridge Solution Key Guides</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Comprehensive rationale breakdowns for Cambridge 15, 16, 17, 18, 19, 20 & 21 mock test suites.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Cambridge 19 Academic', 'Cambridge 18 Academic', 'Cambridge 17 Academic', 'Cambridge 16 Academic'].map(
                      (title, idx) => (
                        <div key={idx} className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-white">{title}</div>
                            <div className="text-xs text-slate-400 mt-1">Tests 1–4 Explanatory Keys & Audio Scripts</div>
                          </div>
                          <button
                            onClick={() => {
                              if (userEmail) {
                                onStartLearning();
                              } else {
                                onAuth('signup');
                              }
                            }}
                            className="p-2.5 rounded-lg bg-[#1A1F28] hover:bg-[#222732] text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                            title="Open In Exam Engine"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Tab 7: Lexicon & Grammar Booster */}
              {activeTab === 'grammar' && (
                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-8 animate-fadeIn">
                  <div className="border-b border-[#222732] pb-6">
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">AI Study Tool</span>
                    <h2 className="text-2xl font-bold text-white mt-1">Lexicon & Grammar Booster</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Complex grammatical structures (Inversion, Mixed Conditionals, Cleft Sentences) required for GRA Band 8+.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">Structure 1: Negative Inversion</span>
                      <div className="text-sm font-bold text-white">Rarely / Under no circumstances / Not only... but also</div>
                      <p className="text-xs text-slate-300">
                        <em>"Seldom do municipal authorities allocate sufficient fiscal resources to tertiary wastewater treatment."</em>
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">Structure 2: Cleft Sentences for Emphasis</span>
                      <div className="text-sm font-bold text-white">It is [X] that / What is urgently required is...</div>
                      <p className="text-xs text-slate-300">
                        <em>"What is urgently required is comprehensive legislative reform rather than superficial awareness campaigns."</em>
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">Structure 3: Mixed Conditionals</span>
                      <div className="text-sm font-bold text-white">Past condition with present outcome</div>
                      <p className="text-xs text-slate-300">
                        <em>"Had international treaties established enforceable quotas in 1990, oceanic fish stocks would be significantly more resilient today."</em>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LearnHubView;

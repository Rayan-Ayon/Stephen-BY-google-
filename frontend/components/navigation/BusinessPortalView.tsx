import React, { useState } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Theme, AuthType } from '../../App';
import {
  Building2,
  Users,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
  Clock,
  Layers,
  BarChart3,
  Headphones,
  Mail,
  Phone,
  Sparkles,
} from 'lucide-react';

interface BusinessPortalViewProps {
  theme?: Theme;
  toggleTheme?: () => void;
  userEmail?: string;
  onAuth?: (type: AuthType) => void;
  onStartLearning?: (view?: string) => void;
  onNavigate?: (path: string) => void;
  subPath?: string;
}

export const BusinessPortalView: React.FC<BusinessPortalViewProps> = ({
  theme = 'dark',
  toggleTheme = () => {},
  userEmail,
  onAuth = () => {},
  onStartLearning = () => {},
  onNavigate,
  subPath = '/business',
}) => {
  const getInitialTab = () => {
    if (subPath.includes('contact')) return 'contact';
    if (subPath.includes('tutors')) return 'tutors';
    if (subPath.includes('institutes')) return 'institutes';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    studentCount: '20-50',
    message: '',
  });

  const navigateTo = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const tabs = [
    { id: 'overview', name: 'Executive Overview', icon: Building2, path: '/business/overview' },
    { id: 'tutors', name: 'For Online IELTS Tutors', icon: GraduationCap, path: '/business/tutors' },
    { id: 'institutes', name: 'Coaching Institutes & Academies', icon: Users, path: '/business/institutes' },
    { id: 'contact', name: 'Contact Enterprise Sales', icon: Mail, path: '/business/contact' },
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
              <Building2 className="w-3.5 h-3.5" />
              IELTS Dynasty Enterprise Solutions
            </div>
            <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              AI Infrastructure for High-Volume IELTS Training
            </h1>
            <p className={`text-base md:text-lg ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Empowering independent coaches, academy chains, and universities with automated Band 9 grading, Cambridge mock licensing, and cohort transparency.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    navigateTo(tab.path);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                      : 'bg-[#15181E] border border-[#222732] text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Executive Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-12 animate-fadeIn">
              {/* Metric Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Grading Turnaround', value: '< 15 Sec', desc: 'From candidate submission to rubric' },
                  { label: 'Teacher Hours Saved', value: '75%', desc: 'Automating repetitive diagnostic scoring' },
                  { label: 'Scoring Consistency', value: '99.4%', desc: 'Calibrated to official British Council / IDP' },
                  { label: 'Batch Scalability', value: '1,000+', desc: 'Simultaneous mock sessions per node' },
                ].map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl">
                    <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                    <div className="text-sm font-bold text-rose-400 mb-1">{stat.label}</div>
                    <div className="text-xs text-slate-400">{stat.desc}</div>
                  </div>
                ))}
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Full-Stack AI Co-Pilot</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Arm your teaching faculty with automated band predictions, sentence-by-sentence rewrites, and acoustic fluency graphs before 1-on-1 consultations.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-[#222732]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      TR, CC, LR, GRA automated split
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Real-time Cambridge 7–21 engine
                    </li>
                  </ul>
                </div>

                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Batch & Cohort Manager</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Organize students into 20-seat cohorts, track weak areas dynamically, and export official institutional audit transcripts in PDF format.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-[#222732]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Seat allocation dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Dispute arbitration pipeline
                    </li>
                  </ul>
                </div>

                <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">White-Label & Custom SLA</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Deliver the experience under your coaching brand with dedicated API clusters, guaranteed uptime SLAs, and FERPA-compliant privacy security.
                  </p>
                  <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-[#222732]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Custom subdomain branding
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Dedicated account manager
                    </li>
                  </ul>
                </div>
              </div>

              {/* Callout to Portal Login */}
              <div className="p-8 rounded-2xl bg-gradient-to-r from-[#15181E] via-[#1A1F28] to-[#15181E] border border-[#222732] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div>
                  <h3 className="text-xl font-bold text-white">Ready to deploy institutional access?</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Log in directly to your coaching command center or speak with an enterprise specialist.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => navigateTo('/institution/login')}
                    className="px-5 py-2.5 rounded-xl bg-[#15181E] border border-rose-500/40 text-slate-200 hover:text-white hover:border-rose-500 text-xs font-bold transition-all cursor-pointer"
                  >
                    Institution Portal
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('contact');
                      navigateTo('/business/contact');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/20 cursor-pointer"
                  >
                    Request Demo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: For Online IELTS Tutors */}
          {activeTab === 'tutors' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Independent Coaches</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Transform from Manual Grader to High-Tier Mentor</h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Stop spending 45 minutes manually marking each essay. Let IELTS Dynasty AI generate precision criterion diagnostics in seconds so you can focus on high-value 1-on-1 strategy sessions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                    <Clock className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">Save 15+ Hours Weekly</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Instant Band 9 rewriting and Task 1 overview feedback pre-populates your feedback notes.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                    <Headphones className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">Audio Dispute Audits</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Review timestamped audio waveforms from your students' Mohona Speaking sessions and add personal voice notes.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-2">
                    <BarChart3 className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">Student Progress Portfolios</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Share comprehensive PDF report cards with parents and students showing exact trajectory toward Band 7.5+.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#222732] flex items-center justify-between">
                  <span className="text-xs text-slate-400">Coach packages starting from $49/mo for up to 15 active students.</span>
                  <button
                    onClick={() => navigateTo('/institution/login?type=teacher')}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20 flex items-center gap-2 cursor-pointer"
                  >
                    Log In as Teacher
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: For Coaching Institutes & Academies */}
          {activeTab === 'institutes' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-xl">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Academy Infrastructure</span>
                  <h2 className="text-2xl font-bold text-white mt-1">Multi-Campus IELTS Command Operations</h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Manage 20-student batches across physical branches (e.g., Farmgate, Uttara, Dhanmondi) with centralized seat allocation, proctored mock timing, and unified faculty oversight.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-3">
                    <div className="text-xs font-bold text-rose-400 uppercase">Feature 01</div>
                    <h3 className="text-base font-bold text-white">Batch Node Statistics & Leaderboards</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Monitor average band scores per batch in real-time. Identify lagging students in Reading TFNG or Speaking Part 3 before test day.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-[#0D0F12] border border-[#222732] space-y-3">
                    <div className="text-xs font-bold text-rose-400 uppercase">Feature 02</div>
                    <h3 className="text-base font-bold text-white">Dispute & Re-Evaluation Arbitration</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      When a student contests an AI score, institute senior trainers can re-evaluate the essay or audio directly through a streamlined arbitration portal.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#222732] flex items-center justify-between">
                  <span className="text-xs text-slate-400">Institutional licenses include unlimited Cambridge mocks and custom domain integration.</span>
                  <button
                    onClick={() => navigateTo('/institution/login?type=coaching_center')}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20 flex items-center gap-2 cursor-pointer"
                  >
                    Enter Coaching Center Portal
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Contact Sales Form */}
          {activeTab === 'contact' && (
            <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-[#15181E] border border-[#222732] shadow-2xl animate-fadeIn">
              <div className="text-center mb-8">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Enterprise Engagement</span>
                <h2 className="text-2xl font-bold text-white mt-1">Request an Institutional Demo</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Our enterprise solutions architect will schedule a 20-minute tailored platform walkthrough.
                </p>
              </div>

              {formSubmitted ? (
                <div className="p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Inquiry Received</h3>
                  <p className="text-xs text-slate-300">
                    Thank you. An IELTS Dynasty enterprise specialist will reach out within 4 business hours to confirm your tailored demo.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 px-4 py-2 rounded-lg bg-[#15181E] border border-[#222732] text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Prof. Tariq Rahman"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F12] border border-[#222732] text-white text-xs placeholder-slate-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tariq@academy.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F12] border border-[#222732] text-white text-xs placeholder-slate-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Organization / Academy</label>
                      <input
                        type="text"
                        required
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder="e.g. British Academy Dhaka"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F12] border border-[#222732] text-white text-xs placeholder-slate-600 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Active Student Count</label>
                      <select
                        value={formData.studentCount}
                        onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F12] border border-[#222732] text-white text-xs focus:outline-none focus:border-rose-500"
                      >
                        <option value="1-20">1 – 20 students (Independent Coach)</option>
                        <option value="20-50">20 – 50 students (Single Center)</option>
                        <option value="50-200">50 – 200 students (Multi-Batch Academy)</option>
                        <option value="200+">200+ students (Enterprise / University)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Requirements & Goals</label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your testing volume, current grading bottlenecks, or white-label requirements..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D0F12] border border-[#222732] text-white text-xs placeholder-slate-600 focus:outline-none focus:border-rose-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Request for Proposal
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessPortalView;

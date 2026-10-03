import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
  CheckCircle2,
  Lock,
  Mail,
  Building2,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { validateTenantLogin } from '@/utils/mockDb';
import { IeltsDynastyEmblem } from '../Navbar';

interface InstitutionLoginViewProps {
  onSuccess?: () => void;
  onSwitchToStudent?: () => void;
  onExit?: () => void;
}

export const InstitutionLoginView: React.FC<InstitutionLoginViewProps> = ({
  onSuccess,
  onSwitchToStudent,
  onExit,
}) => {
  const queryType = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('type') : null;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const getReturnRoute = () => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('stephen_auth_return_route');
      if (saved && saved !== '/institution/login' && !saved.startsWith('/institution/login')) {
        return saved;
      }
    }
    return '/';
  };

  const handleBack = () => {
    if (onExit) {
      onExit();
    } else {
      const target = getReturnRoute();
      window.history.pushState({}, '', target);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleSwitchToStudent = () => {
    if (onSwitchToStudent) {
      onSwitchToStudent();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleGoogleSSO = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/org-space',
        },
      });
      if (error) {
        toast.error(`Google Workspace SSO: ${error.message}`);
      }
    } catch (err: any) {
      toast.error('Google SSO initiation failed. Please use institutional email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanPasskey = passkey.trim();

    try {
      // 1. Check local tenant database validation
      const isTenantValid = validateTenantLogin(cleanEmail, cleanPassword, cleanPasskey);

      if (isTenantValid) {
        localStorage.setItem(
          'stephen_active_tenant_session',
          JSON.stringify({
            email: cleanEmail,
            passkey: cleanPasskey || 'ENTERPRISE-AUTH',
            role: 'org_manager',
            remember: rememberMe,
            loginTime: new Date().toISOString(),
          })
        );
        toast.success('Enterprise Faculty Session Authenticated');
        if (onSuccess) {
          onSuccess();
        } else {
          window.history.pushState({}, '', '/org-space');
          window.location.reload();
        }
        return;
      }

      // 2. Fallback to Supabase Auth for enterprise faculty
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data.user) {
        localStorage.setItem(
          'stephen_active_tenant_session',
          JSON.stringify({
            email: cleanEmail,
            passkey: cleanPasskey || 'SUPABASE-AUTH',
            role: 'org_manager',
            userId: data.user.id,
            remember: rememberMe,
            loginTime: new Date().toISOString(),
          })
        );
        toast.success(`Welcome Faculty Member: ${cleanEmail}`);
        if (onSuccess) {
          onSuccess();
        } else {
          window.history.pushState({}, '', '/org-space');
          window.location.reload();
        }
        return;
      }

      // 3. Demo fallback if user enters administrative email
      if (cleanEmail.includes('admin') || cleanEmail.includes('institution') || cleanEmail.includes('.edu')) {
        localStorage.setItem(
          'stephen_active_tenant_session',
          JSON.stringify({
            email: cleanEmail,
            passkey: 'STPH-ENTERPRISE-2026',
            role: 'org_manager',
            remember: rememberMe,
            loginTime: new Date().toISOString(),
          })
        );
        toast.success('Enterprise Sandbox Access Granted');
        if (onSuccess) {
          onSuccess();
        } else {
          window.history.pushState({}, '', '/org-space');
          window.location.reload();
        }
        return;
      }

      setAuthError('Invalid credentials or unregistered faculty domain. Contact your campus administrator.');
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@du.ac.bd');
    setPassword('IELTS-Dynasty-2026');
    setPasskey('STPH-DHAKA-2026-X9');
    toast.info('Loaded verified Dhaka University enterprise credentials.');
  };

  return (
    <div className="w-screen h-screen max-h-screen overflow-hidden bg-[#0D0F12] text-slate-100 flex flex-col justify-between p-4 md:p-6 select-text font-sans">
      {/* ── Top Header Navigation Bar with Context-Aware Return Route ── */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-2 shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className="bg-[#15181E] border border-[#222732] hover:border-slate-500 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleSwitchToStudent}
          className="bg-[#15181E] border border-[#222732] hover:border-slate-500 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-rose-500 group-hover:rotate-180 transition-transform duration-300" />
          <span>Switch to Personal Student Account</span>
        </button>
      </div>

      {/* ── 50/50 Split Grid Container (Zero-Scroll Viewport) ── */}
      <div className="flex-1 w-full max-w-6xl mx-auto rounded-2xl md:rounded-3xl border border-[#222732] bg-[#0D0F12] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-0">
        
        {/* ════════════ LEFT PANEL: BRANDING & ENTERPRISE VALUE PROP (50%) ════════════ */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between relative bg-gradient-to-br from-rose-950/25 via-[#0D0F12] to-[#0D0F12] border-b md:border-b-0 md:border-r border-[#222732] overflow-hidden">
          {/* Subtle Ambient Crimson Glow */}
          <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

          {/* Top Logo & Headline */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-[#15181E] border border-[#222732] flex items-center justify-center p-1.5 shadow-inner">
                <IeltsDynastyEmblem className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-lg font-extrabold tracking-tight text-white font-sans">
                  IELTS <span className="text-rose-500">Dynasty</span>
                </span>
                <span className="ml-2 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  Enterprise
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2 max-w-md">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {queryType === 'teacher' ? (
                  <>
                    Teacher & Coach <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-amber-300">
                      Grading OS
                    </span>
                  </>
                ) : queryType === 'coaching_center' ? (
                  <>
                    Coaching Center <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-amber-300">
                      Batch Operations
                    </span>
                  </>
                ) : (
                  <>
                    B2B Coaching OS <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-amber-300">
                      Command Center
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                {queryType === 'teacher'
                  ? 'Independent coach command center & grading OS. Review student submissions and automate rubric scoring.'
                  : queryType === 'coaching_center'
                  ? 'Farmgate and branch-wide 20-student batch management and real-time student dispute arbitration.'
                  : 'Empowering IELTS institutes with real-time AI evaluation pipelines and 20-student cohort telemetry.'}
              </p>
            </div>

            {/* Key Feature Highlights */}
            <div className="mt-5 space-y-2.5 max-w-md">
              {[
                {
                  title: 'Unified Split-Screen Evaluation Studio',
                  desc: 'Side-by-side essay grading, criteria band rubrics, and automated AI scoring.',
                },
                {
                  title: 'Live Mohona AI Voice Partner Audits',
                  desc: 'Real-time candidate speech analysis and fluency telemetry.',
                },
                {
                  title: 'Student Dispute & Voice Note Re-grading Queue',
                  desc: 'One-click teacher overrides with native mic voice recordings.',
                },
                {
                  title: 'Institute Knowledge Base Grounding',
                  desc: 'Ground AI evaluators in your campus syllabus and rubric weights.',
                },
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 group">
                  <div className="w-5 h-5 rounded-md bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 tracking-tight">
                      {feat.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left Footer Info */}
          <div className="relative z-10 pt-4 border-t border-[#222732]/70 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
            <span>Enterprise Security • 256-bit TLS</span>
            <button
              onClick={fillDemoCredentials}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4 cursor-pointer"
            >
              Fill Demo Faculty Passkey
            </button>
          </div>
        </div>

        {/* ════════════ RIGHT PANEL: FACULTY AUTHENTICATION DOCK (50%) ════════════ */}
        <div className="w-full md:w-1/2 bg-[#15181E] border-t md:border-t-0 md:border-l border-[#222732] p-6 md:p-8 flex flex-col justify-center overflow-hidden">
          {/* Form Content Area */}
          <div className="max-w-sm w-full mx-auto space-y-3.5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Institution & Coaching Portal
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Log in to access cohort telemetry and evaluation studio.
              </p>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {authError}
              </div>
            )}

            {/* Google Workspace SSO Button */}
            <button
              type="button"
              onClick={handleGoogleSSO}
              disabled={loading}
              className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 text-slate-200 hover:text-white font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Continue with Google Workspace</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="w-full border-t border-[#222732]" />
              <span className="bg-[#15181E] px-2 text-[9px] uppercase font-bold text-slate-500 tracking-wider absolute">
                or continue with email
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="director@coachingcenter.edu"
                    className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl pl-9 pr-3 py-2 text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Faculty Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info('Please contact your institutional tenant administrator or check your campus deployment email for credential recovery.');
                    }}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-medium transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl pl-9 pr-9 py-2 text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Enterprise Passkey <span className="text-[10px] text-slate-500 font-normal">(Optional for Sandbox)</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="STPH-DHAKA-2026-X9"
                    className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl pl-9 pr-3 py-2 text-xs md:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-[#0D0F12] border-[#222732] text-rose-600 focus:ring-rose-500"
                  />
                  <span>Keep me logged in for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs md:text-sm shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Log In to B2B Command Center</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Minimal Footer ── */}
      <div className="w-full text-center text-[10px] text-slate-500 py-0.5 shrink-0">
        © {new Date().getFullYear()} IELTS Dynasty Inc. All rights reserved. Enterprise AI Evaluation Engine v2.4.0.
      </div>
    </div>
  );
};

export default InstitutionLoginView;

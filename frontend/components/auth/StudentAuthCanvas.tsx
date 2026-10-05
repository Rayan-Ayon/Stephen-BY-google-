import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Sparkles,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  AlertCircle,
  Target,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase, getAuthErrorMessage } from '../../supabaseClient';
import { IeltsDynastyEmblem } from '../Navbar';

export interface StudentAuthCanvasProps {
  initialMode?: 'login' | 'signup' | 'forgot';
  onSuccess?: (email: string) => void;
  onExit?: () => void;
  onSwitchToInstitution?: () => void;
}

export const StudentAuthCanvas: React.FC<StudentAuthCanvasProps> = ({
  initialMode = 'login',
  onSuccess,
  onExit,
  onSwitchToInstitution,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetBand, setTargetBand] = useState<'6.5' | '7.0' | '7.5' | '8.0+'>('7.5');
  const [examTrack, setExamTrack] = useState<'academic' | 'general'>('academic');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetSentSuccess, setResetSentSuccess] = useState(false);

  const handleBackHome = () => {
    if (onExit) {
      onExit();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleSwitchToB2B = () => {
    if (onSwitchToInstitution) {
      onSwitchToInstitution();
    } else {
      window.history.pushState({}, '', '/institution/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleGoogleOAuth = async () => {
    setLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(getAuthErrorMessage(err) || 'Google authentication failed. Please try with email.');
      toast.error('Google Sign-In failed.');
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

    try {
      if (mode === 'forgot') {
        const redirectUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/login?recovery=true`
          : 'https://stephen-ai.com/login?recovery=true';

        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: redirectUrl,
        });
        if (resetErr) throw resetErr;

        setResetSentSuccess(true);
        toast.success('Password reset email dispatched.');
        return;
      }

      if (mode === 'signup') {
        if (!cleanEmail || !cleanPassword) {
          throw new Error('Please fill in all required credentials.');
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
          options: {
            data: {
              full_name: fullName.trim() || undefined,
              target_band: targetBand,
              exam_track: examTrack,
              role: 'student',
            },
          },
        });

        if (signUpError) throw signUpError;

        if (!signUpData.session) {
          toast.info('Account created! Please check your email to verify your address.');
          setMode('login');
          return;
        }

        // Store candidate preferences locally for instant hydration
        if (typeof window !== 'undefined') {
          localStorage.setItem('ielts_candidate_profile', JSON.stringify({
            fullName: fullName.trim(),
            targetBand,
            examTrack,
            email: cleanEmail,
          }));
        }

        toast.success(`Welcome to IELTS Dynasty, ${fullName.trim() || 'Candidate'}!`);
        if (onSuccess) {
          onSuccess(cleanEmail);
        } else {
          window.history.pushState({}, '', '/');
          window.location.reload();
        }
        return;
      }

      // Login Mode
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (signInError) throw signInError;

      toast.success('Candidate login successful.');
      if (onSuccess) {
        onSuccess(cleanEmail);
      } else {
        window.history.pushState({}, '', '/');
        window.location.reload();
      }
    } catch (err: any) {
      const msg = getAuthErrorMessage(err) || err.message || 'Authentication failed. Please verify credentials.';
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen max-h-screen overflow-hidden bg-[#0D0F12] text-slate-100 flex flex-col justify-between p-4 md:p-6 select-text font-sans">
      {/* ── Top Utility Navigation Bar ── */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-2 shrink-0">
        <button
          type="button"
          onClick={handleBackHome}
          className="bg-[#15181E] border border-[#222732] hover:border-slate-500 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={handleSwitchToB2B}
          className="bg-[#15181E] border border-[#222732] hover:border-slate-500 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-rose-500 group-hover:rotate-180 transition-transform duration-300" />
          <span>Switch to Institutional B2B Login</span>
        </button>
      </div>

      {/* ── 50/50 Split Canvas Container (Zero-Scroll Viewport) ── */}
      <div className="flex-1 w-full max-w-6xl mx-auto rounded-2xl md:rounded-3xl border border-[#222732] bg-[#0D0F12] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-0">
        
        {/* ════════════ LEFT HERO PANEL: BRAND & CANDIDATE METRICS (50%) ════════════ */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between relative bg-gradient-to-br from-rose-950/25 via-[#0D0F12] to-[#0D0F12] border-b md:border-b-0 md:border-r border-[#222732] overflow-hidden">
          {/* Ambient Crimson Glow */}
          <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

          {/* Top Logo & Headline */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#15181E] border border-[#222732] flex items-center justify-center p-1.5 shadow-inner">
                <IeltsDynastyEmblem className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-lg font-extrabold tracking-tight text-white font-sans">
                  IELTS <span className="text-rose-500">Dynasty</span>
                </span>
                <span className="ml-2 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  Candidate Portal
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-1.5 max-w-md">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Master IELTS Band 8.0+ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-amber-300">
                  with Real-Time AI Telemetry
                </span>
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accelerate your test preparation with instant feedback across Reading, Listening, Writing, and Speaking modules.
              </p>
            </div>

            {/* Candidate Telemetry & Highlights */}
            <div className="mt-4 space-y-2.5 max-w-md">
              {[
                {
                  icon: '🎯',
                  title: '0.5 Band Score Improvement in 14 Days',
                  desc: 'Average candidate jump measured across 4,200+ authenticated mock submissions.',
                },
                {
                  icon: '🗣️',
                  title: 'Live Mohona AI Voice Partner Audits',
                  desc: 'Real-time conversational speech analysis, fluency telemetry, and lexical coaching.',
                },
                {
                  icon: '📊',
                  title: 'Real-Time Diagnostic Performance Matrix',
                  desc: 'Pinpoints exact question trap vulnerabilities, time leaks, and 50/50 split weaknesses.',
                },
                {
                  icon: '⚡',
                  title: 'Cambridge Verified Answer Engine',
                  desc: '100% authentic scoring rubrics calibrated to Cambridge 7–21 Academic and GT standards.',
                },
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 group">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {feat.icon}
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
          <div className="relative z-10 pt-4 border-t border-[#222732]/70 flex items-center justify-between text-[11px] text-slate-500">
            <span>Enterprise Security • 256-bit TLS Encryption</span>
            <span className="text-rose-400/90 font-medium font-mono text-[10px]">v2.6.4</span>
          </div>
        </div>

        {/* ════════════ RIGHT AUTH FORM: STUDENT PORTAL ACCESS (50%) ════════════ */}
        <div className="w-full md:w-1/2 bg-[#15181E] border-t md:border-t-0 md:border-l border-[#222732] p-6 md:p-8 flex flex-col justify-center overflow-y-auto custom-scrollbar">
          <div className="max-w-sm w-full mx-auto space-y-3.5 my-auto">
            
            {/* Header Titles */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {mode === 'forgot'
                  ? 'Reset Candidate Password'
                  : mode === 'signup'
                  ? 'Create Candidate Account'
                  : 'Candidate Student Portal'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'forgot'
                  ? 'Enter your candidate email to receive secure recovery instructions.'
                  : mode === 'signup'
                  ? 'Sign up to access AI evaluation canvas & practice tests.'
                  : 'Log in to access AI evaluation canvas & practice tests.'}
              </p>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Forgot Password Success State */}
            {mode === 'forgot' && resetSentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Reset Link Dispatched</h4>
                <p className="text-xs text-slate-300">
                  Check your inbox for reset instructions. We have sent recovery details to <span className="font-semibold text-white">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetSentSuccess(false);
                    setMode('login');
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Return to Candidate Login
                </button>
              </div>
            ) : (
              <>
                {/* ── Google SSO Button (Login & Sign Up only) ── */}
                {mode !== 'forgot' && (
                  <>
                    <button
                      type="button"
                      onClick={handleGoogleOAuth}
                      disabled={loading}
                      className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 text-slate-200 hover:text-white font-semibold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center my-1.5">
                      <div className="w-full border-t border-[#222732]" />
                      <span className="bg-[#15181E] px-2 text-[9px] uppercase font-bold text-slate-500 tracking-wider absolute">
                        or continue with email
                      </span>
                    </div>
                  </>
                )}

                {/* ── Main Form ── */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Full Name (Sign Up only) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Rayan Ayon"
                          required
                          className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 focus:border-rose-500 rounded-xl px-9 py-2 text-xs text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Candidate Email Address */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Candidate Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        required
                        className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 focus:border-rose-500 rounded-xl px-9 py-2 text-xs text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Sign Up Mode Extras: Target Band & Module Track */}
                  {mode === 'signup' && (
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                          <Target className="w-3 h-3 text-rose-400" />
                          <span>Target Band</span>
                        </label>
                        <select
                          value={targetBand}
                          onChange={(e) => setTargetBand(e.target.value as any)}
                          className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 focus:border-rose-500 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none transition-all cursor-pointer font-semibold"
                        >
                          <option value="6.5" className="bg-[#0D0F12]">Band 6.5</option>
                          <option value="7.0" className="bg-[#0D0F12]">Band 7.0</option>
                          <option value="7.5" className="bg-[#0D0F12]">Band 7.5</option>
                          <option value="8.0+" className="bg-[#0D0F12]">Band 8.0+</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-blue-400" />
                          <span>Module Track</span>
                        </label>
                        <select
                          value={examTrack}
                          onChange={(e) => setExamTrack(e.target.value as any)}
                          className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 focus:border-rose-500 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none transition-all cursor-pointer font-semibold"
                        >
                          <option value="academic" className="bg-[#0D0F12]">🔵 Academic</option>
                          <option value="general" className="bg-[#0D0F12]">🟣 General Training</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Password (Login & Sign Up only) */}
                  {mode !== 'forgot' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Password
                        </label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthError('');
                              setMode('forgot');
                            }}
                            className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer transition-colors"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          required
                          className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 focus:border-rose-500 rounded-xl px-9 py-2 text-xs text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Remember Me (Login Mode only) */}
                  {mode === 'login' && (
                    <div className="flex items-center pt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded bg-[#0D0F12] border-[#222732] text-rose-600 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-400">
                          Keep me logged in for 30 days
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Submit CTA Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-600 via-rose-600 to-crimson-600 hover:from-rose-500 hover:to-crimson-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-950/40 active:scale-[0.98] cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === 'forgot'
                            ? 'Send Password Reset Link'
                            : mode === 'signup'
                            ? 'Create Candidate Account'
                            : 'Log In to Candidate Portal'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Single-click mode toggles at bottom */}
                <div className="pt-2 text-center text-xs text-slate-400">
                  {mode === 'login' ? (
                    <div>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthError('');
                          setMode('signup');
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        Sign Up
                      </button>
                    </div>
                  ) : mode === 'signup' ? (
                    <div>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthError('');
                          setMode('login');
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        Log In
                      </button>
                    </div>
                  ) : (
                    <div>
                      Remember your password?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthError('');
                          setMode('login');
                        }}
                        className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        Log In
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAuthCanvas;


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleIcon, EyeIcon, EyeSlashIcon, XIcon, CheckCircleIcon, ChevronLeftIcon, BarChartIcon, CalendarIcon, LightningIcon, TrendingUpIcon } from './icons';
import { AuthType } from '../App';
import { supabase, getAuthErrorMessage } from '../supabaseClient';

interface AuthOverlayProps {
  type: 'login' | 'signup';
  setType: (type: AuthType) => void;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const carouselItems = [
  { title: 'Actionable insights', desc: 'Get the analytics you need to make informed decisions.', icon: BarChartIcon },
  { title: 'Smart study plans', desc: 'AI-powered daily missions tailored to your target band.', icon: CalendarIcon },
  { title: 'Real-time feedback', desc: 'Instant writing and speaking evaluation with detailed rubrics.', icon: LightningIcon },
  { title: 'Progress tracking', desc: 'Monitor your consistency and improvement across all skills.', icon: TrendingUpIcon },
];

const AuthOverlay: React.FC<AuthOverlayProps> = ({ type, setType, onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password view
  const [view, setView] = useState<'auth' | 'forgot' | 'forgot_email' | 'forgot_sent'>('auth');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Carousel
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (view !== 'forgot') return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, [view]);

  const isLogin = type === 'login';

  // Password validation
  const passwordChecks = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasSpecialOrNumber: /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };
  const isPasswordValid = passwordChecks.minLength && passwordChecks.hasUppercase && passwordChecks.hasSpecialOrNumber;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async () => {
    if (!email || !password || loading) return;
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (!signUpData.session) {
          setError('Check your email to confirm your account before signing in.');
          return;
        }
      }
      onSuccess(email);
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isPasswordValid || !passwordsMatch) return;
    setResetLoading(true);
    setResetError('');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setResetSuccess(true);
    } catch (err: any) {
      setResetError(getAuthErrorMessage(err));
    } finally {
      setResetLoading(false);
    }
  };

  const handleSendResetEmail = async () => {
    if (!email) return;
    setResetLoading(true);
    setResetError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setView('forgot_sent');
    } catch (err: any) {
      setResetError(getAuthErrorMessage(err));
    } finally {
      setResetLoading(false);
    }
  };

  // Forgot password — email entry (unauthenticated)
  if (view === 'forgot_email') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          className="relative w-full max-w-[480px] bg-white dark:bg-[#121212] rounded-[32px] p-10 md:p-12 shadow-2xl flex flex-col items-center text-center border dark:border-[#333]"
        >
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>

          <div className="mb-6 dark:text-white">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M45 20V80M35 25V75M55 35V65" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Forgot password?</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">
            Enter your email and we'll send you a link to reset your password.
          </p>

          <div className="w-full space-y-4 mb-4">
            {resetError && <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 text-left">{resetError}</div>}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-[#333] focus:border-gray-400 dark:focus:border-gray-500 focus:ring-0 outline-none text-gray-900 dark:text-white transition-all bg-gray-50/50 dark:bg-surfaceAlt"
            />
          </div>

          <button
            onClick={handleSendResetEmail}
            className={`w-full py-4 rounded-2xl font-bold text-white text-lg mb-8 transition-colors ${
              email && !resetLoading ? 'bg-neutral-900 dark:bg-white dark:text-black' : 'bg-neutral-400 dark:bg-gray-700 cursor-not-allowed'
            }`}
            disabled={!email || resetLoading}
          >
            {resetLoading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <button onClick={() => setView('auth')} className="text-sm text-gray-500 hover:text-black dark:hover:text-gray-300 font-medium transition-colors flex items-center gap-1">
            <ChevronLeftIcon className="w-4 h-4" /> Back to login
          </button>
        </motion.div>
      </div>
    );
  }

  // Forgot password — sent confirmation
  if (view === 'forgot_sent') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          className="relative w-full max-w-[480px] bg-white dark:bg-[#121212] rounded-[32px] p-10 md:p-12 shadow-2xl flex flex-col items-center text-center border dark:border-[#333]"
        >
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-8 h-8 text-emerald-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">
            We've sent a password reset link to <span className="font-semibold text-gray-700 dark:text-gray-300">{email}</span>
          </p>

          <button
            onClick={() => { setView('auth'); setResetSuccess(false); setNewPassword(''); setConfirmPassword(''); }}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-neutral-900 dark:bg-white dark:text-black transition-colors mb-4"
          >
            Back to Login
          </button>

          <button
            onClick={handleSendResetEmail}
            className="text-sm text-gray-500 hover:text-black dark:hover:text-gray-300 font-medium transition-colors"
          >
            Didn't receive the email? <span className="font-bold">Resend</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Forgot password — set new password (2-column layout)
  if (view === 'forgot') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full h-full max-w-[1100px] max-h-[700px] bg-white dark:bg-[#121212] rounded-[32px] shadow-2xl flex overflow-hidden border dark:border-[#333]"
        >
          <button onClick={onClose} className="absolute top-6 right-6 z-10 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>

          {/* Left Panel — Form */}
          <div className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
            <div className="w-full max-w-md">
              <button
                onClick={() => setView('auth')}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black dark:hover:text-gray-300 font-medium transition-colors mb-8"
              >
                <ChevronLeftIcon className="w-4 h-4" /> Back to login
              </button>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Set a new password</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                Create a strong password to keep your account safe and secure.
              </p>

              {resetSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password updated!</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your password has been changed successfully.</p>
                  <button
                    onClick={() => { setView('auth'); setResetSuccess(false); setNewPassword(''); setConfirmPassword(''); }}
                    className="w-full py-4 rounded-2xl font-bold text-white text-lg bg-neutral-900 dark:bg-white dark:text-black transition-colors"
                  >
                    Login with new password
                  </button>
                </div>
              ) : (
                <>
                  {resetError && <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 text-left mb-4">{resetError}</div>}

                  {/* New Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-[#333] focus:border-gray-400 dark:focus:border-gray-500 focus:ring-0 outline-none text-gray-900 dark:text-white transition-all bg-gray-50/50 dark:bg-surfaceAlt"
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                      >
                        {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-[#333] focus:border-gray-400 dark:focus:border-gray-500 focus:ring-0 outline-none text-gray-900 dark:text-white transition-all bg-gray-50/50 dark:bg-surfaceAlt"
                      />
                      <button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && !passwordsMatch && (
                      <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
                    )}
                  </div>

                  {/* Validation Checklist */}
                  <div className="space-y-2 mb-6">
                    {[
                      { label: 'Minimum 8 characters', valid: passwordChecks.minLength },
                      { label: 'At least one uppercase letter', valid: passwordChecks.hasUppercase },
                      { label: 'At least one special character or number', valid: passwordChecks.hasSpecialOrNumber },
                    ].map((check, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <CheckCircleIcon className={`w-4 h-4 shrink-0 transition-colors ${check.valid ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600'}`} />
                        <span className={`text-sm transition-colors ${check.valid ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400'}`}>{check.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleResetPassword}
                    className={`w-full py-4 rounded-2xl font-bold text-white text-lg mb-6 transition-colors ${
                      isPasswordValid && passwordsMatch && !resetLoading
                        ? 'bg-neutral-900 dark:bg-white dark:text-black'
                        : 'bg-neutral-400 dark:bg-gray-700 cursor-not-allowed'
                    }`}
                    disabled={!isPasswordValid || !passwordsMatch || resetLoading}
                  >
                    {resetLoading ? 'Updating...' : 'Create New Password'}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => setView('auth')}
                      className="text-sm text-gray-500 hover:text-black dark:hover:text-gray-300 font-medium transition-colors"
                    >
                      Remembered it? <span className="font-bold">Login</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Panel — Carousel */}
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-12">
            <div className="w-full max-w-sm">
              {/* Progress Bars */}
              <div className="flex gap-2 mb-10">
                {carouselItems.map((_, i) => (
                  <div key={i} className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-white transition-all duration-300 ${i === carouselIndex ? 'w-full' : 'w-0'}`}
                    />
                  </div>
                ))}
              </div>

              {/* Carousel Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                    {React.createElement(carouselItems[carouselIndex].icon, { className: 'w-8 h-8 text-white' })}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">{carouselItems[carouselIndex].title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">{carouselItems[carouselIndex].desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Default auth view (login/signup)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        className="relative w-full max-w-[480px] bg-white dark:bg-[#121212] rounded-[32px] p-10 md:p-12 shadow-2xl flex flex-col items-center text-center border dark:border-[#333]"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="mb-6 dark:text-white">
           <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M45 20V80M35 25V75M55 35V65" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
           </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">
          {isLogin ? "Let's continue your learning journey." : "Let's get you learning journey started."}
        </p>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center py-4 px-6 border border-gray-200 dark:border-[#333] rounded-2xl bg-white dark:bg-surfaceAlt hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors mb-8 shadow-sm disabled:opacity-50"
        >
          <GoogleIcon className="w-5 h-5 mr-3" />
          <span className="text-gray-700 dark:text-gray-200 font-semibold text-base">
            {isLogin ? 'Continue with Google' : 'Sign in with Google'}
          </span>
        </button>

        {/* Divider */}
        <div className="w-full flex items-center mb-8">
          <div className="flex-1 h-px bg-gray-200 dark:bg-[#333]"></div>
          <span className="px-4 text-xs text-gray-400 font-medium bg-white dark:bg-[#121212]">or continue with</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-[#333]"></div>
        </div>

        {/* Form */}
        <div className="w-full space-y-4 mb-4">
          {error && <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 text-left">{error}</div>}
          <div className="text-left">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-[#333] focus:border-gray-400 dark:focus:border-gray-500 focus:ring-0 outline-none text-gray-900 dark:text-white transition-all bg-gray-50/50 dark:bg-surfaceAlt"
            />
          </div>
          <div className="relative text-left">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-[#333] focus:border-gray-400 dark:focus:border-gray-500 focus:ring-0 outline-none text-gray-900 dark:text-white transition-all bg-gray-50/50 dark:bg-surfaceAlt"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isLogin && (
          <div className="w-full text-right mb-8">
            <button
              onClick={() => setView('forgot')}
              className="text-xs text-gray-500 hover:text-black dark:hover:text-gray-300 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className={`w-full py-4 rounded-2xl font-bold text-white text-lg mb-8 transition-colors ${
            email && password && !loading ? 'bg-neutral-900 dark:bg-white dark:text-black' : 'bg-neutral-400 dark:bg-gray-700 cursor-not-allowed'
          }`}
          disabled={!email || !password || loading}
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        <div className="text-sm text-gray-500 font-medium">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setType('signup')} className="text-black dark:text-white hover:underline font-bold">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setType('login')} className="text-black dark:text-white hover:underline font-bold">
                Login
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthOverlay;

import React, { useState } from 'react';
import { Mail, ArrowRight, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, getAuthErrorMessage } from '../../supabaseClient';

export interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSwitchToLogin?: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please provide your registered candidate email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/login?recovery=true`
        : 'https://stephen-ai.com/login?recovery=true';

      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: redirectUrl,
      });

      if (resetErr) throw resetErr;

      setSentSuccess(true);
    } catch (err: any) {
      setError(getAuthErrorMessage(err) || 'Failed to dispatch reset email. Please verify your address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#15181E] border border-[#222732] p-6 md:p-8 shadow-2xl text-slate-100 font-sans z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#222732] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {sentSuccess ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              Recovery Link Dispatched
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              We have dispatched password reset instructions to <span className="text-slate-200 font-semibold">{email}</span>. Click the link inside to set a new password.
            </p>
            <button
              onClick={() => {
                onClose();
                if (onSwitchToLogin) onSwitchToLogin();
              }}
              className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              Return to Candidate Login
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                Self-Service Recovery
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              Reset Candidate Password
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Enter your registered student email address. We will dispatch a secure single-use recovery link.
            </p>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Candidate Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="student@example.com"
                    className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 focus:border-rose-500 rounded-xl px-10 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Password Reset Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onSwitchToLogin) onSwitchToLogin();
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Remember your password? <span className="text-rose-400 font-semibold underline underline-offset-4">Log In</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { supabase, getAuthErrorMessage } from '../../supabaseClient';

export interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordChecks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumberOrSpecial: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid =
    passwordChecks.minLength && passwordChecks.hasUppercase && passwordChecks.hasNumberOrSpecial;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Password must satisfy all complexity requirements.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) throw updateErr;

      setSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err) || 'Failed to update password. Session may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-[#15181E] border border-[#222732] p-6 text-center max-w-sm mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Password Successfully Updated</h3>
        <p className="text-xs text-slate-400 mb-4">
          Your candidate account password has been reset. You can now access your dashboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <h3 className="text-lg font-bold text-white tracking-tight">Set New Password</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Choose a secure password for your candidate account.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••••••"
            className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 focus:border-rose-500 rounded-xl px-10 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••••••"
            className="w-full bg-[#0D0F12] border border-[#222732] hover:border-slate-600 focus:border-rose-500 rounded-xl px-10 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
          />
        </div>
      </div>

      <div className="space-y-1 py-1">
        <div className={`text-[10px] flex items-center gap-1.5 ${passwordChecks.minLength ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span>•</span> At least 8 characters
        </div>
        <div className={`text-[10px] flex items-center gap-1.5 ${passwordChecks.hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span>•</span> At least 1 uppercase letter
        </div>
        <div className={`text-[10px] flex items-center gap-1.5 ${passwordChecks.hasNumberOrSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span>•</span> At least 1 number or special symbol
        </div>
      </div>

      <div className="flex gap-2.5 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-[#0D0F12] border border-[#222732] text-slate-300 hover:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !isPasswordValid || !passwordsMatch}
          className="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Update Password</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;

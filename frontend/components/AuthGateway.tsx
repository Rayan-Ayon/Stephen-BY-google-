import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface AuthGatewayProps {
  onAuthSuccess: (userEmail: string, spaceCode: string) => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [spaceCode, setSpaceCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        alert('Account created! Logging you in...');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      if (email) onAuthSuccess(email, spaceCode);
    } catch (err: any) {
      setError(err.message || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4 text-white font-sans">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-[#1A1A1A] p-8 border border-neutral-800 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Stephen</h1>
          <p className="text-sm text-neutral-400">{isSignUp ? 'Create your institutional account' : 'Sign in to access your space'}</p>
        </div>
        {error && <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl bg-[#262626] border border-neutral-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors" placeholder="ayon@institute.edu" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl bg-[#262626] border border-neutral-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors" placeholder="••••••••" />
          </div>
          {!isSignUp && (
            <div className="pt-2 border-t border-neutral-800/60">
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5">Space Invite Code (Optional)</label>
              <input type="text" value={spaceCode} onChange={(e) => setSpaceCode(e.target.value.toUpperCase())} className="w-full rounded-xl bg-[#262626] border border-amber-500/30 px-4 py-3 text-sm text-amber-200 placeholder-amber-700/50 focus:outline-none focus:border-amber-500 transition-colors tracking-widest uppercase" placeholder="DU-404-VIBE" />
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full font-medium rounded-xl bg-white text-black py-3 text-sm hover:bg-neutral-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-6">
            {loading ? 'Processing...' : isSignUp ? 'Register Account' : 'Enter Workspace'}
          </button>
        </form>
        <div className="text-center pt-2">
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 transition-colors">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

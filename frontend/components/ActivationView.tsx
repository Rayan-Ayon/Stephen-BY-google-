import React, { useState } from 'react';
import { activateTenant, getTenantByPasskey } from '../utils/mockDb';

interface ActivationViewProps {
  onComplete: () => void;
}

const ActivationView: React.FC<ActivationViewProps> = ({ onComplete }) => {
  const params = new URLSearchParams(window.location.search);
  const passkey = params.get('passkey') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const tenant = getTenantByPasskey(passkey);

  const handleActivate = () => {
    setError('');

    if (!tenant) {
      setError('Invalid or expired passkey.');
      return;
    }

    if (tenant.status === 'active') {
      setError('This workspace is already activated. Please log in.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const ok = activateTenant(passkey, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => onComplete(), 1500);
    } else {
      setError('Activation failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] p-4">
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
            Initialize Enterprise Account
          </h1>
          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
            Complete your institution's workspace setup to enable
            <br />admin console access for your organization.
          </p>
        </div>

        <div className="bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3 mb-6">
          <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-1">
            Activating Workspace
          </p>
          <p className="text-sm font-mono text-[#FF5500] font-bold tracking-wider">
            {passkey || 'No passkey provided'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-1.5">
              Set Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="············"
              className="w-full bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-white
                         placeholder-neutral-600 focus:outline-none focus:border-[#FF5500]/50 focus:ring-1 focus:ring-[#FF5500]/20
                         transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="············"
              className="w-full bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-white
                         placeholder-neutral-600 focus:outline-none focus:border-[#FF5500]/50 focus:ring-1 focus:ring-[#FF5500]/20
                         transition-all duration-200"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          {success && (
            <p className="text-xs text-green-400 text-center">
              Workspace activated! Redirecting...
            </p>
          )}

          <button
            onClick={handleActivate}
            disabled={success}
            className="w-full py-3 rounded-xl text-sm font-bold bg-[#FF5500] text-black
                       hover:bg-[#FF6A1A] transition-all duration-200
                       shadow-[0_0_20px_-6px_rgba(255,85,0,0.4)]
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Secure & Activate Workspace
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[#1A1A1A] text-center">
          <p className="text-[10px] text-neutral-600">
            Already activated?{' '}
            <button
              onClick={onComplete}
              className="text-[#FF5500] hover:underline font-semibold"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivationView;

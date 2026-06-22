import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, BuildingLibraryIcon } from './icons';
import { validateTenantLogin } from '../utils/mockDb';

interface OrgAuthModalProps {
  onClose: () => void;
  onAccess: () => void;
}

const OrgAuthModal: React.FC<OrgAuthModalProps> = ({ onClose, onAccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passkey, setPasskey] = useState('');
  const [authError, setAuthError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (validateTenantLogin(email, password, passkey)) {
      onAccess();
    } else {
      setAuthError('Invalid credentials or workspace not activated.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-[#333333] rounded-2xl w-full max-w-sm p-7 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF5500]/10 flex items-center justify-center">
              <BuildingLibraryIcon className="w-5 h-5 text-[#FF5500]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
                Institution Console
              </h2>
              <p className="text-[10px] text-neutral-500 uppercase tracking-[0.12em] font-semibold">
                Enterprise Access
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors p-1">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-1.5">
              Corporate Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@institution.edu"
              className="w-full bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-white
                         placeholder-neutral-600 focus:outline-none focus:border-[#FF5500]/50 focus:ring-1 focus:ring-[#FF5500]/20
                         transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="············"
              className="w-full bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-white
                         placeholder-neutral-600 focus:outline-none focus:border-[#FF5500]/50 focus:ring-1 focus:ring-[#FF5500]/20
                         transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-neutral-500 font-semibold mb-1.5">
              Organization Passkey
            </label>
            <input
              type="text"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="STPH-DHAKA-2026-X9"
              className="w-full bg-[#000000] border border-[#1A1A1A] rounded-xl px-4 py-3 text-sm text-white
                         placeholder-neutral-600 font-mono tracking-wider
                         focus:outline-none focus:border-[#FF5500]/50 focus:ring-1 focus:ring-[#FF5500]/20
                         transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            className="w-full py-3 rounded-xl text-sm font-bold bg-[#FF5500] text-black
                       hover:bg-[#FF6A1A] transition-all duration-200
                       shadow-[0_0_20px_-6px_rgba(255,85,0,0.4)]"
          >
            Access Console
          </button>
        </form>

        {authError && (
          <p className="text-xs text-red-400 text-center mt-4">{authError}</p>
        )}

        <p className="text-[10px] text-neutral-600 text-center mt-4 leading-relaxed">
          Authorized institution administrators only.
          <br />
          Unauthorized access is prohibited.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default OrgAuthModal;

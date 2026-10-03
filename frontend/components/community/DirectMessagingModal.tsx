import React, { useEffect } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { ProfileUser, CohortMember } from '@/types/community';
import { DirectMessagingPanel } from './DirectMessagingPanel';
import { obsidianTokens } from './obsidianTokens';

interface DirectMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  targetUser?: ProfileUser | null;
  onClearTargetUser?: () => void;
  onSelectMemberForProfile: (member: ProfileUser) => void;
}

export const DirectMessagingModal: React.FC<DirectMessagingModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  targetUser,
  onClearTargetUser,
  onSelectMemberForProfile,
}) => {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Centered 2-Panel Modal Box */}
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#15181E] border border-[#222732] rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#222732] bg-[#181C24]">
          <div className="flex items-center gap-2.5">
            <span className={`p-1.5 rounded-lg flex items-center justify-center ${obsidianTokens.badgeRed}`}>
              <Mail className="w-4 h-4 text-rose-400" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>1-on-1 Direct Messaging &amp; Mentor Office Hours</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/40">
                  Encrypted
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Direct peer consultations and private feedback from Dr. Stephen Vance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#15181E] transition-colors cursor-pointer"
            title="Close DMs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2-Panel DM Component */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <DirectMessagingPanel
            userEmail={userEmail}
            targetUser={targetUser}
            onClearTargetUser={onClearTargetUser}
            onSelectMemberForProfile={onSelectMemberForProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default DirectMessagingModal;

import React, { useEffect } from 'react';
import { X, MessageSquare, Users, Sparkles } from 'lucide-react';
import { CohortMetadata, CohortMember, ProfileUser } from '@/types/community';
import { CohortBatchChat } from './CohortBatchChat';
import { obsidianTokens } from './obsidianTokens';

interface CohortChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cohort: CohortMetadata;
  userEmail?: string;
  onSelectMemberForProfile: (member: ProfileUser | CohortMember) => void;
  onStartDirectMessage: (member: ProfileUser | CohortMember) => void;
}

export const CohortChatDrawer: React.FC<CohortChatDrawerProps> = ({
  isOpen,
  onClose,
  cohort,
  userEmail,
  onSelectMemberForProfile,
  onStartDirectMessage
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

  // Lock body scroll when drawer is open
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Right sliding drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl md:max-w-2xl bg-[#0F1115] border-l border-[#222732] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#222732] bg-[#15181E]/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className={`p-2 rounded-xl flex items-center justify-center ${obsidianTokens.badgeAmber}`}>
                <MessageSquare className="w-4 h-4 text-amber-400" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Batch #08 Live Cohort Chat
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${obsidianTokens.badgeGreen}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    34 Online
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time 50-student peer channel • Mentor verified
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#181C24] transition-colors cursor-pointer"
              title="Close chat drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Live Cohort Group Chat Stream */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <CohortBatchChat
              cohort={cohort}
              userEmail={userEmail}
              onSelectMemberForProfile={onSelectMemberForProfile}
              onStartDirectMessage={onStartDirectMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortChatDrawer;

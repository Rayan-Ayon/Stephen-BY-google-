import React, { useState } from 'react';
import { CohortMember } from '@/types/community';
import { X, Flame, Award, CheckCircle, Clock, Send, Trophy, Target, ShieldAlert } from 'lucide-react';
import { Student360AuditModal } from '../enterprise/org/Student360AuditModal';
import { CANONICAL_20_STUDENTS, CanonicalStudent } from '@/lib/telemetryEgress';

interface MemberProfileModalProps {
  member: CohortMember | null;
  onClose: () => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  member,
  onClose
}) => {
  const [showAudit, setShowAudit] = useState(false);
  if (!member) return null;

  const canonicalMatch: CanonicalStudent = CANONICAL_20_STUDENTS.find(
    s => s.name.toLowerCase() === member.userName.toLowerCase() ||
         s.handle.toLowerCase() === member.userId.toLowerCase() ||
         member.userName.toLowerCase().includes(s.name.toLowerCase())
  ) || {
    id: member.id,
    name: member.userName,
    handle: member.userId.replace(/^u-/, '').replace(/\s+/g, '_'),
    email: `${member.userName.toLowerCase().replace(/\s+/g, '.')}@farmgate.edu`,
    avatarUrl: member.avatarUrl,
    branch: 'Farmgate Branch',
    streak: member.streakCount,
    targetBand: member.targetScore || 7.5,
    currentBand: member.latestMockBand || 6.5,
    aiCoins: 480,
    status: 'Active',
    dailyStatus: member.dailyStatus,
    activeMinutesToday: 45,
    submissionCount: 16
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-gray-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-bold text-gray-900">Cohort Member Profile</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-5 text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-black shadow-md mx-auto">
              {member.userName.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full ring-2 ring-white flex items-center gap-0.5">
              🔥 {member.streakCount}d
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-gray-900">{member.userName}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Academic IELTS Cohort Candidate</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Latest Mock Band</span>
              <span className="text-xl font-black text-indigo-700">
                {member.latestMockBand ? member.latestMockBand.toFixed(1) : '7.0'}
              </span>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Target Band Score</span>
              <span className="text-xl font-black text-emerald-700">
                {member.targetScore ? member.targetScore.toFixed(1) : '7.5+'}
              </span>
            </div>
          </div>

          {/* Daily Status Box */}
          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl text-left space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700">Today's Mission Status</span>
              {member.dailyStatus === 'completed' ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  ✓ Submitted
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  ⏳ Pending
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 font-medium">
              {member.dailySubmissionText || 'Working on daily IELTS module.'}
            </p>
          </div>

          {/* 360 Diagnostic Audit Trigger */}
          <button
            onClick={() => setShowAudit(true)}
            className="w-full py-2.5 bg-[#0F1115] hover:bg-[#181C24] text-rose-400 border border-rose-900/40 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>[ View Full 360° Diagnostic Audit Log ]</span>
          </button>

          {/* Peer Cheer Button */}
          <button
            onClick={() => {
              alert(`Sent a study cheer 🔥 to ${member.userName}!`);
              onClose();
            }}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Study Encouragement 🔥</span>
          </button>
        </div>
      </div>

      {/* 360 AUDIT MODAL */}
      <Student360AuditModal
        student={canonicalMatch}
        isOpen={showAudit}
        onClose={() => setShowAudit(false)}
      />
    </div>
  );
};

export default MemberProfileModal;

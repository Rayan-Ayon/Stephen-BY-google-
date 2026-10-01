import React from 'react';
import { CohortMetadata, CohortRecording } from '@/types/community';
import { LiveCallBridge } from './LiveCallBridge';
import { BatchPulseBarometer } from './BatchPulseBarometer';
import { ShieldCheck, Users, GraduationCap } from 'lucide-react';

interface LeftColumnBridgeProps {
  cohort: CohortMetadata;
  recordings: CohortRecording[];
  onSelectTimestamp?: (recording: CohortRecording, time: string) => void;
}

export const LeftColumnBridge: React.FC<LeftColumnBridgeProps> = ({
  cohort,
  recordings,
  onSelectTimestamp
}) => {
  return (
    <div className="space-y-6">
      {/* Batch Header Identity Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-full">
              Exclusive Cohort
            </span>
            <h2 className="text-lg font-black text-gray-900 mt-2 tracking-tight">{cohort.name}</h2>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {cohort.description}
            </p>
          </div>
        </div>

        {/* Lead Mentor Info */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={cohort.mentor.avatarUrl}
                alt={cohort.mentor.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-0.5 rounded-full ring-2 ring-white">
                <ShieldCheck className="w-2.5 h-2.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-gray-900">{cohort.mentor.name}</h4>
                <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                  Band {cohort.mentor.bandScore}
                </span>
              </div>
              <p className="text-[11px] text-gray-500">{cohort.mentor.title || 'Lead IELTS Director'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Component 1: Live Call Bridge */}
      <LiveCallBridge
        meetingUrl={cohort.liveMeetingUrl}
        nextSessionIso={cohort.nextLiveSession}
        recordings={recordings}
        onSelectTimestamp={onSelectTimestamp}
      />

      {/* Component 2: Batch Health Barometer */}
      <BatchPulseBarometer
        currentAvgBand={cohort.currentAvgBand}
        targetBand={cohort.targetBand}
        submittedCount={cohort.dailyMission.submittedCount}
        totalAssigned={cohort.dailyMission.totalAssigned}
      />
    </div>
  );
};

export default LeftColumnBridge;

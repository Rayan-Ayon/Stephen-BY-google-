import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ActivityTickerItem } from '@/types/community';
import { INITIAL_ACTIVITIES } from './mockCommunityData';
import { Activity, PlusCircle, CheckCircle2, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { obsidianTokens } from './obsidianTokens';

interface RealtimeActivityTickerProps {
  cohortId?: string;
}

export const RealtimeActivityTicker: React.FC<RealtimeActivityTickerProps> = ({
  cohortId = 'c8888888-8888-4888-8888-888888888888'
}) => {
  const [activities, setActivities] = useState<ActivityTickerItem[]>(INITIAL_ACTIVITIES);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetchActivities();

    // Subscribe to Supabase Realtime Inserts
    const channel = (supabase as any)
      ?.channel(`cohort-activities-${cohortId}`)
      ?.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cohort_activities',
          filter: `cohort_id=eq.${cohortId}`
        },
        (payload: any) => {
          const newActivity = payload.new as ActivityTickerItem;
          setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);
        }
      )
      ?.subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [cohortId]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('cohort_activities')
        .select('*')
        .eq('cohort_id', cohortId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data && data.length > 0) {
        setActivities(data as ActivityTickerItem[]);
      }
    } catch {
      // Graceful fallback to initial stream
    }
  };

  const handleSimulateAction = async () => {
    setIsSimulating(true);
    const mockNames = ['Samira Akter', 'Nafis Rayan', 'Tasnim Haque', 'Zubair Hossain', 'Ayesha Rahman', 'Priya Sen'];
    const mockActions = [
      'completed Cambridge 18 Reading Section 3 (Band 8.0)',
      'submitted Task 2 concession paragraph draft',
      'logged 20m Speaking simulation on Part 3',
      'earned +50 XP for daily mission completion',
      'upvoted Dr. Vance\'s Task 2 model essay'
    ];
    const chosenName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const chosenAction = mockActions[Math.floor(Math.random() * mockActions.length)];

    const item: ActivityTickerItem = {
      id: 'act-' + Date.now(),
      cohortId,
      userName: chosenName,
      activityType: 'test_completed',
      description: chosenAction,
      createdAt: new Date().toISOString()
    };

    setActivities((prev) => [item, ...prev.slice(0, 19)]);
    setTimeout(() => setIsSimulating(false), 400);
  };

  return (
    <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 className="font-bold text-white text-sm">Real-Time Activity Ticker</h3>
        </div>

        <button
          onClick={handleSimulateAction}
          disabled={isSimulating}
          className="text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
          title="Emit simulated peer activity"
        >
          <Zap className="w-2.5 h-2.5" />
          <span>Ping Activity</span>
        </button>
      </div>

      {/* Micro-feed */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 text-xs custom-scrollbar">
        {activities.map((act) => {
          let timeAgo = 'Just now';
          try {
            timeAgo = formatDistanceToNow(new Date(act.createdAt), { addSuffix: true });
          } catch {
            // fallback
          }

          return (
            <div
              key={act.id}
              className="p-2.5 bg-[#181C24] border border-[#222732] rounded-xl text-slate-300 flex items-start gap-2.5 hover:bg-[#202530] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-[#15181E] border border-[#222732] text-rose-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {act.userName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-1">
                  <span className="font-bold text-slate-100 text-[11px] truncate">{act.userName}</span>
                  <span className="text-[9px] text-slate-500 font-mono shrink-0">{timeAgo}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                  {act.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RealtimeActivityTicker;

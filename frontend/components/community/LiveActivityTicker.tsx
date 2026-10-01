import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ActivityTickerItem } from '@/types/community';
import { INITIAL_ACTIVITIES } from './mockCommunityData';
import { Activity, Radio, PlusCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LiveActivityTickerProps {
  cohortId?: string;
}

export const LiveActivityTicker: React.FC<LiveActivityTickerProps> = ({
  cohortId = 'c8888888-8888-4888-8888-888888888888'
}) => {
  const [activities, setActivities] = useState<ActivityTickerItem[]>(INITIAL_ACTIVITIES);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    fetchActivities();

    // Subscribe to Supabase Realtime Inserts
    const channel = supabase
      .channel(`cohort-activities-${cohortId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cohort_activities',
          filter: `cohort_id=eq.${cohortId}`
        },
        (payload) => {
          const newActivity = payload.new as ActivityTickerItem;
          setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
    } catch (err) {
      console.warn('Supabase activities fetch note:', err);
    }
  };

  // Quick action emitter to test Supabase Realtime or local live state
  const handleSimulateAction = async () => {
    setIsSimulating(true);
    const mockNames = ['Zubair Hossain', 'Farhan Kabir', 'Samira Akter', 'Ayesha Rahman', 'Nafis Rayan'];
    const mockActions = [
      'completed Cambridge 18 Reading Section 3 (Band 7.5)',
      'logged 20m Speaking simulation on LexiSpeak',
      'submitted Task 1 line graph paraphrase',
      'earned +50 XP for daily study goal',
      'upvoted Dr. Vance\'s Task 2 thesis blueprint'
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

    // Attempt Supabase insert if table exists
    try {
      await (supabase as any).from('cohort_activities').insert({
        cohort_id: cohortId,
        user_name: chosenName,
        activity_type: 'test_completed',
        description: chosenAction
      });
    } catch (err) {
      // If table doesn't exist yet, update local state
    }

    setActivities((prev) => [item, ...prev.slice(0, 19)]);
    setTimeout(() => setIsSimulating(false), 500);
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 className="font-bold text-gray-900 text-sm">Real-Time Peer Activity</h3>
        </div>
        <button
          onClick={handleSimulateAction}
          disabled={isSimulating}
          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
          title="Emit simulated peer activity"
        >
          <PlusCircle className="w-2.5 h-2.5" />
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
              className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 flex items-start gap-2.5 hover:bg-slate-50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {act.userName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-1">
                  <span className="font-bold text-gray-900 text-[11px] truncate">{act.userName}</span>
                  <span className="text-[9px] text-gray-400 shrink-0">{timeAgo}</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-snug mt-0.5 line-clamp-2">
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

export default LiveActivityTicker;

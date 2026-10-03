import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { saveTeacherEvaluation, TeacherEvaluationPayload } from '@/lib/telemetryEgress';

export interface CoachingAttempt {
  id: string;
  user_id?: string;
  student_name: string;
  test_id: string;
  module: 'reading' | 'listening' | 'writing' | 'speaking';
  band_score: number;
  correct_count: number;
  total_questions: number;
  time_spent_seconds: number;
  created_at: string;
}

export interface CoachingHandwrittenSubmission {
  id: string;
  user_id?: string;
  student_name: string;
  prompt_title: string;
  image_url: string;
  ocr_extracted_text?: string;
  ai_band_score: number;
  teacher_override_band?: number;
  teacher_feedback?: string;
  status: 'pending' | 'reviewed';
  created_at: string;
  reviewed_at?: string;
}

export interface CoachingSpeakingSession {
  id: string;
  user_id?: string;
  student_name: string;
  audio_url: string;
  transcript?: string;
  fluency_score?: number;
  pronunciation_score?: number;
  lexical_score?: number;
  grammar_score?: number;
  overall_band: number;
  teacher_override_band?: number;
  teacher_feedback?: string;
  status: 'pending' | 'reviewed';
  created_at: string;
  reviewed_at?: string;
}

// Fallback seed data in case Supabase tables are still deploying or empty
const SEED_ATTEMPTS: CoachingAttempt[] = [
  {
    id: 'att-1',
    student_name: 'Farhan Kabir',
    test_id: 'cambridge-18-test-2',
    module: 'reading',
    band_score: 6.5,
    correct_count: 28,
    total_questions: 40,
    time_spent_seconds: 3240,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'att-2',
    student_name: 'Ayonburg / Ayon',
    test_id: 'cambridge-18-test-1',
    module: 'listening',
    band_score: 7.5,
    correct_count: 34,
    total_questions: 40,
    time_spent_seconds: 2400,
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: 'att-3',
    student_name: 'Sadia',
    test_id: 'cambridge-17-test-3',
    module: 'writing',
    band_score: 6.0,
    correct_count: 0,
    total_questions: 2,
    time_spent_seconds: 3600,
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 'att-4',
    student_name: 'Tanvir Ahmed / Tanvir Hossain',
    test_id: 'cambridge-16-test-4',
    module: 'speaking',
    band_score: 6.5,
    correct_count: 0,
    total_questions: 3,
    time_spent_seconds: 840,
    created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
  }
];

const SEED_ESSAYS: CoachingHandwrittenSubmission[] = [
  {
    id: 'essay-1',
    student_name: 'Tanvir Hossain',
    prompt_title: 'Task 2: Free University Education vs Student Contribution',
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
    ocr_extracted_text: 'Some people believe that university education should be free for everyone, while others argue that students must contribute to the cost of their studies. In my view, a partially subsidised model offers the fairest balance between equity and accountability...',
    ai_band_score: 6.5,
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'essay-2',
    student_name: 'Anika Rahman',
    prompt_title: 'Task 1: Sports Participation Comparative Analysis (1997 vs 2017)',
    image_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
    ocr_extracted_text: 'The chart illustrates the number of adults participating in seven major sports in one area, comparing figures for 1997 and 2017. Overall, participation in football and rugby rose markedly...',
    ai_band_score: 7.0,
    status: 'pending',
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: 'essay-3',
    student_name: 'Rafiqul Islam',
    prompt_title: 'Task 2: Urban Regeneration & Infrastructure Investment',
    image_url: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=800&auto=format&fit=crop',
    ocr_extracted_text: 'Infrastructure modernization represents the linchpin of sustainable economic advancement. When municipalities allocate fiscal resources towards mass transit systems...',
    ai_band_score: 6.0,
    status: 'pending',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

const SEED_SPEAKING: CoachingSpeakingSession[] = [
  {
    id: 'spk-1',
    student_name: 'Tanvir Hossain',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    transcript: "Examiner: Let's talk about your hometown. What do you like most about it?\nCandidate: Well, I live in Dhaka, which is an immensely vibrant metropolitan area. What I appreciate most is the rich cultural tapestry and the sheer dynamism of the streets...",
    fluency_score: 6.5,
    pronunciation_score: 7.0,
    lexical_score: 6.5,
    grammar_score: 6.0,
    overall_band: 6.5,
    status: 'pending',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'spk-2',
    student_name: 'Anika Rahman',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    transcript: "Examiner: Do you think modern technology makes people feel more isolated?\nCandidate: That is certainly a multifaceted dilemma. On one hand, social connectivity platforms enable instantaneous communication across international boundaries...",
    fluency_score: 7.0,
    pronunciation_score: 7.5,
    lexical_score: 7.0,
    grammar_score: 7.0,
    overall_band: 7.0,
    status: 'pending',
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  }
];

export function useCoachingTelemetry() {
  const [loading, setLoading] = useState(true);
  const [examAttempts, setExamAttempts] = useState<CoachingAttempt[]>(SEED_ATTEMPTS);
  const [handwrittenEssays, setHandwrittenEssays] = useState<CoachingHandwrittenSubmission[]>(SEED_ESSAYS);
  const [speakingSessions, setSpeakingSessions] = useState<CoachingSpeakingSession[]>(SEED_SPEAKING);
  const [studentDisputes, setStudentDisputes] = useState<any[]>([]);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  const fetchCoachingData = useCallback(async () => {
    try {
      // 1. Fetch live exam attempts
      const { data: attemptsData } = await (supabase as any)
        .from('exam_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (attemptsData && attemptsData.length > 0) {
        setExamAttempts(attemptsData);
      }

      // 2. Fetch handwritten essay queue
      const { data: essayData } = await (supabase as any)
        .from('handwritten_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (essayData && essayData.length > 0) {
        setHandwrittenEssays(essayData);
      }

      // 3. Fetch speaking audio queue
      const { data: subData, error: subErr } = await (supabase as any)
        .from('speaking_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (subData && subData.length > 0) {
        const mappedSessions: CoachingSpeakingSession[] = subData.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          student_name: item.raw_json_feedback?.student_name || item.user_email || 'Speaking Candidate',
          audio_url: item.raw_json_feedback?.audio_url || item.audio_url || '',
          transcript: item.transcript || '',
          fluency_score: item.fluency_score != null ? Number(item.fluency_score) : undefined,
          pronunciation_score: item.pronunciation_score != null ? Number(item.pronunciation_score) : undefined,
          lexical_score: item.lexical_score != null ? Number(item.lexical_score) : undefined,
          grammar_score: item.grammar_score != null ? Number(item.grammar_score) : undefined,
          overall_band: item.overall_band != null ? Number(item.overall_band) : 6.5,
          teacher_override_band: item.teacher_override_band != null ? Number(item.teacher_override_band) : undefined,
          teacher_feedback: item.teacher_feedback,
          status: item.status || 'pending',
          created_at: item.created_at,
          reviewed_at: item.reviewed_at
        }));
        setSpeakingSessions(mappedSessions);
      } else if (subErr) {
        // Fallback to speaking_sessions if speaking_submissions isn't used
        const { data: sesData } = await (supabase as any)
          .from('speaking_sessions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (sesData && sesData.length > 0) {
          setSpeakingSessions(sesData);
        }
      }

      // 4. Fetch live student disputes
      try {
        const { data: disputeData } = await (supabase as any)
          .from('student_disputes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (disputeData && disputeData.length > 0) {
          setStudentDisputes(disputeData);
        }
      } catch (dispErr) {
        console.warn('[Telemetry Hook] student_disputes fetch note:', dispErr);
      }

      setLastRefreshedAt(new Date());
    } catch (err) {
      console.warn('[Telemetry Hook] Hydration using fallback seed data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and Realtime subscription
  useEffect(() => {
    fetchCoachingData();

    const onLocalDispute = () => fetchCoachingData();
    window.addEventListener('student-dispute-submitted', onLocalDispute);

    // Unique channel per hook instance to prevent "cannot add postgres_changes callbacks after subscribe" collision
    const channelId = `coaching_telemetry_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    let channel: any = null;

    try {
      channel = (supabase as any)
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'exam_attempts' },
          () => fetchCoachingData()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'handwritten_submissions' },
          () => fetchCoachingData()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'speaking_submissions' },
          () => fetchCoachingData()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'student_disputes' },
          () => fetchCoachingData()
        )
        .subscribe();
    } catch (err) {
      console.warn('[Telemetry Hook] Realtime subscription init warning:', err);
    }

    return () => {
      window.removeEventListener('student-dispute-submitted', onLocalDispute);
      if (channel) {
        try {
          (supabase as any).removeChannel(channel);
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [fetchCoachingData]);

  // Derived filtered collections
  const pendingEssays = handwrittenEssays.filter((e) => e.status === 'pending');
  const pendingSpeaking = speakingSessions.filter((s) => s.status === 'pending');

  // Aggregated analytics
  const uniqueStudents = new Set<string>();
  examAttempts.forEach((a) => uniqueStudents.add(a.student_name || 'Candidate'));
  handwrittenEssays.forEach((e) => uniqueStudents.add(e.student_name || 'Candidate'));
  speakingSessions.forEach((s) => uniqueStudents.add(s.student_name || 'Candidate'));

  const totalBandSum = examAttempts.reduce((acc, a) => acc + (Number(a.band_score) || 0), 0);
  const averageBandScore = examAttempts.length > 0 ? Number((totalBandSum / examAttempts.length).toFixed(1)) : 6.8;

  const getModuleAvg = (mod: 'reading' | 'listening' | 'writing' | 'speaking') => {
    const list = examAttempts.filter((a) => a.module === mod);
    if (list.length === 0) return 6.5;
    const sum = list.reduce((acc, curr) => acc + (Number(curr.band_score) || 0), 0);
    return Number((sum / list.length).toFixed(1));
  };

  // Submit Teacher Review Action
  const submitReview = async (payload: TeacherEvaluationPayload) => {
    // 1. Optimistic update
    if (payload.submissionType === 'essay') {
      setHandwrittenEssays((prev) =>
        prev.map((e) =>
          e.id === payload.submissionId
            ? {
                ...e,
                status: 'reviewed',
                teacher_override_band: payload.overrideBand,
                teacher_feedback: payload.feedbackText,
                reviewed_at: new Date().toISOString()
              }
            : e
        )
      );
    } else if (payload.submissionType === 'speaking') {
      setSpeakingSessions((prev) =>
        prev.map((s) =>
          s.id === payload.submissionId
            ? {
                ...s,
                status: 'reviewed',
                teacher_override_band: payload.overrideBand,
                teacher_feedback: payload.feedbackText,
                reviewed_at: new Date().toISOString()
              }
            : s
        )
      );
    }

    // 2. Write to Supabase
    return await saveTeacherEvaluation(payload);
  };

  const pendingDisputes = studentDisputes.filter(
    (d) => d.status === 'pending' || d.status === 'pending_teacher_review'
  );

  return {
    loading,
    examAttempts,
    handwrittenEssays,
    pendingEssays,
    speakingSessions,
    pendingSpeaking,
    studentDisputes,
    pendingDisputes,
    lastRefreshedAt,
    metrics: {
      activeStudentCount: uniqueStudents.size || 48,
      averageBandScore,
      pendingEvaluationsCount: pendingEssays.length + pendingSpeaking.length + pendingDisputes.length,
      readingAverage: getModuleAvg('reading'),
      listeningAverage: getModuleAvg('listening'),
      writingAverage: getModuleAvg('writing'),
      speakingAverage: getModuleAvg('speaking'),
      approvedTodayCount:
        handwrittenEssays.filter((e) => e.status === 'reviewed').length +
        speakingSessions.filter((s) => s.status === 'reviewed').length +
        studentDisputes.filter((d) => d.status === 'reviewed' || d.status === 'resolved').length
    },
    submitReview,
    refresh: fetchCoachingData
  };
}

export default useCoachingTelemetry;

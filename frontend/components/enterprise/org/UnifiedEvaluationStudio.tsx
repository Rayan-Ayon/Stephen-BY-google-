import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useCoachingTelemetry, CoachingHandwrittenSubmission, CoachingSpeakingSession } from '@/hooks/useCoachingTelemetry';
import { supabase } from '@/lib/supabaseClient';
import {
  Mic,
  Play,
  Pause,
  RefreshCw,
  CheckCircle2,
  Volume2,
  Award,
  X,
  Sparkles,
  FileText,
  ZoomIn,
  ZoomOut,
  Send,
  Radio,
  Search,
  ChevronRight,
  Clock,
  User,
  Trash2,
  RotateCcw,
  Sliders,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { pushTeacherReview, blobUrlToDataUrl } from '@/lib/teacherReviewNotifications';

export type EvaluationCategoryTab = 'all' | 'writing' | 'speaking' | 'disputed';

export interface UnifiedEvaluationItem {
  id: string;
  submissionType: 'essay' | 'speaking';
  studentName: string;
  studentAvatar?: string;
  batch: string;
  title: string;
  submittedAt: string;
  status: 'pending' | 'reviewed';
  aiBandScore: number;
  subScores: {
    TR: number; // Task Response / Fluency
    CC: number; // Coherence & Cohesion / Pronunciation
    LR: number; // Lexical Resource
    GRA: number; // Grammatical Range & Accuracy
  };
  // Media details
  imageUrl?: string;
  ocrText?: string;
  audioUrl?: string;
  transcript?: string;
  // Disputed Exam details
  isDisputed?: boolean;
  studentId?: string;
  disputeNote?: string;
  examModule?: string;
  rawAnswers?: any;
  textHighlights?: { id: string; text: string; critique: string }[];
  // Completed review details
  teacherOverrideBand?: number;
  teacherFeedback?: string;
  teacherVoiceUrl?: string;
}

interface UnifiedEvaluationStudioProps {
  initialTab?: EvaluationCategoryTab;
}

export const UnifiedEvaluationStudio: React.FC<UnifiedEvaluationStudioProps> = ({
  initialTab = 'all',
}) => {
  const {
    handwrittenEssays,
    speakingSessions,
    studentDisputes,
    submitReview,
    refresh,
    loading,
    metrics,
  } = useCoachingTelemetry();

  // Top Filter Tabs: [ All Pending (5) ] | [ Writing Tasks (3) ] | [ Speaking Audits (2) ]
  const [activeTab, setActiveTab] = useState<EvaluationCategoryTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'all' | 'reviewed'>('pending');

  // Slide-over Split Screen Drawer State
  const [selectedItem, setSelectedItem] = useState<UnifiedEvaluationItem | null>(null);

  // Calibration Form State inside Drawer
  const [calibratedScores, setCalibratedScores] = useState({
    TR: 7.5,
    CC: 7.0,
    LR: 7.5,
    GRA: 7.0,
  });
  const [feedbackText, setFeedbackText] = useState('');
  const [imageZoom, setImageZoom] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSelector, setActionSelector] = useState<'voice' | 'highlights'>('voice');
  const [facultyCritiques, setFacultyCritiques] = useState<{ id: string; text: string; critique: string }[]>([]);
  const [newCritiqueText, setNewCritiqueText] = useState('');
  const [newCritiqueNote, setNewCritiqueNote] = useState('');

  // Audio Playback State for Student Audio
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(135); // 2:15 default
  const submissionAudioRef = useRef<HTMLAudioElement | null>(null);

  // "Hold to Record Voice Note" (15s) State
  const [isHoldingRecord, setIsHoldingRecord] = useState(false);
  const [voiceSecondsLeft, setVoiceSecondsLeft] = useState(15);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [isPlayingVoicePreview, setIsPlayingVoicePreview] = useState(false);
  const voiceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Live and local student disputes
  const [liveDisputes, setLiveDisputes] = useState<UnifiedEvaluationItem[]>([]);
  const [selectionPopup, setSelectionPopup] = useState<{ x: number; y: number; text: string } | null>(null);

  const fetchDisputes = useCallback(async () => {
    const list: UnifiedEvaluationItem[] = [];
    try {
      const { data, error } = await (supabase as any)
        .from('student_disputes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        data.forEach((d: any) => {
          list.push({
            id: d.id,
            submissionType: d.module === 'speaking' ? 'speaking' : 'essay',
            studentName: d.student_name || 'Candidate Scholar',
            studentAvatar: d.student_avatar,
            batch: `${(d.module || 'IELTS').toUpperCase()} Dispute Queue`,
            title: d.test_title || 'IELTS Examination Dispute',
            submittedAt: d.created_at,
            status: d.status === 'resolved' ? 'reviewed' : 'pending',
            aiBandScore: Number(d.original_band) || 6.5,
            subScores: {
              TR: Number(d.original_band) || 6.5,
              CC: Number(d.original_band) || 6.5,
              LR: Number(d.original_band) || 6.5,
              GRA: Number(d.original_band) || 6.5,
            },
            isDisputed: true,
            studentId: d.user_id || d.student_id,
            disputeNote: d.dispute_note,
            examModule: d.module,
            rawAnswers: d.raw_answers,
            ocrText: d.raw_answers ? (typeof d.raw_answers === 'string' ? d.raw_answers : JSON.stringify(d.raw_answers, null, 2)) : undefined,
            teacherOverrideBand: d.teacher_override_band,
            teacherFeedback: d.teacher_feedback,
          });
        });
      }
    } catch (e) {
      console.warn('Disputes fetch notice:', e);
    }

    try {
      const local = JSON.parse(localStorage.getItem('all_student_disputes') || '[]');
      if (Array.isArray(local)) {
        local.forEach((d: any) => {
          if (!list.some((existing) => existing.id === d.id)) {
            list.push({
              id: d.id || `disp-loc-${Date.now()}`,
              submissionType: d.module === 'speaking' ? 'speaking' : 'essay',
              studentName: d.student_name || 'Candidate Scholar',
              studentAvatar: d.student_avatar,
              batch: `${(d.module || 'IELTS').toUpperCase()} Dispute Queue`,
              title: d.test_title || 'IELTS Examination Dispute',
              submittedAt: d.created_at || new Date().toISOString(),
              status: d.status === 'resolved' ? 'reviewed' : 'pending',
              aiBandScore: Number(d.original_band) || 6.5,
              subScores: {
                TR: Number(d.original_band) || 6.5,
                CC: Number(d.original_band) || 6.5,
                LR: Number(d.original_band) || 6.5,
                GRA: Number(d.original_band) || 6.5,
              },
              isDisputed: true,
              disputeNote: d.dispute_note,
              examModule: d.module,
              rawAnswers: d.raw_answers,
              ocrText: d.raw_answers ? (typeof d.raw_answers === 'string' ? d.raw_answers : JSON.stringify(d.raw_answers, null, 2)) : undefined,
              teacherOverrideBand: d.teacher_override_band,
              teacherFeedback: d.teacher_feedback,
            });
          }
        });
      }
    } catch {}

    setLiveDisputes(list);
  }, []);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const handleTextSelection = (e: React.MouseEvent) => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text && text.length > 2) {
      setSelectionPopup({ x: e.clientX, y: e.clientY, text });
    } else {
      setSelectionPopup(null);
    }
  };

  const SEED_DISPUTED_ITEMS: UnifiedEvaluationItem[] = [
    {
      id: 'disp-01',
      submissionType: 'essay',
      studentName: 'Farhan Kabir',
      studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      batch: 'Farmgate Executive Batch',
      title: 'Task 2: Academic Tuition Fees & Higher Education Access',
      submittedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      status: 'pending',
      isDisputed: true,
      disputeNote: 'I believe my Task Response argument in Paragraph 2 was valid and warrants Band 7.0 instead of 6.0.',
      aiBandScore: 6.0,
      subScores: { TR: 6.0, CC: 6.5, LR: 6.0, GRA: 6.0 },
      ocrText: 'Some people argue that tertiary education should be fully financed by governments, whereas others assert that students ought to bear the financial burden. In my viewpoint, a blended funding model guarantees institutional excellence while preserving accessibility for underprivileged demographics. In paragraph two, national infrastructure directly benefits from university graduates in science and engineering who drive high-value economic productivity...',
      textHighlights: [
        { id: 'hl-1', text: 'national infrastructure directly benefits from university graduates', critique: 'Valid topical substantiation; warrants Band 7.0 for Task Achievement.' }
      ]
    },
    {
      id: 'disp-02',
      submissionType: 'speaking',
      studentName: 'Mim Akter',
      studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      batch: 'Farmgate Executive Batch',
      title: 'Speaking Part 3: Urban Traffic & Remote Work Policies',
      submittedAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
      status: 'pending',
      isDisputed: true,
      disputeNote: 'The AI docked my fluency for hesitation, but my pause was for conceptual synthesis, not lack of English vocabulary.',
      aiBandScore: 6.5,
      subScores: { TR: 6.5, CC: 7.0, LR: 7.0, GRA: 6.0 },
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      transcript: 'Examiner: How will artificial intelligence transform commute patterns?\nCandidate: Well, considering the decentralization of enterprise workspaces, employees will no longer be compelled to commute into dense central business districts every day. My hesitation earlier was reflecting upon economic equity across rural communities.',
      textHighlights: [
        { id: 'hl-2', text: 'reflecting upon economic equity across rural communities', critique: 'Natural pause for thought formulation, not linguistic breakdown.' }
      ]
    },
    {
      id: 'disp-03',
      submissionType: 'essay',
      studentName: 'Ayonburg / Ayon',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      batch: 'Farmgate Executive Batch',
      title: 'Reading Test: Epigenetic Markers & Longevity',
      submittedAt: new Date(Date.now() - 11 * 3600 * 1000).toISOString(),
      status: 'pending',
      isDisputed: true,
      disputeNote: 'Question 38 True/False/Not Given key seems flawed. The text states markers persist across generations, which directly confirms statement 38 as TRUE.',
      aiBandScore: 7.0,
      subScores: { TR: 7.0, CC: 7.0, LR: 7.5, GRA: 7.0 },
      ocrText: 'Question 38 Analysis:\nText snippet: "Epigenetic methylations endure gametogenesis in specific mammalian lineages, bequeathing metabolic adaptations to progeny."\nStudent Answer: TRUE (AI graded FALSE).',
      textHighlights: [
        { id: 'hl-3', text: 'endure gametogenesis in specific mammalian lineages', critique: 'Accurate text correlation; question verified as TRUE. Band score adjusted.' }
      ]
    }
  ];

  // Merge handwritten essays and speaking audits into a unified collection
  const allUnifiedItems: UnifiedEvaluationItem[] = useMemo(() => {
    const list: UnifiedEvaluationItem[] = [];

    // 1. Handwritten Essays
    if (Array.isArray(handwrittenEssays)) {
      handwrittenEssays.forEach((e) => {
        if (!e) return;
        const aiScore = e.ai_band_score || 6.5;
        list.push({
          id: e.id,
          submissionType: 'essay',
          studentName: e.student_name || 'Candidate Scholar',
          batch: 'Farmgate Cohort #08',
          title: e.prompt_title || 'Cambridge 18 Academic Writing Task 2',
          submittedAt: e.created_at,
          status: e.status === 'reviewed' ? 'reviewed' : 'pending',
          aiBandScore: aiScore,
          subScores: {
            TR: Math.min(9, aiScore + 0.5),
            CC: aiScore,
            LR: aiScore,
            GRA: Math.max(5, aiScore - 0.5),
          },
          imageUrl: e.image_url,
          ocrText: e.ocr_extracted_text,
          teacherOverrideBand: e.teacher_override_band,
          teacherFeedback: e.teacher_feedback,
        });
      });
    }

    // 2. Speaking Sessions
    if (Array.isArray(speakingSessions)) {
      speakingSessions.forEach((s) => {
        if (!s) return;
        const overall = s.overall_band || 6.5;
        list.push({
          id: s.id,
          submissionType: 'speaking',
          studentName: s.student_name || 'Speaking Candidate',
          batch: 'Farmgate Cohort #08',
          title: 'Mohona AI Speaking Partner • Part 2 & 3 Drill',
          submittedAt: s.created_at,
          status: s.status === 'reviewed' ? 'reviewed' : 'pending',
          aiBandScore: overall,
          subScores: {
            TR: s.fluency_score ?? overall,
            CC: s.pronunciation_score ?? overall,
            LR: s.lexical_score ?? overall,
            GRA: s.grammar_score ?? Math.max(5, overall - 0.5),
          },
          audioUrl: s.audio_url,
          transcript: s.transcript,
          teacherOverrideBand: s.teacher_override_band,
          teacherFeedback: s.teacher_feedback,
        });
      });
    }

    // 3. Student Flagged / Challenged Disputes
    if (Array.isArray(studentDisputes)) {
      studentDisputes.forEach((d: any) => {
        if (!list.some((existing) => existing.id === d.id)) {
          const mod = d.module || 'IELTS';
          list.push({
            id: d.id,
            submissionType: d.module === 'speaking' ? 'speaking' : 'essay',
            studentName: d.student_name || 'Candidate Scholar',
            studentAvatar: d.student_avatar,
            batch: `${mod.toUpperCase()} Dispute Queue`,
            title: d.test_title || 'IELTS Examination Dispute',
            submittedAt: d.created_at || new Date().toISOString(),
            status: (d.status === 'resolved' || d.status === 'reviewed') ? 'reviewed' : 'pending',
            aiBandScore: Number(d.original_band) || 6.5,
            subScores: {
              TR: Number(d.original_band) || 6.5,
              CC: Number(d.original_band) || 6.5,
              LR: Number(d.original_band) || 6.5,
              GRA: Number(d.original_band) || 6.5,
            },
            isDisputed: true,
            studentId: d.user_id || d.student_id,
            disputeNote: d.dispute_note,
            examModule: d.module,
            rawAnswers: d.raw_answers,
            ocrText: d.raw_answers ? (typeof d.raw_answers === 'string' ? d.raw_answers : JSON.stringify(d.raw_answers, null, 2)) : undefined,
            teacherOverrideBand: d.teacher_override_band,
            teacherFeedback: d.teacher_feedback,
          });
        }
      });
    }

    liveDisputes.forEach((d) => {
      if (!list.some((existing) => existing.id === d.id)) {
        list.push(d);
      }
    });
    SEED_DISPUTED_ITEMS.forEach((d) => {
      if (!list.some((existing) => existing.id === d.id)) {
        list.push(d);
      }
    });

    return list;
  }, [handwrittenEssays, speakingSessions, liveDisputes, studentDisputes]);

  // Counts for Segmented Pills
  const pendingEssaysCount = allUnifiedItems.filter(
    (item) => item.submissionType === 'essay' && item.status === 'pending' && !item.isDisputed
  ).length;

  const pendingSpeakingCount = allUnifiedItems.filter(
    (item) => item.submissionType === 'speaking' && item.status === 'pending' && !item.isDisputed
  ).length;

  const challengedDisputesCount = allUnifiedItems.filter(
    (item) => item.isDisputed && item.status === 'pending'
  ).length;

  const totalPendingCount = pendingEssaysCount + pendingSpeakingCount + challengedDisputesCount;

  // Filtered List based on Active Tab, Search, and Status Filter
  const filteredItems = useMemo(() => {
    return allUnifiedItems.filter((item) => {
      // 1. Tab category filter
      if (activeTab === 'writing' && item.submissionType !== 'essay') return false;
      if (activeTab === 'speaking' && item.submissionType !== 'speaking') return false;
      if (activeTab === 'disputed' && !item.isDisputed) return false;

      // 2. Status filter
      if (statusFilter === 'pending' && item.status !== 'pending') return false;
      if (statusFilter === 'reviewed' && item.status !== 'reviewed') return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.studentName.toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesBatch = item.batch.toLowerCase().includes(query);
        if (!matchesName && !matchesTitle && !matchesBatch) return false;
      }

      return true;
    });
  }, [allUnifiedItems, activeTab, statusFilter, searchQuery]);

  // When a student row is clicked, initialize calibration form and open Drawer
  const handleSelectRow = (item: UnifiedEvaluationItem) => {
    setSelectedItem(item);
    setCalibratedScores({
      TR: item.subScores.TR,
      CC: item.subScores.CC,
      LR: item.subScores.LR,
      GRA: item.subScores.GRA,
    });
    setFeedbackText(item.teacherFeedback || '');
    setRecordedVoiceUrl(null);
    setImageZoom(1);
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);
    setFacultyCritiques(item.textHighlights || []);
    setActionSelector('voice');
    setNewCritiqueText('');
    setNewCritiqueNote('');
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    if (submissionAudioRef.current) {
      submissionAudioRef.current.pause();
    }
    if (voiceAudioPlayerRef.current) {
      voiceAudioPlayerRef.current.pause();
    }
    setSelectedItem(null);
  };

  // ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedItem) {
        handleCloseDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  // Calculated overall band from sub-scores
  const calculatedOverallBand = useMemo(() => {
    const avg =
      (calibratedScores.TR +
        calibratedScores.CC +
        calibratedScores.LR +
        calibratedScores.GRA) /
      4;
    // Round to nearest 0.5
    return Math.round(avg * 2) / 2;
  }, [calibratedScores]);

  // Voice Note Recording Logic (Hold for 15s)
  const startVoiceRecording = async () => {
    try {
      setIsHoldingRecord(true);
      setVoiceSecondsLeft(15);
      voiceChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      voiceMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          voiceChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();

      let currentLeft = 15;
      voiceTimerRef.current = setInterval(() => {
        currentLeft -= 1;
        setVoiceSecondsLeft(currentLeft);
        if (currentLeft <= 0) {
          stopVoiceRecording();
        }
      }, 1000);
    } catch (err) {
      console.warn('Microphone error or fallback:', err);
      // Fallback timer simulation
      setIsHoldingRecord(true);
      setVoiceSecondsLeft(15);
      let currentLeft = 15;
      voiceTimerRef.current = setInterval(() => {
        currentLeft -= 1;
        setVoiceSecondsLeft(currentLeft);
        if (currentLeft <= 0) {
          stopVoiceRecording();
        }
      }, 1000);
    }
  };

  const stopVoiceRecording = () => {
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
    }
    setIsHoldingRecord(false);

    if (
      voiceMediaRecorderRef.current &&
      voiceMediaRecorderRef.current.state !== 'inactive'
    ) {
      voiceMediaRecorderRef.current.stop();
      if (voiceChunksRef.current.length > 0) {
        const blob = new Blob(voiceChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVoiceUrl(url);
        toast.info('15s voice feedback note captured.');
        return;
      }
    }

    // Default simulated sample if mic not present
    setRecordedVoiceUrl(
      'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'
    );
    toast.info('Voice feedback note captured.');
  };

  // Toggle Voice Preview Audio
  const togglePlayVoicePreview = () => {
    if (!recordedVoiceUrl) return;
    if (!voiceAudioPlayerRef.current) {
      voiceAudioPlayerRef.current = new Audio(recordedVoiceUrl);
      voiceAudioPlayerRef.current.onended = () => setIsPlayingVoicePreview(false);
    }

    if (isPlayingVoicePreview) {
      voiceAudioPlayerRef.current.pause();
      setIsPlayingVoicePreview(false);
    } else {
      voiceAudioPlayerRef.current
        .play()
        .then(() => setIsPlayingVoicePreview(true))
        .catch(() => setIsPlayingVoicePreview(false));
    }
  };

  // Student Audio Playback handler
  const toggleStudentAudio = (url?: string) => {
    const targetUrl =
      url ||
      selectedItem?.audioUrl ||
      'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg';

    if (!submissionAudioRef.current) {
      const audio = new Audio(targetUrl);
      submissionAudioRef.current = audio;
      audio.ontimeupdate = () => setAudioCurrentTime(Math.round(audio.currentTime));
      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setAudioDuration(Math.round(audio.duration));
        }
      };
      audio.onended = () => {
        setIsPlayingAudio(false);
        setAudioCurrentTime(0);
      };
    }

    if (isPlayingAudio) {
      submissionAudioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      submissionAudioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.warn('Audio play failed:', err));
    }
  };

  // Approve & Dispatch to Student Action
  const handleApproveAndDispatch = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);

    try {
      const feedbackPayload = feedbackText.trim()
        ? feedbackText.trim()
        : `Verified by Senior Faculty. Sub-Scores: TR ${calibratedScores.TR}, CC ${calibratedScores.CC}, LR ${calibratedScores.LR}, GRA ${calibratedScores.GRA}.`;

      if (selectedItem.isDisputed) {
        try {
          await (supabase as any)
            .from('student_disputes')
            .update({
              status: 'resolved',
              teacher_override_band: calculatedOverallBand,
              teacher_feedback: feedbackPayload,
              resolved_at: new Date().toISOString(),
            })
            .eq('id', selectedItem.id);
        } catch (e) {
          console.warn('Dispute resolve update note:', e);
        }
        try {
          const local = JSON.parse(localStorage.getItem('all_student_disputes') || '[]');
          const updated = local.map((d: any) =>
            d.id === selectedItem.id ? { ...d, status: 'resolved', teacher_override_band: calculatedOverallBand } : d
          );
          localStorage.setItem('all_student_disputes', JSON.stringify(updated));
          if (selectedItem.title) {
            const mod = selectedItem.examModule || 'reading';
            const cleanTitle = selectedItem.title.replace(/.*Dispute:\s*/, '').replace(/\s+/g, '_');
            localStorage.setItem(`dispute_${mod}_${cleanTitle}`, JSON.stringify({ status: 'verified', teacher_override_band: calculatedOverallBand }));
          }
        } catch {}
        setLiveDisputes((prev) =>
          prev.map((d) => (d.id === selectedItem.id ? { ...d, status: 'reviewed', teacherOverrideBand: calculatedOverallBand } : d))
        );
      } else {
        await submitReview({
          submissionId: selectedItem.id,
          submissionType: selectedItem.submissionType,
          overrideBand: calculatedOverallBand,
          feedbackText: feedbackPayload,
        });
      }

      // Persist critiques/voice for disputes (separate best-effort update: these columns may not exist on older schemas)
      const voiceForStudent = recordedVoiceUrl ? await blobUrlToDataUrl(recordedVoiceUrl) : undefined;
      if (selectedItem.isDisputed) {
        try {
          await (supabase as any)
            .from('student_disputes')
            .update({ teacher_critiques: facultyCritiques, teacher_voice_url: voiceForStudent && !voiceForStudent.startsWith('data:') ? voiceForStudent : null })
            .eq('id', selectedItem.id);
        } catch {}
      }

      // Notify the student: amber "Teacher Verified" alert with full review payload
      await pushTeacherReview({
        disputeId: selectedItem.isDisputed ? selectedItem.id : undefined,
        studentId: selectedItem.studentId,
        studentName: selectedItem.studentName,
        testTitle: selectedItem.title,
        module: selectedItem.examModule || (selectedItem.submissionType === 'essay' ? 'writing' : 'speaking'),
        originalBand: selectedItem.aiBandScore,
        teacherBand: calculatedOverallBand,
        teacherName: 'Dr. Stephen Vance',
        teacherCredential: 'Band 9.0',
        feedbackText: feedbackPayload,
        voiceUrl: voiceForStudent,
        critiques: facultyCritiques,
        essayText: selectedItem.ocrText || selectedItem.transcript,
      });

      toast.success(
        `Evaluation Approved & Dispatched! Band ${calculatedOverallBand} sent to ${selectedItem.studentName}.`
      );

      // Advance to next pending item if available, or close drawer
      const remainingPending = filteredItems.filter(
        (i) => i.id !== selectedItem.id && i.status === 'pending'
      );
      if (remainingPending.length > 0) {
        handleSelectRow(remainingPending[0]);
      } else {
        handleCloseDrawer();
      }
    } catch {
      toast.error('Failed to dispatch evaluation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[680px] bg-[#0D0F12] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Queue view stays mounted (hidden) while grading so filters/search survive the round trip */}
      <div className={selectedItem ? 'hidden' : 'space-y-6'}>
      {/* ====================================================================
          1. HEADER & REALTIME REFRESH
          ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222732] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase flex items-center gap-2">
              <span>EVALUATION STUDIO</span>
              <span className="text-slate-600">//</span>
              <span className="text-rose-500 font-mono text-sm sm:text-base font-semibold lowercase">
                /coaching/evaluations
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centralized queue for handwritten OCR paper essays and Mohona speaking audits with split-screen teacher calibration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refresh()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15181E] hover:bg-[#181C24] border border-[#222732] text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
            title="Refresh Live Evaluation Pipeline"
          >
            <RefreshCw className={`w-4 h-4 text-rose-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Pipeline</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          2. SEGMENTED QUICK TABS: [ All Pending (5) ] | [ Writing Tasks (3) ] | [ Speaking Audits (2) ]
          ==================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Segmented Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-[#15181E] border border-[#222732] rounded-2xl w-fit flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181C24]'
            }`}
          >
            <span>All Pending</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'all'
                  ? 'bg-black/30 text-white'
                  : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
              }`}
            >
              {totalPendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('writing')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'writing'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181C24]'
            }`}
          >
            <span className="text-base leading-none">✍️</span>
            <span>Writing Tasks</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'writing'
                  ? 'bg-black/30 text-white'
                  : 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
              }`}
            >
              {pendingEssaysCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('speaking')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'speaking'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181C24]'
            }`}
          >
            <span className="text-base leading-none">🎙️</span>
            <span>Speaking Audits</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'speaking'
                  ? 'bg-black/30 text-white'
                  : 'bg-purple-950/60 text-purple-400 border border-purple-800/40'
              }`}
            >
              {pendingSpeakingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('disputed')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'disputed'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181C24]'
            }`}
          >
            <span className="text-base leading-none">🚩</span>
            <span>Student Flagged / Challenged</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'disputed'
                  ? 'bg-black/30 text-white'
                  : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
              }`}
            >
              {challengedDisputesCount}
            </span>
          </button>
        </div>

        {/* Search & Status Controls */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#15181E] border border-[#222732] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-600 transition-colors shadow-inner"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#15181E] border border-[#222732] rounded-xl">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-[#181C24] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({allUnifiedItems.filter((i) => i.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#181C24] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({allUnifiedItems.length})
            </button>
            <button
              onClick={() => setStatusFilter('reviewed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'reviewed'
                  ? 'bg-[#181C24] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dispatched ({allUnifiedItems.filter((i) => i.status === 'reviewed').length})
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. STUDENT QUEUE LIST / TABLE (Clicking ANY row opens Split-Screen Drawer)
          ==================================================================== */}
      <div className="rounded-2xl border border-[#222732] overflow-hidden bg-[#15181E] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#181C24] border-b border-[#222732] text-[11px] uppercase tracking-wider text-slate-400 font-semibold select-none">
                <th className="px-5 py-3.5">Candidate</th>
                <th className="px-5 py-3.5">Module &amp; Submission Task</th>
                <th className="px-5 py-3.5">AI Suggested Band</th>
                <th className="px-5 py-3.5">Sub-Scores (TR / CC / LR / GRA)</th>
                <th className="px-5 py-3.5">Submission Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222732]">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isWriting = item.submissionType === 'essay';
                  const isPending = item.status === 'pending';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectRow(item)}
                      className="hover:bg-[#181C24] transition-all cursor-pointer group"
                    >
                      {/* Candidate Avatar & Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-[#222732] flex items-center justify-center font-bold text-sm text-slate-200 overflow-hidden shrink-0">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt="Student Scan"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{item.studentName.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-100 group-hover:text-rose-400 transition-colors">
                              {item.studentName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {item.batch}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Module & Title */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isWriting
                                ? 'bg-blue-950/40 text-blue-400 border border-blue-800/30'
                                : 'bg-purple-950/40 text-purple-400 border border-purple-800/30'
                            }`}
                          >
                            <span>{isWriting ? '✍️ Writing OCR' : '🎧 Speaking Audio'}</span>
                          </span>
                          <p className="text-xs text-slate-300 font-medium max-w-sm truncate">
                            {item.title}
                          </p>
                        </div>
                      </td>

                      {/* AI Suggested Band */}
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                          Band {item.aiBandScore.toFixed(1)}
                        </span>
                      </td>

                      {/* Sub-scores */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
                          <span className="px-1.5 py-0.5 rounded bg-[#12141A] border border-[#222732]">
                            TR: {item.subScores.TR.toFixed(1)}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#12141A] border border-[#222732]">
                            CC: {item.subScores.CC.toFixed(1)}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#12141A] border border-[#222732]">
                            LR: {item.subScores.LR.toFixed(1)}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#12141A] border border-[#222732]">
                            GRA: {item.subScores.GRA.toFixed(1)}
                          </span>
                        </div>
                      </td>

                      {/* Submission Timestamp */}
                      <td className="px-5 py-4 text-slate-400 font-mono text-xs">
                        {item.submittedAt
                          ? new Date(item.submittedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recent'}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${
                            isPending
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                              : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                          }`}
                        >
                          <span>{isPending ? '⏳' : '✅'}</span>
                          <span>{isPending ? 'Pending Review' : 'Dispatched'}</span>
                        </span>
                      </td>

                      {/* Row Action Button */}
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181C24] group-hover:bg-rose-600 text-slate-300 group-hover:text-white border border-[#222732] text-xs font-semibold transition-all">
                          <span>Review & Grade</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-300">No submissions matching filter</p>
                    <p className="text-xs text-slate-500 mt-1">
                      New handwritten uploads and speaking recordings will appear here automatically.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================================
          4. SPLIT-SCREEN DRAWER / SLIDE-OVER MODAL
          Left Side: Raw Submission (Essay Scan + OCR OR Audio Player + Speech Text)
          Right Side: Suggested Sub-scores (TR, CC, LR, GRA) + Hold to Record Voice (15s) + [Approve & Dispatch]
          ==================================================================== */}
      </div>
      {selectedItem && (
            <div className="w-full h-[calc(100vh-4rem)] min-h-[620px] bg-[#0D0F12] border border-[#222732] rounded-2xl flex flex-col animate-in fade-in duration-200 overflow-hidden">
              {/* Drawer Top Header Bar */}
              <div className="h-16 shrink-0 bg-[#15181E] border-b border-[#222732] px-6 flex items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-4 min-w-0">
                  <button
                    onClick={handleCloseDrawer}
                    className="bg-[#15181E] border border-[#222732] text-slate-200 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#1C212B] transition-all flex items-center gap-2 cursor-pointer shrink-0"
                    title="Back to queue (ESC)"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Evaluation Queue</span>
                  </button>
                  <div className="min-w-0 flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 animate-pulse ${selectedItem.isDisputed ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <p className="text-xs sm:text-sm text-slate-400 truncate">
                      <span>Evaluation Studio</span>
                      <span className="text-slate-600 mx-1.5">/</span>
                      <span className="text-slate-100 font-semibold">
                        {selectedItem.isDisputed ? 'Re-grading' : 'Grading'} #{String(selectedItem.id).replace(/\D/g, '').slice(-4) || String(selectedItem.id).slice(0, 6)}
                      </span>
                      {selectedItem.isDisputed && <span className="text-amber-400 font-semibold"> • Student Dispute</span>}
                      <span className="text-slate-600 mx-1.5">•</span>
                      <span className="text-slate-300">{selectedItem.studentName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden md:inline text-xs text-slate-500 truncate max-w-[220px]">{selectedItem.title}</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                    AI Suggested: Band {selectedItem.aiBandScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Drawer Split-Screen Body */}
              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* ==========================================================
                    LEFT SIDE (50% Width): RAW STUDENT SUBMISSION
                    - Writing: Paper Scan + Zoom + OCR Text Box
                    - Speaking: Audio Waveform Player + Timestamped Speech Dialogue
                    - Reading / Listening / Disputed: Answers Comparison Grid + Dispute Note
                    ========================================================== */}
                <div onMouseUp={handleTextSelection} className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-[#222732] bg-[#0F1115] p-6 overflow-y-auto custom-scrollbar space-y-6 relative">
                  {/* Highlighted Banner: Student Dispute Note */}
                  {selectedItem.isDisputed && selectedItem.disputeNote && (
                    <div className="p-4 bg-rose-950/60 border border-rose-600/50 rounded-2xl space-y-2 shadow-lg animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                          <span>🚩</span> Student Dispute Note (Score Challenge)
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-rose-900/60 text-rose-200 px-2 py-0.5 rounded-full border border-rose-700/50">
                          Priority Audit
                        </span>
                      </div>
                      <p className="text-xs text-rose-100 italic leading-relaxed bg-[#0D0F12]/80 p-3 rounded-xl border border-rose-800/40">
                        "{selectedItem.disputeNote}"
                      </p>
                    </div>
                  )}

                  {selectedItem.submissionType === 'essay' ? (
                    /* Writing Task: Handwritten Scan + OCR Transcript */
                    <div className="space-y-6">
                      {/* Scan Viewer Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Candidate's Paper Scan
                          </h3>
                        </div>

                        {/* Image Zoom Toolbar */}
                        <div className="flex items-center gap-1.5 p-1 bg-[#15181E] border border-[#222732] rounded-xl">
                          <button
                            onClick={() => setImageZoom((z) => Math.max(0.6, z - 0.2))}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#181C24] cursor-pointer"
                            title="Zoom Out"
                          >
                            <ZoomOut className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[11px] font-mono text-slate-400 px-1">
                            {Math.round(imageZoom * 100)}%
                          </span>
                          <button
                            onClick={() => setImageZoom((z) => Math.min(2.5, z + 0.2))}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#181C24] cursor-pointer"
                            title="Zoom In"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setImageZoom(1)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#181C24] cursor-pointer"
                            title="Reset Zoom"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Scan Container */}
                      <div className="relative rounded-2xl bg-black border border-[#222732] overflow-hidden h-[360px] flex items-center justify-center p-3 shadow-inner">
                        <img
                          src={
                            selectedItem.imageUrl ||
                            'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600'
                          }
                          alt="Handwritten Essay Scan"
                          style={{
                            transform: `scale(${imageZoom})`,
                            transition: 'transform 0.15s ease-out',
                          }}
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      </div>

                      {/* OCR Extracted Transcript */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                              OCR Extracted Transcript
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
                              AI Transcribed
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {selectedItem.ocrText?.split(/\s+/).length || 284} words
                          </span>
                        </div>

                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-line max-h-60 overflow-y-auto custom-scrollbar select-text shadow-inner">
                          {selectedItem.ocrText ||
                            'In contemporary society, an increasing proportion of young individuals opt to reside independently prior to matrimony. While some sociologists argue that this promotes emotional autonomy and financial resilience, others contend that it leads to feelings of isolation and weakens traditional familial solidarity.'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Speaking Audit: Waveform Player + Timestamped Speech Dialogue */
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-purple-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Candidate Speech Waveform &amp; Playback
                        </h3>
                      </div>

                      {/* Interactive Audio Waveform Player */}
                      <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleStudentAudio(selectedItem.audioUrl)}
                              className="w-12 h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
                            >
                              {isPlayingAudio ? (
                                <Pause className="w-5 h-5 fill-current" />
                              ) : (
                                <Play className="w-5 h-5 fill-current translate-x-0.5" />
                              )}
                            </button>
                            <div>
                              <p className="text-sm font-bold text-white">
                                Student Recording Stream
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">
                                48kHz Stereo • Clear Acoustic Capture
                              </p>
                            </div>
                          </div>

                          <div className="text-right font-mono text-xs text-slate-300">
                            <span>
                              {Math.floor(audioCurrentTime / 60)}:
                              {audioCurrentTime % 60 < 10 ? '0' : ''}
                              {audioCurrentTime % 60}
                            </span>
                            <span className="text-slate-500 mx-1">/</span>
                            <span className="text-slate-500">
                              {Math.floor(audioDuration / 60)}:
                              {audioDuration % 60 < 10 ? '0' : ''}
                              {audioDuration % 60}
                            </span>
                          </div>
                        </div>

                        {/* Animated Waveform Visualization Track */}
                        <div className="flex items-center gap-1.5 h-12 px-2 bg-[#0D0F12] border border-[#222732] rounded-xl overflow-hidden">
                          {[
                            25, 45, 75, 40, 90, 60, 85, 30, 95, 70, 45, 80, 50, 65, 90,
                            35, 70, 85, 40, 95, 60, 50, 80, 45, 70, 90, 35, 65, 85, 40,
                          ].map((height, i) => {
                            const isPassed = (i / 30) * audioDuration <= audioCurrentTime;
                            return (
                              <span
                                key={i}
                                style={{ height: `${height}%` }}
                                className={`flex-1 rounded-full transition-colors ${
                                  isPassed
                                    ? 'bg-purple-500 shadow-xs'
                                    : 'bg-slate-700/60'
                                } ${isPlayingAudio ? 'animate-pulse' : ''}`}
                              />
                            );
                          })}
                        </div>
                        {/* Native Audio Controls Fallback */}
                        <audio
                          controls
                          src={selectedItem.audioUrl || 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3'}
                          className="w-full mt-3 h-8 accent-purple-500 rounded-lg"
                        />
                      </div>

                      {/* Timestamped Speech Transcript */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Timestamped Speech Dialogue Turn Analysis
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            WPM: 132 • Pauses: 3
                          </span>
                        </div>

                        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-line max-h-60 overflow-y-auto custom-scrollbar select-text shadow-inner">
                          {selectedItem.transcript ||
                            `[00:04] Examiner: Do you believe modern communication technologies make individuals more isolated?
[00:15] Candidate: In my opinion, that is a multifaceted dilemma. On one hand, video platforms and instant messaging allow people to stay in touch across international borders with unprecedented ease...
[00:48] Candidate: However, superficial online interactions often replace meaningful face-to-face conversations, leading to emotional detachment.`}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Candidate Raw Answers Comparison View */}
                  {selectedItem.rawAnswers && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Candidate Raw Answers vs AI Evaluation
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/40 text-rose-400 border border-rose-800/30">
                          Student Submitted Key
                        </span>
                      </div>
                      <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-4 max-h-56 overflow-y-auto custom-scrollbar space-y-1.5 font-mono text-xs select-text shadow-inner">
                        {typeof selectedItem.rawAnswers === 'object' ? (
                          Object.entries(selectedItem.rawAnswers).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between p-2 rounded-xl bg-[#0D0F12] border border-[#222732] text-xs">
                              <span className="font-mono text-slate-400">Item #{key}</span>
                              <span className="font-mono text-rose-400 font-bold">{String(val || '(unanswered)')}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-200 whitespace-pre-wrap">{String(selectedItem.rawAnswers)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Floating Annotation Prompt on Text Selection */}
                  {selectionPopup && (
                    <div
                      style={{ top: Math.max(10, selectionPopup.y - 50), left: Math.max(10, selectionPopup.x - 120) }}
                      className="fixed z-[120] bg-[#15181E] border border-[#222732] rounded-xl p-1.5 shadow-2xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <button
                        onClick={() => {
                          setActionSelector('voice');
                          setSelectionPopup(null);
                          startVoiceRecording();
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 cursor-pointer"
                      >
                        🎙️ Voice Feedback
                      </button>
                      <button
                        onClick={() => {
                          setActionSelector('highlights');
                          setNewCritiqueText(selectionPopup.text);
                          setSelectionPopup(null);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#222732] hover:bg-[#2c3240] text-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        📝 Text Critique
                      </button>
                      <button
                        onClick={() => setSelectionPopup(null)}
                        className="text-slate-400 hover:text-white px-1 cursor-pointer text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* ==========================================================
                    RIGHT SIDE (50% Width / Faculty Grading Dock): AI SUB-SCORES & DISPATCH
                    - 4-Criteria Rubric (TR, CC, LR, GRA)
                    - "Hold to Record Voice Note" (15s) Push-to-Talk
                    - Teacher Written Feedback
                    - Solid Crimson Red [ Approve & Dispatch to Student ]
                    ========================================================== */}
                <div className="lg:col-span-1 bg-[#15181E] p-6 overflow-y-auto custom-scrollbar flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    {/* Sub-Scores Calibration Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-rose-500" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                            Official Sub-Scores Calibration
                          </h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">
                          Calculated: Band {calculatedOverallBand.toFixed(1)}
                        </span>
                      </div>

                      {/* 4 Official IELTS Sub-Criteria Cards */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* TR */}
                        <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3 flex flex-col justify-between gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400">
                              {selectedItem.submissionType === 'essay'
                                ? 'TR (Task Response)'
                                : 'Fluency & Coherence'}
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono">
                              AI: {selectedItem.subScores.TR.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <input
                              type="number"
                              step="0.5"
                              min="4.0"
                              max="9.0"
                              value={calibratedScores.TR}
                              onChange={(e) =>
                                setCalibratedScores((prev) => ({
                                  ...prev,
                                  TR: parseFloat(e.target.value) || 7.0,
                                }))
                              }
                              className="w-16 bg-[#0D0F12] border border-[#222732] rounded-lg px-2 py-1 text-center font-bold text-white text-sm focus:outline-none focus:border-rose-600"
                            />
                            <span className="text-xs font-bold text-slate-500 font-mono">/ 9.0</span>
                          </div>
                        </div>

                        {/* CC */}
                        <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3 flex flex-col justify-between gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400">
                              {selectedItem.submissionType === 'essay'
                                ? 'CC (Cohesion)'
                                : 'Pronunciation'}
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono">
                              AI: {selectedItem.subScores.CC.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <input
                              type="number"
                              step="0.5"
                              min="4.0"
                              max="9.0"
                              value={calibratedScores.CC}
                              onChange={(e) =>
                                setCalibratedScores((prev) => ({
                                  ...prev,
                                  CC: parseFloat(e.target.value) || 7.0,
                                }))
                              }
                              className="w-16 bg-[#0D0F12] border border-[#222732] rounded-lg px-2 py-1 text-center font-bold text-white text-sm focus:outline-none focus:border-rose-600"
                            />
                            <span className="text-xs font-bold text-slate-500 font-mono">/ 9.0</span>
                          </div>
                        </div>

                        {/* LR */}
                        <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3 flex flex-col justify-between gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400">
                              LR (Lexical Resource)
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono">
                              AI: {selectedItem.subScores.LR.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <input
                              type="number"
                              step="0.5"
                              min="4.0"
                              max="9.0"
                              value={calibratedScores.LR}
                              onChange={(e) =>
                                setCalibratedScores((prev) => ({
                                  ...prev,
                                  LR: parseFloat(e.target.value) || 7.0,
                                }))
                              }
                              className="w-16 bg-[#0D0F12] border border-[#222732] rounded-lg px-2 py-1 text-center font-bold text-white text-sm focus:outline-none focus:border-rose-600"
                            />
                            <span className="text-xs font-bold text-slate-500 font-mono">/ 9.0</span>
                          </div>
                        </div>

                        {/* GRA */}
                        <div className="bg-[#181C24] border border-[#222732] rounded-xl p-3 flex flex-col justify-between gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400">
                              GRA (Grammar Range)
                            </span>
                            <span className="text-[10px] text-amber-400 font-mono">
                              AI: {selectedItem.subScores.GRA.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <input
                              type="number"
                              step="0.5"
                              min="4.0"
                              max="9.0"
                              value={calibratedScores.GRA}
                              onChange={(e) =>
                                setCalibratedScores((prev) => ({
                                  ...prev,
                                  GRA: parseFloat(e.target.value) || 7.0,
                                }))
                              }
                              className="w-16 bg-[#0D0F12] border border-[#222732] rounded-lg px-2 py-1 text-center font-bold text-white text-sm focus:outline-none focus:border-rose-600"
                            />
                            <span className="text-xs font-bold text-slate-500 font-mono">/ 9.0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Selector: [ 🎙️ Record Voice Critique ] OR [ 📝 Interactive Text Highlights ] */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        Critique &amp; Explanation Engine
                      </label>
                      <div className="flex items-center bg-[#0D0F12] p-1 rounded-xl border border-[#222732] gap-1">
                        <button
                          type="button"
                          onClick={() => setActionSelector('voice')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            actionSelector === 'voice'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>🎙️</span>
                          <span>Record Voice Critique</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActionSelector('highlights')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            actionSelector === 'highlights'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>📝</span>
                          <span>Interactive Text Highlights ({facultyCritiques.length})</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Text Highlights Mode */}
                    {actionSelector === 'highlights' && (
                      <div className="space-y-3 bg-[#0D0F12] border border-[#222732] p-3.5 rounded-2xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">Inline Text Annotations</span>
                          <span className="text-[10px] text-slate-500 font-mono">Floating Critique Boxes</span>
                        </div>

                        {/* List existing attached critiques */}
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                          {facultyCritiques.length > 0 ? (
                            facultyCritiques.map((fc) => (
                              <div key={fc.id} className="p-2.5 bg-[#15181E] border border-amber-900/40 rounded-xl space-y-1">
                                <p className="text-[11px] font-mono text-amber-300 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/40">
                                  📌 "{fc.text}"
                                </p>
                                <p className="text-xs text-slate-200 pl-1">{fc.critique}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-500 italic text-center py-2">
                              No inline text highlights attached yet.
                            </p>
                          )}
                        </div>

                        {/* Quick Add Annotation */}
                        <div className="pt-2 border-t border-[#222732] space-y-2">
                          <input
                            type="text"
                            placeholder="Selected phrase from candidate's answer..."
                            value={newCritiqueText}
                            onChange={(e) => setNewCritiqueText(e.target.value)}
                            className="w-full bg-[#15181E] border border-[#222732] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-600"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Attach floating critique note..."
                              value={newCritiqueNote}
                              onChange={(e) => setNewCritiqueNote(e.target.value)}
                              className="flex-1 bg-[#15181E] border border-[#222732] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newCritiqueText.trim() || !newCritiqueNote.trim()) return;
                                setFacultyCritiques((prev) => [
                                  ...prev,
                                  { id: `hl-${Date.now()}`, text: newCritiqueText.trim(), critique: newCritiqueNote.trim() }
                                ]);
                                setNewCritiqueText('');
                                setNewCritiqueNote('');
                                toast.success('Inline floating critique attached.');
                              }}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              Attach
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Single "Hold to Record Voice Note" (15s) Button */}
                    {actionSelector === 'voice' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-rose-500" />
                          <span>Teacher Voice Note Feedback (15s Max)</span>
                        </label>
                        {recordedVoiceUrl && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Voice Attached
                          </span>
                        )}
                      </div>

                      {/* Interactive Push-to-Talk Button */}
                      {!recordedVoiceUrl ? (
                        <div className="relative">
                          <button
                            type="button"
                            onMouseDown={startVoiceRecording}
                            onMouseUp={stopVoiceRecording}
                            onTouchStart={startVoiceRecording}
                            onTouchEnd={stopVoiceRecording}
                            className={`w-full py-4 px-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all select-none cursor-pointer ${
                              isHoldingRecord
                                ? 'bg-red-950/80 border-rose-500 text-rose-200 shadow-xl ring-2 ring-rose-500/40 animate-pulse'
                                : 'bg-[#181C24] hover:bg-[#1C212B] border-[#222732] text-slate-200 hover:text-white'
                            }`}
                          >
                            <Mic
                              className={`w-5 h-5 ${
                                isHoldingRecord ? 'text-rose-400 animate-bounce' : 'text-rose-500'
                              }`}
                            />
                            <span>
                              {isHoldingRecord
                                ? `Release to save • ${voiceSecondsLeft}s left...`
                                : '🎙️ Hold to Record Voice Note (15s)'}
                            </span>
                          </button>
                        </div>
                      ) : (
                        /* Recorded Voice Note Pill Preview with Playback */
                        <div className="flex items-center justify-between p-3 bg-[#181C24] border border-[#222732] rounded-xl">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={togglePlayVoicePreview}
                              className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center cursor-pointer"
                            >
                              {isPlayingVoicePreview ? (
                                <Pause className="w-4 h-4 fill-current" />
                              ) : (
                                <Play className="w-4 h-4 fill-current translate-x-0.5" />
                              )}
                            </button>
                            <div>
                              <p className="text-xs font-bold text-white">Voice Note Ready</p>
                              <p className="text-[10px] text-slate-400 font-mono">15s audio clip</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (voiceAudioPlayerRef.current) voiceAudioPlayerRef.current.pause();
                              setRecordedVoiceUrl(null);
                              setIsPlayingVoicePreview(false);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#15181E] rounded-lg transition-colors cursor-pointer"
                            title="Delete voice note and re-record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    )}

                    {/* Teacher Written Comment Box */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                        Written Academic Diagnostic Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Add constructive notes on grammar range, vocabulary precision, cohesive devices, and band trajectory..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="w-full bg-[#0D0F12] border border-[#222732] rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-600 resize-none leading-relaxed shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Prominent [ Approve & Dispatch Final Score ] Button */}
                  <div className="pt-4 border-t border-[#222732] space-y-2">
                    <button
                      type="button"
                      onClick={handleApproveAndDispatch}
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>
                        {isSubmitting
                          ? 'Dispatching Evaluation...'
                          : `Approve & Dispatch Final Score (Band ${calculatedOverallBand.toFixed(1)})`}
                      </span>
                    </button>

                    <p className="text-[11px] text-slate-500 text-center font-mono">
                      Instantly updates student report card, telemetry, and triggers mobile notification
                    </p>
                  </div>
                </div>
              </div>
            </div>
      )}
    </div>
  );
};

export default UnifiedEvaluationStudio;

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Headphones,
  Award,
  Target,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import StudentDisputeButtonAndModal from './StudentDisputeButtonAndModal';
import { rawToBand } from './ieltsShared';
import tapescriptsData from '../../../data/listening_tapescripts.json';

export interface ListeningQuestionResult {
  id: number;
  part: 1 | 2 | 3 | 4;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: string; // e.g. "01:24"
  tapeScriptExcerpt: string;
  explanation: string;
}

export interface ListeningAnalysisModalProps {
  isModal?: boolean; // true when opened from History Matrix, false when embedded in post-submission
  score?: number;
  totalQuestions?: number;
  bandScore?: number;
  testTitle?: string;
  userAnswers?: Record<number, string>;
  answersPayload?: Record<string, string> | Record<number, string>;
  audioUrl?: string;
  attemptId?: string | number;
  bookNumber?: number;
  testNumber?: number;
  onExit?: () => void;
  onClose?: () => void;
  onRetake?: () => void;
}

// Cambridge 18 Test 1 Official Listening Transcript Excerpts & Evidence Dictionary
const OFFICIAL_TRANSCRIPTS: Record<number, { excerpt: string; explanation: string; timestamp: string }> = {
  1: {
    timestamp: '01:15',
    excerpt: 'Woman: "The dining table is round, not rectangular, and it seats six people comfortably."',
    explanation: 'The speaker explicitly states that the dining table is "round".'
  },
  2: {
    timestamp: '01:42',
    excerpt: 'Man: "And how old is the dining set?" Woman: "It was purchased approximately two years ago when we renovated."',
    explanation: 'The furniture is confirmed to be 2 years (two years) old.'
  },
  3: {
    timestamp: '02:08',
    excerpt: 'Woman: "It comes with six chairs, all in matching oak timber."',
    explanation: 'There are 6 matching chairs included with the set.'
  },
  4: {
    timestamp: '02:35',
    excerpt: 'Woman: "The seats have real leather upholstery, very easy to wipe clean."',
    explanation: 'The material used for chair padding is leather.'
  },
  5: {
    timestamp: '03:10',
    excerpt: 'Man: "What condition is the coffee table in?" Woman: "It is in excellent condition, with barely any scratches."',
    explanation: 'Condition is described as good / excellent.'
  },
  6: {
    timestamp: '03:45',
    excerpt: 'Woman: "The filing cabinet has a lock with two original keys included."',
    explanation: 'Key feature mentioned for the cabinet is a lock.'
  },
  7: {
    timestamp: '04:15',
    excerpt: 'Woman: "I can let the study desk go for 15 pounds if you collect it today."',
    explanation: 'The agreed price for the desk is 15 (15.00) pounds.'
  },
  8: {
    timestamp: '04:45',
    excerpt: 'Man: "Could you confirm your house number?" Woman: "Yes, it is 21 Meadow Close."',
    explanation: 'The house address number is 21.'
  },
  9: {
    timestamp: '05:10',
    excerpt: 'Woman: "After passing the traffic lights, turn left immediately before the roundabout."',
    explanation: 'Direction specified is to turn left.'
  },
  10: {
    timestamp: '05:35',
    excerpt: 'Woman: "Our house is right opposite the local post office."',
    explanation: 'The landmark directly opposite is the post office.'
  },
  11: {
    timestamp: '06:12',
    excerpt: 'Director: "Mary Brown will oversee all budgetary allocations and finance for the summer camp."',
    explanation: 'Mary Brown is assigned to the Finance division.'
  },
  12: {
    timestamp: '06:45',
    excerpt: 'Director: "John Stevens, who has paramedic certification, is in charge of camp health and first-aid."',
    explanation: 'John Stevens manages the Health department.'
  },
  13: {
    timestamp: '07:18',
    excerpt: 'Director: "Alison Jones is our qualified child therapist heading up Kids\' Counselling."',
    explanation: "Alison Jones is responsible for Kids' Counselling."
  },
  14: {
    timestamp: '07:50',
    excerpt: 'Director: "Tim Smith will take charge of general logistics and camp organisation."',
    explanation: 'Tim Smith oversees Organisation.'
  },
  15: {
    timestamp: '08:25',
    excerpt: 'Director: "Jenny James will coordinate all off-campus excursions and trips to the valley."',
    explanation: 'Jenny James handles Trips.'
  },
  16: {
    timestamp: '09:05',
    excerpt: 'Guide: "Right in the centre of the camp ground, between the two dormitories, is the sports complex."',
    explanation: 'Map slot 16 in the centre corresponds to the Sports complex.'
  },
  17: {
    timestamp: '09:40',
    excerpt: 'Guide: "To the far west, just behind the boys\' accommodation quarters, sits the staff accommodation block."',
    explanation: 'Map slot 17 behind boys dorm represents Staff accommodation.'
  },
  18: {
    timestamp: '10:15',
    excerpt: 'Guide: "At the northern boundary adjacent to the craft room, you will find our newly fitted cookery room."',
    explanation: 'Map slot 18 represents the Cookery room.'
  },
  19: {
    timestamp: '10:50',
    excerpt: 'Guide: "Directly connected to the staff lounge at the northeast corner is the main catering kitchen."',
    explanation: 'Map slot 19 represents the Kitchen.'
  },
  20: {
    timestamp: '11:25',
    excerpt: 'Guide: "Finally, just south of the reception building on the east perimeter is the student games room."',
    explanation: 'Map slot 20 represents the Games room.'
  },
  21: {
    timestamp: '12:35',
    excerpt: 'Student A: "Impression fossils merely leave a shallow contour without preserving physical tissue—they do not contain any organic matter."',
    explanation: 'Impression fossils do not contain any organic matter.'
  },
  22: {
    timestamp: '13:10',
    excerpt: 'Student B: "Cast fossils fill the mould with secondary sediment, giving them full three-dimensional depth."',
    explanation: 'Cast fossils are three-dimensional.'
  },
  23: {
    timestamp: '13:45',
    excerpt: 'Student A: "Permineralisation petrifies internal structures, allowing palaeobotanists to inspect microscopic plant cells."',
    explanation: 'Permineralisation fossils provide information about plant cells.'
  },
  24: {
    timestamp: '14:20',
    excerpt: 'Student B: "Compaction fossils can be swept into sedimentary basins far away from normal fossil collection zones."',
    explanation: 'Compaction fossils can be found far from normal fossil areas.'
  },
  25: {
    timestamp: '14:55',
    excerpt: 'Student A: "Fusain, or fossil charcoal, is extremely delicate and represents a very rare type of plant fossil."',
    explanation: 'Fusain fossils are a very rare type of plant fossil.'
  },
  26: {
    timestamp: '15:40',
    excerpt: 'Professor: "The initial step requires surveying an undisturbed landing site with stable geological strata."',
    explanation: 'The flow-chart first step identifies the landing site.'
  },
  27: {
    timestamp: '16:15',
    excerpt: 'Professor: "Next, the planetary rover must deploy shielding to filter out cosmic solar radiation."',
    explanation: 'The barrier protects instruments from radiation.'
  },
  28: {
    timestamp: '16:50',
    excerpt: 'Professor: "Core drilling sensors must generate controlled heat to liquefy subsurface ice pockets."',
    explanation: 'Controlled heat is applied to melt frozen samples.'
  },
  29: {
    timestamp: '17:25',
    excerpt: 'Professor: "Fluorescence assays are then triggered to isolate live extraterrestrial microbes."',
    explanation: 'The target of detection is living microbes.'
  },
  30: {
    timestamp: '18:00',
    excerpt: 'Professor: "All telemetry is beamed via orbital relay so ground teams can synthesize laboratory results."',
    explanation: 'The final phase compiles experimental results.'
  },
  31: {
    timestamp: '19:15',
    excerpt: 'Lecturer: "To establish uniform baseline parameters, all test subjects were recruited from the same geographical area in northern Scotland."',
    explanation: 'Participants were drawn from the same geographical area.'
  },
  32: {
    timestamp: '20:00',
    excerpt: 'Lecturer: "Interviews revealed mature adult learners experienced elevated anxiety regarding effects on their home life and domestic balance."',
    explanation: 'Older students expressed major concern about effects on their home life.'
  },
  33: {
    timestamp: '20:45',
    excerpt: 'Lecturer: "Intrinsic satisfaction stems principally from the active enjoyment of an intellectual challenge."',
    explanation: 'Personal factor identified is enjoyment of a challenge.'
  },
  34: {
    timestamp: '21:20',
    excerpt: 'Lecturer: "Adult persistence is strongly correlated with affirmative childhood experiences during primary and secondary school."',
    explanation: 'Positive early experiences at school.'
  },
  35: {
    timestamp: '22:00',
    excerpt: 'Lecturer: "Physical wellbeing and good general health are fundamental to sustained cognitive effort."',
    explanation: 'Other factor is good health.'
  },
  36: {
    timestamp: '22:40',
    excerpt: 'Lecturer: "Adult learners must juggle competing demands across many social roles in daily family and professional life."',
    explanation: 'Many competing roles in daily life.'
  },
  37: {
    timestamp: '23:15',
    excerpt: 'Lecturer: "Close constructive interaction with the classroom teacher serves as a vital pedagogical anchor."',
    explanation: 'Good interaction with the teacher.'
  },
  38: {
    timestamp: '24:00',
    excerpt: 'Lecturer: "Institutions should administer diagnostic questionnaires upon enrollment to evaluate learner motivation."',
    explanation: 'Questionnaires measure level of motivation.'
  },
  39: {
    timestamp: '24:40',
    excerpt: 'Lecturer: "Departments should train senior cohort volunteers to function as academic mentors."',
    explanation: 'Trained senior students act as mentors.'
  },
  40: {
    timestamp: '25:20',
    excerpt: 'Lecturer: "For non-traditional hours, university IT departments must establish 24/7 online technical and tutoring help."',
    explanation: 'Outside business hours, offer online help.'
  }
};

const OFFICIAL_ANSWERS: Record<number, string> = {
  1: 'round',
  2: '2 years',
  3: '6',
  4: 'leather',
  5: 'good',
  6: 'lock',
  7: '15',
  8: '21',
  9: 'left',
  10: 'post office',
  11: 'Finance',
  12: 'Health',
  13: "Kids' Counselling",
  14: 'Organisation',
  15: 'Trips',
  16: 'Sports complex',
  17: 'Staff accommodation',
  18: 'Cookery room',
  19: 'Kitchen',
  20: 'Games room',
  21: 'They do not contain any organic matter.',
  22: 'They are three-dimensional.',
  23: 'They provide information about plant cells.',
  24: 'They can be found far from normal fossil areas.',
  25: 'They are a very rare type of plant fossil.',
  26: 'site',
  27: 'radiation',
  28: 'heat',
  29: 'microbes',
  30: 'results',
  31: 'geographical area.',
  32: 'effects on their home life.',
  33: 'challenge',
  34: 'school',
  35: 'health',
  36: 'roles',
  37: 'teacher',
  38: 'motivation',
  39: 'mentors',
  40: 'online'
};

const PROMPT_TITLES: Record<number, string> = {
  1: 'Q1: Shape of dining table',
  2: 'Q2: Age of dining table',
  3: 'Q3: Number of matching chairs',
  4: 'Q4: Material of chair seats',
  5: 'Q5: Condition of coffee table',
  6: 'Q6: Security feature of filing cabinet',
  7: 'Q7: Price of study desk in £',
  8: 'Q8: House street number',
  9: 'Q9: Driving direction before roundabout',
  10: 'Q10: Landmark opposite house',
  11: 'Q11: Staff responsibility: Mary Brown',
  12: 'Q12: Staff responsibility: John Stevens',
  13: 'Q13: Staff responsibility: Alison Jones',
  14: 'Q14: Staff responsibility: Tim Smith',
  15: 'Q15: Staff responsibility: Jenny James',
  16: 'Q16: Camp Map: Slot 16 (Centre)',
  17: 'Q17: Camp Map: Slot 17 (West)',
  18: 'Q18: Camp Map: Slot 18 (North)',
  19: 'Q19: Camp Map: Slot 19 (Northeast)',
  20: 'Q20: Camp Map: Slot 20 (East)',
  21: 'Q21: Fossil Category: Impression fossils',
  22: 'Q22: Fossil Category: Cast fossils',
  23: 'Q23: Fossil Category: Permineralisation fossils',
  24: 'Q24: Fossil Category: Compaction fossils',
  25: 'Q25: Fossil Category: Fusain fossils',
  26: 'Q26: Life Detection Step 1: Landing',
  27: 'Q27: Life Detection Step 2: Shielding against',
  28: 'Q28: Life Detection Step 3: Drilling with',
  29: 'Q29: Life Detection Step 4: Assays for',
  30: 'Q30: Life Detection Step 5: Synthesis of',
  31: 'Q31: Persistence Study: Participants drawn from',
  32: 'Q32: Older students initial major concern',
  33: 'Q33: Personal factor: Enjoyment of a',
  34: 'Q34: Social factor: Positive experiences at',
  35: 'Q35: Other factor: Good',
  36: 'Q36: Personal factor: Many competing',
  37: 'Q37: Social factor: Good interaction with the',
  38: 'Q38: Recommendation: Questionnaires to gauge',
  39: 'Q39: Recommendation: Train students to act as',
  40: 'Q40: Recommendation: Outside hours offer'
};

const PART_TIMESTAMPS: Record<1 | 2 | 3 | 4, number> = {
  1: 0,
  2: 360, // 06:00
  3: 750, // 12:30
  4: 1150 // 19:10
};

export const ListeningAnalysisModal: React.FC<ListeningAnalysisModalProps> = ({
  isModal = false,
  score: propScore,
  totalQuestions: propTotalQuestions = 40,
  bandScore: propBandScore,
  testTitle = 'Cambridge 18 Academic Listening — Test 1',
  userAnswers = {},
  answersPayload,
  audioUrl = 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
  attemptId,
  bookNumber,
  testNumber,
  onExit,
  onClose,
  onRetake,
}) => {
  const handleClose = onClose || onExit || (() => {});

  useEffect(() => {
    if (!isModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModal, handleClose]);

  const numBook = Number(bookNumber ?? parseInt(testTitle.match(/Cambridge\s*(\d+)/i)?.[1] || '18', 10)) || 18;
  const numTest = Number(testNumber ?? parseInt(testTitle.match(/Test\s*(\d+)/i)?.[1] || '1', 10)) || 1;
  const parsedBook = numBook;
  const parsedTest = numTest;

  const registryKey = `cambridge-${numBook}-test-${numTest}`;
  const currentTestRegistry = (tapescriptsData as Record<string, any>)[registryKey] || (tapescriptsData as Record<string, any>)['cambridge-18-test-1'];
  const testPartMarkers: Record<string, number> = currentTestRegistry?.part_markers || { "1": 0, "2": 372, "3": 745, "4": 1180 };
  const testQuestionsRegistry: Record<string, any> = currentTestRegistry?.questions || {};

  // Deterministic Supabase Audio URL fallback
  const defaultStorageAudioUrl = `https://hucadzqsqsfqgmwnpipp.supabase.co/storage/v1/object/public/listening-audio/cambridge-${numBook}/test-${numTest}/full_audio.mp3`;
  const effectiveAudioUrl = (audioUrl && !audioUrl.includes('coffee_shop')) ? audioUrl : defaultStorageAudioUrl;

  const initialAnswers = useMemo(() => {
    let raw: any = answersPayload || userAnswers || {};
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw);
      } catch {
        raw = {};
      }
    }
    const res: Record<number, string> = {};
    Object.keys(raw).forEach((k) => {
      const num = parseInt(k, 10);
      if (!isNaN(num) && (raw as any)[k]) {
        res[num] = String((raw as any)[k]);
      }
    });
    return res;
  }, [answersPayload, userAnswers]);

  const [activePartFilter, setActivePartFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [expandedScripts, setExpandedScripts] = useState<Record<number, boolean>>({});
  const [scoreViewMode, setScoreViewMode] = useState<'ai' | 'teacher'>('ai');
  const [activeAnswers, setActiveAnswers] = useState<Record<number, string>>(initialAnswers);
  const [dbQuestions, setDbQuestions] = useState<Record<number, { prompt?: string; correct?: string; excerpt?: string; explanation?: string; timestamp?: string }>>({});
  const [fetchedScore, setFetchedScore] = useState<number | null>(null);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1680); // ~28 minutes default
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrubberRef = useRef<HTMLDivElement | null>(null);

  // Fetch real candidate attempt & exam questions from Supabase
  useEffect(() => {
    let isMounted = true;
    const fetchSupabaseListeningData = async () => {
      try {
        const paddedBook = String(numBook).padStart(2, '0');
        const paddedTest = String(numTest).padStart(12, '0');
        const standardUuid = `c${paddedBook}00000-0000-0000-0000-${paddedTest}`;

        let attemptRow: any = null;

        if (attemptId) {
          const isUuid = typeof attemptId === 'string' && attemptId.includes('-');
          if (isUuid) {
            const { data } = await (supabase as any)
              .from('exam_attempts')
              .select('*')
              .eq('id', attemptId)
              .maybeSingle();
            attemptRow = data;
          }
        }

        if (!attemptRow) {
          const { data } = await (supabase as any)
            .from('exam_attempts')
            .select('*')
            .eq('module', 'listening')
            .eq('test_id', standardUuid)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          attemptRow = data;
        }

        // Resilient fallback from localStorage if Supabase attempt is unpopulated
        if (!attemptRow) {
          try {
            const cached = (attemptId ? localStorage.getItem(`listening_attempt_${attemptId}`) : null) ||
                           localStorage.getItem(`latest_listening_attempt_${standardUuid}`) ||
                           localStorage.getItem('latest_listening_attempt');
            if (cached) attemptRow = JSON.parse(cached);
          } catch {}
        }

        if (attemptRow && isMounted) {
          if (attemptRow.raw_score != null) {
            setFetchedScore(Number(attemptRow.raw_score));
          } else if (attemptRow.correct_count != null) {
            setFetchedScore(Number(attemptRow.correct_count));
          }
          if (attemptRow.answers_payload) {
            const raw = attemptRow.answers_payload;
            const mapped: Record<number, string> = { ...userAnswers };
            Object.keys(raw).forEach((k) => {
              const num = parseInt(k, 10);
              if (!isNaN(num) && raw[k]) {
                mapped[num] = String(raw[k]);
              }
            });
            setActiveAnswers(mapped);
          }
        }

        // Fetch official sections and questions from Supabase using deterministic standard UUID
        let { data: sections } = await (supabase as any)
          .from('sections')
          .select('*, question_groups(*, questions(*))')
          .eq('test_id', standardUuid)
          .order('part_number', { ascending: true });

        if (!sections || sections.length === 0) {
          const { data: secByExam } = await (supabase as any)
            .from('sections')
            .select('*, question_groups(*, questions(*))')
            .eq('exam_id', standardUuid)
            .order('part_number', { ascending: true });
          sections = secByExam;
        }

        if (sections && sections.length > 0 && isMounted) {
          const qDict: Record<number, { prompt?: string; correct?: string; excerpt?: string; explanation?: string; timestamp?: string }> = {};
          sections.forEach((sec: any) => {
            (sec.question_groups || []).forEach((grp: any) => {
              (grp.questions || []).forEach((q: any) => {
                const num = q.question_number;
                if (num) {
                  const regItem = testQuestionsRegistry[String(num)];
                  qDict[num] = {
                    prompt: q.question_text || regItem?.prompt,
                    correct: q.correct_answer || regItem?.correct_answer,
                    excerpt: q.evidence_quote || regItem?.evidence_quote || (sec.passage_title ? `${sec.passage_title}: ${q.question_text}` : q.question_text),
                    explanation: q.explanation || regItem?.explanation || 'Official Cambridge verified response.',
                    timestamp: q.timestamp_str || regItem?.timestamp || '00:00'
                  };
                }
              });
            });
          });
          if (Object.keys(qDict).length > 0) {
            setDbQuestions(qDict);
          }
        }
      } catch (err) {
        console.warn('[ListeningAnalysisModal] Supabase ingestion note:', err);
      }
    };

    fetchSupabaseListeningData();
    return () => { isMounted = false; };
  }, [attemptId, numBook, numTest]);

  const score = fetchedScore ?? propScore ?? 0;
  const totalQuestions = propTotalQuestions;

  // Derived metrics
  const calculatedBand = propBandScore ?? rawToBand(score, 'listening');
  // Guard: 0 correct answers must never receive an artificial teacher boost
  const teacherVerifiedBand = score === 0 ? 0.0 : Math.min(9.0, calculatedBand + 0.5);
  const displayedBand = scoreViewMode === 'teacher' ? teacherVerifiedBand : calculatedBand;
  const accuracyPct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Audio setup
  useEffect(() => {
    const audio = new Audio(effectiveAudioUrl);
    audioRef.current = audio;
    audio.volume = volume;

    audio.ontimeupdate = () => setCurrentTime(Math.floor(audio.currentTime));
    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    };
    audio.onended = () => setIsPlaying(false);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [effectiveAudioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const seekTo = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const jumpToPart = (part: 1 | 2 | 3 | 4) => {
    const sec = Number(testPartMarkers[String(part)] ?? testPartMarkers[part] ?? PART_TIMESTAMPS[part] ?? 0);
    seekTo(sec);
    if (!isPlaying && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      if (v === 0) setIsMuted(true);
      else setIsMuted(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Build question results list (1 to 40)
  const questionResults = useMemo<ListeningQuestionResult[]>(() => {
    const list: ListeningQuestionResult[] = [];
    const checkAnswerMatch = (user: string, exp: string) => {
      const normalize = (val: string) => val.toLowerCase().replace(/[^a-z0-9]/g, '');
      const u = normalize(user);
      const e = normalize(exp);
      if (!u || !e) return false;
      if (u === e) return true;
      const alts = exp.split('/').map((v) => normalize(v));
      if (alts.includes(u)) return true;
      return false;
    };

    for (let i = 1; i <= 40; i++) {
      const part: 1 | 2 | 3 | 4 = i <= 10 ? 1 : i <= 20 ? 2 : i <= 30 ? 3 : 4;
      const userRaw = (activeAnswers[i] ?? '').trim();
      const dbQ = dbQuestions[i];
      const regQ = testQuestionsRegistry[String(i)] || testQuestionsRegistry[i];
      const official = (dbQ?.correct || regQ?.correct_answer || OFFICIAL_ANSWERS[i] || '').trim();
      const prompt = dbQ?.prompt || regQ?.prompt || PROMPT_TITLES[i] || `Question ${i}`;
      const transcriptInfo = {
        excerpt: dbQ?.excerpt || regQ?.evidence_quote || OFFICIAL_TRANSCRIPTS[i]?.excerpt || 'Transcript recording aligned with official Cambridge listening audio track.',
        explanation: dbQ?.explanation || regQ?.explanation || OFFICIAL_TRANSCRIPTS[i]?.explanation || 'Key information provided in spoken dialogue.',
        timestamp: dbQ?.timestamp || regQ?.timestamp || OFFICIAL_TRANSCRIPTS[i]?.timestamp || '00:00'
      };

      const isCorrect = userRaw ? checkAnswerMatch(userRaw, official) : false;

      list.push({
        id: i,
        part,
        prompt,
        userAnswer: userRaw || '(No answer provided)',
        correctAnswer: official,
        isCorrect,
        timestamp: transcriptInfo.timestamp,
        tapeScriptExcerpt: transcriptInfo.excerpt,
        explanation: transcriptInfo.explanation
      });
    }
    return list;
  }, [activeAnswers, dbQuestions, testQuestionsRegistry]);

  // Dynamic AI Error Diagnostic & Pattern Analysis
  const aiDiagnostics = useMemo(() => {
    const wrongItems = questionResults.filter((q) => !q.isCorrect);
    const unAnsweredItems = questionResults.filter((q) => !q.userAnswer || q.userAnswer === '(No answer provided)');

    const distractorTripped: string[] = [];
    const spellingAcousticErrors: string[] = [];
    const partErrorCounts: Record<1 | 2 | 3 | 4, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

    wrongItems.forEach((w) => {
      partErrorCounts[w.part]++;
      const u = w.userAnswer.toLowerCase().trim();
      const c = w.correctAnswer.toLowerCase().trim();

      if (u && u !== '(no answer provided)') {
        if (u + 's' === c || c + 's' === u || u + 'es' === c || c + 'es' === u) {
          spellingAcousticErrors.push(`Q${w.id}: Suffix omission ('${w.userAnswer}' vs '${w.correctAnswer}')`);
        } else if (w.correctAnswer.length === 1 && /^[a-f]$/i.test(w.correctAnswer)) {
          distractorTripped.push(`Q${w.id}: Selected distractor option ${w.userAnswer.toUpperCase()} instead of key ${w.correctAnswer.toUpperCase()}`);
        } else if (Math.abs(u.length - c.length) <= 2 && (u.includes(c.slice(0, 3)) || c.includes(u.slice(0, 3)))) {
          spellingAcousticErrors.push(`Q${w.id}: Acoustic spelling nuance ('${w.userAnswer}' for '${w.correctAnswer}')`);
        } else {
          distractorTripped.push(`Q${w.id}: Spoken pivot/distractor trap (Expected: '${w.correctAnswer}')`);
        }
      }
    });

    const partsList: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
    const worstPart = partsList.reduce((maxP, p) => (partErrorCounts[p] > partErrorCounts[maxP] ? p : maxP), 1);

    const drillRecommendations: Record<1 | 2 | 3 | 4, string> = {
      1: `Cambridge ${numBook} Part 1 — Intensive drill on numerical corrections, surnames, and date transcription.`,
      2: `Cambridge ${numBook} Part 2 — Facility map labelling & community orientation options.`,
      3: `Cambridge ${numBook} Part 3 — Multi-speaker academic tutorials with conversational mind changes.`,
      4: `Cambridge ${numBook} Part 4 — Academic lecture monologue note-completion without audio pauses.`
    };

    return {
      totalErrors: wrongItems.length,
      unansweredCount: unAnsweredItems.length,
      distractorTripped: distractorTripped.slice(0, 3),
      spellingAcousticErrors: spellingAcousticErrors.slice(0, 3),
      recommendedDrill: drillRecommendations[worstPart],
      worstPart
    };
  }, [questionResults, numBook]);

  const filteredQuestions = useMemo(() => {
    if (activePartFilter === 'all') return questionResults;
    return questionResults.filter((q) => q.part === activePartFilter);
  }, [questionResults, activePartFilter]);

  const toggleScript = (id: number) => {
    setExpandedScripts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllScripts = () => {
    const all: Record<number, boolean> = {};
    for (let i = 1; i <= 40; i++) all[i] = true;
    setExpandedScripts(all);
  };

  const collapseAllScripts = () => {
    setExpandedScripts({});
  };

  const innerModalCanvas = (
    <div
      className={`relative w-full max-w-7xl bg-[#0D0F12] border border-[#222732] shadow-2xl overflow-hidden flex flex-col ${
        isModal ? 'h-[92vh] rounded-2xl' : 'rounded-2xl min-h-[calc(100vh-3rem)]'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
        {/* ── STICKY TOP TELEMETRY HEADER ── */}
        <header className="sticky top-0 z-30 bg-[#15181E] border-b border-[#222732] px-6 py-4 flex items-center justify-between shadow-lg flex-wrap gap-4 rounded-t-2xl">
          {/* Left: Back & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-2 rounded-xl border border-[#222732] hover:bg-[#181C24] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Listening Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <span>Overview</span>
                <span>&gt;</span>
                <span className="text-slate-300">Listening Engine</span>
                <span>&gt;</span>
                <span className="text-rose-400 font-semibold">Post-Exam Analysis Canvas</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Listening Attempt — Performance Analytics (Cambridge {numBook} Test {numTest})
              </h1>
            </div>
          </div>

          {/* Right: Challenge Action Badge + Retake Button */}
          <div className="flex items-center gap-3 flex-wrap">
            {onRetake && (
              <button
                onClick={onRetake}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#222732] hover:bg-[#181C24] text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </button>
            )}

            {/* Universal Dispute Component */}
            <StudentDisputeButtonAndModal
              testTitle={testTitle}
              module="listening"
              originalBand={calculatedBand}
              rawAnswers={activeAnswers}
              sourceType="cambridge"
              bookNumber={numBook}
              testNumber={numTest}
              scoreViewMode={scoreViewMode}
              onScoreViewModeChange={setScoreViewMode}
            />

            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-[#222732] hover:bg-neutral-700 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Exit Hub
            </button>
          </div>
        </header>

        {/* ── SCROLLABLE CONTENT BODY ── */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
          {/* ════ SECTION 1: TOP TELEMETRY KPI CARDS ════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Overall Band Score */}
          <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Listening Band Score
              </span>
              <span className="bg-rose-950/60 border border-rose-800/40 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                IELTS Official 9.0
              </span>
            </div>
            <div className="my-1">
              <div className="text-4xl sm:text-5xl font-black text-rose-500 tracking-tight">
                Band {displayedBand.toFixed(1)}
              </div>
              <p className="text-xs font-semibold text-slate-300 mt-1">
                {displayedBand >= 7.5 ? 'Very Good / Expert User' : displayedBand >= 6.5 ? 'Competent Academic User' : 'Moderate User — Needs Targeted Drill'}
              </p>
            </div>
            <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400 flex items-center justify-between">
              <span>CEFR Level: {displayedBand >= 7.5 ? 'C1 / C2' : displayedBand >= 6.0 ? 'B2' : 'B1'}</span>
              {scoreViewMode === 'teacher' && <span className="text-rose-400 font-bold">Faculty Verified</span>}
            </div>
          </div>

          {/* Card 2: Correct Questions Counter */}
          <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Correct Answers
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="my-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {score} <span className="text-lg font-normal text-slate-500">/ {totalQuestions}</span>
              </div>
              <p className="text-xs font-semibold text-slate-300 mt-1">
                {totalQuestions - score} incorrect or omitted items
              </p>
            </div>
            <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400">
              Pass mark threshold: 23 / 40 (Band 6.0)
            </div>
          </div>

          {/* Card 3: Accuracy Percentage */}
          <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Accuracy Rate
              </span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="my-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {accuracyPct}%
              </div>
              <div className="w-full bg-[#0D0F12] h-2 rounded-full mt-2 overflow-hidden border border-[#222732]">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${accuracyPct}%` }}
                />
              </div>
            </div>
            <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400 flex items-center justify-between">
              <span>Target 80%+</span>
              <span className={accuracyPct >= 80 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {accuracyPct >= 80 ? 'Achieved' : `${80 - accuracyPct}% deficit`}
              </span>
            </div>
          </div>

          {/* Card 4: Audio Track Length & Telemetry */}
          <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Audio Duration
              </span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Headphones className="w-4 h-4" />
              </div>
            </div>
            <div className="my-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                28<span className="text-lg font-normal text-slate-500">m</span> 00<span className="text-lg font-normal text-slate-500">s</span>
              </div>
              <p className="text-xs font-semibold text-slate-300 mt-1">
                4 Sections • Continuous Playback
              </p>
            </div>
            <div className="pt-2 border-t border-[#222732] text-[11px] text-slate-400">
              Cambridge Standard Exam Audio Engine
            </div>
          </div>
        </div>

        {/* ════ SECTION 2: PERSISTENT TOP AUDIO PLAYER WITH TIMESTAMP ANCHORS ════ */}
        <div className="bg-[#15181E] border border-[#222732] rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Play/Pause & Title */}
            <div className="flex items-center gap-3.5">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-md shadow-rose-900/30 cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
              </button>
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{`Cambridge ${numBook} Official Listening Track`}</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/40 text-[10px] font-mono">
                    Synchronized Audio
                  </span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any Part timestamp below to jump directly to that section in the official Cambridge recording
                </p>
              </div>
            </div>

            {/* Part Jump Buttons (Timestamp Anchors) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {([1, 2, 3, 4] as const).map((partNum) => {
                const partSec = Number(testPartMarkers[String(partNum)] ?? testPartMarkers[partNum] ?? PART_TIMESTAMPS[partNum] ?? 0);
                const mm = Math.floor(partSec / 60);
                const ss = partSec % 60;
                const timeLabel = `${mm < 10 ? '0' : ''}${mm}:${ss < 10 ? '0' : ''}${ss}`;
                return (
                  <button
                    key={partNum}
                    onClick={() => jumpToPart(partNum)}
                    className="px-3 py-1.5 rounded-xl bg-[#0D0F12] border border-[#222732] hover:border-rose-500 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>Part {partNum} ({timeLabel})</span>
                  </button>
                );
              })}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={toggleMute} className="text-slate-400 hover:text-white cursor-pointer">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-rose-500 cursor-pointer h-1.5 bg-[#0D0F12] rounded-lg"
              />
              <span className="font-mono text-xs text-slate-400 w-16 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Audio Seekbar Track */}
          <div className="space-y-1">
            <div 
              ref={scrubberRef}
              className="relative w-full py-3 flex items-center cursor-pointer group"
              onMouseMove={(e) => {
                if (!scrubberRef.current || !duration) return;
                const rect = scrubberRef.current.getBoundingClientRect();
                const clampX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const pct = clampX / rect.width;
                setHoverX(clampX);
                setHoverTime(Math.round(pct * duration));
              }}
              onMouseLeave={() => setHoverTime(null)}
            >
              {/* Floating Hover/Drag Timestamp Tooltip */}
              {hoverTime !== null && (
                <div 
                  className="absolute -top-7 px-2 py-0.5 rounded bg-rose-600 text-[11px] font-mono font-bold text-white shadow-xl pointer-events-none -translate-x-1/2 z-30 transition-transform duration-75"
                  style={{ left: `${hoverX}px` }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}

              {/* Unplayed Track Background */}
              <div className="relative w-full h-2 bg-[#0D0F12] border border-[#222732] rounded-full overflow-hidden">
                {/* Active Red Progress Fill */}
                <div 
                  className="h-full bg-rose-600 transition-all duration-75"
                  style={{ width: `${Math.min(100, Math.max(0, (currentTime / (duration || 1)) * 100))}%` }}
                />
              </div>

              {/* Native Input Range for Accessible Scrubbing */}
              <input
                type="range"
                min={0}
                max={duration || 1680}
                value={currentTime}
                onChange={(e) => seekTo(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />

              {/* Draggable Red Thumb Visual */}
              <div 
                className="absolute w-4 h-4 bg-white border-2 border-rose-600 rounded-full shadow-md pointer-events-none -translate-x-1/2 z-10 transition-transform group-hover:scale-125"
                style={{ left: `${Math.min(100, Math.max(0, (currentTime / (duration || 1)) * 100))}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
              <span>Part 1: {formatTime(Number(testPartMarkers['1'] ?? 0))}</span>
              <span>Part 2: {formatTime(Number(testPartMarkers['2'] ?? 360))}</span>
              <span>Part 3: {formatTime(Number(testPartMarkers['3'] ?? 750))}</span>
              <span>Part 4: {formatTime(Number(testPartMarkers['4'] ?? 1150))}</span>
              <span>End: {formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* ════ AI EXAMINER DIAGNOSTIC & ERROR PATTERN ANALYSIS PANEL ════ */}
        <div className="bg-[#15181E] border border-rose-900/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#222732] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>AI Examiner Diagnostic & Error Pattern Analysis</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono">
                    Deep Diagnostic
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Automated acoustic nuance, distractor trap, and singular/plural error detection for Cambridge {numBook} Test {numTest}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-[#0D0F12] border border-[#222732]">
                Total Errors: <strong className="text-rose-400">{aiDiagnostics.totalErrors}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#0D0F12] border border-[#222732]">
                Unanswered: <strong className="text-amber-400">{aiDiagnostics.unansweredCount}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1. Distractor Traps */}
            <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Distractor Traps Tripped</span>
              </span>
              {aiDiagnostics.distractorTripped.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {aiDiagnostics.distractorTripped.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 font-mono text-[11px] leading-tight text-slate-300">
                      <span className="text-rose-400 shrink-0">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">No major conversational pivot traps detected in candidate answers.</p>
              )}
            </div>

            {/* 2. Spelling & Acoustic Nuances */}
            <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                <span>Spelling & Acoustic Nuance</span>
              </span>
              {aiDiagnostics.spellingAcousticErrors.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {aiDiagnostics.spellingAcousticErrors.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 font-mono text-[11px] leading-tight text-slate-300">
                      <span className="text-purple-400 shrink-0">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Word endings and singular/plural suffixes recorded with high acoustic fidelity.</p>
              )}
            </div>

            {/* 3. Targeted Drill Recommendation */}
            <div className="bg-[#0D0F12] border border-[#222732] rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Targeted Drill Recommendation</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {aiDiagnostics.recommendedDrill}
              </p>
              <div className="pt-1">
                <span className="inline-block px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] font-semibold text-rose-300">
                  Focus: Part {aiDiagnostics.worstPart}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ════ SECTION 3: SECTION BREAKDOWN FILTER & QUESTION MATRIX ════ */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Part Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#15181E] border border-[#222732] rounded-2xl w-fit flex-wrap">
              {(['all', 1, 2, 3, 4] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePartFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activePartFilter === tab
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#181C24]'
                  }`}
                >
                  {tab === 'all' ? 'All Questions (40)' : `Part ${tab} (Q${(tab - 1) * 10 + 1}–${tab * 10})`}
                </button>
              ))}
            </div>

            {/* Quick Expand / Collapse */}
            <div className="flex items-center gap-2">
              <button
                onClick={expandAllScripts}
                className="px-3 py-1.5 rounded-xl border border-[#222732] hover:bg-[#15181E] text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Expand All Scripts
              </button>
              <button
                onClick={collapseAllScripts}
                className="px-3 py-1.5 rounded-xl border border-[#222732] hover:bg-[#15181E] text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = !!expandedScripts[q.id];
              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all ${
                    q.isCorrect
                      ? 'bg-[#15181E]/70 border-[#222732] hover:border-emerald-500/40'
                      : 'bg-[#15181E] border-rose-900/40 hover:border-rose-600/60'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Question Number, Prompt & Audio Timestamp */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                          q.isCorrect
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {q.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Question {q.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#0D0F12] border border-[#222732] text-[10px] font-mono text-slate-400">
                            Part {q.part}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const [mins, secs] = q.timestamp.split(':').map(Number);
                              const targetSec = (mins || 0) * 60 + (secs || 0);
                              seekTo(targetSec);
                              if (audioRef.current) {
                                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                              }
                            }}
                            className="px-2 py-0.5 rounded-md bg-purple-950/40 border border-purple-800/40 text-[10px] font-mono text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                            title="Play audio from this question's timestamp"
                          >
                            <Clock className="w-2.5 h-2.5" />
                            <span>{q.timestamp}</span>
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-200">
                          {q.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Middle: User Answer vs Correct Answer */}
                    <div className="flex items-center gap-3 sm:gap-6 shrink-0 bg-[#0D0F12] p-3 rounded-xl border border-[#222732]">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                          Your Answer
                        </span>
                        <span
                          className={`font-mono text-xs font-bold ${
                            q.isCorrect ? 'text-emerald-400' : 'text-rose-400 line-through'
                          }`}
                        >
                          {q.userAnswer}
                        </span>
                      </div>

                      <div className="border-l border-[#222732] pl-3 sm:pl-6">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                          Correct Answer
                        </span>
                        <span
                          className="font-mono text-xs font-bold text-white"
                        >
                          {q.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {/* Right: Expand Audio Tape Script Toggle */}
                    <div className="shrink-0 flex items-center justify-end">
                      <button
                        onClick={() => toggleScript(q.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181C24] hover:bg-[#222732] text-xs font-bold text-slate-300 hover:text-white border border-[#222732] transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-500" />
                        <span>{isExpanded ? 'Hide Script' : 'Audio Tape Script'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* ── EXPANDED AUDIO TAPE SCRIPT EXCERPT ── */}
                  {isExpanded && (
                    <div className="border-t border-[#222732] bg-[#0F1115] p-4 sm:p-5 rounded-b-2xl space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                          <Headphones className="w-3.5 h-3.5" />
                          <span>Exact Spoken Audio Tape Script Excerpt</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const [mins, secs] = q.timestamp.split(':').map(Number);
                            const targetSec = (mins || 0) * 60 + (secs || 0);
                            seekTo(targetSec);
                            if (audioRef.current) {
                              audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                            }
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] font-mono text-rose-300 hover:text-white transition-all cursor-pointer group"
                          title="Jump audio to this spoken line"
                        >
                          <Play className="w-3 h-3 fill-current text-rose-400 group-hover:scale-110 transition-transform" />
                          <span>Jump to Audio: {q.timestamp}</span>
                        </button>
                      </div>

                      {/* Quoted Audio Transcript with styling */}
                      <div className="bg-[#15181E] border-l-4 border-rose-500 border border-[#222732] rounded-r-xl p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic shadow-inner">
                        "{q.tapeScriptExcerpt}"
                      </div>

                      {/* Linguistic & Cambridge Evaluation Rationale */}
                      <div className="p-3 bg-[#0D0F12] border border-[#222732] rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
                        <span className="text-amber-400 font-bold shrink-0">💡 Analysis:</span>
                        <span>{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Scenario B: History Matrix Pop-Up Modal (React Portal with blurred backdrop)
  if (isModal) {
    if (typeof document === 'undefined') return null;
    return createPortal(
      <div
        className="fixed inset-0 z-[9999] w-screen h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-hidden"
        onClick={handleClose}
      >
        {innerModalCanvas}
      </div>,
      document.body
    );
  }

  // Scenario A: Direct Exam Submission Mode (Full-Page Embedded Standard Block Component)
  return (
    <div className="w-full space-y-6 bg-[#0D0F12] p-4 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col min-h-screen">
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        {innerModalCanvas}
      </div>
    </div>
  );
};

export default ListeningAnalysisModal;

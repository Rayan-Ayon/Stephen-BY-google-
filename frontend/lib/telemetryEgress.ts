import { supabase } from '@/lib/supabaseClient';

export interface ExamAttemptPayload {
  testId: string;
  module: 'reading' | 'listening' | 'writing' | 'speaking';
  bandScore: number;
  correctCount?: number;
  totalQuestions?: number;
  timeSpentSeconds?: number;
  answersPayload?: Record<string, any>;
  studentName?: string;
  userId?: string;
}

export interface HandwrittenSubmissionPayload {
  imageBlobOrFile: Blob | File | string; // Can also be data URL
  promptTitle: string;
  ocrExtractedText?: string;
  aiBandScore?: number;
  studentName?: string;
  userId?: string;
}

export interface SpeakingSessionPayload {
  user_id?: string;
  session_id?: string;
  audio_url?: string;
  transcript?: Array<{ sender: 'user' | 'ai'; text: string }> | string;
  band_score?: number;
  sub_scores?: {
    fluency?: number;
    pronunciation?: number;
    lexical?: number;
    grammar?: number;
  };
  duration_seconds?: number;
  audioBlobOrUrl?: Blob | File | string;
  fluencyScore?: number;
  pronunciationScore?: number;
  lexicalScore?: number;
  grammarScore?: number;
  overallBand?: number;
  studentName?: string;
  userId?: string;
}

export interface TeacherEvaluationPayload {
  submissionId: string;
  submissionType: 'essay' | 'speaking' | 'exam';
  teacherName?: string;
  teacherId?: string;
  overrideBand: number;
  feedbackText?: string;
  voiceNoteUrl?: string;
}

/**
 * 1. Record Exam Attempt (Reading, Listening, Writing, Speaking)
 */
export async function recordExamAttempt(payload: ExamAttemptPayload) {
  try {
    let resolvedUserId = payload.userId;
    let resolvedName = payload.studentName;

    if (!resolvedUserId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          resolvedUserId = user.id;
          resolvedName = resolvedName || user.user_metadata?.full_name || user.email?.split('@')[0];
        }
      } catch {
        // guest fallback
      }
    }

    const row = {
      test_id: payload.testId,
      module: payload.module,
      band_score: Number(payload.bandScore),
      correct_count: payload.correctCount || 0,
      total_questions: payload.totalQuestions || 40,
      time_spent_seconds: payload.timeSpentSeconds || 0,
      answers_payload: payload.answersPayload || {},
      student_name: resolvedName || 'Candidate Scholar',
      ...(resolvedUserId ? { user_id: resolvedUserId } : {})
    };

    const { data, error } = await (supabase as any)
      .from('exam_attempts')
      .insert([row])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[Telemetry] exam_attempts write warning:', error.message);
    } else {
      console.log('[Telemetry] Recorded exam attempt successfully:', data?.id);
    }
    return data;
  } catch (err) {
    console.warn('[Telemetry] recordExamAttempt network note:', err);
    return null;
  }
}

/**
 * Helper to convert Data URL / base64 to Blob
 */
function dataUrlToBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * 2. Upload Handwritten Essay & Enqueue Submission
 */
export async function uploadHandwrittenEssay(payload: HandwrittenSubmissionPayload) {
  try {
    let resolvedUserId = payload.userId;
    let resolvedName = payload.studentName;

    if (!resolvedUserId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          resolvedUserId = user.id;
          resolvedName = resolvedName || user.user_metadata?.full_name || user.email?.split('@')[0];
        }
      } catch {
        // guest fallback
      }
    }

    let finalImageUrl = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop';

    // If payload has an actual Blob, File, or data URL, upload to Supabase Storage
    if (payload.imageBlobOrFile) {
      try {
        let uploadBlob: Blob;
        if (typeof payload.imageBlobOrFile === 'string') {
          if (payload.imageBlobOrFile.startsWith('data:')) {
            uploadBlob = dataUrlToBlob(payload.imageBlobOrFile);
          } else {
            uploadBlob = new Blob([payload.imageBlobOrFile], { type: 'text/plain' });
            finalImageUrl = payload.imageBlobOrFile;
          }
        } else {
          uploadBlob = payload.imageBlobOrFile;
        }

        if (uploadBlob instanceof Blob && (!payload.imageBlobOrFile || typeof payload.imageBlobOrFile !== 'string' || payload.imageBlobOrFile.startsWith('data:'))) {
          const fileName = `essay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from('handwritten_essays')
            .upload(fileName, uploadBlob, { contentType: uploadBlob.type || 'image/jpeg', upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('handwritten_essays')
              .getPublicUrl(fileName);
            if (publicUrlData?.publicUrl) {
              finalImageUrl = publicUrlData.publicUrl;
            }
          } else {
            console.warn('[Telemetry] Storage upload note for handwritten_essays:', uploadError.message);
          }
        }
      } catch (storageErr) {
        console.warn('[Telemetry] Essay storage upload error:', storageErr);
      }
    }

    const row = {
      prompt_title: payload.promptTitle,
      image_url: finalImageUrl,
      ocr_extracted_text: payload.ocrExtractedText || '',
      ai_band_score: payload.aiBandScore ? Number(payload.aiBandScore) : 6.5,
      student_name: resolvedName || 'Candidate Scholar',
      status: 'pending',
      ...(resolvedUserId ? { user_id: resolvedUserId } : {})
    };

    const { data, error } = await (supabase as any)
      .from('handwritten_submissions')
      .insert([row])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[Telemetry] handwritten_submissions insert warning:', error.message);
    } else {
      console.log('[Telemetry] Queued handwritten essay successfully:', data?.id);
    }
    return data;
  } catch (err) {
    console.warn('[Telemetry] uploadHandwrittenEssay network note:', err);
    return null;
  }
}

/**
 * 3. Upload Speaking Session & Enqueue Submission
 */
export async function uploadSpeakingSession(payload: SpeakingSessionPayload) {
  try {
    let resolvedUserId = payload.user_id || payload.userId;
    let resolvedEmail: string | undefined;
    let resolvedName = payload.studentName;

    if (!resolvedUserId || !resolvedEmail) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          resolvedUserId = resolvedUserId || user.id;
          resolvedEmail = user.email;
          resolvedName = resolvedName || user.user_metadata?.full_name || user.email?.split('@')[0];
        }
      } catch {
        // guest fallback
      }
    }

    let finalAudioUrl = payload.audio_url || 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg';

    if (payload.audioBlobOrUrl) {
      if (typeof payload.audioBlobOrUrl === 'string') {
        finalAudioUrl = payload.audioBlobOrUrl;
      } else if (payload.audioBlobOrUrl instanceof Blob) {
        try {
          const fileName = `speaking_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.webm`;
          const { error: uploadError } = await supabase.storage
            .from('speaking_audio')
            .upload(fileName, payload.audioBlobOrUrl, { contentType: payload.audioBlobOrUrl.type || 'audio/webm', upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('speaking_audio')
              .getPublicUrl(fileName);
            if (publicUrlData?.publicUrl) {
              finalAudioUrl = publicUrlData.publicUrl;
            }
          }
        } catch (audioErr) {
          console.warn('[TELEMETRY] Speaking audio upload error:', audioErr);
        }
      }
    }

    const sessionId = payload.session_id || `session_${Date.now()}`;
    const transcriptText = typeof payload.transcript === 'string'
      ? payload.transcript
      : Array.isArray(payload.transcript)
        ? payload.transcript.map(t => `${t.sender === 'ai' ? 'Mohona (Examiner)' : 'Candidate'}: ${t.text}`).join('\n')
        : JSON.stringify(payload.transcript || '');

    const bandScore = payload.band_score ?? payload.overallBand ?? 6.5;
    const subScores = payload.sub_scores || {
      fluency: payload.fluencyScore,
      pronunciation: payload.pronunciationScore,
      lexical: payload.lexicalScore,
      grammar: payload.grammarScore,
    };
    const durationSeconds = payload.duration_seconds || 0;

    const isUUID = (str?: string) => Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));
    const validUserId = isUUID(resolvedUserId) ? resolvedUserId : undefined;

    // Target schema: public.speaking_submissions
    const submissionsRow: Record<string, any> = {
      overall_band: bandScore,
      fluency_score: subScores.fluency ? Number(subScores.fluency) : null,
      pronunciation_score: subScores.pronunciation ? Number(subScores.pronunciation) : null,
      lexical_score: subScores.lexical ? Number(subScores.lexical) : null,
      grammar_score: subScores.grammar ? Number(subScores.grammar) : null,
      transcript: transcriptText,
      question_prompt: 'IELTS Speaking Partner Session',
      raw_json_feedback: {
        session_id: sessionId,
        audio_url: finalAudioUrl,
        duration_seconds: durationSeconds,
        sub_scores: subScores,
        student_name: resolvedName || 'Speaking Candidate',
      },
      created_at: new Date().toISOString()
    };

    if (validUserId) {
      submissionsRow.user_id = validUserId;
    }
    if (resolvedEmail) {
      submissionsRow.user_email = resolvedEmail;
    }

    const { data, error } = await (supabase as any)
      .from('speaking_submissions')
      .insert([submissionsRow])
      .select();

    if (error) {
      console.warn('[TELEMETRY] Note on speaking_submissions insert:', error.message || error);
      // Fallback row for speaking_sessions if that table exists in alternate environments
      const fallbackRow = {
        audio_url: finalAudioUrl,
        transcript: transcriptText,
        overall_band: bandScore,
        student_name: resolvedName || 'Speaking Candidate',
        status: 'pending',
        created_at: new Date().toISOString(),
        ...(validUserId ? { user_id: validUserId } : {})
      };
      const { data: fbData, error: fbError } = await (supabase as any)
        .from('speaking_sessions')
        .insert([fallbackRow])
        .select();

      if (fbError) {
        return { success: false, error: fbError };
      }
      return { success: true, data: fbData };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[TELEMETRY] Failed to upload speaking session:', err);
    return { success: false, error: err };
  }
}

/**
 * 4. Submit Teacher Evaluation / Override
 */
export async function saveTeacherEvaluation(payload: TeacherEvaluationPayload) {
  try {
    let resolvedTeacherId = payload.teacherId;
    if (!resolvedTeacherId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) resolvedTeacherId = user.id;
      } catch {}
    }

    const evalRow = {
      submission_id: payload.submissionId,
      submission_type: payload.submissionType,
      teacher_name: payload.teacherName || 'Faculty Evaluator',
      override_band: Number(payload.overrideBand),
      feedback_text: payload.feedbackText || '',
      voice_note_url: payload.voiceNoteUrl || null,
      ...(resolvedTeacherId ? { teacher_id: resolvedTeacherId } : {})
    };

    // 1. Insert into teacher_evaluations
    const { data: evalData, error: evalErr } = await (supabase as any)
      .from('teacher_evaluations')
      .insert([evalRow])
      .select()
      .maybeSingle();

    if (evalErr) console.warn('[Telemetry] teacher_evaluations insert note:', evalErr.message);

    // 2. Mark submission reviewed
    const updateTargetTable = payload.submissionType === 'essay' ? 'handwritten_submissions' : 'speaking_submissions';
    const { error: updateErr } = await (supabase as any)
      .from(updateTargetTable)
      .update({
        status: 'reviewed',
        teacher_override_band: Number(payload.overrideBand),
        teacher_feedback: payload.feedbackText || '',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', payload.submissionId);

    if (updateErr) {
      console.warn(`[Telemetry] ${updateTargetTable} update note:`, updateErr.message);
      if (updateTargetTable === 'speaking_submissions') {
        await (supabase as any)
          .from('speaking_sessions')
          .update({
            status: 'reviewed',
            teacher_override_band: Number(payload.overrideBand),
            teacher_feedback: payload.feedbackText || '',
            reviewed_at: new Date().toISOString()
          })
          .eq('id', payload.submissionId);
      }
    }

    return evalData || { id: `eval-${Date.now()}` };
  } catch (err) {
    console.warn('[Telemetry] saveTeacherEvaluation network note:', err);
    return null;
  }
}

export interface StudentDisputePayload {
  user_id?: string;
  student_name?: string;
  user_email?: string;
  module: 'reading' | 'listening' | 'writing' | 'speaking';
  source_type?: string;
  book_number?: number;
  test_number?: number;
  test_title?: string;
  original_band?: number;
  dispute_note: string;
  ai_score_payload?: any;
  raw_answers?: any;
  status?: string;
}

export async function submitStudentDispute(payload: StudentDisputePayload) {
  try {
    let resolvedUserId = payload.user_id;
    let resolvedName = payload.student_name;
    let resolvedEmail = payload.user_email;

    if (!resolvedUserId || !resolvedEmail) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          resolvedUserId = resolvedUserId || user.id;
          resolvedEmail = resolvedEmail || user.email;
          resolvedName = resolvedName || user.user_metadata?.full_name || user.email?.split('@')[0];
        }
      } catch {}
    }

    const row = {
      user_id: resolvedUserId,
      student_name: resolvedName || 'Candidate Scholar',
      user_email: resolvedEmail,
      module: payload.module,
      source_type: payload.source_type || 'cambridge',
      book_number: payload.book_number,
      test_number: payload.test_number,
      test_title: payload.test_title,
      original_band: Number(payload.original_band) || 6.5,
      dispute_note: payload.dispute_note,
      ai_score_payload: payload.ai_score_payload || null,
      raw_answers: payload.raw_answers || null,
      status: payload.status || 'pending_teacher_review',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await (supabase as any)
      .from('student_disputes')
      .insert([row])
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[Telemetry] student_disputes write note:', error.message);
    } else {
      console.log('[Telemetry] Student dispute recorded successfully:', data?.id);
    }
    return data || row;
  } catch (err) {
    console.warn('[Telemetry] submitStudentDispute network note:', err);
    return null;
  }
}

export interface CanonicalStudent {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  branch: string;
  streak: number;
  targetBand: number;
  currentBand: number;
  aiCoins: number;
  status: 'Active' | 'Inactive' | 'Graduated';
  dailyStatus: 'completed' | 'pending' | 'at_risk';
  activeMinutesToday: number;
  submissionCount: number;
}

export const CANONICAL_20_STUDENTS: CanonicalStudent[] = [
  { id: 'stu-01', name: 'Farhan Kabir', handle: 'farhan_ielts', email: 'farhan@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 14, targetBand: 7.5, currentBand: 6.5, aiCoins: 480, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 45, submissionCount: 18 },
  { id: 'stu-02', name: 'Ayonburg / Ayon', handle: 'ayonlogy', email: 'ayon@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 21, targetBand: 8.0, currentBand: 7.5, aiCoins: 850, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 60, submissionCount: 29 },
  { id: 'stu-03', name: 'Sadia', handle: 'sadia_prep', email: 'sadia@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 9, targetBand: 7.0, currentBand: 6.0, aiCoins: 390, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 35, submissionCount: 14 },
  { id: 'stu-04', name: 'Mim Akter', handle: 'mim_ielts', email: 'mim@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 16, targetBand: 7.5, currentBand: 6.5, aiCoins: 520, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 50, submissionCount: 22 },
  { id: 'stu-05', name: 'Nafisa', handle: 'nafisa_vance', email: 'nafisa@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 12, targetBand: 7.0, currentBand: 6.5, aiCoins: 410, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 40, submissionCount: 17 },
  { id: 'stu-06', name: 'Labiba', handle: 'labiba_scholar', email: 'labiba@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 18, targetBand: 8.0, currentBand: 7.0, aiCoins: 670, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 55, submissionCount: 25 },
  { id: 'stu-07', name: 'Nusrat Jahan', handle: 'nusrat_jahan', email: 'nusrat@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 7, targetBand: 7.0, currentBand: 6.0, aiCoins: 310, status: 'Active', dailyStatus: 'pending', activeMinutesToday: 20, submissionCount: 11 },
  { id: 'stu-08', name: 'Maliha', handle: 'maliha_target7', email: 'maliha@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 14, targetBand: 7.5, currentBand: 6.5, aiCoins: 460, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 45, submissionCount: 19 },
  { id: 'stu-09', name: 'Tanvir Ahmed / Tanvir Hossain', handle: 'tanvir_ielts', email: 'tanvir@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 5, targetBand: 7.0, currentBand: 5.5, aiCoins: 280, status: 'Active', dailyStatus: 'at_risk', activeMinutesToday: 15, submissionCount: 8 },
  { id: 'stu-10', name: 'Fahim', handle: 'fahim_alpha', email: 'fahim@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 11, targetBand: 7.0, currentBand: 6.5, aiCoins: 430, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 35, submissionCount: 16 },
  { id: 'stu-11', name: 'Anika Rahman', handle: 'anika_rahman', email: 'anika@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 19, targetBand: 7.5, currentBand: 7.0, aiCoins: 590, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 50, submissionCount: 23 },
  { id: 'stu-12', name: 'Rafiqul Islam', handle: 'rafiqul_i', email: 'rafiqul@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 8, targetBand: 6.5, currentBand: 5.5, aiCoins: 350, status: 'Active', dailyStatus: 'pending', activeMinutesToday: 25, submissionCount: 12 },
  { id: 'stu-13', name: 'Saimon Chowdhury', handle: 'saimon_c', email: 'saimon@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 13, targetBand: 7.5, currentBand: 6.5, aiCoins: 470, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 40, submissionCount: 18 },
  { id: 'stu-14', name: 'Zubair Hossain', handle: 'zubair_h', email: 'zubair@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 6, targetBand: 7.0, currentBand: 6.0, aiCoins: 320, status: 'Active', dailyStatus: 'pending', activeMinutesToday: 20, submissionCount: 10 },
  { id: 'stu-15', name: 'Samira Akter', handle: 'samira_a', email: 'samira@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 15, targetBand: 7.5, currentBand: 6.5, aiCoins: 510, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 45, submissionCount: 20 },
  { id: 'stu-16', name: 'Mahir Faisal', handle: 'mahir_f', email: 'mahir@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 10, targetBand: 7.0, currentBand: 6.0, aiCoins: 400, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 30, submissionCount: 15 },
  { id: 'stu-17', name: 'Priya Sen', handle: 'priya_sen', email: 'priya@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 17, targetBand: 7.5, currentBand: 7.0, aiCoins: 540, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 48, submissionCount: 21 },
  { id: 'stu-18', name: 'Imran', handle: 'imran_exec', email: 'imran@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 4, targetBand: 6.5, currentBand: 5.5, aiCoins: 290, status: 'Active', dailyStatus: 'at_risk', activeMinutesToday: 15, submissionCount: 9 },
  { id: 'stu-19', name: 'Rahim', handle: 'rahim_ielts', email: 'rahim@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 12, targetBand: 7.0, currentBand: 6.5, aiCoins: 420, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 35, submissionCount: 16 },
  { id: 'stu-20', name: 'Jarin', handle: 'jarin_target8', email: 'jarin@farmgate.edu', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', branch: 'Farmgate Branch', streak: 22, targetBand: 8.0, currentBand: 7.5, aiCoins: 710, status: 'Active', dailyStatus: 'completed', activeMinutesToday: 60, submissionCount: 28 },
];


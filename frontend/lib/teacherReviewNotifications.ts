import { supabase } from '@/lib/supabaseClient';

export interface TeacherReviewCritique {
  id: string;
  text: string;
  critique: string;
}

export interface TeacherReviewNotification {
  id: string;
  kind: 'teacher_review';
  disputeId?: string;
  studentId?: string;
  studentName?: string;
  testTitle: string;
  module: string;
  originalBand: number;
  teacherBand: number;
  teacherName: string;
  teacherCredential: string;
  feedbackText: string;
  voiceUrl?: string;
  critiques: TeacherReviewCritique[];
  essayText?: string;
  createdAt: string;
  unread: boolean;
}

const STORAGE_KEY = 'student_teacher_review_notifications';
export const TEACHER_REVIEW_EVENT = 'teacher-review-notification';

const SEED_TEACHER_REVIEW: TeacherReviewNotification = {
  id: 'tr-seed-01',
  kind: 'teacher_review',
  disputeId: 'disp-01',
  testTitle: 'Writing Task 2: Academic Tuition Fees',
  module: 'writing',
  originalBand: 6.0,
  teacherBand: 7.0,
  teacherName: 'Dr. Stephen Vance',
  teacherCredential: 'Band 9.0',
  feedbackText: 'I reviewed your Task Response in Paragraph 2. Your argument regarding high-value national infrastructure benefits was well-substantiated and coherent. Upgraded to Band 7.0.',
  voiceUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
  critiques: [
    {
      id: 'hl-1',
      text: 'national infrastructure directly benefits from university graduates',
      critique: 'Valid topical substantiation; warrants Band 7.0 for Task Achievement.'
    }
  ],
  essayText: 'Some people argue that tertiary education should be fully financed by governments, whereas others assert that students ought to bear the financial burden. In my viewpoint, a blended funding model guarantees institutional excellence while preserving accessibility for underprivileged demographics. In paragraph two, national infrastructure directly benefits from university graduates in science and engineering who drive high-value economic productivity...',
  createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  unread: true,
};

export function listTeacherReviews(): TeacherReviewNotification[] {
  try {
    const rawStr = localStorage.getItem(STORAGE_KEY);
    if (!rawStr) {
      return [SEED_TEACHER_REVIEW];
    }
    const raw = JSON.parse(rawStr);
    return Array.isArray(raw) && raw.length > 0 ? raw : [SEED_TEACHER_REVIEW];
  } catch {
    return [SEED_TEACHER_REVIEW];
  }
}

function save(list: TeacherReviewNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    // Quota exceeded (large voice data URL): retry without the audio payload.
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(list.slice(0, 50).map((n) => ({ ...n, voiceUrl: undefined })))
      );
    } catch {}
  }
  window.dispatchEvent(new CustomEvent(TEACHER_REVIEW_EVENT));
}

/** Persist a teacher review for the student and (best-effort) mirror it to Supabase. */
export async function pushTeacherReview(
  input: Omit<TeacherReviewNotification, 'id' | 'kind' | 'createdAt' | 'unread'>
): Promise<TeacherReviewNotification> {
  const notif: TeacherReviewNotification = {
    ...input,
    id: `tr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind: 'teacher_review',
    createdAt: new Date().toISOString(),
    unread: true,
  };
  // De-duplicate re-dispatches for the same dispute: newest wins.
  const existing = listTeacherReviews().filter(
    (n) => !(notif.disputeId && n.disputeId === notif.disputeId)
  );
  save([notif, ...existing]);

  try {
    await (supabase as any).from('student_notifications').insert([
      {
        user_id: notif.studentId ?? null,
        type: 'teacher_review',
        title: 'Teacher Verified Score Available',
        body: `${notif.teacherName} updated your ${notif.testTitle} score to Band ${notif.teacherBand.toFixed(1)}.`,
        payload: { ...notif, voiceUrl: undefined },
        created_at: notif.createdAt,
      },
    ]);
  } catch (e) {
    console.warn('[teacherReview] notification mirror skipped:', e);
  }
  return notif;
}

export function markTeacherReviewRead(id: string) {
  save(listTeacherReviews().map((n) => (n.id === id ? { ...n, unread: false } : n)));
}

export function markAllTeacherReviewsRead() {
  save(listTeacherReviews().map((n) => ({ ...n, unread: false })));
}

export function subscribeTeacherReviews(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener(TEACHER_REVIEW_EVENT, cb);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(TEACHER_REVIEW_EVENT, cb);
    window.removeEventListener('storage', onStorage);
  };
}

export function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} mins ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export async function blobUrlToDataUrl(url: string): Promise<string> {
  if (!url.startsWith('blob:')) return url;
  try {
    const blob = await (await fetch(url)).blob();
    return await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

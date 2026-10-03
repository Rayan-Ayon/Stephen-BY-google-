-- ============================================================================
-- STEPHEN IELTS: TELEMETRY EGRESS & STORAGE PIPELINE (PHASE 1 + PHASE 2)
-- ============================================================================

-- 1. EXAM ATTEMPTS (Reading, Listening, Writing, Speaking)
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT,
    test_id TEXT NOT NULL,                      -- e.g. "cambridge-7-test-1"
    module TEXT CHECK (module IN ('reading', 'listening', 'writing', 'speaking')) NOT NULL,
    band_score NUMERIC(2,1) NOT NULL,
    correct_count INT DEFAULT 0,
    total_questions INT DEFAULT 40,
    time_spent_seconds INT DEFAULT 0,
    answers_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON public.exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_module ON public.exam_attempts(module);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_created_at ON public.exam_attempts(created_at DESC);

-- 2. HANDWRITTEN ESSAY SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.handwritten_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT DEFAULT 'Candidate Scholar',
    prompt_title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    ocr_extracted_text TEXT,
    ai_band_score NUMERIC(2,1),
    teacher_override_band NUMERIC(2,1),
    teacher_feedback TEXT,
    status TEXT CHECK (status IN ('pending', 'reviewed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_handwritten_status ON public.handwritten_submissions(status);
CREATE INDEX IF NOT EXISTS idx_handwritten_user_id ON public.handwritten_submissions(user_id);

-- 3. SPEAKING AUDIO SESSIONS
CREATE TABLE IF NOT EXISTS public.speaking_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT DEFAULT 'Speaking Candidate',
    audio_url TEXT NOT NULL,
    transcript TEXT,
    fluency_score NUMERIC(2,1),
    pronunciation_score NUMERIC(2,1),
    lexical_score NUMERIC(2,1),
    grammar_score NUMERIC(2,1),
    overall_band NUMERIC(2,1),
    teacher_override_band NUMERIC(2,1),
    teacher_feedback TEXT,
    status TEXT CHECK (status IN ('pending', 'reviewed')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_speaking_status ON public.speaking_sessions(status);
CREATE INDEX IF NOT EXISTS idx_speaking_user_id ON public.speaking_sessions(user_id);

-- 4. TEACHER EVALUATIONS & AUDIT OVERRIDES
CREATE TABLE IF NOT EXISTS public.teacher_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL,
    submission_type TEXT CHECK (submission_type IN ('essay', 'speaking', 'exam')) NOT NULL,
    teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    teacher_name TEXT DEFAULT 'Faculty Evaluator',
    override_band NUMERIC(2,1) NOT NULL,
    feedback_text TEXT,
    voice_note_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teacher_eval_sub ON public.teacher_evaluations(submission_id);

-- 5. STORAGE BUCKETS FOR ESSAYS & AUDIO
INSERT INTO storage.buckets (id, name, public) 
VALUES ('handwritten_essays', 'handwritten_essays', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('speaking_audio', 'speaking_audio', true) 
ON CONFLICT (id) DO NOTHING;

-- RLS POLICIES
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handwritten_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_evaluations ENABLE ROW LEVEL SECURITY;

-- Exam Attempts Policies
CREATE POLICY "Public and users can insert exam attempts" ON public.exam_attempts 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public and users can view exam attempts" ON public.exam_attempts 
  FOR SELECT USING (true);

-- Handwritten Submissions Policies
CREATE POLICY "Users and guests can insert handwritten essays" ON public.handwritten_submissions 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users and teachers can view handwritten essays" ON public.handwritten_submissions 
  FOR SELECT USING (true);

CREATE POLICY "Teachers can update handwritten essays" ON public.handwritten_submissions 
  FOR UPDATE USING (true);

-- Speaking Sessions Policies
CREATE POLICY "Users and guests can insert speaking sessions" ON public.speaking_sessions 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users and teachers can view speaking sessions" ON public.speaking_sessions 
  FOR SELECT USING (true);

CREATE POLICY "Teachers can update speaking sessions" ON public.speaking_sessions 
  FOR UPDATE USING (true);

-- Teacher Evaluations Policies
CREATE POLICY "Teachers can insert evaluations" ON public.teacher_evaluations 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "All users can view evaluations" ON public.teacher_evaluations 
  FOR SELECT USING (true);

-- Storage bucket access policies
CREATE POLICY "Public Access for Handwritten Essays" ON storage.objects
  FOR SELECT USING (bucket_id = 'handwritten_essays');

CREATE POLICY "Public Upload for Handwritten Essays" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'handwritten_essays');

CREATE POLICY "Public Access for Speaking Audio" ON storage.objects
  FOR SELECT USING (bucket_id = 'speaking_audio');

CREATE POLICY "Public Upload for Speaking Audio" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'speaking_audio');

-- 6. REALTIME REGISTRATION
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'exam_attempts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_attempts;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'handwritten_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.handwritten_submissions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'speaking_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.speaking_sessions;
  END IF;
END $$;

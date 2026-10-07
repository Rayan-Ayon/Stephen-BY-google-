-- 1. Ensure public.exam_attempts exists and is exposed to PostgREST
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    test_id TEXT NOT NULL,
    module TEXT NOT NULL DEFAULT 'listening',
    category TEXT NOT NULL DEFAULT 'academic',
    title TEXT,
    book_number INT,
    test_number INT,
    raw_score INT DEFAULT 0,
    total_questions INT DEFAULT 40,
    band_score NUMERIC(3, 1) DEFAULT 0.0,
    time_spent_seconds INT DEFAULT 0,
    answers_payload JSONB DEFAULT '{}'::jsonb,
    ai_evaluation JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by test_id and user_id
CREATE INDEX IF NOT EXISTS idx_exam_attempts_test_id ON public.exam_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_module ON public.exam_attempts(module);

-- 2. Add transcript, timestamp, and explanation columns to questions & sections
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS explanation TEXT,
ADD COLUMN IF NOT EXISTS evidence_quote TEXT,
ADD COLUMN IF NOT EXISTS timestamp_seconds INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS timestamp_str TEXT DEFAULT '00:00';

ALTER TABLE public.sections 
ADD COLUMN IF NOT EXISTS transcript TEXT;

-- 3. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

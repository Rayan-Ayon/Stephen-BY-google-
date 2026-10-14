-- ============================================================================
-- 20261014_part_practice_attempts.sql
-- Dedicated Single-Part & Question Type Practice Attempts Telemetry Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.part_practice_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_email TEXT,
    attempt_type TEXT NOT NULL DEFAULT 'part', -- 'part' | 'question_type'
    module TEXT NOT NULL,                      -- 'reading' | 'listening' | 'writing' | 'speaking'
    book_number INT DEFAULT 7,
    test_number INT DEFAULT 1,
    part_number INT DEFAULT 1,                 -- 1, 2, 3, 4
    scoped_target TEXT NOT NULL,               -- e.g. 'Passage 1 (Q1–13)', 'Part 1 (Q1–10)', 'Task 1 (Academic Report)', 'Part 2 (Cue Card)'
    exam_title TEXT NOT NULL,                  -- e.g. 'Cambridge 7 Test 1 — Passage 1'
    drill_name TEXT,                           -- e.g. 'True / False / Not Given', 'Matching Headings'
    source_exam TEXT,                          -- e.g. 'Cambridge 7 Test 1 — Part 1'
    category TEXT DEFAULT 'academic',          -- 'academic' | 'general'
    source_type TEXT DEFAULT 'cambridge',      -- 'cambridge' | 'mock_series'
    band_score NUMERIC(3, 1) DEFAULT 0.0,
    raw_score INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    accuracy_percentage NUMERIC(5, 2) DEFAULT 0.0,
    time_spent_seconds INT DEFAULT 0,
    status TEXT DEFAULT 'TARGET',              -- 'TARGET' | 'GOOD' | 'DEVELOP' | 'AT_RISK'
    user_responses JSONB DEFAULT '{}'::jsonb,  -- Candidate answers: e.g. { "1": "TRUE", "2": "NOT GIVEN" } or essay text or audio/transcripts
    detailed_results JSONB DEFAULT '{}'::jsonb, -- Question-by-question telemetry, criterion breakdowns, tapeScript excerpts
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compound indexes for blazing fast query telemetry
CREATE INDEX IF NOT EXISTS idx_part_practice_attempts_user_id ON public.part_practice_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_part_practice_attempts_module ON public.part_practice_attempts(module);
CREATE INDEX IF NOT EXISTS idx_part_practice_attempts_type ON public.part_practice_attempts(attempt_type);
CREATE INDEX IF NOT EXISTS idx_part_practice_attempts_created ON public.part_practice_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_part_practice_attempts_module_created ON public.part_practice_attempts(module, created_at DESC);

-- Enable RLS
ALTER TABLE public.part_practice_attempts ENABLE ROW LEVEL SECURITY;

-- Permissive policies for reading & inserting attempts
DROP POLICY IF EXISTS "Users can view their own part practice attempts" ON public.part_practice_attempts;
CREATE POLICY "Users can view their own part practice attempts"
    ON public.part_practice_attempts FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert part practice attempts" ON public.part_practice_attempts;
CREATE POLICY "Users can insert part practice attempts"
    ON public.part_practice_attempts FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own part practice attempts" ON public.part_practice_attempts;
CREATE POLICY "Users can update their own part practice attempts"
    ON public.part_practice_attempts FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete their own part practice attempts" ON public.part_practice_attempts;
CREATE POLICY "Users can delete their own part practice attempts"
    ON public.part_practice_attempts FOR DELETE
    USING (true);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

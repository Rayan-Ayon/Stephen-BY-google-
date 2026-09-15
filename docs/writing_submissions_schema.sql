-- ============================================================
-- writing_submissions table
-- Stores IELTS writing exam submissions + AI evaluation results
-- ============================================================

CREATE TABLE IF NOT EXISTS writing_submissions (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            uuid REFERENCES auth.users(id),
    user_email         text,
    source_type        text NOT NULL,
    book_or_set_number integer NOT NULL,
    test_number        integer NOT NULL,
    module_type        text NOT NULL,
    task1_prompt       text,
    task1_response     text,
    task1_word_count   integer,
    task2_prompt       text,
    task2_response     text,
    task2_word_count   integer,
    overall_band       numeric(3,1),
    evaluation         jsonb NOT NULL,
    created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_writing_submissions_user
    ON writing_submissions (user_id, created_at DESC);

-- ============================================================
-- RLS: authenticated users can read/insert their own rows
-- ============================================================
ALTER TABLE writing_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own writing submissions"
    ON writing_submissions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own writing submissions"
    ON writing_submissions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Migration: ensure critical columns exist
-- Safe to re-run (IF NOT EXISTS is idempotent)
-- ============================================================
ALTER TABLE public.writing_submissions
    ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE public.writing_submissions
    ADD COLUMN IF NOT EXISTS user_email text;

ALTER TABLE public.writing_submissions
    ADD COLUMN IF NOT EXISTS module_type text NOT NULL DEFAULT 'academic';

ALTER TABLE public.writing_submissions
    ADD COLUMN IF NOT EXISTS source_type text NOT NULL DEFAULT 'cambridge';

ALTER TABLE public.writing_submissions
    ADD COLUMN IF NOT EXISTS book_or_set_number integer NOT NULL DEFAULT 18;

ALTER TABLE public.writing_submissions
    ADD COLUMN IF NOT EXISTS test_number integer NOT NULL DEFAULT 1;

-- Rename ai_feedback → evaluation (idempotent check)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'writing_submissions' AND column_name = 'ai_feedback'
    ) THEN
        ALTER TABLE public.writing_submissions RENAME COLUMN ai_feedback TO evaluation;
    END IF;
END $$;

-- Ensure evaluation column is nullable with default
ALTER TABLE public.writing_submissions
    ALTER COLUMN evaluation DROP NOT NULL,
    ALTER COLUMN evaluation SET DEFAULT '{}'::jsonb;

-- Ensure overall_band is nullable (set after AI evaluation completes)
ALTER TABLE public.writing_submissions
    ALTER COLUMN overall_band DROP NOT NULL;

-- speaking_submissions_schema.sql
-- Run this in Supabase SQL Editor to create the speaking_submissions table.

CREATE TABLE IF NOT EXISTS speaking_submissions (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            uuid REFERENCES auth.users(id),
    user_email         text,
    submission_id      uuid REFERENCES user_submissions(id),
    question_prompt    text,
    overall_band       numeric(3,1),
    fluency_score      numeric(3,1),
    lexical_score      numeric(3,1),
    grammar_score      numeric(3,1),
    pronunciation_score numeric(3,1),
    transcript         text,
    raw_json_feedback  jsonb,
    created_at         timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE speaking_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own speaking submissions"
    ON speaking_submissions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own speaking submissions"
    ON speaking_submissions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Index for fast lookups by submission_id
CREATE INDEX IF NOT EXISTS idx_speaking_submissions_submission_id
    ON speaking_submissions (submission_id);

-- Index for fast lookups by user_id
CREATE INDEX IF NOT EXISTS idx_speaking_submissions_user_id
    ON speaking_submissions (user_id);

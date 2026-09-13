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

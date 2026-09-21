-- ============================================================
-- speaking_questions table
-- Stores IELTS Speaking prompts for Cambridge books & mock series
-- Covers Part 1 (Interview), Part 2 (Cue Card / Long Turn), and Part 3 (Discussion)
-- ============================================================

CREATE TABLE IF NOT EXISTS speaking_questions (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type        text NOT NULL CHECK (source_type IN ('cambridge', 'mock_series')),
    book_or_set_number integer NOT NULL,
    test_number        integer NOT NULL CHECK (test_number BETWEEN 1 AND 4),
    module_type        text NOT NULL CHECK (module_type IN ('academic', 'general')),
    part_number        integer NOT NULL CHECK (part_number BETWEEN 1 AND 3),
    topic_title        text NOT NULL,
    cue_card_topic     text,
    prompts            jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at         timestamptz NOT NULL DEFAULT now()
);

-- Uniqueness: one row per source + book + test + module + part
CREATE UNIQUE INDEX IF NOT EXISTS idx_speaking_questions_unique
    ON speaking_questions (source_type, book_or_set_number, test_number, module_type, part_number);

-- Fast lookup for speaking tests
CREATE INDEX IF NOT EXISTS idx_speaking_questions_lookup
    ON speaking_questions (source_type, book_or_set_number, test_number);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE speaking_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read speaking questions"
    ON speaking_questions
    FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Service role can manage speaking questions"
    ON speaking_questions
    FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================================
-- SEED DATA — Cambridge 7 Test 1
-- ============================================================
INSERT INTO speaking_questions
    (source_type, book_or_set_number, test_number, module_type, part_number, topic_title, cue_card_topic, prompts)
VALUES
    -- Cambridge 7 — Test 1 — Part 1
    ('cambridge', 7, 1, 'academic', 1,
     'Hometown & Accommodation',
     NULL,
     '["What kind of place is your hometown or village?", "What is the most interesting part of your town or village?", "What kind of jobs do the people in your town or village do?", "Would you say it is a good place to live? Why?", "Tell me about the kind of accommodation you live in.", "How long have you lived there?"]'::jsonb),

    -- Cambridge 7 — Test 1 — Part 2 (Cue Card)
    ('cambridge', 7, 1, 'academic', 2,
     'A Teacher Who Influenced You',
     'a teacher who has greatly influenced you in your education',
     '["where you met them", "what subject they taught", "what was special about them", "and explain why this person influenced you so much"]'::jsonb),

    -- Cambridge 7 — Test 1 — Part 3
    ('cambridge', 7, 1, 'academic', 3,
     'Developments in Education',
     NULL,
     '["How has teaching changed in your country in the last few decades?", "What is the effect of modern technology on education in your opinion?", "What changes do you think there will be in education in the future?", "How can a country improve its education system?"]'::jsonb)
ON CONFLICT (source_type, book_or_set_number, test_number, module_type, part_number)
DO UPDATE SET
    topic_title = EXCLUDED.topic_title,
    cue_card_topic = EXCLUDED.cue_card_topic,
    prompts = EXCLUDED.prompts;

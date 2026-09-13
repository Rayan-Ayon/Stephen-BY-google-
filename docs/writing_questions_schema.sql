-- ============================================================
-- writing_questions table
-- Stores IELTS writing prompts for Cambridge books & mock series
-- ============================================================

CREATE TABLE IF NOT EXISTS writing_questions (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type   text NOT NULL CHECK (source_type IN ('cambridge', 'mock_series')),
    book_or_set_number integer NOT NULL,
    test_number   integer NOT NULL CHECK (test_number BETWEEN 1 AND 4),
    module_type   text NOT NULL CHECK (module_type IN ('academic', 'general')),
    task_type     text NOT NULL CHECK (task_type IN ('task_1', 'task_2')),
    instruction   text NOT NULL,
    prompt_text   text NOT NULL,
    image_url     text,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- Uniqueness: one row per source+book+test+module+task combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_writing_questions_unique
    ON writing_questions (source_type, book_or_set_number, test_number, module_type, task_type);

-- Fast lookups for exam queries
CREATE INDEX IF NOT EXISTS idx_writing_questions_lookup
    ON writing_questions (source_type, book_or_set_number, test_number);

-- ============================================================
-- RLS: any authenticated user can read; only service-role can write
-- ============================================================
ALTER TABLE writing_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read writing questions"
    ON writing_questions
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert writing questions"
    ON writing_questions
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update writing questions"
    ON writing_questions
    FOR UPDATE
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete writing questions"
    ON writing_questions
    FOR DELETE
    USING (auth.role() = 'service_role');

-- ============================================================
-- SEED DATA — Cambridge IELTS 18 (sample)
-- ============================================================
INSERT INTO writing_questions
    (source_type, book_or_set_number, test_number, module_type, task_type, instruction, prompt_text, image_url)
VALUES
    -- Cambridge 18 — Test 1 — Academic Task 1
    ('cambridge', 18, 1, 'academic', 'task_1',
     'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
     'The bar chart below shows the percentage of people in four different age groups who visited libraries, museums, and theatres in one country in 2008 and 2018.',
     NULL),

    -- Cambridge 18 — Test 1 — Task 2 (common)
    ('cambridge', 18, 1, 'academic', 'task_2',
     'Give reasons for your answer and include any relevant examples from your own knowledge and experience.',
     'Some people believe that university students should be required to attend classes, while others believe that going to classes should be optional for students. Which view do you agree with?',
     NULL),

    -- Cambridge 18 — Test 1 — General Training Task 1
    ('cambridge', 18, 1, 'general', 'task_1',
     'Write a letter of at least 150 words. You should spend about 20 minutes on this task.',
     'You recently bought a piece of electronic equipment from a shop but it stopped working after one day. Write a letter to the shop manager. In your letter, describe the product you bought, explain what happened, and say what you would like the manager to do.',
     NULL),

    -- Cambridge 18 — Test 1 — General Training Task 2 (same as academic)
    ('cambridge', 18, 1, 'general', 'task_2',
     'Give reasons for your answer and include any relevant examples from your own knowledge and experience.',
     'Some people believe that university students should be required to attend classes, while others believe that going to classes should be optional for students. Which view do you agree with?',
     NULL),

    -- Cambridge 18 — Test 2 — Academic Task 1
    ('cambridge', 18, 2, 'academic', 'task_1',
     'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
     'The table below gives information about the underground railway systems in six major cities.',
     NULL),

    -- Cambridge 18 — Test 2 — Task 2 (common)
    ('cambridge', 18, 2, 'academic', 'task_2',
     'Give reasons for your answer and include any relevant examples from your own knowledge and experience.',
     'Some people think that the increasing use of computers and mobile phones for communication has had a negative effect on young people''s reading and writing skills. To what extent do you agree or disagree?',
     NULL),

    -- Cambridge 18 — Test 2 — General Training Task 1
    ('cambridge', 18, 2, 'general', 'task_1',
     'Write a letter of at least 150 words. You should spend about 20 minutes on this task.',
     'You are leaving your current job to move to a new company. Write a letter to your current manager. In your letter, explain why you are leaving, say what you have enjoyed about the job, and offer to help during the transition period.',
     NULL),

    -- Cambridge 18 — Test 2 — General Training Task 2 (same)
    ('cambridge', 18, 2, 'general', 'task_2',
     'Give reasons for your answer and include any relevant examples from your own knowledge and experience.',
     'Some people think that the increasing use of computers and mobile phones for communication has had a negative effect on young people''s reading and writing skills. To what extent do you agree or disagree?',
     NULL),

    -- Cambridge 18 — Test 3 — Academic Task 1
    ('cambridge', 18, 3, 'academic', 'task_1',
     'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
     'The pie charts below show the main reasons for study among students of different age groups.',
     NULL),

    -- Cambridge 18 — Test 3 — Task 2 (common)
    ('cambridge', 18, 3, 'academic', 'task_2',
     'Give reasons for your answer and include any relevant examples from your own knowledge and experience.',
     'Some people say that the best way to improve public health is by increasing the number of sports facilities. Others, however, say that this would have little effect on public health and that other measures are needed. Discuss both these views and give your own opinion.',
     NULL),

    -- Cambridge 18 — Test 3 — General Training Task 1
    ('cambridge', 18, 3, 'general', 'task_1',
     'Write a letter of at least 150 words. You should spend about 20 minutes on this task.',
     'You have recently started a new job. Write a letter to your friend. In your letter, describe your new job, say what you like about it, and invite your friend to visit you at your workplace.',
     NULL),

    -- Cambridge 18 — Test 3 — General Training Task 2 (same)
    ('cambridge', 18, 3, 'general', 'task_2',
     'Give reasons for your answer and include any relevant examples from your own knowledge and experience.',
     'Some people say that the best way to improve public health is by increasing the number of sports facilities. Others, however, say that this would have little effect on public health and that other measures are needed. Discuss both these views and give your own opinion.',
     NULL),

    -- Cambridge 18 — Test 4 — Academic Task 1
    ('cambridge', 18, 4, 'academic', 'task_1',
     'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
     'The diagram below shows the process of making chocolate.',
     NULL),

    -- Cambridge 18 — Test 4 — Task 2 (common)
    ('cambridge', 18, 4, 'academic', 'task_2',
     'Give reasons for your answer and include any relevant examples from your own knowledge and experience.',
     'In many countries, young people are leaving rural areas to live in cities. What are the reasons for this? Is this a positive or negative development?',
     NULL),

    -- Cambridge 18 — Test 4 — General Training Task 1
    ('cambridge', 18, 4, 'general', 'task_1',
     'Write a letter of at least 150 words. You should spend about 20 minutes on this task.',
     'You recently attended a training course that was very useful. Write a letter to the course organiser. In your letter, describe the course you attended, explain how it helped you, and suggest improvements for future courses.',
     NULL),

    -- Cambridge 18 — Test 4 — General Training Task 2 (same)
    ('cambridge', 18, 4, 'general', 'task_2',
     'Give reasons for your answer and include any relevant examples from your own knowledge and experience.',
     'In many countries, young people are leaving rural areas to live in cities. What are the reasons for this? Is this a positive or negative development?',
     NULL);

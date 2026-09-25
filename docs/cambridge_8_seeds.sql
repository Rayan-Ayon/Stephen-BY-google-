-- ============================================================
-- Cambridge 8 Reading Tests 1-4 Database Seed Script
-- Both question_groups.choices and questions.options use JSONB
-- ============================================================

-- ============================================================
-- Ensure choices on question_groups and options on questions are JSONB
-- ============================================================
DO $$
BEGIN
    -- Ensure question_groups.choices is JSONB
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'question_groups' AND column_name = 'choices'
    ) THEN
        ALTER TABLE question_groups ADD COLUMN IF NOT EXISTS choices JSONB;
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'question_groups' AND column_name = 'choices' AND data_type != 'jsonb'
    ) THEN
        ALTER TABLE question_groups ALTER COLUMN choices TYPE JSONB USING choices::jsonb;
    END IF;

    -- Ensure questions.options is JSONB
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'questions' AND column_name = 'options'
    ) THEN
        ALTER TABLE questions ADD COLUMN IF NOT EXISTS options JSONB;
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'questions' AND column_name = 'options' AND data_type != 'jsonb'
    ) THEN
        ALTER TABLE questions ALTER COLUMN options TYPE JSONB USING options::jsonb;
    END IF;
END $$;


-- ============================================================
-- Cambridge 8 - Academic Test 1
-- Exam ID: c8000000-0000-0000-0000-000000000001
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'c8000000-0000-0000-0000-000000000001';
BEGIN
    -- 1. Ensure Parent Exam & Test Records Exist
    INSERT INTO exams (id, title, test_number, difficulty)
    VALUES ('c8000000-0000-0000-0000-000000000001', 'Cambridge 8 Academic', 1, 'Medium')
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

    -- If your schema uses a separate 'tests' table referenced by sections.test_id:
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number) 
            VALUES ('c8000000-0000-0000-0000-000000000001', 'Cambridge 8 Academic Test 1', 1)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, 
                test_number = EXCLUDED.test_number;
        EXCEPTION WHEN OTHERS THEN
            -- Fallback if secondary constraint is present
            BEGIN
                INSERT INTO tests (id, title, test_number)
                VALUES ('c8000000-0000-0000-0000-000000000001', 'Cambridge 8 Academic Test 1', (SELECT COALESCE(MAX(test_number), 0) + 1 FROM tests))
                ON CONFLICT (id) DO UPDATE
                SET title = EXCLUDED.title,
                    test_number = EXCLUDED.test_number;
            EXCEPTION WHEN OTHERS THEN
                NULL;
            END;
        END;
    END IF;

    -- Ensure exam_id column exists on sections table (relational link to exams)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sections' AND column_name = 'exam_id'
    ) THEN
        ALTER TABLE sections ADD COLUMN exam_id UUID REFERENCES exams(id) ON DELETE CASCADE;
    END IF;

    -- Step 1: Delete dependent questions
    DELETE FROM questions 
    WHERE group_id IN (
        SELECT qg.id FROM question_groups qg
        JOIN sections s ON qg.section_id = s.id
        WHERE s.exam_id = v_exam_id OR s.test_id = v_exam_id
    );

    -- Step 2: Delete question_groups via section_id relational query
    DELETE FROM question_groups 
    WHERE section_id IN (
        SELECT id FROM sections 
        WHERE exam_id = v_exam_id OR test_id = v_exam_id
    );

    -- Step 3: Delete sections for this exam
    DELETE FROM sections 
    WHERE exam_id = v_exam_id OR test_id = v_exam_id;
END $$;

-- 1. Insert Sections
INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8010000-0000-0000-0000-000000000001', 'c8000000-0000-0000-0000-000000000001', 'c8000000-0000-0000-0000-000000000001', 1, 'A Chronicle of Timekeeping', 'Easy', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8010000-0000-0000-0000-000000000002', 'c8000000-0000-0000-0000-000000000001', 'c8000000-0000-0000-0000-000000000001', 2, 'AIR TRAFFIC CONTROL IN THE USA', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8010000-0000-0000-0000-000000000003', 'c8000000-0000-0000-0000-000000000001', 'c8000000-0000-0000-0000-000000000001', 3, 'TELEPATHY', 'Hard', 14)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- 2. Insert Question Groups
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8010000-0000-0000-0000-000000000010', 'c8010000-0000-0000-0000-000000000001', 'MATCHING_INFO', 'Reading Passage 1 has eight paragraphs, A-H. Which paragraph contains the following information? Choose the correct letter, A-H.', 1, 4, '["A", "B", "C", "D", "E", "F", "G", "H"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8010000-0000-0000-0000-000000000020', 'c8010000-0000-0000-0000-000000000001', 'MATCHING_FEATURES', 'Look at the following events and the list of nationalities below. Match each event with the correct nationality, A-F.', 5, 8, '["A. Babylonians", "B. Egyptians", "C. Greeks", "D. English", "E. Germans", "F. French"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8010000-0000-0000-0000-000000000030', 'c8010000-0000-0000-0000-000000000001', 'DIAGRAM_COMPLETION', 'Label the diagram below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 9, 13, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8010000-0000-0000-0000-000000000040', 'c8010000-0000-0000-0000-000000000002', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information given in Reading Passage 2? Write TRUE, FALSE, or NOT GIVEN.', 14, 19, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8010000-0000-0000-0000-000000000050', 'c8010000-0000-0000-0000-000000000002', 'MATCHING_HEADINGS', 'Reading Passage 2 has seven paragraphs, A-G. Choose the correct heading for each paragraph from the list of headings below.', 20, 26, '["i. Disobeying FAA regulations", "ii. Aviation disaster prompts action", "iii. Two systems of rule", "iv. Setting altitude zones", "v. An oversimplified view", "vi. Defining airspace boundaries", "vii. First steps towards ATC", "viii. Evolution of FAA responsibilities"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8010000-0000-0000-0000-000000000060', 'c8010000-0000-0000-0000-000000000003', 'MATCHING_ENDINGS', 'Complete each sentence with the correct ending, A-G, below.', 27, 30, '["A. were subjected to strict experimental controls.", "B. focused on mental state and altered consciousness.", "C. produced statistically significant positive results.", "D. failed to withstand scientific scrutiny.", "E. relied on subjective sensory cues.", "F. proved conclusively that telepathy exists.", "G. used electromagnetic shielding techniques."]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8010000-0000-0000-0000-000000000070', 'c8010000-0000-0000-0000-000000000003', 'TABLE_COMPLETION', 'Complete the table below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.', 31, 40, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- 3. Insert Questions
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000101', 'c8010000-0000-0000-0000-000000000010', 1, 'a description of an early timekeeping invention affected by cold temperatures', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000102', 'c8010000-0000-0000-0000-000000000010', 2, 'an explanation of the importance of geography in the development of the calendar in farming communities', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000103', 'c8010000-0000-0000-0000-000000000010', 3, 'a description of the origins of the pendulum clock', NULL, 'F')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000104', 'c8010000-0000-0000-0000-000000000010', 4, 'details of the simultaneous appearance of different societies'' approaches to timekeeping', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000105', 'c8010000-0000-0000-0000-000000000020', 5, 'they devised a civil calendar in which the months were equal in length', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000106', 'c8010000-0000-0000-0000-000000000020', 6, 'they divided the day into two equal halves', NULL, 'F')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000107', 'c8010000-0000-0000-0000-000000000020', 7, 'they developed a new cabinet shape for a type of timekeeper', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000108', 'c8010000-0000-0000-0000-000000000020', 8, 'they created a system of organising time based on astronomical observations', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000109', 'c8010000-0000-0000-0000-000000000030', 9, '(anchor) [9] escapement', NULL, 'escapement')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000110', 'c8010000-0000-0000-0000-000000000030', 10, '[10] wheel', NULL, 'escape wheel')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000111', 'c8010000-0000-0000-0000-000000000030', 11, 'controlled by a swinging [11]', NULL, 'pendulum')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000112', 'c8010000-0000-0000-0000-000000000030', 12, 'power provided by a falling [12]', NULL, 'weight')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000113', 'c8010000-0000-0000-0000-000000000030', 13, 'transferred through [13] to move clock hands', NULL, 'gear wheels')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000114', 'c8010000-0000-0000-0000-000000000040', 14, 'The FAA was created as a result of the introduction of the jet engine.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000115', 'c8010000-0000-0000-0000-000000000040', 15, 'Air Traffic Control started after the Grand Canyon crash in 1956.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000116', 'c8010000-0000-0000-0000-000000000040', 16, 'Beacons and flashing lights were initially used to mark air routes.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000117', 'c8010000-0000-0000-0000-000000000040', 17, 'Aviation officials expected radar to solve air traffic control problems immediately.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000118', 'c8010000-0000-0000-0000-000000000040', 18, 'The FAA is responsible for military aircraft as well as civilian aircraft.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000119', 'c8010000-0000-0000-0000-000000000040', 19, 'All aircraft must fly under Instrument Flight Rules at all times.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000120', 'c8010000-0000-0000-0000-000000000050', 20, 'Paragraph A', NULL, 'ii')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000121', 'c8010000-0000-0000-0000-000000000050', 21, 'Paragraph B', NULL, 'vii')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000122', 'c8010000-0000-0000-0000-000000000050', 22, 'Paragraph C', NULL, 'iii')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000123', 'c8010000-0000-0000-0000-000000000050', 23, 'Paragraph D', NULL, 'v')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000124', 'c8010000-0000-0000-0000-000000000050', 24, 'Paragraph E', NULL, 'iv')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000125', 'c8010000-0000-0000-0000-000000000050', 25, 'Paragraph F', NULL, 'vi')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000126', 'c8010000-0000-0000-0000-000000000050', 26, 'Paragraph G', NULL, 'viii')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000127', 'c8010000-0000-0000-0000-000000000060', 27, 'Researchers with differing attitudes towards telepathy agree on the need for [27].', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000128', 'c8010000-0000-0000-0000-000000000060', 28, 'Reports of telepathic experiences were initially ignored because they [28].', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000129', 'c8010000-0000-0000-0000-000000000060', 29, 'The Ganzfeld experiments were distinctive because they [29].', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000130', 'c8010000-0000-0000-0000-000000000060', 30, 'Meta-analyses of the Ganzfeld studies revealed that they [30].', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000131', 'c8010000-0000-0000-0000-000000000070', 31, 'In Ganzfeld experiments, the receiver is placed in a state of sensory [31].', NULL, 'deprivation')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000132', 'c8010000-0000-0000-0000-000000000070', 32, 'Receivers wear headphones playing [32] to mask extraneous sounds.', NULL, 'white noise')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000133', 'c8010000-0000-0000-0000-000000000070', 33, 'Visual stimulation is filtered using halved [33] over the eyes.', NULL, 'ping-pong balls')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000134', 'c8010000-0000-0000-0000-000000000070', 34, 'A total of [34] possible target images or video clips are selected.', NULL, 'four')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000135', 'c8010000-0000-0000-0000-000000000070', 35, 'By pure chance, a receiver would be expected to achieve a success rate of [35] percent.', NULL, '25')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000136', 'c8010000-0000-0000-0000-000000000070', 36, 'Actual experimental trials yielded hit rates consistently around [36] percent.', NULL, '34')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000137', 'c8010000-0000-0000-0000-000000000070', 37, 'Independent statistical evaluations were conducted by sceptic [37].', NULL, 'Ray Hyman')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000138', 'c8010000-0000-0000-0000-000000000070', 38, 'Parapsychologist [38] collaborated to establish a standardised protocol.', NULL, 'Charles Honorton')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000139', 'c8010000-0000-0000-0000-000000000070', 39, 'Subsequent automated trials were designated the [39] experiments.', NULL, 'autoganzfeld')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8010000-0000-0000-0000-000000000140', 'c8010000-0000-0000-0000-000000000070', 40, 'The scientific community requires further repeatable evidence before reaching a [40].', NULL, 'consensus')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;


-- ============================================================
-- Cambridge 8 - Academic Test 2
-- Exam ID: c8000000-0000-0000-0000-000000000002
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'c8000000-0000-0000-0000-000000000002';
BEGIN
    -- 1. Ensure Parent Exam & Test Records Exist
    INSERT INTO exams (id, title, test_number, difficulty)
    VALUES ('c8000000-0000-0000-0000-000000000002', 'Cambridge 8 Academic', 2, 'Medium')
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

    -- If your schema uses a separate 'tests' table referenced by sections.test_id:
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number) 
            VALUES ('c8000000-0000-0000-0000-000000000002', 'Cambridge 8 Academic Test 2', 2)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, 
                test_number = EXCLUDED.test_number;
        EXCEPTION WHEN OTHERS THEN
            -- Fallback if secondary constraint is present
            BEGIN
                INSERT INTO tests (id, title, test_number)
                VALUES ('c8000000-0000-0000-0000-000000000002', 'Cambridge 8 Academic Test 2', (SELECT COALESCE(MAX(test_number), 0) + 1 FROM tests))
                ON CONFLICT (id) DO UPDATE
                SET title = EXCLUDED.title,
                    test_number = EXCLUDED.test_number;
            EXCEPTION WHEN OTHERS THEN
                NULL;
            END;
        END;
    END IF;

    -- Ensure exam_id column exists on sections table (relational link to exams)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sections' AND column_name = 'exam_id'
    ) THEN
        ALTER TABLE sections ADD COLUMN exam_id UUID REFERENCES exams(id) ON DELETE CASCADE;
    END IF;

    -- Step 1: Delete dependent questions
    DELETE FROM questions 
    WHERE group_id IN (
        SELECT qg.id FROM question_groups qg
        JOIN sections s ON qg.section_id = s.id
        WHERE s.exam_id = v_exam_id OR s.test_id = v_exam_id
    );

    -- Step 2: Delete question_groups via section_id relational query
    DELETE FROM question_groups 
    WHERE section_id IN (
        SELECT id FROM sections 
        WHERE exam_id = v_exam_id OR test_id = v_exam_id
    );

    -- Step 3: Delete sections for this exam
    DELETE FROM sections 
    WHERE exam_id = v_exam_id OR test_id = v_exam_id;
END $$;

-- 1. Insert Sections
INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8020000-0000-0000-0000-000000000001', 'c8000000-0000-0000-0000-000000000002', 'c8000000-0000-0000-0000-000000000002', 1, 'Sheet Glass Manufacture: the Float Process', 'Easy', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8020000-0000-0000-0000-000000000002', 'c8000000-0000-0000-0000-000000000002', 'c8000000-0000-0000-0000-000000000002', 2, 'The Little Ice Age', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8020000-0000-0000-0000-000000000003', 'c8000000-0000-0000-0000-000000000002', 'c8000000-0000-0000-0000-000000000002', 3, 'The meaning and power of smell', 'Hard', 14)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- 2. Insert Question Groups
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8020000-0000-0000-0000-000000000010', 'c8020000-0000-0000-0000-000000000001', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE, or NOT GIVEN.', 1, 8, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8020000-0000-0000-0000-000000000020', 'c8020000-0000-0000-0000-000000000001', 'DIAGRAM_COMPLETION', 'Complete the diagram below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 9, 13, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8020000-0000-0000-0000-000000000030', 'c8020000-0000-0000-0000-000000000002', 'MATCHING_INFO', 'Reading Passage 2 has seven paragraphs, A-G. Which paragraph contains the following information? Choose the correct letter, A-G.', 14, 17, '["A", "B", "C", "D", "E", "F", "G"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8020000-0000-0000-0000-000000000040', 'c8020000-0000-0000-0000-000000000002', 'MATCHING_FEATURES', 'Look at the following centuries and the climate phenomena below. Match each event with the correct century, A-E.', 18, 22, '["A. 14th century", "B. 16th century", "C. 17th century", "D. 18th century", "E. 19th century"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8020000-0000-0000-0000-000000000050', 'c8020000-0000-0000-0000-000000000002', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 23, 26, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8020000-0000-0000-0000-000000000060', 'c8020000-0000-0000-0000-000000000003', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 27, 32, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8020000-0000-0000-0000-000000000070', 'c8020000-0000-0000-0000-000000000003', 'MATCHING_ENDINGS', 'Complete each sentence with the correct ending, A-F, below.', 33, 36, '["A. provides vital bonding cues between mothers and infants.", "B. remains poorly understood by contemporary neuroscientists.", "C. can be identified with high statistical accuracy.", "D. stimulates the emotional control centres of the brain directly.", "E. declines rapidly in late adolescence.", "F. is less diverse than once hypothesized."]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8020000-0000-0000-0000-000000000080', 'c8020000-0000-0000-0000-000000000003', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information given in Reading Passage 3? Write TRUE, FALSE, or NOT GIVEN.', 37, 40, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- 3. Insert Questions
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000101', 'c8020000-0000-0000-0000-000000000010', 1, 'Spinning glass produces sheet glass of completely uniform thickness.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000102', 'c8020000-0000-0000-0000-000000000010', 2, 'Unpolished cylinder glass was not used in residential buildings.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000103', 'c8020000-0000-0000-0000-000000000010', 3, 'The continuous ribbon process replaced the cylinder method in the early 20th century.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000104', 'c8020000-0000-0000-0000-000000000010', 4, 'Pilkington invested substantial capital before the float process proved viable.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000105', 'c8020000-0000-0000-0000-000000000010', 5, 'The metal used in the float bath must have a higher melting point than glass.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000106', 'c8020000-0000-0000-0000-000000000010', 6, 'Molten tin will not adhere to cooling glass during floating.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000107', 'c8020000-0000-0000-0000-000000000010', 7, 'The float process can only manufacture glass of one standard thickness.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000108', 'c8020000-0000-0000-0000-000000000010', 8, 'Computers monitor faults in the ribbon as it exits the lehr.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000109', 'c8020000-0000-0000-0000-000000000020', 9, 'Raw materials melt in the furnace at [9] degrees Celsius.', NULL, '1500')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000110', 'c8020000-0000-0000-0000-000000000020', 10, 'Glass floats over a shallow bath of molten [10].', NULL, 'tin')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000111', 'c8020000-0000-0000-0000-000000000020', 11, 'Top rollers control the thickness and [11] of the ribbon.', NULL, 'width')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000112', 'c8020000-0000-0000-0000-000000000020', 12, 'Gradual cooling occurs inside an annealing [12].', NULL, 'lehr')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000113', 'c8020000-0000-0000-0000-000000000020', 13, 'Automated diamond cutters trim edges and eliminate [13].', NULL, 'flaws')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000114', 'c8020000-0000-0000-0000-000000000030', 14, 'documentation of proxy records used by paleoclimatologists', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000115', 'c8020000-0000-0000-0000-000000000030', 15, 'how climate variations altered the course of European military conflicts', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000116', 'c8020000-0000-0000-0000-000000000030', 16, 'the agricultural shift from grain cultivation to livestock in Scandinavia', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000117', 'c8020000-0000-0000-0000-000000000030', 17, 'evidence showing modern human activity is outpacing natural climate cycles', NULL, 'F')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000118', 'c8020000-0000-0000-0000-000000000040', 18, 'Glaciers in the Swiss Alps advanced dramatically destroying villages.', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000119', 'c8020000-0000-0000-0000-000000000040', 19, 'The Thames Frost Fairs were held regularly in London.', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000120', 'c8020000-0000-0000-0000-000000000040', 20, 'The Great Famine struck northern Europe following incessant summer rains.', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000121', 'c8020000-0000-0000-0000-000000000040', 21, 'European grain yields rebounded before the onset of the Year Without a Summer.', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000122', 'c8020000-0000-0000-0000-000000000040', 22, 'Global temperatures began an unprecedented continuous upward climb.', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000123', 'c8020000-0000-0000-0000-000000000050', 23, 'Scientists deduce ancient climate conditions by examining annual growth in [23].', NULL, 'tree rings')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000124', 'c8020000-0000-0000-0000-000000000050', 24, 'Bubbles trapped deep inside polar [24] preserve past atmospheric gases.', NULL, 'ice cores')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000125', 'c8020000-0000-0000-0000-000000000050', 25, 'Prolonged periods of low solar radiation coincided with minimal [25] activity.', NULL, 'sunspot')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000126', 'c8020000-0000-0000-0000-000000000050', 26, 'Dense airborne dust from major [26] shielded the earth from sunlight.', NULL, 'volcanic eruptions')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000127', 'c8020000-0000-0000-0000-000000000060', 27, 'In the introduction, the author suggests that our sense of smell is', '["A. undervalued compared to sight and hearing.", "B. less sophisticated than in other primates.", "C. primarily used for detecting physical danger.", "D. incapable of triggering deep emotional recall."]'::jsonb, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000128', 'c8020000-0000-0000-0000-000000000060', 28, 'What do the tests conducted at Concordia University demonstrate?', '["A. Scent preferences are genetically hardwired.", "B. Feelings about smells are culturally conditioned.", "C. Odours evoke faster responses than visual stimuli.", "D. Children recognise smells more readily than adults."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000129', 'c8020000-0000-0000-0000-000000000060', 29, 'The phenomenon of an odour triggering vivid memories is often referred to as the', '["A. Pavlovian association.", "B. Proustian effect.", "C. Olfactory paradox.", "D. Limbic resonance."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000130', 'c8020000-0000-0000-0000-000000000060', 30, 'According to the passage, describing specific smells is difficult because', '["A. the brain lacks dedicated olfactory vocabulary.", "B. human olfactory receptors fatigue very quickly.", "C. most smells comprise hundreds of separate compounds.", "D. emotions interfere with verbal cognition."]'::jsonb, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000131', 'c8020000-0000-0000-0000-000000000060', 31, 'Anthropological studies reveal that non-Western cultures', '["A. categorise smells using fundamental colour metaphors.", "B. regard floral perfumes as spiritually offensive.", "C. often possess extensive terminologies for odours.", "D. rarely associate smell with social hierarchy."]'::jsonb, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000132', 'c8020000-0000-0000-0000-000000000060', 32, 'Loss of the sense of smell (anosmia) frequently causes sufferers to feel', '["A. unusually aggressive in social interactions.", "B. completely detached from the surrounding world.", "C. hyper-sensitive to sound vibrations.", "D. prone to acute memory distortion."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000133', 'c8020000-0000-0000-0000-000000000070', 33, 'The personal olfactory signature of an individual [33].', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000134', 'c8020000-0000-0000-0000-000000000070', 34, 'Natural body odour in humans [34].', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000135', 'c8020000-0000-0000-0000-000000000070', 35, 'Input from olfactory nerves [35].', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000136', 'c8020000-0000-0000-0000-000000000070', 36, 'The precise mechanism of odorant molecule reception [36].', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000137', 'c8020000-0000-0000-0000-000000000080', 37, 'Odours can influence interpersonal attraction without conscious awareness.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000138', 'c8020000-0000-0000-0000-000000000080', 38, 'Men have a measurably keener sense of smell than women on average.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000139', 'c8020000-0000-0000-0000-000000000080', 39, 'Commercial fragrances are designed to mimic human pheromones.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8020000-0000-0000-0000-000000000140', 'c8020000-0000-0000-0000-000000000080', 40, 'Cultural taboos surrounding bad breath exist universally across civilizations.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;


-- ============================================================
-- Cambridge 8 - Academic Test 3
-- Exam ID: c8000000-0000-0000-0000-000000000003
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'c8000000-0000-0000-0000-000000000003';
BEGIN
    -- 1. Ensure Parent Exam & Test Records Exist
    INSERT INTO exams (id, title, test_number, difficulty)
    VALUES ('c8000000-0000-0000-0000-000000000003', 'Cambridge 8 Academic', 3, 'Medium')
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

    -- If your schema uses a separate 'tests' table referenced by sections.test_id:
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number) 
            VALUES ('c8000000-0000-0000-0000-000000000003', 'Cambridge 8 Academic Test 3', 3)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, 
                test_number = EXCLUDED.test_number;
        EXCEPTION WHEN OTHERS THEN
            -- Fallback if secondary constraint is present
            BEGIN
                INSERT INTO tests (id, title, test_number)
                VALUES ('c8000000-0000-0000-0000-000000000003', 'Cambridge 8 Academic Test 3', (SELECT COALESCE(MAX(test_number), 0) + 1 FROM tests))
                ON CONFLICT (id) DO UPDATE
                SET title = EXCLUDED.title,
                    test_number = EXCLUDED.test_number;
            EXCEPTION WHEN OTHERS THEN
                NULL;
            END;
        END;
    END IF;

    -- Ensure exam_id column exists on sections table (relational link to exams)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sections' AND column_name = 'exam_id'
    ) THEN
        ALTER TABLE sections ADD COLUMN exam_id UUID REFERENCES exams(id) ON DELETE CASCADE;
    END IF;

    -- Step 1: Delete dependent questions
    DELETE FROM questions 
    WHERE group_id IN (
        SELECT qg.id FROM question_groups qg
        JOIN sections s ON qg.section_id = s.id
        WHERE s.exam_id = v_exam_id OR s.test_id = v_exam_id
    );

    -- Step 2: Delete question_groups via section_id relational query
    DELETE FROM question_groups 
    WHERE section_id IN (
        SELECT id FROM sections 
        WHERE exam_id = v_exam_id OR test_id = v_exam_id
    );

    -- Step 3: Delete sections for this exam
    DELETE FROM sections 
    WHERE exam_id = v_exam_id OR test_id = v_exam_id;
END $$;

-- 1. Insert Sections
INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8030000-0000-0000-0000-000000000001', 'c8000000-0000-0000-0000-000000000003', 'c8000000-0000-0000-0000-000000000003', 1, 'Striking Back at Lightning with Lasers', 'Easy', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8030000-0000-0000-0000-000000000002', 'c8000000-0000-0000-0000-000000000003', 'c8000000-0000-0000-0000-000000000003', 2, 'The Nature of Genius', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8030000-0000-0000-0000-000000000003', 'c8000000-0000-0000-0000-000000000003', 'c8000000-0000-0000-0000-000000000003', 3, 'How Does the Biological Clock Tick?', 'Hard', 14)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- 2. Insert Question Groups
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000010', 'c8030000-0000-0000-0000-000000000001', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE, or NOT GIVEN.', 1, 3, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000020', 'c8030000-0000-0000-0000-000000000001', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 4, 6, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000030', 'c8030000-0000-0000-0000-000000000001', 'MATCHING_INFO', 'Which paragraph contains the following technical details? Choose the correct letter, A-G.', 7, 10, '["A", "B", "C", "D", "E", "F", "G"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000040', 'c8030000-0000-0000-0000-000000000001', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 11, 13, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000050', 'c8030000-0000-0000-0000-000000000002', 'MATCHING_INFO', 'Reading Passage 2 has seven sections, A-G. Which section contains the following information? Choose the correct letter, A-G.', 14, 18, '["A", "B", "C", "D", "E", "F", "G"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000060', 'c8030000-0000-0000-0000-000000000002', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information given in Reading Passage 2? Write TRUE, FALSE, or NOT GIVEN.', 19, 22, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000070', 'c8030000-0000-0000-0000-000000000002', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 23, 26, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000080', 'c8030000-0000-0000-0000-000000000003', 'MATCHING_INFO', 'Reading Passage 3 has six sections, A-F. Which section contains the following information? Choose the correct letter, A-F.', 27, 32, '["A", "B", "C", "D", "E", "F"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000090', 'c8030000-0000-0000-0000-000000000003', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 33, 36, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8030000-0000-0000-0000-000000000100', 'c8030000-0000-0000-0000-000000000003', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 37, 40, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- 3. Insert Questions
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000101', 'c8030000-0000-0000-0000-000000000010', 1, 'The main goal of EPFL laser research is to prevent thunderstorms from forming.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000102', 'c8030000-0000-0000-0000-000000000010', 2, 'Conventional rockets trailing wire are too dangerous to use near populated airports.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000103', 'c8030000-0000-0000-0000-000000000010', 3, 'Laser bolts require expensive beryllium mirrors to withstand electrical discharge.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000104', 'c8030000-0000-0000-0000-000000000020', 4, 'Intense laser pulses strip electrons from gas molecules, creating an ionized [4].', NULL, 'plasma channel')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000105', 'c8030000-0000-0000-0000-000000000020', 5, 'This conductor guides the discharge safely to a designated grounded [5].', NULL, 'rod')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000106', 'c8030000-0000-0000-0000-000000000020', 6, 'Field trials were conducted atop the Säntis [6] tower in northeastern Switzerland.', NULL, 'telecommunications')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000107', 'c8030000-0000-0000-0000-000000000030', 7, 'comparison of power consumption between different laser architectures', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000108', 'c8030000-0000-0000-0000-000000000030', 8, 'statistical frequency of cloud-to-ground strikes on sensitive infrastructure', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000109', 'c8030000-0000-0000-0000-000000000030', 9, 'environmental constraints such as dense fog and sub-zero temperatures', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000110', 'c8030000-0000-0000-0000-000000000030', 10, 'future deployment scenarios for protecting nuclear power stations', NULL, 'G')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000111', 'c8030000-0000-0000-0000-000000000040', 11, 'Why do researchers fire up to 1,000 laser pulses per second?', '["A. To heat the cloud base until rain evaporates.", "B. To sustain the conductive channel before it dissipates.", "C. To blind nearby optical sensor equipment.", "D. To synchronize with satellite radar sweeps."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000112', 'c8030000-0000-0000-0000-000000000040', 12, 'What was the main outcome of the 2021 alpine campaign?', '["A. All lightning activity in the canton ceased.", "B. The laser deflected four upward lightning discharges.", "C. The prototype laser melted during a power surge.", "D. Commercial airlines refused to fly over the region."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000113', 'c8030000-0000-0000-0000-000000000040', 13, 'Before laser lightning rods can enter widespread service, engineers must', '["A. make the apparatus compact and transportable.", "B. double the speed of light in atmospheric air.", "C. replace all existing metal conductors on skyscrapers.", "D. obtain international treaties prohibiting civilian lasers."]'::jsonb, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000114', 'c8030000-0000-0000-0000-000000000050', 14, 'the distinction between intellect, talent, and true genius', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000115', 'c8030000-0000-0000-0000-000000000050', 15, 'how social upbringing influences the fruition of exceptional abilities', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000116', 'c8030000-0000-0000-0000-000000000050', 16, 'examples of historical polymaths working across disparate disciplines', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000117', 'c8030000-0000-0000-0000-000000000050', 17, 'neurological hypotheses regarding divergent thinking and brain plasticity', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000118', 'c8030000-0000-0000-0000-000000000050', 18, 'the myth of the effortless, unprompted burst of inspiration', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000119', 'c8030000-0000-0000-0000-000000000060', 19, 'High IQ test scores correlate perfectly with revolutionary scientific breakthroughs.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000120', 'c8030000-0000-0000-0000-000000000060', 20, 'Most acclaimed prodigies sustain their pre-eminence well into late adulthood.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000121', 'c8030000-0000-0000-0000-000000000060', 21, 'Tenacity and tolerance for frustration are indispensable characteristics of innovators.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000122', 'c8030000-0000-0000-0000-000000000060', 22, 'Genetic factors play a greater role in mathematics than in visual arts.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000123', 'c8030000-0000-0000-0000-000000000070', 23, 'Herbert Simon demonstrated that masters require at least a decade of [23].', NULL, 'deliberate practice')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000124', 'c8030000-0000-0000-0000-000000000070', 24, 'In chess, grandmasters rapidly recognise thousands of structured board [24].', NULL, 'chunks')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000125', 'c8030000-0000-0000-0000-000000000070', 25, 'Creative breakthroughs depend on combining ideas from outside the primary [25].', NULL, 'domain')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000126', 'c8030000-0000-0000-0000-000000000070', 26, 'Society often attributes magic to what is essentially rigorous [26].', NULL, 'hard work')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000127', 'c8030000-0000-0000-0000-000000000080', 27, 'the molecular feedback loop regulating circadian protein synthesis', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000128', 'c8030000-0000-0000-0000-000000000080', 28, 'how blind organisms align their activity rhythms with day-night cycles', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000129', 'c8030000-0000-0000-0000-000000000080', 29, 'therapeutic implications for timing drug delivery to human patients', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000130', 'c8030000-0000-0000-0000-000000000080', 30, 'historical isolation experiments in deep subterranean caves', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000131', 'c8030000-0000-0000-0000-000000000080', 31, 'the role of the suprachiasmatic nucleus as the master pacemaker', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000132', 'c8030000-0000-0000-0000-000000000080', 32, 'consequences of artificial light pollution on ecological balance', NULL, 'F')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000133', 'c8030000-0000-0000-0000-000000000090', 33, 'The free-running circadian period in isolated human subjects averages roughly', '["A. 22 hours.", "B. 24.2 hours.", "C. 26.5 hours.", "D. 28 hours."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000134', 'c8030000-0000-0000-0000-000000000090', 34, 'Environmental synchronizers that reset internal clocks are termed', '["A. bio-oscillators.", "B. zeitgebers.", "C. neuro-switches.", "D. chrono-transmitters."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000135', 'c8030000-0000-0000-0000-000000000090', 35, 'What happens when peripheral organ clock genes are knocked out in mice?', '["A. Animals develop immediate cardiac arrest.", "B. Organ function becomes desynchronized while sleep patterns remain intact.", "C. The animals cease eating altogether.", "D. Lifespan is quadrupled due to metabolic suspension."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000136', 'c8030000-0000-0000-0000-000000000090', 36, 'Chronotherapy aims to maximize clinical efficacy by', '["A. administering medications when target cells are most receptive.", "B. sedating patients for 72 continuous hours.", "C. restricting calorie consumption to night-time hours.", "D. freezing tumor cells in nitrogen chambers."]'::jsonb, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000137', 'c8030000-0000-0000-0000-000000000100', 37, 'Retinal ganglion cells detect blue light using the pigment [37].', NULL, 'melanopsin')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000138', 'c8030000-0000-0000-0000-000000000100', 38, 'Signals travel directly along the retinohypothalamic [38] to the brain.', NULL, 'tract')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000139', 'c8030000-0000-0000-0000-000000000100', 39, 'Darkness triggers the pineal gland to synthesize and release [39].', NULL, 'melatonin')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8030000-0000-0000-0000-000000000140', 'c8030000-0000-0000-0000-000000000100', 40, 'Chronic shift work elevates risks of cardiovascular ailments and metabolic [40].', NULL, 'disorders')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;


-- ============================================================
-- Cambridge 8 - Academic Test 4
-- Exam ID: c8000000-0000-0000-0000-000000000004
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'c8000000-0000-0000-0000-000000000004';
BEGIN
    -- 1. Ensure Parent Exam & Test Records Exist
    INSERT INTO exams (id, title, test_number, difficulty)
    VALUES ('c8000000-0000-0000-0000-000000000004', 'Cambridge 8 Academic', 4, 'Medium')
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

    -- If your schema uses a separate 'tests' table referenced by sections.test_id:
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number) 
            VALUES ('c8000000-0000-0000-0000-000000000004', 'Cambridge 8 Academic Test 4', 4)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, 
                test_number = EXCLUDED.test_number;
        EXCEPTION WHEN OTHERS THEN
            -- Fallback if secondary constraint is present
            BEGIN
                INSERT INTO tests (id, title, test_number)
                VALUES ('c8000000-0000-0000-0000-000000000004', 'Cambridge 8 Academic Test 4', (SELECT COALESCE(MAX(test_number), 0) + 1 FROM tests))
                ON CONFLICT (id) DO UPDATE
                SET title = EXCLUDED.title,
                    test_number = EXCLUDED.test_number;
            EXCEPTION WHEN OTHERS THEN
                NULL;
            END;
        END;
    END IF;

    -- Ensure exam_id column exists on sections table (relational link to exams)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sections' AND column_name = 'exam_id'
    ) THEN
        ALTER TABLE sections ADD COLUMN exam_id UUID REFERENCES exams(id) ON DELETE CASCADE;
    END IF;

    -- Step 1: Delete dependent questions
    DELETE FROM questions 
    WHERE group_id IN (
        SELECT qg.id FROM question_groups qg
        JOIN sections s ON qg.section_id = s.id
        WHERE s.exam_id = v_exam_id OR s.test_id = v_exam_id
    );

    -- Step 2: Delete question_groups via section_id relational query
    DELETE FROM question_groups 
    WHERE section_id IN (
        SELECT id FROM sections 
        WHERE exam_id = v_exam_id OR test_id = v_exam_id
    );

    -- Step 3: Delete sections for this exam
    DELETE FROM sections 
    WHERE exam_id = v_exam_id OR test_id = v_exam_id;
END $$;

-- 1. Insert Sections
INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8040000-0000-0000-0000-000000000001', 'c8000000-0000-0000-0000-000000000004', 'c8000000-0000-0000-0000-000000000004', 1, 'Land of the Rising Sun', 'Easy', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8040000-0000-0000-0000-000000000002', 'c8000000-0000-0000-0000-000000000004', 'c8000000-0000-0000-0000-000000000004', 2, 'Biological Control of Pests', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c8040000-0000-0000-0000-000000000003', 'c8000000-0000-0000-0000-000000000004', 'c8000000-0000-0000-0000-000000000004', 3, 'Collecting Ant Specimens', 'Hard', 14)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- 2. Insert Question Groups
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8040000-0000-0000-0000-000000000010', 'c8040000-0000-0000-0000-000000000001', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 1, 4, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8040000-0000-0000-0000-000000000020', 'c8040000-0000-0000-0000-000000000001', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 5, 10, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8040000-0000-0000-0000-000000000030', 'c8040000-0000-0000-0000-000000000001', 'YES_NO_NOT_GIVEN', 'Do the following statements agree with the views of the author in Reading Passage 1? Write YES, NO, or NOT GIVEN.', 11, 13, '["YES", "NO", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8040000-0000-0000-0000-000000000040', 'c8040000-0000-0000-0000-000000000002', 'MATCHING_HEADINGS', 'Choose the correct heading for paragraphs A-D from the list of headings below.', 14, 17, '["i. Chemical pesticides: a pesticide treadmill", "ii. Re-introducing natural predators", "iii. Ecological devastation of monoculture", "iv. Economic benefits of non-toxic methods", "v. Genetic modification hazards"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8040000-0000-0000-0000-000000000050', 'c8040000-0000-0000-0000-000000000002', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 18, 21, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8040000-0000-0000-0000-000000000060', 'c8040000-0000-0000-0000-000000000002', 'YES_NO_NOT_GIVEN', 'Do the following statements agree with the claims of the writer? Write YES, NO, or NOT GIVEN.', 22, 26, '["YES", "NO", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8040000-0000-0000-0000-000000000070', 'c8040000-0000-0000-0000-000000000003', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 27, 30, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8040000-0000-0000-0000-000000000080', 'c8040000-0000-0000-0000-000000000003', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information given in Reading Passage 3? Write TRUE, FALSE, or NOT GIVEN.', 31, 36, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c8040000-0000-0000-0000-000000000090', 'c8040000-0000-0000-0000-000000000003', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 37, 40, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- 3. Insert Questions
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000101', 'c8040000-0000-0000-0000-000000000010', 1, 'Japanese pagoda architecture survived centuries of devastating [1].', NULL, 'earthquakes')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000102', 'c8040000-0000-0000-0000-000000000010', 2, 'The central pillar, or [2], acts as an independent swaying pendulum.', NULL, 'shinbashira')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000103', 'c8040000-0000-0000-0000-000000000010', 3, 'Wide projecting eaves act like a tightrope walker''s balancing [3].', NULL, 'pole')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000104', 'c8040000-0000-0000-0000-000000000010', 4, 'Individual timber joints are loosely interlocked without rigid [4].', NULL, 'nails')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000105', 'c8040000-0000-0000-0000-000000000020', 5, 'Only two multi-storey pagodas in Japan have collapsed due to', '["A. typhoons rather than earth tremors.", "B. deliberate demolition by warlords.", "C. fire caused by lightning strikes.", "D. rotting of subterranean cedar foundations."]'::jsonb, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000106', 'c8040000-0000-0000-0000-000000000020', 6, 'The Horyu-ji pagoda in Nara is renowned as the world''s oldest', '["A. stone monument.", "B. surviving wooden building.", "C. astronomical observatory.", "D. royal burial sanctuary."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000107', 'c8040000-0000-0000-0000-000000000020', 7, 'During seismic vibration, adjacent storeys of a Japanese pagoda move', '["A. in complete unison in one direction.", "B. in opposite directions like stacked bowls.", "C. vertically up and down on hydraulic joints.", "D. twisting clockwise around the pinnacle."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000108', 'c8040000-0000-0000-0000-000000000020', 8, 'Unlike European cathedrals, pagodas were constructed primarily to', '["A. house massive congregations during prayer.", "B. store Buddhist relics and enshrine sacred scriptures.", "C. defend settlements against enemy cavalry.", "D. collect rain runoff for mountain settlements."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000109', 'c8040000-0000-0000-0000-000000000020', 9, 'Modern skyscraper engineers have replicated the pagoda principle using', '["A. flexible silicone sealants.", "B. tuned mass dampers inside towers.", "C. hollow bamboo scaffolding.", "D. floating pneumatic foundation pods."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000110', 'c8040000-0000-0000-0000-000000000020', 10, 'Traditional Japanese carpenters relied on craftsmanship known as', '["A. origami folding.", "B. joinery without metal fasteners.", "C. stone dry-walling.", "D. bamboo weaving."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000111', 'c8040000-0000-0000-0000-000000000030', 11, 'The weight of the heavy clay roof tiles actually stabilizes the pagoda.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000112', 'c8040000-0000-0000-0000-000000000030', 12, 'Chinese pagodas used timber rather than brick as their primary building material.', NULL, 'NO')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000113', 'c8040000-0000-0000-0000-000000000030', 13, 'Master carpenters passed down construction secrets via illustrated manuals.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000114', 'c8040000-0000-0000-0000-000000000040', 14, 'Paragraph A', NULL, 'iii')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000115', 'c8040000-0000-0000-0000-000000000040', 15, 'Paragraph B', NULL, 'i')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000116', 'c8040000-0000-0000-0000-000000000040', 16, 'Paragraph C', NULL, 'ii')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000117', 'c8040000-0000-0000-0000-000000000040', 17, 'Paragraph D', NULL, 'iv')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000118', 'c8040000-0000-0000-0000-000000000050', 18, 'Over-reliance on broad-spectrum chemical sprays results in', '["A. rapid emergence of resistant pest strains.", "B. immediate recovery of topsoil nutrients.", "C. total eradication of invasive weeds.", "D. permanent reduction in fertilizer prices."]'::jsonb, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000119', 'c8040000-0000-0000-0000-000000000050', 19, 'The classic success story of biological control in 1888 involved using', '["A. cane toads against sugar cane beetles.", "B. vedalia beetles against cottony cushion scale.", "C. parasitic wasps against boll weevils.", "D. engineered fungi against locust swarms."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000120', 'c8040000-0000-0000-0000-000000000050', 20, 'Integrated Pest Management (IPM) advocates', '["A. zero intervention under any circumstances.", "B. combining biological, cultural, and selective chemical tactics.", "C. synthetic aerial spraying on a weekly calendar basis.", "D. importing untested tropical vertebrates to temperate zones."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000121', 'c8040000-0000-0000-0000-000000000050', 21, 'Indonesian rice farmers who abandoned routine pesticide spraying', '["A. lost their entire harvest to brown planthoppers.", "B. experienced higher yields and saved millions of dollars.", "C. were forced to clear surrounding rainforest.", "D. reverted to chemical fumigation within two years."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000122', 'c8040000-0000-0000-0000-000000000060', 22, 'Chemical companies aggressively lobbied developing nations to purchase synthetic pesticides.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000123', 'c8040000-0000-0000-0000-000000000060', 23, 'Biological control agents never pose any ecological risk to indigenous species.', NULL, 'NO')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000124', 'c8040000-0000-0000-0000-000000000060', 24, 'Quarantine screening protocols for imported natural enemies are now internationally standardized.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000125', 'c8040000-0000-0000-0000-000000000060', 25, 'Consumer demand for organic produce has grown faster in Asia than in North America.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000126', 'c8040000-0000-0000-0000-000000000060', 26, 'IPM practices require more ecological knowledge from farmers than chemical application.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000127', 'c8040000-0000-0000-0000-000000000070', 27, 'In the first paragraph, the author highlights that ants are ideal for ecological research because', '["A. they are extremely scarce and endangered.", "B. they inhabit almost all terrestrial habitats in immense abundance.", "C. their taxonomy is completely finalized.", "D. they only forage during daylight hours."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000128', 'c8040000-0000-0000-0000-000000000070', 28, 'A pitfall trap is most effective for sampling', '["A. flying reproductive alates.", "B. ground-dwelling, active surface forager species.", "C. wood-boring termite parasites.", "D. aquatic larval stages."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000129', 'c8040000-0000-0000-0000-000000000070', 29, 'A Berlese or Tullgren funnel extracts cryptic specimens from leaf litter by using', '["A. high-pressure cold water jets.", "B. a heat and light gradient above the sample.", "C. acoustic vibrations resembling predator footsteps.", "D. chemical pheromone lures."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000130', 'c8040000-0000-0000-0000-000000000070', 30, 'To preserve collected ant specimens for long-term genetic and morphological study, entomologists immerse them in', '["A. formalin solution.", "B. 70 to 95 percent ethanol.", "C. distilled mineral oil.", "D. saline solution."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000131', 'c8040000-0000-0000-0000-000000000080', 31, 'Baiting stations should exclusively use sugar solutions to attract every ant subfamily.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000132', 'c8040000-0000-0000-0000-000000000080', 32, 'Hand-collecting using an aspirator (pooter) allows precise capture without crushing soft bodies.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000133', 'c8040000-0000-0000-0000-000000000080', 33, 'Canopy fogging with pyrethrum is prohibited in national forest reserves.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000134', 'c8040000-0000-0000-0000-000000000080', 34, 'Ethylene glycol in pitfall traps prevents predatory beetles from consuming captured ants.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000135', 'c8040000-0000-0000-0000-000000000080', 35, 'Each voucher specimen must be labelled with precise geographical coordinates and date.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000136', 'c8040000-0000-0000-0000-000000000080', 36, 'Point-mounting on triangular card stock is reserved solely for large worker castes.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000137', 'c8040000-0000-0000-0000-000000000090', 37, 'Litter sifting with a coarse mesh sieve removes bulky [37] before funnel extraction.', NULL, 'debris')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000138', 'c8040000-0000-0000-0000-000000000090', 38, 'Arboreal species can be knocked onto a beating [38] placed beneath low foliage.', NULL, 'sheet')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000139', 'c8040000-0000-0000-0000-000000000090', 39, 'Liquid nitrogen or dry ice is necessary if preserving specimens for molecular [39].', NULL, 'sequencing')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c8040000-0000-0000-0000-000000000140', 'c8040000-0000-0000-0000-000000000090', 40, 'Standardized collecting protocols allow direct ecological comparison across global [40].', NULL, 'biomes')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

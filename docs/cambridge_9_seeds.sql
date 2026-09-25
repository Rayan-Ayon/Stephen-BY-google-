-- ============================================================
-- Cambridge 9 Reading Tests 1-4 Database Seed Script
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
-- Cambridge 9 - Academic Test 1
-- Exam ID: c9000000-0000-0000-0000-000000000001
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'c9000000-0000-0000-0000-000000000001';
BEGIN
    -- 1. Ensure Parent Exam & Test Records Exist
    INSERT INTO exams (id, title, test_number, difficulty)
    VALUES ('c9000000-0000-0000-0000-000000000001', 'Cambridge 9 Academic', 1, 'Medium')
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

    -- If your schema uses a separate 'tests' table referenced by sections.test_id:
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number) 
            VALUES ('c9000000-0000-0000-0000-000000000001', 'Cambridge 9 Academic Test 1', 1)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, 
                test_number = EXCLUDED.test_number;
        EXCEPTION WHEN OTHERS THEN
            -- Fallback if secondary constraint is present
            BEGIN
                INSERT INTO tests (id, title, test_number)
                VALUES ('c9000000-0000-0000-0000-000000000001', 'Cambridge 9 Academic Test 1', (SELECT COALESCE(MAX(test_number), 0) + 1 FROM tests))
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
VALUES ('c9010000-0000-0000-0000-000000000001', 'c9000000-0000-0000-0000-000000000001', 'c9000000-0000-0000-0000-000000000001', 1, 'William Henry Perkin', 'Easy', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c9010000-0000-0000-0000-000000000002', 'c9000000-0000-0000-0000-000000000001', 'c9000000-0000-0000-0000-000000000001', 2, 'Is There Anybody Out There?', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c9010000-0000-0000-0000-000000000003', 'c9000000-0000-0000-0000-000000000001', 'c9000000-0000-0000-0000-000000000001', 3, 'The History of the Tortoise', 'Hard', 14)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- 2. Insert Question Groups
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9010000-0000-0000-0000-000000000010', 'c9010000-0000-0000-0000-000000000001', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE, or NOT GIVEN.', 1, 7, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9010000-0000-0000-0000-000000000020', 'c9010000-0000-0000-0000-000000000001', 'TABLE_COMPLETION', 'Complete the table below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 8, 13, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9010000-0000-0000-0000-000000000030', 'c9010000-0000-0000-0000-000000000002', 'MATCHING_INFO', 'Reading Passage 2 has seven sections, A-G. Which section contains the following information? Choose the correct letter, A-G.', 14, 17, '["A", "B", "C", "D", "E", "F", "G"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9010000-0000-0000-0000-000000000040', 'c9010000-0000-0000-0000-000000000002', 'YES_NO_NOT_GIVEN', 'Do the following statements agree with the views of the writer? Write YES, NO, or NOT GIVEN.', 18, 20, '["YES", "NO", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9010000-0000-0000-0000-000000000050', 'c9010000-0000-0000-0000-000000000002', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 21, 26, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9010000-0000-0000-0000-000000000060', 'c9010000-0000-0000-0000-000000000003', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 27, 30, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9010000-0000-0000-0000-000000000070', 'c9010000-0000-0000-0000-000000000003', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information in Reading Passage 3? Write TRUE, FALSE, or NOT GIVEN.', 31, 33, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9010000-0000-0000-0000-000000000080', 'c9010000-0000-0000-0000-000000000003', 'FLOW_CHART_COMPLETION', 'Complete the flow-chart below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 34, 39, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9010000-0000-0000-0000-000000000090', 'c9010000-0000-0000-0000-000000000003', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 40, 40, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- 3. Insert Questions
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000101', 'c9010000-0000-0000-0000-000000000010', 1, 'Michael Faraday was the first person to recognise Perkin''s potential as a researcher.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000102', 'c9010000-0000-0000-0000-000000000010', 2, 'Perkin was attempting to manufacture quinine when he synthesized mauveine.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000103', 'c9010000-0000-0000-0000-000000000010', 3, 'Quinine was the only viable drug available for treating malaria in the 19th century.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000104', 'c9010000-0000-0000-0000-000000000010', 4, 'Perkin was encouraged by his chemistry professor to patent his synthetic dye discovery.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000105', 'c9010000-0000-0000-0000-000000000010', 5, 'Perkin''s father and brother provided financial backing for his factory in Greenford Green.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000106', 'c9010000-0000-0000-0000-000000000010', 6, 'Mauve dye was quickly embraced by French fashion houses and royalty.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000107', 'c9010000-0000-0000-0000-000000000010', 7, 'Perkin retired from industrial chemistry to focus exclusively on public politics.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000108', 'c9010000-0000-0000-0000-000000000020', 8, 'Natural dyes derived from plants and snails were both costly and lacked [8].', NULL, 'fastness')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000109', 'c9010000-0000-0000-0000-000000000020', 9, 'Raw coal tar was regarded primarily as a polluting [9] product.', NULL, 'waste')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000110', 'c9010000-0000-0000-0000-000000000020', 10, 'Robert Pullar affirmed that mauve dye had outstanding [10] when applied to silk.', NULL, 'colour')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000111', 'c9010000-0000-0000-0000-000000000020', 11, 'Medical researchers utilized Perkin''s dyes to stain [11] under microscopes.', NULL, 'bacteria')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000112', 'c9010000-0000-0000-0000-000000000020', 12, 'Robert Koch successfully identified the bacillus responsible for [12].', NULL, 'tuberculosis')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000113', 'c9010000-0000-0000-0000-000000000020', 13, 'Paul Ehrlich formulated targeting compounds that laid the foundation for [13].', NULL, 'chemotherapy')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000114', 'c9010000-0000-0000-0000-000000000030', 14, 'assumptions underlying the search for extraterrestrial intelligence', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000115', 'c9010000-0000-0000-0000-000000000030', 15, 'reasons why interstellar radio waves are the preferred medium of transmission', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000116', 'c9010000-0000-0000-0000-000000000030', 16, 'the vast distances causing two-way communication to span human generations', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000117', 'c9010000-0000-0000-0000-000000000030', 17, 'the philosophical impact on humanity of discovering alien life', NULL, 'G')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000118', 'c9010000-0000-0000-0000-000000000040', 18, 'SETI researchers concentrate solely on carbon-based lifeforms requiring liquid water.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000119', 'c9010000-0000-0000-0000-000000000040', 19, 'Space agencies have intercepted verified artificial signals from beyond our galaxy.', NULL, 'NO')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000120', 'c9010000-0000-0000-0000-000000000040', 20, 'Governments have already formulated international treaties on how to respond to an alien greeting.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000121', 'c9010000-0000-0000-0000-000000000050', 21, 'Astronomers scan the quiet frequency window known as the [21] hole.', NULL, 'water')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000122', 'c9010000-0000-0000-0000-000000000050', 22, 'This spectrum lies between emissions of hydrogen and hydroxyl [22].', NULL, 'radicals')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000123', 'c9010000-0000-0000-0000-000000000050', 23, 'Massive radio telescopes, such as the former instrument at [23], analyze millions of channels.', NULL, 'Arecibo')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000124', 'c9010000-0000-0000-0000-000000000050', 24, 'The Drake Equation estimates the number of communicative [24] in the Milky Way.', NULL, 'civilizations')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000125', 'c9010000-0000-0000-0000-000000000050', 25, 'The critical unknown variable is the average [25] of a technological society.', NULL, 'lifetime')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000126', 'c9010000-0000-0000-0000-000000000050', 26, 'Even a simple beacon would confirm that intelligence is not an evolutionary [27].', NULL, 'fluke')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000127', 'c9010000-0000-0000-0000-000000000060', 27, 'What evolutionary paradox does the land tortoise present to biologists?', '["A. It has reverted from water to land twice in separate lineages.", "B. Its terrestrial ancestors originally emerged from water, then returned to the sea, and finally re-colonized land.", "C. Its shell prevents normal respiration on land.", "D. It is more closely related to birds than to aquatic turtles."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000128', 'c9010000-0000-0000-0000-000000000060', 28, 'Paleontological analysis of the fossil reptile Proganochelys suggests it was', '["A. an agile marine swimmer with flippers.", "B. a fully terrestrial creature living on dry land.", "C. a flying arboreal lizard.", "D. a deep-sea benthic scavenger."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000129', 'c9010000-0000-0000-0000-000000000060', 29, 'How do researchers use triangular coordinate graphs in anatomical studies?', '["A. To calculate bone mineral density.", "B. To distinguish marine flippers from terrestrial walking limbs based on forelimb bone ratios.", "C. To estimate the age of fossilized carapaces.", "D. To track migration routes across continental drift."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000130', 'c9010000-0000-0000-0000-000000000060', 30, 'The modern leatherback turtle (Dermochelys) shows that', '["A. hard shells are essential for survival in cold oceans.", "B. secondary marine reptiles can adapt to extreme oceanic depths without heavy skeletal armor.", "C. reptiles are incapable of thermoregulation.", "D. turtles will soon become extinct in tropical waters."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000131', 'c9010000-0000-0000-0000-000000000070', 31, 'Ichthyosaurs and plesiosaurs were contemporary marine reptiles that never re-emerged onto land.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000132', 'c9010000-0000-0000-0000-000000000070', 32, 'Amphibious turtles lay their eggs on ocean currents rather than sandy beaches.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000133', 'c9010000-0000-0000-0000-000000000070', 33, 'DNA sequencing has fully resolved all disputes regarding the turtle phylogenetic tree.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000134', 'c9010000-0000-0000-0000-000000000080', 34, 'Early lobe-finned fish crawled onto dry land during the [34] period.', NULL, 'Devonian')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000135', 'c9010000-0000-0000-0000-000000000080', 35, 'Ancestral stem-reptiles developed an impervious [35] shell for dry reproduction.', NULL, 'amniotic')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000136', 'c9010000-0000-0000-0000-000000000080', 36, 'Certain lineages re-entered the sea, modifying legs into swimming [36].', NULL, 'paddles')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000137', 'c9010000-0000-0000-0000-000000000080', 37, 'The branch leading to modern tortoises returned again to a [37] mode of life.', NULL, 'terrestrial')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000138', 'c9010000-0000-0000-0000-000000000080', 38, 'Their heavy domed shell acts as defense against predators and prevents [38].', NULL, 'desiccation')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000139', 'c9010000-0000-0000-0000-000000000080', 39, 'Tortoises thus resemble mammals like whales that completed evolutionary [39].', NULL, 'U-turns')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9010000-0000-0000-0000-000000000140', 'c9010000-0000-0000-0000-000000000090', 40, 'What is the primary message of the article?', '["A. Evolution is a simple, irreversible ladder of progress.", "B. Species can repeatedly migrate between contrasting ecological niches over geological time.", "C. Modern tortoises are degenerated sea creatures unable to survive climate change.", "D. Fossil bones are too fragmentary to reveal true evolutionary history."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;


-- ============================================================
-- Cambridge 9 - Academic Test 2
-- Exam ID: c9000000-0000-0000-0000-000000000002
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'c9000000-0000-0000-0000-000000000002';
BEGIN
    -- 1. Ensure Parent Exam & Test Records Exist
    INSERT INTO exams (id, title, test_number, difficulty)
    VALUES ('c9000000-0000-0000-0000-000000000002', 'Cambridge 9 Academic', 2, 'Medium')
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

    -- If your schema uses a separate 'tests' table referenced by sections.test_id:
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number) 
            VALUES ('c9000000-0000-0000-0000-000000000002', 'Cambridge 9 Academic Test 2', 2)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, 
                test_number = EXCLUDED.test_number;
        EXCEPTION WHEN OTHERS THEN
            -- Fallback if secondary constraint is present
            BEGIN
                INSERT INTO tests (id, title, test_number)
                VALUES ('c9000000-0000-0000-0000-000000000002', 'Cambridge 9 Academic Test 2', (SELECT COALESCE(MAX(test_number), 0) + 1 FROM tests))
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
VALUES ('c9020000-0000-0000-0000-000000000001', 'c9000000-0000-0000-0000-000000000002', 'c9000000-0000-0000-0000-000000000002', 1, 'Hearing Impairment in Children', 'Easy', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c9020000-0000-0000-0000-000000000002', 'c9000000-0000-0000-0000-000000000002', 'c9000000-0000-0000-0000-000000000002', 2, 'Venus in Transit', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c9020000-0000-0000-0000-000000000003', 'c9000000-0000-0000-0000-000000000002', 'c9000000-0000-0000-0000-000000000002', 3, 'A Neuroscientist Reveals How To Think Differently', 'Hard', 14)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- 2. Insert Question Groups
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000010', 'c9020000-0000-0000-0000-000000000001', 'MATCHING_INFO', 'Reading Passage 1 has seven sections, A-G. Which section contains the following information? Choose the correct letter, A-G.', 1, 6, '["A", "B", "C", "D", "E", "F", "G"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000020', 'c9020000-0000-0000-0000-000000000001', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information given in Reading Passage 1? Write TRUE, FALSE, or NOT GIVEN.', 7, 10, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000030', 'c9020000-0000-0000-0000-000000000001', 'SENTENCE_COMPLETION', 'Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 11, 12, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000040', 'c9020000-0000-0000-0000-000000000001', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 13, 13, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000050', 'c9020000-0000-0000-0000-000000000002', 'MATCHING_HEADINGS', 'Choose the correct heading for sections A-D from the list of headings below.', 14, 17, '["i. A rare celestial alignment", "ii. Halley''s parallax calculation method", "iii. Hardships and failures of early expeditions", "iv. Technological advances in digital imaging", "v. Determining the exact scale of the solar system"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000060', 'c9020000-0000-0000-0000-000000000002', 'MATCHING_INFO', 'Which astronomer is associated with each discovery or misfortune? Match each statement with the correct astronomer, A-E.', 18, 21, '["A. Johannes Kepler", "B. Jeremiah Horrocks", "C. Edmond Halley", "D. Guillaume Le Gentil", "E. Captain James Cook"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000070', 'c9020000-0000-0000-0000-000000000002', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information given in Reading Passage 2? Write TRUE, FALSE, or NOT GIVEN.', 22, 26, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000080', 'c9020000-0000-0000-0000-000000000003', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 27, 31, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000090', 'c9020000-0000-0000-0000-000000000003', 'YES_NO_NOT_GIVEN', 'Do the following statements agree with the views of the author? Write YES, NO, or NOT GIVEN.', 32, 37, '["YES", "NO", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9020000-0000-0000-0000-000000000100', 'c9020000-0000-0000-0000-000000000003', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 38, 40, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- 3. Insert Questions
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000101', 'c9020000-0000-0000-0000-000000000010', 1, 'statistical prevalence of temporary hearing loss caused by otitis media in young children', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000102', 'c9020000-0000-0000-0000-000000000010', 2, 'the detrimental impact of high reverberation times on speech intelligibility', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000103', 'c9020000-0000-0000-0000-000000000010', 3, 'educational disadvantages suffered by children with autistic spectrum disorder in noisy classrooms', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000104', 'c9020000-0000-0000-0000-000000000010', 4, 'recommendations for acoustic ceiling tiles and soundproofing building standards', NULL, 'F')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000105', 'c9020000-0000-0000-0000-000000000010', 5, 'an international call to national governments to regulate classroom noise limits', NULL, 'G')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000106', 'c9020000-0000-0000-0000-000000000010', 6, 'mechanical sources of ambient noise such as ventilation fans and traffic', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000107', 'c9020000-0000-0000-0000-000000000020', 7, 'Children learn foreign languages more easily in reverberant sports halls.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000108', 'c9020000-0000-0000-0000-000000000020', 8, 'Teachers often experience vocal strain and chronic fatigue from speaking over classroom noise.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000109', 'c9020000-0000-0000-0000-000000000020', 9, 'Modern open-plan classrooms have superior acoustic profiles to traditional closed rooms.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000110', 'c9020000-0000-0000-0000-000000000020', 10, 'Carpets are banned in schools due to allergen hygiene regulations.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000111', 'c9020000-0000-0000-0000-000000000030', 11, 'Otitis media, commonly termed [11], produces a conductive hearing deficit.', NULL, 'glue ear')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000112', 'c9020000-0000-0000-0000-000000000030', 12, 'Acoustic reverberation time measures how long sound energy takes to decay by [12] decibels.', NULL, '60')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000113', 'c9020000-0000-0000-0000-000000000040', 13, 'The World Health Organization recommends that background noise in teaching areas should not exceed', '["A. 25 dB.", "B. 35 dB.", "C. 50 dB.", "D. 65 dB."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000114', 'c9020000-0000-0000-0000-000000000050', 14, 'Section A', NULL, 'i')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000115', 'c9020000-0000-0000-0000-000000000050', 15, 'Section B', NULL, 'ii')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000116', 'c9020000-0000-0000-0000-000000000050', 16, 'Section C', NULL, 'iii')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000117', 'c9020000-0000-0000-0000-000000000050', 17, 'Section D', NULL, 'v')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000118', 'c9020000-0000-0000-0000-000000000060', 18, 'first to observe a transit of Venus through a telescope in 1639', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000119', 'c9020000-0000-0000-0000-000000000060', 19, 'predicted planetary orbits mathematically using elliptical laws', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000120', 'c9020000-0000-0000-0000-000000000060', 20, 'travelled to Tahiti to observe the 1769 transit under clear skies', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000121', 'c9020000-0000-0000-0000-000000000060', 21, 'spent eleven years overseas only to miss both transits due to war and cloud cover', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000122', 'c9020000-0000-0000-0000-000000000070', 22, 'Transits of Venus occur in pairs separated by eight years, followed by over a century of absence.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000123', 'c9020000-0000-0000-0000-000000000070', 23, 'The ''black drop effect'' prevented observers from timing the exact moment of second contact.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000124', 'c9020000-0000-0000-0000-000000000070', 24, 'Halley lived long enough to witness his parallax method validated in 1761.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000125', 'c9020000-0000-0000-0000-000000000070', 25, 'Venus has a dense atmosphere containing droplets of sulphuric acid.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000126', 'c9020000-0000-0000-0000-000000000070', 26, 'Modern radar telemetry confirmed the Astronomical Unit to within a few metres.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000127', 'c9020000-0000-0000-0000-000000000080', 27, 'According to Gregory Berns, true iconoclasts are individuals who', '["A. possess supernatural psychic foresight.", "B. perceive reality freshly, overcome fear of failure, and master social intelligence.", "C. systematically disobey all criminal and civil laws.", "D. work in total isolation without financial remuneration."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000128', 'c9020000-0000-0000-0000-000000000080', 28, 'The human brain is fundamentally configured to be', '["A. an efficiency engine that categorizes visual input using past shortcuts.", "B. a random generator of surreal visions.", "C. insensitive to social ostracism.", "D. incapable of processing novelty."]'::jsonb, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000129', 'c9020000-0000-0000-0000-000000000080', 29, 'The amygdala responds to non-conformity and unfamiliar options by generating', '["A. profound euphoric serenity.", "B. fear, physical anxiety, and the dread of uncertainty.", "C. temporary amnesia.", "D. acute auditory hallucinations."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000130', 'c9020000-0000-0000-0000-000000000080', 30, 'Solomon Asch''s classic conformity experiments showed that subjects would', '["A. assault the test examiner when challenged.", "B. publicly agree with an obviously wrong answer to match the unanimous majority.", "C. always calculate geometric lengths with millimeter precision.", "D. refuse to participate without financial compensation."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000131', 'c9020000-0000-0000-0000-000000000080', 31, 'Even the most brilliant visionary ideas will fail commercially unless the creator possesses', '["A. political clout and military rank.", "B. social intelligence to persuade and sell to others.", "C. a degree in mechanical engineering.", "D. copyright protection in every country."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000132', 'c9020000-0000-0000-0000-000000000090', 32, 'Iconoclastic thinking requires intentional disruption of the brain''s automatic perceptual routines.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000133', 'c9020000-0000-0000-0000-000000000090', 33, 'Successful entrepreneurs experience zero physiological fear in high-risk moments.', NULL, 'NO')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000134', 'c9020000-0000-0000-0000-000000000090', 34, 'fMRI scans reveal that social conformity alters actual visual perception in the cortex.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000135', 'c9020000-0000-0000-0000-000000000090', 35, 'Iconoclasts are uniformly popular among their corporate colleagues.', NULL, 'NO')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000136', 'c9020000-0000-0000-0000-000000000090', 36, 'Meditation can permanently rewire the amygdala within twenty-four hours.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000137', 'c9020000-0000-0000-0000-000000000090', 37, 'Understanding neural mechanisms empowers individuals to overcome cognitive limitations.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000138', 'c9020000-0000-0000-0000-000000000100', 38, 'Novel sensory experiences force the visual cortex to construct new [38].', NULL, 'categories')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000139', 'c9020000-0000-0000-0000-000000000100', 39, 'The fear of social ridicule activates the [39] cortex in identical ways to physical pain.', NULL, 'anterior cingulate')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9020000-0000-0000-0000-000000000140', 'c9020000-0000-0000-0000-000000000100', 40, 'Iconoclasts excel at leveraging emotional empathy and [40] to lead change.', NULL, 'reputation')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;


-- ============================================================
-- Cambridge 9 - Academic Test 3
-- Exam ID: c9000000-0000-0000-0000-000000000003
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'c9000000-0000-0000-0000-000000000003';
BEGIN
    -- 1. Ensure Parent Exam & Test Records Exist
    INSERT INTO exams (id, title, test_number, difficulty)
    VALUES ('c9000000-0000-0000-0000-000000000003', 'Cambridge 9 Academic', 3, 'Medium')
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

    -- If your schema uses a separate 'tests' table referenced by sections.test_id:
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number) 
            VALUES ('c9000000-0000-0000-0000-000000000003', 'Cambridge 9 Academic Test 3', 3)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, 
                test_number = EXCLUDED.test_number;
        EXCEPTION WHEN OTHERS THEN
            -- Fallback if secondary constraint is present
            BEGIN
                INSERT INTO tests (id, title, test_number)
                VALUES ('c9000000-0000-0000-0000-000000000003', 'Cambridge 9 Academic Test 3', (SELECT COALESCE(MAX(test_number), 0) + 1 FROM tests))
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
VALUES ('c9030000-0000-0000-0000-000000000001', 'c9000000-0000-0000-0000-000000000003', 'c9000000-0000-0000-0000-000000000003', 1, 'Attitudes to Language', 'Easy', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c9030000-0000-0000-0000-000000000002', 'c9000000-0000-0000-0000-000000000003', 'c9000000-0000-0000-0000-000000000003', 2, 'Tidal Power', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c9030000-0000-0000-0000-000000000003', 'c9000000-0000-0000-0000-000000000003', 'c9000000-0000-0000-0000-000000000003', 3, 'Information Theory – The Big Idea', 'Hard', 14)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- 2. Insert Question Groups
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9030000-0000-0000-0000-000000000010', 'c9030000-0000-0000-0000-000000000001', 'YES_NO_NOT_GIVEN', 'Do the following statements agree with the views of the author in Reading Passage 1? Write YES, NO, or NOT GIVEN.', 1, 8, '["YES", "NO", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9030000-0000-0000-0000-000000000020', 'c9030000-0000-0000-0000-000000000001', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 9, 12, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9030000-0000-0000-0000-000000000030', 'c9030000-0000-0000-0000-000000000001', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 13, 13, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9030000-0000-0000-0000-000000000040', 'c9030000-0000-0000-0000-000000000002', 'MATCHING_INFO', 'Reading Passage 2 has six sections, A-F. Which section contains the following information? Choose the correct letter, A-F.', 14, 17, '["A", "B", "C", "D", "E", "F"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9030000-0000-0000-0000-000000000050', 'c9030000-0000-0000-0000-000000000002', 'DIAGRAM_COMPLETION', 'Label the diagram below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 18, 22, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9030000-0000-0000-0000-000000000060', 'c9030000-0000-0000-0000-000000000002', 'MATCHING_FEATURES', 'Match each location with its corresponding tidal project characteristic, A-E.', 23, 26, '["A. La Rance (France)", "B. Strangford Lough (Northern Ireland)", "C. Severn Estuary (UK)", "D. Sihwa Lake (South Korea)"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9030000-0000-0000-0000-000000000070', 'c9030000-0000-0000-0000-000000000003', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information in Reading Passage 3? Write TRUE, FALSE, or NOT GIVEN.', 27, 32, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9030000-0000-0000-0000-000000000080', 'c9030000-0000-0000-0000-000000000003', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 33, 37, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9030000-0000-0000-0000-000000000090', 'c9030000-0000-0000-0000-000000000003', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 38, 40, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- 3. Insert Questions
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000101', 'c9030000-0000-0000-0000-000000000010', 1, 'There is understandable public anxiety regarding changes in spoken and written grammar.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000102', 'c9030000-0000-0000-0000-000000000010', 2, 'Prescriptivism views linguistic drift as corruption rather than natural adaptation.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000103', 'c9030000-0000-0000-0000-000000000010', 3, 'Descriptive grammarians believe that all regional dialects should follow London rules.', NULL, 'NO')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000104', 'c9030000-0000-0000-0000-000000000010', 4, 'Eighteenth-century grammarians based English syntax rules on Classical Latin.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000105', 'c9030000-0000-0000-0000-000000000010', 5, 'Language academies have succeeded in halting slang in modern France.', NULL, 'NO')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000106', 'c9030000-0000-0000-0000-000000000010', 6, 'Most modern linguists reject prescriptivism in academic research.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000107', 'c9030000-0000-0000-0000-000000000010', 7, 'Children learn foreign languages faster when taught traditional parsing.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000108', 'c9030000-0000-0000-0000-000000000010', 8, 'Debates over language usage frequently conceal social and class prejudices.', NULL, 'YES')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000109', 'c9030000-0000-0000-0000-000000000020', 9, 'Prescriptive grammars emphasize strict adherence to established [9].', NULL, 'rules')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000110', 'c9030000-0000-0000-0000-000000000020', 10, 'Descriptive linguistics observes how native speakers use language in [10].', NULL, 'practice')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000111', 'c9030000-0000-0000-0000-000000000020', 11, 'Popular usage commentators equate linguistic innovation with intellectual [11].', NULL, 'decay')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000112', 'c9030000-0000-0000-0000-000000000020', 12, 'A comprehensive grammar documents linguistic variation without moral [12].', NULL, 'judgment')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000113', 'c9030000-0000-0000-0000-000000000030', 13, 'What is the primary objective of the text?', '["A. To establish which dialect of English is grammatically superior.", "B. To examine the historical conflict between prescriptive and descriptive views.", "C. To promote government censorship of informal communication.", "D. To prove that grammar rules are completely useless."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000114', 'c9030000-0000-0000-0000-000000000040', 14, 'the high energy density of moving water compared to wind currents', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000115', 'c9030000-0000-0000-0000-000000000040', 15, 'ecological disruptions caused by tidal barrages across estuarine wetlands', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000116', 'c9030000-0000-0000-0000-000000000040', 16, 'the absolute predictability of lunar tides versus weather-dependent solar power', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000117', 'c9030000-0000-0000-0000-000000000040', 17, 'underwater turbine prototypes deployed in fast-flowing coastal channels', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000118', 'c9030000-0000-0000-0000-000000000050', 18, 'Dual counter-rotating [18] blades capture tidal stream energy.', NULL, 'rotor')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000119', 'c9030000-0000-0000-0000-000000000050', 19, 'The main tower is anchored to the seabed with a steel [19].', NULL, 'pile')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000120', 'c9030000-0000-0000-0000-000000000050', 20, 'Maintenance crews raise the nacelle using a hydraulic [20].', NULL, 'jack')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000121', 'c9030000-0000-0000-0000-000000000050', 21, 'Subsea transmission cables connect power to the onshore [21].', NULL, 'grid')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000122', 'c9030000-0000-0000-0000-000000000050', 22, 'Slow rotation speeds avoid harming marine [22] species.', NULL, 'wildlife')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000123', 'c9030000-0000-0000-0000-000000000060', 23, 'the oldest operating commercial tidal barrage, producing electricity since 1966', NULL, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000124', 'c9030000-0000-0000-0000-000000000060', 24, 'a 1.2 MW experimental open-stream turbine system named SeaGen', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000125', 'c9030000-0000-0000-0000-000000000060', 25, 'the world''s largest tidal power installation, utilizing a reclaimed sea wall', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000126', 'c9030000-0000-0000-0000-000000000060', 26, 'a proposed mega-barrage canceled repeatedly due to environmental and fiscal concerns', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000127', 'c9030000-0000-0000-0000-000000000070', 27, 'Claude Shannon proved that noise in communication channels can be completely neutralized.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000128', 'c9030000-0000-0000-0000-000000000070', 28, 'Shannon''s 1948 paper was universally understood by contemporary mathematicians immediately.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000129', 'c9030000-0000-0000-0000-000000000070', 29, 'The fundamental unit of information, the binary digit, was abbreviated as ''bit'' in Shannon''s work.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000130', 'c9030000-0000-0000-0000-000000000070', 30, 'Shannon worked exclusively for Bell Laboratories throughout his entire career.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000131', 'c9030000-0000-0000-0000-000000000070', 31, 'Redundancy in natural languages allows humans to reconstruct corrupted messages.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000132', 'c9030000-0000-0000-0000-000000000070', 32, 'Transmitting above the channel capacity limit still permits error-free reception.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000133', 'c9030000-0000-0000-0000-000000000080', 33, 'Shannon defined information as the reduction of [33].', NULL, 'uncertainty')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000134', 'c9030000-0000-0000-0000-000000000080', 34, 'To protect digital data, encoders append mathematical [34] bits.', NULL, 'parity')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000135', 'c9030000-0000-0000-0000-000000000080', 35, 'Deep space probes such as Voyager rely on error-correcting [35].', NULL, 'codes')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000136', 'c9030000-0000-0000-0000-000000000080', 36, 'The theoretical maximum transmission rate across a noisy channel is the Shannon [36].', NULL, 'limit')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000137', 'c9030000-0000-0000-0000-000000000080', 37, 'Modern telecommunications achieved Shannon''s benchmark through turbo and LDPC [37].', NULL, 'algorithms')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000138', 'c9030000-0000-0000-0000-000000000090', 38, 'Why was the formulation of entropy so significant in Shannon''s theory?', '["A. It connected thermodynamic disorder with data unpredictability.", "B. It eliminated all heat from telephone switches.", "C. It proved that perpetual motion machines are possible.", "D. It enabled analog radio to broadcast in color."]'::jsonb, 'A')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000139', 'c9030000-0000-0000-0000-000000000090', 39, 'Compact discs maintain pristine audio fidelity despite scratches because of', '["A. magnetic shielding on the plastic surface.", "B. Reed-Solomon cross-interleaved error-correcting codes.", "C. high-speed diamond needles.", "D. analog vinyl grooves pressed into the center."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9030000-0000-0000-0000-000000000140', 'c9030000-0000-0000-0000-000000000090', 40, 'What is the broader intellectual legacy of Claude Shannon?', '["A. He invented the first electronic spreadsheet.", "B. He established the conceptual foundation of the digital information age.", "C. He wrote the original firmware for mainframe computers.", "D. He proved that computers will never surpass human thought."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;


-- ============================================================
-- Cambridge 9 - Academic Test 4
-- Exam ID: c9000000-0000-0000-0000-000000000004
-- ============================================================
DO $$
DECLARE
    v_exam_id UUID := 'c9000000-0000-0000-0000-000000000004';
BEGIN
    -- 1. Ensure Parent Exam & Test Records Exist
    INSERT INTO exams (id, title, test_number, difficulty)
    VALUES ('c9000000-0000-0000-0000-000000000004', 'Cambridge 9 Academic', 4, 'Medium')
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

    -- If your schema uses a separate 'tests' table referenced by sections.test_id:
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        BEGIN
            INSERT INTO tests (id, title, test_number) 
            VALUES ('c9000000-0000-0000-0000-000000000004', 'Cambridge 9 Academic Test 4', 4)
            ON CONFLICT (id) DO UPDATE 
            SET title = EXCLUDED.title, 
                test_number = EXCLUDED.test_number;
        EXCEPTION WHEN OTHERS THEN
            -- Fallback if secondary constraint is present
            BEGIN
                INSERT INTO tests (id, title, test_number)
                VALUES ('c9000000-0000-0000-0000-000000000004', 'Cambridge 9 Academic Test 4', (SELECT COALESCE(MAX(test_number), 0) + 1 FROM tests))
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
VALUES ('c9040000-0000-0000-0000-000000000001', 'c9000000-0000-0000-0000-000000000004', 'c9000000-0000-0000-0000-000000000004', 1, 'The Life and Work of Marie Curie', 'Easy', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c9040000-0000-0000-0000-000000000002', 'c9000000-0000-0000-0000-000000000004', 'c9000000-0000-0000-0000-000000000004', 2, 'Young Children’s Sense of Identity', 'Medium', 13)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

INSERT INTO sections (id, exam_id, test_id, part_number, passage_title, difficulty, total_questions)
VALUES ('c9040000-0000-0000-0000-000000000003', 'c9000000-0000-0000-0000-000000000004', 'c9000000-0000-0000-0000-000000000004', 3, 'The Development of Museums', 'Hard', 14)
ON CONFLICT (id) DO UPDATE SET 
    exam_id = EXCLUDED.exam_id,
    test_id = EXCLUDED.test_id,
    part_number = EXCLUDED.part_number,
    passage_title = EXCLUDED.passage_title,
    difficulty = EXCLUDED.difficulty,
    total_questions = EXCLUDED.total_questions;

-- 2. Insert Question Groups
INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9040000-0000-0000-0000-000000000010', 'c9040000-0000-0000-0000-000000000001', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information in Reading Passage 1? Write TRUE, FALSE, or NOT GIVEN.', 1, 6, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9040000-0000-0000-0000-000000000020', 'c9040000-0000-0000-0000-000000000001', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 7, 13, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9040000-0000-0000-0000-000000000030', 'c9040000-0000-0000-0000-000000000002', 'MATCHING_INFO', 'Reading Passage 2 has seven sections, A-G. Which section contains the following information? Choose the correct letter, A-G.', 14, 19, '["A", "B", "C", "D", "E", "F", "G"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9040000-0000-0000-0000-000000000040', 'c9040000-0000-0000-0000-000000000002', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information in Reading Passage 2? Write TRUE, FALSE, or NOT GIVEN.', 20, 25, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9040000-0000-0000-0000-000000000050', 'c9040000-0000-0000-0000-000000000002', 'MULTIPLE_CHOICE', 'Choose the correct letter, A, B, C or D.', 26, 26, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9040000-0000-0000-0000-000000000060', 'c9040000-0000-0000-0000-000000000003', 'MATCHING_HEADINGS', 'Choose the correct heading for sections A-D from the list of headings below.', 27, 30, '["i. From private cabinets of curiosity to public institutions", "ii. Tensions between research preservation and interactive entertainment", "iii. Digital archiving replacing brick-and-mortar buildings", "iv. Economic pressures and corporate sponsorship in modern galleries", "v. Repatriation controversies regarding colonial artifacts"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9040000-0000-0000-0000-000000000070', 'c9040000-0000-0000-0000-000000000003', 'TRUE_FALSE_NOT_GIVEN', 'Do the following statements agree with the information in Reading Passage 3? Write TRUE, FALSE, or NOT GIVEN.', 31, 35, '["TRUE", "FALSE", "NOT GIVEN"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

INSERT INTO question_groups (id, section_id, question_type, instructions, start_question, end_question, choices)
VALUES ('c9040000-0000-0000-0000-000000000080', 'c9040000-0000-0000-0000-000000000003', 'SUMMARY_COMPLETION', 'Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.', 36, 40, NULL)
ON CONFLICT (id) DO UPDATE SET
    section_id = EXCLUDED.section_id,
    question_type = EXCLUDED.question_type,
    instructions = EXCLUDED.instructions,
    start_question = EXCLUDED.start_question,
    end_question = EXCLUDED.end_question,
    choices = EXCLUDED.choices;

-- 3. Insert Questions
INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000101', 'c9040000-0000-0000-0000-000000000010', 1, 'Marie Curie''s sister Bronia financed Marie''s university education in Paris first.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000102', 'c9040000-0000-0000-0000-000000000010', 2, 'Pierre Curie initially declined the 1903 Nobel Prize unless Marie was included.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000103', 'c9040000-0000-0000-0000-000000000010', 3, 'The Curies patented their pitchblende refining technique to amass wealth.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000104', 'c9040000-0000-0000-0000-000000000010', 4, 'Marie Curie was appointed as the Sorbonne''s first female professor following Pierre''s death.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000105', 'c9040000-0000-0000-0000-000000000010', 5, 'She was awarded her second Nobel Prize in Physics in 1911.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000106', 'c9040000-0000-0000-0000-000000000010', 6, 'Curie suffered severe radiation sickness due to lack of radiological safety knowledge.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000107', 'c9040000-0000-0000-0000-000000000020', 7, 'Investigating uranium rays discovered by Becquerel, Marie coined the term [7].', NULL, 'radioactivity')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000108', 'c9040000-0000-0000-0000-000000000020', 8, 'Processing tons of pitchblende ore, they isolated a new element named [8] in honor of Poland.', NULL, 'polonium')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000109', 'c9040000-0000-0000-0000-000000000020', 9, 'Later that year, they confirmed the discovery of luminous [9] chloride.', NULL, 'radium')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000110', 'c9040000-0000-0000-0000-000000000020', 10, 'During World War I, Curie engineered mobile radiography units known as [10].', NULL, 'petites Curies')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000111', 'c9040000-0000-0000-0000-000000000020', 11, 'These vehicles assisted surgeons by locating bullet fragments and bone [11].', NULL, 'fractures')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000112', 'c9040000-0000-0000-0000-000000000020', 12, 'Curie founded the Radium Institute in Paris and another in her hometown of [12].', NULL, 'Warsaw')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000113', 'c9040000-0000-0000-0000-000000000020', 13, 'Her daughter Irene Joliot-Curie continued the legacy, discovering artificial [13].', NULL, 'radioactivity')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000114', 'c9040000-0000-0000-0000-000000000030', 14, 'the development of the self as an active causal agent in infancy', NULL, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000115', 'c9040000-0000-0000-0000-000000000030', 15, 'the classic mirror rouge test of visual self-recognition', NULL, 'C')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000116', 'c9040000-0000-0000-0000-000000000030', 16, 'the acquisition of personal pronouns like ''me'' and ''mine''', NULL, 'D')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000117', 'c9040000-0000-0000-0000-000000000030', 17, 'toddlers expressing proprietary ownership during toy disputes', NULL, 'E')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000118', 'c9040000-0000-0000-0000-000000000030', 18, 'cultural variations in parenting styles and individualist versus collectivist self-concepts', NULL, 'F')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000119', 'c9040000-0000-0000-0000-000000000030', 19, 'how early maternal responsiveness fosters secure attachment and confident self-esteem', NULL, 'G')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000120', 'c9040000-0000-0000-0000-000000000040', 20, 'Infants under twelve months readily recognize their own mirror reflection.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000121', 'c9040000-0000-0000-0000-000000000040', 21, 'By eighteen months, toddlers reach for their own nose when noticing red rouge in a mirror.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000122', 'c9040000-0000-0000-0000-000000000040', 22, 'Toy ownership quarrels in two-year-olds reflect cognitive self-assertion rather than genuine malice.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000123', 'c9040000-0000-0000-0000-000000000040', 23, 'Non-human primates like chimpanzees fail the mirror self-recognition task.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000124', 'c9040000-0000-0000-0000-000000000040', 24, 'Children who talk earlier develop social self-awareness faster than peers.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000125', 'c9040000-0000-0000-0000-000000000040', 25, 'Self-conscious emotions such as embarrassment and pride emerge only after visual self-awareness.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000126', 'c9040000-0000-0000-0000-000000000050', 26, 'The author concludes that developing a sense of self is', '["A. an innate reflex present at birth.", "B. a gradual social and cognitive construction achieved through interaction.", "C. purely dependent on genetic inheritance.", "D. impossible without formal classroom education."]'::jsonb, 'B')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000127', 'c9040000-0000-0000-0000-000000000060', 27, 'Section A', NULL, 'i')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000128', 'c9040000-0000-0000-0000-000000000060', 28, 'Section B', NULL, 'ii')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000129', 'c9040000-0000-0000-0000-000000000060', 29, 'Section C', NULL, 'iv')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000130', 'c9040000-0000-0000-0000-000000000060', 30, 'Section D', NULL, 'v')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000131', 'c9040000-0000-0000-0000-000000000070', 31, 'Renaissance Wunderkammern were accessible to all members of the general public.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000132', 'c9040000-0000-0000-0000-000000000070', 32, 'Nineteenth-century national museums viewed public education as a tool of moral civic elevation.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000133', 'c9040000-0000-0000-0000-000000000070', 33, 'Hands-on science centres attract fewer visitors than traditional natural history collections.', NULL, 'FALSE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000134', 'c9040000-0000-0000-0000-000000000070', 34, 'Museum gift shop revenues now frequently surpass state educational subsidies.', NULL, 'NOT GIVEN')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000135', 'c9040000-0000-0000-0000-000000000070', 35, 'International museums increasingly collaborate with indigenous communities regarding artifact repatriation.', NULL, 'TRUE')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000136', 'c9040000-0000-0000-0000-000000000080', 36, 'Early private collections known as cabinets of [36] housed eclectic curiosities.', NULL, 'curiosities')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000137', 'c9040000-0000-0000-0000-000000000080', 37, 'The opening of the British Museum in 1753 required visitors to apply in [37] for admission tickets.', NULL, 'writing')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000138', 'c9040000-0000-0000-0000-000000000080', 38, 'Modern curators must balance scholarly research with entertaining [38] displays.', NULL, 'interactive')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000139', 'c9040000-0000-0000-0000-000000000080', 39, 'Critics warn that excessive commercialization reduces museums to theme park [39].', NULL, 'attractions')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

INSERT INTO questions (id, group_id, question_number, question_text, options, correct_answer)
VALUES ('c9040000-0000-0000-0000-000000000140', 'c9040000-0000-0000-0000-000000000080', 40, 'Virtual museum galleries allow global access while safeguarding fragile physical [40].', NULL, 'specimens')
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id,
    question_number = EXCLUDED.question_number,
    question_text = EXCLUDED.question_text,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer;

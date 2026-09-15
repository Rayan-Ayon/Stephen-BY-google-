-- db_type_fixes.sql
-- Run this AFTER the existing writing_submissions migration to fix column nullability and constraints.

-- D1: Make evaluation column nullable (required for initial insert before AI eval completes)
ALTER TABLE writing_submissions ALTER COLUMN evaluation DROP NOT NULL;
ALTER TABLE writing_submissions ALTER COLUMN evaluation SET DEFAULT '{}'::jsonb;

-- D3: Add CHECK constraint on writing_questions.module_type to match TypeScript union type
-- NOTE: Only run if the constraint doesn't already exist from your original table DDL.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'writing_questions_module_type_check'
          AND conrelid = 'writing_questions'::regclass
    ) THEN
        ALTER TABLE writing_questions
            ADD CONSTRAINT writing_questions_module_type_check
            CHECK (module_type IN ('academic', 'general'));
    END IF;
END $$;

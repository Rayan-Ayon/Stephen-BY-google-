-- ============================================================================
-- 20261014_backfill_and_isolate_user_data.sql
-- Backfill historical attempts to ayonburg@gmail.com & enforce RLS on part_practice_attempts
-- ============================================================================

-- 1. Target User UUID for ayonburg@gmail.com
DO $$
DECLARE
    target_user_id UUID := 'bd6a77be-a777-429a-b76d-322cce1ed267';
    target_email TEXT := 'ayonburg@gmail.com';
BEGIN
    -- Backfill exam_attempts
    UPDATE public.exam_attempts
    SET user_id = target_user_id
    WHERE user_id IS NULL OR user_id = '00000000-0000-0000-0000-000000000000';

    -- Backfill part_practice_attempts
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'part_practice_attempts') THEN
        UPDATE public.part_practice_attempts
        SET user_id = target_user_id
        WHERE user_id IS NULL OR user_id = '00000000-0000-0000-0000-000000000000';
    END IF;

    -- Backfill writing_submissions
    UPDATE public.writing_submissions
    SET user_id = target_user_id, user_email = target_email
    WHERE user_id IS NULL;

    -- Backfill speaking_submissions
    UPDATE public.speaking_submissions
    SET user_id = target_user_id, user_email = target_email
    WHERE user_id IS NULL;

    -- Backfill speaking_sessions
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'speaking_sessions') THEN
        UPDATE public.speaking_sessions
        SET user_id = target_user_id
        WHERE user_id IS NULL;
    END IF;
END $$;

-- 2. Enforce Strict RLS on part_practice_attempts
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'part_practice_attempts') THEN
        ALTER TABLE public.part_practice_attempts ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can only select their own part practice attempts" ON public.part_practice_attempts;
        CREATE POLICY "Users can only select their own part practice attempts"
            ON public.part_practice_attempts FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can only insert their own part practice attempts" ON public.part_practice_attempts;
        CREATE POLICY "Users can only insert their own part practice attempts"
            ON public.part_practice_attempts FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can only update their own part practice attempts" ON public.part_practice_attempts;
        CREATE POLICY "Users can only update their own part practice attempts"
            ON public.part_practice_attempts FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can only delete their own part practice attempts" ON public.part_practice_attempts;
        CREATE POLICY "Users can only delete their own part practice attempts"
            ON public.part_practice_attempts FOR DELETE
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;
END $$;

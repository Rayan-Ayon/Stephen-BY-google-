-- ============================================================================
-- 20261014_enforce_strict_multi_tenant_rls.sql
-- Enforce Strict Per-User Multi-Tenant Row Level Security & Foreign Key Constraints
-- ============================================================================

-- 1. Ensure foreign key constraints & compound indexes on exam_attempts
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_exam_attempts_user'
    ) THEN
        ALTER TABLE public.exam_attempts 
            ADD CONSTRAINT fk_exam_attempts_user 
            FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_created 
    ON public.exam_attempts(user_id, created_at DESC);

-- 2. Drop all insecure open public policies
DROP POLICY IF EXISTS "Public and users can insert exam attempts" ON public.exam_attempts;
DROP POLICY IF EXISTS "Public and users can view exam attempts" ON public.exam_attempts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.exam_attempts;
DROP POLICY IF EXISTS "Users and teachers can view speaking sessions" ON public.speaking_sessions;
DROP POLICY IF EXISTS "Users and guests can insert speaking sessions" ON public.speaking_sessions;
DROP POLICY IF EXISTS "Teachers can update speaking sessions" ON public.speaking_sessions;

-- 3. Enforce strict per-user RLS on exam_attempts
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only select their own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can only select their own exam attempts"
    ON public.exam_attempts FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only insert their own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can only insert their own exam attempts"
    ON public.exam_attempts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only update their own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can only update their own exam attempts"
    ON public.exam_attempts FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only delete their own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can only delete their own exam attempts"
    ON public.exam_attempts FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 4. Enforce strict per-user RLS on writing_submissions & speaking_submissions
ALTER TABLE public.writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own writing submissions" ON public.writing_submissions;
DROP POLICY IF EXISTS "Users can insert own writing submissions" ON public.writing_submissions;
DROP POLICY IF EXISTS "Users can only access own writing submissions" ON public.writing_submissions;
CREATE POLICY "Users can only access own writing submissions"
    ON public.writing_submissions FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own speaking submissions" ON public.speaking_submissions;
DROP POLICY IF EXISTS "Users can insert own speaking submissions" ON public.speaking_submissions;
DROP POLICY IF EXISTS "Users can only access own speaking submissions" ON public.speaking_submissions;
CREATE POLICY "Users can only access own speaking submissions"
    ON public.speaking_submissions FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Speaking sessions fallback isolation
ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access own speaking sessions" ON public.speaking_sessions;
CREATE POLICY "Users can only access own speaking sessions"
    ON public.speaking_sessions FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

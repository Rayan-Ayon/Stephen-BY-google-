-- ============================================================================
-- 20261015_rewriter_history.sql
-- Dedicated AI Rewriter History Persistence with Row-Level Security
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.rewriter_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task_type TEXT NOT NULL,                     -- 'academic_task1' | 'gt_task1' | 'task2'
    target_band NUMERIC(2, 1) NOT NULL,          -- 7.0, 8.0, 9.0
    prompt_text TEXT,
    original_text TEXT NOT NULL,
    rewritten_text TEXT NOT NULL,
    overall_band NUMERIC(2, 1),
    criteria_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    diff_chunks JSONB NOT NULL DEFAULT '[]'::jsonb,
    high_yield_collocations JSONB DEFAULT '[]'::jsonb,
    lexical_index NUMERIC(4, 1),
    complexity_ratio NUMERIC(4, 1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant retrieval ordered by timestamp
CREATE INDEX IF NOT EXISTS idx_rewriter_history_user ON public.rewriter_history(user_id, created_at DESC);

-- Enable strict Row-Level Security
ALTER TABLE public.rewriter_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own rewrites" ON public.rewriter_history;
CREATE POLICY "Users view own rewrites" ON public.rewriter_history
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own rewrites" ON public.rewriter_history;
CREATE POLICY "Users insert own rewrites" ON public.rewriter_history
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own rewrites" ON public.rewriter_history;
CREATE POLICY "Users delete own rewrites" ON public.rewriter_history
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';

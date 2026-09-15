-- ============================================================
-- ai_evaluations table
-- Stores AI evaluation results linked to a writing_submissions row
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_evaluations (
    id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id             UUID UNIQUE REFERENCES public.writing_submissions(id) ON DELETE CASCADE,
    overall_band              NUMERIC(2, 1) NOT NULL,
    task_achievement_score    NUMERIC(2, 1) NOT NULL,
    coherence_cohesion_score  NUMERIC(2, 1) NOT NULL,
    lexical_resource_score    NUMERIC(2, 1) NOT NULL,
    grammatical_accuracy_score NUMERIC(2, 1) NOT NULL,
    raw_json_feedback         JSONB NOT NULL,
    created_at                TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fast lookup by submission
CREATE INDEX IF NOT EXISTS idx_ai_evaluations_submission
    ON public.ai_evaluations (submission_id);

-- ============================================================
-- RLS: authenticated users can read/insert their own rows
-- ============================================================
ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own ai evaluations"
    ON public.ai_evaluations
    FOR SELECT
    USING (auth.uid() = (
        SELECT user_id FROM public.writing_submissions
        WHERE id = submission_id
    ));

CREATE POLICY "Users can insert own ai evaluations"
    ON public.ai_evaluations
    FOR INSERT
    WITH CHECK (auth.uid() = (
        SELECT user_id FROM public.writing_submissions
        WHERE id = submission_id
    ));

-- ============================================================================
-- 20261015_study_plans.sql
-- Enterprise AI Personalized Study Plan System & Interactive Calendar Telemetry
-- ============================================================================

-- 1. Main Study Plan Table
CREATE TABLE IF NOT EXISTS public.study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_band NUMERIC(2, 1) NOT NULL,
    target_band NUMERIC(2, 1) NOT NULL,
    exam_type TEXT NOT NULL DEFAULT 'academic', -- 'academic' | 'general'
    duration_weeks INT NOT NULL DEFAULT 4,
    daily_minutes INT NOT NULL DEFAULT 45,
    exam_date DATE,
    weak_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
    phase_name TEXT NOT NULL DEFAULT 'Phase 1: Foundation',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_plans_user ON public.study_plans(user_id, is_active);

-- 2. Granular Daily Tasks Table
CREATE TABLE IF NOT EXISTS public.study_plan_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    module TEXT NOT NULL, -- 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar' | 'mock'
    title TEXT NOT NULL,
    subtitle TEXT,
    duration_minutes INT NOT NULL DEFAULT 30,
    xp_reward INT NOT NULL DEFAULT 15,
    task_type TEXT NOT NULL DEFAULT 'lesson', -- 'lesson' | 'drill' | 'full_mock' | 'review'
    notes_bangla TEXT,
    video_url TEXT,
    video_title TEXT,
    action_route TEXT, -- e.g., '/practice', '/mock-tests/reading', '/ai-speaking-partner'
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_plan_tasks_user_date ON public.study_plan_tasks(user_id, scheduled_date);

-- 3. Row-Level Security
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plan_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access own study plans" ON public.study_plans;
CREATE POLICY "Users can only access own study plans"
    ON public.study_plans FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only access own study plan tasks" ON public.study_plan_tasks;
CREATE POLICY "Users can only access own study plan tasks"
    ON public.study_plan_tasks FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

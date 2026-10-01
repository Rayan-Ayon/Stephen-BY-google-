-- ============================================================================
-- COHORT COMMUNITY MODULE MIGRATION
-- ============================================================================

-- 1. COHORTS / BATCHES
CREATE TABLE IF NOT EXISTS public.cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                         -- e.g. "Batch #08 - Target 7.5+ Alpha"
    description TEXT,
    mentor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_band NUMERIC(2,1) DEFAULT 7.5,
    current_avg_band NUMERIC(2,1) DEFAULT 6.5,
    live_meeting_url TEXT,                     -- Zoom / Google Meet link
    next_live_session TIMESTAMPTZ,
    daily_mission_title TEXT,
    daily_mission_description TEXT,
    daily_mission_total_assigned INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COHORT MEMBERS (ROSTER & TRANSPARENCY MATRIX)
CREATE TABLE IF NOT EXISTS public.cohort_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('student', 'mentor', 'assistant')) DEFAULT 'student',
    streak_count INT DEFAULT 0,
    target_score NUMERIC(2,1) DEFAULT 7.5,
    latest_mock_band NUMERIC(2,1) DEFAULT 0.0,
    daily_status TEXT CHECK (daily_status IN ('completed', 'pending', 'at_risk')) DEFAULT 'pending',
    daily_submission_text TEXT,                -- e.g. "Completed C18 T2"
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cohort_id, user_id)
);

-- 3. COHORT RECORDINGS VAULT
CREATE TABLE IF NOT EXISTS public.cohort_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,                        -- e.g. "Task 1 Process Diagram Breakdown"
    recording_url TEXT NOT NULL,
    duration_minutes INT,
    conducted_at TIMESTAMPTZ NOT NULL,
    timestamps JSONB DEFAULT '[]'::jsonb,       -- [{"time": "04:15", "label": "Introduction"}]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COHORT BENCHMARKS (SPOTLIGHT SHOWCASE)
CREATE TABLE IF NOT EXISTS public.cohort_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module TEXT CHECK (module IN ('writing', 'speaking', 'reading', 'listening')) NOT NULL,
    title TEXT NOT NULL,                        -- e.g. "Norbiton Maps Paraphrase"
    band_score NUMERIC(2,1) NOT NULL,           -- e.g. 8.0
    submission_content TEXT NOT NULL,           -- Full essay text or audio URL
    ai_sub_scores JSONB DEFAULT '{}'::jsonb,   -- {"TR": 8, "CC": 8, "LR": 8, "GRA": 7.5}
    mentor_voice_note_url TEXT,
    highlight_reason TEXT,                      -- e.g. "Exceptional Lexical Resource"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DISCUSSION ARENA (DOUBT & DISCUSSION POSTS)
CREATE TABLE IF NOT EXISTS public.cohort_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tag TEXT CHECK (tag IN ('Writing-Task-1', 'Writing-Task-2', 'Reading-TFNG', 'Speaking-Part-3', 'Collocations', 'General')) DEFAULT 'General',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    is_mentor_pinned BOOLEAN DEFAULT FALSE,
    is_mentor_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COHORT POST REPLIES
CREATE TABLE IF NOT EXISTS public.cohort_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.cohort_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_mentor_answer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REAL-TIME ACTIVITY TICKER LOG
CREATE TABLE IF NOT EXISTS public.cohort_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    activity_type TEXT NOT NULL,               -- 'test_completed', 'speaking_started', 'xp_earned'
    description TEXT NOT NULL,                 -- e.g. "completed Cambridge 17 Reading (Band 7.5)"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES & SECURITY
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_activities ENABLE ROW LEVEL SECURITY;

-- Read policies: Users can read data belonging to their cohort
DROP POLICY IF EXISTS "Allow members to view cohort" ON public.cohorts;
CREATE POLICY "Allow members to view cohort" ON public.cohorts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow members to view roster" ON public.cohort_members;
CREATE POLICY "Allow members to view roster" ON public.cohort_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow members to view recordings" ON public.cohort_recordings;
CREATE POLICY "Allow members to view recordings" ON public.cohort_recordings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow members to view benchmarks" ON public.cohort_benchmarks;
CREATE POLICY "Allow members to view benchmarks" ON public.cohort_benchmarks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow members to view posts" ON public.cohort_posts;
CREATE POLICY "Allow members to view posts" ON public.cohort_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow members to view replies" ON public.cohort_replies;
CREATE POLICY "Allow members to view replies" ON public.cohort_replies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow members to view activities" ON public.cohort_activities;
CREATE POLICY "Allow members to view activities" ON public.cohort_activities FOR SELECT USING (true);

-- Insert policies for user posts, replies, and activities
DROP POLICY IF EXISTS "Allow users to create posts" ON public.cohort_posts;
CREATE POLICY "Allow users to create posts" ON public.cohort_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Allow users to create replies" ON public.cohort_replies;
CREATE POLICY "Allow users to create replies" ON public.cohort_replies FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Allow users to create activities" ON public.cohort_activities;
CREATE POLICY "Allow users to create activities" ON public.cohort_activities FOR INSERT WITH CHECK (true);

-- ENABLE REALTIME ON ACTIVITY TICKER
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'cohort_activities'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cohort_activities;
  END IF;
END $$;

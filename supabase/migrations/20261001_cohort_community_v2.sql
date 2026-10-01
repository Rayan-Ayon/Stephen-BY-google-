-- ============================================================================
-- COHORT COMMUNITY V2 REFINED ARCHITECTURE MIGRATION
-- ============================================================================

-- 1. EXTEND PROFILES FOR GLOBAL @USERNAME DISCOVERY
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS target_band NUMERIC(2,1) DEFAULT 7.5,
  ADD COLUMN IF NOT EXISTS current_band NUMERIC(2,1) DEFAULT 6.5,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. UNIFIED CONVERSATIONS (COHORT GROUP + 1-ON-1 DIRECT MESSAGES)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('cohort_group', 'direct_message')) NOT NULL,
  cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE, -- NULL for 1-on-1 DMs
  title TEXT, -- Group title (e.g., "Farmgate Batch #08 General Chat")
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONVERSATION PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- 4. REAL-TIME CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,                        -- Text message body
  audio_url TEXT,                      -- Supabase Storage URL for audio voice notes
  media_url TEXT,                      -- Supabase Storage URL for screenshots / attachments
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES & SECURITY
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Read policies: Users can read conversations they participate in
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'View participating conversations'
  ) THEN
    CREATE POLICY "View participating conversations" ON public.conversations 
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.conversation_participants 
          WHERE conversation_id = public.conversations.id AND user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'conversation_participants' AND policyname = 'View conversation participants'
  ) THEN
    CREATE POLICY "View conversation participants" ON public.conversation_participants 
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.conversation_participants cp 
          WHERE cp.conversation_id = public.conversation_participants.conversation_id AND cp.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'View chat messages in joined conversations'
  ) THEN
    CREATE POLICY "View chat messages in joined conversations" ON public.chat_messages 
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.conversation_participants 
          WHERE conversation_id = public.chat_messages.conversation_id AND user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Insert chat messages'
  ) THEN
    CREATE POLICY "Insert chat messages" ON public.chat_messages 
      FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
          SELECT 1 FROM public.conversation_participants 
          WHERE conversation_id = public.chat_messages.conversation_id AND user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- 5. ENABLE REALTIME ON CHAT MESSAGES & PARTICIPANTS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'conversation_participants'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
  END IF;
END $$;

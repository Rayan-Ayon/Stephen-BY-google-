-- ============================================================
-- Migration: Add Listening Audio URL and Storage Bucket
-- Enables automated streaming of Cambridge 7-21 Listening audio
-- ============================================================

-- 1. Add audio_url column to sections and exams
ALTER TABLE public.sections ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- 2. Create public storage bucket for listening audio
INSERT INTO storage.buckets (id, name, public)
VALUES ('listening-audio', 'listening-audio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Public read policy for storage
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
          AND schemaname = 'storage' 
          AND policyname = 'Public Access listening-audio'
    ) THEN
        CREATE POLICY "Public Access listening-audio"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'listening-audio');
    END IF;
END $$;

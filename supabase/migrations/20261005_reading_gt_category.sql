-- ============================================================
-- Migration: Add Category Support to Exams and Exam Attempts
-- Enables clean decoupling between Academic and General Training
-- ============================================================

-- 1. Add category column to exams
ALTER TABLE public.exams 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'academic' 
CHECK (category IN ('academic', 'general'));

-- 2. Add category column to exam_attempts
ALTER TABLE public.exam_attempts 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'academic' 
CHECK (category IN ('academic', 'general'));

-- 3. Ensure existing rows are flagged as academic
UPDATE public.exams 
SET category = 'academic' 
WHERE category IS NULL;

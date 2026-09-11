# Supabase Row Level Security (RLS) Policies

Use these SQL snippets when migrating from the SQLite backend to Supabase tables.
Run these in the Supabase SQL Editor (Dashboard → SQL Editor).

---

## 1. Enable RLS on All User-Data Tables

```sql
ALTER TABLE ai_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_videos ENABLE ROW LEVEL SECURITY;
```

## 2. AI Results — User Isolation Policy

```sql
-- Users can only read their own AI results
CREATE POLICY "Users can only read their own AI results"
ON ai_results
FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert AI results for themselves
CREATE POLICY "Users can only insert their own AI results"
ON ai_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own AI results
CREATE POLICY "Users can only update their own AI results"
ON ai_results
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own AI results
CREATE POLICY "Users can only delete their own AI results"
ON ai_results
FOR DELETE
USING (auth.uid() = user_id);
```

## 3. Recent Videos — User Isolation Policy

```sql
-- Users can only read their own recent videos
CREATE POLICY "Users can only read their own recent videos"
ON recent_videos
FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert recent videos for themselves
CREATE POLICY "Users can only insert their own recent videos"
ON recent_videos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own recent videos
CREATE POLICY "Users can only update their own recent videos"
ON recent_videos
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own recent videos
CREATE POLICY "Users can only delete their own recent videos"
ON recent_videos
FOR DELETE
USING (auth.uid() = user_id);
```

## 4. Consolidated Policies (Alternative — Single Policy Per Table)

If you prefer fewer policies, use the combined approach:

```sql
-- AI Results: Full CRUD isolation
CREATE POLICY "ai_results_user_isolation"
ON ai_results
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Recent Videos: Full CRUD isolation
CREATE POLICY "recent_videos_user_isolation"
ON recent_videos
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## 5. Add user_id Column (If Migrating from user_email)

```sql
-- Add user_id column to existing tables
ALTER TABLE ai_results ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE recent_videos ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for fast lookups
CREATE INDEX idx_ai_results_user_id ON ai_results(user_id);
CREATE INDEX idx_recent_videos_user_id ON recent_videos(user_id);

-- Backfill user_id from email (run after deploying auth)
-- This requires a function to map email → user_id
UPDATE ai_results SET user_id = (
    SELECT id FROM auth.users WHERE email = ai_results.user_email
);

UPDATE recent_videos SET user_id = (
    SELECT id FROM auth.users WHERE email = recent_videos.user_email
);

-- Make user_id NOT NULL after backfill
ALTER TABLE ai_results ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE recent_videos ALTER COLUMN user_id SET NOT NULL;

-- Drop the old user_email column (after verifying migration)
-- ALTER TABLE ai_results DROP COLUMN user_email;
-- ALTER TABLE recent_videos DROP COLUMN user_email;
```

## 6. Service Role Bypass (For Admin/Backend Operations)

```sql
-- Allow service_role to bypass RLS (for backend operations)
-- This is automatic in Supabase — service_role key skips RLS
-- Just ensure your backend uses the service_role key, not anon
```

---

## Notes

- **RLS is enforced at the database level** — even if your API code has bugs, the database will reject unauthorized queries.
- **`auth.uid()`** returns the UUID of the currently authenticated user from the Supabase JWT.
- **Test RLS policies** using the Supabase Dashboard → Authentication → Policies tab.
- **Service role** bypasses RLS — use it only in trusted backend code, never in the frontend.

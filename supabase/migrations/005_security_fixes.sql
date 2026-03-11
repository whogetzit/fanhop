-- Fix Supabase Security Advisor warnings

-- 1. Fix "Function Search Path Mutable" for update_updated_at
--    Set search_path to prevent search-path hijacking
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = '';

-- 2. Fix "Function Search Path Mutable" for sync_like_count
--    Set search_path to prevent search-path hijacking
CREATE OR REPLACE FUNCTION sync_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.models SET like_count = like_count + 1 WHERE id = NEW.model_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.models SET like_count = like_count - 1 WHERE id = OLD.model_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- 3. Fix "RLS Policy Always True" on rate_limits
--    Restrict to authenticated users instead of allowing everyone
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON rate_limits;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON rate_limits;

CREATE POLICY "Allow insert for authenticated users"
  ON rate_limits FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow select for authenticated users"
  ON rate_limits FOR SELECT
  USING (auth.role() = 'authenticated');

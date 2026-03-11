-- Distributed rate limiting table for serverless instances
CREATE TABLE IF NOT EXISTS rate_limits (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key         text NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- Fast lookups by key + time window
CREATE INDEX IF NOT EXISTS rate_limits_key_created_idx ON rate_limits(key, created_at DESC);

-- RLS: allow API routes (authenticated via service role or anon key) to insert/read
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for authenticated users"
  ON rate_limits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select for authenticated users"
  ON rate_limits FOR SELECT
  USING (true);

-- Auto-cleanup: delete entries older than 5 minutes (runs via pg_cron or manual)
-- For Supabase, enable pg_cron extension and schedule:
--   SELECT cron.schedule('cleanup-rate-limits', '*/5 * * * *',
--     $$DELETE FROM rate_limits WHERE created_at < now() - interval '5 minutes'$$);

-- FanHop Phase 2 schema
-- Run this in your Supabase SQL editor, or via: supabase db push

-- ─── Models ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS models (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name          text NOT NULL,
  weights       jsonb NOT NULL,
  champion      text,
  is_public     boolean DEFAULT false NOT NULL,
  share_slug    text UNIQUE,
  total_points  integer DEFAULT 0 NOT NULL,
  score         jsonb,
  like_count    integer DEFAULT 0 NOT NULL,
  created_at    timestamptz DEFAULT now() NOT NULL,
  updated_at    timestamptz DEFAULT now() NOT NULL
);

-- Row Level Security
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own models"
  ON models FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read public models"
  ON models FOR SELECT
  USING (is_public = true);

-- Indexes
CREATE INDEX IF NOT EXISTS models_user_id_idx  ON models(user_id);
CREATE INDEX IF NOT EXISTS models_slug_idx     ON models(share_slug) WHERE share_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS models_public_idx   ON models(is_public, total_points DESC) WHERE is_public = true;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Likes ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS model_likes (
  model_id    uuid REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (model_id, user_id)
);

ALTER TABLE model_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own likes"
  ON model_likes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read likes"
  ON model_likes FOR SELECT USING (true);

-- Keep like_count denormalized for performance
CREATE OR REPLACE FUNCTION sync_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE models SET like_count = like_count + 1 WHERE id = NEW.model_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE models SET like_count = like_count - 1 WHERE id = OLD.model_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_like_count_trigger
  AFTER INSERT OR DELETE ON model_likes
  FOR EACH ROW EXECUTE FUNCTION sync_like_count();

-- ─── Leaderboard view (Phase 3) ───────────────────────────────────────────────

CREATE OR REPLACE VIEW leaderboard AS
SELECT
  m.id,
  m.name,
  m.champion,
  m.total_points,
  m.like_count,
  m.created_at,
  ROW_NUMBER() OVER (ORDER BY m.total_points DESC, m.like_count DESC) AS rank,
  au.email AS user_email
FROM models m
JOIN auth.users au ON m.user_id = au.id
WHERE m.is_public = true
ORDER BY m.total_points DESC, m.like_count DESC
LIMIT 100;

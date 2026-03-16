-- Analytics counters (single-row table)
CREATE TABLE analytics (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  unique_visitors bigint NOT NULL DEFAULT 0,
  models_created bigint NOT NULL DEFAULT 0
);
INSERT INTO analytics (id) VALUES (1);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read analytics" ON analytics FOR SELECT USING (true);

-- Visits table for unique visitor deduplication
CREATE TABLE visits (
  visitor_id text PRIMARY KEY,
  first_seen_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert visits" ON visits FOR INSERT WITH CHECK (true);

-- Record a visit: only increments counter for new visitors
CREATE OR REPLACE FUNCTION record_visit(p_visitor_id text)
RETURNS void AS $$
BEGIN
  INSERT INTO visits (visitor_id) VALUES (p_visitor_id)
  ON CONFLICT (visitor_id) DO NOTHING;
  IF FOUND THEN
    UPDATE analytics SET unique_visitors = unique_visitors + 1 WHERE id = 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-increment models_created on new model insert
CREATE OR REPLACE FUNCTION increment_models_created()
RETURNS trigger AS $$
BEGIN
  UPDATE analytics SET models_created = models_created + 1 WHERE id = 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_model_insert
  AFTER INSERT ON models
  FOR EACH ROW EXECUTE FUNCTION increment_models_created();

-- Enable Realtime on analytics table
ALTER PUBLICATION supabase_realtime ADD TABLE analytics;

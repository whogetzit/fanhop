-- Add year column to models table for multi-season support
ALTER TABLE models ADD COLUMN year smallint NOT NULL DEFAULT 2025;
CREATE INDEX idx_models_year ON models(year);

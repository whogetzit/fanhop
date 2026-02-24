-- Allow upsert by (user_id, name)
ALTER TABLE models ADD CONSTRAINT models_user_id_name_unique UNIQUE (user_id, name);

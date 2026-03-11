-- Store encoded bracket results and preset for chaos brackets
ALTER TABLE models ADD COLUMN bracket_data text;
ALTER TABLE models ADD COLUMN preset text;

-- Run this in Supabase SQL Editor to add profiles table
-- (Run AFTER 001_initial.sql)

CREATE TABLE IF NOT EXISTS profiles (
  id           uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username     text UNIQUE NOT NULL,
  display_name text,
  avatar_url   text,
  email        text,
  bio          text,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

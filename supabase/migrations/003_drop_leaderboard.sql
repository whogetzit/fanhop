-- Remove leaderboard view — it exposed user emails (auth.users.email) publicly
DROP VIEW IF EXISTS leaderboard;

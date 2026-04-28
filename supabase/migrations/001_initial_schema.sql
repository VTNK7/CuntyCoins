-- Stickers table: all available stickers in the game
CREATE TABLE stickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('common', 'rare', 'ultra')),
  color TEXT NOT NULL DEFAULT '#ff2e93',
  icon TEXT NOT NULL DEFAULT '♡',
  points INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User scans: tracks which stickers a user has scanned
CREATE TABLE user_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sticker_id UUID NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, sticker_id)
);

-- Enable Row Level Security
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scans ENABLE ROW LEVEL SECURITY;

-- Stickers are readable by everyone (public catalog)
CREATE POLICY "Stickers are publicly readable"
  ON stickers FOR SELECT
  USING (true);

-- Users can only read their own scans
CREATE POLICY "Users can read own scans"
  ON user_scans FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own scans
CREATE POLICY "Users can insert own scans"
  ON user_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_scans_user_id ON user_scans(user_id);
CREATE INDEX idx_user_scans_sticker_id ON user_scans(sticker_id);

-- Seed data: ERA 01 · PARIS stickers
INSERT INTO stickers (name, location, tier, color, icon, points) VALUES
  ('soho pink wall', 'soho · paris', 'common', '#ff2e93', '♡', 30),
  ('café cunty', 'le marais', 'common', '#c9a8ff', '✦', 30),
  ('rivoli holo', 'rue de rivoli', 'ultra', '#ff2e93', '★', 200),
  ('metro châtelet', 'châtelet', 'rare', '#ffe600', '♡', 80),
  ('pigalle babe', 'pigalle', 'common', '#6effc4', '✿', 30),
  ('louvre era', 'louvre', 'rare', '#ff2e93', '★', 80),
  ('bastille beat', 'bastille', 'common', '#c9a8ff', '♪', 30),
  ('republique girl', 'république', 'common', '#ffe600', '♡', 30);

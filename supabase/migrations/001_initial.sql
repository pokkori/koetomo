-- コエトモ 初回マイグレーション
-- 実行方法: supabase db push または Supabase Dashboard の SQL Editor で実行

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expo_push_token TEXT,
  revenuecat_user_id TEXT UNIQUE,
  streak_count INTEGER DEFAULT 0,
  last_active_date DATE,
  total_recording_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 日記エントリーテーブル
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recording_duration INTEGER NOT NULL,
  transcription TEXT NOT NULL,
  ai_diary TEXT NOT NULL,
  ai_backchat TEXT,
  emotion_primary TEXT NOT NULL CHECK (emotion_primary IN ('happy', 'sad', 'angry', 'anxious', 'calm')),
  emotion_score FLOAT CHECK (emotion_score >= 0 AND emotion_score <= 1),
  emotion_tags TEXT[],
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- ユーザーポリシー
CREATE POLICY "users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 日記ポリシー
CREATE POLICY "diary insert own"
  ON diary_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "diary read own"
  ON diary_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "diary update own"
  ON diary_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "diary delete own"
  ON diary_entries FOR DELETE
  USING (auth.uid() = user_id);

-- インデックス（パフォーマンス最適化）
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_created
  ON diary_entries (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_diary_entries_emotion
  ON diary_entries (user_id, emotion_primary);

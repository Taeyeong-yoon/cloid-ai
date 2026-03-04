-- bookmarks 테이블 생성
-- Supabase SQL Editor 또는 supabase db push로 실행

CREATE TABLE IF NOT EXISTS bookmarks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('radar', 'skill')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_user_slug_type_idx ON bookmarks(user_id, slug, type);

-- 중복 방지
CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_unique_idx ON bookmarks(user_id, slug, type);

-- RLS 활성화
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- 자신의 데이터만 조회
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- 자신의 데이터만 삽입
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 자신의 데이터만 삭제
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

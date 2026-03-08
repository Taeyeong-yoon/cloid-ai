"use server";

import { createClient } from "@/lib/supabase/server";

// ── 학습 완료 상태 저장 ──────────────────────────────────────
// Supabase에서 아래 SQL로 progress 테이블 생성 필요:
//
// CREATE TABLE IF NOT EXISTS progress (
//   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
//   content_id text NOT NULL,
//   content_type text NOT NULL CHECK (content_type IN ('learning', 'lab', 'skill')),
//   completed_at timestamptz DEFAULT now(),
//   UNIQUE(user_id, content_id)
// );
// ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Users can read own progress" ON progress FOR SELECT USING (auth.uid() = user_id);
// CREATE POLICY "Users can insert own progress" ON progress FOR INSERT WITH CHECK (auth.uid() = user_id);
// CREATE POLICY "Users can update own progress" ON progress FOR UPDATE USING (auth.uid() = user_id);

export async function markCompleted(
  contentId: string,
  contentType: "learning" | "lab" | "skill"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인 필요" };

  const { error } = await supabase.from("progress").upsert(
    {
      user_id: user.id,
      content_id: contentId,
      content_type: contentType,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,content_id" }
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function getProgress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("progress")
    .select("content_id, content_type, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false });

  return data ?? [];
}

export async function getRecentProgress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { lastLearning: null, lastLab: null };

  const { data } = await supabase
    .from("progress")
    .select("content_id, content_type, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(10);

  if (!data) return { lastLearning: null, lastLab: null };

  const lastLearning = data.find((d) => d.content_type === "learning") ?? null;
  const lastLab = data.find((d) => d.content_type === "lab") ?? null;

  return { lastLearning, lastLab };
}

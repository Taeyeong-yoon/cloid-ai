export type ContentType = "learning" | "lab" | "skill";

// localStorage 키: "cloid-progress:{contentType}:{contentId}"
// 값: JSON.stringify(number[]) — 완료된 step 인덱스 배열

function getLocalKey(contentType: ContentType, contentId: string): string {
  return `cloid-progress:${contentType}:${contentId}`;
}

export function getProgress(contentType: ContentType, contentId: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getLocalKey(contentType, contentId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleStep(
  contentType: ContentType,
  contentId: string,
  stepIndex: number
): number[] {
  const current = getProgress(contentType, contentId);
  const updated = current.includes(stepIndex)
    ? current.filter((i) => i !== stepIndex)
    : [...current, stepIndex].sort((a, b) => a - b);
  localStorage.setItem(getLocalKey(contentType, contentId), JSON.stringify(updated));
  return updated;
}

export function getCompletionRate(
  contentType: ContentType,
  contentId: string,
  totalSteps: number
): number {
  if (totalSteps === 0) return 0;
  const completed = getProgress(contentType, contentId);
  return Math.round((completed.length / totalSteps) * 100);
}

export function resetProgress(contentType: ContentType, contentId: string): void {
  localStorage.removeItem(getLocalKey(contentType, contentId));
}

// Supabase 동기화 (로그인 사용자, 선택적)
// 실패해도 localStorage는 유지 — 오프라인 우선
export async function syncProgressToServer(
  contentType: ContentType,
  contentId: string,
  completedSteps: number[],
  totalSteps: number
): Promise<void> {
  try {
    const status = completedSteps.length >= totalSteps ? "completed" : "started";
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, contentId, status }),
    });
  } catch {
    // 실패 무시 — localStorage가 진실의 원천
  }
}

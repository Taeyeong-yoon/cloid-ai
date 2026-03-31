export type ContentType = "learning" | "lab" | "skill";

// ── 북마크 ────────────────────────────────────────────────────
// localStorage 키: "cloid-bookmarks"
// 값: { textbooks: string[], labs: string[] }

const BOOKMARKS_KEY = "cloid-bookmarks";

interface Bookmarks {
  textbooks: string[];
  labs: string[];
}

function loadBookmarks(): Bookmarks {
  if (typeof window === "undefined") return { textbooks: [], labs: [] };
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return { textbooks: [], labs: [] };
    const parsed = JSON.parse(raw);
    return {
      textbooks: Array.isArray(parsed.textbooks) ? parsed.textbooks : [],
      labs: Array.isArray(parsed.labs) ? parsed.labs : [],
    };
  } catch {
    return { textbooks: [], labs: [] };
  }
}

function saveBookmarks(bms: Bookmarks): void {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bms));
}

export function isBookmarked(type: "textbooks" | "labs", id: string): boolean {
  return loadBookmarks()[type].includes(id);
}

export function toggleBookmark(type: "textbooks" | "labs", id: string): boolean {
  const bms = loadBookmarks();
  const list = bms[type];
  const exists = list.includes(id);
  bms[type] = exists ? list.filter((i) => i !== id) : [...list, id];
  saveBookmarks(bms);
  return !exists; // true = now bookmarked
}

export function getAllBookmarks(): Bookmarks {
  return loadBookmarks();
}

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

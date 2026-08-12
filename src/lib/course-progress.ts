// 코스 열람 기록 — localStorage 기반 (로그인 불필요)
// 키: "cloid-course:{courseId}" · 값: 열람한 lesson id 배열

const KEY_PREFIX = "cloid-course:";
const DEFAULT_COURSE = "claude-level1";

function key(courseId: string) {
  return `${KEY_PREFIX}${courseId}`;
}

export function getVisitedLessons(courseId: string = DEFAULT_COURSE): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key(courseId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function markLessonVisited(lessonId: string, courseId: string = DEFAULT_COURSE): string[] {
  if (typeof window === "undefined") return [];
  const current = getVisitedLessons(courseId);
  if (current.includes(lessonId)) return current;
  const updated = [...current, lessonId];
  try {
    localStorage.setItem(key(courseId), JSON.stringify(updated));
  } catch {
    // 저장 실패는 무시 — 열람 기록은 보조 기능
  }
  return updated;
}

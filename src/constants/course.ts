// ── AI 클로드 활용 기본 교육 Level 1 ────────────────────────
// 원본 교재는 public/course/claude-level1/*.html 에 정적 배치되어 있고
// 각 교시 페이지는 iframe으로 해당 파일을 로드한다.

export interface CourseLesson {
  id: string;
  order: number;
  /** 교시 라벨 (예: "1교시", "5·6교시") */
  session: string;
  sessionEn: string;
  title: string;
  titleEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  /** public/course/claude-level1 기준 파일명 */
  file: string;
  slides: number;
  minutes: number;
  topics: string[];
  topicsEn: string[];
  icon: string;
  accentColor: "teal" | "violet" | "amber" | "sky" | "emerald" | "indigo";
}

export const COURSE_BASE = "/course/claude-level1";

export const COURSE_META = {
  id: "claude-level1",
  title: "AI 클로드 활용 기본 교육",
  titleEn: "Claude for Work — Level 1",
  level: "Level 1",
  subtitle: "생성형 AI 기본 이해와 업무 활용 실습 · 전 6교시",
  subtitleEn: "Understand generative AI and put it to work — a six-session course",
  totalSlides: 120,
  totalMinutes: 330,
} as const;

export const COURSE_LESSONS: CourseLesson[] = [
  {
    id: "foundations",
    order: 1,
    session: "1교시",
    sessionEn: "Session 1",
    title: "기본",
    titleEn: "Foundations",
    tagline: "AI를 제대로 쓰기 위한 기초",
    taglineEn: "The groundwork for using AI well",
    description:
      "AI가 답을 만드는 원리부터 할루시네이션, 토큰과 컨텍스트, 보안과 윤리까지 — 실습 전에 반드시 잡아야 할 감각을 정리합니다.",
    descriptionEn:
      "How AI actually produces answers — hallucination, tokens, context windows, and the security habits to set before you start.",
    file: "01-foundations.html",
    slides: 18,
    minutes: 55,
    topics: ["답변 생성 원리", "할루시네이션", "모델과 토큰", "컨텍스트", "AI Ready Data", "보안과 윤리"],
    topicsEn: ["How answers form", "Hallucination", "Models & tokens", "Context", "AI-ready data", "Security"],
    icon: "compare",
    accentColor: "teal",
  },
  {
    id: "chat",
    order: 2,
    session: "2교시",
    sessionEn: "Session 2",
    title: "Chat",
    titleEn: "Chat",
    tagline: "프롬프트 엔지니어링과 실습",
    taglineEn: "Prompt engineering, hands-on",
    description:
      "Chat과 Cowork의 차이를 가르고, 프롬프트를 5단계로 확장하는 법과 재질문으로 결과를 다듬는 흐름을 실습합니다.",
    descriptionEn:
      "Separate Chat from Cowork, expand a prompt through five levels, and refine results with follow-up questions.",
    file: "02-chat.html",
    slides: 12,
    minutes: 50,
    topics: ["Chat과 Cowork 구분", "프롬프트 5단계 확장", "재질문으로 다듬기", "MD로 저장"],
    topicsEn: ["Chat vs Cowork", "Five-level prompts", "Refining by follow-up", "Saving as Markdown"],
    icon: "prompt",
    accentColor: "violet",
  },
  {
    id: "cowork",
    order: 3,
    session: "3교시",
    sessionEn: "Session 3",
    title: "Cowork",
    titleEn: "Cowork",
    tagline: "작업공간 설정과 파일 정리 실습",
    taglineEn: "Set up a workspace, organize real files",
    description:
      "프로젝트와 지침 3줄로 작업공간을 세팅하고, 흩어진 파일 23개를 실제로 분류해 검색 대시보드까지 만들어 봅니다.",
    descriptionEn:
      "Set up a workspace with a project and three instruction lines, then sort 23 scattered files into a searchable dashboard.",
    file: "03-cowork.html",
    slides: 22,
    minutes: 60,
    topics: ["코워크 화면", "프로젝트와 지침 3줄", "폴더 23개 정리", "검색 대시보드"],
    topicsEn: ["The Cowork screen", "Project & instructions", "Sorting 23 files", "Search dashboard"],
    icon: "cowork",
    accentColor: "amber",
  },
  {
    id: "design",
    order: 4,
    session: "4교시",
    sessionEn: "Session 4",
    title: "Design",
    titleEn: "Design",
    tagline: "디자인 시스템으로 보고서 만들기",
    taglineEn: "Reports that follow a design system",
    description:
      "내용과 디자인을 분리하는 사고법을 익히고, DESIGN.md를 확보해 같은 내용을 PPT와 HTML 보고서로 동시에 뽑아냅니다.",
    descriptionEn:
      "Split content from design, capture a DESIGN.md, and generate the same report as both a deck and an HTML page.",
    file: "04-design.html",
    slides: 23,
    minutes: 60,
    topics: ["내용·디자인 분리", "DESIGN.md 확보법", "PPT + HTML 동시 생성", "디자인 규칙서"],
    topicsEn: ["Content vs design", "Getting a DESIGN.md", "Deck + HTML at once", "Design rules"],
    icon: "chart",
    accentColor: "sky",
  },
  {
    id: "skills",
    order: 5,
    session: "5·6교시",
    sessionEn: "Sessions 5–6",
    title: "Skills",
    titleEn: "Skills",
    tagline: "나만의 스킬 만들기 · 등록 · 배포",
    taglineEn: "Build, register, and ship your own skill",
    description:
      "스킬과 에이전트의 차이부터 5단계 설계, SKILL.md 작성, 저장과 등록의 차이, 팀 배포까지 한 번에 다룹니다.",
    descriptionEn:
      "From skills vs agents to five-step design, writing SKILL.md, save vs register, and shipping to your team.",
    file: "05-skills.html",
    slides: 45,
    minutes: 105,
    topics: ["왜 스킬인가", "스킬과 에이전트의 차이", "5단계 설계", "SKILL.md 만들기", "등록과 배포"],
    topicsEn: ["Why skills", "Skills vs agents", "Five-step design", "Writing SKILL.md", "Register & deploy"],
    icon: "marketplace",
    accentColor: "emerald",
  },
];

export interface CourseMaterial {
  id: string;
  label: string;
  labelEn: string;
  note: string;
  noteEn: string;
  href: string;
  sizeLabel: string;
}

export const COURSE_MATERIALS: CourseMaterial[] = [
  {
    id: "session3",
    label: "3교시 실습자료 — 정리 전 파일 23개",
    labelEn: "Session 3 files — 23 unsorted documents",
    note: "폴더 정리 실습에 사용합니다. 압축을 풀고 바탕화면에 두세요.",
    noteEn: "Used for the file-organization lab. Unzip it to your desktop.",
    href: `${COURSE_BASE}/materials/3교시_실습자료.zip`,
    sizeLabel: "1.3MB",
  },
  {
    id: "session4",
    label: "4교시 실습자료 — 보고서 원문과 디자인 규칙",
    labelEn: "Session 4 files — report drafts and design rules",
    note: "보고서 PPT·HTML 생성 실습에 사용하는 마크다운 11종입니다.",
    noteEn: "Eleven markdown sources for the report generation lab.",
    href: `${COURSE_BASE}/materials/4교시_실습자료.zip`,
    sizeLabel: "20KB",
  },
];

export const COURSE_APPENDIX = {
  id: "ai-tools",
  label: "외부 AI 도구 소개",
  labelEn: "External AI tools",
  note: "수업에서 다루지 않는 참고 자료입니다.",
  noteEn: "Reference material not covered in class.",
  file: "appendix-ai-tools.html",
};

export function getLesson(id: string): CourseLesson | null {
  return COURSE_LESSONS.find((lesson) => lesson.id === id) ?? null;
}

export function getAdjacentLessons(id: string) {
  const index = COURSE_LESSONS.findIndex((lesson) => lesson.id === id);
  return {
    prev: index > 0 ? COURSE_LESSONS[index - 1] : null,
    next: index >= 0 && index < COURSE_LESSONS.length - 1 ? COURSE_LESSONS[index + 1] : null,
  };
}

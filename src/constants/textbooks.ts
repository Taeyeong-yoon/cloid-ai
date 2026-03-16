export interface Textbook {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  priority: 1 | 2 | 3;
  icon: string;
  accentColor:
    | "amber"
    | "violet"
    | "teal"
    | "blue"
    | "sky"
    | "emerald"
    | "indigo"
    | "rose"
    | "fuchsia"
    | "orange"
    | "cyan";
  htmlFile?: string;
  sections: number;
  estimatedMinutes: number;
  tags: string[];
  ready: boolean;
}

export const TEXTBOOKS: Textbook[] = [
  {
    id: "cowork-mastery",
    title: "Cowork 실전 정복",
    titleEn: "Cowork Mastery",
    description: "Cowork, plugin, agent 흐름을 한 장의 지도처럼 정리하는 실무형 교재입니다.",
    descriptionEn: "An operations-focused textbook that maps cowork, plugins, and agent workflows end to end.",
    priority: 1,
    icon: "cowork",
    accentColor: "amber",
    sections: 12,
    estimatedMinutes: 45,
    tags: ["Cowork", "Plugin", "Agent"],
    ready: false,
  },
  {
    id: "prompt-engineering",
    title: "프롬프트 엔지니어링 실전",
    titleEn: "Prompt Engineering in Practice",
    description: "Few-shot, 출력 구조화, 역할 설계를 실전에 바로 쓰는 흐름으로 엮었습니다.",
    descriptionEn: "Practice-ready coverage of few-shot prompting, structured outputs, and role design patterns.",
    priority: 1,
    icon: "prompt",
    accentColor: "violet",
    sections: 10,
    estimatedMinutes: 40,
    tags: ["Prompt", "Few-shot", "Output"],
    ready: false,
  },
  {
    id: "claude-code-intro",
    title: "Claude Code 입문",
    titleEn: "Getting Started with Claude Code",
    description: "CLI 흐름, 파일 수정, 자동화 감각을 첫 실습부터 연결하는 교재입니다.",
    descriptionEn: "A first-step textbook covering CLI flow, file edits, and automation with Claude Code.",
    priority: 1,
    icon: "terminal",
    accentColor: "teal",
    sections: 10,
    estimatedMinutes: 35,
    tags: ["Claude Code", "CLI", "Automation"],
    ready: false,
  },
  {
    id: "agent-patterns",
    title: "AI 에이전트 패턴 이해",
    titleEn: "AI Agent Workflow Patterns",
    description: "툴 호출, 병렬 실행, 메모리 설계를 패턴 중심으로 설명합니다.",
    descriptionEn: "Visual guides to tool calling, orchestration, memory, and practical agent workflow patterns.",
    priority: 2,
    icon: "agent",
    accentColor: "blue",
    sections: 10,
    estimatedMinutes: 40,
    tags: ["Agent", "Workflow", "Multi-agent"],
    ready: false,
  },
  {
    id: "api-fundamentals",
    title: "API 기초와 연결",
    titleEn: "Claude API Fundamentals",
    description: "메시지 구조, 토큰, 스트리밍, 함수 호출을 핵심만 정리합니다.",
    descriptionEn: "A compact textbook on messages, tokens, streaming, and function/tool calling basics.",
    priority: 2,
    icon: "api",
    accentColor: "sky",
    sections: 10,
    estimatedMinutes: 35,
    tags: ["API", "Function Calling", "Streaming"],
    ready: false,
  },
  {
    id: "data-analysis-ai",
    title: "데이터 분석 with AI",
    titleEn: "Data Analysis with AI",
    description: "CSV를 읽고 요약하고 보고서로 바꾸는 흐름을 따라가는 교재입니다.",
    descriptionEn: "Use AI to inspect CSVs, summarize findings, and turn raw data into practical reports.",
    priority: 2,
    icon: "chart",
    accentColor: "emerald",
    sections: 8,
    estimatedMinutes: 30,
    tags: ["Data", "Excel", "Visualization"],
    ready: false,
  },
  {
    id: "copilot-claude-integration",
    title: "Copilot + Claude 통합",
    titleEn: "Copilot and Claude Integration",
    description: "여러 코딩 보조 도구를 한 팀처럼 쓰는 방법을 다룹니다.",
    descriptionEn: "A workflow textbook for combining Copilot and Claude in collaborative engineering environments.",
    priority: 3,
    icon: "integration",
    accentColor: "indigo",
    sections: 8,
    estimatedMinutes: 25,
    tags: ["Copilot", "Enterprise", "Workflow"],
    ready: false,
  },
  {
    id: "ai-security",
    title: "AI 보안과 안전 사용",
    titleEn: "AI Security and Safe Usage",
    description: "권한, 로그, 민감정보, 내부 문서 사용 시 주의점을 정리합니다.",
    descriptionEn: "Safety-first guidance for permissions, logging, sensitive data, and internal AI adoption.",
    priority: 3,
    icon: "shield",
    accentColor: "rose",
    sections: 8,
    estimatedMinutes: 25,
    tags: ["Security", "Privacy", "Safety"],
    ready: false,
  },
  {
    id: "multimodal-ai",
    title: "멀티모달 AI 활용",
    titleEn: "Multimodal AI Applications",
    description: "이미지, PDF, 음성 입력을 어디에 어떻게 쓰는지 실제 흐름으로 보여줍니다.",
    descriptionEn: "Learn how images, PDFs, and voice inputs fit into multimodal AI workflows.",
    priority: 3,
    icon: "multimodal",
    accentColor: "fuchsia",
    sections: 8,
    estimatedMinutes: 25,
    tags: ["Vision", "PDF", "Voice"],
    ready: false,
  },
  {
    id: "ai-landscape",
    title: "AI 모델 비교 가이드",
    titleEn: "AI Landscape Comparison",
    description: "Claude, GPT, Gemini, Copilot의 차이를 선택 기준 중심으로 정리합니다.",
    descriptionEn: "Compare Claude, GPT, Gemini, and Copilot through decision criteria and real use cases.",
    priority: 3,
    icon: "compare",
    accentColor: "orange",
    sections: 8,
    estimatedMinutes: 25,
    tags: ["Claude", "GPT", "Gemini", "Comparison"],
    ready: false,
  },
  {
    id: "mcp-learning",
    title: "MCP 프로토콜 인터랙티브 교재",
    titleEn: "MCP Protocol Interactive Lab",
    description: "MCP 개념, 연결 구조, API 키 오해, CLI와 Web LLM 차이를 단계별로 이해합니다.",
    descriptionEn: "A step-by-step interactive textbook explaining MCP concepts, setup flow, API-key decisions, and client differences.",
    priority: 1,
    icon: "mcp",
    accentColor: "cyan",
    htmlFile: "mcp-learning.html",
    sections: 11,
    estimatedMinutes: 45,
    tags: ["MCP", "Protocol", "Connector"],
    ready: true,
  },
  {
    id: "marketplace-learning",
    title: "Marketplace 인터랙티브 교재",
    titleEn: "Marketplace Interactive Lab",
    description: "Marketplace, Skill, Plugin, Cowork 흐름을 실제 활용 관점으로 묶은 교재입니다.",
    descriptionEn: "An interactive textbook for marketplace, skills, plugins, and cowork explained through guided personas.",
    priority: 1,
    icon: "marketplace",
    accentColor: "amber",
    htmlFile: "marketplace-learning.html",
    sections: 10,
    estimatedMinutes: 50,
    tags: ["Marketplace", "Skill", "Plugin", "Cowork"],
    ready: true,
  },
];

export const TEXTBOOK_PRIORITY_LABELS = {
  en: {
    1: "Start now",
    2: "Expand skills",
    3: "Trending",
  },
  ko: {
    1: "지금 학습",
    2: "실무 확장",
    3: "최신 흐름",
  },
} as const;

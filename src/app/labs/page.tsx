import { FlaskConical, Terminal, Play, Copy } from "lucide-react";

const labs = [
  {
    id: 1,
    title: "Claude Code로 컴포넌트 자동 생성",
    description: "Next.js 프로젝트에서 Claude Code를 사용해 UI 컴포넌트를 자동으로 생성하고 테스트하는 실습",
    category: "Claude Code",
    difficulty: "beginner",
    command: 'claude "Create a responsive card component with TypeScript and Tailwind"',
    steps: [
      "Claude Code 설치: npm install -g @anthropic-ai/claude-code",
      "프로젝트 디렉토리에서 claude 명령어 실행",
      "생성된 컴포넌트 확인 및 수정",
    ],
  },
  {
    id: 2,
    title: "MCP Filesystem 서버 연결",
    description: "로컬 파일시스템에 접근하는 MCP 서버를 Claude Desktop에 연결하고 파일 읽기/쓰기를 실습",
    category: "MCP",
    difficulty: "intermediate",
    command: "npx @modelcontextprotocol/server-filesystem ~/Desktop",
    steps: [
      "Claude Desktop 앱 설치",
      "claude_desktop_config.json에 MCP 서버 추가",
      "Claude에서 '파일 목록 보여줘' 요청으로 연결 확인",
    ],
  },
  {
    id: 3,
    title: "Gemini API 스트리밍 응답 구현",
    description: "Gemini 2.0 Flash API를 사용해 실시간 스트리밍 응답을 Next.js에 구현하는 실습",
    category: "Gemini",
    difficulty: "intermediate",
    command: "npm install @google/generative-ai",
    steps: [
      "Google AI Studio에서 API 키 발급",
      "환경 변수에 GEMINI_API_KEY 설정",
      "app/api/stream/route.ts 파일 생성 후 스트리밍 구현",
    ],
  },
];

const difficultyColor: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50",
  intermediate: "text-amber-400 bg-amber-900/30 border-amber-700/50",
};

const difficultyLabel: Record<string, string> = {
  beginner: "입문",
  intermediate: "중급",
};

const categoryColor: Record<string, string> = {
  "Claude Code": "text-violet-400",
  MCP: "text-blue-400",
  Gemini: "text-emerald-400",
};

export default function LabsPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">오늘의 실습</h1>
      </div>
      <p className="text-slate-400 text-sm mb-8">
        직접 실행해보는 AI 실습 3선. 커맨드를 복사해서 바로 시작하세요.
      </p>

      <div className="grid gap-6">
        {labs.map((lab, i) => (
          <div key={lab.id} className="p-6 rounded-xl border border-slate-800 bg-slate-900/40">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-violet-900/50 border border-violet-700 text-violet-300 text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-medium ${categoryColor[lab.category] ?? "text-slate-400"}`}>
                      {lab.category}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${difficultyColor[lab.difficulty]}`}>
                      {difficultyLabel[lab.difficulty]}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{lab.title}</h2>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-5">{lab.description}</p>

            {/* Command */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500 uppercase tracking-wider">실행 커맨드</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3">
                <code className="flex-1 text-sm font-mono text-emerald-300 break-all">
                  {lab.command}
                </code>
                <button className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors">
                  <Copy size={14} />
                </button>
              </div>
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Play size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500 uppercase tracking-wider">실습 단계</span>
              </div>
              <ol className="space-y-2">
                {lab.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-xs flex items-center justify-center mt-0.5">
                      {j + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

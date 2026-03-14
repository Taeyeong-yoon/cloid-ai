"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, X, Copy, Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// ── 키워드 alias 맵: 모든 표현 → canonical key ──────────────
// 동의어/한국어/영어 변형을 canonical key 하나로 정규화
// 새 동의어 추가 시 여기에만 추가하면 됨 (KEYWORD_CONTENT 중복 등록 불필요)
const KEYWORD_ALIASES: Record<string, string> = {
  // Claude
  "claude": "claude",
  "클로드": "claude",
  "claude code": "claude",
  "클로드코드": "claude",
  "anthropic": "claude",
  "앤스로픽": "claude",
  "codex": "claude",
  "codex cli": "claude",
  // MCP
  "mcp": "mcp",
  // Prompt
  "프롬프트": "prompt",
  "prompt": "prompt",
  "프롬프트엔지니어링": "prompt",
  "prompt engineering": "prompt",
  // Agent
  "에이전트": "agent",
  "agent": "agent",
  "ai agent": "agent",
  "ai 에이전트": "agent",
  "uli": "agent",
  "cli": "agent",
  "cli agent": "agent",
  "cli 에이전트": "agent",
  "claude market": "agent",
  "skill chaining": "agent",
  "claude skills": "agent",
  "클로드 마켓": "agent",
  // RAG
  "rag": "rag",
  // LangChain
  "langchain": "langchain",
  "랭체인": "langchain",
  // Cursor
  "cursor": "cursor",
  "커서": "cursor",
  // Automation (n8n 포함)
  "자동화": "automation",
  "automation": "automation",
  "n8n": "automation",
  "워크플로우": "automation",
  "workflow": "automation",
  // Gemini
  "gemini": "gemini",
  "제미나이": "gemini",
  "gemini cli": "gemini",
  "제미나이 cli": "gemini",
  // OpenAI / ChatGPT
  "openai": "openai",
  "chatgpt": "openai",
  "챗gpt": "openai",
  "gpt": "openai",
  // Python
  "python": "python",
  "파이썬": "python",
  // HTML
  "html": "html",
};

// ── canonical key → 콘텐츠 매핑 ─────────────────────────────
// 한국어/영어 쌍을 중복 등록하지 않음 - KEYWORD_ALIASES가 정규화를 담당
type RelatedContentItem = { type: string; icon: string; title: string; href: string };

const KEYWORD_CONTENT: Record<string, RelatedContentItem[]> = {
  claude: [
    { type: "Learning", icon: "📖", title: "Master Claude Code", href: "/learning?q=claude" },
    { type: "Learning", icon: "📖", title: "Getting Started with Codex CLI", href: "/learning?q=codex" },
    { type: "Labs", icon: "🧪", title: "Claude Code Component Lab", href: "/labs?q=claude" },
  ],
  mcp: [
    { type: "Learning", icon: "📖", title: "MCP Deep Dive", href: "/learning?q=mcp" },
    { type: "Labs", icon: "🧪", title: "MCP Filesystem Lab", href: "/labs?q=mcp" },
  ],
  prompt: [
    { type: "Learning", icon: "📖", title: "Prompt Engineering", href: "/learning?q=prompt" },
    { type: "Skills", icon: "🔧", title: "Prompt Recipes", href: "/skills?q=prompt" },
  ],
  agent: [
    { type: "Learning", icon: "📖", title: "AI Agent Development", href: "/learning?q=agent" },
    { type: "Labs", icon: "🧪", title: "Build a Chatbot Lab", href: "/labs?q=chatbot" },
  ],
  rag: [
    { type: "Learning", icon: "📖", title: "Build a RAG System", href: "/learning?q=rag" },
    { type: "Labs", icon: "🧪", title: "Data Visualization Lab", href: "/labs?q=data" },
  ],
  langchain: [
    { type: "Learning", icon: "📖", title: "RAG System Learning", href: "/learning?q=rag" },
    { type: "Labs", icon: "🧪", title: "API Integration Lab", href: "/labs?q=api" },
  ],
  cursor: [
    { type: "Learning", icon: "📖", title: "Cursor AI Development", href: "/learning?q=cursor" },
    { type: "Skills", icon: "🔧", title: "Cursor Productivity Patterns", href: "/skills?q=cursor" },
  ],
  automation: [
    { type: "Learning", icon: "📖", title: "AI Automation Learning", href: "/learning?q=automation" },
    { type: "Labs", icon: "🧪", title: "AI Email Automation Lab", href: "/labs?q=email" },
  ],
  gemini: [
    { type: "Learning", icon: "📖", title: "AI Tools Overview", href: "/learning?q=gemini" },
    { type: "Labs", icon: "🧪", title: "Gemini Streaming Lab", href: "/labs?q=gemini" },
  ],
  openai: [
    { type: "Learning", icon: "📖", title: "Master ChatGPT", href: "/learning?q=chatgpt" },
    { type: "Skills", icon: "🔧", title: "OpenAI Prompt Patterns", href: "/skills?q=openai" },
  ],
  python: [
    { type: "Learning", icon: "📖", title: "Python AI Basics", href: "/learning?q=python" },
    { type: "Labs", icon: "🧪", title: "API Integration Lab", href: "/labs?q=api" },
  ],
  html: [
    { type: "Labs", icon: "🧪", title: "Build an HTML App Lab", href: "/labs?q=html" },
  ],
};

// alias 맵 기반 정규화 매칭: 입력 → canonical key → 콘텐츠
function matchContent(question: string): RelatedContentItem[] {
  const q = question.toLowerCase().trim();
  const matchedKeys = new Set<string>();

  for (const [alias, canonicalKey] of Object.entries(KEYWORD_ALIASES)) {
    if (q.includes(alias)) {
      matchedKeys.add(canonicalKey);
    }
  }

  const results: RelatedContentItem[] = [];
  const seen = new Set<string>();

  for (const key of matchedKeys) {
    const items = KEYWORD_CONTENT[key] ?? [];
    for (const item of items) {
      const dedupeKey = `${item.type}-${item.title}`;
      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        results.push(item);
      }
    }
  }
  return results.slice(0, 3);
}

export default function AskAI() {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [relatedContent, setRelatedContent] = useState<
    { type: string; icon: string; title: string; href: string }[]
  >([]);
  const answerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 수준별 빠른 질문 6개
  const QUICK_QUESTIONS = [
    { level: "b", emoji: "🌱", text: t.home.quick_q_b1 },
    { level: "b", emoji: "🌱", text: t.home.quick_q_b2 },
    { level: "m", emoji: "💼", text: t.home.quick_q_m1 },
    { level: "m", emoji: "💼", text: t.home.quick_q_m2 },
    { level: "a", emoji: "🚀", text: t.home.quick_q_a1 },
  ];

  async function handleAsk(q?: string) {
    const text = (q ?? question).trim();
    if (!text || loading) return;

    setLoading(true);
    setAnswer("");
    setError("");
    setRelatedContent([]);
    if (q) setQuestion(q);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.common.error_occurred);
      setAnswer(data.answer);
      // 키워드 매칭으로 관련 콘텐츠 추출
      setRelatedContent(matchContent(text));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (answer && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [answer]);

  return (
    <section className="rounded-2xl border border-violet-800/40 bg-gradient-to-br from-violet-950/30 to-slate-900/50 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-violet-400" />
        <h2 className="text-lg font-semibold text-white">{t.home.ask_ai_title}</h2>
        <span className="text-xs text-violet-400 bg-violet-900/40 px-2 py-0.5 rounded-full border border-violet-700/50">
          GPT-4o mini
        </span>
      </div>

      {/* 수준별 빠른 질문 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1 snap-x scrollbar-none" style={{scrollbarWidth:"none"}}>
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q.text}
            onClick={() => handleAsk(q.text)}
            disabled={loading}
            data-event={`cta_quick_question_${q.level}`}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-violet-600 hover:text-violet-300 hover:bg-violet-900/20 transition-all disabled:opacity-50 flex items-center gap-1"
          >
            <span>{q.emoji}</span>
            {q.text}
          </button>
        ))}
      </div>

      {/* 입력창 */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder={t.home.ask_placeholder}
          className="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          disabled={loading}
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !question.trim()}
          data-event="cta_ask_ai_send"
          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          <span className="hidden sm:inline">
            {loading ? t.common.generating : t.common.send}
          </span>
        </button>
      </div>

      {/* 오류 */}
      {error && (
        <p className="mt-3 text-sm text-rose-400 bg-rose-900/20 border border-rose-800/50 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* 답변 + 관련 콘텐츠 */}
      {answer && (
        <div ref={answerRef} className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-violet-400">
              <Sparkles size={12} />
              <span>{t.home.gemini_answer}</span>
            </div>
            <div className="flex items-center gap-1">
              {/* 복사 버튼 */}
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(answer);
                  setCopiedAnswer(true);
                  setTimeout(() => setCopiedAnswer(false), 1500);
                }}
                aria-label={t.home.copy_answer}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                {copiedAnswer ? <><Check size={12} className="text-emerald-400" /> {t.common.copied}</> : <><Copy size={12} /> {t.common.copy}</>}
              </button>
              <span className="w-px h-4 bg-slate-700" />
              {/* New question button */}
              <button
                onClick={() => {
                  setAnswer("");
                  setRelatedContent([]);
                  setQuestion("");
                  inputRef.current?.focus();
                  inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                aria-label={t.home.new_question}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded text-slate-400 hover:text-violet-300 hover:bg-slate-700 transition-colors"
              >
                <RotateCcw size={12} /> {t.home.new_question}
              </button>
              <button
                onClick={() => { setAnswer(""); setRelatedContent([]); }}
                className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
                title={t.home.close_answer}
                aria-label={t.home.close_answer}
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{answer}</div>

          {/* 관련 내부 콘텐츠 카드 */}
          {relatedContent.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700/60">
              <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                <span>📚</span> {t.home.related_content}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {relatedContent.map((item) => (
                  <Link
                    key={`${item.type}-${item.title}`}
                    href={item.href}
                    data-event={`cta_ask_ai_related_${item.type.toLowerCase()}`}
                    className="group flex flex-col gap-1 p-3 rounded-lg border border-slate-700 bg-slate-800/40 hover:border-violet-600 hover:bg-violet-900/10 transition-all"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-[10px] font-bold text-slate-400">{item.type}</span>
                    </div>
                    <div className="text-xs text-slate-300 group-hover:text-violet-300 transition-colors leading-snug">
                      {item.title}
                    </div>
                    <span className="text-[10px] text-violet-500 group-hover:underline">
                      {t.common.view_now}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 안내 문구 */}
          <p className="mt-3 text-[10px] text-slate-500">{t.home.ask_ai_footer}</p>
        </div>
      )}
    </section>
  );
}

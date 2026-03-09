"use client";

import { useState, useRef } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// ── 키워드 → 내부 콘텐츠 매핑 (MVP: 클라이언트 사이드) ──────
const KEYWORD_CONTENT: Record<
  string,
  { type: string; icon: string; title: string; href: string }[]
> = {
  claude: [
    { type: "Learning", icon: "📖", title: "Claude Code 마스터하기", href: "/learning?q=claude" },
    { type: "Labs", icon: "🧪", title: "Claude Code 컴포넌트 실습", href: "/labs?q=claude" },
  ],
  mcp: [
    { type: "Learning", icon: "📖", title: "MCP 심화 학습", href: "/learning?q=mcp" },
    { type: "Labs", icon: "🧪", title: "MCP 파일시스템 실습", href: "/labs?q=mcp" },
  ],
  프롬프트: [
    { type: "Learning", icon: "📖", title: "프롬프트 엔지니어링", href: "/learning?q=prompt" },
    { type: "Skills", icon: "🔧", title: "프롬프트 레시피", href: "/skills?q=prompt" },
  ],
  prompt: [
    { type: "Learning", icon: "📖", title: "Prompt Engineering", href: "/learning?q=prompt" },
    { type: "Skills", icon: "🔧", title: "Prompt Recipes", href: "/skills?q=prompt" },
  ],
  agent: [
    { type: "Learning", icon: "📖", title: "AI 에이전트 개발", href: "/learning?q=agent" },
    { type: "Labs", icon: "🧪", title: "챗봇 만들기 실습", href: "/labs?q=chatbot" },
  ],
  에이전트: [
    { type: "Learning", icon: "📖", title: "AI 에이전트 개발", href: "/learning?q=agent" },
    { type: "Labs", icon: "🧪", title: "챗봇 만들기 실습", href: "/labs?q=chatbot" },
  ],
  rag: [
    { type: "Learning", icon: "📖", title: "RAG 시스템 구축", href: "/learning?q=rag" },
    { type: "Labs", icon: "🧪", title: "데이터 시각화 실습", href: "/labs?q=data" },
  ],
  langchain: [
    { type: "Learning", icon: "📖", title: "RAG 시스템 학습", href: "/learning?q=rag" },
    { type: "Labs", icon: "🧪", title: "API 연동 실습", href: "/labs?q=api" },
  ],
  cursor: [
    { type: "Learning", icon: "📖", title: "Cursor AI 개발", href: "/learning?q=cursor" },
    { type: "Skills", icon: "🔧", title: "Cursor 실무 패턴", href: "/skills?q=cursor" },
  ],
  자동화: [
    { type: "Learning", icon: "📖", title: "AI 자동화 학습", href: "/learning?q=automation" },
    { type: "Labs", icon: "🧪", title: "AI 이메일 자동화 실습", href: "/labs?q=email" },
  ],
  automation: [
    { type: "Learning", icon: "📖", title: "AI Automation", href: "/learning?q=automation" },
    { type: "Labs", icon: "🧪", title: "Email Automation Lab", href: "/labs?q=email" },
  ],
  gemini: [
    { type: "Learning", icon: "📖", title: "AI 도구 개요", href: "/learning?q=gemini" },
    { type: "Labs", icon: "🧪", title: "Gemini 스트리밍 실습", href: "/labs?q=gemini" },
  ],
  openai: [
    { type: "Learning", icon: "📖", title: "ChatGPT 마스터", href: "/learning?q=chatgpt" },
    { type: "Skills", icon: "🔧", title: "OpenAI 프롬프트", href: "/skills?q=openai" },
  ],
  python: [
    { type: "Learning", icon: "📖", title: "Python AI 기초", href: "/learning?q=python" },
    { type: "Labs", icon: "🧪", title: "API 연동 실습", href: "/labs?q=api" },
  ],
  html: [
    { type: "Labs", icon: "🧪", title: "HTML 앱 만들기 실습", href: "/labs?q=html" },
  ],
};

function matchContent(question: string) {
  const q = question.toLowerCase();
  const results: { type: string; icon: string; title: string; href: string }[] = [];
  const seen = new Set<string>();

  for (const [keyword, items] of Object.entries(KEYWORD_CONTENT)) {
    if (q.includes(keyword.toLowerCase())) {
      for (const item of items) {
        const key = `${item.type}-${item.title}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push(item);
        }
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
  const [relatedContent, setRelatedContent] = useState<
    { type: string; icon: string; title: string; href: string }[]
  >([]);
  const answerRef = useRef<HTMLDivElement>(null);

  // 수준별 빠른 질문 6개
  const QUICK_QUESTIONS = [
    { level: "b", emoji: "🌱", text: t.home.quick_q_b1 },
    { level: "b", emoji: "🌱", text: t.home.quick_q_b2 },
    { level: "m", emoji: "💼", text: t.home.quick_q_m1 },
    { level: "m", emoji: "💼", text: t.home.quick_q_m2 },
    { level: "a", emoji: "🚀", text: t.home.quick_q_a1 },
    { level: "a", emoji: "🚀", text: t.home.quick_q_a2 },
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
      setTimeout(
        () => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        100
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

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
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
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
        <div ref={answerRef} className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700">
          <div className="flex items-center gap-2 mb-3 text-xs text-violet-400">
            <Sparkles size={12} />
            <span>{t.home.gemini_answer}</span>
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
                  <a
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
                  </a>
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

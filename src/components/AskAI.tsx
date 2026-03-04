"use client";

import { useState, useRef } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";

const QUICK_QUESTIONS = [
  "Claude Code를 처음 시작하는 방법은?",
  "MCP 서버란 무엇인가요?",
  "프롬프트 엔지니어링 팁 알려줘",
  "AI 에이전트 만드는 법",
];

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const answerRef = useRef<HTMLDivElement>(null);

  async function handleAsk(q?: string) {
    const text = (q ?? question).trim();
    if (!text || loading) return;

    setLoading(true);
    setAnswer("");
    setError("");
    if (q) setQuestion(q);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "오류 발생");
      setAnswer(data.answer);
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
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
        <h2 className="text-lg font-semibold text-white">AI에게 물어보기</h2>
        <span className="text-xs text-violet-400 bg-violet-900/40 px-2 py-0.5 rounded-full border border-violet-700/50">GPT-4o mini</span>
      </div>

      {/* 빠른 질문 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleAsk(q)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-violet-600 hover:text-violet-300 hover:bg-violet-900/20 transition-all disabled:opacity-50"
          >
            {q}
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
          placeholder="AI, Claude Code, MCP 등 무엇이든 물어보세요..."
          className="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          disabled={loading}
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !question.trim()}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          <span className="hidden sm:inline">{loading ? "생성 중" : "전송"}</span>
        </button>
      </div>

      {/* 오류 */}
      {error && (
        <p className="mt-3 text-sm text-rose-400 bg-rose-900/20 border border-rose-800/50 rounded-lg px-4 py-2">{error}</p>
      )}

      {/* 답변 */}
      {answer && (
        <div ref={answerRef} className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700">
          <div className="flex items-center gap-2 mb-3 text-xs text-violet-400">
            <Sparkles size={12} />
            <span>Gemini 답변</span>
          </div>
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{answer}</div>
        </div>
      )}
    </section>
  );
}

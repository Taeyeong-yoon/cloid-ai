"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Sparkles,
  Play,
  Loader2,
  Check,
  ChevronRight,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import type { PracticePrompt } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface PracticeChatProps {
  contentId: string;
  practices: PracticePrompt[];
}

export default function PracticeChat({ contentId, practices }: PracticeChatProps) {
  const { t } = useTranslation();
  const [activePractice, setActivePractice] = useState(0);
  const [prompt, setPrompt] = useState(practices[0]?.prompt ?? "");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  // 완료 상태 복원
  useEffect(() => {
    try {
      const key = `cloid-practice:${contentId}`;
      const saved: number[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      setCompleted(new Set(saved));
    } catch { /* ignore */ }
  }, [contentId]);

  function handleTabChange(index: number) {
    setActivePractice(index);
    setPrompt(practices[index].prompt);
    setResponse("");
    setError("");
  }

  async function handleRun() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResponse("");
    setError("");
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResponse(data.answer);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const handleReset = useCallback(() => {
    setPrompt(practices[activePractice].prompt);
    setResponse("");
    setError("");
  }, [activePractice, practices]);

  function handleMarkComplete() {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(activePractice);
      try {
        const key = `cloid-practice:${contentId}`;
        const saved = Array.from(next);
        localStorage.setItem(key, JSON.stringify(saved));
      } catch { /* ignore */ }
      return next;
    });
  }

  const current = practices[activePractice];
  if (!current) return null;

  const isEdited = prompt !== current.prompt;
  const isDone = completed.has(activePractice);

  return (
    <div className="mt-6 rounded-xl border border-violet-800/40 bg-violet-950/10 overflow-hidden">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-violet-800/30 bg-violet-950/20">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-violet-400 shrink-0" />
          <span className="text-sm font-semibold text-white">{t.practice.title}</span>
          <span className="ml-auto text-xs text-slate-500">{t.practice.edit_hint}</span>
        </div>
      </div>

      {/* 실습 탭 */}
      {practices.length > 1 && (
        <div className="flex gap-1 px-4 pt-3 pb-0 flex-wrap">
          {practices.map((p, i) => (
            <button
              key={i}
              onClick={() => handleTabChange(i)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                activePractice === i
                  ? "bg-violet-800/50 border-violet-600 text-white"
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              {completed.has(i) && <Check size={10} className="text-emerald-400 shrink-0" />}
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* 안내 텍스트 */}
        <div className="flex items-start gap-2 text-xs text-slate-400">
          <ChevronRight size={13} className="text-violet-400 shrink-0 mt-0.5" />
          <span>{current.instruction}</span>
        </div>

        {/* 프롬프트 편집 영역 */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="w-full bg-slate-950 border border-slate-700 focus:border-violet-500 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-200 resize-none outline-none transition-colors leading-relaxed placeholder:text-slate-600"
            placeholder={t.practice.error_empty}
            spellCheck={false}
          />
          {isEdited && (
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 p-1.5 rounded text-slate-600 hover:text-slate-300 hover:bg-slate-700 transition-colors"
              title={t.practice.reset}
            >
              <RotateCcw size={12} />
            </button>
          )}
        </div>

        {/* 실행 버튼 */}
        <button
          onClick={handleRun}
          disabled={loading || !prompt.trim()}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            loading || !prompt.trim()
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          {loading ? (
            <><Loader2 size={14} className="animate-spin" /> {t.practice.running}</>
          ) : (
            <><Play size={14} fill="currentColor" /> {t.practice.run}</>
          )}
        </button>

        {/* 에러 */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 text-xs text-rose-400">
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* AI 응답 */}
        {response && (
          <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-2">
              {t.practice.response}
            </p>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{response}</p>

            {/* followUp */}
            {current.followUp && (
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-start gap-2">
                <Sparkles size={12} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {t.practice.follow_up}
                  </p>
                  <p className="text-xs text-slate-300">{current.followUp}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 완료 버튼 */}
        {(response || isDone) && (
          <button
            onClick={handleMarkComplete}
            disabled={isDone}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
              isDone
                ? "bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 cursor-default"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            }`}
          >
            <Check size={12} />
            {isDone ? t.practice.completed : t.practice.mark_complete}
          </button>
        )}
      </div>
    </div>
  );
}

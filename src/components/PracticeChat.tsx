"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import type { PracticePrompt } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const LLM_LINKS = [
  { label: "ChatGPT", url: "https://chat.openai.com/", color: "text-emerald-400 border-emerald-800/50 hover:border-emerald-600 hover:bg-emerald-950/30" },
  { label: "Gemini", url: "https://gemini.google.com/", color: "text-blue-400 border-blue-800/50 hover:border-blue-600 hover:bg-blue-950/30" },
  { label: "Claude", url: "https://claude.ai/", color: "text-amber-400 border-amber-800/50 hover:border-amber-600 hover:bg-amber-950/30" },
];

interface PracticeChatProps {
  contentId: string;
  practices: PracticePrompt[];
}

export default function PracticeChat({ contentId, practices }: PracticeChatProps) {
  const { t } = useTranslation();
  const [activePractice, setActivePractice] = useState(0);
  const [prompt, setPrompt] = useState(practices[0]?.prompt ?? "");
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

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
    setCopied(false);
  }

  async function handleCopy() {
    if (!prompt.trim()) return;
    try {
      await navigator.clipboard.writeText(prompt.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select textarea
    }
  }

  const handleReset = useCallback(() => {
    setPrompt(practices[activePractice].prompt);
    setCopied(false);
  }, [activePractice, practices]);

  function handleMarkComplete() {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(activePractice);
      try {
        const key = `cloid-practice:${contentId}`;
        localStorage.setItem(key, JSON.stringify(Array.from(next)));
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

        {/* 복사 버튼 */}
        <button
          onClick={handleCopy}
          disabled={!prompt.trim()}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            copied
              ? "bg-emerald-800/40 border border-emerald-700 text-emerald-300"
              : !prompt.trim()
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          }`}
        >
          {copied ? (
            <><Check size={14} /> {t.common.copied}</>
          ) : (
            <><Copy size={14} /> {t.practice.copy_prompt}</>
          )}
        </button>

        {/* LLM 바로가기 */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-500">{t.practice.copy_hint}</p>
          <div className="flex gap-2 flex-wrap">
            {LLM_LINKS.map((llm) => (
              <a
                key={llm.label}
                href={llm.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all bg-slate-900/50 ${llm.color}`}
              >
                <ExternalLink size={11} />
                {llm.label}
              </a>
            ))}
          </div>
        </div>

        {/* followUp — 복사 후 표시 */}
        {copied && current.followUp && (
          <div className="rounded-lg border border-amber-800/40 bg-amber-950/20 p-3 flex items-start gap-2 animate-fade-in-up">
            <Sparkles size={12} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                {t.practice.follow_up}
              </p>
              <p className="text-xs text-slate-300">{current.followUp}</p>
            </div>
          </div>
        )}

        {/* 완료 버튼 */}
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
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import {
  Check,
  ClipboardPaste,
  Copy,
  ExternalLink,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import type { EvaluationConfig } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const LLM_LINKS = [
  { label: "ChatGPT", url: "https://chat.openai.com/", color: "text-emerald-400 border-emerald-800/50 hover:border-emerald-600 hover:bg-emerald-950/30" },
  { label: "Gemini", url: "https://gemini.google.com/", color: "text-blue-400 border-blue-800/50 hover:border-blue-600 hover:bg-blue-950/30" },
  { label: "Claude", url: "https://claude.ai/", color: "text-amber-400 border-amber-800/50 hover:border-amber-600 hover:bg-amber-950/30" },
];

export default function ResultEvaluator({
  evaluation,
}: {
  contentId: string;
  evaluation: EvaluationConfig;
}) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const allDone = checked.size === evaluation.successCriteria.length;

  function toggleCriterion(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  const buildEvalPrompt = useCallback(() => {
    const lines = [
      evaluation.context,
      "",
      `${t.evaluator.criteria}:`,
      ...evaluation.successCriteria.map((c) => `• ${c}`),
      "",
      ...(evaluation.commonMistakes?.length
        ? [`Common mistakes to avoid:`, ...evaluation.commonMistakes.map((m) => `• ${m}`), ""]
        : []),
      "My result: (paste your result below)",
    ];
    return lines.join("\n");
  }, [evaluation, t.evaluator.criteria]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildEvalPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  function handleReset() {
    setChecked(new Set());
    setCopied(false);
  }

  return (
    <div className="mt-5 rounded-xl border border-indigo-800/40 bg-gradient-to-br from-indigo-950/20 to-slate-900/50 p-5">
      {/* 헤더 */}
      <div className="mb-4 flex items-center gap-2">
        <ClipboardPaste size={18} className="text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">{t.evaluator.title}</h3>
        <span className="ml-auto rounded-full border border-indigo-700/50 bg-indigo-900/40 px-2 py-0.5 text-[10px] text-indigo-300">
          {t.evaluator.self_check}
        </span>
      </div>

      {/* 설명 */}
      <p className="mb-4 text-xs leading-relaxed text-slate-400">{evaluation.prompt}</p>

      {/* 성공 기준 체크박스 */}
      <div className="mb-4 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {t.evaluator.criteria}
        </p>
        {evaluation.successCriteria.map((criterion, index) => (
          <button
            key={`${criterion}-${index}`}
            onClick={() => toggleCriterion(index)}
            className={`w-full flex items-start gap-3 rounded-lg border px-3 py-2.5 text-xs text-left transition-all ${
              checked.has(index)
                ? "border-emerald-700/60 bg-emerald-950/20 text-emerald-300"
                : "border-slate-700 bg-slate-800/30 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50"
            }`}
          >
            <span className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${
              checked.has(index)
                ? "border-emerald-500 bg-emerald-600"
                : "border-slate-600"
            }`}>
              {checked.has(index) && <Check size={10} className="text-white" />}
            </span>
            <span className="leading-relaxed">{criterion}</span>
          </button>
        ))}
      </div>

      {/* 완료 메시지 */}
      {allDone && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-700/50 bg-emerald-950/20 px-3 py-2.5">
          <Sparkles size={14} className="text-emerald-400 shrink-0" />
          <p className="text-xs font-medium text-emerald-300">{t.evaluator.all_done}</p>
        </div>
      )}

      {/* AI 평가 프롬프트 복사 */}
      <div className="border-t border-slate-700/50 pt-4 space-y-3">
        <p className="text-[10px] text-slate-500">{t.evaluator.copy_hint}</p>

        <button
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            copied
              ? "bg-emerald-800/40 border border-emerald-700 text-emerald-300"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          {copied ? (
            <><Check size={14} /> {t.common.copied}</>
          ) : (
            <><Copy size={14} /> {t.evaluator.copy_prompt}</>
          )}
        </button>

        {/* LLM 바로가기 */}
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

          {checked.size > 0 && (
            <button
              onClick={handleReset}
              className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <RotateCcw size={11} />
              {t.evaluator.try_again}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

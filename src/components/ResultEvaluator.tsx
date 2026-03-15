"use client";

import { useCallback, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ClipboardPaste,
  Loader2,
  RotateCcw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { EvaluationConfig } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface ParsedFeedback {
  score: "pass" | "partial" | "fail";
  summary: string;
  details?: string[];
  nextStep?: string;
}

function safeParseFeedback(raw: string): ParsedFeedback | null {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw) as ParsedFeedback;
    if (!parsed || !parsed.score || !parsed.summary) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function ResultEvaluator({
  contentId,
  evaluation,
}: {
  contentId: string;
  evaluation: EvaluationConfig;
}) {
  const { t } = useTranslation();
  const [userResult, setUserResult] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [score, setScore] = useState<"pass" | "partial" | "fail" | null>(null);

  const parsedFeedback = useMemo(() => safeParseFeedback(feedback), [feedback]);

  const handleEvaluate = useCallback(async () => {
    if (!userResult.trim() || loading) return;

    setLoading(true);
    setFeedback("");
    setError("");
    setScore(null);

    try {
      const context = [
        `Content ID: ${contentId}`,
        `Lesson context: ${evaluation.context}`,
        `Success criteria: ${evaluation.successCriteria.join(" | ")}`,
        `Common mistakes: ${evaluation.commonMistakes.join(" | ")}`,
        "Learner result:",
        userResult.trim().slice(0, 1200),
      ].join("\n");

      const question =
        "Evaluate the learner result and return strict JSON with score, summary, details, nextStep.";

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          context,
          mode: "tutor",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.common.error_occurred);

      const answer = typeof data.answer === "string" ? data.answer : "";
      const parsed = safeParseFeedback(answer);

      if (parsed) {
        setScore(parsed.score);
        setFeedback(JSON.stringify(parsed));
      } else {
        setScore("partial");
        setFeedback(answer);
      }
    } catch (e) {
      setError((e as Error).message || t.common.error_occurred);
    } finally {
      setLoading(false);
    }
  }, [contentId, evaluation, loading, t.common.error_occurred, userResult]);

  const reset = useCallback(() => {
    setUserResult("");
    setFeedback("");
    setError("");
    setScore(null);
  }, []);

  const scoreLabel =
    score === "pass"
      ? t.evaluator.pass
      : score === "partial"
        ? t.evaluator.partial
        : score === "fail"
          ? t.evaluator.fail
          : null;

  return (
    <div className="mt-5 rounded-xl border border-indigo-800/40 bg-gradient-to-br from-indigo-950/20 to-slate-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <ClipboardPaste size={18} className="text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">{t.evaluator.title}</h3>
        <span className="rounded-full border border-indigo-700/50 bg-indigo-900/40 px-2 py-0.5 text-[10px] text-indigo-300">
          AI Review
        </span>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-slate-400">{evaluation.prompt}</p>

      <textarea
        value={userResult}
        onChange={(e) => setUserResult(e.target.value)}
        placeholder={t.evaluator.placeholder}
        className="h-32 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs font-mono text-slate-200 placeholder-slate-700 transition-colors focus:border-indigo-500 focus:outline-none"
        spellCheck={false}
      />

      <div className="mb-3 mt-3">
        <p className="mb-1.5 text-[10px] text-slate-500">{t.evaluator.criteria}:</p>
        <div className="flex flex-wrap gap-1.5">
          {evaluation.successCriteria.map((criterion, index) => (
            <span
              key={`${criterion}-${index}`}
              className="rounded-full border border-slate-700 bg-slate-800/50 px-2 py-0.5 text-[10px] text-slate-400"
            >
              {criterion}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleEvaluate}
          disabled={!userResult.trim() || loading}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {t.evaluator.evaluating}
            </>
          ) : (
            <>
              <Sparkles size={14} />
              {t.evaluator.evaluate}
            </>
          )}
        </button>
        {feedback && (
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 text-xs text-slate-400 transition-colors hover:text-slate-200"
          >
            <RotateCcw size={12} />
            {t.evaluator.try_again}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-rose-800/50 bg-rose-950/20 px-3 py-2 text-xs text-rose-400">
          {error}
        </p>
      )}

      {feedback && (
        <div className="mt-4 border-t border-slate-700/50 pt-4">
          {parsedFeedback ? (
            <div className="space-y-3 animate-fade-in-up">
              <div
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 ${
                  parsedFeedback.score === "pass"
                    ? "border-emerald-800/50 bg-emerald-950/30 text-emerald-400"
                    : parsedFeedback.score === "partial"
                      ? "border-amber-800/50 bg-amber-950/30 text-amber-400"
                      : "border-red-800/50 bg-red-950/30 text-red-400"
                }`}
              >
                {parsedFeedback.score === "pass" ? (
                  <ThumbsUp size={16} />
                ) : parsedFeedback.score === "partial" ? (
                  <AlertTriangle size={16} />
                ) : (
                  <ThumbsDown size={16} />
                )}
                <div className="min-w-0">
                  {scoreLabel && <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">{scoreLabel}</p>}
                  <span className="text-sm font-medium">{parsedFeedback.summary}</span>
                </div>
              </div>

              {parsedFeedback.details && parsedFeedback.details.length > 0 && (
                <div className="space-y-1.5">
                  {parsedFeedback.details.map((detail, index) => (
                    <div key={`${detail}-${index}`} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check size={12} className="mt-0.5 shrink-0 text-slate-500" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}

              {parsedFeedback.nextStep && (
                <div className="flex items-start gap-2 rounded-lg border border-violet-800/40 bg-violet-950/30 p-3">
                  <Sparkles size={14} className="mt-0.5 shrink-0 text-violet-400" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-violet-400">{t.evaluator.next_step}</span>
                    <p className="mt-0.5 text-xs text-slate-300">{parsedFeedback.nextStep}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{feedback}</div>
          )}
        </div>
      )}
    </div>
  );
}

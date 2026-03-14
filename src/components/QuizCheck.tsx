"use client";

import { useEffect, useMemo, useState } from "react";
import { HelpCircle, Trophy, Target, Check, X, RotateCcw } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface QuizCheckProps {
  contentId: string;
  quiz: QuizQuestion[];
}

export default function QuizCheck({ contentId, quiz }: QuizCheckProps) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cloid-quiz:${contentId}`);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { score?: number };
      setPreviousScore(parsed.score ?? null);
    } catch {
      // ignore localStorage parse errors
    }
  }, [contentId]);

  const score = useMemo(
    () => quiz.filter((question, index) => answers[index] === question.answer).length,
    [answers, quiz]
  );
  const allAnswered = Object.keys(answers).length >= quiz.length;

  function handleSelect(questionIndex: number, optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    try {
      localStorage.setItem(
        `cloid-quiz:${contentId}`,
        JSON.stringify({ score, total: quiz.length, date: new Date().toISOString() })
      );
      setPreviousScore(score);
    } catch {
      // ignore localStorage write errors
    }
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="mt-6 rounded-xl border border-blue-800/40 bg-gradient-to-br from-blue-950/20 to-slate-900/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <HelpCircle size={18} className="text-blue-400" />
        <h3 className="text-sm font-semibold text-white">{t.quiz.title}</h3>
        <span className="rounded-full border border-blue-700/50 bg-blue-900/40 px-2 py-0.5 text-xs text-blue-400">
          {quiz.length} {t.quiz.questions}
        </span>
        {previousScore !== null && !submitted && (
          <span className="ml-auto text-xs text-slate-500">
            {t.quiz.previous_score}: {previousScore}/{quiz.length}
          </span>
        )}
      </div>

      <div className="space-y-5">
        {quiz.map((question, questionIndex) => (
          <div key={`${contentId}-${questionIndex}`} className="space-y-2">
            <p className="text-sm font-medium text-white">
              <span className="mr-1.5 text-blue-400">Q{questionIndex + 1}.</span>
              {question.question}
            </p>

            <div className="grid grid-cols-1 gap-1.5">
              {question.options.map((option, optionIndex) => {
                const isSelected = answers[questionIndex] === optionIndex;
                const isCorrect = question.answer === optionIndex;
                const showCorrect = submitted && isCorrect;
                const showWrong = submitted && isSelected && !isCorrect;

                return (
                  <button
                    key={`${contentId}-${questionIndex}-${optionIndex}`}
                    type="button"
                    onClick={() => handleSelect(questionIndex, optionIndex)}
                    disabled={submitted}
                    className={`rounded-lg border px-3 py-2.5 text-left text-xs transition-all disabled:cursor-default ${
                      showCorrect
                        ? "border-emerald-600 bg-emerald-950/40 text-emerald-300"
                        : showWrong
                          ? "border-red-600 bg-red-950/40 text-red-300"
                          : isSelected
                            ? "border-violet-600 bg-violet-950/30 text-violet-300"
                            : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                    }`}
                  >
                    <span className="mr-2 font-mono text-[10px] opacity-60">{String.fromCharCode(65 + optionIndex)}.</span>
                    {option}
                    {showCorrect && <Check size={12} className="ml-2 inline text-emerald-400" />}
                    {showWrong && <X size={12} className="ml-2 inline text-red-400" />}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className="animate-fade-in-up rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-xs leading-relaxed text-slate-400">
                <span className="font-bold text-blue-400">{t.quiz.explanation}:</span>{" "}
                {question.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500"
        >
          {t.quiz.submit}
        </button>
      ) : (
        <div className="mt-5 animate-fade-in-up rounded-lg border border-slate-700 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {score === quiz.length ? (
                <>
                  <Trophy size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">{t.quiz.perfect}</span>
                </>
              ) : (
                <>
                  <Target size={16} className="text-blue-400" />
                  <span className="text-sm font-bold text-white">
                    {score}/{quiz.length} {t.quiz.correct}
                  </span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center gap-1 text-xs text-violet-400 transition-colors hover:text-violet-300"
            >
              <RotateCcw size={12} /> {t.quiz.retry}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

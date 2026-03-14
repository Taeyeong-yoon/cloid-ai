"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Code2,
  Play,
  Loader2,
  Check,
  X,
  Trophy,
  Lightbulb,
  Eye,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import type { CodeChallengeData } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

interface CodeChallengeProps {
  contentId: string;
  challenge: CodeChallengeData;
}

export default function CodeChallenge({ contentId, challenge }: CodeChallengeProps) {
  const { t } = useTranslation();
  const [code, setCode] = useState(challenge.starterCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [allPassed, setAllPassed] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [completedBefore, setCompletedBefore] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cloid-challenge:${contentId}`);
      setCompletedBefore(Boolean(saved));
    } catch {
      setCompletedBefore(false);
    }
  }, [contentId]);

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setPyodideLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = PYODIDE_CDN;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Pyodide"));
          document.head.appendChild(script);
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pyodide = await (window as any).loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });
      pyodideRef.current = pyodide;
      return pyodide;
    } finally {
      setPyodideLoading(false);
    }
  }, []);

  const handleRunTests = useCallback(async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setResults([]);
    setAllPassed(false);

    try {
      const pyodide = await loadPyodide();
      const testResults: TestResult[] = [];

      for (const testCase of challenge.testCases) {
        try {
          pyodide.runPython(code);

          const resultPromise = new Promise<string>((resolve, reject) => {
            try {
              const result = pyodide.runPython(`str(${testCase.input})`);
              resolve(String(result));
            } catch (error) {
              reject(error);
            }
          });
          const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error(t.challenge.timeout)), 5000)
          );

          const actual = await Promise.race([resultPromise, timeoutPromise]);
          testResults.push({
            input: testCase.input,
            expected: testCase.expected,
            actual,
            passed: actual.trim() === testCase.expected.trim(),
          });
        } catch (error) {
          testResults.push({
            input: testCase.input,
            expected: testCase.expected,
            actual: "",
            passed: false,
            error: (error as Error).message?.slice(0, 150),
          });
        }
      }

      setResults(testResults);
      const passed = testResults.every((result) => result.passed);
      setAllPassed(passed);

      if (passed) {
        try {
          localStorage.setItem(
            `cloid-challenge:${contentId}`,
            JSON.stringify({ completed: true, date: new Date().toISOString() })
          );
          setCompletedBefore(true);
        } catch {
          // ignore localStorage write errors
        }
      }
    } catch (error) {
      setResults([
        {
          input: "load",
          expected: "",
          actual: "",
          passed: false,
          error: (error as Error).message || "Failed to run",
        },
      ]);
    } finally {
      setRunning(false);
    }
  }, [challenge.testCases, code, contentId, loadPyodide, running, t.challenge.timeout]);

  function handleShowHint() {
    if (hintsShown < challenge.hints.length) {
      setHintsShown((prev) => prev + 1);
    }
  }

  function handleShowSolution() {
    setShowSolution(true);
    setCode(challenge.starterCode.replace("___", challenge.solution));
  }

  function handleReset() {
    setCode(challenge.starterCode);
    setResults([]);
    setAllPassed(false);
    setShowSolution(false);
    setHintsShown(0);
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-amber-800/40 bg-gradient-to-br from-amber-950/20 to-slate-900/50">
      <div className="border-b border-amber-800/30 bg-amber-950/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-white">{t.challenge.title}</h3>
          <span className="rounded-full border border-amber-700/50 bg-amber-900/40 px-2 py-0.5 text-[10px] text-amber-400">
            Python
          </span>
          {completedBefore && (
            <span className="ml-auto text-xs text-emerald-400">{t.challenge.completed}</span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <h4 className="mb-1 text-sm font-medium text-white">{challenge.title}</h4>
          <p className="text-xs leading-relaxed text-slate-400">{challenge.description}</p>
        </div>

        {challenge.hints.length > 0 && (
          <div className="space-y-1.5">
            {challenge.hints.slice(0, hintsShown).map((hint, index) => (
              <div
                key={`${contentId}-hint-${index}`}
                className="animate-fade-in-up rounded-lg border border-amber-800/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-300"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb size={12} className="mt-0.5 shrink-0" />
                  <span>{t.challenge.hint} {index + 1}: {hint}</span>
                </div>
              </div>
            ))}
            {hintsShown < challenge.hints.length && (
              <button
                type="button"
                onClick={handleShowHint}
                className="flex items-center gap-1 text-xs text-amber-500 transition-colors hover:text-amber-300"
              >
                <Lightbulb size={12} />
                {t.challenge.show_hint} ({hintsShown}/{challenge.hints.length})
              </button>
            )}
          </div>
        )}

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t.labs.code_editor}</span>
            <div className="flex items-center gap-2">
              {!showSolution && (
                <button
                  type="button"
                  onClick={handleShowSolution}
                  className="flex items-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-amber-400"
                >
                  <Eye size={11} /> {t.challenge.show_solution}
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-slate-200"
              >
                <RotateCcw size={11} /> {t.challenge.reset}
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-40 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 font-mono text-xs leading-5 text-teal-300 transition-colors focus:border-amber-500 focus:outline-none"
            spellCheck={false}
          />
        </div>

        <button
          type="button"
          onClick={handleRunTests}
          disabled={!code.trim() || running}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500"
        >
          {running || pyodideLoading ? (
            <><Loader2 size={14} className="animate-spin" /> {t.challenge.run_tests_loading}</>
          ) : (
            <><Play size={14} /> {t.challenge.run_tests}</>
          )}
        </button>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={`${contentId}-result-${index}`}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  result.passed
                    ? "border-emerald-800/50 bg-emerald-950/20 text-emerald-300"
                    : "border-red-800/50 bg-red-950/20 text-red-300"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  {result.passed ? <Check size={12} /> : <X size={12} />}
                  <span className="font-semibold">
                    {t.challenge.test_case} {index + 1}
                  </span>
                  <ChevronRight size={12} />
                  <code className="break-all opacity-90">{result.input}</code>
                </div>
                {result.error ? (
                  <p className="break-all">{result.error}</p>
                ) : (
                  <div className="space-y-1 text-slate-300">
                    <p>{t.challenge.expected}: <code>{result.expected}</code></p>
                    <p>{t.challenge.actual}: <code>{result.actual}</code></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2">
              {allPassed ? (
                <>
                  <Trophy size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">{t.challenge.all_passed}</span>
                </>
              ) : (
                <>
                  <X size={16} className="text-red-400" />
                  <span className="text-sm font-bold text-white">{t.challenge.keep_trying}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

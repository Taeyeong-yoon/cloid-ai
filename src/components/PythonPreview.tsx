"use client";

import { useState, useRef, useCallback } from "react";
import {
  Terminal, Play, Loader2, Copy, Check, X,
  Maximize2, Minimize2, AlertTriangle, Download,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

const EXAMPLES = [
  { label: "Hello World", code: 'print("Hello, CLOID!")' },
  { label: "List Comprehension", code: "squares = [x**2 for x in range(10)]\nprint(squares)" },
  {
    label: "Fibonacci",
    code: "def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n\nfor i in range(10):\n    print(f\"fib({i}) = {fib(i)}\")",
  },
  {
    label: "Dictionary",
    code: 'data = {"name": "CLOID", "type": "AI Portal", "year": 2026}\nfor key, val in data.items():\n    print(f"{key}: {val}")',
  },
];

export default function PythonPreview() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const surfaceHeightClass = fullscreen ? "flex-1 min-h-0" : "h-52 sm:h-56";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodideRef = useRef<any>(null);

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
      setPyodideReady(true);
      return pyodide;
    } finally {
      setPyodideLoading(false);
    }
  }, []);

  const handleRun = useCallback(async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput("");
    setError("");
    try {
      const pyodide = await loadPyodide();
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(t.labs.timeout_error)), 5000)
      );

      await Promise.race([
        pyodide.runPythonAsync(code),
        timeoutPromise,
      ]);

      const stdout: string = pyodide.runPython("sys.stdout.getvalue()");
      const stderr: string = pyodide.runPython("sys.stderr.getvalue()");

      if (stderr) setError(stderr);
      setOutput(stdout || t.labs.no_output);
    } catch (e) {
      setError((e as Error).message || "Execution error");
    } finally {
      setRunning(false);
    }
  }, [code, loadPyodide, running, t.labs.no_output, t.labs.timeout_error]);

  const handleCopy = useCallback(async () => {
    if (!code.trim()) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  const handleDownload = useCallback(() => {
    if (!output && !error) return;
    const content = error ? `# Error\n${error}` : output;
    const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cloid-python-output-${Date.now()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [error, output]);

  const handleClear = useCallback(() => {
    setCode("");
    setOutput("");
    setError("");
  }, []);

  return (
    <>
      {fullscreen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setFullscreen(false)} />
      )}

      <div
        className={`rounded-xl border border-teal-800/40 overflow-hidden transition-all ${
          fullscreen
            ? "fixed inset-4 z-50 shadow-2xl border-teal-600/60 bg-[#0f1117] flex flex-col"
            : "bg-gradient-to-br from-teal-950/20 to-slate-900/60"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-teal-800/30 bg-teal-950/20">
          <div className="flex items-center gap-2 flex-wrap">
            <Terminal size={16} className="text-teal-400 shrink-0" />
            <h2 className="text-sm font-semibold text-white">{t.labs.python_title}</h2>
            <span className="text-[10px] text-teal-400 bg-teal-900/40 px-2 py-0.5 rounded-full border border-teal-700/50">
              {t.labs.python_badge}
            </span>
            {pyodideLoading && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" />
                {t.labs.loading_runtime}
              </span>
            )}
            {pyodideReady && (
              <span className="text-[10px] text-teal-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                {t.labs.runtime_ready}
              </span>
            )}
          </div>
          <button
            onClick={() => setFullscreen((v) => !v)}
            title={fullscreen ? t.labs.minimize : t.labs.fullscreen}
            aria-label={fullscreen ? t.labs.minimize : t.labs.fullscreen}
            className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 transition-colors shrink-0"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        <div className={`p-4 ${fullscreen ? "flex-1 flex flex-col min-h-0 overflow-hidden" : ""}`}>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {EXAMPLES.map((example) => (
              <button
                key={example.label}
                onClick={() => setCode(example.code)}
                disabled={running}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-teal-600 hover:text-teal-300 hover:bg-teal-900/20 transition-all disabled:opacity-50"
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className={`grid gap-3 ${fullscreen ? "grid-cols-2 flex-1 min-h-0" : "grid-cols-1 lg:grid-cols-2"}`}>
            <div className={`flex flex-col gap-2 rounded-xl border border-slate-800/70 bg-slate-950/30 p-3 ${fullscreen ? "min-h-0" : ""}`}>
              <div className="flex min-h-9 items-center justify-between">
                <span className="text-xs text-teal-400 font-medium">{t.labs.code_editor}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    disabled={!code.trim()}
                    aria-label={copied ? t.common.copied : t.common.copy}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-40 transition-colors"
                  >
                    {copied ? <><Check size={11} className="text-emerald-400" /> {t.common.copied}</> : <><Copy size={11} /> {t.common.copy}</>}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!code.trim()}
                    aria-label={t.labs.clear_all}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 disabled:opacity-40 transition-colors"
                  >
                    <X size={11} /> {t.labs.clear_all}
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={'# Python code here\nprint("Hello, CLOID!")\n\nfor i in range(5):\n    print(f"Step {i+1}")'}
                aria-label={t.labs.code_editor}
                className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs font-mono leading-5 text-teal-300 placeholder-slate-700 focus:outline-none focus:border-teal-500 transition-colors resize-none ${surfaceHeightClass}`}
                spellCheck={false}
              />

              <button
                onClick={handleRun}
                disabled={!code.trim() || running}
                data-event="cta_python_run"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {running ? <><Loader2 size={13} className="animate-spin" /> {t.labs.running}</> : <><Play size={13} /> {t.labs.run_python}</>}
              </button>

              <div className="min-h-4" />
            </div>

            <div className={`flex flex-col gap-2 rounded-xl border border-slate-800/70 bg-slate-950/30 p-3 ${fullscreen ? "min-h-0" : ""}`}>
              <div className="flex min-h-9 items-center justify-between">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Terminal size={11} /> {t.labs.output}
                </span>
                {(output || error) && (
                  <button
                    onClick={handleDownload}
                    aria-label={t.labs.download}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-teal-500 hover:text-teal-300 hover:bg-teal-900/20 transition-colors"
                  >
                    <Download size={11} /> {t.labs.download}
                  </button>
                )}
              </div>

              <div
                className={`w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-xs font-mono leading-5 overflow-auto whitespace-pre-wrap ${
                  error
                    ? "border-red-800/50"
                    : output
                      ? "border-slate-600"
                      : "border-dashed border-slate-700"
                } ${surfaceHeightClass}`}
              >
                {error ? (
                  <div className="flex items-start gap-2 text-red-400">
                    <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                    <span className="break-all">{error}</span>
                  </div>
                ) : output ? (
                  <span className="text-slate-200">{output}</span>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
                    <Terminal size={24} className="text-slate-700" />
                    <p className="text-center">{t.labs.click_run}</p>
                  </div>
                )}
              </div>

              <div className="min-h-[40px]" />
              <div className="min-h-4" />
            </div>
          </div>

          <p className={`text-[10px] text-slate-600 ${fullscreen ? "mt-1" : "mt-2"}`}>
            {t.labs.python_footer}
          </p>
        </div>
      </div>
    </>
  );
}

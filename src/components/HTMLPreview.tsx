"use client";

import { useState, useCallback } from "react";
import { Code2, Eye, Download, X, Copy, Check, Maximize2, Minimize2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

type TabType = "html" | "css" | "js";

export default function HTMLPreview() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("html");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const currentCode = activeTab === "html" ? html : activeTab === "css" ? css : js;
  const setCurrentCode = activeTab === "html" ? setHtml : activeTab === "css" ? setCss : setJs;
  const inputAriaLabel =
    activeTab === "html"
      ? t.labs.html_input_aria
      : activeTab === "css"
        ? t.labs.css_input_aria
        : t.labs.js_input_aria;

  const buildDocument = useCallback(() => {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;
  }, [html, css, js]);

  const handlePreview = useCallback(() => {
    if (!html.trim() && !css.trim() && !js.trim()) return;
    setPreview(buildDocument());
  }, [buildDocument, html, css, js]);

  const handleDownload = useCallback(() => {
    const src = preview || buildDocument();
    if (!src.trim()) return;
    const blob = new Blob([src], { type: "text/html; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cloid-preview-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [preview, buildDocument]);

  const handleCopy = useCallback(async () => {
    if (!currentCode.trim()) return;
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [currentCode]);

  const handleClear = useCallback(() => {
    setHtml("");
    setCss("");
    setJs("");
    setPreview("");
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    if (activeTab === "html" && (text.trim().startsWith("<") || text.trim().toLowerCase().includes("<!doctype"))) {
      setTimeout(() => setPreview(buildDocument()), 100);
    }
  }, [activeTab, buildDocument]);

  const tabs: { key: TabType; label: string; placeholder: string }[] = [
    { key: "html", label: "HTML", placeholder: '<div class="container">\n  <h1>Hello World</h1>\n  <p>Write your HTML here</p>\n  <button id="btn">Click me</button>\n</div>' },
    { key: "css", label: "CSS", placeholder: '.container {\n  max-width: 600px;\n  margin: 0 auto;\n  padding: 20px;\n  font-family: sans-serif;\n}\n\nh1 { color: #8b5cf6; }' },
    { key: "js", label: "JS", placeholder: 'document.getElementById("btn")\n  .addEventListener("click", () => {\n    alert("Hello from CLOID!");\n  });' },
  ];

  return (
    <>
      {fullscreen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setFullscreen(false)} />
      )}
      <div className={`rounded-xl border border-amber-800/40 overflow-hidden transition-all ${
        fullscreen
          ? "fixed inset-4 z-50 shadow-2xl border-amber-600/60 bg-[#0f1117]"
          : "bg-gradient-to-br from-amber-950/20 to-slate-900/60"
      }`}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-amber-800/30 bg-amber-950/20">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-white">{t.labs.code_preview_title}</h2>
            <span className="text-[10px] text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-700/50">
              HTML+CSS+JS
            </span>
          </div>
          <button
            onClick={() => setFullscreen((value) => !value)}
            title={fullscreen ? t.labs.minimize : t.labs.fullscreen}
            aria-label={fullscreen ? t.labs.minimize : t.labs.fullscreen}
            className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        <div className="p-4">
          <div className={`grid gap-3 ${fullscreen ? "grid-cols-2" : "grid-cols-1 lg:grid-cols-2"}`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      aria-pressed={activeTab === tab.key}
                      className={`px-3 py-1.5 sm:py-1 rounded-md text-xs font-medium transition-colors ${
                        activeTab === tab.key
                          ? "bg-amber-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    disabled={!currentCode.trim()}
                    aria-label={copied ? t.common.copied : t.common.copy}
                    className="flex items-center gap-1 text-[11px] px-2 py-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:py-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-40 transition-colors"
                  >
                    {copied ? <><Check size={11} className="text-emerald-400" /> {t.common.copied}</> : <><Copy size={11} /> {t.common.copy}</>}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!html.trim() && !css.trim() && !js.trim()}
                    aria-label={t.labs.clear_all}
                    className="flex items-center gap-1 text-[11px] px-2 py-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:py-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 disabled:opacity-40 transition-colors"
                  >
                    <X size={11} /> {t.labs.clear_all}
                  </button>
                </div>
              </div>

              <textarea
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                onPaste={handlePaste}
                placeholder={tabs.find((tab) => tab.key === activeTab)?.placeholder}
                aria-label={inputAriaLabel}
                className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs font-mono placeholder-slate-700 focus:outline-none focus:border-amber-500 transition-colors resize-none ${
                  activeTab === "html" ? "text-emerald-300" : activeTab === "css" ? "text-blue-300" : "text-yellow-300"
                } ${fullscreen ? "h-[calc(100%-120px)]" : "h-36 sm:h-48"}`}
                spellCheck={false}
              />

              <div className="flex gap-2">
                <button
                  onClick={handlePreview}
                  disabled={!html.trim() && !css.trim() && !js.trim()}
                  data-event="cta_code_preview"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Eye size={13} /> {t.labs.run_preview}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!html.trim() && !css.trim() && !js.trim() && !preview}
                  aria-label={t.labs.download}
                  data-event="cta_code_download"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-lg transition-colors"
                >
                  <Download size={13} /> {t.labs.download}
                </button>
              </div>

              <div className="flex gap-2 text-[10px]">
                {tabs.map((tab) => {
                  const value = tab.key === "html" ? html : tab.key === "css" ? css : js;
                  const filled = value.trim().length > 0;
                  return (
                    <span key={tab.key} className={`flex items-center gap-1 ${filled ? "text-emerald-400" : "text-slate-600"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${filled ? "bg-emerald-400" : "bg-slate-700"}`} />
                      {tab.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Eye size={11} /> {t.labs.live_preview}
                </span>
                {preview && (
                  <button
                    onClick={handleDownload}
                    data-event="cta_code_download_from_preview"
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-amber-500 hover:text-amber-300 hover:bg-amber-900/20 transition-colors"
                  >
                    <Download size={11} /> {t.labs.save_as_html}
                  </button>
                )}
              </div>
              {preview ? (
                <iframe
                  srcDoc={preview}
                  sandbox="allow-scripts"
                  title={t.labs.code_preview_title}
                  className={`w-full rounded-lg border border-slate-600 bg-white ${
                    fullscreen ? "h-[calc(100%-60px)]" : "h-36 sm:h-48"
                  }`}
                />
              ) : (
                <div className={`w-full rounded-lg border border-dashed border-slate-700 bg-slate-950/50 flex flex-col items-center justify-center gap-2 ${
                  fullscreen ? "h-[calc(100%-60px)]" : "h-36 sm:h-48"
                }`}>
                  <Eye size={24} className="text-slate-700" />
                  <p className="text-xs text-slate-600 text-center px-4">{t.labs.preview_empty_hint}</p>
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 text-[10px] text-slate-600">{t.labs.preview_footer}</p>
        </div>
      </div>
    </>
  );
}

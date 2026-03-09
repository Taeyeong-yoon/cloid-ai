"use client";

import { useState, useCallback } from "react";
import { Code2, Eye, Download, X, Copy, Check, Maximize2, Minimize2 } from "lucide-react";

type TabType = "html" | "css" | "js";

export default function HTMLPreview() {
  const [activeTab, setActiveTab] = useState<TabType>("html");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const currentCode = activeTab === "html" ? html : activeTab === "css" ? css : js;
  const setCurrentCode = activeTab === "html" ? setHtml : activeTab === "css" ? setCss : setJs;

  // HTML+CSS+JS를 하나의 문서로 합치기
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
    const text = activeTab === "html" ? html : activeTab === "css" ? css : js;
    if (!text.trim()) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [activeTab, html, css, js]);

  const handleClear = useCallback(() => {
    setHtml(""); setCss(""); setJs(""); setPreview("");
  }, []);

  // 붙여넣기 시 자동 감지
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    if (text.trim().startsWith("<") || text.trim().toLowerCase().includes("<!doctype")) {
      if (activeTab === "html") {
        setTimeout(() => setPreview(buildDocument()), 100);
      }
    }
  }, [activeTab, buildDocument]);

  const tabs: { key: TabType; label: string; placeholder: string }[] = [
    { key: "html", label: "HTML", placeholder: '<div class="container">\n  <h1>Hello World</h1>\n  <p>여기에 HTML을 작성하세요</p>\n  <button id="btn">클릭</button>\n</div>' },
    { key: "css", label: "CSS", placeholder: '.container {\n  max-width: 600px;\n  margin: 0 auto;\n  padding: 20px;\n  font-family: sans-serif;\n}\n\nh1 { color: #8b5cf6; }' },
    { key: "js", label: "JS", placeholder: 'document.getElementById("btn")\n  .addEventListener("click", () => {\n    alert("Hello from CLOID!");\n  });' },
  ];

  return (
    <div className={`rounded-xl border border-amber-800/40 bg-gradient-to-br from-amber-950/20 to-slate-900/60 overflow-hidden transition-all ${
      fullscreen ? "fixed inset-4 z-50 shadow-2xl border-amber-600/60" : ""
    }`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-amber-800/30 bg-amber-950/20">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-amber-400" />
          <h2 className="text-sm font-semibold text-white">코드 미리보기</h2>
          <span className="text-[10px] text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-700/50">
            HTML+CSS+JS
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setFullscreen(v => !v)} title={fullscreen ? "축소" : "전체화면"}
            className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 transition-colors">
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className={`grid gap-3 ${fullscreen ? "grid-cols-2" : "grid-cols-1 lg:grid-cols-2"}`}>
          {/* 코드 입력 영역 */}
          <div className="flex flex-col gap-2">
            {/* 탭 */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {tabs.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 sm:py-1 rounded-md text-xs font-medium transition-colors ${
                      activeTab === tab.key
                        ? "bg-amber-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-700"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={handleCopy} disabled={!currentCode.trim()}
                  className="flex items-center gap-1 text-[11px] px-2 py-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:py-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-40 transition-colors">
                  {copied ? <><Check size={11} className="text-emerald-400" /> 복사됨</> : <><Copy size={11} /> 복사</>}
                </button>
                <button onClick={handleClear} disabled={!html.trim() && !css.trim() && !js.trim()}
                  className="flex items-center gap-1 text-[11px] px-2 py-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:py-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 disabled:opacity-40 transition-colors">
                  <X size={11} /> 전체 지우기
                </button>
              </div>
            </div>

            {/* 코드 에디터 */}
            <textarea
              value={currentCode}
              onChange={e => setCurrentCode(e.target.value)}
              onPaste={handlePaste}
              placeholder={tabs.find(t => t.key === activeTab)?.placeholder}
              className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs font-mono placeholder-slate-700 focus:outline-none focus:border-amber-500 transition-colors resize-none ${
                activeTab === "html" ? "text-emerald-300" : activeTab === "css" ? "text-blue-300" : "text-yellow-300"
              } ${fullscreen ? "h-[calc(100%-120px)]" : "h-36 sm:h-48"}`}
              spellCheck={false}
            />

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <button onClick={handlePreview} disabled={!html.trim() && !css.trim() && !js.trim()}
                data-event="cta_code_preview"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium rounded-lg transition-colors">
                <Eye size={13} /> 미리보기 실행
              </button>
              <button onClick={handleDownload} disabled={!html.trim() && !css.trim() && !js.trim() && !preview}
                data-event="cta_code_download"
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-lg transition-colors">
                <Download size={13} /> 다운로드
              </button>
            </div>

            {/* 각 탭 코드 유무 표시 */}
            <div className="flex gap-2 text-[10px]">
              {tabs.map(tab => (
                <span key={tab.key} className={`flex items-center gap-1 ${
                  (tab.key === "html" ? html : tab.key === "css" ? css : js).trim()
                    ? "text-emerald-400" : "text-slate-600"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    (tab.key === "html" ? html : tab.key === "css" ? css : js).trim()
                      ? "bg-emerald-400" : "bg-slate-700"
                  }`} />
                  {tab.label}
                </span>
              ))}
            </div>
          </div>

          {/* 미리보기 영역 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Eye size={11} /> 실시간 미리보기
              </span>
              {preview && (
                <button onClick={handleDownload} data-event="cta_code_download_from_preview"
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-amber-500 hover:text-amber-300 hover:bg-amber-900/20 transition-colors">
                  <Download size={11} /> HTML로 저장
                </button>
              )}
            </div>
            {preview ? (
              <iframe srcDoc={preview} sandbox="allow-scripts" title="코드 미리보기"
                className={`w-full rounded-lg border border-slate-600 bg-white ${
                  fullscreen ? "h-[calc(100%-60px)]" : "h-36 sm:h-48"
                }`} />
            ) : (
              <div className={`w-full rounded-lg border border-dashed border-slate-700 bg-slate-950/50 flex flex-col items-center justify-center gap-2 ${
                fullscreen ? "h-[calc(100%-60px)]" : "h-36 sm:h-48"
              }`}>
                <Eye size={24} className="text-slate-700" />
                <p className="text-xs text-slate-600 text-center px-4">
                  HTML/CSS/JS를 입력하고<br />
                  <span className="text-amber-600">미리보기 실행</span>을 클릭하세요
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-[10px] text-slate-600">
          💡 HTML+CSS+JS 모두 지원 · 브라우저에서 실행되며 서버로 전송되지 않습니다 · 비용 0원
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Code2, Eye, Download, X, Copy, Check, Maximize2, Minimize2 } from "lucide-react";

export default function HTMLPreview() {
  const [code, setCode] = useState("");
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handlePreview = useCallback(() => {
    if (!code.trim()) return;
    setPreview(code);
  }, [code]);

  const handleDownload = useCallback(() => {
    const src = preview || code;
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
  }, [preview, code]);

  const handleClear = useCallback(() => {
    setCode("");
    setPreview("");
  }, []);

  const handleCopy = useCallback(async () => {
    if (!code.trim()) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  // 붙여넣기 시 자동 미리보기
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    if (text.trim().startsWith("<") || text.trim().toLowerCase().includes("<!doctype")) {
      // 약간의 딜레이 후 미리보기 자동 실행
      setTimeout(() => setPreview(text), 50);
    }
  }, []);

  return (
    <div
      className={`rounded-xl border border-amber-800/40 bg-gradient-to-br from-amber-950/20 to-slate-900/60 overflow-hidden transition-all ${
        fullscreen ? "fixed inset-4 z-50 shadow-2xl border-amber-600/60" : ""
      }`}
    >
      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-amber-800/30 bg-amber-950/20">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-amber-400" />
          <h2 className="text-sm font-semibold text-white">HTML 코드 미리보기</h2>
          <span className="text-[10px] text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-700/50">
            HTML Only
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFullscreen((v) => !v)}
            title={fullscreen ? "일반 크기" : "전체 화면"}
            className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "펼치기" : "접기"}
            className="text-xs px-2 py-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
          >
            {collapsed ? "펼치기" : "접기"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 sm:p-5">
          <p className="text-xs text-slate-500 mb-4">
            AI가 생성한 HTML 코드를 붙여넣으면 즉시 미리보기하고 파일로 저장할 수 있습니다. 붙여넣기 시 자동 미리보기됩니다.
          </p>

          <div className={`grid gap-4 ${fullscreen ? "grid-cols-2" : "grid-cols-1 lg:grid-cols-2"}`}>
            {/* ── 코드 입력 영역 ── */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Code2 size={11} />
                  HTML 코드 입력
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    disabled={!code.trim()}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-40 transition-colors"
                  >
                    {copied ? (
                      <><Check size={11} className="text-emerald-400" /> 복사됨</>
                    ) : (
                      <><Copy size={11} /> 복사</>
                    )}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!code.trim()}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 disabled:opacity-40 transition-colors"
                  >
                    <X size={11} /> 지우기
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onPaste={handlePaste}
                placeholder={`<!DOCTYPE html>\n<html lang="ko">\n<head>\n  <meta charset="UTF-8">\n  <title>미리보기</title>\n</head>\n<body>\n  <!-- 여기에 HTML 코드를 붙여넣으세요 -->\n</body>\n</html>`}
                className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs font-mono text-emerald-300 placeholder-slate-700 focus:outline-none focus:border-amber-500 transition-colors resize-none ${
                  fullscreen ? "h-[calc(100%-80px)]" : "h-52"
                }`}
                spellCheck={false}
              />

              {/* 액션 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={handlePreview}
                  disabled={!code.trim()}
                  data-event="cta_html_preview"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Eye size={13} />
                  미리보기
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!code.trim() && !preview}
                  data-event="cta_html_download"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-lg transition-colors"
                >
                  <Download size={13} />
                  HTML 다운로드
                </button>
              </div>
            </div>

            {/* ── 미리보기 영역 ── */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Eye size={11} />
                  실시간 미리보기
                </span>
                {preview && (
                  <button
                    onClick={handleDownload}
                    data-event="cta_html_download_from_preview"
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-amber-500 hover:text-amber-300 hover:bg-amber-900/20 transition-colors"
                  >
                    <Download size={11} /> HTML로 저장
                  </button>
                )}
              </div>

              {preview ? (
                <iframe
                  srcDoc={preview}
                  sandbox="allow-scripts allow-same-origin"
                  title="HTML 미리보기"
                  className={`w-full rounded-lg border border-slate-600 bg-white ${
                    fullscreen ? "h-[calc(100%-80px)]" : "h-52"
                  }`}
                />
              ) : (
                <div
                  className={`w-full rounded-lg border border-dashed border-slate-700 bg-slate-950/50 flex flex-col items-center justify-center gap-2 ${
                    fullscreen ? "h-[calc(100%-80px)]" : "h-52"
                  }`}
                >
                  <Eye size={24} className="text-slate-700" />
                  <p className="text-xs text-slate-600 text-center px-4">
                    왼쪽에 HTML을 붙여넣거나<br />
                    <span className="text-amber-600">미리보기</span> 버튼을 클릭하세요
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 안내 */}
          <p className="mt-3 text-[10px] text-slate-600">
            💡 HTML+CSS+JS 모두 지원 · 외부 네트워크 요청은 sandbox 정책에 따라 제한될 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}

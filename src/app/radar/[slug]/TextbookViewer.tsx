"use client";

import Link from "next/link";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import TextbookIcon from "@/components/TextbookIcon";
import type { Textbook } from "@/constants/textbooks";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function TextbookViewer({ textbook }: { textbook: Textbook }) {
  const { locale } = useTranslation();
  const [fullscreen, setFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const contentSrc = useMemo(() => `/textbooks/${textbook.htmlFile}`, [textbook.htmlFile]);

  const listLabel = locale === "ko" ? "교재 목록" : "Textbook list";
  const fullscreenLabel = locale === "ko" ? "전체 화면" : "Fullscreen";
  const exitFullscreenLabel = locale === "ko" ? "전체 화면 종료" : "Exit fullscreen";
  const title = locale === "ko" ? textbook.title : textbook.titleEn;

  function handleFrameLoad() {
    const frame = iframeRef.current;
    if (!frame) return;

    try {
      const currentPath = frame.contentWindow?.location.pathname;
      if (currentPath && !currentPath.startsWith("/textbooks/")) {
        frame.src = contentSrc;
      }
    } catch {
      frame.src = contentSrc;
    }
  }

  return (
    <>
      {fullscreen ? <div className="fixed inset-0 z-40 bg-black/70" onClick={() => setFullscreen(false)} /> : null}
      <div className={fullscreen ? "fixed inset-0 z-50 flex flex-col bg-[#070b14]" : "space-y-4"}>
        <div className={`flex items-center justify-between gap-3 ${fullscreen ? "border-b border-slate-800 px-4 py-3" : ""}`}>
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/radar"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              {listLabel}
            </Link>
            <span className="text-slate-700">/</span>
            <div className="flex min-w-0 items-center gap-2">
              <TextbookIcon icon={textbook.icon} accentColor={textbook.accentColor} size={34} />
              <h1 className="truncate text-sm font-semibold text-white sm:text-base">{title}</h1>
            </div>
          </div>
          <button
            onClick={() => setFullscreen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 transition-colors hover:text-white"
            title={fullscreen ? exitFullscreenLabel : fullscreenLabel}
            aria-label={fullscreen ? exitFullscreenLabel : fullscreenLabel}
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
        <iframe
          ref={iframeRef}
          src={contentSrc}
          title={title}
          sandbox="allow-scripts allow-same-origin"
          onLoad={handleFrameLoad}
          className={fullscreen ? "h-full w-full flex-1 border-0" : "min-h-[72vh] w-full rounded-2xl border border-slate-800 bg-black"}
        />
      </div>
    </>
  );
}

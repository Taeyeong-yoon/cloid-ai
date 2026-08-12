"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import TextbookIcon from "@/components/TextbookIcon";
import { COURSE_BASE, type CourseLesson } from "@/constants/course";
import { markLessonVisited } from "@/lib/course-progress";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function LessonViewer({
  lesson,
  prev,
  next,
}: {
  lesson: CourseLesson;
  prev: CourseLesson | null;
  next: CourseLesson | null;
}) {
  const { locale } = useTranslation();
  const ko = locale === "ko";
  const [fullscreen, setFullscreen] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const contentSrc = useMemo(() => `${COURSE_BASE}/${lesson.file}`, [lesson.file]);

  useEffect(() => {
    markLessonVisited(lesson.id);
  }, [lesson.id]);

  const listLabel = ko ? "커리큘럼" : "Curriculum";
  const title = ko ? lesson.title : lesson.titleEn;
  const session = ko ? lesson.session : lesson.sessionEn;

  // 교재 내부에서 다른 경로로 이탈하면 원래 파일로 되돌린다
  function handleFrameLoad() {
    const frame = iframeRef.current;
    if (!frame) return;
    try {
      const currentPath = frame.contentWindow?.location.pathname;
      if (currentPath && !currentPath.startsWith(COURSE_BASE)) {
        frame.src = contentSrc;
      }
    } catch {
      frame.src = contentSrc;
    }
  }

  const navLinks = (
    <div className="flex items-center gap-2">
      {prev ? (
        <Link
          href={`/course/${prev.id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:text-white"
          title={ko ? prev.title : prev.titleEn}
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">{ko ? prev.session : prev.sessionEn}</span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={`/course/${next.id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-violet-500/40 bg-violet-500/10 px-2.5 py-1.5 text-xs text-violet-200 transition-colors hover:bg-violet-500/20"
          title={ko ? next.title : next.titleEn}
        >
          <span className="hidden sm:inline">{ko ? next.session : next.sessionEn}</span>
          <ChevronRight size={14} />
        </Link>
      ) : null}
    </div>
  );

  return (
    <>
      {fullscreen ? (
        <div className="fixed inset-0 z-40 bg-black/70" onClick={() => setFullscreen(false)} />
      ) : null}
      <div className={fullscreen ? "fixed inset-0 z-50 flex flex-col bg-[#070b14]" : "space-y-4"}>
        <div
          className={`flex items-center justify-between gap-3 ${
            fullscreen ? "border-b border-slate-800 px-4 py-3" : ""
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/course"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">{listLabel}</span>
            </Link>
            <span className="text-slate-700">/</span>
            <div className="flex min-w-0 items-center gap-2">
              <TextbookIcon icon={lesson.icon} accentColor={lesson.accentColor} size={32} />
              <h1 className="truncate text-sm font-semibold text-white sm:text-base">
                <span className="text-slate-400">{session}</span> · {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {navLinks}
            <button
              onClick={() => setFullscreen((value) => !value)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 transition-colors hover:text-white"
              title={fullscreen ? (ko ? "전체 화면 종료" : "Exit fullscreen") : ko ? "전체 화면" : "Fullscreen"}
              aria-label={fullscreen ? (ko ? "전체 화면 종료" : "Exit fullscreen") : ko ? "전체 화면" : "Fullscreen"}
            >
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        <iframe
          ref={iframeRef}
          src={contentSrc}
          title={title}
          sandbox="allow-scripts allow-same-origin allow-downloads"
          onLoad={handleFrameLoad}
          className={
            fullscreen
              ? "h-full w-full flex-1 border-0"
              : "min-h-[72vh] w-full rounded-2xl border border-slate-800 bg-black"
          }
        />

        {!fullscreen && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <Link href="/course" className="text-sm text-slate-400 transition-colors hover:text-white">
              ← {listLabel}
            </Link>
            {next ? (
              <Link
                href={`/course/${next.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
              >
                {ko ? `다음 · ${next.session} ${next.title}` : `Next · ${next.titleEn}`}
                <ChevronRight size={15} />
              </Link>
            ) : (
              <span className="text-sm text-emerald-300">
                {ko ? "마지막 교시입니다 🎉" : "Final session 🎉"}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}

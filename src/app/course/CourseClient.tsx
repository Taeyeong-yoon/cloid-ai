"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Download, FileText, Layers, Sparkles } from "lucide-react";
import TextbookIcon from "@/components/TextbookIcon";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import {
  COURSE_APPENDIX,
  COURSE_BASE,
  COURSE_LESSONS,
  COURSE_MATERIALS,
  COURSE_META,
} from "@/constants/course";
import { getVisitedLessons } from "@/lib/course-progress";

export default function CourseClient() {
  const { locale } = useTranslation();
  const ko = locale === "ko";
  const [visited, setVisited] = useState<string[]>([]);

  useEffect(() => {
    setVisited(getVisitedLessons());
  }, []);

  const done = visited.length;
  const rate = Math.round((done / COURSE_LESSONS.length) * 100);

  return (
    <div className="space-y-8">
      {/* ── 코스 헤더 ─────────────────────────────────────── */}
      <section className="rounded-[1.75rem] border border-slate-800/80 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.94))] p-6 sm:p-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-violet-200">
          <Sparkles size={12} />
          {COURSE_META.level} · Course
        </div>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {ko ? COURSE_META.title : COURSE_META.titleEn}
          </h1>
          <p className="text-base leading-8 text-slate-300 sm:text-lg">
            {ko ? COURSE_META.subtitle : COURSE_META.subtitleEn}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Layers size={14} className="text-violet-300" />
            {ko ? `${COURSE_LESSONS.length}개 교시` : `${COURSE_LESSONS.length} sessions`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText size={14} className="text-violet-300" />
            {ko ? `슬라이드 ${COURSE_META.totalSlides}장` : `${COURSE_META.totalSlides} slides`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} className="text-violet-300" />
            {ko ? `약 ${Math.round(COURSE_META.totalMinutes / 60)}시간` : `~${Math.round(COURSE_META.totalMinutes / 60)} hours`}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={`/course/${COURSE_LESSONS[0].id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            {done > 0 ? (ko ? "이어서 학습하기" : "Continue") : ko ? "1교시 시작하기" : "Start session 1"}
            <ArrowRight size={15} />
          </Link>
          {done > 0 && (
            <span className="text-xs text-slate-400">
              {ko ? `${COURSE_LESSONS.length}개 중 ${done}개 열람 · ${rate}%` : `${done} of ${COURSE_LESSONS.length} opened · ${rate}%`}
            </span>
          )}
        </div>
      </section>

      {/* ── 커리큘럼 ─────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight text-white sm:text-xl">
          {ko ? "커리큘럼" : "Curriculum"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {COURSE_LESSONS.map((lesson) => {
            const isDone = visited.includes(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/course/${lesson.id}`}
                className="group flex flex-col rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-slate-900/70"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-2">
                    <TextbookIcon icon={lesson.icon} accentColor={lesson.accentColor} size={78} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300">
                      {ko ? lesson.session : lesson.sessionEn}
                    </span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300">
                        <CheckCircle2 size={12} />
                        {ko ? "열람함" : "Opened"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {ko ? lesson.title : lesson.titleEn}
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      {ko ? lesson.tagline : lesson.taglineEn}
                    </span>
                  </h3>
                  <p className="text-sm leading-6 text-slate-400">
                    {ko ? lesson.description : lesson.descriptionEn}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <FileText size={13} />
                    {ko ? `${lesson.slides}장` : `${lesson.slides} slides`}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {lesson.minutes}
                    {ko ? "분" : " min"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(ko ? lesson.topics : lesson.topicsEn).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-slate-800 bg-slate-900/70 px-2.5 py-1 text-[11px] text-slate-400"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-violet-300">
                  {ko ? "교재 열기" : "Open lesson"}
                  <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 실습자료 ─────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
        <h2 className="mb-1 text-lg font-bold tracking-tight text-white">
          {ko ? "실습자료 내려받기" : "Practice materials"}
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          {ko
            ? "3교시와 4교시는 실습 파일이 필요합니다. 수업 전에 미리 내려받아 두세요."
            : "Sessions 3 and 4 need sample files. Download them before class."}
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          {COURSE_MATERIALS.map((material) => (
            <a
              key={material.id}
              href={material.href}
              download
              className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:border-violet-500/50 hover:bg-slate-900"
            >
              <div className="mt-0.5 rounded-lg border border-violet-500/25 bg-violet-500/10 p-2 text-violet-300">
                <Download size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-200 group-hover:text-white">
                  {ko ? material.label : material.labelEn}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {ko ? material.note : material.noteEn}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-slate-500">{material.sizeLabel}</span>
            </a>
          ))}
        </div>

        <a
          href={`${COURSE_BASE}/${COURSE_APPENDIX.file}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-4 py-3 text-sm text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
        >
          <FileText size={14} />
          <span className="font-medium">{ko ? COURSE_APPENDIX.label : COURSE_APPENDIX.labelEn}</span>
          <span className="text-xs text-slate-500">— {ko ? COURSE_APPENDIX.note : COURSE_APPENDIX.noteEn}</span>
        </a>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  GraduationCap,
  Layers,
  Radar,
  Sparkles,
  Zap,
} from "lucide-react";
import AskAI from "@/components/AskAI";
import HeroVisual from "@/components/HeroVisual";
import TextbookIcon from "@/components/TextbookIcon";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { AI_TOOLS } from "@/constants/home";
import { TEXTBOOKS } from "@/constants/textbooks";
import {
  COURSE_LESSONS,
  COURSE_MATERIALS,
  COURSE_META,
} from "@/constants/course";
import { getVisitedLessons } from "@/lib/course-progress";

export interface LibraryCounts {
  learning: number;
  labs: number;
  skills: number;
  trends: number;
}

export default function HomeClient({ libraryCounts }: { libraryCounts: LibraryCounts }) {
  const { locale } = useTranslation();
  const ko = locale === "ko";
  const [visited, setVisited] = useState<string[]>([]);

  useEffect(() => {
    setVisited(getVisitedLessons());
  }, []);

  const nextLesson = COURSE_LESSONS.find((lesson) => !visited.includes(lesson.id)) ?? COURSE_LESSONS[0];
  const started = visited.length > 0;

  const library = [
    {
      href: "/radar",
      label: ko ? "인터랙티브 교재" : "Interactive Textbooks",
      count: TEXTBOOKS.filter((t) => t.ready).length,
      icon: BookOpen,
      accent: "text-emerald-300",
    },
    {
      href: "/learning",
      label: ko ? "주제별 학습" : "Topic Learning",
      count: libraryCounts.learning,
      icon: GraduationCap,
      accent: "text-sky-300",
    },
    {
      href: "/skills",
      label: ko ? "클로드 허브" : "Claude Hub",
      count: libraryCounts.skills,
      icon: Zap,
      accent: "text-violet-300",
    },
    {
      href: "/labs",
      label: ko ? "실습 Labs" : "Hands-on Labs",
      count: libraryCounts.labs,
      icon: FlaskConical,
      accent: "text-fuchsia-300",
    },
    {
      href: "/trends",
      label: ko ? "AI 트렌드" : "AI Trends",
      count: libraryCounts.trends,
      icon: Radar,
      accent: "text-amber-300",
    },
  ];

  return (
    <div className="space-y-10">
      {/* ── 히어로: 교육 과정 ─────────────────────────────── */}
      <section className="hero-glow animate-fade-in-up py-4" style={{ animationDelay: "0ms" }}>
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12">
          <div className="min-w-0 flex-1">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200">
              <Sparkles size={12} />
              {COURSE_META.level} · Free Course
            </div>

            <h1 className="mb-3 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
              {ko ? COURSE_META.title : COURSE_META.titleEn}
            </h1>

            <p className="mb-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {ko ? COURSE_META.subtitle : COURSE_META.subtitleEn}
            </p>

            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Layers size={14} className="text-violet-400" />
                {ko ? `${COURSE_LESSONS.length}개 교시` : `${COURSE_LESSONS.length} sessions`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FileText size={14} className="text-violet-400" />
                {ko ? `슬라이드 ${COURSE_META.totalSlides}장` : `${COURSE_META.totalSlides} slides`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} className="text-violet-400" />
                {ko ? `약 ${Math.round(COURSE_META.totalMinutes / 60)}시간` : `~${Math.round(COURSE_META.totalMinutes / 60)} hours`}
              </span>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href={`/course/${nextLesson.id}`}
                data-event="cta_course_start"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
              >
                {started
                  ? ko
                    ? `이어서 · ${nextLesson.session} ${nextLesson.title}`
                    : `Continue · ${nextLesson.titleEn}`
                  : ko
                    ? "1교시 시작하기"
                    : "Start session 1"}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/course"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:text-white"
              >
                {ko ? "커리큘럼 전체 보기" : "See full curriculum"}
              </Link>
            </div>
          </div>

          <div className="hidden h-[340px] w-[340px] shrink-0 md:block lg:h-[400px] lg:w-[420px]">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── 커리큘럼 ─────────────────────────────────────── */}
      <section className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="mb-4">
          <h2 className="mb-1 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-violet-800/60 bg-violet-900/40 text-sm">
              <Layers size={13} className="text-violet-300" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
              {ko ? "커리큘럼" : "Curriculum"}
            </span>
          </h2>
          <p className="ml-8 text-sm text-slate-400 sm:text-base">
            {ko
              ? "기초 개념 → 프롬프트 → 작업공간 → 보고서 디자인 → 나만의 스킬"
              : "Foundations → Prompting → Workspace → Report design → Your own skill"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {COURSE_LESSONS.map((lesson) => {
            const isDone = visited.includes(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/course/${lesson.id}`}
                data-event={`cta_lesson_${lesson.id}`}
                className="group flex flex-col rounded-[1.5rem] border border-slate-800/90 bg-slate-950/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-slate-900/70"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-2">
                    <TextbookIcon icon={lesson.icon} accentColor={lesson.accentColor} size={72} />
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] ${
                      isDone
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-slate-700 bg-slate-900/80 text-slate-300"
                    }`}
                  >
                    {ko ? lesson.session : lesson.sessionEn}
                  </span>
                </div>

                <h3 className="text-base font-semibold tracking-tight text-white">
                  {ko ? lesson.title : lesson.titleEn}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {ko ? lesson.tagline : lesson.taglineEn}
                </p>

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

                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300">
                  {ko ? "교재 열기" : "Open lesson"}
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}

          {/* 실습자료 카드 */}
          <div className="flex flex-col rounded-[1.5rem] border border-dashed border-slate-700/80 bg-slate-950/40 p-5">
            <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-[11px] text-violet-200">
              <Download size={12} />
              {ko ? "실습자료" : "Materials"}
            </div>
            <p className="mb-4 text-sm leading-6 text-slate-400">
              {ko
                ? "3·4교시는 실습 파일이 필요합니다. 미리 내려받아 두세요."
                : "Sessions 3 and 4 need sample files — download them first."}
            </p>
            <div className="mt-auto space-y-2">
              {COURSE_MATERIALS.map((material) => (
                <a
                  key={material.id}
                  href={material.href}
                  download
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2.5 text-xs text-slate-300 transition-colors hover:border-violet-500/40 hover:text-white"
                >
                  <Download size={13} className="shrink-0 text-violet-300" />
                  <span className="min-w-0 flex-1 truncate">
                    {ko ? material.label.split(" — ")[0] : material.labelEn.split(" — ")[0]}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-500">{material.sizeLabel}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── AI 튜터 ──────────────────────────────────────── */}
      <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <AskAI />
      </div>

      {/* ── 더 배우기 (기존 라이브러리) ────────────────────── */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
        <h2 className="mb-1 text-base font-bold tracking-tight text-white sm:text-lg">
          {ko ? "더 배우기" : "Go further"}
        </h2>
        <p className="mb-4 text-sm text-slate-400">
          {ko
            ? "과정을 마쳤다면 주제별 교재와 실습으로 이어서 학습하세요."
            : "Finished the course? Continue with topic textbooks and hands-on labs."}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {library.map(({ href, label, count, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3 transition-all hover:-translate-y-0.5 hover:border-slate-600"
            >
              <Icon size={16} className={accent} />
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-200 group-hover:text-white">{label}</p>
                <p className="text-[11px] text-slate-500">
                  {count}
                  {ko ? "개" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI 도구 바로가기 ──────────────────────────────── */}
      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
        <div className="tools-section relative overflow-hidden rounded-[1.35rem] border border-slate-800/80 bg-slate-950/60 p-4 sm:p-5">
          <div className="tools-section-bg tools-section-bg-1" />
          <div className="tools-section-bg tools-section-bg-2" />
          <div className="tools-section-grid" />

          <div className="relative z-10 mb-4 flex items-end justify-between gap-3">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                <Sparkles size={11} />
                AI Tool Matrix
              </div>
              <h2 className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-blue-800/60 bg-blue-900/40">
                  <ExternalLink size={12} className="text-blue-400" />
                </span>
                <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                  {ko ? "AI 도구 바로가기" : "AI tool shortcuts"}
                </span>
              </h2>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                {ko
                  ? "수업에서 다루는 도구와 참고용 외부 도구를 한 곳에서 엽니다."
                  : "Open the tools used in class, plus references, from one deck."}
              </p>
            </div>
            <div className="hidden rounded-full border border-violet-400/15 bg-violet-500/10 px-3 py-1 text-[11px] text-violet-200 sm:block">
              {AI_TOOLS.length} live portals
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {AI_TOOLS.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tools-card group relative flex w-full items-center gap-3 overflow-hidden rounded-[1.15rem] border border-slate-800/80 bg-slate-900/70 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/40"
                title={tool.desc}
              >
                <div className="tools-card-noise" />
                <div className="tools-card-orbit" />
                <div className="tools-card-scanline" />
                <div
                  className={`tools-card-icon flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${tool.bg}`}
                >
                  {tool.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500">Portal</span>
                      <span className="mt-1 block truncate text-left text-xs font-medium leading-tight text-slate-200 transition-colors group-hover:text-white sm:text-[13px]">
                        {tool.name}
                      </span>
                      <span className="mt-1 block truncate text-left text-[10px] leading-tight text-slate-500 transition-colors group-hover:text-slate-300">
                        {tool.desc}
                      </span>
                    </div>
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

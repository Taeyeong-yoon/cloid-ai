"use client";

import Link from "next/link";
import { BookOpen, Clock3, Filter, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import TextbookIcon from "@/components/TextbookIcon";
import { TEXTBOOK_PRIORITY_LABELS, TEXTBOOKS } from "@/constants/textbooks";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function TextbookClient() {
  const { locale } = useTranslation();
  const [priority, setPriority] = useState<1 | 2 | 3 | 0>(0);
  const featured = TEXTBOOKS.filter((item) => item.ready);

  const filtered = useMemo(
    () => (priority === 0 ? TEXTBOOKS : TEXTBOOKS.filter((item) => item.priority === priority)),
    [priority],
  );

  const labels = TEXTBOOK_PRIORITY_LABELS[locale];
  const heading = locale === "ko" ? "인터랙티브 교재" : "Interactive Textbooks";
  const subheading =
    locale === "ko"
      ? "읽기만 하는 자료가 아니라, 개념 카드·비교 패널·퀴즈·메모·실습 흐름이 한 화면 안에서 이어지는 교재 시스템입니다."
      : "A textbook system where concept cards, comparisons, quizzes, notes, and practice flow together in one guided screen.";
  const filterLabel = locale === "ko" ? "우선순위" : "Priority";
  const allLabel = locale === "ko" ? "전체" : "All";
  const openLabel = locale === "ko" ? "교재 열기" : "Open textbook";
  const soonLabel = locale === "ko" ? "준비 중" : "Coming soon";
  const featuredTitle = locale === "ko" ? "바로 시작할 수 있는 대표 교재" : "Featured textbooks ready now";
  const featuredSub =
    locale === "ko"
      ? "지금 바로 눌러 볼 수 있는 2개의 인터랙티브 교재를 제일 위에 두었습니다."
      : "The two live interactive textbooks are pinned at the very top for immediate access.";
  const sectionLabel = locale === "ko" ? "섹션" : "sections";
  const minuteLabel = locale === "ko" ? "분" : "min";

  return (
    <div className="space-y-8">
      <section className="rounded-[1.75rem] border border-slate-800/80 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.94))] p-6 sm:p-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-violet-200">
          <Sparkles size={12} />
          {locale === "ko" ? "AI Textbook System" : "AI Textbook System"}
        </div>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{heading}</h1>
          <p className="text-base leading-8 text-slate-300 sm:text-lg">{subheading}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:p-5">
        <div className="mb-6 rounded-[1.4rem] border border-violet-500/18 bg-[linear-gradient(180deg,rgba(15,23,42,0.75),rgba(7,11,20,0.92))] p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight text-white">{featuredTitle}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">{featuredSub}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((textbook) => {
              const title = locale === "ko" ? textbook.title : textbook.titleEn;
              const description = locale === "ko" ? textbook.description : textbook.descriptionEn;
              return (
                <Link
                  key={textbook.id}
                  href={`/radar/${textbook.id}`}
                  className="group rounded-[1.25rem] border border-slate-800 bg-slate-950/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/40 hover:bg-slate-900/70"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-2">
                      <TextbookIcon icon={textbook.icon} accentColor={textbook.accentColor} size={70} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-[11px] text-violet-200">
                          {openLabel}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Filter size={15} className="text-violet-300" />
            {filterLabel}
          </div>
          {([0, 1, 2, 3] as const).map((value) => (
            <button
              key={value}
              onClick={() => setPriority(value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                priority === value
                  ? "border-violet-500/40 bg-violet-500/15 text-violet-100"
                  : "border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-white"
              }`}
            >
              {value === 0 ? allLabel : labels[value]}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((textbook) => {
            const priorityLabel = labels[textbook.priority];
            const href = textbook.ready ? `/radar/${textbook.id}` : "#";
            const title = locale === "ko" ? textbook.title : textbook.titleEn;
            const description = locale === "ko" ? textbook.description : textbook.descriptionEn;

            const cardInner = (
              <>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-2">
                    <TextbookIcon icon={textbook.icon} accentColor={textbook.accentColor} size={88} />
                  </div>
                  <span className="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300">
                    {priorityLabel}
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>
                  <p className="text-sm leading-6 text-slate-400">{description}</p>
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen size={13} />
                    {textbook.sections} {sectionLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {textbook.estimatedMinutes} {minuteLabel}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {textbook.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-800 bg-slate-900/70 px-2.5 py-1 text-[11px] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
                      textbook.ready
                        ? "border border-violet-500/30 bg-violet-500/15 text-violet-100"
                        : "border border-slate-700 bg-slate-900/70 text-slate-500"
                    }`}
                  >
                    {textbook.ready ? openLabel : soonLabel}
                  </span>
                </div>
              </>
            );

            return textbook.ready ? (
              <Link
                key={textbook.id}
                href={href}
                className="group rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-slate-900/70"
              >
                {cardInner}
              </Link>
            ) : (
              <div key={textbook.id} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/50 p-5 opacity-80">
                {cardInner}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

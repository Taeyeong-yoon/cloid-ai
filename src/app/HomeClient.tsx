"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Zap,
  FlaskConical,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Radio,
} from "lucide-react";
import AskAI from "@/components/AskAI";
import HeroVisual from "@/components/HeroVisual";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { AI_TOOLS, POPULAR_TAGS } from "@/constants/home";

function TopicTag({ tag, onClick }: { tag: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
    >
      {tag}
    </button>
  );
}

interface TodayUpdateData {
  radar: { slug: string; title: string; summary: string; tags: string[] } | null;
  learning: { id: string; title: string; description: string; level: string; tags: string[] } | null;
  lab: { id: string; title: string; description: string; difficulty: string; tags: string[] } | null;
}

interface ContentCounts {
  total: number;
  learning: number;
  labs: number;
  radar: number;
}

export default function HomeClient({
  todayUpdate: _todayUpdate,
  contentCounts,
}: {
  todayUpdate: TodayUpdateData;
  contentCounts: ContentCounts;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    void searchParams;
  }, [searchParams]);

  function handleTagClick(tag: string) {
    router.push(`/learning?q=${encodeURIComponent(tag)}`);
  }

  const journey = [
    {
      step: "01",
      href: "/radar",
      label: t.home.radar_label,
      icon: Radio,
      color: "text-emerald-400",
      border: "hover:border-emerald-700",
      desc: t.home.journey_radar_desc,
      cta: `${t.home.radar_label} ->`,
      event: "cta_journey_radar",
    },
    {
      step: "02",
      href: "/learning",
      label: t.home.learning_label,
      icon: BookOpen,
      color: "text-blue-400",
      border: "hover:border-blue-700",
      desc: t.home.journey_learning_desc,
      cta: `${t.home.learning_label} ->`,
      event: "cta_journey_learning",
    },
    {
      step: "03",
      href: "/skills",
      label: t.home.skills_label,
      icon: Zap,
      color: "text-amber-400",
      border: "hover:border-amber-700",
      desc: t.home.journey_skills_desc,
      cta: `${t.home.skills_label} ->`,
      event: "cta_journey_skills",
    },
    {
      step: "04",
      href: "/labs",
      label: t.home.labs_label,
      icon: FlaskConical,
      color: "text-violet-400",
      border: "hover:border-violet-700",
      desc: t.home.journey_labs_desc,
      cta: `${t.home.labs_label} ->`,
      event: "cta_journey_labs",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="hero-glow animate-fade-in-up py-4" style={{ animationDelay: "0ms" }}>
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-400">
              <TrendingUp size={16} />
              <span>{t.home.trending_badge}</span>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              CLOID<span className="text-violet-400">.AI</span>
            </h1>
            <p className="mb-1 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {t.home.hero_desc}
            </p>
            <p className="mb-3 max-w-xl text-sm leading-relaxed text-slate-500">
              {t.home.hero_sub_desc}
            </p>

            <div className="flex flex-col items-start gap-2 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                {t.home.social_proof_updated}
              </span>
              <span>{t.home.content_count.replace("{n}", String(contentCounts.total))}</span>
              <span>{t.home.lab_count.replace("{n}", String(contentCounts.labs))}</span>
            </div>
          </div>

          <div className="hidden h-[340px] w-[340px] shrink-0 md:block lg:h-[400px] lg:w-[420px]">
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="mb-4">
          <h2 className="mb-1 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-violet-800/60 bg-violet-900/40 text-sm">
              🗺️
            </span>
            <span className="text-sm font-bold tracking-tight text-white">{t.home.journey_title}</span>
          </h2>
          <p className="ml-8 text-xs text-slate-500">{t.home.journey_subtitle}</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {journey.map(({ step, href, label, icon: Icon, color, border, desc, cta, event }, idx) => (
            <div key={href} className="flex flex-col items-stretch gap-2 sm:flex-row md:flex-col">
              <Link
                href={href}
                data-event={event}
                className={`card-glow group flex flex-1 cursor-pointer flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-3 transition-all hover:bg-slate-800/50 sm:p-4 ${border}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 transition-colors duration-200 group-hover:text-violet-400">
                    {step}
                  </span>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <div className="text-sm font-medium leading-snug text-white transition-colors group-hover:text-violet-300">
                    {label}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">{desc}</div>
                </div>
                <span className={`mt-auto text-xs ${color} group-hover:underline`}>{cta}</span>
              </Link>
              {idx < 3 && (
                <div className="arrow-animate -mx-1 mt-8 hidden items-center justify-center text-slate-600 md:flex">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-4">
          <p className="mb-2 text-xs text-slate-500">🏷️ {t.home.popular_topics}</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map((tag) => (
              <TopicTag key={tag} tag={tag} onClick={() => handleTagClick(tag)} />
            ))}
          </div>
        </div>
      </section>

      <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <AskAI />
      </div>

      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
        <h2 className="mb-3 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md border border-blue-800/60 bg-blue-900/40">
            <ExternalLink size={11} className="text-blue-400" />
          </span>
          <span className="text-sm font-bold tracking-tight text-white">{t.home.ai_tools_heading}</span>
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {AI_TOOLS.map((tool) => (
            <div key={tool.name} className="flex flex-col items-center gap-0.5">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full flex-col items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/40 p-2 transition-all hover:border-slate-600 hover:bg-slate-800/60"
                title={tool.desc}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-white shadow-sm transition-transform duration-200 group-hover:scale-110 ${tool.bg}`}
                >
                  {tool.icon}
                </div>
                <span className="text-center text-[10px] leading-tight text-slate-400 transition-colors group-hover:text-white">
                  {tool.name}
                </span>
              </a>
              <Link
                href="/learning"
                data-event={`cta_learn_tool_${tool.learnTag}`}
                className="text-[9px] text-violet-500 transition-colors hover:text-violet-300 hover:underline"
              >
                {t.home.learn_tool}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

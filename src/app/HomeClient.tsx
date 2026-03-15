"use client";

import { useEffect } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  FlaskConical,
  Radio,
  Sparkles,
  TrendingUp,
  Zap,
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

type JourneyCardKey = "radar" | "learning" | "skills" | "labs";

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

interface JourneyCardConfig {
  key: JourneyCardKey;
  step: string;
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  desc: string;
  cta: string;
  event: string;
  accentText: string;
  borderHover: string;
  badgeClass: string;
  heroClass: string;
}

function JourneyHero({ variant }: { variant: JourneyCardKey }) {
  if (variant === "radar") {
    return (
      <div className="journey-hero journey-hero-radar">
        <div className="journey-radar-grid" />
        <div className="journey-radar-ring journey-radar-ring-1" />
        <div className="journey-radar-ring journey-radar-ring-2" />
        <div className="journey-radar-ring journey-radar-ring-3" />
        <div className="journey-radar-sweep" />
        <div className="journey-radar-node journey-radar-node-1" />
        <div className="journey-radar-node journey-radar-node-2" />
        <div className="journey-radar-node journey-radar-node-3" />
      </div>
    );
  }

  if (variant === "learning") {
    return (
      <div className="journey-hero journey-hero-learning">
        <div className="journey-learning-map" />
        <div className="journey-learning-panel journey-learning-panel-1" />
        <div className="journey-learning-panel journey-learning-panel-2" />
        <div className="journey-learning-panel journey-learning-panel-3" />
        <div className="journey-learning-node journey-learning-node-a" />
        <div className="journey-learning-node journey-learning-node-b" />
        <div className="journey-learning-node journey-learning-node-c" />
        <div className="journey-learning-node journey-learning-node-d" />
      </div>
    );
  }

  if (variant === "skills") {
    return (
      <div className="journey-hero journey-hero-skills">
        <div className="journey-skills-lane journey-skills-lane-1" />
        <div className="journey-skills-lane journey-skills-lane-2" />
        <div className="journey-skill-tile journey-skill-tile-a" />
        <div className="journey-skill-tile journey-skill-tile-b" />
        <div className="journey-skill-tile journey-skill-tile-c" />
        <div className="journey-skill-chip journey-skill-chip-1" />
        <div className="journey-skill-chip journey-skill-chip-2" />
        <div className="journey-skill-chip journey-skill-chip-3" />
      </div>
    );
  }

  return (
    <div className="journey-hero journey-hero-labs">
      <div className="journey-lab-grid" />
      <div className="journey-lab-window journey-lab-window-1" />
      <div className="journey-lab-window journey-lab-window-2" />
      <div className="journey-lab-window journey-lab-window-3" />
      <div className="journey-lab-signal" />
      <div className="journey-lab-dot journey-lab-dot-1" />
      <div className="journey-lab-dot journey-lab-dot-2" />
    </div>
  );
}

function JourneyFeatureCard({
  keyName,
  step,
  href,
  label,
  icon: Icon,
  desc,
  cta,
  event,
  accentText,
  borderHover,
  badgeClass,
  heroClass,
}: JourneyCardConfig & { keyName: JourneyCardKey }) {
  return (
    <Link
      href={href}
      data-event={event}
      className={`journey-card group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-800/90 bg-slate-950/60 transition-all duration-300 ${borderHover}`}
    >
      <div className={`journey-card-hero ${heroClass}`}>
        <JourneyHero variant={keyName} />
      </div>
      <div className="journey-card-content">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className={`journey-card-step ${badgeClass}`}>{step}</span>
          <div className={`journey-card-icon ${badgeClass}`}>
            <Icon size={17} className={accentText} />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold tracking-tight text-white">{label}</h3>
          <p className="text-sm leading-6 text-slate-400">{desc}</p>
        </div>
        <div className="mt-5 flex items-center gap-2 text-sm font-medium">
          <span className={accentText}>{cta}</span>
          <ArrowRight
            size={15}
            className={`transition-transform duration-300 motion-safe:group-hover:translate-x-1 ${accentText}`}
          />
        </div>
      </div>
    </Link>
  );
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

  const journey: JourneyCardConfig[] = [
    {
      key: "radar",
      step: "01",
      href: "/radar",
      label: t.home.radar_label,
      icon: Radio,
      desc: t.home.journey_radar_desc,
      cta: t.home.radar_label,
      event: "cta_journey_radar",
      accentText: "text-emerald-300",
      borderHover: "hover:border-emerald-500/60 hover:shadow-[0_18px_48px_rgba(16,185,129,0.12)]",
      badgeClass: "border-emerald-500/25 bg-emerald-500/10",
      heroClass: "journey-hero-surface journey-hero-surface-radar",
    },
    {
      key: "learning",
      step: "02",
      href: "/learning",
      label: t.home.learning_label,
      icon: BookOpen,
      desc: t.home.journey_learning_desc,
      cta: t.home.learning_label,
      event: "cta_journey_learning",
      accentText: "text-sky-300",
      borderHover: "hover:border-sky-500/60 hover:shadow-[0_18px_48px_rgba(56,189,248,0.12)]",
      badgeClass: "border-sky-500/25 bg-sky-500/10",
      heroClass: "journey-hero-surface journey-hero-surface-learning",
    },
    {
      key: "skills",
      step: "03",
      href: "/skills",
      label: t.home.skills_label,
      icon: Zap,
      desc: t.home.journey_skills_desc,
      cta: t.home.skills_label,
      event: "cta_journey_skills",
      accentText: "text-amber-300",
      borderHover: "hover:border-amber-500/60 hover:shadow-[0_18px_48px_rgba(245,158,11,0.12)]",
      badgeClass: "border-amber-500/25 bg-amber-500/10",
      heroClass: "journey-hero-surface journey-hero-surface-skills",
    },
    {
      key: "labs",
      step: "04",
      href: "/labs",
      label: t.home.labs_label,
      icon: FlaskConical,
      desc: t.home.journey_labs_desc,
      cta: t.home.labs_label,
      event: "cta_journey_labs",
      accentText: "text-fuchsia-300",
      borderHover: "hover:border-fuchsia-500/60 hover:shadow-[0_18px_48px_rgba(217,70,239,0.12)]",
      badgeClass: "border-fuchsia-500/25 bg-fuchsia-500/10",
      heroClass: "journey-hero-surface journey-hero-surface-labs",
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
              <Sparkles size={13} className="text-violet-300" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white sm:text-xl">{t.home.journey_title}</span>
          </h2>
          <p className="ml-8 text-sm text-slate-400 sm:text-base">{t.home.journey_subtitle}</p>
        </div>

        <div className="journey-grid mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {journey.map((item) => (
            <div key={item.href} className="h-full">
              <JourneyFeatureCard keyName={item.key} {...item} />
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
                <span className="text-base font-bold tracking-tight text-white sm:text-lg">{t.home.ai_tools_heading}</span>
              </h2>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Launch the most-used AI products from one cinematic command deck.
              </p>
            </div>
            <div className="hidden rounded-full border border-violet-400/15 bg-violet-500/10 px-3 py-1 text-[11px] text-violet-200 sm:block">
              {AI_TOOLS.length} live portals
            </div>
          </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {AI_TOOLS.map((tool) => (
            <div key={tool.name} className="flex flex-col items-center gap-1">
              <a
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
              <Link
                href="/learning"
                data-event={`cta_learn_tool_${tool.learnTag}`}
                className="text-[9px] text-violet-400 transition-colors hover:text-violet-200 hover:underline"
              >
                {t.home.learn_tool}
              </Link>
            </div>
          ))}
        </div>
      </div>
      </section>
    </div>
  );
}

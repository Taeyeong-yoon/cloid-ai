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
  Sprout,
  Briefcase,
  Rocket,
  Radio,
} from "lucide-react";
import AskAI from "@/components/AskAI";
import DifficultyBadge from "@/components/DifficultyBadge";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { AI_TOOLS, POPULAR_TAGS } from "@/constants/home";

// ── 주제 태그 컴포넌트 ───────────────────────────────────────
function TopicTag({ tag, onClick }: { tag: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
    >
      {tag}
    </button>
  );
}

// ── 타입 정의 ───────────────────────────────────────────────
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

// ── 메인 컴포넌트 ────────────────────────────────────────────
export default function HomeClient({
  todayUpdate,
  contentCounts,
}: {
  todayUpdate: TodayUpdateData;
  contentCounts: ContentCounts;
}) {
  const { t } = useTranslation();
  const { user, openLoginModal } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("auth") === "required") {
      openLoginModal();
    }
  }, [searchParams, openLoginModal]);

  function handleGuardedClick(e: React.MouseEvent, href: string) {
    e.preventDefault();
    if (!user) {
      openLoginModal();
    } else {
      router.push(href);
    }
  }

  function handleTagClick(tag: string) {
    router.push(`/learning?q=${encodeURIComponent(tag)}`);
  }

  // 학습 여정 4단계
  const journey = [
    {
      step: "①",
      href: "/radar",
      label: t.home.radar_label,
      icon: Radio,
      color: "text-emerald-400",
      border: "hover:border-emerald-700",
      desc: t.home.journey_radar_desc,
      cta: t.home.radar_label + " →",
      event: "cta_journey_radar",
      guard: false,
    },
    {
      step: "②",
      href: "/learning",
      label: t.home.learning_label,
      icon: BookOpen,
      color: "text-blue-400",
      border: "hover:border-blue-700",
      desc: t.home.journey_learning_desc,
      cta: t.home.learning_label + " →",
      event: "cta_journey_learning",
      guard: false,
    },
    {
      step: "③",
      href: "/skills",
      label: t.home.skills_label,
      icon: Zap,
      color: "text-amber-400",
      border: "hover:border-amber-700",
      desc: t.home.journey_skills_desc,
      cta: t.home.skills_label + " →",
      event: "cta_journey_skills",
      guard: true,
    },
    {
      step: "④",
      href: "/labs",
      label: t.home.labs_label,
      icon: FlaskConical,
      color: "text-violet-400",
      border: "hover:border-violet-700",
      desc: t.home.journey_labs_desc,
      cta: t.home.labs_label + " →",
      event: "cta_journey_labs",
      guard: true,
    },
  ];

  return (
    <div className="space-y-10">

      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <section className="py-4 hero-glow animate-fade-in-up" style={{ animationDelay: "0ms" }}>
        <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
          <TrendingUp size={16} />
          <span>{t.home.trending_badge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
          CLOID<span className="text-violet-400">.AI</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed mb-1">
          {t.home.hero_desc}
        </p>
        <p className="text-slate-500 text-sm max-w-xl leading-relaxed mb-3">
          {t.home.hero_sub_desc}
        </p>

        {/* 소셜프루프 한 줄 */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 mb-6 text-xs sm:text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {t.home.social_proof_updated}
          </span>
          <span>📚 {t.home.content_count.replace('{n}', String(contentCounts.total))}</span>
          <span>🧪 {t.home.lab_count.replace('{n}', String(contentCounts.labs))}</span>
        </div>

        {/* 수준별 시작 경로 배너 */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-400 mb-3">{t.home.level_start_title}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Link
              href="/learning?level=beginner"
              data-event="cta_level_beginner"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-green-700 hover:bg-green-900/10 transition-all group"
            >
              <Sprout size={20} className="text-green-400 shrink-0" />
              <div>
                <div className="text-sm font-medium text-white group-hover:text-green-300 transition-colors">
                  {t.home.level_beginner_btn}
                </div>
                <div className="text-xs text-slate-500">{t.home.level_beginner_sub}</div>
              </div>
            </Link>
            <Link
              href="/skills?level=intermediate"
              onClick={(e) => handleGuardedClick(e, "/skills?level=intermediate")}
              data-event="cta_level_intermediate"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-amber-700 hover:bg-amber-900/10 transition-all group"
            >
              <Briefcase size={20} className="text-amber-400 shrink-0" />
              <div>
                <div className="text-sm font-medium text-white group-hover:text-amber-300 transition-colors">
                  {t.home.level_intermediate_btn}
                </div>
                <div className="text-xs text-slate-500">{t.home.level_intermediate_sub}</div>
              </div>
            </Link>
            <Link
              href="/labs?level=advanced"
              onClick={(e) => handleGuardedClick(e, "/labs?level=advanced")}
              data-event="cta_level_advanced"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-violet-700 hover:bg-violet-900/10 transition-all group"
            >
              <Rocket size={20} className="text-violet-400 shrink-0" />
              <div>
                <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">
                  {t.home.level_advanced_btn}
                </div>
                <div className="text-xs text-slate-500">{t.home.level_advanced_sub}</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Ask AI ────────────────────────────────────────── */}
      <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <AskAI />
      </div>

      {/* ── 3. 오늘의 업데이트 ───────────────────────────────── */}
      {(todayUpdate.radar || todayUpdate.learning || todayUpdate.lab) && (
        <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-900/40 border border-emerald-800/60">
                <Radio size={12} className="text-emerald-400" />
              </span>
              <span className="text-sm font-bold text-white tracking-tight">{t.home.today_update_title}</span>
            </h2>
            <Link
              href="/radar"
              data-event="cta_today_update_view_all"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              {t.home.today_update_view_all} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Radar 카드 */}
            {todayUpdate.radar && (
              <Link
                href="/radar"
                data-event="cta_today_radar"
                className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-emerald-700 hover:bg-slate-800/50 transition-all card-glow"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-800/50">
                    Radar
                  </span>
                  <DifficultyBadge level="beginner" />
                </div>
                <div className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                  {todayUpdate.radar.title}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2">{todayUpdate.radar.summary}</div>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {todayUpdate.radar.tags.slice(0, 2).map((tag) => (
                    <TopicTag key={tag} tag={tag} onClick={() => handleTagClick(tag)} />
                  ))}
                </div>
                <span className="text-xs text-emerald-400 group-hover:underline mt-1">
                  {t.home.radar_label} →
                </span>
              </Link>
            )}

            {/* Learning 카드 */}
            {todayUpdate.learning && (
              <Link
                href="/learning"
                data-event="cta_today_learning"
                className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-blue-700 hover:bg-slate-800/50 transition-all card-glow"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-800/50">
                    Learning
                  </span>
                  <DifficultyBadge level={todayUpdate.learning.level} />
                </div>
                <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                  {todayUpdate.learning.title}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2">{todayUpdate.learning.description}</div>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {todayUpdate.learning.tags.slice(0, 2).map((tag) => (
                    <TopicTag key={tag} tag={tag} onClick={() => handleTagClick(tag)} />
                  ))}
                </div>
                <span className="text-xs text-blue-400 group-hover:underline mt-1">
                  {t.home.learning_label} →
                </span>
              </Link>
            )}

            {/* Labs 카드 */}
            {todayUpdate.lab && (
              <Link
                href="/labs"
                onClick={(e) => handleGuardedClick(e, "/labs")}
                data-event="cta_today_lab"
                className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-violet-700 hover:bg-slate-800/50 transition-all card-glow"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-violet-400 bg-violet-900/30 px-2 py-0.5 rounded-full border border-violet-800/50">
                    Labs
                  </span>
                  <DifficultyBadge level={todayUpdate.lab.difficulty} />
                </div>
                <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors leading-snug line-clamp-2">
                  {todayUpdate.lab.title}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2">{todayUpdate.lab.description}</div>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {todayUpdate.lab.tags.slice(0, 2).map((tag) => (
                    <TopicTag key={tag} tag={tag} onClick={() => handleTagClick(tag)} />
                  ))}
                </div>
                <span className="text-xs text-violet-400 group-hover:underline mt-1">
                  {t.home.lab_start}
                </span>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── 4. 학습 여정 ─────────────────────────────────────── */}
      <section className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
        <div className="mb-4">
          <h2 className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-violet-900/40 border border-violet-800/60 text-sm">
              🗺️
            </span>
            <span className="text-sm font-bold text-white tracking-tight">{t.home.journey_title}</span>
          </h2>
          <p className="text-xs text-slate-500 ml-8">{t.home.journey_subtitle}</p>
        </div>

        {/* 4단계 흐름 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {journey.map(({ step, href, label, icon: Icon, color, border, desc, cta, event, guard }, idx) => (
            <div key={href} className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2">
              <Link
                href={href}
                onClick={guard ? (e) => handleGuardedClick(e, href) : undefined}
                data-event={event}
                className={`group flex flex-col gap-2 p-3 sm:p-4 rounded-xl border border-slate-800 bg-slate-900/50 ${border} hover:bg-slate-800/50 transition-all cursor-pointer flex-1 card-glow`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 group-hover:text-violet-400 transition-colors duration-200">{step}</span>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors leading-snug">
                    {label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                </div>
                <span className={`text-xs ${color} group-hover:underline mt-auto`}>
                  {cta}
                </span>
              </Link>
              {/* 화살표 (마지막 제외, md 이상에서만) */}
              {idx < 3 && (
                <div className="hidden md:flex items-center justify-center text-slate-600 -mx-1 mt-8">
                  <ArrowRight size={16} className="arrow-animate" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 인기 주제 태그 */}
        <div className="border-t border-slate-800 pt-4">
          <p className="text-xs text-slate-500 mb-2">🏷️ {t.home.popular_topics}</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                data-event={`cta_tag_${tag}`}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-violet-600 hover:text-violet-300 hover:bg-violet-900/20 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5+6. 로그인/이어보기 + AI 도구 바로가기 (나란히) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

        {/* 왼쪽: 로그인 유도 / 이어보기 */}
        {!user ? (
          <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 h-full">
            <p className="text-sm font-semibold text-white mb-2">
              🎯 {t.home.login_banner_title}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
              {[
                t.home.login_banner_feat1,
                t.home.login_banner_feat2,
                t.home.login_banner_feat3,
                t.home.login_banner_feat4,
              ].map((feat) => (
                <span key={feat} className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="text-green-400">✅</span> {feat}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openLoginModal}
                data-event="cta_login_banner_signup"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t.home.login_banner_cta} →
              </button>
              <button
                onClick={openLoginModal}
                data-event="cta_login_banner_login"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                {t.home.login_banner_have_account} <button onClick={openLoginModal} className="text-violet-400 hover:underline">{t.common.login}</button>
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 h-full">
            <p className="text-sm font-semibold text-white mb-3">👋 {t.home.welcome_back}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen size={14} className="text-blue-400 shrink-0" />
                  <span className="text-xs text-slate-400 shrink-0">{t.home.continue_reading}:</span>
                  <span className="text-xs text-slate-200 truncate">
                    {todayUpdate.learning?.title ?? t.home.no_content_yet}
                  </span>
                </div>
                <Link
                  href="/learning"
                  data-event="cta_welcome_continue_reading"
                  className="text-xs text-violet-400 hover:text-violet-300 hover:underline transition-colors shrink-0 ml-2"
                >
                  {t.home.continue_btn} →
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-2 min-w-0">
                  <FlaskConical size={14} className="text-violet-400 shrink-0" />
                  <span className="text-xs text-slate-400 shrink-0">{t.home.continue_lab}:</span>
                  <span className="text-xs text-slate-200 truncate">
                    {todayUpdate.lab?.title ?? t.home.no_content_yet}
                  </span>
                </div>
                <Link
                  href="/labs"
                  data-event="cta_welcome_continue_lab"
                  className="text-xs text-violet-400 hover:text-violet-300 hover:underline transition-colors shrink-0 ml-2"
                >
                  {t.home.continue_btn} →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 오른쪽: AI 도구 바로가기 (4열 2행) */}
        <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <h2 className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-900/40 border border-blue-800/60">
              <ExternalLink size={11} className="text-blue-400" />
            </span>
            <span className="text-sm font-bold text-white tracking-tight">{t.home.ai_tools_heading}</span>
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {AI_TOOLS.map((tool) => (
              <div key={tool.name} className="flex flex-col items-center gap-0.5">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1 p-2 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-800/60 transition-all w-full"
                  title={tool.desc}
                >
                  <div className={`w-7 h-7 rounded-lg ${tool.bg} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 duration-200`}>
                    {tool.icon}
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors text-center leading-tight">
                    {tool.name}
                  </span>
                </a>
                <Link
                  href="/learning"
                  data-event={`cta_learn_tool_${tool.learnTag}`}
                  className="text-[9px] text-violet-500 hover:text-violet-300 transition-colors hover:underline"
                >
                  {t.home.learn_tool}
                </Link>
              </div>
            ))}
          </div>
        </section>

      </div>


    </div>
  );
}

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
import HTMLPreview from "@/components/HTMLPreview";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

// ── 주요 AI 도구 목록 ───────────────────────────────────────
const AI_TOOLS = [
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    learnTag: "chatgpt",
    bg: "bg-[#10a37f]",
    desc: "OpenAI",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
      </svg>
    ),
  },
  {
    name: "Claude",
    url: "https://claude.ai",
    learnTag: "claude",
    bg: "bg-[#D97706]",
    desc: "Anthropic",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017L3.674 20H0L6.569 3.52zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
      </svg>
    ),
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    learnTag: "gemini",
    bg: "bg-[#4285F4]",
    desc: "Google",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    learnTag: "cursor",
    bg: "bg-[#1a1a1a]",
    desc: "AI Code Editor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    name: "Perplexity",
    url: "https://perplexity.ai",
    learnTag: "perplexity",
    bg: "bg-[#20808d]",
    desc: "AI Search",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" opacity=".2" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    name: "Midjourney",
    url: "https://midjourney.com",
    learnTag: "midjourney",
    bg: "bg-[#000]",
    desc: "AI Image",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2L2 19h20L12 2zm0 4l7 13H5l7-13z" />
      </svg>
    ),
  },
  {
    name: "Runway",
    url: "https://runwayml.com",
    learnTag: "runway",
    bg: "bg-[#3b0764]",
    desc: "AI Video",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M8 5v14l11-7z" />
      </svg>
    ),
  },
  {
    name: "Notion AI",
    url: "https://www.notion.so",
    learnTag: "notion-ai",
    bg: "bg-[#1a1a1a]",
    desc: "AI Notes",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.887l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933z" />
      </svg>
    ),
  },
];

// ── 난이도 배지 컴포넌트 ────────────────────────────────────
function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    beginner:     { label: "입문", cls: "bg-green-900/40 text-green-400 border-green-800/60" },
    intermediate: { label: "실무", cls: "bg-yellow-900/40 text-yellow-400 border-yellow-800/60" },
    advanced:     { label: "고급", cls: "bg-red-900/40 text-red-400 border-red-800/60" },
  };
  const { label, cls } = map[level] ?? map.beginner;
  return (
    <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

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

// ── 메인 컴포넌트 ────────────────────────────────────────────
export default function HomeClient({ todayUpdate }: { todayUpdate: TodayUpdateData }) {
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
    router.push(`/learning`);
  }

  // 인기 주제 태그
  const POPULAR_TAGS = ["Claude API", "MCP", "프롬프트", "AI 에이전트", "LangChain"];

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
      <section className="py-4">
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
          <span>📚 {t.home.social_proof_contents}</span>
          <span>🧪 {t.home.social_proof_labs}</span>
        </div>

        {/* 수준별 시작 경로 배너 */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-400 mb-3">{t.home.level_start_title}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a
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
            </a>
            <a
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
            </a>
            <a
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
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Ask AI (히어로 바로 아래) ─────────────────────── */}
      <AskAI />

      {/* ── 3. 오늘의 업데이트 ───────────────────────────────── */}
      {(todayUpdate.radar || todayUpdate.learning || todayUpdate.lab) && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Radio size={14} className="text-emerald-400" />
              {t.home.today_update_title}
            </h2>
            <a
              href="/radar"
              data-event="cta_today_update_view_all"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              {t.home.today_update_view_all} →
            </a>
          </div>
          <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {/* Radar 카드 */}
            {todayUpdate.radar && (
              <a
                href="/radar"
                data-event="cta_today_radar"
                className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-emerald-700 hover:bg-slate-800/50 transition-all min-w-[280px] sm:min-w-0 snap-start"
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
              </a>
            )}

            {/* Learning 카드 - 비로그인 개방 (작업 8) */}
            {todayUpdate.learning && (
              <a
                href="/learning"
                data-event="cta_today_learning"
                className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-blue-700 hover:bg-slate-800/50 transition-all min-w-[280px] sm:min-w-0 snap-start"
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
                  학습 시작 →
                </span>
              </a>
            )}

            {/* Labs 카드 */}
            {todayUpdate.lab && (
              <a
                href="/labs"
                onClick={(e) => handleGuardedClick(e, "/labs")}
                data-event="cta_today_lab"
                className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-violet-700 hover:bg-slate-800/50 transition-all min-w-[280px] sm:min-w-0 snap-start"
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
                  실습 시작 →
                </span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* ── 4. 학습 여정 ─────────────────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
            🗺️ {t.home.journey_title}
          </h2>
          <p className="text-xs text-slate-500">{t.home.journey_subtitle}</p>
        </div>

        {/* 4단계 흐름 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {journey.map(({ step, href, label, icon: Icon, color, border, desc, cta, event, guard }, idx) => (
            <div key={href} className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2">
              <a
                href={href}
                onClick={guard ? (e) => handleGuardedClick(e, href) : undefined}
                data-event={event}
                className={`group flex flex-col gap-2 p-3 sm:p-4 rounded-xl border border-slate-800 bg-slate-900/50 ${border} hover:bg-slate-800/50 transition-all cursor-pointer flex-1`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{step}</span>
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
              </a>
              {/* 화살표 (마지막 제외, md 이상에서만) */}
              {idx < 3 && (
                <div className="hidden md:flex items-center justify-center text-slate-600 -mx-1 mt-8">
                  <ArrowRight size={16} />
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
                onClick={() => router.push(`/learning`)}
                data-event={`cta_tag_${tag}`}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-violet-600 hover:text-violet-300 hover:bg-violet-900/20 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. 로그인 유도 / 이어보기 ───────────────────────── */}
      {!user ? (
        <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-2">
                🎯 {t.home.login_banner_title}
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
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
            </div>
            <div className="flex items-center gap-3 shrink-0">
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
                {t.home.login_banner_have_account} <Link href="#" className="text-violet-400 hover:underline">{t.common.login}</Link>
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
          <p className="text-sm font-semibold text-white mb-3">👋 {t.home.welcome_back}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-blue-400" />
                <span className="text-xs text-slate-400">{t.home.continue_reading}:</span>
                <span className="text-xs text-slate-200">
                  {todayUpdate.learning?.title ?? t.home.no_content_yet}
                </span>
              </div>
              <a
                href={todayUpdate.learning ? "/learning" : "/learning"}
                data-event="cta_welcome_continue_reading"
                className="text-xs text-violet-400 hover:text-violet-300 hover:underline transition-colors shrink-0"
              >
                {t.home.continue_btn} →
              </a>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-2">
                <FlaskConical size={14} className="text-violet-400" />
                <span className="text-xs text-slate-400">{t.home.continue_lab}:</span>
                <span className="text-xs text-slate-200">
                  {todayUpdate.lab?.title ?? t.home.no_content_yet}
                </span>
              </div>
              <a
                href="/labs"
                data-event="cta_welcome_continue_lab"
                className="text-xs text-violet-400 hover:text-violet-300 hover:underline transition-colors shrink-0"
              >
                {t.home.continue_btn} →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── 6. AI 도구 바로가기 ──────────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <ExternalLink size={14} />
          {t.home.ai_tools_heading}
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {AI_TOOLS.map((tool) => (
            <div key={tool.name} className="flex flex-col items-center gap-1">
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-800/60 transition-all w-full"
                title={tool.desc}
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${tool.bg} flex items-center justify-center text-white shadow-sm`}>
                  {tool.icon}
                </div>
                <span className="text-xs text-slate-400 group-hover:text-white transition-colors text-center leading-tight">
                  {tool.name}
                </span>
              </a>
              <a
                href="/learning"
                data-event={`cta_learn_tool_${tool.learnTag}`}
                className="text-[10px] text-violet-500 hover:text-violet-300 transition-colors hover:underline"
              >
                {t.home.learn_tool}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. HTML/CSS/JS 미리보기 (비로그인 체험용) ────────── */}
      <HTMLPreview />

    </div>
  );
}

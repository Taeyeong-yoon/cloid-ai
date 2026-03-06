"use client";

import Link from "next/link";
import { BookOpen, Zap, FlaskConical, ArrowRight, TrendingUp, ExternalLink } from "lucide-react";
import AskAI from "@/components/AskAI";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// 주요 AI 도구 목록 (바로가기)
const AI_TOOLS = [
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    bg: "bg-[#10a37f]",
    desc: "OpenAI",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
      </svg>
    ),
  },
  {
    name: "Claude",
    url: "https://claude.ai",
    bg: "bg-[#D97706]",
    desc: "Anthropic",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017L3.674 20H0L6.569 3.52zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"/>
      </svg>
    ),
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    bg: "bg-[#4285F4]",
    desc: "Google",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
    bg: "bg-[#1a1a1a]",
    desc: "AI 코드 에디터",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
  },
  {
    name: "Perplexity",
    url: "https://perplexity.ai",
    bg: "bg-[#20808d]",
    desc: "AI 검색",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" opacity=".2"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    name: "Midjourney",
    url: "https://midjourney.com",
    bg: "bg-[#000]",
    desc: "AI 이미지",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2L2 19h20L12 2zm0 4l7 13H5l7-13z"/>
      </svg>
    ),
  },
  {
    name: "Runway",
    url: "https://runwayml.com",
    bg: "bg-[#3b0764]",
    desc: "AI 영상",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
  },
  {
    name: "Notion AI",
    url: "https://www.notion.so",
    bg: "bg-[#1a1a1a]",
    desc: "AI 노트",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.887l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933z"/>
      </svg>
    ),
  },
];

export default function HomeClient() {
  const { t } = useTranslation();

  const sections = [
    { href: "/learning", label: t.home.learning_label, icon: BookOpen, desc: t.home.learning_desc, color: "text-blue-400", border: "hover:border-blue-700" },
    { href: "/skills", label: t.home.skills_label, icon: Zap, desc: t.home.skills_desc, color: "text-amber-400", border: "hover:border-amber-700" },
    { href: "/labs", label: t.home.labs_label, icon: FlaskConical, desc: t.home.labs_desc, color: "text-violet-400", border: "hover:border-violet-700" },
    { href: "/radar", label: t.home.radar_label, icon: TrendingUp, desc: t.home.radar_desc, color: "text-emerald-400", border: "hover:border-emerald-700" },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="py-4">
        <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
          <TrendingUp size={16} />
          <span>{t.home.trending_badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          CLOID<span className="text-violet-400">.AI</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
          {t.home.hero_desc}
        </p>
      </section>

      {/* AI 도구 바로가기 */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <ExternalLink size={14} />
          주요 AI 도구 바로가기
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {AI_TOOLS.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-800/60 transition-all"
              title={tool.desc}
            >
              <div className={`w-9 h-9 rounded-lg ${tool.bg} flex items-center justify-center text-white shadow-sm`}>
                {tool.icon}
              </div>
              <span className="text-xs text-slate-400 group-hover:text-white transition-colors text-center leading-tight">
                {tool.name}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Ask AI */}
      <AskAI />

      {/* 학습 섹션 링크 */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          학습 & 실습
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sections.map(({ href, label, icon: Icon, desc, color, border }) => (
            <Link
              key={href}
              href={href}
              className={`group flex flex-col gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 ${border} hover:bg-slate-800/50 transition-all`}
            >
              <Icon size={20} className={color} />
              <div>
                <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors leading-snug">
                  {label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 mt-auto self-end transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

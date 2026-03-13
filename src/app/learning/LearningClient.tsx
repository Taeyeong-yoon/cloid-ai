"use client";

import { useState, useRef } from "react";
import { BookOpen, FileText, Video, Terminal, ExternalLink, ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import type { LearningTopic, LearningResource } from "@/lib/types";
import TagBadge from "@/components/TagBadge";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const levelColor: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50",
  intermediate: "text-amber-400 bg-amber-900/30 border-amber-700/50",
  advanced: "text-rose-400 bg-rose-900/30 border-rose-700/50",
};

const resourceIcon = {
  doc: FileText,
  video: Video,
  practice: Terminal,
};

const levelOrder = ["beginner", "intermediate", "advanced"];

const levelMeta: Record<string, { emoji: string; label: string }> = {
  beginner: { emoji: "🌱", label: "입문" },
  intermediate: { emoji: "💼", label: "중급" },
  advanced: { emoji: "🚀", label: "고급" },
};

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?\s]+)/);
  return match ? match[1] : null;
}

function getLinkBrand(url: string): { label: string; bg: string; icon: React.ReactNode } {
  // YouTube
  if (/youtube\.com|youtu\.be/.test(url)) return {
    label: "YouTube", bg: "bg-red-600 hover:bg-red-500",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  };
  // Anthropic / Claude
  if (/anthropic\.com|claude\.ai|code\.claude\.com/.test(url)) return {
    label: "Claude", bg: "bg-[#D97706] hover:bg-[#B45309]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017L3.674 20H0L6.569 3.52zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"/></svg>,
  };
  // GitHub
  if (/github\.com/.test(url)) return {
    label: "GitHub", bg: "bg-[#24292e] hover:bg-[#373d43]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
  };
  // OpenAI
  if (/openai\.com|platform\.openai\.com/.test(url)) return {
    label: "OpenAI", bg: "bg-[#10a37f] hover:bg-[#0e8f6f]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>,
  };
  // Google / Gemini / Colab
  if (/google\.com|gemini\.google|googleapis|aistudio\.google|colab\.research/.test(url)) return {
    label: "Google", bg: "bg-[#4285F4] hover:bg-[#3367d6]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  };
  // MCP
  if (/modelcontextprotocol\.io/.test(url)) return {
    label: "MCP", bg: "bg-violet-700 hover:bg-violet-600",
    icon: <ExternalLink size={10} />,
  };
  // Supabase
  if (/supabase\.com/.test(url)) return {
    label: "Supabase", bg: "bg-[#3ecf8e] hover:bg-[#2db87a] text-black",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.285 12.63.706 13.5 1.45 13.5H12.1a.5.5 0 0 1 .5.5v9.463c.015.987 1.26 1.41 1.874.638l9.262-11.652c.48-.579.059-1.448-.686-1.448H12.4a.5.5 0 0 1-.5-.5V1.036z"/></svg>,
  };
  // Vercel
  if (/vercel\.com/.test(url)) return {
    label: "Vercel", bg: "bg-black hover:bg-slate-800",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>,
  };
  return {
    label: "바로가기", bg: "bg-slate-700 hover:bg-slate-600",
    icon: <ExternalLink size={10} />,
  };
}

function VideoCard({ r }: { r: LearningResource }) {
  const [active, setActive] = useState(false);
  const videoId = r.url ? getYouTubeId(r.url) : null;
  const searchKeyword = r.search_keyword || r.title;

  return (
    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/40">
      <div className="flex items-start gap-3 mb-3">
        <Video size={16} className="text-violet-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-white text-sm">{r.title}</span>
          {r.description && <p className="text-xs text-slate-400 mt-1">{r.description}</p>}
        </div>
      </div>

      {/* URL 없음 → 유튜브 검색 버튼 */}
      {!videoId && (
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchKeyword)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors w-full"
        >
          <Search size={12} className="text-red-400" />
          <span>유튜브 검색: <span className="text-red-400">{searchKeyword}</span></span>
        </a>
      )}

      {/* URL 있고 비활성 → 썸네일 */}
      {videoId && !active && (
        <div
          className="relative cursor-pointer rounded-lg overflow-hidden group"
          style={{ aspectRatio: "16/9" }}
          onClick={() => setActive(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={r.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* URL 있고 활성 → iframe */}
      {videoId && active && (
        <div className="rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            loading="lazy"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

function ResourceCard({ r }: { r: LearningResource }) {
  if (r.type === "video") return <VideoCard r={r} />;

  const Icon = resourceIcon[r.type];
  const brand = r.url ? getLinkBrand(r.url) : null;
  return (
    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/40">
      <div className="flex items-start gap-3">
        <Icon size={16} className="text-violet-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{r.title}</span>
            {r.url && brand && (
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-white transition-colors shrink-0 ${brand.bg}`}
              >
                {brand.icon}
                {brand.label}
              </a>
            )}
          </div>
          {r.description && <p className="text-xs text-slate-400 mb-2">{r.description}</p>}
          {r.command && (
            <code className="block text-xs bg-slate-800 text-emerald-300 px-3 py-1.5 rounded font-mono">
              {r.command}
            </code>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LearningClient({ topics }: { topics: LearningTopic[] }) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const topic = topics.find((tp) => tp.id === selectedId);

  // 레벨별 아코디언 열림 상태 (기본: 모두 열림)
  const [openLevels, setOpenLevels] = useState<Record<string, boolean>>({
    beginner: true,
    intermediate: true,
    advanced: true,
  });

  function toggleLevel(level: string) {
    setOpenLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  }

  function handleTopicSelect(topicId: string) {
    setSelectedId(topicId);
    if (window.innerWidth < 768) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }

  const levelLabel: Record<string, string> = {
    beginner: t.common.level_beginner,
    intermediate: t.common.level_intermediate,
    advanced: t.common.level_advanced,
  };

  // 레벨별 토픽 그룹
  const grouped = levelOrder.reduce<Record<string, LearningTopic[]>>((acc, level) => {
    acc[level] = topics.filter((tp) => tp.level === level);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.learning.title}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className={`md:w-64 shrink-0 ${selectedId ? "hidden md:block" : "block"}`}>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 px-1">
            {t.learning.topics_sidebar}
          </p>

          {/* 레벨별 아코디언 */}
          <div className="space-y-2">
            {levelOrder.map((level) => {
              const levelTopics = grouped[level] || [];
              if (levelTopics.length === 0) return null;
              const isOpen = openLevels[level];
              const meta = levelMeta[level];
              const hasSelected = levelTopics.some((tp) => tp.id === selectedId);

              return (
                <div key={level} className="rounded-lg border border-slate-800 overflow-hidden">
                  {/* 섹션 헤더 */}
                  <button
                    onClick={() => toggleLevel(level)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors ${
                      hasSelected
                        ? "bg-violet-900/20 text-white"
                        : "bg-slate-900/50 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <span>{meta.emoji}</span>
                      <span>{meta.label}</span>
                      <span className={`text-xs font-normal px-1.5 py-0.5 rounded border ${levelColor[level]}`}>
                        {levelTopics.length}
                      </span>
                    </span>
                    {isOpen
                      ? <ChevronUp size={14} className="text-slate-500 shrink-0" />
                      : <ChevronDown size={14} className="text-slate-500 shrink-0" />
                    }
                  </button>

                  {/* 토픽 목록 */}
                  {isOpen && (
                    <div className="py-1 space-y-0.5 bg-slate-900/20">
                      {levelTopics.map((tp) => (
                        <button
                          key={tp.id}
                          onClick={() => handleTopicSelect(tp.id)}
                          className={`w-full text-left px-4 py-2.5 transition-all text-sm ${
                            selectedId === tp.id
                              ? "bg-violet-900/40 text-white border-l-2 border-violet-500"
                              : "text-slate-400 hover:bg-slate-800/50 hover:text-white border-l-2 border-transparent"
                          }`}
                        >
                          {tp.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {topic && (
          <div ref={contentRef} className="flex-1 min-w-0">
            <button
              onClick={() => setSelectedId(null)}
              className="md:hidden flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              {t.learning.back_to_topics}
            </button>
            <div className="p-5 sm:p-6 rounded-xl border border-slate-800 bg-slate-900/30">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{topic.title}</h2>
                  <p className="text-slate-400 text-sm">{topic.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded border shrink-0 ${levelColor[topic.level]}`}>
                  {levelLabel[topic.level]}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {topic.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  {t.learning.resources_heading}
                </h3>
                {topic.resources.map((r, i) => <ResourceCard key={i} r={r} />)}
              </div>
            </div>
          </div>
        )}

        {!selectedId && (
          <div className="hidden md:flex flex-1 items-center justify-center h-64 text-slate-500 border border-slate-800 rounded-xl">
            {t.learning.select_topic}
          </div>
        )}
      </div>
    </div>
  );
}

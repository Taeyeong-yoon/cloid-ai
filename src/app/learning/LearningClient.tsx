"use client";

import { useState } from "react";
import { BookOpen, FileText, Video, Terminal, ExternalLink, ArrowLeft, Search } from "lucide-react";
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

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?\s]+)/);
  return match ? match[1] : null;
}

function getLinkBrand(url: string): { label: string; bg: string; icon: React.ReactNode } {
  if (/youtube\.com|youtu\.be/.test(url)) {
    return {
      label: "YouTube",
      bg: "bg-red-600 hover:bg-red-500",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    };
  }
  if (/anthropic\.com/.test(url)) {
    return {
      label: "Claude 공식문서",
      bg: "bg-[#D97706] hover:bg-[#B45309]",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
          <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017L3.674 20H0L6.569 3.52zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"/>
        </svg>
      ),
    };
  }
  if (/github\.com/.test(url)) {
    return {
      label: "GitHub",
      bg: "bg-slate-700 hover:bg-slate-600",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    };
  }
  if (/modelcontextprotocol\.io/.test(url)) {
    return {
      label: "MCP 공식",
      bg: "bg-violet-700 hover:bg-violet-600",
      icon: <ExternalLink size={10} />,
    };
  }
  return {
    label: "링크",
    bg: "bg-slate-700 hover:bg-slate-600",
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
  const topic = topics.find((tp) => tp.id === selectedId);

  const levelLabel: Record<string, string> = {
    beginner: t.common.level_beginner,
    intermediate: t.common.level_intermediate,
    advanced: t.common.level_advanced,
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.learning.title}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className={`md:w-64 shrink-0 space-y-2 ${selectedId ? "hidden md:block" : "block"}`}>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 px-1">
            {t.learning.topics_sidebar}
          </p>
          {topics.map((tp) => (
            <button
              key={tp.id}
              onClick={() => setSelectedId(tp.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                selectedId === tp.id
                  ? "bg-violet-900/40 border-violet-600 text-white"
                  : "bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white"
              }`}
            >
              <div className="text-sm font-medium">{tp.title}</div>
              <div className={`text-xs mt-1 inline-block px-1.5 py-0.5 rounded border ${levelColor[tp.level]}`}>
                {levelLabel[tp.level]}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        {topic && (
          <div className="flex-1 min-w-0">
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

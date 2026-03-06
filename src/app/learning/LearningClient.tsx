"use client";

import { useState } from "react";
import { BookOpen, FileText, Video, Terminal, ExternalLink, ArrowLeft } from "lucide-react";
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

function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

function ResourceCard({ r }: { r: LearningResource }) {
  const Icon = resourceIcon[r.type];
  const isYT = r.url && isYouTubeUrl(r.url);
  return (
    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/40">
      <div className="flex items-start gap-3">
        <Icon size={16} className="text-violet-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{r.title}</span>
            {r.url && (
              isYT ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors shrink-0"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              ) : (
                <a href={r.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-violet-400">
                  <ExternalLink size={12} />
                </a>
              )
            )}
          </div>
          <p className="text-xs text-slate-400 mb-2">{r.description}</p>
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

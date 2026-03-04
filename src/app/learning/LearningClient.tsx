"use client";

import { useState } from "react";
import { BookOpen, FileText, Video, Terminal, ExternalLink } from "lucide-react";
import type { LearningTopic, LearningResource } from "@/lib/types";
import TagBadge from "@/components/TagBadge";

const levelLabel: Record<string, string> = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
};

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

function ResourceCard({ r }: { r: LearningResource }) {
  const Icon = resourceIcon[r.type];
  return (
    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/40">
      <div className="flex items-start gap-3">
        <Icon size={16} className="text-violet-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{r.title}</span>
            {r.url && (
              <a href={r.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-violet-400">
                <ExternalLink size={12} />
              </a>
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
  const [selectedId, setSelectedId] = useState(topics[0]?.id ?? "");
  const topic = topics.find((t) => t.id === selectedId);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">주제별 학습</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-64 shrink-0 space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 px-1">학습 토픽</p>
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                selectedId === t.id
                  ? "bg-violet-900/40 border-violet-600 text-white"
                  : "bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white"
              }`}
            >
              <div className="text-sm font-medium">{t.title}</div>
              <div className={`text-xs mt-1 inline-block px-1.5 py-0.5 rounded border ${levelColor[t.level]}`}>
                {levelLabel[t.level]}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        {topic && (
          <div className="flex-1 min-w-0">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30">
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
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">학습 자료</h3>
                {topic.resources.map((r, i) => <ResourceCard key={i} r={r} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

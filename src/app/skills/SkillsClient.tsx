"use client";

import { useState } from "react";
import { Zap, ArrowLeft } from "lucide-react";
import type { Skill } from "@/lib/types";
import SearchFilter from "@/components/SearchFilter";
import TagBadge from "@/components/TagBadge";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const difficultyColor: Record<string, string> = {
  beginner: "text-emerald-400",
  intermediate: "text-amber-400",
  advanced: "text-rose-400",
};

interface Props {
  skills: Skill[];
  allTags: string[];
}

export default function SkillsClient({ skills, allTags }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selected, setSelected] = useState<Skill | null>(null);

  const difficultyLabel: Record<string, string> = {
    beginner: t.common.level_beginner,
    intermediate: t.common.level_intermediate,
    advanced: t.common.level_advanced,
  };

  const filtered = skills.filter((s) => {
    const matchQ =
      !query ||
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.summary.toLowerCase().includes(query.toLowerCase());
    const matchT = activeTags.length === 0 || activeTags.every((tag) => s.tags.includes(tag));
    return matchQ && matchT;
  });

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((tg) => tg !== tag) : [...prev, tag]
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Zap size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.skills.title}</h1>
        <span className="ml-auto text-sm text-slate-500">
          {filtered.length}{t.skills.count}
        </span>
      </div>

      <SearchFilter
        allTags={allTags}
        onSearchChange={setQuery}
        onTagToggle={toggleTag}
        activeTags={activeTags}
        query={query}
        placeholder={t.common.search_placeholder}
      />

      {/* 모바일: 상세보기 */}
      {selected && (
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            {t.common.back_to_list}
          </button>
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-xl font-bold text-white">{selected.title}</h2>
              <span className={`text-sm shrink-0 ${difficultyColor[selected.difficulty]}`}>
                {difficultyLabel[selected.difficulty]}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-4">{selected.summary}</p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {selected.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
            </div>
            <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans">
              {selected.content}
            </pre>
          </div>
        </div>
      )}

      {/* 목록 + 상세 (데스크톱) */}
      <div className={`flex gap-6 ${selected ? "hidden md:flex" : "flex flex-col md:flex-row"}`}>
        <div className="md:w-72 shrink-0 space-y-2">
          {filtered.map((skill) => (
            <button
              key={skill.slug}
              onClick={() => setSelected(skill)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected?.slug === skill.slug
                  ? "bg-violet-900/40 border-violet-600"
                  : "bg-slate-900/30 border-slate-800 hover:border-slate-600"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-white">{skill.title}</span>
                <span className={`text-xs shrink-0 ${difficultyColor[skill.difficulty] ?? "text-slate-400"}`}>
                  {difficultyLabel[skill.difficulty] ?? skill.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">{skill.summary}</p>
              <div className="flex flex-wrap gap-1">
                {skill.tags.slice(0, 3).map((tag) => <TagBadge key={tag} tag={tag} />)}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-slate-500 py-8">{t.common.no_results}</p>
          )}
        </div>

        <div className="hidden md:block flex-1 min-w-0">
          {selected ? (
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 sticky top-20">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                <span className={`text-sm ${difficultyColor[selected.difficulty]}`}>
                  {difficultyLabel[selected.difficulty]}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4">{selected.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {selected.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
              </div>
              <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed font-sans">
                {selected.content}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-500 border border-slate-800 rounded-xl">
              {t.skills.select_skill}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

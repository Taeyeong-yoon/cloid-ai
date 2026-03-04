"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import type { Skill } from "@/lib/types";
import SearchFilter from "@/components/SearchFilter";
import TagBadge from "@/components/TagBadge";

const difficultyLabel: Record<string, string> = {
  beginner: "입문",
  intermediate: "중급",
  advanced: "고급",
};

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
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selected, setSelected] = useState<Skill | null>(null);

  const filtered = skills.filter((s) => {
    const matchQ = !query || s.title.toLowerCase().includes(query.toLowerCase()) || s.summary.toLowerCase().includes(query.toLowerCase());
    const matchT = activeTags.length === 0 || activeTags.every((t) => s.tags.includes(t));
    return matchQ && matchT;
  });

  function toggleTag(tag: string) {
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Zap size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">스킬 레시피</h1>
        <span className="ml-auto text-sm text-slate-500">{filtered.length}개</span>
      </div>

      <SearchFilter allTags={allTags} onSearchChange={setQuery} onTagToggle={toggleTag} activeTags={activeTags} query={query} />

      <div className="flex flex-col md:flex-row gap-6">
        {/* List */}
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
            <p className="text-center text-slate-500 py-8">검색 결과가 없습니다.</p>
          )}
        </div>

        {/* Detail */}
        <div className="flex-1 min-w-0">
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
              왼쪽에서 스킬을 선택하세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Radar, ChevronDown, ChevronUp } from "lucide-react";
import type { RadarPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import SearchFilter from "@/components/SearchFilter";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface Props {
  posts: RadarPost[];
  allTags: string[];
}

const CATEGORY_CONFIG: { key: string; icon: string; label: string }[] = [
  { key: "Anthropic",        icon: "🔶", label: "Anthropic — Claude & Claude Code" },
  { key: "OpenAI",           icon: "🤖", label: "OpenAI — GPT / o3 / Sora" },
  { key: "Google",           icon: "🔷", label: "Google — Gemini / Veo" },
  { key: "Video & Music",    icon: "🎬", label: "Video & Music AI" },
  { key: "Tools & Platforms",icon: "🛠️", label: "Tools & Platforms" },
];

export default function RadarClient({ posts, allTags }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORY_CONFIG.map((c) => [c.key, true]))
  );

  const filtered = posts.filter(
    (p) =>
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.summary.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const grouped: Record<string, RadarPost[]> = {};
  for (const post of filtered) {
    const cat = post.category ?? "Tools & Platforms";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(post);
  }

  function toggleCategory(key: string) {
    setOpenCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Radar size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.radar.title}</h1>
        <span className="ml-auto text-sm text-slate-500">
          {filtered.length} {t.radar.count}
        </span>
      </div>

      <SearchFilter
        allTags={[]}
        onSearchChange={setQuery}
        onTagToggle={() => {}}
        activeTags={[]}
        query={query}
        placeholder={t.common.search_placeholder}
      />

      <div className="space-y-3">
        {CATEGORY_CONFIG.map(({ key, icon, label }) => {
          const items = grouped[key];
          if (!items || items.length === 0) return null;
          const isOpen = openCategories[key] ?? true;

          return (
            <div key={key} className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
              {/* Accordion header */}
              <button
                onClick={() => toggleCategory(key)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors text-left"
              >
                <span className="text-lg leading-none">{icon}</span>
                <span className="font-semibold text-white text-sm">{label}</span>
                <span className="ml-2 text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
                <span className="ml-auto text-slate-500">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>

              {/* Accordion body */}
              {isOpen && (
                <div className="border-t border-slate-800/60 grid md:grid-cols-2 gap-3 p-3">
                  {items.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/radar/${post.slug}`}
                      className="group p-4 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-violet-700/50 hover:bg-slate-800/50 transition-all"
                    >
                      <div className="text-xs text-slate-500 mb-1.5">{formatDate(post.date)}</div>
                      <h2 className="font-semibold text-white group-hover:text-violet-300 transition-colors mb-2 text-sm leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-xs text-slate-400 line-clamp-2">{post.summary}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">{t.common.no_results}</p>
        )}
      </div>
    </div>
  );
}

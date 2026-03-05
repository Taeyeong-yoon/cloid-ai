"use client";

import { useState } from "react";
import Link from "next/link";
import { Radar } from "lucide-react";
import type { RadarPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import SearchFilter from "@/components/SearchFilter";
import TagBadge from "@/components/TagBadge";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface Props {
  posts: RadarPost[];
  allTags: string[];
}

export default function RadarClient({ posts, allTags }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const filtered = posts.filter((p) => {
    const matchQ =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.summary.toLowerCase().includes(query.toLowerCase());
    const matchT = activeTags.length === 0 || activeTags.every((tag) => p.tags.includes(tag));
    return matchQ && matchT;
  });

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Radar size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.radar.title}</h1>
        <span className="ml-auto text-sm text-slate-500">
          {filtered.length}{t.radar.count}
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

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/radar/${post.slug}`}
            className="group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/40 transition-all"
          >
            <div className="text-xs text-slate-500 mb-2">{formatDate(post.date)}</div>
            <h2 className="font-semibold text-white group-hover:text-violet-300 transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-sm text-slate-400 line-clamp-2 mb-3">{post.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center text-slate-500 py-12">{t.common.no_results}</p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Radar, ChevronDown, ChevronUp } from "lucide-react";
import type { RadarPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import SearchFilter from "@/components/SearchFilter";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface Props {
  posts: RadarPost[];
}

const CATEGORY_STYLE: Record<string, string> = {
  Anthropic: "border-orange-500/25 bg-orange-500/10 text-orange-200",
  OpenAI: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
  Google: "border-blue-500/25 bg-blue-500/10 text-blue-200",
  "Video & Music": "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200",
  "Tools & Platforms": "border-slate-600/40 bg-slate-700/20 text-slate-300",
};

/** 2026-08-11 → { key: "2026-08", ko: "2026년 8월", en: "August 2026" } */
function monthOf(date: string) {
  const key = date.slice(0, 7);
  const [y, m] = key.split("-");
  const monthIndex = Number(m) - 1;
  const enMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return {
    key,
    ko: `${y}년 ${Number(m)}월`,
    en: `${enMonths[monthIndex] ?? m} ${y}`,
  };
}

export default function TrendsClient({ posts }: Props) {
  const { locale, t } = useTranslation();
  const ko = locale === "ko";
  const [query, setQuery] = useState("");
  const [closedMonths, setClosedMonths] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
    );
  }, [posts, query]);

  // 월별 그룹 (최신 달 우선)
  const groups = useMemo(() => {
    const map = new Map<string, { label: { ko: string; en: string }; items: RadarPost[] }>();
    for (const post of filtered) {
      const month = monthOf(post.date);
      if (!map.has(month.key)) {
        map.set(month.key, { label: { ko: month.ko, en: month.en }, items: [] });
      }
      map.get(month.key)!.items.push(post);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  function toggleMonth(key: string) {
    setClosedMonths((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Radar size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.radar.title}</h1>
        <span className="ml-auto text-sm text-slate-500">
          {filtered.length} {t.radar.count}
        </span>
      </div>
      <p className="mb-6 text-sm text-slate-400">
        {ko
          ? "Anthropic 릴리스와 주요 AI 뉴스를 매일 자동으로 수집해 월별로 정리합니다."
          : "Anthropic releases and major AI news, collected automatically every day and archived by month."}
      </p>

      <SearchFilter
        allTags={[]}
        onSearchChange={setQuery}
        onTagToggle={() => {}}
        activeTags={[]}
        query={query}
        placeholder={t.common.search_placeholder}
      />

      <div className="space-y-3">
        {groups.map(([key, group], groupIndex) => {
          // 검색 중이거나 최근 2개월은 펼친 상태로 시작
          const defaultOpen = Boolean(query) || groupIndex < 2;
          const isOpen = closedMonths[key] === undefined ? defaultOpen : !closedMonths[key];

          return (
            <div key={key} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30">
              <button
                onClick={() => toggleMonth(key)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-800/50"
              >
                <span className="text-sm font-semibold text-white">
                  {ko ? group.label.ko : group.label.en}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
                  {group.items.length}
                </span>
                <span className="ml-auto text-slate-500">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>

              {isOpen && (
                <div className="grid gap-3 border-t border-slate-800/60 p-3 md:grid-cols-2">
                  {group.items.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/trends/${post.slug}`}
                      className="group rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-violet-700/50 hover:bg-slate-800/50"
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="text-xs text-slate-500">{formatDate(post.date)}</span>
                        {post.category && (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] ${
                              CATEGORY_STYLE[post.category] ?? CATEGORY_STYLE["Tools & Platforms"]
                            }`}
                          >
                            {post.category}
                          </span>
                        )}
                      </div>
                      <h2 className="mb-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-violet-300">
                        {post.title}
                      </h2>
                      <p className="line-clamp-2 text-xs text-slate-400">{post.summary}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="py-12 text-center text-slate-500">{t.common.no_results}</p>
        )}
      </div>
    </div>
  );
}

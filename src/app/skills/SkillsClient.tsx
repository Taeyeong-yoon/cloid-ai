"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ArrowLeft, Copy, Check, X, Cpu, Zap, Calendar } from "lucide-react";
import type { Skill } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import FloatingTutor from "@/components/FloatingTutor";

// ─── 카테고리 설정 ────────────────────────────────────────────
const CATEGORY_CONFIG = [
  {
    key: "all",
    labelKo: "전체",
    labelEn: "All",
    icon: null,
    color: "text-slate-300",
    bg: "bg-slate-700",
    border: "border-slate-600",
  },
  {
    key: "features",
    labelKo: "기본 기능",
    labelEn: "Core Features",
    icon: Cpu,
    color: "text-violet-300",
    bg: "bg-violet-900/60",
    border: "border-violet-700",
  },
  {
    key: "usecases",
    labelKo: "활용 사례",
    labelEn: "Use Cases",
    icon: Zap,
    color: "text-amber-300",
    bg: "bg-amber-900/60",
    border: "border-amber-700",
  },
] as const;
type CategoryKey = (typeof CATEGORY_CONFIG)[number]["key"];

// ─── 난이도 설정 ───────────────────────────────────────────────
const DIFFICULTY_CONFIG = [
  { key: "all", color: "text-slate-300", bg: "bg-slate-700", border: "border-slate-600" },
  { key: "beginner", color: "text-emerald-300", bg: "bg-emerald-900/60", border: "border-emerald-700" },
  { key: "intermediate", color: "text-amber-300", bg: "bg-amber-900/60", border: "border-amber-700" },
  { key: "advanced", color: "text-rose-300", bg: "bg-rose-900/60", border: "border-rose-700" },
] as const;
type DifficultyKey = (typeof DIFFICULTY_CONFIG)[number]["key"];

// ─── 마크다운 렌더러 ──────────────────────────────────────────
function MarkdownContent({ raw }: { raw: string }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function copyCode(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  const lines = raw.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let codeBlockIdx = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      const code = codeLines.join("\n");
      const idx = codeBlockIdx++;
      elements.push(
        <div key={`code-${idx}`} className="relative group my-3">
          {lang && <span className="absolute top-2.5 left-3 text-xs text-slate-500 font-mono">{lang}</span>}
          <button
            onClick={() => copyCode(code, idx)}
            className="absolute top-2 right-2 p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            title="복사"
          >
            {copiedIdx === idx ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
          <pre className={`bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 overflow-x-auto text-sm font-mono text-emerald-300 leading-relaxed ${lang ? "pt-7" : ""}`}>
            {code}
          </pre>
        </div>
      );
      i++;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={`hr-${i}`} className="border-slate-800 my-4" />);
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-base font-bold text-white mt-6 mb-2">{line.slice(3)}</h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm font-semibold text-slate-200 mt-4 mb-1.5">{line.slice(4)}</h3>
      );
      i++;
      continue;
    }

    // 테이블 파싱
    if (line.trim().startsWith("|")) {
      const tableRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        if (/^\|[-\s|]+\|$/.test(lines[i].trim())) { i++; continue; }
        const cells = lines[i].trim().slice(1, -1).split("|").map(c => c.trim());
        tableRows.push(cells);
        i++;
      }
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {tableRows[0].map((cell, j) => (
                    <th key={j} className="text-left px-3 py-2 bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/20"}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 text-slate-300 border border-slate-800 text-xs leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    const listItems: string[] = [];
    let isOrdered = false;
    if (/^(\d+\.|-)/.test(line.trim())) {
      isOrdered = /^\d+\./.test(line.trim());
      while (i < lines.length && /^(\d+\.|-)/.test(lines[i].trim())) {
        const text = lines[i].trim().replace(/^(\d+\.|-)/, "").trim();
        listItems.push(text);
        i++;
      }
      const Tag = isOrdered ? "ol" : "ul";
      elements.push(
        <Tag key={`list-${i}`} className={`space-y-1.5 my-2 ${isOrdered ? "list-decimal list-inside" : ""}`}>
          {listItems.map((item, j) => (
            <li key={j} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
              {!isOrdered && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />}
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </Tag>
      );
      continue;
    }

    if (line.trim() === "") { i++; continue; }

    elements.push(
      <p key={`p-${i}`} className="text-sm text-slate-400 leading-relaxed my-1.5"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-200 font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-violet-400 hover:text-violet-300 underline underline-offset-2">$1</a>');
}

// ─── 허브 카드 ─────────────────────────────────────────────────
function HubCard({ skill, selected, onClick, locale }: {
  skill: Skill; selected: boolean; onClick: () => void; locale: string;
}) {
  const diff = DIFFICULTY_CONFIG.find((d) => d.key === skill.difficulty) ?? DIFFICULTY_CONFIG[1];
  const cat = CATEGORY_CONFIG.find((c) => c.key === skill.category) ?? CATEGORY_CONFIG[1];
  const CatIcon = cat.icon;

  const diffLabel: Record<string, string> = {
    beginner: locale === "ko" ? "입문" : "Beginner",
    intermediate: locale === "ko" ? "실전" : "Practical",
    advanced: locale === "ko" ? "고급" : "Advanced",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 group ${
        selected
          ? "bg-violet-950/60 border-violet-600 shadow-lg shadow-violet-900/20"
          : "bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/40"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {CatIcon && (
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cat.bg} ${cat.color} ${cat.border} border`}>
              <CatIcon size={10} />
              {locale === "ko" ? (skill.category === "features" ? "기본 기능" : "활용 사례") : (skill.category === "features" ? "Feature" : "Use Case")}
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.bg} ${diff.color} ${diff.border} border`}>
            {diffLabel[skill.difficulty] ?? skill.difficulty}
          </span>
        </div>
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />}
      </div>

      <h3 className={`text-sm font-semibold mb-1 leading-snug transition-colors ${selected ? "text-white" : "text-slate-200 group-hover:text-white"}`}>
        {skill.title}
      </h3>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{skill.summary}</p>

      <div className="flex items-center justify-between mt-2.5 gap-2">
        <div className="flex flex-wrap gap-1">
          {skill.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
              {tag}
            </span>
          ))}
        </div>
        {skill.updated && (
          <span className="flex items-center gap-1 text-[10px] text-slate-600 shrink-0">
            <Calendar size={9} />
            {skill.updated}
          </span>
        )}
      </div>
    </button>
  );
}

// ─── 상세 패널 ────────────────────────────────────────────────
const NAV_H = 56;
const PANEL_GAP = 16;

function HubDetail({ skill, onClose, stickyRef, locale }: {
  skill: Skill; onClose: () => void; stickyRef?: React.RefObject<HTMLDivElement | null>; locale: string;
}) {
  const diff = DIFFICULTY_CONFIG.find((d) => d.key === skill.difficulty) ?? DIFFICULTY_CONFIG[1];
  const cat = CATEGORY_CONFIG.find((c) => c.key === skill.category) ?? CATEGORY_CONFIG[1];
  const CatIcon = cat.icon;

  const diffLabel: Record<string, string> = {
    beginner: locale === "ko" ? "입문" : "Beginner",
    intermediate: locale === "ko" ? "실전" : "Practical",
    advanced: locale === "ko" ? "고급" : "Advanced",
  };

  const content = skill.content.replace(/^---[\s\S]*?---\n?/, "").trim();

  return (
    <div className="flex-1 min-w-0">
      <div ref={stickyRef} className="sticky top-[4.5rem]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {CatIcon && (
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${cat.bg} ${cat.color} ${cat.border} border`}>
                      <CatIcon size={11} />
                      {locale === "ko" ? (skill.category === "features" ? "기본 기능" : "활용 사례") : (skill.category === "features" ? "Core Feature" : "Use Case")}
                    </span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${diff.bg} ${diff.color} ${diff.border} border`}>
                    {diffLabel[skill.difficulty] ?? skill.difficulty}
                  </span>
                  {skill.updated && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar size={11} />
                      {skill.updated}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white leading-snug mb-1.5">{skill.title}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{skill.summary}</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {skill.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="px-6 py-5 max-h-[calc(100vh-14rem)] overflow-y-auto">
            <MarkdownContent raw={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 ─────────────────────────────────────────────────────
export default function SkillsClient({ skills }: { skills: Skill[] }) {
  const { locale, t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryKey>("all");
  const [difficulty, setDifficulty] = useState<DifficultyKey>("all");
  const [selected, setSelected] = useState<Skill | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected || typeof window === "undefined" || window.innerWidth < 768) return;
    const frame = requestAnimationFrame(() => {
      if (!detailRef.current) return;
      const rect = detailRef.current.getBoundingClientRect();
      if (rect.top < NAV_H) {
        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
        window.scrollTo({ top: window.scrollY + rect.top - NAV_H - PANEL_GAP, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [selected?.slug]);

  const counts = useMemo(() => ({
    all: skills.length,
    features: skills.filter((s) => s.category === "features").length,
    usecases: skills.filter((s) => s.category === "usecases").length,
  }), [skills]);

  const DIFF_ORDER: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };

  const filtered = useMemo(() => skills
    .filter((s) => {
      const matchC = category === "all" || s.category === category;
      const matchD = difficulty === "all" || s.difficulty === difficulty;
      const matchQ =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.summary.toLowerCase().includes(query.toLowerCase()) ||
        s.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      return matchC && matchD && matchQ;
    })
    .sort((a, b) => (DIFF_ORDER[a.difficulty] ?? 1) - (DIFF_ORDER[b.difficulty] ?? 1)),
    [skills, category, difficulty, query]
  );

  function handleSelect(skill: Skill) {
    setSelected((prev) => (prev?.slug === skill.slug ? null : skill));
  }

  const hubTitle = locale === "ko" ? "클로드 허브" : "Claude Hub";
  const hubDesc = locale === "ko"
    ? "Claude 기능 가이드와 실전 활용 사례를 한 곳에서"
    : "Claude feature guides and real-world use cases in one place";

  const tutorTitle = selected?.title ?? hubTitle;
  const tutorSummary = selected?.summary ?? hubDesc;
  const tutorDetails = selected
    ? [
        `Category: ${selected.category}`,
        `Difficulty: ${selected.difficulty}`,
        selected.content.replace(/^---[\s\S]*?---\n?/, "").trim().slice(0, 900),
      ]
    : filtered.slice(0, 5).map((s) => `${s.title}: ${s.summary}`);

  const diffLabelMap: Record<string, string> = {
    all: locale === "ko" ? "전체" : "All",
    beginner: locale === "ko" ? "입문" : "Beginner",
    intermediate: locale === "ko" ? "실전" : "Practical",
    advanced: locale === "ko" ? "고급" : "Advanced",
  };
  const diffCounts: Record<string, number> = {
    all: (category === "all" ? skills : skills.filter(s => s.category === category)).length,
    beginner: (category === "all" ? skills : skills.filter(s => s.category === category)).filter(s => s.difficulty === "beginner").length,
    intermediate: (category === "all" ? skills : skills.filter(s => s.category === category)).filter(s => s.difficulty === "intermediate").length,
    advanced: (category === "all" ? skills : skills.filter(s => s.category === category)).filter(s => s.difficulty === "advanced").length,
  };

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-900/40 border border-violet-700/40">
            <Cpu size={16} className="text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{hubTitle}</h1>
        </div>
        <p className="ml-10 text-sm text-slate-400">{hubDesc}</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {CATEGORY_CONFIG.map((cat) => {
          const CatIcon = cat.icon;
          const isActive = category === cat.key;
          const count = cat.key === "all" ? counts.all : counts[cat.key as "features" | "usecases"];
          return (
            <button
              key={cat.key}
              onClick={() => { setCategory(cat.key); setSelected(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                isActive
                  ? `${cat.bg} ${cat.color} ${cat.border} shadow-sm`
                  : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              {CatIcon && <CatIcon size={14} />}
              {cat.key === "all"
                ? (locale === "ko" ? "전체" : "All")
                : (locale === "ko" ? cat.labelKo : cat.labelEn)}
              <span className={`text-xs ${isActive ? "opacity-80" : "opacity-50"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* 컨트롤: 난이도 + 검색 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {DIFFICULTY_CONFIG.map((d) => (
            <button
              key={d.key}
              onClick={() => { setDifficulty(d.key); setSelected(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                difficulty === d.key
                  ? `${d.bg} ${d.color} ${d.border} border shadow-sm`
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {diffLabelMap[d.key]}
              <span className={`text-xs ${difficulty === d.key ? "opacity-80" : "opacity-50"}`}>
                {diffCounts[d.key] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-0 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={locale === "ko" ? "검색..." : "Search..."}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
            className="w-full h-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-600 transition-colors"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          {locale === "ko" ? "결과가 없습니다." : "No results found."}
        </div>
      )}

      {/* 레이아웃 */}
      <div className="flex gap-5 items-start">
        <div className={`shrink-0 space-y-2 transition-all duration-200 ${selected ? "w-72 hidden md:block" : "w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 space-y-0"}`}>
          {filtered.map((skill) => (
            <HubCard
              key={skill.slug}
              skill={skill}
              selected={selected?.slug === skill.slug}
              onClick={() => handleSelect(skill)}
              locale={locale}
            />
          ))}
        </div>

        {selected && (
          <>
            <div className="md:hidden fixed inset-0 z-40 bg-slate-950/95 overflow-y-auto p-4">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={16} />
                {locale === "ko" ? "목록으로" : "Back to list"}
              </button>
              <HubDetail skill={selected} onClose={() => setSelected(null)} locale={locale} />
            </div>
            <HubDetail skill={selected} onClose={() => setSelected(null)} stickyRef={detailRef} locale={locale} />
          </>
        )}
      </div>

      <FloatingTutor
        scope="skills"
        contextTitle={tutorTitle}
        contextSummary={tutorSummary}
        contextDetails={tutorDetails}
      />
    </div>
  );
}

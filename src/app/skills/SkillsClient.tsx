"use client";

import { useState, useMemo } from "react";
import { Zap, Search, ArrowLeft, Copy, Check, X } from "lucide-react";
import type { Skill } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// ─── 난이도 설정 ───────────────────────────────────────────────
const DIFFICULTY = [
  { key: "all",          label: "전체",  color: "text-slate-300",  bg: "bg-slate-700",            border: "border-slate-600" },
  { key: "beginner",     label: "입문",  color: "text-emerald-300", bg: "bg-emerald-900/60",       border: "border-emerald-700" },
  { key: "intermediate", label: "중급",  color: "text-amber-300",   bg: "bg-amber-900/60",         border: "border-amber-700"  },
  { key: "advanced",     label: "고급",  color: "text-rose-300",    bg: "bg-rose-900/60",          border: "border-rose-700"   },
] as const;
type DifficultyKey = (typeof DIFFICULTY)[number]["key"];

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

    // 코드 블록
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
          {lang && (
            <span className="absolute top-2.5 left-3 text-xs text-slate-500 font-mono">{lang}</span>
          )}
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

    // 수평선
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={`hr-${i}`} className="border-slate-800 my-4" />);
      i++;
      continue;
    }

    // h2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-base font-bold text-white mt-6 mb-2 flex items-center gap-2">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // h3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm font-semibold text-slate-200 mt-4 mb-1.5">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // 리스트 (- 또는 숫자.)
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

    // 빈 줄
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 일반 단락
    elements.push(
      <p key={`p-${i}`} className="text-sm text-slate-400 leading-relaxed my-1.5"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
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

// ─── 스킬 카드 ────────────────────────────────────────────────
function SkillCard({ skill, selected, onClick }: { skill: Skill; selected: boolean; onClick: () => void }) {
  const diff = DIFFICULTY.find((d) => d.key === skill.difficulty) ?? DIFFICULTY[1];
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
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.bg} ${diff.color} ${diff.border} border`}>
          {diff.label}
        </span>
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />}
      </div>
      <h3 className={`text-sm font-semibold mb-1 leading-snug transition-colors ${selected ? "text-white" : "text-slate-200 group-hover:text-white"}`}>
        {skill.title}
      </h3>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{skill.summary}</p>
      <div className="flex flex-wrap gap-1 mt-2.5">
        {skill.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

// ─── 상세 패널 ────────────────────────────────────────────────
function SkillDetail({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  const diff = DIFFICULTY.find((d) => d.key === skill.difficulty) ?? DIFFICULTY[1];

  // frontmatter 제거 후 콘텐츠만 추출
  const content = skill.content.replace(/^---[\s\S]*?---\n?/, "").trim();

  return (
    <div className="flex-1 min-w-0">
      <div className="sticky top-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          {/* 헤더 */}
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium mb-3 ${diff.bg} ${diff.color} ${diff.border} border`}>
                  {diff.label}
                </span>
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

          {/* 본문 */}
          <div className="px-6 py-5 max-h-[calc(100vh-220px)] overflow-y-auto">
            <MarkdownContent raw={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 ─────────────────────────────────────────────────────
export default function SkillsClient({ skills }: { skills: Skill[] }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyKey>("all");
  const [selected, setSelected] = useState<Skill | null>(null);

  const counts = useMemo(() => ({
    all: skills.length,
    beginner: skills.filter((s) => s.difficulty === "beginner").length,
    intermediate: skills.filter((s) => s.difficulty === "intermediate").length,
    advanced: skills.filter((s) => s.difficulty === "advanced").length,
  }), [skills]);

  const filtered = useMemo(() => skills.filter((s) => {
    const matchD = difficulty === "all" || s.difficulty === difficulty;
    const matchQ =
      !query ||
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.summary.toLowerCase().includes(query.toLowerCase()) ||
      s.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
    return matchD && matchQ;
  }), [skills, difficulty, query]);

  function handleSelect(skill: Skill) {
    setSelected((prev) => (prev?.slug === skill.slug ? null : skill));
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-2.5 mb-6">
        <Zap size={20} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.skills.title}</h1>
      </div>

      {/* 컨트롤 바: 난이도 탭 + 검색 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* 난이도 탭 — 단일 선택 */}
        <div className="flex gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {DIFFICULTY.map((d) => (
            <button
              key={d.key}
              onClick={() => { setDifficulty(d.key); setSelected(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                difficulty === d.key
                  ? `${d.bg} ${d.color} ${d.border} border shadow-sm`
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {d.label}
              <span className={`text-xs ${difficulty === d.key ? "opacity-80" : "opacity-50"}`}>
                {counts[d.key]}
              </span>
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div className="relative flex-1 min-w-0 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="스킬 검색..."
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

      {/* 결과 없음 */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">{t.common.no_results}</div>
      )}

      {/* 레이아웃: 목록 + 상세 */}
      <div className="flex gap-5 items-start">
        {/* 스킬 목록 */}
        <div className={`shrink-0 space-y-2 transition-all duration-200 ${selected ? "w-72 hidden md:block" : "w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 space-y-0"}`}>
          {filtered.map((skill) => (
            <SkillCard
              key={skill.slug}
              skill={skill}
              selected={selected?.slug === skill.slug}
              onClick={() => handleSelect(skill)}
            />
          ))}
        </div>

        {/* 상세 패널 */}
        {selected && (
          <>
            {/* 모바일: 전체 화면 오버레이 */}
            <div className="md:hidden fixed inset-0 z-40 bg-slate-950/95 overflow-y-auto p-4">
              <button
                onClick={() => setSelected(null)}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={16} />
                {t.common.back_to_list}
              </button>
              <SkillDetail skill={selected} onClose={() => setSelected(null)} />
            </div>

            {/* 데스크톱: 사이드 패널 */}
            <SkillDetail skill={selected} onClose={() => setSelected(null)} />
          </>
        )}
      </div>
    </div>
  );
}

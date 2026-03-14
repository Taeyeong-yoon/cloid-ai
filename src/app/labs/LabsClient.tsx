"use client";

import { useState } from "react";
import {
  FlaskConical,
  Play,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  Clock,
  Search,
} from "lucide-react";
import type { LabItem, LabVideo } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import HTMLPreview from "@/components/HTMLPreview";
import PythonPreview from "@/components/PythonPreview";

const difficultyColor: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50",
  intermediate: "text-amber-400 bg-amber-900/30 border-amber-700/50",
  advanced: "text-rose-400 bg-rose-900/30 border-rose-700/50",
};

const difficultyOrder = ["beginner", "intermediate", "advanced"];

const difficultyMeta: Record<string, { emoji: string; label: string }> = {
  beginner: { emoji: "🌱", label: "입문" },
  intermediate: { emoji: "💼", label: "중급" },
  advanced: { emoji: "🚀", label: "고급" },
};

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?\s]+)/);
  return match ? match[1] : null;
}

function VideoCard({ v }: { v: LabVideo }) {
  const [active, setActive] = useState(false);
  const videoId = v.url ? getYouTubeId(v.url) : null;
  const searchKeyword = v.search_keyword || v.title;

  if (!videoId) {
    return (
      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchKeyword)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-red-600/20 border border-red-700/50 text-red-400 hover:bg-red-600/30 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        <span className="truncate">{v.title}</span>
        <Search size={11} className="shrink-0 ml-auto opacity-60" />
      </a>
    );
  }

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="relative w-full rounded-lg overflow-hidden border border-slate-700 group"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={v.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <Play size={20} fill="white" className="text-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 text-xs text-white text-left bg-black/60 rounded px-2 py-1">
          {v.title}
        </div>
      </button>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-700" style={{ aspectRatio: "16/9" }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={v.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
}

function LabCard({ lab, index }: { lab: LabItem; index: number }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const difficultyLabel: Record<string, string> = {
    beginner: t.common.level_beginner,
    intermediate: t.common.level_intermediate,
    advanced: t.common.level_advanced,
  };

  async function copyPrompt(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4 mb-3">
          <span className="w-8 h-8 shrink-0 rounded-full bg-violet-900/50 border border-violet-700 text-violet-300 text-sm font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs px-1.5 py-0.5 rounded border ${difficultyColor[lab.difficulty]}`}>
                {difficultyLabel[lab.difficulty]}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={11} />
                {lab.duration}
              </span>
              {lab.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-lg font-bold text-white">{lab.title}</h2>
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-4">{lab.description}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          <Play size={13} />
          {expanded ? t.labs.collapse : `${t.labs.start_steps} (${lab.steps.length})`}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded Steps */}
      {expanded && (
        <div className="border-t border-slate-800 p-5 space-y-4">
          {lab.steps.map((step, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs flex items-center justify-center">
                {step.step}
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3>
              <p className="text-slate-400 text-sm mb-2">{step.instruction}</p>

              {step.prompt && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{t.labs.prompt_label}</span>
                    <button
                      onClick={() => copyPrompt(step.prompt!, i)}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {copiedIdx === i ? (
                        <><Check size={11} className="text-emerald-400" /> {t.common.copied}</>
                      ) : (
                        <><Copy size={11} /> {t.common.copy}</>
                      )}
                    </button>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                    <code className="text-xs font-mono text-emerald-300 whitespace-pre-wrap break-words">
                      {step.prompt}
                    </code>
                  </div>
                </div>
              )}

              {step.expected_result && (
                <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-1">
                  <Target size={11} className="shrink-0 mt-0.5 text-violet-500" />
                  <span>{t.labs.expected_result} {step.expected_result}</span>
                </div>
              )}

              {step.tip && (
                <div className="flex items-start gap-1.5 text-xs text-amber-500/80">
                  <Lightbulb size={11} className="shrink-0 mt-0.5" />
                  <span>{step.tip}</span>
                </div>
              )}
            </div>
          ))}

          {/* Challenge */}
          {lab.challenge && (
            <div className="mt-4 p-3 rounded-lg bg-violet-900/20 border border-violet-800/50">
              <div className="flex items-center gap-1.5 text-xs text-violet-400 font-semibold mb-1">
                <FlaskConical size={12} />
                {t.labs.challenge_title}
              </div>
              <p className="text-sm text-slate-300">{lab.challenge}</p>
            </div>
          )}

          {/* Videos */}
          {lab.videos && lab.videos.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t.labs.videos_title}</p>
              <div className="space-y-2">
                {lab.videos.map((v, i) => (
                  <VideoCard key={i} v={v} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LabsClient({ labs }: { labs: LabItem[] }) {
  const { t } = useTranslation();

  // difficulty별 아코디언 열림 상태 (기본: 모두 열림)
  const [openDifficulties, setOpenDifficulties] = useState<Record<string, boolean>>({
    beginner: true,
    intermediate: true,
    advanced: true,
  });

  function toggleDifficulty(difficulty: string) {
    setOpenDifficulties((prev) => ({ ...prev, [difficulty]: !prev[difficulty] }));
  }

  // difficulty별 그룹
  const grouped = difficultyOrder.reduce<Record<string, LabItem[]>>((acc, diff) => {
    acc[diff] = labs.filter((lab) => lab.difficulty === diff);
    return acc;
  }, {});

  // 각 그룹 내 순서 유지를 위한 누적 인덱스
  let globalIndex = 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.labs.title}</h1>
      </div>
      <p className="text-slate-400 text-sm mb-6">{t.labs.desc}</p>

      {/* ── HTML 코드 미리보기 도구 ── */}
      <div className="mb-4">
        <HTMLPreview />
      </div>

      {/* ── Python 미리보기 도구 ── */}
      <div className="mb-8">
        <PythonPreview />
      </div>

      {/* difficulty별 아코디언 */}
      <div className="space-y-4">
        {difficultyOrder.map((difficulty) => {
          const diffLabs = grouped[difficulty] || [];
          if (diffLabs.length === 0) return null;
          const isOpen = openDifficulties[difficulty];
          const meta = difficultyMeta[difficulty];
          const startIndex = globalIndex;
          globalIndex += diffLabs.length;

          return (
            <div key={difficulty} className="rounded-xl border border-slate-800 overflow-hidden">
              {/* 섹션 헤더 */}
              <button
                onClick={() => toggleDifficulty(difficulty)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-900/60 hover:bg-slate-800/60 text-left transition-colors"
              >
                <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-200">
                  <span className="text-base">{meta.emoji}</span>
                  <span>{meta.label}</span>
                  <span className={`text-xs font-normal px-1.5 py-0.5 rounded border ${difficultyColor[difficulty]}`}>
                    {diffLabs.length}개
                  </span>
                </span>
                {isOpen
                  ? <ChevronUp size={16} className="text-slate-500 shrink-0" />
                  : <ChevronDown size={16} className="text-slate-500 shrink-0" />
                }
              </button>

              {/* 랩 목록 */}
              {isOpen && (
                <div className="p-4 space-y-4 bg-slate-900/10">
                  {diffLabs.map((lab, i) => (
                    <LabCard key={lab.id} lab={lab} index={startIndex + i} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

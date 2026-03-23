"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Blocks,
  Bot,
  Briefcase,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Code2,
  Copy,
  Database,
  FlaskConical,
  Lightbulb,
  Network,
  Play,
  Rocket,
  Search,
  Target,
  Terminal,
} from "lucide-react";
import type { LabItem, LabVideo } from "@/lib/types";
import { TEXTBOOKS } from "@/constants/textbooks";
import BookmarkButton from "@/components/BookmarkButton";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import HTMLPreview from "@/components/HTMLPreview";
import PythonPreview from "@/components/PythonPreview";
import DataPreprocessingPreview from "@/components/DataPreprocessingPreview";
import CodeChallenge from "@/components/CodeChallenge";
import ResultEvaluator from "@/components/ResultEvaluator";
import StepChecklist, { type ChecklistStep } from "@/components/StepChecklist";
import FloatingTutor from "@/components/FloatingTutor";
import PracticeChat from "@/components/PracticeChat";

const difficultyColor: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50",
  intermediate: "text-amber-400 bg-amber-900/30 border-amber-700/50",
  advanced: "text-rose-400 bg-rose-900/30 border-rose-700/50",
};

type LabTrackId =
  | "ai-basics"
  | "claude-build"
  | "data-work"
  | "automation-agents"
  | "integration-deploy";

interface LabTrack {
  id: LabTrackId;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  accentClass: string;
  icon: typeof Bot;
  ids: string[];
}

const LAB_TRACKS: LabTrack[] = [
  {
    id: "ai-basics",
    titleKo: "AI 활용 첫 실습",
    titleEn: "AI Basics",
    descKo: "처음 해보는 AI 활용, 이메일, 이미지 프롬프트 같은 가벼운 실습",
    descEn: "Friendly first labs for AI usage, email drafting, and prompt practice",
    accentClass: "border-cyan-500/30 text-cyan-200",
    icon: Bot,
    ids: ["lab-first-chatgpt", "lab-ai-email", "lab-image-prompt", "lab-ai-startup"],
  },
  {
    id: "claude-build",
    titleKo: "Claude · 코딩 실습",
    titleEn: "Claude Build",
    descKo: "Claude, Claude Code, Codex 기반으로 실제 결과물을 만드는 실습",
    descEn: "Build real outputs with Claude, Claude Code, and Codex-centered labs",
    accentClass: "border-violet-500/30 text-violet-200",
    icon: Rocket,
    ids: [
      "lab-chatbot-build",
      "lab-claude-code-component",
      "lab-claude-code-project",
      "lab-claude-code-repo-automation",
      "lab-claude-code-mcp-filesystem",
      "lab-codex-cli-code-review",
      "lab-codex-cli-test-writing",
    ],
  },
  {
    id: "data-work",
    titleKo: "데이터 · 업무 실습",
    titleEn: "Data and Work",
    descKo: "엑셀, 시각화, 전처리, 대시보드처럼 업무형 결과물을 만드는 실습",
    descEn: "Hands-on labs for spreadsheets, preprocessing, dashboards, and business outputs",
    accentClass: "border-emerald-500/30 text-emerald-200",
    icon: BarChart3,
    ids: ["lab-data-preprocessing", "lab-data-visualization", "lab-excel-formula", "lab-enterprise-dashboard", "lab-claude-market-analytics"],
  },
  {
    id: "automation-agents",
    titleKo: "자동화 · 에이전트",
    titleEn: "Automation and Agents",
    descKo: "n8n, 멀티에이전트, 워크플로 자동화처럼 흐름을 설계하는 실습",
    descEn: "Workflow labs focused on n8n, multi-agent systems, and automation design",
    accentClass: "border-amber-500/30 text-amber-200",
    icon: Network,
    ids: [
      "lab-multiagent-system",
      "lab-n8n-claude-pipeline",
      "lab-n8n-gmail-cs-automation",
      "lab-n8n-human-in-the-loop-slack",
      "lab-n8n-youtube-newsletter",
      "lab-skill-chaining",
      "lab-uli-agent",
      "lab-openclaw-telegram",
      "lab-agentic-seo",
    ],
  },
  {
    id: "integration-deploy",
    titleKo: "연결 · 배포 · MCP",
    titleEn: "Integration and Deploy",
    descKo: "API 연결, MCP, 로컬 AI, Vercel 배포까지 이어지는 통합형 실습",
    descEn: "Integration labs covering APIs, MCP, local AI, and deployment flow",
    accentClass: "border-rose-500/30 text-rose-200",
    icon: Briefcase,
    ids: [
      "lab-api-integration",
      "lab-mcp-filesystem",
      "lab-local-ai-ollama",
      "lab-deploy-vercel",
      "lab-nextjs-supabase-dashboard",
      "lab-claude-market-skill",
      "lab-claude-market-skill-publish",
      "lab-gemini-streaming",
      "lab-gemini-cli-long-doc-pipeline",
    ],
  },
];

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
        className="flex items-center gap-2 rounded-lg border border-red-700/50 bg-red-600/20 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-600/30"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
        <span className="truncate">{v.title}</span>
        <Search size={11} className="ml-auto shrink-0 opacity-60" />
      </a>
    );
  }

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="group relative w-full overflow-hidden rounded-lg border border-slate-700"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt={v.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
            <Play size={20} fill="white" className="ml-1 text-white" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 rounded bg-black/60 px-2 py-1 text-left text-xs text-white">
          {v.title}
        </div>
      </button>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-700" style={{ aspectRatio: "16/9" }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={v.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="h-full w-full"
      />
    </div>
  );
}

function LabTrackCard({
  track,
  count,
  active,
  locale,
  onClick,
}: {
  track: LabTrack;
  count: number;
  active: boolean;
  locale: string;
  onClick: () => void;
}) {
  const Icon = track.icon;
  const title = locale === "ko" ? track.titleKo : track.titleEn;
  const desc = locale === "ko" ? track.descKo : track.descEn;

  return (
    <button
      onClick={onClick}
      className={`group rounded-[1.5rem] border bg-slate-950/55 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
        active ? `${track.accentClass} shadow-[0_18px_40px_rgba(15,23,42,0.35)]` : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className={`mb-4 flex h-36 items-center justify-center rounded-[1.3rem] border bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] ${track.accentClass}`}>
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-current/30 bg-white/5">
          <Icon size={28} />
        </div>
      </div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${track.accentClass}`}>
          <Icon size={13} />
          {title}
        </span>
        <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-400">
          {count}
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-400">{desc}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-300">
        <span>{locale === "ko" ? "하위 실습 보기" : "Browse labs"}</span>
        <ChevronRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </button>
  );
}

type ToolId = "html" | "python" | "preprocessing";

function getLinkedTool(lab: LabItem): ToolId | null {
  if (lab.id === "lab-data-preprocessing") return "preprocessing";
  const tags = lab.tags.map((tag) => tag.toLowerCase());
  if (tags.includes("html") || tags.includes("javascript")) return "html";
  if (tags.includes("python")) return "python";
  return null;
}

const TOOL_META: Record<ToolId, { label: string; labelKo: string; color: string; icon: string }> = {
  html: { label: "Test in HTML Preview", labelKo: "HTML Preview에서 테스트", color: "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20", icon: "</>" },
  python: { label: "Run in Python Preview", labelKo: "Python Preview에서 실행", color: "border-teal-500/40 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20", icon: "▶" },
  preprocessing: { label: "Open Data Preprocessing Lab", labelKo: "데이터 전처리 도구 열기", color: "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20", icon: "⊞" },
};

function LabCard({
  lab,
  index,
  onActivate,
  onOpenTool,
}: {
  lab: LabItem;
  index: number;
  onActivate: (lab: LabItem) => void;
  onOpenTool: (tool: ToolId) => void;
}) {
  const { t, locale } = useTranslation();
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

  function toggleExpanded() {
    setExpanded((current) => {
      const next = !current;
      if (next) onActivate(lab);
      return next;
    });
  }

  const linkedTool = getLinkedTool(lab);

  const interactiveChallenge =
    typeof lab.challenge === "object" && lab.challenge && "starterCode" in lab.challenge
      ? lab.challenge
      : null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
      <div className="p-5">
        <div className="mb-3 flex items-start gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-700 bg-violet-900/50 text-sm font-bold text-violet-300">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className={`rounded border px-1.5 py-0.5 text-xs ${difficultyColor[lab.difficulty]}`}>
                {difficultyLabel[lab.difficulty]}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock size={11} />
                {lab.duration}
              </span>
              {lab.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-lg font-bold text-white">{lab.title}</h2>
          </div>
        </div>
        <p className="mb-4 text-sm text-slate-400">{lab.description}</p>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={toggleExpanded}
            className="flex items-center gap-1.5 text-sm text-violet-400 transition-colors hover:text-violet-300"
          >
            <Play size={13} />
            {expanded ? t.labs.collapse : `${t.labs.start_steps} (${lab.steps.length})`}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <BookmarkButton type="labs" id={lab.id} />
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-slate-800 p-5">
          {linkedTool && (
            <button
              onClick={() => onOpenTool(linkedTool)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${TOOL_META[linkedTool].color}`}
            >
              <span>{TOOL_META[linkedTool].icon}</span>
              {locale === "ko" ? TOOL_META[linkedTool].labelKo : TOOL_META[linkedTool].label}
            </button>
          )}
          {lab.steps.length > 0 && (() => {
            const checklistSteps: ChecklistStep[] = lab.steps.map((step) => ({
              title: step.title,
              description: step.instruction,
              action: step.prompt ? `${t.labs.prompt_label}: ${step.prompt}` : undefined,
              expectedResult: step.expected_result,
              failureHint: step.tip,
            }));

            return <StepChecklist contentType="lab" contentId={lab.id} steps={checklistSteps} />;
          })()}

          {lab.steps.map((step, i) => (
            <div key={i} className="relative pl-6">
              <div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs text-slate-400">
                {step.step}
              </div>
              <h3 className="mb-1 text-sm font-semibold text-white">{step.title}</h3>
              <p className="mb-2 text-sm text-slate-400">{step.instruction}</p>

              {step.prompt && (
                <div className="mb-2">
                  <div className="mb-1 flex flex-col items-start gap-2">
                    <button
                      onClick={() => copyPrompt(step.prompt!, i)}
                      className="flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
                    >
                      {copiedIdx === i ? (
                        <>
                          <Check size={11} className="text-emerald-400" /> {t.common.copied}
                        </>
                      ) : (
                        <>
                          <Copy size={11} /> {t.common.copy}
                        </>
                      )}
                    </button>
                    <span className="text-xs uppercase tracking-wider text-slate-500">{t.labs.prompt_label}</span>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                    <code className="whitespace-pre-wrap break-words text-xs font-mono text-emerald-300">
                      {step.prompt}
                    </code>
                  </div>
                </div>
              )}

              {step.expected_result && (
                <div className="mb-1 flex items-start gap-1.5 text-xs text-slate-500">
                  <Target size={11} className="mt-0.5 shrink-0 text-violet-500" />
                  <span>{t.labs.expected_result} {step.expected_result}</span>
                </div>
              )}

              {step.tip && (
                <div className="flex items-start gap-1.5 text-xs text-amber-500/80">
                  <Lightbulb size={11} className="mt-0.5 shrink-0" />
                  <span>{step.tip}</span>
                </div>
              )}
            </div>
          ))}

          {typeof lab.challenge === "string" && lab.challenge && (
            <div className="mt-4 rounded-lg border border-violet-800/50 bg-violet-900/20 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-violet-400">
                <FlaskConical size={12} />
                {t.labs.challenge_title}
              </div>
              <p className="text-sm text-slate-300">{lab.challenge}</p>
            </div>
          )}

          {interactiveChallenge && <CodeChallenge contentId={lab.id} challenge={interactiveChallenge} />}
          {lab.evaluation && <ResultEvaluator contentId={lab.id} evaluation={lab.evaluation} />}
          {lab.practicePrompts && lab.practicePrompts.length > 0 && (
            <PracticeChat contentId={lab.id} practices={lab.practicePrompts} />
          )}

          {lab.videos && lab.videos.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">{t.labs.videos_title}</p>
              <div className="space-y-2">
                {lab.videos.map((v, i) => (
                  <VideoCard key={i} v={v} />
                ))}
              </div>
            </div>
          )}

          {(() => {
            const labTagsLower = lab.tags.map((tag) => tag.toLowerCase());
            const matched = TEXTBOOKS.filter(
              (tb) => tb.ready && tb.tags.some((tag) => labTagsLower.includes(tag.toLowerCase()))
            ).slice(0, 3);
            if (matched.length === 0) return null;
            return (
              <div className="mt-4 border-t border-slate-800 pt-4">
                <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Related Textbooks</p>
                <div className="space-y-2">
                  {matched.map((tb) => (
                    <Link
                      key={tb.id}
                      href={`/radar/${tb.id}`}
                      className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm transition-colors hover:border-violet-500/40 hover:bg-violet-950/20"
                    >
                      <span className="shrink-0 text-violet-400">•</span>
                      <span className="truncate text-slate-300">{tb.titleEn}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default function LabsClient({ labs }: { labs: LabItem[] }) {
  const { t, locale } = useTranslation();
  const isKo = locale === "ko";
  const [activeLab, setActiveLab] = useState<LabItem | null>(labs[0] ?? null);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<LabTrackId>("ai-basics");
  const selectedTrackRef = useRef<HTMLDivElement>(null);
  const toolsSectionRef = useRef<HTMLDivElement>(null);

  function handleOpenTool(tool: ToolId) {
    setActiveTool(tool);
    requestAnimationFrame(() => {
      toolsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const trackGroups = useMemo(
    () =>
      LAB_TRACKS.map((track) => ({
        ...track,
        labs: labs.filter((lab) => track.ids.includes(lab.id)),
      })).filter((track) => track.labs.length > 0),
    [labs]
  );

  const selectedTrack = trackGroups.find((track) => track.id === selectedTrackId) ?? trackGroups[0] ?? null;

  const tutorTitle = activeLab?.title ?? t.labs.title;
  const tutorSummary =
    activeLab?.description ??
    "Ask about the current lab, next actions, expected outputs, or likely failure points.";
  const tutorDetails = activeLab
    ? [
        `Difficulty: ${activeLab.difficulty}`,
        `Duration: ${activeLab.duration}`,
        `Tags: ${activeLab.tags.join(", ")}`,
        ...activeLab.steps.slice(0, 6).map(
          (step) =>
            `Step ${step.step}: ${step.title} | ${step.instruction}${step.expected_result ? ` | Expected: ${step.expected_result}` : ""}`
        ),
      ]
    : labs.slice(0, 5).map((lab) => `${lab.title}: ${lab.description}`);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!selectedTrackRef.current) return;

    const frame = requestAnimationFrame(() => {
      selectedTrackRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedTrackId]);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <FlaskConical size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.labs.title}</h1>
      </div>
      <p className="mb-6 text-sm text-slate-400">{t.labs.desc}</p>

      <div ref={toolsSectionRef} className="mb-8 rounded-2xl border border-slate-800 bg-slate-950/55 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300/80">AI Labs Tools</p>
            <p className="mt-1 text-xs text-slate-400">Open a browser-based tool only when you need it and keep the lab list in focus.</p>
          </div>
          <span className="hidden rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-400 sm:inline-flex">
            3 interactive tools
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className={`lab-tool-launcher text-left ${activeTool === "html" ? "lab-tool-launcher-active" : ""}`}>
            <span className="lab-tool-launcher-icon border-amber-500/20 bg-amber-500/15 text-amber-300">
              <Code2 size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{t.labs.code_preview_title}</span>
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-amber-200">
                  HTML
                </span>
              </span>
              <span className="mt-1 block text-xs text-slate-400">Preview HTML, CSS, and JS with fullscreen and download kept intact.</span>
            </span>
            <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
              <button type="button" onClick={() => setActiveTool((current) => (current === "html" ? null : "html"))} className="lab-tool-launcher-cta">
                {activeTool === "html" ? t.labs.collapse : "Open"}
              </button>
              <Link
                href="/labs/code-preview-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-medium text-amber-100 transition-colors hover:bg-amber-500/20"
              >
                {isKo ? "매우 상세한 설명서" : "Detailed Guide"}
              </Link>
            </div>
          </div>

          <div className={`lab-tool-launcher text-left ${activeTool === "python" ? "lab-tool-launcher-active" : ""}`}>
            <span className="lab-tool-launcher-icon border-teal-500/20 bg-teal-500/15 text-teal-300">
              <Terminal size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{t.labs.python_title}</span>
                <span className="rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-teal-200">
                  Python
                </span>
              </span>
              <span className="mt-1 block text-xs text-slate-400">Run Python in-browser and keep the existing full view and VS Code open actions.</span>
            </span>
            <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
              <button type="button" onClick={() => setActiveTool((current) => (current === "python" ? null : "python"))} className="lab-tool-launcher-cta">
                {activeTool === "python" ? t.labs.collapse : "Open"}
              </button>
              <Link
                href="/labs/python-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-[11px] font-medium text-teal-100 transition-colors hover:bg-teal-500/20"
              >
                {isKo ? "매우 상세한 설명서" : "Detailed Guide"}
              </Link>
            </div>
          </div>

          <div className={`lab-tool-launcher text-left ${activeTool === "preprocessing" ? "lab-tool-launcher-active" : ""}`}>
            <span className="lab-tool-launcher-icon border-sky-500/20 bg-sky-500/15 text-sky-300">
              <Database size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Data Preprocessing Lab</span>
                <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-sky-200">
                  CSV
                </span>
              </span>
              <span className="mt-1 block text-xs text-slate-400">Practice missing values, duplicates, date cleanup, and pandas code generation in a notebook-like flow.</span>
            </span>
            <div className="ml-auto flex shrink-0 flex-col items-end gap-2">
              <button type="button" onClick={() => setActiveTool((current) => (current === "preprocessing" ? null : "preprocessing"))} className="lab-tool-launcher-cta">
                {activeTool === "preprocessing" ? t.labs.collapse : "Open"}
              </button>
              <Link
                href="/labs/preprocessing-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-[11px] font-medium text-sky-100 transition-colors hover:bg-sky-500/20"
              >
                {isKo ? "매우 상세한 설명서" : "Detailed Guide"}
              </Link>
            </div>
          </div>
        </div>

        {activeTool === "html" && <div className="mt-4"><HTMLPreview /></div>}
        {activeTool === "python" && <div className="mt-4"><PythonPreview /></div>}
        {activeTool === "preprocessing" && <div className="mt-4"><DataPreprocessingPreview /></div>}
      </div>

      <section className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Blocks size={18} className="text-violet-300" />
            <h2 className="text-lg font-semibold text-white">{isKo ? "실습 트랙" : "Lab Tracks"}</h2>
          </div>
          <p className="text-sm text-slate-400">
            {isKo
              ? "상단 코딩 도구는 그대로 두고, 아래 실습은 주제별 트랙으로 묶었습니다. 먼저 큰 실습 주제를 고른 뒤 세부 실습을 보면 덜 복잡합니다."
              : "The coding tools stay unchanged. The labs below are grouped into tracks so you can choose a larger theme first."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trackGroups.map((track) => (
            <LabTrackCard
              key={track.id}
              track={track}
              count={track.labs.length}
              active={track.id === selectedTrack?.id}
              locale={locale}
              onClick={() => {
                setSelectedTrackId(track.id);
                setActiveLab(track.labs[0] ?? null);
              }}
            />
          ))}
        </div>

        {selectedTrack && (
          <div
            ref={selectedTrackRef}
            className="rounded-[1.75rem] border border-slate-800 bg-slate-950/45 p-4 sm:p-5"
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] text-slate-400">
                  <Blocks size={12} />
                  {isKo ? "선택된 실습 묶음" : "Selected Lab Track"}
                </div>
                <h3 className="text-xl font-semibold text-white">{isKo ? selectedTrack.titleKo : selectedTrack.titleEn}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">{isKo ? selectedTrack.descKo : selectedTrack.descEn}</p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                {selectedTrack.labs.length} {isKo ? "개 실습" : "labs"}
              </span>
            </div>

            <div className="space-y-4 bg-slate-900/10">
              {selectedTrack.labs.map((lab, i) => (
                <LabCard key={lab.id} lab={lab} index={i} onActivate={setActiveLab} onOpenTool={handleOpenTool} />
              ))}
            </div>
          </div>
        )}
      </section>

      <FloatingTutor
        scope="labs"
        contextTitle={tutorTitle}
        contextSummary={tutorSummary}
        contextDetails={tutorDetails}
      />
    </div>
  );
}

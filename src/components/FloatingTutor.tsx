"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  GripHorizontal,
  Loader2,
  MessageSquareMore,
  Minimize2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

type TutorScope = "skills" | "labs";

interface FloatingTutorProps {
  scope: TutorScope;
  contextTitle: string;
  contextSummary: string;
  contextDetails?: string[];
}

interface TutorMessage {
  role: "user" | "assistant";
  content: string;
}

interface PanelFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MIN_WIDTH = 320;
const MIN_HEIGHT = 360;
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 560;
const EDGE_GAP = 24;

function clampFrame(frame: PanelFrame): PanelFrame {
  if (typeof window === "undefined") return frame;

  const maxWidth = Math.max(MIN_WIDTH, window.innerWidth - EDGE_GAP * 2);
  const maxHeight = Math.max(MIN_HEIGHT, window.innerHeight - EDGE_GAP * 2);
  const width = Math.min(Math.max(frame.width, MIN_WIDTH), maxWidth);
  const height = Math.min(Math.max(frame.height, MIN_HEIGHT), maxHeight);
  const x = Math.min(Math.max(frame.x, EDGE_GAP), Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP));
  const y = Math.min(Math.max(frame.y, EDGE_GAP), Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP));

  return { x, y, width, height };
}

function defaultFrame() {
  if (typeof window === "undefined") {
    return { x: 0, y: 0, width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  }

  return clampFrame({
    x: window.innerWidth - DEFAULT_WIDTH - EDGE_GAP,
    y: Math.max(EDGE_GAP, Math.round((window.innerHeight - DEFAULT_HEIGHT) / 2)),
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
}

export default function FloatingTutor({
  scope,
  contextTitle,
  contextSummary,
  contextDetails = [],
}: FloatingTutorProps) {
  const { locale } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; originX: number; originY: number } | null>(null);
  const storageKey = `cloid-floating-tutor:${scope}`;

  const copy = useMemo(
    () =>
      locale === "ko"
        ? {
            badge: "GPT-4o mini",
            title: scope === "skills" ? "스킬 튜터" : "실습 튜터",
            subtitle: scope === "skills" ? "선택한 스킬 기준으로 바로 답합니다" : "현재 실습 문맥으로 짧고 실용적으로 답합니다",
            placeholder: "지금 막히는 점을 바로 물어보세요",
            send: "질문",
            thinking: "답변 작성 중...",
            minimize: "접기",
            close: "닫기",
            reopen: scope === "skills" ? "스킬 튜터 열기" : "실습 튜터 열기",
            context: "현재 문맥",
            starter:
              scope === "skills"
                ? "이 스킬을 바로 적용하려면 첫 단계가 뭐야?"
                : "이 실습에서 다음에 뭘 해야 해?",
            empty:
              scope === "skills"
                ? "선택한 스킬을 기준으로 실무형 질문을 해보세요."
                : "펼쳐둔 실습을 기준으로 막히는 지점을 바로 물어보세요.",
            quick: scope === "skills"
              ? ["핵심만 요약해줘", "바로 따라할 예시 줘", "실수하기 쉬운 점 알려줘"]
              : ["다음 행동만 알려줘", "이 단계 쉽게 설명해줘", "오류가 날 만한 지점 알려줘"],
          }
        : {
            badge: "GPT-4o mini",
            title: scope === "skills" ? "Skill Tutor" : "Lab Tutor",
            subtitle:
              scope === "skills"
                ? "Answers against the selected skill context"
                : "Short practical help from the current lab context",
            placeholder: "Ask what is blocking you right now",
            send: "Ask",
            thinking: "Writing answer...",
            minimize: "Minimize",
            close: "Close",
            reopen: scope === "skills" ? "Open Skill Tutor" : "Open Lab Tutor",
            context: "Current context",
            starter:
              scope === "skills"
                ? "What is the first practical step for this skill?"
                : "What should I do next in this lab?",
            empty:
              scope === "skills"
                ? "Ask a practical question based on the selected skill."
                : "Ask about the open lab and keep moving without copy-only workflows.",
            quick:
              scope === "skills"
                ? ["Summarize the core idea", "Give me one practical example", "What mistakes should I avoid?"]
                : ["Tell me the next action only", "Explain this step simply", "What is likely to fail here?"],
          },
    [locale, scope]
  );

  const [frame, setFrame] = useState<PanelFrame>(() => defaultFrame());
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const contextPayload = useMemo(() => {
    const trimmedDetails = contextDetails.filter(Boolean).slice(0, 6);
    return [
      `Scope: ${scope}`,
      `Title: ${contextTitle}`,
      `Summary: ${contextSummary}`,
      trimmedDetails.length > 0 ? `Details:\n- ${trimmedDetails.join("\n- ")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }, [contextDetails, contextSummary, contextTitle, scope]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        setFrame(defaultFrame());
        return;
      }
      const parsed = JSON.parse(raw) as { open?: boolean; frame?: PanelFrame };
      setOpen(parsed.open ?? true);
      setFrame(parsed.frame ? clampFrame(parsed.frame) : defaultFrame());
    } catch {
      setFrame(defaultFrame());
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify({ open, frame }));
  }, [frame, open, storageKey]);

  useEffect(() => {
    setMessages([]);
    setError("");
  }, [contextTitle, scope]);

  useEffect(() => {
    function handleResize() {
      setFrame((current) => clampFrame(current));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!panelRef.current || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setFrame((current) =>
        clampFrame({
          ...current,
          width: Math.round(entry.contentRect.width),
          height: Math.round(entry.contentRect.height),
        })
      );
    });

    observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      if (!dragStartRef.current) return;

      const dx = event.clientX - dragStartRef.current.pointerX;
      const dy = event.clientY - dragStartRef.current.pointerY;

      setFrame((current) =>
        clampFrame({
          ...current,
          x: dragStartRef.current!.originX + dx,
          y: dragStartRef.current!.originY + dy,
        })
      );
    }

    function handlePointerUp() {
      dragStartRef.current = null;
      document.body.style.userSelect = "";
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  function handleDragStart(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;

    dragStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      originX: frame.x,
      originY: frame.y,
    };

    document.body.style.userSelect = "none";
  }

  async function sendQuestion(questionText?: string) {
    const nextQuestion = (questionText ?? input).trim();
    if (!nextQuestion || loading) return;

    const userMessage: TutorMessage = { role: "user", content: nextQuestion };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "tutor",
          question: nextQuestion,
          context: contextPayload,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Tutor request failed.");

      const assistantMessage: TutorMessage = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((current) => [...current, assistantMessage].slice(-10));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Tutor request failed.");
    } finally {
      setLoading(false);
    }
  }

  const panelStyle = {
    left: `${frame.x}px`,
    top: `${frame.y}px`,
    width: `${frame.width}px`,
    height: `${frame.height}px`,
  };

  const collapsedStyle = {
    right: `${EDGE_GAP}px`,
    top: `${Math.max(EDGE_GAP, frame.y + 12)}px`,
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed z-[90] inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-slate-950/90 px-4 py-3 text-sm text-white shadow-2xl shadow-violet-950/40 backdrop-blur-xl transition hover:border-violet-400/70 hover:bg-slate-900"
        style={collapsedStyle}
      >
        <Sparkles size={16} className="text-violet-300" />
        {copy.reopen}
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className="fixed z-[90] overflow-hidden rounded-[24px] border border-violet-500/20 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] shadow-[0_20px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl"
      style={{ ...panelStyle, resize: "both" as const }}
    >
      <div
        className="flex cursor-move items-center justify-between border-b border-white/10 px-4 py-3"
        onPointerDown={handleDragStart}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-violet-200">
              <MessageSquareMore size={15} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{copy.title}</p>
              <p className="truncate text-[11px] text-slate-400">{copy.subtitle}</p>
            </div>
          </div>
        </div>
        <div className="ml-3 flex items-center gap-1">
          <span className="hidden rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-[10px] font-medium text-violet-200 sm:inline-flex">
            {copy.badge}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label={copy.minimize}
            title={copy.minimize}
          >
            <Minimize2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label={copy.close}
            title={copy.close}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-61px)] flex-col">
        <div className="border-b border-white/10 px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            <GripHorizontal size={12} />
            {copy.context}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
            <p className="truncate text-sm font-medium text-white">{contextTitle}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{contextSummary}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {copy.quick.map((quickPrompt) => (
              <button
                key={quickPrompt}
                type="button"
                onClick={() => void sendQuestion(quickPrompt)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !error && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-4 text-sm leading-6 text-slate-400">
              {copy.empty}
              <div className="mt-3 rounded-xl border border-violet-400/15 bg-violet-500/10 px-3 py-2 text-xs text-violet-100">
                {copy.starter}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-8 rounded-2xl rounded-tr-md bg-violet-500 px-4 py-3 text-sm text-white shadow-lg shadow-violet-950/30"
                  : "mr-4 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-slate-200"
              }
            >
              {message.content}
            </div>
          ))}

          {loading && (
            <div className="mr-4 inline-flex items-center gap-2 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
              <Loader2 size={14} className="animate-spin text-violet-300" />
              {copy.thinking}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendQuestion();
                }
              }}
              placeholder={copy.placeholder}
              className="min-h-[88px] flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => void sendQuestion()}
              disabled={loading || !input.trim()}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500 text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-slate-700"
              aria-label={copy.send}
              title={copy.send}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

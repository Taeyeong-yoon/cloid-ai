"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Loader2, MessageSquareMore, Minimize2, Send, Sparkles, X } from "lucide-react";
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

const EDGE_GAP = 24;
const MIN_WIDTH = 340;
const MIN_HEIGHT = 520;
const DEFAULT_WIDTH = 420;
const DEFAULT_HEIGHT = 700;

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

function getDefaultFrame() {
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
  const messagesRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; originX: number; originY: number } | null>(null);
  const storageKey = `cloid-floating-tutor:${scope}`;

  const copy = useMemo(
    () =>
      locale === "ko"
        ? {
            badge: "GPT-4o mini",
            title: scope === "skills" ? "스킬 튜터" : "실습 튜터",
            subtitle: scope === "skills" ? "선택한 스킬 기준 즉시 답변" : "현재 실습 기준 즉시 답변",
            placeholder: "명령어, 코드, 오류, 출력값 질문을 그대로 넣으세요",
            send: "전송",
            thinking: "결과 추론 중...",
            minimize: "접기",
            close: "닫기",
            reopen: scope === "skills" ? "스킬 튜터 열기" : "실습 튜터 열기",
            context: "현재 문맥",
            empty:
              scope === "skills"
                ? "명령어/코드를 붙여 넣으면 예상 결과나 출력 형태를 바로 설명합니다."
                : "실습 명령어를 넣으면 어떻게 실행되고 어떤 결과가 나와야 하는지 먼저 답합니다.",
            starter:
              scope === "skills"
                ? "`npm run build`를 넣고 예상 결과를 물어보세요."
                : "`streamlit run app.py` 같은 실습 명령어를 넣고 결과를 물어보세요.",
          }
        : {
            badge: "GPT-4o mini",
            title: scope === "skills" ? "Skill Tutor" : "Lab Tutor",
            subtitle: scope === "skills" ? "Immediate answers from the selected skill" : "Immediate answers from the current lab",
            placeholder: "Paste a command, code snippet, error, or expected output question",
            send: "Send",
            thinking: "Inferring likely result...",
            minimize: "Minimize",
            close: "Close",
            reopen: scope === "skills" ? "Open Skill Tutor" : "Open Lab Tutor",
            context: "Current context",
            empty:
              scope === "skills"
                ? "Paste a command or snippet and the tutor will describe the likely result first."
                : "Paste a lab command and the tutor will answer with the expected output or behavior first.",
            starter:
              scope === "skills"
                ? "Try asking about `npm run build` or a command you plan to run."
                : "Try pasting a lab command such as `streamlit run app.py`.",
          },
    [locale, scope]
  );

  const [frame, setFrame] = useState<PanelFrame>(() => getDefaultFrame());
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

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
        setFrame(getDefaultFrame());
        return;
      }

      const parsed = JSON.parse(raw) as { open?: boolean; frame?: PanelFrame };
      setOpen(parsed.open ?? true);
      setFrame(parsed.frame ? clampFrame(parsed.frame) : getDefaultFrame());
    } catch {
      setFrame(getDefaultFrame());
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify({ open, frame }));
  }, [frame, open, storageKey]);

  useEffect(() => {
    setMessages([]);
    setError("");
    setInput("");
  }, [contextTitle, scope]);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
      setFrame((current) => clampFrame(current));
    }

    handleResize();
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
      const dragState = dragStartRef.current;
      if (!dragState) return;

      const dx = event.clientX - dragState.pointerX;
      const dy = event.clientY - dragState.pointerY;

      setFrame((current) =>
        clampFrame({
          ...current,
          x: dragState.originX + dx,
          y: dragState.originY + dy,
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

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, loading, error]);

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
    setMessages((current) => [...current, userMessage].slice(-10));
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

      const assistantMessage: TutorMessage = { role: "assistant", content: data.answer };
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

  if (isMobile) return null;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed z-[90] inline-flex items-center gap-2 rounded-full border border-violet-400/60 bg-slate-950/95 px-4 py-3 text-sm text-white shadow-[0_0_30px_rgba(168,85,247,0.25)] backdrop-blur-xl transition hover:border-fuchsia-300 hover:shadow-[0_0_45px_rgba(216,180,254,0.35)]"
        style={{ right: `${EDGE_GAP}px`, top: `${Math.max(EDGE_GAP, frame.y + 16)}px` }}
      >
        <Sparkles size={16} className="text-fuchsia-300" />
        {copy.reopen}
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className="fixed z-[90] overflow-hidden rounded-[28px] bg-transparent"
      style={{ ...panelStyle, resize: "both" as const }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] overflow-hidden">
        <div className="absolute inset-[-120%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(216,180,254,0.1)_0deg,rgba(192,38,211,0.95)_80deg,rgba(124,58,237,1)_170deg,rgba(56,189,248,0.45)_240deg,rgba(216,180,254,0.1)_360deg)]" />
      </div>
      <div className="absolute inset-[1.5px] rounded-[26px] bg-[radial-gradient(circle_at_top,_rgba(91,33,182,0.32),_transparent_38%),linear-gradient(180deg,rgba(2,6,23,0.97),rgba(15,23,42,0.98))]" />

      <div className="relative flex h-full min-h-0 flex-col rounded-[26px]">
        <div
          className="flex cursor-move items-start justify-between border-b border-white/10 px-4 py-3"
          onPointerDown={handleDragStart}
        >
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-400/15 text-fuchsia-200 shadow-[0_0_24px_rgba(217,70,239,0.28)]">
                <MessageSquareMore size={15} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{copy.title}</p>
                <p className="truncate text-[11px] text-slate-400">{copy.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="ml-2 flex items-center gap-1">
            <span className="hidden rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-2 py-1 text-[10px] font-medium text-fuchsia-100 sm:inline-flex">
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

        <div className="border-b border-white/10 px-4 py-3">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">{copy.context}</div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3">
            <p className="truncate text-sm font-medium text-white">{contextTitle}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{contextSummary}</p>
          </div>
        </div>

        <div ref={messagesRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && !error && (
            <div className="rounded-2xl border border-dashed border-fuchsia-300/20 bg-fuchsia-400/[0.05] px-4 py-4 text-sm leading-6 text-slate-300">
              {copy.empty}
              <div className="mt-3 rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/[0.08] px-3 py-2 text-xs text-fuchsia-100">
                {copy.starter}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-10 rounded-2xl rounded-tr-md bg-fuchsia-500 px-4 py-3 text-sm text-white shadow-[0_0_24px_rgba(217,70,239,0.2)]"
                  : "mr-4 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.05] px-4 py-3 text-sm leading-6 text-slate-100"
              }
            >
              {message.content}
            </div>
          ))}

          {loading && (
            <div className="mr-4 inline-flex items-center gap-2 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-200">
              <Loader2 size={14} className="animate-spin text-fuchsia-300" />
              {copy.thinking}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-black/10 px-4 py-4">
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
              className="min-h-[110px] flex-1 rounded-2xl border border-fuchsia-300/15 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-fuchsia-300/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => void sendQuestion()}
              disabled={loading || !input.trim()}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500 text-white shadow-[0_0_30px_rgba(217,70,239,0.28)] transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none"
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

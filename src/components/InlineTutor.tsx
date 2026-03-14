"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";

interface PopupPos { x: number; y: number; }

function checkDailyLimit(isLoggedIn: boolean): { allowed: boolean; count: number; max: number } {
  const dateKey = `cloid-tutor-count:${new Date().toISOString().slice(0, 10)}`;
  const count = parseInt(localStorage.getItem(dateKey) || "0", 10);
  const max = isLoggedIn ? 20 : 5;
  return { allowed: count < max, count, max };
}

function incrementDailyCount(): void {
  const dateKey = `cloid-tutor-count:${new Date().toISOString().slice(0, 10)}`;
  const count = parseInt(localStorage.getItem(dateKey) || "0", 10);
  localStorage.setItem(dateKey, String(count + 1));
}

export default function InlineTutor() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedText, setSelectedText] = useState("");
  const [popupPos, setPopupPos] = useState<PopupPos | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() ?? "";

    if (text.length < 3 || text.length > 500) {
      setPopupPos(null);
      return;
    }

    const range = selection?.getRangeAt(0);
    if (!range) return;
    const rect = range.getBoundingClientRect();

    setSelectedText(text);
    setPopupPos({
      x: Math.min(rect.left + rect.width / 2, window.innerWidth - 80),
      y: rect.top - 10 + window.scrollY,
    });
  }, []);

  const handleClick = useCallback(() => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim().length < 3) {
        setPopupPos(null);
      }
    }, 100);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClick);
    };
  }, [handleMouseUp, handleClick]);

  async function handleExplain() {
    if (!selectedText || loading) return;

    const limit = checkDailyLimit(!!user);
    if (!limit.allowed) {
      setLimitMessage(
        t.tutor.daily_limit
          .replace("{n}", String(limit.count))
          .replace("{max}", String(limit.max))
      );
      setShowPanel(true);
      setPopupPos(null);
      return;
    }

    setShowPanel(true);
    setLoading(true);
    setExplanation("");
    setLimitMessage("");
    setPopupPos(null);
    incrementDailyCount();

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Explain this in the context of AI/programming education, in 2-3 simple sentences: "${selectedText}"`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setExplanation(data.answer);
    } catch (e) {
      setExplanation((e as Error).message || "Failed to get explanation");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setShowPanel(false);
    setExplanation("");
    setSelectedText("");
    setLimitMessage("");
  }

  return (
    <>
      {/* 드래그 후 뜨는 작은 버튼 */}
      {popupPos && !showPanel && (
        <button
          onClick={handleExplain}
          style={{
            position: "absolute",
            left: `${popupPos.x}px`,
            top: `${popupPos.y}px`,
            transform: "translate(-50%, -100%)",
            zIndex: 60,
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
            bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium
            shadow-xl shadow-violet-900/50 transition-all animate-fade-in-up"
        >
          <Sparkles size={12} />
          {t.tutor.explain_this}
        </button>
      )}

      {/* 설명 패널 (하단 고정) */}
      {showPanel && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50
          rounded-xl border border-violet-700/50 bg-[#0f1117] shadow-2xl
          shadow-violet-900/30 animate-fade-in-up">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-violet-400" />
              <span className="text-xs font-semibold text-white">{t.tutor.title}</span>
            </div>
            <button
              onClick={handleClose}
              aria-label={t.home.close_answer}
              className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <div className="p-4">
            {limitMessage ? (
              <p className="text-xs text-amber-400">{limitMessage}</p>
            ) : (
              <>
                <div className="px-3 py-2 rounded-lg bg-violet-950/30 border border-violet-800/40 mb-3">
                  <p className="text-xs text-violet-300 line-clamp-2">&ldquo;{selectedText}&rdquo;</p>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                    <Loader2 size={14} className="animate-spin" />
                    {t.tutor.thinking}
                  </div>
                ) : (
                  <p className="text-sm text-slate-300 leading-relaxed">{explanation}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

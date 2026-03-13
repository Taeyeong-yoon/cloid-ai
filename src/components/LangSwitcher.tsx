"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const LANGS = [
  { code: "ko" as const, label: "한국어", short: "KO" },
  { code: "en" as const, label: "English", short: "EN" },
];

export default function LangSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      {/* 트리거 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`언어 선택, 현재: ${current.label}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
          border border-slate-600 bg-slate-800 text-slate-200
          hover:border-violet-500 hover:text-violet-300 hover:bg-violet-900/30
          transition-all duration-150 select-none"
      >
        <Globe size={13} className="text-slate-400" />
        <span>{current.short}</span>
        <ChevronDown
          size={11}
          className={`text-slate-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* 드롭다운 */}
      {open && (
        <div role="listbox" aria-label="언어 선택" className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-700 bg-[#0f1117] shadow-2xl shadow-black/60 overflow-hidden z-[100]">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={locale === lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                ${locale === lang.code
                  ? "text-violet-300 bg-violet-900/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <span>{lang.label}</span>
              {locale === lang.code && <Check size={13} className="text-violet-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

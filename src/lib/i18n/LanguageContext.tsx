"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Locale, translations } from "./translations";

const STORAGE_KEY = "cloid-locale";

// 중첩 객체를 Record<string, string | string[] | object[]>으로 느슨하게 타입 처리
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translation = Record<string, any>;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

// localStorage 우선, 없으면 브라우저 언어 감지 (ko → Korean, else → English)
function getInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "en" || saved === "ko") return saved;
    if (typeof navigator !== "undefined" && navigator.language.startsWith("ko")) return "ko";
  } catch {
    // localStorage unavailable (SSR / private mode)
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const detected = getInitialLocale();
    setLocaleState(detected);
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "ko" ? "ko" : "en";
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

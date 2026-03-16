"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Brain,
  BookOpen,
  Zap,
  FlaskConical,
  User,
  LogIn,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import LangSwitcher from "./LangSwitcher";

const SEARCH_TABS = [
  { key: "all", labelKey: "tab_all", href: (q: string) => `/learning?q=${encodeURIComponent(q)}` },
  { key: "radar", labelKey: "tab_radar", href: (q: string) => `/radar?q=${encodeURIComponent(q)}` },
  { key: "learning", labelKey: "tab_learning", href: (q: string) => `/learning?q=${encodeURIComponent(q)}` },
  { key: "skills", labelKey: "tab_skills", href: (q: string) => `/skills?q=${encodeURIComponent(q)}` },
  { key: "labs", labelKey: "tab_labs", href: (q: string) => `/labs?q=${encodeURIComponent(q)}` },
] as const;

function SearchModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { user, openLoginModal } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof SEARCH_TABS)[number]["key"]>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const popularKeywords = t.search.popular_keywords as string[];

  function getTabLabel(tabKey: (typeof SEARCH_TABS)[number]["key"]) {
    const tab = SEARCH_TABS.find((item) => item.key === tabKey);
    if (!tab) return "";
    return (t.search as Record<string, string>)[tab.labelKey] ?? tab.key;
  }

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const tab = SEARCH_TABS.find((item) => item.key === activeTab) ?? SEARCH_TABS[0];
    const dest = tab.href(query.trim());
    onClose();
    if (!user) {
      openLoginModal();
    } else {
      router.push(dest);
    }
  }

  function handleAskAI() {
    onClose();
    router.push("/");
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.search.title}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0f1117] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSearch} role="search" className="flex items-center gap-3 p-4 border-b border-slate-800">
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search.placeholder}
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-sm outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.search.close_search}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X size={18} />
          </button>
        </form>

        <div className="flex gap-1 p-3 border-b border-slate-800 overflow-x-auto">
          {SEARCH_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {getTabLabel(tab.key)}
            </button>
          ))}
        </div>

        <div className="p-4">
          {query.trim() ? (
            <button
              onClick={handleSearch as unknown as React.MouseEventHandler}
              className="w-full flex items-center gap-2 p-3 rounded-lg border border-slate-700 hover:border-violet-600 hover:bg-violet-900/10 transition-all text-left"
            >
              <Search size={14} className="text-violet-400 shrink-0" />
              <span className="text-sm text-slate-300">
                <span className="font-medium text-violet-300">"{query}"</span>{" "}
                {t.search.search_action} ({getTabLabel(activeTab)})
              </span>
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">{t.search.popular}</p>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setQuery(keyword)}
                    aria-label={`${keyword} ${t.search.search_action}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-violet-600 hover:text-violet-300 hover:bg-violet-900/20 transition-all"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-slate-800">
            <button
              onClick={handleAskAI}
              className="w-full text-xs text-violet-400 hover:text-violet-300 transition-colors text-center hover:underline"
            >
              {t.search.no_result_cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginTooltipVisible, setLoginTooltipVisible] = useState(false);
  const { locale, t } = useTranslation();
  const { user, openLoginModal } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const authed = isLoggedIn || !!user;
  const textbookLabel = locale === "ko" ? "교재" : "Textbook";

  const links = [
    { href: "/", label: t.nav.home, icon: Brain, guard: false },
    { href: "/radar", label: textbookLabel, icon: BookOpen, guard: false },
    { href: "/learning", label: t.nav.learning, icon: BookOpen, guard: false },
    { href: "/skills", label: t.nav.skills, icon: Zap, guard: true },
    { href: "/labs", label: t.nav.labs, icon: FlaskConical, guard: true },
  ];

  function handleClick(e: React.MouseEvent, href: string, guard: boolean) {
    e.preventDefault();
    setOpen(false);
    if (guard && !authed) {
      openLoginModal();
    } else {
      router.push(href);
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      <div className="hidden md:flex items-center gap-1">
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon, guard }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleClick(e, href, guard)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 cursor-pointer relative
                  hover:bg-gradient-to-r hover:from-violet-900/20 hover:to-blue-900/10
                  hover:shadow-[0_0_12px_rgba(139,92,246,0.08)]
                  ${isActive
                    ? "text-white bg-gradient-to-r from-violet-900/20 to-blue-900/10 nav-item-active"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                <Icon size={14} className={`transition-colors duration-200 ${isActive ? "text-violet-400" : "group-hover:text-violet-400"}`} />
                <span>{label}</span>
                {!isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/5 h-[2px] bg-gradient-to-r from-violet-500/60 to-blue-500/40 rounded-full transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-2 pl-2 border-l border-slate-700 flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label={t.search.open_search}
            title={t.search.open_search}
            className="flex items-center gap-1.5 px-2 h-8 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Search size={16} />
            <kbd className="hidden lg:inline text-[10px] px-1 py-0.5 rounded border border-slate-700 text-slate-500 font-mono leading-none">
              {t.search.shortcut_key}
            </kbd>
          </button>

          {authed ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-violet-400 hover:text-violet-300 hover:bg-slate-800 transition-colors"
            >
              <User size={14} />
              {t.common.my_account}
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={openLoginModal}
                onMouseEnter={() => setLoginTooltipVisible(true)}
                onMouseLeave={() => setLoginTooltipVisible(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <LogIn size={14} />
                {t.common.login}
              </button>
              {loginTooltipVisible && (
                <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl border border-slate-700 bg-[#0f1117] shadow-xl z-50 text-xs text-slate-300 leading-relaxed">
                  {t.home.login_tooltip}
                </div>
              )}
            </div>
          )}
          <LangSwitcher />
        </div>
      </div>

      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
          aria-label={t.common.search}
        >
          <Search size={20} />
        </button>
        <LangSwitcher />
        <button
          className="p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setOpen((value) => !value)}
          aria-label={t.common.open_menu}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-[#0f1117] border-b border-slate-800 shadow-xl z-40 mobile-menu-enter">
          <nav className="flex flex-col p-3 gap-1">
            {links.map(({ href, label, icon: Icon, guard }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => handleClick(e, href, guard)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-base cursor-pointer ${
                    isActive
                      ? "text-white bg-violet-900/30 border-l-2 border-violet-500"
                      : "text-slate-300 hover:text-white hover:bg-slate-800 border-l-2 border-transparent"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-violet-400" : ""} />
                  {label}
                </Link>
              );
            })}
            <div className="border-t border-slate-800 mt-1 pt-1">
              {authed ? (
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-violet-400 hover:text-violet-300 hover:bg-slate-800 transition-colors text-base"
                >
                  <User size={18} />
                  {t.common.my_account}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    openLoginModal();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-base"
                >
                  <LogIn size={18} />
                  {t.common.login}
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

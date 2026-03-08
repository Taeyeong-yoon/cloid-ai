"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Brain,
  Radar,
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

// ── 검색 섹션 탭 ─────────────────────────────────────────────
const SEARCH_TABS = [
  { key: "all",      label: "전체",    href: (q: string) => `/learning?q=${encodeURIComponent(q)}` },
  { key: "radar",    label: "Radar",   href: (q: string) => `/radar?q=${encodeURIComponent(q)}` },
  { key: "learning", label: "Learning",href: (q: string) => `/learning?q=${encodeURIComponent(q)}` },
  { key: "skills",   label: "Skills",  href: (q: string) => `/skills?q=${encodeURIComponent(q)}` },
  { key: "labs",     label: "Labs",    href: (q: string) => `/labs?q=${encodeURIComponent(q)}` },
];

// ── 검색 모달 ────────────────────────────────────────────────
function SearchModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { user, openLoginModal } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

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
    const tab = SEARCH_TABS.find((t) => t.key === activeTab) ?? SEARCH_TABS[0];
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
    // 홈으로 이동 후 Ask AI 섹션 포커스
    router.push("/");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0f1117] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 검색 입력 */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-slate-800">
          <Search size={18} className="text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search?.placeholder ?? "검색어 입력..."}
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-sm outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X size={18} />
          </button>
        </form>

        {/* 섹션 탭 */}
        <div className="flex gap-1 p-3 border-b border-slate-800">
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
              {tab.label}
            </button>
          ))}
        </div>

        {/* 본문 */}
        <div className="p-4">
          {query.trim() ? (
            <button
              onClick={handleSearch as unknown as React.MouseEventHandler}
              className="w-full flex items-center gap-2 p-3 rounded-lg border border-slate-700 hover:border-violet-600 hover:bg-violet-900/10 transition-all text-left"
            >
              <Search size={14} className="text-violet-400 shrink-0" />
              <span className="text-sm text-slate-300">
                <span className="font-medium text-violet-300">"{query}"</span>{" "}
                검색하기 ({SEARCH_TABS.find((t) => t.key === activeTab)?.label})
              </span>
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">{t.search?.popular ?? "인기 검색어"}</p>
              <div className="flex flex-wrap gap-2">
                {["Claude API", "MCP", "프롬프트", "에이전트", "RAG", "LangChain"].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setQuery(keyword)}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-violet-600 hover:text-violet-300 hover:bg-violet-900/20 transition-all"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ask AI 연결 */}
          <div className="mt-3 pt-3 border-t border-slate-800">
            <button
              onClick={handleAskAI}
              className="w-full text-xs text-violet-400 hover:text-violet-300 transition-colors text-center hover:underline"
            >
              {t.search?.no_result_cta ?? "원하는 결과를 못 찾으셨나요? Ask AI에게 물어보세요 →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export default function NavMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginTooltipVisible, setLoginTooltipVisible] = useState(false);
  const { t } = useTranslation();
  const { user, openLoginModal } = useAuth();
  const router = useRouter();

  const authed = isLoggedIn || !!user;

  const links = [
    { href: "/",        label: t.nav.home,     icon: Brain,        guard: false },
    { href: "/radar",   label: t.nav.radar,    icon: Radar,        guard: false },
    { href: "/learning",label: t.nav.learning, icon: BookOpen,     guard: true  },
    { href: "/skills",  label: t.nav.skills,   icon: Zap,          guard: true  },
    { href: "/labs",    label: t.nav.labs,     icon: FlaskConical, guard: true  },
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

  // 키보드 단축키: Ctrl+K 또는 Cmd+K로 검색 열기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* ── 검색 모달 ── */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      {/* ── 데스크톱 (md 이상) ── */}
      <div className="hidden md:flex items-center gap-1">
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon, guard }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleClick(e, href, guard)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Icon size={14} />
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-2 pl-2 border-l border-slate-700 flex items-center gap-2">
          {/* 검색 아이콘 */}
          <button
            onClick={() => setSearchOpen(true)}
            title="검색 (Ctrl+K)"
            className="flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Search size={16} />
          </button>

          {/* 로그인 / 내 계정 */}
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
              {/* 로그인 혜택 툴팁 */}
              {loginTooltipVisible && (
                <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl border border-slate-700 bg-[#0f1117] shadow-xl z-50 text-xs text-slate-300 leading-relaxed">
                  {t.home.login_tooltip ?? "로그인하면: 학습 진도 저장 · 북마크 · 맞춤 추천 · 실습 기록 관리"}
                </div>
              )}
            </div>
          )}
          <LangSwitcher />
        </div>
      </div>

      {/* ── 모바일 (md 미만): 검색 + 언어 + 햄버거 ── */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="검색"
        >
          <Search size={20} />
        </button>
        <LangSwitcher />
        <button
          className="p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={t.common.open_menu}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── 모바일 드롭다운 메뉴 ── */}
      {open && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-[#0f1117] border-b border-slate-800 shadow-xl z-40">
          <nav className="flex flex-col p-3 gap-1">
            {links.map(({ href, label, icon: Icon, guard }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleClick(e, href, guard)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-base cursor-pointer"
              >
                <Icon size={18} />
                {label}
              </a>
            ))}
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

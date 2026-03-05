"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, Radar, BookOpen, Zap, FlaskConical, User, LogIn, Menu, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import LangSwitcher from "./LangSwitcher";

export default function NavMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const links = [
    { href: "/", label: t.nav.home, icon: Brain },
    { href: "/radar", label: t.nav.radar, icon: Radar },
    { href: "/learning", label: t.nav.learning, icon: BookOpen },
    { href: "/skills", label: t.nav.skills, icon: Zap },
    { href: "/labs", label: t.nav.labs, icon: FlaskConical },
  ];

  return (
    <>
      {/* ── 데스크톱 (md 이상) ── */}
      <div className="hidden md:flex items-center gap-1">
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-2 pl-2 border-l border-slate-700 flex items-center gap-2">
          {isLoggedIn ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-violet-400 hover:text-violet-300 hover:bg-slate-800 transition-colors"
            >
              <User size={14} />
              {t.common.my_account}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogIn size={14} />
              {t.common.login}
            </Link>
          )}

          {/* 언어 선택 드롭다운 */}
          <LangSwitcher />
        </div>
      </div>

      {/* ── 모바일 (md 미만): 언어버튼 + 햄버거 ── */}
      <div className="flex md:hidden items-center gap-2">
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
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-base"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <div className="border-t border-slate-800 mt-1 pt-1">
              {isLoggedIn ? (
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-violet-400 hover:text-violet-300 hover:bg-slate-800 transition-colors text-base"
                >
                  <User size={18} />
                  {t.common.my_account}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-base"
                >
                  <LogIn size={18} />
                  {t.common.login}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

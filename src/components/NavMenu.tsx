"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, Radar, BookOpen, Zap, FlaskConical, User, LogIn, Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "홈", icon: Brain },
  { href: "/radar", label: "레이더", icon: Radar },
  { href: "/learning", label: "학습", icon: BookOpen },
  { href: "/skills", label: "스킬", icon: Zap },
  { href: "/labs", label: "실습", icon: FlaskConical },
];

export default function NavMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 데스크톱 nav */}
      <nav className="hidden md:flex items-center gap-1">
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
        <div className="ml-2 pl-2 border-l border-slate-800">
          {isLoggedIn ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-violet-400 hover:text-violet-300 hover:bg-slate-800 transition-colors"
            >
              <User size={14} />
              내 계정
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogIn size={14} />
              로그인
            </Link>
          )}
        </div>
      </nav>

      {/* 모바일 햄버거 */}
      <button
        className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="메뉴 열기"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 모바일 드롭다운 */}
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
                  내 계정
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-base"
                >
                  <LogIn size={18} />
                  로그인
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

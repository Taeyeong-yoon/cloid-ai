import Link from "next/link";
import { Brain, Radar, BookOpen, Zap, FlaskConical, User, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const links = [
  { href: "/", label: "홈", icon: Brain },
  { href: "/radar", label: "레이더", icon: Radar },
  { href: "/learning", label: "학습", icon: BookOpen },
  { href: "/skills", label: "스킬", icon: Zap },
  { href: "/labs", label: "실습", icon: FlaskConical },
];

export default async function Nav() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase env vars 미설정 시 무시
  }

  return (
    <header className="border-b border-slate-800 bg-[#0f1117]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
          <span className="text-violet-400">CLOID</span>
          <span className="text-slate-400 font-normal text-sm">.AI</span>
        </Link>
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
          <div className="ml-2 pl-2 border-l border-slate-800">
            {user ? (
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
      </div>
    </header>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NavMenu from "./NavMenu";

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
    <header className="border-b border-slate-800 bg-[#0f1117]/80 backdrop-blur sticky top-0 z-50 nav-light-line">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14 relative">
        <Link href="/" className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5 group">
          <span className="text-violet-400 group-hover:text-violet-300 transition-colors">CLOID</span>
          <span className="text-slate-500 font-light text-sm group-hover:text-slate-400 transition-colors">.AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500/60 animate-pulse ml-0.5" />
        </Link>
        <NavMenu isLoggedIn={!!user} />
      </div>
    </header>
  );
}

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
    <header className="border-b border-slate-800 bg-[#0f1117]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14 relative">
        <Link href="/" className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
          <span className="text-violet-400">CLOID</span>
          <span className="text-slate-400 font-normal text-sm">.AI</span>
        </Link>
        <NavMenu isLoggedIn={!!user} />
      </div>
    </header>
  );
}

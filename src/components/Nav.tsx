import Link from "next/link";
import NavMenu from "./NavMenu";

// 주의: 여기서 Supabase(=cookies())를 호출하면 루트 레이아웃이 동적 렌더링으로
// 강제되어 사이트 전체가 CDN 캐시를 타지 못한다(모든 요청이 서버 렌더링).
// 로그인 상태는 NavMenu가 AuthContext(클라이언트)에서 이미 구독하므로
// 서버에서 다시 확인할 필요가 없다.
export default function Nav() {
  return (
    <header className="border-b border-slate-800 bg-[#0f1117]/80 backdrop-blur sticky top-0 z-50 nav-light-line">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14 relative">
        <Link href="/" className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5 group">
          <span className="text-violet-400 group-hover:text-violet-300 transition-colors">CLOID</span>
          <span className="text-slate-500 font-light text-sm group-hover:text-slate-400 transition-colors">.AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500/60 animate-pulse ml-0.5" />
        </Link>
        <NavMenu />
      </div>
    </header>
  );
}

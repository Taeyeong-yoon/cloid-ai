import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getBookmarks } from "@/app/actions/bookmarks";
import { signOut } from "@/app/actions/auth";
import { User, Bookmark, Zap, Radar, LogOut } from "lucide-react";
import TagBadge from "@/components/TagBadge";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const bookmarks = await getBookmarks();
  const radarBookmarks = bookmarks.filter((b) => b.type === "radar");
  const skillBookmarks = bookmarks.filter((b) => b.type === "skill");

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-violet-900/50 border border-violet-700 flex items-center justify-center">
            <User size={22} className="text-violet-300" />
          </div>
          <div>
            <div className="text-white font-semibold">{user.email}</div>
            <div className="text-xs text-slate-500 mt-0.5">가입일 {new Date(user.created_at).toLocaleDateString("ko-KR")}</div>
          </div>
        </div>
        <form action={signOut}>
          <button type="submit" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors">
            <LogOut size={14} /> 로그아웃
          </button>
        </form>
      </div>

      {/* Radar Bookmarks */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <Radar size={18} className="text-violet-400" />
          북마크한 트렌드 <span className="text-slate-500 text-sm font-normal">({radarBookmarks.length})</span>
        </h2>
        {radarBookmarks.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center border border-slate-800 rounded-xl">
            북마크한 트렌드 글이 없습니다. <Link href="/radar" className="text-violet-400">레이더</Link>에서 추가하세요.
          </p>
        ) : (
          <div className="space-y-2">
            {radarBookmarks.map((b) => (
              <Link
                key={b.id}
                href={`/radar/${b.slug}`}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-600 bg-slate-900/30 transition-colors"
              >
                <span className="text-sm text-slate-300 font-mono">{b.slug}</span>
                <span className="text-xs text-slate-600">{new Date(b.created_at).toLocaleDateString("ko-KR")}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Skill Bookmarks */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <Zap size={18} className="text-violet-400" />
          즐겨찾기한 스킬 <span className="text-slate-500 text-sm font-normal">({skillBookmarks.length})</span>
        </h2>
        {skillBookmarks.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center border border-slate-800 rounded-xl">
            즐겨찾기한 스킬이 없습니다. <Link href="/skills" className="text-violet-400">스킬</Link>에서 추가하세요.
          </p>
        ) : (
          <div className="space-y-2">
            {skillBookmarks.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/30">
                <span className="text-sm text-slate-300 font-mono">{b.slug}</span>
                <span className="text-xs text-slate-600">{new Date(b.created_at).toLocaleDateString("ko-KR")}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

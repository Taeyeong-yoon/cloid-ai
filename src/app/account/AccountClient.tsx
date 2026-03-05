"use client";

import Link from "next/link";
import { User, Zap, Radar, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface Bookmark {
  id: string;
  slug: string;
  type: string;
  created_at: string;
}

interface Props {
  email: string;
  createdAt: string;
  bookmarks: Bookmark[];
  signOut: () => Promise<void>;
}

export default function AccountClient({ email, createdAt, bookmarks, signOut }: Props) {
  const { t, locale } = useTranslation();
  const radarBookmarks = bookmarks.filter((b) => b.type === "radar");
  const skillBookmarks = bookmarks.filter((b) => b.type === "skill");

  const dateLocale = locale === "ko" ? "ko-KR" : "en-US";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Profile */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-violet-900/50 border border-violet-700 flex items-center justify-center">
            <User size={22} className="text-violet-300" />
          </div>
          <div>
            <div className="text-white font-semibold">{email}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              {t.account.joined} {new Date(createdAt).toLocaleDateString(dateLocale)}
            </div>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut size={14} /> {t.account.logout}
          </button>
        </form>
      </div>

      {/* Radar Bookmarks */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <Radar size={18} className="text-violet-400" />
          {t.account.bookmarked_trends}{" "}
          <span className="text-slate-500 text-sm font-normal">({radarBookmarks.length})</span>
        </h2>
        {radarBookmarks.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center border border-slate-800 rounded-xl">
            {t.account.no_radar_bookmarks}{" "}
            <Link href="/radar" className="text-violet-400 hover:text-violet-300">
              {t.account.no_radar_bookmarks_link}
            </Link>
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
                <span className="text-xs text-slate-600">
                  {new Date(b.created_at).toLocaleDateString(dateLocale)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Skill Bookmarks */}
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
          <Zap size={18} className="text-violet-400" />
          {t.account.saved_skills}{" "}
          <span className="text-slate-500 text-sm font-normal">({skillBookmarks.length})</span>
        </h2>
        {skillBookmarks.length === 0 ? (
          <p className="text-slate-500 text-sm py-4 text-center border border-slate-800 rounded-xl">
            {t.account.no_skill_bookmarks}{" "}
            <Link href="/skills" className="text-violet-400 hover:text-violet-300">
              {t.account.no_skill_bookmarks_link}
            </Link>
          </p>
        ) : (
          <div className="space-y-2">
            {skillBookmarks.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/30"
              >
                <span className="text-sm text-slate-300 font-mono">{b.slug}</span>
                <span className="text-xs text-slate-600">
                  {new Date(b.created_at).toLocaleDateString(dateLocale)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

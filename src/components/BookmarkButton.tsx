"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { addBookmark, removeBookmark, type BookmarkType } from "@/app/actions/bookmarks";
import { useAuth } from "@/lib/auth/AuthContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface Props {
  slug: string;
  type: BookmarkType;
  initialBookmarked?: boolean;
}

export default function BookmarkButton({ slug, type, initialBookmarked = false }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const { openLoginModal } = useAuth();
  const { t } = useTranslation();

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      if (bookmarked) {
        await removeBookmark(slug, type);
        setBookmarked(false);
      } else {
        const result = await addBookmark(slug, type);
        if ('error' in result && result.error) {
          // 로그인 필요 → 모달 방식으로 통일 (NavMenu, HomeClient와 동일한 UX)
          openLoginModal();
          return;
        }
        setBookmarked(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const label = bookmarked ? t.common.bookmark_remove : t.common.bookmark_add;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={label}
      aria-label={label}
      className={`p-1.5 rounded-md transition-all ${
        bookmarked
          ? "text-violet-400 hover:text-violet-300"
          : "text-slate-600 hover:text-slate-400"
      } disabled:opacity-50`}
    >
      {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
    </button>
  );
}

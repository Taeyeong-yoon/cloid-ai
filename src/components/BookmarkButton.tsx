"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { addBookmark, removeBookmark, type BookmarkType } from "@/app/actions/bookmarks";

interface Props {
  slug: string;
  type: BookmarkType;
  initialBookmarked?: boolean;
}

export default function BookmarkButton({ slug, type, initialBookmarked = false }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

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
          // 로그인 필요 → 페이지 이동
          window.location.href = '/login';
          return;
        }
        setBookmarked(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? "북마크 해제" : "북마크"}
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

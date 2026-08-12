"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function TrendsBackLink() {
  const { t } = useTranslation();
  return (
    <Link
      href="/trends"
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
    >
      {t.radar.back}
    </Link>
  );
}

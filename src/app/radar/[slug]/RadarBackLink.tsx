"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function RadarBackLink() {
  const { t } = useTranslation();
  return (
    <Link
      href="/radar"
      className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
    >
      {t.radar.back}
    </Link>
  );
}

"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function DifficultyBadge({ level }: { level: string }) {
  const { t } = useTranslation();
  const map: Record<string, { label: string; cls: string }> = {
    beginner:     { label: t.common.level_beginner,     cls: "bg-green-900/40 text-green-400 border-green-800/60" },
    intermediate: { label: t.common.level_intermediate, cls: "bg-yellow-900/40 text-yellow-400 border-yellow-800/60" },
    advanced:     { label: t.common.level_advanced,     cls: "bg-red-900/40 text-red-400 border-red-800/60" },
  };
  const { label, cls } = map[level] ?? map.beginner;
  return (
    <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

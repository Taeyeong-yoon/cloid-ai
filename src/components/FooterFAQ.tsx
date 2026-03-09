"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function FooterFAQ() {
  const { t } = useTranslation();

  const items = [
    { q: t.home.faq_q1, a: t.home.faq_a1 },
    { q: t.home.faq_q2, a: t.home.faq_a2 },
    { q: t.home.faq_q3, a: t.home.faq_a3 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-8">
      <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">FAQ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {items.map((item) => (
            <div key={item.q}>
              <p className="text-xs font-medium text-slate-300 mb-1">{item.q}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

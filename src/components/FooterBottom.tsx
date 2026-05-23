"use client";

import { Mail } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const CONTACT_EMAIL = "openvoiceai@naver.com";

export default function FooterBottom() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-800 bg-[#0f1117]/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 flex-wrap">
          {/* Brand + description */}
          <div>
            <div className="font-bold text-base text-white mb-1">
              <span className="text-violet-400">CLOID</span>
              <span className="text-slate-400 font-normal text-sm">.AI</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              {t.footer.brand_desc}
            </p>
          </div>

          {/* 문의 사항 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-4 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={14} className="text-violet-400" />
              <span className="text-sm font-semibold text-white">{t.footer.contact_title}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {t.footer.contact_desc}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300 transition-all hover:border-violet-400/50 hover:bg-violet-500/20 hover:text-violet-200"
            >
              <Mail size={12} />
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Links + update schedule */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-4">
              <a
                href="/#faq"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {t.footer.faq_link}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-500">
                {t.footer.update_schedule} ·{" "}
                {new Date().toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                })}{" "}
                {t.footer.updated_today}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/50">
          <p className="text-[10px] text-slate-600 text-center">
            © {new Date().getFullYear()} CLOID.AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

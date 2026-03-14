"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function FooterBottom() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-800 bg-[#0f1117]/80 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
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

          {/* Links + update schedule */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-4">
              <a
                href="/#faq"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {t.footer.faq_link}
              </a>
              <a
                href="mailto:feedback@cloid.ai"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {t.footer.feedback_link}
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

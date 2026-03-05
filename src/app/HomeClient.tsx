"use client";

import Link from "next/link";
import { Radar, BookOpen, Zap, FlaskConical, ArrowRight, TrendingUp } from "lucide-react";
import TagBadge from "@/components/TagBadge";
import AskAI from "@/components/AskAI";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { formatDate } from "@/lib/utils";
import type { RadarPost } from "@/lib/types";

interface HomeClientProps {
  posts: RadarPost[];
}

export default function HomeClient({ posts }: HomeClientProps) {
  const { t } = useTranslation();

  const quickLinks = [
    { href: "/radar", label: t.home.radar_label, icon: Radar, desc: t.home.radar_desc },
    { href: "/learning", label: t.home.learning_label, icon: BookOpen, desc: t.home.learning_desc },
    { href: "/skills", label: t.home.skills_label, icon: Zap, desc: t.home.skills_desc },
    { href: "/labs", label: t.home.labs_label, icon: FlaskConical, desc: t.home.labs_desc },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="py-6">
        <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
          <TrendingUp size={16} />
          <span>{t.home.trending_badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          CLOID<span className="text-violet-400">.AI</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-xl leading-relaxed">
          {t.home.hero_desc}
        </p>
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickLinks.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-violet-700 hover:bg-slate-800/50 transition-all"
          >
            <Icon size={20} className="text-violet-400" />
            <div>
              <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors leading-snug">
                {label}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
            </div>
          </Link>
        ))}
      </section>

      {/* Ask AI */}
      <AskAI />

      {/* Latest radar posts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Radar size={20} className="text-violet-400" />
            {t.home.latest_trends}
          </h2>
          <Link
            href="/radar"
            className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            {t.common.view_all} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/radar/${post.slug}`}
              className="group p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/40 transition-all"
            >
              <div className="text-xs text-slate-500 mb-2">{formatDate(post.date)}</div>
              <h3 className="font-medium text-white group-hover:text-violet-300 transition-colors mb-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2 mb-3">{post.summary}</p>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

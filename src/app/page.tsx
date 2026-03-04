import Link from "next/link";
import { getAllRadarPosts } from "@/lib/radar";
import { formatDate } from "@/lib/utils";
import { Radar, BookOpen, Zap, FlaskConical, ArrowRight, TrendingUp } from "lucide-react";
import TagBadge from "@/components/TagBadge";

const quickLinks = [
  { href: "/radar", label: "AI 트렌드 레이더", icon: Radar, desc: "최신 AI 동향 파악" },
  { href: "/learning", label: "주제별 학습", icon: BookOpen, desc: "체계적인 커리큘럼" },
  { href: "/skills", label: "스킬 레시피", icon: Zap, desc: "바로 쓸 수 있는 패턴" },
  { href: "/labs", label: "오늘의 실습", icon: FlaskConical, desc: "직접 실행해보기" },
];

export default function HomePage() {
  const posts = getAllRadarPosts().slice(0, 10);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="py-6">
        <div className="flex items-center gap-2 text-violet-400 text-sm font-medium mb-3">
          <TrendingUp size={16} />
          <span>2026 AI 최신 트렌드</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">
          CLOID<span className="text-violet-400">.AI</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl">
          AI 도구, 프롬프트, 개발 패턴을 한 곳에서 학습하고 실습하세요.
          매일 업데이트되는 AI 연습 포털.
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
              <div className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">{label}</div>
              <div className="text-xs text-slate-500">{desc}</div>
            </div>
          </Link>
        ))}
      </section>

      {/* Latest radar posts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Radar size={20} className="text-violet-400" />
            최신 트렌드
          </h2>
          <Link href="/radar" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
            전체 보기 <ArrowRight size={14} />
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

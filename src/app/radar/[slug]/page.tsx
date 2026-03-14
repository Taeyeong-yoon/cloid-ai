import type { Metadata } from "next";
import { getRadarPost, getAllRadarPosts } from "@/lib/radar";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import TagBadge from "@/components/TagBadge";
import RadarBackLink from "./RadarBackLink";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getRadarPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} – CLOID.AI Radar`,
    description: post.summary || "AI 트렌드 상세 분석 – CLOID.AI",
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://cloid.ai/radar/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return getAllRadarPosts().map((p) => ({ slug: p.slug }));
}

export default async function RadarPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getRadarPost(slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto">
      <RadarBackLink />
      <div className="text-sm text-slate-500 mb-2">{formatDate(post.date)}</div>
      <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
      <p className="text-slate-400 text-lg mb-4">{post.summary}</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {post.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
      </div>
      {post.content ? (
        <div className="prose prose-invert prose-slate max-w-none">
          <pre className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed font-sans">
            {post.content}
          </pre>
        </div>
      ) : post.sourceUrl ? (
        <div className="mt-4 p-4 rounded-xl border border-slate-700 bg-slate-900/40">
          <p className="text-sm text-slate-400 mb-3">Read the full article at the original source:</p>
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
          >
            {post.sourceUrl} →
          </a>
        </div>
      ) : null}
    </article>
  );
}

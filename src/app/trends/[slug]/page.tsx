import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllRadarPosts, getRadarPost } from "@/lib/radar";
import { formatDate } from "@/lib/utils";
import TagBadge from "@/components/TagBadge";
import TrendsBackLink from "./TrendsBackLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getRadarPost(slug);
  if (!post) return { title: "Not Found | CLOID.AI" };

  return {
    title: `${post.title} – CLOID.AI 트렌드`,
    description: post.summary || "AI 트렌드 상세 – CLOID.AI",
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `https://cloid.ai/trends/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return getAllRadarPosts().map((post) => ({ slug: post.slug }));
}

export default async function TrendPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getRadarPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <TrendsBackLink />
      <div className="mb-2 text-sm text-slate-500">{formatDate(post.date)}</div>
      <h1 className="mb-4 text-3xl font-bold text-white">{post.title}</h1>
      <p className="mb-4 text-lg text-slate-400">{post.summary}</p>
      <div className="mb-8 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      {post.content ? (
        <div className="prose prose-invert prose-slate max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
            {post.content}
          </pre>
        </div>
      ) : null}

      {post.sourceUrl ? (
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/40 p-4">
          <p className="mb-3 text-sm text-slate-400">원문에서 전체 내용을 확인하세요:</p>
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
          >
            {post.sourceUrl} →
          </a>
        </div>
      ) : null}
    </article>
  );
}

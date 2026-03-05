import { getRadarPost, getAllRadarPosts } from "@/lib/radar";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import TagBadge from "@/components/TagBadge";
import RadarBackLink from "./RadarBackLink";

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
      <div className="prose prose-invert prose-slate max-w-none">
        <pre className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed font-sans">
          {post.content}
        </pre>
      </div>
    </article>
  );
}

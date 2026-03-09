import type { Metadata } from "next";
import { getAllRadarPosts } from "@/lib/radar";
import RadarClient from "./RadarClient";

export const metadata: Metadata = {
  title: "AI 트렌드 Radar – CLOID.AI",
  description: "매일 업데이트되는 AI 최신 트렌드, 뉴스, 기술 동향을 확인하세요. LLM, 에이전트, MCP, RAG 등 실무 AI 트렌드 큐레이션.",
  openGraph: {
    title: "AI 트렌드 Radar – CLOID.AI",
    description: "매일 업데이트되는 AI 최신 트렌드, 뉴스, 기술 동향",
    url: "https://cloid.ai/radar",
  },
};

export default function RadarPage() {
  const posts = getAllRadarPosts();
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  return <RadarClient posts={posts} allTags={allTags} />;
}

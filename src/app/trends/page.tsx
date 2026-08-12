import type { Metadata } from "next";
import { getAllRadarPosts } from "@/lib/radar";
import TrendsClient from "./TrendsClient";

export const metadata: Metadata = {
  title: "AI 트렌드 – CLOID.AI | 매일 갱신되는 Claude·AI 소식",
  description:
    "Anthropic 릴리스, Claude Code 업데이트, 주요 AI 뉴스를 매일 자동 수집해 카테고리별로 정리합니다.",
  openGraph: {
    title: "AI 트렌드 – CLOID.AI",
    description: "Anthropic 릴리스와 주요 AI 뉴스를 매일 자동으로 정리합니다.",
    url: "https://cloid.ai/trends",
  },
};

export default function TrendsPage() {
  const posts = getAllRadarPosts();
  return <TrendsClient posts={posts} />;
}

import type { Metadata } from "next";
import { getAllTopics } from "@/lib/learning";
import LearningClient from "./LearningClient";

export const metadata: Metadata = {
  title: "AI 학습 – CLOID.AI | 프롬프트, Claude, MCP, RAG",
  description: "입문부터 고급까지 체계적으로 배우는 AI 학습 커리큘럼. 프롬프트 엔지니어링, Claude API, MCP, RAG, AI 에이전트 등 실무에 필요한 모든 주제.",
  openGraph: {
    title: "AI 학습 – CLOID.AI",
    description: "입문부터 고급까지 체계적인 AI 학습 커리큘럼",
    url: "https://cloid.ai/learning",
  },
};

export default function LearningPage() {
  const topics = getAllTopics();
  return <LearningClient topics={topics} />;
}

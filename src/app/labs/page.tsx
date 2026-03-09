import type { Metadata } from "next";
import { getAllLabs } from "@/lib/labs";
import LabsClient from "./LabsClient";

export const metadata: Metadata = {
  title: "AI 실습 Labs – CLOID.AI | 직접 해보는 AI 실습",
  description: "단계별 가이드로 직접 실행해보는 AI 실습. ChatGPT, Claude, Gemini, MCP 등 14개+ 실습 과제를 무료로 체험하세요.",
  openGraph: {
    title: "AI 실습 Labs – CLOID.AI",
    description: "단계별 가이드로 직접 실행해보는 AI 실습",
    url: "https://cloid.ai/labs",
  },
};

export default function LabsPage() {
  const labs = getAllLabs();
  return <LabsClient labs={labs} />;
}

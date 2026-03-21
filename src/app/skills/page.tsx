import type { Metadata } from "next";
import { getAllSkills } from "@/lib/skills";
import SkillsClient from "./SkillsClient";

export const metadata: Metadata = {
  title: "클로드 허브 – CLOID.AI | Claude 기능 & 활용 사례",
  description: "Claude 기본 기능 완전 가이드와 텔레그램·GitHub·Slack·n8n 등 실전 협업 사례를 한 곳에서. 상시 업데이트.",
  openGraph: {
    title: "클로드 허브 – CLOID.AI",
    description: "Claude 기능 가이드와 실전 활용 사례 모음",
    url: "https://cloid.ai/skills",
  },
};

export default function SkillsPage() {
  const skills = getAllSkills();
  return <SkillsClient skills={skills} />;
}

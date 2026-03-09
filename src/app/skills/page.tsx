import type { Metadata } from "next";
import { getAllSkills } from "@/lib/skills";
import SkillsClient from "./SkillsClient";

export const metadata: Metadata = {
  title: "AI 스킬 레시피 – CLOID.AI | 바로 쓰는 AI 패턴",
  description: "실무에 바로 적용하는 AI 스킬 레시피. 프롬프트 템플릿, API 코드, 자동화 패턴을 복사해서 바로 사용하세요.",
  openGraph: {
    title: "AI 스킬 레시피 – CLOID.AI",
    description: "실무에 바로 적용하는 AI 스킬 레시피 모음",
    url: "https://cloid.ai/skills",
  },
};

export default function SkillsPage() {
  const skills = getAllSkills();
  return <SkillsClient skills={skills} />;
}

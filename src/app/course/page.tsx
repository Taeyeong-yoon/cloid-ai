import type { Metadata } from "next";
import CourseClient from "./CourseClient";

export const metadata: Metadata = {
  title: "AI 클로드 활용 기본 교육 Level 1 | CLOID.AI",
  description:
    "생성형 AI의 원리부터 Chat·Cowork·Design·Skills까지, 6교시 120슬라이드로 업무 활용을 실습하는 무료 교육 과정입니다.",
  openGraph: {
    title: "AI 클로드 활용 기본 교육 Level 1 | CLOID.AI",
    description:
      "AI 원리 · 프롬프트 · 작업공간 · 보고서 디자인 · 나만의 스킬까지 6교시 실습 과정",
    url: "https://cloid.ai/course",
  },
};

export default function CoursePage() {
  return <CourseClient />;
}

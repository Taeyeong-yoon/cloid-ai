import { Suspense } from "react";
import HomeClient from "./HomeClient";
import { getAllTopics } from "@/lib/learning";
import { getAllLabs } from "@/lib/labs";
import { getAllSkills } from "@/lib/skills";
import { getAllRadarPosts } from "@/lib/radar";

export default function HomePage() {
  // 홈은 교육 과정 중심. 기존 라이브러리는 "더 배우기" 섹션에서 개수만 노출한다.
  const libraryCounts = {
    learning: getAllTopics().length,
    labs: getAllLabs().length,
    skills: getAllSkills().length,
    trends: getAllRadarPosts().length,
  };

  return (
    <Suspense>
      <HomeClient libraryCounts={libraryCounts} />
    </Suspense>
  );
}

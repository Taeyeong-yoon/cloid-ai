import { Suspense } from "react";
import HomeClient from "./HomeClient";
import { getAllRadarPosts } from "@/lib/radar";
import { getAllTopics } from "@/lib/learning";
import { getAllLabs } from "@/lib/labs";

export default function HomePage() {
  const radarPosts = getAllRadarPosts();
  const topics = getAllTopics();
  const labs = getAllLabs();

  // 실제 콘텐츠 수 (소셜프루프 정확도)
  const contentCounts = {
    total: radarPosts.length + topics.length + labs.length,
    learning: topics.length,
    labs: labs.length,
    radar: radarPosts.length,
  };

  // 최신 Radar: 날짜 기준 최근 7일 이내 우선, 없으면 가장 최근 항목
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentRadar =
    radarPosts.find((p) => new Date(p.date) >= sevenDaysAgo) ?? radarPosts[0] ?? null;

  const todayUpdate = {
    radar: recentRadar
      ? {
          slug: recentRadar.slug,
          title: recentRadar.title,
          summary: recentRadar.summary,
          tags: recentRadar.tags,
        }
      : null,
    learning: topics[0]
      ? {
          id: topics[0].id,
          title: topics[0].title,
          description: topics[0].description,
          level: topics[0].level,
          tags: topics[0].tags,
        }
      : null,
    lab: labs[0]
      ? {
          id: labs[0].id,
          title: labs[0].title,
          description: labs[0].description,
          difficulty: labs[0].difficulty,
          tags: labs[0].tags,
        }
      : null,
  };

  return (
    <Suspense>
      <HomeClient todayUpdate={todayUpdate} contentCounts={contentCounts} />
    </Suspense>
  );
}

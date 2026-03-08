import { Suspense } from "react";
import HomeClient from "./HomeClient";
import { getAllRadarPosts } from "@/lib/radar";
import { getAllTopics } from "@/lib/learning";
import { getAllLabs } from "@/lib/labs";

export default function HomePage() {
  const radarPosts = getAllRadarPosts();
  const topics = getAllTopics();
  const labs = getAllLabs();

  const todayUpdate = {
    radar: radarPosts[0]
      ? {
          slug: radarPosts[0].slug,
          title: radarPosts[0].title,
          summary: radarPosts[0].summary,
          tags: radarPosts[0].tags,
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
      <HomeClient todayUpdate={todayUpdate} />
    </Suspense>
  );
}

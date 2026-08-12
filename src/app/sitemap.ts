import { MetadataRoute } from "next";
import { getAllTopics } from "@/lib/learning";
import { getAllLabs } from "@/lib/labs";
import { getAllRadarPosts } from "@/lib/radar";
import { COURSE_LESSONS } from "@/constants/course";
import { TEXTBOOKS } from "@/constants/textbooks";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cloid.ai";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/course`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/radar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/learning`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/labs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/trends`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  // AI 트렌드 — 매일 자동 수집되는 콘텐츠
  const trendPages: MetadataRoute.Sitemap = getAllRadarPosts().map((post) => ({
    url: `${baseUrl}/trends/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 교육 과정 교시
  const coursePages: MetadataRoute.Sitemap = COURSE_LESSONS.map((lesson) => ({
    url: `${baseUrl}/course/${lesson.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // 인터랙티브 교재 — /radar/[slug]는 TEXTBOOKS만 매칭된다
  const textbookPages: MetadataRoute.Sitemap = TEXTBOOKS.filter((item) => item.ready).map((item) => ({
    url: `${baseUrl}/radar/${item.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const learningPages: MetadataRoute.Sitemap = getAllTopics().map((topic) => ({
    url: `${baseUrl}/learning?topic=${topic.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const labPages: MetadataRoute.Sitemap = getAllLabs().map((lab) => ({
    url: `${baseUrl}/labs?lab=${lab.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...coursePages,
    ...textbookPages,
    ...learningPages,
    ...labPages,
    ...trendPages,
  ];
}

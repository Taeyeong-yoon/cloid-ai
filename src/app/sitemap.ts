import { MetadataRoute } from "next";
import { getAllRadarPosts } from "@/lib/radar";
import { getAllTopics } from "@/lib/learning";
import { getAllLabs } from "@/lib/labs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cloid.ai";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/radar`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/learning`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/skills`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/labs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const radarPages: MetadataRoute.Sitemap = getAllRadarPosts().map((post) => ({
    url: `${baseUrl}/radar/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const learningPages: MetadataRoute.Sitemap = getAllTopics().map((topic) => ({
    url: `${baseUrl}/learning?topic=${topic.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const labPages: MetadataRoute.Sitemap = getAllLabs().map((lab) => ({
    url: `${baseUrl}/labs?lab=${lab.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...radarPages, ...learningPages, ...labPages];
}

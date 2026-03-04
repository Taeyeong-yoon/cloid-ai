import { getAllRadarPosts } from "@/lib/radar";
import RadarClient from "./RadarClient";

export default function RadarPage() {
  const posts = getAllRadarPosts();
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  return <RadarClient posts={posts} allTags={allTags} />;
}

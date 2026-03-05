import { getAllRadarPosts } from "@/lib/radar";
import HomeClient from "./HomeClient";

export default function HomePage() {
  const posts = getAllRadarPosts().slice(0, 10);
  return <HomeClient posts={posts} />;
}

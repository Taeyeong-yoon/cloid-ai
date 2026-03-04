import { getAllTopics } from "@/lib/learning";
import LearningClient from "./LearningClient";

export default function LearningPage() {
  const topics = getAllTopics();
  return <LearningClient topics={topics} />;
}

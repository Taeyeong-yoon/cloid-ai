import { getAllSkills } from "@/lib/skills";
import SkillsClient from "./SkillsClient";

export default function SkillsPage() {
  const skills = getAllSkills();
  const allTags = [...new Set(skills.flatMap((s) => s.tags))];
  return <SkillsClient skills={skills} allTags={allTags} />;
}

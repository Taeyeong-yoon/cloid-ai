import { getAllSkills } from "@/lib/skills";
import SkillsClient from "./SkillsClient";

export default function SkillsPage() {
  const skills = getAllSkills();
  return <SkillsClient skills={skills} />;
}

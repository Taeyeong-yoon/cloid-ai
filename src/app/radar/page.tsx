import type { Metadata } from "next";
import TextbookClient from "./TextbookClient";

export const metadata: Metadata = {
  title: "Interactive Textbooks | CLOID.AI",
  description:
    "Interactive AI textbooks for MCP, marketplace workflows, prompts, and practical tool usage inside CLOID.AI.",
  openGraph: {
    title: "Interactive Textbooks | CLOID.AI",
    description:
      "Interactive AI textbooks for MCP, marketplace workflows, prompts, and practical tool usage inside CLOID.AI.",
    url: "https://cloid.ai/radar",
  },
};

export default function RadarPage() {
  return <TextbookClient />;
}

import fs from "fs";
import path from "path";

type ContentCategory = "learning" | "labs";

function makeEvaluation(category: ContentCategory, data: Record<string, unknown>) {
  const title = String(data.title ?? "this content");
  const description = String(data.description ?? "");

  if (category === "learning") {
    return {
      prompt: "Paste your output, command result, or notes here and AI will evaluate whether your learning result matches the lesson goal.",
      context: `This learning topic is "${title}". ${description}`.trim(),
      successCriteria: [
        "The learner completed a concrete practice step",
        "The result matches the main lesson objective",
        "The learner can explain or verify what happened",
      ],
      commonMistakes: [
        "Only reading the lesson without trying the practice step",
        "Posting an incomplete command or partial result",
        "Confusing setup issues with the lesson outcome",
      ],
    };
  }

  return {
    prompt: "Paste your lab output, generated code, or error log here and AI will evaluate whether the lab is progressing correctly.",
    context: `This lab is "${title}". ${description}`.trim(),
    successCriteria: [
      "The learner completed the main lab step",
      "The output is concrete enough to inspect",
      "The result shows progress toward a working implementation",
    ],
    commonMistakes: [
      "Skipping verification after generating code",
      "Not including the real output or error message",
      "Stopping after setup without testing the actual task",
    ],
  };
}

function updateDirectory(category: ContentCategory) {
  const dir = path.resolve("content", category);
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".json"))) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as Record<string, unknown>;

    if (data.evaluation) continue;

    data.evaluation = makeEvaluation(category, data);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log(`Added evaluation to ${category}/${file}`);
  }
}

updateDirectory("learning");
updateDirectory("labs");

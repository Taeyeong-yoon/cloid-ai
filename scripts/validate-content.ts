import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.resolve("content");

type Status = "pass" | "warn" | "fail";

interface ValidationResult {
  file: string;
  category: string;
  missing: string[];
  status: Status;
}

function summarizeStatus(missing: string[], category: string): Status {
  if (missing.length === 0) return "pass";
  if (missing.includes("invalid-json") || missing.includes("title") || missing.includes("description")) {
    return "fail";
  }
  if (category === "labs" && missing.includes("steps")) {
    return "fail";
  }
  return "warn";
}

function validateJsonFile(filePath: string, category: "learning" | "labs"): ValidationResult {
  const missing: string[] = [];

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!data.title) missing.push("title");
    if (!data.description) missing.push("description");

    if (category === "learning") {
      if (!Array.isArray(data.resources) || data.resources.length === 0) missing.push("resources");
      const practiceResources = Array.isArray(data.resources)
        ? data.resources.filter((resource: { type?: string }) => resource.type === "practice")
        : [];
      if (!Array.isArray(data.quiz) || data.quiz.length === 0) missing.push("quiz");
      if (practiceResources.length === 0) missing.push("practice resource");
      if (!data.evaluation) missing.push("evaluation");
    }

    if (category === "labs") {
      if (!Array.isArray(data.steps) || data.steps.length === 0) missing.push("steps");
      const promptedSteps = Array.isArray(data.steps)
        ? data.steps.filter((step: { prompt?: string }) => Boolean(step.prompt))
        : [];
      if (!data.challenge) missing.push("challenge");
      if (promptedSteps.length === 0) missing.push("prompted step");
      if (!data.evaluation) missing.push("evaluation");
    }
  } catch {
    missing.push("invalid-json");
  }

  return {
    file: path.basename(filePath),
    category,
    missing,
    status: summarizeStatus(missing, category),
  };
}

function validateSkillFile(filePath: string): ValidationResult {
  const missing: string[] = [];

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (!data.title) missing.push("title");
    if (!data.summary) missing.push("summary");
    if (!Array.isArray(data.tags) || data.tags.length === 0) missing.push("tags");
    if (!data.difficulty) missing.push("difficulty");
    if (!content.trim()) missing.push("content");
  } catch {
    missing.push("invalid-markdown");
  }

  return {
    file: path.basename(filePath),
    category: "skills",
    missing,
    status: summarizeStatus(missing, "skills"),
  };
}

function collectResults(): ValidationResult[] {
  const results: ValidationResult[] = [];

  const learningDir = path.join(CONTENT_DIR, "learning");
  if (fs.existsSync(learningDir)) {
    for (const file of fs.readdirSync(learningDir).filter((name) => name.endsWith(".json"))) {
      results.push(validateJsonFile(path.join(learningDir, file), "learning"));
    }
  }

  const labsDir = path.join(CONTENT_DIR, "labs");
  if (fs.existsSync(labsDir)) {
    for (const file of fs.readdirSync(labsDir).filter((name) => name.endsWith(".json"))) {
      results.push(validateJsonFile(path.join(labsDir, file), "labs"));
    }
  }

  const skillsDir = path.join(CONTENT_DIR, "skills");
  if (fs.existsSync(skillsDir)) {
    for (const file of fs.readdirSync(skillsDir).filter((name) => name.endsWith(".md"))) {
      results.push(validateSkillFile(path.join(skillsDir, file)));
    }
  }

  return results;
}

function printReport(results: ValidationResult[]) {
  const passed = results.filter((result) => result.status === "pass").length;
  const warned = results.filter((result) => result.status === "warn").length;
  const failed = results.filter((result) => result.status === "fail").length;

  console.log("\nContent Validation Report\n");
  console.log(`Pass: ${passed}  Warn: ${warned}  Fail: ${failed}\n`);

  for (const result of results) {
    if (result.status === "pass") continue;
    const icon = result.status === "warn" ? "WARN" : "FAIL";
    console.log(`${icon} [${result.category}] ${result.file}`);
    console.log(`  Missing: ${result.missing.join(", ")}\n`);
  }

  if (failed > 0) {
    console.log(`${failed} content file(s) are missing critical data.`);
    process.exit(1);
  }
}

printReport(collectResults());

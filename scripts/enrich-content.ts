/**
 * scripts/enrich-content.ts
 *
 * AI로 콘텐츠를 자동 enrichment하는 스크립트
 * - Labs JSON: practicePrompts 생성 (steps/challenge는 이미 존재)
 * - Learning JSON: quiz 생성 (없는 것만) + practicePrompts 생성
 * - Skills MD: steps 생성 (frontmatter에 추가)
 *
 * 실행:
 *   OPENAI_API_KEY=sk-xxx npx tsx scripts/enrich-content.ts
 *   OPENAI_API_KEY=sk-xxx npx tsx scripts/enrich-content.ts --dry-run
 *   OPENAI_API_KEY=sk-xxx npx tsx scripts/enrich-content.ts --file content/labs/lab-xxx.json
 */

import fs from "fs";
import path from "path";

// ── CLI 인수 파싱 ──────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const SINGLE_FILE = (() => {
  const idx = args.indexOf("--file");
  return idx !== -1 ? args[idx + 1] : null;
})();

// ── 설정 ──────────────────────────────────────────────────────
const CONTENT_DIR = path.resolve("content");
const API_KEY = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
const USE_CLAUDE = !process.env.OPENAI_API_KEY && !!process.env.ANTHROPIC_API_KEY;
const DELAY_MS = 1500; // rate limit 방지

if (!API_KEY) {
  console.error("❌ API key required: set OPENAI_API_KEY or ANTHROPIC_API_KEY");
  process.exit(1);
}

// ── AI 호출 ───────────────────────────────────────────────────
async function callAI(prompt: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (USE_CLAUDE) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY!,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 2000,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
        const data = await res.json();
        return data.content?.[0]?.text ?? "";
      } else {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: 2000,
            temperature: 0.5,
            messages: [
              {
                role: "system",
                content:
                  "You are an AI education content generator. Always respond ONLY with valid JSON, no markdown, no extra text.",
              },
              { role: "user", content: prompt },
            ],
          }),
        });
        if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${await res.text()}`);
        const data = await res.json();
        return data.choices?.[0]?.message?.content ?? "";
      }
    } catch (e) {
      if (attempt === retries) throw e;
      console.warn(`  ⚠️  Attempt ${attempt} failed, retrying... (${(e as Error).message})`);
      await sleep(2000 * attempt);
    }
  }
  return "";
}

// ── JSON 파싱 (마크다운 fence 제거) ──────────────────────────
function parseJSON(raw: string): Record<string, unknown> {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  // 첫 번째 { } 블록 추출
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

// ── sleep ─────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── 파일 읽기 ─────────────────────────────────────────────────
function readJSON(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// ── frontmatter 파싱 (MD 파일) ────────────────────────────────
function parseFrontmatter(raw: string): { front: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { front: {}, body: raw };
  const front: Record<string, unknown> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: unknown = line.slice(colonIdx + 1).trim();
    // 배열 처리 (간단한 YAML 배열: ["a", "b"])
    if (typeof value === "string" && value.startsWith("[")) {
      try { value = JSON.parse(value.replace(/'/g, '"')); } catch { /* leave as string */ }
    }
    // 문자열 따옴표 제거
    if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    front[key] = value;
  }
  return { front, body: match[2] };
}

// ── frontmatter 직렬화 ────────────────────────────────────────
function serializeFrontmatter(front: Record<string, unknown>): string {
  const lines: string[] = ["---"];
  for (const [k, v] of Object.entries(front)) {
    if (Array.isArray(v)) {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else if (typeof v === "string") {
      lines.push(`${k}: "${v}"`);
    } else {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

// ── 프롬프트 ─────────────────────────────────────────────────

function labsPrompt(title: string, description: string, body: string): string {
  return `You are an AI education content designer for CLOID.AI.
Given this lab content, generate 2-3 hands-on practice prompts that learners can run in an AI chat interface.

Title: ${title}
Description: ${description}
Content: ${body.slice(0, 2500)}

Respond ONLY in valid JSON, no markdown:
{
  "practicePrompts": [
    {
      "label": "Short tab label (3-5 words)",
      "instruction": "One sentence explaining what the learner should do",
      "prompt": "The actual AI prompt text that auto-fills in the chat (40-200 chars)",
      "followUp": "Next challenge after seeing the AI response"
    }
  ]
}

Rules:
- 2-3 practicePrompts per lab
- Prompts must be self-contained, actionable AI prompts
- Each prompt should demonstrate a key concept from the lab
- followUp should encourage modifying the prompt to experiment
- All text in English`;
}

function learningQuizPrompt(title: string, description: string, body: string): string {
  return `You are an AI education quiz designer for CLOID.AI.
Generate a 3-question knowledge check quiz based on this learning content.

Title: ${title}
Description: ${description}
Content: ${body.slice(0, 2500)}

Respond ONLY in valid JSON:
{
  "quiz": [
    {
      "question": "Question text in English",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Why this is the correct answer"
    }
  ]
}

Rules:
- Exactly 3 questions
- 4 options per question, answer is 0-based index of correct option
- Questions test understanding, not memorization
- Wrong options should be plausible but clearly incorrect
- All text in English`;
}

function learningPracticePrompt(title: string, description: string, body: string): string {
  return `You are an AI education content designer for CLOID.AI.
Generate 2-3 practice prompts learners can run directly in an AI chat interface to practice concepts from this content.

Title: ${title}
Description: ${description}
Content: ${body.slice(0, 2500)}

Respond ONLY in valid JSON:
{
  "practicePrompts": [
    {
      "label": "Short tab label (3-5 words)",
      "instruction": "One sentence explaining what the learner should do",
      "prompt": "The actual AI prompt text (40-200 chars, self-contained)",
      "followUp": "Next challenge or variation to try"
    }
  ]
}

Rules:
- 2-3 practicePrompts
- Prompts must work without any external files or context
- Focus on the core skill of this learning topic
- followUp should push the learner to experiment
- All text in English`;
}

function skillsStepsPrompt(title: string, summary: string, body: string): string {
  return `You are an AI education content designer for CLOID.AI.
Generate a 3-5 step practical checklist for this skill/recipe content.

Title: ${title}
Summary: ${summary}
Content: ${body.slice(0, 2500)}

Respond ONLY in valid JSON:
{
  "steps": [
    {
      "title": "Step title in English",
      "description": "What this step achieves",
      "action": "Exactly what the learner should do right now",
      "codeSnippet": "code or command (omit if not applicable)",
      "expectedResult": "What success looks like",
      "failureHint": "What to try if stuck"
    }
  ]
}

Rules:
- 3-5 steps (skills are focused, shorter than full labs)
- Every step must have action + expectedResult
- codeSnippet only when there is actual code to run
- Steps should be immediately actionable
- All text in English`;
}

// ── 콘텐츠 body 추출 ──────────────────────────────────────────
function extractBody(data: Record<string, unknown>): string {
  const fields = ["content", "body", "description", "summary"];
  const parts: string[] = [];
  for (const f of fields) {
    if (typeof data[f] === "string") parts.push(data[f] as string);
  }
  // resources 배열에서 description 추출
  if (Array.isArray(data.resources)) {
    for (const r of data.resources as Record<string, unknown>[]) {
      if (typeof r.description === "string") parts.push(r.description);
    }
  }
  return parts.join("\n\n").slice(0, 4000);
}

// ── 메인 ──────────────────────────────────────────────────────
async function main() {
  let processed = 0, skipped = 0, failed = 0;

  if (DRY_RUN) console.log("🔍 DRY-RUN mode — no files will be written\n");

  // git으로 현재 상태 보호 (content 파일은 git에서 복원 가능)
  if (!DRY_RUN) {
    console.log(`💾 Content files protected by git. Run 'git checkout content/' to revert.\n`);
  }

  // 단일 파일 모드
  if (SINGLE_FILE) {
    await processFile(SINGLE_FILE);
    console.log(`\n📊 Done: ${processed} enriched, ${skipped} skipped, ${failed} failed`);
    return;
  }

  // 전체 모드
  for (const category of ["labs", "learning", "skills"] as const) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  ${dir} not found, skipping`);
      continue;
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") || f.endsWith(".md"));
    console.log(`\n📁 ${category}: ${files.length} files`);

    for (const file of files) {
      await processFile(path.join(dir, file));
    }
  }

  console.log(`\n📊 완료: ${processed} enriched, ${skipped} skipped, ${failed} failed`);

  async function processFile(filePath: string) {
    const ext = path.extname(filePath);
    const category = filePath.includes("/labs/") || filePath.includes("\\labs\\")
      ? "labs"
      : filePath.includes("/learning/") || filePath.includes("\\learning\\")
      ? "learning"
      : "skills";

    try {
      if (ext === ".json") {
        const data = readJSON(filePath);
        const hasPractice = Array.isArray(data.practicePrompts) && (data.practicePrompts as unknown[]).length > 0;
        const hasQuiz = Array.isArray(data.quiz) && (data.quiz as unknown[]).length > 0;

        // Labs: practicePrompts만 생성 (steps/challenge 이미 있음)
        if (category === "labs") {
          if (hasPractice) {
            console.log(`⏭  ${path.basename(filePath)} — already has practicePrompts`);
            skipped++;
            return;
          }
          const title = String(data.title ?? "");
          const description = String(data.description ?? "");
          const body = extractBody(data);

          console.log(`🔄 ${path.basename(filePath)} — generating practicePrompts...`);
          if (DRY_RUN) { console.log("  [DRY-RUN] would generate practicePrompts"); processed++; return; }

          const raw = await callAI(labsPrompt(title, description, body));
          const generated = parseJSON(raw);
          if (Array.isArray(generated.practicePrompts)) {
            data.practicePrompts = generated.practicePrompts;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
            console.log(`✅ ${path.basename(filePath)} — ${(generated.practicePrompts as unknown[]).length} practice prompts added`);
            processed++;
          } else {
            throw new Error("practicePrompts not found in response");
          }
        }

        // Learning: quiz + practicePrompts 생성
        else if (category === "learning") {
          if (hasQuiz && hasPractice) {
            console.log(`⏭  ${path.basename(filePath)} — already has quiz + practicePrompts`);
            skipped++;
            return;
          }
          const title = String(data.title ?? "");
          const description = String(data.description ?? "");
          const body = extractBody(data);

          let anyAdded = false;

          if (!hasQuiz) {
            console.log(`🔄 ${path.basename(filePath)} — generating quiz...`);
            if (!DRY_RUN) {
              const raw = await callAI(learningQuizPrompt(title, description, body));
              const generated = parseJSON(raw);
              if (Array.isArray(generated.quiz)) {
                data.quiz = generated.quiz;
                anyAdded = true;
                console.log(`  ✓ quiz: ${(generated.quiz as unknown[]).length} questions`);
              }
              await sleep(DELAY_MS);
            } else {
              console.log("  [DRY-RUN] would generate quiz");
            }
          }

          if (!hasPractice) {
            console.log(`🔄 ${path.basename(filePath)} — generating practicePrompts...`);
            if (!DRY_RUN) {
              const raw = await callAI(learningPracticePrompt(title, description, body));
              const generated = parseJSON(raw);
              if (Array.isArray(generated.practicePrompts)) {
                data.practicePrompts = generated.practicePrompts;
                anyAdded = true;
                console.log(`  ✓ practicePrompts: ${(generated.practicePrompts as unknown[]).length}`);
              }
            } else {
              console.log("  [DRY-RUN] would generate practicePrompts");
            }
          }

          if (!DRY_RUN && anyAdded) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
          }
          if (anyAdded || DRY_RUN) {
            console.log(`✅ ${path.basename(filePath)} — enriched`);
            processed++;
          } else {
            skipped++;
          }
        }
      }

      // Skills: .md 파일 — steps 생성
      else if (ext === ".md" && category === "skills") {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { front, body } = parseFrontmatter(raw);

        if (Array.isArray(front.steps) && (front.steps as unknown[]).length > 0) {
          console.log(`⏭  ${path.basename(filePath)} — already has steps`);
          skipped++;
          return;
        }

        const title = String(front.title ?? path.basename(filePath, ".md"));
        const summary = String(front.summary ?? "");

        console.log(`🔄 ${path.basename(filePath)} — generating steps...`);
        if (DRY_RUN) { console.log("  [DRY-RUN] would generate steps"); processed++; return; }

        const aiRaw = await callAI(skillsStepsPrompt(title, summary, body));
        const generated = parseJSON(aiRaw);
        if (Array.isArray(generated.steps)) {
          front.steps = generated.steps;
          const newContent = serializeFrontmatter(front) + "\n" + body;
          fs.writeFileSync(filePath, newContent, "utf-8");
          console.log(`✅ ${path.basename(filePath)} — ${(generated.steps as unknown[]).length} steps added`);
          processed++;
        } else {
          throw new Error("steps not found in response");
        }
      }

      await sleep(DELAY_MS);
    } catch (e) {
      console.error(`❌ ${path.basename(filePath)} — ${(e as Error).message}`);
      failed++;
    }
  }
}

main();

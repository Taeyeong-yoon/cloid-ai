import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const AUTOMATION_SECRET = process.env.CLAUDE_HUB_API_SECRET;

interface ClaudeHubDraft {
  title: string;
  summary: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "features" | "usecases";
  badge?: string;
  slug: string;
  markdownBody: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80);
}

function normalizeDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10);
  return parsed.toISOString().slice(0, 10);
}

function buildMarkdown(draft: ClaudeHubDraft, updated: string) {
  const tags = draft.tags.slice(0, 6);
  const badge = draft.badge?.trim() ? draft.badge.trim() : "NEW";

  return `---
title: ${draft.title}
summary: ${draft.summary}
tags:
${tags.map((tag) => `  - ${tag}`).join("\n")}
difficulty: ${draft.difficulty}
category: ${draft.category}
updated: ${updated}
badge: ${badge}
---

${draft.markdownBody.trim()}
`;
}

function extractJson(text: string): ClaudeHubDraft {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned) as Partial<ClaudeHubDraft>;

  if (!parsed.title || !parsed.summary || !parsed.markdownBody) {
    throw new Error("Model output is missing required fields.");
  }

  return {
    title: parsed.title.trim(),
    summary: parsed.summary.trim(),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
    difficulty:
      parsed.difficulty === "beginner" ||
      parsed.difficulty === "intermediate" ||
      parsed.difficulty === "advanced"
        ? parsed.difficulty
        : "intermediate",
    category: parsed.category === "features" || parsed.category === "usecases" ? parsed.category : "features",
    badge: parsed.badge ? String(parsed.badge).trim() : "NEW",
    slug: parsed.slug ? slugify(String(parsed.slug)) : slugify(parsed.title),
    markdownBody: parsed.markdownBody.trim(),
  };
}

export async function POST(req: NextRequest) {
  if (AUTOMATION_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${AUTOMATION_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const emailBody = typeof body.body === "string" ? body.body.trim() : "";
  const from = typeof body.from === "string" ? body.from.trim() : "";
  const receivedAt = normalizeDate(typeof body.receivedAt === "string" ? body.receivedAt : undefined);

  if (!subject || !emailBody) {
    return NextResponse.json(
      { error: "Both 'subject' and 'body' are required." },
      { status: 400 }
    );
  }

  const openai = new OpenAI({ apiKey });

  const systemPrompt = [
    "You are the CLOID.AI Claude Hub technical editor.",
    "Transform a technical Anthropic or Claude email into a publish-ready Claude Hub markdown draft.",
    "Write in Korean.",
    "Be practical, concise, and editorial rather than promotional.",
    "Do not copy marketing copy verbatim.",
    "Focus on product changes, technical meaning, workflow implications, and practical usage.",
    "Return JSON only.",
    "Use this exact schema:",
    "{",
    '  "title": "short title",',
    '  "summary": "1-2 sentence summary",',
    '  "tags": ["tag1", "tag2", "tag3"],',
    '  "difficulty": "beginner|intermediate|advanced",',
    '  "category": "features|usecases",',
    '  "badge": "NEW",',
    '  "slug": "kebab-case-slug",',
    '  "markdownBody": "Body markdown starting with ## 핵심 내용"',
    "}",
    "The markdownBody must include exactly these sections in Korean:",
    "## 핵심 내용",
    "## 왜 중요한가",
    "## 실무 활용 관점",
    "## 체크할 점",
    "## 추천 대상",
  ].join(" ");

  const userPrompt = [
    `메일 제목: ${subject}`,
    `발신자: ${from || "unknown"}`,
    `수신일: ${receivedAt}`,
    "",
    "메일 본문:",
    emailBody.slice(0, 12000),
  ].join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 1400,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      throw new Error("No model output.");
    }

    const draft = extractJson(raw);
    const markdown = buildMarkdown(draft, receivedAt);
    const fileName = `${draft.slug || slugify(draft.title)}.md`;

    return NextResponse.json({
      success: true,
      fileName,
      path: `content/skills/${fileName}`,
      draft: {
        title: draft.title,
        summary: draft.summary,
        tags: draft.tags,
        difficulty: draft.difficulty,
        category: draft.category,
        updated: receivedAt,
        badge: draft.badge ?? "NEW",
        slug: draft.slug || slugify(draft.title),
      },
      markdown,
    });
  } catch (error) {
    console.error("Claude Hub post generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate Claude Hub draft.", detail: String(error) },
      { status: 500 }
    );
  }
}

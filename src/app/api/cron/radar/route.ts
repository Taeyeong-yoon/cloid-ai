import { NextResponse } from "next/server";

// ── 보안: 환경변수로 CRON 비밀키 검증 ─────────────────────
// CRON_SECRET은 Vercel 환경변수에 설정하세요.
// 생성 예시: openssl rand -hex 32
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // 인증 확인
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API 키 미설정" }, { status: 500 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];

    // 1. OpenAI API로 오늘의 AI 트렌드 생성
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 800,
        messages: [
          {
            role: "system",
            content: `너는 AI 트렌드 전문 기자야. 오늘 날짜 기준으로 AI 업계의 최신 뉴스/트렌드 1개를 선정하여 아래 JSON 형식으로 작성해.
주제는 LLM, AI 에이전트, 프롬프트 엔지니어링, AI 도구, MCP, RAG 등에서 선택.
반드시 아래 JSON만 출력하고 다른 텍스트는 쓰지 마.
{
  "title": "제목 (한국어, 40자 이내)",
  "summary": "요약 (한국어, 100자 이내)",
  "content": "본문 (한국어, 마크다운, 500자 이내)",
  "tags": ["태그1", "태그2"],
  "slug": "영문-슬러그-형태"
}`,
          },
          {
            role: "user",
            content: `오늘은 ${today}이야. 오늘의 AI 트렌드를 작성해줘.`,
          },
        ],
      }),
    });

    const data = await openaiRes.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI 응답 없음");

    // 2. JSON 파싱
    const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    const slug = `${today}-${parsed.slug}`;

    // 3. GitHub API로 파일 커밋 (Vercel 파일시스템은 읽기 전용)
    // 주의: Vercel 서버리스 환경에서는 fs.writeFileSync 불가.
    // GITHUB_TOKEN 환경변수와 GITHUB_REPO (예: "Taeyeong-yoon/cloid-ai")가 필요합니다.
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO ?? "Taeyeong-yoon/cloid-ai";

    if (!githubToken) {
      // GitHub 토큰 없으면 생성된 내용만 반환 (로컬 테스트용)
      return NextResponse.json({ success: true, slug, preview: parsed });
    }

    const mdContent = `---
title: "${parsed.title}"
summary: "${parsed.summary}"
date: "${today}"
tags: [${parsed.tags.map((t: string) => `"${t}"`).join(", ")}]
slug: "${slug}"
---

${parsed.content}
`;

    const filePath = `content/radar/${slug}.md`;
    const encodedContent = Buffer.from(mdContent, "utf-8").toString("base64");

    // GitHub API: 파일 생성
    const githubRes = await fetch(
      `https://api.github.com/repos/${githubRepo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `chore: auto-generate radar post ${slug}`,
          content: encodedContent,
        }),
      }
    );

    if (!githubRes.ok) {
      const err = await githubRes.json();
      throw new Error(`GitHub 커밋 실패: ${JSON.stringify(err)}`);
    }

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Radar 자동 생성 실패:", error);
    return NextResponse.json({ error: "생성 실패", detail: String(error) }, { status: 500 });
  }
}

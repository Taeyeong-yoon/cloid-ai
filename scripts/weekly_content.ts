#!/usr/bin/env tsx
/**
 * weekly_content.ts
 * 매주 월요일 AI 트렌드 기반 콘텐츠 자동 생성
 * 1. 네이버 뉴스 API로 이번 주 AI 트렌드 수집
 * 2. Gemini API로 트렌드 분석 → Skills .md 2개 생성
 * 3. Gemini API로 관련 Labs .json 1개 생성
 */

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

const skillsDir = path.join(process.cwd(), 'content', 'skills');
const labsDir = path.join(process.cwd(), 'content', 'labs');
fs.mkdirSync(skillsDir, { recursive: true });
fs.mkdirSync(labsDir, { recursive: true });

// ═══════════════════════════════════════
// Types
// ═══════════════════════════════════════

interface NaverNewsItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
}

interface TrendSummary {
  headlines: string[];
  topics: string[];
}

// ═══════════════════════════════════════
// Naver News API
// ═══════════════════════════════════════

async function fetchNaverAITrends(): Promise<TrendSummary> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.log('⚠️  NAVER_CLIENT_ID/SECRET 없음 — fallback 트렌드 사용');
    return getFallbackTrends();
  }

  const queries = ['AI 에이전트', 'Claude AI', 'LLM 활용'];
  const allItems: NaverNewsItem[] = [];

  for (const q of queries) {
    try {
      const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(q)}&display=5&sort=date`;
      const res = await fetch(url, {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const data = await res.json() as { items?: NaverNewsItem[] };
      allItems.push(...(data.items ?? []));
    } catch {
      // 개별 쿼리 실패 무시
    }
  }

  if (allItems.length === 0) return getFallbackTrends();

  const headlines = allItems
    .map((item) => item.title.replace(/<[^>]+>/g, '').trim())
    .slice(0, 8);

  // 간단한 키워드 추출
  const keywordCounts: Record<string, number> = {};
  const keywords = ['에이전트', 'RAG', 'MCP', '자동화', '멀티모달', 'AI 코딩', '프롬프트', 'LLM', '챗봇', '배포'];
  headlines.forEach((h) => {
    keywords.forEach((k) => {
      if (h.includes(k)) keywordCounts[k] = (keywordCounts[k] ?? 0) + 1;
    });
  });

  const topics = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);

  return { headlines, topics: topics.length > 0 ? topics : ['AI 에이전트', 'AI 자동화'] };
}

function getFallbackTrends(): TrendSummary {
  return {
    headlines: [
      'AI 에이전트 기술, 2025년 가장 뜨거운 트렌드',
      'Claude 3.5, 코딩 작업에서 최고 성능 기록',
      'AI 자동화로 업무 효율 3배 향상',
    ],
    topics: ['AI 에이전트', 'AI 자동화', '프롬프트 엔지니어링'],
  };
}

// ═══════════════════════════════════════
// Gemini API
// ═══════════════════════════════════════

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY 없음');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API 오류: ${res.status} ${err.slice(0, 200)}`);
  }

  const data = await res.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ═══════════════════════════════════════
// Skill .md 생성
// ═══════════════════════════════════════

async function generateSkillMd(trend: string, headlines: string[]): Promise<{ slug: string; content: string }> {
  const prompt = `
당신은 AI 학습 콘텐츠 작성 전문가입니다.

이번 주 AI 트렌드 헤드라인:
${headlines.slice(0, 5).join('\n')}

위 트렌드를 반영해서 "${trend}" 주제로 스킬 레시피 마크다운을 작성해주세요.

## 형식 (반드시 따를 것):

\`\`\`
---
title: "제목"
tags: ["태그1", "태그2", "태그3"]
difficulty: "beginner" | "intermediate" | "advanced"
summary: "한 줄 요약"
---

## 🎯 학습 목표

1. 목표1
2. 목표2
3. 목표3

---

## 🛠️ 실습 1 — [실습명]

[실습 내용]

---

## 🛠️ 실습 2 — [실습명]

[실습 내용]

---

## 💬 프롬프트 템플릿

### 1. [이름]
\`\`\`
[프롬프트]
\`\`\`

### 2. [이름]
\`\`\`
[프롬프트]
\`\`\`

### 3. [이름]
\`\`\`
[프롬프트]
\`\`\`

---

## 🎯 도전 과제

[도전 과제 내용]

---

## ⚠️ 자주 하는 실수 3가지

1. **실수1**: 설명
2. **실수2**: 설명
3. **실수3**: 설명

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- ${trend} 실전 활용 한국어 2025

---

## 📚 참고 자료

- [관련 공식 문서 제목](https://docs.example.com)
\`\`\`

파일명으로 사용할 slug도 함께 반환해주세요.
응답 형식:
SLUG: [영문-하이픈-구분]
CONTENT:
[마크다운 전체 내용]
`.trim();

  const raw = await callGemini(prompt);

  const slugMatch = raw.match(/SLUG:\s*([^\n]+)/);
  const contentMatch = raw.match(/CONTENT:\n([\s\S]+)/);

  const slug = slugMatch?.[1]?.trim() ?? `weekly-${trend.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
  const content = contentMatch?.[1]?.trim() ?? raw;

  return { slug, content };
}

// ═══════════════════════════════════════
// Lab .json 생성
// ═══════════════════════════════════════

async function generateLabJson(trend: string, headlines: string[]): Promise<{ id: string; content: string }> {
  const today = format(new Date(), 'yyyy-MM-dd');

  const prompt = `
당신은 AI 실습 콘텐츠 작성 전문가입니다.

이번 주 AI 트렌드 헤드라인:
${headlines.slice(0, 5).join('\n')}

위 트렌드를 반영해서 "${trend}" 주제로 Labs 실습 JSON을 작성해주세요.

## 형식 (valid JSON, 반드시 따를 것):

{
  "id": "lab-[영문-하이픈]-${today}",
  "title": "실습 제목",
  "description": "실습 설명 (2-3문장)",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "duration": "10분" | "30분" | "1시간",
  "tags": ["태그1", "태그2"],
  "steps": [
    {
      "step": 1,
      "title": "단계 제목",
      "instruction": "수행할 작업 설명",
      "prompt": "AI에게 붙여넣을 프롬프트",
      "expected_result": "예상 결과물 설명",
      "tip": "팁이나 주의사항"
    },
    {
      "step": 2,
      "title": "단계 제목",
      "instruction": "수행할 작업 설명",
      "prompt": "AI에게 붙여넣을 프롬프트",
      "expected_result": "예상 결과물 설명",
      "tip": "팁이나 주의사항"
    },
    {
      "step": 3,
      "title": "단계 제목",
      "instruction": "수행할 작업 설명",
      "prompt": "AI에게 붙여넣을 프롬프트",
      "expected_result": "예상 결과물 설명",
      "tip": "팁이나 주의사항"
    }
  ],
  "challenge": "추가 도전 과제",
  "related_skills": ["관련-스킬-파일명"],
  "videos": [
    {
      "title": "참고 영상 제목",
      "search_keyword": "${trend} 실전 한국어 2025",
      "url": ""
    }
  ]
}

JSON만 반환하세요. 마크다운 코드블록 없이 순수 JSON.
`.trim();

  const raw = await callGemini(prompt);

  // JSON 추출 시도
  const jsonMatch = raw.match(/\{[\s\S]+\}/);
  const jsonStr = jsonMatch?.[0] ?? raw;

  // 파싱 검증
  const parsed = JSON.parse(jsonStr);
  const id = parsed.id as string;

  return { id, content: JSON.stringify(parsed, null, 2) };
}

// ═══════════════════════════════════════
// Main
// ═══════════════════════════════════════

async function run() {
  console.log('🚀 weekly_content.ts 시작\n');

  // 1. 트렌드 수집
  console.log('📰 AI 트렌드 수집 중...');
  const trends = await fetchNaverAITrends();
  console.log(`✅ 헤드라인 ${trends.headlines.length}개, 주요 토픽: ${trends.topics.join(', ')}\n`);

  // 2. Skills .md 2개 생성
  const skillTopics = trends.topics.slice(0, 2);

  for (const topic of skillTopics) {
    console.log(`📝 Skills 생성 중: ${topic}`);
    try {
      const { slug, content } = await generateSkillMd(topic, trends.headlines);
      const filePath = path.join(skillsDir, `${slug}.md`);

      if (fs.existsSync(filePath)) {
        console.log(`  ⏭️  이미 존재: ${slug}.md — 스킵`);
        continue;
      }

      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✅ 저장: content/skills/${slug}.md`);
    } catch (e) {
      console.error(`  ❌ Skills 생성 실패 (${topic}):`, (e as Error).message);
    }
  }

  // 3. Labs .json 1개 생성
  const labTopic = trends.topics[0] ?? 'AI 에이전트';
  console.log(`\n🔬 Labs 생성 중: ${labTopic}`);
  try {
    const { id, content } = await generateLabJson(labTopic, trends.headlines);
    const filePath = path.join(labsDir, `${id}.json`);

    if (fs.existsSync(filePath)) {
      console.log(`  ⏭️  이미 존재: ${id}.json — 스킵`);
    } else {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✅ 저장: content/labs/${id}.json`);
    }
  } catch (e) {
    console.error(`  ❌ Labs 생성 실패 (${labTopic}):`, (e as Error).message);
  }

  console.log('\n✅ weekly:content 완료');
}

run().catch((err) => {
  console.error('치명적 오류:', err);
  process.exit(0); // CI에서 항상 정상 종료
});

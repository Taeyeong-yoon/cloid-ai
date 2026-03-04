#!/usr/bin/env tsx
/**
 * update_learning.ts
 * 학습 토픽 자동 갱신 파이프라인
 * - API 키 없이도 동작 (하드코딩 + fallback)
 * - YOUTUBE_API_KEY 있으면 실제 영상 fetch (함수 분리로 교체 가능)
 */

import fs from 'fs';
import path from 'path';
import type { LearningTopic, LearningResource } from '../src/lib/types';

const learningDir = path.join(process.cwd(), 'content', 'learning');
fs.mkdirSync(learningDir, { recursive: true });

// ═══════════════════════════════════════
// YouTube 영상 fetch (YOUTUBE_API_KEY 있을 때만)
// 향후 MCP 서버로 교체 가능하도록 함수 분리
// ═══════════════════════════════════════

async function fetchYoutubeVideos(query: string): Promise<LearningResource[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json() as {
      items?: Array<{ id: { videoId: string }; snippet: { title: string; description: string } }>;
    };
    return (data.items ?? []).map((item) => ({
      type: 'video' as const,
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      description: item.snippet.description.slice(0, 120),
    }));
  } catch {
    return [];
  }
}

function fallbackVideos(topic: string): LearningResource[] {
  const map: Record<string, LearningResource[]> = {
    'claude-code': [
      { type: 'video', title: 'Claude Code 완전 가이드 (유튜브)', url: 'https://youtube.com/results?search_query=claude+code+tutorial', description: 'Claude Code 실전 사용법 영상' },
    ],
    'mcp': [
      { type: 'video', title: 'MCP 서버 구축 튜토리얼', url: 'https://youtube.com/results?search_query=model+context+protocol+tutorial', description: 'MCP 프로토콜 실습 영상' },
    ],
    'remote-control': [
      { type: 'video', title: 'AI 자동화 에이전트 구축', url: 'https://youtube.com/results?search_query=AI+automation+agent+tutorial', description: 'AI 원격 제어 자동화 실습' },
    ],
  };
  return map[topic] ?? [];
}

// ═══════════════════════════════════════
// Topic definitions (seed data)
// ═══════════════════════════════════════

const TOPICS: Array<{ id: string; title: string; description: string; level: 'beginner' | 'intermediate' | 'advanced'; tags: string[]; docs: LearningResource[]; practice: LearningResource[] }> = [
  {
    id: 'claude-code',
    title: 'Claude Code 완전 가이드',
    description: 'Anthropic의 AI 코딩 에이전트 Claude Code를 처음부터 고급 활용까지 단계별로 학습',
    level: 'beginner',
    tags: ['Claude', 'AI', 'CLI', 'Agent'],
    docs: [
      { type: 'doc', title: 'Claude Code 공식 문서', url: 'https://docs.anthropic.com/claude-code', description: '설치부터 고급 설정까지 공식 가이드' },
      { type: 'doc', title: 'Claude Code GitHub', url: 'https://github.com/anthropics/claude-code', description: '오픈소스 레포지토리 및 릴리즈 노트' },
      { type: 'doc', title: 'Claude Code 키보드 단축키', url: 'https://docs.anthropic.com/claude-code/shortcuts', description: '생산성을 높이는 단축키 모음' },
    ],
    practice: [
      { type: 'practice', title: '첫 번째 프로젝트: TODO 앱 만들기', description: 'Claude Code로 처음부터 끝까지 TODO 앱을 만들며 기본기 습득', command: 'claude "Create a todo app with Next.js and Tailwind"' },
      { type: 'practice', title: 'CLAUDE.md 작성 실습', description: '프로젝트 지침 파일 CLAUDE.md를 작성해 일관된 코딩 스타일 유지', command: 'claude "Create a CLAUDE.md for this project with coding conventions"' },
    ],
  },
  {
    id: 'mcp',
    title: 'MCP (Model Context Protocol) 마스터',
    description: 'AI 에이전트의 컨텍스트를 확장하는 MCP 프로토콜 이해와 서버 구축',
    level: 'intermediate',
    tags: ['MCP', 'Claude', 'Protocol', 'Server'],
    docs: [
      { type: 'doc', title: 'MCP 공식 사양', url: 'https://modelcontextprotocol.io', description: 'MCP 프로토콜 전체 사양 및 SDK 가이드' },
      { type: 'doc', title: 'MCP 서버 퀵스타트', url: 'https://modelcontextprotocol.io/quickstart/server', description: 'TypeScript로 나만의 MCP 서버 구축하기' },
      { type: 'doc', title: 'MCP 서버 목록', url: 'https://github.com/modelcontextprotocol/servers', description: '공식/커뮤니티 MCP 서버 모음' },
    ],
    practice: [
      { type: 'practice', title: 'Filesystem MCP 서버 연결', description: '로컬 파일시스템을 Claude에 연결하는 MCP 서버 설정 실습', command: 'npx @modelcontextprotocol/server-filesystem ~/Desktop' },
      { type: 'practice', title: '커스텀 MCP 서버 만들기', description: 'TypeScript SDK로 나만의 도구를 Claude에 노출하는 MCP 서버 구축', command: 'npm create mcp-server my-server' },
    ],
  },
  {
    id: 'remote-control',
    title: 'AI 원격 제어 & 자동화',
    description: 'AI를 활용해 서버, CI/CD, 클라우드 인프라를 자동으로 제어하는 방법',
    level: 'advanced',
    tags: ['Automation', 'CI/CD', 'DevOps', 'Agent'],
    docs: [
      { type: 'doc', title: 'Claude Code + GitHub Actions', url: 'https://docs.anthropic.com/claude-code/github-actions', description: 'CI 파이프라인에서 Claude Code를 활용한 자동화' },
      { type: 'doc', title: 'Headless Claude Code 실행', url: 'https://docs.anthropic.com/claude-code/headless', description: '서버/CI 환경에서 Claude Code 비대화형 실행' },
      { type: 'doc', title: 'Remote MCP 서버 구성', url: 'https://docs.anthropic.com/claude-code/mcp', description: '원격 MCP 서버를 통한 인프라 자동화' },
    ],
    practice: [
      { type: 'practice', title: '자동 PR 리뷰 봇 만들기', description: 'GitHub Webhook + Claude API로 자동 코드 리뷰 시스템 구축', command: 'claude "Review this PR and suggest improvements" --input-file diff.txt' },
      { type: 'practice', title: 'Cron 기반 AI 에이전트 스케줄러', description: '매일 정해진 시간에 AI 에이전트가 작업을 수행하도록 자동화', command: "claude --print \"Summarize today's repo changes\" | mail -s 'Daily AI Summary' you@example.com" },
    ],
  },
];

// ═══════════════════════════════════════
// Main
// ═══════════════════════════════════════

async function run() {
  for (const topic of TOPICS) {
    let videos = await fetchYoutubeVideos(`${topic.title} tutorial`);
    if (videos.length === 0) videos = fallbackVideos(topic.id);

    const result: LearningTopic = {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      level: topic.level,
      tags: topic.tags,
      resources: [...topic.docs, ...videos, ...topic.practice],
    };

    const filePath = path.join(learningDir, `${topic.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`✅ ${topic.id}.json 저장 (리소스 ${result.resources.length}개)`);
  }
  console.log('\n✅ learning:update 완료');
}

run().catch((err) => {
  console.error('오류:', err);
  process.exit(0); // 항상 정상 종료
});

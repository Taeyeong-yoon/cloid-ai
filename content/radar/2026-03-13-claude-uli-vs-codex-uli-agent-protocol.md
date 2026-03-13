---
title: "Claude ULI vs Codex ULI — Agent Protocol Comparison"
date: "2026-03-13"
tags:
  - agent
  - uli
  - claude
score: 92
sourceUrl: "https://docs.anthropic.com/en/docs/build-with-claude/agents-and-tools"
summary: "Anthropic's Universal Language Interface (ULI) and OpenAI Codex ULI represent two competing visions for agent protocols. Claude ULI focuses on structured tool use and memory management, while Codex ULI emphasizes code execution. This analysis compares their design philosophies, API surfaces, and real-world performance in multi-step agentic tasks."
---

## 개요

Claude ULI와 Codex ULI는 2026년 AI 에이전트 생태계를 정의하는 두 가지 핵심 프로토콜입니다.

## 핵심 차이점

| 항목 | Claude ULI | Codex ULI |
|------|-----------|-----------|
| 주요 강점 | 구조화된 도구 사용 | 코드 실행 |
| 메모리 | 컨텍스트 윈도우 기반 | 영구 저장소 |
| 멀티에이전트 | 네이티브 지원 | 플러그인 방식 |

## 실전 적용

에이전트 파이프라인 설계 시 두 프로토콜의 강점을 조합하는 하이브리드 접근법이 주목받고 있습니다.

**출처**: [https://docs.anthropic.com/en/docs/build-with-claude/agents-and-tools](https://docs.anthropic.com/en/docs/build-with-claude/agents-and-tools)

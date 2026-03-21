---
title: Projects & Memory — 나만의 AI 팀원 만들기
category: features
tags: [Projects, Memory, 컨텍스트, 설정]
difficulty: beginner
summary: Project에 지시사항·파일을 저장하면 Claude가 매번 같은 맥락에서 시작합니다. 반복 설명이 사라집니다.
updated: 2026-03-21
---

## 무엇인가?

Claude의 **Projects** 기능은 특정 작업 목적에 맞는 '방'을 만드는 개념입니다. 프로젝트마다 지시사항(Custom Instructions)과 파일을 저장해두면 대화를 새로 시작해도 Claude가 맥락을 기억합니다.

## 언제 쓰나?

- 매번 "너는 내 블로그 에디터야, 톤은 캐주얼하게" 같은 설명을 반복할 때
- 회사 내부 문서·코드베이스를 공유해두고 여러 질문을 이어갈 때
- 역할별로 분리된 Claude를 운영할 때 (글쓰기 전용 / 코딩 전용 / 리서치 전용)

## 설정 방법

1. claude.ai 좌측 사이드바 → **Projects** → **New Project**
2. **Project Instructions** 작성 (역할·어조·제약 사항 등)
3. 파일 첨부 (PDF, Word, 코드 파일 등 최대 200,000 토큰)
4. 같은 Project 안에서 새 대화를 열면 지시사항+파일이 자동 적용

## Project Instructions 예시

```
당신은 제 스타트업 마케팅 담당자입니다.
- 브랜드 톤: 친근하고 전문적, 이모지 금지
- 타겟: 30-40대 국내 소상공인
- 항상 CTA(행동 유도 문구)를 마지막에 포함하세요
- 경쟁사(OO, XX)를 직접 언급하지 마세요
```

## 주의사항

- Project Files는 대화마다 토큰을 소비합니다. 꼭 필요한 파일만 첨부하세요.
- 지시사항이 너무 길면 오히려 응답 품질이 떨어질 수 있습니다. 핵심만 간결하게.
- 현재 Projects는 claude.ai 유료 플랜(Pro/Team)에서 사용 가능합니다.

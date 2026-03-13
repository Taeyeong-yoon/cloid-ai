---
title: "Claude 2026년 3월 주요 신기능 총정리 — Infinite Chats·Cowork·보안 리뷰"
date: "2026-03-13"
tags:
  - claude
  - claude-code
  - agent
  - feature-update
score: 100
sourceUrl: "https://releasebot.io/updates/anthropic/claude"
summary: "2026년 3월 Claude의 주요 신기능: Infinite Chats(컨텍스트 한계 제거), Claude Cowork(비개발자용 에이전트 GUI), 코드 보안 리뷰 도구, 헬스데이터 분석, Office 추가 기능 등이 출시됐다."
---

## 개요

2026년 3월 현재 Claude에는 여러 중요한 신기능이 추가됐습니다. 개발자부터 일반 사용자까지 폭넓게 영향을 미치는 업데이트들을 정리합니다.

## 핵심 신기능

### 1. Infinite Chats (무한 컨텍스트)
컨텍스트 윈도우 한계 오류를 완전히 제거했습니다. 이제 대화가 길어져도 "컨텍스트 초과" 오류 없이 계속 작업할 수 있습니다.

- 기존: 컨텍스트 초과 시 대화 초기화 필요
- 변경: 자동으로 이전 내용을 요약·압축하여 대화 지속

### 2. Claude Cowork (1월 출시, 3월 확장)
비개발자를 위한 GUI 기반 에이전트 도구입니다.

- Claude Code와 유사하지만 코딩 없이 사용 가능
- 로컬 실행, 격리된 VM 환경
- 로컬 파일 접근 + MCP 통합
- **3월 신규**: Claude Desktop에서 예약/반복 작업 지원

### 3. Claude Code 보안 리뷰 (2월 출시)
코드베이스 전체를 분석해 보안 취약점을 자동으로 식별하는 도구입니다.

- OWASP Top 10 패턴 탐지
- 코드 리뷰 PR 자동 작성
- 멀티 에이전트 기반으로 병렬 분석

### 4. Claude Code v2.1.72+ 업데이트 (3월)
- 서드파티 프록시 환경에서 tool search 안정성 개선
- Plan 흐름 개선, bash 통합 강화
- Plugin/worktree 지원 확장
- UI 개선사항 다수

### 5. 차트·다이어그램 자동 생성
Claude가 HTML/SVG 기반 차트와 다이어그램을 응답에서 직접 생성합니다.

- 데이터 분석 결과를 시각화 형태로 즉시 출력
- 요청 없이도 적절한 상황에서 자동 생성
- 프로그래밍 없이 대화만으로 차트 작성 가능

### 6. 헬스 데이터 분석 (iOS/Android)
Claude가 건강·피트니스 데이터를 읽고 분석하며 네이티브 차트 시각화를 생성할 수 있게 됐습니다. (Pro/Max 플랜, 미국 출시)

### 7. Office 추가 기능 확장
- **PowerPoint 추가 기능** 출시 (프레젠테이션 직접 편집)
- **Excel**: Opus 4.6 업그레이드 + 피벗 테이블 편집 + 조건부 서식 지원

### 8. Claude Code 주요 업데이트 (3월)
- **음성 STT** 20개 언어로 확장 (러시아어, 폴란드어, 터키어, 네덜란드어, 그리스어 등 추가)
- **작업 강도** 단순화: low / medium / high 3단계로 정리
- `/loop` 명령어: cron 스케줄로 프롬프트 반복 실행 가능
- Bash 자동 승인 범위 확장: `lsof`, `pgrep`, `fd` 등 추가

## 모델 현황 (2026년 3월 기준)

| 모델 | 컨텍스트 | 특징 |
|------|---------|------|
| Claude Opus 4.6 | 200K | 최강 성능, 코딩·금융 분석, 14.5시간 작업 지속 |
| Claude Sonnet 4.6 | 1M (베타) | 최고 가성비, 에이전트·코딩 강화 |
| Claude Haiku 4.5 | 200K | 빠른 응답, 경량 작업 최적화 |

## 개발자 실무 팁

```bash
# Claude Code 최신 버전 확인
claude --version

# 보안 리뷰 실행 예시
claude review --security ./src

# Infinite Chats 활용: 컨텍스트 압축 확인
# 자동으로 처리되므로 별도 설정 불필요
```

**출처**: [Anthropic Release Notes - March 2026](https://releasebot.io/updates/anthropic/claude)

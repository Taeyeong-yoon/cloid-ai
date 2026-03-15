---
title: Claude Code 입문 — 터미널에서 AI와 코딩하기
tags:
  - Claude Code
  - 터미널
  - AI 코딩
  - Anthropic
difficulty: advanced
summary: 'Claude Code 설치·설정부터 첫 프로젝트까지, 터미널 기반 AI 코딩 에이전트 완전 입문 가이드'
steps:
  - title: Install Claude Code
    description: Set up the Claude Code environment on your terminal.
    action: 'Run the command: npm install -g @anthropic-ai/claude-code'
    expectedResult: Claude Code is installed successfully without errors.
    failureHint: Ensure you have Node.js 18+ installed.
  - title: Set Up API Key
    description: Integrate your API key for Claude Code to function.
    action: >-
      Set the API key using export ANTHROPIC_API_KEY=your_api_key or run claude
      to input it.
    expectedResult: 'API key is set, and Claude Code prompts for interaction.'
    failureHint: Check the API key format and ensure it's valid.
  - title: Start Claude Code
    description: Initiate Claude Code in your project directory.
    action: Navigate to your project folder and run claude.
    expectedResult: 'Claude Code starts, ready for commands.'
    failureHint: Ensure you are in the correct project directory.
  - title: Delegate a Task in Agent Mode
    description: Assign a task for Claude Code to perform autonomously.
    action: >-
      Type a command like: 'Add user authentication with JWT for /api/auth/login
      and /api/auth/register.'
    expectedResult: Claude Code autonomously generates the required code and tests.
    failureHint: 'If it doesn''t work, refine your command for clarity.'
---

## 🎯 학습 목표

1. Claude Code를 설치하고 API 키를 연동하여 실행할 수 있다
2. Claude Code의 핵심 명령어와 파일 편집·검색 기능을 실무에 활용할 수 있다
3. 실제 프로젝트에서 Claude Code를 에이전트 모드로 실행하여 자율적으로 작업을 완성할 수 있다

---

## 📖 Claude Code란?

Claude Code는 Anthropic이 만든 터미널 기반 AI 코딩 에이전트입니다. 단순한 코드 자동완성을 넘어, 프로젝트 전체를 이해하고 파일 생성·수정·터미널 명령 실행·Git 작업까지 자율적으로 수행합니다.

**Claude Code의 차별점:**
- 코드베이스 전체를 컨텍스트로 읽음
- 파일 시스템 직접 읽기/쓰기 가능
- 터미널 명령 실행 가능 (승인 후)
- Git 통합 (커밋·브랜치·PR 작성)
- 긴 작업을 자율적으로 완성하는 에이전트 모드

---

## 🛠️ 실습 1 — Claude Code 설치 및 첫 실행

**설치:**
```bash
# Node.js 18+ 필요
npm install -g @anthropic-ai/claude-code
```

**API 키 설정:**
```bash
# 방법 1: 환경변수
export ANTHROPIC_API_KEY=sk-ant-...

# 방법 2: claude auth 명령
claude
# 처음 실행 시 API 키 입력 프롬프트 표시
```

**첫 실행:**
```bash
# 프로젝트 폴더로 이동
cd my-project

# Claude Code 시작
claude

# 대화 시작
> 이 프로젝트의 구조를 분석하고 개선할 수 있는 점을 알려줘
```

---

## 🛠️ 실습 2 — 에이전트 모드로 실제 작업 위임

```bash
claude

> 이 프로젝트에 사용자 인증 기능을 추가해줘.
> JWT 기반으로, /api/auth/login과 /api/auth/register 엔드포인트를 만들고
> 기존 라우트에 인증 미들웨어를 적용해줘.
> 완료되면 테스트 코드도 작성해줘.
```

Claude Code가 자율적으로 파일을 읽고, 코드를 작성하고, 테스트를 실행합니다.

---

## 💬 프롬프트 템플릿 10개

### 1. 프로젝트 분석
```
이 프로젝트의 전체 구조를 분석해줘.
- 기술 스택 요약
- 주요 파일/디렉토리 역할
- 코드 품질 이슈 (있으면)
- 개선 제안 Top 3
```

### 2. 버그 수정 위임
```
[파일명] 파일에서 [증상]이 발생하고 있어.
에러 메시지: [에러]

원인을 찾아서 수정하고, 수정 내용을 설명해줘.
관련 테스트도 업데이트해줘.
```

### 3. 새 기능 구현
```
[기능명] 기능을 구현해줘.

요구사항:
- [요구사항 목록]

구현 방식:
- 기존 코드 스타일 유지
- TypeScript 타입 안전성 보장
- 에러 처리 포함
- 단위 테스트 작성
```

### 4. 코드 리팩토링
```
[파일/디렉토리]를 리팩토링해줘.

목표:
- 가독성 향상
- 중복 코드 제거
- 성능 최적화
- SOLID 원칙 적용

변경사항을 커밋 메시지로 요약해줘.
```

### 5. 문서화 자동생성
```
이 프로젝트의 README.md를 작성해줘.

포함 사항:
- 프로젝트 소개
- 설치 방법
- 사용 방법 (예시 코드 포함)
- 환경변수 목록
- API 문서 (있는 경우)
- 기여 방법
```

### 6. Git 작업 위임
```
지금까지 변경한 내용을 커밋해줘.

조건:
- 관련 변경사항끼리 묶어서 여러 커밋으로 분리
- 커밋 메시지는 Conventional Commits 형식
- 각 커밋에 무엇을 변경했는지 명확히 표현
```

### 7. 보안 감사
```
이 프로젝트의 보안 취약점을 감사해줘.

확인 항목:
- SQL Injection / NoSQL Injection
- XSS 취약점
- 인증/인가 로직
- 환경변수 노출 여부
- 의존성 패키지 취약점 (package.json)

발견된 취약점마다 심각도(높음/중간/낮음)와 수정 방법 제안
```

### 8. 테스트 커버리지 향상
```
현재 테스트가 없거나 부족한 부분을 찾아서
테스트 코드를 작성해줘.

우선순위:
1. 비즈니스 로직 핵심 함수
2. API 엔드포인트
3. 에러 케이스

테스트 프레임워크: [Jest/Vitest/Pytest 등]
커버리지 목표: 80% 이상
```

### 9. 환경 설정 자동화
```
이 프로젝트의 개발 환경 설정을 자동화해줘.

생성할 파일:
- .env.example (실제 값 없이 키만)
- docker-compose.yml (로컬 개발용)
- Makefile (자주 쓰는 명령어 단축키)
- .github/workflows/ci.yml (PR시 테스트 자동 실행)
```

### 10. 성능 프로파일링
```
이 프로젝트에서 성능 병목이 될 수 있는 부분을 분석해줘.

분석 대상:
- 데이터베이스 쿼리 (N+1 문제)
- 불필요한 API 호출
- 큰 번들 사이즈
- 메모리 누수 가능성

각 문제에 대한 측정 방법과 개선 코드 제안
```

---

## 🎯 도전 과제

**미션**: Claude Code를 사용해서 기존 프로젝트에 완전한 새 기능 하나를 처음부터 끝까지 추가하세요.

**완성 조건:**
- Claude Code로만 코드 작성 (직접 편집 최소화)
- 기능 구현 + 테스트 코드 + README 업데이트 완료
- Git commit 히스토리가 의미 있는 단위로 분리됨
- 기능이 실제로 동작함을 확인

---

## ⚠️ 자주 하는 실수 3가지

**1. 너무 큰 작업을 한 번에 요청**
- ❌ "이 앱 전체를 Next.js로 마이그레이션해줘"
- ✅ 마이그레이션을 10개 단계로 나눠서 순서대로 요청
- 💡 **해결법**: 작업 전 "이 작업을 어떤 단계로 나눠서 진행하면 좋을지 계획을 먼저 짜줘"로 시작

**2. 터미널 명령 실행 권한을 무조건 승인**
- ❌ Claude가 요청하는 모든 명령을 확인 없이 승인
- ✅ 실행될 명령을 항상 읽고 이해한 후 승인
- 💡 **해결법**: 프로덕션 서버에서는 특히 주의. 로컬 개발 환경에서 먼저 테스트

**3. 대화 컨텍스트 없이 작업 중단 후 재시작**
- ❌ 중간에 Claude Code를 종료하고 다시 시작해서 컨텍스트 유실
- ✅ CLAUDE.md 파일에 프로젝트 컨텍스트·규칙을 작성해두기
- 💡 **해결법**: 프로젝트 루트에 CLAUDE.md를 만들면 매 세션마다 자동으로 읽힙니다

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- "Claude Code 입문 설치 사용법 한국어 2026"
- "Anthropic Claude Code tutorial getting started"
- "Claude Code vs Cursor 비교 어떤게 더 좋을까"
- "Claude Code agentic coding workflow 2026"

---

## 📚 참고 자료

- [Claude Code 공식 문서](https://docs.anthropic.com/en/docs/claude-code/overview)
- [Anthropic 공식 사이트](https://www.anthropic.com)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)

---
title: AI SaaS MVP 만들기 — 아이디어에서 배포까지 하루 만에
tags:
  - SaaS
  - MVP
  - Next.js
  - Claude Code
  - Vercel
  - Supabase
difficulty: advanced
summary: >-
  Claude Code + Next.js + Supabase + Vercel 스택으로 AI 기능이 있는 SaaS MVP를 하루 만에 배포하는
  완전 가이드
steps:
  - title: Initialize Project
    description: Set up the initial project structure for your AI SaaS MVP.
    action: >-
      Run the command: npx create-next-app@latest my-ai-saas --typescript
      --tailwind --app --src-dir and install necessary packages.
    codeSnippet: npm install @anthropic-ai/sdk @supabase/supabase-js @supabase/ssr
    expectedResult: >-
      A new Next.js project is created with TypeScript and Tailwind CSS, ready
      for development.
    failureHint: >-
      Ensure you have Node.js installed and check for any errors in the
      terminal.
  - title: Delegate Design to Claude Code
    description: Automate the project setup by delegating the design to Claude Code.
    action: >-
      Provide a clear service description and core features to Claude Code for
      generating the initial structure.
    expectedResult: >-
      Claude Code generates the necessary files and structure for user
      authentication, AI features, and history storage.
    failureHint: >-
      Make sure your service description is concise and clear for Claude to
      understand.
  - title: Design Database Schema
    description: >-
      Create a database schema for user profiles, AI requests, and usage
      tracking.
    action: >-
      Request Claude Code to design the Supabase database schema with specified
      tables and requirements.
    expectedResult: >-
      A well-defined database schema is generated, including necessary tables
      and RLS policies.
    failureHint: Double-check the requirements you provided to ensure they are complete.
  - title: Create API Route for AI Functionality
    description: Set up an API route to handle AI requests and responses.
    action: >-
      Write the API route code in app/api/generate/route.ts to handle user input
      and integrate with Claude API.
    codeSnippet: // Add your API route code here
    expectedResult: >-
      An API route is created that successfully processes requests, checks user
      limits, and streams responses.
    failureHint: >-
      Review the API route structure and ensure all dependencies are imported
      correctly.
  - title: Build Authentication Flow
    description: >-
      Implement a complete authentication system for user login and
      registration.
    action: >-
      Create the necessary files for login, signup, and middleware to manage
      protected routes.
    expectedResult: >-
      A fully functional authentication system that allows users to sign up, log
      in, and manage sessions.
    failureHint: >-
      Check for any issues in the middleware logic or authentication functions
      if something isn't working.
---

## 🎯 학습 목표

1. AI SaaS의 핵심 아키텍처(프론트엔드·API·DB·인증·AI)를 설계할 수 있다
2. Claude Code를 사용해서 반복 작업을 자동화하며 빠르게 개발할 수 있다
3. Vercel + Supabase 스택으로 프로덕션 수준의 배포를 완성할 수 있다

---

## 📖 AI SaaS MVP 스택

```
프론트엔드: Next.js 15 (App Router) + Tailwind CSS
AI: Anthropic Claude API (claude-sonnet-4-6)
데이터베이스: Supabase (PostgreSQL + Auth + Storage)
배포: Vercel
결제: Stripe (선택)
```

**MVP 정의**: 핵심 AI 기능 1개 + 인증 + 결제 없는 무료 버전

---

## 🛠️ 실습 1 — 1시간 만에 뼈대 완성

**Claude Code로 프로젝트 초기화:**

```bash
# 프로젝트 생성
npx create-next-app@latest my-ai-saas \
  --typescript --tailwind --app --src-dir

cd my-ai-saas
npm install @anthropic-ai/sdk @supabase/supabase-js @supabase/ssr
```

**Claude Code에 전체 설계 위임:**

```
이 Next.js 프로젝트를 AI SaaS MVP로 만들어줘.

서비스 설명: [내 서비스 설명 1~2줄]

핵심 기능:
1. 로그인/회원가입 (Supabase Auth)
2. AI 처리 기능: [구체적인 AI 기능 설명]
3. 결과 히스토리 저장 및 조회

파일 구조를 설계하고 핵심 파일부터 순서대로 만들어줘:
1. Supabase 클라이언트 설정
2. 인증 미들웨어
3. 로그인/회원가입 페이지
4. 메인 AI 기능 페이지
5. API 라우트 (Claude 연동)
6. 히스토리 페이지
```

---

## 🛠️ 실습 2 — Supabase 데이터베이스 설계

**Claude Code에 DB 스키마 생성 요청:**

```
이 AI SaaS의 Supabase 데이터베이스 스키마를 설계해줘.

테이블 필요 사항:
- 사용자 프로필 (Supabase auth.users 확장)
- AI 처리 요청/결과 저장
- 사용량 추적 (무료 플랜 제한용)

요구사항:
- RLS (Row Level Security) 정책 포함
- 인덱스 최적화
- 마이그레이션 SQL 파일로 출력

테이블: profiles, ai_results, usage_logs
```

---

## 💬 프롬프트 템플릿 10개

### 1. AI 기능 API 라우트 생성
```
Next.js App Router API 라우트를 만들어줘.
파일: app/api/generate/route.ts

기능:
- POST 요청 받기 (사용자 입력)
- Supabase Auth로 사용자 인증 확인
- 사용량 한도 체크 (무료: 10회/일)
- Claude API 호출 (streaming 방식)
- 결과를 Supabase에 저장
- 스트리밍 응답 반환

에러 처리: 인증 실패, 한도 초과, API 오류
```

### 2. 대시보드 컴포넌트
```
AI SaaS 메인 대시보드 페이지를 만들어줘.
파일: app/dashboard/page.tsx

구성:
- 상단: 환영 메시지 + 오늘 사용량 표시
- 중앙: AI 입력폼 + 결과 표시 (스트리밍)
- 하단: 최근 5개 히스토리 미리보기

스타일: 깔끔한 SaaS 디자인, 보라색 계열
Server Component + Client Component 분리
```

### 3. 인증 흐름 완성
```
완전한 인증 시스템을 구현해줘.

파일:
- middleware.ts: 보호된 라우트 리다이렉트
- app/login/page.tsx: 로그인 폼
- app/signup/page.tsx: 회원가입 폼
- app/actions/auth.ts: Server Actions

기능:
- 이메일/패스워드 로그인
- Google OAuth 로그인
- 비밀번호 재설정
- 세션 관리 (쿠키 기반)
```

### 4. 스트리밍 UI 컴포넌트
```
Claude API 스트리밍 응답을 표시하는 React 컴포넌트를 만들어줘.

기능:
- 스트리밍 텍스트를 타이핑 애니메이션으로 표시
- 생성 중 취소 버튼
- 완료 후 복사 버튼
- 마크다운 렌더링 지원
- 에러 상태 표시

파일: components/StreamingOutput.tsx
```

### 5. 사용량 제한 시스템
```
Freemium 모델의 사용량 제한 시스템을 구현해줘.

플랜:
- Free: 10회/일, 결과 7일 보관
- Pro: 무제한, 결과 영구 보관

구현:
- Supabase에서 오늘 사용량 조회
- 한도 초과 시 업그레이드 모달 표시
- 리셋 시간 표시 (자정 기준)

파일: lib/usage.ts + components/UsageBanner.tsx
```

### 6. SEO 및 랜딩 페이지
```
AI SaaS의 랜딩 페이지를 만들어줘.
파일: app/page.tsx (공개 페이지)

구성:
- Hero: 핵심 가치 제안 + CTA
- Features: 3가지 주요 기능
- How it works: 3단계 설명
- Pricing: Free vs Pro 비교표
- FAQ: 5개 질문

SEO: metadata, OG 태그, 구조화된 데이터
```

### 7. 결제 연동 (Stripe)
```
Stripe로 Pro 플랜 결제를 연동해줘.

구현:
- Stripe Checkout 세션 생성 API
- 결제 완료 후 Supabase 플랜 업데이트
- Stripe Webhook 처리 (/api/webhooks/stripe)
- 구독 취소 기능

환경변수: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
```

### 8. 관리자 페이지
```
기본 관리자 대시보드를 만들어줘.
파일: app/admin/page.tsx (role=admin만 접근)

표시할 데이터:
- 총 가입자 수 / 오늘 신규
- 일별 AI 요청 수 (최근 7일 차트)
- 상위 사용자 10명
- 최근 에러 로그

Supabase로 데이터 조회, Recharts로 차트
```

### 9. API Rate Limiting
```
API 라우트에 Rate Limiting을 추가해줘.

제한:
- IP당: 100 요청/시간
- 사용자당: 20 요청/분 (인증된 경우)

구현 방법: Upstash Redis (Vercel Edge 호환)
한도 초과 시 Retry-After 헤더 포함 429 반환
```

### 10. 배포 및 환경 설정 자동화
```
이 프로젝트를 Vercel에 배포하기 위한 설정을 완성해줘.

생성할 파일:
- .env.example (모든 필요 환경변수 목록)
- vercel.json (빌드 설정, 리다이렉트)
- .github/workflows/preview.yml (PR 미리보기 배포)

체크리스트:
- 모든 환경변수 확인
- Supabase RLS 활성화 확인
- API 키 노출 없음 확인
- 에러 트래킹 설정 (선택: Sentry)
```

---

## 🎯 도전 과제

**미션**: 아이디어를 정하고 하루 안에 실제 URL에서 접속 가능한 AI SaaS를 배포하세요.

**완성 조건:**
- 회원가입 → AI 기능 사용 → 결과 저장 전체 플로우 동작
- Vercel 프로덕션 URL에서 실제 접속 가능
- 무료 사용량 제한 기능 동작 확인
- 핵심 AI 기능 1가지 완성도 80% 이상

---

## ⚠️ 자주 하는 실수 3가지

**1. MVP가 아닌 최종 제품을 만들려 함**
- ❌ 결제, 팀 기능, 고급 설정 등 모든 기능을 처음부터 구현
- ✅ 핵심 AI 기능 1개 + 인증 + 기본 UI만으로 배포
- 💡 **해결법**: "이 기능 없이도 가치를 전달할 수 있는가?"를 매번 질문

**2. API 키를 클라이언트 코드에 노출**
- ❌ `NEXT_PUBLIC_ANTHROPIC_API_KEY` 환경변수 사용
- ✅ API 키는 서버 사이드(`ANTHROPIC_API_KEY`)에서만 사용
- 💡 **해결법**: Claude API 호출은 반드시 API Route 또는 Server Action에서만

**3. Supabase RLS를 비활성화한 채 배포**
- ❌ 개발 편의를 위해 RLS 비활성화 → 프로덕션 배포
- ✅ 배포 전 RLS 정책 활성화 + 테스트 필수
- 💡 **해결법**: Supabase Dashboard에서 각 테이블 RLS 활성화 여부 반드시 확인

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- "Next.js Supabase AI SaaS 만들기 2026"
- "AI SaaS MVP tutorial Claude API Next.js"
- "Vercel Supabase 풀스택 배포 한국어"
- "Build and deploy AI SaaS in one day 2026"

---

## 📚 참고 자료

- [Anthropic Claude API 문서](https://docs.anthropic.com/en/api/getting-started)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)

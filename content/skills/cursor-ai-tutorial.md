---
title: Cursor AI 완전 정복 — 설치부터 프로젝트 완성까지
tags:
  - Cursor
  - AI 코딩
  - IDE
  - 개발 도구
difficulty: intermediate
summary: 'Cursor AI 에디터 설치·설정부터 실제 투두앱 완성까지, AI 코딩 에디터 실전 가이드'
steps:
  - title: Install Cursor
    description: Download and install the Cursor AI editor.
    action: 'Go to cursor.com, download the Cursor application, and install it.'
    expectedResult: Cursor is successfully installed on your machine.
    failureHint: Ensure your internet connection is stable and try reloading the page.
  - title: Import VS Code Settings (Optional)
    description: Import your existing VS Code settings if you are a previous user.
    action: 'Open Cursor and navigate to Settings, then import your VS Code settings.'
    expectedResult: Your VS Code settings are now available in Cursor.
    failureHint: Check the settings file format and ensure it is compatible.
  - title: Create a New Project
    description: Set up your first project in Cursor.
    action: >-
      Open the terminal (Ctrl+`) and run 'npx create-next-app@latest todo-app
      --typescript --tailwind --app'.
    codeSnippet: npx create-next-app@latest todo-app --typescript --tailwind --app
    expectedResult: A new Next.js project named 'todo-app' is created.
    failureHint: Ensure Node.js is installed and updated on your system.
  - title: Build Todo App Structure
    description: Use Composer to generate the structure for your Todo app.
    action: Press Ctrl+I and provide the structure request for the Todo app.
    expectedResult: The file structure for the Todo app is created as specified.
    failureHint: >-
      Make sure to clearly define the required features and file structure in
      your request.
  - title: Run Your Application
    description: Start the development server to test your Todo app.
    action: Run 'npm run dev' in the terminal.
    codeSnippet: npm run dev
    expectedResult: >-
      The development server starts, and you can access your app at
      localhost:3000.
    failureHint: Check for any errors in the terminal and resolve them before trying again.
---

## 🎯 학습 목표

1. Cursor를 설치하고 Claude/GPT-5.2 모델과 연동할 수 있다
2. Cursor의 핵심 기능(Chat, Composer, Tab 자동완성)을 실무에 활용할 수 있다
3. Cursor로 투두앱을 처음부터 끝까지 완성할 수 있다

---

## 📖 Cursor란?

Cursor는 AI가 내장된 코드 에디터입니다. VS Code 기반이라 기존 익스텐션·설정을 그대로 쓸 수 있으며, 코드베이스 전체를 컨텍스트로 이해하는 AI 어시스턴트가 내장되어 있습니다.

**Cursor의 3가지 핵심 기능:**
- **Tab 자동완성**: 다음 코드를 예측해서 제안
- **Chat (Ctrl+L)**: 현재 파일·프로젝트에 대해 AI와 대화
- **Composer (Ctrl+I)**: 여러 파일을 한 번에 수정하는 AI 에이전트

---

## 🛠️ 실습 1 — 설치 및 초기 설정

**설치 단계:**

1. cursor.com에서 Cursor 다운로드 및 설치
2. VS Code 설정 임포트 (선택사항 — 기존 VS Code 사용자)
3. Settings → Models에서 사용할 모델 선택 (claude-sonnet-4-6 권장)
4. API 키 설정 (OpenAI, Anthropic) 또는 Cursor Pro 구독

**첫 프로젝트 열기:**
```
1. File → Open Folder → 새 폴더 선택
2. Ctrl+` 로 터미널 열기
3. Ctrl+L 로 AI Chat 열기
4. "안녕하세요! 이 프로젝트에서 뭘 만들어야 할지 도와주세요"로 시작
```

---

## 🛠️ 실습 2 — Cursor로 투두앱 만들기 (Next.js)

**Step 1: 프로젝트 생성**
```
터미널에서 Ctrl+` 후 입력:
npx create-next-app@latest todo-app --typescript --tailwind --app
cd todo-app
```

**Step 2: Composer로 앱 구조 생성 (Ctrl+I)**

```
Next.js App Router + TypeScript + Tailwind로 투두앱을 만들어주세요.

기능:
- 할 일 추가/완료/삭제
- 우선순위 (높음/보통/낮음) 설정
- 필터 (전체/진행중/완료)
- localStorage로 데이터 유지

파일 구조:
- app/page.tsx (메인 페이지)
- components/TodoItem.tsx
- components/TodoForm.tsx
- hooks/useTodos.ts (상태 관리)

각 파일을 생성하고 완성해주세요.
```

**Step 3: 실행 확인**
```
npm run dev
```
브라우저에서 localhost:3000 접속해서 확인

---

## 💬 프롬프트 템플릿 8개

### 1. 코드 설명 요청 (Chat)
```
@파일명
이 파일의 전체 구조를 설명해주세요.
주요 함수 각각이 무슨 역할을 하는지,
그리고 데이터 흐름이 어떻게 되는지 알려주세요.
```

### 2. 버그 수정 요청 (Chat)
```
이 코드에서 [증상]이 발생합니다.
에러 메시지: [에러 내용]

원인을 분석하고 수정된 코드를 알려주세요.
```

### 3. 리팩토링 요청 (Composer)
```
@파일명
이 파일을 리팩토링해주세요.

목표:
- 함수를 더 작게 분리
- 중복 코드 제거
- TypeScript 타입 안전성 강화
- 성능 최적화

기능은 동일하게 유지해주세요.
```

### 4. 테스트 코드 생성 (Composer)
```
@파일명
이 파일의 모든 함수에 대한 단위 테스트를 작성해주세요.

테스트 프레임워크: Jest + React Testing Library
커버리지:
- 정상 케이스
- 엣지 케이스 (빈 값, 최대값 등)
- 에러 케이스

test 파일을 새로 생성해주세요.
```

### 5. API 연동 코드 생성
```
@현재파일
[API 이름] API를 연동하는 코드를 추가해주세요.

엔드포인트: [URL]
인증 방식: [Bearer Token / API Key 등]
필요한 기능:
- 데이터 가져오기
- 에러 처리
- 로딩 상태 관리

Next.js App Router의 Server Component 방식으로 작성해주세요.
```

### 6. 컴포넌트 스타일링
```
@컴포넌트파일
이 컴포넌트를 Tailwind CSS로 스타일링해주세요.

디자인 요구사항:
- 모바일 우선 반응형
- 다크모드 지원
- 호버/포커스 상태 애니메이션
- 색상 팔레트: [색상 지정]

shadcn/ui 컴포넌트를 활용할 수 있으면 활용해주세요.
```

### 7. 성능 최적화
```
@파일명
이 코드의 성능을 분석하고 최적화해주세요.

현재 문제:
- 불필요한 리렌더링 발생 가능성
- API 호출 최적화 여지
- 번들 사이즈 최적화

React.memo, useMemo, useCallback 활용 방안을 포함해주세요.
```

### 8. 배포 준비 체크리스트
```
@프로젝트전체
이 프로젝트를 Vercel에 배포하기 전 체크리스트를 작성하고,
발견된 문제점을 수정해주세요.

확인 항목:
- 환경변수 설정 (.env.local → .env.example)
- 콘솔 로그 제거
- 에러 바운더리 설정
- 메타 태그 (SEO)
- 로딩/에러 UI
```

---

## 🎯 도전 과제

**미션**: Cursor로 실제 사용할 수 있는 웹앱 하나를 처음부터 완성하고 Vercel에 배포하세요.

**완성 조건:**
- Next.js + TypeScript + Tailwind 기반
- 핵심 기능 3가지 이상 동작
- vercel.app 도메인으로 실제 접속 가능
- Cursor의 Chat, Composer, Tab 자동완성 각각 최소 1회씩 활용

---

## ⚠️ 자주 하는 실수 3가지

**1. Composer에게 너무 많은 파일을 한 번에 수정 요청**
- ❌ "프로젝트 전체를 리팩토링해줘"
- ✅ 파일 1~3개씩 단계적으로 요청
- 💡 **해결법**: @파일명으로 범위를 명시하고 한 번에 하나씩 처리

**2. AI가 생성한 코드를 검토 없이 Accept All**
- ❌ Composer 제안을 무조건 "Accept All" 클릭
- ✅ diff 화면에서 변경사항을 하나씩 검토 후 수락
- 💡 **해결법**: 중요한 파일은 반드시 변경 내용 읽어보고 수락

**3. 컨텍스트 창 관리를 안 함**
- ❌ 하나의 Chat 세션을 너무 길게 유지
- ✅ 새로운 주제/기능은 새 Chat 세션 시작
- 💡 **해결법**: Chat이 길어지면 응답 품질이 떨어집니다. 주제별로 세션 분리

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- "Cursor AI 에디터 완전 가이드 한국어 2026"
- "Cursor IDE tutorial beginner to advanced"
- "Cursor vs Claude Code 비교 2026"
- "Cursor AI 투두앱 만들기 실습"

---

## 📚 참고 자료

- [Cursor 공식 사이트](https://cursor.com)
- [Cursor 공식 문서](https://docs.cursor.com)
- [Cursor 커뮤니티 포럼](https://forum.cursor.com)

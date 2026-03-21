---
title: VS Code + Claude Code — 개발 환경 완전 통합
category: usecases
tags: [VS Code, Claude Code, 개발 환경, IDE]
difficulty: beginner
summary: VS Code 터미널에서 Claude Code를 실행하고 에디터와 연동하는 최적의 개발 워크플로우를 소개합니다.
updated: 2026-03-21
---

## 기본 설정

### Claude Code CLI 설치
```bash
npm install -g @anthropic-ai/claude-code
claude auth  # Anthropic 계정 로그인
```

### VS Code 터미널 통합
VS Code 내장 터미널(`Ctrl+\``)에서 Claude Code를 실행하면 에디터와 같은 작업 디렉토리를 공유합니다.

## 핵심 워크플로우

### 1. 파일 열고 Claude에게 설명 요청
```bash
# 현재 열린 파일 분석
claude -p "현재 프로젝트의 src/auth.ts 파일을 분석해서 보안 이슈를 찾아줘"
```

### 2. 에러 메시지 직접 붙여넣기
터미널에서 에러 발생 → 복사 → Claude에게 붙여넣기:
```bash
claude
# 대화 모드 진입 후
> TypeError: Cannot read properties of undefined (reading 'map')
>   at ProductList.tsx:47
> 이 에러 원인이 뭐야?
```

### 3. 코드 생성 → 자동 파일 저장
```bash
claude -p "
React 컴포넌트 UserCard.tsx를 만들어줘.
props: { name, email, avatar, role }
Tailwind CSS 사용, 다크 테마 지원
생성 후 src/components/UserCard.tsx에 저장해줘.
"
```

## CLAUDE.md 설정 (프로젝트별 규칙)

프로젝트 루트에 `CLAUDE.md` 생성:

```markdown
# 프로젝트 규칙

## 기술 스택
- Next.js 15 + TypeScript 5.4
- Tailwind CSS 4
- Supabase (인증·DB)

## 코딩 규칙
- 함수형 컴포넌트만 사용 (클래스형 금지)
- 모든 함수에 JSDoc 주석
- 파일명: kebab-case
- 컴포넌트명: PascalCase

## 금지사항
- any 타입 사용 금지
- console.log는 개발 중에만, 커밋 전 제거
- 하드코딩된 API 키 절대 금지
```

→ Claude Code가 이 규칙을 자동으로 따릅니다.

## VS Code 작업 자동화

### tasks.json에 Claude 작업 추가
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Claude: 코드 리뷰",
      "type": "shell",
      "command": "claude -p 'git diff HEAD~1을 리뷰해줘' --output-format text",
      "group": "test",
      "presentation": { "reveal": "always" }
    },
    {
      "label": "Claude: 테스트 생성",
      "type": "shell",
      "command": "claude -p '${file}에 대한 Jest 테스트를 생성해줘'",
      "group": "build"
    }
  ]
}
```

`Ctrl+Shift+P` → "Tasks: Run Task" → 선택 실행

## 유용한 Claude Code 명령들

```bash
# 대화 모드 (가장 많이 쓰는 방식)
claude

# 비대화형 단일 실행
claude -p "질문이나 명령"

# 특정 파일만 컨텍스트로
claude --context src/api.ts -p "이 파일 리팩토링해줘"

# 출력 형식 지정
claude -p "..." --output-format json
claude -p "..." --output-format text
```

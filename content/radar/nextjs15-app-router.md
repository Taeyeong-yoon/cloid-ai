---
title: "Next.js 15 App Router 핵심 변경점"
date: "2026-02-20"
tags: ["Next.js", "React", "Frontend"]
summary: "Next.js 15에서 달라진 캐싱 전략, Turbopack 기본 활성화, React 19 지원 등을 실습 코드와 함께 정리"
---

## 주요 변경점

### 1. 캐싱 전략 변경
Next.js 15부터 `fetch`의 기본 캐싱이 `no-store`로 바뀌었습니다.

```typescript
// 이전 (14): 기본 캐시 활성화
fetch('https://api.example.com/data')

// 이제 (15): 명시적 캐시 설정 필요
fetch('https://api.example.com/data', { cache: 'force-cache' })
```

### 2. Turbopack 기본 활성화
`next dev`가 Turbopack으로 기본 실행됩니다. webpack으로 되돌리려면:
```bash
next dev --turbopack=false
```

### 3. React 19 지원
- Server Actions 안정화
- `use()` 훅으로 Promise 언래핑
- `useOptimistic` 공식 안정화

## 마이그레이션 체크리스트

- [ ] `fetch` 캐시 옵션 명시적 설정
- [ ] `cookies()`, `headers()` await 추가
- [ ] `params`를 `Promise`로 처리

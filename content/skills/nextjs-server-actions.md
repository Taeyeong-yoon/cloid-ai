---
title: "Next.js Server Actions 패턴"
tags: ["Next.js", "React", "Backend"]
difficulty: "intermediate"
summary: "Server Actions를 활용한 폼 처리, 데이터 뮤테이션, 낙관적 UI 패턴"
---

## 기본 Server Action

```typescript
// app/actions.ts
'use server'

export async function createItem(formData: FormData) {
  const title = formData.get('title') as string;
  // DB 저장 로직
  revalidatePath('/items');
}
```

## 폼과 연결

```tsx
// app/new/page.tsx
import { createItem } from '../actions';

export default function NewItemPage() {
  return (
    <form action={createItem}>
      <input name="title" required />
      <button type="submit">생성</button>
    </form>
  );
}
```

## useOptimistic으로 낙관적 업데이트

```tsx
const [optimisticItems, addOptimistic] = useOptimistic(items);

async function handleAdd(item: Item) {
  addOptimistic(item); // 즉시 UI 업데이트
  await createItem(item); // 서버 동기화
}
```

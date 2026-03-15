---
title: Next.js Server Actions 패턴
tags:
  - Next.js
  - React
  - Backend
difficulty: intermediate
summary: 'Server Actions를 활용한 폼 처리, 데이터 뮤테이션, 낙관적 UI 패턴'
steps:
  - title: Create a Server Action
    description: Set up a server action to handle item creation.
    action: Implement the createItem function in app/actions.ts.
    codeSnippet: |-
      // app/actions.ts
      'use server'

      export async function createItem(formData: FormData) {
        const title = formData.get('title') as string;
        // DB saving logic
        revalidatePath('/items');
      }
    expectedResult: >-
      The createItem function is correctly defined and ready to handle form
      data.
    failureHint: Ensure you have the 'use server' directive at the top of your file.
  - title: Connect Form to Server Action
    description: Link the form to the server action for item creation.
    action: Create a form in app/new/page.tsx that uses createItem.
    codeSnippet: |-
      // app/new/page.tsx
      import { createItem } from '../actions';

      export default function NewItemPage() {
        return (
          <form action={createItem}>
            <input name="title" required />
            <button type="submit">Create</button>
          </form>
        );
      }
    expectedResult: The form is displayed with an input for the title and a submit button.
    failureHint: Check that the form's action is correctly set to the createItem function.
  - title: Implement Optimistic UI Update
    description: Use optimistic updates to enhance user experience during item creation.
    action: Add useOptimistic to manage UI state in the component handling items.
    codeSnippet: |-
      const [optimisticItems, addOptimistic] = useOptimistic(items);

      async function handleAdd(item: Item) {
        addOptimistic(item); // Immediate UI update
        await createItem(item); // Sync with server
      }
    expectedResult: >-
      The UI updates immediately upon adding an item, reflecting optimistic
      changes.
    failureHint: Verify that addOptimistic is called before the server sync.
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

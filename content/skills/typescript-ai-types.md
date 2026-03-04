---
title: "TypeScript로 AI 앱 타입 안전하게 만들기"
tags: ["TypeScript", "AI", "Type Safety"]
difficulty: "intermediate"
summary: "LLM 응답, 스트리밍, 툴 콜 등을 TypeScript로 타입 안전하게 처리하는 패턴"
---

## AI 응답 타입 정의

```typescript
interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIStreamChunk {
  type: 'text_delta' | 'message_stop';
  delta?: { text: string };
}
```

## Zod로 LLM 출력 검증

```typescript
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  category: z.enum(['electronics', 'clothing', 'food']),
});

type Product = z.infer<typeof ProductSchema>;

// LLM 응답 파싱 후 검증
const parsed = ProductSchema.safeParse(JSON.parse(llmResponse));
if (!parsed.success) {
  // 재시도 로직
}
```

## 스트리밍 타입

```typescript
async function* streamAI(prompt: string): AsyncGenerator<string> {
  const stream = await client.messages.stream({ ... });
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      yield chunk.delta.text;
    }
  }
}
```

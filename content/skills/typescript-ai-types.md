---
title: "TypeScript로 AI 앱 타입 안전하게 만들기"
tags: ["TypeScript","AI","Type Safety"]
difficulty: "intermediate"
summary: "LLM 응답, 스트리밍, 툴 콜 등을 TypeScript로 타입 안전하게 처리하는 패턴"
steps: [{"title":"Define AI Response Types","description":"Create TypeScript interfaces for AI message and stream chunk structures.","action":"Implement the AIMessage and AIStreamChunk interfaces in your TypeScript file.","codeSnippet":"interface AIMessage { role: 'user' | 'assistant' | 'system'; content: string; } interface AIStreamChunk { type: 'text_delta' | 'message_stop'; delta?: { text: string }; }","expectedResult":"You have defined the necessary types for handling AI responses.","failureHint":"Ensure the syntax is correct and TypeScript is installed."},{"title":"Validate LLM Output with Zod","description":"Use Zod to validate the structure of the LLM's output.","action":"Implement the ProductSchema and use safeParse to validate the LLM response.","codeSnippet":"const parsed = ProductSchema.safeParse(JSON.parse(llmResponse));","expectedResult":"The LLM response is successfully parsed and validated, or an error is raised.","failureHint":"Check the structure of the LLM response against the schema."},{"title":"Implement AI Streaming Function","description":"Create an async generator function to stream AI responses.","action":"Write the streamAI function to yield text from the AI streaming response.","codeSnippet":"async function* streamAI(prompt: string): AsyncGenerator<string> { const stream = await client.messages.stream({ ... }); for await (const chunk of stream) { if (chunk.type === 'content_block_delta') { yield chunk.delta.text; } } }","expectedResult":"The function streams AI responses correctly as text chunks.","failureHint":"Ensure your client is properly configured and the streaming API is accessible."}]
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

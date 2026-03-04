---
title: "AI 이미지 생성 API 통합"
tags: ["OpenAI", "DALL-E", "Image", "API"]
difficulty: "beginner"
summary: "DALL-E 3, Stable Diffusion API를 Next.js에 통합하는 레시피"
---

## DALL-E 3 API Route

```typescript
// app/api/generate-image/route.ts
import OpenAI from 'openai';

const client = new OpenAI();

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
  });

  return Response.json({ url: response.data[0].url });
}
```

## 클라이언트 컴포넌트

```tsx
'use client'
export function ImageGenerator() {
  const [url, setUrl] = useState('');

  async function generate(prompt: string) {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    const { url } = await res.json();
    setUrl(url);
  }

  return (
    <div>
      {url && <img src={url} alt="Generated" />}
    </div>
  );
}
```

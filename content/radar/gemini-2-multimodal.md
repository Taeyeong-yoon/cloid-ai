---
title: "Gemini 2.0 멀티모달 API 실전 활용"
date: "2026-02-10"
tags: ["Gemini", "Google", "Multimodal"]
summary: "Gemini 2.0 Flash/Pro의 이미지·오디오·비디오 멀티모달 입력을 Next.js API Route와 연동하는 패턴"
---

## Gemini 2.0 모델 비교

| 모델 | 속도 | 컨텍스트 | 멀티모달 |
|------|------|----------|----------|
| Flash | ★★★★★ | 1M 토큰 | 이미지/오디오/영상 |
| Pro | ★★★ | 2M 토큰 | 이미지/오디오/영상 |

## Next.js API Route 예시

```typescript
// app/api/analyze/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const { imageBase64, prompt } = await req.json();

  const result = await model.generateContent([
    { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
    prompt,
  ]);

  return Response.json({ text: result.response.text() });
}
```

## 실습 팁

- 이미지 분석 비용 절감: Flash 사용 후 복잡한 작업만 Pro로
- 스트리밍: `generateContentStream`으로 실시간 응답

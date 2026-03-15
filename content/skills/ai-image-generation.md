---
title: AI 이미지 생성 API 통합
tags:
  - OpenAI
  - DALL-E
  - Image
  - API
difficulty: beginner
summary: 'DALL-E 3, Stable Diffusion API를 Next.js에 통합하는 레시피'
steps:
  - title: Set Up DALL-E 3 API Route
    description: Create an API route to generate images using DALL-E 3.
    action: >-
      Create a new file at 'app/api/generate-image/route.ts' and paste the
      provided DALL-E 3 API code.
    codeSnippet: |-
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
    expectedResult: The API route is created without errors.
    failureHint: Check for syntax errors in the code.
  - title: Create Image Generator Component
    description: Build a client component to interact with the API and generate images.
    action: >-
      Create a new file for the ImageGenerator component and paste the provided
      client component code.
    codeSnippet: |-
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
            {url && <img src={url} alt='Generated' />}
          </div>
        );
      }
    expectedResult: The ImageGenerator component is created without errors.
    failureHint: Ensure that you have imported necessary hooks like useState.
  - title: Test Image Generation
    description: Verify that the image generation functionality works as expected.
    action: >-
      Run your Next.js application, use the ImageGenerator component, and input
      a prompt to generate an image.
    expectedResult: An image is displayed on the screen based on the provided prompt.
    failureHint: Check console logs for any errors during the API call.
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

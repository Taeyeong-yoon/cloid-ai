---
title: "Claude 프롬프트 엔지니어링 레시피"
tags: ["Claude","Prompt","AI"]
difficulty: "beginner"
summary: "Claude에서 최고의 결과를 얻는 프롬프트 패턴 모음"
steps: [{"title":"Define Context with XML Tags","description":"Structuring context for better understanding by Claude.","action":"Use the <context> tag to specify your role.","codeSnippet":"<context>\nYou are a senior full-stack engineer.\n</context>","expectedResult":"Claude recognizes your role for tailored responses.","failureHint":"Ensure the context is clear and relevant."},{"title":"Specify the Task Clearly","description":"Clearly outline the task for Claude to follow.","action":"Use the <task> tag to define what you want Claude to do.","codeSnippet":"<task>\nRefactor the code below.\n</task>","expectedResult":"Claude understands the specific task to perform.","failureHint":"Make sure the task is concise and unambiguous."},{"title":"Provide Example Code","description":"Give a code snippet for Claude to work on.","action":"Insert your code within the <code> tags.","codeSnippet":"<code>\n// Your code here\n</code>","expectedResult":"Claude has the code to analyze or refactor.","failureHint":"Check for syntax errors in your code."},{"title":"Encourage Chain of Thought","description":"Guide Claude through complex problem-solving.","action":"Prompt Claude to think step-by-step before answering.","codeSnippet":"Think step-by-step to solve the problem:\n1. Analyze the problem\n2. List possible approaches\n3. Choose and implement the best method.","expectedResult":"Claude provides a structured response.","failureHint":"Rephrase the prompt if the response is unclear."},{"title":"Summarize the Recipe","description":"Consolidate the key points for effective prompting.","action":"Summarize your prompts with role, examples, and constraints.","codeSnippet":"Role specification → more professional responses\nProvide examples → improve format consistency\nSet length limits → e.g., 'in 3 sentences'","expectedResult":"Claude delivers responses that align with your expectations.","failureHint":"Adjust the summary to better fit your needs."}]
---

## XML 태그 활용

Claude는 XML 태그로 컨텍스트를 구조화할 때 가장 잘 이해합니다.

```
<context>
당신은 시니어 풀스택 엔지니어입니다.
</context>

<task>
아래 코드를 리팩토링하세요.
</task>

<code>
// 여기에 코드
</code>
```

## Chain of Thought 유도

복잡한 문제는 단계별 사고를 유도합니다:

```
이 문제를 해결하기 전에 단계별로 생각해보세요:
1. 문제를 분석하고
2. 가능한 접근법을 나열하고
3. 최선의 방법을 선택해서 구현하세요
```

## 레시피 요약

- 역할 명시 → 더 전문적인 응답
- 예시 제공 → 형식 일관성 향상
- 길이 제한 → "3문장 이내로" 등

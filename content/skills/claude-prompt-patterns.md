---
steps: [{"title":"XML Tag Structuring","description":"Learn to structure context using XML tags for better communication with Claude.","action":"Create a prompt using XML tags to define a role, task, and output format.","codeSnippet":"<role>\nYou are a senior full-stack engineer with 10 years of experience.\nConsider security, performance, and readability during code reviews.\n</role>\n<task>Review the code below and provide improvement suggestions.</task>\n<code language=\"javascript\">\nasync function getUser(id) {\n  const res = await fetch('/api/user/' + id);\n  const data = res.json();\n  return data;\n}\n</code>\n<output_format>\n1. Bugs/Errors (high priority)\n2. Security vulnerabilities\n3. Performance improvements\n4. Readability enhancements\nEach item should include the issue + corrected code.\n</output_format>","expectedResult":"A structured prompt that Claude can understand and respond to accurately.","failureHint":"Try simplifying your XML structure if Claude does not respond correctly."},{"title":"Prompt Chaining","description":"Break down complex tasks into a chain of prompts for better results.","action":"Implement a three-step prompt chain using the provided structure.","codeSnippet":"<task>Analyze</task>\n<input>\n[Text/Data to analyze]\n</input>\n<instruction>\nExtract 3 key themes and their core reasons from the content. Output in JSON format.\n</instruction>","expectedResult":"A coherent analysis that leads to a summary document in the next step.","failureHint":"Ensure each step of the chain is clear and follows logically from the previous one."},{"title":"Role and Constraints Setting","description":"Set roles and constraints to guide Claude's responses effectively.","action":"Define a role and constraints for a specific task using XML format.","codeSnippet":"<role>\nYou are a [expert role].\n[Key characteristics of the role]\n</role>\n<constraints>\n- Must include: [mandatory elements]\n- Exclude: [prohibited items]\n- Language: Korean\n- Length: [limit]\n</constraints>\n<task>[Task details]</task>","expectedResult":"A clear directive for Claude that aligns with your expectations.","failureHint":"Review the constraints to ensure they are not too restrictive."}]
---
---
title: "Claude 고급 프롬프트 패턴 — XML 태그, 시스템 프롬프트, 체이닝"
tags: ["Claude", "프롬프트 엔지니어링", "XML", "체이닝"]
difficulty: "intermediate"
summary: "Claude에서 XML 구조화·시스템 프롬프트·프롬프트 체이닝을 활용해 전문가급 결과를 얻는 패턴"
---

## 🎯 학습 목표

1. XML 태그를 사용해 Claude에게 컨텍스트를 구조적으로 전달할 수 있다
2. 시스템 프롬프트로 AI의 페르소나와 행동 규칙을 설정할 수 있다
3. 복잡한 작업을 프롬프트 체이닝으로 분해하여 처리할 수 있다

---

## 📖 왜 Claude는 XML 태그에 반응하는가?

Claude는 학습 과정에서 구조화된 마크업 언어에 많이 노출되었습니다. XML 태그는 컨텍스트 경계를 명확히 하여 Claude가 각 정보의 역할을 더 정확히 이해하게 합니다.

**기본 원리**: 태그 이름이 내용의 역할을 설명 → Claude가 올바른 처리 방식을 선택

---

## 🛠️ 실습 1 — XML 태그 구조화

태그 없이 보내는 것과 XML 태그를 사용하는 것을 비교해보세요.

```
<role>
당신은 10년 경력의 시니어 풀스택 엔지니어입니다.
코드 리뷰 시 보안·성능·가독성을 모두 고려합니다.
</role>

<task>
아래 코드를 리뷰하고 개선사항을 알려주세요.
</task>

<code language="javascript">
async function getUser(id) {
  const res = await fetch('/api/user/' + id);
  const data = res.json();
  return data;
}
</code>

<output_format>
1. 버그/오류 (우선순위 높음)
2. 보안 취약점
3. 성능 개선
4. 가독성 개선
각 항목마다 문제점 + 수정된 코드 포함
</output_format>
```

---

## 🛠️ 실습 2 — 프롬프트 체이닝

복잡한 작업을 3단계 체인으로 처리하세요.

**Step 1: 분석**
```
<task>분석</task>
<input>
[분석할 텍스트/데이터]
</input>
<instruction>
위 내용에서 핵심 주제 3가지와 각 주제의 핵심 근거를 추출해주세요.
JSON 형식으로 출력해주세요.
</instruction>
```

**Step 2: 활용 (이전 결과 포함)**
```
<previous_result>
[Step 1 결과 붙여넣기]
</previous_result>
<task>
위 분석 결과를 바탕으로 임원 보고용 1페이지 요약문을 작성해주세요.
</task>
```

---

## 💬 프롬프트 패턴 8개

### 1. 역할 + 제약 조건 설정
```
<role>
당신은 [전문 역할]입니다.
[역할의 핵심 특성 2~3가지]
</role>

<constraints>
- 반드시 포함: [필수 요소]
- 제외할 것: [금지 사항]
- 언어: 한국어
- 길이: [제한]
</constraints>

<task>[작업 내용]</task>
```

### 2. Few-shot 예시 학습
```
<examples>
<example>
<input>나쁜 예시 입력</input>
<output>원하는 형태의 출력</output>
</example>
<example>
<input>또 다른 예시 입력</input>
<output>또 다른 예시 출력</output>
</example>
</examples>

<task>위 패턴을 따라 아래를 처리해주세요:</task>
<input>[실제 처리할 내용]</input>
```

### 3. Chain of Thought 유도
```
<task>[복잡한 문제]</task>

<thinking_process>
아래 순서로 단계별 사고를 보여주면서 답해주세요:
1. 문제를 분석하고
2. 가능한 접근법 2~3가지를 나열하고
3. 각 방법의 장단점을 비교하고
4. 최선의 방법을 선택한 이유를 설명하고
5. 최종 답변을 제시해주세요
</thinking_process>
```

### 4. 다중 페르소나 비교
```
아래 주제에 대해 3가지 관점에서 분석해주세요.

<perspectives>
<perspective role="낙관론자">긍정적 측면과 기회</perspective>
<perspective role="비판론자">위험과 문제점</perspective>
<perspective role="실용주의자">현실적 실행 방안</perspective>
</perspectives>

<topic>[분석 주제]</topic>
```

### 5. 단계별 문서 생성
```
<document_type>기술 명세서</document_type>
<subject>[프로젝트/기능명]</subject>

아래 섹션을 순서대로 작성해주세요. 각 섹션을 완성한 후 다음으로 넘어가세요:

<sections>
1. 개요 (목적, 범위, 대상)
2. 기능 요구사항 (필수/선택 구분)
3. 기술 스택 및 아키텍처
4. API 명세 (엔드포인트, 파라미터)
5. 에러 처리 방안
</sections>
```

### 6. 반복 개선 루프
```
<current_version>
[현재 작성된 내용]
</current_version>

<improvement_criteria>
아래 기준으로 위 내용을 평가하고 개선된 버전을 제공해주세요:
- 명확성 (점수/5)
- 설득력 (점수/5)
- 간결성 (점수/5)
개선 이유도 설명해주세요.
</improvement_criteria>
```

### 7. 조건부 분기 처리
```
<input>[처리할 내용]</input>

<decision_tree>
위 내용을 분석해서:
- 만약 [조건A]라면: [처리 방식 A]
- 만약 [조건B]라면: [처리 방식 B]
- 그 외의 경우: [기본 처리 방식]
으로 처리해주세요.
</decision_tree>
```

### 8. 메타 프롬프트 (프롬프트 생성 요청)
```
<goal>
나는 [목적]을 위한 Claude 프롬프트를 만들고 싶습니다.
</goal>

<context>
사용 환경: [어디서 사용할지]
대상 사용자: [누가 사용할지]
원하는 결과물: [어떤 출력을 원하는지]
</context>

위 정보를 바탕으로 최적화된 Claude 프롬프트를 작성해주세요.
XML 태그를 적절히 활용해주세요.
```

---

## 🎯 도전 과제

**미션**: 현재 업무에서 반복하는 작업 하나를 XML 구조화 프롬프트로 자동화하세요.

**완성 조건:**
- XML 태그 5개 이상 사용한 프롬프트 작성
- 태그 없는 버전과 태그 있는 버전 결과물 비교
- 개선된 프롬프트를 재사용 가능한 템플릿으로 저장

---

## ⚠️ 자주 하는 실수 3가지

**1. XML 태그를 과도하게 중첩**
- ❌ 5단계 이상 중첩된 태그 구조
- ✅ 2~3단계 이내로 유지, 필요한 곳에만 사용
- 💡 **해결법**: 태그가 많다고 무조건 좋은 게 아닙니다. 명확성이 목적

**2. 태그 이름이 모호함**
- ❌ `<thing>`, `<stuff>`, `<data>`
- ✅ `<user_feedback>`, `<code_snippet>`, `<task_requirements>`
- 💡 **해결법**: 태그 이름만 봐도 내용의 역할을 알 수 있어야 합니다

**3. 체이닝에서 이전 결과를 요약 없이 전부 복사**
- ❌ 긴 이전 답변 전체를 다음 프롬프트에 붙여넣기
- ✅ 필요한 핵심 결과만 추출해서 `<previous_result>` 태그에 담기
- 💡 **해결법**: 컨텍스트 창 낭비를 줄이고 핵심만 전달하세요

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- "Claude XML 프롬프트 엔지니어링 고급"
- "Anthropic prompt engineering best practices 2026"
- "프롬프트 체이닝 실전 예제 Claude"
- "Claude API system prompt tutorial"

---

## 📚 참고 자료

- [Anthropic 프롬프트 엔지니어링 공식 가이드](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic 프롬프트 라이브러리](https://docs.anthropic.com/en/prompt-library)
- [Claude 모델 공식 문서](https://docs.anthropic.com/en/docs/about-claude/models/overview)

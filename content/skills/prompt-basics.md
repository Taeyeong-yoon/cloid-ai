---
title: 프롬프트 작성법 기초 — 좋은 질문이 좋은 답을 만든다
tags:
  - 프롬프트
  - AI 기초
  - ChatGPT
  - Claude
difficulty: beginner
summary: 나쁜 프롬프트 vs 좋은 프롬프트 비교로 배우는 AI 질문법 기초
steps:
  - title: Understand Prompt Quality
    description: Learn the four essential elements of a good prompt.
    action: >-
      Read the section on the four elements of prompt quality: Role, Goal,
      Format, and Constraint.
    expectedResult: You can explain the differences between vague and specific prompts.
    failureHint: Revisit the definitions of each element if you are unsure.
  - title: Compare Bad vs Good Prompts
    description: Experiment with prompts to see the difference in responses.
    action: >-
      Input the bad prompt and the good prompt into ChatGPT or Claude and
      compare the results.
    expectedResult: You can see a significant difference in the quality of AI responses.
    failureHint: Try rephrasing the prompts for clarity if results are unclear.
  - title: Create Your Own Prompt
    description: Apply what you've learned by crafting your own effective prompt.
    action: >-
      Write a prompt using the four elements: Role, Goal, Format, and
      Constraint.
    expectedResult: You have a well-structured prompt ready to use with AI.
    failureHint: Check if you included all four elements if your prompt feels incomplete.
  - title: Request AI Feedback
    description: Learn how to refine your AI interactions.
    action: Use your crafted prompt with AI and ask for feedback on its effectiveness.
    expectedResult: You receive actionable suggestions to improve your prompt.
    failureHint: Revise your prompt based on the feedback received.
---

## 🎯 학습 목표

1. 모호한 프롬프트와 구체적인 프롬프트의 차이를 설명할 수 있다
2. 역할·목적·형식·제약 4요소를 포함한 프롬프트를 작성할 수 있다
3. AI 답변을 수정 요청으로 원하는 방향으로 유도할 수 있다

---

## 📖 프롬프트란?

프롬프트(Prompt)는 AI에게 보내는 명령문 또는 질문입니다. 같은 AI 모델이라도 어떻게 질문하느냐에 따라 결과물의 품질이 10배 이상 차이납니다.

**프롬프트 품질의 4요소:**
1. **역할(Role)** — AI에게 어떤 전문가 역할을 맡길지
2. **목적(Goal)** — 무엇을 원하는지
3. **형식(Format)** — 어떤 형태로 받고 싶은지
4. **제약(Constraint)** — 길이·톤·포함/제외 사항

---

## 🛠️ 실습 1 — 나쁜 vs 좋은 프롬프트 비교 실험

아래 두 프롬프트를 각각 ChatGPT나 Claude에 입력하고 결과를 비교해보세요.

**나쁜 프롬프트:**
```
자기소개서 써줘
```

**좋은 프롬프트:**
```
당신은 10년 경력의 채용 전문가입니다.
아래 정보를 바탕으로 신입 마케터 지원용 자기소개서를 써주세요.

- 지원 회사: IT 스타트업 (50명 규모)
- 지원 직무: 디지털 마케팅 인턴
- 나의 강점: 데이터 분석 경험, SNS 운영 2년, 영어 가능
- 원하는 톤: 자신감 있고 열정적으로
- 분량: 300자 내외
```

---

## 💬 나쁜 vs 좋은 프롬프트 비교 10쌍

### 1. 번역 요청
```
❌ 번역해줘
✅ 아래 문장을 한국어에서 비즈니스 영어로 번역해주세요.
   격식체로, 이메일에 사용할 수 있도록 자연스럽게 번역해주세요.
   [번역할 내용]
```

### 2. 요약 요청
```
❌ 요약해줘
✅ 아래 기사를 3줄로 요약해주세요.
   일반인도 이해할 수 있는 쉬운 언어로 작성해주세요.
   [기사 내용]
```

### 3. 아이디어 요청
```
❌ 아이디어 줘
✅ 20대 직장인을 위한 부업 아이디어 10개를 알려주세요.
   각 아이디어마다: 초기 비용, 예상 월수입, 시작 방법 1줄을 포함해주세요.
   코딩 지식 없이 할 수 있는 것으로만 제한해주세요.
```

### 4. 설명 요청
```
❌ 블록체인 설명해줘
✅ 블록체인을 60대 부모님에게 설명하듯이 알려주세요.
   기술 용어 없이, 일상 속 비유를 들어서, 3문장 이내로 설명해주세요.
```

### 5. 코드 요청
```
❌ 파이썬 코드 짜줘
✅ 파이썬으로 엑셀 파일을 읽어서 이름 컬럼만 추출하고
   중복을 제거한 뒤 새 파일로 저장하는 코드를 작성해주세요.
   각 줄에 한국어 주석을 달아주세요.
   파이썬 초보자도 이해할 수 있게 해주세요.
```

### 6. 피드백 요청
```
❌ 내 글 봐줘
✅ 아래 블로그 글에 대해 피드백해주세요.
   평가 기준: 1) 가독성 2) 논리적 흐름 3) 독자 흥미 유발
   각 항목을 5점 만점으로 점수 매기고, 개선 방안을 구체적으로 알려주세요.
   [글 내용]
```

### 7. 계획 수립
```
❌ 영어 공부 계획 세워줘
✅ 직장인을 위한 6개월 영어 회화 학습 계획을 세워주세요.
   조건: 하루 30분 이내, 앱·유튜브·팟캐스트만 활용, 비용 최소화
   월별 목표와 구체적인 학습 방법을 포함해주세요.
```

### 8. 글쓰기 요청
```
❌ 블로그 글 써줘
✅ "재택근무 3년 후 깨달은 것들"이라는 주제로 블로그 글을 써주세요.
   대상 독자: 재택근무를 시작하려는 직장인
   구조: 도입(문제 공감) → 본론 3가지 교훈 → 마무리(실천 제안)
   분량: 600자 내외, 친근한 말투
```

### 9. 비교 분석
```
❌ 아이폰이랑 갤럭시 비교해줘
✅ 아이폰 15와 갤럭시 S24를 비교해주세요.
   비교 기준: 카메라, 배터리, 가격, 생태계 연동
   표 형태로 정리해주세요.
   결론에서 어떤 사람에게 어떤 제품이 맞는지 추천해주세요.
```

### 10. 문제 해결
```
❌ 팀원이랑 갈등 있는데 어떡해
✅ 직장 팀원과의 갈등을 해결하는 방법을 알려주세요.
   상황: 팀원이 내 의견을 무시하고 독단적으로 행동함
   내 성격: 직접적 대화보다 문서로 소통 선호
   원하는 결과: 관계 유지하면서 문제 해결
   구체적인 대화 스크립트 2가지를 포함해주세요.
```

---

## 🎯 도전 과제

**미션**: 내가 평소에 AI에게 하던 질문 1개를 "좋은 프롬프트"로 재작성하세요.

**완성 조건:**
- 원래 프롬프트와 개선된 프롬프트를 모두 기록
- 두 프롬프트의 결과물 비교
- 개선된 프롬프트가 더 나은 이유를 한 줄로 설명

---

## ⚠️ 자주 하는 실수 3가지

**1. 역할(Role) 지정을 생략**
- ❌ "마케팅 전략 알려줘"
- ✅ "당신은 10년 경력의 B2B 마케팅 전문가입니다. 스타트업의 초기 고객 확보 전략을 알려주세요."
- 💡 **해결법**: "당신은 [역할]입니다" 한 줄만 추가해도 답변 품질이 크게 향상됩니다

**2. 원하는 형식을 말하지 않음**
- ❌ 결과물이 너무 길거나 산문체라 쓰기 불편함
- ✅ "표 형태로", "5개의 불릿 포인트로", "500자 이내로" 등 형식 명시
- 💡 **해결법**: 결과물을 어디에 쓸지 생각하고 그에 맞는 형식을 요청하세요

**3. 첫 답변이 마음에 안 들면 다시 시작**
- ❌ 새 대화창에서 처음부터 다시 입력
- ✅ "더 짧게", "3번 항목을 더 자세히", "톤을 더 친근하게 바꿔줘"로 수정 요청
- 💡 **해결법**: AI는 이전 대화를 기억합니다. 수정 요청을 적극 활용하세요

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- "프롬프트 엔지니어링 기초 한국어"
- "좋은 프롬프트 작성법 ChatGPT 활용"
- "prompt engineering beginner guide 2026"
- "챗지피티 프롬프트 꿀팁 모음"

---

## 📚 참고 자료

- [OpenAI 프롬프트 엔지니어링 가이드](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic 프롬프트 라이브러리](https://docs.anthropic.com/en/prompt-library)
- [Learn Prompting (무료 가이드)](https://learnprompting.org)

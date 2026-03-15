---
title: AI 자동화 워크플로 구축 — Zapier + ChatGPT 연동
tags:
  - 자동화
  - Zapier
  - 워크플로
  - ChatGPT
  - 노코드
difficulty: intermediate
summary: Zapier와 ChatGPT를 연동해 반복 업무를 완전 자동화하는 3가지 실무 시나리오
steps:
  - title: Set Up Gmail Trigger
    description: Configure Zapier to trigger when a new email is received.
    action: Select the Gmail app in Zapier and set up the 'New Email' trigger.
    expectedResult: >-
      The trigger is configured to capture new emails, with optional filters for
      specific labels or senders.
    failureHint: Check if Gmail is properly connected and permissions are granted.
  - title: Integrate ChatGPT
    description: Connect ChatGPT to analyze the email content.
    action: >-
      Input the provided prompt into the ChatGPT action in Zapier, using dynamic
      fields for email subject and body.
    expectedResult: ChatGPT processes the email and outputs a structured JSON classification.
    failureHint: >-
      Ensure the prompt is correctly formatted and that the ChatGPT app is
      connected.
  - title: Store Data in Notion
    description: Save the analyzed data into a Notion database.
    action: >-
      Parse the JSON output from ChatGPT and create a new page in Notion with
      the relevant information.
    expectedResult: A new page is created in Notion with the categorized email data.
    failureHint: >-
      Verify that the Notion database is set up correctly and that the
      integration is authorized.
---

## 🎯 학습 목표

1. Zapier의 Zap 구조(트리거→액션)를 이해하고 기본 자동화를 만들 수 있다
2. ChatGPT API를 Zapier에 연동해서 AI 처리 단계를 워크플로에 추가할 수 있다
3. 실무에서 바로 쓸 수 있는 자동화 파이프라인 3개를 구축할 수 있다

---

## 📖 AI 자동화의 핵심 개념

**Zapier 구조:**
```
트리거(Trigger) → 액션(Action) → 액션 → ...
     "언제"          "무엇을"     "또 무엇을"
```

**ChatGPT 연동 포인트:**
- Zapier의 "ChatGPT" 또는 "OpenAI" 앱 사용
- 이전 단계 데이터를 프롬프트에 동적으로 삽입
- AI 출력을 다음 액션의 입력으로 전달

---

## 🛠️ 실습 1 — Gmail 수신 → AI 분류 → Notion 저장 자동화

**구성:** Gmail(트리거) → ChatGPT(분류) → Notion(저장)

**Step 1: 트리거 설정**
Zapier에서 Gmail 앱을 선택하고 "New Email" 트리거 설정.
(원하는 경우 필터: 특정 레이블 또는 발신자만 처리)

**Step 2: ChatGPT 연동**
아래 프롬프트를 Zapier ChatGPT 액션에 입력:

```
아래 이메일을 분석하고 JSON 형식으로 분류해주세요.

이메일 제목: {{subject}}
이메일 내용: {{body_plain}}

출력 형식:
{
  "category": "업무요청/미팅/뉴스레터/광고/기타 중 하나",
  "priority": "높음/보통/낮음 중 하나",
  "summary": "2문장 이내 요약",
  "action_required": true/false,
  "due_date": "기한이 있으면 날짜, 없으면 null"
}
```

**Step 3: Notion 저장**
ChatGPT 출력을 파싱해서 Notion 데이터베이스에 새 페이지 생성.

---

## 🛠️ 실습 2 — 구글 폼 응답 → AI 분석 → 슬랙 알림

**구성:** Google Forms(트리거) → ChatGPT(분석) → Slack(알림)

```
고객 피드백 폼 응답이 들어왔습니다.

고객명: {{name}}
평점: {{rating}}/5
피드백: {{feedback}}

다음을 분석해주세요:
1. 감정 분석: 긍정/중립/부정
2. 주요 불만/칭찬 포인트 (한 줄)
3. 즉각 대응 필요 여부: YES/NO
4. 담당팀 추천: 개발/디자인/고객지원/영업

결과를 슬랙 메시지용 간결한 형태로 작성해주세요.
```

---

## 💬 프롬프트 템플릿 8개

### 시나리오 1. 소셜 미디어 모니터링
```
아래 소셜 미디어 멘션을 분석해주세요.

브랜드명: [브랜드]
멘션 내용: {{mention_text}}
플랫폼: {{platform}}

분석:
1. 긍부정 감정 (점수: -5 ~ +5)
2. 주요 키워드 3개
3. 응대 필요 여부와 우선순위
4. 추천 응답 초안 (있는 경우)

JSON 형식으로 출력해주세요.
```

### 시나리오 2. 일정 자동 요약
```
오늘의 캘린더 일정을 바탕으로 하루 브리핑을 작성해주세요.

일정 목록:
{{calendar_events}}

브리핑 형식:
- 오늘의 핵심 일정 (시간 순)
- 준비해야 할 것 (각 미팅별)
- 이동 시간 고려한 타임라인 주의사항
- 오늘 집중해야 할 최우선 과제

카카오톡 메시지처럼 읽기 쉽게 작성해주세요.
```

### 시나리오 3. 블로그 포스트 자동 SNS 배포
```
아래 블로그 포스트를 각 SNS 플랫폼에 맞게 변환해주세요.

블로그 제목: {{post_title}}
블로그 내용 요약: {{post_excerpt}}
블로그 URL: {{post_url}}

플랫폼별 출력:
1. 트위터/X: 280자 이내, 핵심 인사이트 + URL
2. 링크드인: 3~5문장, 전문적 톤, 해시태그 3개
3. 인스타그램: 감성적 캡션, 이모지 포함, 해시태그 10개

각 플랫폼 출력을 명확히 구분해주세요.
```

### 시나리오 4. 고객 문의 자동 1차 응답
```
아래 고객 문의를 분석하고 1차 자동 응답 초안을 작성해주세요.

고객명: {{customer_name}}
문의 내용: {{inquiry}}
고객 등급: {{customer_tier}}

응답 초안 조건:
- 정중하고 공감적인 톤
- 문의 핵심 사항을 이해했음을 보여주기
- 예상 처리 시간 안내
- 추가 정보가 필요한 경우 질문 1개

응답 문자 수: 200자 이내
```

### 시나리오 5. 주간 리포트 자동 생성
```
아래 이번 주 데이터로 팀 주간 리포트를 작성해주세요.

완료된 태스크: {{completed_tasks}}
이번 주 매출: {{weekly_revenue}}
주요 이슈: {{issues}}
다음 주 계획: {{next_week_plan}}

리포트 형식:
- 성과 하이라이트 (3줄)
- 수치로 본 이번 주 (bullet 5개)
- 해결된 이슈 / 미해결 이슈
- 다음 주 우선순위 3가지
```

---

## 🎯 도전 과제

**미션**: 내 업무에서 가장 반복적인 작업 하나를 Zapier + AI로 자동화하세요.

**완성 조건:**
- 자동화할 작업 정의 + Zap 흐름도 작성
- Zapier에서 실제 Zap 생성 및 테스트 실행 성공
- 1주일 동안 자동화로 절약된 시간 측정

---

## ⚠️ 자주 하는 실수 3가지

**1. AI 출력 형식이 일관되지 않아 다음 단계에서 파싱 실패**
- ❌ "분석 결과를 알려줘" → 매번 다른 형식으로 출력
- ✅ 항상 JSON 또는 고정된 형식으로 출력하도록 프롬프트에 명시
- 💡 **해결법**: 프롬프트 끝에 "반드시 위 JSON 형식으로만 출력하세요. 다른 텍스트는 포함하지 마세요" 추가

**2. 자동화가 오류나도 모름**
- ❌ Zap 오류 알림을 설정하지 않음
- ✅ Zapier 설정에서 오류 알림 이메일/슬랙 연동
- 💡 **해결법**: 각 Zap에 "Filter" 단계를 추가해 예외 상황 처리

**3. 민감한 데이터를 AI에 그대로 전송**
- ❌ 고객 개인정보, 기밀 계약 내용을 ChatGPT에 전송
- ✅ 민감 정보 마스킹 후 전송, 또는 사내 LLM 사용
- 💡 **해결법**: 이름→익명, 금액→상대값 등으로 변환 후 분석 요청

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- "Zapier ChatGPT 연동 자동화 한국어"
- "Zapier OpenAI integration tutorial 2026"
- "업무 자동화 Zapier Make 비교"
- "AI workflow automation no-code 2026"

---

## 📚 참고 자료

- [Zapier 공식 사이트](https://zapier.com)
- [Make (구 Integromat)](https://www.make.com)
- [OpenAI API 공식 문서](https://platform.openai.com/docs)

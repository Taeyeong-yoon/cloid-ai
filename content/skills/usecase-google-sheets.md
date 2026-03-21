---
title: Google Sheets + Claude API — 스프레드시트에 AI 붙이기
category: usecases
tags: [Google Sheets, Apps Script, 스프레드시트, 자동화]
difficulty: intermediate
summary: Google Apps Script로 Claude API를 Sheets에 연결합니다. 셀 내용을 Claude에게 보내고 결과를 옆 셀에 자동 채우는 실전 패턴입니다.
updated: 2026-03-21
---

## 활용 시나리오

- 고객 리뷰 수백 개 → 감성 분석 자동화
- 제품명 컬럼 → 영어 번역 자동 채우기
- 긴 설명 컬럼 → 50자 요약 자동 생성
- 데이터 컬럼 → 카테고리 자동 분류

## Apps Script 기본 설정

Google Sheets → **확장 프로그램** → **Apps Script**

```javascript
const ANTHROPIC_API_KEY = "sk-ant-..."; // 본인 키

function callClaude(prompt) {
  const url = "https://api.anthropic.com/v1/messages";

  const payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  return result.content[0].text;
}
```

## 실전 함수들

### 감성 분석
```javascript
function analyzeSentiment() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();

  for (let i = 2; i <= lastRow; i++) {
    const review = sheet.getRange(i, 1).getValue();
    if (!review) continue;

    const prompt = `다음 리뷰의 감성을 분석해서 "긍정", "부정", "중립" 중 하나만 답해:
"${review}"`;

    const sentiment = callClaude(prompt).trim();
    sheet.getRange(i, 2).setValue(sentiment);

    Utilities.sleep(500); // API 속도 제한 방지
  }
}
```

### 일괄 번역
```javascript
function translateToEnglish() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();

  for (let i = 2; i <= lastRow; i++) {
    const korean = sheet.getRange(i, 1).getValue();
    if (!korean) continue;

    const prompt = `다음 한국어를 자연스러운 영어로 번역해. 번역문만 출력:
"${korean}"`;

    const english = callClaude(prompt).trim();
    sheet.getRange(i, 3).setValue(english);
    Utilities.sleep(300);
  }
}
```

### 커스텀 함수 (셀에서 바로 사용)
```javascript
/**
 * Claude에게 텍스트를 요약하게 합니다
 * @param {string} text 요약할 텍스트
 * @param {number} maxLength 최대 글자 수 (기본 50)
 * @customfunction
 */
function CLAUDE_SUMMARIZE(text, maxLength = 50) {
  return callClaude(`다음 텍스트를 ${maxLength}자 이내로 요약해:
"${text}"`);
}
```

셀에서 `=CLAUDE_SUMMARIZE(A2, 30)` 으로 바로 사용 가능.

## 버튼으로 실행하기

**삽입 → 그리기** → 버튼 모양 → 텍스트 "분석 시작"
→ 버튼 우클릭 → **스크립트 할당** → 함수명 입력

## API 키 보안

Apps Script의 Script Properties를 사용하면 코드에 키를 하드코딩하지 않아도 됩니다:

```javascript
// 설정: File → Project Properties → Script Properties
// 키: ANTHROPIC_KEY, 값: sk-ant-...

const ANTHROPIC_API_KEY = PropertiesService
  .getScriptProperties()
  .getProperty("ANTHROPIC_KEY");
```

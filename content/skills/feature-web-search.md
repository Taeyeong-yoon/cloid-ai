---
title: Web Search — Claude가 인터넷을 직접 검색하다
category: features
tags: [Web Search, 실시간, 최신 정보]
difficulty: beginner
summary: Claude가 실시간 웹 검색으로 최신 뉴스·데이터·정보를 가져옵니다. 학습 데이터 컷오프를 넘어서는 질문에 효과적입니다.
updated: 2026-03-21
---

## 무엇인가?

Claude의 Web Search는 학습 데이터 이후의 최신 정보를 실시간으로 검색해 답변에 반영하는 기능입니다. 2025년부터 claude.ai Pro/Team 플랜에서 기본 제공됩니다.

## 언제 쓰나?

- 최근 뉴스·이벤트 질문 ("오늘 주요 AI 뉴스는?")
- 최신 패키지 버전·공식 문서 확인
- 실시간 환율·주가·날씨
- 최근 출시된 제품·서비스 정보

## 사용 방법

### claude.ai 웹
대화창 하단 **도구 아이콘** → **Search** 활성화 후 질문하면 자동으로 웹 검색을 수행합니다.

또는 질문에 명시적으로 요청:
```
오늘 기준 Claude API 최신 가격을 검색해서 알려줘
```

### API 사용 시 (Anthropic Tool Use)
```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search"
    }],
    messages=[{
        "role": "user",
        "content": "2026년 최신 LLM 벤치마크 순위를 검색해줘"
    }]
)
```

## 검색 결과 활용 팁

- 검색 결과 출처(URL)를 확인하고 중요한 내용은 원본 링크 직접 확인
- "~를 검색하고 요약해줘"처럼 명확하게 요청하면 더 정확한 결과
- 여러 소스를 비교해야 할 때: "여러 소스를 검색해서 비교해줘"

## 주의사항

- 검색 결과가 항상 최신·정확하지 않을 수 있습니다
- 민감한 의료·법률 정보는 공식 기관 확인 필수
- API 사용 시 web_search 도구 사용은 추가 비용이 발생합니다

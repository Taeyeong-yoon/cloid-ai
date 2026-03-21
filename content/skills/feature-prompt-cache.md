---
title: Prompt Caching — API 비용을 최대 90% 줄이는 방법
category: features
tags: [Prompt Caching, API, 비용 절감, 고급]
difficulty: advanced
summary: 반복되는 긴 컨텍스트(시스템 프롬프트, 문서)를 캐싱하면 입력 토큰 비용을 최대 90% 절감하고 응답 속도도 빨라집니다.
updated: 2026-03-21
---

## 무엇인가?

Prompt Caching은 Claude API에서 자주 반복되는 긴 텍스트(시스템 프롬프트, 참조 문서 등)를 서버에 임시 저장해 재사용하는 기능입니다.

**효과**: 캐시된 토큰은 일반 입력 토큰 대비 **90% 저렴**, 응답 시간도 단축.

## 언제 쓰나?

- 긴 시스템 프롬프트를 모든 요청에 반복 포함할 때
- 대용량 문서(법률, 코드베이스, 매뉴얼)를 참조 컨텍스트로 사용할 때
- RAG 시스템에서 고정된 컨텍스트가 있을 때

## 구현 방법

```python
import anthropic

client = anthropic.Anthropic()

# 긴 시스템 프롬프트나 문서를 cache_control로 표시
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "당신은 전문 법률 어시스턴트입니다...",
        },
        {
            "type": "text",
            "text": "<법률 문서 전체 내용 - 수만 토큰>",
            "cache_control": {"type": "ephemeral"}  # 이 부분을 캐시
        }
    ],
    messages=[{
        "role": "user",
        "content": "3조 2항의 내용을 설명해줘"
    }]
)
```

## 캐시 유지 시간

- **5분** 동안 캐시 유지 (기본)
- 5분 이내에 같은 캐시 prefix로 요청하면 캐시 적중
- 캐시 미스 시 일반 요금 적용

## 비용 비교 (예시)

| 상황 | 일반 요금 | 캐시 사용 |
|------|----------|---------|
| 10만 토큰 시스템 프롬프트 × 100회 요청 | $300 | **$31** |
| 5만 토큰 문서 × 50회 RAG 쿼리 | $75 | **$8** |

## 팁

- `cache_control`은 프롬프트의 고정된 부분(앞쪽)에만 적용
- 변하는 부분(사용자 메시지)은 캐시 대상이 아님
- 캐시 적중 여부는 API 응답의 `usage.cache_read_input_tokens`로 확인

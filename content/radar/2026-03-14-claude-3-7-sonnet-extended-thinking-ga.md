---
title: "Claude 3.7 Sonnet Extended Thinking — GA 출시, 복잡한 추론 작업 정확도 40% 향상"
date: "2026-03-14"
tags: ["Claude", "AI Model", "Extended Thinking"]
summary: "Anthropic이 Claude 3.7 Sonnet의 Extended Thinking 기능을 정식 출시했습니다."
score: 95
sourceUrl: "https://www.anthropic.com/news/claude-3-7-sonnet"
---

## Claude 3.7 Sonnet Extended Thinking 정식 출시

Anthropic이 Claude 3.7 Sonnet의 **Extended Thinking** 기능을 2026년 3월 14일 정식 출시(GA)했습니다.

### 주요 특징

- **추론 능력 향상**: 수학, 코딩, 과학 분야 복잡한 문제에서 이전 모델 대비 40% 정확도 향상
- **Think 토큰 시각화**: 내부 추론 과정을 개발자가 확인 가능
- **API 지원**: 기업용 Anthropic API에서 `thinking` 파라미터로 활성화
- **비용 구조**: 추론 토큰은 별도 과금, 복잡한 작업에서는 비용 대비 효율 우수

### 개발자 활용법

```python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-3-7-sonnet-20260314",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{"role": "user", "content": "복잡한 수학 문제를 풀어줘"}]
)
```

### 업계 반응

Extended Thinking은 o1/o3 계열 모델과 직접 경쟁하는 Anthropic의 전략적 기능으로, 특히 코드 디버깅, 복잡한 데이터 분석, 멀티스텝 계획 수립에서 강점을 보입니다.

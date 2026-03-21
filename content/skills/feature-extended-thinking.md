---
title: Extended Thinking — Claude가 스스로 깊게 생각하게 하기
category: features
tags: [Extended Thinking, Claude 3.7, 추론, 고급]
difficulty: intermediate
summary: Claude 3.7 Sonnet부터 제공되는 확장 사고 모드. 복잡한 수학·코딩·전략 문제에서 정확도가 크게 올라갑니다.
updated: 2026-03-21
---

## 무엇인가?

**Extended Thinking**은 Claude가 최종 답변 전에 내부적으로 단계별 사고 과정을 거치는 기능입니다. 사람이 어려운 문제를 풀기 전에 종이에 풀이를 적어보는 것과 같습니다.

Claude 3.7 Sonnet(2025년 2월 출시)부터 정식 지원합니다.

## 언제 효과적인가?

- 복잡한 수학 / 논리 추론 문제
- 여러 조건이 얽힌 코드 설계
- 장기 전략 수립 (경쟁 분석, 로드맵)
- 법률·의료 문서의 세밀한 해석
- 멀티스텝 데이터 분석

## 사용 방법

### claude.ai 웹
대화창 입력 전 **"깊게 생각해서"**, **"단계별로"**, **"천천히 분석해서"** 같은 문구를 추가합니다.

### API 사용 시
```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # 사고에 쓸 최대 토큰
    },
    messages=[{
        "role": "user",
        "content": "이 알고리즘의 시간복잡도를 분석하고 최적화 방안을 제시해줘"
    }]
)
```

## 팁

- `budget_tokens`를 높일수록 더 깊이 생각하지만 응답이 느려집니다
- 간단한 질문에는 오히려 과잉 — 복잡한 문제에만 사용하세요
- 사고 과정(thinking blocks)이 응답에 표시되어 논리 흐름을 확인할 수 있습니다

---
title: Adaptive Thinking — 생각의 양을 모델이 정한다
category: features
tags: [thinking, effort, API]
difficulty: intermediate
summary: 고정 사고 예산을 숫자로 지정하던 방식은 사라졌습니다. 모델이 난이도에 따라 스스로 조절하고, 개발자는 effort로 방향만 잡습니다.
updated: 2026-08-12
badge: UPDATED
---
> "1만 토큰만큼 생각해라"가 아니라 "이 정도 수준으로 임해라"로 바뀌었습니다.

## 왜 알아야 하나

예전에는 `budget_tokens`로 사고량을 직접 정했습니다. 문제는 적정값을 사람이 알 수 없다는 것이었습니다. 쉬운 문제에 큰 예산을 주면 낭비고, 어려운 문제에 작게 주면 답이 얕아집니다.

지금은 모델이 문제를 보고 스스로 정합니다. 최신 모델에서는 **고정 예산 방식이 아예 거부**되므로, 옛 코드를 옮길 때 반드시 바꿔야 합니다.

## 개념 잡기

```js
// 옛 방식 — 최신 모델에서 오류
thinking: { type: "enabled", budget_tokens: 10000 }

// 현재 방식
thinking: { type: "adaptive" }
output_config: { effort: "high" }
```

**사고 내용은 기본적으로 보이지 않습니다.** 사용자에게 진행 상황을 노출하는 제품이라면 요약 표시를 켜야 합니다.

```js
thinking: { type: "adaptive", display: "summarized" }
```

이 설정 없이 스트리밍하면, 응답 전에 긴 정적이 흐르는 것처럼 보입니다.

## 바로 해보기

1. 기존 코드에 `budget_tokens`가 있는지 검색합니다. 있으면 `adaptive`로 교체합니다.
2. 같은 작업을 `effort: "medium"`과 `"high"`로 각각 돌려 품질·토큰·시간을 비교합니다.
3. 사고 과정을 사용자에게 보여줄 제품이라면 `display: "summarized"`를 켜고 체감을 확인합니다.
4. `xhigh`를 쓸 계획이라면 `max_tokens`를 넉넉히 잡고 답변이 잘리지 않는지 확인합니다.

## 흔한 실수

**❌ 사고가 과하다고 판단해 아예 끈다**

→ 끄는 것보다 effort를 낮추는 편이 안전합니다. 사고를 끄면 오히려 답변이 장황해지는 경우가 있습니다.

**❌ `xhigh`·`max`를 쓰면서 `max_tokens`를 그대로 둔다**

→ 사고가 예산을 먹어 답변이 중간에 잘립니다. 높은 effort에는 넉넉한 출력 예산이 필요합니다.

**❌ 프롬프트로 "생각하지 마"라고 지시한다**

→ 설정으로 조절하세요. 프롬프트로 억제하면 결과가 불안정해집니다.

## 스스로 점검하기

**Q. `budget_tokens`를 대체하는 것은?**

<details><summary>답 보기</summary>

`thinking: { type: "adaptive" }` + `output_config.effort`입니다.

</details>

**Q. 스트리밍 UI에서 응답 전 정적이 길게 느껴진다면?**

<details><summary>답 보기</summary>

사고 표시가 기본 비공개이기 때문입니다. `display: "summarized"`를 켜세요.

</details>

## 더 읽기

- [적응형 사고 문서](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
- [effort 파라미터](https://platform.claude.com/docs/en/build-with-claude/effort)

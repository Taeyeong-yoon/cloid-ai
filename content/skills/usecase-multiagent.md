---
title: 멀티에이전트 — Claude 여러 개가 협력하는 워크플로우
category: usecases
tags: [멀티에이전트, Claude Code, Agent SDK, 자동화]
difficulty: advanced
summary: Claude Agent SDK로 여러 Claude 인스턴스가 역할을 나눠 병렬로 작업합니다. 복잡한 작업을 더 빠르고 정확하게 처리합니다.
updated: 2026-03-21
---

## 왜 멀티에이전트인가?

단일 Claude로 처리하기 어려운 작업들:
- 컨텍스트 한계를 넘는 대용량 코드베이스 분석
- 여러 관점이 필요한 작업 (기획자 + 개발자 + 디자이너)
- 병렬 처리로 속도를 높여야 할 때
- 결과를 상호 검증해야 할 때 (체크앤밸런스)

## 기본 패턴

### 오케스트레이터 + 서브에이전트

```
오케스트레이터 Claude (계획·조율)
    ├─ 서브에이전트 A (리서치 담당)
    ├─ 서브에이전트 B (코드 작성 담당)
    └─ 서브에이전트 C (검토·QA 담당)
```

## Claude Agent SDK 구현

```python
import anthropic
import asyncio

client = anthropic.Anthropic()

async def run_agent(role: str, task: str, context: str = "") -> str:
    """단일 에이전트 실행"""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        system=f"당신은 {role}입니다. 주어진 작업에만 집중하세요.",
        messages=[{
            "role": "user",
            "content": f"{context}\n\n작업: {task}" if context else task
        }]
    )
    return response.content[0].text

async def multi_agent_pipeline(topic: str):
    """멀티에이전트 파이프라인"""

    print("1단계: 리서치 에이전트 실행 중...")
    research = await asyncio.to_thread(
        run_agent,
        "리서치 전문가",
        f"{topic}에 대한 핵심 정보를 수집하고 정리해줘"
    )

    print("2단계: 작성·비판 에이전트 병렬 실행 중...")
    writer_task = asyncio.to_thread(
        run_agent,
        "기술 작가",
        "이 정보를 바탕으로 블로그 포스트 초안을 작성해줘",
        research
    )
    critic_task = asyncio.to_thread(
        run_agent,
        "비평가",
        "이 리서치의 약점과 누락된 정보를 지적해줘",
        research
    )

    draft, critique = await asyncio.gather(writer_task, critic_task)

    print("3단계: 최종 편집 에이전트 실행 중...")
    final = await asyncio.to_thread(
        run_agent,
        "최종 편집자",
        f"초안과 비평을 종합해서 최종 버전을 완성해줘\n\n초안:\n{draft}\n\n비평:\n{critique}",
    )

    return final

# 실행
result = asyncio.run(multi_agent_pipeline("2026년 AI 에이전트 트렌드"))
print(result)
```

## Claude Code 서브에이전트 (Task 도구)

Claude Code 내에서 서브에이전트를 실행:

```python
# Claude Code가 복잡한 작업을 자동으로 서브에이전트에 위임
# CLAUDE.md에 설정:
"""
복잡한 작업은 다음 순서로 처리:
1. 계획 수립 (먼저 작업을 단계로 분해)
2. 각 단계를 독립적으로 실행
3. 결과를 종합하고 검증
"""
```

## 실전 케이스: 코드 리뷰 파이프라인

```python
async def code_review_pipeline(pr_diff: str):
    # 병렬 리뷰
    security_review, performance_review, style_review = await asyncio.gather(
        run_agent("보안 전문가", f"보안 취약점 검사:\n{pr_diff}"),
        run_agent("성능 전문가", f"성능 이슈 분석:\n{pr_diff}"),
        run_agent("코드 스타일 전문가", f"코드 품질 검토:\n{pr_diff}")
    )

    # 종합
    summary = await run_agent(
        "시니어 개발자",
        "세 전문가의 리뷰를 종합해서 우선순위별로 정리해줘",
        f"보안: {security_review}\n성능: {performance_review}\n스타일: {style_review}"
    )
    return summary
```

## 주의사항

- 에이전트가 많을수록 비용이 선형 증가합니다
- 오케스트레이터의 프롬프트 품질이 전체 결과를 좌우합니다
- 무한 루프 방지를 위한 최대 반복 횟수 설정 필수
- 중간 결과를 로그에 저장해서 디버깅 가능하게 구성

---
title: AI 에이전트 만들기 — 자율적으로 일하는 AI 구축
tags:
  - AI 에이전트
  - LangChain
  - CrewAI
  - 자동화
  - Python
difficulty: advanced
summary: LangChain과 CrewAI로 자율적으로 목표를 달성하는 AI 에이전트를 설계하고 구축하는 실전 가이드
steps:
  - title: Install Required Libraries
    description: Set up the necessary libraries for building AI agents.
    action: >-
      Run the command `pip install langchain langchain-anthropic
      langchain-community` in your terminal.
    expectedResult: The libraries are installed without errors.
    failureHint: Check your Python environment and ensure you have pip installed.
  - title: Create a LangChain Agent
    description: Build a single agent using LangChain to perform web searches.
    action: >-
      Implement the provided code for the Claude-based research agent using the
      DuckDuckGoSearchTool.
    codeSnippet: code for the research agent
    expectedResult: >-
      The agent is able to accept user questions and return summarized search
      results.
    failureHint: Verify that the API keys and configurations are correct.
  - title: Set Up CrewAI Multi-Agent System
    description: Design a collaborative system with multiple agents using CrewAI.
    action: >-
      Create the two agents (Researcher and Writer) as described and implement
      their tasks.
    codeSnippet: code for the multi-agent system
    expectedResult: >-
      The system successfully generates a blog post based on the researcher's
      findings.
    failureHint: Check the roles and tasks assigned to each agent for correctness.
  - title: Test the Agents
    description: Run the agents to ensure they function as expected.
    action: Execute the LangChain agent and the CrewAI system to see their outputs.
    expectedResult: Both agents produce the expected results without errors.
    failureHint: Look for error messages in the console to troubleshoot.
---

## 🎯 학습 목표

1. AI 에이전트의 핵심 개념(ReAct 패턴, 도구 사용, 메모리)을 이해한다
2. LangChain으로 도구를 사용하는 단일 에이전트를 구축할 수 있다
3. CrewAI로 여러 에이전트가 협업하는 멀티 에이전트 시스템을 설계할 수 있다

---

## 📖 AI 에이전트란?

**일반 AI**: 질문 → 답변 (1회)
**AI 에이전트**: 목표 → 계획 → 도구 사용 → 관찰 → 반복 → 목표 달성 (자율 루프)

**ReAct 패턴 (Reasoning + Acting):**
```
[생각] 현재 상황을 분석하고 다음 행동 결정
[행동] 도구 호출 (검색, 코드 실행, API 호출 등)
[관찰] 결과 확인
[생각] 결과를 바탕으로 다음 단계 계획
... 반복 ...
[최종 답변] 목표 달성
```

---

## 🛠️ 실습 1 — LangChain 도구 사용 에이전트

```bash
pip install langchain langchain-anthropic langchain-community
```

**Claude 기반 연구 에이전트 코드 요청:**
```
LangChain과 Claude API로 웹 검색 에이전트를 만들어주세요.

기능:
- 사용자 질문을 받아서
- DuckDuckGo로 관련 정보를 검색하고
- 검색 결과를 종합해서 답변 생성

코드 구성:
- tools: DuckDuckGoSearchTool
- agent_type: ReAct 방식
- llm: claude-sonnet-4-6
- 에이전트의 생각 과정(reasoning)을 출력

Python 코드 전체와 실행 방법 포함
```

---

## 🛠️ 실습 2 — CrewAI 멀티 에이전트 시스템

```bash
pip install crewai
```

**2명이 협업하는 콘텐츠 생성 크루:**
```
CrewAI로 블로그 포스트를 자동 생성하는 에이전트 팀을 만들어주세요.

에이전트 구성:
1. 리서처 (Researcher)
   - 역할: 주어진 주제를 인터넷에서 조사
   - 도구: 웹 검색

2. 작가 (Writer)
   - 역할: 리서처의 조사 결과로 블로그 포스트 작성
   - 도구: 없음 (언어 능력만 활용)

태스크:
- 리서처: "[주제]"에 대한 최신 정보 수집
- 작가: 수집된 정보로 1500자 블로그 포스트 작성

전체 CrewAI 코드 + 실행 예시
```

---

## 💬 프롬프트 템플릿 10개

### 1. 단일 에이전트 기본 구조
```
Python으로 [목적] 에이전트를 만들어주세요.

에이전트 설정:
- LLM: Claude claude-sonnet-4-6
- 도구: [도구 목록]
- 메모리: ConversationBufferMemory (대화 유지)
- 최대 반복: 10회

처리할 태스크: [설명]
에이전트의 추론 과정을 터미널에 출력하도록 설정
```

### 2. 커스텀 도구 만들기
```
LangChain 에이전트에서 사용할 커스텀 도구를 만들어주세요.

도구 이름: [이름]
도구 설명: [에이전트에게 보여줄 설명 — 언제 이 도구를 써야 하는지]
입력 형식: [파라미터 설명]
처리 로직: [무엇을 하는지]
반환 형식: [어떤 형태로 결과를 반환하는지]

@tool 데코레이터 방식으로 구현
```

### 3. 멀티 에이전트 파이프라인
```
CrewAI로 [목적] 파이프라인을 만들어주세요.

에이전트:
1. [에이전트1]: 역할, 목표, 배경지식
2. [에이전트2]: 역할, 목표, 배경지식
3. [에이전트3]: 역할, 목표, 배경지식

태스크 순서:
- 태스크1 → 에이전트1 담당
- 태스크2 → 에이전트2 담당 (태스크1 결과 입력)
- 태스크3 → 에이전트3 담당 (최종 결과)

process: sequential (순차 실행)
```

### 4. 에이전트 메모리 구현
```
장기 메모리를 가진 에이전트를 만들어주세요.

메모리 종류:
- 단기 메모리: 현재 대화 (ConversationBufferMemory)
- 장기 메모리: 이전 세션 기억 (벡터DB 저장)

구현 방법:
- 벡터DB: Chroma (로컬)
- 임베딩: text-embedding-3-small
- 매 대화 후 중요 정보를 벡터DB에 저장
- 새 질문 시 관련 기억 검색하여 컨텍스트 추가

전체 코드 + 예시 대화 흐름
```

### 5. 에러 복구 에이전트
```
도구 실행 실패 시 자동으로 복구하는 에이전트를 만들어주세요.

복구 전략:
- 첫 번째 도구 실패 → 다른 도구 시도
- 두 번째 실패 → 파라미터 변경 후 재시도
- 세 번째 실패 → 우아한 실패 처리 (fallback 응답)

최대 재시도: 3회
각 시도마다 실패 이유를 로그에 기록
```

### 6. 병렬 실행 에이전트
```
여러 에이전트가 동시에 작업하는 병렬 시스템을 만들어주세요.

사용 케이스: [설명]

에이전트 A, B, C가 각각 다른 작업을 병렬로 실행
완료된 결과를 통합 에이전트가 취합하여 최종 답변 생성

asyncio로 비동기 병렬 실행
각 에이전트 소요 시간 측정 및 출력
```

### 7. 계획 수립 에이전트 (Plan-and-Execute)
```
Plan-and-Execute 패턴의 에이전트를 만들어주세요.

단계:
1. Planner 에이전트: 목표를 세부 단계로 분해
2. Executor 에이전트: 각 단계를 순서대로 실행
3. Replanner: 실행 결과에 따라 계획 수정

목표: [복잡한 목표]
사용 가능한 도구: [목록]
```

### 8. 에이전트 평가 시스템
```
에이전트의 성능을 자동 평가하는 시스템을 만들어주세요.

평가 항목:
- 정확성: 결과가 목표와 일치하는가
- 효율성: 최소한의 도구 호출로 해결했는가
- 비용: 사용된 토큰 수

테스트 케이스 5개를 포함하고
각 케이스별 점수를 출력하는 평가 스크립트 작성
```

### 9. Human-in-the-loop 에이전트
```
특정 조건에서 사람의 승인을 받는 에이전트를 만들어주세요.

승인 필요 조건:
- 외부 API 호출 (비용 발생)
- 파일 삭제
- 이메일 발송
- 금액이 N원 이상인 작업

승인 대기 시: 터미널에서 Y/N 입력 받기
거절 시: 대안 방법 탐색
```

### 10. 에이전트 관찰가능성 (Observability)
```
에이전트의 동작을 상세히 추적하는 로깅 시스템을 추가해주세요.

추적 항목:
- 각 LLM 호출 (프롬프트, 응답, 토큰 수, 소요 시간)
- 도구 호출 (이름, 입력, 출력, 성공/실패)
- 추론 단계 (생각 → 행동 → 관찰)
- 전체 실행 흐름

출력: JSON Lines 파일 저장 + 콘솔 요약
```

---

## 🎯 도전 과제

**미션**: 실제 업무 문제를 해결하는 멀티 에이전트 시스템을 구축하세요.

**완성 조건:**
- 최소 2개 이상의 에이전트가 협업
- 실제 외부 데이터 소스(API, 파일, DB) 연결
- 에이전트의 추론 과정이 로그로 저장됨
- 5개 이상의 테스트 케이스로 동작 검증

---

## ⚠️ 자주 하는 실수 3가지

**1. 에이전트가 무한 루프에 빠짐**
- ❌ 최대 반복 횟수를 설정하지 않음
- ✅ `max_iterations` 또는 `max_execution_time`을 항상 설정
- 💡 **해결법**: 개발 단계에서는 max_iterations=5로 낮게 설정하고, 동작 확인 후 증가

**2. 도구 설명이 모호해서 에이전트가 잘못된 도구 선택**
- ❌ 도구 description이 짧고 불명확함
- ✅ "언제, 어떤 입력으로, 무엇을 반환하는지"를 상세히 설명
- 💡 **해결법**: 도구 설명에 사용 예시를 포함하면 에이전트가 올바르게 선택

**3. 비용 관리 없이 실행**
- ❌ 에이전트가 API를 무한정 호출해서 비용 폭발
- ✅ 토큰 카운팅 + 비용 한도 설정
- 💡 **해결법**: LangSmith 또는 자체 로깅으로 각 실행 비용을 반드시 추적

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- "LangChain 에이전트 만들기 Python 한국어 2026"
- "CrewAI multi-agent tutorial 2026"
- "AI agent building with Claude LangChain"
- "CrewAI 멀티 에이전트 시스템 구축 실습"

---

## 📚 참고 자료

- [LangChain 공식 문서](https://python.langchain.com/docs/get_started/introduction)
- [CrewAI 공식 문서](https://docs.crewai.com)
- [Anthropic Claude API 문서](https://docs.anthropic.com/en/api/getting-started)

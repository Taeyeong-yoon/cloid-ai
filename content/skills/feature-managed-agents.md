---
title: Managed Agents — 인프라 없이 Claude 에이전트 클라우드 배포
category: features
tags: [Managed Agents, 에이전트, 클라우드, 배포, MCP, Webhooks]
difficulty: advanced
summary: Anthropic 클라우드에서 Claude 에이전트를 직접 호스팅. 서버·인프라 없이 배포하고 Dreams 메모리·Webhooks·MCP Tunnels까지 한 번에 사용합니다.
updated: 2026-05-31
---

## 무엇인가?

Managed Agents는 Claude 에이전트를 Anthropic 인프라에서 직접 호스팅하는 서비스입니다. 서버를 직접 구축하지 않아도 에이전트를 배포·실행·확장할 수 있습니다.

**출시 타임라인**
- **2025년 4월 8일** — GA 출시 (클라우드 호스팅 기본 기능)
- **4월 21~23일** — Dreams(메모리 자가개선) + Memory 기능 추가
- **5월 7일** — Webhooks + Multiagent Orchestration 추가
- **5월 19일** — MCP Tunnels + Self-hosted Sandboxes 추가

## 핵심 기능

### 클라우드 호스팅 배포
서버 없이 에이전트를 배포합니다. Anthropic이 스케일·가용성·보안을 관리합니다.

```python
import anthropic

client = anthropic.Anthropic()

# Managed Agent 생성
agent = client.managed_agents.create(
    name="my-research-agent",
    model="claude-opus-4-8",
    system="당신은 리서치 전문 에이전트입니다.",
    tools=[{"type": "web_search"}, {"type": "computer_use"}],
)

print(agent.id)  # agent_01XYZ...
```

### Dreams — 메모리 자가개선

에이전트가 작업 중 학습한 내용을 자동으로 메모리에 반영합니다. 다음 실행 때 이전 경험을 활용합니다.

```python
# Dreams 활성화
agent = client.managed_agents.create(
    name="learning-agent",
    model="claude-opus-4-8",
    memory={"type": "dreams", "auto_consolidate": True},
    system="작업할 때마다 배운 점을 정리해서 다음에 더 잘 활용하세요.",
)
```

### Webhooks — 이벤트 기반 트리거

에이전트가 완료되면 지정한 URL로 결과를 전송합니다. 비동기 파이프라인 구성에 적합합니다.

```python
# Webhook으로 실행 결과 수신
run = client.managed_agents.runs.create(
    agent_id=agent.id,
    input="최신 AI 뉴스 요약해줘",
    webhook={
        "url": "https://your-app.com/api/agent-callback",
        "secret": "your-webhook-secret",
    }
)
```

### Multiagent Orchestration

여러 Managed Agent가 서로 역할을 나눠 협력합니다.

```
오케스트레이터 Agent
    ├─ 리서치 Agent  (웹 검색 담당)
    ├─ 분석 Agent   (데이터 처리 담당)
    └─ 작성 Agent   (보고서 작성 담당)
```

```python
# 오케스트레이터가 서브에이전트에 작업 위임
orchestrator = client.managed_agents.create(
    name="orchestrator",
    model="claude-opus-4-8",
    sub_agents=["agent_research_id", "agent_writer_id"],
    system="복잡한 작업을 서브에이전트에 위임하고 결과를 통합하세요.",
)
```

### MCP Tunnels — 로컬 도구를 클라우드 에이전트에 연결

로컬 서버·사내 시스템을 Managed Agent에 안전하게 연결합니다. 외부 노출 없이 내부 MCP 서버 사용이 가능합니다.

```bash
# 로컬 MCP 서버를 Managed Agent에 터널로 연결
npx @anthropic-ai/mcp-tunnel --agent-id agent_01XYZ --local-port 3001
```

### Self-hosted Sandboxes

코드 실행 환경을 직접 제공합니다. 기본 Anthropic 샌드박스 대신 자체 Docker 환경을 연결합니다.

```python
agent = client.managed_agents.create(
    name="code-agent",
    model="claude-opus-4-8",
    sandbox={
        "type": "self_hosted",
        "url": "https://your-sandbox.internal:8080",
        "auth": {"token": "sandbox-token"},
    },
)
```

## 언제 쓸까?

| 상황 | 추천 여부 |
|------|---------|
| 서버 관리 없이 에이전트 배포 | ✅ 최적 |
| 장기 실행(수십 분 이상) 에이전트 | ✅ 최적 |
| 사내 시스템 연결 필요 | ✅ MCP Tunnels 활용 |
| 단순 단발성 API 호출 | ❌ 일반 Messages API로 충분 |
| 로컬 개발·테스트 | ❌ SDK 직접 사용이 빠름 |

## 팁

- Dreams 메모리는 에이전트 재실행 시 이전 결과를 반영하므로 반복 작업 효율이 높아집니다
- Webhook을 쓰면 장시간 실행 에이전트를 폴링하지 않아도 됩니다
- MCP Tunnels는 VPN 없이 사내 도구를 연결할 때 유용합니다

---
title: Slack Bot + Claude — 팀 채널에 AI 팀원 추가하기
category: usecases
tags: [Slack, Bot, 팀 협업, API]
difficulty: intermediate
summary: Slack 채널에 Claude 봇을 추가하면 팀원이 @Claude로 멘션해서 질문·요약·번역을 바로 요청할 수 있습니다.
updated: 2026-03-21
---

## 구성도

```
Slack 채널 @Claude 멘션
        ↓
Slack Bot (Webhook 수신)
        ↓
Claude API 호출
        ↓
Slack 채널에 응답 게시
```

## 빠른 설정

### 1. Slack App 생성

Slack API 사이트에서 앱 생성 후:
- **Event Subscriptions**: `app_mention` 이벤트 구독
- **Bot Token Scopes**: `chat:write`, `channels:history`

### 2. FastAPI 서버

```python
from fastapi import FastAPI, Request
import anthropic
import httpx
import os

app = FastAPI()
claude = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
SLACK_TOKEN = os.environ["SLACK_BOT_TOKEN"]

@app.post("/slack/events")
async def slack_events(request: Request):
    body = await request.json()

    # Slack 인증
    if body.get("type") == "url_verification":
        return {"challenge": body["challenge"]}

    event = body.get("event", {})
    if event.get("type") != "app_mention":
        return {"ok": True}

    # 봇 자신의 메시지 무시
    if event.get("bot_id"):
        return {"ok": True}

    user_text = event.get("text", "").replace("<@", "").split(">", 1)[-1].strip()
    channel = event["channel"]
    thread_ts = event.get("thread_ts") or event.get("ts")

    # Claude API 호출
    response = claude.messages.create(
        model="claude-haiku-4-5-20251001",  # 빠른 응답용
        max_tokens=1000,
        system="당신은 팀의 AI 어시스턴트입니다. 간결하고 도움이 되는 답변을 해주세요.",
        messages=[{"role": "user", "content": user_text}]
    )

    reply = response.content[0].text

    # Slack에 답변 게시 (스레드로)
    async with httpx.AsyncClient() as client:
        await client.post(
            "https://slack.com/api/chat.postMessage",
            headers={"Authorization": f"Bearer {SLACK_TOKEN}"},
            json={
                "channel": channel,
                "thread_ts": thread_ts,
                "text": reply
            }
        )

    return {"ok": True}
```

### 3. 배포 & 연결

```bash
# Railway, Render, 또는 EC2에 배포
# Slack App의 Event Subscriptions URL에 배포 URL 입력
# https://your-server.com/slack/events
```

## 팀 활용 패턴

### 미팅 노트 요약
```
@Claude 이 미팅 노트 요약해줘: [긴 텍스트 붙여넣기]
```

### 번역
```
@Claude 영어로 번역해줘: 안녕하세요, 이번 주 배포 일정을 공유드립니다.
```

### 기술 Q&A
```
@Claude Python의 asyncio와 threading의 차이가 뭐야?
```

## 고급 기능 추가

### 채널 컨텍스트 유지 (대화 히스토리)
```python
# 스레드의 이전 메시지들을 가져와서 컨텍스트로 전달
messages_history = get_thread_messages(channel, thread_ts)
```

### 특정 채널별 다른 페르소나
```python
CHANNEL_PERSONAS = {
    "C1234TECH": "당신은 시니어 개발자입니다.",
    "C5678MKT": "당신은 마케팅 전문가입니다.",
}
```

## 비용 팁

- 일반 Q&A는 Haiku (빠르고 저렴)
- 복잡한 분석 요청은 "상세히 분석해줘" 키워드 감지 시 Sonnet으로 자동 전환

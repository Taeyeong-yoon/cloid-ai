---
title: 텔레그램으로 Claude Code 원격 실행하기
category: usecases
tags: [텔레그램, Claude Code, 원격, 자동화]
difficulty: intermediate
summary: 2025년 3월 Anthropic이 공식 발표한 기능. 텔레그램 봇을 통해 스마트폰으로 Claude Code에 명령을 내리고 결과를 받습니다.
updated: 2026-03-21
---

## 배경

2025년 3월 Anthropic이 Claude Code의 원격 실행 기능을 발표했습니다. 텔레그램 봇과 연동하면 스마트폰으로 서버나 로컬 PC의 Claude Code에 명령을 내릴 수 있습니다.

외출 중에도 "배포해줘", "에러 고쳐줘"를 텔레그램으로 보내면 Claude Code가 실제로 코드를 수정하고 결과를 전송합니다.

## 동작 원리

```
[스마트폰 텔레그램] → 메시지 전송
        ↓
[텔레그램 봇 서버] → 명령 파싱
        ↓
[Claude Code CLI] → 실제 코드 실행
        ↓
[텔레그램으로 결과 전송] → 스마트폰 수신
```

## 설정 방법

### 1. 텔레그램 봇 생성

BotFather에서 봇 생성 후 토큰 발급:
```
/start → /newbot → 봇 이름 입력 → 토큰 복사
```

### 2. Claude Code 연동 스크립트

```python
import asyncio
from telegram import Update
from telegram.ext import Application, MessageHandler, filters
import subprocess

TELEGRAM_TOKEN = "your-bot-token"
ALLOWED_USER_ID = 123456789  # 본인 텔레그램 ID

async def handle_message(update: Update, context):
    if update.effective_user.id != ALLOWED_USER_ID:
        return

    command = update.message.text

    # Claude Code 실행
    result = subprocess.run(
        ["claude", "-p", command, "--output-format", "text"],
        capture_output=True, text=True, cwd="/your/project"
    )

    await update.message.reply_text(
        result.stdout[:4000] or result.stderr[:4000]
    )

app = Application.builder().token(TELEGRAM_TOKEN).build()
app.add_handler(MessageHandler(filters.TEXT, handle_message))
app.run_polling()
```

### 3. 백그라운드 실행

```bash
# PM2로 상시 실행
pm2 start telegram_claude.py --interpreter python3
pm2 save
```

## 활용 예시 대화

```
나: 현재 프로젝트에서 TODO 주석 달린 부분 다 찾아줘
Claude: [파일 목록과 라인 번호 전송]

나: src/api.py 247번 라인 버그 수정해줘
Claude: [수정 완료, diff 전송]

나: 지금 배포 가능한 상태인지 테스트 돌려봐
Claude: [테스트 결과 전송]
```

## 보안 주의사항

- 반드시 `ALLOWED_USER_ID` 화이트리스트 설정
- 민감한 명령(rm, 배포 등)은 확인 단계 추가 권장
- 봇 토큰을 절대 공개 저장소에 올리지 마세요

---
title: "OpenClaw 완전 정복 — Claude + 텔레그램으로 나만의 AI 비서 만들기"
tags: ["OpenClaw","Claude","Telegram","AI 에이전트","자동화"]
difficulty: "intermediate"
summary: "220,000+ GitHub 스타를 기록한 오픈소스 AI 에이전트 OpenClaw를 설치하고, Claude와 텔레그램을 연동해 24시간 나만의 AI 비서를 운영하는 방법"
steps: [{"title":"Install OpenClaw","description":"Set up OpenClaw on your local machine.","action":"Run the command 'npm install -g openclaw' to install OpenClaw.","codeSnippet":"npm install -g openclaw","expectedResult":"OpenClaw is installed successfully without errors.","failureHint":"Ensure Node.js 20+ is installed and try again."},{"title":"Configure OpenClaw","description":"Complete the onboarding process for OpenClaw.","action":"Execute 'openclaw onboard --install-daemon' and follow the prompts.","codeSnippet":"openclaw onboard --install-daemon","expectedResult":"Onboarding completes and a local server is set up.","failureHint":"Check for any error messages during onboarding and resolve them."},{"title":"Create Telegram Bot","description":"Set up a new Telegram bot using BotFather.","action":"Chat with @BotFather on Telegram and create a new bot to obtain the API token.","expectedResult":"You receive an HTTP API token for your new bot.","failureHint":"If you encounter issues, ensure you followed the steps correctly with BotFather."},{"title":"Connect OpenClaw to Telegram","description":"Link your Telegram bot to OpenClaw.","action":"Run 'openclaw config set telegram.token YOUR_BOT_TOKEN' to set your bot token.","codeSnippet":"openclaw config set telegram.token YOUR_BOT_TOKEN","expectedResult":"The Telegram token is set successfully in OpenClaw.","failureHint":"Double-check that you copied the token correctly from BotFather."},{"title":"Start OpenClaw","description":"Run OpenClaw in the background as a daemon.","action":"Execute 'openclaw start --daemon' to start the process.","codeSnippet":"openclaw start --daemon","expectedResult":"OpenClaw is running in the background and ready to respond to Telegram messages.","failureHint":"If it fails to start, check your configuration and logs for errors."}]
---

## 🎯 학습 목표

1. OpenClaw의 작동 원리와 아키텍처를 이해한다
2. Claude API + 텔레그램 봇을 연동해 로컬에서 OpenClaw를 실행한다
3. ClawHub에서 스킬을 설치해 에이전트 기능을 확장한다

---

## 📖 OpenClaw란?

OpenClaw는 2026년 초 가장 핫한 오픈소스 AI 에이전트 프레임워크입니다.
LLM(Claude, GPT 등)을 단순 챗봇이 아닌 **지속 메모리 + 자율 행동**이 가능한 에이전트로 만들어줍니다.

**핵심 특징:**
- **지속 메모리**: 대화 내용을 마크다운 파일로 디스크에 저장 → 재시작 후에도 기억
- **멀티 채널**: 텔레그램, WhatsApp, Discord, Slack, iMessage 지원
- **스킬 시스템**: ClawHub에서 2,800+ 스킬 설치로 기능 무한 확장
- **자율 실행**: 쉘 명령어, 파일 접근, 웹 브라우저, 이메일/캘린더 제어

> ⚠️ 주의: Claude Pro/Max 구독 토큰을 사용하면 Anthropic ToS 위반으로 계정 정지될 수 있습니다.
> 반드시 **pay-as-you-go API 키**를 사용하세요.

---

## 🛠️ 실습 1 — OpenClaw 설치 및 초기 설정

### 설치

```bash
# Node.js 20+ 필요
npm install -g openclaw

# 온보딩 위저드 실행 (모든 설정을 단계별로 안내)
openclaw onboard --install-daemon
```

### 온보딩 단계

1. **Gateway 설정** — 로컬 서버 포트 설정
2. **LLM 프로바이더 선택** — Anthropic(Claude) 선택 후 API 키 입력
3. **채널 선택** — Telegram 선택 (가장 간단하고 기능이 풍부함)
4. **텔레그램 봇 토큰 입력** — BotFather에서 생성한 토큰 붙여넣기
5. **워크스페이스 초기화** — 메모리/스킬 폴더 자동 생성

---

## 🛠️ 실습 2 — 텔레그램 봇 생성 및 연동

### BotFather로 봇 만들기

1. 텔레그램에서 `@BotFather` 검색 → 대화 시작
2. `/newbot` 입력
3. 봇 이름 설정 (예: `My Claude Assistant`)
4. 봇 username 설정 (예: `my_claude_bot`)
5. 발급받은 **HTTP API 토큰** 복사

### OpenClaw에 연동

```bash
# 토큰을 직접 설정하거나 온보딩 시 입력
openclaw config set telegram.token YOUR_BOT_TOKEN

# 데몬으로 백그라운드 실행
openclaw start --daemon
```

텔레그램에서 내 봇에게 메시지를 보내면 Claude가 응답합니다.

---

## 🛠️ 실습 3 — ClawHub 스킬 설치로 기능 확장

ClawHub는 OpenClaw의 스킬 마켓플레이스입니다 (npm과 같은 개념).

```bash
# 스킬 검색
openclaw skills search "calendar"

# 구글 캘린더 스킬 설치
openclaw skills install google-calendar

# 파일 관리 스킬 설치
openclaw skills install file-manager

# 설치된 스킬 목록
openclaw skills list
```

### 추천 초기 스킬

| 스킬 | 기능 |
|------|------|
| `memory-enhanced` | 대화 요약 자동 저장 |
| `web-search` | 실시간 웹 검색 |
| `google-calendar` | 일정 조회/추가 |
| `file-manager` | 파일 읽기/쓰기 |
| `daily-briefing` | 매일 아침 브리핑 자동 발송 |

---

## 💬 프롬프트 템플릿

### 1. 기본 지시 (텔레그램에서 보내는 메시지)
```
오늘 할 일 목록을 정리해줘. 우선순위 순으로 보여줘.
```

### 2. 파일 작업 위임
```
~/Documents/report.md 파일을 읽고 핵심 내용 3줄로 요약해줘
```

### 3. 자동화 스케줄 설정
```
매일 오전 9시에 오늘의 날씨와 캘린더 일정을 텔레그램으로 보내줘
```

### 4. 코드 실행 위임
```
터미널에서 git status 실행하고 변경사항 있으면 나한테 알려줘
```

### 5. 메모리 활용
```
지난주에 우리가 논의한 프로젝트 계획 기억해? 요약해줘
```

---

## 🎯 도전 과제

Claude Code와 OpenClaw를 연동해서, 텔레그램으로 "이 버그 고쳐줘"라고 보내면 Claude Code가 자동으로 PR을 생성하는 워크플로를 구성해보세요.

---

## ⚠️ 자주 하는 실수 3가지

1. **Claude Pro 토큰 사용**: API 키가 아닌 구독 계정 토큰을 사용하면 계정이 정지됩니다. 반드시 `platform.anthropic.com`에서 발급한 API 키를 사용하세요.

2. **ClawHub 악성 스킬 주의**: 2026년 1월 ClawHub에서 1,184개의 악성 스킬이 발견되었습니다. 다운로드 수와 리뷰가 많은 검증된 스킬만 설치하세요.

3. **보안 설정 미흡**: OpenClaw는 쉘 명령어와 파일에 접근할 수 있으므로, 공용 서버에 배포 시 반드시 인증 설정을 하고 외부 접근을 차단하세요.

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- OpenClaw 설치 Claude 텔레그램 연동 한국어 2026
- OpenClaw tutorial setup Telegram Claude complete guide 2026

---

## 📚 참고 자료

- [OpenClaw 공식 GitHub](https://github.com/openclaw/openclaw)
- [OpenClaw 공식 문서](https://docs.openclaw.ai)
- [텔레그램 설정 가이드](https://docs.openclaw.ai/channels/telegram)
- [ClawHub 스킬 마켓플레이스](https://clawhub.ai)
- [OpenClaw 완전 가이드 2026 — Towards AI](https://pub.towardsai.net/openclaw-complete-guide-setup-tutorial-2026-14dd1ae6d1c2)

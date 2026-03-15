---
title: "OpenClaw 스킬 개발 — 나만의 AI 에이전트 능력 만들기"
tags: ["OpenClaw","스킬 개발","AI 에이전트","자동화","ClawHub"]
difficulty: "advanced"
summary: "OpenClaw 커스텀 스킬을 마크다운으로 직접 작성하고, ClawHub에 배포하는 고급 에이전트 개발 과정"
steps: [{"title":"Understand OpenClaw Skill Structure","description":"Learn the basic structure and components of an OpenClaw skill.","action":"Review the provided markdown structure of an OpenClaw skill and identify each component.","expectedResult":"You can explain the purpose of each section in the skill structure.","failureHint":"Revisit the 'OpenClaw Skill Structure' section for clarification."},{"title":"Create a Custom Skill","description":"Write your own OpenClaw skill using markdown.","action":"Draft a markdown file for a skill that provides daily briefings in Korean.","codeSnippet":"Copy the provided 'daily-briefing-ko' markdown structure and modify it as needed.","expectedResult":"You have a markdown file ready for your custom skill.","failureHint":"Ensure you follow the markdown format exactly as shown in the example."},{"title":"Install the Skill Locally","description":"Add your custom skill to your local OpenClaw workspace.","action":"Run the command to copy your skill file into the OpenClaw skills directory.","codeSnippet":"cp daily-briefing-ko.md ~/.openclaw/skills/","expectedResult":"Your skill is successfully added to the local skills list.","failureHint":"Check the file path and ensure the command was entered correctly."},{"title":"Test the Skill","description":"Run your custom skill to verify it works as intended.","action":"Execute the command to run your skill immediately.","codeSnippet":"openclaw skills run daily-briefing-ko","expectedResult":"Your skill runs without errors and produces the expected output.","failureHint":"Review the skill's markdown for errors if it does not run correctly."},{"title":"Publish the Skill to ClawHub","description":"Deploy your skill to the ClawHub for others to use.","action":"Login to ClawHub and publish your skill with the necessary parameters.","codeSnippet":"openclaw hub publish daily-briefing-ko.md --category 'productivity' --language 'ko' --tags 'calendar,briefing,korean'","expectedResult":"Your skill is successfully published and available on ClawHub.","failureHint":"Ensure you have a ClawHub account and that you are logged in before publishing."}]
---

## 🎯 학습 목표

1. OpenClaw 스킬의 구조와 작동 원리를 이해한다
2. 마크다운으로 커스텀 스킬을 직접 작성한다
3. 로컬에서 스킬을 테스트하고 ClawHub에 배포한다

---

## 📖 OpenClaw 스킬이란?

OpenClaw 스킬은 에이전트의 행동 지침을 담은 **마크다운 파일**입니다.
스킬은 에이전트에게 "이런 상황에서는 이렇게 행동해라"라는 프로토콜을 정의합니다.

**스킬 파일 구조:**

```markdown
---
name: skill-name
description: 스킬 설명
triggers: ["키워드1", "키워드2"]
permissions: ["shell", "files"]  # 필요한 권한
---

## 프로토콜

[에이전트가 따를 행동 지침]
```

---

## 🛠️ 실습 1 — 커스텀 스킬 작성

### 일일 업무 브리핑 스킬 만들기

```markdown
---
name: daily-briefing-ko
description: 매일 아침 한국어로 업무 브리핑을 제공하는 스킬
triggers: ["브리핑", "오늘 일정", "아침 보고"]
permissions: ["calendar", "files", "shell"]
schedule: "0 9 * * 1-5"  # 평일 오전 9시
---

## 프로토콜

매일 오전 9시(평일)에 다음을 수행한다:

1. 오늘의 캘린더 일정을 조회한다
2. ~/tasks/today.md 파일이 있으면 할 일 목록을 읽는다
3. 어제의 메모리에서 미완료 항목을 확인한다
4. 다음 형식으로 텔레그램에 메시지를 보낸다:

**형식:**
📅 [날짜] 업무 브리핑

📌 오늘 일정:
- [일정 목록]

✅ 오늘 할 일:
- [할 일 목록]

⏳ 어제 미완료:
- [미완료 항목]
```

### 스킬 로컬 설치

```bash
# 스킬 파일을 로컬 워크스페이스에 추가
cp daily-briefing-ko.md ~/.openclaw/skills/

# 스킬 로드 확인
openclaw skills list

# 즉시 실행 테스트
openclaw skills run daily-briefing-ko
```

---

## 🛠️ 실습 2 — 보안 강화 스킬 (Secure Skill)

ClawHub 악성 스킬 사건 이후 보안이 중요해졌습니다.
권한을 최소화한 안전한 스킬을 작성합니다.

```markdown
---
name: safe-web-summary
description: URL을 받아 웹 페이지 내용을 요약하는 안전한 스킬
triggers: ["요약해줘", "내용 정리", "링크 요약"]
permissions: ["web:read"]  # 읽기 전용, shell/files 권한 없음
sandbox: true              # 샌드박스 모드 실행
---

## 프로토콜

1. 사용자가 URL을 제공하면 웹 페이지 내용을 fetch한다
2. 메인 텍스트 콘텐츠만 추출한다 (스크립트, 광고 제외)
3. 한국어로 3-5문장 요약을 제공한다
4. 원본 URL을 참고 링크로 포함한다

**제한사항:**
- 로그인이 필요한 페이지는 처리하지 않는다
- 파일 다운로드 링크는 실행하지 않는다
- 개인 정보가 포함된 내용은 저장하지 않는다
```

---

## 🛠️ 실습 3 — ClawHub 배포

```bash
# ClawHub 계정 로그인
openclaw hub login

# 스킬 검증 (배포 전 필수)
openclaw skills validate daily-briefing-ko.md

# ClawHub에 배포
openclaw hub publish daily-briefing-ko.md \
  --category "productivity" \
  --language "ko" \
  --tags "calendar,briefing,korean"

# 배포된 스킬 확인
openclaw hub info daily-briefing-ko
```

---

## 💬 프롬프트 템플릿

### 1. 스킬 아이디어 생성
```
OpenClaw 스킬을 만들려고 해. 매일 GitHub Issues를 체크해서
담당자가 나인 이슈가 있으면 텔레그램으로 알림을 보내주는 스킬이야.
스킬 마크다운 파일을 작성해줘.
```

### 2. 기존 스킬 개선
```
이 OpenClaw 스킬을 보안 관점에서 검토해줘.
불필요한 권한이 있으면 제거하고,
prompt injection 취약점이 있으면 수정해줘.

[스킬 내용 붙여넣기]
```

### 3. 스킬 디버깅
```
이 OpenClaw 스킬이 예상대로 동작하지 않아.
triggers가 제대로 인식되지 않는 것 같은데
문제가 뭔지 분석하고 수정해줘.

[스킬 내용 붙여넣기]
```

### 4. 멀티 스킬 워크플로
```
다음 3개 스킬이 순서대로 실행되는 워크플로를 설계해줘:
1. 매일 오전 8시 뉴스 수집
2. AI로 핵심 내용 요약
3. 텔레그램으로 브리핑 발송
```

---

## 🎯 도전 과제

Claude Code의 에이전트 모드와 OpenClaw를 연동하는 스킬을 만들어보세요.
텔레그램에서 "PR 리뷰해줘 [GitHub URL]"라고 보내면
OpenClaw가 Claude Code를 실행해서 코드를 분석하고 리뷰 결과를 돌려주는 자동화를 구성하세요.

---

## ⚠️ 자주 하는 실수 3가지

1. **과도한 권한 부여**: `permissions: ["shell", "files", "web", "calendar"]` 처럼 모든 권한을 주면 보안 위험이 큽니다. 스킬에 꼭 필요한 최소 권한만 설정하세요.

2. **트리거 키워드 충돌**: 여러 스킬의 트리거 키워드가 겹치면 의도하지 않은 스킬이 실행됩니다. 스킬별로 고유한 트리거를 설정하세요.

3. **ClawHub 스킬 무검증 설치**: 2026년 1월 1,184개 악성 스킬 사건처럼 ClawHub에도 악성 스킬이 있습니다. 설치 전 소스 코드를 반드시 확인하고, `sandbox: true` 옵션으로 테스트하세요.

---

## 📺 추천 영상 (아래 키워드로 유튜브 검색)

- OpenClaw 커스텀 스킬 만들기 ClawHub 배포 한국어 2026
- OpenClaw skills development tutorial ClawHub publish 2026

---

## 📚 참고 자료

- [OpenClaw 공식 GitHub](https://github.com/openclaw/openclaw)
- [ClawHub 스킬 마켓플레이스](https://clawhub.ai)
- [OpenClaw 보안 가이드](https://nebius.com/blog/posts/openclaw-security)
- [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills)

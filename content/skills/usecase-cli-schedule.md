---
title: CLI 예약으로 Claude 작업 자동 스케줄링
category: usecases
tags: [CLI, 크론, 예약, 자동화, Claude Code]
difficulty: intermediate
summary: Claude Code CLI와 cron(크론)을 결합해서 매일 아침 리포트 생성, 주간 코드 리뷰 등을 완전 자동화합니다.
updated: 2026-03-21
---

## 개념

Claude Code CLI(`claude`)를 크론 스케줄러와 조합하면 사람이 개입 없이 반복 작업을 자동화할 수 있습니다.

```
매일 오전 9시 → cron 실행 → claude CLI 호출 → 결과 저장/전송
```

## 기본 Claude Code CLI 사용법

```bash
# 단일 명령 실행 (--print: 응답만 출력 후 종료)
claude -p "README.md 파일을 검토하고 개선사항을 알려줘" --output-format text

# 특정 디렉토리에서 실행
claude -p "이 프로젝트의 보안 취약점을 점검해줘" \
  --output-format text \
  --cwd /path/to/project
```

## 자동화 스크립트 예시

### 매일 아침 코드 품질 리포트

```bash
#!/bin/bash
# daily_review.sh

PROJECT_DIR="/home/user/myproject"
REPORT_DIR="/home/user/reports"
DATE=$(date +%Y-%m-%d)

cd "$PROJECT_DIR"

# Claude Code로 리포트 생성
claude -p "
오늘 날짜: $DATE
이 프로젝트의 코드를 점검하고 다음을 보고해줘:
1. 지난 24시간 동안 변경된 파일 (git diff)
2. 잠재적 버그나 개선사항
3. 테스트 커버리지 현황
마크다운 형식으로 작성해줘.
" \
  --output-format text \
  > "$REPORT_DIR/report-$DATE.md"

echo "리포트 생성 완료: $REPORT_DIR/report-$DATE.md"
```

### cron 등록

```bash
# crontab -e 로 편집
# 매일 오전 9시 실행
0 9 * * * /home/user/scripts/daily_review.sh >> /home/user/logs/cron.log 2>&1

# 매주 월요일 오전 8시 주간 리포트
0 8 * * 1 /home/user/scripts/weekly_review.sh >> /home/user/logs/cron.log 2>&1
```

## 실용 자동화 예시들

### 매일 의존성 취약점 점검
```bash
claude -p "package.json을 분석해서 보안 취약점이 있는 패키지가 있는지 확인해줘. npm audit 결과도 포함해서." \
  --output-format text > security_check.md
```

### 주간 커밋 요약 → 이메일 전송
```bash
SUMMARY=$(claude -p "git log --oneline --since='7 days ago' 결과를 바탕으로 이번 주 개발 내용을 비개발자가 이해할 수 있게 요약해줘" --output-format text)

# sendmail이나 mailx로 전송
echo "$SUMMARY" | mail -s "주간 개발 요약" team@company.com
```

### 환경별 배포 후 자동 테스트
```bash
# 배포 스크립트 끝에 추가
claude -p "배포가 완료됐어. API 엔드포인트들이 정상 동작하는지 테스트하고 결과 알려줘." \
  --output-format text | slack-notify "#deployments"
```

## Windows에서는 (작업 스케줄러)

```powershell
# 작업 스케줄러 등록
schtasks /create /tn "ClaudeDailyReview" /tr "bash daily_review.sh" /sc daily /st 09:00
```

## 팁

- `--output-format json`으로 파싱하기 쉬운 구조로 받기
- 에러 시 Slack/텔레그램으로 알림 보내도록 예외 처리 추가
- 중요한 자동화는 dry-run 단계 먼저 테스트

---
title: n8n + Claude — 노코드로 AI 자동화 파이프라인 만들기
category: usecases
tags: [n8n, 노코드, 자동화, 워크플로우]
difficulty: beginner
summary: n8n의 Claude 노드를 사용해 코드 없이 이메일 자동 분류, SNS 모니터링, 보고서 자동화 파이프라인을 구축합니다.
updated: 2026-03-21
---

## n8n + Claude 조합의 장점

- **코드 불필요**: 드래그&드롭으로 자동화 구축
- **300+ 연동**: Gmail, Slack, Notion, Google Sheets, Telegram 등
- **Claude 노드 기본 제공**: API 키만 입력하면 즉시 사용
- **자체 호스팅 가능**: 데이터 외부 유출 없이 사내 운영

## 실전 워크플로우 3가지

### 1. 이메일 자동 분류 + 요약

```
Gmail 트리거 (새 이메일)
    → Claude (분류: 긴급/일반/스팸 + 3줄 요약)
    → 조건 분기
        → 긴급: Slack #urgent 알림
        → 일반: Notion DB에 저장
        → 스팸: 자동 삭제
```

Claude 노드 프롬프트:
```
다음 이메일을 분류하고 요약해줘.

분류: 긴급 / 일반 / 스팸 (하나만 선택)
요약: 3줄 이내

이메일 내용:
{{$json.body}}

JSON 형식으로 응답:
{"category": "긴급", "summary": "요약 내용"}
```

### 2. YouTube → 블로그 자동화

```
RSS 트리거 (채널 새 영상)
    → HTTP Request (자막 가져오기)
    → Claude (블로그 포스트 초안 작성)
    → Google Docs에 저장
    → Slack에 "검토 요청" 알림
```

### 3. 고객 리뷰 감성 분석

```
Google Sheets 트리거 (새 리뷰 행)
    → Claude (감성 분석: 긍정/부정/중립 + 개선점 추출)
    → Google Sheets 업데이트 (분석 결과 컬럼)
    → 부정 리뷰 → 담당자 이메일 알림
```

## Claude 노드 설정

1. n8n 워크플로우 에디터 → **+ 노드 추가** → "Anthropic" 검색
2. Credentials: Anthropic API Key 입력
3. Model: `claude-haiku-4-5-20251001` (자동화에 권장, 빠르고 저렴)
4. Messages: 프롬프트 작성

## JSON 출력 받기

자동화에서는 구조화된 데이터가 필요합니다:

```
다음 텍스트를 분석하고 반드시 아래 JSON 형식으로만 응답해:
{
  "sentiment": "긍정/부정/중립",
  "score": 0-10,
  "keywords": ["키워드1", "키워드2"],
  "summary": "한 줄 요약"
}

텍스트: {{$json.review_text}}
```

## n8n 설치 (로컬)

```bash
# Docker로 즉시 실행
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# 접속: http://localhost:5678
```

## 비용 최적화 팁

- 단순 분류·요약 → Haiku (Sonnet 대비 5배 저렴)
- n8n의 Error Workflow로 API 실패 시 재시도 자동화
- 배치 처리: 실시간 대신 1시간마다 모아서 처리하면 비용 절감

---
title: MCP 서버 연결 — Claude의 눈과 손을 확장하기
category: usecases
tags: [MCP, 도구 연결, 확장, 파일시스템, 데이터베이스]
difficulty: intermediate
summary: MCP(Model Context Protocol)로 Claude에게 파일시스템·데이터베이스·외부 API 접근 권한을 줍니다. Claude가 직접 읽고 쓰고 실행합니다.
updated: 2026-03-21
---

## MCP가 뭔가요?

MCP는 Claude가 외부 도구와 데이터에 접근할 수 있게 해주는 표준 프로토콜입니다. MCP 서버를 연결하면 Claude가 단순 텍스트 생성을 넘어 **실제 작업을 수행**합니다.

## 인기 MCP 서버들

| MCP 서버 | 역할 |
|----------|------|
| `filesystem` | 로컬 파일 읽기/쓰기/검색 |
| `sqlite` | SQLite DB 직접 쿼리 |
| `postgres` | PostgreSQL 연결 |
| `github` | 레포 파일·이슈·PR 관리 |
| `notion` | 노션 페이지 읽기/쓰기 |
| `slack` | 슬랙 메시지·채널 접근 |
| `google-maps` | 지도·경로·장소 검색 |
| `puppeteer` | 웹 브라우저 자동화 |

## 설정 방법 (Claude Desktop)

`~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
`%APPDATA%\Claude\claude_desktop_config.json` (Windows)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents",
        "/Users/yourname/Projects"
      ]
    },
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "--db-path",
        "/Users/yourname/data/mydb.sqlite"
      ]
    }
  }
}
```

## 실전 활용 예시

### 파일시스템 MCP — 프로젝트 분석
```
Claude야, /Projects/myapp 폴더를 분석해서
사용하지 않는 import 구문이 있는 파일을 찾아줘.
```
→ Claude가 직접 파일을 열어 분석 후 결과 제공

### SQLite MCP — 데이터 분석
```
지난 달 판매 데이터에서 환불율이 가장 높은 제품 카테고리 Top 5를 뽑아줘.
```
→ Claude가 SQL 작성 후 직접 실행, 결과 분석

### GitHub MCP — 이슈 관리
```
이번 주 생성된 이슈 중 아직 담당자가 없는 것들을 나에게 할당해줘.
우선순위는 라벨 기준으로 정렬해서.
```

## Claude Code에서 MCP 사용

```bash
# claude_code에서 MCP 서버 추가
claude mcp add filesystem npx @modelcontextprotocol/server-filesystem ~/projects

# 사용 가능한 MCP 서버 확인
claude mcp list
```

## 주의사항

- 파일시스템 MCP는 지정한 경로만 접근 가능 — 최소 권한 원칙 적용
- 프로덕션 DB에 쓰기 권한 MCP 연결은 신중하게
- 민감한 데이터가 있는 경우 읽기 전용 접근 권한만 부여 권장

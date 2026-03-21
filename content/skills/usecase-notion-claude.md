---
title: Notion + Claude — 문서 자동 생성·업데이트
category: usecases
tags: [Notion, API, 문서 자동화, 생산성]
difficulty: intermediate
summary: Claude가 Notion 페이지를 읽고 새 내용을 작성하거나 기존 문서를 자동으로 업데이트합니다. 회의록, 주간 보고서, 지식베이스 자동화에 활용합니다.
updated: 2026-03-21
---

## 활용 시나리오

- 회의 메모 → Notion 페이지 자동 생성
- 슬랙 채널 요약 → Notion 주간 보고서
- 신규 이슈 → Notion 데이터베이스 자동 등록
- 블로그 초안 → Notion 페이지로 저장

## 기본 설정

### Notion API 키 발급
1. notion.so/my-integrations → New Integration
2. Integration 이름 입력 후 Submit
3. **Internal Integration Token** 복사
4. 연동할 Notion 페이지 → Share → Integration 추가

## 구현 코드

```python
import anthropic
from notion_client import Client
import os

claude = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
notion = Client(auth=os.environ["NOTION_API_KEY"])

def generate_meeting_notes(raw_notes: str) -> str:
    """회의 메모를 구조화된 형식으로 변환"""
    response = claude.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"""다음 회의 메모를 구조화해줘.

형식:
## 📋 회의 요약
(3줄 이내)

## ✅ 결정된 사항
- 항목별 리스트

## 📌 액션 아이템
- [ ] 담당자: 할 일 (마감일)

## 💬 다음 회의 안건

원본 메모:
{raw_notes}"""
        }]
    )
    return response.content[0].text

def create_notion_page(parent_page_id: str, title: str, content: str):
    """Notion에 새 페이지 생성"""

    # 마크다운을 Notion 블록으로 변환 (간단 버전)
    blocks = []
    for line in content.split('\n'):
        if line.startswith('## '):
            blocks.append({
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [{"type": "text", "text": {"content": line[3:]}}]
                }
            })
        elif line.startswith('- [ ]'):
            blocks.append({
                "object": "block",
                "type": "to_do",
                "to_do": {
                    "rich_text": [{"type": "text", "text": {"content": line[6:]}}],
                    "checked": False
                }
            })
        elif line.startswith('- '):
            blocks.append({
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": [{"type": "text", "text": {"content": line[2:]}}]
                }
            })
        elif line.strip():
            blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": line}}]
                }
            })

    page = notion.pages.create(
        parent={"type": "page_id", "page_id": parent_page_id},
        properties={
            "title": {
                "title": [{"type": "text", "text": {"content": title}}]
            }
        },
        children=blocks[:100]  # Notion API 블록 제한
    )
    return page["url"]

# 사용 예시
raw_notes = """
오늘 회의 - 2026년 3월 21일
참석자: 김철수, 이영희, 박민준

주요 논의사항:
- Q2 마케팅 예산 확정 필요
- 신제품 런칭 일정 5월로 확정
- 김철수가 랜딩페이지 디자인 담당
- 이영희가 SNS 콘텐츠 일정 다음주까지 제출
- 다음 회의 3월 28일
"""

structured = generate_meeting_notes(raw_notes)
url = create_notion_page(
    parent_page_id="your-page-id",
    title="회의록 - 2026-03-21",
    content=structured
)
print(f"Notion 페이지 생성 완료: {url}")
```

## CLOID.AI MCP로 더 간단하게

MCP Notion 서버를 연결하면 코드 없이 Claude에게 직접 요청:

```
Claude야, 방금 회의 내용을 Notion의 "2026 Q2" 페이지에 회의록으로 정리해줘.
[회의 내용 붙여넣기]
```

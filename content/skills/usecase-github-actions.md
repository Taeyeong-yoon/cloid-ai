---
title: GitHub Actions + Claude Code — PR 자동 리뷰
category: usecases
tags: [GitHub Actions, CI/CD, PR 리뷰, 자동화]
difficulty: advanced
summary: PR이 열릴 때마다 Claude Code가 자동으로 코드를 리뷰하고 GitHub 코멘트를 남깁니다. 팀 리뷰 부담을 줄이는 실전 패턴입니다.
updated: 2026-03-21
---

## 동작 원리

```
PR 오픈 → GitHub Actions 트리거
        → Claude Code API 호출 (diff 전달)
        → 리뷰 코멘트 생성
        → PR에 자동 코멘트 게시
```

## GitHub Actions 워크플로우

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get PR diff
        id: diff
        run: |
          git diff origin/${{ github.base_ref }}...HEAD > pr_diff.txt
          echo "diff_size=$(wc -c < pr_diff.txt)" >> $GITHUB_OUTPUT

      - name: Claude Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          pip install anthropic

          python3 << 'EOF'
          import anthropic
          import os

          with open("pr_diff.txt") as f:
              diff = f.read()[:30000]  # 토큰 제한

          client = anthropic.Anthropic()
          response = client.messages.create(
              model="claude-sonnet-4-6",
              max_tokens=2000,
              messages=[{
                  "role": "user",
                  "content": f"""다음 PR diff를 코드 리뷰해줘.

리뷰 항목:
1. 버그 가능성
2. 보안 취약점
3. 성능 이슈
4. 코드 스타일·가독성
5. 테스트 누락

마크다운 형식으로 작성. 심각도를 🔴(높음) 🟡(중간) 🟢(낮음)으로 표시.

```diff
{diff}
```"""
              }]
          )

          with open("review.md", "w") as f:
              f.write(response.content[0].text)
          EOF

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Claude Code Review\n\n${review}\n\n---\n*자동 리뷰 by Claude Sonnet*`
            });
```

## Secrets 설정

GitHub 레포 → Settings → Secrets → `ANTHROPIC_API_KEY` 추가

## 고급 패턴

### 특정 파일 타입만 리뷰
```yaml
- name: Filter Changed Files
  run: |
    git diff --name-only origin/${{ github.base_ref }}...HEAD \
      | grep -E '\.(py|ts|js)$' > changed_files.txt
```

### 심각한 이슈 발견 시 PR 블록
```python
# 🔴 항목이 있으면 exit code 1 반환
if "🔴" in review_text:
    print("심각한 이슈 발견 — PR 병합 차단")
    exit(1)
```

## 비용 최적화

- diff가 큰 PR은 `claude-haiku-4-5`로 1차 빠른 스캔 후 Sonnet으로 상세 리뷰
- 50줄 미만 변경은 자동 통과 처리
- 월 예산 설정: Anthropic 콘솔에서 Usage Limits 설정

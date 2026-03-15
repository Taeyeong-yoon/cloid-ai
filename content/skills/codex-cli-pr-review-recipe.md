---
steps: [{"title":"Get the Diff","description":"This step prepares the differences between the main branch and your feature branch for review.","action":"Run the command to create a diff file.","codeSnippet":"git diff main..feature-branch > pr_diff.txt","expectedResult":"A file named 'pr_diff.txt' containing the differences is created.","failureHint":"Ensure you are on the correct feature branch and that it is up to date with the main branch."},{"title":"Run Codex CLI Review","description":"This step uses Codex CLI to analyze the pull request diff for various issues.","action":"Execute the Codex CLI command to review the diff.","codeSnippet":"codex 'Review this pull request diff. Check for: 1. Security vulnerabilities (injection, auth bypass, exposed secrets) 2. Logic errors and edge cases 3. Code style inconsistencies 4. Performance issues 5. Missing error handling For each issue: severity (Critical/High/Medium/Low), location, and suggested fix.' --file pr_diff.txt","expectedResult":"Codex CLI processes the diff and returns a list of identified issues.","failureHint":"Check if Codex CLI is installed and properly configured."},{"title":"Save the Report","description":"This step saves the review findings into a structured markdown report.","action":"Run the command to generate and save the report.","codeSnippet":"codex 'Review this diff and output a structured markdown review report' --file pr_diff.txt > pr_review_report.md","expectedResult":"A markdown file named 'pr_review_report.md' is created with the review report.","failureHint":"Ensure the previous steps were successful and the diff file exists."}]
---
---
title: "Codex CLI: 3-Minute PR Review Recipe"
tags: ["Codex CLI", "PR Review", "Recipe"]
difficulty: "beginner"
summary: "A ready-to-use recipe for running a complete pull request review with Codex CLI in under 3 minutes"
---

## 🎯 Goal

Run a thorough code review on any pull request using Codex CLI — security check, logic review, and improvement suggestions — in a single terminal command.

---

## 📋 Recipe

### Step 1 — Get the diff

```bash
git diff main..feature-branch > pr_diff.txt
```

### Step 2 — Run Codex CLI review

```
codex 'Review this pull request diff. Check for:
1. Security vulnerabilities (injection, auth bypass, exposed secrets)
2. Logic errors and edge cases
3. Code style inconsistencies
4. Performance issues
5. Missing error handling

For each issue: severity (Critical/High/Medium/Low), location, and suggested fix.' --file pr_diff.txt
```

### Step 3 — Save the report

```bash
codex 'Review this diff and output a structured markdown review report' --file pr_diff.txt > pr_review_report.md
```

---

## 💡 Tips

- Add `--model gpt-4o` for more thorough reviews on complex PRs
- Pipe the output directly into a GitHub PR comment via the GitHub CLI: `gh pr comment 42 --body "$(cat pr_review_report.md)"`
- Run this as a pre-commit hook for automatic review before pushing

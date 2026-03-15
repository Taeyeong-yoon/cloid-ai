---
title: 'Claude Code: Find and Fix Bugs in 5 Minutes'
tags:
  - Claude Code
  - Bug Fix
  - Recipe
difficulty: beginner
summary: >-
  A step-by-step recipe for using Claude Code to locate, diagnose, and fix bugs
  quickly
steps:
  - title: Describe the Bug
    description: Clearly articulate the symptoms of the bug.
    action: Use the provided template to describe the bug to Claude Code.
    codeSnippet: |-
      claude 'I have a bug in my application. Here are the symptoms:
      - [describe what is happening]
      - [describe what should happen instead]
      - [paste the error message or logs]

      Read the relevant files and identify the root cause.'
    expectedResult: Claude Code identifies the root cause of the bug.
    failureHint: >-
      Ensure you provide detailed symptoms and error messages for better
      diagnosis.
  - title: Get a Fix with Explanation
    description: Obtain a fix for the identified bug along with an explanation.
    action: Request a fix from Claude Code using the explanation template.
    codeSnippet: |-
      claude 'Fix the bug you identified. Explain:
      1. What was wrong
      2. Why it was wrong
      3. What your fix does differently
      4. Any edge cases your fix handles'
    expectedResult: Receive a detailed explanation of the fix and the changes made.
    failureHint: 'If the explanation is unclear, ask for clarification on specific points.'
  - title: Add a Regression Test
    description: Create a unit test to prevent future occurrences of the bug.
    action: Instruct Claude Code to write a unit test for the bug.
    codeSnippet: >-
      claude 'Write a unit test that would have caught this bug before it
      reached production. Use the existing test framework in this project.'
    expectedResult: A unit test is generated that successfully checks for the bug.
    failureHint: >-
      If the test does not compile, check for compatibility with your existing
      test framework.
---

## 🎯 Goal

Use Claude Code to identify the root cause of a bug and produce a working fix with tests — in a single session.

---

## 📋 Recipe

### Step 1 — Describe the bug clearly

```
claude 'I have a bug in my application. Here are the symptoms:
- [describe what is happening]
- [describe what should happen instead]
- [paste the error message or logs]

Read the relevant files and identify the root cause.'
```

### Step 2 — Get a fix with explanation

```
claude 'Fix the bug you identified. Explain:
1. What was wrong
2. Why it was wrong
3. What your fix does differently
4. Any edge cases your fix handles'
```

### Step 3 — Add a regression test

```
claude 'Write a unit test that would have caught this bug before it reached production. Use the existing test framework in this project.'
```

---

## 💡 Tips

- Always include the full error stack trace — Claude Code uses it to pinpoint the exact file and line
- If the bug is in a large file, run `claude 'Identify which function is most likely causing [symptom]'` first to narrow the scope
- After a fix, ask Claude Code to `'Review the fix for any side effects or regressions in other parts of the codebase'`

---
title: 'n8n Queue Setup: Bypass API Rate Limits Gracefully'
tags:
  - n8n
  - Rate Limit
  - Queue
difficulty: advanced
summary: >-
  Build an n8n queue system that batches and spaces API calls to respect rate
  limits without losing any requests
steps:
  - title: Add a Wait Node
    description: Insert a Wait node to control the timing of API calls.
    action: Add a Wait node after each API call and set the wait time to 1 second.
    expectedResult: API calls are spaced out to respect rate limits.
    failureHint: Ensure the wait time matches the API's rate limit requirements.
  - title: Implement SplitInBatches
    description: Use SplitInBatches to manage large datasets effectively.
    action: >-
      Configure SplitInBatches to process items in batches of 10, followed by a
      Wait node set to 2 seconds.
    expectedResult: >-
      The workflow processes items in manageable batches without exceeding rate
      limits.
    failureHint: >-
      Check the batch size and wait time to ensure they align with the API rate
      limit.
  - title: Handle Rate Limit Errors
    description: Add logic to handle API rate limit errors gracefully.
    action: >-
      Insert an IF node to check for HTTP status 429 and set up a Wait node to
      retry after 60 seconds if true.
    expectedResult: >-
      The workflow retries failed API calls after the specified wait time
      without losing requests.
    failureHint: >-
      Verify the condition in the IF node is correctly checking for the 429
      status code.
  - title: Log Failed Items
    description: Capture and log any failed API calls for later review.
    action: >-
      Add a Set node to record failed items and write them to a Google Sheet or
      Supabase table.
    expectedResult: >-
      All failed API requests are logged for manual review, ensuring no data is
      lost.
    failureHint: Ensure the logging destination is correctly configured and accessible.
---

## 🎯 Goal

Process large batches of API calls in n8n without hitting rate limits or dropping requests.

---

## 📋 Recipe

### Step 1 — Add a Wait node between API calls

For simple cases, insert a **Wait** node after each API call:
- Wait: 1 second (adjust based on rate limit)

### Step 2 — Use a queue with SplitInBatches

For large datasets, use **SplitInBatches** + **Wait**:

```
Input: 100 items
↓
SplitInBatches (batch size: 10)
↓
[Your API Node] (processes 10 items)
↓
Wait (2 seconds)
↓
[Loop back to SplitInBatches until done]
```

### Step 3 — Handle rate limit errors (429)

Add an **IF** node after your API node to check the HTTP status:
- Condition: `{{$json.statusCode}} === 429`
- If true: **Wait** (60 seconds) → retry the same item
- If false: Continue to next step

### Step 4 — Log failed items for review

Add a **Set** node to capture failed items and write them to a Google Sheet or Supabase table for manual review.

---

## 💡 Tips

- Check the API's rate limit docs before building — some limit per minute, others per second
- For Claude API: 50 requests/minute on free tier, 1000/minute on paid — adjust batch timing accordingly
- Use **Error Trigger** workflow as a fallback for unhandled errors

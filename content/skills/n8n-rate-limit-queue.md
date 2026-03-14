---
title: "n8n Queue Setup: Bypass API Rate Limits Gracefully"
tags: ["n8n", "Rate Limit", "Queue"]
difficulty: "advanced"
summary: "Build an n8n queue system that batches and spaces API calls to respect rate limits without losing any requests"
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

---
steps: [{"title":"Add a Wait Node","description":"Introduce a delay between API calls to respect rate limits.","action":"Insert a **Wait** node after each API call and set it to wait for 1 second.","expectedResult":"The workflow pauses for 1 second after each API call, preventing immediate retries.","failureHint":"Ensure the Wait node is correctly placed after the API call."},{"title":"Implement SplitInBatches","description":"Batch large datasets to process them in manageable sizes.","action":"Use **SplitInBatches** to divide your input into batches of 10, followed by a Wait node for spacing.","expectedResult":"The input of 100 items is processed in 10 batches, with a 2-second wait after each batch.","failureHint":"Check the batch size and ensure the Wait node is included after the API processing."},{"title":"Handle Rate Limit Errors","description":"Manage API responses that indicate rate limits have been exceeded.","action":"Add an **IF** node to check for HTTP status code 429 after the API call.","expectedResult":"If a 429 status code is detected, the workflow waits for 60 seconds before retrying the same item.","failureHint":"Verify the condition in the IF node is set correctly to capture 429 errors."},{"title":"Log Failed Items","description":"Capture and log any failed API requests for future review.","action":"Add a **Set** node to store failed items and send them to a Google Sheet or Supabase table.","expectedResult":"Failed API requests are logged for later analysis and troubleshooting.","failureHint":"Ensure the Set node is configured to capture the necessary data fields."}]
---
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

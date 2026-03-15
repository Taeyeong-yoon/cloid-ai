---
steps: [{"title":"Set Up Gmail Trigger","description":"Configure n8n to trigger on new emails in your Gmail inbox.","action":"Add a Gmail Trigger node in n8n and set it to trigger on new emails with a filter for the inbox label.","expectedResult":"The Gmail Trigger node is successfully set up and ready to monitor for new emails.","failureHint":"Ensure your Gmail account is connected and the trigger settings are correctly configured."},{"title":"Generate Draft with Claude","description":"Use Claude API to generate context-aware email replies.","action":"Add an AI Agent or HTTP Request node to call the Claude API with the email details.","codeSnippet":"System: You are a professional email assistant. Draft concise, helpful replies to business emails. User: Email from: {{$json.from}} Subject: {{$json.subject}} Body: {{$json.text}} Draft a reply that: 1. Acknowledges the specific question or request 2. Provides a helpful response based on context 3. Is professional but friendly 4. Is under 150 words","expectedResult":"Claude generates a draft reply based on the incoming email context.","failureHint":"Check your API key and ensure the Claude node is correctly configured."},{"title":"Create Gmail Draft","description":"Save the generated reply as a draft in Gmail.","action":"Add a Gmail node to create a draft with the generated reply from Claude.","expectedResult":"The draft email is created in your Gmail account with the correct recipient, subject, and body.","failureHint":"Verify that the Gmail node is properly set up and has the correct input from the Claude node."}]
---
---
title: "n8n + Claude: Auto-Reply Gmail with Context-Aware Responses"
tags: ["n8n", "Gmail", "Automation", "Claude"]
difficulty: "intermediate"
summary: "Build an n8n workflow that reads incoming Gmail messages and drafts context-aware replies using Claude"
---

## 🎯 Goal

Create an n8n automation that monitors a Gmail inbox, classifies incoming emails, and drafts personalized replies using Claude — without sending automatically.

---

## 📋 Recipe

### Step 1 — Gmail trigger setup

In n8n, add a **Gmail Trigger** node:
- Trigger on: New Email
- Filters: Label = "inbox" (or a specific label for auto-reply)
- Poll interval: Every 5 minutes

### Step 2 — Claude draft generation

Add an **AI Agent** or **HTTP Request** node to call the Claude API:

```
System: You are a professional email assistant. Draft concise, helpful replies to business emails.

User: Email from: {{$json.from}}
Subject: {{$json.subject}}
Body: {{$json.text}}

Draft a reply that:
1. Acknowledges the specific question or request
2. Provides a helpful response based on context
3. Is professional but friendly
4. Is under 150 words
```

### Step 3 — Save as Gmail draft

Add a **Gmail** node:
- Operation: Create Draft
- To: `{{$json.from}}`
- Subject: `Re: {{$json.subject}}`
- Body: `{{$node["Claude"].json.content[0].text}}`

---

## 💡 Tips

- Always draft first, never auto-send — review drafts before sending
- Add an IF node to skip automated/newsletter emails (check for List-Unsubscribe header)
- Log all drafts to a Google Sheet for auditing

---
steps: [{"title":"Set Up YouTube RSS Trigger","description":"This step sets up a trigger to monitor a YouTube channel for new videos.","action":"Add a Schedule Trigger node set to daily and an HTTP Request node to fetch the YouTube channel RSS feed using the provided URL.","codeSnippet":"URL: https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID_HERE\nMethod: GET","expectedResult":"The pipeline successfully fetches the latest video IDs and titles from the YouTube channel.","failureHint":"Check if the channel ID is correct or if there are any network issues."},{"title":"Fetch Video Transcript","description":"This step retrieves the transcript of the latest video.","action":"Add an HTTP Request node to fetch the video transcript using the video ID from the previous step.","codeSnippet":"URL: https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId={{$json.videoId}}\nHeaders: X-RapidAPI-Key: YOUR_KEY","expectedResult":"The transcript of the latest video is successfully retrieved.","failureHint":"Ensure that your RapidAPI key is valid and that the video ID is correct."},{"title":"Summarize Video Transcript","description":"This step sends the transcript to Claude for summarization.","action":"Add an HTTP Request node to call the Anthropic API with the transcript data.","codeSnippet":"{\n  \"model\": \"claude-haiku-4-5-20251001\",\n  \"max_tokens\": 500,\n  \"messages\": [{\n    \"role\": \"user\",\n    \"content\": \"Summarize this YouTube video transcript in 5 bullet points. Include: main topic, key insights, and one actionable takeaway.\\n\\nTranscript:\\n{{$json.transcript}}\"\n  }]\n}","expectedResult":"A summary of the video transcript is generated in bullet points.","failureHint":"Verify the API key and ensure the transcript is correctly formatted."},{"title":"Deliver Summary","description":"This step sends the summary to your email or Notion.","action":"Use the Gmail or Notion node to send the summary to your chosen destination.","expectedResult":"The summary is successfully delivered to your email or Notion database.","failureHint":"Check your email or Notion integration settings for any issues."}]
---
---
title: "n8n: Auto-Summarize Latest YouTube Videos with Claude"
tags: ["n8n", "YouTube", "Claude", "Automation"]
difficulty: "intermediate"
summary: "Build an n8n pipeline that monitors a YouTube channel, fetches new video transcripts, and summarizes them with Claude"
---

## 🎯 Goal

Automatically summarize new YouTube videos from a channel and deliver the summaries to your email or Notion.

---

## 📋 Recipe

### Step 1 — YouTube RSS trigger

Add a **Schedule Trigger** (daily) + **HTTP Request** node to fetch the YouTube channel RSS feed:

```
URL: https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID_HERE
Method: GET
```

Parse the XML response with a **Set** node to extract video IDs and titles.

### Step 2 — Fetch transcript via RapidAPI

Add an **HTTP Request** node to fetch the video transcript:

```
URL: https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId={{$json.videoId}}
Headers: X-RapidAPI-Key: YOUR_KEY
```

### Step 3 — Summarize with Claude

Add an **HTTP Request** node to call the Anthropic API:

```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 500,
  "messages": [{
    "role": "user",
    "content": "Summarize this YouTube video transcript in 5 bullet points. Include: main topic, key insights, and one actionable takeaway.\n\nTranscript:\n{{$json.transcript}}"
  }]
}
```

### Step 4 — Deliver summary

Send to Gmail or Notion using the respective n8n nodes.

---

## 💡 Tips

- Use claude-haiku-4-5 to keep costs near zero for daily summaries
- Add a **Duplicate Check** node to avoid re-summarizing videos you've already processed
- Store summaries in a Notion database for a personal knowledge base

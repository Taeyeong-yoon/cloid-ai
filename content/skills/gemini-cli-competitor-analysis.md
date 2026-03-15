---
steps: [{"title":"Gather Competitor Materials","description":"Collect necessary documents for analysis.","action":"Download competitor pages and reports as text or PDF files using curl.","codeSnippet":"curl -s https://competitor-a.com > competitor_a.txt\ncurl -s https://competitor-b.com > competitor_b.txt","expectedResult":"Competitor documents are saved as text files named competitor_a.txt and competitor_b.txt.","failureHint":"Ensure the URLs are correct and you have internet access."},{"title":"Run Multi-Document Analysis","description":"Analyze the collected documents for key insights.","action":"Execute the Gemini CLI command to extract competitive insights from the documents.","codeSnippet":"gemini 'I have two competitor profiles. For each company, extract: ...' --file competitor_a.txt --file competitor_b.txt","expectedResult":"A structured analysis report comparing the two competitors is generated.","failureHint":"Check for any syntax errors in the command and ensure the files are accessible."},{"title":"Generate a Strategy Memo","description":"Create a strategic recommendation based on the analysis.","action":"Run the Gemini CLI command to produce a 1-page strategy memo.","codeSnippet":"gemini 'Based on this competitive landscape analysis, write a 1-page strategy memo ...' --file competitor_a.txt --file competitor_b.txt","expectedResult":"A strategy memo detailing three positioning angles for your product is produced.","failureHint":"Review the command for accuracy and ensure the analysis is complete."}]
---
---
title: "Gemini CLI: Competitive Analysis from Multiple Documents"
tags: ["Gemini CLI", "Analysis", "Recipe"]
difficulty: "intermediate"
summary: "Use Gemini CLI's long context to analyze competitor websites, reports, and documents and produce a structured comparison"
---

## 🎯 Goal

Feed multiple competitor documents into Gemini CLI at once and produce a structured competitive analysis report.

---

## 📋 Recipe

### Step 1 — Gather competitor materials

Save competitor pages and reports as text or PDF files:

```bash
# Download competitor pages as text
curl -s https://competitor-a.com > competitor_a.txt
curl -s https://competitor-b.com > competitor_b.txt
```

### Step 2 — Run multi-document analysis

```
gemini 'I have two competitor profiles. For each company, extract:
1. Core product offering
2. Pricing model (if visible)
3. Target customer segment
4. Key differentiators
5. Apparent weaknesses

Then produce a comparison table and identify the gap our product could fill.' --file competitor_a.txt --file competitor_b.txt
```

### Step 3 — Generate a strategy memo

```
gemini 'Based on this competitive landscape analysis, write a 1-page strategy memo recommending 3 positioning angles for our product. Be specific and actionable.' --file competitor_a.txt --file competitor_b.txt
```

---

## 💡 Tips

- Gemini 3.1's long context handles up to 1M tokens — you can feed in entire annual reports
- Add `--model gemini-1.5-pro` for complex multi-document reasoning
- Save outputs to files with `gemini '...' > analysis.md` for easy sharing

---
title: 'Gemini CLI: Competitive Analysis from Multiple Documents'
tags:
  - Gemini CLI
  - Analysis
  - Recipe
difficulty: intermediate
summary: >-
  Use Gemini CLI's long context to analyze competitor websites, reports, and
  documents and produce a structured comparison
steps:
  - title: Gather Competitor Materials
    description: Collect relevant competitor documents for analysis.
    action: Download competitor pages as text files using curl.
    codeSnippet: |-
      # Download competitor pages as text
      curl -s https://competitor-a.com > competitor_a.txt
      curl -s https://competitor-b.com > competitor_b.txt
    expectedResult: >-
      You have two text files, competitor_a.txt and competitor_b.txt, containing
      the competitor information.
    failureHint: Ensure the URLs are correct and that you have internet access.
  - title: Run Multi-Document Analysis
    description: Analyze the collected competitor documents for key information.
    action: >-
      Execute the Gemini CLI command to extract relevant data from the
      competitor documents.
    codeSnippet: >-
      gemini 'I have two competitor profiles. For each company, extract: 1. Core
      product offering 2. Pricing model (if visible) 3. Target customer segment
      4. Key differentiators 5. Apparent weaknesses Then produce a comparison
      table and identify the gap our product could fill.' --file
      competitor_a.txt --file competitor_b.txt
    expectedResult: >-
      A structured competitive analysis report is generated, highlighting key
      aspects of each competitor.
    failureHint: Check the syntax of your command and ensure the files are accessible.
  - title: Generate a Strategy Memo
    description: Create an actionable strategy memo based on the analysis.
    action: Run the Gemini CLI command to draft a strategy memo with recommendations.
    codeSnippet: >-
      gemini 'Based on this competitive landscape analysis, write a 1-page
      strategy memo recommending 3 positioning angles for our product. Be
      specific and actionable.' --file competitor_a.txt --file competitor_b.txt
    expectedResult: >-
      A 1-page strategy memo is produced, outlining three specific positioning
      angles for your product.
    failureHint: >-
      Ensure the analysis output is clear and that you are using the correct
      command syntax.
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

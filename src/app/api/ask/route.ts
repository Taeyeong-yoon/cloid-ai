import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000;
const MAX_REQ = 5;

const dailyLimitMap = new Map<string, { count: number; resetAt: number }>();

let dailyCount = 0;
let dailyReset = todayKey();
const DAILY_LIMIT = 200;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (rateLimitMap.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (times.length >= MAX_REQ) return true;

  times.push(now);
  rateLimitMap.set(ip, times);

  if (rateLimitMap.size > 500) {
    for (const [key, values] of rateLimitMap.entries()) {
      if (values.every((time) => now - time >= WINDOW_MS)) {
        rateLimitMap.delete(key);
      }
    }
  }

  return false;
}

function checkDailyLimit(identifier: string, isLoggedIn: boolean): boolean {
  const limit = isLoggedIn ? 10 : 3;
  const now = Date.now();
  const record = dailyLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    dailyLimitMap.set(identifier, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return true;
  }

  if (record.count >= limit) return false;
  record.count++;
  return true;
}

function isDailyLimitReached(): boolean {
  const today = todayKey();
  if (today !== dailyReset) {
    dailyCount = 0;
    dailyReset = today;
  }

  if (dailyCount >= DAILY_LIMIT) return true;
  dailyCount++;
  return false;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key is not configured." }, { status: 500 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    userId = null;
  }

  const identifier = userId ?? `ip:${ip}`;
  const isLoggedIn = Boolean(userId);

  if (!checkDailyLimit(identifier, isLoggedIn)) {
    const limit = isLoggedIn ? 10 : 3;
    const error = isLoggedIn
      ? `Daily question limit reached (${limit}). Please try again tomorrow.`
      : `Daily question limit reached (${limit}). Sign in to use up to 10 questions per day.`;

    return NextResponse.json({ error, requiresLogin: !isLoggedIn }, { status: 429 });
  }

  if (isDailyLimitReached()) {
    return NextResponse.json(
      { error: "The site-wide AI budget for today has been reached. Please try again tomorrow." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const question = typeof body.question === "string" ? body.question.trim() : "";
  const context = typeof body.context === "string" ? body.context.trim().slice(0, 1500) : "";
  const mode = body.mode === "tutor" ? "tutor" : "default";

  if (!question) {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }

  if (question.length > 500) {
    return NextResponse.json(
      { error: "Please keep the question within 500 characters." },
      { status: 400 }
    );
  }

  try {
    const openai = new OpenAI({ apiKey });

    const systemPrompt =
      mode === "tutor"
        ? [
            "You are the CLOID.AI floating tutor for practical AI learning.",
            "Help the learner continue the current skill or lab immediately.",
            "Answer in 3-5 short sentences or 3 short bullets.",
            "When useful, include one exact command, one code fragment, or one next action.",
            "Use the supplied page context but keep the answer compact and low-cost.",
          ].join(" ")
        : [
            "You are the CLOID.AI AI learning assistant.",
            "Answer clearly and concretely about AI tools, prompts, and development patterns.",
            "When useful, mention related CLOID.AI content areas such as Learning, Skills, or Labs.",
            "Keep the answer concise.",
          ].join(" ");

    const userPrompt = context
      ? `Page context:\n${context}\n\nUser question:\n${question}`
      : question;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: mode === "tutor" ? 220 : 500,
      temperature: mode === "tutor" ? 0.4 : 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content?.trim() ?? "No answer was generated.";

    return NextResponse.json({ answer, remaining: DAILY_LIMIT - dailyCount });
  } catch (error) {
    console.error("OpenAI ask route error:", error);
    return NextResponse.json(
      { error: "Failed to generate a response. Please try again shortly." },
      { status: 500 }
    );
  }
}

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000;
const MAX_REQ = 10;

const dailyLimitMap = new Map<string, { count: number; resetAt: number }>();

let dailyCount = 0;
let dailyReset = todayKey();
const DAILY_LIMIT = 300;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_REQ) return true;
  times.push(now);
  rateLimitMap.set(ip, times);
  return false;
}

function checkDailyLimit(identifier: string, isLoggedIn: boolean): boolean {
  const limit = isLoggedIn ? 20 : 5;
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
  if (today !== dailyReset) { dailyCount = 0; dailyReset = today; }
  if (dailyCount >= DAILY_LIMIT) return true;
  dailyCount++;
  return false;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured." }, { status: 500 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Wait a moment." }, { status: 429 });
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
    const limit = isLoggedIn ? 20 : 5;
    const error = isLoggedIn
      ? `Daily practice limit reached (${limit}). Please try again tomorrow.`
      : `Daily practice limit reached (${limit}). Sign in to use up to 20 practice runs per day.`;
    return NextResponse.json({ error, requiresLogin: !isLoggedIn }, { status: 429 });
  }

  if (isDailyLimitReached()) {
    return NextResponse.json(
      { error: "Site-wide practice budget reached for today. Try again tomorrow." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return NextResponse.json({ error: "Please enter a prompt." }, { status: 400 });
  }
  if (prompt.length > 2000) {
    return NextResponse.json({ error: "Prompt must be under 2000 characters." }, { status: 400 });
  }

  try {
    const openai = new OpenAI({ apiKey });

    const systemPrompt = [
      "You are the CLOID.AI in-app AI practice assistant.",
      "The user is a learner running a practice prompt to see how AI responds.",
      "Respond naturally and helpfully as if you are an expert AI assistant being prompted.",
      "Give a concrete, useful response to whatever prompt the user sends.",
      "Keep the response under 400 tokens — focused, clear, and immediately useful.",
      "If the prompt asks for structured output (list, table, code), produce it directly.",
    ].join(" ");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 400,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? "No response generated.";
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Practice API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}

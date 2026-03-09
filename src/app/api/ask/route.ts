import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ── IP당 분당 5회 제한 ─────────────────────────────────────
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000;
const MAX_REQ = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_REQ) return true;
  times.push(now);
  rateLimitMap.set(ip, times);
  if (rateLimitMap.size > 500) {
    for (const [key, ts] of rateLimitMap.entries()) {
      if (ts.every((t) => now - t >= WINDOW_MS)) rateLimitMap.delete(key);
    }
  }
  return false;
}

// ── 일일 사용자별 제한 ─────────────────────────────────────
const dailyLimitMap = new Map<string, { count: number; resetAt: number }>();

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

// ── 일일 호출 카운터 (과금 보호) ──────────────────────────
let dailyCount = 0;
let dailyReset = todayKey();
const DAILY_LIMIT = 200; // 하루 200회 제한 (월 ~$1.2)

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isDailyLimitReached(): boolean {
  const today = todayKey();
  if (today !== dailyReset) { dailyCount = 0; dailyReset = today; }
  if (dailyCount >= DAILY_LIMIT) return true;
  dailyCount++;
  return false;
}

// ── 메인 핸들러 ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API 키 미설정' }, { status: 500 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 1분 후 다시 시도해주세요. (분당 5회 제한)' },
      { status: 429 },
    );
  }

  // ── 로그인 여부 확인 + 사용자별 일일 제한 ─────────────────
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {}

  const identifier = userId ?? `ip:${ip}`;
  const isLoggedIn = !!userId;

  if (!checkDailyLimit(identifier, isLoggedIn)) {
    const limit = isLoggedIn ? 10 : 3;
    const errorMsg = isLoggedIn
      ? `일일 질문 한도(${limit}회)를 초과했습니다. 내일 다시 이용해주세요.`
      : `일일 질문 한도(${limit}회)를 초과했습니다. 로그인하면 10회까지 사용할 수 있어요!`;
    return NextResponse.json({ error: errorMsg, requiresLogin: !isLoggedIn }, { status: 429 });
  }

  if (isDailyLimitReached()) {
    return NextResponse.json(
      { error: '오늘 AI 질문 한도에 도달했습니다. 내일 다시 이용해주세요.' },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!question) {
    return NextResponse.json({ error: '질문을 입력하세요' }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json({ error: '질문은 500자 이내로 입력해주세요' }, { status: 400 });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            '너는 CLOID.AI의 AI 학습 도우미야. 사용자가 AI 도구, 프롬프트, 개발 패턴에 대해 질문하면 친절하고 구체적으로 답변해. 답변 시 가능하면 CLOID.AI 내의 관련 학습 콘텐츠(Learning, Labs, Skills)를 안내해. 답변은 한국어로 하되 기술 용어는 영문 병기. 답변 길이는 300자 이내로 간결하게.',
        },
        { role: 'user', content: question },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? '응답을 받지 못했습니다.';
    return NextResponse.json({ answer, remaining: DAILY_LIMIT - dailyCount });
  } catch (err) {
    console.error('OpenAI 오류:', err);
    return NextResponse.json({ error: '응답 생성 실패. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}

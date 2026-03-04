import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// ── IP당 분당 5회 제한 (인메모리) ──────────────────────────
const rateLimitMap = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000; // 1분
const MAX_REQ = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (rateLimitMap.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (times.length >= MAX_REQ) return true;

  times.push(now);
  rateLimitMap.set(ip, times);

  // 오래된 IP 정리 (메모리 누수 방지)
  if (rateLimitMap.size > 500) {
    for (const [key, ts] of rateLimitMap.entries()) {
      if (ts.every((t) => now - t >= WINDOW_MS)) rateLimitMap.delete(key);
    }
  }

  return false;
}

// ── 일일 호출 카운터 (무료 한도 1,500회 보호) ─────────────
let dailyCount = 0;
let dailyReset = todayKey();
const DAILY_LIMIT = 1400; // 여유 있게 100회 남김

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-03-05"
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

// ── 메인 핸들러 ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API 키 미설정' }, { status: 500 });
  }

  // IP 추출 (Vercel: x-forwarded-for 헤더)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  // Rate limit 체크
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 1분 후 다시 시도해주세요. (분당 5회 제한)' },
      { status: 429 },
    );
  }

  // 일일 한도 체크
  if (isDailyLimitReached()) {
    return NextResponse.json(
      { error: '오늘 AI 질문 한도에 도달했습니다. 내일 다시 이용해주세요.' },
      { status: 429 },
    );
  }

  // 입력 검증
  const body = await req.json().catch(() => ({}));
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!question) {
    return NextResponse.json({ error: '질문을 입력하세요' }, { status: 400 });
  }
  if (question.length > 500) {
    return NextResponse.json({ error: '질문은 500자 이내로 입력해주세요' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        maxOutputTokens: 800, // 출력 제한으로 토큰 절약
        temperature: 0.7,
      },
    });

    const prompt = `당신은 AI 학습 포털 CLOID.AI의 AI 도우미입니다.
AI 도구, Claude Code, MCP 프로토콜, 프롬프트 엔지니어링, AI 개발에 대한 질문에 한국어로 명확하고 실용적으로 답변하세요.
답변은 핵심만 간결하게 (3~5문장 이내), 코드/커맨드가 필요하면 포함하세요.

질문: ${question}`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    return NextResponse.json({ answer, remaining: DAILY_LIMIT - dailyCount });
  } catch (err) {
    console.error('Gemini 오류:', err);
    return NextResponse.json({ error: '응답 생성 실패. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}

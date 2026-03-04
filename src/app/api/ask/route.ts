import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API 키 미설정' }, { status: 500 });
  }

  const { question } = await req.json();
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return NextResponse.json({ error: '질문을 입력하세요' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `당신은 AI 학습 포털 CLOID.AI의 AI 도우미입니다.
사용자가 AI 도구, Claude Code, MCP 프로토콜, 프롬프트 엔지니어링, AI 개발에 대해 질문하면 한국어로 명확하고 실용적으로 답변하세요.
코드 예시나 커맨드가 필요하면 포함하세요.

질문: ${question.trim()}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error('Gemini 오류:', err);
    return NextResponse.json({ error: '응답 생성 실패' }, { status: 500 });
  }
}

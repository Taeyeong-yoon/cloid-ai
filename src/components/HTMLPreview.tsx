"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Code2, Eye, Download, X, Copy, Check, Maximize2, Minimize2, AlertTriangle, BookOpen, FlaskConical, ChevronRight, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

type TabType = "html" | "css" | "js";

type Template = {
  id: string;
  label: string;
  category: string;
  description: string;
  html: string;
  css: string;
  js: string;
};

type Challenge = {
  id: string;
  label: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  hint: string;
  starterHtml: string;
  starterCss: string;
  starterJs: string;
};

const TEMPLATE_CATEGORIES = ["기본 UI", "인터랙티브", "AI / 실전"] as const;

const TEMPLATES: Template[] = [
  // 기본 UI
  {
    id: "hero",
    category: "기본 UI",
    label: "Hero 섹션",
    description: "랜딩 페이지용 히어로 섹션",
    html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap" rel="stylesheet">

<section class="hero">
  <div class="badge">✦ AI-Powered Platform</div>
  <h1 class="title">Build Something<br><span class="gradient">Extraordinary</span></h1>
  <p class="subtitle">차세대 AI 도구로 아이디어를 현실로 만드세요.<br>빠르고, 강력하고, 직관적입니다.</p>
  <div class="actions">
    <button class="btn-primary" onclick="this.textContent='🚀 시작됨!'">시작하기 →</button>
    <button class="btn-ghost">데모 보기</button>
  </div>
  <div class="stats">
    <div class="stat"><span class="num">98%</span><span class="lbl">만족도</span></div>
    <div class="divider"></div>
    <div class="stat"><span class="num">50K+</span><span class="lbl">사용자</span></div>
    <div class="divider"></div>
    <div class="stat"><span class="num">200ms</span><span class="lbl">응답속도</span></div>
  </div>
</section>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #050810; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.hero { text-align: center; padding: 60px 40px; max-width: 700px; }
.badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(139,92,246,.15); border: 1px solid rgba(139,92,246,.3); color: #a78bfa; font-size: 12px; font-weight: 600; letter-spacing: .08em; padding: 6px 16px; border-radius: 999px; margin-bottom: 32px; }
.title { font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 900; line-height: 1.1; letter-spacing: -.02em; margin-bottom: 20px; }
.gradient { background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.subtitle { font-size: 1.05rem; color: #94a3b8; line-height: 1.8; margin-bottom: 40px; }
.actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 56px; }
.btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all .2s; box-shadow: 0 0 30px rgba(99,102,241,.4); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(99,102,241,.6); }
.btn-ghost { background: transparent; color: #cbd5e1; border: 1px solid rgba(255,255,255,.12); padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all .2s; }
.btn-ghost:hover { border-color: rgba(255,255,255,.3); color: #fff; }
.stats { display: flex; align-items: center; justify-content: center; gap: 32px; }
.stat { display: flex; flex-direction: column; gap: 4px; }
.num { font-size: 1.5rem; font-weight: 700; color: #e2e8f0; }
.lbl { font-size: 11px; color: #64748b; letter-spacing: .06em; text-transform: uppercase; }
.divider { width: 1px; height: 36px; background: rgba(255,255,255,.08); }`,
    js: "",
  },
  {
    id: "card",
    category: "기본 UI",
    label: "프로필 카드",
    description: "호버 효과가 있는 프로필 카드",
    html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<div class="scene">
  <div class="card">
    <div class="card-glow"></div>
    <div class="avatar-wrap">
      <div class="avatar">AI</div>
      <div class="status-dot"></div>
    </div>
    <h2 class="name">CLOID AI</h2>
    <p class="role">Senior AI Engineer</p>
    <div class="tags">
      <span class="tag">Python</span>
      <span class="tag">LLM</span>
      <span class="tag">n8n</span>
      <span class="tag">Claude</span>
    </div>
    <div class="metrics">
      <div class="metric"><span class="val">142</span><span class="key">Projects</span></div>
      <div class="sep"></div>
      <div class="metric"><span class="val">98%</span><span class="key">Success</span></div>
      <div class="sep"></div>
      <div class="metric"><span class="val">4.9★</span><span class="key">Rating</span></div>
    </div>
    <button class="follow-btn" onclick="this.classList.toggle('following'); this.textContent = this.classList.contains('following') ? '✓ Following' : 'Follow'">Follow</button>
  </div>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #0a0f1e; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
.scene { perspective: 1000px; }
.card { position: relative; width: 300px; background: linear-gradient(145deg, rgba(30,41,59,.9), rgba(15,23,42,.95)); border: 1px solid rgba(255,255,255,.08); border-radius: 24px; padding: 36px 28px 28px; text-align: center; overflow: hidden; transition: transform .4s ease, box-shadow .4s ease; cursor: default; }
.card:hover { transform: translateY(-8px) rotateX(4deg); box-shadow: 0 32px 64px rgba(0,0,0,.5), 0 0 80px rgba(99,102,241,.15); }
.card-glow { position: absolute; top: -50%; left: 50%; transform: translateX(-50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(99,102,241,.25) 0%, transparent 70%); pointer-events: none; }
.avatar-wrap { position: relative; display: inline-block; margin-bottom: 16px; }
.avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: #fff; box-shadow: 0 0 30px rgba(99,102,241,.5); }
.status-dot { position: absolute; bottom: 4px; right: 4px; width: 14px; height: 14px; background: #22c55e; border-radius: 50%; border: 2px solid #0a0f1e; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{ box-shadow:0 0 0 0 rgba(34,197,94,.4)} 50%{ box-shadow:0 0 0 6px rgba(34,197,94,0)} }
.name { font-size: 1.25rem; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
.role { font-size: .8rem; color: #64748b; letter-spacing: .04em; margin-bottom: 18px; }
.tags { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }
.tag { background: rgba(99,102,241,.15); border: 1px solid rgba(99,102,241,.25); color: #a5b4fc; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 999px; }
.metrics { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 18px 0; border-top: 1px solid rgba(255,255,255,.06); border-bottom: 1px solid rgba(255,255,255,.06); margin-bottom: 20px; }
.metric { display: flex; flex-direction: column; gap: 3px; }
.val { font-size: 1rem; font-weight: 700; color: #e2e8f0; }
.key { font-size: 10px; color: #475569; letter-spacing: .05em; }
.sep { width: 1px; height: 28px; background: rgba(255,255,255,.07); }
.follow-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 12px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; }
.follow-btn:hover { opacity: .9; transform: scale(1.02); }
.follow-btn.following { background: transparent; border: 1px solid rgba(255,255,255,.15); color: #94a3b8; }`,
    js: "",
  },
  {
    id: "form",
    category: "기본 UI",
    label: "로그인 폼",
    description: "글라스모피즘 스타일 로그인",
    html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<div class="bg">
  <div class="blob b1"></div>
  <div class="blob b2"></div>
  <div class="card">
    <div class="logo">✦</div>
    <h1 class="title">Welcome back</h1>
    <p class="sub">CLOID AI에 로그인하세요</p>
    <form onsubmit="handleSubmit(event)">
      <div class="field">
        <label>이메일</label>
        <input type="email" placeholder="you@example.com" required>
      </div>
      <div class="field">
        <label>비밀번호</label>
        <input type="password" placeholder="••••••••" required>
      </div>
      <div class="remember">
        <label class="check-wrap"><input type="checkbox"><span class="checkmark"></span>로그인 유지</label>
        <a href="#" class="link">비밀번호 찾기</a>
      </div>
      <button type="submit" class="submit-btn">로그인</button>
    </form>
    <p class="footer">계정이 없으신가요? <a href="#" class="link">가입하기</a></p>
  </div>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #060b18; overflow: hidden; }
.bg { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: 100vh; }
.blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .35; pointer-events: none; }
.b1 { width: 400px; height: 400px; background: #6366f1; top: -80px; left: -80px; }
.b2 { width: 350px; height: 350px; background: #ec4899; bottom: -60px; right: -60px; }
.card { position: relative; z-index: 1; background: rgba(255,255,255,.04); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,.1); border-radius: 24px; padding: 44px 40px; width: 100%; max-width: 400px; }
.logo { font-size: 1.8rem; color: #818cf8; text-align: center; margin-bottom: 20px; }
.title { font-size: 1.6rem; font-weight: 700; color: #f1f5f9; text-align: center; margin-bottom: 6px; }
.sub { font-size: .85rem; color: #64748b; text-align: center; margin-bottom: 32px; }
.field { margin-bottom: 18px; }
.field label { display: block; font-size: 12px; font-weight: 600; color: #94a3b8; letter-spacing: .05em; margin-bottom: 8px; }
.field input { width: 100%; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 10px; padding: 12px 16px; color: #f1f5f9; font-size: 14px; font-family: inherit; transition: border-color .2s; outline: none; }
.field input:focus { border-color: #6366f1; background: rgba(99,102,241,.08); }
.field input::placeholder { color: #334155; }
.remember { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.check-wrap { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; cursor: pointer; }
.check-wrap input { display: none; }
.checkmark { width: 16px; height: 16px; border: 1px solid rgba(255,255,255,.15); border-radius: 4px; display: inline-block; }
.check-wrap input:checked ~ .checkmark { background: #6366f1; border-color: #6366f1; }
.link { font-size: 13px; color: #818cf8; text-decoration: none; }
.link:hover { color: #a5b4fc; }
.submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 12px; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; transition: all .2s; font-family: inherit; }
.submit-btn:hover { box-shadow: 0 8px 30px rgba(99,102,241,.5); transform: translateY(-1px); }
.footer { text-align: center; margin-top: 24px; font-size: 13px; color: #475569; }`,
    js: `function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  btn.textContent = '로그인 중...';
  btn.style.opacity = '.7';
  setTimeout(() => {
    btn.textContent = '✓ 로그인 성공!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
  }, 1200);
}`,
  },
  // 인터랙티브
  {
    id: "calculator",
    category: "인터랙티브",
    label: "계산기",
    description: "완전히 동작하는 계산기",
    html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

<div class="wrap">
  <div class="calc">
    <div class="display">
      <div class="expr" id="expr"></div>
      <div class="result" id="result">0</div>
    </div>
    <div class="keys">
      <button class="key span2 fn" onclick="clearAll()">AC</button>
      <button class="key fn" onclick="toggleSign()">+/-</button>
      <button class="key op" onclick="input('/')">÷</button>
      <button class="key" onclick="input('7')">7</button>
      <button class="key" onclick="input('8')">8</button>
      <button class="key" onclick="input('9')">9</button>
      <button class="key op" onclick="input('*')">×</button>
      <button class="key" onclick="input('4')">4</button>
      <button class="key" onclick="input('5')">5</button>
      <button class="key" onclick="input('6')">6</button>
      <button class="key op" onclick="input('-')">−</button>
      <button class="key" onclick="input('1')">1</button>
      <button class="key" onclick="input('2')">2</button>
      <button class="key" onclick="input('3')">3</button>
      <button class="key op" onclick="input('+')">+</button>
      <button class="key span2" onclick="input('0')">0</button>
      <button class="key" onclick="input('.')">.</button>
      <button class="key eq" onclick="calculate()">=</button>
    </div>
  </div>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #111827; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
.calc { background: #1c1c1e; border-radius: 28px; padding: 24px; width: 300px; box-shadow: 0 32px 64px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.06); }
.display { padding: 12px 8px 20px; text-align: right; }
.expr { font-size: 14px; color: #6b7280; height: 20px; margin-bottom: 6px; overflow: hidden; white-space: nowrap; }
.result { font-size: 3rem; font-weight: 300; color: #f9fafb; letter-spacing: -.02em; line-height: 1; word-break: break-all; }
.keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.key { border: none; border-radius: 50%; width: 60px; height: 60px; font-size: 1.2rem; font-weight: 500; cursor: pointer; transition: all .1s; font-family: inherit; }
.key:active { transform: scale(.94); }
.key { background: #2c2c2e; color: #f9fafb; }
.key:hover { background: #3a3a3c; }
.fn { background: #636366; color: #fff; }
.fn:hover { background: #7c7c7e; }
.op { background: #ff9f0a; color: #fff; font-size: 1.4rem; }
.op:hover { background: #ffb340; }
.eq { background: #ff9f0a; color: #fff; }
.eq:hover { background: #ffb340; }
.span2 { grid-column: span 2; border-radius: 30px; width: 100%; }`,
    js: `let expr = '', justCalc = false;
const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result');
function update(val) { resultEl.textContent = val; }
function input(v) {
  const ops = ['+','-','*','/'];
  if (justCalc && !ops.includes(v)) { expr = ''; justCalc = false; }
  if (ops.includes(v) && ops.includes(expr.slice(-1))) expr = expr.slice(0,-1);
  expr += v;
  exprEl.textContent = expr.replace(/\*/g,'×').replace(/\//g,'÷');
  try { const r = Function('"use strict";return (' + expr + ')')(); update(parseFloat(r.toFixed(10))); } catch {}
}
function calculate() {
  try {
    const r = Function('"use strict";return (' + expr + ')')();
    exprEl.textContent = expr.replace(/\*/g,'×').replace(/\//g,'÷') + ' =';
    expr = String(parseFloat(r.toFixed(10)));
    update(expr); justCalc = true;
  } catch { update('Error'); }
}
function clearAll() { expr = ''; justCalc = false; exprEl.textContent = ''; update('0'); }
function toggleSign() {
  if (!expr || expr === '0') return;
  expr = expr.startsWith('-') ? expr.slice(1) : '-' + expr;
  try { update(Function('"use strict";return (' + expr + ')')()) } catch {}
}`,
  },
  {
    id: "todo",
    category: "인터랙티브",
    label: "할 일 목록",
    description: "추가/완료/삭제 기능의 Todo 앱",
    html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<div class="app">
  <div class="header">
    <h1>할 일 목록</h1>
    <div class="counter" id="counter">0개 남음</div>
  </div>
  <div class="input-row">
    <input type="text" id="taskInput" placeholder="새 할 일을 입력하세요..." onkeydown="if(event.key==='Enter') addTask()">
    <button onclick="addTask()">추가</button>
  </div>
  <div class="filters">
    <button class="filter active" onclick="setFilter('all', this)">전체</button>
    <button class="filter" onclick="setFilter('active', this)">진행중</button>
    <button class="filter" onclick="setFilter('done', this)">완료</button>
  </div>
  <ul class="list" id="list"></ul>
  <div class="footer-bar">
    <span id="doneCount">완료 0개</span>
    <button class="clear-btn" onclick="clearDone()">완료 항목 삭제</button>
  </div>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #0f172a; min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 40px 16px; }
.app { width: 100%; max-width: 480px; }
.header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; }
h1 { font-size: 1.6rem; font-weight: 700; color: #f1f5f9; }
.counter { font-size: 13px; color: #64748b; }
.input-row { display: flex; gap: 10px; margin-bottom: 16px; }
.input-row input { flex: 1; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: 13px 16px; color: #f1f5f9; font-size: 14px; font-family: inherit; outline: none; transition: border-color .2s; }
.input-row input:focus { border-color: #6366f1; }
.input-row input::placeholder { color: #334155; }
.input-row button { background: #6366f1; border: none; border-radius: 12px; padding: 13px 20px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: background .2s; font-family: inherit; }
.input-row button:hover { background: #4f46e5; }
.filters { display: flex; gap: 8px; margin-bottom: 20px; }
.filter { background: transparent; border: 1px solid rgba(255,255,255,.08); border-radius: 8px; padding: 6px 16px; color: #64748b; font-size: 13px; cursor: pointer; transition: all .15s; font-family: inherit; }
.filter:hover { border-color: rgba(255,255,255,.2); color: #94a3b8; }
.filter.active { background: rgba(99,102,241,.2); border-color: rgba(99,102,241,.4); color: #a5b4fc; }
.list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.item { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 14px; padding: 14px 16px; transition: all .2s; animation: fadeIn .2s ease; }
@keyframes fadeIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
.item.done { opacity: .45; }
.item.done .text { text-decoration: line-through; color: #64748b; }
.checkbox { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,.2); border-radius: 6px; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all .15s; }
.item.done .checkbox { background: #22c55e; border-color: #22c55e; }
.text { flex: 1; font-size: 14px; color: #e2e8f0; }
.del { background: none; border: none; color: #334155; cursor: pointer; font-size: 16px; padding: 4px; border-radius: 6px; transition: all .15s; line-height: 1; }
.del:hover { color: #ef4444; background: rgba(239,68,68,.1); }
.footer-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.06); }
#doneCount { font-size: 13px; color: #475569; }
.clear-btn { background: none; border: none; color: #475569; font-size: 13px; cursor: pointer; font-family: inherit; }
.clear-btn:hover { color: #ef4444; }`,
    js: `let tasks = [{id:1,text:'Python 예제 실습하기',done:false},{id:2,text:'HTML 미리보기 사용해보기',done:true}];
let filter = 'all';
let nextId = 3;

function render() {
  const list = document.getElementById('list');
  const filtered = tasks.filter(t => filter==='all'?true:filter==='done'?t.done:!t.done);
  list.innerHTML = filtered.map(t => \`
    <li class="item \${t.done?'done':''}" id="t\${t.id}">
      <div class="checkbox" onclick="toggle(\${t.id})">\${t.done?'✓':''}</div>
      <span class="text">\${t.text}</span>
      <button class="del" onclick="remove(\${t.id})">×</button>
    </li>\`).join('');
  const active = tasks.filter(t=>!t.done).length;
  document.getElementById('counter').textContent = \`\${active}개 남음\`;
  document.getElementById('doneCount').textContent = \`완료 \${tasks.filter(t=>t.done).length}개\`;
}
function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({id: nextId++, text, done: false});
  input.value = '';
  render();
}
function toggle(id) { tasks = tasks.map(t => t.id===id ? {...t,done:!t.done} : t); render(); }
function remove(id) { tasks = tasks.filter(t => t.id!==id); render(); }
function setFilter(f, btn) { filter = f; document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); render(); }
function clearDone() { tasks = tasks.filter(t=>!t.done); render(); }
render();`,
  },
  {
    id: "timer",
    category: "인터랙티브",
    label: "포모도로 타이머",
    description: "포모도로 기법 집중 타이머",
    html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">

<div class="app" id="app">
  <div class="mode-tabs">
    <button class="mode active" onclick="setMode('focus',this)">집중</button>
    <button class="mode" onclick="setMode('short',this)">짧은 휴식</button>
    <button class="mode" onclick="setMode('long',this)">긴 휴식</button>
  </div>
  <div class="ring-wrap">
    <svg class="ring" viewBox="0 0 120 120">
      <circle class="track" cx="60" cy="60" r="52"/>
      <circle class="progress" id="prog" cx="60" cy="60" r="52" stroke-dasharray="327" stroke-dashoffset="0"/>
    </svg>
    <div class="time-center">
      <div class="time" id="display">25:00</div>
      <div class="session" id="session">세션 1</div>
    </div>
  </div>
  <div class="controls">
    <button class="btn-ctrl secondary" onclick="reset()">↺</button>
    <button class="btn-ctrl primary" id="startBtn" onclick="toggleTimer()">시작</button>
    <button class="btn-ctrl secondary" onclick="skip()">⏭</button>
  </div>
  <div class="dots" id="dots"></div>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #0d1117; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.app { text-align: center; padding: 40px 32px; transition: background .5s; border-radius: 32px; }
.mode-tabs { display: flex; gap: 4px; background: rgba(255,255,255,.05); border-radius: 12px; padding: 4px; margin-bottom: 40px; }
.mode { flex: 1; padding: 8px 12px; border: none; background: transparent; color: #64748b; font-size: 13px; font-weight: 500; cursor: pointer; border-radius: 8px; transition: all .2s; font-family: inherit; }
.mode.active { background: rgba(255,255,255,.1); color: #f1f5f9; }
.ring-wrap { position: relative; width: 220px; height: 220px; margin: 0 auto 40px; display: flex; align-items: center; justify-content: center; }
.ring { position: absolute; width: 100%; height: 100%; transform: rotate(-90deg); }
.track { fill: none; stroke: rgba(255,255,255,.06); stroke-width: 6; }
.progress { fill: none; stroke: #6366f1; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset .5s ease, stroke 1s; }
.time-center { position: relative; z-index: 1; }
.time { font-size: 3.5rem; font-weight: 300; color: #f1f5f9; letter-spacing: -.02em; }
.session { font-size: 12px; color: #64748b; margin-top: 6px; letter-spacing: .08em; text-transform: uppercase; }
.controls { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 32px; }
.btn-ctrl { border: none; cursor: pointer; font-family: inherit; transition: all .2s; }
.btn-ctrl.primary { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: 16px; font-weight: 600; box-shadow: 0 0 30px rgba(99,102,241,.4); }
.btn-ctrl.primary:hover { box-shadow: 0 0 50px rgba(99,102,241,.6); transform: scale(1.05); }
.btn-ctrl.secondary { width: 52px; height: 52px; border-radius: 50%; background: rgba(255,255,255,.07); color: #94a3b8; font-size: 18px; }
.btn-ctrl.secondary:hover { background: rgba(255,255,255,.12); color: #f1f5f9; }
.dots { display: flex; gap: 8px; justify-content: center; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.12); transition: background .3s; }
.dot.done { background: #6366f1; }`,
    js: `const MODES = { focus:{label:'집중',min:25,color:'#6366f1'}, short:{label:'짧은 휴식',min:5,color:'#22c55e'}, long:{label:'긴 휴식',min:15,color:'#f59e0b'} };
let mode='focus', remaining=25*60, running=false, timer=null, session=1, totalSessions=4;

function fmt(s){return \`\${String(Math.floor(s/60)).padStart(2,'0')}:\${String(s%60).padStart(2,'0')}\`;}
function setColor(c){document.getElementById('prog').style.stroke=c;}
function renderDots(){const d=document.getElementById('dots');d.innerHTML=Array.from({length:totalSessions},(_,i)=>\`<div class="dot \${i<session-1?'done':''}"></div>\`).join('');}
function updateRing(){const r=52,circ=2*Math.PI*r,total=MODES[mode].min*60;document.getElementById('prog').style.strokeDashoffset=circ*(1-remaining/total);}
function tick(){if(remaining>0){remaining--;document.getElementById('display').textContent=fmt(remaining);updateRing();}else{clearInterval(timer);running=false;document.getElementById('startBtn').textContent='시작';session=mode==='focus'?session+1:session;if(session>totalSessions)session=1;renderDots();}}
function toggleTimer(){if(running){clearInterval(timer);running=false;document.getElementById('startBtn').textContent='재개';}else{timer=setInterval(tick,1000);running=true;document.getElementById('startBtn').textContent='일시정지';}}
function reset(){clearInterval(timer);running=false;remaining=MODES[mode].min*60;document.getElementById('display').textContent=fmt(remaining);document.getElementById('startBtn').textContent='시작';updateRing();}
function skip(){reset();session=mode==='focus'?session+1:session;if(session>totalSessions)session=1;document.getElementById('session').textContent=\`세션 \${session}\`;renderDots();}
function setMode(m,btn){clearInterval(timer);running=false;mode=m;remaining=MODES[m].min*60;setColor(MODES[m].color);document.getElementById('display').textContent=fmt(remaining);document.getElementById('startBtn').textContent='시작';document.getElementById('session').textContent=\`세션 \${session}\`;document.querySelectorAll('.mode').forEach(b=>b.classList.remove('active'));btn.classList.add('active');updateRing();}
renderDots();updateRing();`,
  },
  // AI / 실전
  {
    id: "chat-ui",
    category: "AI / 실전",
    label: "AI 챗 UI",
    description: "Claude 스타일 AI 채팅 인터페이스",
    html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

<div class="chat-app">
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">✦ CLOID</div>
      <button class="new-chat" onclick="newChat()">+ 새 대화</button>
    </div>
    <div class="history">
      <div class="hist-item active">Python 전처리 방법</div>
      <div class="hist-item">n8n 자동화 설정</div>
      <div class="hist-item">Claude API 연동</div>
    </div>
  </aside>
  <main class="main">
    <div class="messages" id="messages"></div>
    <div class="input-area">
      <div class="input-wrap">
        <textarea id="msgInput" placeholder="메시지를 입력하세요..." rows="1" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMsg()}" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"></textarea>
        <button class="send-btn" onclick="sendMsg()">↑</button>
      </div>
      <p class="disclaimer">이것은 UI 데모입니다. 실제 AI 응답은 없습니다.</p>
    </div>
  </main>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #0a0f1e; color: #e2e8f0; height: 100vh; overflow: hidden; }
.chat-app { display: flex; height: 100vh; }
.sidebar { width: 220px; background: rgba(255,255,255,.02); border-right: 1px solid rgba(255,255,255,.06); display: flex; flex-direction: column; padding: 16px; flex-shrink: 0; }
.sidebar-header { margin-bottom: 20px; }
.logo { font-size: 1rem; font-weight: 700; color: #818cf8; margin-bottom: 12px; }
.new-chat { width: 100%; padding: 9px 12px; background: rgba(99,102,241,.15); border: 1px solid rgba(99,102,241,.3); border-radius: 10px; color: #a5b4fc; font-size: 13px; cursor: pointer; font-family: inherit; transition: all .2s; }
.new-chat:hover { background: rgba(99,102,241,.25); }
.history { display: flex; flex-direction: column; gap: 2px; }
.hist-item { padding: 9px 10px; border-radius: 8px; font-size: 12px; color: #64748b; cursor: pointer; transition: all .15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hist-item:hover { background: rgba(255,255,255,.05); color: #94a3b8; }
.hist-item.active { background: rgba(99,102,241,.12); color: #a5b4fc; }
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.msg { display: flex; gap: 12px; max-width: 720px; animation: msgIn .25s ease; }
@keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.msg.user { align-self: flex-end; flex-direction: row-reverse; }
.avatar { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.msg.ai .avatar { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.msg.user .avatar { background: rgba(255,255,255,.1); }
.bubble { padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.6; max-width: 500px; }
.msg.ai .bubble { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.07); border-radius: 4px 16px 16px 16px; color: #e2e8f0; }
.msg.user .bubble { background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; border-radius: 16px 4px 16px 16px; }
.typing { display: flex; gap: 4px; align-items: center; padding: 14px 16px; }
.dot { width: 6px; height: 6px; background: #64748b; border-radius: 50%; animation: blink 1.4s infinite; }
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes blink{0%,80%,100%{opacity:.3}40%{opacity:1}}
.input-area { padding: 16px 24px 20px; border-top: 1px solid rgba(255,255,255,.06); }
.input-wrap { position: relative; }
textarea { width: 100%; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 14px; padding: 14px 52px 14px 16px; color: #f1f5f9; font-size: 14px; font-family: inherit; resize: none; outline: none; max-height: 160px; transition: border-color .2s; line-height: 1.5; }
textarea:focus { border-color: rgba(99,102,241,.5); }
textarea::placeholder { color: #334155; }
.send-btn { position: absolute; right: 10px; bottom: 10px; width: 34px; height: 34px; border-radius: 10px; background: #6366f1; border: none; color: #fff; font-size: 16px; cursor: pointer; transition: all .2s; }
.send-btn:hover { background: #4f46e5; }
.disclaimer { font-size: 11px; color: #334155; text-align: center; margin-top: 8px; }`,
    js: `const REPLIES = ["안녕하세요! 무엇을 도와드릴까요?","Python으로 데이터를 처리하는 방법을 알려드릴게요.","CSV 파일을 pandas로 읽으려면 pd.read_csv()를 사용하세요.","n8n은 노코드 자동화 도구로 API를 연결할 수 있습니다.","Claude API를 사용하면 AI 기능을 쉽게 추가할 수 있습니다."];
let replyIdx = 0;
function addMsg(text, role) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = \`msg \${role}\`;
  div.innerHTML = \`<div class="avatar">\${role==='ai'?'✦':'👤'}</div><div class="bubble">\${text}</div>\`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function showTyping() {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ai'; div.id = 'typing';
  div.innerHTML = \`<div class="avatar">✦</div><div class="bubble"><div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>\`;
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
  return div;
}
function sendMsg() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text) return;
  addMsg(text, 'user');
  input.value = ''; input.style.height = 'auto';
  const t = showTyping();
  setTimeout(() => { t.remove(); addMsg(REPLIES[replyIdx % REPLIES.length], 'ai'); replyIdx++; }, 1200);
}
function newChat() { document.getElementById('messages').innerHTML = ''; addMsg('안녕하세요! 새 대화를 시작합니다. 무엇이 궁금하신가요?', 'ai'); }
addMsg('안녕하세요! 저는 CLOID AI입니다. 코딩, 데이터 분석, 자동화에 대해 도움드릴 수 있어요.', 'ai');`,
  },
  {
    id: "dashboard",
    category: "AI / 실전",
    label: "AI 대시보드",
    description: "데이터 시각화 대시보드",
    html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<div class="dash">
  <header class="header">
    <div class="brand">✦ Analytics Dashboard</div>
    <div class="date" id="dt"></div>
  </header>
  <div class="kpis">
    <div class="kpi"><div class="kpi-icon" style="background:rgba(99,102,241,.15);color:#818cf8">📊</div><div><div class="kpi-val">₩24.5M</div><div class="kpi-label">이번 달 매출</div></div><div class="kpi-badge up">+12.4%</div></div>
    <div class="kpi"><div class="kpi-icon" style="background:rgba(34,197,94,.15);color:#22c55e">👥</div><div><div class="kpi-val">8,342</div><div class="kpi-label">활성 사용자</div></div><div class="kpi-badge up">+5.7%</div></div>
    <div class="kpi"><div class="kpi-icon" style="background:rgba(245,158,11,.15);color:#f59e0b">⚡</div><div><div class="kpi-val">98.7%</div><div class="kpi-label">서버 가동률</div></div><div class="kpi-badge down">-0.1%</div></div>
    <div class="kpi"><div class="kpi-icon" style="background:rgba(236,72,153,.15);color:#ec4899">🤖</div><div><div class="kpi-val">142K</div><div class="kpi-label">AI 호출 수</div></div><div class="kpi-badge up">+31.2%</div></div>
  </div>
  <div class="charts">
    <div class="chart-card">
      <div class="chart-title">주간 매출 추이</div>
      <div class="bar-chart" id="barChart"></div>
    </div>
    <div class="chart-card">
      <div class="chart-title">기술 스택 분포</div>
      <div class="donut-wrap"><canvas id="donut" width="160" height="160"></canvas><div class="donut-center">AI<br>도구</div></div>
      <div class="legend" id="legend"></div>
    </div>
  </div>
</div>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #060d1a; color: #e2e8f0; padding: 20px; min-height: 100vh; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.brand { font-size: 1rem; font-weight: 700; color: #818cf8; }
.date { font-size: 12px; color: #475569; }
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px; }
.kpi { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 12px; }
.kpi-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.kpi-val { font-size: 1.2rem; font-weight: 700; color: #f1f5f9; }
.kpi-label { font-size: 11px; color: #64748b; margin-top: 2px; }
.kpi-badge { margin-left: auto; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 999px; }
.kpi-badge.up { background: rgba(34,197,94,.12); color: #22c55e; }
.kpi-badge.down { background: rgba(239,68,68,.12); color: #ef4444; }
.charts { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media(max-width:600px){.charts{grid-template-columns:1fr}}
.chart-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 16px; padding: 20px; }
.chart-title { font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 20px; letter-spacing: .04em; }
.bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
.bar { width: 100%; border-radius: 4px 4px 0 0; min-height: 8px; transition: opacity .2s; cursor: pointer; }
.bar:hover { opacity: .8; }
.bar-label { font-size: 10px; color: #475569; }
.donut-wrap { position: relative; display: flex; justify-content: center; margin-bottom: 16px; }
.donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 11px; font-weight: 700; color: #94a3b8; text-align: center; line-height: 1.4; }
.legend { display: flex; flex-wrap: wrap; gap: 8px 16px; }
.leg { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #64748b; }
.leg-dot { width: 8px; height: 8px; border-radius: 2px; }`,
    js: `document.getElementById('dt').textContent = new Date().toLocaleDateString('ko-KR', {year:'numeric',month:'long',day:'numeric',weekday:'long'});
const weekly = [68,82,55,91,78,95,72];
const days = ['월','화','수','목','금','토','일'];
const maxV = Math.max(...weekly);
const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#22c55e','#06b6d4','#a78bfa'];
const bc = document.getElementById('barChart');
bc.innerHTML = weekly.map((v,i) => \`<div class="bar-col"><div class="bar" style="height:\${v/maxV*100}%;background:\${colors[i]};opacity:.85;" title="\${v}만원"></div><div class="bar-label">\${days[i]}</div></div>\`).join('');
const data = [{label:'Claude',val:35,color:'#6366f1'},{label:'Python',val:28,color:'#8b5cf6'},{label:'n8n',val:20,color:'#ec4899'},{label:'기타',val:17,color:'#475569'}];
const canvas = document.getElementById('donut');
const ctx = canvas.getContext('2d');
let start = -Math.PI/2;
const total = data.reduce((s,d)=>s+d.val,0);
data.forEach(d => {
  const slice = (d.val/total)*2*Math.PI;
  ctx.beginPath(); ctx.moveTo(80,80);
  ctx.arc(80,80,70,start,start+slice); ctx.closePath();
  ctx.fillStyle = d.color; ctx.fill();
  start += slice;
});
ctx.beginPath(); ctx.arc(80,80,44,0,2*Math.PI); ctx.fillStyle='#0a1020'; ctx.fill();
document.getElementById('legend').innerHTML = data.map(d => \`<div class="leg"><div class="leg-dot" style="background:\${d.color}"></div>\${d.label} \${d.val}%</div>\`).join('');`,
  },
  {
    id: "darkmode",
    category: "AI / 실전",
    label: "다크모드 토글",
    description: "부드러운 테마 전환 UI",
    html: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<div class="page" id="page">
  <nav class="nav">
    <div class="brand">✦ CLOID</div>
    <div class="nav-links">
      <a href="#">홈</a><a href="#">소개</a><a href="#">문서</a>
    </div>
    <button class="toggle" id="toggle" onclick="switchTheme()" title="테마 전환">
      <span class="icon" id="icon">🌙</span>
      <span class="track"><span class="thumb" id="thumb"></span></span>
    </button>
  </nav>
  <main class="content">
    <h1 class="heading">다크모드 <span class="hl">토글</span> 예제</h1>
    <p class="desc">버튼을 클릭하면 라이트/다크 테마가 부드럽게 전환됩니다. CSS 변수와 JavaScript로 구현합니다.</p>
    <div class="cards">
      <div class="c-card"><div class="c-icon">🎨</div><h3>CSS 변수</h3><p>--bg, --text 등 변수로 테마를 관리합니다.</p></div>
      <div class="c-card"><div class="c-icon">⚡</div><h3>빠른 전환</h3><p>transition으로 모든 요소가 부드럽게 바뀝니다.</p></div>
      <div class="c-card"><div class="c-icon">💾</div><h3>상태 저장</h3><p>localStorage로 설정을 기억합니다.</p></div>
    </div>
    <button class="cta" onclick="switchTheme()">테마 전환해보기</button>
  </main>
</div>`,
    css: `:root { --bg:#050810; --surface:rgba(255,255,255,.04); --border:rgba(255,255,255,.08); --text:#e2e8f0; --muted:#64748b; --brand:#818cf8; }
.light { --bg:#f8fafc; --surface:#fff; --border:rgba(0,0,0,.08); --text:#1e293b; --muted:#94a3b8; --brand:#6366f1; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter',sans-serif; transition:background .4s; background:var(--bg); }
.page { min-height:100vh; background:var(--bg); transition:background .4s; }
.nav { display:flex; align-items:center; padding:16px 32px; border-bottom:1px solid var(--border); gap:16px; }
.brand { font-size:1rem; font-weight:700; color:var(--brand); }
.nav-links { display:flex; gap:20px; margin-left:auto; }
.nav-links a { font-size:14px; color:var(--muted); text-decoration:none; transition:color .2s; }
.nav-links a:hover { color:var(--text); }
.toggle { display:flex; align-items:center; gap:8px; background:none; border:none; cursor:pointer; margin-left:12px; }
.icon { font-size:16px; }
.track { width:40px; height:22px; background:var(--border); border-radius:999px; position:relative; transition:background .3s; border:1px solid var(--border); }
.light .track { background:rgba(99,102,241,.3); }
.thumb { position:absolute; top:2px; left:2px; width:16px; height:16px; background:var(--brand); border-radius:50%; transition:transform .3s; }
.light .thumb { transform:translateX(18px); }
.content { max-width:680px; margin:0 auto; padding:60px 24px; }
.heading { font-size:2.2rem; font-weight:700; color:var(--text); margin-bottom:16px; line-height:1.2; }
.hl { color:var(--brand); }
.desc { font-size:15px; color:var(--muted); line-height:1.8; margin-bottom:40px; }
.cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:16px; margin-bottom:36px; }
.c-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:20px; transition:all .3s; }
.c-icon { font-size:1.5rem; margin-bottom:10px; }
.c-card h3 { font-size:14px; font-weight:600; color:var(--text); margin-bottom:6px; }
.c-card p { font-size:12px; color:var(--muted); line-height:1.6; }
.cta { background:var(--brand); border:none; border-radius:12px; padding:13px 28px; color:#fff; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; transition:opacity .2s; }
.cta:hover { opacity:.85; }`,
    js: `function switchTheme() {
  const page = document.getElementById('page');
  page.classList.toggle('light');
  const isLight = page.classList.contains('light');
  document.getElementById('icon').textContent = isLight ? '☀️' : '🌙';
  document.body.style.background = isLight ? '#f8fafc' : '#050810';
}`,
  },
];

const CHALLENGES: Challenge[] = [
  {
    id: "bg-toggle",
    label: "배경색 사이클",
    difficulty: "easy",
    description: `버튼을 클릭할 때마다 배경색이\n보라 → 파랑 → 초록 → 분홍 → 보라 순으로 순환하는 페이지를 만드세요.\n현재 색상 이름도 표시해야 합니다.`,
    hint: "colors 배열과 index 변수를 만들어 클릭마다 index를 증가시키고 % colors.length로 순환시키세요.",
    starterHtml: `<div id="box">\n  <h1 id="colorName">보라</h1>\n  <button onclick="changeColor()">색 바꾸기</button>\n</div>`,
    starterCss: `body { margin:0; font-family:sans-serif; }\n#box { min-height:100vh; background:#6366f1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; transition:background .5s; }\nh1 { color:white; font-size:2rem; }\nbutton { padding:12px 28px; border:2px solid white; background:transparent; color:white; border-radius:999px; font-size:16px; cursor:pointer; }`,
    starterJs: `const colors = [\n  {name:'보라', hex:'#6366f1'},\n  // 여기에 파랑, 초록, 분홍 추가\n];\nlet idx = 0;\n\nfunction changeColor() {\n  // 여기에 코드 작성\n}`,
  },
  {
    id: "live-search",
    label: "실시간 검색 필터",
    difficulty: "medium",
    description: `아래 항목 목록에서 검색창에 타이핑하면\n실시간으로 관련 항목만 표시되는 필터를 만드세요.\n일치하는 텍스트는 하이라이트 표시해야 합니다.`,
    hint: "input 이벤트로 filter()와 includes()를 사용하세요. 하이라이트는 replace()와 <mark> 태그로 구현합니다.",
    starterHtml: `<div class="wrap">\n  <input type="text" id="search" placeholder="검색..." oninput="filterItems()">\n  <div id="count"></div>\n  <ul id="list"></ul>\n</div>`,
    starterCss: `body { font-family:sans-serif; background:#0f172a; color:#e2e8f0; padding:40px; }\n.wrap { max-width:400px; margin:0 auto; }\ninput { width:100%; padding:12px 16px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:12px; color:#f1f5f9; font-size:14px; outline:none; margin-bottom:12px; }\n#count { font-size:12px; color:#64748b; margin-bottom:12px; }\nul { list-style:none; padding:0; display:flex; flex-direction:column; gap:6px; }\nli { padding:12px 16px; background:rgba(255,255,255,.04); border-radius:10px; font-size:14px; }\nmark { background:#6366f1; color:#fff; border-radius:3px; padding:0 2px; }`,
    starterJs: `const items = ['Python 기초 문법','데이터 전처리 실습','Claude API 연동','n8n 자동화 설정','AI 챗봇 만들기','JavaScript 이벤트','CSS 애니메이션','HTML 폼 디자인','React 컴포넌트','FastAPI 서버 구축'];\n\nfunction filterItems() {\n  const q = document.getElementById('search').value.toLowerCase();\n  // 여기에 필터링 코드 작성\n}\nfilterItems();`,
  },
  {
    id: "stopwatch",
    label: "스톱워치",
    difficulty: "medium",
    description: `시작/정지/리셋 기능이 있는 스톱워치를 만드세요.\n- 00:00.00 형식 (분:초.밀리초)\n- 랩 기록 버튼으로 현재 시간 저장\n- 랩 목록 표시`,
    hint: "setInterval(fn, 10)으로 10ms마다 갱신합니다. Date.now()로 경과 시간을 계산하세요.",
    starterHtml: `<div class="sw">\n  <div class="display" id="display">00:00.00</div>\n  <div class="btns">\n    <button id="startBtn" onclick="toggle()">시작</button>\n    <button onclick="lap()">랩</button>\n    <button onclick="reset()">리셋</button>\n  </div>\n  <ul id="laps"></ul>\n</div>`,
    starterCss: `body { font-family:sans-serif; background:#111827; color:#f9fafb; display:flex; align-items:center; justify-content:center; min-height:100vh; }\n.sw { text-align:center; }\n.display { font-size:4rem; font-weight:200; letter-spacing:.04em; margin-bottom:32px; }\n.btns { display:flex; gap:12px; justify-content:center; margin-bottom:24px; }\nbutton { padding:12px 24px; border-radius:999px; border:1px solid rgba(255,255,255,.2); background:rgba(255,255,255,.08); color:#fff; font-size:14px; cursor:pointer; }\n#laps { list-style:none; padding:0; }\n#laps li { padding:8px 0; border-top:1px solid rgba(255,255,255,.08); font-size:14px; color:#94a3b8; }`,
    starterJs: `let running = false, start = 0, elapsed = 0, timer = null, lapCount = 0;\n\nfunction fmt(ms) {\n  const m = Math.floor(ms/60000);\n  const s = Math.floor((ms%60000)/1000);\n  const cs = Math.floor((ms%1000)/10);\n  return \`\${String(m).padStart(2,'0')}:\${String(s).padStart(2,'0')}.\${String(cs).padStart(2,'0')}\`;\n}\nfunction toggle() { /* 여기에 코드 */ }\nfunction lap() { /* 여기에 코드 */ }\nfunction reset() { /* 여기에 코드 */ }`,
  },
  {
    id: "gradient-gen",
    label: "그라디언트 생성기",
    difficulty: "easy",
    description: `두 색상을 선택하면 그라디언트 배경이 실시간으로 미리보기되고,\nCSS 코드를 복사할 수 있는 도구를 만드세요.`,
    hint: "input[type=color]로 색상을 받고, oninput 이벤트로 배경을 업데이트합니다. navigator.clipboard.writeText()로 복사합니다.",
    starterHtml: `<div class="gen">\n  <div class="preview" id="preview"></div>\n  <div class="controls">\n    <label>색상 1 <input type="color" id="c1" value="#6366f1" oninput="update()"></label>\n    <label>색상 2 <input type="color" id="c2" value="#ec4899" oninput="update()"></label>\n    <select id="dir" onchange="update()">\n      <option value="to right">→ 가로</option>\n      <option value="to bottom">↓ 세로</option>\n      <option value="135deg">↘ 대각선</option>\n    </select>\n  </div>\n  <div class="code" id="code"></div>\n  <button onclick="copy()">CSS 복사</button>\n</div>`,
    starterCss: `body { font-family:sans-serif; background:#0f172a; color:#e2e8f0; padding:32px; }\n.gen { max-width:480px; margin:0 auto; }\n.preview { height:200px; border-radius:16px; margin-bottom:20px; }\n.controls { display:flex; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:16px; }\nlabel { display:flex; align-items:center; gap:8px; font-size:14px; }\ninput[type=color] { width:44px; height:32px; border:none; border-radius:6px; cursor:pointer; }\nselect { padding:8px 12px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.1); border-radius:8px; color:#e2e8f0; }\n.code { font-family:monospace; font-size:12px; padding:12px; background:rgba(255,255,255,.04); border-radius:10px; color:#94a3b8; margin-bottom:12px; word-break:break-all; }\nbutton { padding:10px 20px; background:#6366f1; border:none; border-radius:8px; color:#fff; cursor:pointer; }`,
    starterJs: `function update() {\n  // c1, c2, dir 값을 읽어 preview에 그라디언트 적용\n  // code 영역에 CSS 코드 표시\n}\nfunction copy() {\n  // CSS 코드를 클립보드에 복사\n}\nupdate();`,
  },
  {
    id: "typewriter",
    label: "타이핑 애니메이션",
    difficulty: "hard",
    description: `여러 문장이 순서대로 타이핑되었다가 지워지고\n다음 문장이 나타나는 타이핑 효과를 구현하세요.\n커서 깜빡임 효과도 포함해야 합니다.`,
    hint: "setTimeout 재귀 호출로 한 글자씩 추가/삭제합니다. 타이핑 속도와 삭제 속도를 다르게 설정하세요.",
    starterHtml: `<div class="scene">\n  <p class="prefix">나는</p>\n  <p class="typed"><span id="text"></span><span class="cursor">|</span></p>\n</div>`,
    starterCss: `body { font-family:sans-serif; background:#050810; display:flex; align-items:center; justify-content:center; min-height:100vh; }\n.scene { text-align:center; }\n.prefix { font-size:1.4rem; color:#64748b; margin-bottom:8px; }\n.typed { font-size:2.8rem; font-weight:700; color:#f1f5f9; }\n#text { background:linear-gradient(135deg,#818cf8,#c084fc); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }\n.cursor { color:#818cf8; animation:blink 1s infinite; }\n@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`,
    starterJs: `const phrases = ['AI 개발자입니다.','Python을 좋아합니다.','자동화를 만듭니다.','미래를 코딩합니다.'];\nlet pIdx=0, cIdx=0, deleting=false;\n\nfunction type() {\n  const el = document.getElementById('text');\n  const phrase = phrases[pIdx];\n  // 여기에 타이핑/삭제 로직 구현\n  // deleting=false면 한 글자 추가, true면 한 글자 삭제\n  // 완성되면 잠시 후 deleting=true, 다 지우면 다음 구문으로\n}\ntype();`,
  },
];

function validateHTML(code: string): string | null {
  if (!code.trim()) return null;
  try {
    const selfClosing = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
    const openTags = code.match(/<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*(?<!\/)>/g) || [];
    const closeTags = code.match(/<\/([a-zA-Z][a-zA-Z0-9]*)\s*>/g) || [];
    const stack: string[] = [];
    for (const tag of openTags) {
      const name = tag.match(/<([a-zA-Z][a-zA-Z0-9]*)/)?.[1]?.toLowerCase();
      if (name && !selfClosing.has(name)) stack.push(name);
    }
    for (const tag of closeTags) {
      const name = tag.match(/<\/([a-zA-Z][a-zA-Z0-9]*)/)?.[1]?.toLowerCase();
      if (name) { const idx = stack.lastIndexOf(name); if (idx !== -1) stack.splice(idx, 1); }
    }
    return stack.length > 0 ? `Unclosed tag(s): <${stack.join(">, <")}>` : null;
  } catch { return null; }
}

function validateCSS(code: string): string | null {
  if (!code.trim()) return null;
  const opens = (code.match(/{/g) || []).length;
  const closes = (code.match(/}/g) || []).length;
  return opens !== closes ? `Mismatched braces: ${opens} opening, ${closes} closing` : null;
}

function validateJS(code: string): string | null {
  if (!code.trim()) return null;
  try { new Function(code); return null; }
  catch (e) { return (e as SyntaxError).message?.slice(0, 120) || "JavaScript syntax error"; }
}

const DIFFICULTY_STYLE: Record<Challenge["difficulty"], string> = {
  easy:   "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  hard:   "border-rose-500/30 bg-rose-500/10 text-rose-300",
};
const DIFFICULTY_LABEL: Record<Challenge["difficulty"], string> = {
  easy: "쉬움", medium: "보통", hard: "어려움",
};

export default function HTMLPreview() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("html");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [mode, setMode] = useState<"templates" | "challenges">("templates");
  const [activeCategory, setActiveCategory] = useState<string>("기본 UI");
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [autoPreview, setAutoPreview] = useState(true);
  const autoPreviewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const surfaceHeightClass = fullscreen ? "flex-1 min-h-0" : "h-52 sm:h-56";

  const buildDocument = useCallback((h: string, c: string, j: string) => `<!DOCTYPE html>
<html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${c}</style></head><body>${h}<script>${j}<\/script></body></html>`, []);

  // Auto-preview with debounce
  useEffect(() => {
    if (!autoPreview) return;
    if (!html.trim() && !css.trim() && !js.trim()) return;
    if (autoPreviewTimer.current) clearTimeout(autoPreviewTimer.current);
    autoPreviewTimer.current = setTimeout(() => {
      setPreview(buildDocument(html, css, js));
    }, 600);
    return () => { if (autoPreviewTimer.current) clearTimeout(autoPreviewTimer.current); };
  }, [html, css, js, autoPreview, buildDocument]);

  // Syntax validation
  useEffect(() => {
    const timer = setTimeout(() => {
      let err: string | null = null;
      if (activeTab === "html") err = validateHTML(html);
      else if (activeTab === "css") err = validateCSS(css);
      else err = validateJS(js);
      setSyntaxError(err);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab, html, css, js]);

  const currentCode = activeTab === "html" ? html : activeTab === "css" ? css : js;
  const setCurrentCode = activeTab === "html" ? setHtml : activeTab === "css" ? setCss : setJs;

  function loadTemplate(t: Template) {
    setHtml(t.html); setCss(t.css); setJs(t.js);
    setActiveChallenge(null);
    setPreview(buildDocument(t.html, t.css, t.js));
  }

  function loadChallenge(ch: Challenge) {
    setActiveChallenge(ch);
    setHtml(ch.starterHtml); setCss(ch.starterCss); setJs(ch.starterJs);
    setPreview(buildDocument(ch.starterHtml, ch.starterCss, ch.starterJs));
  }

  const handleDownload = useCallback(() => {
    const src = preview || buildDocument(html, css, js);
    if (!src.trim()) return;
    const blob = new Blob([src], { type: "text/html; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `cloid-preview-${Date.now()}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }, [buildDocument, html, css, js, preview]);

  const handleCopy = useCallback(async () => {
    if (!currentCode.trim()) return;
    await navigator.clipboard.writeText(currentCode);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }, [currentCode]);

  const handleClear = useCallback(() => {
    setHtml(""); setCss(""); setJs(""); setPreview(""); setSyntaxError(null); setActiveChallenge(null);
  }, []);

  const tabs: { key: TabType; label: string; placeholder: string }[] = [
    { key: "html", label: "HTML", placeholder: '<div class="container">\n  <h1>Hello World</h1>\n</div>' },
    { key: "css",  label: "CSS",  placeholder: '.container {\n  padding: 20px;\n  font-family: sans-serif;\n}' },
    { key: "js",   label: "JS",   placeholder: 'document.querySelector("h1")\n  .addEventListener("click", () => {\n    alert("Hello!");\n  });' },
  ];

  return (
    <>
      {fullscreen && <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setFullscreen(false)} />}
      <div className={`rounded-xl border border-amber-800/40 overflow-hidden transition-all ${fullscreen ? "fixed inset-4 z-50 shadow-2xl border-amber-600/60 bg-[#0f1117] flex flex-col" : "bg-gradient-to-br from-amber-950/20 to-slate-900/60"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-amber-800/30 bg-amber-950/20">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-white">{t.labs.code_preview_title}</h2>
            <span className="text-[10px] text-amber-400 bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-700/50">HTML+CSS+JS</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoPreview(v => !v)}
              title="자동 미리보기 토글"
              className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border transition-colors ${autoPreview ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-slate-700 text-slate-500 hover:text-slate-300"}`}
            >
              <Zap size={10} /> {autoPreview ? "자동" : "수동"}
            </button>
            <button onClick={() => setFullscreen(v => !v)} className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 transition-colors">
              {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        <div className={`p-4 ${fullscreen ? "flex-1 flex flex-col min-h-0 overflow-hidden" : ""}`}>

          {/* 탭 */}
          <div className="mb-3 flex gap-1 border-b border-slate-800 pb-2">
            <button onClick={() => setMode("templates")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-medium transition-colors ${mode === "templates" ? "bg-amber-900/30 text-amber-300 border border-amber-700/40 border-b-transparent" : "text-slate-500 hover:text-slate-300"}`}>
              <BookOpen size={12} /> 템플릿
            </button>
            <button onClick={() => setMode("challenges")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-medium transition-colors ${mode === "challenges" ? "bg-rose-900/30 text-rose-300 border border-rose-700/40 border-b-transparent" : "text-slate-500 hover:text-slate-300"}`}>
              <FlaskConical size={12} /> 과제
            </button>
          </div>

          {/* 템플릿 */}
          {mode === "templates" && (
            <div className="mb-3 space-y-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full border transition-all ${activeCategory === cat ? "border-amber-600/60 bg-amber-900/30 text-amber-200" : "border-slate-700 text-slate-500 hover:text-slate-300"}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.filter(t => t.category === activeCategory).map(tmpl => (
                  <button key={tmpl.id} onClick={() => loadTemplate(tmpl)}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left transition-all hover:border-amber-600/40 hover:bg-amber-950/20 hover:-translate-y-0.5 group">
                    <div className="text-xs font-semibold text-white mb-1">{tmpl.label}</div>
                    <div className="text-[10px] text-slate-500 leading-4 group-hover:text-slate-400">{tmpl.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 과제 */}
          {mode === "challenges" && (
            <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {CHALLENGES.map(ch => (
                <button key={ch.id} onClick={() => loadChallenge(ch)}
                  className={`rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 ${activeChallenge?.id === ch.id ? "border-rose-600/50 bg-rose-950/30" : "border-slate-800 bg-slate-900/50 hover:border-slate-700"}`}>
                  <div className="mb-1.5 flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-white">{ch.label}</span>
                    <span className={`rounded-full border px-1.5 py-0.5 text-[9px] ${DIFFICULTY_STYLE[ch.difficulty]}`}>{DIFFICULTY_LABEL[ch.difficulty]}</span>
                  </div>
                  <p className="text-[10px] leading-4 text-slate-500 line-clamp-2">{ch.description.split("\n")[0]}</p>
                </button>
              ))}
            </div>
          )}

          {/* 과제 설명 */}
          {activeChallenge && (
            <div className="mb-3 rounded-xl border border-rose-700/30 bg-rose-950/20 p-3 text-xs">
              <div className="mb-2 flex items-center gap-1.5 font-semibold text-rose-300">
                <FlaskConical size={12} /> {activeChallenge.label}
                <span className={`ml-1 rounded-full border px-1.5 py-0.5 text-[9px] ${DIFFICULTY_STYLE[activeChallenge.difficulty]}`}>{DIFFICULTY_LABEL[activeChallenge.difficulty]}</span>
              </div>
              <p className="mb-2 whitespace-pre-line leading-5 text-slate-300">{activeChallenge.description}</p>
              <div className="flex items-start gap-1.5 text-rose-400/70">
                <ChevronRight size={11} className="mt-0.5 shrink-0" />
                <span className="leading-4">{activeChallenge.hint}</span>
              </div>
            </div>
          )}

          {/* 에디터 + 미리보기 */}
          <div className={`grid gap-3 ${fullscreen ? "grid-cols-2 flex-1 min-h-0" : "grid-cols-1 lg:grid-cols-2"}`}>
            <div className={`flex flex-col gap-2 rounded-xl border border-slate-800/70 bg-slate-950/30 p-3 ${fullscreen ? "min-h-0" : ""}`}>
              {/* 탭 바 */}
              <div className="flex items-center justify-between min-h-9">
                <div className="flex gap-1">
                  {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} aria-pressed={activeTab === tab.key}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === tab.key ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={handleCopy} disabled={!currentCode.trim()} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-40 transition-colors">
                    {copied ? <><Check size={11} className="text-emerald-400" /> {t.common.copied}</> : <><Copy size={11} /> {t.common.copy}</>}
                  </button>
                  <button onClick={handleClear} disabled={!html.trim() && !css.trim() && !js.trim()} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 disabled:opacity-40 transition-colors">
                    <X size={11} /> {t.labs.clear_all}
                  </button>
                </div>
              </div>

              <textarea
                value={currentCode}
                onChange={e => setCurrentCode(e.target.value)}
                placeholder={tabs.find(tab => tab.key === activeTab)?.placeholder}
                className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs font-mono leading-5 placeholder-slate-700 focus:outline-none focus:border-amber-500 transition-colors resize-none ${activeTab === "html" ? "text-emerald-300" : activeTab === "css" ? "text-blue-300" : "text-yellow-300"} ${surfaceHeightClass}`}
                spellCheck={false}
              />

              {syntaxError && (
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 text-xs">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span className="break-all leading-relaxed">{syntaxError}</span>
                </div>
              )}

              <div className="flex gap-2">
                {!autoPreview && (
                  <button onClick={() => setPreview(buildDocument(html, css, js))} disabled={!html.trim() && !css.trim() && !js.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium rounded-lg transition-colors">
                    <Eye size={13} /> {t.labs.run_preview}
                  </button>
                )}
                <button onClick={handleDownload} disabled={!html.trim() && !css.trim() && !js.trim()}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-700 bg-slate-900/70 hover:bg-slate-800 disabled:opacity-40 text-slate-200 text-xs font-medium rounded-lg transition-colors flex-1">
                  <Download size={13} /> {t.labs.download}
                </button>
              </div>

              <div className="flex gap-2 text-[10px]">
                {tabs.map(tab => {
                  const val = tab.key === "html" ? html : tab.key === "css" ? css : js;
                  return (
                    <span key={tab.key} className={`flex items-center gap-1 ${val.trim() ? "text-emerald-400" : "text-slate-600"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${val.trim() ? "bg-emerald-400" : "bg-slate-700"}`} />
                      {tab.label}
                    </span>
                  );
                })}
                {autoPreview && <span className="ml-auto text-amber-500/60 flex items-center gap-1"><Zap size={9} /> 자동</span>}
              </div>
            </div>

            <div className={`flex flex-col gap-2 rounded-xl border border-slate-800/70 bg-slate-950/30 p-3 ${fullscreen ? "min-h-0" : ""}`}>
              <div className="flex min-h-9 items-center justify-between">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5"><Eye size={11} /> {t.labs.live_preview}</span>
                {preview && (
                  <button onClick={handleDownload} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-amber-500 hover:text-amber-300 hover:bg-amber-900/20 transition-colors">
                    <Download size={11} /> {t.labs.save_as_html}
                  </button>
                )}
              </div>
              {preview ? (
                <iframe srcDoc={preview} sandbox="allow-scripts" title={t.labs.code_preview_title}
                  className={`w-full rounded-lg border border-slate-600 bg-white ${surfaceHeightClass}`} />
              ) : (
                <div className={`w-full rounded-lg border border-dashed border-slate-700 bg-slate-950/50 flex flex-col items-center justify-center gap-2 ${surfaceHeightClass}`}>
                  <Eye size={24} className="text-slate-700" />
                  <p className="text-xs text-slate-600 text-center px-4">{t.labs.preview_empty_hint}</p>
                </div>
              )}
              <div className="min-h-4" />
            </div>
          </div>

          <p className={`text-[10px] text-slate-600 ${fullscreen ? "mt-1" : "mt-3"}`}>{t.labs.preview_footer}</p>
        </div>
      </div>
    </>
  );
}

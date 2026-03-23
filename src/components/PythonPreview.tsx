"use client";

import { useState, useRef, useCallback } from "react";
import {
  Terminal, Play, Loader2, Copy, Check, X,
  Maximize2, Minimize2, AlertTriangle, Download, ExternalLink,
  FlaskConical, BookOpen, ChevronRight,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

type Example = { label: string; category: string; code: string };
type Challenge = {
  id: string;
  label: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  hint: string;
  expectedOutput: string;
};

const EXAMPLE_CATEGORIES = ["기초", "데이터", "AI 실습", "알고리즘"] as const;

const EXAMPLES: Example[] = [
  // 기초
  {
    category: "기초",
    label: "Hello World",
    code: 'name = "CLOID"\nprint(f"안녕하세요, {name}!")\nprint("Python 실습을 시작합니다.")',
  },
  {
    category: "기초",
    label: "조건문",
    code: `score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"점수: {score}점 → 등급: {grade}")`,
  },
  {
    category: "기초",
    label: "반복문",
    code: `# for 반복문
fruits = ["사과", "바나나", "포도", "딸기"]
for i, fruit in enumerate(fruits, 1):
    print(f"{i}. {fruit}")

# while 반복문
print("\\n카운트다운:")
n = 5
while n > 0:
    print(n, end=" ")
    n -= 1
print("🚀")`,
  },
  {
    category: "기초",
    label: "함수",
    code: `def greet(name, lang="ko"):
    if lang == "ko":
        return f"안녕하세요, {name}님!"
    return f"Hello, {name}!"

def calc_bmi(weight, height_cm):
    h = height_cm / 100
    bmi = weight / (h ** 2)
    status = "정상" if 18.5 <= bmi < 25 else ("과체중" if bmi >= 25 else "저체중")
    return round(bmi, 1), status

print(greet("김철수"))
print(greet("Alice", "en"))

bmi, status = calc_bmi(70, 175)
print(f"BMI: {bmi} → {status}")`,
  },
  // 데이터
  {
    category: "데이터",
    label: "리스트 처리",
    code: `scores = [92, 78, 85, 61, 95, 73, 88, 54, 90, 67]

total = sum(scores)
avg = total / len(scores)
passed = [s for s in scores if s >= 70]

print(f"전체 점수: {scores}")
print(f"평균: {avg:.1f}점")
print(f"최고: {max(scores)}점  최저: {min(scores)}점")
print(f"합격자 수: {len(passed)}명 / {len(scores)}명")
print(f"합격률: {len(passed)/len(scores)*100:.0f}%")`,
  },
  {
    category: "데이터",
    label: "딕셔너리 분석",
    code: `employees = [
    {"name": "김민서", "dept": "개발", "salary": 52000000},
    {"name": "이준호", "dept": "마케팅", "salary": 45000000},
    {"name": "박소연", "dept": "개발", "salary": 48000000},
    {"name": "최태양", "dept": "마케팅", "salary": 43000000},
    {"name": "정하린", "dept": "개발", "salary": 55000000},
]

dept_totals = {}
for emp in employees:
    dept = emp["dept"]
    dept_totals[dept] = dept_totals.get(dept, 0) + emp["salary"]

print("부서별 평균 연봉:")
for dept, total in dept_totals.items():
    count = sum(1 for e in employees if e["dept"] == dept)
    print(f"  {dept}: {total//count:,}원")`,
  },
  {
    category: "데이터",
    label: "CSV 처리",
    code: `import csv
import io

raw = """name,score,grade
김민서,92,A
이준호,78,B
박소연,85,B
최태양,61,D
정하린,95,A"""

reader = csv.DictReader(io.StringIO(raw))
rows = list(reader)

print(f"총 {len(rows)}명의 데이터")
print("-" * 30)
for row in rows:
    bar = "█" * (int(row["score"]) // 10)
    print(f"{row['name']:6} {row['score']:3}점 {bar}")

avg = sum(int(r["score"]) for r in rows) / len(rows)
print(f"\\n평균: {avg:.1f}점")`,
  },
  {
    category: "데이터",
    label: "통계 계산",
    code: `data = [23, 45, 12, 67, 34, 89, 45, 23, 56, 78, 45, 34, 12, 90, 67]

# 수동 통계 계산
n = len(data)
mean = sum(data) / n
variance = sum((x - mean) ** 2 for x in data) / n
std_dev = variance ** 0.5

sorted_data = sorted(data)
median = sorted_data[n // 2] if n % 2 else (sorted_data[n//2-1] + sorted_data[n//2]) / 2

freq = {}
for x in data:
    freq[x] = freq.get(x, 0) + 1
mode = max(freq, key=freq.get)

print(f"데이터: {sorted_data}")
print(f"평균(mean):   {mean:.2f}")
print(f"중앙값(median): {median}")
print(f"최빈값(mode):  {mode} ({freq[mode]}회)")
print(f"표준편차(std): {std_dev:.2f}")`,
  },
  // AI 실습
  {
    category: "AI 실습",
    label: "텍스트 분석",
    code: `text = """
인공지능(AI)은 인간의 학습, 추론, 인식 능력을 컴퓨터로 구현한 기술입니다.
머신러닝은 AI의 한 분야로, 데이터로부터 패턴을 학습합니다.
딥러닝은 머신러닝의 하위 분야로, 신경망을 사용합니다.
자연어처리(NLP)는 AI가 인간 언어를 이해하는 기술입니다.
"""

words = text.split()
sentences = [s.strip() for s in text.split(".") if s.strip()]

word_freq = {}
for word in words:
    clean = word.strip(".,()").lower()
    if len(clean) > 1:
        word_freq[clean] = word_freq.get(clean, 0) + 1

top5 = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]

print(f"총 단어 수: {len(words)}")
print(f"총 문장 수: {len(sentences)}")
print("\\n상위 5개 단어:")
for word, count in top5:
    print(f"  {word}: {count}회")`,
  },
  {
    category: "AI 실습",
    label: "프롬프트 빌더",
    code: `def build_prompt(role, task, context="", format_hint=""):
    parts = [f"당신은 {role}입니다."]
    if context:
        parts.append(f"\\n배경: {context}")
    parts.append(f"\\n작업: {task}")
    if format_hint:
        parts.append(f"\\n출력 형식: {format_hint}")
    return "\\n".join(parts)

# 예시 1: 번역 프롬프트
p1 = build_prompt(
    role="전문 번역가",
    task="아래 한국어 문장을 자연스러운 영어로 번역하세요.",
    format_hint="번역문만 출력"
)

# 예시 2: 코드 리뷰 프롬프트
p2 = build_prompt(
    role="시니어 Python 개발자",
    task="아래 코드의 문제점과 개선 방안을 알려주세요.",
    context="Python 초보자가 작성한 코드입니다.",
    format_hint="1. 문제점\\n2. 개선 코드\\n3. 설명"
)

for i, p in enumerate([p1, p2], 1):
    print(f"=== 프롬프트 {i} ===")
    print(p)
    print()`,
  },
  // 알고리즘
  {
    category: "알고리즘",
    label: "정렬 비교",
    code: `import random

def bubble_sort(arr):
    a = arr[:]
    n = len(a)
    for i in range(n):
        for j in range(n - i - 1):
            if a[j] > a[j+1]:
                a[j], a[j+1] = a[j+1], a[j]
    return a

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    mid  = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)

data = [64, 34, 25, 12, 22, 11, 90, 45, 73, 8]
print(f"원본:    {data}")
print(f"버블정렬: {bubble_sort(data)}")
print(f"퀵정렬:  {quick_sort(data)}")
print(f"내장정렬: {sorted(data)}")`,
  },
  {
    category: "알고리즘",
    label: "재귀 & 메모이제이션",
    code: `import time

# 일반 재귀 (느림)
def fib_slow(n):
    if n <= 1: return n
    return fib_slow(n-1) + fib_slow(n-2)

# 메모이제이션 (빠름)
memo = {}
def fib_fast(n):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib_fast(n-1) + fib_fast(n-2)
    return memo[n]

# 비교
for n in [10, 20, 30]:
    t1 = time.time()
    r1 = fib_slow(n)
    d1 = time.time() - t1

    t2 = time.time()
    r2 = fib_fast(n)
    d2 = time.time() - t2

    print(f"fib({n:2}) = {r1:7}  일반: {d1:.4f}s  메모: {d2:.6f}s  속도향상: {d1/(d2+1e-9):.0f}x")`,
  },
];

const CHALLENGES: Challenge[] = [
  {
    id: "fizzbuzz",
    label: "FizzBuzz",
    difficulty: "easy",
    description: `1부터 30까지 숫자를 출력하되:\n- 3의 배수면 "Fizz"\n- 5의 배수면 "Buzz"\n- 15의 배수면 "FizzBuzz"\n- 나머지는 숫자 그대로 출력하세요.`,
    hint: "% (나머지) 연산자를 활용하세요. 15의 배수 조건을 먼저 체크해야 합니다.",
    expectedOutput: `1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz
11 Fizz 13 14 FizzBuzz 16 17 Fizz 19 Buzz
Fizz 22 23 Fizz Buzz 26 Fizz 28 29 FizzBuzz`,
  },
  {
    id: "word-count",
    label: "단어 빈도 세기",
    difficulty: "easy",
    description: `아래 문장에서 각 단어가 몇 번 등장하는지 세고,\n많이 나온 순서대로 출력하세요.\n\ntext = "AI는 미래다 AI는 현재다 데이터가 AI를 만든다 AI는 강력하다"`,
    hint: "split()으로 단어를 나누고, 딕셔너리로 빈도를 셉니다. sorted()의 key= 파라미터를 활용하세요.",
    expectedOutput: `AI는: 3회\n미래다: 1회\n현재다: 1회\n데이터가: 1회\nAI를: 1회\n만든다: 1회\n강력하다: 1회`,
  },
  {
    id: "grade-stats",
    label: "성적 통계",
    difficulty: "medium",
    description: `아래 성적 데이터를 분석하여 출력하세요.\n\nscores = {"김민서": 92, "이준호": 78, "박소연": 85, "최태양": 61, "정하린": 95, "강다은": 73}\n\n출력: 평균, 최고점(이름), 최저점(이름), 합격자(70점 이상) 목록`,
    hint: "max()와 min()에 key= 파라미터를 사용하면 딕셔너리에서 최대/최소를 쉽게 찾을 수 있습니다.",
    expectedOutput: `평균: 80.7점\n최고점: 정하린 (95점)\n최저점: 최태양 (61점)\n합격자(70+): 김민서, 이준호, 박소연, 정하린, 강다은`,
  },
  {
    id: "pyramid",
    label: "별 피라미드",
    difficulty: "easy",
    description: `높이 7의 별(*) 피라미드를 출력하세요.\n가운데 정렬된 삼각형 모양이어야 합니다.\n\n입력: height = 7`,
    hint: "각 줄의 별 개수는 (2*i - 1)개, 앞의 공백은 (height - i)개입니다. (i는 1부터 시작)",
    expectedOutput: `      *\n     ***\n    *****\n   *******\n  *********\n ***********\n*************`,
  },
  {
    id: "prime",
    label: "소수 찾기",
    difficulty: "medium",
    description: `1부터 100 사이의 소수를 모두 찾아 출력하세요.\n소수의 개수와 합계도 함께 출력하세요.\n\n(소수: 1과 자기 자신으로만 나누어지는 수)`,
    hint: "에라토스테네스의 체 또는 각 숫자를 2부터 √n까지 나누어 확인하는 방법을 사용하세요.",
    expectedOutput: `2 3 5 7 11 13 17 19 23 29 31 37 41 43 47\n53 59 61 67 71 73 79 83 89 97\n\n소수 개수: 25개\n소수의 합: 1060`,
  },
];

const DIFFICULTY_STYLE: Record<Challenge["difficulty"], string> = {
  easy:   "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  hard:   "border-rose-500/30 bg-rose-500/10 text-rose-300",
};
const DIFFICULTY_LABEL: Record<Challenge["difficulty"], string> = {
  easy: "쉬움", medium: "보통", hard: "어려움",
};

export default function PythonPreview() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [activeTab, setActiveTab] = useState<"examples" | "challenges">("examples");
  const [activeCategory, setActiveCategory] = useState<string>("기초");
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const surfaceHeightClass = fullscreen ? "flex-1 min-h-0" : "h-52 sm:h-56";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodideRef = useRef<any>(null);

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setPyodideLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = PYODIDE_CDN;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Pyodide"));
          document.head.appendChild(script);
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pyodide = await (window as any).loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });
      pyodideRef.current = pyodide;
      setPyodideReady(true);
      return pyodide;
    } finally {
      setPyodideLoading(false);
    }
  }, []);

  const handleRun = useCallback(async () => {
    if (!code.trim() || running) return;
    setRunning(true);
    setOutput("");
    setError("");
    try {
      const pyodide = await loadPyodide();
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(t.labs.timeout_error)), 5000)
      );

      await Promise.race([
        pyodide.runPythonAsync(code),
        timeoutPromise,
      ]);

      const stdout: string = pyodide.runPython("sys.stdout.getvalue()");
      const stderr: string = pyodide.runPython("sys.stderr.getvalue()");

      if (stderr) setError(stderr);
      setOutput(stdout || t.labs.no_output);
    } catch (e) {
      setError((e as Error).message || "Execution error");
    } finally {
      setRunning(false);
    }
  }, [code, loadPyodide, running, t.labs.no_output, t.labs.timeout_error]);

  const handleCopy = useCallback(async () => {
    if (!code.trim()) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  const handleDownload = useCallback(() => {
    if (!output && !error) return;
    const content = error ? `# Error\n${error}` : output;
    const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cloid-python-output-${Date.now()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [error, output]);

  const handleClear = useCallback(() => {
    setCode("");
    setOutput("");
    setError("");
  }, []);

  const handleOpenVSCode = useCallback(() => {
    window.location.href = "vscode://";
  }, []);

  return (
    <>
      {fullscreen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setFullscreen(false)} />
      )}

      <div
        className={`rounded-xl border border-teal-800/40 overflow-hidden transition-all ${
          fullscreen
            ? "fixed inset-4 z-50 shadow-2xl border-teal-600/60 bg-[#0f1117] flex flex-col"
            : "bg-gradient-to-br from-teal-950/20 to-slate-900/60"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-teal-800/30 bg-teal-950/20">
          <div className="flex items-center gap-2 flex-wrap">
            <Terminal size={16} className="text-teal-400 shrink-0" />
            <h2 className="text-sm font-semibold text-white">{t.labs.python_title}</h2>
            <span className="text-[10px] text-teal-400 bg-teal-900/40 px-2 py-0.5 rounded-full border border-teal-700/50">
              {t.labs.python_badge}
            </span>
            {pyodideLoading && (
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" />
                {t.labs.loading_runtime}
              </span>
            )}
            {pyodideReady && (
              <span className="text-[10px] text-teal-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                {t.labs.runtime_ready}
              </span>
            )}
          </div>
          <button
            onClick={() => setFullscreen((v) => !v)}
            title={fullscreen ? t.labs.minimize : t.labs.fullscreen}
            aria-label={fullscreen ? t.labs.minimize : t.labs.fullscreen}
            className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 transition-colors shrink-0"
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        <div className={`p-4 ${fullscreen ? "flex-1 flex flex-col min-h-0 overflow-hidden" : ""}`}>
          {/* 탭 */}
          <div className="mb-3 flex gap-1 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab("examples")}
              className={`flex items-center gap-1.5 rounded-t px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === "examples" ? "bg-teal-900/30 text-teal-300 border border-teal-700/40 border-b-transparent" : "text-slate-500 hover:text-slate-300"}`}
            >
              <BookOpen size={12} /> 예제
            </button>
            <button
              onClick={() => setActiveTab("challenges")}
              className={`flex items-center gap-1.5 rounded-t px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === "challenges" ? "bg-amber-900/30 text-amber-300 border border-amber-700/40 border-b-transparent" : "text-slate-500 hover:text-slate-300"}`}
            >
              <FlaskConical size={12} /> 과제
            </button>
          </div>

          {activeTab === "examples" && (
            <div className="mb-3 space-y-2">
              {/* 카테고리 */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {EXAMPLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full border transition-all ${activeCategory === cat ? "border-teal-600/60 bg-teal-900/30 text-teal-200" : "border-slate-700 text-slate-500 hover:text-slate-300"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* 예제 목록 */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {EXAMPLES.filter((e) => e.category === activeCategory).map((example) => (
                  <button
                    key={example.label}
                    onClick={() => { setCode(example.code); setActiveChallenge(null); }}
                    disabled={running}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:border-teal-600 hover:text-teal-300 hover:bg-teal-900/20 transition-all disabled:opacity-50"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "challenges" && (
            <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {CHALLENGES.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChallenge(ch);
                    setCode("");
                    setOutput("");
                    setError("");
                  }}
                  className={`rounded-lg border p-2.5 text-left transition-all hover:-translate-y-0.5 ${activeChallenge?.id === ch.id ? "border-amber-600/50 bg-amber-950/30" : "border-slate-800 bg-slate-900/50 hover:border-slate-700"}`}
                >
                  <div className="mb-1 flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-white">{ch.label}</span>
                    <span className={`rounded-full border px-1.5 py-0.5 text-[9px] ${DIFFICULTY_STYLE[ch.difficulty]}`}>
                      {DIFFICULTY_LABEL[ch.difficulty]}
                    </span>
                  </div>
                  <p className="text-[10px] leading-4 text-slate-500 line-clamp-2">{ch.description.split("\n")[0]}</p>
                </button>
              ))}
            </div>
          )}

          {activeChallenge && (
            <div className="mb-3 rounded-lg border border-amber-700/30 bg-amber-950/20 p-3 text-xs">
              <div className="mb-2 flex items-center gap-1.5 font-semibold text-amber-300">
                <FlaskConical size={12} /> {activeChallenge.label}
                <span className={`ml-1 rounded-full border px-1.5 py-0.5 text-[9px] ${DIFFICULTY_STYLE[activeChallenge.difficulty]}`}>
                  {DIFFICULTY_LABEL[activeChallenge.difficulty]}
                </span>
              </div>
              <p className="mb-2 whitespace-pre-line leading-5 text-slate-300">{activeChallenge.description}</p>
              <div className="flex items-start gap-1.5 text-amber-400/70">
                <ChevronRight size={11} className="mt-0.5 shrink-0" />
                <span className="leading-4">{activeChallenge.hint}</span>
              </div>
            </div>
          )}

          <div className={`grid gap-3 ${fullscreen ? "grid-cols-2 flex-1 min-h-0" : "grid-cols-1 lg:grid-cols-2"}`}>
            <div className={`flex flex-col gap-2 rounded-xl border border-slate-800/70 bg-slate-950/30 p-3 ${fullscreen ? "min-h-0" : ""}`}>
              <div className="flex min-h-9 items-center justify-between">
                <span className="text-xs text-teal-400 font-medium">{t.labs.code_editor}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    disabled={!code.trim()}
                    aria-label={copied ? t.common.copied : t.common.copy}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-40 transition-colors"
                  >
                    {copied ? <><Check size={11} className="text-emerald-400" /> {t.common.copied}</> : <><Copy size={11} /> {t.common.copy}</>}
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!code.trim()}
                    aria-label={t.labs.clear_all}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 disabled:opacity-40 transition-colors"
                  >
                    <X size={11} /> {t.labs.clear_all}
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={'# Python code here\nprint("Hello, CLOID!")\n\nfor i in range(5):\n    print(f"Step {i+1}")'}
                aria-label={t.labs.code_editor}
                className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs font-mono leading-5 text-teal-300 placeholder-slate-700 focus:outline-none focus:border-teal-500 transition-colors resize-none ${surfaceHeightClass}`}
                spellCheck={false}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleRun}
                  disabled={!code.trim() || running}
                  data-event="cta_python_run"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  {running ? <><Loader2 size={13} className="animate-spin" /> {t.labs.running}</> : <><Play size={13} /> {t.labs.run_python}</>}
                </button>
                <button
                  onClick={handleOpenVSCode}
                  type="button"
                  aria-label={t.labs.open_vscode}
                  data-event="cta_python_open_vscode"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-lg transition-colors"
                >
                  <ExternalLink size={13} /> {t.labs.open_vscode}
                </button>
              </div>

              <div className="min-h-4" />
            </div>

            <div className={`flex flex-col gap-2 rounded-xl border border-slate-800/70 bg-slate-950/30 p-3 ${fullscreen ? "min-h-0" : ""}`}>
              <div className="flex min-h-9 items-center justify-between">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Terminal size={11} /> {t.labs.output}
                </span>
                {(output || error) && (
                  <button
                    onClick={handleDownload}
                    aria-label={t.labs.download}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 rounded text-teal-500 hover:text-teal-300 hover:bg-teal-900/20 transition-colors"
                  >
                    <Download size={11} /> {t.labs.download}
                  </button>
                )}
              </div>

              <div
                className={`w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-xs font-mono leading-5 overflow-auto whitespace-pre-wrap ${
                  error
                    ? "border-red-800/50"
                    : output
                      ? "border-slate-600"
                      : "border-dashed border-slate-700"
                } ${surfaceHeightClass}`}
              >
                {error ? (
                  <div className="flex items-start gap-2 text-red-400">
                    <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                    <span className="break-all">{error}</span>
                  </div>
                ) : output ? (
                  <span className="text-slate-200">{output}</span>
                ) : activeChallenge && !output ? (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-amber-500/60">예상 출력 (힌트)</p>
                    <pre className="whitespace-pre-wrap text-amber-200/50">{activeChallenge.expectedOutput}</pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
                    <Terminal size={24} className="text-slate-700" />
                    <p className="text-center">{t.labs.click_run}</p>
                  </div>
                )}
              </div>

              <div className="min-h-[40px]" />
              <div className="min-h-4" />
            </div>
          </div>

          <p className={`text-[10px] text-slate-600 ${fullscreen ? "mt-1" : "mt-2"}`}>
            {t.labs.python_footer}
          </p>
        </div>
      </div>
    </>
  );
}

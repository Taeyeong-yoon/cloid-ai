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

const EXAMPLE_CATEGORIES = ["기초", "데이터", "내장함수", "AI 실습", "알고리즘"] as const;

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
  // 내장함수
  {
    category: "내장함수",
    label: "map & filter",
    code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map: 모든 원소에 함수 적용
squares = list(map(lambda x: x ** 2, numbers))
print(f"제곱:    {squares}")

# filter: 조건에 맞는 원소만 추출
evens = list(filter(lambda x: x % 2 == 0, numbers))
odds  = list(filter(lambda x: x % 2 != 0, numbers))
print(f"짝수:    {evens}")
print(f"홀수:    {odds}")

# map + filter 조합
big_squares = list(map(lambda x: x**2, filter(lambda x: x > 5, numbers)))
print(f"5 초과 제곱: {big_squares}")

# 리스트 컴프리헨션과 동일한 결과
same = [x**2 for x in numbers if x > 5]
print(f"컴프리헨션: {same}")`,
  },
  {
    category: "내장함수",
    label: "zip & 언패킹",
    code: `names   = ["김민서", "이준호", "박소연", "최태양"]
scores  = [92, 78, 85, 61]
grades  = ["A", "B", "B", "D"]

# zip: 여러 리스트를 동시에 순회
print("=== 성적표 ===")
for name, score, grade in zip(names, scores, grades):
    bar = "█" * (score // 10)
    print(f"{name}: {score}점 ({grade}) {bar}")

# zip으로 딕셔너리 생성
score_dict = dict(zip(names, scores))
print(f"\\n딕셔너리: {score_dict}")

# zip과 enumerate 조합
print("\\n순위:")
ranked = sorted(zip(scores, names), reverse=True)
for rank, (score, name) in enumerate(ranked, 1):
    print(f"  {rank}위 {name}: {score}점")`,
  },
  {
    category: "내장함수",
    label: "try / except",
    code: `def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        return "오류: 0으로 나눌 수 없습니다"
    except TypeError as e:
        return f"오류: 타입 불일치 ({e})"
    finally:
        print(f"  → divide({a}, {b}) 호출됨")

# 다양한 케이스 테스트
cases = [(10, 2), (5, 0), (9, "3"), (100, 4)]
for a, b in cases:
    result = safe_divide(a, b)
    print(f"결과: {result}")
    print()

# 예외를 활용한 안전한 형변환
def to_int(value):
    try:
        return int(value), None
    except (ValueError, TypeError) as e:
        return None, str(e)

for val in ["42", "3.14", "abc", None]:
    num, err = to_int(val)
    print(f"to_int({repr(val):8}) → {num if num is not None else f'실패: {err}'}")`,
  },
  {
    category: "내장함수",
    label: "set 연산",
    code: `python_users  = {"김민서", "이준호", "박소연", "최태양", "정하린"}
js_users      = {"이준호", "강다은", "박소연", "윤서준"}
data_users    = {"최태양", "김민서", "한도윤", "박소연"}

# 집합 연산
both_py_js  = python_users & js_users          # 교집합
either      = python_users | js_users          # 합집합
only_python = python_users - js_users          # 차집합
symmetric   = python_users ^ js_users          # 대칭 차집합

print(f"Python 사용자: {sorted(python_users)}")
print(f"JS 사용자:     {sorted(js_users)}")
print(f"둘 다 사용:    {sorted(both_py_js)}")
print(f"Python만:      {sorted(only_python)}")

# 3개 이상 기술 보유자
all_three = python_users & js_users & data_users
print(f"\\n3개 스킬 모두: {sorted(all_three) or '없음'}")

# 중복 제거
raw = [1, 2, 2, 3, 3, 3, 4, 5, 5]
unique = sorted(set(raw))
print(f"\\n중복 제거: {raw} → {unique}")`,
  },
  {
    category: "내장함수",
    label: "collections.Counter",
    code: `from collections import Counter, defaultdict

text = "python is great python is easy python data python ai data ai"
words = text.split()

# Counter: 빈도 자동 집계
counter = Counter(words)
print("=== 단어 빈도 ===")
for word, count in counter.most_common(5):
    bar = "■" * count
    print(f"  {word:8}: {bar} ({count})")

# Counter 연산
c1 = Counter(["a", "b", "b", "c", "c", "c"])
c2 = Counter(["b", "b", "c", "d", "d"])
print(f"\\nc1: {dict(c1)}")
print(f"c2: {dict(c2)}")
print(f"합: {dict(c1 + c2)}")
print(f"교: {dict(c1 & c2)}")

# defaultdict: 키 없어도 기본값 자동 생성
sales = defaultdict(list)
data = [("서울", 100), ("부산", 80), ("서울", 120), ("부산", 90), ("인천", 70)]
for city, amount in data:
    sales[city].append(amount)

print("\\n=== 지역별 매출 ===")
for city, amounts in sales.items():
    print(f"  {city}: {amounts} → 합계 {sum(amounts)}")`,
  },
  {
    category: "내장함수",
    label: "datetime",
    code: `from datetime import datetime, timedelta, date

now = datetime.now()
print(f"현재 시각: {now.strftime('%Y년 %m월 %d일 %H:%M:%S')}")
print(f"요일: {['월','화','수','목','금','토','일'][now.weekday()]}요일")

# 날짜 계산
d_day = date(2026, 12, 31)
today = date.today()
diff = d_day - today
print(f"\\n2026년 12월 31일까지: {diff.days}일 남음")

# 시간 연산
deadline = now + timedelta(days=7, hours=3)
print(f"7일 3시간 후: {deadline.strftime('%Y-%m-%d %H:%M')}")

# 문자열 → datetime 파싱
date_strings = ["2026/03/01", "2026-06-15", "20261225"]
formats = ["%Y/%m/%d", "%Y-%m-%d", "%Y%m%d"]
print("\\n날짜 파싱:")
for s, fmt in zip(date_strings, formats):
    dt = datetime.strptime(s, fmt)
    print(f"  {s:12} → {dt.strftime('%Y년 %-m월 %-d일') if hasattr(dt, 'day') else dt}")`,
  },
  {
    category: "내장함수",
    label: "문자열 메서드",
    code: `text = "  Hello, Python World! 파이썬은 최고입니다.  "

# 기본 정리
print(f"원본:        '{text}'")
print(f"strip:       '{text.strip()}'")
print(f"upper:       '{text.strip().upper()}'")
print(f"lower:       '{text.strip().lower()}'")

# 검색 & 확인
s = "Python is powerful and Python is popular"
print(f"\\n찾기(find):  {s.find('Python')}")
print(f"개수(count): {s.count('Python')}")
print(f"시작(startswith): {s.startswith('Python')}")
print(f"끝(endswith):     {s.endswith('popular')}")

# 변환
print(f"\\n교체(replace): {s.replace('Python', 'AI')}")
print(f"분리(split):   {s.split(' and ')}")
print(f"결합(join):    {'→'.join(['A','B','C','D'])}")

# 포맷
name, score = "김민서", 92.5
print(f"\\nf-string:  {name}의 점수는 {score:.1f}점")
print(f"format:    {'{:>10} {:06.2f}'.format(name, score)}")
print(f"zfill:     {'42'.zfill(6)}")`,
  },
  {
    category: "내장함수",
    label: "*args / **kwargs",
    code: `# *args: 가변 위치 인수
def sum_all(*args):
    print(f"받은 인수: {args}")
    return sum(args)

print(sum_all(1, 2, 3))
print(sum_all(10, 20, 30, 40, 50))

# **kwargs: 가변 키워드 인수
def profile(**kwargs):
    print("\\n=== 프로필 ===")
    for key, value in kwargs.items():
        print(f"  {key}: {value}")

profile(name="김민서", age=28, job="개발자", skill="Python")

# 혼합 사용
def log(level, *messages, separator="│", **meta):
    prefix = f"[{level.upper()}]"
    body = f" {separator} ".join(str(m) for m in messages)
    detail = " ".join(f"{k}={v}" for k, v in meta.items())
    print(f"{prefix} {body}  {detail}")

log("info", "서버 시작", "포트 8080", host="localhost", pid=1234)
log("warn", "응답 지연", separator="·", latency="320ms")`,
  },
  {
    category: "내장함수",
    label: "sorted 심화",
    code: `students = [
    {"name": "김민서", "score": 92, "age": 22},
    {"name": "이준호", "score": 78, "age": 25},
    {"name": "박소연", "score": 92, "age": 21},
    {"name": "최태양", "score": 61, "age": 23},
    {"name": "정하린", "score": 85, "age": 22},
]

# key= 단순 정렬
by_score = sorted(students, key=lambda s: s["score"], reverse=True)
print("점수 내림차순:")
for s in by_score:
    print(f"  {s['name']:6} {s['score']}점")

# 다중 기준 정렬 (점수 내림차순, 나이 오름차순)
multi = sorted(students, key=lambda s: (-s["score"], s["age"]))
print("\\n점수↓ 나이↑ 다중정렬:")
for s in multi:
    print(f"  {s['name']:6} {s['score']}점 {s['age']}세")

# any / all
scores = [s["score"] for s in students]
print(f"\\n모두 합격(60+): {all(sc >= 60 for sc in scores)}")
print(f"90점 이상 있음: {any(sc >= 90 for sc in scores)}")
print(f"평균 이상 수:   {sum(1 for sc in scores if sc >= sum(scores)/len(scores))}명")`,
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
  {
    id: "zip-scoreboard",
    label: "zip 성적표",
    difficulty: "easy",
    description: `아래 두 리스트를 zip으로 묶어 성적표를 출력하고,\nmap으로 점수를 10점씩 올린 조정 점수도 함께 출력하세요.\n\nnames = ["김민서","이준호","박소연","최태양","정하린"]\nscores = [72, 58, 85, 61, 90]`,
    hint: "zip(names, scores)로 묶고, map(lambda x: x+10, scores)로 점수를 올립니다. min(100, x)으로 100 초과 방지도 해보세요.",
    expectedOutput: `=== 원본 성적표 ===\n김민서: 72점\n이준호: 58점\n박소연: 85점\n최태양: 61점\n정하린: 90점\n\n=== 조정 성적표 (+10점) ===\n김민서: 82점\n이준호: 68점\n박소연: 95점\n최태양: 71점\n정하린: 100점`,
  },
  {
    id: "try-calc",
    label: "안전한 계산기",
    difficulty: "medium",
    description: `사용자 입력 없이 아래 연산 목록을 순서대로 처리하는 안전한 계산기를 만드세요.\ntry/except로 오류를 잡아 메시지를 출력하고 계속 실행해야 합니다.\n\nops = [(10, "+", 5), (9, "/", 0), (8, "*", 3), (10, "/", "두"), (7, "-", 2)]`,
    hint: "각 연산을 try 블록에 넣고 ZeroDivisionError, TypeError를 각각 except로 잡습니다.",
    expectedOutput: `10 + 5 = 15\n9 / 0 → 오류: 0으로 나눌 수 없습니다\n8 * 3 = 24\n10 / 두 → 오류: 숫자가 아닙니다\n7 - 2 = 5`,
  },
  {
    id: "set-interest",
    label: "공통 관심사 찾기",
    difficulty: "easy",
    description: `세 사람의 관심사 목록을 set으로 비교하여\n① 세 명 모두의 공통 관심사\n② 정확히 두 명만 공유하는 관심사\n③ 한 명만 가진 고유 관심사를 출력하세요.\n\nA = {"AI","Python","여행","음악","독서"}\nB = {"AI","Python","게임","영화","독서"}\nC = {"AI","여행","요리","음악","게임"}`,
    hint: "A & B & C 로 교집합, (A&B)-(A&B&C) 로 두 명만 공유하는 항목을 구합니다.",
    expectedOutput: `세 명 공통: {'AI'}\nA&B만: {'Python', '독서'}\nA&C만: {'여행', '음악'}\nB&C만: {'게임'}\nA 고유: {'독서', 'Python'} 중 B,C와 겹치지 않는 것`,
  },
  {
    id: "counter-log",
    label: "Counter 로그 분석",
    difficulty: "medium",
    description: `아래 서버 로그에서 Counter를 활용해\n① 상태코드별 빈도 TOP 3\n② 에러(400대, 500대) 총 횟수\n③ 가장 많이 접근한 경로를 출력하세요.\n\nlogs = ["GET /home 200","POST /api 201","GET /home 200",\n        "GET /login 404","GET /api 500","POST /api 201",\n        "GET /home 200","GET /login 404","GET /api 500","DELETE /api 403"]`,
    hint: "Counter(status for log in logs for status in [log.split()[2]])로 상태코드를 셉니다. 경로는 log.split()[1]로 추출합니다.",
    expectedOutput: `=== 상태코드 TOP 3 ===\n200: 3회\n201: 2회\n404: 2회\n\n에러(4xx+5xx) 총 5회\n\n가장 많은 경로: /home (3회)`,
  },
  {
    id: "datetime-calc",
    label: "날짜 계산기",
    difficulty: "medium",
    description: `datetime을 활용해 아래를 출력하세요.\n① 오늘 날짜와 요일\n② 100일 후 날짜\n③ 아래 날짜 목록을 최신순으로 정렬\n\ndates = ["2026-03-15", "2025-12-01", "2026-01-20", "2026-06-30"]`,
    hint: "datetime.strptime()으로 문자열을 파싱하고, sorted(dates, key=lambda d: datetime.strptime(d,'%Y-%m-%d'), reverse=True)로 정렬합니다.",
    expectedOutput: `오늘: 2026-03-22 (일요일)\n100일 후: 2026-06-30\n\n날짜 정렬(최신순):\n2026-06-30\n2026-03-15\n2026-01-20\n2025-12-01`,
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

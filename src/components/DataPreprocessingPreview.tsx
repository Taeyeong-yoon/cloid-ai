"use client";

import { useMemo, useState } from "react";
import {
  Database,
  Download,
  FileSpreadsheet,
  FlaskConical,
  Play,
  RotateCcw,
  TableProperties,
  WandSparkles,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

type Row = Record<string, string>;
type OperationId = "trimText" | "fillMissing" | "removeDuplicates" | "normalizeDate" | "dropEmptyRows" | "normalizeCase" | "formatNumbers" | "normalizePhone";

type Dataset = {
  id: string;
  label: string;
  description: string;
  csv: string;
};

const DATASETS: Dataset[] = [
  {
    id: "sales",
    label: "매출 원본 CSV",
    description: "공백, 누락값, 중복 행이 섞인 기본 전처리 연습용 데이터입니다.",
    csv: `date,product,region,sales,owner
2026/03/01,Notebook,Seoul,120000, Mina
2026-03-01,Notebook,Seoul,120000,Mina
2026/03/02,Mouse,Busan,,Jin
2026/03/03, Keyboard ,Incheon,89000, Hana
,Monitor,Seoul,210000,Hana
2026/03/05,Mouse,Busan,54000,Jin`,
  },
  {
    id: "members",
    label: "회원 원본 CSV",
    description: "이름 공백, 비어 있는 이메일, 중복 회원 데이터가 들어 있습니다.",
    csv: `name,email,join_date,status
 Kim,kim@example.com,2026/01/03,active
Kim,kim@example.com,2026-01-03,active
Lee,,2026/01/11,pending
 Park,park@example.com,2026-02-02,active
Choi,choi@example.com,,inactive`,
  },
  {
    id: "shopping-orders",
    label: "쇼핑몰 주문 CSV",
    description: "주문번호 중복, 결제금액 누락, 날짜 형식 불일치가 포함된 주문 데이터입니다.",
    csv: `order_id,customer,product,amount,order_date,status
ORD-001, Alice ,스니커즈,89000,2026/02/10,완료
ORD-001, Alice ,스니커즈,89000,2026-02-10,완료
ORD-002,Bob,청바지,,2026/02/11,결제대기
ORD-003, Carol ,후드티,55000,2026.02.12,완료
ORD-004,Dave,가방,120000,,배송중
ORD-005,Eve,모자,23000,2026/02/14,완료`,
  },
  {
    id: "shopping-products",
    label: "상품 카탈로그 CSV",
    description: "카테고리 표기 불일치, 가격 누락, 재고 공백이 있는 상품 목록입니다.",
    csv: `product_id,name,category,price,stock,registered_date
P001, 무선이어폰 ,전자기기,45000,12,2026/01/05
P002,스마트워치,전자기기,189000,,2026-01-06
P003,면티셔츠, 의류 ,18000,50,2026/01/07
P004,청바지,의류,55000,30,2026.01.08
P005, 운동화 ,신발,,25,2026/01/09
P003,면티셔츠,의류,18000,50,2026-01-07`,
  },
  {
    id: "shipyard-parts",
    label: "조선소 부품 재고 CSV",
    description: "부품코드 중복, 납품일 형식 혼재, 수량 누락이 있는 조선소 부품 데이터입니다.",
    csv: `part_code,part_name,supplier,quantity,unit_price,delivery_date
SH-1021, 고장력강판 ,현대스틸,200,850000,2026/03/01
SH-1021,고장력강판,현대스틸,200,850000,2026-03-01
SH-1032, 선박용볼트 ,대성금속,,12000,2026/03/03
SH-1045,해양케이블,삼성전선,80,430000,2026.03.04
SH-1058,방수페인트, KCC ,150,,2026/03/05
SH-1061,엔진마운트,두산중공업,35,1200000,`,
  },
  {
    id: "shipyard-workers",
    label: "조선소 작업자 현황 CSV",
    description: "소속 공백, 자격증 누락, 입사일 형식 불일치가 있는 작업자 데이터입니다.",
    csv: `worker_id,name,department,cert_level,hire_date,status
W001, 김철수 ,선체블록,1급,2020/04/01,재직
W002,이영희, 도장부 ,2급,2019-07-15,재직
W003,박민준,용접부,,2021/11/03,재직
W004, 최강현 ,선체블록,1급,2020-04-01,재직
W005,정수진,기관부,3급,,휴직
W003,박민준,용접부,2급,2021/11/03,재직`,
  },
  {
    id: "hospital",
    label: "병원 환자 접수 CSV",
    description: "환자 중복 등록, 연락처 공백, 진료일 형식 혼재가 있는 접수 데이터입니다.",
    csv: `patient_id,name,birth_date,phone,visit_date,department
P2001, 홍길동 ,1985/06/12,010-1234-5678,2026/03/10,내과
P2001,홍길동,1985-06-12,010-1234-5678,2026-03-10,내과
P2002,김영수,1990/11/22,,2026/03/11,정형외과
P2003, 이미래 ,2000/03/05,010-9876-5432,2026.03.11,피부과
P2004,박준호,1978/08/30,010-5555-1234,,응급실
P2005,최아름,1995/02/14,010-3333-7777,2026/03/12,내과`,
  },
  {
    id: "hr-employees",
    label: "직원 인사 원본 CSV",
    description: "부서명 표기 불일치, 연봉 누락, 입사일 형식 혼재가 있는 인사 데이터입니다.",
    csv: `emp_id,name,department,position,salary,hire_date
E101, 강다은 ,개발팀,선임,52000000,2022/03/02
E102,윤서준, 개발팀 ,주임,42000000,2021-06-14
E103,임지수,마케팅,과장,,2019/09/01
E104, 한도윤 ,마케팅,대리,38000000,2020.11.30
E105,오채원,개발팀,팀장,70000000,2018/03/05
E101,강다은,개발팀,선임,52000000,2022-03-02`,
  },
  {
    id: "logistics",
    label: "물류 입출고 CSV",
    description: "입출고 구분 누락, 창고코드 공백, 날짜 형식이 섞인 물류 데이터입니다.",
    csv: `log_id,sku,warehouse,type,quantity,log_date
L001,SKU-A01, WH-Seoul ,입고,100,2026/02/20
L002,SKU-B03,WH-Busan,출고,40,2026-02-21
L003, SKU-A01 ,WH-Seoul,,60,2026/02/22
L004,SKU-C07,WH-Incheon,입고,200,2026.02.23
L001,SKU-A01,WH-Seoul,입고,100,2026-02-20
L005,SKU-D12,,출고,80,2026/02/24`,
  },
  {
    id: "school-grades",
    label: "학교 성적 원본 CSV",
    description: "학번 중복, 점수 누락, 학기 표기 불일치가 있는 성적 데이터입니다.",
    csv: `student_id,name,subject,score,grade,semester
S1001, 김민서 ,수학,92,A,2026-1
S1002,이준호,영어,,B,2026/1
S1003,박소연,과학,78,C,2026-1
S1001,김민서,수학,92,A,2026/1
S1004, 최태양 ,수학,85,B,2026.1
S1005,정하린,영어,91,A,2026-1`,
  },
];

const OPERATION_ORDER: OperationId[] = ["trimText", "fillMissing", "removeDuplicates", "normalizeDate", "dropEmptyRows", "normalizeCase", "formatNumbers", "normalizePhone"];

const EMPTY_VALUE = "(empty)";

function parseCsv(text: string): Row[] {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((value) => value.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Row = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? "").trimEnd();
    });
    return row;
  });
}

function toCsv(rows: Row[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header] ?? "";
        return value.includes(",") ? `"${value.replace(/"/g, '""')}"` : value;
      })
      .join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

function countMissing(rows: Row[]): number {
  return rows.reduce(
    (count, row) => count + Object.values(row).filter((value) => !value || value.trim() === "").length,
    0,
  );
}

function countTrimTargets(rows: Row[]): number {
  return rows.reduce(
    (count, row) =>
      count +
      Object.values(row).filter((value) => value !== value.trim() || /\s{2,}/.test(value)).length,
    0,
  );
}

function countDateTargets(rows: Row[]): number {
  return rows.reduce(
    (count, row) =>
      count +
      Object.entries(row).filter(
        ([key, value]) => /date/i.test(key) && value.includes("/") && /^\d{4}\/\d{2}\/\d{2}$/.test(value),
      ).length,
    0,
  );
}

function countDuplicateRows(rows: Row[]): number {
  const seen = new Set<string>();
  let duplicates = 0;
  rows.forEach((row) => {
    const key = JSON.stringify(row);
    if (seen.has(key)) duplicates += 1;
    else seen.add(key);
  });
  return duplicates;
}

function applyOperations(rows: Row[], activeOperations: OperationId[]) {
  let nextRows = rows.map((row) => ({ ...row }));
  const logs: string[] = [];

  if (activeOperations.includes("trimText")) {
    let changes = 0;
    nextRows = nextRows.map((row) => {
      const nextRow: Row = {};
      Object.entries(row).forEach(([key, value]) => {
        const trimmed = value.replace(/\s+/g, " ").trim();
        if (trimmed !== value) changes += 1;
        nextRow[key] = trimmed;
      });
      return nextRow;
    });
    logs.push(`문자열 공백 정리: ${changes}개 셀`);
  }

  if (activeOperations.includes("fillMissing")) {
    let changes = 0;
    nextRows = nextRows.map((row) => {
      const nextRow: Row = {};
      Object.entries(row).forEach(([key, value]) => {
        if (value.trim() !== "") {
          nextRow[key] = value;
          return;
        }
        changes += 1;
        nextRow[key] = /date/i.test(key)
          ? "1970-01-01"
          : /sales|amount|price|count/i.test(key)
            ? "0"
            : EMPTY_VALUE;
      });
      return nextRow;
    });
    logs.push(`누락값 채우기: ${changes}개 셀`);
  }

  if (activeOperations.includes("removeDuplicates")) {
    const before = nextRows.length;
    const seen = new Set<string>();
    nextRows = nextRows.filter((row) => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    logs.push(`중복 행 제거: ${before - nextRows.length}개 행`);
  }

  if (activeOperations.includes("normalizeDate")) {
    let changes = 0;
    nextRows = nextRows.map((row) => {
      const nextRow: Row = {};
      Object.entries(row).forEach(([key, value]) => {
        if (/date/i.test(key) && /^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
          nextRow[key] = value.replaceAll("/", "-");
          changes += 1;
          return;
        }
        nextRow[key] = value;
      });
      return nextRow;
    });
    logs.push(`날짜 형식 통일: ${changes}개 셀`);
  }

  if (activeOperations.includes("dropEmptyRows")) {
    const before = nextRows.length;
    nextRows = nextRows.filter((row) =>
      Object.values(row).some((value) => value.trim() !== "")
    );
    logs.push(`빈 행 제거: ${before - nextRows.length}개 행`);
  }

  if (activeOperations.includes("normalizeCase")) {
    let changes = 0;
    nextRows = nextRows.map((row) => {
      const nextRow: Row = {};
      Object.entries(row).forEach(([key, value]) => {
        if (/id|code|phone|email/i.test(key)) {
          const lower = value.toLowerCase();
          if (lower !== value) changes += 1;
          nextRow[key] = lower;
        } else {
          nextRow[key] = value;
        }
      });
      return nextRow;
    });
    logs.push(`대소문자 통일(소문자): ${changes}개 셀`);
  }

  if (activeOperations.includes("formatNumbers")) {
    let changes = 0;
    nextRows = nextRows.map((row) => {
      const nextRow: Row = {};
      Object.entries(row).forEach(([key, value]) => {
        if (/price|amount|salary|sales|quantity|stock|score/i.test(key)) {
          const cleaned = value.replace(/,/g, "").trim();
          if (cleaned !== value && cleaned !== "" && !isNaN(Number(cleaned))) {
            nextRow[key] = cleaned;
            changes += 1;
          } else {
            nextRow[key] = value;
          }
        } else {
          nextRow[key] = value;
        }
      });
      return nextRow;
    });
    logs.push(`숫자 형식 정리(콤마 제거): ${changes}개 셀`);
  }

  if (activeOperations.includes("normalizePhone")) {
    let changes = 0;
    nextRows = nextRows.map((row) => {
      const nextRow: Row = {};
      Object.entries(row).forEach(([key, value]) => {
        if (/phone|tel|contact/i.test(key) && value.trim() !== "") {
          const digits = value.replace(/[^0-9]/g, "");
          let normalized = value;
          if (digits.length === 11 && digits.startsWith("010")) {
            normalized = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
          } else if (digits.length === 10) {
            normalized = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
          }
          if (normalized !== value) changes += 1;
          nextRow[key] = normalized;
        } else {
          nextRow[key] = value;
        }
      });
      return nextRow;
    });
    logs.push(`전화번호 형식 통일: ${changes}개 셀`);
  }

  return { rows: nextRows, logs };
}

function getNotebookCode(activeOperations: OperationId[]) {
  const lines = [
    "import pandas as pd",
    "",
    'df = pd.read_csv("raw.csv")',
  ];

  if (activeOperations.includes("trimText")) {
    lines.push(
      "",
      "# 1) 문자열 공백 정리",
      "text_cols = df.select_dtypes(include='object').columns",
      "df[text_cols] = df[text_cols].apply(lambda col: col.astype(str).str.replace(r'\\s+', ' ', regex=True).str.strip())",
    );
  }

  if (activeOperations.includes("fillMissing")) {
    lines.push(
      "",
      "# 2) 누락값 채우기",
      "df = df.fillna({",
      "    'sales': 0,",
      "    'email': '(empty)',",
      "    'owner': '(empty)'",
      "})",
    );
  }

  if (activeOperations.includes("removeDuplicates")) {
    lines.push("", "# 3) 중복 제거", "df = df.drop_duplicates()");
  }

  if (activeOperations.includes("normalizeDate")) {
    lines.push(
      "",
      "# 4) 날짜 형식 통일",
      "date_cols = [col for col in df.columns if 'date' in col.lower()]",
      "for col in date_cols:",
      "    df[col] = pd.to_datetime(df[col], errors='coerce').dt.strftime('%Y-%m-%d')",
    );
  }

  if (activeOperations.includes("dropEmptyRows")) {
    lines.push("", "# 5) 빈 행 제거", "df = df.dropna(how='all')");
  }

  if (activeOperations.includes("normalizeCase")) {
    lines.push(
      "",
      "# 6) 대소문자 통일 (id/code/email 컬럼 소문자화)",
      "case_cols = [col for col in df.columns if any(k in col.lower() for k in ['id','code','phone','email'])]",
      "df[case_cols] = df[case_cols].apply(lambda col: col.astype(str).str.lower())",
    );
  }

  if (activeOperations.includes("formatNumbers")) {
    lines.push(
      "",
      "# 7) 숫자 형식 정리 (콤마 제거)",
      "num_cols = [col for col in df.columns if any(k in col.lower() for k in ['price','amount','salary','sales','quantity','stock','score'])]",
      "for col in num_cols:",
      "    df[col] = df[col].astype(str).str.replace(',', '', regex=False)",
      "    df[col] = pd.to_numeric(df[col], errors='coerce')",
    );
  }

  if (activeOperations.includes("normalizePhone")) {
    lines.push(
      "",
      "# 8) 전화번호 형식 통일",
      "import re",
      "phone_cols = [col for col in df.columns if any(k in col.lower() for k in ['phone','tel','contact'])]",
      "def normalize_phone(v):",
      "    digits = re.sub(r'[^0-9]', '', str(v))",
      "    if len(digits) == 11: return f'{digits[:3]}-{digits[3:7]}-{digits[7:]}'",
      "    if len(digits) == 10: return f'{digits[:3]}-{digits[3:6]}-{digits[6:]}'",
      "    return v",
      "for col in phone_cols:",
      "    df[col] = df[col].apply(normalize_phone)",
    );
  }

  lines.push("", 'df.to_csv("cleaned.csv", index=False)', "df.head()");
  return lines.join("\n");
}

function PreviewTable({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <div className="rounded-lg border border-dashed border-slate-700 p-4 text-xs text-slate-500">데이터가 없습니다.</div>;
  }

  const headers = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="min-w-full border-collapse text-xs">
        <thead className="bg-slate-900/90 text-slate-300">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border-b border-slate-800 px-3 py-2 text-left font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${index}-${JSON.stringify(row)}`} className="bg-slate-950/40 text-slate-200">
              {headers.map((header) => (
                <td key={header} className="border-b border-slate-900 px-3 py-2 align-top">
                  {row[header] || <span className="text-rose-300">(blank)</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DataPreprocessingPreview() {
  const { locale } = useTranslation();
  const isKo = locale === "ko";
  const [datasetId, setDatasetId] = useState(DATASETS[0].id);
  const [rawCsv, setRawCsv] = useState(DATASETS[0].csv);
  const [activeOperations, setActiveOperations] = useState<OperationId[]>(["trimText", "fillMissing"]);

  const currentDataset = DATASETS.find((dataset) => dataset.id === datasetId) ?? DATASETS[0];
  const rawRows = useMemo(() => parseCsv(rawCsv), [rawCsv]);
  const processed = useMemo(() => applyOperations(rawRows, activeOperations), [rawRows, activeOperations]);
  const notebookCode = useMemo(() => getNotebookCode(activeOperations), [activeOperations]);

  const stats = useMemo(
    () => ({
      rows: rawRows.length,
      missing: countMissing(rawRows),
      duplicates: countDuplicateRows(rawRows),
      trimTargets: countTrimTargets(rawRows),
      dateTargets: countDateTargets(rawRows),
    }),
    [rawRows],
  );

  function toggleOperation(operation: OperationId) {
    setActiveOperations((current) =>
      current.includes(operation) ? current.filter((item) => item !== operation) : [...current, operation],
    );
  }

  function loadDataset(dataset: Dataset) {
    setDatasetId(dataset.id);
    setRawCsv(dataset.csv);
  }

  function resetAll() {
    setActiveOperations(["trimText", "fillMissing"]);
    setDatasetId(DATASETS[0].id);
    setRawCsv(DATASETS[0].csv);
  }

  function downloadCsv() {
    const csv = toCsv(processed.rows);
    if (!csv) return;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cleaned-${datasetId}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  const operationLabels: Record<OperationId, { title: string; detail: string }> = {
    trimText: {
      title: isKo ? "문자열 공백 정리" : "Trim text",
      detail: isKo ? "앞뒤 공백과 중복 공백을 정리합니다." : "Remove leading and repeated spaces.",
    },
    fillMissing: {
      title: isKo ? "누락값 채우기" : "Fill missing values",
      detail: isKo ? "빈 셀을 기본값으로 채웁니다." : "Replace blanks with safe defaults.",
    },
    removeDuplicates: {
      title: isKo ? "중복 행 제거" : "Remove duplicates",
      detail: isKo ? "완전히 같은 행을 하나만 남깁니다." : "Keep only one identical row.",
    },
    normalizeDate: {
      title: isKo ? "날짜 형식 통일" : "Normalize dates",
      detail: isKo ? "2026/03/01 → 2026-03-01 형태로 맞춥니다." : "Convert slash dates to ISO format.",
    },
    dropEmptyRows: {
      title: isKo ? "빈 행 제거" : "Drop empty rows",
      detail: isKo ? "모든 셀이 비어 있는 행을 삭제합니다." : "Remove rows where all values are blank.",
    },
    normalizeCase: {
      title: isKo ? "대소문자 통일" : "Normalize case",
      detail: isKo ? "id·code·email 컬럼을 소문자로 통일합니다." : "Lowercase id, code, and email columns.",
    },
    formatNumbers: {
      title: isKo ? "숫자 형식 정리" : "Format numbers",
      detail: isKo ? "금액·수량 컬럼의 콤마와 불필요한 문자를 제거합니다." : "Strip commas from price and quantity columns.",
    },
    normalizePhone: {
      title: isKo ? "전화번호 형식 통일" : "Normalize phone",
      detail: isKo ? "숫자만 추출해 010-0000-0000 형식으로 맞춥니다." : "Reformat phone numbers to 010-0000-0000 pattern.",
    },
  };

  return (
    <div className="rounded-xl border border-sky-800/40 bg-gradient-to-br from-sky-950/25 to-slate-900/70 overflow-hidden">
      <div className="border-b border-sky-800/30 bg-sky-950/20 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Database size={16} className="text-sky-300" />
          <h2 className="text-sm font-semibold text-white">{isKo ? "데이터 전처리 랩" : "Data Preprocessing Lab"}</h2>
          <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-sky-200">
            Jupyter Style
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {isKo
            ? "샘플 CSV를 골라 전처리 단계를 직접 켜고 끄면서, 전후 비교와 pandas 코드까지 같이 확인하는 교육용 실습실입니다."
            : "Choose a sample CSV, toggle preprocessing steps, compare before and after, and inspect the generated pandas code."}
        </p>
      </div>

      <div className="space-y-4 p-4">
        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            <FileSpreadsheet size={13} />
            {isKo ? "1. 원본 데이터 선택" : "1. Choose raw data"}
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            {DATASETS.map((dataset) => (
              <button
                key={dataset.id}
                type="button"
                onClick={() => loadDataset(dataset)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  dataset.id === datasetId
                    ? "border-sky-500/40 bg-sky-500/15 text-sky-100"
                    : "border-slate-700 bg-slate-900/70 text-slate-400 hover:border-slate-600 hover:text-white"
                }`}
              >
                {dataset.label}
              </button>
            ))}
          </div>
          <p className="mb-3 text-xs text-slate-400">{currentDataset.description}</p>
          <textarea
            value={rawCsv}
            onChange={(event) => setRawCsv(event.target.value)}
            className="h-40 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs leading-5 text-sky-100 focus:border-sky-500 focus:outline-none"
            spellCheck={false}
          />
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            <TableProperties size={13} />
            {isKo ? "2. 문제 탐지" : "2. Detect issues"}
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {[
              { label: isKo ? "행 수" : "Rows", value: stats.rows },
              { label: isKo ? "누락값" : "Missing", value: stats.missing },
              { label: isKo ? "중복 행" : "Duplicates", value: stats.duplicates },
              { label: isKo ? "공백 정리 대상" : "Trim targets", value: stats.trimTargets },
              { label: isKo ? "날짜 통일 대상" : "Date fixes", value: stats.dateTargets },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{item.label}</div>
                <div className="mt-1 text-lg font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            <WandSparkles size={13} />
            {isKo ? "3. 전처리 단계 실행" : "3. Run preprocessing steps"}
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
            {OPERATION_ORDER.map((operation) => {
              const active = activeOperations.includes(operation);
              return (
                <button
                  key={operation}
                  type="button"
                  onClick={() => toggleOperation(operation)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    active
                      ? "border-sky-500/35 bg-sky-500/12"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">{operationLabels[operation].title}</div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
                        active ? "bg-sky-200 text-sky-950" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {active ? (isKo ? "활성" : "On") : (isKo ? "비활성" : "Off")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{operationLabels[operation].detail}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800"
            >
              <RotateCcw size={13} />
              {isKo ? "초기 상태로 되돌리기" : "Reset"}
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/15 px-3 py-2 text-xs text-sky-100 hover:bg-sky-500/25"
            >
              <Download size={13} />
              {isKo ? "정리된 CSV 다운로드" : "Download cleaned CSV"}
            </button>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              <FlaskConical size={13} />
              {isKo ? "4. 전처리 전" : "4. Before cleaning"}
            </div>
            <PreviewTable rows={rawRows} />
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              <Play size={13} />
              {isKo ? "5. 전처리 후" : "5. After cleaning"}
            </div>
            <PreviewTable rows={processed.rows} />
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              {processed.logs.map((log) => (
                <div key={log}>- {log}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            <Database size={13} />
            {isKo ? "6. Jupyter용 pandas 코드" : "6. pandas code for Jupyter"}
          </div>
          <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-xs leading-6 text-emerald-300">
            <code>{notebookCode}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}

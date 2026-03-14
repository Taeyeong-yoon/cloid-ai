"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Check,
  ChevronDown,
  ListChecks,
  Trophy,
  Copy,
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { getProgress, toggleStep, resetProgress, syncProgressToServer } from "@/lib/progress";

// ── 타입 ─────────────────────────────────────────────────────

export interface ChecklistStep {
  title: string;
  description: string;
  action?: string;
  expectedResult?: string;
  failureHint?: string;
  codeSnippet?: string;
}

interface StepChecklistProps {
  contentType: "learning" | "lab" | "skill";
  contentId: string;
  steps: ChecklistStep[];
}

// ── StepItem ─────────────────────────────────────────────────

interface StepItemProps {
  index: number;
  step: ChecklistStep;
  checked: boolean;
  onToggle: () => void;
  isActive: boolean;
  onExpand: () => void;
  onCopySnippet: (code: string) => void;
  copiedSnippet: boolean;
}

function StepItem({
  index, step, checked, onToggle,
  isActive, onExpand, onCopySnippet, copiedSnippet,
}: StepItemProps) {
  const { t } = useTranslation();

  return (
    <div className={`transition-colors ${checked ? "bg-emerald-950/5" : ""}`}>
      {/* 헤더 행 */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800/30 transition-colors"
        onClick={onExpand}
        role="button"
        aria-expanded={isActive}
      >
        {/* 단계 번호/체크 */}
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border transition-all ${
          checked
            ? "bg-emerald-900/50 border-emerald-700 text-emerald-400"
            : "bg-slate-800 border-slate-700 text-slate-500"
        }`}>
          {checked ? <Check size={12} /> : index + 1}
        </span>

        {/* 제목 */}
        <span className={`text-sm flex-1 transition-colors ${
          checked ? "text-slate-500 line-through" : "text-white"
        }`}>
          {step.title}
        </span>

        {/* 체크박스 버튼 */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          aria-label={checked ? t.checklist.uncheck : t.checklist.check}
          className={`w-5 h-5 rounded border transition-all shrink-0 flex items-center justify-center ${
            checked
              ? "bg-emerald-600 border-emerald-500"
              : "border-slate-600 hover:border-violet-500"
          }`}
        >
          {checked && <Check size={12} className="text-white" />}
        </button>

        {/* 펼침 화살표 */}
        <ChevronDown size={14} className={`text-slate-600 shrink-0 transition-transform duration-200 ${
          isActive ? "rotate-180" : ""
        }`} />
      </div>

      {/* 펼쳐진 상세 */}
      {isActive && (
        <div className="px-4 pb-4 pl-[52px] space-y-3 animate-fade-in-up">
          {/* 설명 */}
          <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>

          {/* 행동 지시 */}
          {step.action && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-violet-950/30 border border-violet-800/40">
              <PlayCircle size={14} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                  {t.checklist.action}
                </span>
                <p className="text-xs text-slate-300 mt-0.5">{step.action}</p>
              </div>
            </div>
          )}

          {/* 코드 스니펫 */}
          {step.codeSnippet && (
            <div className="relative group">
              <pre className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-xs font-mono text-emerald-300 overflow-x-auto leading-5">
                {step.codeSnippet}
              </pre>
              <button
                onClick={() => onCopySnippet(step.codeSnippet!)}
                aria-label={t.common.copy}
                className="absolute top-2 right-2 p-1.5 rounded text-slate-600 hover:text-white hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
              >
                {copiedSnippet ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          )}

          {/* 기대 결과 */}
          {step.expectedResult && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
              <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {t.checklist.expected}
                </span>
                <p className="text-xs text-slate-300 mt-0.5">{step.expectedResult}</p>
              </div>
            </div>
          )}

          {/* 실패 힌트 */}
          {step.failureHint && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40">
              <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {t.checklist.if_stuck}
                </span>
                <p className="text-xs text-slate-300 mt-0.5">{step.failureHint}</p>
              </div>
            </div>
          )}

          {/* 완료 버튼 */}
          <button
            onClick={onToggle}
            className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${
              checked
                ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                : "bg-violet-600 hover:bg-violet-500 text-white"
            }`}
          >
            {checked ? t.checklist.mark_incomplete : t.checklist.mark_complete}
          </button>
        </div>
      )}
    </div>
  );
}

// ── StepChecklist 메인 ────────────────────────────────────────

export default function StepChecklist({ contentType, contentId, steps }: StepChecklistProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  useEffect(() => {
    setCompletedSteps(getProgress(contentType, contentId));
  }, [contentType, contentId]);

  const completionRate = steps.length > 0
    ? Math.round((completedSteps.length / steps.length) * 100)
    : 0;

  function handleToggle(index: number) {
    const updated = toggleStep(contentType, contentId, index);
    setCompletedSteps(updated);
    if (user) {
      syncProgressToServer(contentType, contentId, updated, steps.length);
    }
  }

  function handleReset() {
    resetProgress(contentType, contentId);
    setCompletedSteps([]);
    setActiveStep(null);
  }

  const handleCopySnippet = useCallback(async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 1500);
  }, []);

  if (steps.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden">
      {/* 헤더: 진행률 */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ListChecks size={16} className="text-violet-400" />
            <span className="text-sm font-semibold text-white">{t.checklist.title}</span>
            <span className="text-xs text-slate-500">
              {completedSteps.length}/{steps.length}
            </span>
          </div>
          <button
            onClick={handleReset}
            aria-label={t.checklist.reset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            <RotateCcw size={11} /> {t.checklist.reset}
          </button>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        {/* 100% 완료 축하 */}
        {completionRate === 100 && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 animate-fade-in-up">
            <Trophy size={12} />
            {t.checklist.completed_all}
          </div>
        )}
      </div>

      {/* 단계 목록 */}
      <div className="divide-y divide-slate-800/50">
        {steps.map((step, index) => (
          <StepItem
            key={index}
            index={index}
            step={step}
            checked={completedSteps.includes(index)}
            onToggle={() => handleToggle(index)}
            isActive={activeStep === index}
            onExpand={() => setActiveStep(activeStep === index ? null : index)}
            onCopySnippet={handleCopySnippet}
            copiedSnippet={copiedSnippet}
          />
        ))}
      </div>
    </div>
  );
}

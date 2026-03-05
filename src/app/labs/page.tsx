"use client";

import { useState } from "react";
import { FlaskConical, Terminal, Play, Copy, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const difficultyColor: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50",
  intermediate: "text-amber-400 bg-amber-900/30 border-amber-700/50",
};

const categoryColor: Record<string, string> = {
  "Claude Code": "text-violet-400",
  MCP: "text-blue-400",
  Gemini: "text-emerald-400",
};

const COMMANDS = [
  'claude "Create a responsive card component with TypeScript and Tailwind"',
  "npx @modelcontextprotocol/server-filesystem ~/Desktop",
  "npm install @google/generative-ai",
];

export default function LabsPage() {
  const { t } = useTranslation();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const difficultyLabel: Record<string, string> = {
    beginner: t.common.level_beginner,
    intermediate: t.common.level_intermediate,
    advanced: t.common.level_advanced,
  };

  async function copyCommand(cmd: string, idx: number) {
    await navigator.clipboard.writeText(cmd);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  const labs = t.labs.items as Array<{
    title: string;
    description: string;
    category: string;
    difficulty: string;
    steps: string[];
  }>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.labs.title}</h1>
      </div>
      <p className="text-slate-400 text-sm mb-8">{t.labs.desc}</p>

      <div className="grid gap-6">
        {labs.map((lab, i) => (
          <div key={i} className="p-6 rounded-xl border border-slate-800 bg-slate-900/40">
            <div className="flex items-start gap-4 mb-4">
              <span className="w-8 h-8 shrink-0 rounded-full bg-violet-900/50 border border-violet-700 text-violet-300 text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-xs font-medium ${categoryColor[lab.category] ?? "text-slate-400"}`}>
                    {lab.category}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${difficultyColor[lab.difficulty]}`}>
                    {difficultyLabel[lab.difficulty]}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{lab.title}</h2>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-5">{lab.description}</p>

            {/* Command */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  {t.labs.command_label}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3">
                <code className="flex-1 text-sm font-mono text-emerald-300 break-all">
                  {COMMANDS[i]}
                </code>
                <button
                  onClick={() => copyCommand(COMMANDS[i], i)}
                  className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Copy"
                >
                  {copiedIdx === i ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Play size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  {t.labs.steps_label}
                </span>
              </div>
              <ol className="space-y-2">
                {lab.steps.map((step: string, j: number) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-xs flex items-center justify-center mt-0.5">
                      {j + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

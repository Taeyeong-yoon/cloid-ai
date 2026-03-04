const colors: Record<string, string> = {
  Claude: "bg-violet-900/60 text-violet-300 border-violet-700/50",
  MCP: "bg-blue-900/60 text-blue-300 border-blue-700/50",
  "Next.js": "bg-slate-700/60 text-slate-300 border-slate-600/50",
  React: "bg-cyan-900/60 text-cyan-300 border-cyan-700/50",
  Gemini: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
  TypeScript: "bg-blue-900/60 text-blue-300 border-blue-700/50",
  default: "bg-slate-800/60 text-slate-400 border-slate-700/50",
};

export default function TagBadge({ tag }: { tag: string }) {
  const cls = colors[tag] ?? colors.default;
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded border ${cls}`}>
      {tag}
    </span>
  );
}

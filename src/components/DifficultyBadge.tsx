export default function DifficultyBadge({ level }: { level: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    beginner:     { label: "입문", cls: "bg-green-900/40 text-green-400 border-green-800/60" },
    intermediate: { label: "실무", cls: "bg-yellow-900/40 text-yellow-400 border-yellow-800/60" },
    advanced:     { label: "고급", cls: "bg-red-900/40 text-red-400 border-red-800/60" },
  };
  const { label, cls } = map[level] ?? map.beginner;
  return (
    <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

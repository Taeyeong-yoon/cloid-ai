"use client";

interface Props {
  icon: string;
  accentColor: string;
  size?: number;
}

const colorMap: Record<string, string> = {
  amber: "#f59e0b",
  violet: "#8b5cf6",
  teal: "#14b8a6",
  blue: "#3b82f6",
  sky: "#0ea5e9",
  emerald: "#10b981",
  indigo: "#6366f1",
  rose: "#f43f5e",
  fuchsia: "#d946ef",
  orange: "#f97316",
  cyan: "#06b6d4",
};

function LineArt({ children, size, color }: { children: React.ReactNode; size: number; color: string }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} fill="none" aria-hidden="true">
      <rect x="8" y="8" width="104" height="104" rx="24" fill="rgba(15,17,23,0.78)" stroke={`${color}33`} />
      {children}
    </svg>
  );
}

export default function TextbookIcon({ icon, accentColor, size = 120 }: Props) {
  const color = colorMap[accentColor] ?? "#8b5cf6";
  const dim = `${color}33`;
  const stroke = { stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  const icons: Record<string, React.ReactNode> = {
    cowork: (
      <>
        <circle cx="60" cy="54" r="16" {...stroke} />
        <circle cx="60" cy="24" r="7" fill={dim} stroke={color} strokeWidth="1.5" />
        <circle cx="28" cy="90" r="7" fill={dim} stroke={color} strokeWidth="1.5" />
        <circle cx="92" cy="90" r="7" fill={dim} stroke={color} strokeWidth="1.5" />
        <path d="M60 38v-7M48 66l-14 17M72 66l14 17" {...stroke} />
      </>
    ),
    prompt: (
      <>
        <rect x="22" y="26" width="76" height="54" rx="14" fill={dim} stroke={color} strokeWidth="1.8" />
        <path d="M36 45h20M36 58h30M73 42l12 12-12 12" {...stroke} />
      </>
    ),
    terminal: (
      <>
        <rect x="18" y="24" width="84" height="62" rx="16" fill={dim} stroke={color} strokeWidth="1.8" />
        <path d="M34 48l10 8-10 8M52 64h24" {...stroke} />
        <circle cx="30" cy="34" r="3" fill={color} />
        <circle cx="40" cy="34" r="3" fill={color} opacity="0.65" />
      </>
    ),
    agent: (
      <>
        <circle cx="60" cy="60" r="12" fill={dim} stroke={color} strokeWidth="1.8" />
        <circle cx="28" cy="30" r="7" fill={dim} stroke={color} strokeWidth="1.5" />
        <circle cx="92" cy="30" r="7" fill={dim} stroke={color} strokeWidth="1.5" />
        <circle cx="28" cy="90" r="7" fill={dim} stroke={color} strokeWidth="1.5" />
        <path d="M36 36l16 16M84 36L68 52M35 84l18-16" {...stroke} />
      </>
    ),
    api: (
      <>
        <rect x="20" y="34" width="26" height="52" rx="11" fill={dim} stroke={color} strokeWidth="1.8" />
        <rect x="74" y="34" width="26" height="52" rx="11" fill={dim} stroke={color} strokeWidth="1.8" />
        <path d="M46 60h28M56 50l-10 10 10 10M64 50l10 10-10 10" {...stroke} />
      </>
    ),
    chart: (
      <>
        <path d="M28 90V58M52 90V42M76 90V50M92 90V30" {...stroke} />
        <path d="M24 90h72" {...stroke} />
        <circle cx="92" cy="30" r="5" fill={dim} stroke={color} strokeWidth="1.5" />
      </>
    ),
    github: (
      <>
        <circle cx="60" cy="56" r="22" fill={dim} stroke={color} strokeWidth="1.8" />
        <circle cx="44" cy="38" r="5" fill={dim} stroke={color} strokeWidth="1.5" />
        <circle cx="76" cy="38" r="5" fill={dim} stroke={color} strokeWidth="1.5" />
        <path d="M49 72c4-4 18-4 22 0" {...stroke} />
        <path d="M50 78v12M70 78v12" {...stroke} />
        <path d="M43 27l-6-7M77 27l6-7" {...stroke} />
      </>
    ),
    integration: (
      <>
        <path d="M44 46h-8c-8 0-14 6-14 14s6 14 14 14h8" {...stroke} />
        <path d="M76 74h8c8 0 14-6 14-14s-6-14-14-14h-8" {...stroke} />
        <path d="M42 60h36" {...stroke} />
      </>
    ),
    shield: (
      <>
        <path d="M60 22l28 10v24c0 18-10 30-28 42-18-12-28-24-28-42V32l28-10z" fill={dim} stroke={color} strokeWidth="1.8" />
        <path d="M48 58l8 8 16-18" {...stroke} />
      </>
    ),
    multimodal: (
      <>
        <rect x="22" y="26" width="32" height="26" rx="8" fill={dim} stroke={color} strokeWidth="1.6" />
        <path d="M28 46l8-8 6 6 6-8" {...stroke} />
        <rect x="66" y="26" width="32" height="26" rx="8" fill={dim} stroke={color} strokeWidth="1.6" />
        <path d="M74 39h16M74 46h10" {...stroke} />
        <circle cx="60" cy="84" r="16" fill={dim} stroke={color} strokeWidth="1.8" />
        <path d="M56 80c0-4 2-6 4-8 3 2 5 4 5 8a5 5 0 1 1-9 0z" {...stroke} />
      </>
    ),
    compare: (
      <>
        <rect x="20" y="28" width="32" height="56" rx="14" fill={dim} stroke={color} strokeWidth="1.7" />
        <rect x="68" y="28" width="32" height="56" rx="14" fill={dim} stroke={color} strokeWidth="1.7" />
        <path d="M40 42h-8M88 42h-8M40 56h-8M88 56h-8M40 70h-8M88 70h-8" {...stroke} />
      </>
    ),
    mcp: (
      <>
        <circle cx="60" cy="60" r="14" fill={dim} stroke={color} strokeWidth="1.8" />
        <circle cx="24" cy="60" r="7" fill={dim} stroke={color} strokeWidth="1.5" />
        <circle cx="96" cy="36" r="7" fill={dim} stroke={color} strokeWidth="1.5" />
        <circle cx="96" cy="84" r="7" fill={dim} stroke={color} strokeWidth="1.5" />
        <path d="M31 60h15M72 50l17-10M72 70l17 10" {...stroke} />
      </>
    ),
    marketplace: (
      <>
        <path d="M28 44h64l-6 40H34l-6-40z" fill={dim} stroke={color} strokeWidth="1.8" />
        <path d="M40 44c0-11 8-20 20-20s20 9 20 20" {...stroke} />
        <path d="M48 62h24M60 50v24" {...stroke} />
      </>
    ),
  };

  return <LineArt size={size} color={color}>{icons[icon] ?? icons.prompt}</LineArt>;
}

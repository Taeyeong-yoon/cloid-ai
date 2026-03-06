"use client";

import { useState } from "react";
import { BookOpen, FileText, Video, Terminal, ExternalLink, ArrowLeft, Search } from "lucide-react";
import type { LearningTopic, LearningResource } from "@/lib/types";
import TagBadge from "@/components/TagBadge";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const levelColor: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-900/30 border-emerald-700/50",
  intermediate: "text-amber-400 bg-amber-900/30 border-amber-700/50",
  advanced: "text-rose-400 bg-rose-900/30 border-rose-700/50",
};

const resourceIcon = {
  doc: FileText,
  video: Video,
  practice: Terminal,
};

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?\s]+)/);
  return match ? match[1] : null;
}

function getLinkBrand(url: string): { label: string; bg: string; icon: React.ReactNode } {
  // YouTube
  if (/youtube\.com|youtu\.be/.test(url)) return {
    label: "YouTube", bg: "bg-red-600 hover:bg-red-500",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  };
  // Anthropic / Claude
  if (/anthropic\.com|claude\.ai|code\.claude\.com/.test(url)) return {
    label: "Claude", bg: "bg-[#D97706] hover:bg-[#B45309]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017L3.674 20H0L6.569 3.52zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"/></svg>,
  };
  // GitHub
  if (/github\.com/.test(url)) return {
    label: "GitHub", bg: "bg-[#24292e] hover:bg-[#373d43]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
  };
  // OpenAI
  if (/openai\.com|platform\.openai\.com/.test(url)) return {
    label: "OpenAI", bg: "bg-[#10a37f] hover:bg-[#0e8f6f]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>,
  };
  // Google / Gemini / Colab
  if (/google\.com|gemini\.google|googleapis|aistudio\.google|colab\.research/.test(url)) return {
    label: "Google", bg: "bg-[#4285F4] hover:bg-[#3367d6]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
  };
  // MCP
  if (/modelcontextprotocol\.io/.test(url)) return {
    label: "MCP", bg: "bg-violet-700 hover:bg-violet-600",
    icon: <ExternalLink size={10} />,
  };
  // Supabase
  if (/supabase\.com/.test(url)) return {
    label: "Supabase", bg: "bg-[#3ecf8e] hover:bg-[#2db87a] text-black",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.285 12.63.706 13.5 1.45 13.5H12.1a.5.5 0 0 1 .5.5v9.463c.015.987 1.26 1.41 1.874.638l9.262-11.652c.48-.579.059-1.448-.686-1.448H12.4a.5.5 0 0 1-.5-.5V1.036z"/></svg>,
  };
  // Vercel
  if (/vercel\.com/.test(url)) return {
    label: "Vercel", bg: "bg-black hover:bg-slate-800",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>,
  };
  // Stripe
  if (/stripe\.com/.test(url)) return {
    label: "Stripe", bg: "bg-[#635bff] hover:bg-[#4f46e5]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>,
  };
  // LangChain / LangSmith
  if (/langchain\.com/.test(url)) return {
    label: "LangChain", bg: "bg-[#1C3A6A] hover:bg-[#162f57]",
    icon: <svg viewBox="0 0 40 40" fill="currentColor" className="w-3 h-3"><circle cx="20" cy="20" r="20" fill="#1C3A6A"/><text x="20" y="25" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">L</text></svg>,
  };
  // CrewAI
  if (/crewai\.com/.test(url)) return {
    label: "CrewAI", bg: "bg-[#ef4444] hover:bg-[#dc2626]",
    icon: <ExternalLink size={10} />,
  };
  // Cursor
  if (/cursor\.com/.test(url)) return {
    label: "Cursor", bg: "bg-[#1a1a1a] hover:bg-[#2a2a2a]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  };
  // Zapier
  if (/zapier\.com/.test(url)) return {
    label: "Zapier", bg: "bg-[#FF4A00] hover:bg-[#e04200]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M14.924 12.003a2.922 2.922 0 0 1-2.921 2.921 2.922 2.922 0 0 1-2.922-2.921 2.922 2.922 0 0 1 2.922-2.921 2.922 2.922 0 0 1 2.921 2.921zm7.645-1.458H17.8a5.865 5.865 0 0 0-.676-1.635l3.37-3.37-2.035-2.034-3.37 3.37a5.864 5.864 0 0 0-1.634-.677V1.431h-2.916v4.768a5.864 5.864 0 0 0-1.634.677l-3.37-3.37L3.5 5.54l3.37 3.37a5.869 5.869 0 0 0-.676 1.635H1.431v2.916h4.763a5.863 5.863 0 0 0 .676 1.634L3.5 18.465l2.035 2.034 3.37-3.37a5.861 5.861 0 0 0 1.634.677v4.763h2.916V17.81a5.862 5.862 0 0 0 1.634-.677l3.37 3.37 2.035-2.034-3.37-3.37a5.868 5.868 0 0 0 .676-1.634h4.769v-2.922z"/></svg>,
  };
  // n8n
  if (/n8n\.io/.test(url)) return {
    label: "n8n", bg: "bg-[#ea4b71] hover:bg-[#d43d63]",
    icon: <ExternalLink size={10} />,
  };
  // Make / Integromat
  if (/make\.com/.test(url)) return {
    label: "Make", bg: "bg-[#6d00cc] hover:bg-[#5a00a8]",
    icon: <ExternalLink size={10} />,
  };
  // Sentry
  if (/sentry\.io/.test(url)) return {
    label: "Sentry", bg: "bg-[#362d59] hover:bg-[#2d2448]",
    icon: <svg viewBox="0 0 72 66" fill="currentColor" className="w-3 h-3"><path d="M29.35.98a5.04 5.04 0 0 0-8.71 0L.59 37.13a5.04 5.04 0 0 0 4.35 7.56h7.49A38.06 38.06 0 0 1 45 8.04l-4.39 7.6A29.2 29.2 0 0 0 19.2 44.7h8.72a20.5 20.5 0 0 1 15.72-20.09l-4.4 7.61a11.74 11.74 0 0 0-3.36 22.38h25.56a5.04 5.04 0 0 0 4.35-7.56L38.05.98a5.04 5.04 0 0 0-8.7 0z"/></svg>,
  };
  // Python
  if (/python\.org/.test(url)) return {
    label: "Python", bg: "bg-[#3776ab] hover:bg-[#2d5f8a]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05 1.07.13zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.31.33-.25.35-.19.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01.21.03zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>,
  };
  // Notion
  if (/notion\.so/.test(url)) return {
    label: "Notion", bg: "bg-[#1a1a1a] hover:bg-[#2a2a2a]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.887l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>,
  };
  // Microsoft / Copilot
  if (/microsoft\.com/.test(url)) return {
    label: "Microsoft", bg: "bg-[#0078d4] hover:bg-[#006cbf]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M0 0h11.5v11.5H0zm12.5 0H24v11.5H12.5zM0 12.5h11.5V24H0zm12.5 0H24V24H12.5z"/></svg>,
  };
  // Canva
  if (/canva\.com/.test(url)) return {
    label: "Canva", bg: "bg-[#00c4cc] hover:bg-[#00adb3]",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102 0-5.08-1.773-6.665-3.557l.848-2.187c.742.886 3.163 3.35 5.574 3.35.886 0 1.32-.39 1.32-.928 0-1.578-6.11-1.74-6.11-5.39C11.408 6 13.077 5 15.226 5c1.822 0 3.962 1.136 5.26 2.56l-.772 2.046c-.886-.903-2.64-2.42-4.38-2.42-.654 0-1.187.28-1.187.841 0 1.45 6.226 1.668 6.226 5.408.006 2.102-1.726 3.457-3.932 3.457z"/></svg>,
  };
  // ElevenLabs
  if (/elevenlabs\.io/.test(url)) return {
    label: "ElevenLabs", bg: "bg-[#111827] hover:bg-[#1f2937]",
    icon: <ExternalLink size={10} />,
  };
  // Midjourney
  if (/midjourney\.com/.test(url)) return {
    label: "Midjourney", bg: "bg-[#000000] hover:bg-[#1a1a1a]",
    icon: <ExternalLink size={10} />,
  };
  // Ideogram
  if (/ideogram\.ai/.test(url)) return {
    label: "Ideogram", bg: "bg-[#6366f1] hover:bg-[#4f46e5]",
    icon: <ExternalLink size={10} />,
  };
  // Perplexity
  if (/perplexity\.ai/.test(url)) return {
    label: "Perplexity", bg: "bg-[#20808d] hover:bg-[#1a6a75]",
    icon: <ExternalLink size={10} />,
  };
  // Stable Diffusion
  if (/stable-diffusion/.test(url)) return {
    label: "Stable Diffusion", bg: "bg-[#7c3aed] hover:bg-[#6d28d9]",
    icon: <ExternalLink size={10} />,
  };
  // Chroma
  if (/trychroma\.com/.test(url)) return {
    label: "Chroma", bg: "bg-[#f97316] hover:bg-[#ea6c0a]",
    icon: <ExternalLink size={10} />,
  };
  // learnprompting
  if (/learnprompting\.org/.test(url)) return {
    label: "Learn Prompting", bg: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    icon: <ExternalLink size={10} />,
  };
  return {
    label: "바로가기", bg: "bg-slate-700 hover:bg-slate-600",
    icon: <ExternalLink size={10} />,
  };
}

function VideoCard({ r }: { r: LearningResource }) {
  const [active, setActive] = useState(false);
  const videoId = r.url ? getYouTubeId(r.url) : null;
  const searchKeyword = r.search_keyword || r.title;

  return (
    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/40">
      <div className="flex items-start gap-3 mb-3">
        <Video size={16} className="text-violet-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-white text-sm">{r.title}</span>
          {r.description && <p className="text-xs text-slate-400 mt-1">{r.description}</p>}
        </div>
      </div>

      {/* URL 없음 → 유튜브 검색 버튼 */}
      {!videoId && (
        <a
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchKeyword)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors w-full"
        >
          <Search size={12} className="text-red-400" />
          <span>유튜브 검색: <span className="text-red-400">{searchKeyword}</span></span>
        </a>
      )}

      {/* URL 있고 비활성 → 썸네일 */}
      {videoId && !active && (
        <div
          className="relative cursor-pointer rounded-lg overflow-hidden group"
          style={{ aspectRatio: "16/9" }}
          onClick={() => setActive(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={r.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* URL 있고 활성 → iframe */}
      {videoId && active && (
        <div className="rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            loading="lazy"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

function ResourceCard({ r }: { r: LearningResource }) {
  if (r.type === "video") return <VideoCard r={r} />;

  const Icon = resourceIcon[r.type];
  const brand = r.url ? getLinkBrand(r.url) : null;
  return (
    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/40">
      <div className="flex items-start gap-3">
        <Icon size={16} className="text-violet-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{r.title}</span>
            {r.url && brand && (
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-white transition-colors shrink-0 ${brand.bg}`}
              >
                {brand.icon}
                {brand.label}
              </a>
            )}
          </div>
          {r.description && <p className="text-xs text-slate-400 mb-2">{r.description}</p>}
          {r.command && (
            <code className="block text-xs bg-slate-800 text-emerald-300 px-3 py-1.5 rounded font-mono">
              {r.command}
            </code>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LearningClient({ topics }: { topics: LearningTopic[] }) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const topic = topics.find((tp) => tp.id === selectedId);

  const levelLabel: Record<string, string> = {
    beginner: t.common.level_beginner,
    intermediate: t.common.level_intermediate,
    advanced: t.common.level_advanced,
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={22} className="text-violet-400" />
        <h1 className="text-2xl font-bold text-white">{t.learning.title}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className={`md:w-64 shrink-0 space-y-2 ${selectedId ? "hidden md:block" : "block"}`}>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 px-1">
            {t.learning.topics_sidebar}
          </p>
          {topics.map((tp) => (
            <button
              key={tp.id}
              onClick={() => setSelectedId(tp.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                selectedId === tp.id
                  ? "bg-violet-900/40 border-violet-600 text-white"
                  : "bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white"
              }`}
            >
              <div className="text-sm font-medium">{tp.title}</div>
              <div className={`text-xs mt-1 inline-block px-1.5 py-0.5 rounded border ${levelColor[tp.level]}`}>
                {levelLabel[tp.level]}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        {topic && (
          <div className="flex-1 min-w-0">
            <button
              onClick={() => setSelectedId(null)}
              className="md:hidden flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              {t.learning.back_to_topics}
            </button>
            <div className="p-5 sm:p-6 rounded-xl border border-slate-800 bg-slate-900/30">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{topic.title}</h2>
                  <p className="text-slate-400 text-sm">{topic.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded border shrink-0 ${levelColor[topic.level]}`}>
                  {levelLabel[topic.level]}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {topic.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  {t.learning.resources_heading}
                </h3>
                {topic.resources.map((r, i) => <ResourceCard key={i} r={r} />)}
              </div>
            </div>
          </div>
        )}

        {!selectedId && (
          <div className="hidden md:flex flex-1 items-center justify-center h-64 text-slate-500 border border-slate-800 rounded-xl">
            {t.learning.select_topic}
          </div>
        )}
      </div>
    </div>
  );
}

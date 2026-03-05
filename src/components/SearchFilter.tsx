"use client";

import { Search, X } from "lucide-react";
import TagBadge from "./TagBadge";

interface Props {
  allTags: string[];
  onSearchChange: (q: string) => void;
  onTagToggle: (tag: string) => void;
  activeTags: string[];
  query: string;
  placeholder?: string;
}

export default function SearchFilter({
  allTags,
  onSearchChange,
  onTagToggle,
  activeTags,
  query,
  placeholder = "Search...",
}: Props) {
  return (
    <div className="space-y-3 mb-6">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
              activeTags.includes(tag)
                ? "bg-violet-600 border-violet-500 text-white"
                : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";

interface Props {
  signIn: (formData: FormData) => Promise<{ error: string } | undefined>;
  signUp: (formData: FormData) => Promise<{ error: string } | undefined>;
}

export default function AuthForm({ signIn, signUp }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = mode === "login" ? await signIn(formData) : await signUp(formData);
      if (result && "error" in result) setError(result.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          name="email"
          type="email"
          placeholder="이메일"
          required
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
        />
      </div>
      <div className="relative">
        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          minLength={6}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        {mode === "login" ? <LogIn size={16} /> : <UserPlus size={16} />}
        {loading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
      </button>

      <p className="text-center text-sm text-slate-500">
        {mode === "login" ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          className="ml-1.5 text-violet-400 hover:text-violet-300"
        >
          {mode === "login" ? "회원가입" : "로그인"}
        </button>
      </p>
    </form>
  );
}

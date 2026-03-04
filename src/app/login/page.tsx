import { signIn, signUp } from "@/app/actions/auth";
import AuthForm from "./AuthForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60">
        <h1 className="text-2xl font-bold text-white mb-2">CLOID.AI 로그인</h1>
        <p className="text-slate-400 text-sm mb-8">북마크와 즐겨찾기를 저장하려면 로그인하세요.</p>
        <AuthForm signIn={signIn} signUp={signUp} />
      </div>
    </div>
  );
}

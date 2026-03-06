import AuthForm from "./AuthForm";

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            CLOID<span className="text-violet-400">.AI</span>
          </h1>
          <p className="text-slate-400 text-sm">북마크와 즐겨찾기를 저장하려면 로그인하세요.</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}

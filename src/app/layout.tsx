import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "CLOID.AI – AI 연습 포털",
  description: "최신 AI 트렌드를 학습하고 실습하는 자동 업데이트 포털",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f1117] text-slate-200 flex flex-col">
        <Providers>
          <Nav />
          <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">{children}</main>

          {/* ── 푸터 ─────────────────────────────────────────── */}
          <footer className="border-t border-slate-800 bg-[#0f1117]/80 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* 브랜드 + 설명 */}
                <div>
                  <div className="font-bold text-base text-white mb-1">
                    <span className="text-violet-400">CLOID</span>
                    <span className="text-slate-400 font-normal text-sm">.AI</span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs">
                    AI 도구, 프롬프트, 개발 패턴을 학습·실습하는 포털
                  </p>
                </div>

                {/* 링크 + 업데이트 주기 */}
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="flex items-center gap-4">
                    <a
                      href="/learning"
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      자주 묻는 질문
                    </a>
                    <a
                      href="mailto:feedback@cloid.ai"
                      className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      피드백 보내기
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-slate-500">콘텐츠 업데이트 주기: 매일</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/50">
                <p className="text-[10px] text-slate-600 text-center">
                  © {new Date().getFullYear()} CLOID.AI. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

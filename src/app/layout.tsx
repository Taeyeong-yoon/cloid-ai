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
    <html lang="ko">
      <body className="min-h-screen bg-[#0f1117] text-slate-200">
        <Providers>
          <Nav />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

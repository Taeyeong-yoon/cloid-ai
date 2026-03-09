import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";
import FooterFAQ from "@/components/FooterFAQ";

// ── SEO 메타 태그 (2-1) ────────────────────────────────────
export const metadata: Metadata = {
  title: "CLOID.AI – AI 학습·실습 포털 | 프롬프트, API, 에이전트",
  description:
    "AI 입문부터 실무까지, 프롬프트 작성·API 연동·에이전트 구축을 직접 실습하는 무료 AI 학습 포털. 매일 업데이트되는 최신 AI 트렌드와 실습 콘텐츠.",
  keywords: [
    "AI 학습",
    "AI 실습",
    "프롬프트 엔지니어링",
    "Claude API",
    "GPT",
    "MCP",
    "AI 에이전트",
    "LangChain",
    "RAG",
  ],
  authors: [{ name: "CLOID.AI" }],
  creator: "CLOID.AI",
  publisher: "CLOID.AI",
  metadataBase: new URL("https://cloid.ai"),
  alternates: {
    canonical: "https://cloid.ai",
    languages: { ko: "https://cloid.ai", en: "https://cloid.ai" },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    url: "https://cloid.ai",
    siteName: "CLOID.AI",
    title: "CLOID.AI – AI 학습·실습 포털",
    description:
      "AI 입문부터 실무까지, 프롬프트부터 API 연동까지 직접 해보는 무료 AI 연습 포털",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CLOID.AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CLOID.AI – AI 학습·실습 포털",
    description: "AI 입문부터 실무까지, 직접 해보는 무료 AI 연습 포털",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // TODO: Google Search Console에서 인증코드 발급 후 교체
    // 발급: https://search.google.com/search-console → 속성 추가 → HTML 태그 인증
    google: "여기에_구글서치콘솔_인증코드",
    other: {
      // TODO: 네이버 서치어드바이저에서 인증코드 발급 후 교체
      // 발급: https://searchadvisor.naver.com → 사이트 등록 → HTML 태그 인증
      "naver-site-verification": "여기에_네이버_인증코드",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/*
          ═══ 검색엔진 등록 가이드 (수동 작업 필요) ═══

          1. Google Search Console
             - https://search.google.com/search-console 접속
             - "속성 추가" → URL 접두어 → https://cloid.ai 입력
             - HTML 태그 인증 선택 → content 값을 위 metadata.verification.google에 붙여넣기
             - sitemap 제출: https://cloid.ai/sitemap.xml

          2. 네이버 서치어드바이저
             - https://searchadvisor.naver.com 접속
             - "사이트 등록" → https://cloid.ai 입력
             - HTML 태그 인증 → content 값을 metadata.verification.other에 붙여넣기
             - 사이트맵 제출: https://cloid.ai/sitemap.xml
             - 웹 페이지 수집 요청

          3. Google Analytics 4
             - https://analytics.google.com 접속
             - 계정 생성 → 속성 생성 → 웹 데이터 스트림 → 측정 ID 복사
             - 아래 GA4 스크립트의 G-XXXXXXXXXX를 교체

          4. 네이버 애널리틱스
             - https://analytics.naver.com 접속
             - 사이트 등록 → 스크립트 발급 → ID를 아래 스크립트에 교체
        */}

        {/* ── Google Analytics 4 (G-YFNXBBN14Q) ── */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YFNXBBN14Q" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YFNXBBN14Q');
            `,
          }}
        />

        {/* ── Naver Analytics (2-6) ── */}
        {/* TODO: 네이버 애널리틱스에서 사이트 ID 발급 후 교체 */}
        {/* 발급 방법: https://analytics.naver.com → 사이트 등록 → 스크립트 발급 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if(!wcs_add) var wcs_add = {};
              wcs_add["wa"] = "여기에_네이버애널리틱스_ID";
              if(window.wcs) { wcs_do(); }
            `,
          }}
        />
        <script async src="https://wcs.naver.net/wcslog.js" />

        {/* ── JSON-LD 구조화 데이터 (2-4) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CLOID.AI",
              url: "https://cloid.ai",
              description: "AI 입문부터 실무까지, 직접 해보는 무료 AI 학습·실습 포털",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://cloid.ai/learning?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              inLanguage: ["ko", "en"],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "CLOID.AI",
              url: "https://cloid.ai",
              description: "AI 도구, 프롬프트, 개발 패턴을 학습하고 실습하는 포털",
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0f1117] text-slate-200 flex flex-col">
        <Providers>
          <Nav />
          <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">{children}</main>

          {/* ── FAQ (컴팩트) ── */}
          <FooterFAQ />

          {/* ── 푸터 ─────────────────────────────────────────── */}
          <footer className="border-t border-slate-800 bg-[#0f1117]/80 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
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
                      href="/#faq"
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
                    <span className="text-xs text-slate-500">
                      콘텐츠 업데이트 주기: 매일 ·{" "}
                      {new Date().toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      업데이트
                    </span>
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

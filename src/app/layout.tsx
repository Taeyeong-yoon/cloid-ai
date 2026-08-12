import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";
import FooterFAQ from "@/components/FooterFAQ";
import FooterBottom from "@/components/FooterBottom";

// ── SEO 메타 태그 (2-1) ────────────────────────────────────
export const metadata: Metadata = {
  title: "CLOID.AI – AI 클로드 활용 기본 교육 | 무료 6교시 실습 과정",
  description:
    "생성형 AI의 원리부터 프롬프트, 작업공간 정리, 보고서 디자인, 나만의 스킬 만들기까지. 6교시 120슬라이드로 배우는 무료 Claude 실무 교육 과정입니다.",
  keywords: [
    "클로드 교육",
    "Claude 활용법",
    "AI 실무 교육",
    "프롬프트 엔지니어링",
    "Claude Cowork",
    "Claude Skills",
    "AI 업무 자동화",
    "MCP",
    "AI agent",
  ],
  authors: [{ name: "CLOID.AI" }],
  creator: "CLOID.AI",
  publisher: "CLOID.AI",
  metadataBase: new URL("https://cloid.ai"),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
  },
  manifest: "/manifest.json",
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
    title: "CLOID.AI – AI 클로드 활용 기본 교육",
    description:
      "AI 원리 · 프롬프트 · 작업공간 · 보고서 디자인 · 나만의 스킬까지, 6교시 무료 실습 과정.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CLOID.AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CLOID.AI – AI 클로드 활용 기본 교육",
    description: "6교시 120슬라이드로 배우는 무료 Claude 실무 교육 과정.",
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
  // 검색엔진 인증코드는 발급 후 아래 형태로 추가하세요.
  // 플레이스홀더를 그대로 두면 잘못된 meta 태그가 배포되므로 비워 둡니다.
  //   verification: {
  //     google: "<구글 서치콘솔 인증코드>",
  //     other: { "naver-site-verification": "<네이버 인증코드>" },
  //   },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#8B5CF6" />
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

        {/* 네이버 애널리틱스: 사이트 ID 발급 후 스크립트를 여기에 추가하세요.
            발급 전 플레이스홀더 스크립트는 잘못된 ID를 전송하므로 제거했습니다. */}

        {/* ── JSON-LD 구조화 데이터 (2-4) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CLOID.AI",
              url: "https://cloid.ai",
              description:
                "AI 클로드 활용 기본 교육과 실습 자료를 제공하는 무료 학습 사이트.",
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
              description: "AI 도구·프롬프트·업무 활용을 가르치는 온라인 학습 사이트.",
              sameAs: [],
            }),
          }}
        />
        {/* 교육 과정 구조화 데이터 — 검색 결과의 코스 리치 결과용 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              name: "AI 클로드 활용 기본 교육 Level 1",
              description:
                "생성형 AI의 원리부터 프롬프트, 작업공간 정리, 보고서 디자인, 나만의 스킬 만들기까지 다루는 6교시 실습 과정.",
              url: "https://cloid.ai/course",
              inLanguage: "ko",
              isAccessibleForFree: true,
              provider: {
                "@type": "EducationalOrganization",
                name: "CLOID.AI",
                url: "https://cloid.ai",
              },
              hasCourseInstance: {
                "@type": "CourseInstance",
                courseMode: "online",
                courseWorkload: "PT5H30M",
              },
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
          <FooterBottom />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Providers from "@/components/Providers";
import "./globals.css";

// 구글 애널리틱스 측정 ID(G-...). 없으면(로컬 개발 등) 추적 코드를 넣지 않는다.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "Rehearview | 면접, 말로 먼저 연습하세요",
  description: "내 서류로 질문받고 음성으로 답하는 AI 모의면접",
};

// localStorage 접근이 막힌 환경에서도 페이지가 깨지지 않게 try/catch
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: 아래 스크립트가 페이지가 그려지기 전에 html에 dark 클래스를 붙이기 때문
    <html lang="ko" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* 저장된 테마(없으면 시스템 설정)를 첫 화면 전에 적용해서 깜빡임을 막는다 */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Pretendard 가변 폰트 동적 서브셋(OFL). 페이지에 쓰인 글자 범위의 조각만 내려받는다. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/pretendard/pretendardvariable-dynamic-subset.css" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}

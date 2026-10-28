import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  // 개발 서버에 localhost 말고 이 PC의 네트워크 주소(예: 같은 공유기의 휴대폰)로 접속할 때 허용할 호스트.
  // 포트·http:// 없이 호스트명만 적는다 (Next가 요청 Origin의 호스트명과 비교한다). IP가 바뀌면 여기도 바꿔야 함.
  allowedDevOrigins: ["172.30.1.15"],
  // 프록시 기본 대기 시간(30초)보다 AI 분석이 오래 걸릴 수 있어 3분으로 늘린다. 제공사 폴백까지 거쳐도 끝나도록 백엔드의 LLM_TIMEOUT_MS(60초)보다 길게 둔다.
  experimental: { proxyTimeout: 180_000 },
  // 브라우저에서는 /api/* 가 같은 출처로 보이게 백엔드로 프록시한다 (로그인 쿠키가 제3자 쿠키로 막히는 문제 회피)
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/:path*` }];
  },
};

export default nextConfig;

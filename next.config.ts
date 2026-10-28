import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  // 개발 서버에 localhost 말고 이 PC의 네트워크 주소(예: 같은 공유기의 휴대폰)로 접속할 때 허용할 호스트.
  // 포트·http:// 없이 호스트명만 적는다 (Next가 요청 Origin의 호스트명과 비교한다). IP가 바뀌면 여기도 바꿔야 함.
  allowedDevOrigins: ["172.30.1.15"],
  // 브라우저에서는 /api/* 가 같은 출처로 보이게 백엔드로 프록시한다 (로그인 쿠키가 제3자 쿠키로 막히는 문제 회피)
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/:path*` }];
  },
};

export default nextConfig;

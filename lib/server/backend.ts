import "server-only";
import { cookies } from "next/headers";

// 서버 컴포넌트에서 백엔드를 호출한다. 브라우저의 쿠키를 그대로 전달해 로그인 사용자로 요청한다.
// (브라우저 쪽 요청은 next.config의 /api 프록시를 쓰지만, 서버에서는 백엔드에 직접 요청한다)
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export async function backendFetch(path: string, init: RequestInit = {}) {
  const cookie = (await cookies()).toString();
  return fetch(`${BACKEND_URL}${path}`, { ...init, headers: { ...init.headers, cookie }, cache: "no-store" });
}

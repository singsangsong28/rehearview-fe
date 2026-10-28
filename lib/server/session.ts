import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MEMBER_HOME } from "@/lib/routes";
import { backendFetch } from "./backend";

// consented: 현재 버전의 이용약관·개인정보 처리에 동의했는지 (아니면 동의 화면에서 먼저 동의받는다)
export type CurrentUser = { id: string; email: string | null; consented: boolean };

// 서버 컴포넌트에서 로그인 사용자를 확인한다. 같은 요청 안에서는 한 번만 확인하도록 cache로 감싼다
// (레이아웃과 페이지가 함께 호출해도 백엔드 호출 1회).
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!(await cookies()).toString()) return null;
  try {
    const res = await backendFetch("/auth/me");
    return res.ok ? ((await res.json()) as CurrentUser) : null;
  } catch {
    return null; // 백엔드에 닿지 않으면 로그아웃 상태로 취급
  }
});

// 로그인만 필요한 화면 (동의 화면처럼 동의 전에도 열려야 하는 곳): 없으면 로그인 화면으로
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// 회원 전용 화면: 로그인하고 현재 버전의 약관에 동의한 사용자만. 동의 전이면 동의 화면으로 보낸다
// (소셜 가입 직후, 문서 버전이 바뀐 뒤). API도 서버에서 같은 검사를 하므로 화면만 막는 것이 아니다.
export async function requireConsentedUser(): Promise<CurrentUser> {
  const user = await requireUser();
  if (!user.consented) redirect("/consent");
  return user;
}

// 로그인/가입 화면: 이미 로그인했으면 회원 영역으로 보낸다
export async function redirectIfLoggedIn() {
  if (await getCurrentUser()) redirect(MEMBER_HOME);
}

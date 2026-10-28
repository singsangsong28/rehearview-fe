import AppHeader from "@/components/member/AppHeader";
import { requireConsentedUser } from "@/lib/server/session";

// 회원 전용 영역. 이 그룹의 모든 페이지는 로그인하고 약관에 동의해야 들어올 수 있다
// (로그인이 없으면 /login, 동의 전이면 /consent 로).
export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const user = await requireConsentedUser();
  return (
    <>
      <AppHeader user={user} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ConsentForm from "@/components/auth/ConsentForm";
import { AuthShell } from "@/components/auth/ui";
import { MEMBER_HOME } from "@/lib/routes";
import { requireUser } from "@/lib/server/session";

export const metadata: Metadata = { title: "약관 동의 | Rehearview" };

// 로그인은 했지만 현재 버전의 약관에 아직 동의하지 않은 사용자의 화면 (소셜 가입 직후, 약관이 바뀐 뒤).
// 회원 영역((member))과 달리 동의 전에도 열려야 해서 별도 그룹에 둔다.
export default async function ConsentPage() {
  const user = await requireUser();
  if (user.consented) redirect(MEMBER_HOME);
  return (
    <AuthShell title="서비스 이용 동의" subtitle="서비스를 이용하려면 아래 내용에 동의해 주세요">
      <ConsentForm />
    </AuthShell>
  );
}

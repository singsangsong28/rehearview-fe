import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";
import SocialButtons, { Divider } from "@/components/auth/SocialButtons";
import { AuthShell } from "@/components/auth/ui";
import { redirectIfLoggedIn } from "@/lib/server/session";

export const metadata: Metadata = { title: "회원가입 | Rehearview" };

export default async function SignupPage() {
  await redirectIfLoggedIn();
  return (
    <AuthShell title="회원가입" subtitle="무료 베타로 바로 시작할 수 있어요">
      <SignupForm />
      <Divider label="소셜 계정으로 시작하기" />
      <SocialButtons verb="시작하기" />
      {/* 소셜 로그인은 이 화면에서 동의를 받지 않고, 처음 로그인한 직후 동의 화면(/consent)에서 받는다 */}
      <p className="mt-4 text-center text-xs leading-relaxed text-neutral-400">소셜 계정으로 처음 시작하면 로그인 직후에 이용약관과 개인정보 처리 동의 단계가 있어요.</p>
    </AuthShell>
  );
}

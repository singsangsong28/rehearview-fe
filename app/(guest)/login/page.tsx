import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import SocialButtons, { Divider } from "@/components/auth/SocialButtons";
import { AuthShell } from "@/components/auth/ui";
import { redirectIfLoggedIn } from "@/lib/server/session";

export const metadata: Metadata = { title: "로그인 | Rehearview" };

// 소셜 로그인이 실패하면 백엔드가 /login?error=코드 로 돌려보낸다
const OAUTH_ERRORS: Record<string, string> = {
  oauth_failed: "소셜 로그인에 실패했어요. 다시 시도해 주세요",
  email_unverified: "같은 이메일로 가입한 계정이 아직 이메일 인증 전이에요. 인증을 먼저 완료해 주세요",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await redirectIfLoggedIn();
  const { error } = await searchParams;
  return (
    <AuthShell title="로그인" subtitle="면접 연습을 이어서 해 보세요">
      <LoginForm initialError={error ? (OAUTH_ERRORS[error] ?? "로그인에 실패했어요. 다시 시도해 주세요") : undefined} />
      <Divider label="소셜 계정으로 로그인" />
      <SocialButtons />
    </AuthShell>
  );
}

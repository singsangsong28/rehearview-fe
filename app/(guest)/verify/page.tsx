import type { Metadata } from "next";
import VerifyEmail from "@/components/auth/VerifyEmail";
import { AuthShell } from "@/components/auth/ui";

export const metadata: Metadata = { title: "이메일 인증 | Rehearview" };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthShell title="이메일 인증">
      <VerifyEmail token={token} />
    </AuthShell>
  );
}

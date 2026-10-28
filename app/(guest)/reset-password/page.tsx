import type { Metadata } from "next";
import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { AuthShell } from "@/components/auth/ui";
import { FormError, linkClass } from "@/components/common/form";

export const metadata: Metadata = { title: "비밀번호 재설정 | Rehearview" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthShell title="비밀번호 재설정" subtitle="새 비밀번호를 입력해 주세요">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-4">
          <FormError message="재설정 링크가 올바르지 않아요" />
          <Link href="/forgot-password" className={`block text-center text-sm ${linkClass}`}>재설정 메일 다시 받기</Link>
        </div>
      )}
    </AuthShell>
  );
}

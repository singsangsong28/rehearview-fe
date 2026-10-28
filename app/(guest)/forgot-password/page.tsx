import type { Metadata } from "next";
import EmailRequestForm from "@/components/auth/EmailRequestForm";
import { AuthShell } from "@/components/auth/ui";

export const metadata: Metadata = { title: "비밀번호 찾기 | Rehearview" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="비밀번호 찾기" subtitle="가입한 이메일로 재설정 링크를 보내 드려요">
      <EmailRequestForm path="/auth/forgot-password" submitLabel="재설정 메일 받기" />
    </AuthShell>
  );
}

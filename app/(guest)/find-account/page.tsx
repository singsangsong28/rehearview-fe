import type { Metadata } from "next";
import EmailRequestForm from "@/components/auth/EmailRequestForm";
import { AuthShell } from "@/components/auth/ui";

export const metadata: Metadata = { title: "아이디 찾기 | Rehearview" };

// 이 서비스의 아이디는 이메일이라, 입력한 이메일로 가입 여부와 로그인 방식을 알려 준다.
export default function FindAccountPage() {
  return (
    <AuthShell title="아이디 찾기" subtitle="아이디는 가입한 이메일이에요. 이메일을 입력하면 가입 여부와 로그인 방식을 메일로 알려 드려요">
      <EmailRequestForm path="/auth/find-account" submitLabel="안내 메일 받기" />
    </AuthShell>
  );
}

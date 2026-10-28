"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MEMBER_HOME } from "@/lib/routes";
import { useApiRequest } from "@/lib/useApiRequest";
import { Field, FormError, SubmitButton, linkClass } from "@/components/common/form";

export default function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const { pending, error, submit } = useApiRequest();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const user = await submit("/auth/login", { email: form.get("email"), password: form.get("password") });
    if (user) {
      router.push(MEMBER_HOME);
      router.refresh(); // 서버 컴포넌트가 새 로그인 상태를 읽도록
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error ?? initialError ?? null} />
      <Field label="이메일" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      <Field label="비밀번호" name="password" type="password" autoComplete="current-password" required />
      <SubmitButton pending={pending}>로그인</SubmitButton>
      <p className="flex justify-between text-sm text-neutral-500">
        <span>
          <Link href="/find-account" className={linkClass}>아이디 찾기</Link>
          {" · "}
          <Link href="/forgot-password" className={linkClass}>비밀번호 찾기</Link>
        </span>
        <Link href="/signup" className={linkClass}>회원가입</Link>
      </p>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useApiRequest } from "@/lib/useApiRequest";
import { Field, FormError, FormNotice, SubmitButton, linkClass } from "@/components/common/form";

// 이메일 하나만 받아 안내 메일을 요청하는 폼 (비밀번호 찾기, 아이디 찾기 공용)
export default function EmailRequestForm({ path, submitLabel }: { path: string; submitLabel: string }) {
  const { pending, error, submit } = useApiRequest();
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await submit<{ message: string }>(path, { email: new FormData(e.currentTarget).get("email") });
    if (result) setDone(result.message);
  }

  if (done) {
    return (
      <div className="space-y-4">
        <FormNotice>{done} 메일이 안 보이면 스팸함도 확인해 주세요.</FormNotice>
        <Link href="/login" className={`block text-center text-sm ${linkClass}`}>로그인 화면으로</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error} />
      <Field label="가입한 이메일" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
      <p className="text-center text-sm">
        <Link href="/login" className={linkClass}>로그인으로 돌아가기</Link>
      </p>
    </form>
  );
}

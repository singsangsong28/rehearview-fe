"use client";

import Link from "next/link";
import { useState } from "react";
import { useApiRequest } from "@/lib/useApiRequest";
import { Field, FormError, FormNotice, SubmitButton } from "@/components/common/form";

export default function ResetPasswordForm({ token }: { token: string }) {
  const { pending, error, submit } = useApiRequest();
  const [done, setDone] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    setMismatch(password !== form.get("passwordConfirm"));
    if (password !== form.get("passwordConfirm")) return;
    if (await submit("/auth/reset-password", { token, password })) setDone(true);
  }

  if (done) {
    return (
      <div className="space-y-4">
        <FormNotice>비밀번호가 변경되었어요. 보안을 위해 다른 기기의 로그인은 모두 해제돼요.</FormNotice>
        <Link href="/login" className="block w-full rounded-lg bg-violet-600 px-4 py-2.5 text-center font-medium text-white hover:bg-violet-700">
          로그인하기
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={mismatch ? "비밀번호가 서로 달라요" : error} />
      <Field label="새 비밀번호 (8자 이상)" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
      <Field label="새 비밀번호 확인" name="passwordConfirm" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
      <SubmitButton pending={pending}>비밀번호 변경</SubmitButton>
    </form>
  );
}

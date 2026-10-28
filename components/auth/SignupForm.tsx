"use client";

import Link from "next/link";
import { useState } from "react";
import { useApiRequest } from "@/lib/useApiRequest";
import { Field, FormError, FormNotice, SubmitButton, linkClass } from "@/components/common/form";
import ConsentChecks from "./ConsentChecks";

export default function SignupForm() {
  const { pending, error, submit } = useApiRequest();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [mismatch, setMismatch] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [consentError, setConsentError] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setMismatch(password !== form.get("passwordConfirm"));
    if (password !== form.get("passwordConfirm")) return;
    setConsentError(!agreed);
    if (!agreed) return;
    // agree: 이용약관, 개인정보 처리(AI 전송 포함), 만 14세 이상에 모두 동의했다는 값. 서버가 동의 시각과 문서 버전을 기록한다.
    if (await submit("/auth/signup", { email, password, agree: true })) setSentTo(email);
  }

  if (sentTo) {
    return (
      <div className="space-y-4">
        <FormNotice>
          <b>{sentTo}</b>로 인증 메일을 보냈어요. 메일의 링크를 누르면 가입이 완료돼요. 메일이 안 보이면 스팸함도 확인해 주세요.
        </FormNotice>
        <Link href="/login" className={`block text-center text-sm ${linkClass}`}>로그인 화면으로</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={mismatch ? "비밀번호가 서로 달라요" : consentError ? "필수 동의 항목에 모두 체크해 주세요" : error} />
      <Field label="이메일" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      <Field label="비밀번호 (8자 이상)" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
      <Field label="비밀번호 확인" name="passwordConfirm" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
      <ConsentChecks
        onChange={(all) => {
          setAgreed(all);
          if (all) setConsentError(false);
        }}
      />
      <SubmitButton pending={pending}>가입하기</SubmitButton>
      <p className="text-center text-sm text-neutral-500">
        이미 계정이 있나요? <Link href="/login" className={linkClass}>로그인</Link>
      </p>
    </form>
  );
}

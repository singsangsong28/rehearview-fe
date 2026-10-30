"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { MEMBER_HOME } from "@/lib/routes";
import { useApiRequest } from "@/lib/useApiRequest";
import { Field, FormError, SubmitButton, linkClass } from "@/components/common/form";

// 비어 있으면(로컬) 봇 검증 위젯을 그리지 않는다. 백엔드의 TURNSTILE_SECRET_KEY와 함께 넣어야 한다.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const { pending, error, submit } = useApiRequest();
  const [token, setToken] = useState<string | null>(null);
  const [widgetKey, setWidgetKey] = useState(0); // 토큰은 1회용이라 전송 뒤 위젯을 새로 만든다

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const user = await submit("/auth/login", { email: form.get("email"), password: form.get("password"), turnstileToken: token });
    setToken(null);
    setWidgetKey((k) => k + 1);
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
      {TURNSTILE_SITE_KEY && (
        <Turnstile
          key={widgetKey}
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={setToken}
          onExpire={() => setToken(null)}
          onError={() => setToken(null)}
          options={{ size: "flexible" }}
        />
      )}
      <SubmitButton pending={pending} disabled={!!TURNSTILE_SITE_KEY && !token}>로그인</SubmitButton>
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

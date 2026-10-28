"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { postJson } from "@/lib/api";
import { FormError, FormNotice, linkClass } from "@/components/common/form";

// 메일 링크로 들어오면 토큰으로 바로 인증을 시도한다.
export default function VerifyEmail({ token }: { token?: string }) {
  const [state, setState] = useState<"loading" | "done" | { error: string }>(token ? "loading" : { error: "인증 링크가 올바르지 않아요" });
  // 토큰은 1회용이라 개발 모드의 effect 이중 실행에서도 한 번만 호출한다
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    postJson("/auth/verify", { token }).then((r) => setState(r.ok ? "done" : { error: r.error }));
  }, [token]);

  if (state === "loading") return <p className="text-sm text-neutral-500">이메일을 인증하는 중이에요...</p>;
  if (state === "done")
    return (
      <div className="space-y-4">
        <FormNotice>이메일 인증이 완료되었어요. 이제 로그인할 수 있어요.</FormNotice>
        <Link href="/login" className="block w-full rounded-lg bg-violet-600 px-4 py-2.5 text-center font-medium text-white hover:bg-violet-700">
          로그인하기
        </Link>
      </div>
    );
  return (
    <div className="space-y-4">
      <FormError message={state.error} />
      <p className="text-sm text-neutral-500">
        링크가 만료됐다면 <Link href="/forgot-password" className={linkClass}>비밀번호 찾기</Link>에서 인증 메일을 다시 받을 수 있어요.
      </p>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "@/components/common/form";
import { deleteRequest } from "@/lib/api";

const PHRASE = "계정 삭제";

// 회원 탈퇴. 되돌릴 수 없어서 문구를 직접 입력해야 버튼이 켜진다.
export default function DeleteAccountForm() {
  const router = useRouter();
  const [typed, setTyped] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setPending(true);
    setError(null);
    const result = await deleteRequest("/auth/me");
    if (!result.ok) {
      setPending(false);
      return setError(result.error);
    }
    router.push("/");
    router.refresh(); // 서버 컴포넌트의 로그인 상태를 새로 읽는다
  }

  return (
    <div className="rounded-2xl border border-red-500/30 p-6">
      <h2 className="font-bold text-red-600 dark:text-red-300">계정 삭제</h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        계정을 삭제하면 로그인 정보, 연결된 소셜 계정, 모든 면접 기록(질문, 답변, 리포트)이 <b>즉시 지워지고 되돌릴 수 없어요.</b> 장애에 대비한 백업에는 최대 14일 남을 수 있어요. 필요한 기록은 미리 확인해 두세요.
      </p>
      <label className="mt-4 block text-sm font-medium">
        확인을 위해 &quot;{PHRASE}&quot;를 입력해 주세요
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
          className="mt-1.5 w-full rounded-lg border border-black/15 bg-transparent px-3.5 py-2.5 font-normal outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-white/20"
        />
      </label>
      <div className="mt-3 space-y-3">
        <FormError message={error} />
        <button
          type="button"
          onClick={remove}
          disabled={typed.trim() !== PHRASE || pending}
          className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {pending ? "삭제하는 중..." : "계정 영구 삭제"}
        </button>
      </div>
    </div>
  );
}

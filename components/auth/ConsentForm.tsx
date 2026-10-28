"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "@/components/common/form";
import { deleteRequest } from "@/lib/api";
import { MEMBER_HOME } from "@/lib/routes";
import { useApiRequest } from "@/lib/useApiRequest";
import ConsentChecks from "./ConsentChecks";

// 동의 화면: 소셜 로그인으로 처음 들어왔거나 약관이 바뀌어 다시 동의가 필요한 사용자가 쓴다.
// 동의하지 않으면 서비스를 쓸 수 없고, 계정을 지우고 나갈 수 있다.
export default function ConsentForm() {
  const router = useRouter();
  const { pending, error, submit } = useApiRequest();
  const [agreed, setAgreed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) return;
    if (await submit("/auth/consent", { agree: true })) {
      router.push(MEMBER_HOME);
      router.refresh(); // 서버 컴포넌트가 새 동의 상태를 읽도록
    }
  }

  async function leave() {
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteRequest("/auth/me");
    if (!result.ok) {
      setDeleting(false);
      return setDeleteError(result.error);
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormError message={error} />
        <ConsentChecks onChange={setAgreed} />
        <button
          type="submit"
          disabled={!agreed || pending}
          className="w-full rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {pending ? "처리 중..." : "동의하고 시작하기"}
        </button>
      </form>

      <div className="border-t border-black/10 pt-4 text-center text-sm text-neutral-500 dark:border-white/10">
        {confirmDelete ? (
          <div className="space-y-2">
            <p>동의하지 않으면 서비스를 쓸 수 없어요. 계정을 삭제하고 나갈까요? 되돌릴 수 없어요.</p>
            <FormError message={deleteError} />
            <div className="flex justify-center gap-3">
              <button type="button" onClick={leave} disabled={deleting} className="rounded-full bg-red-600 px-4 py-1.5 font-medium text-white hover:bg-red-700 disabled:opacity-60">
                {deleting ? "삭제 중..." : "계정 삭제하고 나가기"}
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} disabled={deleting} className="hover:text-foreground">
                취소
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="hover:text-foreground">
            동의하지 않고 나가기 (계정 삭제)
          </button>
        )}
      </div>
    </div>
  );
}

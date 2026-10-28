"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteRequest } from "@/lib/api";

// 삭제는 되돌릴 수 없어서 한 번 더 확인한다 (브라우저 기본 팝업 대신 그 자리에서 확인 버튼을 보여 준다)
export default function DeleteInterviewButton({ id }: { id: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "confirm" | "deleting">("idle");
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setStep("deleting");
    setError(null);
    const result = await deleteRequest(`/interviews/${id}`);
    if (!result.ok) {
      setError(result.error);
      return setStep("confirm");
    }
    router.refresh(); // 목록을 새로 불러온다
  }

  if (step === "idle") {
    return (
      <button type="button" onClick={() => setStep("confirm")} className="text-sm text-neutral-500 hover:text-red-600 dark:hover:text-red-300">
        삭제
      </button>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-neutral-500">{error ?? "질문과 답변, 리포트가 모두 지워져요."}</span>
      <button type="button" onClick={remove} disabled={step === "deleting"} className="rounded-full bg-red-500 px-3 py-1 font-medium text-white hover:bg-red-600 disabled:opacity-60">
        {step === "deleting" ? "삭제 중..." : "삭제하기"}
      </button>
      <button type="button" onClick={() => setStep("idle")} disabled={step === "deleting"} className="text-neutral-500 hover:text-foreground">
        취소
      </button>
    </span>
  );
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { postJson, type ApiResult } from "@/lib/api";
import { meKey } from "@/lib/queries";

// 폼 전송 공통: 전송 중 상태와 오류 메시지를 관리하고 성공 시 응답을 돌려준다.
export function useApiRequest() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation({ mutationFn: ({ path, body }: { path: string; body: object }) => postJson<unknown>(path, body) });

  async function submit<T = { message?: string }>(path: string, body: object): Promise<T | null> {
    setError(null);
    const result = (await mutation.mutateAsync({ path, body })) as ApiResult<T>;
    if (!result.ok) {
      setError(result.error);
      return null;
    }
    // 로그인·동의처럼 로그인 상태를 바꿀 수 있는 요청이 성공하면 캐시된 "내 정보"를 새로 읽게 한다
    void queryClient.invalidateQueries({ queryKey: meKey });
    return result.data;
  }

  return { pending: mutation.isPending, error, submit };
}

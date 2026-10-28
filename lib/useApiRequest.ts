"use client";

import { useState } from "react";
import { postJson } from "@/lib/api";

// 폼 전송 공통: 전송 중 상태와 오류 메시지를 관리하고 성공 시 응답을 돌려준다.
export function useApiRequest() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit<T = { message?: string }>(path: string, body: object): Promise<T | null> {
    setPending(true);
    setError(null);
    const result = await postJson<T>(path, body);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return null;
    }
    return result.data;
  }

  return { pending, error, submit };
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getJson } from "@/lib/api";

// 브라우저에서 읽는 데이터의 캐시 키와 조회 훅. 로그인·로그아웃·계정 삭제처럼 바뀌는 시점에 키로 무효화한다.
export const meKey = ["me"] as const;

// 내 로그인 상태. 로그인하지 않았으면(401) 오류 상태가 된다.
export function useMe() {
  return useQuery({
    queryKey: meKey,
    queryFn: async () => {
      const result = await getJson<{ id: string; email: string | null }>("/auth/me");
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
  });
}

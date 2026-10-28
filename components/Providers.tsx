"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// 브라우저 쪽 데이터 캐시(TanStack Query). 서버 컴포넌트가 가져오는 데이터는 여기 캐시와 무관하다.
export default function Providers({ children }: { children: React.ReactNode }) {
  // useState 로 한 번만 만들어야 렌더링마다 캐시가 초기화되지 않는다
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          // 30초 동안은 같은 데이터를 다시 요청하지 않는다. 실패(예: 로그인 안 함 401)는 재시도하지 않는다.
          queries: { staleTime: 30_000, retry: false, refetchOnWindowFocus: false },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

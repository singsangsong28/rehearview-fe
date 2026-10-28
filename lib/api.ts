// 백엔드 호출. 브라우저에서는 next.config의 rewrites 덕분에 /api/* 로 같은 출처 요청이 된다.
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function request<T>(method: "POST" | "DELETE", path: string, body?: object): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`/api${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({})); // 요청 제한 응답이나 204처럼 JSON이 아닐 수 있다
    if (!res.ok) {
      // 서버가 준 메시지가 있으면 그대로 (예: "하루에 5번까지 면접을 진행할 수 있습니다"), 없으면 일반 문구
      const generic = res.status === 429 ? "요청이 너무 많아요. 잠시 후 다시 시도해 주세요" : "문제가 발생했어요. 잠시 후 다시 시도해 주세요";
      return { ok: false, error: data.error ?? generic };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요" };
  }
}

export const postJson = <T = { message?: string }>(path: string, body: object) => request<T>("POST", path, body);
export const deleteRequest = (path: string) => request<Record<string, never>>("DELETE", path);

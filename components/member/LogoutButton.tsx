"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/");
    router.refresh(); // 서버 컴포넌트의 로그인 상태를 새로 읽는다
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
    >
      로그아웃
    </button>
  );
}

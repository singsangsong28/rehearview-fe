"use client";

import { MEMBER_HOME } from "@/lib/routes";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import Skeleton from "@/components/common/Skeleton";
import { meKey, useMe } from "@/lib/queries";

// 랜딩 헤더 우측의 로그인 상태 영역. 로그인했으면 회원 영역으로 가는 버튼과 로그아웃, 아니면 로그인/시작하기.
// (랜딩은 비회원 그룹이라 서버에서 로그인을 확인하지 않고, 브라우저에서 확인한다. 결과는 캐시에 남아 다시 오면 바로 보인다)
export default function HeaderAuth() {
  const queryClient = useQueryClient();
  const me = useMe();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    await queryClient.invalidateQueries({ queryKey: meKey }); // 다시 확인하면 401 이라 로그아웃 상태가 된다
  }

  // 확인 전: 잘못된 버튼이 잠깐 보이지 않게 자리만 잡아 둔다
  if (me.isPending) return <Skeleton className="h-9 w-44 rounded-full" />;

  if (me.isSuccess) {
    return (
      <>
        <button
          type="button"
          onClick={logout}
          className="text-neutral-600 hover:text-foreground dark:text-neutral-300"
        >
          로그아웃
        </button>
        <Link
          href={MEMBER_HOME}
          className="rounded-full bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700"
        >
          내 면접
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="text-neutral-600 hover:text-foreground dark:text-neutral-300"
      >
        로그인
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700"
      >
        시작하기
      </Link>
    </>
  );
}

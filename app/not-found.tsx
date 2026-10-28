import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/common/Logo";

export const metadata: Metadata = { title: "페이지를 찾을 수 없어요 | Rehearview" };

// 없는 주소이거나 notFound()가 불린 경우(없는 면접, 남의 면접 등)에 보이는 화면
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <LogoMark size={48} />
      <p className="mt-6 text-sm font-semibold text-violet-600 dark:text-violet-300">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">페이지를 찾을 수 없어요</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">주소가 잘못되었거나 삭제된 페이지예요. 주소를 다시 확인하거나 아래에서 이동해 주세요.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-violet-600 px-6 py-2.5 font-medium text-white hover:bg-violet-700">
          홈으로
        </Link>
        <Link href="/interviews" className="rounded-full border border-black/10 px-6 py-2.5 font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
          내 면접
        </Link>
      </div>
    </main>
  );
}

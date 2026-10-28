import type { Metadata } from "next";
import Link from "next/link";
import InterviewCard, { type InterviewSummary } from "@/components/member/InterviewCard";
import { backendFetch } from "@/lib/server/backend";

export const metadata: Metadata = { title: "내 면접 | Rehearview" };

// TODO: 기록이 많아지면 페이지 나누기 (지금은 백엔드가 전체를 최신순으로 돌려준다)
export default async function InterviewsPage() {
  const res = await backendFetch("/interviews");
  const interviews = res.ok ? ((await res.json()) as InterviewSummary[]) : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">내 면접</h1>
        <Link href="/interviews/new" className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700">
          새 면접 시작
        </Link>
      </div>

      {interviews === null ? (
        <p role="alert" className="mt-8 rounded-2xl bg-red-500/10 px-6 py-5 text-sm text-red-600 dark:text-red-300">
          면접 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      ) : interviews.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center dark:border-white/20">
          <p className="font-medium">아직 진행한 면접이 없어요</p>
          <p className="mt-1.5 text-sm text-neutral-500">서류를 올리고 첫 면접을 시작해 보세요.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {interviews.map((iv) => (
            <InterviewCard key={iv.id} interview={iv} />
          ))}
        </ul>
      )}
    </div>
  );
}

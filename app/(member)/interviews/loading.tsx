import Skeleton from "@/components/common/Skeleton";

// 내 면접 목록 자리 (제목 줄 + 카드 3개)
export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl" role="status" aria-label="면접 목록을 불러오는 중이에요">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <ul className="mt-8 space-y-4">
        {[0, 1, 2].map((i) => (
          <li key={i} className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-3 h-4 w-1/2" />
            <Skeleton className="mt-4 h-4 w-24" />
          </li>
        ))}
      </ul>
    </div>
  );
}

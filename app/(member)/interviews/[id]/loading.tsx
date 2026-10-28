import Skeleton from "@/components/common/Skeleton";

// 면접(진행 또는 리포트) 화면 자리
export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl space-y-8" role="status" aria-label="면접을 불러오는 중이에요">
      <div className="space-y-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-28 w-full rounded-2xl" />
    </div>
  );
}

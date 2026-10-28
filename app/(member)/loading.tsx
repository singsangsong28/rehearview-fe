import Skeleton from "@/components/common/Skeleton";

// 회원 영역의 페이지 기본 로딩 화면 (헤더는 그대로 보이고 본문만 바뀐다)
export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6" role="status" aria-label="불러오는 중이에요">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  );
}

import Spinner from "@/components/common/Spinner";

// 페이지(레이아웃 포함)를 서버에서 가져오는 동안 보이는 화면
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner size={36} />
    </div>
  );
}

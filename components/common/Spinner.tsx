// 돌아가는 원. 화면 전체를 기다릴 때나 버튼 옆에 쓴다. 스크린 리더에는 label 을 읽어 준다.
export default function Spinner({ size = 28, label = "불러오는 중이에요" }: { size?: number; label?: string }) {
  return (
    <span role="status" className="inline-flex items-center justify-center">
      <span
        className="animate-spin rounded-full border-2 border-violet-600/25 border-t-violet-600"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

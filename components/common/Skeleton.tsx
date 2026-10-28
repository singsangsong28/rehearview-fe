// 내용이 올 자리를 흐릿한 블록으로 미리 잡아 두는 틀. 크기와 모양은 className 으로 정한다 (예: "h-4 w-40").
// 움직임을 줄인 설정(prefers-reduced-motion)에서는 깜빡이지 않는다.
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-black/10 motion-reduce:animate-none dark:bg-white/10 ${className}`} />;
}

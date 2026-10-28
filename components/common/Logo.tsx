import { useId } from "react";

// 말풍선 + 음성 파형 마크. 같은 페이지에 여러 개 있어도 그라데이션 id가 겹치지 않게 useId를 쓴다.
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  const gradient = useId();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <path
        d="M18 5H46a14 14 0 0 1 14 14V35a14 14 0 0 1-14 14H31L13 60L18 49A14 14 0 0 1 4 35V19A14 14 0 0 1 18 5Z"
        fill={`url(#${gradient})`}
      />
      <g fill="#fff">
        <rect x="14" y="19" width="6" height="16" rx="3" />
        <rect x="24" y="11" width="6" height="32" rx="3" />
        <rect x="34" y="15" width="6" height="24" rx="3" />
        <rect x="44" y="21" width="6" height="12" rx="3" />
      </g>
    </svg>
  );
}

// 마크 + 워드마크. 글자색은 주변 text 색을 따라가서 다크 모드에서도 그대로 쓸 수 있다.
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label="Rehearview">
      <LogoMark size={size} />
      <span className="font-bold tracking-tight leading-none" style={{ fontSize: size * 0.75 }}>
        Rehear<span className="text-violet-500 dark:text-violet-400">view</span>
      </span>
    </span>
  );
}

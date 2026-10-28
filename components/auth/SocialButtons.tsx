// 소셜 로그인 시작은 백엔드가 제공사 로그인 화면으로 보내 준다 (/api/auth/{provider}).
// TODO: 아이콘은 단순화한 로고다. 공개 전 각 제공사(카카오, 네이버, 구글, GitHub)의 로고·버튼 가이드라인에 맞는 공식 에셋으로 교체.
const icon = (viewBox: string, children: React.ReactNode) => (
  <svg viewBox={viewBox} width="20" height="20" aria-hidden="true">
    {children}
  </svg>
);

const PROVIDERS = [
  {
    id: "github",
    label: "GitHub",
    className: "bg-[#24292f] text-white hover:bg-[#1b1f23] dark:border dark:border-white/20",
    icon: icon(
      "0 0 24 24",
      <path
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />,
    ),
  },
  {
    id: "google",
    label: "Google",
    className: "border border-black/15 bg-white hover:bg-neutral-50",
    icon: icon(
      "0 0 18 18",
      <>
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
        <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
      </>,
    ),
  },
  {
    id: "kakao",
    label: "카카오",
    className: "bg-[#FEE500] text-[#191919] hover:bg-[#f5dc00]",
    icon: icon(
      "0 0 24 24",
      <path
        fill="currentColor"
        d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"
      />,
    ),
  },
  {
    id: "naver",
    label: "네이버",
    className: "bg-[#03C75A] text-white hover:bg-[#02b350]",
    icon: icon("0 0 24 24", <path fill="currentColor" d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />),
  },
];

export default function SocialButtons({ verb = "로그인" }: { verb?: string }) {
  return (
    <div className="flex justify-center gap-3">
      {PROVIDERS.map((p) => (
        // 페이지 이동이 필요해서 <a>를 쓴다 (Next의 클라이언트 라우팅을 거치면 안 됨)
        <a
          key={p.id}
          href={`/api/auth/${p.id}`}
          aria-label={`${p.label}로 ${verb}`}
          title={`${p.label}로 ${verb}`}
          className={`flex h-11 w-11 items-center justify-center rounded-full ${p.className}`}
        >
          {p.icon}
        </a>
      ))}
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-neutral-400">
      <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      {label}
      <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
    </div>
  );
}

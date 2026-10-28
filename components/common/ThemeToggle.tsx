"use client";

// 라이트/다크 전환. 현재 상태는 <html class="dark"> 자체가 기준이라 별도 상태 없이 클래스만 뒤집고,
// 아이콘은 CSS(dark:)로 바꾼다. 선택은 localStorage에 저장 (layout의 스크립트가 다음 방문 때 읽는다).
export default function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // 저장이 막힌 환경에서는 이번 방문에만 적용
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="라이트/다크 모드 전환"
      title="라이트/다크 모드 전환"
      className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
    >
      {/* 라이트일 때는 달(다크로 전환), 다크일 때는 해(라이트로 전환) */}
      <svg className="dark:hidden" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg className="hidden dark:block" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}

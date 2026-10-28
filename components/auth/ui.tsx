import Link from "next/link";
import Logo from "@/components/common/Logo";

// 인증 화면 공통 틀: 로고 + 카드
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link href="/" aria-label="Rehearview 홈" className="mb-8">
        <Logo size={32} />
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-black/10 p-7 dark:border-white/10">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

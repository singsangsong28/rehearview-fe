import Link from "next/link";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import type { CurrentUser } from "@/lib/server/session";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/interviews", label: "내 면접" },
  { href: "/interviews/new", label: "새 면접" },
  { href: "/account", label: "내 계정" },
];

// 회원 영역 상단 바
export default function AppHeader({ user }: { user: CurrentUser }) {
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-background/80 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/interviews" aria-label="내 면접으로 이동">
            <Logo size={28} />
          </Link>
          <nav className="hidden gap-6 text-sm text-neutral-600 sm:flex dark:text-neutral-300">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-foreground">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {/* 소셜 가입자는 이메일이 없을 수 있다 */}
          <span className="hidden max-w-48 truncate text-sm text-neutral-600 md:inline dark:text-neutral-300">{user.email ?? "내 계정"}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

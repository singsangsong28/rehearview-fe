import Link from "next/link";
import Logo from "@/components/common/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-neutral-500 md:flex-row">
        <Logo size={24} />
        <nav className="flex gap-6">
          <Link href="/privacy" className="hover:text-foreground">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-foreground">이용약관</Link>
        </nav>
        <p>© 2026 Rehearview</p>
      </div>
    </footer>
  );
}

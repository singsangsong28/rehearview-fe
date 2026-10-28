import Link from "next/link";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import HeaderAuth from "./HeaderAuth";

const NAV = [
  { href: "#how", label: "사용법" },
  { href: "#features", label: "기능" },
  { href: "#privacy", label: "개인정보" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-background/80 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="Rehearview 홈">
          <Logo size={28} />
        </Link>
        <nav className="hidden gap-8 text-sm text-neutral-600 md:flex dark:text-neutral-300">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-foreground">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <ThemeToggle />
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}

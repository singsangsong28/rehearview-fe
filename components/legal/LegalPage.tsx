import Link from "next/link";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import { LEGAL } from "@/lib/legal";

// 개인정보처리방침·이용약관 공통 틀: 헤더, 시행일, 초안 안내, 본문, 서로 이동하는 링크
export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" aria-label="Rehearview 홈">
            <Logo size={28} />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <ThemeToggle />
            <Link href="/" className="text-neutral-600 hover:text-foreground dark:text-neutral-300">
              홈으로
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500">시행일 {LEGAL.effectiveDate}</p>

        {LEGAL.draft && (
          <p role="note" className="mt-6 rounded-xl bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
            이 문서는 <b>초안</b>입니다. 대괄호([ ])로 표시된 운영자 정보와 시행일을 채우고 법률 전문가의 검토를 거친 뒤 공개해야 합니다.
          </p>
        )}

        <div className="mt-10 space-y-10">{children}</div>

        <nav className="mt-16 flex gap-6 border-t border-black/5 pt-6 text-sm text-neutral-500 dark:border-white/10">
          <Link href="/privacy" className="hover:text-foreground">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-foreground">이용약관</Link>
        </nav>
      </main>
    </>
  );
}

export function LegalSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-neutral-700 dark:text-neutral-300">{children}</div>
    </section>
  );
}

// 항목이 많은 내용을 표로 보여 준다 (좁은 화면에서는 가로로 스크롤)
export function LegalTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead className="bg-neutral-50 dark:bg-white/5">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-black/10 align-top dark:border-white/10">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Ul = ({ children }: { children: React.ReactNode }) => <ul className="list-disc space-y-1.5 pl-5">{children}</ul>;

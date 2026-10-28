import type { Metadata } from "next";
import Link from "next/link";
import DeleteAccountForm from "@/components/member/DeleteAccountForm";
import { backendFetch } from "@/lib/server/backend";

export const metadata: Metadata = { title: "내 계정 | Rehearview" };

type Account = { email: string | null; createdAt: string; hasPassword: boolean; providers: string[]; interviewCount: number };

const PROVIDER_LABEL: Record<string, string> = { github: "GitHub", google: "Google", kakao: "카카오", naver: "네이버" };

export default async function AccountPage() {
  const res = await backendFetch("/auth/account");
  const account = res.ok ? ((await res.json()) as Account) : null;
  const methods = account ? [account.hasPassword && "이메일 + 비밀번호", ...account.providers.map((p) => PROVIDER_LABEL[p] ?? p)].filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">내 계정</h1>

      {account ? (
        <dl className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 text-sm dark:divide-white/10 dark:border-white/10">
          {[
            ["이메일", account.email ?? "제공되지 않음 (소셜 로그인)"],
            ["로그인 방식", methods.join(", ")],
            ["가입일", new Date(account.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })],
            ["면접 기록", `${account.interviewCount}개`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-5 py-3.5">
              <dt className="text-neutral-500">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p role="alert" className="mt-6 rounded-2xl bg-red-500/10 px-6 py-5 text-sm text-red-600 dark:text-red-300">
          계정 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      <p className="mt-4 text-sm text-neutral-500">
        개인정보 처리에 관한 내용은 <Link href="/privacy" className="text-violet-600 underline dark:text-violet-300">개인정보처리방침</Link>에서 확인할 수 있어요.
      </p>

      <div className="mt-10">
        <DeleteAccountForm />
      </div>
    </div>
  );
}

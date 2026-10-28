import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 px-8 py-16 text-center text-white">
        <h2 className="text-3xl font-bold tracking-tight">지금 첫 면접을 연습해 보세요</h2>
        <p className="mt-3 text-white/85">서류만 준비되면 바로 시작할 수 있어요.</p>
        <Link href="/signup" className="mt-8 inline-block rounded-full bg-white px-7 py-3 font-medium text-violet-700 hover:bg-white/90">
          무료로 시작하기
        </Link>
      </div>
    </section>
  );
}

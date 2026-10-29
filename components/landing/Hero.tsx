import Link from "next/link";

// 실제 면접 화면을 흉내 낸 예시 목업. 질문과 시간은 데모용이다.
const BARS = [0.5, 0.8, 0.6, 1, 0.7, 0.9, 0.5, 0.75, 0.6, 0.4];

function InterviewMock() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 blur-2xl" />
      <div className="rounded-3xl border border-black/10 bg-background p-5 shadow-xl dark:border-white/10">
        <div className="mb-4 flex items-center justify-between text-xs text-neutral-500">
          <span className="rounded-full bg-violet-500/10 px-3 py-1 font-medium text-violet-600 dark:text-violet-300">
            법인영업 · 직무역량
          </span>
          <span>질문 3 / 6</span>
        </div>

        <div className="rounded-2xl rounded-tl-sm bg-neutral-100 p-4 text-sm leading-relaxed dark:bg-white/10">
          <p className="mb-1 text-xs font-medium text-neutral-500">면접관</p>
          기존 고객의 이탈률을 낮추셨다고 하셨는데, 어떤 방법으로 줄이셨는지 구체적으로 말씀해 주세요.
        </div>

        <div className="mt-5 rounded-2xl border border-violet-500/30 p-4">
          <div className="flex h-12 items-center justify-center gap-1.5" aria-hidden="true">
            {BARS.map((h, i) => (
              <span
                key={i}
                className="wave-bar w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-fuchsia-500"
                style={{ height: `${h * 100}%`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" /> 답변 중 0:24
            </span>
            <span className="rounded-full bg-violet-600 px-3 py-1.5 font-medium text-white">답변 완료</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
      <div>
        <span className="inline-block rounded-full border border-violet-500/30 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
          무료 베타
        </span>
        <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          면접,
          <br />
          <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">AI와 실전처럼</span> 연습하세요
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
          내 서류에서 질문이 나오고, 음성으로 답하면 꼬리질문과 리포트까지. 직군에 상관없이 누구나 쓸 수 있어요.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-full bg-violet-600 px-6 py-3 font-medium text-white hover:bg-violet-700">
            무료로 시작하기
          </Link>
          <a href="#how" className="rounded-full border border-black/10 px-6 py-3 font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
            사용법 보기
          </a>
        </div>
        <p className="mt-4 text-sm text-neutral-500">서류 원문은 저장하지 않아요.</p>
      </div>
      <InterviewMock />
    </section>
  );
}

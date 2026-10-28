import Section from "./Section";

const AXES = ["직무 이해도", "근거와 구체성", "논리 구조", "전달력", "태도와 진정성", "질문 의도 파악"];

const icon = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

const FEATURES = [
  {
    title: "내 서류 기반 질문",
    body: "서류에 적은 경험과 성과에서 질문이 나와요. 어디서나 볼 수 있는 일반 질문이 아니라 내 이야기를 묻습니다.",
    icon: icon(<path d="M7 3h7l5 5v13H7zM14 3v5h5" />),
  },
  {
    title: "음성으로 연습",
    body: "타이핑이 아니라 실제로 말해 보면서 연습해요. 말하는 속도와 막히는 지점을 스스로 느낄 수 있어요.",
    icon: icon(
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </>,
    ),
  },
  {
    title: "꼬리질문",
    body: "답변에서 약한 부분을 파고드는 질문이 이어져요. 강도를 올리면 더 날카롭게 물어봐요.",
    icon: icon(
      <>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="18" r="2" />
        <path d="M6 8v4a4 4 0 0 0 4 4h6" />
      </>,
    ),
  },
  {
    title: "6가지 기준 리포트",
    body: "면접이 끝나면 점수와 총평을 받아요. 기록은 저장되어 언제든 다시 볼 수 있어요.",
    icon: icon(<path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />),
  },
];

export default function Features() {
  return (
    <Section id="features" title="핵심 기능">
      <div className="grid gap-6 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
              {f.icon}
            </span>
            <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
            <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-300">{f.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {AXES.map((a) => (
          <span key={a} className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600 dark:bg-white/10 dark:text-neutral-300">
            {a}
          </span>
        ))}
      </div>
    </Section>
  );
}

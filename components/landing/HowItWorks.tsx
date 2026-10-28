import Section from "./Section";

const STEPS = [
  {
    title: "서류와 직무 입력",
    body: "이력서나 자기소개서를 올리고 회사, 직무를 적어요. 면접 유형(직무역량, 인성, 임원, 컬처핏)과 강도(순한맛, 보통, 매운맛)도 고를 수 있어요.",
  },
  {
    title: "말로 답하기",
    body: "질문을 듣고 말로 대답해요. 답변 내용을 바탕으로 꼬리질문이 이어져서 실제 면접처럼 흘러가요.",
  },
  {
    title: "리포트 받기",
    body: "6가지 기준의 점수와 총평으로 부족한 점을 확인하고, 기록으로 남겨 다시 볼 수 있어요.",
  },
];

export default function HowItWorks() {
  return (
    <Section id="how" title="이렇게 연습해요" subtitle="서류를 올리고, 말하고, 점검하는 세 단계예요." tinted>
      <ol className="grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-black/10 bg-background p-6 dark:border-white/10">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-300">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

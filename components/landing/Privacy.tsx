import Section from "./Section";

const POINTS = [
  {
    title: "서류 원문은 저장하지 않아요",
    body: "면접을 진행하는 동안에만 사용하고 서버에 남기지 않아요. 저장되는 건 질문, 내 답변, 리포트뿐이에요.",
  },
  {
    title: "연락처는 전송 전에 가려요",
    body: "전화번호, 이메일, 주민등록번호 형태는 AI에 보내기 전에 자동으로 가려요.",
  },
  {
    title: "내 기록은 내가 지워요",
    body: "저장된 면접 기록은 언제든 삭제할 수 있어요.",
  },
];

export default function Privacy() {
  return (
    <Section id="privacy" title="서류를 안심하고 올리세요" subtitle="개인정보가 담긴 서류라서 저장과 전송을 최소화했어요.">
      <div className="grid gap-6 md:grid-cols-3">
        {POINTS.map((p) => (
          <div key={p.title} className="rounded-2xl border border-black/10 p-6 dark:border-white/10">
            <h3 className="font-bold">{p.title}</h3>
            <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-300">{p.body}</p>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-3xl rounded-xl bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
        질문을 만들기 위해 서류 텍스트가 외부 AI 서비스로 전송돼요. 무료로 제공되는 일부 AI 서비스는 입력 내용을 서비스 개선에
        사용할 수 있으니, 민감한 정보는 지우고 올리는 것을 권장해요.
      </p>
    </Section>
  );
}

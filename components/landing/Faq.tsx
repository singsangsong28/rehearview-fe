import Section from "./Section";

const FAQS = [
  { q: "무료인가요?", a: "지금은 무료 베타예요. 하루에 최대 5번까지 면접을 진행할 수 있어요." },
  { q: "어떤 직군에서 쓸 수 있나요?", a: "직군에 제한이 없어요. 서류와 지원하는 직무를 입력하면 그에 맞춰 질문이 만들어져요." },
  { q: "서류는 어디에 저장되나요?", a: "서류 원문은 저장하지 않아요. 면접이 끝나면 질문, 내 답변, 리포트만 기록으로 남아요." },
  { q: "음성이 인식되지 않아요.", a: "음성 인식은 브라우저 기능을 사용해서 Chrome에서 가장 안정적이에요. Edge 등 일부 브라우저에서는 연결되지 않을 수 있어요. 마이크 권한도 확인해 주시고, 안 될 때는 답변을 직접 입력할 수도 있어요." },
  { q: "면접 기록을 지울 수 있나요?", a: "네, 저장된 면접 기록은 언제든 삭제할 수 있어요." },
];

export default function Faq() {
  return (
    <Section id="faq" title="자주 묻는 질문" tinted>
      <div className="mx-auto max-w-2xl divide-y divide-black/10 rounded-2xl border border-black/10 bg-background dark:divide-white/10 dark:border-white/10">
        {FAQS.map((f) => (
          <details key={f.q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {f.q}
              <span className="ml-4 text-neutral-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-300">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

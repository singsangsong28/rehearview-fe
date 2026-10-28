import { FIELDS } from "@/lib/interview";
import Section from "./Section";

export default function Fields() {
  return (
    <Section
      title="어떤 직군이든"
      subtitle="서류와 직무만 입력하면 질문이 만들어져요."
      tinted
    >
      <div className="flex flex-wrap justify-center gap-3">
        {FIELDS.map((f) => (
          <span
            key={f}
            className="rounded-full border border-black/10 bg-background px-4 py-2 text-sm dark:border-white/10"
          >
            {f}
          </span>
        ))}
      </div>
    </Section>
  );
}

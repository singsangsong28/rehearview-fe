"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Combobox from "@/components/common/Combobox";
import { Field, FormError, RadioCards, SubmitButton } from "@/components/common/form";
import { CAREER_OPTIONS, FIELDS, INTENSITY_OPTIONS, RESUME_MAX_CHARS, TYPE_OPTIONS } from "@/lib/interview";
import { saveResume } from "@/lib/resumeStore";
import { useApiRequest } from "@/lib/useApiRequest";
import ResumeSetup from "./ResumeSetup";

export default function NewInterviewForm() {
  const router = useRouter();
  const { pending, error, submit } = useApiRequest();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [field, setField] = useState("");
  const [careerLabel, setCareerLabel] = useState(""); // 화면에는 이름을, 서버에는 값(enum)을 보낸다
  const [brief, setBrief] = useState(""); // 분석을 거친 면접 준비 브리프 (또는 분석 없이 쓰기로 한 서류 원문)
  const [formError, setFormError] = useState<string | null>(null);

  const career = CAREER_OPTIONS.find((o) => o.title === careerLabel)?.value;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = brief.trim();
    if (!text) return setFormError("서류를 분석해 주세요. 위의 '분석하기'를 누르면 면접에 쓸 브리프가 만들어져요");
    if (text.length > RESUME_MAX_CHARS) return setFormError(`브리프가 너무 길어요 (${RESUME_MAX_CHARS.toLocaleString()}자 이하). 줄여 주세요`);
    setFormError(null);

    // 서류 원문은 서버로 보내지 않는다. 면접 설정만 보내고, 브리프는 이 탭에 두었다가 질문을 만들 때 함께 보낸다.
    const created = await submit<{ id: string }>("/interviews", {
      company,
      field,
      role,
      type: form.get("type"),
      intensity: form.get("intensity"),
      career,
    });
    if (!created) return;
    saveResume(created.id, text);
    router.push(`/interviews/${created.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormError message={formError ?? error} />

      <section className="space-y-4">
        <h2 className="font-bold">지원 정보</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="회사" name="company" required maxLength={100} placeholder="예: 샘플물산" value={company} onChange={(e) => setCompany(e.target.value)} />
          <Field label="직무" name="role" required maxLength={100} placeholder="예: 법인영업" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Combobox
            label="지원 구분"
            name="career-label"
            required
            options={CAREER_OPTIONS.map((o) => o.title)}
            value={careerLabel}
            onChange={setCareerLabel}
            placeholder="선택해 주세요"
            allowCustom={false}
          />
          <Combobox label="직군" name="field" required maxLength={100} options={FIELDS} value={field} onChange={setField} placeholder="목록에서 고르거나 직접 입력" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-bold">면접 설정</h2>
        <RadioCards label="면접 유형" name="type" options={TYPE_OPTIONS} defaultValue="COMPETENCY" />
        <RadioCards label="면접 강도" name="intensity" options={INTENSITY_OPTIONS} defaultValue="NORMAL" cols={3} />
      </section>

      <section className="space-y-4">
        <h2 className="font-bold">서류와 공고</h2>
        <ResumeSetup context={{ company, field, role, career }} brief={brief} onBrief={setBrief} />
      </section>

      <SubmitButton pending={pending}>면접 시작하기</SubmitButton>
    </form>
  );
}

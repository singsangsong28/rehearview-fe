import type { Metadata } from "next";
import NewInterviewForm from "@/components/member/NewInterviewForm";

export const metadata: Metadata = { title: "새 면접 | Rehearview" };

export default function NewInterviewPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">새 면접</h1>
      <p className="mt-2 mb-8 text-neutral-500">지원 정보와 서류를 입력하면 서류에서 질문이 만들어져요.</p>
      <NewInterviewForm />
    </div>
  );
}

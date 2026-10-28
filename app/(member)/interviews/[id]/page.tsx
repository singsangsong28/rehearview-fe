import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InterviewRoom from "@/components/member/interview/InterviewRoom";
import type { InterviewData } from "@/lib/interview";
import { backendFetch } from "@/lib/server/backend";

export const metadata: Metadata = { title: "면접 | Rehearview" };

export default async function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await backendFetch(`/interviews/${encodeURIComponent(id)}`);
  if (!res.ok) notFound(); // 없거나 남의 면접
  const interview = (await res.json()) as InterviewData;

  return (
    <div className="mx-auto max-w-2xl">
      <InterviewRoom interview={interview} />
    </div>
  );
}

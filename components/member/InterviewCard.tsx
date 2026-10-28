import Link from "next/link";
import { INTENSITY_OPTIONS, TYPE_OPTIONS, careerShort, labelOf, type InterviewData } from "@/lib/interview";
import DeleteInterviewButton from "./DeleteInterviewButton";

export type InterviewSummary = Pick<InterviewData, "id" | "company" | "field" | "role" | "type" | "intensity" | "career" | "status"> & { createdAt: string };

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

export default function InterviewCard({ interview: iv }: { interview: InterviewSummary }) {
  const done = iv.status === "COMPLETED";
  return (
    <li className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate font-bold">
            {iv.company} · {iv.role}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {iv.field} · {careerShort(iv.career)} · {labelOf(TYPE_OPTIONS, iv.type)} · {labelOf(INTENSITY_OPTIONS, iv.intensity)} · {formatDate(iv.createdAt)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            done ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-violet-500/10 text-violet-700 dark:text-violet-200"
          }`}
        >
          {done ? "완료" : "진행 중"}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/interviews/${iv.id}`} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
          {done ? "리포트 보기" : "이어하기"}
        </Link>
        <DeleteInterviewButton id={iv.id} />
      </div>
    </li>
  );
}

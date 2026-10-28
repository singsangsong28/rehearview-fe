import Link from "next/link";
import { REPORT_AXES, type Report, type Turn } from "@/lib/interview";

// 면접 리포트: 6가지 기준 점수, 총평, 질문·답변 기록
export default function ReportView({ report, turns }: { report: Report; turns: Turn[] }) {
  const scores = REPORT_AXES.map((axis) => ({ axis, score: report.scores[axis] ?? 0 }));
  const average = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">면접 리포트</h2>
        <p className="mt-1 text-sm text-neutral-500">평균 {average.toFixed(1)}점 / 5점</p>
      </div>

      <ul className="space-y-3">
        {scores.map(({ axis, score }) => (
          <li key={axis}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{axis}</span>
              <span className="text-neutral-500">{score} / 5</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-200 dark:bg-white/10" role="img" aria-label={`${axis} ${score}점`}>
              <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${(score / 5) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <section>
        <h3 className="font-bold">총평</h3>
        <p className="mt-2 whitespace-pre-line leading-relaxed text-neutral-700 dark:text-neutral-200">{report.feedback}</p>
      </section>

      <details className="rounded-2xl border border-black/10 p-5 dark:border-white/10">
        <summary className="cursor-pointer font-medium">질문과 내 답변 보기</summary>
        <ol className="mt-4 space-y-5">
          {turns.map((t) => (
            <li key={t.order}>
              <p className="text-sm font-medium">
                Q{t.order}. {t.question}
              </p>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{t.answer ?? "(답변 없음)"}</p>
            </li>
          ))}
        </ol>
      </details>

      <div className="flex flex-wrap gap-3">
        <Link href="/interviews/new" className="rounded-full bg-violet-600 px-6 py-2.5 font-medium text-white hover:bg-violet-700">
          새 면접 시작
        </Link>
        <Link href="/interviews" className="rounded-full border border-black/10 px-6 py-2.5 font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
          내 면접 목록
        </Link>
      </div>
    </div>
  );
}

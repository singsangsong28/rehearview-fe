"use client";

import { useState } from "react";
import { FormError, FormNotice, TextArea } from "@/components/common/form";
import { POSTING_MAX_CHARS, RESUME_ANALYZE_MAX_CHARS, RESUME_MAX_CHARS } from "@/lib/interview";
import { postJson } from "@/lib/api";
import PostingInput from "./PostingInput";
import ResumeInput from "./ResumeInput";

type Context = { company: string; field: string; role: string; career?: string };

// 서류(여러 파일)와 채용 공고를 받아 AI가 분석한 "면접 준비 브리프"를 만든다.
// 사용자는 브리프를 확인·수정할 수 있고, 면접은 이 브리프를 바탕으로 진행된다 (서류 원문은 저장하지 않는다).
export default function ResumeSetup({ context, brief, onBrief }: { context: Context; brief: string; onBrief: (text: string) => void }) {
  const [raw, setRaw] = useState("");
  const [posting, setPosting] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzedFor, setAnalyzedFor] = useState<string | null>(null); // 분석에 쓴 입력의 지문 (입력이 바뀌면 다시 분석하라고 알린다)

  const fingerprint = `${raw.length}:${raw.slice(0, 80)}:${posting.length}:${posting.slice(0, 80)}`;
  const tooLong = raw.length > RESUME_ANALYZE_MAX_CHARS || posting.length > POSTING_MAX_CHARS;
  const stale = brief && analyzedFor !== null && analyzedFor !== fingerprint;

  async function analyze() {
    setError(null);
    setAnalyzing(true);
    const result = await postJson<{ profile: string }>("/interviews/analyze", {
      resume: raw.trim(),
      ...(posting.trim() ? { posting: posting.trim() } : {}),
      company: context.company || undefined,
      field: context.field || undefined,
      role: context.role || undefined,
      career: context.career || undefined,
    });
    setAnalyzing(false);
    if (!result.ok) return setError(result.error);
    onBrief(result.data.profile);
    setAnalyzedFor(fingerprint);
  }

  // 분석이 안 될 때의 대안: 공고 없이 서류 원문이 짧으면 원문 그대로 면접을 진행할 수 있다
  const canUseRaw = !!error && !posting.trim() && raw.trim().length > 0 && raw.trim().length <= RESUME_MAX_CHARS;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-sm font-bold">1. 내 서류</h3>
        <ResumeInput onChange={setRaw} />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold">
          2. 지원하는 회사의 채용 공고 <span className="font-normal text-neutral-500">(선택)</span>
        </h3>
        <PostingInput value={posting} onChange={setPosting} />
      </div>

      <FormNotice>
        서류 원문은 저장하지 않지만, 분석과 질문을 만들기 위해 서류와 공고 내용이 외부 AI 서비스로 전송돼요. 전화번호, 이메일, 주민등록번호 형태는 보내기 전에 자동으로 가려지고, 그 밖의
        민감한 정보는 위에서 직접 지워 주세요.
      </FormNotice>

      <div className="space-y-3">
        <h3 className="text-sm font-bold">3. 분석하기</h3>
        <p className="text-sm text-neutral-500">
          서류{posting.trim() ? "와 공고" : ""}를 읽고 면접에 쓸 브리프로 정리해요. {posting.trim() ? "공고가 원하는 것과 내 서류를 비교해서 확인할 부분도 짚어 드려요. " : ""}보통 10~30초 걸리고, AI가 바쁠 때는
          1분 넘게 걸릴 수 있어요.
        </p>
        <button
          type="button"
          onClick={analyze}
          disabled={analyzing || !raw.trim() || tooLong}
          className="rounded-full bg-violet-600 px-6 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {analyzing ? "분석하는 중이에요..." : brief ? "다시 분석하기" : "서류" + (posting.trim() ? "·공고" : "") + " 분석하기"}
        </button>
        {tooLong && <p className="text-sm text-red-600 dark:text-red-300">서류나 공고가 너무 길어요. 줄여서 다시 시도해 주세요.</p>}
        <FormError message={error} />
        {canUseRaw && (
          <button type="button" onClick={() => onBrief(raw.trim())} className="text-sm text-violet-600 underline dark:text-violet-300">
            분석 없이 서류 원문 그대로 면접하기
          </button>
        )}
      </div>

      {brief && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold">4. 면접 준비 브리프 (확인하고 고칠 수 있어요)</h3>
          {stale && <FormNotice>서류나 공고가 바뀌었어요. 바뀐 내용을 반영하려면 &quot;다시 분석하기&quot;를 눌러 주세요.</FormNotice>}
          <TextArea
            label="분석 결과"
            value={brief}
            onChange={(e) => onBrief(e.target.value)}
            rows={16}
            hint="AI가 정리한 내용이라 틀린 부분이 있을 수 있어요. 면접은 이 내용을 근거로 질문하니 사실과 다른 부분은 고쳐 주세요."
          />
        </div>
      )}
    </div>
  );
}

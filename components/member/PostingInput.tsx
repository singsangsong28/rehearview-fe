"use client";

import { FormError, TextArea } from "@/components/common/form";
import { POSTING_MAX_CHARS } from "@/lib/interview";
import { useApiRequest } from "@/lib/useApiRequest";
import { useState } from "react";

// 채용 공고 입력(선택): 주소로 불러오거나 내용을 붙여 넣는다. 불러온 글은 아래 칸에서 확인하고 고칠 수 있다.
export default function PostingInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (text: string) => void;
}) {
  const [url, setUrl] = useState("");
  const { pending, error, submit } = useApiRequest();

  async function load() {
    if (!url.trim()) return;
    const result = await submit<{ text: string }>("/interviews/posting", {
      url: url.trim(),
    });
    if (result) onChange(result.text);
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="posting-url" className="block text-sm font-medium">
          공고 주소
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="posting-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 폼이 제출되지 않게 하고 불러오기만 실행
                load();
              }
            }}
            placeholder="https://..."
            className="w-full rounded-lg border border-black/15 bg-transparent px-3.5 py-2.5 outline-none placeholder:text-neutral-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/20"
          />
          <button
            type="button"
            onClick={load}
            disabled={pending || !url.trim()}
            className="shrink-0 rounded-lg border border-violet-500/40 px-4 font-medium text-violet-700 hover:bg-violet-500/10 disabled:opacity-50 dark:text-violet-200"
          >
            {pending ? "불러오는 중..." : "불러오기"}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-neutral-500">
          일부 채용 사이트는 접근을 막거나 로그인이 필요해서 불러오지 못할 수
          있어요. 그럴 땐 아래 칸에 공고 내용을 붙여 넣어 주세요.
        </p>
      </div>
      <FormError message={error} />
      <TextArea
        label="공고 내용"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="주요 업무, 자격 요건, 우대 사항 등 공고 내용을 붙여 넣거나, 위에서 주소를 불러오면 여기에 채워져요."
        hint={
          <span
            className={
              value.length > POSTING_MAX_CHARS
                ? "text-red-600 dark:text-red-300"
                : undefined
            }
          >
            {value.length.toLocaleString()} /{" "}
            {POSTING_MAX_CHARS.toLocaleString()}자
          </span>
        }
      />
    </div>
  );
}

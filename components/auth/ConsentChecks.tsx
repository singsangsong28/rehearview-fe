"use client";

import Link from "next/link";
import { useState } from "react";

const link = "ml-1 text-violet-600 underline dark:text-violet-300";

// 필수 동의 3가지. 모두 체크하면 onChange(true). 문서는 새 탭으로 열어서 입력하던 화면을 잃지 않게 한다.
// (동의 문구를 바꾸면 backend/src/modules/auth/consent.ts 의 CONSENT_VERSION 을 올려 다시 동의받는다)
export default function ConsentChecks({ onChange }: { onChange: (allChecked: boolean) => void }) {
  const [checked, setChecked] = useState({ terms: false, privacy: false, age: false });
  const all = checked.terms && checked.privacy && checked.age;

  const update = (next: typeof checked) => {
    setChecked(next);
    onChange(next.terms && next.privacy && next.age);
  };

  const row = "flex items-start gap-2.5 text-sm leading-relaxed";

  return (
    <fieldset className="space-y-3 rounded-xl border border-black/10 p-4 dark:border-white/10">
      <legend className="px-1 text-sm font-medium">필수 동의</legend>
      <label className={`${row} font-medium`}>
        <input type="checkbox" checked={all} onChange={(e) => update({ terms: e.target.checked, privacy: e.target.checked, age: e.target.checked })} className="mt-1" />
        모두 동의합니다
      </label>
      <hr className="border-black/10 dark:border-white/10" />
      <label className={row}>
        <input type="checkbox" checked={checked.terms} onChange={(e) => update({ ...checked, terms: e.target.checked })} className="mt-1" />
        <span>
          [필수] 이용약관에 동의합니다
          <Link href="/terms" target="_blank" rel="noopener" className={link}>
            보기
          </Link>
        </span>
      </label>
      <label className={row}>
        <input type="checkbox" checked={checked.privacy} onChange={(e) => update({ ...checked, privacy: e.target.checked })} className="mt-1" />
        <span>
          [필수] 개인정보 수집·이용과, 서류·공고·답변이 분석과 질문 생성을 위해 외부 AI 서비스로 전송되는 것에 동의합니다
          <Link href="/privacy" target="_blank" rel="noopener" className={link}>
            보기
          </Link>
        </span>
      </label>
      <label className={row}>
        <input type="checkbox" checked={checked.age} onChange={(e) => update({ ...checked, age: e.target.checked })} className="mt-1" />
        <span>[필수] 만 14세 이상입니다</span>
      </label>
    </fieldset>
  );
}

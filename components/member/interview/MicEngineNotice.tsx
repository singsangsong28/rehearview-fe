"use client";

import type { LocalState } from "@/lib/speech";

type Props = { state: LocalState; installing: boolean; onInstall: () => void };

// 음성 인식 방식 안내. Chrome에서 한국어 기기 내 인식을 쓸 수 있으면 알려 주고, 설치가 필요하면 버튼을 보여 준다.
export default function MicEngineNotice({ state, installing, onInstall }: Props) {
  if (state === "available") {
    return <p className="text-center text-xs text-neutral-500">이 기기 안에서 인식해요 (인터넷 불필요, 서류 속 단어를 미리 알려 둠)</p>;
  }
  if (state === "downloadable" || state === "downloading") {
    const busy = installing || state === "downloading";
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-violet-500/10 px-3.5 py-3 text-sm text-violet-700 dark:text-violet-200">
        <span className="leading-relaxed">
          {busy
            ? "한국어 음성 인식 팩을 내려받는 중이에요. 잠시만 기다려 주세요."
            : "한국어 음성 인식 팩을 한 번 설치하면 더 정확하고 안정적으로 인식해요. (무료, 이 기기 안에서 처리)"}
        </span>
        <button
          type="button"
          onClick={onInstall}
          disabled={busy}
          className="shrink-0 rounded-full bg-violet-600 px-4 py-1.5 font-medium text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {busy ? "설치 중..." : "설치하기"}
        </button>
      </div>
    );
  }
  return null; // 기기 내 인식을 못 쓰는 브라우저는 기본(클라우드) 인식으로 동작
}

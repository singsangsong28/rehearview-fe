"use client";

import { FormNotice } from "@/components/common/form";
import { speak, voiceLabel, type VoiceSettings } from "@/lib/speech";

const PREVIEW_TEXT = "안녕하세요. 지금부터 면접을 시작하겠습니다. 편하게 말씀해 주세요.";

type Props = {
  settings: VoiceSettings;
  voices: SpeechSynthesisVoice[];
  update: (patch: Partial<VoiceSettings>) => void;
};

// 면접관 목소리 설정: 목소리 선택, 속도, 음높이, 미리듣기
export default function VoiceSettingsPanel({ settings, voices, update }: Props) {
  if (voices.length === 0) {
    return <FormNotice>이 기기에는 한국어 목소리가 없어서 기본 목소리로 읽어요. 질문이 잘 안 들리면 &quot;질문을 소리로 읽어 주기&quot;를 끄고 글로 읽으셔도 돼요.</FormNotice>;
  }
  // 저장된 목소리가 이 기기에 없으면 가장 자연스러운 첫 번째 목소리가 쓰인다 (lib/speech.ts 의 speak 와 같은 규칙)
  const selected = voices.find((v) => v.voiceURI === settings.voiceURI)?.voiceURI ?? voices[0].voiceURI;

  return (
    <div className="space-y-4 text-sm">
      <label className="block font-medium">
        목소리
        <select
          value={selected}
          onChange={(e) => {
            update({ voiceURI: e.target.value });
          }}
          className="mt-1.5 w-full rounded-lg border border-black/15 bg-background px-3.5 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/20"
        >
          {voices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {voiceLabel(v)}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-medium">
          <span className="flex justify-between">
            속도 <span className="font-normal text-neutral-500">{settings.rate.toFixed(2)}배</span>
          </span>
          <input type="range" min={0.7} max={1.4} step={0.05} value={settings.rate} onChange={(e) => update({ rate: Number(e.target.value) })} className="mt-2 w-full accent-violet-600" />
        </label>
        <label className="block font-medium">
          <span className="flex justify-between">
            음높이 <span className="font-normal text-neutral-500">{settings.pitch.toFixed(2)}</span>
          </span>
          <input type="range" min={0.7} max={1.3} step={0.05} value={settings.pitch} onChange={(e) => update({ pitch: Number(e.target.value) })} className="mt-2 w-full accent-violet-600" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => speak(PREVIEW_TEXT, { ...settings, voiceURI: selected })}
          className="rounded-full border border-black/10 px-4 py-2 font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          ▶ 미리 듣기
        </button>
        <button type="button" onClick={() => update({ voiceURI: null, rate: 1, pitch: 1 })} className="text-neutral-500 hover:text-foreground">
          기본값으로
        </button>
      </div>
    </div>
  );
}

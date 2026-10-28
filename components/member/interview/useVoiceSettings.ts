"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_VOICE, koreanVoices, loadVoiceSettings, saveVoiceSettings, type VoiceSettings } from "@/lib/speech";

// 면접관 목소리 설정(목소리, 속도, 음높이). 브라우저에 저장해서 다음 면접에도 유지한다.
export function useVoiceSettings() {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_VOICE);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    setSettings(loadVoiceSettings());
    // 목소리 목록은 브라우저가 비동기로 불러와서, 준비되면 알려 주는 이벤트를 기다린다
    const refresh = () => setVoices(koreanVoices());
    refresh();
    window.speechSynthesis?.addEventListener("voiceschanged", refresh);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", refresh);
  }, []);

  const update = useCallback((patch: Partial<VoiceSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveVoiceSettings(next);
      return next;
    });
  }, []);

  return { settings, voices, update };
}

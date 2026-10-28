"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Phrase } from "@/lib/phrases";
import { createRecognizer, getLocalState, installLocal, isEdge, type LocalState, type Recognizer } from "@/lib/speech";

// 오류 코드를 사용자가 할 수 있는 행동 중심의 안내로 바꾼다
function describeError(code: string) {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "마이크 권한이 필요해요. 주소창의 마이크(자물쇠) 설정에서 허용한 뒤 다시 시도해 주세요.";
    case "audio-capture":
      return "마이크를 찾지 못했어요. 마이크가 연결되어 있는지, 다른 프로그램이 쓰고 있지 않은지 확인해 주세요.";
    case "language-not-supported":
      return "한국어 음성 인식 팩이 아직 없어요. 위의 설치 버튼을 누르거나, 아래 칸에 직접 입력해 주세요.";
    case "network":
      return isEdge()
        ? "이 브라우저(Edge)에서는 음성 인식 서비스에 연결되지 않았어요. Chrome에서 열면 될 수 있어요. 아래 칸에 직접 입력해도 돼요."
        : "음성 인식 서비스에 연결하지 못했어요. 인터넷 연결을 확인하거나 Chrome에서 열어 주세요. 아래 칸에 직접 입력해도 돼요.";
    default:
      return `음성 인식에 문제가 생겼어요 (${code}). 아래 칸에 직접 입력해도 돼요.`;
  }
}

// 음성 인식 훅. 확정된 문장은 onFinal로 넘기고, 말하는 도중의 글자는 interim으로 돌려준다.
// - Chrome에서 한국어 기기 내 인식을 쓸 수 있으면 그걸 우선 쓴다(무료, 오프라인, 서류 단어 힌트 적용).
//   언어 팩이 없으면 installLocal()로 설치할 수 있고, 안 되면 브라우저의 기본(클라우드) 인식으로 내려간다.
// - 멈추면 아직 확정되지 않은 마지막 말도 버리지 않고 onFinal로 넘긴다 (stopping 동안 기다린다).
export function useSpeechRecognition(onFinal: (text: string) => void, phrases: Phrase[] = []) {
  const [supported] = useState(() => createRecognizer() !== null);
  const [localState, setLocalState] = useState<LocalState>("unsupported");
  const [installing, setInstalling] = useState(false);
  const [listening, setListening] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<Recognizer | null>(null);
  const wantRef = useRef(false); // 사용자가 직접 끄기 전까지는 인식이 끊겨도 다시 켠다
  const interimRef = useRef("");
  const onFinalRef = useRef(onFinal);
  const phrasesRef = useRef(phrases);
  const localRef = useRef(false); // 지금 인식이 기기 내 모드인지
  useEffect(() => {
    onFinalRef.current = onFinal;
    phrasesRef.current = phrases;
  }, [onFinal, phrases]);

  useEffect(() => {
    getLocalState().then(setLocalState);
  }, []);

  // 한국어 언어 팩 설치. 사용자가 버튼을 누른 클릭 이벤트 안에서 호출해야 한다.
  const install = useCallback(async () => {
    setInstalling(true);
    setError(null);
    setLocalState("downloading");
    const ok = await installLocal();
    setLocalState(await getLocalState());
    setInstalling(false);
    if (!ok) setError("한국어 음성 인식 팩을 설치하지 못했어요. 직접 입력하거나 다시 시도해 주세요.");
  }, []);

  // 확정되지 못한 말이 남아 있으면 답변에 넣는다
  const flushInterim = useCallback(() => {
    const rest = interimRef.current.trim();
    interimRef.current = "";
    setInterim("");
    if (rest) onFinalRef.current(rest);
  }, []);

  const finish = useCallback(() => {
    flushInterim();
    recRef.current = null;
    setListening(false);
    setStopping(false);
  }, [flushInterim]);

  const stop = useCallback(() => {
    const rec = recRef.current;
    wantRef.current = false;
    if (!rec) return;
    setStopping(true);
    rec.stop(); // 곧 남은 결과가 오고 onend가 불린다
    // 끝났다는 신호가 안 오는 경우를 대비한 안전장치
    setTimeout(() => {
      if (recRef.current === rec) finish();
    }, 2000);
  }, [finish]);

  const start = useCallback(
    (forceCloud = false) => {
      const local = !forceCloud && localState === "available";
      const rec = createRecognizer({ local, phrases: phrasesRef.current });
      if (!rec) return;
      localRef.current = local;
      setError(null);
      wantRef.current = true;
      rec.onresult = (e) => {
        let live = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) {
            interimRef.current = "";
            onFinalRef.current(r[0].transcript.trim());
          } else {
            live += r[0].transcript;
          }
        }
        interimRef.current = live;
        setInterim(live);
      };
      rec.onerror = (e) => {
        if (e.error === "no-speech" || e.error === "aborted") return; // 조용했을 뿐이니 무시
        wantRef.current = false;
        if (e.error === "language-not-supported" && localRef.current) {
          // 언어 팩이 사라졌거나 아직 준비되지 않았다. 상태를 다시 확인해서 설치 안내가 보이게 한다.
          getLocalState().then(setLocalState);
        }
        setError(describeError(e.error));
      };
      rec.onend = () => {
        flushInterim();
        // Chrome은 한동안 조용하면 인식을 스스로 끝내서, 켜 둔 상태면 다시 시작한다
        if (wantRef.current) {
          try {
            rec.start();
            return;
          } catch {
            // 다시 못 켜면 아래에서 정리한다
          }
        }
        finish();
      };
      recRef.current = rec;
      try {
        rec.start();
        setListening(true);
      } catch {
        recRef.current = null;
        wantRef.current = false;
        setError("음성 인식을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.");
      }
    },
    [finish, flushInterim, localState],
  );

  useEffect(
    () => () => {
      wantRef.current = false;
      recRef.current?.abort();
    },
    [],
  );

  return { supported, localState, installing, listening, stopping, interim, error, start, stop, install };
}

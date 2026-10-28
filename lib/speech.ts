// 브라우저 내장 음성 기능(Web Speech API). 서버 비용이 없다. 목소리와 인식 품질은 브라우저·OS마다 다르다.

// ---- 음성 합성: 질문 읽어 주기 ----
export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

export type VoiceSettings = { voiceURI: string | null; rate: number; pitch: number };
export const DEFAULT_VOICE: VoiceSettings = { voiceURI: null, rate: 1, pitch: 1 };

const SETTINGS_KEY = "voice-settings";

export function loadVoiceSettings(): VoiceSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "null");
    if (saved && typeof saved === "object") {
      return {
        voiceURI: typeof saved.voiceURI === "string" ? saved.voiceURI : null,
        rate: clamp(Number(saved.rate) || 1, 0.7, 1.4),
        pitch: clamp(Number(saved.pitch) || 1, 0.7, 1.3),
      };
    }
  } catch {
    // 저장된 값이 없거나 깨졌으면 기본값
  }
  return DEFAULT_VOICE;
}

export function saveVoiceSettings(settings: VoiceSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // 저장이 막힌 환경에서는 이번 방문에만 적용
  }
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// 한국어 목소리를 듣기 좋은 순서로 정렬한다: 자연음(Natural) → 구글 → 그 밖의 기본 음성.
// 기본 음성(예: Microsoft Heami)은 기계음 느낌이 강해서 맨 뒤로 보낸다.
export function koreanVoices(): SpeechSynthesisVoice[] {
  if (!canSpeak()) return [];
  const rank = (v: SpeechSynthesisVoice) => (/natural/i.test(v.name) ? 0 : /google/i.test(v.name) ? 1 : 2);
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("ko"))
    .sort((a, b) => rank(a) - rank(b));
}

// 사람이 읽기 쉬운 목소리 이름. 알려진 이름에는 성별 힌트를 붙인다.
const GENDER_HINTS: [RegExp, string][] = [
  [/선히|sunhi|heami|google/i, "여성"],
  [/인준|injoon|hyunsu/i, "남성"],
];
export function voiceLabel(v: SpeechSynthesisVoice) {
  const name = v.name
    .replace(/^Microsoft\s+/i, "")
    .replace(/\s*Online\s*\(Natural\)/i, "")
    .replace(/\s*-\s*Korean\s*\([^)]*\)/i, "")
    .replace(/^Google\s+/i, "구글 ")
    .trim();
  const gender = GENDER_HINTS.find(([re]) => re.test(v.name))?.[1];
  const kind = /natural/i.test(v.name) ? "자연음" : /google/i.test(v.name) ? "" : "기본음";
  return [name, [gender, kind].filter(Boolean).join(" · ")].filter(Boolean).join(" · ");
}

export function speak(text: string, settings: VoiceSettings = DEFAULT_VOICE) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel(); // 이전 질문이 아직 읽히는 중이면 끊는다
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  const voices = koreanVoices();
  const voice = voices.find((v) => v.voiceURI === settings.voiceURI) ?? voices[0]; // 고른 목소리가 없으면 가장 자연스러운 것
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export const stopSpeaking = () => {
  if (canSpeak()) window.speechSynthesis.cancel();
};

// ---- 음성 인식: 말한 내용을 글자로 ----
// Edge는 인식 서비스에 연결하지 못해 network 오류가 나는 경우가 확인됐다 (Chrome에서는 동작).
export const isEdge = () => typeof navigator !== "undefined" && navigator.userAgent.includes("Edg/");

// 브라우저 타입 정의에 없어서 쓰는 부분만 선언한다.
type RecResult = { isFinal: boolean; 0: { transcript: string } };
type RecEvent = { resultIndex: number; results: ArrayLike<RecResult> };
export type Recognizer = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  processLocally?: boolean; // Chrome: 이 기기 안에서 인식 (한국어 언어 팩 필요)
  phrases?: { push(...items: unknown[]): number }; // Chrome 기기 내 인식에서 알아듣기 쉽게 알려 주는 단어 목록
  onresult: ((e: RecEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

// 기기 내 인식의 한국어 언어 팩 상태.
// unsupported: 이 브라우저에 기기 내 인식 기능이 없음 / unavailable: 있지만 한국어는 못 씀(예: Edge)
// downloadable: 설치하면 쓸 수 있음 / downloading: 설치 중 / available: 바로 쓸 수 있음
export type LocalState = "unsupported" | "unavailable" | "downloadable" | "downloading" | "available";

type LocalOptions = { langs: string[]; processLocally: boolean };
type RecognizerCtor = {
  new (): Recognizer;
  available?: (o: LocalOptions) => Promise<string>;
  install?: (o: LocalOptions) => Promise<boolean>;
};

function recognizerCtor(): RecognizerCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognizerCtor; webkitSpeechRecognition?: RecognizerCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const LOCAL: LocalOptions = { langs: ["ko-KR"], processLocally: true };

export async function getLocalState(): Promise<LocalState> {
  const Ctor = recognizerCtor();
  if (!Ctor || typeof Ctor.available !== "function") return "unsupported";
  try {
    const state = await Ctor.available(LOCAL);
    return state === "available" || state === "downloadable" || state === "downloading" ? state : "unavailable";
  } catch {
    return "unavailable";
  }
}

// 한국어 언어 팩 설치. 사용자가 버튼을 누른 직후(클릭 이벤트 안)에서만 허용된다.
export async function installLocal(): Promise<boolean> {
  const Ctor = recognizerCtor();
  if (!Ctor || typeof Ctor.install !== "function") return false;
  try {
    return await Ctor.install(LOCAL);
  } catch {
    return false;
  }
}

type CreateOptions = { local?: boolean; phrases?: { text: string; boost: number }[] };

export function createRecognizer({ local = false, phrases = [] }: CreateOptions = {}): Recognizer | null {
  const Ctor = recognizerCtor();
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = "ko-KR";
  rec.continuous = true; // 잠깐 쉬어도 끊기지 않게
  rec.interimResults = true; // 말하는 도중의 글자도 보여 주기
  if (local) {
    rec.processLocally = true;
    // 단어 힌트는 기기 내 인식에서만 쓰인다 (서버로 보내지 않는다)
    const Phrase = (window as unknown as { SpeechRecognitionPhrase?: new (text: string, boost: number) => unknown }).SpeechRecognitionPhrase;
    if (Phrase && rec.phrases) {
      for (const p of phrases) {
        try {
          rec.phrases.push(new Phrase(p.text, Math.min(10, Math.max(0, p.boost))));
        } catch {
          // 브라우저가 받아들이지 않는 단어는 건너뛴다
        }
      }
    }
  }
  return rec;
}

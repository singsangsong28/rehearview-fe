"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormError, FormNotice } from "@/components/common/form";
import { postJson } from "@/lib/api";
import { INTENSITY_OPTIONS, INTERVIEW_TURNS, TYPE_OPTIONS, careerShort, labelOf, type InterviewData, type Report, type Turn } from "@/lib/interview";
import { buildPhrases } from "@/lib/phrases";
import { loadResume, saveResume } from "@/lib/resumeStore";
import { canSpeak, isEdge, speak, stopSpeaking } from "@/lib/speech";
import ResumeSetup from "../ResumeSetup";
import ReportView from "./ReportView";
import MicEngineNotice from "./MicEngineNotice";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useVoiceSettings } from "./useVoiceSettings";
import VoiceSettingsPanel from "./VoiceSettingsPanel";

const WAVE = [0.5, 0.8, 0.6, 1, 0.7, 0.9, 0.5, 0.75, 0.6, 0.4];

const card = "rounded-2xl border border-black/10 p-6 dark:border-white/10";
const primaryButton = "rounded-full bg-violet-600 px-6 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-60";
const ghostButton = "rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/10";

// 면접 진행: 질문을 읽어 주고, 음성(또는 글자)으로 답하면 다음 질문이 이어지고, 끝나면 리포트를 만든다.
// 서류는 서버에 없어서 이 탭의 sessionStorage에서 꺼내 질문을 만들 때마다 함께 보낸다.
export default function InterviewRoom({ interview }: { interview: InterviewData }) {
  const [turns, setTurns] = useState<Turn[]>(interview.turns);
  const [report, setReport] = useState<Report | null>(interview.report);
  const [resume, setResume] = useState<string | null | undefined>(undefined); // undefined: 아직 확인 전
  const [resumeDraft, setResumeDraft] = useState("");
  const [started, setStarted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState<"answer" | "report" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [readAloud, setReadAloud] = useState(true);

  // 음성 인식이 알아듣기 쉽도록 회사명, 직무, 서류 속 핵심 용어를 미리 알려 준다 (기기 내 인식에서만 쓰임)
  const phrases = useMemo(() => buildPhrases(interview, resume ?? null), [interview, resume]);
  const mic = useSpeechRecognition(
    useCallback((text: string) => setAnswer((prev) => (prev ? `${prev} ` : "") + text), []),
    phrases,
  );
  const voice = useVoiceSettings();
  // 질문을 읽는 effect가 설정을 바꿀 때마다 다시 실행되지 않도록, 읽는 순간의 최신 값만 ref로 본다
  const voiceRef = useRef(voice.settings);
  useEffect(() => {
    voiceRef.current = voice.settings;
  }, [voice.settings]);

  useEffect(() => {
    setResume(loadResume(interview.id));
  }, [interview.id]);

  const current = turns.find((t) => t.answer === null);
  const currentQuestion = current?.question;

  // 새 질문이 나오면 읽어 준다. 질문이 바뀌거나 화면을 떠나면 읽던 것을 멈춘다.
  useEffect(() => {
    if (!started || !readAloud || !currentQuestion) return;
    speak(currentQuestion, voiceRef.current);
    return () => stopSpeaking();
  }, [started, readAloud, currentQuestion]);

  const micBusy = mic.listening || mic.stopping; // 말하는 중에 제출하면 마지막 말이 빠질 수 있다

  async function submitAnswer() {
    const text = answer.trim();
    if (!current || !resume) return;
    if (!text) return setError("답변을 말하거나 입력해 주세요");
    stopSpeaking();
    setError(null);
    setBusy("answer");
    const result = await postJson<{ done: boolean; turn?: Turn }>(`/interviews/${interview.id}/answer`, { answer: text, resume });
    setBusy(null);
    if (!result.ok) return setError(result.error); // 입력한 답변은 그대로 두어 다시 보낼 수 있다
    const next = result.data.turn;
    setTurns((prev) => [...prev.map((t) => (t.order === current.order ? { ...t, answer: text } : t)), ...(next ? [{ ...next, answer: null }] : [])]);
    setAnswer("");
  }

  async function makeReport() {
    setError(null);
    setBusy("report");
    const result = await postJson<Report>(`/interviews/${interview.id}/report`, resume ? { resume } : {});
    setBusy(null);
    if (!result.ok) return setError(result.error);
    setReport({ scores: result.data.scores, feedback: result.data.feedback, modelAnswers: result.data.modelAnswers ?? [] });
  }

  const header = (
    <div className="mb-6">
      <p className="text-sm text-neutral-500">
        {interview.company} · {interview.role} · {careerShort(interview.career)} · {labelOf(TYPE_OPTIONS, interview.type)} · {labelOf(INTENSITY_OPTIONS, interview.intensity)}
      </p>
    </div>
  );

  if (report) {
    return (
      <>
        {header}
        <ReportView report={report} turns={turns} />
      </>
    );
  }

  // 모든 질문에 답했는데 리포트가 아직 없는 경우
  if (!current) {
    return (
      <>
        {header}
        <div className={`${card} space-y-4 text-center`}>
          <h1 className="text-xl font-bold">면접이 끝났어요</h1>
          <p className="text-sm text-neutral-500">답변을 바탕으로 리포트를 만들어 드려요. 몇 초 걸릴 수 있어요.</p>
          <FormError message={error} />
          <button type="button" onClick={makeReport} disabled={busy === "report"} className={primaryButton}>
            {busy === "report" ? "리포트를 만드는 중이에요..." : "리포트 만들기"}
          </button>
        </div>
      </>
    );
  }

  if (resume === undefined) return null; // 저장된 서류를 확인하는 중

  // 탭을 닫았다가 다시 열었거나 다른 기기에서 열면 서류가 없다 (서버에 저장하지 않기 때문)
  if (resume === null) {
    return (
      <>
        {header}
        <div className={`${card} space-y-5`}>
          <div>
            <h1 className="text-xl font-bold">서류를 다시 불러와 주세요</h1>
            <p className="mt-1.5 text-sm text-neutral-500">서류는 서버에 저장하지 않아서, 이 브라우저에 없으면 다시 올려야 이어서 진행할 수 있어요.</p>
          </div>
          <ResumeSetup
            context={{ company: interview.company, field: interview.field, role: interview.role, career: interview.career }}
            brief={resumeDraft}
            onBrief={setResumeDraft}
          />
          <button
            type="button"
            disabled={!resumeDraft.trim()}
            onClick={() => {
              saveResume(interview.id, resumeDraft.trim());
              setResume(resumeDraft.trim());
            }}
            className={primaryButton}
          >
            이어서 진행하기
          </button>
        </div>
      </>
    );
  }

  // 시작 전: 버튼을 눌러야 음성 재생과 마이크 권한 요청이 허용된다
  if (!started) {
    return (
      <>
        {header}
        <div className={`${card} space-y-4 text-center`}>
          <h1 className="text-xl font-bold">준비되셨나요?</h1>
          <p className="text-sm leading-relaxed text-neutral-500">
            질문 {INTERVIEW_TURNS}개로 진행돼요. 질문을 소리로 읽어 주고, 마이크로 대답하면 글자로 바뀌어요. 마이크를 쓰려면 브라우저가 권한을 물을 때 허용해 주세요.
            조용한 곳에서 시작하는 걸 추천해요.
          </p>
          {!mic.supported && <FormNotice>이 브라우저는 음성 인식을 지원하지 않아요. 답변을 글자로 직접 입력해 주세요. 음성 인식은 Chrome에서 가장 안정적이에요.</FormNotice>}
          {mic.supported && isEdge() && (
            <FormNotice>Edge에서는 음성 인식이 연결되지 않는 경우가 있어요. 말해도 글자가 안 적히면 Chrome에서 열어 주세요. 직접 입력해서 답할 수도 있어요.</FormNotice>
          )}
          {mic.supported && <MicEngineNotice state={mic.localState} installing={mic.installing} onInstall={mic.install} />}
          {canSpeak() && (
            <details className="rounded-xl border border-black/10 p-4 text-left dark:border-white/10" open>
              <summary className="cursor-pointer text-sm font-medium">면접관 목소리 설정</summary>
              <div className="mt-4">
                <VoiceSettingsPanel {...voice} />
              </div>
            </details>
          )}
          <button type="button" onClick={() => setStarted(true)} className={primaryButton}>
            면접 시작하기
          </button>
        </div>
      </>
    );
  }

  const answered = turns.filter((t) => t.answer !== null);

  return (
    <>
      {header}

      <div className="mb-2 flex items-center justify-between text-sm text-neutral-500">
        <span>
          질문 {current.order} / {INTERVIEW_TURNS}
        </span>
        <span>{current.kind === "FOLLOW_UP" ? "꼬리질문" : "새 질문"}</span>
      </div>
      <div className="mb-6 h-1.5 rounded-full bg-neutral-200 dark:bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={INTERVIEW_TURNS} aria-valuenow={current.order}>
        <div className="h-1.5 rounded-full bg-violet-600 transition-all" style={{ width: `${((current.order - 1) / INTERVIEW_TURNS) * 100}%` }} />
      </div>

      <div className="rounded-2xl rounded-tl-sm bg-neutral-100 p-5 leading-relaxed dark:bg-white/10">
        <p className="mb-1 text-xs font-medium text-neutral-500">면접관</p>
        {current.question}
      </div>
      {canSpeak() && (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <button type="button" onClick={() => speak(current.question, voice.settings)} className={ghostButton}>
              다시 듣기
            </button>
            <label className="flex cursor-pointer items-center gap-2 text-neutral-500">
              <input type="checkbox" checked={readAloud} onChange={(e) => setReadAloud(e.target.checked)} />
              질문을 소리로 읽어 주기
            </label>
          </div>
          <details className="mt-3 rounded-xl border border-black/10 p-4 dark:border-white/10">
            <summary className="cursor-pointer text-sm font-medium">면접관 목소리 설정</summary>
            <div className="mt-4">
              <VoiceSettingsPanel {...voice} />
            </div>
          </details>
        </>
      )}

      <div className={`${card} mt-6 space-y-4`}>
        <div className="flex h-12 items-center justify-center gap-1.5" aria-hidden="true">
          {WAVE.map((h, i) => (
            <span
              key={i}
              className={`w-1.5 rounded-full bg-gradient-to-b from-indigo-500 to-fuchsia-500 ${mic.listening ? "wave-bar" : "opacity-30"}`}
              style={{ height: `${h * 100}%`, animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>

        {mic.supported && <MicEngineNotice state={mic.localState} installing={mic.installing} onInstall={mic.install} />}
        {mic.supported ? (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (mic.listening) return mic.stop();
                stopSpeaking(); // 마이크가 질문 소리를 같이 받아 적지 않도록
                mic.start();
              }}
              disabled={busy !== null || mic.stopping}
              className={mic.listening ? "rounded-full bg-red-500 px-6 py-2.5 font-medium text-white hover:bg-red-600 disabled:opacity-60" : primaryButton}
            >
              {mic.stopping ? "마무리하는 중..." : mic.listening ? "● 녹음 중 · 멈추기" : "🎤 말하기 시작"}
            </button>
          </div>
        ) : (
          <FormNotice>이 브라우저는 음성 인식을 지원하지 않아요. 아래 칸에 답변을 직접 입력해 주세요.</FormNotice>
        )}
        {mic.error && <FormError message={mic.error} />}

        <label className="block text-sm font-medium">
          내 답변 <span className="font-normal text-neutral-500">(말한 내용이 여기에 적혀요. 고칠 수 있어요)</span>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            maxLength={5000}
            disabled={busy !== null}
            placeholder="마이크로 말하거나 직접 입력해 주세요"
            className="mt-1.5 w-full resize-y rounded-lg border border-black/15 bg-transparent px-3.5 py-2.5 font-normal leading-relaxed outline-none placeholder:text-neutral-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/20"
          />
        </label>
        {mic.interim && <p className="-mt-2 text-sm text-neutral-400">{mic.interim}</p>}

        <FormError message={error} />
        {busy === "answer" && <p className="text-center text-sm text-neutral-500">면접관이 다음 질문을 준비하고 있어요... (몇 초 걸려요)</p>}
        {micBusy && <p className="text-center text-xs text-neutral-500">녹음 중에는 제출할 수 없어요. 먼저 &quot;멈추기&quot;를 눌러 주세요.</p>}
        <button type="button" onClick={submitAnswer} disabled={busy !== null || micBusy || !answer.trim()} className={`${primaryButton} w-full`}>
          {current.order >= INTERVIEW_TURNS ? "마지막 답변 완료" : "답변 완료"}
        </button>
      </div>

      {answered.length > 0 && (
        <details className="mt-6 rounded-2xl border border-black/10 p-5 dark:border-white/10">
          <summary className="cursor-pointer text-sm font-medium">지난 질문과 내 답변 ({answered.length})</summary>
          <ol className="mt-4 space-y-4">
            {answered.map((t) => (
              <li key={t.order}>
                <p className="text-sm font-medium">
                  Q{t.order}. {t.question}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{t.answer}</p>
              </li>
            ))}
          </ol>
        </details>
      )}
    </>
  );
}

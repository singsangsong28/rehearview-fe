"use client";

import { useRef, useState } from "react";
import { TextArea } from "@/components/common/form";
import { extractText } from "@/lib/extractText";
import { RESUME_ANALYZE_MAX_CHARS } from "@/lib/interview";

type Loaded = { id: number; name: string; text: string };

// 파일마다 이름표를 붙여 하나의 글로 합친다. 분석 단계에서 AI가 어느 서류의 내용인지 알 수 있다.
const combine = (files: Loaded[], manual: string) =>
  [...files.map((f) => `[파일: ${f.name}]\n${f.text.trim()}`), manual.trim() && `[직접 입력]\n${manual.trim()}`].filter(Boolean).join("\n\n");

// 서류 입력: 파일을 여러 개 골라 글자를 읽고(이력서, 자기소개서, 포트폴리오 등), 필요하면 직접 붙여 넣는다.
// 합친 글은 onChange로 넘긴다. 파일은 서버로 올라가지 않고 이 브라우저 안에서만 읽는다.
export default function ResumeInput({ onChange }: { onChange: (combined: string) => void }) {
  const [files, setFiles] = useState<Loaded[]>([]);
  const [manual, setManual] = useState("");
  const [reading, setReading] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  // 파일을 하나씩 읽는 도중에도 최신 상태를 보려고 ref로 함께 들고 있는다
  const filesRef = useRef<Loaded[]>([]);
  const manualRef = useRef("");
  const nextId = useRef(1);

  const commit = (nextFiles: Loaded[], nextManual: string) => {
    filesRef.current = nextFiles;
    manualRef.current = nextManual;
    setFiles(nextFiles);
    setManual(nextManual);
    onChange(combine(nextFiles, nextManual));
  };

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // 같은 파일을 다시 골라도 반응하도록
    if (picked.length === 0) return;
    setErrors([]);
    for (const file of picked) {
      setReading(file.name);
      try {
        const text = (await extractText(file)).trim();
        if (!text) throw new Error("글자를 읽지 못했어요. 이미지로 된 문서일 수 있으니 내용을 직접 붙여 넣어 주세요");
        commit([...filesRef.current, { id: nextId.current++, name: file.name, text }], manualRef.current);
      } catch (err) {
        setErrors((prev) => [...prev, `${file.name}: ${err instanceof Error ? err.message : "읽지 못했어요"}`]);
      }
    }
    setReading(null);
  }

  const total = combine(files, manual).length;

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={onPick}
          aria-label="서류 파일 선택 (여러 개 가능)"
          className="block w-full text-sm text-neutral-500 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-violet-500/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-violet-700 hover:file:bg-violet-500/20 dark:file:text-violet-200"
        />
        <p className="mt-1.5 text-xs text-neutral-500">
          {reading
            ? `${reading} 읽는 중이에요...`
            : "이력서, 자기소개서, 포트폴리오 등 파일을 여러 개 함께 고를 수 있어요. PDF, DOCX, TXT (파일당 10MB 이하). 파일은 서버로 올라가지 않고 이 브라우저 안에서 글자만 읽어요."}
        </p>
        {errors.map((msg) => (
          <p key={msg} role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-300">
            {msg}
          </p>
        ))}
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f) => (
            <li key={f.id} className="rounded-xl border border-black/10 p-3 dark:border-white/10">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium">{f.name}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-neutral-500">{f.text.length.toLocaleString()}자</span>
                  <button
                    type="button"
                    onClick={() => commit(filesRef.current.filter((x) => x.id !== f.id), manualRef.current)}
                    className="text-xs text-neutral-500 hover:text-red-600 dark:hover:text-red-300"
                  >
                    삭제
                  </button>
                </span>
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-neutral-500">읽은 내용 보기·고치기 (민감한 부분은 여기서 지워 주세요)</summary>
                <textarea
                  value={f.text}
                  onChange={(e) => commit(filesRef.current.map((x) => (x.id === f.id ? { ...x, text: e.target.value } : x)), manualRef.current)}
                  rows={8}
                  className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-transparent px-3 py-2 text-xs leading-relaxed outline-none focus:border-violet-500 dark:border-white/20"
                />
              </details>
            </li>
          ))}
        </ul>
      )}

      <TextArea
        label="직접 붙여 넣기 (선택)"
        value={manual}
        onChange={(e) => commit(filesRef.current, e.target.value)}
        rows={files.length > 0 ? 5 : 10}
        placeholder="파일이 없거나 추가하고 싶은 내용이 있으면 여기에 붙여 넣어 주세요."
        hint={
          <span className={total > RESUME_ANALYZE_MAX_CHARS ? "text-red-600 dark:text-red-300" : undefined}>
            전체 {total.toLocaleString()} / {RESUME_ANALYZE_MAX_CHARS.toLocaleString()}자
          </span>
        }
      />
    </div>
  );
}

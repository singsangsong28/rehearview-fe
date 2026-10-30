// 인증·회원 영역에서 같이 쓰는 폼 부품: 입력칸, 선택 카드, 버튼, 메시지

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/15 bg-transparent px-3.5 py-2.5 font-normal outline-none placeholder:text-neutral-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-white/20";

export function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input {...props} className={inputClass} />
    </label>
  );
}

export function TextArea({ label, hint, ...props }: { label: string; hint?: React.ReactNode } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <textarea {...props} className={`${inputClass} resize-y leading-relaxed`} />
      {hint && <span className="mt-1.5 block text-xs font-normal text-neutral-500">{hint}</span>}
    </label>
  );
}

// 하나만 고르는 카드형 라디오. 값은 폼의 name으로 제출된다.
export function RadioCards({
  label,
  name,
  options,
  defaultValue,
  cols = 2,
}: {
  label: string;
  name: string;
  options: { value: string; title: string; desc?: string; wide?: boolean }[];
  defaultValue: string;
  cols?: 2 | 3;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{label}</legend>
      {/* Tailwind는 클래스 이름을 문자열 그대로 찾기 때문에 동적으로 조립하지 않고 고정 값을 고른다 */}
      <div className={`mt-1.5 grid gap-2.5 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((o) => (
          <label key={o.value} className={`cursor-pointer ${o.wide ? "sm:col-span-full" : ""}`}>
            <input type="radio" name={name} value={o.value} defaultChecked={o.value === defaultValue} className="peer sr-only" />
            <span className="block rounded-lg border border-black/15 px-3.5 py-2.5 text-sm peer-checked:border-violet-500 peer-checked:bg-violet-500/10 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500/30 dark:border-white/20">
              <span className="font-medium">{o.title}</span>
              {o.desc && <span className="mt-0.5 block text-xs text-neutral-500">{o.desc}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function SubmitButton({ pending, disabled, children }: { pending: boolean; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-60"
    >
      {pending ? "처리 중..." : children}
    </button>
  );
}

export function FormError({ message }: { message: string | null }) {
  return message ? (
    <p role="alert" className="rounded-lg bg-red-500/10 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-300">
      {message}
    </p>
  ) : null;
}

export function FormNotice({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg bg-violet-500/10 px-3.5 py-3 text-sm leading-relaxed text-violet-700 dark:text-violet-200">{children}</p>;
}

export const linkClass = "text-violet-600 hover:underline dark:text-violet-300";

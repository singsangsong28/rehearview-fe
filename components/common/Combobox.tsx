"use client";

import { useEffect, useId, useState } from "react";
import { inputClass } from "./form";

type Props = {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  // false면 목록에서 고르기만 한다 (입력칸은 읽기 전용, 직접 입력 항목 없음)
  allowCustom?: boolean;
};

// 목록에서 고르거나 직접 입력하는 입력칸. 값은 일반 input(name)으로 제출된다.
// 입력하면 목록이 걸러지고, 목록에 없는 글자는 "직접 입력" 항목으로 보여 준다.
export default function Combobox({ label, name, options, value, onChange, placeholder, required, maxLength, allowCustom = true }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const query = value.trim();
  const exact = options.includes(query);
  // 입력이 비었거나 목록의 값과 정확히 같으면 전체를 보여 줘서 다른 항목으로 바꾸기 쉽게 한다
  const matches = !allowCustom || !query || exact ? options : options.filter((o) => o.includes(query));
  const items = [
    ...(allowCustom && query && !exact ? [{ value: query, text: `"${query}" 직접 입력` }] : []),
    ...matches.map((o) => ({ value: o, text: o })),
  ];
  const showList = open && items.length > 0;

  // 키보드로 움직인 항목이 목록 밖으로 벗어나지 않게 스크롤
  useEffect(() => {
    if (active >= 0) document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, id]);

  function select(v: string) {
    onChange(v);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && showList && active >= 0) {
      e.preventDefault(); // 항목을 고르는 Enter가 폼 제출로 이어지지 않게
      select(items[active].value);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <label htmlFor={`${id}-input`} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={`${id}-input`}
          name={name}
          value={value}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          autoComplete="off"
          readOnly={!allowCustom}
          role="combobox"
          aria-expanded={showList}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${id}-opt-${active}` : undefined}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)} // 항목을 고른 뒤에도 포커스는 남아 있어서, 다시 눌렀을 때 열리게
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className={`${inputClass} pr-10 ${allowCustom ? "" : "cursor-pointer caret-transparent"}`}
        />
        {/* 화살표는 장식이라 클릭은 아래 input이 받는다 */}
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 right-3.5 mt-0.5 -translate-y-1/2 text-neutral-400 transition-transform ${showList ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {showList && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-black/10 bg-background p-1.5 shadow-lg [scrollbar-color:rgb(0_0_0/0.25)_transparent] [scrollbar-width:thin] dark:border-white/15 dark:[scrollbar-color:rgb(255_255_255/0.3)_transparent]"
        >
          {items.map((item, i) => (
            <li
              key={`${item.value}-${i}`}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={item.value === query}
              // mousedown을 막아 input의 blur(목록 닫힘)보다 먼저 클릭이 처리되게 한다
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(item.value)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm ${
                i === active ? "bg-violet-500/10 text-violet-700 dark:text-violet-200" : ""
              }`}
            >
              {item.text}
              {item.value === query && (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-violet-600 dark:text-violet-300">
                  <path d="M5 12.5 10 17.5 19 7.5" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

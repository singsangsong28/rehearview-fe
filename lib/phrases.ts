// 음성 인식이 잘 알아듣도록 미리 알려 줄 단어 목록(회사명, 직무, 서류 속 핵심 용어)을 만든다.
// Chrome의 기기 내 인식(phrases)에서만 쓰이고, 단어는 이 브라우저 밖으로 나가지 않는다.
export type Phrase = { text: string; boost: number }; // boost: 0~10 (브라우저가 허용하는 범위)

const MAX_RESUME_TERMS = 40;

// 서류 문장에 흔한 어미·조사로 끝나는 말은 핵심 용어가 아니라서 뺀다
const COMMON_ENDINGS = /(습니다|합니다|입니다|했다|하였다|했으며|하며|하여|하고|에서|으로|에게|까지|부터|이며|이다|있는|하는|되는|위해|통해|대한|대해)$/;

const PARTICLE = /(을|를|이|가|은|는|과|와|의|도|에|로)$/;

export function buildPhrases(setup: { company: string; role: string; field: string }, resume: string | null): Phrase[] {
  const seen = new Set<string>();
  const out: Phrase[] = [];
  const add = (text: string, boost: number) => {
    const t = text.trim();
    if (t.length < 2 || seen.has(t.toLowerCase())) return;
    seen.add(t.toLowerCase());
    out.push({ text: t, boost });
  };

  // 지원 정보는 면접 내내 자주 나오는 말이라 강하게
  for (const t of [setup.company, setup.role, setup.field]) add(t, 8);

  if (resume) {
    const counts = new Map<string, number>();
    for (const raw of resume.match(/[가-힣]{3,12}|[A-Za-z][A-Za-z0-9+#.-]{1,19}/g) ?? []) {
      if (COMMON_ENDINGS.test(raw)) continue;
      // "이탈률을" → "이탈률", "경험을" → "경험": 3글자 이상인 한글 말의 끝 조사를 떼서 같은 말끼리 모은다
      const m = raw.length >= 3 && /^[가-힣]+$/.test(raw) ? raw.replace(PARTICLE, "") : raw;
      counts.set(m, (counts.get(m) ?? 0) + 1);
    }
    // 자주 나오고 긴 말일수록 핵심 용어일 가능성이 높다
    [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
      .slice(0, MAX_RESUME_TERMS)
      .forEach(([term]) => add(term, 3));
  }
  return out;
}

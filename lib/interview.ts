// 면접 설정 선택지. 값(value)은 백엔드 enum과 같아야 한다.
export const TYPE_OPTIONS: { value: string; title: string; desc: string; wide?: boolean }[] = [
  { value: "COMPREHENSIVE", title: "종합", desc: "직무 역량, 인성, 컬처핏, 임원 관점을 골고루 섞어서 물어봐요", wide: true },
  { value: "COMPETENCY", title: "직무역량", desc: "경험과 역량을 구체적으로 검증해요" },
  { value: "PERSONALITY", title: "인성", desc: "가치관과 태도를 물어봐요" },
  { value: "EXECUTIVE", title: "임원", desc: "큰 그림과 판단력을 확인해요" },
  { value: "CULTURE_FIT", title: "컬처핏", desc: "조직과의 적합성을 살펴봐요" },
];

export const INTENSITY_OPTIONS = [
  { value: "MILD", title: "순한맛", desc: "부드럽고 격려하는 말투" },
  { value: "NORMAL", title: "보통", desc: "정중하고 중립적인 말투" },
  { value: "SPICY", title: "매운맛", desc: "날카롭게 근거를 캐물어요" },
];

// 지원 구분. 질문의 초점이 달라진다 (신입은 잠재력, 경력직은 성과, 이직은 전환 동기와 연결되는 역량)
export const CAREER_OPTIONS = [
  { value: "NEW_GRAD", title: "신입", short: "신입" },
  { value: "EXPERIENCED", title: "경력직", short: "경력직" },
  { value: "CAREER_CHANGE", title: "이직 (직무·업종 전환)", short: "이직" },
];

// 목록·머리말처럼 좁은 곳에 쓰는 짧은 이름
export const careerShort = (value: string) => CAREER_OPTIONS.find((o) => o.value === value)?.short ?? value;

export const labelOf = (options: { value: string; title: string }[], value: string) =>
  options.find((o) => o.value === value)?.title ?? value;

// 직군 입력 자동완성 예시. 직군을 제한하는 목록이 아니다 (직접 입력 가능).
export const FIELDS = ["영업", "마케팅", "사무·행정", "서비스", "의료·보건", "교육", "공공·공기업", "기술·엔지니어링", "개발", "디자인", "물류·해운", "금융"];

// 서버 스키마(backend interview.schema.ts)의 길이 상한과 같아야 한다
export const RESUME_MAX_CHARS = 30_000; // 질문·리포트 요청에 실리는 서류(브리프) 길이
export const RESUME_ANALYZE_MAX_CHARS = 100_000; // 분석 요청에 실리는 서류 원문(여러 파일 합계) 길이
export const POSTING_MAX_CHARS = 30_000; // 채용 공고 길이

// 한 면접의 질문 수 (backend interview.service.ts 의 MAX_TURNS 와 같아야 한다)
export const INTERVIEW_TURNS = 6;

// 리포트 평가 축. 순서와 이름은 backend interview.schema.ts 의 REPORT_AXES 와 같아야 한다
export const REPORT_AXES = ["직무 이해도", "근거와 구체성", "논리 구조", "전달력", "태도와 진정성", "질문 의도 파악"];

export type Turn = { order: number; question: string; answer: string | null; kind: "MAIN" | "FOLLOW_UP" };
// modelAnswers: 질문별 모범 답변 예시 (이 기능 이전에 만든 리포트는 빈 배열)
export type Report = { scores: Record<string, number>; feedback: string; modelAnswers: { order: number; answer: string }[] };
export type InterviewData = {
  id: string;
  company: string;
  field: string;
  role: string;
  type: string;
  intensity: string;
  career: string;
  status: "IN_PROGRESS" | "COMPLETED";
  turns: Turn[];
  report: Report | null;
};

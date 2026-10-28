// 개인정보처리방침과 이용약관에 들어가는 운영자 정보. 공개 전에 여기만 채우면 두 문서에 모두 반영된다.
export const LEGAL = {
  // 법률 검토와 아래 정보 입력을 마친 뒤 false로 바꾸면 문서 위의 "초안" 안내가 사라진다
  draft: true,
  serviceName: "Rehearview(리허뷰)",
  operator: "singsangsong28",
  contactEmail: "kuu0528888@gmail.com",
  privacyOfficer: "singsangsong28",
  // 문서를 바꿔 시행일을 새로 정하면 backend/src/modules/auth/consent.ts 의 CONSENT_VERSION 도 함께 올려 다시 동의받는다
  effectiveDate: "2026년 10월 28일",
};

// 괄호 자리표시자가 아직 남아 있는지 (대괄호로 시작하는 값)
export const isPlaceholder = (value: string) => value.startsWith("[") && value.endsWith("]");

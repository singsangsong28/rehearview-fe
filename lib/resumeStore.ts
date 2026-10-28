// 서류 텍스트는 서버에 저장하지 않는다. 면접을 이어서 진행하는 동안만 브라우저 탭의 sessionStorage에 둔다
// (탭을 닫으면 사라지고, 새로 열면 서류를 다시 올려야 한다).
const key = (interviewId: string) => `resume:${interviewId}`;

export function saveResume(interviewId: string, text: string) {
  try {
    sessionStorage.setItem(key(interviewId), text);
  } catch {
    // 저장이 막힌 환경에서는 면접을 이어갈 수 없다 (진행 화면에서 다시 올리도록 안내)
  }
}

export function loadResume(interviewId: string): string | null {
  try {
    return sessionStorage.getItem(key(interviewId));
  } catch {
    return null;
  }
}

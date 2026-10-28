# Rehearview (리허뷰) · 프론트엔드

내 서류와 채용 공고를 바탕으로 AI 면접관과 **음성으로 모의면접**을 연습하는 웹 서비스입니다. 서비스 주소는 https://www.rehearview.shop 입니다.
이 저장소는 프론트엔드(Next.js)이고, API 서버는 [rehearview-be](https://github.com/singsangsong28/rehearview-be)입니다.

## 주요 기능

- **계정**: 이메일 가입(이메일 인증), GitHub · Google · 카카오 · 네이버 소셜 로그인, 비밀번호 찾기·재설정, 약관 동의, 계정 삭제
- **새 면접**: 지원 정보(회사, 직무, 직군, 지원 구분), 면접 유형·강도, 서류 파일 여러 개(PDF · DOCX · TXT) 읽기, 채용 공고(주소 불러오기 또는 붙여넣기), AI가 정리한 **면접 준비 브리프** 확인·수정
- **음성 면접**: 질문 읽어 주기(목소리·속도 선택), 음성 인식(Chrome 기기 내 인식 + 서류 단어 힌트) 또는 글자 답변, 꼬리질문
- **리포트**: 6가지 기준 점수, 총평, 질문·내 답변과 **질문별 모범 답변 예시**
- **내 면접 기록** 보기·삭제, 개인정보처리방침·이용약관, 라이트/다크 모드

## 기술 스택

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · pdfjs-dist / mammoth(브라우저에서 파일 읽기) · Pretendard(서브셋) · Google Analytics(`@next/third-parties`)

## 구조

```
app/
├─ (guest)/       비회원: 랜딩, 로그인, 가입, 비밀번호 찾기·재설정, 이메일 인증, 개인정보처리방침, 이용약관
├─ (onboarding)/  로그인은 했지만 약관 동의 전인 사용자: /consent
└─ (member)/      회원 전용(로그인 + 약관 동의 필요): 내 면접, 새 면접, 면접 진행, 내 계정
components/       common · landing · auth · member · legal
lib/              api, 면접 선택지, 서류 읽기(extractText), 음성(speech), 서버 전용 세션(lib/server)
.github/workflows CI (타입 검사, 린트, 빌드)
```

회원 영역 레이아웃이 서버에서 쿠키를 백엔드(`/auth/me`)로 검증해서, 로그인이 없으면 `/login`, 약관 동의 전이면 `/consent`로 보냅니다.

## 실행

1. 백엔드([rehearview-be](https://github.com/singsangsong28/rehearview-be))를 먼저 실행합니다. (기본 `http://localhost:4000`)
2. 의존성 설치 후 개발 서버를 실행합니다.

```bash
npm install
npm run dev   # http://localhost:3000
```

| 환경변수 | 설명 | 기본값 |
|---|---|---|
| `BACKEND_URL` | 백엔드 주소. 브라우저의 `/api/*` 요청을 이 주소로 프록시하고, 서버 컴포넌트가 로그인 확인에 직접 사용합니다. 끝에 슬래시나 `/api`를 붙이지 않습니다 | `http://localhost:4000` |
| `NEXT_PUBLIC_GA_ID` | 구글 애널리틱스 측정 ID(`G-...`). 비어 있으면 추적 코드를 넣지 않습니다 | (없음) |

두 값 모두 **빌드 때** 반영되므로, 배포 환경에서 바꾸면 다시 배포해야 합니다. 전체 목록은 `.env.example`에 있습니다.

`npm run build`, `npm run lint`, `npx tsc --noEmit`으로 빌드·린트·타입을 확인할 수 있습니다.

## 배포

- Vercel이 `main` 브랜치에 병합될 때마다 자동으로 배포합니다. 환경변수는 Vercel의 Environment Variables에 넣습니다.
- PR(dev, main 대상)에서는 GitHub Actions가 타입 검사, 린트, 빌드를 돌려 깨지는 변경을 미리 잡습니다.
- **브랜치 흐름**: `feature/*`·`fix/*`·`docs/*` → `dev` PR → `dev`에서 `main` 릴리스 PR.

## 설계 메모

- **서류 원문은 서버에 저장하지 않습니다.** 파일은 브라우저 안에서 글자만 읽고, AI가 정리한 브리프는 면접 진행 동안만 탭의 `sessionStorage`에 보관합니다.
- 로그인 쿠키가 제3자 쿠키로 막히지 않도록 `next.config.ts`의 `rewrites`로 `/api/*`를 백엔드에 프록시합니다. AI 분석이 오래 걸릴 수 있어 프록시 대기 시간(`proxyTimeout`)을 3분으로 늘렸습니다.
- 같은 공유기의 다른 기기로 개발 서버에 접속하려면 `next.config.ts`의 `allowedDevOrigins`에 그 PC의 주소를 넣습니다.
- `lib/legal.ts`의 운영자 정보를 고치거나 약관·방침 문서를 바꾸면, 백엔드 `consent.ts`의 `CONSENT_VERSION`을 올려 이용자에게 다시 동의받습니다.
- 구글 애널리틱스를 켜면 방문 통계가 수집되므로 개인정보처리방침의 이용 통계·쿠키 항목과 함께 유지해야 합니다. 이메일, 서류, 답변 내용은 보내지 않습니다.

## 알려진 제한

- 음성 인식은 **Chrome**에서 가장 안정적입니다. Edge에서는 인식 서비스 연결(network) 오류가 나는 경우가 있어, 글자 입력으로 대체할 수 있게 했습니다.
- 질문 읽어 주기의 목소리는 브라우저·OS에 설치된 한국어 목소리에 따라 달라집니다.
- AI 제공사의 무료 한도가 작아 사용자가 늘면 질문 생성이나 리포트가 실패할 수 있습니다 (백엔드 README 참고).
- `npm audit`에 Next.js가 포함한 `postcss` 경고 1건이 남아 있습니다. Next 16 업그레이드가 필요해 보류 중입니다.

## 라이선스

- 글꼴 Pretendard: SIL Open Font License 1.1 (`public/fonts/pretendard/LICENSE.txt`)
- PDF 워커(`public/pdfjs/`): pdfjs-dist (Apache-2.0)
- 소스 코드의 라이선스는 아직 정하지 않았습니다.

# KONECT Frontend — Claude Code Guide

## Project

React 19 + TypeScript + Vite 7 기반 모바일 웹뷰 앱 (React Native 브릿지 포함).
패키지 매니저: `pnpm` 10.x (`engine-strict=true`, Node ≥22.20.0).

## Commands

```bash
pnpm start    # dev server (port 3000)
pnpm lint     # eslint + prettier
pnpm build    # tsc -b && vite build
```

변경 후 최소 `pnpm lint` 실행. 라우팅/API/빌드 설정 변경 시 `pnpm build`까지 확인.
테스트 스크립트 없음 — 회귀 방지는 lint/build + 수동 검증에 의존.

## Stack

react-router-dom v7 | @tanstack/react-query (`useSuspenseQuery`) | zustand | Tailwind CSS v4 + `src/styles/theme.css` | Sentry (optional)

## Key Files

| 파일                      | 역할                                                           |
| ------------------------- | -------------------------------------------------------------- |
| `src/main.tsx`            | 앱 진입점, Sentry init, QueryClientProvider, ToastProvider     |
| `src/apis/client.ts`      | 공통 HTTP 클라이언트 (timeout, 401 refresh/retry, 에러 표준화) |
| `src/App.tsx`             | 전체 라우트 트리 + `PublicRoute`/`ProtectedRoute`              |
| `src/stores/authStore.ts` | 인증 상태 (initialize, setAccessToken, clearAuth)              |
| `src/styles/theme.css`    | Tailwind v4 `@theme` 색상/타이포그래피 토큰                    |
| `src/utils/ts/cn.ts`      | `clsx + tailwind-merge` 클래스 유틸                            |

## Directory Structure

```text
src/
├── apis/          # 도메인별 API 함수 + 타입 (entity.ts)
├── pages/         # 라우트 단위 페이지 + 페이지 전용 hooks/
├── components/    # 공통 UI, layout, auth 가드
├── stores/        # Zustand 전역 상태
├── contexts/      # React Context (Toast 등)
├── utils/         # 공통 hooks + TypeScript 유틸
├── interface/     # 공통 TypeScript 타입 (에러 타입 등)
└── styles/        # 폰트/테마 토큰, 전역 스타일
```

### Language Rules

- 사용자 입력이 한국어이면 최종 응답은 한국어로 작성한다.
- 내부 추론/초안은 영어를 사용할 수 있다.

## Critical Rules

### Import

- 경로 alias `@/*` 우선 사용
- import 순서: builtin → external → internal(`@/**`) → parent → sibling → index, 알파벳 오름차순

### Prettier

- `singleQuote: true`, `semi: true`, `tabWidth: 2`, `printWidth: 120`, `trailingComma: 'es5'`
- `prettier-plugin-tailwindcss` 적용 (클래스 자동 정렬)

### API

- HTTP 호출은 반드시 `apiClient` 사용 (`src/apis/client.ts`)
- 인증 필요한 API: `requiresAuth: true` 명시
- 401 갱신/재시도는 `apiClient` 내부 위임 — 각 API에서 중복 구현 금지
- API 타입은 해당 도메인의 `entity.ts`에 정의
- 5xx 에러: `redirectToServerErrorPage()` 패턴 유지

### Routing

- 신규 라우트는 `src/App.tsx`에 추가
- 인증 제어는 `PublicRoute`/`ProtectedRoute` 사용
- `Layout` props: `showBottomNav`(하단 탭), `contentClassName`(배경색 등)
- 페이지 로직은 페이지 전용 `hooks/`로 분리

### State & Data Fetching

- 서버 상태: React Query (`useSuspenseQuery` 등), query key factory 패턴
- 전역 클라이언트 상태: Zustand store

### Styling

- 색상: `src/styles/theme.css` 토큰 우선 (`indigo-*`, `blue-*`, `background`, `primary`)
- 타이포그래피: `text-h1`~`text-h5`, `text-sub1`~`text-sub4`, `text-body1`~`text-body3`, `text-cap1`~`text-cap2`
- 클래스 병합: `cn()` 유틸 사용
- 모바일 웹뷰 대응 (`--viewport-height`, safe area 변수) 패턴 유지

### React Native Bridge

- `window.ReactNativeWebView.postMessage(...)` 호출 시 항상 try/catch, 실패 무시

## Environment Variables

```text
VITE_API_PATH                          # required
VITE_SENTRY_DSN, VITE_SENTRY_ENABLED  # optional (Sentry, 외 VITE_SENTRY_* 다수)
SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN, SENTRY_RELEASE  # build-time
```

신규 env 변수 추가 시 `.env.example`에도 키 반영.

## GitHub Conventions

### Branch

`{이슈번호}-{type}-{설명-kebab-case}` — 예: `154-feat-에러페이지-구현`

### Commit Message

```text
type: 한국어 설명
타입: feat, fix, refactor, chore, docs, style, test
```

### Issue

템플릿: `.github/ISSUE_TEMPLATE/` — `BUG_REPORT.md` / `NEW_FEATURE.md`
제목 형식: `[타입] 설명`

### PR

템플릿: `.github/ISSUE_TEMPLATE/pull_request_template`

- **✨ 요약** — 변경사항 설명
- **😎 해결한 이슈** — `close #이슈번호`

## Do Not Touch

- `dist/`, `node_modules/` — 직접 수정 금지
- `pnpm-lock.yaml` — `package.json` 변경 시 lockfile 정합성 확인

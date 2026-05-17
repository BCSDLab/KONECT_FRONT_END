# KONECT Frontend - Claude Code Guide

## Project

React 19 + TypeScript + Vite 8 기반 pnpm/Turbo 모노레포.
패키지 매니저: `pnpm` 10.x (`engine-strict=true`, Node >=22.20.0).

## Workspace

```text
apps/
├── app/              # React Native WebView 중심의 기존 모바일 웹 앱
└── web/              # 일반 웹 앱, 초기 구축 단계
packages/
├── design-tokens/    # 공통 CSS 디자인 토큰
├── utils/            # 공통 TS 유틸, subpath export only
└── vite-config/      # app/web 공통 Vite 설정
```

`apps/app`과 `apps/web`은 의존성 및 Vite 설정을 최대한 동일하게 유지한다.

## Commands

```bash
pnpm start      # @konect/app dev server
pnpm lint       # turbo run lint
pnpm build      # turbo run build
pnpm preview    # @konect/app preview server
```

앱별 실행:

```bash
pnpm start:app
pnpm start:web
pnpm preview:app
pnpm preview:web
```

`app`과 `web`은 기본 dev/preview 포트가 모두 `3000`이다. 루트 `pnpm start`/`pnpm preview`는 `app`만 실행한다.
동시에 실행하려면 한쪽 포트를 임시로 바꾼다.

변경 후 최소 `pnpm lint` 실행. 라우팅/API/빌드 설정 변경 시 `pnpm build`까지 확인.
테스트 스크립트 없음. 회귀 방지는 lint/build + 수동 검증에 의존.

## Stack

react-router-dom v7 | @tanstack/react-query (`useSuspenseQuery`) | zustand | Tailwind CSS v4 + `@konect/design-tokens` | Sentry (optional)

## Key Files

| 파일                                                 | 역할                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| `package.json`                                       | 루트 Turbo 스크립트                                         |
| `pnpm-workspace.yaml`                                | workspace/catalog 의존성 버전 관리                          |
| `turbo.json`                                         | task dependency, cache output, global env                   |
| `eslint.config.js`                                   | 루트 ESLint 설정. React 규칙은 `apps/*/src`에만 적용        |
| `packages/vite-config/src/index.ts`                  | app/web 공통 Vite 설정                                      |
| `packages/design-tokens/src/theme.css`               | Tailwind v4 `@theme` 토큰                                   |
| `packages/design-tokens/scripts/validate-tokens.mjs` | 디자인 토큰 검증                                            |
| `packages/utils/src/cn.ts`                           | `clsx + tailwind-merge` 클래스 유틸                         |
| `apps/app/src/main.tsx`                              | app 진입점, Sentry init, QueryClientProvider, ToastProvider |
| `apps/app/src/apis/client.ts`                        | 공통 HTTP 클라이언트                                        |
| `apps/app/src/App.tsx`                               | 전체 라우트 트리 + `PublicRoute`/`ProtectedRoute`           |
| `apps/app/src/stores/authStore.ts`                   | 인증 상태                                                   |
| `apps/web/src/main.tsx`                              | web 진입점, QueryClientProvider                             |

## App Directory Structure

```text
apps/app/src/
├── apis/          # 도메인별 API 함수 + 타입 (entity.ts)
├── pages/         # 라우트 단위 페이지 + 페이지 전용 hooks/
├── components/    # 공통 UI, layout, auth 가드
├── stores/        # Zustand 전역 상태
├── contexts/      # React Context (Toast 등)
├── utils/         # app 전용 hooks + TypeScript 유틸
├── interface/     # 공통 TypeScript 타입
└── styles/        # 폰트/테마 토큰, 전역 스타일
```

`apps/web/src`는 초기 구축 단계이며 새 구조는 가능하면 `apps/app/src`의 레이어 규칙과 맞춘다.

### Language Rules

- 사용자 입력이 한국어이면 최종 응답은 한국어로 작성한다.
- 내부 추론/초안은 영어를 사용할 수 있다.

## Critical Rules

### Import

- 앱 내부 경로 alias `@/*` 우선 사용
- workspace 패키지는 `@konect/*` import 사용
- `@konect/utils`는 root import 금지. `@konect/utils/cn`, `@konect/utils/api-error`처럼 subpath export 사용
- import 순서: builtin -> external -> internal(`@/**`) -> parent -> sibling -> index, 알파벳 오름차순

### Package Management

- app/web 공통 의존성 버전은 `pnpm-workspace.yaml` catalog로 관리
- `package.json` 변경 후 `pnpm install`로 lockfile 정합성 확인
- app/web Vite 설정은 `@konect/vite-config`에서 공유
- 루트 `tsconfig.json` references에는 TypeScript workspace package를 포함
- `packages/utils`에는 앱 도메인에 묶이지 않는 공통 유틸만 둔다. Toast/라우팅/인증 저장소 의존 로직은 app/web에 남긴다.

### Prettier

- `singleQuote: true`, `semi: true`, `tabWidth: 2`, `printWidth: 120`, `trailingComma: 'es5'`
- `prettier-plugin-tailwindcss` 적용

### API

- HTTP 호출은 `apps/app/src/apis/client.ts`의 `apiClient` 사용
- 인증 필요한 API: `requiresAuth: true` 명시
- 401 갱신/재시도는 `apiClient` 내부 위임. 각 API에서 중복 구현 금지
- API 타입은 해당 도메인의 `entity.ts`에 정의
- 5xx 에러: `redirectToServerErrorPage()` 패턴 유지

### Routing

- app 신규 라우트는 `apps/app/src/App.tsx`에 추가
- 인증 제어는 `PublicRoute`/`ProtectedRoute` 사용
- `Layout` props: `showBottomNav`, `contentClassName`
- 페이지 로직은 페이지 전용 `hooks/`로 분리

### State & Data Fetching

- 서버 상태: React Query (`useSuspenseQuery` 등), query key factory 패턴
- 전역 클라이언트 상태: Zustand store
- app/web의 `QueryClient` 기본 옵션은 동일하게 유지

### Styling

- 색상/타이포그래피: `@konect/design-tokens`의 CSS export 우선
- 타이포그래피: `text-h1`~`text-h5`, `text-sub1`~`text-sub4`, `text-body1`~`text-body3`, `text-cap1`~`text-cap2`
- 클래스 병합: `@konect/utils/cn`의 `cn()` 사용
- 디바운스 훅: `@konect/utils/use-debounced-callback` 사용
- 모바일 웹뷰 대응 (`--viewport-height`, safe area 변수) 패턴 유지

### React Native Bridge

- `window.ReactNativeWebView.postMessage(...)` 호출 시 항상 try/catch, 실패 무시
- React Native bridge 규칙은 기본적으로 `apps/app`에 적용

## Environment Variables

```text
VITE_API_PATH
VITE_SENTRY_DSN, VITE_SENTRY_ENABLED, VITE_SENTRY_*  # optional
SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN, SENTRY_RELEASE  # build-time
```

신규 env 변수 추가 시 `.env.example`에도 키 반영.

## GitHub Conventions

### Branch

`{이슈번호}-{type}-{설명-kebab-case}` 예: `154-feat-에러페이지-구현`

### Commit Message

```text
type: 한국어 설명
```

타입: feat, fix, refactor, chore, docs, style, test

### Issue

템플릿: `.github/ISSUE_TEMPLATE/` (`BUG_REPORT.md`, `NEW_FEATURE.md`)
제목 형식: `[타입] 설명`

### PR

템플릿: `.github/ISSUE_TEMPLATE/pull_request_template`

- **✨ 요약**: 변경사항 설명
- **😎 해결한 이슈**: `close #이슈번호`

## Do Not Touch

- `dist/`, `node_modules/`: 직접 수정 금지
- `pnpm-lock.yaml`: `package.json` 변경 시 정합성 확인 대상

<!-- Generated: 2026-03-04 | Updated: 2026-05-15 -->

# KONECT Frontend AGENTS Guide

## Purpose

`KONECT_FRONT_END` 모노레포에서 일관된 방식으로 안전하게 수정하기 위한 기준 문서.

## Project Snapshot

- Runtime: Node `22.20.0+` (`.nvmrc`)
- Package Manager: `pnpm` 10.x (`engine-strict=true`)
- Build System: Turborepo
- Apps: React 19 + TypeScript + Vite 8
- Router: `react-router-dom` v7
- Server State: `@tanstack/react-query`
- Client State: `zustand`
- Styling: Tailwind CSS v4 + shared design tokens
- Error Monitoring: Sentry (optional env)

## Workspace Map

- `apps/app`: React Native WebView 중심의 기존 모바일 웹 앱
- `apps/web`: 일반 웹 앱. 초기 구축 단계이며 `apps/app`과 의존성/빌드 설정을 맞춰 유지
- `packages/design-tokens`: 공통 CSS 디자인 토큰(`colors.css`, `typography.css`, `theme.css`)
- `packages/utils`: 공통 TypeScript 유틸. root barrel 없이 subpath export만 사용
- `packages/vite-config`: app/web 공통 Vite 설정

## Commands

```bash
pnpm start      # @konect/app dev server
pnpm lint
pnpm build
pnpm preview    # @konect/app preview server
```

앱별 실행:

```bash
pnpm start:app
pnpm start:web
pnpm preview:app
pnpm preview:web
pnpm --filter @konect/app build
pnpm --filter @konect/web build
```

- `app`과 `web`은 기본 dev/preview 포트가 모두 `3000`이다. 루트 `pnpm start`/`pnpm preview`는 `app`만 실행한다.
- `app`과 `web`을 동시에 실행하려면 한쪽 포트를 임시로 바꿔야 한다.
- 기본 검증: 변경 후 `pnpm lint`
- 라우팅/API/빌드 설정 변경 시 `pnpm build`까지 확인
- `package.json` 변경 시 `pnpm install`로 `pnpm-lock.yaml` 정합성 확인

## Key Files

- `package.json`: 루트 Turbo 스크립트
- `pnpm-workspace.yaml`: workspace/catalog 의존성 버전 관리
- `turbo.json`: task dependency, cache output, global env
- `eslint.config.js`: 루트 ESLint 설정. React 규칙은 `apps/*/src`에만 적용
- `packages/vite-config/src/index.ts`: app/web 공통 Vite 설정
- `packages/design-tokens/src/theme.css`: Tailwind v4 `@theme` 토큰
- `packages/design-tokens/scripts/validate-tokens.mjs`: 디자인 토큰 검증
- `packages/utils/src/cn.ts`: `clsx + tailwind-merge` 유틸
- `apps/app/src/main.tsx`: app bootstrap, Sentry init, QueryClientProvider, ToastProvider
- `apps/app/src/App.tsx`: app 라우트 트리 + `PublicRoute`/`ProtectedRoute`
- `apps/app/src/apis/client.ts`: app 공통 API client, timeout, 401 refresh/retry, 에러 표준화
- `apps/app/src/stores/authStore.ts`: app 인증 상태/토큰/유저 관리
- `apps/web/src/main.tsx`: web bootstrap, QueryClientProvider

## App Directory Map

`apps/app/src` 기준:

- `apis/`: 도메인 API + 타입(`entity.ts`)
- `pages/`: 페이지 + 페이지 전용 hooks/components
- `components/`: 공통 UI, 레이아웃, 라우트 가드
- `stores/`: Zustand 전역 상태
- `contexts/`: React Context (Toast 등)
- `utils/`: 앱 전용 hooks/TS 유틸
- `styles/`: 폰트/테마/전역 스타일

`apps/web/src`는 초기 구축 단계다. 새 구조는 가능하면 `apps/app/src`의 도메인/레이어 규칙과 맞춘다.

## Agent Rules

### Language Rules

- 사용자 입력이 한국어이면 최종 응답은 한국어로 작성한다.
- 내부 추론/초안은 영어를 사용할 수 있다.
- 내부 추론 과정은 노출하지 않는다.

### Working

- 최소 단위 수정, 기존 네이밍/구조 유지
- 앱 내부 import 경로는 `@/*` alias 우선 사용
- workspace 패키지는 `@konect/*` import 사용
- import 정렬은 `eslint import/order` 유지
- 그룹 순서: `builtin -> external -> internal(@/**) -> parent -> sibling -> index`
- 그룹 내 알파벳 오름차순 유지
- `dist/`, `node_modules/` 직접 수정 금지
- Prettier 규칙 유지: `singleQuote`, `semi`, `tabWidth: 2`, `printWidth: 120`, `trailingComma: es5`
- Tailwind 클래스 정렬(`prettier-plugin-tailwindcss`) 유지

### Monorepo

- app/web 공통 의존성 버전은 `pnpm-workspace.yaml` catalog로 관리한다.
- app/web Vite 설정은 `@konect/vite-config`를 통해 공유한다.
- 루트 `tsconfig.json` references에는 TypeScript workspace package를 포함한다.
- `packages/utils`는 root export를 만들지 않는다. `@konect/utils/cn`, `@konect/utils/api-error`처럼 명시적인 subpath export만 사용한다.
- `packages/utils`에는 앱 도메인에 묶이지 않는 공통 유틸만 둔다. Toast/라우팅/인증 저장소 의존 로직은 app/web에 남긴다.
- `packages/design-tokens`는 CSS entry export를 유지하고, 토큰 추가 시 검증 스크립트를 통과해야 한다.

### API and Auth

- HTTP 호출은 `apps/app/src/apis/client.ts`의 `apiClient` 사용
- 인증 API는 `requiresAuth: true` 명시
- 401 refresh/retry는 `apiClient` 흐름에 위임 (중복 구현 금지)
- API 타입은 도메인 `entity.ts`에 정의
- 서버 5xx는 `redirectToServerErrorPage()` 패턴 유지

### Routing and Pages

- app 신규 라우트는 `apps/app/src/App.tsx`에 추가
- 접근 제어는 `PublicRoute`/`ProtectedRoute` 사용
- 레이아웃은 `Layout`, `showBottomNav`, `contentClassName`으로 제어
- 페이지 로직은 가능하면 페이지 전용 `hooks/`로 분리

### State and Fetching

- 서버 상태: React Query 훅(`useSuspenseQuery` 등)
- 클라이언트 전역 상태: Zustand
- 동일 도메인 쿼리 키는 query key factory 패턴으로 일관성 유지
- app/web의 `QueryClient` 기본 옵션은 동일하게 유지한다.

### Styling

- Tailwind utility 우선 사용
- 토큰은 `@konect/design-tokens`의 CSS export 우선 사용
- 클래스 병합은 `@konect/utils/cn`의 `cn()` 사용
- 디바운스 훅은 `@konect/utils/use-debounced-callback` 사용
- 타이포그래피는 semantic utility(`text-h1`, `text-body1` 등) 우선
- 모바일 웹뷰 대응(`--viewport-height`, safe area 변수) 패턴 유지

### React Native Bridge

- `window.ReactNativeWebView.postMessage(...)`는 항상 `try/catch`로 감싸고 실패 시 롤백 없이 진행
- React Native bridge 규칙은 기본적으로 `apps/app`에 적용한다.

## Environment Variables

- Required: `VITE_API_PATH`
- Optional (Sentry):
  - `VITE_SENTRY_DSN`
  - `VITE_SENTRY_ENABLED`
  - `VITE_SENTRY_ENVIRONMENT`
  - `VITE_SENTRY_RELEASE`
  - `VITE_SENTRY_TRACES_SAMPLE_RATE`
  - `VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE`
  - `VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE`
  - `VITE_SENTRY_DEBUG_TRANSACTIONS`
- Build-time: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`, `SENTRY_RELEASE`

## GitHub Conventions

### Branch

```text
{이슈번호}-{type}-{설명-kebab-case}
```

예: `154-feat-404-50x-에러페이지-구현`, `149-fix-apiClient-로직-수정`

### Commit Message

```text
type: 한국어 설명
```

- 타입: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`

### Issue

- 템플릿: `.github/ISSUE_TEMPLATE/`
- `BUG_REPORT.md`: 무슨 버그인가요 / 재현하는 법 / 예상 동작 / 관련 사진 / 추가적인 내용
- `NEW_FEATURE.md`: 기능 설명 / 기능 사진 / 해야 할 작업들(체크박스) / 연관된 이슈
- 제목 형식: `[타입] 설명` (예: `[feat] 로그인 화면 구현`)

### PR

- 템플릿: `.github/ISSUE_TEMPLATE/pull_request_template`
- 필수 항목: `✨ 요약`, `😎 해결한 이슈(close #이슈번호)`

## Validation Checklist

- 변경 후 `pnpm lint` 실행
- 배포 영향 변경(라우팅/API/빌드 설정) 시 `pnpm build` 실행
- `package.json` 변경 시 `pnpm-lock.yaml` 정합성 확인
- 신규 env 필요 시 `.env.example`에 키 반영

## Do Not Touch

- `dist/` (빌드 결과물)
- `node_modules/` (의존성 설치 결과물)

## Known Gaps

- 테스트 스크립트(`pnpm test`)가 없어 회귀 방지는 lint/build + 핵심 흐름 수동 검증에 의존

<!-- MANUAL: 아래에 프로젝트 특화 운영 메모를 자유롭게 추가 -->

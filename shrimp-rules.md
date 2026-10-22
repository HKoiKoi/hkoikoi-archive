# Development Guidelines

## 프로젝트 개요

- 프로젝트: HKoiKoi.dev — 주니어 백엔드 개발자 함상현의 포트폴리오 + MDX 기술 블로그.
- 기준 문서: `docs/PRD.md`(기능 ID F001~F015), `docs/ROADMAP.md`(Task 명세), `docs/LEANCANVAS.md`.
- 스택: Next.js 16.4.2(App Router, Turbopack, `cacheComponents`, `partialPrefetching`), React 19.3, Tailwind CSS 4(CSS-first), shadcn/ui `base-nova`(**Base UI**, Radix 아님), TypeScript strict.
- 릴리스 순서: 1차(공개용) → 2차(블로그·관리자 인증) → 3차(관리 편의). **현재 코드는 create-next-app 초기 상태**이며 DB·인증·폼 라이브러리·테스트가 없다.
- 응답·커밋 메시지·문서는 **한국어**로 작성한다.

## 작업 시작 전 필수 절차

- **Next.js 코드를 쓰기 전에 `node_modules/next/dist/docs/`(예: `01-app/`)의 관련 문서를 읽는다.** 학습 데이터의 Next.js 지식을 신뢰하지 않는다.
- Task를 시작하기 전에 `docs/ROADMAP.md`의 해당 Task 명세와 `docs/PRD.md`의 해당 기능 ID·페이지 명세를 읽는다.
- 영역별로 아래 가이드를 먼저 읽는다.

| 작업 영역                 | 먼저 읽을 파일                                 |
| ------------------------- | ---------------------------------------------- |
| 라우트, 캐시, `proxy.ts`  | `docs/guides/nextjs-16.md`                     |
| 폴더 위치, 네이밍, 별칭   | `docs/guides/project-structure.md`             |
| 컴포넌트 작성             | `docs/guides/component-patterns.md`            |
| 스타일, 테마 토큰         | `docs/guides/styling-guide.md`                 |
| 폼                        | `docs/guides/forms-react-hook-form.md`         |
| shadcn 컴포넌트 추가·수정 | `.agents/skills/shadcn/SKILL.md`, `rules/*.md` |

## 프로젝트 구조

- `src/` 없이 루트에 `app/`, `components/`, `lib/`를 둔다. 별칭 `@/*` → `./*`.
- `components/ui/`: shadcn 컴포넌트 전용(현재 `button.tsx`만 있음).
- `components/<domain>/`: 여러 페이지가 공유하는 도메인 컴포넌트(예: `components/layout/`). 한 페이지 전용이면 해당 라우트의 `_components/`에 둔다.
- import 방향은 `components/ui` ← `components/<domain>` ← `app/` 단방향만 허용한다.
- 필요해질 때만 `lib/schemas/`, `lib/types/`, `lib/queries/`, 루트 `hooks/`(별칭 `@/hooks`)를 만든다.
- URL 없이 레이아웃만 나눌 때는 Route Group `(group)`을 쓴다.
- 서버 전용 모듈 상단에 `import "server-only"`를 둔다.

| 하지 않는다                                      | 한다                                        |
| ------------------------------------------------ | ------------------------------------------- |
| `src/` 폴더 생성                                 | 루트에 `app/`, `components/`, `lib/` 사용   |
| `pages/`, `getServerSideProps`, `getStaticProps` | `app/`만 사용                               |
| `middleware.ts` 생성                             | 루트 `proxy.ts`(export 함수명 `proxy`) 사용 |
| `tailwind.config.ts`, `postcss.config.*` 생성    | `app/globals.css`와 `next.config.ts`만 수정 |

## 코드 표준

- 파일·폴더: kebab-case(`login-form.tsx`, `sign-up-success/`). 컴포넌트: PascalCase. 훅: `use` + camelCase.
- 같은 폴더 밖의 import는 `@/` 별칭을 쓴다. `../../` 상대 경로를 쓰지 않는다.
- **직접 작성하는 코드는 `import { cn } from "@/lib/utils"`만 쓴다.** `from "cn"` 직접 import 금지. 예외: `shadcn add` / `migrate-radix-to-base`가 생성한 `components/ui/*`는 `from "cn"`을 그대로 둔다.
- Server Component를 기본으로 하고 `'use client'`는 상태·이벤트·브라우저 API가 필요한 말단 컴포넌트에만 붙인다.
- `any` 타입 금지. 배열 index를 `key`로 쓰지 않는다(순서가 바뀌는 리스트). 500줄이 넘는 컴포넌트는 분리한다.
- Effect로 파생 상태를 계산하지 않는다. Effect 안에서 동기 `setState`로 mounted 플래그를 만들지 않는다(`useSyncExternalStore` 사용).
- Cache Components는 라우트를 벗어나도 `<Activity>`로 숨길 뿐 언마운트하지 않는다. Effect에 반드시 cleanup을 쓴다.
- 포매팅은 Prettier(`.prettierrc.json`, Tailwind 클래스 정렬 플러그인)가 결정한다. 클래스 순서를 손으로 맞추지 않는다.

## Next.js 16 규칙

- `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()`는 모두 비동기다. 항상 `await` 한다.
- 라우트 props 타입은 전역 헬퍼를 쓴다: `PageProps<"/blog/[slug]">`, `LayoutProps<"/">`. 타입이 없으면 `npx next typegen`을 실행한다.
- 요청 시점 데이터(`cookies`, `headers`, `searchParams`, 캐시되지 않은 `fetch`/DB 호출)는 `<Suspense>` 경계 안에서 읽는다.
- 캐시는 `"use cache"` + `cacheLife` + `cacheTag`로 명시한다. 태그는 `posts`, `post:<slug>`, `projects`, `profile`, `settings`를 쓴다.
- `"use cache"` 함수 안에서 `cookies()`/`headers()`를 직접 읽지 않는다. 사용자별 데이터를 공유 캐시에 넣지 않는다.
- 캐시 무효화: Server Action에서 즉시 반영은 `updateTag(tag)`, 그 외는 `revalidateTag(tag, "max")`(**두 번째 인자 필수**).
- 날짜 기반 계산(경력 기간 등)은 `use cache` 함수 안에서 처리한다.
- `generateStaticParams`는 최소 1개 이상의 param을 반환한다.
- `proxy.ts`는 낙관적 리디렉션만 한다. 관리자 페이지와 Server Action마다 세션을 **다시 검증**한다. `config.runtime`은 지정하지 않는다.
- 응답 후 처리(알림 등)는 `after()`를 쓴다.

| 사용 금지                                                                                 | 대체                         |
| ----------------------------------------------------------------------------------------- | ---------------------------- |
| `export const dynamic / revalidate / fetchCache / dynamicParams / runtime`                | `use cache`, `cacheLife`     |
| `unstable_cache`, `unstable_noStore`                                                      | `use cache`                  |
| `experimental.ppr`, `experimental_ppr`, `experimental.dynamicIO`, `experimental.useCache` | `cacheComponents`            |
| `next lint`                                                                               | `npm run lint` (ESLint flat) |
| `revalidateTag(tag)` (인자 1개)                                                           | `revalidateTag(tag, "max")`  |

## 스타일링 · UI 규칙

- 테마 토큰은 `app/globals.css`에만 둔다. 새 색상은 `:root`와 `.dark`에 **oklch** 값으로 정의하고 `@theme inline`에 `--color-*`로 등록한다.
- `hsl(var(--x))`, HSL 채널 값, `@tailwind base/components/utilities` 지시문을 쓰지 않는다.
- Tailwind v4 문법만 쓴다: `shadow-xs`, `rounded-xs`, `ring-3`, `bg-linear-to-r`, `data-disabled:`, `bg-black/50`, 임의 값 `origin-(--my-var)`.
- 반경 값은 `--radius` 하나만 수정한다.
- 다크 테마가 기본이다(네이비 + 코랄 `#F26B50` 계열). 다크모드 기준은 `@custom-variant dark (&:is(.dark *))`.
- 모바일에서는 햄버거 메뉴를 쓴다. 레이아웃은 모바일 우선으로 작성한다.
- shadcn 컴포넌트는 **직접 작성하지 말고** `npx shadcn@latest add <name>`으로 추가한다. 추가 전 `.agents/skills/shadcn/` 규칙을 확인한다.
- **Base UI 규칙**: `asChild`를 쓰지 않고 `render` prop을 쓴다. button이 아닌 요소에 트리거를 붙일 때는 `nativeButton={false}`. 트리거를 `<div>`나 `<Button>`으로 한 번 더 감싸지 않는다. `data-[state=...]` 같은 Radix 셀렉터를 쓰지 않는다.
- 아이콘은 `lucide-react`만 쓴다.
- 참고 디자인의 임의 수치(고객 만족도 등)를 쓰지 않는다. 홈의 수치는 실제 데이터(경력 기간, 자격증 수, 석사 학점)에서 계산한다.

## 폼 규칙

- 기본 패턴: Server Action + `useActionState` + shadcn `Field`/`FieldGroup`. 클라이언트 검증이 복잡한 편집 폼(2차~)만 react-hook-form + zod 4를 쓴다.
- 스키마는 `lib/schemas/*.ts`의 순수 모듈 하나를 클라이언트와 서버가 공유한다. **서버에서 반드시 다시 검증한다.**
- 입력 오류는 예외가 아니라 반환값으로 돌려준다.
- Server Action은 공개 HTTP 엔드포인트다. 관리자 Action은 Action 안에서 세션을 직접 확인한다.
- 검증 오류 표시: `Field`에 `data-invalid`, 컨트롤에 `aria-invalid`를 **둘 다** 지정한다.
- Zod 4 문법: `z.email()`, `z.url()`, `{ error: "..." }`, `z.flattenError()`. `z.string().email()`, `{ message }` 금지.
- 연락 폼은 `useActionState` 기본 패턴에 Turnstile 토큰을 FormData로 더한다. 서버에서 siteverify로 검증하고, 실패 시 위젯을 재설정한다(토큰은 5분·1회용).

## PRD 기반 구현 규칙

- 구현 범위는 릴리스 기준이다. **1차에는 인증이 없다**: 블로그 메뉴, 푸터 관리자 링크, 홈 최신 글 영역을 숨긴다.
- 콘텐츠는 모두 DB에 둔다. 1차는 시드 스크립트로 입력하고 `resume/*.md` 원본은 저장소 밖(`~/Documents/40_Personal/06_Resume/`)에 둔다. 저장소에는 정제된 시드 데이터만 둔다.
- **노출·저장 금지 정보**: 연봉, 자격증 등록번호, 퇴직사유, 고등학교 정보, 생년월일·주소. 데이터 모델에도 넣지 않는다.
- 공개 연락처는 GitHub와 이메일만이다.
- MDX 렌더링: `next-mdx-remote-client`(RSC)를 쓴다. import/export를 끄고, `{...}` 표현식 제거 플러그인과 허용 컴포넌트 맵(한 파일에 고정)을 함께 적용한다. 프로젝트 상세(F004)와 글 상세(F007)는 **같은 렌더러**를 쓴다. `next-mdx-remote`, `@next/mdx`는 쓰지 않는다.
- 공개 상세 페이지는 발행·공개된 항목만 조회한다. 임시저장·비공개·없는 항목은 접근을 차단한다.
- 관리자: Better Auth GitHub 로그인. 허용 계정은 **GitHub 숫자 user id**를 환경 변수로 지정한다(username 금지).
- DB: Drizzle + postgres-js. 런타임은 트랜잭션 풀러(6543, `prepare: false`, 모듈 스코프 클라이언트 1개), 마이그레이션은 세션 풀러(5432). 연결 문자열을 분리한다.
- 이력서: 1차는 정적 파일. 3차 교체 시 같은 경로에 덮어쓰지 않고 파일명에 버전을 붙여 올린 뒤 `resumeFilePath`를 갱신한다. 파일이 없으면 이력서 버튼을 숨긴다.
- Supabase 일시정지 방지용 Vercel Cron(일 1회 가벼운 쿼리)을 유지한다.
- 2차 블로그 이미지는 외부 URL과 `public/` 이미지만 쓴다(Storage는 3차).

## 파일 연동 규칙

| 변경 대상                         | 함께 수정할 파일                                                                        |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| 기능 범위·릴리스·데이터 모델 변경 | `docs/PRD.md` → `docs/ROADMAP.md`(기능 ID ↔ Task 매핑표) → 필요 시 `docs/LEANCANVAS.md` |
| Task 완료                         | `docs/ROADMAP.md`에 ✅ 표시와 `테스트 결과` 줄 기록                                     |
| 새 환경 변수 추가                 | `.env.sample`(값 없이 키와 설명만). `.env`는 읽지도 커밋하지도 않는다                   |
| 폴더 구조·별칭 변경               | `docs/guides/project-structure.md`, `tsconfig.json`, `components.json`                  |
| `next.config.ts` 옵션 변경        | `docs/guides/nextjs-16.md`, `CLAUDE.md`(아키텍처 절)                                    |
| 테마 토큰 추가                    | `app/globals.css`의 `:root`, `.dark`, `@theme inline` 세 곳                             |
| npm 스크립트·훅 변경              | `CLAUDE.md`(명령어 절), `.husky/*`, `.github/workflows/ci.yml`                          |
| 스택·라이브러리 추가              | `docs/PRD.md`(기술 스택 절), 해당 `docs/guides/*.md`의 "현재 상태" 문단                 |
| 이 파일의 규칙을 바꾸는 변경      | `shrimp-rules.md`                                                                       |

- `AGENTS.md`의 `BEGIN:nextjs-agent-rules` ~ `END` 블록은 `next dev`가 관리한다. 지우거나 직접 고치지 않는다. 변경이 생기면 작업 커밋에 함께 포함한다.
- `.claude/skills/shadcn`, `.claude/skills/migrate-radix-to-base`는 `.agents/skills/`로의 링크다. 링크를 끊지 않는다.

## 워크플로

1. ROADMAP의 Task 명세 읽기 → 2. 관련 가이드·`node_modules/next/dist/docs/` 읽기 → 3. 구현 → 4. `npm run check` → 5. `npm run build` → 6. ROADMAP 갱신 → 7. 중단하고 지시를 기다린다.

- **Task 하나를 끝낼 때마다 멈춘다.** 다음 Task를 자동으로 시작하지 않는다.
- 테스트 러너가 없다. 정적 검증은 `npm run check`와 `npm run build`이고, 동작 확인은 브라우저 수동 확인이다. API·비즈니스 로직 Task는 정상/오류/엣지 시나리오를 `도구 → 입력 → 기대 결과` 형식으로 ROADMAP에 적고 검증한다.
- 외부 서비스(Resend, Turnstile, GitHub OAuth, Supabase)는 테스트 키·계정으로 검증한다.
- 개발 서버: `npm run dev`. 기본 포트가 사용 중이면 실행 중인 서버를 재사용한다.

## Git 규칙

- 커밋 메시지는 한국어 컨벤셔널 형식 `타입: 제목`(commitlint가 강제). 타입: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `perf`, `chore`. 제목은 명사형, 마침표 없음.
- 한 커밋에 한 논리적 변경만 담는다. 파일은 이름으로 지정해 `git add` 한다(`git add -A`, `git add .` 금지).
- Claude가 만든 커밋 끝에 세션이 지정한 `Co-Authored-By` 트레일러를 붙인다.
- hook 실패 시 원인을 고치고 **새 커밋**을 만든다. `--amend`로 우회하지 않는다.
- `push`는 사용자가 요청할 때만 한다. pre-push는 `npm run check`를 실행한다.
- 브랜치·커밋·PR 작업은 `.claude/skills/git-branch`, `git-commit`, `git-pr` 스킬을 쓴다.

## AI 의사결정 기준

| 상황                                          | 결정                                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------------- |
| 요구가 PRD와 충돌                             | PRD를 우선한다. PRD 변경이 필요하면 코드 전에 PRD 수정을 제안한다               |
| 기능이 어느 릴리스인지 불명확                 | PRD 「릴리스 구분」 표를 따른다. 상위 릴리스 기능을 앞당겨 구현하지 않는다      |
| 컴포넌트를 `ui/`와 `<domain>/` 중 어디에 둘지 | shadcn CLI로 추가한 것만 `ui/`. 나머지는 `<domain>/` 또는 라우트 `_components/` |
| `'use client'`를 붙일지                       | 상태·이벤트·브라우저 API가 없으면 붙이지 않는다                                 |
| 라이브러리가 필요해 보임                      | PRD 기술 스택에 있는 것을 쓴다. 없으면 추가 전 사용자에게 확인한다              |
| Next.js 동작이 불확실                         | 추측하지 말고 `node_modules/next/dist/docs/`를 확인한다                         |
| 가이드 문서와 번들 문서가 다름                | 번들 문서를 따르고 가이드를 갱신한다                                            |
| PRD에 없는 콘텐츠(수치·성과·논문 정보)가 필요 | 만들어 채우지 않는다. 자리표시자를 두고 사용자에게 제공을 요청한다              |

## 금지 사항

- **`.env`를 읽거나 커밋하지 않는다**(`.claude/settings.json`이 `Read(./.env)`를 거부한다). 비밀 값을 코드·문서에 쓰지 않는다.
- `git push --force`, `git push -f`, `git reset --hard`, `rm -rf`를 실행하지 않는다(settings deny 목록).
- 임의 수치·가짜 성과·가짜 후기를 UI나 시드 데이터에 넣지 않는다.
- `components/ui/*`를 손으로 새로 작성하거나 shadcn 재생성 시 덮어쓰일 수정을 하지 않는다. 커스터마이징은 사용하는 쪽에서 `className`/`variant`로 한다.
- `shrimp_data/`, `.playwright-mcp`, `next-env.d.ts`, `*.tsbuildinfo`를 커밋하지 않는다.
- 라이트 모드 전환, 영문 지원, 댓글, 검색, RSS, 문의 내역 열람 화면, 사회활동 노출은 MVP 범위 밖이다. 구현하지 않는다.
- 이 파일을 갱신할 때는 최소 변경 원칙을 따르고, 코드가 바뀌어 낡은 규칙은 수정·삭제한다.

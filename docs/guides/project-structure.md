# 프로젝트 구조 가이드

이 문서는 `hkoikoi-archive`의 실제 폴더 구조와 네이밍 컨벤션을 정의합니다.
이 프로젝트는 `src/` 디렉터리를 쓰지 않고 루트에 `app/`, `components/`, `lib/`를 둡니다.

## 현재 스택

| 항목      | 버전 / 설정                                                               |
| --------- | ------------------------------------------------------------------------- |
| Next.js   | 16.4.2 (App Router, Turbopack, `cacheComponents` + `partialPrefetching`)  |
| React     | 19.3                                                                      |
| Tailwind  | 4.3 (`@tailwindcss/turbopack` 로더, PostCSS 설정 없음)                    |
| shadcn/ui | `base-nova` 스타일, **Base UI**(`@base-ui/react`) 기반                    |
| 유틸리티  | `cn` 패키지, `class-variance-authority`, `lucide-react`, `tw-animate-css` |
| 도구      | ESLint 9 flat config (`eslint-config-next`), TypeScript 5                 |

아직 없는 것(필요할 때 추가): DB 연결·마이그레이션(`drizzle-orm`은 스키마용으로만 설치), 인증, 폼 라이브러리, 테마 전환(`next-themes`), `proxy.ts`, 테스트.

## 전체 구조

```
hkoikoi-archive/
├── app/                    # Next.js App Router
├── components/
│   ├── layout/             # 사이트 헤더·푸터, nav-link(client)
│   └── ui/                 # shadcn/ui 컴포넌트 (현재 button)
├── lib/
│   ├── site-config.ts      # 릴리스 플래그(features), 내비게이션, resumeUrl
│   ├── db/schema.ts        # Drizzle pgTable 10종 (연결·마이그레이션은 Task 011)
│   ├── types/              # 화면용 뷰 타입 (DB 타입과 분리)
│   ├── schemas/contact.ts  # 연락 폼 Zod 4 스키마
│   └── utils.ts            # cn() 재export
├── docs/guides/            # 개발 가이드
├── .agents/skills/         # 에이전트 스킬 (shadcn, migrate-radix-to-base)
├── .claude/                # Claude Code 에이전트·스킬·훅 설정
├── .mcp.json               # MCP 서버 (sequential-thinking, shrimp-task-manager)
├── next.config.ts          # Next.js 설정
├── components.json         # shadcn/ui 설정
├── eslint.config.mjs       # ESLint flat config
├── tsconfig.json           # TypeScript 설정 (@/* → ./*)
├── skills-lock.json        # 설치된 스킬 버전 고정
├── AGENTS.md               # 에이전트 지침 (Next.js 번들 문서 안내)
└── .env / .env.sample      # 환경 변수 (shrimp-task-manager용)
```

- `tailwind.config.ts`, `postcss.config.*`는 없습니다. Tailwind는 `next.config.ts`의 `turbopack.rules`에서 `@tailwindcss/turbopack` 로더로 연결되고, 테마는 `app/globals.css`의 `@theme inline`에서 정의합니다.
- `middleware.ts`는 만들지 않습니다. 요청 전처리가 필요하면 루트에 `proxy.ts`를 추가합니다.
- `.env`와 `shrimp_data/`는 `.gitignore` 대상입니다. 환경 변수 목록은 `.env.sample`에 유지합니다.
- `AGENTS.md`의 `next dev`가 관리하는 블록은 직접 지우지 말고 변경분을 함께 커밋합니다.

## app/ — 라우트

```
app/
├── layout.tsx          # 루트 레이아웃 (lang="ko", 메타데이터 템플릿, Geist 폰트)
├── not-found.tsx       # 매칭되지 않는 URL(/foo)과 관리자 notFound() 처리
├── globals.css         # Tailwind v4 + shadcn 테마 변수
├── favicon.ico
├── (site)/             # 공개 사이트 라우트 그룹
│   ├── not-found.tsx   # 그룹 안에서 notFound()가 던져질 때
│   ├── page.tsx        # /
│   ├── about/          # /about
│   ├── projects/       # /projects, /projects/[slug]
│   ├── credentials/    # /credentials
│   ├── blog/           # /blog, /blog/[slug] (layout.tsx가 features.blog 가드)
│   └── contact/        # /contact
└── admin/              # layout.tsx가 features.admin 가드
    ├── login/          # /admin/login
    └── (protected)/    # /admin, posts/new, posts/[id], projects/new, projects/[id]
```

파일 규칙:

- `page.tsx` 라우트의 UI, `layout.tsx` 공유 레이아웃, `route.ts` Route Handler
- `loading.tsx`, `error.tsx`, `not-found.tsx`는 필요할 때만 추가
- `params`, `searchParams`는 Promise이므로 `await` 하거나 `PageProps<'/경로'>` / `LayoutProps<'/경로'>` 헬퍼를 사용 (`app/layout.tsx`가 `LayoutProps<"/">`를 사용 중, 타입은 `npx next typegen`으로 생성)
- Cache Components가 켜져 있으므로 요청 시점 데이터를 읽는 컴포넌트는 `<Suspense>`로 감싼다 (자세한 내용은 `nextjs-16.md`)
- 라우트 세그먼트 설정 `dynamic`, `revalidate`, `fetchCache`, `runtime`은 사용하지 않는다
- 특정 라우트에서만 쓰는 컴포넌트는 해당 라우트 폴더에 둘 수 있다. 앞에 `_`를 붙인 폴더(`_components`)는 라우팅에서 제외된다
- URL에 영향을 주지 않고 레이아웃만 나누려면 Route Group `(group)`을 사용한다

## components/ — 컴포넌트

```
components/
├── ui/             # shadcn/ui 컴포넌트 (CLI로 추가, 현재 button)
└── <domain>/       # 여러 페이지가 공유하는 도메인 컴포넌트 (필요할 때 생성)
```

분류 규칙:

1. **`ui/`**: shadcn/ui 기반 순수 UI 컴포넌트. 비즈니스 로직 없이 props로 동작을 제어한다. 추가는 `npx shadcn@latest add <name>`.
2. **`components/<domain>/`**: 여러 페이지가 쓰는 도메인 컴포넌트(예: `components/layout/`). 한 페이지에서만 쓰면 라우트의 `_components/`에 둔다.
3. import 방향은 `components/ui` ← `components/<domain>` ← `app/` 단방향이다.

## lib/ — 유틸리티

```
lib/
└── utils.ts        # export { cn } from "cn"
```

- `cn()`은 `cn` 패키지(shadcn-ui/cn: clsx + tailwind-merge 대체)를 `lib/utils.ts`에서 재export 합니다. **직접 작성하는 코드는 항상 `import { cn } from "@/lib/utils"`를 사용**하고, `from "cn"`을 직접 import하지 않습니다. 구현을 교체할 때 `lib/utils.ts` 한 곳만 고치기 위함입니다.
- 예외: `shadcn add`나 `migrate-radix-to-base`가 생성한 `components/ui/*`는 `from "cn"`을 쓰며, 재생성 시 다시 덮어쓰이므로 일부러 바꾸지 않습니다.
- 스키마, 타입, 훅, 데이터 접근 코드가 생기면 `lib/schemas/`, `lib/types/`, `lib/queries/`, 루트 `hooks/`를 추가합니다 (`components.json`의 `hooks` 별칭은 `@/hooks`).
- 서버 전용 모듈은 상단에 `import "server-only"`를 두어 클라이언트 번들 유입을 막는다.

## 파일/폴더 네이밍

```bash
# 파일: kebab-case
login-form.tsx        # O
LoginForm.tsx         # X
login_form.tsx        # X

# 폴더: 소문자 kebab-case
sign-up-success/      # O
signUpSuccess/        # X
```

컴포넌트 이름은 PascalCase(`LoginForm`), 훅은 `use` 접두사 camelCase(`useToggle`)입니다.

## 경로 별칭

`tsconfig.json`의 `"@/*": ["./*"]`와 `components.json`의 aliases를 따릅니다. 루트 기준이므로 `src`가 붙지 않습니다.

| 별칭              | 실제 경로                |
| ----------------- | ------------------------ |
| `@/components`    | `./components`           |
| `@/components/ui` | `./components/ui`        |
| `@/lib`           | `./lib`                  |
| `@/lib/utils`     | `./lib/utils.ts`         |
| `@/hooks`         | `./hooks` (필요 시 생성) |

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

같은 폴더 안의 파일 외에는 상대 경로(`../../`) 대신 별칭을 사용합니다.

## 새 파일 추가 규칙

| 대상                      | 위치                                                    |
| ------------------------- | ------------------------------------------------------- |
| 새 페이지                 | `app/<경로>/page.tsx` (동적: `app/users/[id]/page.tsx`) |
| Route Handler             | `app/<경로>/route.ts`                                   |
| Server Action             | 기능 옆 `actions.ts` (파일 최상단에 `"use server"`)     |
| 공통 UI                   | `components/ui/` (shadcn CLI)                           |
| 한 페이지 전용 컴포넌트   | 해당 라우트 폴더의 `_components/`                       |
| 여러 페이지 공용 컴포넌트 | `components/<domain>/`                                  |
| 정적 파일                 | `public/`                                               |
| 환경 변수                 | `.env` + `.env.sample`에 키 이름 추가                   |

## 코드 조직 원칙

### import 순서

```tsx
// 1. 외부 라이브러리
import { Suspense } from "react";
import Link from "next/link";

// 2. 내부 모듈 (@/ 별칭)
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 3. 상대 경로
import { helper } from "./helper";
```

### export 규칙

- `page.tsx`, `layout.tsx`, `route.ts` 등 Next.js 파일 규칙은 default export(또는 지정된 이름) 필수
- 그 외 컴포넌트는 named export를 사용하고, 같은 컴포넌트를 default와 named로 동시에 내보내지 않는다

### 크기와 책임

- 한 파일은 하나의 주요 책임만 가진다. 300줄을 넘으면 분리를 고려한다.
- 4단계 이상 깊은 중첩, `misc/`·`common/`·`shared/` 같은 모호한 폴더명은 피한다.

## 체크리스트

- [ ] 기능에 맞는 위치(`app/`, `components/`, `lib/`)에 배치
- [ ] kebab-case 파일명, PascalCase 컴포넌트명
- [ ] `@/` 별칭 사용, `src/` 경로 쓰지 않기
- [ ] `cn`은 `@/lib/utils`에서 import (`components/ui/*` 생성 코드는 예외)
- [ ] 요청 시점 데이터를 읽는 컴포넌트에 `Suspense` 경계 설정
- [ ] `npm run check` 통과

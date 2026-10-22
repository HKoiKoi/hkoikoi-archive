# Next.js 16 개발 지침

이 문서는 이 프로젝트(Next.js 16.4.2 / React 19.3 / Tailwind CSS 4)에서 따라야 할 Next.js 규칙을 정리합니다.
버전별 동작은 기억에 의존하지 말고 `node_modules/next/dist/docs/`의 번들 문서를 먼저 확인하세요.

## 현재 환경

| 항목                | 버전 / 설정                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| Next.js             | 16.4.2 (App Router 전용, Turbopack 기본)                                |
| React               | 19.3                                                                    |
| Node.js             | 20.9 이상 (필수)                                                        |
| TypeScript          | 5.1 이상, `strict`                                                      |
| Cache Components    | `next.config.ts`에서 `cacheComponents: true`                            |
| Partial Prefetching | `partialPrefetching: true` (`cacheComponents` 필수)                     |
| 스타일              | `turbopack.rules`의 `*.css` → `@tailwindcss/turbopack` 로더             |
| 에이전트 피드백     | `experimental.agentFeedback: true` (`next dev`가 `AGENTS.md` 블록 관리) |
| 린트                | ESLint 9 flat config (`eslint`), `next lint`는 제거됨                   |

## 필수 규칙

### 1. App Router만 사용

`app/` 디렉터리만 사용합니다. `pages/`, `getServerSideProps`, `getStaticProps`는 사용하지 않습니다.

### 2. Server Components 우선

모든 컴포넌트는 기본적으로 Server Component입니다. 상태, 이벤트 핸들러, 브라우저 API가 필요한 말단 컴포넌트에만 `'use client'`를 붙입니다.

```tsx
// 서버 컴포넌트: 데이터는 서버에서 가져오고 상호작용만 클라이언트로 분리
export default async function Page() {
  const stats = await getStats();
  return <InteractiveChart data={stats} />;
}
```

```tsx
// components/interactive-chart.tsx
"use client";

import { useState } from "react";

export function InteractiveChart({ data }: { data: Stat[] }) {
  const [range, setRange] = useState("week");
  return <Chart data={data} range={range} />;
}
```

### 3. Request API는 항상 비동기

Next.js 16에서는 동기 접근이 완전히 제거되었습니다. `cookies()`, `headers()`, `draftMode()`, `params`, `searchParams` 모두 `await`가 필요합니다.
타입은 `npx next typegen`이 생성하는 전역 헬퍼(`PageProps`, `LayoutProps`, `RouteContext`)를 사용합니다. `app/layout.tsx`의 `LayoutProps<"/">`가 예시입니다.

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const { q } = await props.searchParams;
  return (
    <h1>
      {slug} / {q}
    </h1>
  );
}
```

`opengraph-image`, `twitter-image`, `icon`, `apple-icon`의 `params`와 `id`, `sitemap`의 `id`도 Promise입니다.

### 4. `middleware` 대신 `proxy`

요청 전처리가 필요하면 프로젝트 루트에 `proxy.ts`를 만들고 함수 이름을 `proxy`로 export 합니다. Node.js 런타임에서 실행되며 현재는 사용하지 않습니다.

```ts
// proxy.ts
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

- 모듈 전역 변수나 공유 모듈 상태에 의존하지 않습니다. 정보 전달은 헤더, 쿠키, rewrite, redirect, URL로 합니다.
- `config.runtime`은 지정하지 않습니다.
- Proxy는 느린 데이터 패칭이나 전체 인증·인가 용도가 아닙니다. 낙관적 검사(redirect 등)에만 씁니다 (`01-app/01-getting-started/16-proxy.md`).

## Cache Components

이 프로젝트는 `cacheComponents: true`, `partialPrefetching: true`입니다. 데이터 패칭은 **기본이 동적**이고, 캐시는 `use cache`로 명시적으로 선택합니다. 정적 셸(static shell)이 먼저 응답되고 동적 부분이 스트리밍됩니다.

- `partialPrefetching`은 `cacheComponents` 없이는 설정 검증에서 에러가 납니다. 두 옵션은 함께 유지합니다.
- `<Link>`는 기본적으로 라우트의 App Shell(정적 + URL과 무관한 캐시 콘텐츠)만 prefetch 합니다. 더 많이 가져와야 하는 링크에만 `<Link prefetch={true}>`를 씁니다 (`01-app/02-guides/adopting-partial-prefetching.md`).
- `cacheComponents`는 Node.js 런타임이 필요하며 `runtime` 세그먼트 설정을 지원하지 않습니다.

### 동적 데이터는 Suspense 안에서

`cookies()`, `headers()`, `searchParams`, `params`(미리 생성하지 않은 값), 캐시되지 않은 `fetch`/DB 호출은 요청 시점 데이터입니다. `<Suspense>` 경계 밖에서 접근하면 빌드/개발 중 에러가 납니다.

```tsx
import { Suspense } from "react";
import { cookies } from "next/headers";

async function Greeting() {
  const theme = (await cookies()).get("theme")?.value ?? "system";
  return <p>현재 테마: {theme}</p>;
}

export default function Page() {
  return (
    <Suspense fallback={<p>불러오는 중...</p>}>
      <Greeting />
    </Suspense>
  );
}
```

### `use cache`로 캐시 선택

```tsx
import { cacheLife, cacheTag } from "next/cache";

async function getPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  return db.posts.findMany();
}
```

- `use cache` 함수는 인자로 받은 값과 클로저가 캐시 키가 됩니다. **함수 안에서 `cookies()`/`headers()`를 직접 읽지 않습니다.** 필요한 값은 인자로 넘기거나, 사용자별 캐시는 `use cache: private`을 검토합니다.
- 사용자별 데이터는 공유 캐시에 넣지 않습니다.

### 캐시 무효화

| API                         | 사용처                       | 동작                                                              |
| --------------------------- | ---------------------------- | ----------------------------------------------------------------- |
| `updateTag(tag)`            | Server Action                | 즉시 만료, 같은 요청에서 최신 데이터를 읽음 (read-your-writes)    |
| `revalidateTag(tag, "max")` | Server Action, Route Handler | stale-while-revalidate. **두 번째 인자 필수** (생략은 deprecated) |
| `refresh()`                 | Server Action                | 캐시되지 않은 데이터만 갱신                                       |
| `revalidatePath(path)`      | Server Action, Route Handler | 경로 단위 무효화                                                  |

```ts
"use server";

import { updateTag } from "next/cache";

export async function updateProfile(formData: FormData) {
  await saveProfile(formData);
  updateTag("profile"); // 폼 제출 직후 최신 값을 보여줘야 할 때
}
```

### 더 이상 쓰지 않는 것

Cache Components에서는 아래 설정/API를 쓰지 않습니다.

| 기존                                                      | 대체                                          |
| --------------------------------------------------------- | --------------------------------------------- |
| `export const dynamic = "force-dynamic" / "force-static"` | 기본이 동적. 정적으로 만들 부분은 `use cache` |
| `export const revalidate = 60`                            | `cacheLife`                                   |
| `export const fetchCache`, `dynamicParams`                | 사용 불가                                     |
| `export const runtime = "edge"` (및 `"nodejs"`)           | 사용 불가 (Node.js 런타임 고정)               |
| `experimental_ppr`, `experimental.ppr`                    | 제거됨 (PPR이 기본 동작)                      |
| `unstable_cache`                                          | `use cache`                                   |
| `unstable_noStore`                                        | 불필요 (기본이 동적)                          |
| `experimental.dynamicIO`, `experimental.useCache`         | `cacheComponents`                             |

> `generateStaticParams`는 최소 1개 이상의 param을 반환해야 합니다.

### 네비게이션 시 상태 보존

Cache Components에서는 라우트를 벗어나도 언마운트되지 않고 React `<Activity>`로 숨김 처리됩니다. 이전 페이지의 폼 입력과 펼침 상태가 유지되며, 숨겨진 동안 Effect는 정리(cleanup)됩니다. Effect에서 구독/타이머를 쓴다면 cleanup을 반드시 작성하세요.

## 권장 사항

### Streaming

느린 영역만 `Suspense`로 감싸고, 빠른 영역은 바로 렌더링합니다.

```tsx
export default function DashboardPage() {
  return (
    <>
      <h1>대시보드</h1>
      <Suspense fallback={<ChartSkeleton />}>
        <SlowChart />
      </Suspense>
    </>
  );
}
```

### `after()`로 비블로킹 작업

응답 후에 실행할 로깅/알림은 `after`를 사용합니다.

```ts
import { after } from "next/server";

export async function POST(request: Request) {
  const result = await process(await request.json());
  after(async () => {
    await sendAnalytics(result);
  });
  return Response.json({ id: result.id });
}
```

### 인증 실패 응답

`unauthorized()` / `forbidden()`은 `next/navigation`에서 import하며 `next.config.ts`에 `authInterrupts: true`가 필요합니다 (현재 꺼져 있음). 사용 전에 `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/unauthorized.md`를 확인하세요. 인증 구현은 `01-app/02-guides/authentication-with-cache-components.md`를 먼저 읽습니다.

### Typed Routes

`next.config.ts`에 `typedRoutes: true`를 설정하면 `<Link href>`가 존재하는 경로만 허용합니다. 현재는 켜져 있지 않으며 켜면 `npx next typegen`으로 타입을 생성합니다.

### 이미지 / 폰트

- `next/image` 기본값 변경: `minimumCacheTTL` 4시간, `imageSizes`에서 16 제거, `qualities` 기본값 변경, 쿼리 스트링이 있는 로컬 이미지는 `images.localPatterns` 설정 필요. 상세는 `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`의 `next/image` 절을 참고하세요.
- 폰트는 `next/font/google`을 사용합니다. `app/layout.tsx`가 Geist / Geist Mono를 `--font-geist-sans`, `--font-geist-mono` 변수로 로드하고, `globals.css`의 `--font-mono`가 이를 참조합니다.

## 빌드와 설정

- `next dev`, `next build` 모두 Turbopack이 기본입니다. `--turbopack` 플래그를 붙이지 않습니다.
- Turbopack 설정은 최상위 `turbopack` 옵션입니다 (`experimental.turbo`는 제거됨). 이 프로젝트는 여기서 Tailwind 로더를 연결합니다.
- 커스텀 `webpack` 설정이 있으면 `next build`가 실패합니다. 필요하면 `--webpack`으로 명시적으로 선택합니다.
- React Compiler를 쓰려면 `reactCompiler: true`와 `babel-plugin-react-compiler`가 필요합니다. 현재는 꺼져 있습니다.

```ts
// next.config.ts (현재)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
```

## 금지 사항

```tsx
// 금지: 상태/이벤트가 없는데 'use client'
"use client";
export default function Title({ title }: { title: string }) {
  return <h1>{title}</h1>;
}
```

- 금지: `middleware.ts` 신규 생성, 동기식 `params`/`cookies()` 접근, `next lint` 사용
- 금지: `use cache` 안에서 요청 시점 API 직접 호출
- 금지: Client Component에서 서버 전용 모듈 import
- 금지: `partialPrefetching` 없이 `cacheComponents`만 두기 (경고 발생)

## 점검 명령

`package.json`의 스크립트는 `dev`, `build`, `start`, `lint`입니다.

```bash
npm run lint                 # ESLint (eslint)
npm run typecheck            # 타입 체크
npx next typegen             # PageProps/LayoutProps/RouteContext 타입 생성
npm run build                # 프로덕션 빌드 (Cache Components 검증 포함)
```

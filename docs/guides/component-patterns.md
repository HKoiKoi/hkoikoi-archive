# 컴포넌트 패턴 가이드

이 문서는 Next.js 16 + React 19.3 + shadcn/ui(Base UI) 환경에서 재사용 가능한 컴포넌트를 작성하는 패턴을 정리합니다.
서버/클라이언트 경계와 캐싱 규칙은 `nextjs-16.md`, 스타일은 `styling-guide.md`, 폼은 `forms-react-hook-form.md`를 함께 참고하세요.

## 기본 설계 원칙

### 단일 책임

한 컴포넌트는 하나의 명확한 역할만 맡습니다. 아바타 + 상태 + 통계 + 액션이 한 곳에 섞이면 분리합니다.

```tsx
import { cn } from "@/lib/utils";

export function UserStatus({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      role="status"
      aria-label={isOnline ? "온라인" : "오프라인"}
      className={cn(
        "size-3 rounded-full",
        isOnline ? "bg-chart-2" : "bg-muted-foreground",
      )}
    />
  );
}
```

### 컴포지션 우선

상속 대신 `children`과 슬롯 컴포넌트로 조합합니다. shadcn의 `Card`, `Dialog` 같은 컴파운드 구조가 기준입니다 (`npx shadcn@latest add card`).

```tsx
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>내용</CardContent>
</Card>
```

## Server vs Client Components

### 기본은 Server Component

데이터 패칭, 서버 전용 모듈, SEO가 필요한 UI는 Server Component로 둡니다.
`cacheComponents`가 켜져 있으므로 **요청 시점 데이터를 읽는 컴포넌트는 `<Suspense>`로 감싸고, 데이터를 읽는 쪽을 Suspense 안쪽 컴포넌트로 분리**합니다.

```tsx
// app/posts/page.tsx
import { Suspense } from "react";

async function PostList() {
  const res = await fetch("https://example.com/api/posts"); // 캐시하지 않으면 요청 시점 데이터
  const posts: { id: string; title: string }[] = await res.json();
  return (
    <ul className="grid gap-2">
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <PostList />
    </Suspense>
  );
}
```

페이지 컴포넌트 안에서 `await`한 뒤 그 결과를 `<Suspense>` 안의 자식에게 넘기면 Suspense가 의미가 없고, 경계 밖의 동적 접근은 에러가 됩니다.

### 필요한 곳만 Client Component

상태, 이벤트 핸들러, 브라우저 API, Context 소비가 필요한 말단 컴포넌트에만 `'use client'`를 붙입니다. 파일 최상단에 선언하고, 서버에서 받은 데이터는 props로 전달합니다.

```tsx
// components/like-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LikeButton({ initialLiked }: { initialLiked: boolean }) {
  const [liked, setLiked] = useState(initialLiked);
  return (
    <Button
      variant="outline"
      aria-pressed={liked}
      onClick={() => setLiked((v) => !v)}
    >
      {liked ? "좋아요 취소" : "좋아요"}
    </Button>
  );
}
```

- Client Component에서 서버 전용 모듈을 import하지 않는다. 서버 전용 코드가 클라이언트로 새는 것이 걱정되면 해당 모듈 상단에 `import "server-only"`를 둔다.
- `'use client'` 컴포넌트가 import하는 모듈은 모두 클라이언트 번들에 포함된다. 서버 컴포넌트는 `children`/props로 끼워 넣을 수 있다.
- shadcn 컴포넌트는 대부분 `"use client"` 없이도 쓸 수 있지만, 상태를 쓰는 Base UI 기반 컴포넌트(`dialog`, `select` 등)는 생성된 파일에 이미 지시어가 들어 있다. 직접 지시어를 추가하거나 제거하지 않는다.

### 동적 라우트 컴포넌트의 params

`params`와 `searchParams`는 Promise입니다. `PageProps` 헬퍼를 사용합니다 (`npx next typegen`).

```tsx
export default async function Page(props: PageProps<"/products/[id]">) {
  const { id } = await props.params;
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductInfo id={id} />
    </Suspense>
  );
}
```

## React 19 패턴

### 폼 상태: `useActionState`와 `useFormStatus`

```tsx
"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateName } from "./actions";

export function NameForm() {
  const [state, formAction, isPending] = useActionState(updateName, {
    message: "",
  });
  return (
    <form action={formAction} className="grid gap-3">
      <Input name="name" required />
      <Button type="submit" disabled={isPending}>
        {isPending ? "저장 중..." : "저장"}
      </Button>
      {state.message && <p role="status">{state.message}</p>}
    </form>
  );
}
```

`Input`은 `npx shadcn@latest add input`으로 추가합니다. 폼 구성 규칙은 `forms-react-hook-form.md`를 참고하세요.

### 낙관적 업데이트: `useOptimistic`

```tsx
"use client";

import { useOptimistic, useTransition } from "react";
import { cn } from "@/lib/utils";

type Todo = { id: string; title: string; pending?: boolean };

export function TodoList({
  todos,
  addTodo,
}: {
  todos: Todo[];
  addTodo: (title: string) => Promise<void>;
}) {
  const [optimistic, addOptimistic] = useOptimistic(
    todos,
    (current, title: string) => [
      ...current,
      { id: crypto.randomUUID(), title, pending: true },
    ],
  );
  const [, startTransition] = useTransition();

  return (
    <>
      <ul>
        {optimistic.map((t) => (
          <li key={t.id} className={cn(t.pending && "opacity-50")}>
            {t.title}
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          startTransition(async () => {
            addOptimistic("새 항목");
            await addTodo("새 항목");
          })
        }
      >
        추가
      </button>
    </>
  );
}
```

### `ref`는 일반 prop

React 19에서는 함수 컴포넌트가 `ref`를 prop으로 직접 받습니다. `forwardRef`는 쓰지 않습니다. 생성된 `components/ui/button.tsx`도 `forwardRef` 없이 Base UI 프리미티브에 props를 그대로 넘깁니다.

```tsx
function TextField({
  ref,
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      ref={ref}
      className={cn("h-9 rounded-md border px-3", className)}
      {...props}
    />
  );
}
```

### 그 외

- `use(promise)` / `use(context)`: Client Component에서 서버가 넘긴 Promise를 읽을 때 사용 (Suspense 필요).
- `<Context value={...}>`: React 19에서는 `<Context.Provider>` 대신 Context를 직접 Provider로 쓸 수 있다.
- `useEffectEvent`: Effect 안에서 최신 props/state를 읽되 의존성에는 넣고 싶지 않은 로직에 사용.
- `<Activity>`: Cache Components 네비게이션에서 라우트가 숨겨져도 상태가 유지된다. Effect cleanup을 반드시 작성한다.
- 메타데이터 태그(`<title>`, `<meta>`)는 컴포넌트에서 직접 렌더링할 수 있지만, 이 프로젝트에서는 `metadata` / `generateMetadata`를 사용한다 (`app/layout.tsx` 참고).

## Props 설계

### Props 타입은 프리미티브/DOM 타입을 확장

DOM 요소를 감싸면 `React.ComponentProps<"tag">`, Base UI 프리미티브를 감싸면 `<Primitive>.Props` 타입을 씁니다 (`components/ui/button.tsx`는 `ButtonPrimitive.Props & VariantProps<typeof buttonVariants>`).

```tsx
type AlertProps = React.ComponentProps<"div"> & {
  tone?: "info" | "danger";
};

export function Alert({ tone = "info", className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border p-4 text-sm",
        tone === "danger" && "border-destructive text-destructive",
        className,
      )}
      {...props}
    />
  );
}
```

- 네이티브 속성(`onClick`, `disabled`, `aria-*`)을 직접 선언하지 말고 위 타입으로 받는다.
- prop이 7~8개를 넘거나 boolean prop이 여럿이면 컴포지션으로 나눈다.
- 기본값은 구조 분해에서 지정한다.

### `render` prop (Base UI)

이 프로젝트의 shadcn은 Radix가 아니라 **Base UI**입니다. `asChild`는 없고, 다른 요소(예: `Link`)에 스타일/동작을 입히려면 `render` prop을 사용합니다.

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

<Button render={<Link href="/about" />} nativeButton={false}>
  소개
</Button>;
```

- `render`로 `<button>`이 아닌 요소(`<a>`, `Link`, `<span>`)를 렌더링하면 **`nativeButton={false}`** 를 함께 지정한다.
- 트리거 컴포넌트도 같은 방식이다: `<DialogTrigger render={<Button variant="outline" />}>열기</DialogTrigger>`. 트리거를 별도의 `<div>`나 `<Button>`으로 감싸지 않는다.
- `render`에는 요소 또는 `(props, state) => ReactElement` 함수를 줄 수 있다.
- Radix 코드(`asChild`, `data-[state=open]`)를 가져올 때는 `.agents/skills/shadcn/rules/base-vs-radix.md`와 `migrate-radix-to-base` 스킬을 따른다.

### 다형성 컴포넌트: `useRender`

직접 만드는 컴포넌트가 `render`를 지원해야 하면 Base UI의 `useRender`를 씁니다 (Radix의 `Slot` 대응).

```tsx
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/utils";

interface TagProps extends useRender.ComponentProps<"span"> {}

export function Tag({ render, className, ...props }: TagProps) {
  return useRender({
    defaultTagName: "span",
    render,
    props: mergeProps<"span">(
      { className: cn("rounded-md bg-muted px-2 py-0.5 text-xs", className) },
      props,
    ),
  });
}
```

`as` prop 방식은 타입이 복잡해지므로 만들지 않습니다.

## 재사용 패턴

### 변형: cva

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const panelVariants = cva("rounded-lg border bg-card text-card-foreground", {
  variants: {
    size: { sm: "p-4", md: "p-6", lg: "p-8" },
    tone: { default: "border-border", ghost: "border-transparent shadow-none" },
  },
  defaultVariants: { size: "md", tone: "default" },
});

type PanelProps = React.ComponentProps<"div"> &
  VariantProps<typeof panelVariants>;

export function Panel({ size, tone, className, ...props }: PanelProps) {
  return (
    <div className={cn(panelVariants({ size, tone }), className)} {...props} />
  );
}
```

### 컴파운드 컴포넌트

상태를 공유하는 컴포넌트 묶음은 Context로 연결합니다. 소비 훅에서 Provider 유무를 검사합니다.

```tsx
"use client";

import { createContext, use, useState } from "react";

type DisclosureContextValue = { open: boolean; toggle: () => void };
const DisclosureContext = createContext<DisclosureContextValue | null>(null);

function useDisclosure() {
  const ctx = use(DisclosureContext);
  if (!ctx) throw new Error("Disclosure 컴포넌트 안에서만 사용할 수 있습니다");
  return ctx;
}

export function Disclosure({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DisclosureContext value={{ open, toggle: () => setOpen((v) => !v) }}>
      {children}
    </DisclosureContext>
  );
}

export function DisclosureTrigger({ children }: { children: React.ReactNode }) {
  const { open, toggle } = useDisclosure();
  return (
    <button aria-expanded={open} onClick={toggle}>
      {children}
    </button>
  );
}

export function DisclosureContent({ children }: { children: React.ReactNode }) {
  return useDisclosure().open ? <div>{children}</div> : null;
}
```

접근성이 중요한 복합 위젯(Tabs, Dialog, Accordion, Select, Menu 등)은 직접 만들지 말고 Base UI 기반 shadcn 컴포넌트를 추가합니다 (`npx shadcn@latest add tabs`). 위 예시는 패턴 설명용입니다.

### 커스텀 훅

```tsx
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  return {
    value,
    toggle: () => setValue((v) => !v),
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
  };
}
```

`useCallback`으로 모든 함수를 감쌀 필요는 없습니다 (아래 성능 절 참고). 훅 파일은 루트 `hooks/`에 둡니다 (`@/hooks`).

## 데이터 패칭 위치

| 상황                           | 방법                                            |
| ------------------------------ | ----------------------------------------------- |
| 초기 렌더에 필요한 데이터      | Server Component에서 직접 조회 + `Suspense`     |
| 반복되는 공개 데이터           | `use cache` + `cacheLife` / `cacheTag`          |
| 사용자 변경 (폼 제출)          | Server Action + `useActionState`                |
| 브라우저 전용 실시간/반복 조회 | Client Component + SWR/TanStack Query (도입 시) |

`useEffect` 안에서 `fetch` + `useState`로 로딩/에러를 직접 관리하는 `DataFetcher` 류의 render-props 컴포넌트는 만들지 않습니다. 서버 패칭 또는 Suspense + `use()`를 사용하세요.

## 성능

- **React Compiler**: 현재 `reactCompiler` 옵션은 꺼져 있습니다. 켜면 컴파일러가 메모이제이션을 자동화하므로 수동 `memo`/`useMemo`/`useCallback`은 대부분 불필요합니다. 켜기 전에는 측정으로 병목이 확인된 곳에만 사용합니다.
- **지연 로딩**: 클라이언트 전용 무거운 컴포넌트는 `next/dynamic`을 사용합니다.

```tsx
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/chart"), {
  loading: () => <div className="h-64 animate-pulse rounded-md bg-muted" />,
});
```

- **긴 리스트**: 수백 개 이상이면 가상화 라이브러리(`@tanstack/react-virtual` 등)를 검토합니다. 라이브러리 API는 버전마다 다르므로 도입 시 최신 문서를 확인합니다.
- **props 안정성**: 컴파일러가 꺼진 상태에서 `memo`된 자식에게 인라인 객체/함수를 넘기면 메모이제이션이 무효화됩니다.
- **아이콘**: `lucide-react`는 필요한 아이콘만 named import 합니다.

## 타입 안전성

### 제네릭 컴포넌트

```tsx
type SelectProps<T> = {
  options: T[];
  value?: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getKey: (option: T) => string;
};

export function NativeSelect<T>({
  options,
  value,
  onChange,
  getLabel,
  getKey,
}: SelectProps<T>) {
  return (
    <select
      value={value ? getKey(value) : ""}
      onChange={(e) => {
        const next = options.find((o) => getKey(o) === e.target.value);
        if (next) onChange(next);
      }}
    >
      {options.map((o) => (
        <option key={getKey(o)} value={getKey(o)}>
          {getLabel(o)}
        </option>
      ))}
    </select>
  );
}
```

### 판별 유니온 props

서로 배타적인 props는 조건부 제네릭보다 판별 유니온이 단순합니다.

```tsx
type ActionProps =
  { loading: true; onClick?: never } | { loading?: false; onClick: () => void };
```

## 안티패턴

```tsx
// props drilling이 3단계 이상 → Context 또는 컴포지션으로 해소
// 500줄이 넘는 컴포넌트 → 분리
// 의미 없는 래퍼 <div>만 반환하는 컴포넌트
// 이벤트 핸들러/상태가 없는데 'use client'
// any 타입 props
// 배열 index를 key로 사용 (순서가 바뀌는 리스트)
// useEffect로 파생 상태 계산 (렌더 중 계산하거나 useMemo 사용)
// Effect 안에서 동기 setState로 mounted 플래그 설정 (useSyncExternalStore 사용)
// asChild 사용 (Base UI에서는 render)
// 트리거를 <div>나 <Button>으로 한 번 더 감싸기
```

## 체크리스트

**설계**

- [ ] 단일 책임, 컴포지션 활용
- [ ] 네이티브 props는 `React.ComponentProps<"tag">` 또는 프리미티브 `Props`로 확장

**Server/Client**

- [ ] Server Component 우선, `'use client'`는 말단에만
- [ ] 요청 시점 데이터는 `Suspense` 경계 안에서 읽기
- [ ] `params`/`searchParams`는 `await`

**shadcn / Base UI**

- [ ] `asChild`가 아니라 `render`, 비-button 요소는 `nativeButton={false}`
- [ ] 복합 위젯은 `npx shadcn@latest add`로 추가

**타입 / 성능**

- [ ] Props 타입 정의, `any` 없음
- [ ] 수동 메모이제이션은 측정 후에만
- [ ] 무거운 클라이언트 컴포넌트는 `next/dynamic`

**접근성 / 품질**

- [ ] 의미 있는 HTML 태그, 필요한 ARIA 속성, 키보드 조작
- [ ] Effect cleanup 작성 (`<Activity>`로 숨겨질 때 정리됨)
- [ ] `npm run check` 통과

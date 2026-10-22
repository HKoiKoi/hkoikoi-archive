# 폼 가이드: Server Actions + shadcn Field (+ React Hook Form / Zod)

이 문서는 Next.js 16 / React 19.3 환경에서 폼을 만드는 패턴을 정리합니다.
기본은 **Server Action + `useActionState` + shadcn `Field`** 이고, 클라이언트 검증이 복잡해지면 React Hook Form(RHF)과 Zod 4를 얹습니다.

## 현재 상태

`package.json`에는 폼 관련 라이브러리가 없습니다 (`react-hook-form`, `@hookform/resolvers`, `zod` 모두 미설치). UI는 `components/ui/button.tsx`만 있습니다.

```bash
# 기본 폼에 필요한 shadcn 컴포넌트
npx shadcn@latest add field input textarea label

# RHF + Zod 검증이 필요할 때만
npm install react-hook-form @hookform/resolvers zod
```

- 폼 UI 컴포넌트를 추가하기 전에 `.agents/skills/shadcn/rules/forms.md`를 확인합니다. 이 프로젝트는 Base UI 스타일(`base-nova`)이므로 Radix 기준 예제(`asChild`, `data-[state=...]`)를 그대로 쓰지 않습니다.
- Zod는 **v4** 기준입니다 (`@hookform/resolvers` v5 이상이 Zod 4를 지원). 설치 시 최신 문서를 확인하세요.
- 인증/DB가 아직 없으므로 아래 Action 예시의 저장 로직은 자리표시자(`saveProfile`)입니다.

## 핵심 원칙

1. **스키마 하나를 클라이언트와 서버가 공유**한다 (`lib/schemas/*.ts`, `"use client"`/`"use server"` 없는 순수 모듈).
2. **서버에서 반드시 다시 검증**한다. 클라이언트 검증은 UX용이다.
3. **Server Action은 공개 HTTP 엔드포인트**다. 인증/인가가 필요하면 Action 안에서 직접 확인한다.
4. 사용자 입력 오류는 예외가 아니라 **반환값**으로 돌려준다.

## 필드 구성: `FieldGroup` + `Field`

폼 레이아웃은 `div` + `space-y-*`가 아니라 `FieldGroup` / `Field`로 구성합니다. 검증 오류는 `Field`에 `data-invalid`, 컨트롤에 `aria-invalid`를 **둘 다** 지정합니다.

```tsx
<FieldGroup>
  <Field data-invalid={!!errors.name}>
    <FieldLabel htmlFor="name">이름</FieldLabel>
    <Input id="name" name="name" aria-invalid={!!errors.name} />
    {errors.name && <FieldError>{errors.name[0]}</FieldError>}
  </Field>
</FieldGroup>
```

컨트롤 선택: 짧은 텍스트 `Input`, 여러 줄 `Textarea`, 설정용 토글 `Switch`, 폼 동의 `Checkbox`, 소수 선택지 `RadioGroup` / `ToggleGroup`, 목록 `Select` / `Combobox`.

## 스키마 정의 (Zod 4)

```ts
// lib/schemas/profile.ts
import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2, "이름은 2자 이상이어야 합니다").max(50),
  email: z.email("올바른 이메일 형식이 아닙니다"),
  terms: z.literal(true, { error: "이용약관에 동의해주세요" }),
});

export type ProfileValues = z.infer<typeof profileSchema>;
```

Zod 4 변경점:

| Zod 3                                                        | Zod 4                                            |
| ------------------------------------------------------------ | ------------------------------------------------ |
| `z.string().email()`                                         | `z.email()` (기존 방식은 deprecated)             |
| `z.string().uuid()`, `.url()`                                | `z.uuid()`, `z.url()`                            |
| `{ message: "..." }`, `required_error`, `invalid_type_error` | `{ error: "..." }` (문자열 또는 함수)            |
| `error.flatten()`, `error.format()`                          | `z.flattenError(error)`, `z.treeifyError(error)` |
| `z.boolean().refine(v => v === true)`                        | `z.literal(true, { error })`                     |

`FormData`는 모든 값이 문자열(또는 `File`)이므로 숫자/날짜는 `z.coerce.number()` 등으로 변환하고, 체크박스는 `formData.get("terms") === "on"`처럼 먼저 boolean으로 바꾼 뒤 스키마에 넘깁니다.

## Server Action

```ts
// app/profile/actions.ts
"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { profileSchema } from "@/lib/schemas/profile";

export type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // 1. 서버 검증
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    terms: formData.get("terms") === "on",
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "입력값을 확인해주세요",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // 2. 인증/인가 확인 (Action은 누구나 호출할 수 있다)
  //    인증 방식이 정해지면 여기서 세션을 검증한다.

  // 3. 변경
  try {
    await saveProfile(parsed.data); // 자리표시자: 실제 저장 로직으로 교체
  } catch {
    return { ok: false, message: "저장하지 못했습니다" };
  }

  // 4. 같은 요청에서 최신 값을 보여주려면 updateTag
  updateTag("profile");
  return { ok: true, message: "저장되었습니다" };
}
```

규칙:

- `redirect()`는 내부적으로 예외를 던지므로 `try/catch` 밖에서 호출한다.
- DB/내부 에러 메시지를 사용자에게 그대로 반환하지 않는다.
- 캐시 무효화는 Server Action에서는 `updateTag`(즉시), 지연이 허용되면 `revalidateTag(tag, "max")`를 쓴다. 두 번째 인자 없는 `revalidateTag`는 deprecated다.
- 응답 후 처리(로그, 알림)는 `after()`(`next/server`)로 넘긴다.
- Server Action은 POST로만 호출되고 Next.js가 `Origin`/`Host` 헤더를 검증하므로, 별도의 자체 CSRF 토큰을 만들지 않는다. 프록시 뒤에서 호스트가 달라지면 `serverActions.allowedOrigins`를 설정한다.
- 접근 제어는 Action 한 곳만 믿지 않고 데이터 계층에서도 한 번 더 확인한다 (`node_modules/next/dist/docs/01-app/02-guides/data-security.md`).

## 기본 패턴: `<form action>` + `useActionState`

클라이언트 검증이 필요 없다면 RHF 없이 이 패턴으로 충분합니다. JS 없이도 제출되고, 서버 검증 오류를 필드별로 보여줄 수 있습니다.

```tsx
// app/profile/_components/profile-form.tsx
"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateProfileAction, type ActionState } from "../actions";

const initialState: ActionState = { ok: false, message: "" };

export function ProfileForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.fullName}>
          <FieldLabel htmlFor="fullName">이름</FieldLabel>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={defaultName}
            autoComplete="name"
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <FieldError>{errors.fullName[0]}</FieldError>}
        </Field>

        {state.message && (
          <p
            role="status"
            className={
              state.ok
                ? "text-sm text-muted-foreground"
                : "text-sm text-destructive"
            }
          >
            {state.message}
          </p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </FieldGroup>
    </form>
  );
}
```

포인트:

- `isPending` 대신 자식 컴포넌트에서 `useFormStatus()`로 제출 버튼 상태만 구독할 수도 있다.
- React 19의 `<form action>`은 제출 후 비제어 입력을 초기화한다. 오류 후에도 입력을 유지하려면 Action이 입력값을 `state`로 되돌려주어 `defaultValue`에 사용하거나, 아래처럼 RHF로 값을 직접 관리한다.
- 성공 시 이동이 필요하면 Action에서 `redirect()` 한다 (`try/catch` 밖).
- 아이콘이 버튼 안에 있을 때는 `data-icon="inline-start"` 같은 `Button` 규칙을 따른다 (`.agents/skills/shadcn/rules/icons.md`).

## RHF를 얹는 경우 (선택)

즉각적인 필드 검증, 복잡한 의존 필드, 다단계 폼이 필요할 때 사용합니다. 검증 스키마는 서버와 공유합니다.

```tsx
"use client";

import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileValues } from "@/lib/schemas/profile";
import { updateProfileAction, type ActionState } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: ActionState = { ok: false, message: "" };

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: ProfileValues;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onBlur",
  });

  // 서버 검증 오류를 필드에 반영
  useEffect(() => {
    if (!state.fieldErrors) return;
    for (const [name, messages] of Object.entries(state.fieldErrors)) {
      form.setError(name as keyof ProfileValues, {
        type: "server",
        message: messages?.[0],
      });
    }
  }, [state.fieldErrors, form]);

  const onSubmit = form.handleSubmit((values) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values))
      formData.set(key, String(value ?? ""));
    // 액션은 반드시 transition 안에서 호출한다 (isPending 연동, React 경고 방지)
    startTransition(() => formAction(formData));
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Controller
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fullName">이름</FieldLabel>
              <Input
                {...field}
                id="fullName"
                autoComplete="name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </FieldGroup>
    </form>
  );
}
```

- RHF 연결은 `Controller`로 하고, 오류 표시는 위 `Field` 규칙(`data-invalid` + `aria-invalid`)을 그대로 따른다.
- Base UI 기반 컨트롤(`Select`, `Checkbox`, `Switch` 등)은 `field.onChange` / `field.value` 연결 방식이 컴포넌트마다 다르므로, 연결 전에 해당 컴포넌트의 생성된 코드를 읽는다.

## 고급 패턴

### 다단계 폼

단계별 스키마를 두고, `trigger()`로 현재 단계 필드만 검증한 뒤 다음 단계로 이동합니다. 최종 제출 시에는 모든 단계를 합친 스키마로 서버에서 다시 검증합니다.

```tsx
const steps = [
  { fields: ["name", "email"] as const },
  { fields: ["address", "city"] as const },
];

const next = async () => {
  const ok = await form.trigger(steps[step].fields);
  if (ok) setStep((s) => s + 1);
};
```

- 하나의 `useForm`(전체 스키마)을 유지하고 단계만 UI로 나눈다. 단계마다 `useForm`을 새로 만들면 값이 사라진다.
- 단계 상태를 URL(`?step=2`)에 두면 새로고침/뒤로가기에 강해진다. Cache Components에서는 `useSearchParams`를 쓰는 컴포넌트를 `Suspense`로 감싼다.

### 파일 업로드

파일은 Server Action에 `FormData`로 직접 보내지 말고, 외부 스토리지에 **클라이언트에서 직접 업로드**(서명된 URL 등)하는 방식을 우선 검토합니다. Server Action 본문 크기 기본 제한은 1MB이며 `serverActions.bodySizeLimit`로 조정합니다.

```ts
const fileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= 5 * 1024 * 1024, {
    error: "5MB 이하만 업로드할 수 있습니다",
  })
  .refine((f) => ["image/png", "image/jpeg", "image/webp"].includes(f.type), {
    error: "이미지 파일만 가능합니다",
  });
```

- `File` 검증은 브라우저와 서버 모두에서 한다. MIME 타입은 위조 가능하므로 서버(또는 스토리지 정책)에서도 제한한다.

### 자동 저장(Autosave)

`form.watch` 대신 `useWatch`로 필요한 값만 구독하고, 디바운스는 직접 작성하거나 `use-debounce`를 사용합니다.

```tsx
const values = useWatch({ control: form.control });
const debounced = useDebounce(values, 1000);

useEffect(() => {
  if (!form.formState.isDirty) return;
  startTransition(() => void saveDraftAction(debounced));
}, [debounced, form.formState.isDirty]);
```

- 자동 저장 Action도 일반 Action과 동일하게 서버 검증과 인증 확인을 한다 (초안용 느슨한 스키마를 `.partial()`로 만들 수 있다).
- Effect 안에서 구독/타이머를 만들면 cleanup을 작성한다 (`<Activity>`로 숨겨지면 Effect가 정리된다).

## 보안

- **서버 재검증과 인증**: 위 Action 예시의 1~2단계를 모든 변경 Action에 적용한다.
- **Rate limiting**: 모듈 전역 `Map` 기반 구현은 서버리스/다중 인스턴스에서 공유되지 않아 효과가 없다. Redis 등 외부 저장소 기반 제한을 쓴다. IP는 `x-forwarded-for` 첫 번째 값을 신뢰할 수 있는 프록시 환경에서만 사용한다.
- **민감 정보 반환 금지**: 오류 메시지에 계정 존재 여부, SQL 오류 등을 노출하지 않는다.
- **`NEXT_PUBLIC_` 변수**는 브라우저에 노출된다. 비밀 키는 서버 전용 환경 변수에 둔다 (`.env`는 커밋하지 않고 `.env.sample`에 키 이름만 기록).

## 안티패턴

```tsx
// 금지: 클라이언트 검증만 수행하고 서버 검증 없음
// 금지: 입력마다 전체 객체를 setState (RHF 사용 또는 비제어 입력)
// 금지: Action을 transition 밖에서 직접 호출 (startTransition 필수)
// 금지: 필요한 인증/권한 확인 생략
// 금지: try/catch 안에서 redirect() 호출
// 금지: 사용자 입력 오류를 throw로 처리 (반환값 사용)
// 금지: 서버 전용 모듈을 폼 컴포넌트에서 import
// 금지: 사용자 데이터를 'use cache'로 캐시
// 금지: 폼 필드를 div + space-y-* 로 배치 (FieldGroup + Field 사용)
```

## 체크리스트

**필수**

- [ ] 스키마를 `lib/schemas/`에서 클라이언트·서버가 공유
- [ ] Zod 4 API 사용 (`z.email()`, `{ error }`, `z.flattenError`)
- [ ] Server Action에서 `safeParse` + 필요한 인증 확인
- [ ] `FieldGroup` / `Field`, 오류는 `data-invalid` + `aria-invalid`
- [ ] 로딩(`isPending`)과 오류 메시지 UI
- [ ] 접근성: `<label>` 연결, `role="status"`/`role="alert"`

**권장**

- [ ] 변경 후 `updateTag` / `revalidateTag(tag, "max")`
- [ ] 파일 업로드는 직접 업로드 + 크기/형식 제한
- [ ] 다단계/자동 저장 폼의 Effect cleanup

**품질**

- [ ] `npm run lint`
- [ ] `npm run check`
- [ ] `npm run build`

## 참고

- 번들 문서: `node_modules/next/dist/docs/01-app/02-guides/forms.md`, `server-actions.md`, `data-security.md`
- shadcn 스킬: `.agents/skills/shadcn/rules/forms.md`
- [React Hook Form](https://react-hook-form.com/), [Zod 4](https://zod.dev/)

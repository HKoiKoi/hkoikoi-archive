"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { submitContactAction } from "../actions";
import { initialContactState } from "../state";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactAction,
    initialContactState,
  );
  const errors = state.fieldErrors ?? {};
  // 성공하면 key가 바뀌어 폼이 초기화되고, 오류면 되돌려받은 값이 유지된다.
  const values = state.values;

  return (
    <form action={formAction} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">이름</FieldLabel>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            defaultValue={values?.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name ? (
            <FieldError id="name-error">{errors.name[0]}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">이메일</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values?.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <FieldError id="email-error">{errors.email[0]}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor="message">내용</FieldLabel>
          <Textarea
            id="message"
            name="message"
            rows={6}
            defaultValue={values?.message}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message ? (
            <FieldError id="message-error">{errors.message[0]}</FieldError>
          ) : null}
        </Field>

        {/* Task 011에서 Cloudflare Turnstile 위젯으로 교체한다. */}
        <div
          aria-hidden
          className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground"
        >
          봇 방지(Turnstile) 위젯 자리
        </div>

        <div aria-live="polite" role="status">
          {state.status !== "idle" && state.message ? (
            <p
              className={cn(
                "rounded-lg border px-3 py-2 text-sm",
                state.status === "success"
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              {state.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : null}
          {isPending ? "보내는 중..." : "보내기"}
        </Button>
      </FieldGroup>
    </form>
  );
}

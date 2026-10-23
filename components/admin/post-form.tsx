"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";

import {
  deletePostAction,
  savePostAction,
  type AdminActionResult,
} from "@/app/admin/actions";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { MdxEditor } from "@/components/admin/mdx-editor";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  postDraftSchema,
  postPublishSchema,
  type PostFormValues,
} from "@/lib/schemas/post";

type SubmitMode = "draft" | "publish";

const emptyValues: PostFormValues = {
  title: "",
  slug: "",
  summary: "",
  tags: "",
  contentMdx: "",
};

interface PostFormProps {
  /** 수정 화면에서만 전달한다. 더미 단계에서는 slug 가 id 다. */
  id?: string;
  defaultValues?: PostFormValues;
}

export function PostForm({ id, defaultValues }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AdminActionResult | null>(null);
  // 클릭한 버튼에 따라 resolver 가 사용할 스키마를 고른다.
  const modeRef = useRef<SubmitMode>("draft");

  const form = useForm<PostFormValues>({
    resolver: ((values, context, options) =>
      zodResolver(
        modeRef.current === "publish" ? postPublishSchema : postDraftSchema,
      )(values, context, options)) as Resolver<PostFormValues>,
    defaultValues: defaultValues ?? emptyValues,
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // 이벤트 핸들러 안에서 호출해야 ref 를 렌더 중에 읽지 않는다.
    void form.handleSubmit((values) => {
      const mode = modeRef.current;
      startTransition(async () => {
        const res = await savePostAction(mode, values, id);
        setResult(res);
        if (res.fieldErrors) {
          for (const [name, messages] of Object.entries(res.fieldErrors)) {
            form.setError(name as keyof PostFormValues, {
              type: "server",
              message: messages?.[0],
            });
          }
        }
      });
    })(event);
  }

  function handleDelete() {
    if (!id) return;
    startTransition(async () => {
      await deletePostAction(id);
      router.push("/admin");
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-title">제목</FieldLabel>
              <Input
                {...field}
                id="post-title"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-slug">slug</FieldLabel>
              <Input
                {...field}
                id="post-slug"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                영문 소문자, 숫자, 하이픈(-)만 사용합니다.
              </FieldDescription>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="summary"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-summary">요약</FieldLabel>
              <Textarea
                {...field}
                id="post-summary"
                rows={3}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="tags"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-tags">태그</FieldLabel>
              <Input
                {...field}
                id="post-tags"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>쉼표(,)로 구분합니다.</FieldDescription>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="contentMdx"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-content">본문 (MDX)</FieldLabel>
              <MdxEditor
                id="post-content"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {result && (
          <p
            role={result.ok ? "status" : "alert"}
            className={
              result.ok
                ? "text-sm text-muted-foreground"
                : "text-sm text-destructive"
            }
          >
            {result.message}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              modeRef.current = "draft";
            }}
          >
            {isPending && (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            )}
            임시저장
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            onClick={() => {
              modeRef.current = "publish";
            }}
          >
            발행
          </Button>
          {id && (
            <DeleteConfirmDialog
              title="글을 삭제할까요?"
              description="삭제한 글은 복구할 수 없습니다."
              onConfirm={handleDelete}
            >
              <Button
                type="button"
                variant="destructive"
                disabled={isPending}
                className="ml-auto"
              >
                삭제
              </Button>
            </DeleteConfirmDialog>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}

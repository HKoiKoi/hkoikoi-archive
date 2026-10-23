"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  deleteProjectAction,
  saveProjectAction,
  type AdminActionResult,
} from "@/app/admin/actions";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { MdxEditor } from "@/components/admin/mdx-editor";
import { SlugInput } from "@/components/admin/slug-input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { projectSchema, type ProjectFormValues } from "@/lib/schemas/project";

const emptyValues: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  period: "",
  role: "",
  techStack: "",
  repository: "",
  demo: "",
  contentMdx: "",
  isPublished: false,
  isFeatured: false,
};

interface ProjectFormProps {
  /** 수정 화면에서만 전달한다. 더미 단계에서는 slug 가 id 다. */
  id?: string;
  defaultValues?: ProjectFormValues;
}

type TextFieldName = Exclude<
  keyof ProjectFormValues,
  "isPublished" | "isFeatured" | "contentMdx" | "summary"
>;

const textFields: {
  name: TextFieldName;
  label: string;
  description?: string;
  placeholder?: string;
}[] = [
  { name: "title", label: "제목" },
  { name: "period", label: "기간", placeholder: "예: 2023.03 - 2024.02" },
  { name: "role", label: "역할" },
  {
    name: "techStack",
    label: "기술 태그",
    description: "쉼표(,)로 구분합니다.",
  },
  { name: "repository", label: "저장소 링크", placeholder: "https://" },
  { name: "demo", label: "데모 링크", placeholder: "https://" },
];

export function ProjectForm({ id, defaultValues }: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AdminActionResult | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const res = await saveProjectAction(values, id);
      setResult(res);
      if (res.fieldErrors) {
        for (const [name, messages] of Object.entries(res.fieldErrors)) {
          form.setError(name as keyof ProjectFormValues, {
            type: "server",
            message: messages?.[0],
          });
        }
      }
    });
  });

  function handleDelete() {
    if (!id) return;
    startTransition(async () => {
      await deleteProjectAction(id);
      router.push("/admin");
    });
  }

  function renderText(name: TextFieldName) {
    const meta = textFields.find((f) => f.name === name)!;
    return (
      <Controller
        key={name}
        control={form.control}
        name={name}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`project-${name}`}>{meta.label}</FieldLabel>
            <Input
              {...field}
              id={`project-${name}`}
              placeholder={meta.placeholder}
              aria-invalid={fieldState.invalid}
            />
            {meta.description && (
              <FieldDescription>{meta.description}</FieldDescription>
            )}
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </Field>
        )}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        {renderText("title")}
        <Controller
          control={form.control}
          name="slug"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-slug">URL</FieldLabel>
              <SlugInput
                {...field}
                id="project-slug"
                basePath="/projects/"
                placeholder="new-project"
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
              <FieldLabel htmlFor="project-summary">요약</FieldLabel>
              <Textarea
                {...field}
                id="project-summary"
                rows={3}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        {renderText("period")}
        {renderText("role")}
        {renderText("techStack")}
        {renderText("repository")}
        {renderText("demo")}
        <Controller
          control={form.control}
          name="contentMdx"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="project-content">본문 (MDX)</FieldLabel>
              <MdxEditor
                id="project-content"
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

        {/* Base UI Switch: value/onChange 가 아니라 checked/onCheckedChange 로 연결한다. */}
        <Controller
          control={form.control}
          name="isPublished"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Switch
                id="project-published"
                name={field.name}
                ref={field.ref}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
              />
              <FieldLabel htmlFor="project-published">공개</FieldLabel>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="isFeatured"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Switch
                id="project-featured"
                name={field.name}
                ref={field.ref}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
              />
              <FieldLabel htmlFor="project-featured">대표 프로젝트</FieldLabel>
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
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            )}
            저장
          </Button>
          {id && (
            <DeleteConfirmDialog
              title="프로젝트를 삭제할까요?"
              description="삭제한 프로젝트는 복구할 수 없습니다."
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

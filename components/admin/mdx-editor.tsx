"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { previewMdxAction } from "@/app/admin/actions";
import type { MdxResult } from "@/components/mdx/mdx-content";
import { MdxProse } from "@/components/mdx/mdx-prose";
import { Textarea } from "@/components/ui/textarea";

const DEBOUNCE_MS = 500;

interface MdxEditorProps {
  /** Controller 의 field.value */
  value: string;
  /** Controller 의 field.onChange */
  onChange: (value: string) => void;
  onBlur?: () => void;
  id: string;
  name?: string;
  invalid?: boolean;
  "aria-describedby"?: string;
}

/** 글·프로젝트 편집이 공유하는 MDX 입력 + 미리보기 + 문법 오류 영역 (controlled). */
export function MdxEditor({
  value,
  onChange,
  onBlur,
  id,
  name,
  invalid,
  "aria-describedby": describedBy,
}: MdxEditorProps) {
  // 결과가 어떤 입력에 대한 것인지 함께 보관한다 (오래된 결과 구분용).
  const [preview, setPreview] = useState<{
    source: string;
    result: MdxResult;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (value.trim() === "") return;

    let cancelled = false;
    const timer = setTimeout(() => {
      startTransition(async () => {
        const result = await previewMdxAction(value);
        // 입력이 더 바뀌었거나 언마운트됐다면 이전 요청의 결과는 버린다.
        if (!cancelled) setPreview({ source: value, result });
      });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value]);

  const isEmpty = value.trim() === "";
  const current = !isEmpty && preview?.source === value ? preview.result : null;
  // 갱신 중에는 직전 결과를 유지해 깜박임을 줄인다.
  const shown = !isEmpty ? (current ?? preview?.result ?? null) : null;
  const error = shown && !shown.ok ? shown.error : null;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={invalid}
          aria-describedby={
            [describedBy, error ? errorId : undefined]
              .filter(Boolean)
              .join(" ") || undefined
          }
          spellCheck={false}
          className="min-h-80 font-mono text-sm"
        />
        <div
          role="region"
          aria-label="미리보기"
          aria-busy={isPending}
          className="relative min-h-80 overflow-auto rounded-lg border border-input p-4"
        >
          {isPending && (
            <Loader2
              aria-hidden="true"
              className="absolute top-3 right-3 animate-spin text-muted-foreground"
            />
          )}
          {isEmpty ? (
            <p className="text-sm text-muted-foreground">
              본문을 입력하면 여기에 미리보기가 표시됩니다.
            </p>
          ) : shown?.ok ? (
            <MdxProse>{shown.content}</MdxProse>
          ) : !shown ? (
            <p className="text-sm text-muted-foreground">
              미리보기를 준비하는 중...
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              문법 오류를 수정하면 미리보기가 갱신됩니다.
            </p>
          )}
        </div>
      </div>
      {error && (
        <div
          id={errorId}
          role="alert"
          className="rounded-lg border border-destructive/40 p-3 text-sm"
        >
          <p className="font-medium text-destructive">MDX 문법 오류</p>
          <p className="mt-1 text-muted-foreground">
            {error.line
              ? `${error.line}행${error.column ? ` ${error.column}열` : ""}: `
              : ""}
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
}

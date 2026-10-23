"use client";

import { Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const MAX_SIZE = 5 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))}KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function validate(file: File): string | null {
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "PDF 파일만 업로드할 수 있습니다.";
  if (file.size > MAX_SIZE) return "파일 크기는 5MB 이하여야 합니다.";
  return null;
}

// 이력서 PDF 업로드 카드 (선택·검증만 동작하는 목)
export function ResumeUploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>이력서 PDF</CardTitle>
        <CardDescription>현재 등록된 이력서가 없습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="resume-file">PDF 파일 선택</FieldLabel>
            <Input
              id="resume-file"
              type="file"
              accept="application/pdf"
              aria-invalid={error ? true : undefined}
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null;
                if (!selected) {
                  setFile(null);
                  setError(null);
                  return;
                }
                const message = validate(selected);
                setError(message);
                setFile(message ? null : selected);
              }}
            />
            {error ? (
              <FieldError>{error}</FieldError>
            ) : (
              <FieldDescription>
                {file
                  ? `${file.name} (${formatFileSize(file.size)})`
                  : "PDF만, 최대 5MB까지 업로드할 수 있습니다."}
              </FieldDescription>
            )}
          </Field>
          {/* TODO(Phase 3): 실제 업로드(Server Action + 저장소)로 교체한다. */}
          <Field orientation="horizontal">
            <Button type="button" disabled={!file}>
              <Upload data-icon="inline-start" />
              업로드
            </Button>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

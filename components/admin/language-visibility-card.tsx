"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

interface LanguageVisibilityCardProps {
  defaultChecked: boolean;
}

// 어학 점수 공개 토글 카드 (상태만 바뀌는 목)
export function LanguageVisibilityCard({
  defaultChecked,
}: LanguageVisibilityCardProps) {
  const [checked, setChecked] = useState(defaultChecked);
  const [changed, setChanged] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>어학 점수 공개</CardTitle>
        <CardDescription>
          자격 페이지의 어학 점수 노출 여부를 정합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* TODO(Phase 3): 설정 저장 Server Action과 settings 캐시 무효화를 연결한다. */}
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="show-language-scores">
              어학 점수 공개
            </FieldLabel>
            <FieldDescription>
              끄면 자격 페이지에서 어학 점수가 숨겨집니다.
            </FieldDescription>
          </FieldContent>
          <Switch
            id="show-language-scores"
            checked={checked}
            onCheckedChange={(value) => {
              setChecked(value);
              setChanged(true);
            }}
          />
        </Field>
        <p role="status" className="min-h-5 text-sm text-muted-foreground">
          {changed
            ? checked
              ? "어학 점수를 공개로 변경했습니다. (저장은 아직 연결되지 않았습니다)"
              : "어학 점수를 비공개로 변경했습니다. (저장은 아직 연결되지 않았습니다)"
            : ""}
        </p>
      </CardContent>
    </Card>
  );
}

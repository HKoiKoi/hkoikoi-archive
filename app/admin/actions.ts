"use server";

import { z } from "zod";

import { compileMdx, type MdxResult } from "@/components/mdx/mdx-content";
import {
  postDraftSchema,
  postPublishSchema,
  type PostFormValues,
} from "@/lib/schemas/post";
import { projectSchema, type ProjectFormValues } from "@/lib/schemas/project";

/** 미리보기 입력 상한(문자 수). 공개 엔드포인트이므로 과도한 컴파일을 막는다. */
const MAX_PREVIEW_LENGTH = 100_000;

export type AdminActionResult = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

/** MDX 미리보기. 컴파일 오류는 throw 하지 않고 값으로 반환한다. */
export async function previewMdxAction(source: string): Promise<MdxResult> {
  // TODO(Task 016): 관리자 세션을 확인한다. Server Action은 공개 HTTP 엔드포인트다.
  if (typeof source !== "string" || source.length > MAX_PREVIEW_LENGTH) {
    return {
      ok: false,
      error: { message: "본문이 너무 길어 미리볼 수 없습니다." },
    };
  }
  return compileMdx(source, { preview: true });
}

function invalid(error: z.ZodError): AdminActionResult {
  return {
    ok: false,
    message: "입력값을 확인해 주세요.",
    fieldErrors: z.flattenError(error).fieldErrors,
  };
}

async function mockDelay() {
  await new Promise((resolve) => setTimeout(resolve, 400));
}

/** 목 액션. 저장 로직은 Phase 3(Task 018)에서 DB 저장으로 교체한다. */
export async function savePostAction(
  mode: "draft" | "publish",
  values: PostFormValues,
  id?: string,
): Promise<AdminActionResult> {
  // TODO(Task 016): 관리자 세션 확인
  const schema = mode === "publish" ? postPublishSchema : postDraftSchema;
  const parsed = schema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);

  await mockDelay();
  // TODO(Task 018): DB 저장 후 updateTag 로 캐시를 무효화한다. id 는 수정 대상 식별용.
  void id;
  return {
    ok: true,
    message:
      mode === "publish"
        ? "발행했습니다. (목 응답, 실제로 저장되지 않았습니다)"
        : "임시저장했습니다. (목 응답, 실제로 저장되지 않았습니다)",
  };
}

export async function deletePostAction(id: string): Promise<AdminActionResult> {
  // TODO(Task 016): 관리자 세션 확인
  await mockDelay();
  // TODO(Task 018): DB 삭제
  void id;
  return { ok: true, message: "삭제했습니다. (목 응답)" };
}

export async function saveProjectAction(
  values: ProjectFormValues,
  id?: string,
): Promise<AdminActionResult> {
  // TODO(Task 016): 관리자 세션 확인
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error);

  await mockDelay();
  // TODO(Task 020): DB 저장 후 캐시 무효화
  void id;
  return {
    ok: true,
    message: "저장했습니다. (목 응답, 실제로 저장되지 않았습니다)",
  };
}

export async function deleteProjectAction(
  id: string,
): Promise<AdminActionResult> {
  // TODO(Task 016): 관리자 세션 확인
  await mockDelay();
  // TODO(Task 020): DB 삭제
  void id;
  return { ok: true, message: "삭제했습니다. (목 응답)" };
}

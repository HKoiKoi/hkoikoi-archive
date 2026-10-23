import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .min(1, { error: "URL을 입력해 주세요." })
  .max(80, { error: "URL은 80자 이하로 입력해 주세요." })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error: "URL은 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.",
  });

const baseFields = {
  title: z
    .string()
    .trim()
    .min(1, { error: "제목을 입력해 주세요." })
    .max(120, { error: "제목은 120자 이하로 입력해 주세요." }),
  slug: slugSchema,
  summary: z
    .string()
    .trim()
    .max(300, { error: "요약은 300자 이하로 입력해 주세요." }),
  /** 쉼표로 구분한 입력. 폼에서는 문자열로 다룬다. */
  tags: z.string().trim(),
  contentMdx: z.string(),
};

/** 임시저장: 제목·slug만 있으면 된다. */
export const postDraftSchema = z.object(baseFields);

/** 발행: 요약·본문까지 필수 */
export const postPublishSchema = z.object({
  ...baseFields,
  summary: baseFields.summary.min(1, { error: "요약을 입력해 주세요." }),
  contentMdx: z.string().trim().min(1, { error: "본문을 입력해 주세요." }),
});

export type PostFormValues = z.infer<typeof postDraftSchema>;

export function parseTags(input: string): string[] {
  return [
    ...new Set(
      input
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ];
}

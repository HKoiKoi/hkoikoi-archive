import { z } from "zod";

import { slugSchema } from "@/lib/schemas/post";

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || z.url().safeParse(v).success, {
    error: "올바른 URL 형식이 아닙니다.",
  });

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "제목을 입력해 주세요." })
    .max(120, { error: "제목은 120자 이하로 입력해 주세요." }),
  slug: slugSchema,
  summary: z
    .string()
    .trim()
    .min(1, { error: "요약을 입력해 주세요." })
    .max(300, { error: "요약은 300자 이하로 입력해 주세요." }),
  period: z.string().trim().max(40),
  role: z.string().trim().max(80),
  /** 쉼표로 구분한 입력 */
  techStack: z.string().trim(),
  repository: optionalUrl,
  demo: optionalUrl,
  contentMdx: z.string().trim().min(1, { error: "본문을 입력해 주세요." }),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

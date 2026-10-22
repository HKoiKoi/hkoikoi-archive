import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "이름을 입력해 주세요." })
    .max(50, { error: "이름은 50자 이하로 입력해 주세요." }),
  email: z.email({ error: "올바른 이메일 형식이 아닙니다." }),
  message: z
    .string()
    .trim()
    .min(10, { error: "내용은 10자 이상 입력해 주세요." })
    .max(2000, { error: "내용은 2000자 이하로 입력해 주세요." }),
});

export type ContactInput = z.infer<typeof contactSchema>;

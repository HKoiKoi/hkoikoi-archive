"use server";

import { z } from "zod";

import { contactSchema } from "@/lib/schemas/contact";

import type { ContactActionState, ContactFormValues } from "./state";

/**
 * 목 액션. Task 011에서 Turnstile 검증·DB 저장·메일 발송으로 교체한다.
 * 내용에 `[mock:fail]`이 있으면 서버 오류를 흉내 낸다.
 */
export async function submitContactAction(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const values: ContactFormValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "입력값을 확인해 주세요.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  if (parsed.data.message.includes("[mock:fail]")) {
    return {
      status: "error",
      message: "문의를 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      values,
    };
  }

  return {
    status: "success",
    message: "문의가 전달되었습니다. 확인 후 회신드리겠습니다.",
  };
}

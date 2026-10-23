import { evaluate } from "next-mdx-remote-client/rsc";
import type { ReactElement } from "react";

import { mdxComponents } from "@/components/mdx/mdx-components";
import { remarkRestrictMdx } from "@/lib/mdx/remark-restrict-mdx";
import { rehypeShiki } from "@/lib/mdx/shiki";

/** 컴파일 결과: 던지지 않고 성공/오류를 값으로 반환 (Task 010 미리보기 재사용) */
export type MdxResult =
  | { ok: true; content: ReactElement }
  | { ok: false; error: { message: string; line?: number; column?: number } };

/** MDX 문자열을 서버에서 컴파일·평가한다. 구문 오류는 throw 하지 않고 오류 객체로 반환한다. */
export async function compileMdx(source: string): Promise<MdxResult> {
  try {
    const { content, error } = await evaluate({
      source,
      components: mdxComponents,
      options: {
        disableImports: true,
        disableExports: true,
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkRestrictMdx],
          rehypePlugins: [rehypeShiki],
        },
      },
    });
    if (error) return { ok: false, error: toErrorInfo(error) };
    return { ok: true, content };
  } catch (e) {
    return { ok: false, error: toErrorInfo(e) };
  }
}

function toErrorInfo(e: unknown) {
  const err = e as {
    message?: string;
    line?: number | null;
    column?: number | null;
    place?: { start?: { line?: number; column?: number } } | null;
  };
  return {
    message: err?.message ?? "MDX를 처리하지 못했습니다.",
    line: err?.line ?? err?.place?.start?.line ?? undefined,
    column: err?.column ?? err?.place?.start?.column ?? undefined,
  };
}

/**
 * MDX 본문 렌더러 (서버 컴포넌트). 오류 시 본문 영역만 안내를 표시한다.
 * Shiki 가 내부에서 Date.now() 를 쓰므로 프리렌더 중 직접 호출하면 빌드가 실패한다.
 * `use cache` 로 소스 문자열 단위 결과를 캐시해 이를 피한다.
 * (미리보기처럼 캐시가 필요 없는 곳은 compileMdx 를 직접 호출한다.)
 */
export async function MdxContent({ source }: { source: string }) {
  "use cache";
  const result = await compileMdx(source);

  if (!result.ok) {
    const { message, line, column } = result.error;
    return (
      <div role="alert" className="rounded-lg border border-destructive/40 p-4">
        <p className="font-medium text-destructive">
          본문을 표시할 수 없습니다.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {line ? `${line}행${column ? ` ${column}열` : ""}: ` : ""}
          {message}
        </p>
      </div>
    );
  }

  return result.content;
}

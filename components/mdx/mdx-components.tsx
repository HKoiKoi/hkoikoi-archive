import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

import { CodeBlock } from "@/components/mdx/code-block";

/**
 * MDX 본문에서 쓸 수 있는 컴포넌트 맵 (한 파일에 고정).
 * 키는 lib/mdx/allowed.ts 의 ALLOWED_MDX_COMPONENTS 와 일치해야 한다.
 */

/** 허용되지 않은 컴포넌트를 만났을 때 페이지 전체 대신 이 자리만 오류로 표시 */
function UnsupportedComponent({ name }: { name?: string }) {
  return (
    <span
      role="note"
      className="rounded border border-destructive/40 px-1.5 py-0.5 text-sm text-destructive"
    >
      허용되지 않은 컴포넌트입니다{name ? `: <${name}>` : ""}
    </span>
  );
}

function Callout({ children }: { children?: ReactNode }) {
  return (
    <aside role="note" className="my-4 rounded-lg border bg-muted/50 p-4">
      {children}
    </aside>
  );
}

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * 내부 전용: remark 플러그인이 `<span style="color: #hex">` 를 이 컴포넌트로 바꾼다.
 * 작성자가 직접 쓸 수 없도록 lib/mdx/allowed.ts 의 허용 목록에는 넣지 않는다.
 */
function ColorText({
  color,
  children,
}: {
  color?: string;
  children?: ReactNode;
}) {
  const safeColor = color && HEX_COLOR.test(color) ? color : undefined;
  return (
    <span style={safeColor ? { color: safeColor } : undefined}>{children}</span>
  );
}

const baseComponents: MDXComponents = {
  ColorText,
  Callout,
  UnsupportedComponent,
};

export const mdxComponents: MDXComponents = {
  ...baseComponents,
  pre: CodeBlock,
};

/**
 * 관리자 미리보기용: 클라이언트 컴포넌트(코드 복사 버튼)를 뺀 맵.
 * Server Action 응답에는 해당 페이지 번들에 없는 클라이언트 컴포넌트를 실을 수 없다.
 */
export const mdxPreviewComponents: MDXComponents = baseComponents;

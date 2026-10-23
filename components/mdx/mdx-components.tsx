import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

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

export const mdxComponents: MDXComponents = {
  Callout,
  UnsupportedComponent,
};

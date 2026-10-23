import type { ComponentProps } from "react";

import { CopyButton } from "@/components/mdx/copy-button";

/** MDX 코드 블록(`pre`). 복사 버튼만 클라이언트 컴포넌트다. */
export function CodeBlock(props: ComponentProps<"pre">) {
  return (
    <div data-code-block className="group/code relative">
      <pre {...props} />
      <CopyButton />
    </div>
  );
}

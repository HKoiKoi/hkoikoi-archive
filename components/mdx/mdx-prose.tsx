import "katex/dist/katex.min.css";

import { cn } from "@/lib/utils";

interface MdxProseProps {
  children: React.ReactNode;
  className?: string;
}

// MDX 본문 래퍼. 스타일은 app/globals.css의 .prose-mdx 가 담당한다.
// 프로젝트 상세(F004)와 글 상세(F007)가 공유한다.
export function MdxProse({ children, className }: MdxProseProps) {
  return <div className={cn("prose-mdx", className)}>{children}</div>;
}

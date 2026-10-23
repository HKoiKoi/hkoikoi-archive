import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: string[];
  /** 현재 선택된 태그. 없으면 "전체"가 선택된 상태 */
  activeTag?: string;
  className?: string;
}

// 태그 필터: 링크로 ?tag= 를 바꾸는 서버 컴포넌트
export function TagFilter({ tags, activeTag, className }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <nav aria-label="태그 필터" className={className}>
      <ul className="flex flex-wrap gap-1.5">
        <li>
          <TagLink href="/blog" active={!activeTag}>
            전체
          </TagLink>
        </li>
        {tags.map((tag) => (
          <li key={tag}>
            <TagLink
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              active={tag === activeTag}
            >
              {tag}
            </TagLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TagLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Badge
      variant={active ? "default" : "secondary"}
      render={<Link href={href} aria-current={active ? "true" : undefined} />}
      className={cn("h-7 px-3 text-xs", !active && "hover:bg-secondary/70")}
    >
      {children}
    </Badge>
  );
}

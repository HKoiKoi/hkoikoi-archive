import { TechBadgeList } from "@/components/profile/tech-badge";
import { formatDate } from "@/lib/format";
import type { PostDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PostDetailHeaderProps {
  post: Pick<PostDetail, "title" | "publishedAt" | "tags">;
  className?: string;
}

// 글 상세 상단: 제목·발행일·태그 (정적 마크업)
export function PostDetailHeader({ post, className }: PostDetailHeaderProps) {
  const { title, publishedAt, tags } = post;

  return (
    <header className={cn("space-y-4 border-b pb-8", className)}>
      <time dateTime={publishedAt} className="text-sm text-muted-foreground">
        {formatDate(publishedAt)}
      </time>
      <h1 className="font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl">
        {title}
      </h1>
      <TechBadgeList items={tags} />
    </header>
  );
}

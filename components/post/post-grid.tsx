import Link from "next/link";

import { PostCard } from "@/components/post/post-card";
import type { PostCard as PostCardData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PostGridProps {
  posts: PostCardData[];
  /** 태그 필터가 적용된 상태인지. 빈 상태 안내 문구가 달라진다. */
  tag?: string;
  className?: string;
}

// 글 카드 그리드: 1열 → 768px 2열. 결과가 없으면 빈 상태와 전체 보기 링크를 보여준다.
export function PostGrid({ posts, tag, className }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div
        className={cn(
          "space-y-3 rounded-xl border border-dashed py-16 text-center",
          className,
        )}
      >
        <p className="text-sm text-muted-foreground">
          {tag
            ? `'${tag}' 태그의 글이 없습니다.`
            : "발행된 글이 아직 없습니다."}
        </p>
        {tag ? (
          <Link
            href="/blog"
            className="inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            전체 글 보기
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <ul
      className={cn("grid gap-4 md:grid-cols-2", className)}
      aria-label="글 목록"
    >
      {posts.map((post) => (
        <li key={post.slug} className="min-w-0">
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

import Link from "next/link";

import { TechBadgeList } from "@/components/profile/tech-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { PostCard as PostCardData } from "@/lib/types";

export function PostCard({ post }: { post: PostCardData }) {
  const { slug, title, summary, tags, publishedAt } = post;

  return (
    <Link
      href={`/blog/${slug}`}
      className="block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-colors hover:ring-foreground/25">
        <CardHeader>
          <time
            dateTime={publishedAt}
            className="text-xs text-muted-foreground"
          >
            {formatDate(publishedAt)}
          </time>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-3">{summary}</CardDescription>
        </CardHeader>
        {tags.length > 0 ? (
          <CardContent>
            <TechBadgeList items={tags} />
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}

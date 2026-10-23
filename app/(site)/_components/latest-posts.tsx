import Link from "next/link";

import { SectionHeading } from "@/components/layout/section";
import { PostCard } from "@/components/post/post-card";
import { getLatestPosts } from "@/lib/queries/posts";
import { features } from "@/lib/site-config";

/** features.blog가 꺼져 있으면 렌더링하지 않는다. */
export async function LatestPosts() {
  if (!features.blog) return null;

  const posts = await getLatestPosts(3);
  if (posts.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <SectionHeading title="최신 글" />
      <ul className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      <Link
        href="/blog"
        className="mt-6 inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        글 전체 보기
      </Link>
    </section>
  );
}

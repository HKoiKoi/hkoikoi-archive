import { Suspense } from "react";

import { SectionHeading } from "@/components/layout/section";
import { PostGrid } from "@/components/post/post-grid";
import { TagFilter } from "@/components/post/tag-filter";
import { getPosts, getPostTags } from "@/lib/queries/posts";

async function PostList({
  searchParams,
}: Pick<PageProps<"/blog">, "searchParams">) {
  const { tag: rawTag } = await searchParams;
  const tag = Array.isArray(rawTag) ? rawTag[0] : rawTag;

  const [posts, tags] = await Promise.all([getPosts(tag), getPostTags()]);

  return (
    <div className="space-y-6">
      <TagFilter tags={tags} activeTag={tag} />
      <PostGrid posts={posts} tag={tag} />
    </div>
  );
}

export default function Page({ searchParams }: PageProps<"/blog">) {
  return (
    <section className="py-6 md:py-10">
      <SectionHeading as="h1" title="블로그" />
      <Suspense fallback={<p>불러오는 중...</p>}>
        <PostList searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

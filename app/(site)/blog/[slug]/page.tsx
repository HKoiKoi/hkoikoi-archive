import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MdxContent } from "@/components/mdx/mdx-content";
import { MdxProse } from "@/components/mdx/mdx-prose";
import { PostDetailFooter } from "@/components/post/post-detail-footer";
import { PostDetailHeader } from "@/components/post/post-detail-header";
import { getPostBySlug, getPostSlugs } from "@/lib/queries/posts";

/** 발행 글 slug 를 빌드 시점에 미리 생성 (최소 1개 이상 반환) */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function PostDetail({
  params,
}: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // 임시저장·없는 slug 는 동일하게 404
  if (!post) notFound();

  return (
    <div className="py-6 md:py-10">
      <article className="space-y-10">
        <PostDetailHeader post={post} />
        <MdxProse>
          <MdxContent source={post.contentMdx} />
        </MdxProse>
        <PostDetailFooter />
      </article>
    </div>
  );
}

export default function Page({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<p>불러오는 중...</p>}>
      <PostDetail params={params} />
    </Suspense>
  );
}

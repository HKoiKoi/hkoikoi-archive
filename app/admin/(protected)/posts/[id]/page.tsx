import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PostForm } from "@/components/admin/post-form";
import { Button } from "@/components/ui/button";
import { getAdminPost } from "@/lib/queries/admin";

async function PostEditor({
  params,
}: Pick<PageProps<"/admin/posts/[id]">, "params">) {
  const { id } = await params;
  const post = await getAdminPost(id);
  if (!post) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">글 수정</h1>
        <Button
          variant="outline"
          render={<Link href="/admin" />}
          nativeButton={false}
        >
          <ArrowLeft data-icon="inline-start" />
          목록으로
        </Button>
      </div>
      <PostForm
        id={id}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          tags: post.tags.join(", "),
          contentMdx: post.contentMdx,
        }}
      />
    </div>
  );
}

export default function Page({ params }: PageProps<"/admin/posts/[id]">) {
  return (
    <Suspense fallback={<p>불러오는 중...</p>}>
      <PostEditor params={params} />
    </Suspense>
  );
}

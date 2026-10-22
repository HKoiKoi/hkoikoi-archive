import { Suspense } from "react";

async function PostEditor({
  params,
}: Pick<PageProps<"/admin/posts/[id]">, "params">) {
  const { id } = await params;

  return <h1 data-id={id}>글 수정</h1>;
}

export default function Page({ params }: PageProps<"/admin/posts/[id]">) {
  return (
    <Suspense>
      <PostEditor params={params} />
    </Suspense>
  );
}

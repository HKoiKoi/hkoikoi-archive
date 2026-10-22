import { Suspense } from "react";

async function PostDetail({
  params,
}: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;

  return <h1 data-slug={slug}>블로그 글</h1>;
}

export default function Page({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense>
      <PostDetail params={params} />
    </Suspense>
  );
}

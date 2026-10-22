import { Suspense } from "react";

async function ProjectDetail({
  params,
}: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;

  return <h1 data-slug={slug}>프로젝트 상세</h1>;
}

export default function Page({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

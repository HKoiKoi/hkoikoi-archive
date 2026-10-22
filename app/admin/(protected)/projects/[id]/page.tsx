import { Suspense } from "react";

async function ProjectEditor({
  params,
}: Pick<PageProps<"/admin/projects/[id]">, "params">) {
  const { id } = await params;

  return <h1 data-id={id}>프로젝트 수정</h1>;
}

export default function Page({ params }: PageProps<"/admin/projects/[id]">) {
  return (
    <Suspense>
      <ProjectEditor params={params} />
    </Suspense>
  );
}

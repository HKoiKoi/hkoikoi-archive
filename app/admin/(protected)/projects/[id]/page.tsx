import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProjectForm } from "@/components/admin/project-form";
import { Button } from "@/components/ui/button";
import { getAdminProject } from "@/lib/queries/admin";

async function ProjectEditor({
  params,
}: Pick<PageProps<"/admin/projects/[id]">, "params">) {
  const { id } = await params;
  const project = await getAdminProject(id);
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">프로젝트 수정</h1>
        <Button
          variant="outline"
          render={<Link href="/admin" />}
          nativeButton={false}
        >
          <ArrowLeft data-icon="inline-start" />
          목록으로
        </Button>
      </div>
      <ProjectForm
        id={id}
        defaultValues={{
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          period: project.period ?? "",
          role: project.role ?? "",
          techStack: project.techStack.join(", "),
          repository: project.links.repository ?? "",
          demo: project.links.demo ?? "",
          contentMdx: project.contentMdx,
          isPublished: project.isPublished,
          isFeatured: project.isFeatured,
        }}
      />
    </div>
  );
}

export default function Page({ params }: PageProps<"/admin/projects/[id]">) {
  return (
    <Suspense fallback={<p>불러오는 중...</p>}>
      <ProjectEditor params={params} />
    </Suspense>
  );
}

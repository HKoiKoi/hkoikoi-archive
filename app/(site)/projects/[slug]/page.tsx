import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MdxContent } from "@/components/mdx/mdx-content";
import { MdxProse } from "@/components/mdx/mdx-prose";
import { ProjectDetailFooter } from "@/components/project/project-detail-footer";
import { ProjectDetailHeader } from "@/components/project/project-detail-header";
import { getProjectBySlug, getProjectSlugs } from "@/lib/queries/projects";

/** 공개 프로젝트 slug 를 빌드 시점에 미리 생성 (최소 1개 이상 반환) */
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function ProjectDetail({
  params,
}: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // 비공개·없는 slug 는 동일하게 404
  if (!project) notFound();

  return (
    <div className="py-6 md:py-10">
      <article className="space-y-10">
        <ProjectDetailHeader project={project} />
        <MdxProse>
          <MdxContent source={project.contentMdx} />
        </MdxProse>
        <ProjectDetailFooter />
      </article>
    </div>
  );
}

export default function Page({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<p>불러오는 중...</p>}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

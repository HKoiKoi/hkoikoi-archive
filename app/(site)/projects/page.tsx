import { Suspense } from "react";

import { SectionHeading } from "@/components/layout/section";
import { ProjectGrid } from "@/components/project/project-grid";
import { getProjects } from "@/lib/queries/projects";

async function ProjectList() {
  const projects = await getProjects(); // 대표 프로젝트 우선
  return <ProjectGrid projects={projects} />;
}

export default function Page() {
  return (
    <section className="py-6 md:py-10">
      <SectionHeading as="h1" title="프로젝트" />
      <Suspense fallback={<p>불러오는 중...</p>}>
        <ProjectList />
      </Suspense>
    </section>
  );
}

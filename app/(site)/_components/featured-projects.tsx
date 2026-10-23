import Link from "next/link";

import { SectionHeading } from "@/components/layout/section";
import { ProjectCard } from "@/components/project/project-card";
import { getFeaturedProjects } from "@/lib/queries/projects";

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();
  if (projects.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <SectionHeading title="대표 프로젝트" />
      <ul className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      <Link
        href="/projects"
        className="mt-6 inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        프로젝트 전체 보기
      </Link>
    </section>
  );
}

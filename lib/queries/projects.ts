import { dummyProjects, type DummyProject } from "@/lib/dummy/projects";
import type { ProjectCard, ProjectDetail } from "@/lib/types";

function toCard({
  slug,
  title,
  summary,
  period,
  techStack,
  isFeatured,
}: DummyProject): ProjectCard {
  return { slug, title, summary, period, techStack, isFeatured };
}

function toDetail(project: DummyProject): ProjectDetail {
  return {
    ...toCard(project),
    role: project.role,
    links: project.links,
    contentMdx: project.contentMdx,
  };
}

const published = () => dummyProjects.filter((p) => p.isPublished);

/** 공개 프로젝트, 대표 우선 */
export async function getProjects(): Promise<ProjectCard[]> {
  return published()
    .map(toCard)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
}

export async function getFeaturedProjects(): Promise<ProjectCard[]> {
  return published()
    .filter((p) => p.isFeatured)
    .map(toCard);
}

/** 비공개·없는 slug는 null → 호출 쪽에서 notFound() */
export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  const project = published().find((p) => p.slug === slug);
  return project ? toDetail(project) : null;
}

export async function getProjectSlugs(): Promise<string[]> {
  return published().map((p) => p.slug);
}

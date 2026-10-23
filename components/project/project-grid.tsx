import { ProjectCard } from "@/components/project/project-card";
import type { ProjectCard as ProjectCardData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects: ProjectCardData[];
  className?: string;
}

// 프로젝트 카드 그리드: 360px 1열 → 640px 2열 → 1024px 3열
export function ProjectGrid({ projects, className }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <p
        className={cn(
          "rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        공개된 프로젝트가 아직 없습니다.
      </p>
    );
  }

  return (
    <ul
      className={cn("grid gap-4 md:grid-cols-2", className)}
      aria-label="프로젝트 목록"
    >
      {projects.map((project) => (
        <li key={project.slug} className="min-w-0">
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}

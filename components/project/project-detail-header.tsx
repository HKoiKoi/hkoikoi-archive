import { ExternalLink, FolderGit2 } from "lucide-react";

import { TechBadgeList } from "@/components/profile/tech-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectDetailHeaderProps {
  project: Pick<
    ProjectDetail,
    | "title"
    | "summary"
    | "period"
    | "role"
    | "techStack"
    | "links"
    | "isFeatured"
  >;
  className?: string;
}

// 프로젝트 상세 상단: 제목·요약·기간/역할·기술 스택·외부 링크 (정적 마크업)
export function ProjectDetailHeader({
  project,
  className,
}: ProjectDetailHeaderProps) {
  const { title, summary, period, role, techStack, links, isFeatured } =
    project;
  const meta = [
    period ? { label: "기간", value: period } : null,
    role ? { label: "역할", value: role } : null,
  ].filter((item) => item !== null);
  const hasLinks = Boolean(links.repository || links.demo);

  return (
    <header className={cn("space-y-6 border-b pb-8", className)}>
      <div className="space-y-3">
        {isFeatured ? <Badge>대표 프로젝트</Badge> : null}
        <h1 className="font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base text-pretty text-muted-foreground md:text-lg">
          {summary}
        </p>
      </div>

      {meta.length > 0 ? (
        <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[repeat(auto-fit,minmax(10rem,max-content))]">
          {meta.map(({ label, value }) => (
            <div key={label} className="space-y-0.5">
              <dt className="text-xs font-medium text-muted-foreground">
                {label}
              </dt>
              <dd className="font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {techStack.length > 0 ? (
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-muted-foreground">
            기술 스택
          </h2>
          <TechBadgeList items={techStack} />
        </div>
      ) : null}

      {hasLinks ? (
        <div className="flex flex-wrap gap-2">
          {links.repository ? (
            <Button
              variant="outline"
              render={
                <a
                  href={links.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
            >
              <FolderGit2 data-icon="inline-start" />
              저장소
              <span className="sr-only"> (새 탭에서 열림)</span>
            </Button>
          ) : null}
          {links.demo ? (
            <Button
              variant="outline"
              render={
                <a
                  href={links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              nativeButton={false}
            >
              <ExternalLink data-icon="inline-start" />
              배포 사이트
              <span className="sr-only"> (새 탭에서 열림)</span>
            </Button>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

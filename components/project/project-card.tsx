import Link from "next/link";

import { TechBadgeList } from "@/components/profile/tech-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProjectCard as ProjectCardData } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const { slug, title, summary, period, techStack, isFeatured } = project;

  return (
    <Link
      href={`/projects/${slug}`}
      className="block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-colors hover:ring-foreground/25">
        <CardHeader>
          <div className="flex items-center gap-2">
            {isFeatured ? <Badge>대표</Badge> : null}
            {period ? (
              <span className="text-xs text-muted-foreground">{period}</span>
            ) : null}
          </div>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-3">{summary}</CardDescription>
        </CardHeader>
        {techStack.length > 0 ? (
          <CardContent>
            <TechBadgeList items={techStack} />
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}

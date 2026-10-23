import { Cloud, Code, Server, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/layout/section";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FocusArea } from "@/lib/types";

const icons: Record<string, LucideIcon> = {
  code: Code,
  cloud: Cloud,
  server: Server,
};

export function FocusAreas({ areas }: { areas: FocusArea[] }) {
  if (areas.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <SectionHeading title="담당 영역" />
      <ul className="grid gap-4 md:grid-cols-3">
        {areas.map(({ title, description, icon }) => {
          const Icon = icons[icon] ?? Code;
          return (
            <li key={title}>
              <Card className="h-full">
                <CardHeader>
                  <Icon aria-hidden className="mb-2 size-6 text-primary" />
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

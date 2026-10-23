import { Cloud, Code, Database, type LucideIcon } from "lucide-react";

import { TechBadge } from "@/components/profile/tech-badge";
import type { SkillGroup } from "@/lib/types";

const icons: Record<string, LucideIcon> = {
  code: Code,
  database: Database,
  cloud: Cloud,
};

export function SkillsStrip({ skills }: { skills: SkillGroup[] }) {
  if (skills.length === 0) return null;

  return (
    <section aria-label="기술 스택" className="border-y border-border py-8">
      <ul className="grid gap-4 md:grid-cols-3">
        {skills.map(({ category, icon, items }, groupIndex) => {
          const Icon = icons[icon] ?? Code;
          return (
            <li
              key={category}
              className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <h3 className="mb-3 flex items-center gap-2 font-heading font-medium">
                <Icon aria-hidden className="size-5 text-primary" />
                {category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                  <li
                    key={item}
                    style={
                      {
                        "--shine-delay": `${(groupIndex * 3 + index) * 0.35}s`,
                      } as React.CSSProperties
                    }
                  >
                    <TechBadge className="badge-shine h-7 border-primary/30 bg-primary/10 font-mono text-sm font-medium text-primary">
                      {item}
                    </TechBadge>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
